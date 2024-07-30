"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KNOWN_FIELD_TYPES = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let KNOWN_FIELD_TYPES;
exports.KNOWN_FIELD_TYPES = KNOWN_FIELD_TYPES;
(function (KNOWN_FIELD_TYPES) {
  KNOWN_FIELD_TYPES["BOOLEAN"] = "boolean";
  KNOWN_FIELD_TYPES["CONFLICT"] = "conflict";
  KNOWN_FIELD_TYPES["DATE"] = "date";
  KNOWN_FIELD_TYPES["DATE_RANGE"] = "date_range";
  KNOWN_FIELD_TYPES["GEO_POINT"] = "geo_point";
  KNOWN_FIELD_TYPES["GEO_SHAPE"] = "geo_shape";
  KNOWN_FIELD_TYPES["HISTOGRAM"] = "histogram";
  KNOWN_FIELD_TYPES["IP"] = "ip";
  KNOWN_FIELD_TYPES["IP_RANGE"] = "ip_range";
  KNOWN_FIELD_TYPES["KEYWORD"] = "keyword";
  KNOWN_FIELD_TYPES["MURMUR3"] = "murmur3";
  KNOWN_FIELD_TYPES["NUMBER"] = "number";
  KNOWN_FIELD_TYPES["NESTED"] = "nested";
  KNOWN_FIELD_TYPES["STRING"] = "string";
  KNOWN_FIELD_TYPES["TEXT"] = "text";
  KNOWN_FIELD_TYPES["VERSION"] = "version";
})(KNOWN_FIELD_TYPES || (exports.KNOWN_FIELD_TYPES = KNOWN_FIELD_TYPES = {}));