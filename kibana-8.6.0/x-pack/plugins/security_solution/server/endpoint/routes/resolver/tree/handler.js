"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleTree = handleTree;
var _rxjs = require("rxjs");
var _feature_usage = require("../../../services/feature_usage");
var _fetch = require("./utils/fetch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function handleTree(ruleRegistry, config, licensing) {
  return async (context, req, res) => {
    const client = (await context.core).elasticsearch.client;
    const {
      experimentalFeatures: {
        insightsRelatedAlertsByProcessAncestry
      }
    } = config;
    const license = await (0, _rxjs.firstValueFrom)(licensing.license$);
    const hasAccessToInsightsRelatedByProcessAncestry = insightsRelatedAlertsByProcessAncestry && license.hasAtLeast('platinum');
    if (hasAccessToInsightsRelatedByProcessAncestry) {
      _feature_usage.featureUsageService.notifyUsage('ALERTS_BY_PROCESS_ANCESTRY');
    }
    const alertsClient = hasAccessToInsightsRelatedByProcessAncestry ? await ruleRegistry.getRacClientWithRequest(req) : undefined;
    const fetcher = new _fetch.Fetcher(client, alertsClient);
    const body = await fetcher.tree(req.body);
    return res.ok({
      body
    });
  };
}