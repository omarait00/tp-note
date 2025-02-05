"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timelineEventsDetails = void 0;
var _fp = require("lodash/fp");
var _build_query = require("../../../../../utils/build_query");
var _queryEvents_details = require("./query.events_details.dsl");
var _field_formatters = require("../../../../../../common/utils/field_formatters");
var _build_ecs_objects = require("../../helpers/build_ecs_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const timelineEventsDetails = {
  buildDsl: ({
    authFilter,
    ...options
  }) => {
    const {
      indexName,
      eventId,
      runtimeMappings = {}
    } = options;
    return (0, _queryEvents_details.buildTimelineDetailsQuery)({
      indexName,
      id: eventId,
      runtimeMappings,
      authFilter
    });
  },
  parse: async (options, response) => {
    var _response$rawResponse;
    const {
      indexName,
      eventId,
      runtimeMappings = {}
    } = options;
    const {
      fields,
      ...hitsData
    } = (_response$rawResponse = response.rawResponse.hits.hits[0]) !== null && _response$rawResponse !== void 0 ? _response$rawResponse : {};
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryEvents_details.buildTimelineDetailsQuery)({
        indexName,
        id: eventId,
        runtimeMappings
      }))]
    };
    if (response.isRunning) {
      return {
        ...response,
        data: [],
        inspect
      };
    }
    const fieldsData = await (0, _field_formatters.getDataSafety)(_field_formatters.getDataFromFieldsHits, (0, _fp.merge)(fields, hitsData));
    const rawEventData = response.rawResponse.hits.hits[0];
    const ecs = (0, _build_ecs_objects.buildEcsObjects)(rawEventData);
    return {
      ...response,
      data: fieldsData,
      ecs,
      inspect,
      rawEventData
    };
  }
};
exports.timelineEventsDetails = timelineEventsDetails;