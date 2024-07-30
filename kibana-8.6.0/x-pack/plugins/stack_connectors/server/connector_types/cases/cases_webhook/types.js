"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CasesWebhookMethods = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// config definition
let CasesWebhookMethods; // config
exports.CasesWebhookMethods = CasesWebhookMethods;
(function (CasesWebhookMethods) {
  CasesWebhookMethods["PATCH"] = "patch";
  CasesWebhookMethods["POST"] = "post";
  CasesWebhookMethods["PUT"] = "put";
})(CasesWebhookMethods || (exports.CasesWebhookMethods = CasesWebhookMethods = {}));