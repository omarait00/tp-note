"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enrichEvents = exports.createEnrichEventsFunction = void 0;
var _host_risk = require("./enrichment_by_type/host_risk");
var _user_risk = require("./enrichment_by_type/user_risk");
var _transforms = require("./utils/transforms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const enrichEvents = async ({
  services,
  logger,
  events,
  spaceId
}) => {
  try {
    const enrichments = [];
    logger.debug('Alert enrichments started');
    const [isHostRiskScoreIndexExist, isUserRiskScoreIndexExist] = await Promise.all([(0, _host_risk.getIsHostRiskScoreAvailable)({
      spaceId,
      services
    }), (0, _user_risk.getIsUserRiskScoreAvailable)({
      spaceId,
      services
    })]);
    if (isHostRiskScoreIndexExist) {
      enrichments.push((0, _host_risk.createHostRiskEnrichments)({
        services,
        logger,
        events,
        spaceId
      }));
    }
    if (isUserRiskScoreIndexExist) {
      enrichments.push((0, _user_risk.createUserRiskEnrichments)({
        services,
        logger,
        events,
        spaceId
      }));
    }
    const allEnrichmentsResults = await Promise.allSettled(enrichments);
    const allFulfilledEnrichmentsResults = allEnrichmentsResults.filter(result => result.status === 'fulfilled').map(result => result === null || result === void 0 ? void 0 : result.value);
    return (0, _transforms.applyEnrichmentsToEvents)({
      events,
      enrichmentsList: allFulfilledEnrichmentsResults,
      logger
    });
  } catch (error) {
    logger.error(`Enrichments failed ${error}`);
    return events;
  }
};
exports.enrichEvents = enrichEvents;
const createEnrichEventsFunction = ({
  services,
  logger
}) => (events, {
  spaceId
}) => enrichEvents({
  events,
  services,
  logger,
  spaceId
});
exports.createEnrichEventsFunction = createEnrichEventsFunction;