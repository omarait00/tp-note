"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateAgentTagsActionRunner = void 0;
exports.updateTagsBatch = updateTagsBatch;
var _uuid = _interopRequireDefault(require("uuid"));
var _lodash = require("lodash");
var _constants = require("../../constants");
var _app_context = require("../app_context");
var _agent_policy = require("../agent_policy");
var _constants2 = require("../../../common/constants");
var _action_runner = require("./action_runner");
var _bulk_actions_resolver = require("./bulk_actions_resolver");
var _filter_hosted_agents = require("./filter_hosted_agents");
var _actions = require("./actions");
var _crud = require("./crud");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class UpdateAgentTagsActionRunner extends _action_runner.ActionRunner {
  async processAgents(agents) {
    var _this$actionParams, _this$actionParams2;
    return await updateTagsBatch(this.soClient, this.esClient, agents, {}, {
      tagsToAdd: (_this$actionParams = this.actionParams) === null || _this$actionParams === void 0 ? void 0 : _this$actionParams.tagsToAdd,
      tagsToRemove: (_this$actionParams2 = this.actionParams) === null || _this$actionParams2 === void 0 ? void 0 : _this$actionParams2.tagsToRemove,
      actionId: this.actionParams.actionId,
      total: this.actionParams.total
    });
  }
  getTaskType() {
    return _bulk_actions_resolver.BulkActionTaskType.UPDATE_AGENT_TAGS_RETRY;
  }
  getActionType() {
    return 'UPDATE_TAGS';
  }
  async processAgentsInBatches() {
    var _this$actionParams3, _this$actionParams4;
    const {
      updated,
      took
    } = await updateTagsBatch(this.soClient, this.esClient, [], {}, {
      tagsToAdd: (_this$actionParams3 = this.actionParams) === null || _this$actionParams3 === void 0 ? void 0 : _this$actionParams3.tagsToAdd,
      tagsToRemove: (_this$actionParams4 = this.actionParams) === null || _this$actionParams4 === void 0 ? void 0 : _this$actionParams4.tagsToRemove,
      actionId: this.actionParams.actionId,
      total: this.actionParams.total,
      kuery: this.actionParams.kuery,
      retryCount: this.retryParams.retryCount
    });
    _app_context.appContextService.getLogger().info(`processed ${updated} agents, took ${took}ms`);
    return {
      actionId: this.actionParams.actionId
    };
  }
}
exports.UpdateAgentTagsActionRunner = UpdateAgentTagsActionRunner;
async function updateTagsBatch(soClient, esClient, givenAgents, outgoingErrors, options) {
  var _options$actionId, _res$updated, _res$version_conflict;
  const errors = {
    ...outgoingErrors
  };
  const hostedAgentError = `Cannot modify tags on a hosted agent`;
  const filteredAgents = await (0, _filter_hosted_agents.filterHostedPolicies)(soClient, givenAgents, errors, hostedAgentError);
  const agentIds = filteredAgents.map(agent => agent.id);
  let query;
  if (options.kuery !== undefined) {
    const hostedPolicies = await _agent_policy.agentPolicyService.list(soClient, {
      kuery: `${_constants.AGENT_POLICY_SAVED_OBJECT_TYPE}.is_managed:true`,
      perPage: _constants2.SO_SEARCH_LIMIT
    });
    const hostedIds = hostedPolicies.items.map(item => item.id);
    const extraFilters = [];
    if (options.tagsToAdd.length === 1 && options.tagsToRemove.length === 0) {
      extraFilters.push(`NOT (tags:${options.tagsToAdd[0]})`);
    } else if (options.tagsToRemove.length === 1 && options.tagsToAdd.length === 0) {
      extraFilters.push(`tags:${options.tagsToRemove[0]}`);
    }
    query = (0, _crud.getElasticsearchQuery)(options.kuery, false, false, hostedIds, extraFilters);
  } else {
    query = {
      terms: {
        _id: agentIds
      }
    };
  }
  let res;
  try {
    res = await esClient.updateByQuery({
      query,
      index: _constants.AGENTS_INDEX,
      refresh: true,
      wait_for_completion: true,
      script: {
        source: `   
      if (ctx._source.tags == null) {
        ctx._source.tags = [];
      }
      if (params.tagsToAdd.length == 1 && params.tagsToRemove.length == 1) { 
        ctx._source.tags.replaceAll(tag -> params.tagsToRemove[0] == tag ? params.tagsToAdd[0] : tag);
      } else {
        ctx._source.tags.removeAll(params.tagsToRemove);
      } 
      ctx._source.tags.addAll(params.tagsToAdd);

      LinkedHashSet uniqueSet = new LinkedHashSet();
      uniqueSet.addAll(ctx._source.tags);

      ctx._source.tags = uniqueSet.toArray();

      ctx._source.updated_at = params.updatedAt;
      `,
        lang: 'painless',
        params: {
          tagsToAdd: (0, _lodash.uniq)(options.tagsToAdd),
          tagsToRemove: (0, _lodash.uniq)(options.tagsToRemove),
          updatedAt: new Date().toISOString()
        }
      },
      conflicts: 'proceed' // relying on the task to retry in case of conflicts - retry only conflicted agents
    });
  } catch (error) {
    throw new Error('Caught error: ' + JSON.stringify(error).slice(0, 1000));
  }
  _app_context.appContextService.getLogger().debug(JSON.stringify(res).slice(0, 1000));
  const actionId = (_options$actionId = options.actionId) !== null && _options$actionId !== void 0 ? _options$actionId : (0, _uuid.default)();
  if (options.retryCount === undefined) {
    // creating an action doc so that update tags  shows up in activity
    await (0, _actions.createAgentAction)(esClient, {
      id: actionId,
      agents: options.kuery === undefined ? agentIds : [],
      created_at: new Date().toISOString(),
      type: 'UPDATE_TAGS',
      total: res.total
    });
  }

  // creating unique ids to use as agentId, as we don't have all agent ids in case of action by kuery
  const getUuidArray = count => Array.from({
    length: count
  }, () => (0, _uuid.default)());

  // writing successful action results
  if ((_res$updated = res.updated) !== null && _res$updated !== void 0 ? _res$updated : 0 > 0) {
    await (0, _actions.bulkCreateAgentActionResults)(esClient, (options.kuery === undefined ? agentIds : getUuidArray(res.updated)).map(id => ({
      agentId: id,
      actionId
    })));
  }

  // writing failures from es update
  if (res.failures && res.failures.length > 0) {
    await (0, _actions.bulkCreateAgentActionResults)(esClient, res.failures.map(failure => ({
      agentId: failure.id,
      actionId,
      error: failure.cause.reason
    })));
  }
  if ((_res$version_conflict = res.version_conflicts) !== null && _res$version_conflict !== void 0 ? _res$version_conflict : 0 > 0) {
    // write out error results on last retry, so action is not stuck in progress
    if (options.retryCount === _action_runner.MAX_RETRY_COUNT) {
      await (0, _actions.bulkCreateAgentActionResults)(esClient, getUuidArray(res.version_conflicts).map(id => ({
        agentId: id,
        actionId,
        error: 'version conflict on last retry'
      })));
    }
    throw new Error(`version conflict of ${res.version_conflicts} agents`);
  }
  return {
    actionId,
    updated: res.updated,
    took: res.took
  };
}