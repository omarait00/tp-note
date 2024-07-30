"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkCreateAgentActionResults = bulkCreateAgentActionResults;
exports.bulkCreateAgentActions = bulkCreateAgentActions;
exports.cancelAgentAction = cancelAgentAction;
exports.createAgentAction = createAgentAction;
exports.createErrorActionResults = createErrorActionResults;
exports.getAgentActions = getAgentActions;
exports.getUnenrollAgentActions = getUnenrollAgentActions;
var _uuid = _interopRequireDefault(require("uuid"));
var _app_context = require("../app_context");
var _constants = require("../../../common/constants");
var _errors = require("../../errors");
var _crud = require("./crud");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ONE_MONTH_IN_MS = 2592000000;
async function createAgentAction(esClient, newAgentAction) {
  var _newAgentAction$id, _newAgentAction$expir;
  const actionId = (_newAgentAction$id = newAgentAction.id) !== null && _newAgentAction$id !== void 0 ? _newAgentAction$id : _uuid.default.v4();
  const timestamp = new Date().toISOString();
  const body = {
    '@timestamp': timestamp,
    expiration: (_newAgentAction$expir = newAgentAction.expiration) !== null && _newAgentAction$expir !== void 0 ? _newAgentAction$expir : new Date(Date.now() + ONE_MONTH_IN_MS).toISOString(),
    agents: newAgentAction.agents,
    action_id: actionId,
    data: newAgentAction.data,
    type: newAgentAction.type,
    start_time: newAgentAction.start_time,
    minimum_execution_duration: newAgentAction.minimum_execution_duration,
    total: newAgentAction.total
  };
  await esClient.create({
    index: _constants.AGENT_ACTIONS_INDEX,
    id: _uuid.default.v4(),
    body,
    refresh: 'wait_for'
  });
  return {
    id: actionId,
    ...newAgentAction,
    created_at: timestamp
  };
}
async function bulkCreateAgentActions(esClient, newAgentActions) {
  const actions = newAgentActions.map(newAgentAction => {
    var _newAgentAction$id2;
    const id = (_newAgentAction$id2 = newAgentAction.id) !== null && _newAgentAction$id2 !== void 0 ? _newAgentAction$id2 : _uuid.default.v4();
    return {
      id,
      ...newAgentAction
    };
  });
  if (actions.length === 0) {
    return [];
  }
  await esClient.bulk({
    index: _constants.AGENT_ACTIONS_INDEX,
    body: actions.flatMap(action => {
      var _action$expiration;
      const body = {
        '@timestamp': new Date().toISOString(),
        expiration: (_action$expiration = action.expiration) !== null && _action$expiration !== void 0 ? _action$expiration : new Date(Date.now() + ONE_MONTH_IN_MS).toISOString(),
        start_time: action.start_time,
        minimum_execution_duration: action.minimum_execution_duration,
        agents: action.agents,
        action_id: action.id,
        data: action.data,
        type: action.type
      };
      return [{
        create: {
          _id: action.id
        }
      }, body];
    })
  });
  return actions;
}
async function createErrorActionResults(esClient, actionId, errors, errorMessage) {
  const errorCount = Object.keys(errors).length;
  if (errorCount > 0) {
    _app_context.appContextService.getLogger().info(`Writing error action results of ${errorCount} agents. Possibly failed validation: ${errorMessage}.`);

    // writing out error result for those agents that have errors, so the action is not going to stay in progress forever
    await bulkCreateAgentActionResults(esClient, Object.keys(errors).map(agentId => ({
      agentId,
      actionId,
      error: errors[agentId].message
    })));
  }
}
async function bulkCreateAgentActionResults(esClient, results) {
  if (results.length === 0) {
    return;
  }
  const bulkBody = results.flatMap(result => {
    const body = {
      '@timestamp': new Date().toISOString(),
      action_id: result.actionId,
      agent_id: result.agentId,
      error: result.error
    };
    return [{
      create: {
        _id: _uuid.default.v4()
      }
    }, body];
  });
  await esClient.bulk({
    index: _constants.AGENT_ACTIONS_RESULTS_INDEX,
    body: bulkBody,
    refresh: 'wait_for'
  });
}
async function getAgentActions(esClient, actionId) {
  const res = await esClient.search({
    index: _constants.AGENT_ACTIONS_INDEX,
    query: {
      bool: {
        must: [{
          term: {
            action_id: actionId
          }
        }]
      }
    },
    size: _constants.SO_SEARCH_LIMIT
  });
  if (res.hits.hits.length === 0) {
    throw new _errors.AgentActionNotFoundError('Action not found');
  }
  return res.hits.hits.map(hit => ({
    ...hit._source,
    id: hit._id
  }));
}
async function getUnenrollAgentActions(esClient) {
  const res = await esClient.search({
    index: _constants.AGENT_ACTIONS_INDEX,
    query: {
      bool: {
        must: [{
          term: {
            type: 'UNENROLL'
          }
        }, {
          exists: {
            field: 'agents'
          }
        }, {
          range: {
            expiration: {
              gte: new Date().toISOString()
            }
          }
        }]
      }
    },
    size: _constants.SO_SEARCH_LIMIT
  });
  return res.hits.hits.map(hit => ({
    ...hit._source,
    id: hit._id
  }));
}
async function cancelAgentAction(esClient, actionId) {
  const res = await esClient.search({
    index: _constants.AGENT_ACTIONS_INDEX,
    query: {
      bool: {
        must: [{
          term: {
            action_id: actionId
          }
        }]
      }
    },
    size: _constants.SO_SEARCH_LIMIT
  });
  if (res.hits.hits.length === 0) {
    throw new _errors.AgentActionNotFoundError('Action not found');
  }
  const cancelActionId = _uuid.default.v4();
  const now = new Date().toISOString();
  for (const hit of res.hits.hits) {
    if (!hit._source || !hit._source.agents || !hit._source.action_id) {
      continue;
    }
    if (hit._source.type === 'UPGRADE') {
      await (0, _crud.bulkUpdateAgents)(esClient, hit._source.agents.map(agentId => ({
        agentId,
        data: {
          upgraded_at: null,
          upgrade_started_at: null
        }
      })), {});
    }
    await createAgentAction(esClient, {
      id: cancelActionId,
      type: 'CANCEL',
      agents: hit._source.agents,
      data: {
        target_id: hit._source.action_id
      },
      created_at: now,
      expiration: hit._source.expiration
    });
  }
  return {
    created_at: now,
    id: cancelActionId,
    type: 'CANCEL'
  };
}