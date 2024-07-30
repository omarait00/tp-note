"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStatsRoute = registerStatsRoute;
var _configSchema = require("@kbn/config-schema");
var _i18n = require("@kbn/i18n");
var _defaultsDeep = _interopRequireDefault(require("lodash/defaultsDeep"));
var _rxjs = require("rxjs");
var _server = require("../../../../../core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const SNAPSHOT_REGEX = /-snapshot/i;
function registerStatsRoute({
  router,
  config,
  collectorSet,
  metrics,
  overallStatus$
}) {
  const getUsage = async (esClient, savedObjectsClient) => {
    const usage = await collectorSet.bulkFetchUsage(esClient, savedObjectsClient);
    return collectorSet.toObject(usage);
  };
  const getClusterUuid = async asCurrentUser => {
    const body = await asCurrentUser.info({
      filter_path: 'cluster_uuid'
    });
    const {
      cluster_uuid: uuid
    } = body;
    return uuid;
  };
  router.get({
    path: '/api/stats',
    options: {
      authRequired: !config.allowAnonymous,
      tags: ['api'] // ensures that unauthenticated calls receive a 401 rather than a 302 redirect to login page
    },

    validate: {
      query: _configSchema.schema.object({
        extended: _configSchema.schema.oneOf([_configSchema.schema.literal(''), _configSchema.schema.boolean()], {
          defaultValue: false
        }),
        legacy: _configSchema.schema.oneOf([_configSchema.schema.literal(''), _configSchema.schema.boolean()], {
          defaultValue: false
        }),
        exclude_usage: _configSchema.schema.oneOf([_configSchema.schema.literal(''), _configSchema.schema.boolean()], {
          defaultValue: false
        })
      })
    }
  }, async (context, req, res) => {
    const isExtended = req.query.extended === '' || req.query.extended;
    const isLegacy = req.query.legacy === '' || req.query.legacy;
    const shouldGetUsage = req.query.exclude_usage === false;
    let extended;
    if (isExtended) {
      const core = await context.core;
      const {
        asCurrentUser
      } = core.elasticsearch.client;
      const savedObjectsClient = core.savedObjects.client;
      const [usage, clusterUuid] = await Promise.all([shouldGetUsage ? getUsage(asCurrentUser, savedObjectsClient) : Promise.resolve({}), getClusterUuid(asCurrentUser)]);
      let modifiedUsage = usage;
      if (isLegacy) {
        // In an effort to make telemetry more easily augmented, we need to ensure
        // we can passthrough the data without every part of the process needing
        // to know about the change; however, to support legacy use cases where this
        // wasn't true, we need to be backwards compatible with how the legacy data
        // looked and support those use cases here.
        modifiedUsage = Object.keys(usage).reduce((accum, usageKey) => {
          if (usageKey === 'kibana') {
            accum = {
              ...accum,
              ...usage[usageKey]
            };
          } else if (usageKey === 'reporting') {
            accum = {
              ...accum,
              xpack: {
                ...accum.xpack,
                reporting: usage[usageKey]
              }
            };
          } else {
            // I don't think we need to it this for the above conditions, but do it for most as it will
            // match the behavior done in monitoring/bulk_uploader
            (0, _defaultsDeep.default)(accum, {
              [usageKey]: usage[usageKey]
            });
          }
          return accum;
        }, {});
        extended = {
          usage: modifiedUsage,
          clusterUuid
        };
      } else {
        extended = collectorSet.toApiFieldNames({
          usage: modifiedUsage,
          clusterUuid
        });
      }
    }

    // Guaranteed to resolve immediately due to replay effect on getOpsMetrics$
    const {
      collected_at: collectedAt,
      ...lastMetrics
    } = await (0, _rxjs.firstValueFrom)(metrics.getOpsMetrics$());
    const overallStatus = await (0, _rxjs.firstValueFrom)(overallStatus$);
    const kibanaStats = collectorSet.toApiFieldNames({
      ...lastMetrics,
      kibana: {
        uuid: config.uuid,
        name: config.server.name,
        index: config.kibanaIndex,
        host: config.server.hostname,
        locale: _i18n.i18n.getLocale(),
        transport_address: `${config.server.hostname}:${config.server.port}`,
        version: config.kibanaVersion.replace(SNAPSHOT_REGEX, ''),
        snapshot: SNAPSHOT_REGEX.test(config.kibanaVersion),
        status: ServiceStatusToLegacyState[overallStatus.level.toString()]
      },
      last_updated: collectedAt.toISOString(),
      collection_interval_in_millis: metrics.collectionInterval
    });
    return res.ok({
      body: {
        ...kibanaStats,
        ...extended
      }
    });
  });
}
const ServiceStatusToLegacyState = {
  [_server.ServiceStatusLevels.critical.toString()]: 'red',
  [_server.ServiceStatusLevels.unavailable.toString()]: 'red',
  [_server.ServiceStatusLevels.degraded.toString()]: 'yellow',
  [_server.ServiceStatusLevels.available.toString()]: 'green'
};