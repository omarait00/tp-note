"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minimumLicenseForSuppression = exports.AlertSuppressionGroupBy = exports.AlertSuppression = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const AlertSuppressionGroupBy = (0, _securitysolutionIoTsTypes.LimitedSizeArray)({
  codec: t.string,
  minSize: 1,
  maxSize: 3
});

/**
 * Schema for fields relating to alert suppression, which enables limiting the number of alerts per entity.
 * e.g. group_by: ['host.name'] would create only one alert per value of host.name. The created alert
 * contains metadata about how many other candidate alerts with the same host.name value were suppressed.
 */
exports.AlertSuppressionGroupBy = AlertSuppressionGroupBy;
const AlertSuppression = t.exact(t.type({
  group_by: AlertSuppressionGroupBy
}));
exports.AlertSuppression = AlertSuppression;
const minimumLicenseForSuppression = 'platinum';
exports.minimumLicenseForSuppression = minimumLicenseForSuppression;