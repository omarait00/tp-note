"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexPatternField = void 0;
var _public = require("../../../../../data_views/public");
var _string = require("../../../validators/string");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const indexPatternField = i18n => (...args) => {
  const [{
    value
  }] = args;
  if (typeof value !== 'string') {
    return;
  }

  // Validate it does not contain spaces
  const {
    doesContain
  } = (0, _string.containsChars)(' ')(value);
  if (doesContain) {
    return {
      code: 'ERR_FIELD_FORMAT',
      formatType: 'INDEX_PATTERN',
      message: i18n.translate('esUi.forms.fieldValidation.indexPatternSpacesError', {
        defaultMessage: 'The index pattern cannot contain spaces.'
      })
    };
  }

  // Validate illegal characters
  const errors = (0, _public.validateDataView)(value);
  if (errors.ILLEGAL_CHARACTERS) {
    return {
      code: 'ERR_FIELD_FORMAT',
      formatType: 'INDEX_PATTERN',
      message: i18n.translate('esUi.forms.fieldValidation.indexPatternInvalidCharactersError', {
        defaultMessage: 'The index pattern contains the invalid {characterListLength, plural, one {character} other {characters}} { characterList }.',
        values: {
          characterList: errors.ILLEGAL_CHARACTERS.join(' '),
          characterListLength: errors.ILLEGAL_CHARACTERS.length
        }
      })
    };
  }
};
exports.indexPatternField = indexPatternField;