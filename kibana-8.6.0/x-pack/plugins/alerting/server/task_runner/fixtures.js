"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleType = exports.mockedRuleTypeSavedObject = exports.mockTaskInstance = exports.mockRunNowResponse = exports.mockDate = exports.generateSavedObjectParams = exports.generateRunnerResult = exports.generateEnqueueFunctionInput = exports.generateAlertOpts = exports.generateAlertInstance = exports.generateActionOpts = exports.SAVED_OBJECT = exports.RULE_TYPE_ID = exports.RULE_NAME = exports.RULE_ID = exports.RULE_ACTIONS = exports.MOCK_DURATION = exports.GENERIC_ERROR_MESSAGE = exports.DATE_9999 = exports.DATE_1970_5_MIN = exports.DATE_1970 = exports.DATE_1969 = void 0;
var _server = require("../../../task_manager/server");
var _common = require("../../common");
var _monitoring = require("../lib/monitoring");
var _plugin = require("../plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const RULE_NAME = 'rule-name';
exports.RULE_NAME = RULE_NAME;
const RULE_ID = '1';
exports.RULE_ID = RULE_ID;
const RULE_TYPE_ID = 'test';
exports.RULE_TYPE_ID = RULE_TYPE_ID;
const DATE_1969 = '1969-12-31T00:00:00.000Z';
exports.DATE_1969 = DATE_1969;
const DATE_1970 = '1970-01-01T00:00:00.000Z';
exports.DATE_1970 = DATE_1970;
const DATE_1970_5_MIN = '1969-12-31T23:55:00.000Z';
exports.DATE_1970_5_MIN = DATE_1970_5_MIN;
const DATE_9999 = '9999-12-31T12:34:56.789Z';
exports.DATE_9999 = DATE_9999;
const MOCK_DURATION = '86400000000000';
exports.MOCK_DURATION = MOCK_DURATION;
const SAVED_OBJECT = {
  id: '1',
  type: 'alert',
  attributes: {
    apiKey: Buffer.from('123:abc').toString('base64'),
    consumer: 'bar',
    enabled: true
  },
  references: []
};
exports.SAVED_OBJECT = SAVED_OBJECT;
const RULE_ACTIONS = [{
  actionTypeId: 'action',
  group: 'default',
  id: '1',
  params: {
    foo: true
  }
}, {
  actionTypeId: 'action',
  group: 'recovered',
  id: '2',
  params: {
    isResolved: true
  }
}];
exports.RULE_ACTIONS = RULE_ACTIONS;
const defaultHistory = [{
  success: true,
  timestamp: 0
}];
const generateSavedObjectParams = ({
  error = null,
  warning = null,
  status = 'ok',
  outcome = 'succeeded',
  nextRun = '1970-01-01T00:00:10.000Z',
  successRatio = 1,
  history = defaultHistory,
  alertsCount
}) => ['alert', '1', {
  monitoring: {
    run: {
      calculated_metrics: {
        success_ratio: successRatio
      },
      history,
      last_run: {
        timestamp: '1970-01-01T00:00:00.000Z',
        metrics: {
          gap_duration_s: null,
          total_alerts_created: null,
          total_alerts_detected: null,
          total_indexing_duration_ms: null,
          total_search_duration_ms: null
        }
      }
    }
  },
  executionStatus: {
    error,
    lastDuration: 0,
    lastExecutionDate: '1970-01-01T00:00:00.000Z',
    status,
    warning
  },
  lastRun: {
    outcome,
    outcomeMsg: (error === null || error === void 0 ? void 0 : error.message) || (warning === null || warning === void 0 ? void 0 : warning.message) || null,
    warning: (error === null || error === void 0 ? void 0 : error.reason) || (warning === null || warning === void 0 ? void 0 : warning.reason) || null,
    alertsCount: {
      active: 0,
      ignored: 0,
      new: 0,
      recovered: 0,
      ...(alertsCount || {})
    }
  },
  nextRun
}, {
  refresh: false,
  namespace: undefined
}];
exports.generateSavedObjectParams = generateSavedObjectParams;
const GENERIC_ERROR_MESSAGE = 'GENERIC ERROR MESSAGE';
exports.GENERIC_ERROR_MESSAGE = GENERIC_ERROR_MESSAGE;
const ruleType = {
  id: RULE_TYPE_ID,
  name: 'My test rule',
  actionGroups: [{
    id: 'default',
    name: 'Default'
  }, _common.RecoveredActionGroup],
  defaultActionGroupId: 'default',
  minimumLicenseRequired: 'basic',
  isExportable: true,
  recoveryActionGroup: _common.RecoveredActionGroup,
  executor: jest.fn(),
  producer: 'alerts',
  cancelAlertsOnRuleTimeout: true,
  ruleTaskTimeout: '5m'
};
exports.ruleType = ruleType;
const mockRunNowResponse = {
  id: 1
};
exports.mockRunNowResponse = mockRunNowResponse;
const mockDate = new Date('2019-02-12T21:01:22.479Z');
exports.mockDate = mockDate;
const mockedRuleTypeSavedObject = {
  id: '1',
  consumer: 'bar',
  createdAt: mockDate,
  updatedAt: mockDate,
  throttle: null,
  muteAll: false,
  notifyWhen: 'onActiveAlert',
  enabled: true,
  alertTypeId: ruleType.id,
  apiKey: '',
  apiKeyOwner: 'elastic',
  schedule: {
    interval: '10s'
  },
  name: RULE_NAME,
  tags: ['rule-', '-tags'],
  createdBy: 'rule-creator',
  updatedBy: 'rule-updater',
  mutedInstanceIds: [],
  params: {
    bar: true
  },
  actions: [{
    group: 'default',
    id: '1',
    actionTypeId: 'action',
    params: {
      foo: true
    }
  }, {
    group: _common.RecoveredActionGroup.id,
    id: '2',
    actionTypeId: 'action',
    params: {
      isResolved: true
    }
  }],
  executionStatus: {
    status: 'unknown',
    lastExecutionDate: new Date('2020-08-20T19:23:38Z')
  },
  monitoring: (0, _monitoring.getDefaultMonitoring)('2020-08-20T19:23:38Z')
};
exports.mockedRuleTypeSavedObject = mockedRuleTypeSavedObject;
const mockTaskInstance = () => ({
  id: '',
  attempts: 0,
  status: _server.TaskStatus.Running,
  version: '123',
  runAt: new Date(),
  schedule: {
    interval: '10s'
  },
  scheduledAt: new Date(),
  startedAt: new Date(),
  retryAt: new Date(Date.now() + 5 * 60 * 1000),
  state: {},
  taskType: 'alerting:test',
  params: {
    alertId: RULE_ID,
    spaceId: 'default',
    consumer: 'bar'
  },
  ownerId: null
});
exports.mockTaskInstance = mockTaskInstance;
const generateAlertOpts = ({
  action,
  group,
  state,
  id
} = {}) => {
  var _id;
  id = (_id = id) !== null && _id !== void 0 ? _id : '1';
  let message = '';
  switch (action) {
    case _plugin.EVENT_LOG_ACTIONS.newInstance:
      message = `test:1: 'rule-name' created new alert: '${id}'`;
      break;
    case _plugin.EVENT_LOG_ACTIONS.activeInstance:
      message = `test:1: 'rule-name' active alert: '${id}' in actionGroup: 'default'`;
      break;
    case _plugin.EVENT_LOG_ACTIONS.recoveredInstance:
      message = `test:1: 'rule-name' alert '${id}' has recovered`;
      break;
  }
  return {
    action,
    id,
    message,
    state,
    ...(group ? {
      group
    } : {}),
    flapping: false
  };
};
exports.generateAlertOpts = generateAlertOpts;
const generateActionOpts = ({
  id,
  alertGroup,
  alertId
} = {}) => ({
  id: id !== null && id !== void 0 ? id : '1',
  typeId: 'action',
  alertId: alertId !== null && alertId !== void 0 ? alertId : '1',
  alertGroup: alertGroup !== null && alertGroup !== void 0 ? alertGroup : 'default'
});
exports.generateActionOpts = generateActionOpts;
const generateRunnerResult = ({
  successRatio = 1,
  history = Array(false),
  state = false,
  interval = '10s',
  alertInstances = {}
} = {}) => {
  return {
    monitoring: {
      run: {
        calculated_metrics: {
          success_ratio: successRatio
        },
        // @ts-ignore
        history: history.map(success => ({
          success,
          timestamp: 0
        })),
        last_run: {
          metrics: {
            gap_duration_s: null,
            total_alerts_created: null,
            total_alerts_detected: null,
            total_indexing_duration_ms: null,
            total_search_duration_ms: null
          },
          timestamp: '1970-01-01T00:00:00.000Z'
        }
      }
    },
    schedule: {
      interval
    },
    state: {
      ...(state && {
        alertInstances
      }),
      ...(state && {
        alertTypeState: undefined
      }),
      ...(state && {
        previousStartedAt: new Date('1970-01-01T00:00:00.000Z')
      })
    }
  };
};
exports.generateRunnerResult = generateRunnerResult;
const generateEnqueueFunctionInput = (isArray = false) => {
  const input = {
    apiKey: 'MTIzOmFiYw==',
    executionId: '5f6aa57d-3e22-484e-bae8-cbed868f4d28',
    id: '1',
    params: {
      foo: true
    },
    consumer: 'bar',
    relatedSavedObjects: [{
      id: '1',
      namespace: undefined,
      type: 'alert',
      typeId: RULE_TYPE_ID
    }],
    source: {
      source: {
        id: '1',
        type: 'alert'
      },
      type: 'SAVED_OBJECT'
    },
    spaceId: 'default'
  };
  return isArray ? [input] : input;
};
exports.generateEnqueueFunctionInput = generateEnqueueFunctionInput;
const generateAlertInstance = ({
  id,
  duration,
  start
} = {
  id: 1
}) => ({
  [String(id)]: {
    meta: {
      lastScheduledActions: {
        date: new Date(DATE_1970),
        group: 'default'
      }
    },
    state: {
      bar: false,
      duration,
      start
    }
  }
});
exports.generateAlertInstance = generateAlertInstance;