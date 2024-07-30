"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TriggerMethod = exports.SyncStatus = exports.FilteringValidationState = exports.FilteringRuleRule = exports.FilteringPolicy = exports.FeatureName = exports.ConnectorStatus = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let ConnectorStatus;
exports.ConnectorStatus = ConnectorStatus;
(function (ConnectorStatus) {
  ConnectorStatus["CREATED"] = "created";
  ConnectorStatus["NEEDS_CONFIGURATION"] = "needs_configuration";
  ConnectorStatus["CONFIGURED"] = "configured";
  ConnectorStatus["CONNECTED"] = "connected";
  ConnectorStatus["ERROR"] = "error";
})(ConnectorStatus || (exports.ConnectorStatus = ConnectorStatus = {}));
let SyncStatus;
exports.SyncStatus = SyncStatus;
(function (SyncStatus) {
  SyncStatus["CANCELING"] = "canceling";
  SyncStatus["CANCELED"] = "canceled";
  SyncStatus["COMPLETED"] = "completed";
  SyncStatus["ERROR"] = "error";
  SyncStatus["IN_PROGRESS"] = "in_progress";
  SyncStatus["PENDING"] = "pending";
  SyncStatus["SUSPENDED"] = "suspended";
})(SyncStatus || (exports.SyncStatus = SyncStatus = {}));
let FilteringPolicy;
exports.FilteringPolicy = FilteringPolicy;
(function (FilteringPolicy) {
  FilteringPolicy["EXCLUDE"] = "exclude";
  FilteringPolicy["INCLUDE"] = "include";
})(FilteringPolicy || (exports.FilteringPolicy = FilteringPolicy = {}));
let FilteringRuleRule;
exports.FilteringRuleRule = FilteringRuleRule;
(function (FilteringRuleRule) {
  FilteringRuleRule["CONTAINS"] = "contains";
  FilteringRuleRule["ENDS_WITH"] = "ends_with";
  FilteringRuleRule["EQUALS"] = "equals";
  FilteringRuleRule["GT"] = ">";
  FilteringRuleRule["LT"] = "<";
  FilteringRuleRule["REGEX"] = "regex";
  FilteringRuleRule["STARTS_WITH"] = "starts_with";
})(FilteringRuleRule || (exports.FilteringRuleRule = FilteringRuleRule = {}));
let FilteringValidationState;
exports.FilteringValidationState = FilteringValidationState;
(function (FilteringValidationState) {
  FilteringValidationState["EDITED"] = "edited";
  FilteringValidationState["INVALID"] = "invalid";
  FilteringValidationState["VALID"] = "valid";
})(FilteringValidationState || (exports.FilteringValidationState = FilteringValidationState = {}));
let TriggerMethod;
exports.TriggerMethod = TriggerMethod;
(function (TriggerMethod) {
  TriggerMethod["ON_DEMAND"] = "on_demand";
  TriggerMethod["SCHEDULED"] = "scheduled";
})(TriggerMethod || (exports.TriggerMethod = TriggerMethod = {}));
let FeatureName;
exports.FeatureName = FeatureName;
(function (FeatureName) {
  FeatureName["FILTERING_ADVANCED_CONFIG"] = "filtering_advanced_config";
  FeatureName["FILTERING_RULES"] = "filtering_rules";
})(FeatureName || (exports.FeatureName = FeatureName = {}));