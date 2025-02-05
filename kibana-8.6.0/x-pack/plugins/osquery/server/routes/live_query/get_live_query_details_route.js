"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLiveQueryDetailsRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _lodash = require("lodash");
var _rxjs = require("rxjs");
var _common = require("../../../common");
var _utils = require("./utils");
var _search_strategy = require("../../../common/search_strategy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getLiveQueryDetailsRoute = router => {
  router.get({
    path: '/api/osquery/live_queries/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }, {
        unknowns: 'allow'
      }),
      query: _configSchema.schema.object({}, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-read`]
    }
  }, async (context, request, response) => {
    const abortSignal = getRequestAbortedSignal(request.events.aborted$);
    try {
      var _actionDetails$_sourc, _actionDetails$fields, _actionDetails$_sourc2;
      const search = await context.search;
      const {
        actionDetails
      } = await (0, _rxjs.lastValueFrom)(search.search({
        actionId: request.params.id,
        filterQuery: request.query,
        factoryQueryType: _search_strategy.OsqueryQueries.actionDetails
      }, {
        abortSignal,
        strategy: 'osquerySearchStrategy'
      }));
      const queries = actionDetails === null || actionDetails === void 0 ? void 0 : (_actionDetails$_sourc = actionDetails._source) === null || _actionDetails$_sourc === void 0 ? void 0 : _actionDetails$_sourc.queries;
      const expirationDate = actionDetails === null || actionDetails === void 0 ? void 0 : (_actionDetails$fields = actionDetails.fields) === null || _actionDetails$fields === void 0 ? void 0 : _actionDetails$fields.expiration[0];
      const expired = !expirationDate ? true : new Date(expirationDate) < new Date();
      const responseData = await (0, _rxjs.lastValueFrom)((0, _rxjs.zip)(...(0, _lodash.map)(queries, query => {
        var _query$agents$length, _query$agents;
        return (0, _utils.getActionResponses)(search, query.action_id, (_query$agents$length = (_query$agents = query.agents) === null || _query$agents === void 0 ? void 0 : _query$agents.length) !== null && _query$agents$length !== void 0 ? _query$agents$length : 0);
      })));
      const isCompleted = expired || responseData && (0, _lodash.every)(responseData, ['pending', 0]);
      const agentByActionIdStatusMap = (0, _lodash.mapKeys)(responseData, 'action_id');
      return response.ok({
        body: {
          data: {
            ...(0, _lodash.pick)(actionDetails._source, 'action_id', 'expiration', '@timestamp', 'agent_selection', 'agents', 'user_id', 'pack_id', 'pack_name', 'prebuilt_pack'),
            queries: (0, _lodash.reduce)((_actionDetails$_sourc2 = actionDetails._source) === null || _actionDetails$_sourc2 === void 0 ? void 0 : _actionDetails$_sourc2.queries, (acc, query) => {
              const agentStatus = agentByActionIdStatusMap[query.action_id];
              acc.push({
                ...query,
                ...agentStatus,
                status: isCompleted || (agentStatus === null || agentStatus === void 0 ? void 0 : agentStatus.pending) === 0 ? 'completed' : 'running'
              });
              return acc;
            }, []),
            status: isCompleted ? 'completed' : 'running'
          }
        }
      });
    } catch (e) {
      var _e$statusCode;
      return response.customError({
        statusCode: (_e$statusCode = e.statusCode) !== null && _e$statusCode !== void 0 ? _e$statusCode : 500,
        body: {
          message: e.message
        }
      });
    }
  });
};
exports.getLiveQueryDetailsRoute = getLiveQueryDetailsRoute;
function getRequestAbortedSignal(aborted$) {
  const controller = new AbortController();
  aborted$.subscribe(() => controller.abort());
  return controller.signal;
}