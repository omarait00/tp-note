"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateNanosFormat = void 0;
exports.analysePatternForFract = analysePatternForFract;
exports.formatWithNanos = formatWithNanos;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _i18n = require("@kbn/i18n");
var _lodash = require("lodash");
var _fieldTypes = require("@kbn/field-types");
var _moment = _interopRequireDefault(require("moment"));
var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Analyse the given moment.js format pattern for the fractional sec part (S,SS,SSS...)
 * returning length, match, pattern and an escaped pattern, that excludes the fractional
 * part when formatting with moment.js -> e.g. [SSS]
 */
function analysePatternForFract(pattern) {
  const fracSecMatch = pattern.match('S+'); // extract fractional seconds sub-pattern
  const fracSecMatchStr = fracSecMatch ? fracSecMatch[0] : '';
  return {
    length: fracSecMatchStr.length,
    patternNanos: fracSecMatchStr,
    pattern,
    patternEscaped: fracSecMatchStr ? pattern.replace(fracSecMatchStr, `[${fracSecMatchStr}]`) : ''
  };
}

/**
 * Format a given moment.js date object
 * Since momentjs would loose the exact value for fractional seconds with a higher resolution than
 * milliseconds, the fractional pattern is replaced by the fractional value of the raw timestamp
 */
function formatWithNanos(dateMomentObj, valRaw, fracPatternObj) {
  if (fracPatternObj.length <= 3) {
    // S,SS,SSS is formatted correctly by moment.js
    return dateMomentObj.format(fracPatternObj.pattern);
  } else {
    // Beyond SSS the precise value of the raw datetime string is used
    const valFormatted = dateMomentObj.format(fracPatternObj.patternEscaped);
    // Extract fractional value of ES formatted timestamp, zero pad if necessary:
    // 2020-05-18T20:45:05.957Z -> 957000000
    // 2020-05-18T20:45:05.957000123Z -> 957000123
    // we do not need to take care of the year 10000 bug since max year of date_nanos is 2262
    const valNanos = valRaw.substr(20, valRaw.length - 21) // remove timezone(Z)
    .padEnd(9, '0') // pad shorter fractionals
    .substr(0, fracPatternObj.patternNanos.length);
    return valFormatted.replace(fracPatternObj.patternNanos, valNanos);
  }
}
class DateNanosFormat extends _.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "memoizedConverter", _lodash.noop);
    (0, _defineProperty2.default)(this, "memoizedPattern", '');
    (0, _defineProperty2.default)(this, "timeZone", '');
    (0, _defineProperty2.default)(this, "textConvert", val => {
      // don't give away our ref to converter so
      // we can hot-swap when config changes
      const pattern = this.param('pattern');
      const timezone = this.param('timezone');
      const fractPattern = analysePatternForFract(pattern);
      const fallbackPattern = this.param('patternFallback');
      const timezoneChanged = this.timeZone !== timezone;
      const datePatternChanged = this.memoizedPattern !== pattern;
      if (timezoneChanged || datePatternChanged) {
        this.timeZone = timezone;
        this.memoizedPattern = pattern;
        this.memoizedConverter = (0, _lodash.memoize)(function converter(value) {
          if (value === null || value === undefined) {
            return '-';
          }
          const date = (0, _moment.default)(value);
          if (typeof value !== 'string' && date.isValid()) {
            // fallback for max/min aggregation, where unixtime in ms is returned as a number
            // aggregations in Elasticsearch generally just return ms
            return date.format(fallbackPattern);
          } else if (date.isValid() && typeof value === 'string') {
            return formatWithNanos(date, value, fractPattern);
          } else {
            return value;
          }
        });
      }
      return this.memoizedConverter(val);
    });
  }
  getParamDefaults() {
    return {
      pattern: this.getConfig('dateNanosFormat'),
      fallbackPattern: this.getConfig('dateFormat'),
      timezone: this.getConfig('dateFormat:tz')
    };
  }
}
exports.DateNanosFormat = DateNanosFormat;
(0, _defineProperty2.default)(DateNanosFormat, "id", _.FIELD_FORMAT_IDS.DATE_NANOS);
(0, _defineProperty2.default)(DateNanosFormat, "title", _i18n.i18n.translate('fieldFormats.date_nanos.title', {
  defaultMessage: 'Date nanos'
}));
(0, _defineProperty2.default)(DateNanosFormat, "fieldType", _fieldTypes.KBN_FIELD_TYPES.DATE);