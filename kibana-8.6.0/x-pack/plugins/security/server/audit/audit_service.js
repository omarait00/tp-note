"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLoggingConfig = exports.RECORD_USAGE_INTERVAL = exports.ECS_VERSION = exports.AuditService = void 0;
exports.filterEvent = filterEvent;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _operators = require("rxjs/operators");
var _audit_events = require("./audit_events");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ECS_VERSION = '1.6.0';
exports.ECS_VERSION = ECS_VERSION;
const RECORD_USAGE_INTERVAL = 60 * 60 * 1000; // 1 hour
exports.RECORD_USAGE_INTERVAL = RECORD_USAGE_INTERVAL;
class AuditService {
  constructor(_logger) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "usageIntervalId", void 0);
    this.logger = _logger.get('ecs');
  }
  setup({
    license,
    config,
    logging,
    http,
    getCurrentUser,
    getSID,
    getSpaceId,
    recordAuditLoggingUsage
  }) {
    // Configure logging during setup and when license changes
    logging.configure(license.features$.pipe((0, _operators.distinctUntilKeyChanged)('allowAuditLogging'), createLoggingConfig(config)));

    // Record feature usage at a regular interval if enabled and license allows
    const enabled = !!(config.enabled && config.appender);
    if (enabled) {
      license.features$.subscribe(features => {
        clearInterval(this.usageIntervalId);
        if (features.allowAuditLogging) {
          recordAuditLoggingUsage();
          this.usageIntervalId = setInterval(recordAuditLoggingUsage, RECORD_USAGE_INTERVAL);
          if (this.usageIntervalId.unref) {
            this.usageIntervalId.unref();
          }
        }
      });
    }
    const log = event => {
      if (!event) {
        return;
      }
      if (filterEvent(event, config.ignore_filters)) {
        const {
          message,
          ...eventMeta
        } = event;
        this.logger.info(message, eventMeta);
      }
    };
    const asScoped = request => ({
      log: async event => {
        if (!event) {
          return;
        }
        const spaceId = getSpaceId(request);
        const user = getCurrentUser(request);
        const sessionId = await getSID(request);
        log({
          ...event,
          user: user && {
            id: user.profile_uid,
            name: user.username,
            roles: user.roles
          } || event.user,
          kibana: {
            space_id: spaceId,
            session_id: sessionId,
            ...event.kibana
          },
          trace: {
            id: request.id
          }
        });
      },
      enabled
    });
    http.registerOnPostAuth((request, response, t) => {
      if (request.auth.isAuthenticated) {
        asScoped(request).log((0, _audit_events.httpRequestEvent)({
          request
        }));
      }
      return t.next();
    });
    return {
      asScoped,
      withoutRequest: {
        log,
        enabled
      }
    };
  }
  stop() {
    clearInterval(this.usageIntervalId);
  }
}
exports.AuditService = AuditService;
const createLoggingConfig = config => (0, _operators.map)(features => {
  var _config$appender;
  return {
    appenders: {
      auditTrailAppender: (_config$appender = config.appender) !== null && _config$appender !== void 0 ? _config$appender : {
        type: 'console',
        layout: {
          type: 'pattern',
          highlight: true
        }
      }
    },
    loggers: [{
      name: 'audit.ecs',
      level: config.enabled && config.appender && features.allowAuditLogging ? 'info' : 'off',
      appenders: ['auditTrailAppender']
    }]
  };
});

/**
 * Evaluates the list of provided ignore rules, and filters out events only
 * if *all* rules match the event.
 *
 * For event fields that can contain an array of multiple values, every value
 * must be matched by an ignore rule for the event to be excluded.
 */
exports.createLoggingConfig = createLoggingConfig;
function filterEvent(event, ignoreFilters) {
  if (ignoreFilters) {
    return !ignoreFilters.some(rule => {
      var _event$event, _event$event2, _event$event2$categor, _event$event3, _event$event3$type, _event$event4, _event$kibana;
      return (!rule.actions || rule.actions.includes((_event$event = event.event) === null || _event$event === void 0 ? void 0 : _event$event.action)) && (!rule.categories || ((_event$event2 = event.event) === null || _event$event2 === void 0 ? void 0 : (_event$event2$categor = _event$event2.category) === null || _event$event2$categor === void 0 ? void 0 : _event$event2$categor.every(c => {
        var _rule$categories;
        return (_rule$categories = rule.categories) === null || _rule$categories === void 0 ? void 0 : _rule$categories.includes(c);
      }))) && (!rule.types || ((_event$event3 = event.event) === null || _event$event3 === void 0 ? void 0 : (_event$event3$type = _event$event3.type) === null || _event$event3$type === void 0 ? void 0 : _event$event3$type.every(t => {
        var _rule$types;
        return (_rule$types = rule.types) === null || _rule$types === void 0 ? void 0 : _rule$types.includes(t);
      }))) && (!rule.outcomes || rule.outcomes.includes((_event$event4 = event.event) === null || _event$event4 === void 0 ? void 0 : _event$event4.outcome)) && (!rule.spaces || rule.spaces.includes((_event$kibana = event.kibana) === null || _event$kibana === void 0 ? void 0 : _event$kibana.space_id));
    });
  }
  return true;
}