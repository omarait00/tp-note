"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineExplainLogRateSpikesRoute = void 0;
var _async = require("async");
var _lodash = require("lodash");
var _i18n = require("@kbn/i18n");
var _fieldTypes = require("@kbn/field-types");
var _aiopsUtils = require("@kbn/aiops-utils");
var _mlAggUtils = require("@kbn/ml-agg-utils");
var _mlStringHash = require("@kbn/ml-string-hash");
var _explain_log_rate_spikes = require("../../common/api/explain_log_rate_spikes");
var _api = require("../../common/api");
var _is_request_aborted_error = require("../lib/is_request_aborted_error");
var _fetch_change_point_p_values = require("./queries/fetch_change_point_p_values");
var _fetch_index_info = require("./queries/fetch_index_info");
var _fetch_frequent_items = require("./queries/fetch_frequent_items");
var _get_histogram_query = require("./queries/get_histogram_query");
var _get_simple_hierarchical_tree = require("./queries/get_simple_hierarchical_tree");
var _get_group_filter = require("./queries/get_group_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// 10s ping frequency to keep the stream alive.
const PING_FREQUENCY = 10000;

// Overall progress is a float from 0 to 1.
const LOADED_FIELD_CANDIDATES = 0.2;
const PROGRESS_STEP_P_VALUES = 0.5;
const PROGRESS_STEP_GROUPING = 0.1;
const PROGRESS_STEP_HISTOGRAMS = 0.1;
const PROGRESS_STEP_HISTOGRAMS_GROUPS = 0.1;
const defineExplainLogRateSpikesRoute = (router, license, logger) => {
  router.post({
    path: _api.API_ENDPOINT.EXPLAIN_LOG_RATE_SPIKES,
    validate: {
      body: _explain_log_rate_spikes.aiopsExplainLogRateSpikesSchema
    }
  }, async (context, request, response) => {
    if (!license.isActivePlatinumLicense) {
      return response.forbidden();
    }
    let logMessageCounter = 1;
    function logDebugMessage(msg) {
      logger.debug(`Explain Log Rate Spikes #${logMessageCounter}: ${msg}`);
      logMessageCounter++;
    }
    logDebugMessage('Starting analysis.');
    const groupingEnabled = !!request.body.grouping;
    const client = (await context.core).elasticsearch.client.asCurrentUser;
    const controller = new AbortController();
    const abortSignal = controller.signal;
    let isRunning = false;
    let loaded = 0;
    let shouldStop = false;
    request.events.aborted$.subscribe(() => {
      logDebugMessage('aborted$ subscription trigger.');
      shouldStop = true;
      controller.abort();
    });
    request.events.completed$.subscribe(() => {
      logDebugMessage('completed$ subscription trigger.');
      shouldStop = true;
      controller.abort();
    });
    const {
      end: streamEnd,
      push,
      responseWithHeaders
    } = (0, _aiopsUtils.streamFactory)(request.headers, logger, request.body.compressResponse, request.body.flushFix);
    function pushPingWithTimeout() {
      setTimeout(() => {
        if (isRunning) {
          logDebugMessage('Ping message.');
          push((0, _explain_log_rate_spikes.pingAction)());
          pushPingWithTimeout();
        }
      }, PING_FREQUENCY);
    }
    function end() {
      if (isRunning) {
        isRunning = false;
        logDebugMessage('Ending analysis.');
        streamEnd();
      } else {
        logDebugMessage('end() was called again with isRunning already being false.');
      }
    }
    function endWithUpdatedLoadingState() {
      push((0, _explain_log_rate_spikes.updateLoadingStateAction)({
        ccsWarning: false,
        loaded: 1,
        loadingState: _i18n.i18n.translate('xpack.aiops.explainLogRateSpikes.loadingState.doneMessage', {
          defaultMessage: 'Done.'
        })
      }));
      end();
    }
    function pushError(m) {
      logDebugMessage('Push error.');
      push((0, _explain_log_rate_spikes.addErrorAction)(m));
    }
    async function runAnalysis() {
      try {
        var _request$body$overrid, _request$body$overrid4, _request$body$overrid5, _request$body$overrid6, _request$body$overrid7;
        isRunning = true;
        if (!request.body.overrides) {
          logDebugMessage('Full Reset.');
          push((0, _explain_log_rate_spikes.resetAllAction)());
        } else {
          logDebugMessage('Reset Errors.');
          push((0, _explain_log_rate_spikes.resetErrorsAction)());
        }
        if ((_request$body$overrid = request.body.overrides) !== null && _request$body$overrid !== void 0 && _request$body$overrid.loaded) {
          var _request$body$overrid2, _request$body$overrid3;
          logDebugMessage(`Set 'loaded' override to '${(_request$body$overrid2 = request.body.overrides) === null || _request$body$overrid2 === void 0 ? void 0 : _request$body$overrid2.loaded}'.`);
          loaded = (_request$body$overrid3 = request.body.overrides) === null || _request$body$overrid3 === void 0 ? void 0 : _request$body$overrid3.loaded;
        }
        pushPingWithTimeout();

        // Step 1: Index Info: Field candidates, total doc count, sample probability

        const fieldCandidates = [];
        let fieldCandidatesCount = fieldCandidates.length;
        let sampleProbability = 1;
        let totalDocCount = 0;
        if (!((_request$body$overrid4 = request.body.overrides) !== null && _request$body$overrid4 !== void 0 && _request$body$overrid4.remainingFieldCandidates)) {
          logDebugMessage('Fetch index information.');
          push((0, _explain_log_rate_spikes.updateLoadingStateAction)({
            ccsWarning: false,
            loaded,
            loadingState: _i18n.i18n.translate('xpack.aiops.explainLogRateSpikes.loadingState.loadingIndexInformation', {
              defaultMessage: 'Loading index information.'
            })
          }));
          try {
            const indexInfo = await (0, _fetch_index_info.fetchIndexInfo)(client, request.body, abortSignal);
            fieldCandidates.push(...indexInfo.fieldCandidates);
            fieldCandidatesCount = fieldCandidates.length;
            sampleProbability = indexInfo.sampleProbability;
            totalDocCount = indexInfo.totalDocCount;
          } catch (e) {
            if (!(0, _is_request_aborted_error.isRequestAbortedError)(e)) {
              logger.error(`Failed to fetch index information, got: \n${e.toString()}`);
              pushError(`Failed to fetch index information.`);
            }
            end();
            return;
          }
          logDebugMessage(`Total document count: ${totalDocCount}`);
          logDebugMessage(`Sample probability: ${sampleProbability}`);
          loaded += LOADED_FIELD_CANDIDATES;
          pushPingWithTimeout();
          push((0, _explain_log_rate_spikes.updateLoadingStateAction)({
            ccsWarning: false,
            loaded,
            loadingState: _i18n.i18n.translate('xpack.aiops.explainLogRateSpikes.loadingState.identifiedFieldCandidates', {
              defaultMessage: 'Identified {fieldCandidatesCount, plural, one {# field candidate} other {# field candidates}}.',
              values: {
                fieldCandidatesCount
              }
            })
          }));
          if (fieldCandidatesCount === 0) {
            endWithUpdatedLoadingState();
          } else if (shouldStop) {
            logDebugMessage('shouldStop after fetching field candidates.');
            end();
            return;
          }
        }

        // Step 2: Significant Terms

        const changePoints = (_request$body$overrid5 = request.body.overrides) !== null && _request$body$overrid5 !== void 0 && _request$body$overrid5.changePoints ? (_request$body$overrid6 = request.body.overrides) === null || _request$body$overrid6 === void 0 ? void 0 : _request$body$overrid6.changePoints : [];
        const fieldsToSample = new Set();

        // Don't use more than 10 here otherwise Kibana will emit an error
        // regarding a limit of abort signal listeners of more than 10.
        const MAX_CONCURRENT_QUERIES = 10;
        let remainingFieldCandidates;
        let loadingStepSizePValues = PROGRESS_STEP_P_VALUES;
        if ((_request$body$overrid7 = request.body.overrides) !== null && _request$body$overrid7 !== void 0 && _request$body$overrid7.remainingFieldCandidates) {
          var _request$body$overrid8, _request$body$overrid9, _request$body$overrid10, _request$body$overrid11;
          fieldCandidates.push(...((_request$body$overrid8 = request.body.overrides) === null || _request$body$overrid8 === void 0 ? void 0 : _request$body$overrid8.remainingFieldCandidates));
          remainingFieldCandidates = (_request$body$overrid9 = request.body.overrides) === null || _request$body$overrid9 === void 0 ? void 0 : _request$body$overrid9.remainingFieldCandidates;
          fieldCandidatesCount = fieldCandidates.length;
          loadingStepSizePValues = LOADED_FIELD_CANDIDATES + PROGRESS_STEP_P_VALUES - ((_request$body$overrid10 = (_request$body$overrid11 = request.body.overrides) === null || _request$body$overrid11 === void 0 ? void 0 : _request$body$overrid11.loaded) !== null && _request$body$overrid10 !== void 0 ? _request$body$overrid10 : PROGRESS_STEP_P_VALUES);
        } else {
          remainingFieldCandidates = fieldCandidates;
        }
        logDebugMessage('Fetch p-values.');
        const pValuesQueue = (0, _async.queue)(async function (fieldCandidate) {
          loaded += 1 / fieldCandidatesCount * loadingStepSizePValues;
          let pValues;
          try {
            pValues = await (0, _fetch_change_point_p_values.fetchChangePointPValues)(client, request.body, [fieldCandidate], logger, sampleProbability, pushError, abortSignal);
          } catch (e) {
            if (!(0, _is_request_aborted_error.isRequestAbortedError)(e)) {
              logger.error(`Failed to fetch p-values for '${fieldCandidate}', got: \n${e.toString()}`);
              pushError(`Failed to fetch p-values for '${fieldCandidate}'.`);
            }
            return;
          }
          remainingFieldCandidates = remainingFieldCandidates.filter(d => d !== fieldCandidate);
          if (pValues.length > 0) {
            pValues.forEach(d => {
              fieldsToSample.add(d.fieldName);
            });
            changePoints.push(...pValues);
            push((0, _explain_log_rate_spikes.addChangePointsAction)(pValues));
          }
          push((0, _explain_log_rate_spikes.updateLoadingStateAction)({
            ccsWarning: false,
            loaded,
            loadingState: _i18n.i18n.translate('xpack.aiops.explainLogRateSpikes.loadingState.identifiedFieldValuePairs', {
              defaultMessage: 'Identified {fieldValuePairsCount, plural, one {# significant field/value pair} other {# significant field/value pairs}}.',
              values: {
                fieldValuePairsCount: changePoints.length
              }
            }),
            remainingFieldCandidates
          }));
        }, MAX_CONCURRENT_QUERIES);
        pValuesQueue.push(fieldCandidates, err => {
          if (err) {
            logger.error(`Failed to fetch p-values.', got: \n${err.toString()}`);
            pushError(`Failed to fetch p-values.`);
            pValuesQueue.kill();
            end();
          } else if (shouldStop) {
            logDebugMessage('shouldStop fetching p-values.');
            pValuesQueue.kill();
            end();
          }
        });
        await pValuesQueue.drain();
        if (changePoints.length === 0) {
          logDebugMessage('Stopping analysis, did not find change points.');
          endWithUpdatedLoadingState();
          return;
        }
        const histogramFields = [{
          fieldName: request.body.timeFieldName,
          type: _fieldTypes.KBN_FIELD_TYPES.DATE
        }];
        logDebugMessage('Fetch overall histogram.');
        let overallTimeSeries;
        const overallHistogramQuery = (0, _get_histogram_query.getHistogramQuery)(request.body);
        try {
          overallTimeSeries = (await (0, _mlAggUtils.fetchHistogramsForFields)(client, request.body.index, overallHistogramQuery,
          // fields
          histogramFields,
          // samplerShardSize
          -1, undefined, abortSignal, sampleProbability))[0];
        } catch (e) {
          if (!(0, _is_request_aborted_error.isRequestAbortedError)(e)) {
            logger.error(`Failed to fetch the overall histogram data, got: \n${e.toString()}`);
            pushError(`Failed to fetch overall histogram data.`);
          }
          // Still continue the analysis even if loading the overall histogram fails.
        }

        function pushHistogramDataLoadingState() {
          push((0, _explain_log_rate_spikes.updateLoadingStateAction)({
            ccsWarning: false,
            loaded,
            loadingState: _i18n.i18n.translate('xpack.aiops.explainLogRateSpikes.loadingState.loadingHistogramData', {
              defaultMessage: 'Loading histogram data.'
            })
          }));
        }
        if (shouldStop) {
          logDebugMessage('shouldStop after fetching overall histogram.');
          end();
          return;
        }
        if (groupingEnabled) {
          logDebugMessage('Group results.');
          push((0, _explain_log_rate_spikes.updateLoadingStateAction)({
            ccsWarning: false,
            loaded,
            loadingState: _i18n.i18n.translate('xpack.aiops.explainLogRateSpikes.loadingState.groupingResults', {
              defaultMessage: 'Transforming significant field/value pairs into groups.'
            }),
            groupsMissing: true
          }));

          // To optimize the `frequent_items` query, we identify duplicate change points by count attributes.
          // Note this is a compromise and not 100% accurate because there could be change points that
          // have the exact same counts but still don't co-occur.
          const duplicateIdentifier = ['doc_count', 'bg_count', 'total_doc_count', 'total_bg_count'];

          // These are the deduplicated change points we pass to the `frequent_items` aggregation.
          const deduplicatedChangePoints = (0, _fetch_frequent_items.dropDuplicates)(changePoints, duplicateIdentifier);

          // We use the grouped change points to later repopulate
          // the `frequent_items` result with the missing duplicates.
          const groupedChangePoints = (0, _fetch_frequent_items.groupDuplicates)(changePoints, duplicateIdentifier).filter(g => g.group.length > 1);
          try {
            const {
              fields,
              df
            } = await (0, _fetch_frequent_items.fetchFrequentItems)(client, request.body.index, JSON.parse(request.body.searchQuery), deduplicatedChangePoints, request.body.timeFieldName, request.body.deviationMin, request.body.deviationMax, logger, sampleProbability, pushError, abortSignal);
            if (shouldStop) {
              logDebugMessage('shouldStop after fetching frequent_items.');
              end();
              return;
            }
            if (fields.length > 0 && df.length > 0) {
              // The way the `frequent_items` aggregations works could return item sets that include
              // field/value pairs that are not part of the original list of significant change points.
              // This cleans up groups and removes those unrelated field/value pairs.
              const filteredDf = df.map((fi, fiIndex) => {
                const updatedSet = Object.entries(fi.set).reduce((set, [field, value]) => {
                  if (changePoints.some(cp => cp.fieldName === field && cp.fieldValue === value)) {
                    set[field] = value;
                  }
                  return set;
                }, {});

                // only assign the updated reduced set if it doesn't already match
                // an existing set. if there's a match just add an empty set
                // so it will be filtered in the last step.
                fi.set = df.some((d, dIndex) => fiIndex !== dIndex && (0, _lodash.isEqual)(fi.set, d.set)) ? {} : updatedSet;
                fi.size = Object.keys(fi.set).length;
                return fi;
              }).filter(fi => fi.size > 1);

              // `frequent_items` returns lot of different small groups of field/value pairs that co-occur.
              // The following steps analyse these small groups, identify overlap between these groups,
              // and then summarize them in larger groups where possible.

              // Get a tree structure based on `frequent_items`.
              const {
                root
              } = (0, _get_simple_hierarchical_tree.getSimpleHierarchicalTree)(filteredDf, true, false, fields);

              // Each leave of the tree will be a summarized group of co-occuring field/value pairs.
              const treeLeaves = (0, _get_simple_hierarchical_tree.getSimpleHierarchicalTreeLeaves)(root, []);

              // To be able to display a more cleaned up results table in the UI, we identify field/value pairs
              // that occur in multiple groups. This will allow us to highlight field/value pairs that are
              // unique to a group in a better way. This step will also re-add duplicates we identified in the
              // beginning and didn't pass on to the `frequent_items` agg.
              const fieldValuePairCounts = (0, _get_simple_hierarchical_tree.getFieldValuePairCounts)(treeLeaves);
              const changePointGroups = (0, _get_simple_hierarchical_tree.markDuplicates)(treeLeaves, fieldValuePairCounts).map(g => {
                const group = [...g.group];
                for (const groupItem of g.group) {
                  const {
                    duplicate
                  } = groupItem;
                  const duplicates = groupedChangePoints.find(d => d.group.some(dg => dg.fieldName === groupItem.fieldName && dg.fieldValue === groupItem.fieldValue));
                  if (duplicates !== undefined) {
                    group.push(...duplicates.group.map(d => {
                      return {
                        fieldName: d.fieldName,
                        fieldValue: d.fieldValue,
                        duplicate
                      };
                    }));
                  }
                }
                return {
                  ...g,
                  group: (0, _lodash.uniqWith)(group, (a, b) => (0, _lodash.isEqual)(a, b))
                };
              });

              // Some field/value pairs might not be part of the `frequent_items` result set, for example
              // because they don't co-occur with other field/value pairs or because of the limits we set on the query.
              // In this next part we identify those missing pairs and add them as individual groups.
              const missingChangePoints = deduplicatedChangePoints.filter(cp => {
                return !changePointGroups.some(cpg => {
                  return cpg.group.some(d => d.fieldName === cp.fieldName && d.fieldValue === cp.fieldValue);
                });
              });
              changePointGroups.push(...missingChangePoints.map(({
                fieldName,
                fieldValue,
                doc_count: docCount,
                pValue
              }) => {
                const duplicates = groupedChangePoints.find(d => d.group.some(dg => dg.fieldName === fieldName && dg.fieldValue === fieldValue));
                if (duplicates !== undefined) {
                  return {
                    id: `${(0, _mlStringHash.stringHash)(JSON.stringify(duplicates.group.map(d => ({
                      fieldName: d.fieldName,
                      fieldValue: d.fieldValue
                    }))))}`,
                    group: duplicates.group.map(d => ({
                      fieldName: d.fieldName,
                      fieldValue: d.fieldValue,
                      duplicate: false
                    })),
                    docCount,
                    pValue
                  };
                } else {
                  return {
                    id: `${(0, _mlStringHash.stringHash)(JSON.stringify({
                      fieldName,
                      fieldValue
                    }))}`,
                    group: [{
                      fieldName,
                      fieldValue,
                      duplicate: false
                    }],
                    docCount,
                    pValue
                  };
                }
              }));

              // Finally, we'll find out if there's at least one group with at least two items,
              // only then will we return the groups to the clients and make the grouping option available.
              const maxItems = Math.max(...changePointGroups.map(g => g.group.length));
              if (maxItems > 1) {
                push((0, _explain_log_rate_spikes.addChangePointsGroupAction)(changePointGroups));
              }
              loaded += PROGRESS_STEP_GROUPING;
              pushHistogramDataLoadingState();
              if (shouldStop) {
                logDebugMessage('shouldStop after grouping.');
                end();
                return;
              }
              logDebugMessage(`Fetch ${changePointGroups.length} group histograms.`);
              const groupHistogramQueue = (0, _async.queue)(async function (cpg) {
                if (shouldStop) {
                  logDebugMessage('shouldStop abort fetching group histograms.');
                  groupHistogramQueue.kill();
                  end();
                  return;
                }
                if (overallTimeSeries !== undefined) {
                  var _overallTimeSeries$da;
                  const histogramQuery = (0, _get_histogram_query.getHistogramQuery)(request.body, (0, _get_group_filter.getGroupFilter)(cpg));
                  let cpgTimeSeries;
                  try {
                    cpgTimeSeries = (await (0, _mlAggUtils.fetchHistogramsForFields)(client, request.body.index, histogramQuery,
                    // fields
                    [{
                      fieldName: request.body.timeFieldName,
                      type: _fieldTypes.KBN_FIELD_TYPES.DATE,
                      interval: overallTimeSeries.interval,
                      min: overallTimeSeries.stats[0],
                      max: overallTimeSeries.stats[1]
                    }],
                    // samplerShardSize
                    -1, undefined, abortSignal, sampleProbability))[0];
                  } catch (e) {
                    if (!(0, _is_request_aborted_error.isRequestAbortedError)(e)) {
                      logger.error(`Failed to fetch the histogram data for group #${cpg.id}, got: \n${e.toString()}`);
                      pushError(`Failed to fetch the histogram data for group #${cpg.id}.`);
                    }
                    return;
                  }
                  const histogram = (_overallTimeSeries$da = overallTimeSeries.data.map((o, i) => {
                    var _cpgTimeSeries$data$f, _o$key_as_string;
                    const current = (_cpgTimeSeries$data$f = cpgTimeSeries.data.find(d1 => d1.key_as_string === o.key_as_string)) !== null && _cpgTimeSeries$data$f !== void 0 ? _cpgTimeSeries$data$f : {
                      doc_count: 0
                    };
                    return {
                      key: o.key,
                      key_as_string: (_o$key_as_string = o.key_as_string) !== null && _o$key_as_string !== void 0 ? _o$key_as_string : '',
                      doc_count_change_point: current.doc_count,
                      doc_count_overall: Math.max(0, o.doc_count - current.doc_count)
                    };
                  })) !== null && _overallTimeSeries$da !== void 0 ? _overallTimeSeries$da : [];
                  push((0, _explain_log_rate_spikes.addChangePointsGroupHistogramAction)([{
                    id: cpg.id,
                    histogram
                  }]));
                }
              }, MAX_CONCURRENT_QUERIES);
              groupHistogramQueue.push(changePointGroups);
              await groupHistogramQueue.drain();
            }
          } catch (e) {
            if (!(0, _is_request_aborted_error.isRequestAbortedError)(e)) {
              logger.error(`Failed to transform field/value pairs into groups, got: \n${e.toString()}`);
              pushError(`Failed to transform field/value pairs into groups.`);
            }
          }
        }
        loaded += PROGRESS_STEP_HISTOGRAMS_GROUPS;
        logDebugMessage(`Fetch ${changePoints.length} field/value histograms.`);

        // time series filtered by fields
        if (changePoints.length > 0 && overallTimeSeries !== undefined) {
          const fieldValueHistogramQueue = (0, _async.queue)(async function (cp) {
            if (shouldStop) {
              logDebugMessage('shouldStop abort fetching field/value histograms.');
              fieldValueHistogramQueue.kill();
              end();
              return;
            }
            if (overallTimeSeries !== undefined) {
              var _overallTimeSeries$da2;
              const histogramQuery = (0, _get_histogram_query.getHistogramQuery)(request.body, [{
                term: {
                  [cp.fieldName]: cp.fieldValue
                }
              }]);
              let cpTimeSeries;
              try {
                cpTimeSeries = (await (0, _mlAggUtils.fetchHistogramsForFields)(client, request.body.index, histogramQuery,
                // fields
                [{
                  fieldName: request.body.timeFieldName,
                  type: _fieldTypes.KBN_FIELD_TYPES.DATE,
                  interval: overallTimeSeries.interval,
                  min: overallTimeSeries.stats[0],
                  max: overallTimeSeries.stats[1]
                }],
                // samplerShardSize
                -1, undefined, abortSignal, sampleProbability))[0];
              } catch (e) {
                logger.error(`Failed to fetch the histogram data for field/value pair "${cp.fieldName}:${cp.fieldValue}", got: \n${e.toString()}`);
                pushError(`Failed to fetch the histogram data for field/value pair "${cp.fieldName}:${cp.fieldValue}".`);
                return;
              }
              const histogram = (_overallTimeSeries$da2 = overallTimeSeries.data.map((o, i) => {
                var _cpTimeSeries$data$fi, _o$key_as_string2;
                const current = (_cpTimeSeries$data$fi = cpTimeSeries.data.find(d1 => d1.key_as_string === o.key_as_string)) !== null && _cpTimeSeries$data$fi !== void 0 ? _cpTimeSeries$data$fi : {
                  doc_count: 0
                };
                return {
                  key: o.key,
                  key_as_string: (_o$key_as_string2 = o.key_as_string) !== null && _o$key_as_string2 !== void 0 ? _o$key_as_string2 : '',
                  doc_count_change_point: current.doc_count,
                  doc_count_overall: Math.max(0, o.doc_count - current.doc_count)
                };
              })) !== null && _overallTimeSeries$da2 !== void 0 ? _overallTimeSeries$da2 : [];
              const {
                fieldName,
                fieldValue
              } = cp;
              loaded += 1 / changePoints.length * PROGRESS_STEP_HISTOGRAMS;
              pushHistogramDataLoadingState();
              push((0, _explain_log_rate_spikes.addChangePointsHistogramAction)([{
                fieldName,
                fieldValue,
                histogram
              }]));
            }
          }, MAX_CONCURRENT_QUERIES);
          fieldValueHistogramQueue.push(changePoints);
          await fieldValueHistogramQueue.drain();
        }
        endWithUpdatedLoadingState();
      } catch (e) {
        if (!(0, _is_request_aborted_error.isRequestAbortedError)(e)) {
          logger.error(`Explain log rate spikes analysis failed to finish, got: \n${e.toString()}`);
          pushError(`Explain log rate spikes analysis failed to finish.`);
        }
        end();
      }
    }

    // Do not call this using `await` so it will run asynchronously while we return the stream already.
    runAnalysis();
    return response.ok(responseWithHeaders);
  });
};
exports.defineExplainLogRateSpikesRoute = defineExplainLogRateSpikesRoute;