"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UptimeConnectorFeatureId = exports.UptimeConnectorFeature = exports.SecuritySolutionFeature = exports.SecurityConnectorFeatureId = exports.CasesConnectorFeatureId = exports.CasesConnectorFeature = exports.AlertingConnectorFeatureId = exports.AlertingConnectorFeature = void 0;
exports.areValidFeatures = areValidFeatures;
exports.getConnectorCompatibility = getConnectorCompatibility;
exports.getConnectorFeatureName = getConnectorFeatureName;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const AlertingConnectorFeatureId = 'alerting';
exports.AlertingConnectorFeatureId = AlertingConnectorFeatureId;
const CasesConnectorFeatureId = 'cases';
exports.CasesConnectorFeatureId = CasesConnectorFeatureId;
const UptimeConnectorFeatureId = 'uptime';
exports.UptimeConnectorFeatureId = UptimeConnectorFeatureId;
const SecurityConnectorFeatureId = 'siem';
exports.SecurityConnectorFeatureId = SecurityConnectorFeatureId;
const compatibilityAlertingRules = _i18n.i18n.translate('xpack.actions.availableConnectorFeatures.compatibility.alertingRules', {
  defaultMessage: 'Alerting Rules'
});
const compatibilityCases = _i18n.i18n.translate('xpack.actions.availableConnectorFeatures.compatibility.cases', {
  defaultMessage: 'Cases'
});
const AlertingConnectorFeature = {
  id: AlertingConnectorFeatureId,
  name: _i18n.i18n.translate('xpack.actions.availableConnectorFeatures.alerting', {
    defaultMessage: 'Alerting'
  }),
  compatibility: compatibilityAlertingRules
};
exports.AlertingConnectorFeature = AlertingConnectorFeature;
const CasesConnectorFeature = {
  id: CasesConnectorFeatureId,
  name: _i18n.i18n.translate('xpack.actions.availableConnectorFeatures.cases', {
    defaultMessage: 'Cases'
  }),
  compatibility: compatibilityCases
};
exports.CasesConnectorFeature = CasesConnectorFeature;
const UptimeConnectorFeature = {
  id: UptimeConnectorFeatureId,
  name: _i18n.i18n.translate('xpack.actions.availableConnectorFeatures.uptime', {
    defaultMessage: 'Uptime'
  }),
  compatibility: compatibilityAlertingRules
};
exports.UptimeConnectorFeature = UptimeConnectorFeature;
const SecuritySolutionFeature = {
  id: SecurityConnectorFeatureId,
  name: _i18n.i18n.translate('xpack.actions.availableConnectorFeatures.securitySolution', {
    defaultMessage: 'Security Solution'
  }),
  compatibility: compatibilityAlertingRules
};
exports.SecuritySolutionFeature = SecuritySolutionFeature;
const AllAvailableConnectorFeatures = {
  [AlertingConnectorFeature.id]: AlertingConnectorFeature,
  [CasesConnectorFeature.id]: CasesConnectorFeature,
  [UptimeConnectorFeature.id]: UptimeConnectorFeature,
  [SecuritySolutionFeature.id]: SecuritySolutionFeature
};
function areValidFeatures(ids) {
  return ids.every(id => !!AllAvailableConnectorFeatures[id]);
}
function getConnectorFeatureName(id) {
  const featureConfig = AllAvailableConnectorFeatures[id];
  return featureConfig ? featureConfig.name : id;
}
function getConnectorCompatibility(featureIds) {
  const compatibility = new Set();
  if (featureIds && featureIds.length > 0) {
    for (const featureId of featureIds) {
      if (AllAvailableConnectorFeatures[featureId]) {
        compatibility.add(AllAvailableConnectorFeatures[featureId].compatibility);
      }
    }
  }
  return Array.from(compatibility);
}