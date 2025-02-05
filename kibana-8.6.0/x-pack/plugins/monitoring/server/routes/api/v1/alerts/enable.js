"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableAlertsRoute = enableAlertsRoute;
var _constants = require("../../../../../common/constants");
var _alerts = require("../../../../alerts");
var _disable_watcher_cluster_alerts = require("../../../../lib/alerts/disable_watcher_cluster_alerts");
var _errors = require("../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// @ts-ignore

const DEFAULT_SERVER_LOG_NAME = 'Monitoring: Write to Kibana log';
function enableAlertsRoute(server, npRoute) {
  npRoute.router.post({
    path: '/api/monitoring/v1/alerts/enable',
    validate: false
  }, async (context, request, response) => {
    try {
      const alertingContext = await context.alerting;
      const infraContext = await context.infra;
      const actionContext = await context.actions;
      const alerts = _alerts.AlertsFactory.getAll();
      if (alerts.length) {
        var _npRoute$alerting, _npRoute$alerting2;
        const {
          isSufficientlySecure,
          hasPermanentEncryptionKey
        } = (_npRoute$alerting = npRoute.alerting) !== null && _npRoute$alerting !== void 0 && _npRoute$alerting.getSecurityHealth ? await ((_npRoute$alerting2 = npRoute.alerting) === null || _npRoute$alerting2 === void 0 ? void 0 : _npRoute$alerting2.getSecurityHealth()) : {
          isSufficientlySecure: false,
          hasPermanentEncryptionKey: false
        };
        if (!isSufficientlySecure || !hasPermanentEncryptionKey) {
          server.log.info(`Skipping rule creation for "${infraContext.spaceId}" space; Stack Monitoring rules require API keys to be enabled and an encryption key to be configured.`);
          return response.ok({
            body: {
              isSufficientlySecure,
              hasPermanentEncryptionKey
            }
          });
        }
      }
      const rulesClient = alertingContext === null || alertingContext === void 0 ? void 0 : alertingContext.getRulesClient();
      const actionsClient = actionContext === null || actionContext === void 0 ? void 0 : actionContext.getActionsClient();
      const types = actionContext === null || actionContext === void 0 ? void 0 : actionContext.listTypes();
      if (!rulesClient || !actionsClient || !types) {
        return response.ok({
          body: undefined
        });
      }

      // Get or create the default log action
      let serverLogAction;
      const allActions = await actionsClient.getAll();
      for (const action of allActions) {
        if (action.name === DEFAULT_SERVER_LOG_NAME) {
          serverLogAction = action;
          break;
        }
      }
      if (!serverLogAction) {
        serverLogAction = await actionsClient.create({
          action: {
            name: DEFAULT_SERVER_LOG_NAME,
            actionTypeId: _constants.ALERT_ACTION_TYPE_LOG,
            config: {},
            secrets: {}
          }
        });
      }
      const actions = [{
        id: serverLogAction.id,
        config: {}
      }];
      let createdAlerts = [];
      const disabledWatcherClusterAlerts = await (0, _disable_watcher_cluster_alerts.disableWatcherClusterAlerts)(npRoute.cluster.asScoped(request).asCurrentUser, npRoute.logger);
      if (disabledWatcherClusterAlerts) {
        createdAlerts = await Promise.all(alerts.map(alert => alert.createIfDoesNotExist(rulesClient, actionsClient, actions)));
      }
      server.log.info(`Created ${createdAlerts.length} alerts for "${infraContext.spaceId}" space`);
      return response.ok({
        body: {
          createdAlerts,
          disabledWatcherClusterAlerts
        }
      });
    } catch (err) {
      throw (0, _errors.handleError)(err);
    }
  });
}