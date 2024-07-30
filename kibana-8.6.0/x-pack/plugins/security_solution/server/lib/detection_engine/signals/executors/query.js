"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryExecutor = void 0;
var _rxjs = require("rxjs");
var _get_filter = require("../get_filter");
var _group_and_bulk_create = require("../alert_suppression/group_and_bulk_create");
var _search_after_bulk_create = require("../search_after_bulk_create");
var _reason_formatters = require("../reason_formatters");
var _with_security_span = require("../../../../utils/with_security_span");
var _schedule_notification_response_actions = require("../../rule_response_actions/schedule_notification_response_actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const queryExecutor = async ({
  runOpts,
  experimentalFeatures,
  eventsTelemetry,
  services,
  version,
  spaceId,
  bucketHistory,
  osqueryCreateAction,
  licensing
}) => {
  const completeRule = runOpts.completeRule;
  const ruleParams = completeRule.ruleParams;
  return (0, _with_security_span.withSecuritySpan)('queryExecutor', async () => {
    var _ruleParams$alertSupp;
    const esFilter = await (0, _get_filter.getFilter)({
      type: ruleParams.type,
      filters: ruleParams.filters,
      language: ruleParams.language,
      query: ruleParams.query,
      savedId: ruleParams.savedId,
      services,
      index: runOpts.inputIndex,
      exceptionFilter: runOpts.exceptionFilter
    });
    const license = await (0, _rxjs.firstValueFrom)(licensing.license$);
    const hasPlatinumLicense = license.hasAtLeast('platinum');
    const hasGoldLicense = license.hasAtLeast('gold');
    const result = ((_ruleParams$alertSupp = ruleParams.alertSuppression) === null || _ruleParams$alertSupp === void 0 ? void 0 : _ruleParams$alertSupp.groupBy) != null && hasPlatinumLicense ? await (0, _group_and_bulk_create.groupAndBulkCreate)({
      runOpts,
      services,
      spaceId,
      filter: esFilter,
      buildReasonMessage: _reason_formatters.buildReasonMessageForQueryAlert,
      bucketHistory,
      groupByFields: ruleParams.alertSuppression.groupBy
    }) : {
      ...(await (0, _search_after_bulk_create.searchAfterAndBulkCreate)({
        tuple: runOpts.tuple,
        exceptionsList: runOpts.unprocessedExceptions,
        services,
        listClient: runOpts.listClient,
        ruleExecutionLogger: runOpts.ruleExecutionLogger,
        eventsTelemetry,
        inputIndexPattern: runOpts.inputIndex,
        pageSize: runOpts.searchAfterSize,
        filter: esFilter,
        buildReasonMessage: _reason_formatters.buildReasonMessageForQueryAlert,
        bulkCreate: runOpts.bulkCreate,
        wrapHits: runOpts.wrapHits,
        runtimeMappings: runOpts.runtimeMappings,
        primaryTimestamp: runOpts.primaryTimestamp,
        secondaryTimestamp: runOpts.secondaryTimestamp
      })),
      state: {}
    };
    if (hasGoldLicense) {
      var _completeRule$rulePar;
      if ((_completeRule$rulePar = completeRule.ruleParams.responseActions) !== null && _completeRule$rulePar !== void 0 && _completeRule$rulePar.length && result.createdSignalsCount) {
        (0, _schedule_notification_response_actions.scheduleNotificationResponseActions)({
          signals: result.createdSignals,
          responseActions: completeRule.ruleParams.responseActions
        }, osqueryCreateAction);
      }
    }
    return result;
  });
};
exports.queryExecutor = queryExecutor;