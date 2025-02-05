"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tlsLegacyAlertFactory = exports.getCertSummary = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _configSchema = require("@kbn/config-schema");
var _common = require("./common");
var _alerts = require("../../../../common/constants/alerts");
var _constants = require("../../../../common/constants");
var _translations = require("./translations");
var _saved_objects = require("../saved_objects/saved_objects");
var _lib = require("../lib");
var _get_certs_request_body = require("../../../../common/requests/get_certs_request_body");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const sortCerts = (a, b) => new Date(a).valueOf() - new Date(b).valueOf();
const mapCertsToSummaryString = (certs, certLimitMessage, maxSummaryItems) => certs.slice(0, maxSummaryItems).map(cert => `${cert.common_name}, ${certLimitMessage(cert)}`).reduce((prev, cur) => prev === '' ? cur : prev.concat(`; ${cur}`), '');
const getValidAfter = ({
  not_after: date
}) => {
  if (!date) return 'Error, missing `certificate_not_valid_after` date.';
  const relativeDate = (0, _moment.default)().diff(date, 'days');
  return relativeDate >= 0 ? _translations.tlsTranslations.validAfterExpiredString(date, relativeDate) : _translations.tlsTranslations.validAfterExpiringString(date, Math.abs(relativeDate));
};
const getValidBefore = ({
  not_before: date
}) => {
  if (!date) return 'Error, missing `certificate_not_valid_before` date.';
  const relativeDate = (0, _moment.default)().diff(date, 'days');
  return relativeDate >= 0 ? _translations.tlsTranslations.validBeforeExpiredString(date, relativeDate) : _translations.tlsTranslations.validBeforeExpiringString(date, Math.abs(relativeDate));
};
const getCertSummary = (certs, expirationThreshold, ageThreshold, maxSummaryItems = 3) => {
  certs.sort((a, b) => {
    var _a$not_after, _b$not_after;
    return sortCerts((_a$not_after = a.not_after) !== null && _a$not_after !== void 0 ? _a$not_after : '', (_b$not_after = b.not_after) !== null && _b$not_after !== void 0 ? _b$not_after : '');
  });
  const expiring = certs.filter(cert => {
    var _cert$not_after;
    return new Date((_cert$not_after = cert.not_after) !== null && _cert$not_after !== void 0 ? _cert$not_after : '').valueOf() < expirationThreshold;
  });
  certs.sort((a, b) => {
    var _a$not_before, _b$not_before;
    return sortCerts((_a$not_before = a.not_before) !== null && _a$not_before !== void 0 ? _a$not_before : '', (_b$not_before = b.not_before) !== null && _b$not_before !== void 0 ? _b$not_before : '');
  });
  const aging = certs.filter(cert => {
    var _cert$not_before;
    return new Date((_cert$not_before = cert.not_before) !== null && _cert$not_before !== void 0 ? _cert$not_before : '').valueOf() < ageThreshold;
  });
  return {
    count: certs.length,
    agingCount: aging.length,
    agingCommonNameAndDate: mapCertsToSummaryString(aging, getValidBefore, maxSummaryItems),
    expiringCommonNameAndDate: mapCertsToSummaryString(expiring, getValidAfter, maxSummaryItems),
    expiringCount: expiring.length,
    hasAging: aging.length > 0 ? true : null,
    hasExpired: expiring.length > 0 ? true : null
  };
};
exports.getCertSummary = getCertSummary;
const tlsLegacyAlertFactory = (_server, libs) => ({
  id: _alerts.CLIENT_ALERT_TYPES.TLS_LEGACY,
  producer: 'uptime',
  name: _translations.tlsTranslations.legacyAlertFactoryName,
  validate: {
    params: _configSchema.schema.object({})
  },
  defaultActionGroupId: _alerts.TLS_LEGACY.id,
  actionGroups: [{
    id: _alerts.TLS_LEGACY.id,
    name: _alerts.TLS_LEGACY.name
  }],
  actionVariables: {
    context: [],
    state: [..._translations.tlsTranslations.actionVariables, ..._translations.commonStateTranslations]
  },
  isExportable: true,
  minimumLicenseRequired: 'basic',
  async executor({
    services: {
      alertFactory,
      scopedClusterClient,
      savedObjectsClient
    },
    state
  }) {
    var _dynamicSettings$cert, _dynamicSettings$cert2;
    const dynamicSettings = await _saved_objects.savedObjectsAdapter.getUptimeDynamicSettings(savedObjectsClient);
    const uptimeEsClient = (0, _lib.createUptimeESClient)({
      esClient: scopedClusterClient.asCurrentUser,
      savedObjectsClient
    });
    const {
      certs,
      total
    } = await libs.requests.getCerts({
      uptimeEsClient,
      from: _get_certs_request_body.DEFAULT_FROM,
      to: _get_certs_request_body.DEFAULT_TO,
      pageIndex: 0,
      size: _get_certs_request_body.DEFAULT_SIZE,
      notValidAfter: `now+${(_dynamicSettings$cert = dynamicSettings === null || dynamicSettings === void 0 ? void 0 : dynamicSettings.certExpirationThreshold) !== null && _dynamicSettings$cert !== void 0 ? _dynamicSettings$cert : _constants.DYNAMIC_SETTINGS_DEFAULTS.certExpirationThreshold}d`,
      notValidBefore: `now-${(_dynamicSettings$cert2 = dynamicSettings === null || dynamicSettings === void 0 ? void 0 : dynamicSettings.certAgeThreshold) !== null && _dynamicSettings$cert2 !== void 0 ? _dynamicSettings$cert2 : _constants.DYNAMIC_SETTINGS_DEFAULTS.certAgeThreshold}d`,
      sortBy: 'common_name',
      direction: 'desc'
    });
    const foundCerts = total > 0;
    if (foundCerts) {
      var _dynamicSettings$cert3, _dynamicSettings$cert4;
      const absoluteExpirationThreshold = (0, _moment.default)().add((_dynamicSettings$cert3 = dynamicSettings.certExpirationThreshold) !== null && _dynamicSettings$cert3 !== void 0 ? _dynamicSettings$cert3 : _constants.DYNAMIC_SETTINGS_DEFAULTS.certExpirationThreshold, 'd').valueOf();
      const absoluteAgeThreshold = (0, _moment.default)().subtract((_dynamicSettings$cert4 = dynamicSettings.certAgeThreshold) !== null && _dynamicSettings$cert4 !== void 0 ? _dynamicSettings$cert4 : _constants.DYNAMIC_SETTINGS_DEFAULTS.certAgeThreshold, 'd').valueOf();
      const alertInstance = alertFactory.create(_alerts.TLS_LEGACY.id);
      const summary = getCertSummary(certs, absoluteExpirationThreshold, absoluteAgeThreshold);
      alertInstance.replaceState({
        ...(0, _common.updateState)(state, foundCerts),
        ...summary
      });
      alertInstance.scheduleActions(_alerts.TLS_LEGACY.id);
    }
    return (0, _common.updateState)(state, foundCerts);
  }
});
exports.tlsLegacyAlertFactory = tlsLegacyAlertFactory;