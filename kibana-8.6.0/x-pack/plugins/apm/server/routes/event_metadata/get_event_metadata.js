"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventMetadata = getEventMetadata;
var _common = require("../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getEventMetadata({
  apmEventClient,
  processorEvent,
  id
}) {
  const filter = [];
  switch (processorEvent) {
    case _common.ProcessorEvent.error:
      filter.push({
        term: {
          [_elasticsearch_fieldnames.ERROR_ID]: id
        }
      });
      break;
    case _common.ProcessorEvent.transaction:
      filter.push({
        term: {
          [_elasticsearch_fieldnames.TRANSACTION_ID]: id
        }
      });
      break;
    case _common.ProcessorEvent.span:
      filter.push({
        term: {
          [_elasticsearch_fieldnames.SPAN_ID]: id
        }
      });
      break;
  }
  const response = await apmEventClient.search('get_event_metadata', {
    apm: {
      events: [processorEvent]
    },
    body: {
      track_total_hits: false,
      query: {
        bool: {
          filter
        }
      },
      size: 1,
      _source: false,
      fields: [{
        field: '*',
        include_unmapped: true
      }]
    },
    terminate_after: 1
  });
  return response.hits.hits[0].fields;
}