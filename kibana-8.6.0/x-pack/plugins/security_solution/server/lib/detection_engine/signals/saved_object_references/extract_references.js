"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractReferences = void 0;
var _utils = require("../utils");
var _extract_exceptions_list = require("./extract_exceptions_list");
var _extract_data_view = require("./extract_data_view");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Extracts references and returns the saved object references.
 * How to add a new extracted references here:
 * ---
 * Add a new file for extraction named: extract_<paramName>.ts, example: extract_foo.ts
 * Add a function into that file named: extract<ParamName>, example: extractFoo(logger, params.foo)
 * Add a new line below and concat together the new extract with existing ones like so:
 *
 * const exceptionReferences = extractExceptionsList(logger, params.exceptionsList);
 * const fooReferences = extractFoo(logger, params.foo);
 * const returnReferences = [...exceptionReferences, ...fooReferences];
 *
 * Optionally you can remove any parameters you do not want to store within the Saved Object here:
 * const paramsWithoutSavedObjectReferences = { removeParam, ...otherParams };
 *
 * If you do remove params, then update the types in: security_solution/server/lib/detection_engine/signals/types.ts
 * to use an omit for the functions of "isAlertExecutor" and "SignalRuleAlertTypeDefinition"
 * @param logger Kibana injected logger
 * @param params The params of the base rule(s).
 * @returns The rule parameters and the saved object references to store.
 */
const extractReferences = ({
  logger,
  params
}) => {
  const exceptionReferences = (0, _extract_exceptions_list.extractExceptionsList)({
    logger,
    exceptionsList: params.exceptionsList
  });
  let returnReferences = [...exceptionReferences];

  // if statement is needed here because dataViewId is not on the base rule params
  // much like how the index property is not on the base rule params either
  if (!(0, _utils.isMachineLearningParams)(params)) {
    returnReferences = [...returnReferences, ...(0, _extract_data_view.extractDataView)({
      dataViewId: params.dataViewId
    })];
  }
  // Modify params if you want to remove any elements separately here. For exceptionLists, we do not remove the id and instead
  // keep it to both fail safe guard against manually removed saved object references or if there are migration issues and the saved object
  // references are removed. Also keeping it we can detect and log out a warning if the reference between it and the saved_object reference
  // array have changed between each other indicating the saved_object array is being mutated outside of this functionality
  const paramsWithoutSavedObjectReferences = {
    ...params
  };
  return {
    references: returnReferences,
    params: paramsWithoutSavedObjectReferences
  };
};
exports.extractReferences = extractReferences;