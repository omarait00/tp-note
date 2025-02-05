"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FleetAgentGenerator = void 0;
var _lodash = require("lodash");
var _common = require("../../../../fleet/common");
var _moment = _interopRequireDefault(require("moment"));
var _base_data_generator = require("./base_data_generator");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// List of computed (as in, done in code is kibana via
// https://github.com/elastic/kibana/blob/main/x-pack/plugins/fleet/common/services/agent_status.ts#L13-L44
const agentStatusList = ['offline', 'error', 'online', 'inactive', 'warning', 'enrolling', 'unenrolling', 'updating', 'degraded'];
const lastCheckinStatusList = ['error', 'online', 'degraded', 'updating'];
class FleetAgentGenerator extends _base_data_generator.BaseDataGenerator {
  /**
   * @param [overrides] any partial value to the full Agent record
   *
   * @example
   *
   * fleetAgentGenerator.generate({
   *  local_metadata: {
   *    elastic: {
   *      agent: {
   *        log_level: `debug`
   *      }
   *    }
   *  }
   *  });
   */
  generate(overrides = {}) {
    var _hit$_source, _hit$_source$packages, _hit$_source2;
    const hit = this.generateEsHit();

    // The mapping below is identical to `searchHitToAgent()` located in
    // `x-pack/plugins/fleet/server/services/agents/helpers.ts:19`
    return (0, _lodash.merge)({
      // Casting here is needed because several of the attributes in `FleetServerAgent` are
      // defined as optional, but required in `Agent` type.
      ...hit._source,
      id: hit._id,
      policy_revision: (_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : _hit$_source.policy_revision_idx,
      access_api_key: undefined,
      status: this.randomAgentStatus(),
      packages: (_hit$_source$packages = (_hit$_source2 = hit._source) === null || _hit$_source2 === void 0 ? void 0 : _hit$_source2.packages) !== null && _hit$_source$packages !== void 0 ? _hit$_source$packages : []
    }, overrides);
  }

  /**
   * @param [overrides] any partial value to the full document
   */
  generateEsHit(overrides = {}) {
    const hostname = this.randomHostname();
    const now = new Date().toISOString();
    const osFamily = this.randomOSFamily();
    const componentStatus = this.randomChoice(_common.FleetServerAgentComponentStatuses);
    const componentInputPayload = componentStatus === 'failed' ? {
      error: {
        code: _constants.ENDPOINT_ERROR_CODES.ES_CONNECTION_ERROR,
        message: 'Unable to connect to Elasticsearch'
      }
    } : {
      extra: 'payload'
    };
    return (0, _lodash.merge)({
      _index: _common.AGENTS_INDEX,
      _id: this.randomUUID(),
      _score: 1.0,
      _source: {
        access_api_key_id: 'jY3dWnkBj1tiuAw9pAmq',
        action_seq_no: -1,
        active: true,
        enrolled_at: now,
        agent: {
          id: this.randomUUID(),
          version: this.randomVersion()
        },
        local_metadata: {
          elastic: {
            agent: {
              'build.original': `8.0.0-SNAPSHOT (build: ${this.randomString(5)} at 2021-05-07 18:42:49 +0000 UTC)`,
              id: this.randomUUID(),
              log_level: 'info',
              snapshot: true,
              upgradeable: true,
              version: '8.0.0'
            }
          },
          host: {
            architecture: 'x86_64',
            hostname,
            id: this.randomUUID(),
            ip: [this.randomIP()],
            mac: [this.randomMac()],
            name: hostname
          },
          os: {
            family: osFamily,
            full: `${osFamily} 2019 Datacenter`,
            kernel: '10.0.17763.1879 (Build.160101.0800)',
            name: `${osFamily} Server 2019 Datacenter`,
            platform: osFamily,
            version: this.randomVersion()
          }
        },
        user_provided_metadata: {},
        policy_id: this.randomUUID(),
        type: 'PERMANENT',
        default_api_key: 'so3dWnkBj1tiuAw9yAm3:t7jNlnPnR6azEI_YpXuBXQ',
        default_api_key_id: 'so3dWnkBj1tiuAw9yAm3',
        updated_at: now,
        last_checkin: now,
        policy_revision_idx: 2,
        policy_coordinator_idx: 1,
        components: [{
          id: 'endpoint-0',
          type: 'endpoint',
          status: componentStatus,
          message: 'Running as external service',
          units: [{
            id: 'endpoint-1',
            type: 'input',
            status: componentStatus,
            message: 'Protecting machine',
            payload: componentInputPayload
          }, {
            id: 'shipper',
            type: 'output',
            status: componentStatus,
            message: 'Connected over GRPC',
            payload: {
              extra: 'payload'
            }
          }]
        }],
        last_checkin_status: this.randomChoice(lastCheckinStatusList),
        upgraded_at: null,
        upgrade_started_at: null,
        unenrolled_at: undefined,
        unenrollment_started_at: undefined
      }
    }, overrides);
  }
  generateEsHitWithStatus(status, overrides = {}) {
    const esHit = this.generateEsHit(overrides);

    // Basically: reverse engineer the Fleet `getAgentStatus()` utility:
    // https://github.com/elastic/kibana/blob/main/x-pack/plugins/fleet/common/services/agent_status.ts#L13-L44

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const fleetServerAgent = esHit._source;

    // Reset the `last_checkin_status since we're controlling the agent status here
    fleetServerAgent.last_checkin_status = 'online';
    switch (status) {
      case 'degraded':
        fleetServerAgent.last_checkin_status = 'degraded';
        break;
      case 'enrolling':
        fleetServerAgent.last_checkin = undefined;
        break;
      case 'error':
        fleetServerAgent.last_checkin_status = 'error';
        break;
      case 'inactive':
        fleetServerAgent.active = false;
        break;
      case 'offline':
        // current fleet timeout interface for offline is 5 minutes
        // https://github.com/elastic/kibana/blob/main/x-pack/plugins/fleet/common/services/agent_status.ts#L11
        fleetServerAgent.last_checkin = (0, _moment.default)().subtract(6, 'minutes').toISOString();
        break;
      case 'unenrolling':
        fleetServerAgent.unenrollment_started_at = fleetServerAgent.updated_at;
        fleetServerAgent.unenrolled_at = undefined;
        break;
      case 'updating':
        fleetServerAgent.upgrade_started_at = fleetServerAgent.updated_at;
        fleetServerAgent.upgraded_at = undefined;
        break;
      case 'warning':
        // NOt able to find anything in fleet
        break;

      // default is `online`, which is also the default returned by `generateEsHit()`
    }

    return esHit;
  }
  randomAgentStatus() {
    return this.randomChoice(agentStatusList);
  }
}
exports.FleetAgentGenerator = FleetAgentGenerator;