"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderParameterTemplates = void 0;
var _fp = require("lodash/fp");
var _constants = require("../../../../common/connector_types/security/tines/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const renderParameterTemplates = (params, variables) => {
  if ((params === null || params === void 0 ? void 0 : params.subAction) !== _constants.SUB_ACTION.RUN) return params;
  let body;
  try {
    var _variables$context;
    let bodyObject;
    const alerts = variables === null || variables === void 0 ? void 0 : (_variables$context = variables.context) === null || _variables$context === void 0 ? void 0 : _variables$context.alerts;
    if (alerts) {
      // Remove the "kibana" entry from all alerts to reduce weight, the same data can be found in other parts of the alert object.
      bodyObject = (0, _fp.set)('context.alerts', alerts.map(({
        kibana,
        ...alert
      }) => alert), variables);
    } else {
      bodyObject = variables;
    }
    body = JSON.stringify(bodyObject);
  } catch (err) {
    body = JSON.stringify({
      error: {
        message: err.message
      }
    });
  }
  return (0, _fp.set)('subActionParams.body', body, params);
};
exports.renderParameterTemplates = renderParameterTemplates;