"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentBulkUpgrades = getCurrentBulkUpgrades;
var _pMap = _interopRequireDefault(require("p-map"));
var _common = require("../../../common");
var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Return current bulk upgrades (non completed or cancelled)
 */
async function getCurrentBulkUpgrades(esClient, now = new Date().toISOString()) {
  // Fetch all non expired actions
  const [_upgradeActions, cancelledActionIds] = await Promise.all([_getUpgradeActions(esClient, now), _getCancelledActionId(esClient, now)]);
  let upgradeActions = _upgradeActions.filter(action => cancelledActionIds.indexOf(action.actionId) < 0);

  // Fetch acknowledged result for every upgrade action
  upgradeActions = await (0, _pMap.default)(upgradeActions, async upgradeAction => {
    const {
      count
    } = await esClient.count({
      index: _common.AGENT_ACTIONS_RESULTS_INDEX,
      ignore_unavailable: true,
      query: {
        bool: {
          must: [{
            term: {
              action_id: upgradeAction.actionId
            }
          }]
        }
      }
    });
    return {
      ...upgradeAction,
      nbAgentsAck: count,
      complete: upgradeAction.nbAgents <= count
    };
  }, {
    concurrency: 20
  });
  upgradeActions = upgradeActions.filter(action => !action.complete);
  return upgradeActions;
}
async function _getCancelledActionId(esClient, now = new Date().toISOString()) {
  const res = await esClient.search({
    index: _common.AGENT_ACTIONS_INDEX,
    ignore_unavailable: true,
    size: _constants.SO_SEARCH_LIMIT,
    query: {
      bool: {
        must: [{
          term: {
            type: 'CANCEL'
          }
        }, {
          exists: {
            field: 'agents'
          }
        }, {
          range: {
            expiration: {
              gte: now
            }
          }
        }]
      }
    }
  });
  return res.hits.hits.map(hit => {
    var _hit$_source, _hit$_source$data;
    return (_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : (_hit$_source$data = _hit$_source.data) === null || _hit$_source$data === void 0 ? void 0 : _hit$_source$data.target_id;
  });
}
async function _getUpgradeActions(esClient, now = new Date().toISOString()) {
  const res = await esClient.search({
    index: _common.AGENT_ACTIONS_INDEX,
    ignore_unavailable: true,
    size: _constants.SO_SEARCH_LIMIT,
    query: {
      bool: {
        must: [{
          term: {
            type: 'UPGRADE'
          }
        }, {
          exists: {
            field: 'agents'
          }
        }, {
          range: {
            expiration: {
              gte: now
            }
          }
        }]
      }
    }
  });
  return Object.values(res.hits.hits.reduce((acc, hit) => {
    var _hit$_source$agents$l, _hit$_source$agents;
    if (!hit._source || !hit._source.action_id) {
      return acc;
    }
    if (!acc[hit._source.action_id]) {
      var _hit$_source$data2, _hit$_source2;
      acc[hit._source.action_id] = {
        actionId: hit._source.action_id,
        nbAgents: 0,
        complete: false,
        nbAgentsAck: 0,
        version: (_hit$_source$data2 = hit._source.data) === null || _hit$_source$data2 === void 0 ? void 0 : _hit$_source$data2.version,
        startTime: (_hit$_source2 = hit._source) === null || _hit$_source2 === void 0 ? void 0 : _hit$_source2.start_time
      };
    }
    acc[hit._source.action_id].nbAgents += (_hit$_source$agents$l = (_hit$_source$agents = hit._source.agents) === null || _hit$_source$agents === void 0 ? void 0 : _hit$_source$agents.length) !== null && _hit$_source$agents$l !== void 0 ? _hit$_source$agents$l : 0;
    return acc;
  }, {}));
}