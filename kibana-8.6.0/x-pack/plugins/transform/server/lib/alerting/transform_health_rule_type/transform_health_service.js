"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformHealthServiceProvider = transformHealthServiceProvider;
var _i18n = require("@kbn/i18n");
var _lodash = require("lodash");
var _constants = require("../../../../common/constants");
var _alerts = require("../../../../common/utils/alerts");
var _transform = require("../../../../common/types/transform");
var _transforms_audit_messages = require("../../../routes/api/transforms_audit_messages");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function transformHealthServiceProvider(esClient, rulesClient) {
  const transformsDict = new Map();

  /**
   * Resolves result transform selection.
   * @param includeTransforms
   * @param excludeTransforms
   * @param skipIDsCheck
   */
  const getResultsTransformIds = async (includeTransforms, excludeTransforms, skipIDsCheck = false) => {
    const includeAll = includeTransforms.some(id => id === _constants.ALL_TRANSFORMS_SELECTION);
    let resultTransformIds = [];
    if (skipIDsCheck) {
      resultTransformIds = includeTransforms;
    } else {
      // Fetch transforms to make sure assigned transforms exists.
      const transformsResponse = (await esClient.transform.getTransform({
        ...(includeAll ? {} : {
          transform_id: includeTransforms.join(',')
        }),
        allow_no_match: true,
        size: 1000
      })).transforms;
      transformsResponse.forEach(t => {
        transformsDict.set(t.id, t);
        if (t.sync) {
          resultTransformIds.push(t.id);
        }
      });
    }
    if (excludeTransforms && excludeTransforms.length > 0) {
      const excludeIdsSet = new Set(excludeTransforms);
      resultTransformIds = resultTransformIds.filter(id => !excludeIdsSet.has(id));
    }
    return resultTransformIds;
  };
  return {
    /**
     * Returns report about not started transforms
     * @param transformIds
     *
     * @return - Partitions with not started and started transforms
     */
    async getTransformsStateReport(transformIds) {
      const transformsStats = (await esClient.transform.getTransformStats({
        transform_id: transformIds.join(',')
      })).transforms;
      return (0, _lodash.partition)(transformsStats.map(t => {
        var _transformsDict$get, _t$node;
        return {
          transform_id: t.id,
          description: (_transformsDict$get = transformsDict.get(t.id)) === null || _transformsDict$get === void 0 ? void 0 : _transformsDict$get.description,
          transform_state: t.state,
          node_name: (_t$node = t.node) === null || _t$node === void 0 ? void 0 : _t$node.name
        };
      }), t => t.transform_state !== _constants.TRANSFORM_STATE.STARTED && t.transform_state !== _constants.TRANSFORM_STATE.INDEXING);
    },
    /**
     * Returns report about transforms that contain error messages
     * @param transformIds
     */
    async getErrorMessagesReport(transformIds) {
      var _response$aggregation;
      const response = await esClient.search({
        index: _transforms_audit_messages.ML_DF_NOTIFICATION_INDEX_PATTERN,
        size: 0,
        query: {
          bool: {
            filter: [{
              term: {
                level: 'error'
              }
            }, {
              terms: {
                transform_id: transformIds
              }
            }]
          }
        },
        aggs: {
          by_transform: {
            terms: {
              field: 'transform_id',
              size: transformIds.length
            },
            aggs: {
              error_messages: {
                top_hits: {
                  size: 10,
                  _source: {
                    includes: ['message', 'level', 'timestamp', 'node_name']
                  }
                }
              }
            }
          }
        }
      });

      // If transform contains errors, it's in a failed state
      const transformsStats = (await esClient.transform.getTransformStats({
        transform_id: transformIds.join(',')
      })).transforms;
      const failedTransforms = new Set(transformsStats.filter(t => t.state === _constants.TRANSFORM_STATE.FAILED).map(t => t.id));
      return ((_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.by_transform.buckets).map(({
        key,
        error_messages: errorMessages
      }) => {
        return {
          transform_id: key,
          error_messages: errorMessages.hits.hits.map(v => v._source)
        };
      }).filter(v => failedTransforms.has(v.transform_id));
    },
    /**
     * Returns results of the transform health checks
     * @param params
     */
    async getHealthChecksResults(params) {
      const transformIds = await getResultsTransformIds(params.includeTransforms, params.excludeTransforms);
      const testsConfig = (0, _alerts.getResultTestConfig)(params.testsConfig);
      const result = [];
      if (testsConfig.notStarted.enabled) {
        const [notStartedTransform, startedTransforms] = await this.getTransformsStateReport(transformIds);
        const isHealthy = notStartedTransform.length === 0;
        const count = isHealthy ? startedTransforms.length : notStartedTransform.length;
        const transformsString = (isHealthy ? startedTransforms : notStartedTransform).map(t => t.transform_id).join(', ');
        result.push({
          isHealthy,
          name: _constants.TRANSFORM_HEALTH_CHECK_NAMES.notStarted.name,
          context: {
            results: isHealthy ? startedTransforms : notStartedTransform,
            message: isHealthy ? _i18n.i18n.translate('xpack.transform.alertTypes.transformHealth.notStartedRecoveryMessage', {
              defaultMessage: '{count, plural, one {Transform} other {Transform}} {transformsString} {count, plural, one {is} other {are}} started.',
              values: {
                count,
                transformsString
              }
            }) : _i18n.i18n.translate('xpack.transform.alertTypes.transformHealth.notStartedMessage', {
              defaultMessage: '{count, plural, one {Transform} other {Transform}} {transformsString} {count, plural, one {is} other {are}} not started.',
              values: {
                count,
                transformsString
              }
            })
          }
        });
      }
      if (testsConfig.errorMessages.enabled) {
        const response = await this.getErrorMessagesReport(transformIds);
        const isHealthy = response.length === 0;
        const count = response.length;
        const transformsString = response.map(t => t.transform_id).join(', ');
        result.push({
          isHealthy,
          name: _constants.TRANSFORM_HEALTH_CHECK_NAMES.errorMessages.name,
          context: {
            results: isHealthy ? [] : response,
            message: isHealthy ? _i18n.i18n.translate('xpack.transform.alertTypes.transformHealth.errorMessagesRecoveryMessage', {
              defaultMessage: 'No errors in the {count, plural, one {transform} other {transforms}} messages.',
              values: {
                count: transformIds.length
              }
            }) : _i18n.i18n.translate('xpack.transform.alertTypes.transformHealth.errorMessagesMessage', {
              defaultMessage: '{count, plural, one {Transform} other {Transforms}} {transformsString} {count, plural, one {contains} other {contain}} error messages.',
              values: {
                count,
                transformsString
              }
            })
          }
        });
      }
      return result;
    },
    /**
     * Updates transform list with associated alerting rules.
     */
    async populateTransformsWithAssignedRules(transforms) {
      const newList = transforms.filter(_transform.isContinuousTransform);
      if (!rulesClient) {
        throw new Error('Rules client is missing');
      }
      const transformMap = (0, _lodash.keyBy)(newList, 'id');
      const transformAlertingRules = await rulesClient.find({
        options: {
          perPage: 1000,
          filter: `alert.attributes.alertTypeId:${_constants.TRANSFORM_RULE_TYPE.TRANSFORM_HEALTH}`
        }
      });
      for (const ruleInstance of transformAlertingRules.data) {
        // Retrieve result transform IDs
        const resultTransformIds = await getResultsTransformIds(ruleInstance.params.includeTransforms.includes(_constants.ALL_TRANSFORMS_SELECTION) ? Object.keys(transformMap) : ruleInstance.params.includeTransforms, ruleInstance.params.excludeTransforms, true);
        resultTransformIds.forEach(transformId => {
          const transformRef = transformMap[transformId];
          if (transformRef) {
            if (Array.isArray(transformRef.alerting_rules)) {
              transformRef.alerting_rules.push(ruleInstance);
            } else {
              transformRef.alerting_rules = [ruleInstance];
            }
          }
        });
      }
      return newList;
    }
  };
}