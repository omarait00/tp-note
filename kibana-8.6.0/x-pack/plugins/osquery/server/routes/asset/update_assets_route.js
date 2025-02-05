"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAssetsRoute = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _lodash = require("lodash");
var _configSchema = require("@kbn/config-schema");
var _std = require("@kbn/std");
var _deepmerge = _interopRequireDefault(require("deepmerge"));
var _types = require("../../../common/types");
var _utils = require("./utils");
var _common = require("../../../common");
var _utils2 = require("../pack/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const updateAssetsRoute = (router, osqueryContext) => {
  router.post({
    path: '/internal/osquery/assets/update',
    validate: {
      params: _configSchema.schema.object({}, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-writePacks`]
    }
  }, async (context, request, response) => {
    var _osqueryContext$secur;
    const savedObjectsClient = (await context.core).savedObjects.client;
    const currentUser = await ((_osqueryContext$secur = osqueryContext.security.authc.getCurrentUser(request)) === null || _osqueryContext$secur === void 0 ? void 0 : _osqueryContext$secur.username);
    let installation;
    try {
      var _osqueryContext$servi, _osqueryContext$servi2;
      installation = await ((_osqueryContext$servi = osqueryContext.service.getPackageService()) === null || _osqueryContext$servi === void 0 ? void 0 : (_osqueryContext$servi2 = _osqueryContext$servi.asInternalUser) === null || _osqueryContext$servi2 === void 0 ? void 0 : _osqueryContext$servi2.getInstallation(_common.OSQUERY_INTEGRATION_NAME));
    } catch (err) {
      return response.notFound();
    }
    if (installation) {
      const installationPackAssets = (0, _lodash.filter)(installation.installed_kibana, ['type', _types.packAssetSavedObjectType]);
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
      await Promise.all([...install.map(async installationPackAsset => {
        var _packAssetSavedObject;
        const packAssetSavedObject = await savedObjectsClient.get(installationPackAsset.type, installationPackAsset.id);
        const conflictingEntries = await savedObjectsClient.find({
          type: _types.packSavedObjectType,
          filter: `${_types.packSavedObjectType}.attributes.name: "${packAssetSavedObject.attributes.name}"`
        });
        const name = conflictingEntries.saved_objects.length && (0, _lodash.some)(conflictingEntries.saved_objects, ['attributes.name', packAssetSavedObject.attributes.name]) ? `${packAssetSavedObject.attributes.name}-elastic` : packAssetSavedObject.attributes.name;
        await savedObjectsClient.create(_types.packSavedObjectType, {
          name,
          description: packAssetSavedObject.attributes.description,
          queries: packAssetSavedObject.attributes.queries,
          enabled: false,
          created_at: (0, _momentTimezone.default)().toISOString(),
          created_by: currentUser,
          updated_at: (0, _momentTimezone.default)().toISOString(),
          updated_by: currentUser,
          version: (_packAssetSavedObject = packAssetSavedObject.attributes.version) !== null && _packAssetSavedObject !== void 0 ? _packAssetSavedObject : 1
        }, {
          references: [...packAssetSavedObject.references, {
            type: packAssetSavedObject.type,
            id: packAssetSavedObject.id,
            name: packAssetSavedObject.attributes.name
          }],
          refresh: 'wait_for'
        });
      }), ...update.map(async updatePackAsset => {
        const packAssetSavedObject = await savedObjectsClient.get(updatePackAsset.type, updatePackAsset.id);
        const packSavedObjectsResponse = await savedObjectsClient.find({
          type: 'osquery-pack',
          hasReference: {
            type: updatePackAsset.type,
            id: updatePackAsset.id
          }
        });
        if (packSavedObjectsResponse.total) {
          await savedObjectsClient.update(packSavedObjectsResponse.saved_objects[0].type, packSavedObjectsResponse.saved_objects[0].id, _deepmerge.default.all([(0, _lodash.omit)(packSavedObjectsResponse.saved_objects[0].attributes, 'queries'), (0, _lodash.omit)(packAssetSavedObject.attributes, 'queries'), {
            updated_at: (0, _momentTimezone.default)().toISOString(),
            updated_by: currentUser,
            queries: (0, _utils2.convertPackQueriesToSO)((0, _deepmerge.default)((0, _utils2.convertSOQueriesToPack)(packSavedObjectsResponse.saved_objects[0].attributes.queries), (0, _utils2.convertSOQueriesToPack)(packAssetSavedObject.attributes.queries), {
              arrayMerge: _utils.combineMerge
            }))
          }, {
            arrayMerge: _utils.combineMerge
          }]), {
            refresh: 'wait_for'
          });
        }
      })]);
      return response.ok({
        body: {
          install,
          update,
          upToDate
        }
      });
    }
    return response.ok({
      body: {
        install: 0,
        update: 0,
        upToDate: 0
      }
    });
  });
};
exports.updateAssetsRoute = updateAssetsRoute;