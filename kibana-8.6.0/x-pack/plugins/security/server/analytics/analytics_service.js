"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnalyticsService = exports.AUTHENTICATION_TYPE_EVENT_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const AUTHENTICATION_TYPE_EVENT_TYPE = 'security_authentication_type';
exports.AUTHENTICATION_TYPE_EVENT_TYPE = AUTHENTICATION_TYPE_EVENT_TYPE;
/**
 * Service that interacts with the Core's analytics module to collect usage of
 * the various Security plugin features (e.g. type of the authentication used).
 */
class AnalyticsService {
  constructor(logger) {
    this.logger = logger;
  }
  setup({
    analytics
  }) {
    this.logger.debug(`Registering ${AUTHENTICATION_TYPE_EVENT_TYPE} event type.`);
    analytics.registerEventType({
      eventType: AUTHENTICATION_TYPE_EVENT_TYPE,
      schema: {
        authentication_provider_type: {
          type: 'keyword',
          _meta: {
            description: 'Type of the Kibana authentication provider.',
            optional: false
          }
        },
        authentication_realm_type: {
          type: 'keyword',
          _meta: {
            description: 'Type of the Elasticsearch security realm.',
            optional: false
          }
        },
        http_authentication_scheme: {
          type: 'keyword',
          _meta: {
            description: 'Authentication scheme from the `Authorization` HTTP header, if present in the client request.',
            // The field is populated only if authentication_provider_type === `http`.
            optional: true
          }
        }
      }
    });
    return {
      reportAuthenticationTypeEvent(event) {
        var _event$httpAuthentica;
        analytics.reportEvent(AUTHENTICATION_TYPE_EVENT_TYPE, {
          authentication_provider_type: event.authenticationProviderType.toLowerCase(),
          authentication_realm_type: event.authenticationRealmType.toLowerCase(),
          http_authentication_scheme: (_event$httpAuthentica = event.httpAuthenticationScheme) === null || _event$httpAuthentica === void 0 ? void 0 : _event$httpAuthentica.toLowerCase()
        });
      }
    };
  }
}
exports.AnalyticsService = AnalyticsService;