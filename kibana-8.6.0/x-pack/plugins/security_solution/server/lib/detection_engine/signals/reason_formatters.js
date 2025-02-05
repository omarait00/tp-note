"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildReasonMessageUtil = exports.buildReasonMessageForThresholdAlert = exports.buildReasonMessageForThreatMatchAlert = exports.buildReasonMessageForQueryAlert = exports.buildReasonMessageForNewTermsAlert = exports.buildReasonMessageForMlAlert = exports.buildReasonMessageForEqlAlert = void 0;
var _i18n = require("@kbn/i18n");
var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getFieldsFromDoc = mergedDoc => {
  const reasonFields = {};
  const docToUse = (mergedDoc === null || mergedDoc === void 0 ? void 0 : mergedDoc.fields) || (mergedDoc === null || mergedDoc === void 0 ? void 0 : mergedDoc._source) || mergedDoc;
  reasonFields.destinationAddress = (0, _fp.getOr)(null, 'destination.ip', docToUse);
  reasonFields.destinationPort = (0, _fp.getOr)(null, 'destination.port', docToUse);
  reasonFields.eventCategory = (0, _fp.getOr)(null, 'event.category', docToUse);
  reasonFields.fileName = (0, _fp.getOr)(null, 'file.name', docToUse);
  reasonFields.hostName = (0, _fp.getOr)(null, 'host.name', docToUse);
  reasonFields.processName = (0, _fp.getOr)(null, 'process.name', docToUse);
  reasonFields.processParentName = (0, _fp.getOr)(null, 'process.parent.name', docToUse);
  reasonFields.sourceAddress = (0, _fp.getOr)(null, 'source.ip', docToUse);
  reasonFields.sourcePort = (0, _fp.getOr)(null, 'source.port', docToUse);
  reasonFields.userName = (0, _fp.getOr)(null, 'user.name', docToUse);
  return reasonFields;
};
/**
 * Currently all security solution rule types share a common reason message string. This function composes that string
 * In the future there may be different configurations based on the different rule types, so the plumbing has been put in place
 * to more easily allow for this in the future.
 * @export buildCommonReasonMessage - is only exported for testing purposes, and only used internally here.
 */
const buildReasonMessageUtil = ({
  name,
  severity,
  mergedDoc
}) => {
  if (!mergedDoc) {
    // This should never happen, but in case, better to not show a malformed string
    return '';
  }
  const {
    destinationAddress,
    destinationPort,
    eventCategory,
    fileName,
    hostName,
    processName,
    processParentName,
    sourceAddress,
    sourcePort,
    userName
  } = getFieldsFromDoc(mergedDoc);
  const fieldPresenceTracker = {
    hasFieldOfInterest: false
  };
  const getFieldTemplateValue = (field, isFieldOfInterest) => {
    if (!field || !field.length || field.length === 1 && field[0] === '-') return null;
    if (isFieldOfInterest && !fieldPresenceTracker.hasFieldOfInterest) fieldPresenceTracker.hasFieldOfInterest = true;
    return Array.isArray(field) ? field.join(', ') : field;
  };
  return _i18n.i18n.translate('xpack.securitySolution.detectionEngine.signals.alertReasonDescription', {
    defaultMessage: `{eventCategory, select, null {} other {{eventCategory}{whitespace}}}event\
{hasFieldOfInterest, select, false {} other {{whitespace}with}}\
{processName, select, null {} other {{whitespace}process {processName},} }\
{processParentName, select, null {} other {{whitespace}parent process {processParentName},} }\
{fileName, select, null {} other {{whitespace}file {fileName},} }\
{sourceAddress, select, null {} other {{whitespace}source {sourceAddress}}}{sourcePort, select, null {} other {:{sourcePort},}}\
{destinationAddress, select, null {} other {{whitespace}destination {destinationAddress}}}{destinationPort, select, null {} other {:{destinationPort},}}\
{userName, select, null {} other {{whitespace}by {userName}} }\
{hostName, select, null {} other {{whitespace}on {hostName}} } \
created {alertSeverity} alert {alertName}.`,
    values: {
      alertName: name,
      alertSeverity: severity,
      destinationAddress: getFieldTemplateValue(destinationAddress, true),
      destinationPort: getFieldTemplateValue(destinationPort, true),
      eventCategory: getFieldTemplateValue(eventCategory),
      fileName: getFieldTemplateValue(fileName, true),
      hostName: getFieldTemplateValue(hostName),
      processName: getFieldTemplateValue(processName, true),
      processParentName: getFieldTemplateValue(processParentName, true),
      sourceAddress: getFieldTemplateValue(sourceAddress, true),
      sourcePort: getFieldTemplateValue(sourcePort, true),
      userName: getFieldTemplateValue(userName),
      hasFieldOfInterest: fieldPresenceTracker.hasFieldOfInterest,
      // Tracking if we have any fields to show the 'with' word
      whitespace: ' ' // there isn't support for the unicode /u0020 for whitespace, and leading spaces are deleted, so to prevent double-whitespace explicitly passing the space in.
    }
  });
};
exports.buildReasonMessageUtil = buildReasonMessageUtil;
const buildReasonMessageForEqlAlert = args => buildReasonMessageUtil({
  ...args,
  type: 'eql'
});
exports.buildReasonMessageForEqlAlert = buildReasonMessageForEqlAlert;
const buildReasonMessageForMlAlert = args => buildReasonMessageUtil({
  ...args,
  type: 'ml'
});
exports.buildReasonMessageForMlAlert = buildReasonMessageForMlAlert;
const buildReasonMessageForQueryAlert = args => buildReasonMessageUtil({
  ...args,
  type: 'query'
});
exports.buildReasonMessageForQueryAlert = buildReasonMessageForQueryAlert;
const buildReasonMessageForThreatMatchAlert = args => buildReasonMessageUtil({
  ...args,
  type: 'threatMatch'
});
exports.buildReasonMessageForThreatMatchAlert = buildReasonMessageForThreatMatchAlert;
const buildReasonMessageForThresholdAlert = args => buildReasonMessageUtil({
  ...args,
  type: 'threshold'
});
exports.buildReasonMessageForThresholdAlert = buildReasonMessageForThresholdAlert;
const buildReasonMessageForNewTermsAlert = args => buildReasonMessageUtil({
  ...args,
  type: 'new_terms'
});
exports.buildReasonMessageForNewTermsAlert = buildReasonMessageForNewTermsAlert;