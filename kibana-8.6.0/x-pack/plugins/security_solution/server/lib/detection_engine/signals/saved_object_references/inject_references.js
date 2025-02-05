"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectReferences = void 0;
var _utils = require("../utils");
var _inject_exceptions_list = require("./inject_exceptions_list");
var _inject_data_view = require("./inject_data_view");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Injects references and returns the saved object references.
 * How to add a new injected references here:
 * ---
 * Add a new file for injection named: inject_<paramName>.ts, example: inject_foo.ts
 * Add a new function into that file named: inject<ParamName>, example: injectFooReferences(logger, params.foo)
 * Add a new line below and spread the new parameter together like so:
 *
 * const foo = injectFooReferences(logger, params.foo, savedObjectReferences);
 * const ruleParamsWithSavedObjectReferences: RuleParams = {
 *   ...params,
 *   foo,
 *   exceptionsList,
 * };
 * @param logger Kibana injected logger
 * @param params The params of the base rule(s).
 * @param savedObjectReferences The saved object references to merge with the rule params
 * @returns The rule parameters with the saved object references.
 */
const injectReferences = ({
  logger,
  params,
  savedObjectReferences
}) => {
  const exceptionsList = (0, _inject_exceptions_list.injectExceptionsReferences)({
    logger,
    exceptionsList: params.exceptionsList,
    savedObjectReferences
  });
  let ruleParamsWithSavedObjectReferences = {
    ...params,
    exceptionsList
  };
  if (!(0, _utils.isMachineLearningParams)(params)) {
    const dataView = (0, _inject_data_view.injectDataViewReferences)({
      logger,
      savedObjectReferences
    });
    ruleParamsWithSavedObjectReferences = {
      ...ruleParamsWithSavedObjectReferences,
      dataViewId: dataView
    };
  }
  return ruleParamsWithSavedObjectReferences;
};
exports.injectReferences = injectReferences;