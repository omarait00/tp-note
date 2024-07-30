"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedObjectTypes = exports.initSavedObjects = void 0;
var _saved_object_mappings = require("./lib/timeline/saved_object_mappings");
var _rule_actions_legacy = require("./lib/detection_engine/rule_actions_legacy");
var _rule_monitoring = require("./lib/detection_engine/rule_monitoring");
var _rule_asset_saved_object_mappings = require("./lib/detection_engine/prebuilt_rules/logic/rule_asset/rule_asset_saved_object_mappings");
var _saved_objects = require("./lib/detection_engine/migrations/saved_objects");
var _saved_object_mappings2 = require("./endpoint/lib/artifacts/saved_object_mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

const types = [_saved_object_mappings.noteType, _saved_object_mappings.pinnedEventType, _rule_actions_legacy.legacyType, _rule_monitoring.ruleExecutionType, _rule_asset_saved_object_mappings.ruleAssetType, _saved_object_mappings.timelineType, _saved_object_mappings2.exceptionsArtifactType, _saved_object_mappings2.manifestType, _saved_objects.type];
const savedObjectTypes = types.map(type => type.name);
exports.savedObjectTypes = savedObjectTypes;
const initSavedObjects = savedObjects => {
  types.forEach(type => savedObjects.registerType(type));
};
exports.initSavedObjects = initSavedObjects;