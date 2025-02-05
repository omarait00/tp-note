"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerConfigDataRoute = registerConfigDataRoute;
var _i18n = require("@kbn/i18n");
var _enterprise_search_config_api = require("../../lib/enterprise_search_config_api");
var _elasticsearch_error_handler = require("../../utils/elasticsearch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const errorMessage = _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.configData.errorMessage', {
  defaultMessage: 'Error fetching data from Enterprise Search'
});
function registerConfigDataRoute({
  router,
  config,
  log
}) {
  router.get({
    path: '/internal/enterprise_search/config_data',
    validate: false
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const data = await (0, _enterprise_search_config_api.callEnterpriseSearchConfigAPI)({
      config,
      log,
      request
    });
    if ('responseStatus' in data) {
      return response.customError({
        body: errorMessage,
        statusCode: data.responseStatus
      });
    } else if (!Object.keys(data).length) {
      return response.customError({
        body: errorMessage,
        statusCode: 502
      });
    } else {
      return response.ok({
        body: data,
        headers: {
          'content-type': 'application/json'
        }
      });
    }
  }));
}