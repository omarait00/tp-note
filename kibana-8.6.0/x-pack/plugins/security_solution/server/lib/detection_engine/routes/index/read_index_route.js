"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readIndexRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../common/constants");
var _utils = require("../utils");
var _check_template_version = require("./check_template_version");
var _get_index_version = require("./get_index_version");
var _helpers = require("../../migrations/helpers");
var _get_signals_template = require("./get_signals_template");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const readIndexRoute = (router, ruleDataService) => {
  router.get({
    path: _constants.DETECTION_ENGINE_INDEX_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, _, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const core = await context.core;
      const securitySolution = await context.securitySolution;
      const siemClient = securitySolution === null || securitySolution === void 0 ? void 0 : securitySolution.getAppClient();
      const esClient = core.elasticsearch.client.asCurrentUser;
      if (!siemClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }
      const spaceId = securitySolution.getSpaceId();
      const indexName = ruleDataService.getResourceName(`security.alerts-${spaceId}`);
      const index = siemClient.getSignalsIndex();
      const indexExists = await (0, _securitysolutionEsUtils.getBootstrapIndexExists)(core.elasticsearch.client.asInternalUser, index);
      if (indexExists) {
        let mappingOutdated = null;
        let aliasesOutdated = null;
        try {
          const indexVersion = await (0, _get_index_version.getIndexVersion)(esClient, index);
          mappingOutdated = (0, _helpers.isOutdated)({
            current: indexVersion,
            target: _get_signals_template.SIGNALS_TEMPLATE_VERSION
          });
          aliasesOutdated = await (0, _check_template_version.fieldAliasesOutdated)(esClient, index);
        } catch (err) {
          const error = (0, _securitysolutionEsUtils.transformError)(err);
          // Some users may not have the view_index_metadata permission necessary to check the index mapping version
          // so just continue and return null for index_mapping_outdated if the error is a 403
          if (error.statusCode !== 403) {
            return siemResponse.error({
              body: error.message,
              statusCode: error.statusCode
            });
          }
        }
        return response.ok({
          body: {
            name: indexName,
            index_mapping_outdated: mappingOutdated || aliasesOutdated
          }
        });
      } else {
        return response.ok({
          body: {
            name: indexName,
            index_mapping_outdated: false
          }
        });
      }
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.readIndexRoute = readIndexRoute;