"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCloudDeploymentMetadataAnalyticsContext = registerCloudDeploymentMetadataAnalyticsContext;
var _rxjs = require("rxjs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerCloudDeploymentMetadataAnalyticsContext(analytics, cloudMetadata) {
  if (!cloudMetadata.id) {
    return;
  }
  const {
    id: cloudId,
    trial_end_date: cloudTrialEndDate,
    is_elastic_staff_owned: cloudIsElasticStaffOwned
  } = cloudMetadata;
  analytics.registerContextProvider({
    name: 'Cloud Deployment Metadata',
    context$: (0, _rxjs.of)({
      cloudId,
      cloudTrialEndDate,
      cloudIsElasticStaffOwned
    }),
    schema: {
      cloudId: {
        type: 'keyword',
        _meta: {
          description: 'The Cloud Deployment ID'
        }
      },
      cloudTrialEndDate: {
        type: 'date',
        _meta: {
          description: 'When the Elastic Cloud trial ends/ended',
          optional: true
        }
      },
      cloudIsElasticStaffOwned: {
        type: 'boolean',
        _meta: {
          description: '`true` if the owner of the deployment is an Elastician',
          optional: true
        }
      }
    }
  });
}