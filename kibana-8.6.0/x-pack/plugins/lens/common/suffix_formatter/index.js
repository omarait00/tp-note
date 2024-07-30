"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSuffixFormatter = getSuffixFormatter;
exports.unitSuffixesLong = exports.suffixFormatterId = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _i18n = require("@kbn/i18n");
var _fieldTypes = require("@kbn/field-types");
var _common = require("../../../../../src/plugins/field_formats/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const unitSuffixes = {
  s: _i18n.i18n.translate('xpack.lens.fieldFormats.suffix.s', {
    defaultMessage: '/s'
  }),
  m: _i18n.i18n.translate('xpack.lens.fieldFormats.suffix.m', {
    defaultMessage: '/m'
  }),
  h: _i18n.i18n.translate('xpack.lens.fieldFormats.suffix.h', {
    defaultMessage: '/h'
  }),
  d: _i18n.i18n.translate('xpack.lens.fieldFormats.suffix.d', {
    defaultMessage: '/d'
  })
};
const unitSuffixesLong = {
  s: _i18n.i18n.translate('xpack.lens.fieldFormats.longSuffix.s', {
    defaultMessage: 'per second'
  }),
  m: _i18n.i18n.translate('xpack.lens.fieldFormats.longSuffix.m', {
    defaultMessage: 'per minute'
  }),
  h: _i18n.i18n.translate('xpack.lens.fieldFormats.longSuffix.h', {
    defaultMessage: 'per hour'
  }),
  d: _i18n.i18n.translate('xpack.lens.fieldFormats.longSuffix.d', {
    defaultMessage: 'per day'
  })
};
exports.unitSuffixesLong = unitSuffixesLong;
const suffixFormatterId = 'suffix';
exports.suffixFormatterId = suffixFormatterId;
function getSuffixFormatter(getFormatFactory) {
  var _class;
  return _class = class SuffixFormatter extends _common.FieldFormat {
    constructor(...args) {
      super(...args);
      (0, _defineProperty2.default)(this, "allowsNumericalAggregations", true);
      (0, _defineProperty2.default)(this, "textConvert", val => {
        const unit = this.param('unit');
        const suffix = unit ? unitSuffixes[unit] : this.param('suffixString');
        const nestedFormatter = this.param('id');
        const nestedParams = this.param('params');
        const formattedValue = getFormatFactory()({
          id: nestedFormatter,
          params: nestedParams
        }).convert(val);

        // do not add suffixes to empty strings
        if (formattedValue === '') {
          return '';
        }
        if (suffix) {
          return `${formattedValue}${suffix}`;
        }
        return formattedValue;
      });
    }
    getParamDefaults() {
      return {
        unit: undefined,
        nestedParams: {}
      };
    }
  }, (0, _defineProperty2.default)(_class, "id", suffixFormatterId), (0, _defineProperty2.default)(_class, "hidden", true), (0, _defineProperty2.default)(_class, "title", _i18n.i18n.translate('xpack.lens.fieldFormats.suffix.title', {
    defaultMessage: 'Suffix'
  })), (0, _defineProperty2.default)(_class, "fieldType", _fieldTypes.KBN_FIELD_TYPES.NUMBER), _class;
}