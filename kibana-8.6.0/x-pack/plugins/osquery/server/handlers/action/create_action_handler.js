"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createActionHandler = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _moment = _interopRequireDefault(require("moment"));
var _lodash = require("lodash");
var _common = require("../../../../fleet/common");
var _utils = require("../../routes/utils");
var _parse_agent_groups = require("../../lib/parse_agent_groups");
var _types = require("../../../common/types");
var _utils2 = require("../../routes/pack/utils");
var _utils3 = require("../../routes/saved_query/utils");
var _constants = require("../../../common/constants");
var _constants2 = require("../../lib/telemetry/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createActionHandler = async (osqueryContext, params, soClient, metadata) => {
  var _packSO, _packSO$attributes, _packSO2, _params$queries, _osqueryContext$servi;
  const [coreStartServices] = await osqueryContext.getStartServices();
  const esClientInternal = coreStartServices.elasticsearch.client.asInternalUser;
  const internalSavedObjectsClient = await (0, _utils.getInternalSavedObjectsClient)(osqueryContext.getStartServices);
  const savedObjectsClient = soClient !== null && soClient !== void 0 ? soClient : coreStartServices.savedObjects.createInternalRepository();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const {
    agent_all,
    agent_ids,
    agent_platforms,
    agent_policy_ids
  } = params;
  const selectedAgents = await (0, _parse_agent_groups.parseAgentSelection)(internalSavedObjectsClient, osqueryContext, {
    agents: agent_ids,
    allAgentsSelected: !!agent_all,
    platformsSelected: agent_platforms,
    policiesSelected: agent_policy_ids
  });
  if (!selectedAgents.length) {
    throw new Error('No agents found for selection');
  }
  let packSO;
  if (params.pack_id) {
    packSO = await savedObjectsClient.get(_types.packSavedObjectType, params.pack_id);
  }
  const osqueryAction = {
    action_id: _uuid.default.v4(),
    '@timestamp': (0, _moment.default)().toISOString(),
    expiration: (0, _moment.default)().add(5, 'minutes').toISOString(),
    type: 'INPUT_ACTION',
    input_type: 'osquery',
    alert_ids: params.alert_ids,
    event_ids: params.event_ids,
    case_ids: params.case_ids,
    agent_ids: params.agent_ids,
    agent_all: params.agent_all,
    agent_platforms: params.agent_platforms,
    agent_policy_ids: params.agent_policy_ids,
    agents: selectedAgents,
    user_id: metadata === null || metadata === void 0 ? void 0 : metadata.currentUser,
    metadata: params.metadata,
    pack_id: params.pack_id,
    pack_name: (_packSO = packSO) === null || _packSO === void 0 ? void 0 : (_packSO$attributes = _packSO.attributes) === null || _packSO$attributes === void 0 ? void 0 : _packSO$attributes.name,
    pack_prebuilt: params.pack_id ? !!(0, _lodash.some)((_packSO2 = packSO) === null || _packSO2 === void 0 ? void 0 : _packSO2.references, ['type', 'osquery-pack-asset']) : undefined,
    queries: packSO ? (0, _lodash.map)((0, _utils2.convertSOQueriesToPack)(packSO.attributes.queries), (packQuery, packQueryId) => (0, _lodash.pickBy)({
      action_id: _uuid.default.v4(),
      id: packQueryId,
      query: packQuery.query,
      ecs_mapping: packQuery.ecs_mapping,
      version: packQuery.version,
      platform: packQuery.platform,
      agents: selectedAgents
    }, value => !(0, _lodash.isEmpty)(value))) : (_params$queries = params.queries) !== null && _params$queries !== void 0 && _params$queries.length ? (0, _lodash.map)(params.queries, query => (0, _lodash.pickBy)({
      // @ts-expect-error where does type 'number' comes from?
      ...query,
      action_id: _uuid.default.v4(),
      agents: selectedAgents
    }, value => !(0, _lodash.isEmpty)(value))) : [(0, _lodash.pickBy)({
      action_id: _uuid.default.v4(),
      id: _uuid.default.v4(),
      query: params.query,
      saved_query_id: params.saved_query_id,
      saved_query_prebuilt: params.saved_query_id ? await (0, _utils3.isSavedQueryPrebuilt)((_osqueryContext$servi = osqueryContext.service.getPackageService()) === null || _osqueryContext$servi === void 0 ? void 0 : _osqueryContext$servi.asInternalUser, params.saved_query_id) : undefined,
      ecs_mapping: params.ecs_mapping,
      agents: selectedAgents
    }, value => !(0, _lodash.isEmpty)(value))]
  };
  const fleetActions = (0, _lodash.map)(osqueryAction.queries, query => ({
    action_id: query.action_id,
    '@timestamp': (0, _moment.default)().toISOString(),
    expiration: (0, _moment.default)().add(5, 'minutes').toISOString(),
    type: 'INPUT_ACTION',
    input_type: 'osquery',
    agents: query.agents,
    user_id: metadata === null || metadata === void 0 ? void 0 : metadata.currentUser,
    data: (0, _lodash.pick)(query, ['id', 'query', 'ecs_mapping', 'version', 'platform'])
  }));
  await esClientInternal.bulk({
    refresh: 'wait_for',
    body: (0, _lodash.flatten)(fleetActions.map(action => [{
      index: {
        _index: _common.AGENT_ACTIONS_INDEX
      }
    }, action]))
  });
  const actionsComponentTemplateExists = await esClientInternal.indices.exists({
    index: `${_constants.ACTIONS_INDEX}*`
  });
  if (actionsComponentTemplateExists) {
    await esClientInternal.bulk({
      refresh: 'wait_for',
      body: [{
        index: {
          _index: `${_constants.ACTIONS_INDEX}-default`
        }
      }, osqueryAction]
    });
  }
  osqueryContext.telemetryEventsSender.reportEvent(_constants2.TELEMETRY_EBT_LIVE_QUERY_EVENT, {
    ...(0, _lodash.omit)(osqueryAction, ['type', 'input_type', 'user_id']),
    agents: osqueryAction.agents.length
  });
  return {
    response: osqueryAction
  };
};
exports.createActionHandler = createActionHandler;