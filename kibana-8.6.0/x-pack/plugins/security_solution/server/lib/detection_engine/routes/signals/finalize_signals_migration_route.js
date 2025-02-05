"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.finalizeSignalsMigrationRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../common/constants");
var _finalize_signals_migration_schema = require("../../../../../common/detection_engine/schemas/request/finalize_signals_migration_schema");
var _route_validation = require("../../../../utils/build_validation/route_validation");
var _helpers = require("../../migrations/helpers");
var _migration_service = require("../../migrations/migration_service");
var _utils = require("../utils");
var _get_migration_saved_objects_by_id = require("../../migrations/get_migration_saved_objects_by_id");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const finalizeSignalsMigrationRoute = (router, ruleDataService, security) => {
  router.post({
    path: _constants.DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_finalize_signals_migration_schema.finalizeSignalsMigrationSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const core = await context.core;
    const securitySolution = await context.securitySolution;
    const esClient = core.elasticsearch.client.asCurrentUser;
    const soClient = core.savedObjects.client;
    const {
      migration_ids: migrationIds
    } = request.body;
    try {
      var _user$username;
      const appClient = securitySolution === null || securitySolution === void 0 ? void 0 : securitySolution.getAppClient();
      if (!appClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }
      const user = await (security === null || security === void 0 ? void 0 : security.authc.getCurrentUser(request));
      const migrationService = (0, _migration_service.signalsMigrationService)({
        esClient,
        soClient,
        username: (_user$username = user === null || user === void 0 ? void 0 : user.username) !== null && _user$username !== void 0 ? _user$username : 'elastic'
      });
      const migrations = await (0, _get_migration_saved_objects_by_id.getMigrationSavedObjectsById)({
        ids: migrationIds,
        soClient
      });
      const spaceId = securitySolution.getSpaceId();
      const signalsAlias = ruleDataService.getResourceName(`security.alerts-${spaceId}`);
      const finalizeResults = await Promise.all(migrations.map(async migration => {
        try {
          const finalizedMigration = await migrationService.finalize({
            migration,
            signalsAlias
          });
          if ((0, _helpers.isMigrationFailed)(finalizedMigration)) {
            var _finalizedMigration$a;
            throw new _securitysolutionEsUtils.BadRequestError((_finalizedMigration$a = finalizedMigration.attributes.error) !== null && _finalizedMigration$a !== void 0 ? _finalizedMigration$a : 'The migration was not successful.');
          }
          return {
            id: finalizedMigration.id,
            completed: !(0, _helpers.isMigrationPending)(finalizedMigration),
            destinationIndex: finalizedMigration.attributes.destinationIndex,
            status: finalizedMigration.attributes.status,
            sourceIndex: finalizedMigration.attributes.sourceIndex,
            version: finalizedMigration.attributes.version,
            updated: finalizedMigration.attributes.updated
          };
        } catch (err) {
          const error = (0, _securitysolutionEsUtils.transformError)(err);
          return {
            id: migration.id,
            destinationIndex: migration.attributes.destinationIndex,
            error: {
              message: error.message,
              status_code: error.statusCode
            },
            status: migration.attributes.status,
            sourceIndex: migration.attributes.sourceIndex,
            version: migration.attributes.version,
            updated: migration.attributes.updated
          };
        }
      }));
      return response.ok({
        body: {
          migrations: finalizeResults
        }
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.finalizeSignalsMigrationRoute = finalizeSignalsMigrationRoute;