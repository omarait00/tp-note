"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processorEventsToIndex = processorEventsToIndex;
exports.unpackProcessorEvents = unpackProcessorEvents;
var _lodash = require("lodash");
var _common = require("../../../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const processorEventIndexMap = {
  [_common.ProcessorEvent.transaction]: 'transaction',
  [_common.ProcessorEvent.span]: 'span',
  [_common.ProcessorEvent.metric]: 'metric',
  [_common.ProcessorEvent.error]: 'error'
};
function processorEventsToIndex(events, indices) {
  return (0, _lodash.uniq)(events.map(event => indices[processorEventIndexMap[event]]));
}
function unpackProcessorEvents(request, indices) {
  const {
    apm,
    ...params
  } = request;
  const events = (0, _lodash.uniq)(apm.events);
  const index = processorEventsToIndex(events, indices);
  const withFilterForProcessorEvent = (0, _lodash.defaultsDeep)((0, _lodash.cloneDeep)(params), {
    body: {
      query: {
        bool: {
          filter: []
        }
      }
    }
  });
  withFilterForProcessorEvent.body.query.bool.filter.push({
    terms: {
      [_elasticsearch_fieldnames.PROCESSOR_EVENT]: events
    }
  });
  return {
    index,
    ...withFilterForProcessorEvent
  };
}