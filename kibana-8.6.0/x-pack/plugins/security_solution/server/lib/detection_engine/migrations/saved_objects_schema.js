"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signalsMigrationSOs = exports.signalsMigrationSOUpdateAttributes = exports.signalsMigrationSOCreateAttributes = exports.signalsMigrationSOAttributes = exports.signalsMigrationSO = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
var _utility_types = require("../../../../common/utility_types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const status = t.keyof({
  success: null,
  failure: null,
  pending: null
});
const signalsMigrationSOWriteAttributes = {
  destinationIndex: t.string,
  error: (0, _utility_types.unionWithNullType)(t.string),
  sourceIndex: t.string,
  status,
  taskId: t.string,
  version: _securitysolutionIoTsTypes.PositiveInteger
};
const signalsMigrationSOGeneratedAttributes = {
  created: _securitysolutionIoTsTypes.IsoDateString,
  createdBy: t.string,
  updated: _securitysolutionIoTsTypes.IsoDateString,
  updatedBy: t.string
};
const signalsMigrationSOError = {
  statusCode: t.number,
  error: t.string,
  message: t.string
};

/**
 The attributes necessary to create a Signals Migration Saved Object
 */
const signalsMigrationSOCreateAttributes = t.exact(t.type(signalsMigrationSOWriteAttributes));
exports.signalsMigrationSOCreateAttributes = signalsMigrationSOCreateAttributes;
/**
 The attributes necessary to update a Signals Migration Saved Object
 */
const signalsMigrationSOUpdateAttributes = t.exact(t.partial(signalsMigrationSOWriteAttributes));
exports.signalsMigrationSOUpdateAttributes = signalsMigrationSOUpdateAttributes;
/**
 The attributes of our Signals Migration Saved Object
 */
const signalsMigrationSOAttributes = t.exact(t.type({
  ...signalsMigrationSOWriteAttributes,
  ...signalsMigrationSOGeneratedAttributes
}));
exports.signalsMigrationSOAttributes = signalsMigrationSOAttributes;
const signalsMigrationSO = t.intersection([t.type({
  id: t.string,
  attributes: signalsMigrationSOAttributes,
  type: t.string
}), t.partial({
  error: t.type(signalsMigrationSOError)
})]);
exports.signalsMigrationSO = signalsMigrationSO;
const signalsMigrationSOs = t.array(signalsMigrationSO);
exports.signalsMigrationSOs = signalsMigrationSOs;