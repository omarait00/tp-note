"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRestoreRoutes = registerRestoreRoutes;
var _configSchema = require("@kbn/config-schema");
var _lib = require("../../../common/lib");
var _lib2 = require("../../lib");
var _helpers = require("../helpers");
var _validate_schemas = require("./validate_schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerRestoreRoutes({
  router,
  license,
  lib: {
    handleEsError
  }
}) {
  // GET all snapshot restores
  router.get({
    path: (0, _helpers.addBasePath)('restores'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    try {
      const snapshotRestores = [];
      const recoveryByIndexName = await clusterClient.asCurrentUser.indices.recovery({
        human: true
      });

      // Filter to snapshot-recovered shards only
      Object.keys(recoveryByIndexName).forEach(index => {
        const recovery = recoveryByIndexName[index];
        let latestActivityTimeInMillis = 0;
        let latestEndTimeInMillis = null;
        const snapshotShards = (recovery.shards || []).filter(shard => shard.type === 'SNAPSHOT').sort((a, b) => a.id - b.id).map(shard => {
          // TODO: Bring {@link SnapshotRestoreShardEs} in line with {@link ShardRecovery}
          const deserializedShard = (0, _lib2.deserializeRestoreShard)(shard);
          const {
            startTimeInMillis,
            stopTimeInMillis
          } = deserializedShard;

          // Set overall latest activity time
          latestActivityTimeInMillis = Math.max(startTimeInMillis || 0, stopTimeInMillis || 0, latestActivityTimeInMillis);

          // Set overall end time
          if (stopTimeInMillis === undefined) {
            latestEndTimeInMillis = null;
          } else if (latestEndTimeInMillis === null || stopTimeInMillis > latestEndTimeInMillis) {
            latestEndTimeInMillis = stopTimeInMillis;
          }
          return deserializedShard;
        });
        if (snapshotShards.length > 0) {
          snapshotRestores.push({
            index,
            latestActivityTimeInMillis,
            shards: snapshotShards,
            isComplete: latestEndTimeInMillis !== null
          });
        }
      });

      // Sort by latest activity
      snapshotRestores.sort((a, b) => b.latestActivityTimeInMillis - a.latestActivityTimeInMillis);
      return res.ok({
        body: snapshotRestores
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));

  // Restore snapshot
  const restoreParamsSchema = _configSchema.schema.object({
    repository: _configSchema.schema.string(),
    snapshot: _configSchema.schema.string()
  });
  router.post({
    path: (0, _helpers.addBasePath)('restore/{repository}/{snapshot}'),
    validate: {
      body: _validate_schemas.restoreSettingsSchema,
      params: restoreParamsSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const {
      repository,
      snapshot
    } = req.params;
    const restoreSettings = req.body;
    try {
      const response = await clusterClient.asCurrentUser.snapshot.restore({
        repository,
        snapshot,
        // TODO: Bring {@link RestoreSettingsEs} in line with {@link RestoreRequest['body']}
        body: (0, _lib.serializeRestoreSettings)(restoreSettings)
      });
      return res.ok({
        body: response
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));
}