"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionResponsesTransform = void 0;
var _common = require("../../../fleet/common");
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const actionResponsesTransform = {
  transform_id: 'osquery_manager.action_responses-default-0.0.1',
  description: 'Latest osquery_manager action responses',
  source: {
    index: [`${_common.AGENT_ACTIONS_INDEX}*`],
    query: {
      bool: {
        should: [{
          match_phrase: {
            action_input_type: 'osquery'
          }
        }],
        minimum_should_match: 1
      }
    }
  },
  dest: {
    index: `${_constants.ACTION_RESPONSES_INDEX}-default`
  },
  sync: {
    time: {
      field: '@timestamp',
      delay: '1s'
    }
  },
  latest: {
    unique_key: ['@timestamp', 'action_id', 'agent_id'],
    sort: '@timestamp'
  },
  frequency: '1s',
  _meta: {
    managed: 'true'
  }
};
exports.actionResponsesTransform = actionResponsesTransform;