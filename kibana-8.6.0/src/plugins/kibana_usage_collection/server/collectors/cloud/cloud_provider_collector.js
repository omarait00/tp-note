"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCloudProviderUsageCollector = registerCloudProviderUsageCollector;
var _rxjs = require("rxjs");
var _abortController = _interopRequireDefault(require("abort-controller"));
var _detector = require("./detector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function registerCloudProviderUsageCollector(usageCollection, pluginStop$) {
  const ac = new _abortController.default();
  // we are stopping, we need to cancel async requests
  (0, _rxjs.firstValueFrom)(pluginStop$).finally(() => ac.abort());
  const cloudDetector = new _detector.CloudDetector();
  // determine the cloud service in the background
  cloudDetector.detectCloudService(ac.signal);
  const collector = usageCollection.makeUsageCollector({
    type: 'cloud_provider',
    isReady: () => typeof cloudDetector.getCloudDetails() !== 'undefined',
    async fetch() {
      const details = cloudDetector.getCloudDetails();
      if (!details) {
        return;
      }
      return {
        name: details.name,
        vm_type: details.vm_type,
        region: details.region,
        zone: details.zone
      };
    },
    schema: {
      name: {
        type: 'keyword',
        _meta: {
          description: 'The name of the cloud provider'
        }
      },
      vm_type: {
        type: 'keyword',
        _meta: {
          description: 'The VM instance type'
        }
      },
      region: {
        type: 'keyword',
        _meta: {
          description: 'The cloud provider region'
        }
      },
      zone: {
        type: 'keyword',
        _meta: {
          description: 'The availability zone within the region'
        }
      }
    }
  });
  usageCollection.registerCollector(collector);
}