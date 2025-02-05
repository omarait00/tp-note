"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWellKnownEmailServiceRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _wellKnown = _interopRequireDefault(require("nodemailer/lib/well-known"));
var _common = require("../../common");
var _email = require("../connector_types/stack/email");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramSchema = _configSchema.schema.object({
  service: _configSchema.schema.string()
});
const getWellKnownEmailServiceRoute = router => {
  router.get({
    path: `${_common.INTERNAL_BASE_STACK_CONNECTORS_API_PATH}/_email_config/{service}`,
    validate: {
      params: paramSchema
    }
  }, handler);
  async function handler(ctx, req, res) {
    const {
      service
    } = req.params;
    let response = {};
    if (service === _common.AdditionalEmailServices.ELASTIC_CLOUD) {
      response = _email.ELASTIC_CLOUD_SERVICE;
    } else {
      const serviceEntry = (0, _wellKnown.default)(service);
      if (serviceEntry) {
        response = {
          host: serviceEntry.host,
          port: serviceEntry.port,
          secure: serviceEntry.secure
        };
      }
    }
    return res.ok({
      body: response
    });
  }
};
exports.getWellKnownEmailServiceRoute = getWellKnownEmailServiceRoute;