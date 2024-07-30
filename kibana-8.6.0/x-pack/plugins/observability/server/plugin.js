"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservabilityPlugin = void 0;
var _i18n = require("@kbn/i18n");
var _server = require("../../../../src/core/server");
var _common = require("../../cases/common");
var _bootstrap_annotations = require("./lib/annotations/bootstrap_annotations");
var _ui_settings = require("./ui_settings");
var _register_routes = require("./routes/register_routes");
var _get_global_observability_server_route_repository = require("./routes/get_global_observability_server_route_repository");
var _common2 = require("../common");
var _saved_objects = require("./saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class ObservabilityPlugin {
  constructor(initContext) {
    this.initContext = initContext;
    this.initContext = initContext;
  }
  setup(core, plugins) {
    const config = this.initContext.config.get();
    const casesCapabilities = (0, _common.createUICapabilities)();
    plugins.features.registerKibanaFeature({
      id: _common2.casesFeatureId,
      name: _i18n.i18n.translate('xpack.observability.featureRegistry.linkObservabilityTitle', {
        defaultMessage: 'Cases'
      }),
      order: 1100,
      category: _server.DEFAULT_APP_CATEGORIES.observability,
      app: [_common2.casesFeatureId, 'kibana'],
      catalogue: [_common2.observabilityFeatureId],
      cases: [_common2.observabilityFeatureId],
      privileges: {
        all: {
          api: ['casesSuggestUserProfiles', 'bulkGetUserProfiles'],
          app: [_common2.casesFeatureId, 'kibana'],
          catalogue: [_common2.observabilityFeatureId],
          cases: {
            create: [_common2.observabilityFeatureId],
            read: [_common2.observabilityFeatureId],
            update: [_common2.observabilityFeatureId],
            push: [_common2.observabilityFeatureId]
          },
          savedObject: {
            all: [],
            read: []
          },
          ui: casesCapabilities.all
        },
        read: {
          api: ['casesSuggestUserProfiles', 'bulkGetUserProfiles'],
          app: [_common2.casesFeatureId, 'kibana'],
          catalogue: [_common2.observabilityFeatureId],
          cases: {
            read: [_common2.observabilityFeatureId]
          },
          savedObject: {
            all: [],
            read: []
          },
          ui: casesCapabilities.read
        }
      },
      subFeatures: [{
        name: _i18n.i18n.translate('xpack.observability.featureRegistry.deleteSubFeatureName', {
          defaultMessage: 'Delete'
        }),
        privilegeGroups: [{
          groupType: 'independent',
          privileges: [{
            api: [],
            id: 'cases_delete',
            name: _i18n.i18n.translate('xpack.observability.featureRegistry.deleteSubFeatureDetails', {
              defaultMessage: 'Delete cases and comments'
            }),
            includeIn: 'all',
            savedObject: {
              all: [],
              read: []
            },
            cases: {
              delete: [_common2.observabilityFeatureId]
            },
            ui: casesCapabilities.delete
          }]
        }]
      }]
    });
    let annotationsApiPromise;
    core.uiSettings.register(_ui_settings.uiSettings);
    if (config.annotations.enabled) {
      annotationsApiPromise = (0, _bootstrap_annotations.bootstrapAnnotations)({
        core,
        index: config.annotations.index,
        context: this.initContext
      }).catch(err => {
        const logger = this.initContext.logger.get('annotations');
        logger.warn(err);
        throw err;
      });
    }
    if (config.unsafe.slo.enabled) {
      core.savedObjects.registerType(_saved_objects.slo);
    }
    const start = () => core.getStartServices().then(([coreStart]) => coreStart);
    const {
      ruleDataService
    } = plugins.ruleRegistry;
    (0, _register_routes.registerRoutes)({
      core: {
        setup: core,
        start
      },
      logger: this.initContext.logger.get(),
      repository: (0, _get_global_observability_server_route_repository.getGlobalObservabilityServerRouteRepository)(config),
      ruleDataService
    });
    return {
      getAlertDetailsConfig() {
        return config.unsafe.alertDetails;
      },
      getScopedAnnotationsClient: async (...args) => {
        const api = await annotationsApiPromise;
        return api === null || api === void 0 ? void 0 : api.getScopedAnnotationsClient(...args);
      }
    };
  }
  start() {}
  stop() {}
}
exports.ObservabilityPlugin = ObservabilityPlugin;