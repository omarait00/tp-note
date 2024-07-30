"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleRegistrySearchStrategyProvider = exports.RULE_SEARCH_STRATEGY_NAME = exports.EMPTY_RESPONSE = void 0;
var _operators = require("rxjs/operators");
var _rxjs = require("rxjs");
var _lodash = require("lodash");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _common = require("../../../../../src/plugins/data/common");
var _server = require("../../../alerting/server");
var _index_options = require("../rule_data_plugin_service/index_options");
var _constants = require("../../common/constants");
var _ = require("..");
var _lib = require("../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const EMPTY_RESPONSE = {
  rawResponse: {}
};
exports.EMPTY_RESPONSE = EMPTY_RESPONSE;
const EMPTY_FIELDS = [{
  field: '*',
  include_unmapped: true
}];
const RULE_SEARCH_STRATEGY_NAME = 'privateRuleRegistryAlertsSearchStrategy';
exports.RULE_SEARCH_STRATEGY_NAME = RULE_SEARCH_STRATEGY_NAME;
const ruleRegistrySearchStrategyProvider = (data, ruleDataService, alerting, logger, security, spaces) => {
  const internalUserEs = data.search.searchAsInternalUser;
  const requestUserEs = data.search.getSearchStrategy(_common.ENHANCED_ES_SEARCH_STRATEGY);
  return {
    search: (request, options, deps) => {
      // SIEM uses RBAC fields in their alerts but also utilizes ES DLS which
      // is different than every other solution so we need to special case
      // those requests.
      let siemRequest = false;
      if (request.featureIds.length === 1 && request.featureIds[0] === _ruleDataUtils.AlertConsumers.SIEM) {
        siemRequest = true;
      } else if (request.featureIds.includes(_ruleDataUtils.AlertConsumers.SIEM)) {
        throw new Error(`The ${RULE_SEARCH_STRATEGY_NAME} search strategy is unable to accommodate requests containing multiple feature IDs and one of those IDs is SIEM.`);
      }
      const securityAuditLogger = security === null || security === void 0 ? void 0 : security.audit.asScoped(deps.request);
      const getActiveSpace = async () => spaces === null || spaces === void 0 ? void 0 : spaces.spacesService.getActiveSpace(deps.request);
      const getAsync = async () => {
        const [space, authorization] = await Promise.all([getActiveSpace(), alerting.getAlertingAuthorizationWithRequest(deps.request)]);
        let authzFilter;
        if (!siemRequest) {
          authzFilter = await (0, _lib.getAuthzFilter)(authorization, _server.ReadOperations.Find);
        }
        return {
          space,
          authzFilter
        };
      };
      return (0, _rxjs.from)(getAsync()).pipe((0, _operators.mergeMap)(({
        space,
        authzFilter
      }) => {
        var _request$query, _request$query$bool, _request$query2, _request$query2$bool, _request$query3, _request$query3$bool, _request$query4, _request$query4$bool, _request$sort, _request$query5, _request$query6;
        const indices = request.featureIds.reduce((accum, featureId) => {
          if (!(0, _ruleDataUtils.isValidFeatureId)(featureId)) {
            logger.warn(`Found invalid feature '${featureId}' while using ${RULE_SEARCH_STRATEGY_NAME} search strategy. No alert data from this feature will be searched.`);
            return accum;
          }
          const alertIndexInfo = ruleDataService.findIndexByFeature(featureId, _index_options.Dataset.alerts);
          if (alertIndexInfo) {
            var _space$id;
            return [...accum, featureId === 'siem' ? `${alertIndexInfo.baseName}-${(_space$id = space === null || space === void 0 ? void 0 : space.id) !== null && _space$id !== void 0 ? _space$id : ''}*` : `${alertIndexInfo.baseName}*`];
          }
          return accum;
        }, []);
        if (indices.length === 0) {
          return (0, _rxjs.of)(EMPTY_RESPONSE);
        }
        const filter = (_request$query = request.query) !== null && _request$query !== void 0 && (_request$query$bool = _request$query.bool) !== null && _request$query$bool !== void 0 && _request$query$bool.filter ? Array.isArray((_request$query2 = request.query) === null || _request$query2 === void 0 ? void 0 : (_request$query2$bool = _request$query2.bool) === null || _request$query2$bool === void 0 ? void 0 : _request$query2$bool.filter) ? (_request$query3 = request.query) === null || _request$query3 === void 0 ? void 0 : (_request$query3$bool = _request$query3.bool) === null || _request$query3$bool === void 0 ? void 0 : _request$query3$bool.filter : [(_request$query4 = request.query) === null || _request$query4 === void 0 ? void 0 : (_request$query4$bool = _request$query4.bool) === null || _request$query4$bool === void 0 ? void 0 : _request$query4$bool.filter] : [];
        if (authzFilter) {
          filter.push(authzFilter);
        }
        if (space !== null && space !== void 0 && space.id) {
          filter.push((0, _lib.getSpacesFilter)(space.id));
        }
        const sort = (_request$sort = request.sort) !== null && _request$sort !== void 0 ? _request$sort : [];
        const query = {
          ...(((_request$query5 = request.query) === null || _request$query5 === void 0 ? void 0 : _request$query5.ids) != null ? {
            ids: (_request$query6 = request.query) === null || _request$query6 === void 0 ? void 0 : _request$query6.ids
          } : {
            bool: {
              filter
            }
          })
        };
        const size = request.pagination ? request.pagination.pageSize : _constants.MAX_ALERT_SEARCH_SIZE;
        const params = {
          allow_no_indices: true,
          index: indices,
          ignore_unavailable: true,
          body: {
            _source: false,
            // TODO the fields need to come from the request
            fields: !(0, _lodash.isEmpty)(request === null || request === void 0 ? void 0 : request.fields) ? request === null || request === void 0 ? void 0 : request.fields : EMPTY_FIELDS,
            sort,
            size,
            from: request.pagination ? request.pagination.pageIndex * size : 0,
            query
          }
        };
        return (siemRequest ? requestUserEs : internalUserEs).search({
          id: request.id,
          params
        }, options, deps);
      }), (0, _operators.map)(response => {
        // Do we have to loop over each hit? Yes.
        // ecs auditLogger requires that we log each alert independently
        if (securityAuditLogger != null) {
          var _response$rawResponse, _response$rawResponse2;
          (_response$rawResponse = response.rawResponse.hits) === null || _response$rawResponse === void 0 ? void 0 : (_response$rawResponse2 = _response$rawResponse.hits) === null || _response$rawResponse2 === void 0 ? void 0 : _response$rawResponse2.forEach(hit => {
            securityAuditLogger.log((0, _.alertAuditEvent)({
              action: _.AlertAuditAction.FIND,
              id: hit._id,
              outcome: 'success'
            }));
          });
        }
        return response;
      }), (0, _operators.catchError)(err => {
        var _err$output;
        // check if auth error, if yes, write to ecs logger
        if (securityAuditLogger != null && (err === null || err === void 0 ? void 0 : (_err$output = err.output) === null || _err$output === void 0 ? void 0 : _err$output.statusCode) === 403) {
          securityAuditLogger.log((0, _.alertAuditEvent)({
            action: _.AlertAuditAction.FIND,
            outcome: 'failure',
            error: err
          }));
        }
        throw err;
      }));
    },
    cancel: async (id, options, deps) => {
      if (internalUserEs.cancel) internalUserEs.cancel(id, options, deps);
      if (requestUserEs.cancel) requestUserEs.cancel(id, options, deps);
    }
  };
};
exports.ruleRegistrySearchStrategyProvider = ruleRegistrySearchStrategyProvider;