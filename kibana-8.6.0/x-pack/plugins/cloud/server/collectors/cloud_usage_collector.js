"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCloudUsageCollector = createCloudUsageCollector;
exports.registerCloudUsageCollector = registerCloudUsageCollector;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createCloudUsageCollector(usageCollection, config) {
  const {
    isCloudEnabled,
    trialEndDate,
    isElasticStaffOwned
  } = config;
  const trialEndDateMs = trialEndDate ? new Date(trialEndDate).getTime() : undefined;
  return usageCollection.makeUsageCollector({
    type: 'cloud',
    isReady: () => true,
    schema: {
      isCloudEnabled: {
        type: 'boolean'
      },
      trialEndDate: {
        type: 'date'
      },
      inTrial: {
        type: 'boolean'
      },
      isElasticStaffOwned: {
        type: 'boolean'
      }
    },
    fetch: () => {
      return {
        isCloudEnabled,
        isElasticStaffOwned,
        trialEndDate,
        ...(trialEndDateMs ? {
          inTrial: Date.now() <= trialEndDateMs
        } : {})
      };
    }
  });
}
function registerCloudUsageCollector(usageCollection, config) {
  if (!usageCollection) {
    return;
  }
  const collector = createCloudUsageCollector(usageCollection, config);
  usageCollection.registerCollector(collector);
}