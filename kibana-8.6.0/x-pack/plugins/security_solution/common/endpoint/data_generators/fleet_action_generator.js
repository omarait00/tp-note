"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FleetActionGenerator = void 0;
var _lodash = require("lodash");
var _common = require("../../../../fleet/common");
var _base_data_generator = require("./base_data_generator");
var _types = require("../types");
var _constants = require("../service/response_actions/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class FleetActionGenerator extends _base_data_generator.BaseDataGenerator {
  /** Generate a random endpoint Action (isolate or unisolate) */
  generate(overrides = {}) {
    const timeStamp = overrides['@timestamp'] ? new Date(overrides['@timestamp']) : new Date();
    return (0, _lodash.merge)({
      action_id: this.seededUUIDv4(),
      '@timestamp': timeStamp.toISOString(),
      expiration: this.randomFutureDate(timeStamp),
      type: 'INPUT_ACTION',
      input_type: 'endpoint',
      agents: [this.seededUUIDv4()],
      user_id: 'elastic',
      data: {
        command: this.randomResponseActionCommand(),
        comment: this.randomString(15),
        parameter: undefined,
        output: undefined
      }
    }, overrides);
  }
  generateActionEsHit(overrides = {}) {
    return Object.assign(this.toEsSearchHit(this.generate(overrides)), {
      _index: _common.AGENT_ACTIONS_INDEX
    });
  }
  generateIsolateAction(overrides = {}) {
    return (0, _lodash.merge)(this.generate({
      data: {
        command: 'isolate'
      }
    }), overrides);
  }
  generateUnIsolateAction(overrides = {}) {
    return (0, _lodash.merge)(this.generate({
      data: {
        command: 'unisolate'
      }
    }), overrides);
  }

  /** Generates an endpoint action response */
  generateResponse(overrides = {}) {
    const timeStamp = overrides['@timestamp'] ? new Date(overrides['@timestamp']) : new Date();
    const startedAtTimes = [];
    [2, 3, 5, 8, 13, 21].forEach(n => {
      startedAtTimes.push(timeStamp.setMinutes(-this.randomN(n)), timeStamp.setSeconds(-this.randomN(n)));
    });
    return (0, _lodash.merge)({
      action_data: {
        command: this.randomResponseActionCommand(),
        comment: '',
        parameter: undefined
      },
      action_id: this.seededUUIDv4(),
      agent_id: this.seededUUIDv4(),
      started_at: new Date(startedAtTimes[this.randomN(startedAtTimes.length)]).toISOString(),
      completed_at: timeStamp.toISOString(),
      error: undefined,
      '@timestamp': timeStamp.toISOString()
    }, overrides);
  }
  generateResponseEsHit(overrides = {}) {
    return Object.assign(this.toEsSearchHit(this.generateResponse(overrides)), {
      _index: _common.AGENT_ACTIONS_RESULTS_INDEX
    });
  }

  /**
   * An Activity Log entry as returned by the Activity log API
   * @param overrides
   */
  generateActivityLogAction(overrides = {}) {
    return (0, _lodash.merge)({
      type: _types.ActivityLogItemTypes.FLEET_ACTION,
      item: {
        id: this.seededUUIDv4(),
        data: this.generate()
      }
    }, overrides);
  }

  /**
   * An Activity Log entry as returned by the Activity log API
   * @param overrides
   */
  generateActivityLogActionResponse(overrides = {}) {
    return (0, _lodash.merge)({
      type: _types.ActivityLogItemTypes.FLEET_RESPONSE,
      item: {
        id: this.seededUUIDv4(),
        data: this.generateResponse()
      }
    }, overrides);
  }
  randomFloat() {
    return this.random();
  }
  randomN(max) {
    return super.randomN(max);
  }
  randomResponseActionCommand() {
    return this.randomChoice(_constants.RESPONSE_ACTION_API_COMMANDS_NAMES);
  }
}
exports.FleetActionGenerator = FleetActionGenerator;