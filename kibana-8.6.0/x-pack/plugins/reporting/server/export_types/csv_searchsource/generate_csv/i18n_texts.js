"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i18nTexts = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const i18nTexts = {
  escapedFormulaValuesMessage: _i18n.i18n.translate('xpack.reporting.exportTypes.csv.generateCsv.escapedFormulaValues', {
    defaultMessage: 'CSV may contain formulas whose values have been escaped'
  }),
  authenticationError: {
    partialResultsMessage: _i18n.i18n.translate('xpack.reporting.exportTypes.csv.generateCsv.authenticationExpired.partialResultsMessage', {
      defaultMessage: 'This report contains partial CSV results because the authentication token expired. Export a smaller amount of data or increase the timeout of the authentication token.'
    })
  },
  esErrorMessage: (statusCode, message) => _i18n.i18n.translate('xpack.reporting.exportTypes.csv.generateCsv.esErrorMessage', {
    defaultMessage: 'Received a {statusCode} response from Elasticsearch: {message}',
    values: {
      statusCode,
      message
    }
  }),
  unknownError: (message = 'unknown') => _i18n.i18n.translate('xpack.reporting.exportTypes.csv.generateCsv.unknownErrorMessage', {
    defaultMessage: 'Encountered an unknown error: {message}',
    values: {
      message
    }
  }),
  csvRowCountError: ({
    expected,
    received
  }) => _i18n.i18n.translate('xpack.reporting.exportTypes.csv.generateCsv.incorrectRowCount', {
    defaultMessage: 'Encountered an error with the number of CSV rows generated from the search: expected {expected}, received {received}.',
    values: {
      expected,
      received
    }
  })
};
exports.i18nTexts = i18nTexts;