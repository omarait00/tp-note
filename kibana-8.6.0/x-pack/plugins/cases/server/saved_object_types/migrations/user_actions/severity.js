"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSeverityToCreateUserAction = void 0;
var _api = require("../../../../common/api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const addSeverityToCreateUserAction = doc => {
  var _doc$attributes$paylo, _doc$attributes, _doc$attributes$paylo2, _doc$references2;
  if (doc.attributes.type !== _api.ActionTypes.create_case) {
    var _doc$references;
    return {
      ...doc,
      references: (_doc$references = doc.references) !== null && _doc$references !== void 0 ? _doc$references : []
    };
  }
  const payload = {
    ...doc.attributes.payload,
    severity: (_doc$attributes$paylo = doc === null || doc === void 0 ? void 0 : (_doc$attributes = doc.attributes) === null || _doc$attributes === void 0 ? void 0 : (_doc$attributes$paylo2 = _doc$attributes.payload) === null || _doc$attributes$paylo2 === void 0 ? void 0 : _doc$attributes$paylo2.severity) !== null && _doc$attributes$paylo !== void 0 ? _doc$attributes$paylo : _api.CaseSeverity.LOW
  };
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      payload
    },
    references: (_doc$references2 = doc.references) !== null && _doc$references2 !== void 0 ? _doc$references2 : []
  };
};
exports.addSeverityToCreateUserAction = addSeverityToCreateUserAction;