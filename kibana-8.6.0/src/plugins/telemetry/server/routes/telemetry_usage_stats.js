"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTelemetryUsageStatsRoutes = registerTelemetryUsageStatsRoutes;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function registerTelemetryUsageStatsRoutes(router, telemetryCollectionManager, isDev, getSecurity) {
  router.post({
    path: '/api/telemetry/v2/clusters/_stats',
    validate: {
      body: _configSchema.schema.object({
        unencrypted: _configSchema.schema.boolean({
          defaultValue: false
        }),
        refreshCache: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    }
  }, async (context, req, res) => {
    const {
      unencrypted,
      refreshCache
    } = req.body;
    if (!(await telemetryCollectionManager.shouldGetTelemetry())) {
      // We probably won't reach here because there is a license check in the auth phase of the HTTP requests.
      // But let's keep it here should that changes at any point.
      return res.customError({
        statusCode: 503,
        body: `Can't fetch telemetry at the moment because some services are down. Check the /status page for more details.`
      });
    }
    const security = getSecurity();
    if (security && unencrypted) {
      // Normally we would use `options: { tags: ['access:decryptedTelemetry'] }` in the route definition to check authorization for an
      // API action, however, we want to check this conditionally based on the `unencrypted` parameter. In this case we need to use the
      // security API directly to check privileges for this action. Note that the 'decryptedTelemetry' API privilege string is only
      // granted to users that have "Global All" or "Global Read" privileges in Kibana.
      const {
        checkPrivilegesWithRequest,
        actions
      } = security.authz;
      const privileges = {
        kibana: actions.api.get('decryptedTelemetry')
      };
      const {
        hasAllRequested
      } = await checkPrivilegesWithRequest(req).globally(privileges);
      if (!hasAllRequested) {
        return res.forbidden();
      }
    }
    try {
      const statsConfig = {
        unencrypted,
        refreshCache: unencrypted || refreshCache
      };
      const stats = await telemetryCollectionManager.getStats(statsConfig);
      return res.ok({
        body: stats
      });
    } catch (err) {
      if (isDev) {
        // don't ignore errors when running in dev mode
        throw err;
      }
      if (unencrypted && err.status === 403) {
        return res.forbidden();
      }
      // ignore errors and return empty set
      return res.ok({
        body: []
      });
    }
  });
}