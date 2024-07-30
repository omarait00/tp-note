"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SUPPORTED_RESPONSE_ACTION_TYPES = exports.ResponseActionRuleParamsOrUndefined = exports.ResponseActionArray = exports.RESPONSE_ACTION_TYPES = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _osquery = require("./osquery");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let RESPONSE_ACTION_TYPES;
exports.RESPONSE_ACTION_TYPES = RESPONSE_ACTION_TYPES;
(function (RESPONSE_ACTION_TYPES) {
  RESPONSE_ACTION_TYPES["OSQUERY"] = ".osquery";
})(RESPONSE_ACTION_TYPES || (exports.RESPONSE_ACTION_TYPES = RESPONSE_ACTION_TYPES = {}));
const SUPPORTED_RESPONSE_ACTION_TYPES = Object.values(RESPONSE_ACTION_TYPES);

// When we create new response action types, create a union of types
exports.SUPPORTED_RESPONSE_ACTION_TYPES = SUPPORTED_RESPONSE_ACTION_TYPES;
const ResponseActionRuleParam = t.exact(t.type({
  actionTypeId: t.literal(RESPONSE_ACTION_TYPES.OSQUERY),
  params: _osquery.OsqueryParamsCamelCase
}));
const ResponseActionRuleParamsOrUndefined = t.union([t.array(ResponseActionRuleParam), t.undefined]);

// When we create new response action types, create a union of types
exports.ResponseActionRuleParamsOrUndefined = ResponseActionRuleParamsOrUndefined;
const ResponseAction = t.exact(t.type({
  action_type_id: t.literal(RESPONSE_ACTION_TYPES.OSQUERY),
  params: _osquery.OsqueryParams
}));
const ResponseActionArray = t.array(ResponseAction);
exports.ResponseActionArray = ResponseActionArray;