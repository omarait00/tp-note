"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteIndexRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../common/constants");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Deletes all of the indexes, template, ilm policies, and aliases. You can check
 * this by looking at each of these settings from ES after a deletion:
 * GET /_template/.siem-signals-default
 * GET /_index_template/.siem-signals-default
 * GET /.siem-signals-default-000001/
 * GET /_ilm/policy/.signals-default
 * GET /_alias/.siem-signals-default
 *
 * And ensuring they're all gone
 */
const deleteIndexRoute = router => {
  router.delete({
    path: _constants.DETECTION_ENGINE_INDEX_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, _, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      var _await$context$securi;
      const esClient = (await context.core).elasticsearch.client.asCurrentUser;
      const siemClient = (_await$context$securi = await context.securitySolution) === null || _await$context$securi === void 0 ? void 0 : _await$context$securi.getAppClient();
      if (!siemClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }
      const index = siemClient.getSignalsIndex();
      const indexExists = await (0, _securitysolutionEsUtils.getIndexExists)(esClient, index);
      if (!indexExists) {
        return siemResponse.error({
          statusCode: 404,
          body: `index: "${index}" does not exist`
        });
      } else {
        await (0, _securitysolutionEsUtils.deleteAllIndex)(esClient, index);
        const policyExists = await (0, _securitysolutionEsUtils.getPolicyExists)(esClient, index);
        if (policyExists) {
          await (0, _securitysolutionEsUtils.deletePolicy)(esClient, index);
        }
        const templateExists = await esClient.indices.existsIndexTemplate({
          name: index
        });
        if (templateExists) {
          await esClient.indices.deleteIndexTemplate({
            name: index
          });
        }
        const legacyTemplateExists = await esClient.indices.existsTemplate({
          name: index
        });
        if (legacyTemplateExists) {
          await esClient.indices.deleteTemplate({
            name: index
          });
        }
        return response.ok({
          body: {
            acknowledged: true
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
exports.deleteIndexRoute = deleteIndexRoute;