"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notificationsRoutes = notificationsRoutes;
var _notifications_service = require("../models/notifications_service");
var _notifications_schema = require("./schemas/notifications_schema");
var _error_wrapper = require("../client/error_wrapper");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function notificationsRoutes({
  router,
  routeGuard
}) {
  /**
   * @apiGroup Notifications
   *
   * @api {get} /api/ml/notifications Get notifications
   * @apiName GetNotifications
   * @apiDescription Retrieves notifications based on provided criteria.
   */
  router.get({
    path: '/api/ml/notifications',
    validate: {
      query: _notifications_schema.getNotificationsQuerySchema
    },
    options: {
      tags: ['access:ml:canGetJobs', 'access:ml:canGetDataFrameAnalytics', 'access:ml:canGetTrainedModels']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response,
    mlSavedObjectService
  }) => {
    try {
      const notificationsService = new _notifications_service.NotificationsService(client, mlSavedObjectService);
      const results = await notificationsService.searchMessages(request.query);
      return response.ok({
        body: results
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup Notifications
   *
   * @api {get} /api/ml/notifications/count Get notification counts
   * @apiName GetNotificationCounts
   * @apiDescription Counts notifications by level.
   */
  router.get({
    path: '/api/ml/notifications/count',
    validate: {
      query: _notifications_schema.getNotificationsCountQuerySchema
    },
    options: {
      tags: ['access:ml:canGetJobs', 'access:ml:canGetDataFrameAnalytics', 'access:ml:canGetTrainedModels']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlSavedObjectService,
    request,
    response
  }) => {
    try {
      const notificationsService = new _notifications_service.NotificationsService(client, mlSavedObjectService);
      const results = await notificationsService.countMessages(request.query);
      return response.ok({
        body: results
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}