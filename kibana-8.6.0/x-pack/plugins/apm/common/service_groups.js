"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SERVICE_GROUP_SUPPORTED_FIELDS = exports.SERVICE_GROUP_COLOR_DEFAULT = exports.MAX_NUMBER_OF_SERVICE_GROUPS = exports.APM_SERVICE_GROUP_SAVED_OBJECT_TYPE = void 0;
exports.isSupportedField = isSupportedField;
exports.validateServiceGroupKuery = validateServiceGroupKuery;
var _esQuery = require("@kbn/es-query");
var _i18n = require("@kbn/i18n");
var _get_kuery_fields = require("./utils/get_kuery_fields");
var _elasticsearch_fieldnames = require("./elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const LABELS = 'labels'; // implies labels.* wildcard

const APM_SERVICE_GROUP_SAVED_OBJECT_TYPE = 'apm-service-group';
exports.APM_SERVICE_GROUP_SAVED_OBJECT_TYPE = APM_SERVICE_GROUP_SAVED_OBJECT_TYPE;
const SERVICE_GROUP_COLOR_DEFAULT = '#D1DAE7';
exports.SERVICE_GROUP_COLOR_DEFAULT = SERVICE_GROUP_COLOR_DEFAULT;
const MAX_NUMBER_OF_SERVICE_GROUPS = 500;
exports.MAX_NUMBER_OF_SERVICE_GROUPS = MAX_NUMBER_OF_SERVICE_GROUPS;
const SERVICE_GROUP_SUPPORTED_FIELDS = [_elasticsearch_fieldnames.AGENT_NAME, _elasticsearch_fieldnames.SERVICE_NAME, _elasticsearch_fieldnames.SERVICE_ENVIRONMENT, _elasticsearch_fieldnames.SERVICE_LANGUAGE_NAME, LABELS];
exports.SERVICE_GROUP_SUPPORTED_FIELDS = SERVICE_GROUP_SUPPORTED_FIELDS;
function isSupportedField(fieldName) {
  return fieldName.startsWith(LABELS) || SERVICE_GROUP_SUPPORTED_FIELDS.includes(fieldName);
}
function validateServiceGroupKuery(kuery) {
  try {
    const kueryFields = (0, _get_kuery_fields.getKueryFields)([(0, _esQuery.fromKueryExpression)(kuery)]);
    const unsupportedKueryFields = kueryFields.filter(fieldName => !isSupportedField(fieldName));
    if (unsupportedKueryFields.length === 0) {
      return {
        isValidFields: true,
        isValidSyntax: true
      };
    }
    return {
      isValidFields: false,
      isValidSyntax: true,
      message: _i18n.i18n.translate('xpack.apm.serviceGroups.invalidFields.message', {
        defaultMessage: 'Query filter for service group does not support fields [{unsupportedFieldNames}]',
        values: {
          unsupportedFieldNames: unsupportedKueryFields.join(', ')
        }
      })
    };
  } catch (error) {
    return {
      isValidFields: false,
      isValidSyntax: false,
      message: error.message
    };
  }
}