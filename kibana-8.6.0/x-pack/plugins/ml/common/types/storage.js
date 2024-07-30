"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ML_STORAGE_KEYS = exports.ML_NOTIFICATIONS_LAST_CHECKED_AT = exports.ML_GETTING_STARTED_CALLOUT_DISMISSED = exports.ML_FROZEN_TIER_PREFERENCE = exports.ML_ENTITY_FIELDS_CONFIG = exports.ML_APPLY_TIME_RANGE_CONFIG = exports.ML_ANOMALY_EXPLORER_PANELS = void 0;
exports.isMlStorageKey = isMlStorageKey;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ML_ENTITY_FIELDS_CONFIG = 'ml.singleMetricViewer.partitionFields';
exports.ML_ENTITY_FIELDS_CONFIG = ML_ENTITY_FIELDS_CONFIG;
const ML_APPLY_TIME_RANGE_CONFIG = 'ml.jobSelectorFlyout.applyTimeRange';
exports.ML_APPLY_TIME_RANGE_CONFIG = ML_APPLY_TIME_RANGE_CONFIG;
const ML_GETTING_STARTED_CALLOUT_DISMISSED = 'ml.gettingStarted.isDismissed';
exports.ML_GETTING_STARTED_CALLOUT_DISMISSED = ML_GETTING_STARTED_CALLOUT_DISMISSED;
const ML_FROZEN_TIER_PREFERENCE = 'ml.frozenDataTierPreference';
exports.ML_FROZEN_TIER_PREFERENCE = ML_FROZEN_TIER_PREFERENCE;
const ML_ANOMALY_EXPLORER_PANELS = 'ml.anomalyExplorerPanels';
exports.ML_ANOMALY_EXPLORER_PANELS = ML_ANOMALY_EXPLORER_PANELS;
const ML_NOTIFICATIONS_LAST_CHECKED_AT = 'ml.notificationsLastCheckedAt';
exports.ML_NOTIFICATIONS_LAST_CHECKED_AT = ML_NOTIFICATIONS_LAST_CHECKED_AT;
const ML_STORAGE_KEYS = [ML_ENTITY_FIELDS_CONFIG, ML_APPLY_TIME_RANGE_CONFIG, ML_GETTING_STARTED_CALLOUT_DISMISSED, ML_FROZEN_TIER_PREFERENCE, ML_ANOMALY_EXPLORER_PANELS, ML_NOTIFICATIONS_LAST_CHECKED_AT];
exports.ML_STORAGE_KEYS = ML_STORAGE_KEYS;
function isMlStorageKey(key) {
  return typeof key === 'string' && ML_STORAGE_KEYS.includes(key);
}