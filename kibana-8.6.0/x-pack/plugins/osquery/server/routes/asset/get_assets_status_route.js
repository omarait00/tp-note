"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAssetsStatusRoute = void 0;
var _fp = require("lodash/fp");
var _configSchema = require("@kbn/config-schema");
var _std = require("@kbn/std");
var _types = require("../../../common/types");
var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAssetsStatusRoute = (router, osqueryContext) => {
  router.get({
    path: '/internal/osquery/assets',
    validate: {
      params: _configSchema.schema.object({}, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-writePacks`]
    }
  }, async (context, request, response) => {
    const savedObjectsClient = (await context.core).savedObjects.client;
    let installation;
    try {
      var _osqueryContext$servi, _osqueryContext$servi2;
      installation = await ((_osqueryContext$servi = osqueryContext.service.getPackageService()) === null || _osqueryContext$servi === void 0 ? void 0 : (_osqueryContext$servi2 = _osqueryContext$servi.asInternalUser) === null || _osqueryContext$servi2 === void 0 ? void 0 : _osqueryContext$servi2.getInstallation(_common.OSQUERY_INTEGRATION_NAME));
    } catch (err) {
      return response.notFound();
    }
    if (installation) {
      const installationPackAssets = (0, _fp.filter)(['type', _types.packAssetSavedObjectType], installation.installed_kibana);
      const install = [];
      const update = [];
      const upToDate = [];
      await (0, _std.asyncForEach)(installationPackAssets, async installationPackAsset => {
        const isInstalled = await savedObjectsClient.find({
          type: _types.packSavedObjectType,
          hasReference: {
            type: installationPackAsset.type,
            id: installationPackAsset.id
          }
        });
        if (!isInstalled.total) {
          install.push(installationPackAsset);
        }
        if (isInstalled.total) {
          const packAssetSavedObject = await savedObjectsClient.get(installationPackAsset.type, installationPackAsset.id);
          if (packAssetSavedObject) {
            if (!packAssetSavedObject.attributes.version || !isInstalled.saved_objects[0].attributes.version) {
              install.push(installationPackAsset);
            } else if (packAssetSavedObject.attributes.version > isInstalled.saved_objects[0].attributes.version) {
              update.push(installationPackAsset);
            } else {
              upToDate.push(installationPackAsset);
            }
          }
        }
      });
      return response.ok({
        body: {
          install,
          update,
          upToDate
        }
      });
    }
    return response.ok();
  });
};
exports.getAssetsStatusRoute = getAssetsStatusRoute;