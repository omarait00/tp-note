"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTransformsRoutes = registerTransformsRoutes;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../common/constants");
var _common = require("../../../common/api_schemas/common");
var _delete_transforms = require("../../../common/api_schemas/delete_transforms");
var _reset_transforms = require("../../../common/api_schemas/reset_transforms");
var _start_transforms = require("../../../common/api_schemas/start_transforms");
var _stop_transforms = require("../../../common/api_schemas/stop_transforms");
var _update_transforms = require("../../../common/api_schemas/update_transforms");
var _transforms = require("../../../common/api_schemas/transforms");
var _ = require("..");
var _error_utils = require("./error_utils");
var _transforms_audit_messages = require("./transforms_audit_messages");
var _transforms_nodes = require("./transforms_nodes");
var _transform = require("../../../common/types/transform");
var _field_utils = require("../../../common/utils/field_utils");
var _transform_health_service = require("../../lib/alerting/transform_health_rule_type/transform_health_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
var TRANSFORM_ACTIONS;
(function (TRANSFORM_ACTIONS) {
  TRANSFORM_ACTIONS["DELETE"] = "delete";
  TRANSFORM_ACTIONS["RESET"] = "reset";
  TRANSFORM_ACTIONS["STOP"] = "stop";
  TRANSFORM_ACTIONS["START"] = "start";
})(TRANSFORM_ACTIONS || (TRANSFORM_ACTIONS = {}));
function registerTransformsRoutes(routeDependencies) {
  const {
    router,
    license,
    getStartServices
  } = routeDependencies;
  /**
   * @apiGroup Transforms
   *
   * @api {get} /api/transform/transforms Get transforms
   * @apiName GetTransforms
   * @apiDescription Returns transforms
   *
   * @apiSchema (params) jobAuditMessagesJobIdSchema
   * @apiSchema (query) jobAuditMessagesQuerySchema
   */
  router.get({
    path: (0, _.addBasePath)('transforms'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const body = await esClient.asCurrentUser.transform.getTransform({
        size: 1000,
        ...req.params
      });
      const alerting = await ctx.alerting;
      if (alerting) {
        const transformHealthService = (0, _transform_health_service.transformHealthServiceProvider)(esClient.asCurrentUser, alerting.getRulesClient());

        // @ts-ignore
        await transformHealthService.populateTransformsWithAssignedRules(body.transforms);
      }
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));

  /**
   * @apiGroup Transforms
   *
   * @api {get} /api/transform/transforms/:transformId Get transform
   * @apiName GetTransform
   * @apiDescription Returns a single transform
   *
   * @apiSchema (params) transformIdParamSchema
   */
  router.get({
    path: (0, _.addBasePath)('transforms/{transformId}'),
    validate: {
      params: _common.transformIdParamSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      transformId
    } = req.params;
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const body = await esClient.asCurrentUser.transform.getTransform({
        transform_id: transformId
      });
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));

  /**
   * @apiGroup Transforms
   *
   * @api {get} /api/transform/transforms/_stats Get transforms stats
   * @apiName GetTransformsStats
   * @apiDescription Returns transforms stats
   */
  router.get({
    path: (0, _.addBasePath)('transforms/_stats'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const body = await esClient.asCurrentUser.transform.getTransformStats({
        size: 1000,
        transform_id: '_all'
      }, {
        maxRetries: 0
      });
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));

  /**
   * @apiGroup Transforms
   *
   * @api {get} /api/transform/transforms/:transformId/_stats Get transform stats
   * @apiName GetTransformStats
   * @apiDescription Returns stats for a single transform
   *
   * @apiSchema (params) transformIdParamSchema
   */
  router.get({
    path: (0, _.addBasePath)('transforms/{transformId}/_stats'),
    validate: {
      params: _common.transformIdParamSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      transformId
    } = req.params;
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const body = await esClient.asCurrentUser.transform.getTransformStats({
        transform_id: transformId
      }, {
        maxRetries: 0
      });
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));

  /**
   * @apiGroup Transforms
   *
   * @api {put} /api/transform/transforms/:transformId Put transform
   * @apiName PutTransform
   * @apiDescription Creates a transform
   *
   * @apiSchema (params) transformIdParamSchema
   * @apiSchema (body) putTransformsRequestSchema
   */
  router.put({
    path: (0, _.addBasePath)('transforms/{transformId}'),
    validate: {
      params: _common.transformIdParamSchema,
      body: _transforms.putTransformsRequestSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      transformId
    } = req.params;
    const response = {
      transformsCreated: [],
      errors: []
    };
    const esClient = (await ctx.core).elasticsearch.client;
    await esClient.asCurrentUser.transform.putTransform({
      // @ts-expect-error @elastic/elasticsearch group_by is expected to be optional in TransformPivot
      body: req.body,
      transform_id: transformId
    }).then(() => {
      response.transformsCreated.push({
        transform: transformId
      });
    }).catch(e => response.errors.push({
      id: transformId,
      error: (0, _error_utils.wrapEsError)(e)
    }));
    return res.ok({
      body: response
    });
  }));

  /**
   * @apiGroup Transforms
   *
   * @api {post} /api/transform/transforms/:transformId/_update Post transform update
   * @apiName PostTransformUpdate
   * @apiDescription Updates a transform
   *
   * @apiSchema (params) transformIdParamSchema
   * @apiSchema (body) postTransformsUpdateRequestSchema
   */
  router.post({
    path: (0, _.addBasePath)('transforms/{transformId}/_update'),
    validate: {
      params: _common.transformIdParamSchema,
      body: _update_transforms.postTransformsUpdateRequestSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      transformId
    } = req.params;
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const body = await esClient.asCurrentUser.transform.updateTransform({
        // @ts-expect-error query doesn't satisfy QueryDslQueryContainer from @elastic/elasticsearch
        body: req.body,
        transform_id: transformId
      });
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)(e));
    }
  }));

  /**
   * @apiGroup Transforms
   *
   * @api {post} /api/transform/delete_transforms Post delete transforms
   * @apiName DeleteTransforms
   * @apiDescription Deletes transforms
   *
   * @apiSchema (body) deleteTransformsRequestSchema
   */
  router.post({
    path: (0, _.addBasePath)('delete_transforms'),
    validate: {
      body: _delete_transforms.deleteTransformsRequestSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    try {
      const [{
        savedObjects,
        elasticsearch
      }, {
        dataViews
      }] = await getStartServices();
      const savedObjectsClient = savedObjects.getScopedClient(req);
      const esClient = elasticsearch.client.asScoped(req).asCurrentUser;
      const dataViewsService = await dataViews.dataViewsServiceFactory(savedObjectsClient, esClient, req);
      const body = await deleteTransforms(req.body, ctx, res, dataViewsService);
      if (body && body.status) {
        if (body.status === 404) {
          return res.notFound();
        }
        if (body.status === 403) {
          return res.forbidden();
        }
      }
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));

  /**
   * @apiGroup Transforms
   *
   * @api {post} /api/transform/reset_transforms Post reset transforms
   * @apiName ResetTransforms
   * @apiDescription resets transforms
   *
   * @apiSchema (body) resetTransformsRequestSchema
   */
  router.post({
    path: (0, _.addBasePath)('reset_transforms'),
    validate: {
      body: _reset_transforms.resetTransformsRequestSchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    try {
      const body = await resetTransforms(req.body, ctx, res);
      if (body && body.status) {
        if (body.status === 404) {
          return res.notFound();
        }
        if (body.status === 403) {
          return res.forbidden();
        }
      }
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));

  /**
   * @apiGroup Transforms
   *
   * @api {post} /api/transform/transforms/_preview Preview transform
   * @apiName PreviewTransform
   * @apiDescription Previews transform
   *
   * @apiSchema (body) postTransformsPreviewRequestSchema
   */
  router.post({
    path: (0, _.addBasePath)('transforms/_preview'),
    validate: {
      body: _transforms.postTransformsPreviewRequestSchema
    }
  }, license.guardApiRoute(previewTransformHandler));

  /**
   * @apiGroup Transforms
   *
   * @api {post} /api/transform/start_transforms Start transforms
   * @apiName PostStartTransforms
   * @apiDescription Starts transform
   *
   * @apiSchema (body) startTransformsRequestSchema
   */
  router.post({
    path: (0, _.addBasePath)('start_transforms'),
    validate: {
      body: _start_transforms.startTransformsRequestSchema
    }
  }, license.guardApiRoute(startTransformsHandler));

  /**
   * @apiGroup Transforms
   *
   * @api {post} /api/transform/stop_transforms Stop transforms
   * @apiName PostStopTransforms
   * @apiDescription Stops transform
   *
   * @apiSchema (body) stopTransformsRequestSchema
   */
  router.post({
    path: (0, _.addBasePath)('stop_transforms'),
    validate: {
      body: _stop_transforms.stopTransformsRequestSchema
    }
  }, license.guardApiRoute(stopTransformsHandler));

  /**
   * @apiGroup Transforms
   *
   * @api {post} /api/transform/es_search Transform ES Search Proxy
   * @apiName PostTransformEsSearchProxy
   * @apiDescription ES Search Proxy
   *
   * @apiSchema (body) any
   */
  router.post({
    path: (0, _.addBasePath)('es_search'),
    validate: {
      body: _configSchema.schema.maybe(_configSchema.schema.any())
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const body = await esClient.asCurrentUser.search(req.body, {
        maxRetries: 0
      });
      return res.ok({
        body
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));
  (0, _transforms_audit_messages.registerTransformsAuditMessagesRoutes)(routeDependencies);
  (0, _transforms_nodes.registerTransformNodesRoutes)(routeDependencies);
}
async function getDataViewId(indexName, dataViewsService) {
  const dv = (await dataViewsService.find(indexName)).find(({
    title
  }) => title === indexName);
  return dv === null || dv === void 0 ? void 0 : dv.id;
}
async function deleteDestDataViewById(dataViewId, dataViewsService) {
  return await dataViewsService.delete(dataViewId);
}
async function deleteTransforms(reqBody, ctx, response, dataViewsService) {
  const {
    transformsInfo
  } = reqBody;

  // Cast possible undefineds as booleans
  const deleteDestIndex = !!reqBody.deleteDestIndex;
  const deleteDestDataView = !!reqBody.deleteDestDataView;
  const shouldForceDelete = !!reqBody.forceDelete;
  const results = {};
  const coreContext = await ctx.core;
  const esClient = coreContext.elasticsearch.client;
  for (const transformInfo of transformsInfo) {
    let destinationIndex;
    const transformDeleted = {
      success: false
    };
    const destIndexDeleted = {
      success: false
    };
    const destDataViewDeleted = {
      success: false
    };
    const transformId = transformInfo.id;
    // force delete only if the transform has failed
    let needToForceDelete = false;
    try {
      if (transformInfo.state === _constants.TRANSFORM_STATE.FAILED) {
        needToForceDelete = true;
      }
      if (!shouldForceDelete) {
        // Grab destination index info to delete
        try {
          const body = await esClient.asCurrentUser.transform.getTransform({
            transform_id: transformId
          });
          const transformConfig = body.transforms[0];
          destinationIndex = Array.isArray(transformConfig.dest.index) ? transformConfig.dest.index[0] : transformConfig.dest.index;
        } catch (getTransformConfigError) {
          transformDeleted.error = getTransformConfigError.meta.body.error;
          results[transformId] = {
            transformDeleted,
            destIndexDeleted,
            destDataViewDeleted,
            destinationIndex
          };
          // No need to perform further delete attempts
          continue;
        }
      }
      // If user checks box to delete the destinationIndex associated with the job
      if (destinationIndex && deleteDestIndex) {
        try {
          // If user does have privilege to delete the index, then delete the index
          // if no permission then return 403 forbidden
          await esClient.asCurrentUser.indices.delete({
            index: destinationIndex
          });
          destIndexDeleted.success = true;
        } catch (deleteIndexError) {
          destIndexDeleted.error = deleteIndexError.meta.body.error;
        }
      }

      // Delete the data view if there's a data view that matches the name of dest index
      if (destinationIndex && deleteDestDataView) {
        try {
          const dataViewId = await getDataViewId(destinationIndex, dataViewsService);
          if (dataViewId) {
            await deleteDestDataViewById(dataViewId, dataViewsService);
            destDataViewDeleted.success = true;
          }
        } catch (deleteDestDataViewError) {
          destDataViewDeleted.error = deleteDestDataViewError.meta.body.error;
        }
      }
      try {
        await esClient.asCurrentUser.transform.deleteTransform({
          transform_id: transformId,
          force: shouldForceDelete && needToForceDelete
        });
        transformDeleted.success = true;
      } catch (deleteTransformJobError) {
        transformDeleted.error = deleteTransformJobError.meta.body.error;
        if (deleteTransformJobError.statusCode === 403) {
          return response.forbidden();
        }
      }
      results[transformId] = {
        transformDeleted,
        destIndexDeleted,
        destDataViewDeleted,
        destinationIndex
      };
    } catch (e) {
      if ((0, _error_utils.isRequestTimeout)(e)) {
        return (0, _error_utils.fillResultsWithTimeouts)({
          results,
          id: transformInfo.id,
          items: transformsInfo,
          action: TRANSFORM_ACTIONS.DELETE
        });
      }
      results[transformId] = {
        transformDeleted: {
          success: false,
          error: e.meta.body.error
        }
      };
    }
  }
  return results;
}
async function resetTransforms(reqBody, ctx, response) {
  const {
    transformsInfo
  } = reqBody;
  const results = {};
  const esClient = (await ctx.core).elasticsearch.client;
  for (const transformInfo of transformsInfo) {
    const transformReset = {
      success: false
    };
    const transformId = transformInfo.id;
    try {
      try {
        await esClient.asCurrentUser.transform.resetTransform({
          transform_id: transformId
        });
        transformReset.success = true;
      } catch (resetTransformJobError) {
        transformReset.error = resetTransformJobError.meta.body.error;
        if (resetTransformJobError.statusCode === 403) {
          return response.forbidden();
        }
      }
      results[transformId] = {
        transformReset
      };
    } catch (e) {
      if ((0, _error_utils.isRequestTimeout)(e)) {
        return (0, _error_utils.fillResultsWithTimeouts)({
          results,
          id: transformInfo.id,
          items: transformsInfo,
          action: TRANSFORM_ACTIONS.RESET
        });
      }
      results[transformId] = {
        transformReset: {
          success: false,
          error: e.meta.body.error
        }
      };
    }
  }
  return results;
}
const previewTransformHandler = async (ctx, req, res) => {
  try {
    const reqBody = req.body;
    const esClient = (await ctx.core).elasticsearch.client;
    const body = await esClient.asCurrentUser.transform.previewTransform({
      body: reqBody
    }, {
      maxRetries: 0
    });
    if ((0, _transform.isLatestTransform)(reqBody)) {
      // for the latest transform mappings properties have to be retrieved from the source
      const fieldCapsResponse = await esClient.asCurrentUser.fieldCaps({
        index: reqBody.source.index,
        fields: '*',
        include_unmapped: false
      }, {
        maxRetries: 0
      });
      const fieldNamesSet = new Set(Object.keys(fieldCapsResponse.fields));
      const fields = Object.entries(fieldCapsResponse.fields).reduce((acc, [fieldName, fieldCaps]) => {
        const fieldDefinition = Object.values(fieldCaps)[0];
        const isMetaField = fieldDefinition.type.startsWith('_') || fieldName === '_doc_count';
        if (isMetaField || (0, _field_utils.isKeywordDuplicate)(fieldName, fieldNamesSet)) {
          return acc;
        }
        acc[fieldName] = {
          ...fieldDefinition
        };
        return acc;
      }, {});
      body.generated_dest_index.mappings.properties = fields;
    }
    return res.ok({
      body
    });
  } catch (e) {
    return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
  }
};
const startTransformsHandler = async (ctx, req, res) => {
  const transformsInfo = req.body;
  try {
    const esClient = (await ctx.core).elasticsearch.client;
    const body = await startTransforms(transformsInfo, esClient.asCurrentUser);
    return res.ok({
      body
    });
  } catch (e) {
    return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
  }
};
async function startTransforms(transformsInfo, esClient) {
  const results = {};
  for (const transformInfo of transformsInfo) {
    const transformId = transformInfo.id;
    try {
      await esClient.transform.startTransform({
        transform_id: transformId
      });
      results[transformId] = {
        success: true
      };
    } catch (e) {
      if ((0, _error_utils.isRequestTimeout)(e)) {
        return (0, _error_utils.fillResultsWithTimeouts)({
          results,
          id: transformId,
          items: transformsInfo,
          action: TRANSFORM_ACTIONS.START
        });
      }
      results[transformId] = {
        success: false,
        error: e.meta.body.error
      };
    }
  }
  return results;
}
const stopTransformsHandler = async (ctx, req, res) => {
  const transformsInfo = req.body;
  try {
    const esClient = (await ctx.core).elasticsearch.client;
    return res.ok({
      body: await stopTransforms(transformsInfo, esClient.asCurrentUser)
    });
  } catch (e) {
    return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
  }
};
async function stopTransforms(transformsInfo, esClient) {
  const results = {};
  for (const transformInfo of transformsInfo) {
    const transformId = transformInfo.id;
    try {
      await esClient.transform.stopTransform({
        transform_id: transformId,
        force: transformInfo.state !== undefined ? transformInfo.state === _constants.TRANSFORM_STATE.FAILED : false,
        wait_for_completion: true
      });
      results[transformId] = {
        success: true
      };
    } catch (e) {
      if ((0, _error_utils.isRequestTimeout)(e)) {
        return (0, _error_utils.fillResultsWithTimeouts)({
          results,
          id: transformId,
          items: transformsInfo,
          action: TRANSFORM_ACTIONS.STOP
        });
      }
      results[transformId] = {
        success: false,
        error: e.meta.body.error
      };
    }
  }
  return results;
}