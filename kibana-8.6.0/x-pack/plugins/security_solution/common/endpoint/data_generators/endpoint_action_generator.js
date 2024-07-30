"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndpointActionGenerator = void 0;
var _lodash = require("lodash");
var _constants = require("../constants");
var _base_data_generator = require("./base_data_generator");
var _types = require("../types");
var _constants2 = require("../service/response_actions/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class EndpointActionGenerator extends _base_data_generator.BaseDataGenerator {
  /** Generate a random endpoint Action request (isolate or unisolate) */
  generate(overrides = {}) {
    const timeStamp = overrides['@timestamp'] ? new Date(overrides['@timestamp']) : new Date();
    return (0, _lodash.merge)({
      '@timestamp': timeStamp.toISOString(),
      agent: {
        id: [this.seededUUIDv4()]
      },
      EndpointActions: {
        action_id: this.seededUUIDv4(),
        expiration: this.randomFutureDate(timeStamp),
        type: 'INPUT_ACTION',
        input_type: 'endpoint',
        data: {
          command: this.randomResponseActionCommand(),
          comment: this.randomString(15),
          parameters: undefined
        }
      },
      error: undefined,
      user: {
        id: this.randomUser()
      }
    }, overrides);
  }
  generateActionEsHit(overrides = {}) {
    return Object.assign(this.toEsSearchHit(this.generate(overrides)), {
      _index: `.ds-${_constants.ENDPOINT_ACTIONS_DS}-some_namespace`
    });
  }

  /** Generates an endpoint action response */
  generateResponse(overrides = {}) {
    var _overrides$EndpointAc, _overrides$EndpointAc2, _overrides$EndpointAc3, _overrides$EndpointAc4, _overrides$EndpointAc5;
    const timeStamp = overrides['@timestamp'] ? new Date(overrides['@timestamp']) : new Date();
    const startedAtTimes = [];
    [2, 3, 5, 8, 13, 21].forEach(n => {
      startedAtTimes.push(timeStamp.setMinutes(-this.randomN(n)), timeStamp.setSeconds(-this.randomN(n)));
    });
    const command = (_overrides$EndpointAc = overrides === null || overrides === void 0 ? void 0 : (_overrides$EndpointAc2 = overrides.EndpointActions) === null || _overrides$EndpointAc2 === void 0 ? void 0 : (_overrides$EndpointAc3 = _overrides$EndpointAc2.data) === null || _overrides$EndpointAc3 === void 0 ? void 0 : _overrides$EndpointAc3.command) !== null && _overrides$EndpointAc !== void 0 ? _overrides$EndpointAc : this.randomResponseActionCommand();
    let output = overrides === null || overrides === void 0 ? void 0 : (_overrides$EndpointAc4 = overrides.EndpointActions) === null || _overrides$EndpointAc4 === void 0 ? void 0 : (_overrides$EndpointAc5 = _overrides$EndpointAc4.data) === null || _overrides$EndpointAc5 === void 0 ? void 0 : _overrides$EndpointAc5.output;
    if (command === 'get-file') {
      if (!output) {
        output = {
          type: 'json',
          content: {
            code: 'ra_get-file_success_done',
            zip_size: 123,
            contents: [{
              type: 'file',
              path: '/some/path/bad_file.txt',
              size: 1234,
              file_name: 'bad_file.txt',
              sha256: '9558c5cb39622e9b3653203e772b129d6c634e7dbd7af1b244352fc1d704601f'
            }]
          }
        };
      }
    }
    return (0, _lodash.merge)({
      '@timestamp': timeStamp.toISOString(),
      agent: {
        id: this.seededUUIDv4()
      },
      EndpointActions: {
        action_id: this.seededUUIDv4(),
        completed_at: timeStamp.toISOString(),
        // randomly before a few hours/minutes/seconds later
        started_at: new Date(startedAtTimes[this.randomN(startedAtTimes.length)]).toISOString(),
        data: {
          command,
          comment: '',
          output
        }
      },
      error: undefined
    }, overrides);
  }
  generateResponseEsHit(overrides = {}) {
    return Object.assign(this.toEsSearchHit(this.generateResponse(overrides)), {
      _index: `.ds-${_constants.ENDPOINT_ACTION_RESPONSES_DS}-some_namespace-something`
    });
  }
  generateActionDetails(overrides = {}) {
    const details = (0, _lodash.merge)({
      agents: ['agent-a'],
      command: 'isolate',
      completedAt: '2022-04-30T16:08:47.449Z',
      hosts: {
        'agent-a': {
          name: 'Host-agent-a'
        }
      },
      id: '123',
      isCompleted: true,
      isExpired: false,
      wasSuccessful: true,
      errors: undefined,
      startedAt: '2022-04-27T16:08:47.449Z',
      status: 'successful',
      comment: 'thisisacomment',
      createdBy: 'auserid',
      parameters: undefined,
      outputs: {},
      agentState: {
        'agent-a': {
          errors: undefined,
          isCompleted: true,
          completedAt: '2022-04-30T16:08:47.449Z',
          wasSuccessful: true
        }
      }
    }, overrides);
    if (details.command === 'get-file') {
      if (!details.parameters) {
        details.parameters = {
          path: '/some/file.txt'
        };
      }
      if (!details.outputs || Object.keys(details.outputs).length === 0) {
        details.outputs = {
          [details.agents[0]]: {
            type: 'json',
            content: {
              code: 'ra_get-file_success',
              path: '/some/file/txt',
              size: 1234,
              zip_size: 123
            }
          }
        };
      }
    }
    return details;
  }
  randomGetFileFailureCode() {
    return this.randomChoice(['ra_get-file_error_not-found', 'ra_get-file_error_is-directory', 'ra_get-file_error_invalid-input', 'ra_get-file_error_not-permitted', 'ra_get-file_error_too-big', 'ra_get-file_error_disk-quota', 'ra_get-file_error_processing', 'ra_get-file_error_upload-api-unreachable', 'ra_get-file_error_upload-timeout', 'ra_get-file_error_queue-timeout']);
  }
  generateActivityLogAction(overrides) {
    return (0, _lodash.merge)({
      type: _types.ActivityLogItemTypes.ACTION,
      item: {
        id: this.seededUUIDv4(),
        data: this.generate()
      }
    }, overrides);
  }
  generateActivityLogActionResponse(overrides) {
    var _overrides$item$data, _overrides$item;
    return (0, _lodash.merge)({
      type: _types.ActivityLogItemTypes.RESPONSE,
      item: {
        id: this.seededUUIDv4(),
        data: this.generateResponse({
          ...((_overrides$item$data = overrides === null || overrides === void 0 ? void 0 : (_overrides$item = overrides.item) === null || _overrides$item === void 0 ? void 0 : _overrides$item.data) !== null && _overrides$item$data !== void 0 ? _overrides$item$data : {})
        })
      }
    }, overrides);
  }
  generateAgentPendingActionsSummary(overrides = {}) {
    return (0, _lodash.merge)({
      agent_id: this.seededUUIDv4(),
      pending_actions: {
        isolate: 2,
        unisolate: 0
      }
    }, overrides);
  }
  randomFloat() {
    return this.random();
  }
  randomN(max) {
    return super.randomN(max);
  }
  randomResponseActionProcesses(n) {
    const numberOfEntries = n !== null && n !== void 0 ? n : this.randomChoice([20, 30, 40, 50]);
    const entries = [];
    for (let i = 0; i < numberOfEntries; i++) {
      entries.push({
        command: this.randomResponseActionProcessesCommand(),
        pid: this.randomN(1000).toString(),
        entity_id: this.randomString(50),
        user: this.randomUser()
      });
    }
    return entries;
  }
  randomResponseActionProcessesCommand() {
    const commands = ['/opt/cmd1', '/opt/cmd2', '/opt/cmd3/opt/cmd3/opt/cmd3/opt/cmd3/opt/cmd3/opt/cmd3/opt/cmd3/opt/cmd3', '/opt/cmd3/opt/cmd3/opt/cmd3/opt/cmd3'];
    return this.randomChoice(commands);
  }
  randomResponseActionCommand() {
    return this.randomChoice(_constants2.RESPONSE_ACTION_API_COMMANDS_NAMES);
  }
}
exports.EndpointActionGenerator = EndpointActionGenerator;