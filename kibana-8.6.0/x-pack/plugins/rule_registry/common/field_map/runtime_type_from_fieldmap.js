"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runtimeTypeFromFieldMap = runtimeTypeFromFieldMap;
var _lodash = require("lodash");
var _Either = require("fp-ts/lib/Either");
var t = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const NumberFromString = new t.Type('NumberFromString', u => typeof u === 'number', (u, c) => _Either.either.chain(t.string.validate(u, c), s => {
  const d = Number(s);
  return isNaN(d) ? t.failure(u, c) : t.success(d);
}), a => a);
const BooleanFromString = new t.Type('BooleanFromString', u => typeof u === 'boolean', (u, c) => _Either.either.chain(t.string.validate(u, c), s => {
  switch (s.toLowerCase().trim()) {
    case '1':
    case 'true':
    case 'yes':
      return t.success(true);
    case '0':
    case 'false':
    case 'no':
    case null:
      return t.success(false);
    default:
      return t.failure(u, c);
  }
}), a => a);
const esFieldTypeMap = {
  keyword: t.string,
  version: t.string,
  text: t.string,
  date: t.string,
  boolean: t.union([t.number, BooleanFromString]),
  byte: t.union([t.number, NumberFromString]),
  long: t.union([t.number, NumberFromString]),
  integer: t.union([t.number, NumberFromString]),
  short: t.union([t.number, NumberFromString]),
  double: t.union([t.number, NumberFromString]),
  float: t.union([t.number, NumberFromString]),
  scaled_float: t.union([t.number, NumberFromString]),
  unsigned_long: t.union([t.number, NumberFromString]),
  flattened: t.UnknownRecord
};
const createCastArrayRt = type => {
  const union = t.union([type, t.array(type)]);
  return new t.Type('castArray', union.is, union.validate, a => Array.isArray(a) ? a : [a]);
};
const createCastSingleRt = type => {
  const union = t.union([type, t.array(type)]);
  return new t.Type('castSingle', union.is, union.validate, a => Array.isArray(a) ? a[0] : a);
};
function runtimeTypeFromFieldMap(fieldMap) {
  function mapToType(fields) {
    return (0, _lodash.mapValues)(fields, field => {
      const type = field.type in esFieldTypeMap ? esFieldTypeMap[field.type] : t.unknown;
      return field.array ? createCastArrayRt(type) : createCastSingleRt(type);
    });
  }
  const required = (0, _lodash.pickBy)(fieldMap, field => field.required);
  return t.intersection([t.exact(t.partial(mapToType(fieldMap))), t.type(mapToType(required))]);
}