"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.referenceLineLayerFn = void 0;
var _utils = require("../../../../visualizations/common/utils");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const referenceLineLayerFn = async (input, args, handlers) => {
  var _args$table, _args$accessors, _args$table2;
  const table = (_args$table = args.table) !== null && _args$table !== void 0 ? _args$table : input;
  const accessors = (_args$accessors = args.accessors) !== null && _args$accessors !== void 0 ? _args$accessors : [];
  accessors.forEach(accessor => (0, _utils.validateAccessor)(accessor, table.columns));
  return {
    type: _constants.REFERENCE_LINE_LAYER,
    ...args,
    layerType: _constants.LayerTypes.REFERENCELINE,
    table: (_args$table2 = args.table) !== null && _args$table2 !== void 0 ? _args$table2 : input
  };
};
exports.referenceLineLayerFn = referenceLineLayerFn;