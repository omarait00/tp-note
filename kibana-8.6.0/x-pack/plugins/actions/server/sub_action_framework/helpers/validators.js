"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.urlAllowListValidator = void 0;
var _i18n = require("@kbn/i18n");
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const urlAllowListValidator = urlKey => {
  return (obj, validatorServices) => {
    const {
      configurationUtilities
    } = validatorServices;
    try {
      const url = (0, _lodash.get)(obj, urlKey, '');
      configurationUtilities.ensureUriAllowed(url);
    } catch (allowListError) {
      throw new Error(_i18n.i18n.translate('xpack.actions.subActionsFramework.urlValidationError', {
        defaultMessage: 'error validating url: {message}',
        values: {
          message: allowListError.message
        }
      }));
    }
  };
};
exports.urlAllowListValidator = urlAllowListValidator;