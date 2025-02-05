"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineKeyRotationRoutes = defineKeyRotationRoutes;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The default maximum value of from + size for searches to .kibana index. Since we cannot use scroll
 * or search_after functionality with the .kibana index we limit maximum batch size with this value.
 */
const DEFAULT_MAX_RESULT_WINDOW = 10000;

/**
 * Defines routes that are used for encryption key rotation.
 */
function defineKeyRotationRoutes({
  encryptionKeyRotationService,
  router,
  logger,
  config
}) {
  let rotationInProgress = false;
  router.post({
    path: '/api/encrypted_saved_objects/_rotate_key',
    validate: {
      query: _configSchema.schema.object({
        batch_size: _configSchema.schema.number({
          min: 1,
          max: DEFAULT_MAX_RESULT_WINDOW,
          defaultValue: DEFAULT_MAX_RESULT_WINDOW
        }),
        type: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    },
    options: {
      tags: ['access:rotateEncryptionKey']
    }
  }, async (context, request, response) => {
    if (config.keyRotation.decryptionOnlyKeys.length === 0) {
      return response.badRequest({
        body: 'Kibana is not configured to support encryption key rotation. Update `kibana.yml` to include `xpack.encryptedSavedObjects.keyRotation.decryptionOnlyKeys` to rotate your encryption keys.'
      });
    }
    if (rotationInProgress) {
      return response.customError({
        body: 'Encryption key rotation is in progress already. Please wait until it is completed and try again.',
        statusCode: 429
      });
    }
    rotationInProgress = true;
    try {
      return response.ok({
        body: await encryptionKeyRotationService.rotate(request, {
          batchSize: request.query.batch_size,
          type: request.query.type
        })
      });
    } catch (err) {
      logger.error(err);
      return response.customError({
        body: err,
        statusCode: 500
      });
    } finally {
      rotationInProgress = false;
    }
  });
}