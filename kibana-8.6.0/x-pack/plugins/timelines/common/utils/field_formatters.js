"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isThreatEnrichmentFieldOrSubfield = exports.isRuleParametersFieldOrSubfield = exports.isGeoField = exports.getFieldCategory = exports.getDataSafety = exports.getDataFromFieldsHits = exports.formatGeoLocation = exports.baseCategoryFields = void 0;
var _fp = require("lodash/fp");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _ecs_field_map = require("../../../rule_registry/common/assets/field_maps/ecs_field_map");
var _technical_rule_field_map = require("../../../rule_registry/common/assets/field_maps/technical_rule_field_map");
var _experimental_rule_field_map = require("../../../rule_registry/common/assets/field_maps/experimental_rule_field_map");
var _to_array = require("./to_array");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const baseCategoryFields = ['@timestamp', 'labels', 'message', 'tags'];
exports.baseCategoryFields = baseCategoryFields;
const nonFlattenedFormatParamsFields = ['related_integrations', 'threat_mapping'];
const getFieldCategory = field => {
  const fieldCategory = field.split('.')[0];
  if (!(0, _fp.isEmpty)(fieldCategory) && baseCategoryFields.includes(fieldCategory)) {
    return 'base';
  }
  return fieldCategory;
};
exports.getFieldCategory = getFieldCategory;
const formatGeoLocation = item => {
  const itemGeo = item.length > 0 ? item[0] : null;
  if (itemGeo != null && !(0, _fp.isEmpty)(itemGeo.coordinates)) {
    try {
      return (0, _to_array.toStringArray)({
        lon: itemGeo.coordinates[0],
        lat: itemGeo.coordinates[1]
      });
    } catch {
      return (0, _to_array.toStringArray)(item);
    }
  }
  return (0, _to_array.toStringArray)(item);
};
exports.formatGeoLocation = formatGeoLocation;
const isGeoField = field => field.includes('geo.location') || field.includes('geoip.location');
exports.isGeoField = isGeoField;
const isRuleParametersFieldOrSubfield = (field, prependField) => ((prependField === null || prependField === void 0 ? void 0 : prependField.includes(_ruleDataUtils.ALERT_RULE_PARAMETERS)) || field === _ruleDataUtils.ALERT_RULE_PARAMETERS) && !nonFlattenedFormatParamsFields.includes(field);
exports.isRuleParametersFieldOrSubfield = isRuleParametersFieldOrSubfield;
const isThreatEnrichmentFieldOrSubfield = (field, prependField) => (prependField === null || prependField === void 0 ? void 0 : prependField.includes(_constants.ENRICHMENT_DESTINATION_PATH)) || field === _constants.ENRICHMENT_DESTINATION_PATH;
exports.isThreatEnrichmentFieldOrSubfield = isThreatEnrichmentFieldOrSubfield;
const getDataFromFieldsHits = (fields, prependField, prependFieldCategory) => Object.keys(fields).reduce((accumulator, field) => {
  const item = fields[field];
  const fieldCategory = prependFieldCategory != null ? prependFieldCategory : getFieldCategory(field);
  if (isGeoField(field)) {
    return [...accumulator, {
      category: fieldCategory,
      field,
      values: formatGeoLocation(item),
      originalValue: formatGeoLocation(item),
      isObjectArray: true // important for UI
    }];
  }

  const objArrStr = (0, _to_array.toObjectArrayOfStrings)(item);
  const strArr = objArrStr.map(({
    str
  }) => str);
  const isObjectArray = objArrStr.some(o => o.isObjectArray);
  const dotField = prependField ? `${prependField}.${field}` : field;

  // return simple field value (non-ecs object, non-array)
  if (!isObjectArray || Object.keys({
    ..._ecs_field_map.ecsFieldMap,
    ..._technical_rule_field_map.technicalRuleFieldMap,
    ..._experimental_rule_field_map.experimentalRuleFieldMap
  }).find(ecsField => ecsField === field) === undefined && !isRuleParametersFieldOrSubfield(field, prependField)) {
    return [...accumulator, {
      category: fieldCategory,
      field: dotField,
      values: strArr,
      originalValue: strArr,
      isObjectArray
    }];
  }
  const threatEnrichmentObject = isThreatEnrichmentFieldOrSubfield(field, prependField) ? [{
    category: fieldCategory,
    field: dotField,
    values: strArr,
    originalValue: strArr,
    isObjectArray
  }] : [];

  // format nested fields
  let nestedFields;
  if (isRuleParametersFieldOrSubfield(field, prependField)) {
    nestedFields = Array.isArray(item) ? item.reduce((acc, i) => [...acc, getDataFromFieldsHits(i, dotField, fieldCategory)], []).flat() : getDataFromFieldsHits(item, dotField, fieldCategory);
  } else {
    nestedFields = Array.isArray(item) ? item.reduce((acc, i) => [...acc, getDataFromFieldsHits(i, dotField, fieldCategory)], []).flat() : getDataFromFieldsHits(item, prependField, fieldCategory);
  }

  // combine duplicate fields
  const flat = [...accumulator, ...nestedFields, ...threatEnrichmentObject].reduce((acc, f) => ({
    ...acc,
    // acc/flat is hashmap to determine if we already have the field or not without an array iteration
    // its converted back to array in return with Object.values
    ...(acc[f.field] != null ? {
      [f.field]: {
        ...f,
        originalValue: acc[f.field].originalValue.includes(f.originalValue[0]) ? acc[f.field].originalValue : [...acc[f.field].originalValue, ...f.originalValue],
        values: acc[f.field].values.includes(f.values[0]) ? acc[f.field].values : [...acc[f.field].values, ...f.values]
      }
    } : {
      [f.field]: f
    })
  }), {});
  return Object.values(flat);
}, []);
exports.getDataFromFieldsHits = getDataFromFieldsHits;
const getDataSafety = (fn, args) => new Promise(resolve => setTimeout(() => resolve(fn(args))));
exports.getDataSafety = getDataSafety;