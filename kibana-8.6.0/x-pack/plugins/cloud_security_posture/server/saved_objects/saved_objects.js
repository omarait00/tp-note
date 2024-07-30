"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSavedObjects = setupSavedObjects;
var _i18n = require("@kbn/i18n");
var _mappings = require("./mappings");
var _migrations = require("./migrations");
var _schemas = require("../../common/schemas");
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function setupSavedObjects(savedObjects) {
  savedObjects.registerType({
    name: _constants.CSP_RULE_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: true,
      visibleInManagement: true,
      getTitle: savedObject => `${_i18n.i18n.translate('xpack.csp.cspSettings.rules', {
        defaultMessage: `CSP Security Rules - `
      })} ${savedObject.attributes.metadata.benchmark.name} ${savedObject.attributes.metadata.benchmark.version} ${savedObject.attributes.metadata.name}`
    },
    schemas: {
      '8.3.0': _schemas.cspRuleSchemaV830,
      '8.4.0': _schemas.cspRuleSchemaV840
    },
    migrations: _migrations.cspRuleMigrations,
    mappings: _mappings.cspRuleSavedObjectMapping
  });
  savedObjects.registerType({
    name: _constants.CSP_RULE_TEMPLATE_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: true,
      visibleInManagement: true
    },
    schemas: {
      '8.3.0': _schemas.cspRuleTemplateSchemaV830,
      '8.4.0': _schemas.cspRuleTemplateSchemaV840
    },
    migrations: _migrations.cspRuleTemplateMigrations,
    mappings: _mappings.cspRuleTemplateSavedObjectMapping
  });
}