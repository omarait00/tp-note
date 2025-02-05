"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toSanitizedFieldType = exports.getMultiFieldLabel = exports.getFieldsForTerms = exports.extractFieldLabel = exports.createCachedFieldValueFormatter = exports.MULTI_FIELD_VALUES_SEPARATOR = void 0;
exports.validateField = validateField;
var _i18n = require("@kbn/i18n");
var _common = require("../../../data/common");
var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const extractFieldLabel = (fields, name, isThrowErrorOnFieldNotFound = true) => {
  if (fields.length && name) {
    const field = fields.find(f => f.name === name);
    if (field) {
      return field.label || field.name;
    }
    if (isThrowErrorOnFieldNotFound) {
      throw new _errors.FieldNotFoundError(name);
    }
  }
  return name;
};
exports.extractFieldLabel = extractFieldLabel;
function validateField(name, index) {
  if (name && index.indexPattern) {
    const field = index.indexPattern.fields.find(f => f.name === name);
    if (!field) {
      throw new _errors.FieldNotFoundError(name);
    }
  }
}
const toSanitizedFieldType = fields => fields.filter(field => field.aggregatable && !(0, _common.isNestedField)(field)).map(field => {
  var _field$customLabel;
  return {
    name: field.name,
    label: (_field$customLabel = field.customLabel) !== null && _field$customLabel !== void 0 ? _field$customLabel : field.name,
    type: field.type
  };
});
exports.toSanitizedFieldType = toSanitizedFieldType;
const getFieldsForTerms = fields => {
  return fields ? [fields].flat().filter(Boolean) : [];
};
exports.getFieldsForTerms = getFieldsForTerms;
const getMultiFieldLabel = (fieldForTerms, fields) => {
  const firstFieldLabel = fields ? extractFieldLabel(fields, fieldForTerms[0]) : fieldForTerms[0];
  if (fieldForTerms.length > 1) {
    return _i18n.i18n.translate('visTypeTimeseries.fieldUtils.multiFieldLabel', {
      defaultMessage: '{firstFieldLabel} + {count} {count, plural, one {other} other {others}}',
      values: {
        firstFieldLabel,
        count: fieldForTerms.length - 1
      }
    });
  }
  return firstFieldLabel !== null && firstFieldLabel !== void 0 ? firstFieldLabel : '';
};
exports.getMultiFieldLabel = getMultiFieldLabel;
const createCachedFieldValueFormatter = (dataView, fields, fieldFormatService, options, excludedFieldFormatsIds = []) => {
  const cache = new Map();
  return (fieldName, value, contentType = 'text') => {
    var _dataView$fieldFormat, _dataView$fieldFormat2;
    const cachedFormatter = cache.get(fieldName);
    const convert = fieldFormat => fieldFormat.convert(value, contentType, options ? {
      timezone: options.timezone
    } : undefined);
    if (cachedFormatter) {
      return convert(cachedFormatter);
    }
    const formatId = dataView === null || dataView === void 0 ? void 0 : (_dataView$fieldFormat = dataView.fieldFormatMap) === null || _dataView$fieldFormat === void 0 ? void 0 : (_dataView$fieldFormat2 = _dataView$fieldFormat[fieldName]) === null || _dataView$fieldFormat2 === void 0 ? void 0 : _dataView$fieldFormat2.id;
    if (dataView && !excludedFieldFormatsIds.includes(formatId)) {
      const field = dataView.fields.getByName(fieldName);
      if (field) {
        const formatter = dataView.getFormatterForField(field);
        if (formatter) {
          cache.set(fieldName, formatter);
          return convert(formatter);
        }
      }
    } else if (fieldFormatService && fields) {
      const f = fields.find(item => item.name === fieldName);
      if (f) {
        const formatter = fieldFormatService.getDefaultInstance(f.type);
        if (formatter) {
          cache.set(fieldName, formatter);
          return convert(formatter);
        }
      }
    }
  };
};
exports.createCachedFieldValueFormatter = createCachedFieldValueFormatter;
const MULTI_FIELD_VALUES_SEPARATOR = ' › ';
exports.MULTI_FIELD_VALUES_SEPARATOR = MULTI_FIELD_VALUES_SEPARATOR;