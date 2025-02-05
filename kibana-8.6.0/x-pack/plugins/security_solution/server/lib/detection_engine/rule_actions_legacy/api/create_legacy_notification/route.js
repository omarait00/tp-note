"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyCreateLegacyNotificationRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _legacy_update_or_create_rule_actions_saved_object = require("../../logic/rule_actions/legacy_update_or_create_rule_actions_saved_object");
var _legacy_read_notifications = require("../../logic/notifications/legacy_read_notifications");
var _legacy_create_notifications = require("../../logic/notifications/legacy_create_notifications");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

// eslint-disable-next-line no-restricted-imports

// eslint-disable-next-line no-restricted-imports

/**
 * Given an "alert_id" and a valid "action_id" this will create a legacy notification. This is for testing
 * purposes only and should not be used for production. It is behind a route with the words "internal" and
 * "legacy" to announce its legacy and internal intent.
 * @deprecated Once we no longer have legacy notifications and "side car actions" this can be removed.
 * @param router The router
 */
const legacyCreateLegacyNotificationRoute = (router, logger) => {
  router.post({
    path: '/internal/api/detection/legacy/notifications',
    validate: {
      query: _configSchema.schema.object({
        alert_id: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        name: _configSchema.schema.string(),
        interval: _configSchema.schema.string(),
        actions: _configSchema.schema.arrayOf(_configSchema.schema.object({
          id: _configSchema.schema.string(),
          group: _configSchema.schema.string(),
          params: _configSchema.schema.object({
            message: _configSchema.schema.string()
          }),
          actionTypeId: _configSchema.schema.string()
        }))
      })
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const rulesClient = (await context.alerting).getRulesClient();
    const savedObjectsClient = (await context.core).savedObjects.client;
    const {
      alert_id: ruleAlertId
    } = request.query;
    const {
      actions,
      interval,
      name
    } = request.body;
    try {
      // This is to ensure it exists before continuing.
      await rulesClient.get({
        id: ruleAlertId
      });
      const notification = await (0, _legacy_read_notifications.legacyReadNotifications)({
        rulesClient,
        id: undefined,
        ruleAlertId
      });
      if (notification != null) {
        await rulesClient.update({
          id: notification.id,
          data: {
            tags: [],
            name,
            schedule: {
              interval
            },
            actions,
            params: {
              ruleAlertId
            },
            throttle: null,
            notifyWhen: null
          }
        });
      } else {
        await (0, _legacy_create_notifications.legacyCreateNotifications)({
          rulesClient,
          actions,
          enabled: true,
          ruleAlertId,
          interval,
          name
        });
      }
      await (0, _legacy_update_or_create_rule_actions_saved_object.legacyUpdateOrCreateRuleActionsSavedObject)({
        ruleAlertId,
        savedObjectsClient,
        actions,
        throttle: interval,
        logger
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown';
      return response.badRequest({
        body: message
      });
    }
    return response.ok({
      body: {
        ok: 'acknowledged'
      }
    });
  });
};
exports.legacyCreateLegacyNotificationRoute = legacyCreateLegacyNotificationRoute;