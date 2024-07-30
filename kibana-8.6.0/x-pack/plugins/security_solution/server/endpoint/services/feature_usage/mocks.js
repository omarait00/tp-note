"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFeatureUsageServiceMock = createFeatureUsageServiceMock;
exports.createMockPolicyData = createMockPolicyData;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createFeatureUsageServiceMock() {
  return {
    setup: jest.fn(),
    start: jest.fn(),
    notifyUsage: jest.fn()
  };
}
function createMockPolicyData() {
  return {
    inputs: [{
      config: {
        policy: {
          value: {
            windows: {
              ransomware: {
                mode: 'off'
              },
              memory_protection: {
                mode: 'off'
              },
              behavior_protection: {
                mode: 'off'
              }
            },
            mac: {
              memory_protection: {
                mode: 'off'
              },
              behavior_protection: {
                mode: 'off'
              }
            },
            linux: {
              memory_protection: {
                mode: 'off'
              },
              behavior_protection: {
                mode: 'off'
              }
            }
          }
        }
      }
    }]
  };
}