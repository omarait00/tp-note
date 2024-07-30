"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloudMock = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createSetupMock() {
  return {
    cloudId: 'mock-cloud-id',
    instanceSizeMb: 1234,
    deploymentId: 'deployment-id',
    isCloudEnabled: true,
    isElasticStaffOwned: true,
    trialEndDate: new Date('2020-10-01T14:13:12Z'),
    apm: {
      url: undefined,
      secretToken: undefined
    }
  };
}
const cloudMock = {
  createSetup: createSetupMock
};
exports.cloudMock = cloudMock;