"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndpointMetadataGenerator = void 0;
var _lodash = require("lodash");
var _semver = require("semver");
var _base_data_generator = require("./base_data_generator");
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Metadata generator for docs that are sent by the Endpoint running on hosts
 */
class EndpointMetadataGenerator extends _base_data_generator.BaseDataGenerator {
  /** Generate an Endpoint host metadata document */
  generate(overrides = {}) {
    var _overrides$Timestamp, _overrides$agent$vers, _overrides$agent;
    const ts = (_overrides$Timestamp = overrides['@timestamp']) !== null && _overrides$Timestamp !== void 0 ? _overrides$Timestamp : new Date().getTime();
    const hostName = this.randomHostname();
    const agentVersion = (_overrides$agent$vers = overrides === null || overrides === void 0 ? void 0 : (_overrides$agent = overrides.agent) === null || _overrides$agent === void 0 ? void 0 : _overrides$agent.version) !== null && _overrides$agent$vers !== void 0 ? _overrides$agent$vers : this.randomVersion();
    const agentId = this.seededUUIDv4();
    const isIsolated = this.randomBoolean(0.3);
    const capabilities = ['isolation'];

    // v8.4 introduced additional endpoint capabilities
    if ((0, _semver.gte)(agentVersion, '8.4.0')) {
      capabilities.push('kill_process', 'suspend_process', 'running_processes');
    }
    if ((0, _semver.gte)(agentVersion, '8.6.0')) {
      capabilities.push('get_file');
    }
    const hostMetadataDoc = {
      '@timestamp': ts,
      event: {
        created: ts,
        id: this.seededUUIDv4(),
        kind: 'metric',
        category: ['host'],
        type: ['info'],
        module: 'endpoint',
        action: 'endpoint_metadata',
        dataset: 'endpoint.metadata'
      },
      data_stream: {
        type: 'metrics',
        dataset: 'endpoint.metadata',
        namespace: 'default'
      },
      agent: {
        version: agentVersion,
        id: agentId,
        type: 'endpoint'
      },
      elastic: {
        agent: {
          id: agentId
        }
      },
      host: {
        id: this.seededUUIDv4(),
        hostname: hostName,
        name: hostName,
        architecture: this.randomString(10),
        ip: this.randomArray(3, () => this.randomIP()),
        mac: this.randomArray(3, () => this.randomMac()),
        os: this.randomOsFields()
      },
      Endpoint: {
        status: _types.EndpointStatus.enrolled,
        policy: {
          applied: {
            name: 'With Eventing',
            id: 'C2A9093E-E289-4C0A-AA44-8C32A414FA7A',
            status: _types.HostPolicyResponseActionStatus.success,
            endpoint_policy_version: 3,
            version: 5
          }
        },
        configuration: {
          isolation: isIsolated
        },
        state: {
          isolation: isIsolated
        },
        capabilities
      }
    };
    return (0, _lodash.merge)(hostMetadataDoc, overrides);
  }
  randomOsFields() {
    return this.randomChoice([{
      name: 'Windows',
      full: 'Windows 10',
      version: '10.0',
      platform: 'Windows',
      family: 'windows',
      Ext: {
        variant: 'Windows Pro'
      }
    }, {
      name: 'Windows',
      full: 'Windows Server 2016',
      version: '10.0',
      platform: 'Windows',
      family: 'windows',
      Ext: {
        variant: 'Windows Server'
      }
    }, {
      name: 'Windows',
      full: 'Windows Server 2012',
      version: '6.2',
      platform: 'Windows',
      family: 'windows',
      Ext: {
        variant: 'Windows Server'
      }
    }, {
      name: 'Windows',
      full: 'Windows Server 2012R2',
      version: '6.3',
      platform: 'Windows',
      family: 'windows',
      Ext: {
        variant: 'Windows Server Release 2'
      }
    }, {
      Ext: {
        variant: 'Debian'
      },
      kernel: '4.19.0-21-cloud-amd64 #1 SMP Debian 4.19.249-2 (2022-06-30)',
      name: 'Linux',
      family: 'debian',
      type: 'linux',
      version: '10.12',
      platform: 'debian',
      full: 'Debian 10.12'
    }]);
  }
}
exports.EndpointMetadataGenerator = EndpointMetadataGenerator;