"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.threatIndicatorNamesScript = exports.threatIndicatorNamesOriginScript = void 0;
var _dedent = _interopRequireDefault(require("dedent"));
var _indicator = require("../../common/types/indicator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const mappingsArray = [[['ipv4-addr', 'ipv6-addr'], [_indicator.RawIndicatorFieldId.Ip]],
// For example, `file` indicator will have `threat.indicator.name` computed out of the first
// hash value field defined below, in order of occurrence
[['file'], [_indicator.RawIndicatorFieldId.FileSha256, _indicator.RawIndicatorFieldId.FileMd5, _indicator.RawIndicatorFieldId.FileSha1, _indicator.RawIndicatorFieldId.FileSha224, _indicator.RawIndicatorFieldId.FileSha3224, _indicator.RawIndicatorFieldId.FileSha3256, _indicator.RawIndicatorFieldId.FileSha384, _indicator.RawIndicatorFieldId.FileSha3384, _indicator.RawIndicatorFieldId.FileSha512, _indicator.RawIndicatorFieldId.FileSha3512, _indicator.RawIndicatorFieldId.FileSha512224, _indicator.RawIndicatorFieldId.FileSha512256, _indicator.RawIndicatorFieldId.FileSSDeep, _indicator.RawIndicatorFieldId.FileTlsh, _indicator.RawIndicatorFieldId.FileImpfuzzy, _indicator.RawIndicatorFieldId.FileImphash, _indicator.RawIndicatorFieldId.FilePehash, _indicator.RawIndicatorFieldId.FileVhash]], [['url'], [_indicator.RawIndicatorFieldId.UrlFull]], [['domain', 'domain-name'], [_indicator.RawIndicatorFieldId.UrlDomain]], [['x509-certificate', 'x509 serial'], [_indicator.RawIndicatorFieldId.X509Serial]], [['email-addr'], [_indicator.RawIndicatorFieldId.EmailAddress]], [['unknown', 'email', 'email-message'], [_indicator.RawIndicatorFieldId.Id]], [['windows-registry-key'], [_indicator.RawIndicatorFieldId.WindowsRegistryKey]], [['autonomous-system'], [_indicator.RawIndicatorFieldId.AutonomousSystemNumber]], [['mac-addr'], [_indicator.RawIndicatorFieldId.MacAddress]]];

/**
 * Generates Painless condition checking if given `type` is matched
 */
const fieldTypeCheck = type => `if (doc.containsKey('threat.indicator.type') && !doc['threat.indicator.type'].empty && doc['threat.indicator.type'].size()!=0 && doc['threat.indicator.type'].value!=null && doc['threat.indicator.type'].value.toLowerCase()=='${type.toLowerCase()}')`;

/**
 * Generates Painless condition checking if given `field` has value
 */
const fieldValueCheck = field => `if (doc.containsKey('${field}') && !doc['${field}'].empty && doc['${field}'].size()!=0 && doc['${field}'].value!=null)`;

/**
 * Converts Mapping to Painless script, computing `threat.indicator.name` value for given indicator types.
 */
const mappingToIndicatorNameScript = ([types, paths]) => {
  return (0, _dedent.default)`${types.map(t => `${fieldTypeCheck(t)} { ${paths.map(p => `${fieldValueCheck(p)} { return emit(doc['${p}'].value) }`).join('\n')} }`).join('\n')}`;
};

/**
 * Converts Mapping to Painless script, computing `threat.indicator.name_origin` used to determine which document field has
 * been used to obtain `threat.indicator.name`.
 */
const mappingToIndicatorNameOriginScript = ([types, paths]) => {
  return (0, _dedent.default)`${types.map(t => `${fieldTypeCheck(t)} { ${paths.map(p => `${fieldValueCheck(p)} { return emit('${p}') }`).join('\n')} }`).join('\n')}`;
};

/**
 * Generates the runtime field script computing display name for the given indicator
 */
const threatIndicatorNamesScript = (mappings = mappingsArray) => {
  const combined = mappings.map(mappingToIndicatorNameScript).join('\n\n');
  return `${combined}\n\nreturn emit('')`;
};

/**
 * Generates the runtime field script computing the display name origin path for given indicator
 */
exports.threatIndicatorNamesScript = threatIndicatorNamesScript;
const threatIndicatorNamesOriginScript = (mappings = mappingsArray) => {
  const combined = mappings.map(mappingToIndicatorNameOriginScript).join('\n\n');
  return `${combined}\n\nreturn emit('')`;
};
exports.threatIndicatorNamesOriginScript = threatIndicatorNamesOriginScript;