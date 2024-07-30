"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNewTermsAlertType = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _constants = require("../../../../../common/constants");
var _rule_schema = require("../../rule_schema");
var _single_search_after = require("../../signals/single_search_after");
var _get_filter = require("../../signals/get_filter");
var _wrap_new_terms_alerts = require("../factories/utils/wrap_new_terms_alerts");
var _build_new_terms_aggregation = require("./build_new_terms_aggregation");
var _utils = require("../utils");
var _utils2 = require("./utils");
var _utils3 = require("../../signals/utils");
var _enrichments = require("../../signals/enrichments");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createNewTermsAlertType = createOptions => {
  const {
    logger
  } = createOptions;
  return {
    id: _securitysolutionRules.NEW_TERMS_RULE_TYPE_ID,
    name: 'New Terms Rule',
    validate: {
      params: {
        validate: object => {
          const [validated, errors] = (0, _securitysolutionIoTsUtils.validateNonExact)(object, _rule_schema.newTermsRuleParams);
          if (errors != null) {
            throw new Error(errors);
          }
          if (validated == null) {
            throw new Error('Validation of rule params failed');
          }
          (0, _utils2.validateHistoryWindowStart)({
            historyWindowStart: validated.historyWindowStart,
            from: validated.from
          });
          return validated;
        },
        /**
         * validate rule params when rule is bulk edited (update and created in future as well)
         * returned params can be modified (useful in case of version increment)
         * @param mutatedRuleParams
         * @returns mutatedRuleParams
         */
        validateMutatedParams: mutatedRuleParams => {
          (0, _utils.validateIndexPatterns)(mutatedRuleParams.index);
          return mutatedRuleParams;
        }
      }
    },
    actionGroups: [{
      id: 'default',
      name: 'Default'
    }],
    defaultActionGroupId: 'default',
    actionVariables: {
      context: [{
        name: 'server',
        description: 'the server'
      }]
    },
    minimumLicenseRequired: 'basic',
    isExportable: false,
    producer: _constants.SERVER_APP_ID,
    async executor(execOptions) {
      const {
        runOpts: {
          ruleExecutionLogger,
          bulkCreate,
          completeRule,
          tuple,
          mergeStrategy,
          inputIndex,
          runtimeMappings,
          primaryTimestamp,
          secondaryTimestamp,
          aggregatableTimestampField,
          exceptionFilter,
          unprocessedExceptions,
          alertTimestampOverride
        },
        services,
        params,
        spaceId,
        state
      } = execOptions;

      // Validate the history window size compared to `from` at runtime as well as in the `validate`
      // function because rule preview does not use the `validate` function defined on the rule type
      (0, _utils2.validateHistoryWindowStart)({
        historyWindowStart: params.historyWindowStart,
        from: params.from
      });
      const esFilter = await (0, _get_filter.getFilter)({
        filters: params.filters,
        index: inputIndex,
        language: params.language,
        savedId: undefined,
        services,
        type: params.type,
        query: params.query,
        exceptionFilter
      });
      const parsedHistoryWindowSize = (0, _utils2.parseDateString)({
        date: params.historyWindowStart,
        forceNow: tuple.to.toDate(),
        name: 'historyWindowStart'
      });
      let afterKey;
      const result = (0, _utils3.createSearchAfterReturnType)();
      const exceptionsWarning = (0, _utils3.getUnprocessedExceptionsWarnings)(unprocessedExceptions);
      if (exceptionsWarning) {
        result.warningMessages.push(exceptionsWarning);
      }

      // There are 2 conditions that mean we're finished: either there were still too many alerts to create
      // after deduplication and the array of alerts was truncated before being submitted to ES, or there were
      // exactly enough new alerts to hit maxSignals without truncating the array of alerts. We check both because
      // it's possible for the array to be truncated but alert documents could fail to be created for other reasons,
      // in which case createdSignalsCount would still be less than maxSignals. Since valid alerts were truncated from
      // the array in that case, we stop and report the errors.
      while (result.createdSignalsCount < params.maxSignals) {
        // PHASE 1: Fetch a page of terms using a composite aggregation. This will collect a page from
        // all of the terms seen over the last rule interval. In the next phase we'll determine which
        // ones are new.
        const {
          searchResult,
          searchDuration,
          searchErrors
        } = await (0, _single_search_after.singleSearchAfter)({
          aggregations: (0, _build_new_terms_aggregation.buildRecentTermsAgg)({
            fields: params.newTermsFields,
            after: afterKey
          }),
          searchAfterSortIds: undefined,
          index: inputIndex,
          // The time range for the initial composite aggregation is the rule interval, `from` and `to`
          from: tuple.from.toISOString(),
          to: tuple.to.toISOString(),
          services,
          ruleExecutionLogger,
          filter: esFilter,
          pageSize: 0,
          primaryTimestamp,
          secondaryTimestamp,
          runtimeMappings
        });
        const searchResultWithAggs = searchResult;
        if (!searchResultWithAggs.aggregations) {
          throw new Error('Aggregations were missing on recent terms search result');
        }
        logger.debug(`Time spent on composite agg: ${searchDuration}`);
        result.searchAfterTimes.push(searchDuration);
        result.errors.push(...searchErrors);
        afterKey = searchResultWithAggs.aggregations.new_terms.after_key;

        // If the aggregation returns no after_key it signals that we've paged through all results
        // and the current page is empty so we can immediately break.
        if (afterKey == null) {
          break;
        }
        const bucketsForField = searchResultWithAggs.aggregations.new_terms.buckets;
        const includeValues = (0, _utils2.transformBucketsToValues)(params.newTermsFields, bucketsForField);
        const newTermsRuntimeMappings = (0, _utils2.getNewTermsRuntimeMappings)(params.newTermsFields, bucketsForField);

        // PHASE 2: Take the page of results from Phase 1 and determine if each term exists in the history window.
        // The aggregation filters out buckets for terms that exist prior to `tuple.from`, so the buckets in the
        // response correspond to each new term.
        const {
          searchResult: pageSearchResult,
          searchDuration: pageSearchDuration,
          searchErrors: pageSearchErrors
        } = await (0, _single_search_after.singleSearchAfter)({
          aggregations: (0, _build_new_terms_aggregation.buildNewTermsAgg)({
            newValueWindowStart: tuple.from,
            timestampField: aggregatableTimestampField,
            field: (0, _utils2.getAggregationField)(params.newTermsFields),
            include: includeValues
          }),
          runtimeMappings: {
            ...runtimeMappings,
            ...newTermsRuntimeMappings
          },
          searchAfterSortIds: undefined,
          index: inputIndex,
          // For Phase 2, we expand the time range to aggregate over the history window
          // in addition to the rule interval
          from: parsedHistoryWindowSize.toISOString(),
          to: tuple.to.toISOString(),
          services,
          ruleExecutionLogger,
          filter: esFilter,
          pageSize: 0,
          primaryTimestamp,
          secondaryTimestamp
        });
        result.searchAfterTimes.push(pageSearchDuration);
        result.errors.push(...pageSearchErrors);
        logger.debug(`Time spent on phase 2 terms agg: ${pageSearchDuration}`);
        const pageSearchResultWithAggs = pageSearchResult;
        if (!pageSearchResultWithAggs.aggregations) {
          throw new Error('Aggregations were missing on new terms search result');
        }

        // PHASE 3: For each term that is not in the history window, fetch the oldest document in
        // the rule interval for that term. This is the first document to contain the new term, and will
        // become the basis of the resulting alert.
        // One document could become multiple alerts if the document contains an array with multiple new terms.
        if (pageSearchResultWithAggs.aggregations.new_terms.buckets.length > 0) {
          const actualNewTerms = pageSearchResultWithAggs.aggregations.new_terms.buckets.map(bucket => bucket.key);
          const {
            searchResult: docFetchSearchResult,
            searchDuration: docFetchSearchDuration,
            searchErrors: docFetchSearchErrors
          } = await (0, _single_search_after.singleSearchAfter)({
            aggregations: (0, _build_new_terms_aggregation.buildDocFetchAgg)({
              timestampField: aggregatableTimestampField,
              field: (0, _utils2.getAggregationField)(params.newTermsFields),
              include: actualNewTerms
            }),
            runtimeMappings: {
              ...runtimeMappings,
              ...newTermsRuntimeMappings
            },
            searchAfterSortIds: undefined,
            index: inputIndex,
            // For phase 3, we go back to aggregating only over the rule interval - excluding the history window
            from: tuple.from.toISOString(),
            to: tuple.to.toISOString(),
            services,
            ruleExecutionLogger,
            filter: esFilter,
            pageSize: 0,
            primaryTimestamp,
            secondaryTimestamp
          });
          result.searchAfterTimes.push(docFetchSearchDuration);
          result.errors.push(...docFetchSearchErrors);
          const docFetchResultWithAggs = docFetchSearchResult;
          if (!docFetchResultWithAggs.aggregations) {
            throw new Error('Aggregations were missing on document fetch search result');
          }
          const eventsAndTerms = docFetchResultWithAggs.aggregations.new_terms.buckets.map(bucket => {
            const newTerms = (0, _utils2.decodeMatchedValues)(params.newTermsFields, bucket.key);
            return {
              event: bucket.docs.hits.hits[0],
              newTerms
            };
          });
          const wrappedAlerts = (0, _wrap_new_terms_alerts.wrapNewTermsAlerts)({
            eventsAndTerms,
            spaceId,
            completeRule,
            mergeStrategy,
            indicesToQuery: inputIndex,
            alertTimestampOverride
          });
          const bulkCreateResult = await bulkCreate(wrappedAlerts, params.maxSignals - result.createdSignalsCount, (0, _enrichments.createEnrichEventsFunction)({
            services,
            logger: ruleExecutionLogger
          }));
          (0, _utils3.addToSearchAfterReturn)({
            current: result,
            next: bulkCreateResult
          });
          if (bulkCreateResult.alertsWereTruncated) {
            break;
          }
        }
      }
      return {
        ...result,
        state
      };
    }
  };
};
exports.createNewTermsAlertType = createNewTermsAlertType;