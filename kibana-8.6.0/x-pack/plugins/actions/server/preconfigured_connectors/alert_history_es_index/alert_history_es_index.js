"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlertHistoryEsIndex = getAlertHistoryEsIndex;
var _i18n = require("@kbn/i18n");
var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const EsIndexActionTypeId = '.index';
function getAlertHistoryEsIndex() {
  return Object.freeze({
    name: _i18n.i18n.translate('xpack.actions.alertHistoryEsIndexConnector.name', {
      defaultMessage: 'Alert history Elasticsearch index'
    }),
    actionTypeId: EsIndexActionTypeId,
    id: _common.AlertHistoryEsIndexConnectorId,
    isPreconfigured: true,
    isDeprecated: false,
    config: {
      index: _common.AlertHistoryDefaultIndexName
    },
    secrets: {}
  });
}