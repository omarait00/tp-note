"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSingleFieldMatchEnrichment = void 0;
var _lodash = require("lodash");
var _search_enrichments = require("./search_enrichments");
var _requests = require("./utils/requests");
var _events = require("./utils/events");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_CLAUSES = 1000;
const createSingleFieldMatchEnrichment = async ({
  index,
  services,
  logger,
  events,
  mappingField,
  createEnrichmentFunction,
  name,
  enrichmentResponseFields
}) => {
  try {
    logger.debug(`Enrichment ${name}: started`);
    const eventsWithField = events.filter(event => (0, _events.getEventValue)(event, mappingField.eventField));
    const eventsMapByFieldValue = eventsWithField.reduce((acc, event) => {
      const eventFieldValue = (0, _events.getEventValue)(event, mappingField.eventField);
      if (!eventFieldValue) return {};
      acc[eventFieldValue] ??= [];
      acc[eventFieldValue].push(event);
      return acc;
    }, {});
    const uniqueEventsValuesToSearchBy = Object.keys(eventsMapByFieldValue);
    const chunksUniqueEventsValuesToSearchBy = (0, _lodash.chunk)(uniqueEventsValuesToSearchBy, MAX_CLAUSES);
    const getAllEnrichment = chunksUniqueEventsValuesToSearchBy.map(enrichmentValuesChunk => (0, _requests.makeSingleFieldMatchQuery)({
      values: enrichmentValuesChunk,
      searchByField: mappingField.enrichmentField
    })).filter(query => {
      var _query$query, _query$query$bool, _query$query$bool$sho;
      return ((_query$query = query.query) === null || _query$query === void 0 ? void 0 : (_query$query$bool = _query$query.bool) === null || _query$query$bool === void 0 ? void 0 : (_query$query$bool$sho = _query$query$bool.should) === null || _query$query$bool$sho === void 0 ? void 0 : _query$query$bool$sho.length) > 0;
    }).map(query => (0, _search_enrichments.searchEnrichments)({
      index,
      services,
      logger,
      query,
      fields: enrichmentResponseFields
    }));
    const enrichmentsResults = (await Promise.allSettled(getAllEnrichment)).filter(result => result.status === 'fulfilled').map(result => result === null || result === void 0 ? void 0 : result.value);
    const enrichments = (0, _lodash.flatten)(enrichmentsResults);
    if (enrichments.length === 0) {
      logger.debug(`Enrichment ${name}: no enrichment found`);
      return {};
    }
    const eventsMapById = enrichments.reduce((acc, enrichment) => {
      const enrichmentValue = (0, _events.getFieldValue)(enrichment, mappingField.enrichmentField);
      if (!enrichmentValue) return acc;
      const eventsWithoutEnrchment = eventsMapByFieldValue[enrichmentValue];
      eventsWithoutEnrchment === null || eventsWithoutEnrchment === void 0 ? void 0 : eventsWithoutEnrchment.forEach(event => {
        acc[event._id] = [createEnrichmentFunction(enrichment)];
      });
      return acc;
    }, {});
    logger.debug(`Enrichment ${name}: return ${Object.keys(eventsMapById).length} events ready to be enriched`);
    return eventsMapById;
  } catch (error) {
    logger.error(`Enrichment ${name}: throw error ${error}`);
    return {};
  }
};
exports.createSingleFieldMatchEnrichment = createSingleFieldMatchEnrichment;