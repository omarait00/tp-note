"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIsUserRiskScoreAvailable = exports.createUserRiskEnrichments = void 0;
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

const getIsUserRiskScoreAvailable = async ({
  services,
  spaceId
}) => {
  const isUserRiskScoreIndexExist = await services.scopedClusterClient.asCurrentUser.indices.exists({
    index: (0, _common.getUserRiskIndex)(spaceId)
  });
  return isUserRiskScoreIndexExist;
};
exports.getIsUserRiskScoreAvailable = getIsUserRiskScoreAvailable;
const createUserRiskEnrichments = async ({
  services,
  logger,
  events,
  spaceId
}) => {
  return (0, _create_single_field_match_enrichment.createSingleFieldMatchEnrichment)({
    name: 'User Risk',
    index: [(0, _common.getUserRiskIndex)(spaceId)],
    services,
    logger,
    events,
    mappingField: {
      eventField: 'user.name',
      enrichmentField: _all.RiskScoreFields.userName
    },
    enrichmentResponseFields: [_all.RiskScoreFields.userName, _all.RiskScoreFields.userRisk, _all.RiskScoreFields.userRiskScore],
    createEnrichmentFunction: enrichment => event => {
      const riskLevel = (0, _events.getFieldValue)(enrichment, _all.RiskScoreFields.userRisk);
      const riskScore = (0, _events.getFieldValue)(enrichment, _all.RiskScoreFields.userRiskScore);
      if (!riskLevel && !riskScore) {
        return event;
      }
      const newEvent = (0, _lodash.cloneDeep)(event);
      if (riskLevel) {
        (0, _lodash.set)(newEvent, '_source.user.risk.calculated_level', riskLevel);
      }
      if (riskScore) {
        (0, _lodash.set)(newEvent, '_source.user.risk.calculated_score_norm', riskScore);
      }
      return newEvent;
    }
  });
};
exports.createUserRiskEnrichments = createUserRiskEnrichments;