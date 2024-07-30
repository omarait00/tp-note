"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIsHostRiskScoreAvailable = exports.createHostRiskEnrichments = void 0;
var _lodash = require("lodash");
var _common = require("../../../../../../common/search_strategy/security_solution/risk_score/common");
var _all = require("../../../../../../common/search_strategy/security_solution/risk_score/all");
var _create_single_field_match_enrichment = require("../create_single_field_match_enrichment");
var _events = require("../utils/events");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getIsHostRiskScoreAvailable = async ({
  spaceId,
  services
}) => {
  const isHostRiskScoreIndexExist = await services.scopedClusterClient.asCurrentUser.indices.exists({
    index: (0, _common.getHostRiskIndex)(spaceId)
  });
  return isHostRiskScoreIndexExist;
};
exports.getIsHostRiskScoreAvailable = getIsHostRiskScoreAvailable;
const createHostRiskEnrichments = async ({
  services,
  logger,
  events,
  spaceId
}) => {
  return (0, _create_single_field_match_enrichment.createSingleFieldMatchEnrichment)({
    name: 'Host Risk',
    index: [(0, _common.getHostRiskIndex)(spaceId)],
    services,
    logger,
    events,
    mappingField: {
      eventField: 'host.name',
      enrichmentField: _all.RiskScoreFields.hostName
    },
    enrichmentResponseFields: [_all.RiskScoreFields.hostName, _all.RiskScoreFields.hostRisk, _all.RiskScoreFields.hostRiskScore],
    createEnrichmentFunction: enrichment => event => {
      const riskLevel = (0, _events.getFieldValue)(enrichment, _all.RiskScoreFields.hostRisk);
      const riskScore = (0, _events.getFieldValue)(enrichment, _all.RiskScoreFields.hostRiskScore);
      if (!riskLevel && !riskScore) {
        return event;
      }
      const newEvent = (0, _lodash.cloneDeep)(event);
      if (riskLevel) {
        (0, _lodash.set)(newEvent, '_source.host.risk.calculated_level', riskLevel);
      }
      if (riskScore) {
        (0, _lodash.set)(newEvent, '_source.host.risk.calculated_score_norm', riskScore);
      }
      return newEvent;
    }
  });
};
exports.createHostRiskEnrichments = createHostRiskEnrichments;