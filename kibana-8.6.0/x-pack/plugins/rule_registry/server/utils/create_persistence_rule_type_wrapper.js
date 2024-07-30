"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPersistenceRuleTypeWrapper = void 0;
var _lodash = require("lodash");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _get_common_alert_fields = require("./get_common_alert_fields");
var _utils = require("./utils");
var _create_get_summarized_alerts_fn = require("./create_get_summarized_alerts_fn");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createPersistenceRuleTypeWrapper = ({
  logger,
  ruleDataClient
}) => type => {
  return {
    ...type,
    executor: async options => {
      const state = await type.executor({
        ...options,
        services: {
          ...options.services,
          alertWithPersistence: async (alerts, refresh, maxAlerts = undefined, enrichAlerts) => {
            const numAlerts = alerts.length;
            logger.debug(`Found ${numAlerts} alerts.`);
            const ruleDataClientWriter = await ruleDataClient.getWriter({
              namespace: options.spaceId
            });

            // Only write alerts if:
            // - writing is enabled
            //   AND
            //   - rule execution has not been cancelled due to timeout
            //     OR
            //   - if execution has been cancelled due to timeout, if feature flags are configured to write alerts anyway
            const writeAlerts = ruleDataClient.isWriteEnabled() && options.services.shouldWriteAlerts();
            if (writeAlerts && numAlerts) {
              const commonRuleFields = (0, _get_common_alert_fields.getCommonAlertFields)(options);
              const CHUNK_SIZE = 10000;
              const alertChunks = (0, _lodash.chunk)(alerts, CHUNK_SIZE);
              const filteredAlerts = [];
              for (const alertChunk of alertChunks) {
                const request = {
                  body: {
                    query: {
                      ids: {
                        values: alertChunk.map(alert => alert._id)
                      }
                    },
                    aggs: {
                      uuids: {
                        terms: {
                          field: _ruleDataUtils.ALERT_UUID,
                          size: CHUNK_SIZE
                        }
                      }
                    },
                    size: 0
                  }
                };
                const response = await ruleDataClient.getReader({
                  namespace: options.spaceId
                }).search(request);
                const uuidsMap = {};
                const aggs = response.aggregations;
                if (aggs != null) {
                  aggs.uuids.buckets.forEach(bucket => uuidsMap[bucket.key] = true);
                  const newAlerts = alertChunk.filter(alert => !uuidsMap[alert._id]);
                  filteredAlerts.push(...newAlerts);
                } else {
                  filteredAlerts.push(...alertChunk);
                }
              }
              if (filteredAlerts.length === 0) {
                return {
                  createdAlerts: [],
                  errors: {},
                  alertsWereTruncated: false
                };
              }
              let enrichedAlerts = filteredAlerts;
              if (enrichAlerts) {
                try {
                  enrichedAlerts = await enrichAlerts(filteredAlerts, {
                    spaceId: options.spaceId
                  });
                } catch (e) {
                  logger.debug('Enrichemnts failed');
                }
              }
              let alertsWereTruncated = false;
              if (maxAlerts && enrichedAlerts.length > maxAlerts) {
                enrichedAlerts.length = maxAlerts;
                alertsWereTruncated = true;
              }
              const augmentedAlerts = enrichedAlerts.map(alert => {
                return {
                  ...alert,
                  _source: {
                    [_ruleDataUtils.VERSION]: ruleDataClient.kibanaVersion,
                    ...commonRuleFields,
                    ...alert._source
                  }
                };
              });
              const response = await ruleDataClientWriter.bulk({
                body: augmentedAlerts.flatMap(alert => [{
                  create: {
                    _id: alert._id
                  }
                }, alert._source]),
                refresh
              });
              if (response == null) {
                return {
                  createdAlerts: [],
                  errors: {},
                  alertsWereTruncated
                };
              }
              return {
                createdAlerts: augmentedAlerts.map((alert, idx) => {
                  var _responseItem$_id, _responseItem$_index;
                  const responseItem = response.body.items[idx].create;
                  return {
                    _id: (_responseItem$_id = responseItem === null || responseItem === void 0 ? void 0 : responseItem._id) !== null && _responseItem$_id !== void 0 ? _responseItem$_id : '',
                    _index: (_responseItem$_index = responseItem === null || responseItem === void 0 ? void 0 : responseItem._index) !== null && _responseItem$_index !== void 0 ? _responseItem$_index : '',
                    ...alert._source
                  };
                }).filter((_, idx) => {
                  var _response$body$items$;
                  return ((_response$body$items$ = response.body.items[idx].create) === null || _response$body$items$ === void 0 ? void 0 : _response$body$items$.status) === 201;
                }),
                errors: (0, _utils.errorAggregator)(response.body, [409]),
                alertsWereTruncated
              };
            } else {
              logger.debug('Writing is disabled.');
              return {
                createdAlerts: [],
                errors: {},
                alertsWereTruncated: false
              };
            }
          }
        }
      });
      return state;
    },
    getSummarizedAlerts: (0, _create_get_summarized_alerts_fn.createGetSummarizedAlertsFn)({
      ruleDataClient,
      useNamespace: true,
      isLifecycleAlert: false
    })()
  };
};
exports.createPersistenceRuleTypeWrapper = createPersistenceRuleTypeWrapper;