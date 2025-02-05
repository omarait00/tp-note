"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleEvents = handleEvents;
var _events = require("./queries/events");
var _pagination = require("./utils/pagination");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates an object that the events handler would return
 *
 * @param events array of events
 * @param nextEvent the cursor to retrieve the next event
 */
function createEvents(events = [], nextEvent = null) {
  return {
    events,
    nextEvent
  };
}

/**
 * This function handles the `/events` api and returns an array of events and a cursor if more events exist than were
 * requested.
 */
function handleEvents(ruleRegistry) {
  return async (context, req, res) => {
    const {
      query: {
        limit,
        afterEvent
      },
      body
    } = req;
    const eventsClient = (await context.core).elasticsearch.client;
    const alertsClient = await ruleRegistry.getRacClientWithRequest(req);
    const eventsQuery = new _events.EventsQuery({
      pagination: _pagination.PaginationBuilder.createBuilder(limit, afterEvent),
      indexPatterns: body.indexPatterns,
      timeRange: body.timeRange
    });
    const results = await eventsQuery.search(eventsClient, body, alertsClient);
    return res.ok({
      body: createEvents(results, _pagination.PaginationBuilder.buildCursorRequestLimit(limit, results))
    });
  };
}