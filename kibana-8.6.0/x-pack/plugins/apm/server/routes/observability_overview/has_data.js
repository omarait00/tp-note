"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHasData = getHasData;
var _common = require("../../../../observability/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getHasData({
  indices,
  apmEventClient
}) {
  try {
    const params = {
      apm: {
        events: [_common.ProcessorEvent.transaction, _common.ProcessorEvent.error, _common.ProcessorEvent.metric]
      },
      terminate_after: 1,
      body: {
        track_total_hits: 1,
        size: 0
      }
    };
    const response = await apmEventClient.search('observability_overview_has_apm_data', params);
    return {
      hasData: response.hits.total.value > 0,
      indices
    };
  } catch (e) {
    return {
      hasData: false,
      indices
    };
  }
}