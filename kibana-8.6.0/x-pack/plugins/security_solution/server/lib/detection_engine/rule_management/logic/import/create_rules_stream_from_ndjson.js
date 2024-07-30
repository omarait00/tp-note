"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateRulesStream = exports.validateRules = exports.sortImports = exports.createRulesAndExceptionsStreamFromNdJson = void 0;
var _fp = require("lodash/fp");
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _utils = require("@kbn/utils");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _rule_management = require("../../../../../../common/detection_engine/rule_management");
var _create_stream_from_ndjson = require("../../../../../utils/read_stream/create_stream_from_ndjson");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Validates exception lists and items schemas
 */
const validateRulesStream = () => {
  return (0, _utils.createMapStream)(items => ({
    exceptions: items.exceptions,
    rules: validateRules(items.rules)
  }));
};
exports.validateRulesStream = validateRulesStream;
const validateRules = rules => {
  return rules.map(obj => {
    if (!(obj instanceof Error)) {
      const decoded = _rule_management.RuleToImport.decode(obj);
      const checked = (0, _securitysolutionIoTsUtils.exactCheck)(obj, decoded);
      const onLeft = errors => {
        return new _securitysolutionEsUtils.BadRequestError((0, _securitysolutionIoTsUtils.formatErrors)(errors).join());
      };
      const onRight = schema => {
        const validationErrors = (0, _rule_management.validateRuleToImport)(schema);
        if (validationErrors.length) {
          return new _securitysolutionEsUtils.BadRequestError(validationErrors.join());
        } else {
          return schema;
        }
      };
      return (0, _pipeable.pipe)(checked, (0, _Either.fold)(onLeft, onRight));
    } else {
      return obj;
    }
  });
};

/**
 * Sorts the exceptions into the lists and items.
 * We do this because we don't want the order of the exceptions
 * in the import to matter. If we didn't sort, then some items
 * might error if the list has not yet been created
 */
exports.validateRules = validateRules;
const sortImports = () => {
  return (0, _utils.createReduceStream)((acc, importItem) => {
    if ((0, _fp.has)('list_id', importItem) || (0, _fp.has)('item_id', importItem) || (0, _fp.has)('entries', importItem)) {
      return {
        ...acc,
        exceptions: [...acc.exceptions, importItem]
      };
    } else {
      return {
        ...acc,
        rules: [...acc.rules, importItem]
      };
    }
  }, {
    exceptions: [],
    rules: []
  });
};

// TODO: Capture both the line number and the rule_id if you have that information for the error message
// eventually and then pass it down so we can give error messages on the line number
exports.sortImports = sortImports;
const createRulesAndExceptionsStreamFromNdJson = ruleLimit => {
  return [(0, _utils.createSplitStream)('\n'), (0, _create_stream_from_ndjson.parseNdjsonStrings)(), (0, _create_stream_from_ndjson.filterExportedCounts)(), sortImports(), validateRulesStream(), (0, _create_stream_from_ndjson.createRulesLimitStream)(ruleLimit), (0, _utils.createConcatStream)([])];
};
exports.createRulesAndExceptionsStreamFromNdJson = createRulesAndExceptionsStreamFromNdJson;