"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateMonitor = validateMonitor;
exports.validateProjectMonitor = validateProjectMonitor;
var t = _interopRequireWildcard(require("io-ts"));
var _Either = require("fp-ts/lib/Either");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _runtime_types = require("../../../common/runtime_types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const monitorTypeToCodecMap = {
  [_runtime_types.DataStream.ICMP]: _runtime_types.ICMPSimpleFieldsCodec,
  [_runtime_types.DataStream.TCP]: _runtime_types.TCPFieldsCodec,
  [_runtime_types.DataStream.HTTP]: _runtime_types.HTTPFieldsCodec,
  [_runtime_types.DataStream.BROWSER]: _runtime_types.BrowserFieldsCodec
};
/**
 * Validates monitor fields with respect to the relevant Codec identified by object's 'type' property.
 * @param monitorFields {MonitorFields} The mixed type representing the possible monitor payload from UI.
 */
function validateMonitor(monitorFields) {
  const {
    [_runtime_types.ConfigKey.MONITOR_TYPE]: monitorType
  } = monitorFields;
  const decodedType = _runtime_types.DataStreamCodec.decode(monitorType);
  if ((0, _Either.isLeft)(decodedType)) {
    return {
      valid: false,
      reason: `Monitor type is invalid`,
      details: (0, _securitysolutionIoTsUtils.formatErrors)(decodedType.left).join(' | '),
      payload: monitorFields
    };
  }

  // Cast it to ICMPCodec to satisfy typing. During runtime, correct codec will be used to decode.
  const SyntheticsMonitorCodec = monitorTypeToCodecMap[monitorType];
  if (!SyntheticsMonitorCodec) {
    return {
      valid: false,
      reason: `Payload is not a valid monitor object`,
      details: '',
      payload: monitorFields
    };
  }
  const ExactSyntheticsMonitorCodec = t.exact(SyntheticsMonitorCodec);
  const decodedMonitor = ExactSyntheticsMonitorCodec.decode(monitorFields);
  if ((0, _Either.isLeft)(decodedMonitor)) {
    return {
      valid: false,
      reason: `Monitor is not a valid monitor of type ${monitorType}`,
      details: (0, _securitysolutionIoTsUtils.formatErrors)(decodedMonitor.left).join(' | '),
      payload: monitorFields
    };
  }
  return {
    valid: true,
    reason: '',
    details: '',
    payload: monitorFields,
    decodedMonitor: decodedMonitor.right
  };
}
function validateProjectMonitor(monitorFields) {
  var _monitorFields$privat;
  const locationsError = monitorFields.locations && monitorFields.locations.length === 0 && ((_monitorFields$privat = monitorFields.privateLocations) !== null && _monitorFields$privat !== void 0 ? _monitorFields$privat : []).length === 0 ? 'Invalid value "[]" supplied to field "locations"' : '';
  // Cast it to ICMPCodec to satisfy typing. During runtime, correct codec will be used to decode.
  const decodedMonitor = _runtime_types.ProjectMonitorCodec.decode(monitorFields);
  if ((0, _Either.isLeft)(decodedMonitor)) {
    return {
      valid: false,
      reason: `Failed to save or update monitor. Configuration is not valid`,
      details: [...(0, _securitysolutionIoTsUtils.formatErrors)(decodedMonitor.left), locationsError].filter(error => error !== '').join(' | '),
      payload: monitorFields
    };
  }
  if (locationsError) {
    return {
      valid: false,
      reason: `Failed to save or update monitor. Configuration is not valid`,
      details: locationsError,
      payload: monitorFields
    };
  }
  return {
    valid: true,
    reason: '',
    details: '',
    payload: monitorFields
  };
}