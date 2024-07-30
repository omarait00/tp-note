"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreatArray = exports.SetupGuide = exports.RuleVersion = exports.RuleTagArray = exports.RuleSignatureId = exports.RuleReferenceArray = exports.RuleQuery = exports.RuleObjectId = exports.RuleName = exports.RuleMetadata = exports.RuleLicense = exports.RuleFilterArray = exports.RuleFalsePositiveArray = exports.RuleDescription = exports.RuleAuthorArray = exports.MaxSignals = exports.IsRuleImmutable = exports.IsRuleEnabled = exports.InvestigationGuide = exports.IndexPatternArray = exports.ExceptionListArray = exports.DataViewId = exports.BuildingBlockType = exports.AlertsIndexNamespace = exports.AlertsIndex = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
var _securitysolutionIoTsAlertingTypes = require("@kbn/securitysolution-io-ts-alerting-types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const RuleObjectId = _securitysolutionIoTsTypes.UUID;

/**
 * NOTE: Never make this a strict uuid, we allow the rule_id to be any string at the moment
 * in case we encounter 3rd party rule systems which might be using auto incrementing numbers
 * or other different things.
 */
exports.RuleObjectId = RuleObjectId;
const RuleSignatureId = t.string; // should be non-empty string?
exports.RuleSignatureId = RuleSignatureId;
const RuleName = _securitysolutionIoTsTypes.NonEmptyString;
exports.RuleName = RuleName;
const RuleDescription = _securitysolutionIoTsTypes.NonEmptyString;
exports.RuleDescription = RuleDescription;
const RuleVersion = _securitysolutionIoTsTypes.version;
exports.RuleVersion = RuleVersion;
const IsRuleImmutable = t.boolean;
exports.IsRuleImmutable = IsRuleImmutable;
const IsRuleEnabled = t.boolean;
exports.IsRuleEnabled = IsRuleEnabled;
const RuleTagArray = t.array(t.string); // should be non-empty strings?

/**
 * Note that this is a non-exact io-ts type as we allow extra meta information
 * to be added to the meta object
 */
exports.RuleTagArray = RuleTagArray;
const RuleMetadata = t.object; // should be a more specific type?
exports.RuleMetadata = RuleMetadata;
const RuleLicense = t.string; // should be non-empty string?
exports.RuleLicense = RuleLicense;
const RuleAuthorArray = t.array(t.string); // should be non-empty strings?
exports.RuleAuthorArray = RuleAuthorArray;
const RuleFalsePositiveArray = t.array(t.string); // should be non-empty strings?
exports.RuleFalsePositiveArray = RuleFalsePositiveArray;
const RuleReferenceArray = t.array(t.string); // should be non-empty strings?
exports.RuleReferenceArray = RuleReferenceArray;
const InvestigationGuide = t.string;

/**
 * Any instructions for the user for setting up their environment in order to start receiving
 * source events for a given rule.
 *
 * It's a multiline text. Markdown is supported.
 */
exports.InvestigationGuide = InvestigationGuide;
const SetupGuide = t.string;
exports.SetupGuide = SetupGuide;
const BuildingBlockType = t.string;
exports.BuildingBlockType = BuildingBlockType;
const AlertsIndex = t.string;
exports.AlertsIndex = AlertsIndex;
const AlertsIndexNamespace = t.string;
exports.AlertsIndexNamespace = AlertsIndexNamespace;
const ExceptionListArray = _securitysolutionIoTsListTypes.listArray;
exports.ExceptionListArray = ExceptionListArray;
const MaxSignals = _securitysolutionIoTsAlertingTypes.max_signals;
exports.MaxSignals = MaxSignals;
const ThreatArray = t.array(_securitysolutionIoTsAlertingTypes.threat);
exports.ThreatArray = ThreatArray;
const IndexPatternArray = t.array(t.string);
exports.IndexPatternArray = IndexPatternArray;
const DataViewId = t.string;
exports.DataViewId = DataViewId;
const RuleQuery = t.string;

/**
 * TODO: Right now the filters is an "unknown", when it could more than likely
 * become the actual ESFilter as a type.
 */
exports.RuleQuery = RuleQuery;
// Filters are not easily type-able yet
const RuleFilterArray = t.array(t.unknown); // Filters are not easily type-able yet
exports.RuleFilterArray = RuleFilterArray;