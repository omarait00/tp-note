"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startTransformIfNotStarted = exports.createTransformIfNotExists = exports.createAndStartTransform = exports.TRANSFORM_STATE = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TRANSFORM_STATE = {
  ABORTING: 'aborting',
  FAILED: 'failed',
  INDEXING: 'indexing',
  STARTED: 'started',
  STOPPED: 'stopped',
  STOPPING: 'stopping',
  WAITING: 'waiting'
};
exports.TRANSFORM_STATE = TRANSFORM_STATE;
const createAndStartTransform = ({
  esClient,
  transformId,
  options,
  logger
}) => {
  const transformOptions = typeof options === 'string' ? JSON.parse(options) : options;
  const transform = {
    transform_id: transformId,
    ...transformOptions
  };
  return createTransformIfNotExists(esClient, transform, logger).then(result => {
    if (result[transform.transform_id].success) {
      return startTransformIfNotStarted(esClient, transform.transform_id, logger);
    } else {
      return result;
    }
  });
};
/**
 * Checks if a transform exists, And if not creates it
 * @param transform - the transform to create. If a transform with the same transform_id already exists, nothing is created.
 */
exports.createAndStartTransform = createAndStartTransform;
const createTransformIfNotExists = async (esClient, transform, logger) => {
  try {
    await esClient.transform.getTransform({
      transform_id: transform.transform_id
    });
    logger.error(`Transform ${transform.transform_id} already exists`);
    return {
      [transform.transform_id]: {
        success: false,
        error: (0, _securitysolutionEsUtils.transformError)(new Error(_i18n.i18n.translate('xpack.securitySolution.riskScore.transform.transformExistsTitle', {
          values: {
            transformId: transform.transform_id
          },
          defaultMessage: `Failed to create Transform as {transformId} already exists`
        })))
      }
    };
  } catch (existErr) {
    const existError = (0, _securitysolutionEsUtils.transformError)(existErr);
    if (existError.statusCode === 404) {
      try {
        await esClient.transform.putTransform(transform);
        return {
          [transform.transform_id]: {
            success: true,
            error: null
          }
        };
      } catch (createErr) {
        const createError = (0, _securitysolutionEsUtils.transformError)(createErr);
        logger.error(`Failed to create transform ${transform.transform_id}: ${createError.message}`);
        return {
          [transform.transform_id]: {
            success: false,
            error: createError
          }
        };
      }
    } else {
      logger.error(`Failed to check if transform ${transform.transform_id} exists before creation: ${existError.message}`);
      return {
        [transform.transform_id]: {
          success: false,
          error: existError
        }
      };
    }
  }
};
exports.createTransformIfNotExists = createTransformIfNotExists;
const checkTransformState = async (esClient, transformId, logger) => {
  try {
    const transformStats = await esClient.transform.getTransformStats({
      transform_id: transformId
    });
    if (transformStats.count <= 0) {
      logger.error(`Failed to check ${transformId} state: couldn't find transform`);
      return {
        [transformId]: {
          success: false,
          error: (0, _securitysolutionEsUtils.transformError)(new Error(_i18n.i18n.translate('xpack.securitySolution.riskScore.transform.notFoundTitle', {
            values: {
              transformId
            },
            defaultMessage: `Failed to check Transform state as {transformId} not found`
          })))
        }
      };
    }
    return transformStats.transforms[0];
  } catch (statsErr) {
    const statsError = (0, _securitysolutionEsUtils.transformError)(statsErr);
    logger.error(`Failed to check if transform ${transformId} is started: ${statsError.message}`);
    return {
      [transformId]: {
        success: false,
        error: statsErr
      }
    };
  }
};
const startTransformIfNotStarted = async (esClient, transformId, logger) => {
  const fetchedTransformStats = await checkTransformState(esClient, transformId, logger);
  if (fetchedTransformStats.state === 'stopped') {
    try {
      await esClient.transform.startTransform({
        transform_id: transformId
      });
      return {
        [transformId]: {
          success: true,
          error: null
        }
      };
    } catch (startErr) {
      const startError = (0, _securitysolutionEsUtils.transformError)(startErr);
      logger.error(`Failed starting transform ${transformId}: ${startError.message}`);
      return {
        [transformId]: {
          success: false,
          error: startError
        }
      };
    }
  } else if (fetchedTransformStats.state === TRANSFORM_STATE.STOPPING || fetchedTransformStats.state === TRANSFORM_STATE.ABORTING || fetchedTransformStats.state === TRANSFORM_STATE.FAILED) {
    logger.error(`Not starting transform ${transformId} since it's state is: ${fetchedTransformStats.state}`);
    return {
      [transformId]: {
        success: false,
        error: (0, _securitysolutionEsUtils.transformError)(new Error(_i18n.i18n.translate('xpack.securitySolution.riskScore.transform.start.stateConflictTitle', {
          values: {
            transformId,
            state: fetchedTransformStats.state
          },
          defaultMessage: `Not starting transform {transformId} since it's state is: {state}`
        })))
      }
    };
  }
};
exports.startTransformIfNotStarted = startTransformIfNotStarted;