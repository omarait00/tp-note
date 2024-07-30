"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLiveQueryRoute = void 0;
var _unified = _interopRequireDefault(require("unified"));
var _remarkParse = _interopRequireDefault(require("remark-parse"));
var _lodash = require("lodash");
var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));
var _live_query = require("../../../common/schemas/routes/live_query");
var _route_validation = require("../../utils/build_validation/route_validation");
var _handlers = require("../../handlers");
var _osquery_parser = require("./osquery_parser");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createLiveQueryRoute = (router, osqueryContext) => {
  router.post({
    path: '/api/osquery/live_queries',
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_live_query.createLiveQueryRequestBodySchema)
    }
  }, async (context, request, response) => {
    const [coreStartServices] = await osqueryContext.getStartServices();
    const soClient = (await context.core).savedObjects.client;
    const {
      osquery: {
        writeLiveQueries,
        runSavedQueries
      }
    } = await coreStartServices.capabilities.resolveCapabilities(request);
    const isInvalid = !(writeLiveQueries || runSavedQueries && (request.body.saved_query_id || request.body.pack_id));
    if (isInvalid) {
      var _request$body$alert_i;
      if ((_request$body$alert_i = request.body.alert_ids) !== null && _request$body$alert_i !== void 0 && _request$body$alert_i.length) {
        try {
          var _osqueryContext$servi;
          const client = await ((_osqueryContext$servi = osqueryContext.service.getRuleRegistryService()) === null || _osqueryContext$servi === void 0 ? void 0 : _osqueryContext$servi.getRacClientWithRequest(request));
          const alertData = await (client === null || client === void 0 ? void 0 : client.get({
            id: request.body.alert_ids[0]
          }));
          if (alertData !== null && alertData !== void 0 && alertData['kibana.alert.rule.note']) {
            const parsedAlertInvestigationGuide = (0, _unified.default)().use([[_remarkParse.default, {}], _osquery_parser.parser]).parse(alertData === null || alertData === void 0 ? void 0 : alertData['kibana.alert.rule.note']);
            const osqueryQueries = (0, _lodash.filter)(parsedAlertInvestigationGuide === null || parsedAlertInvestigationGuide === void 0 ? void 0 : parsedAlertInvestigationGuide.children, ['type', 'osquery']);
            const requestQueryExistsInTheInvestigationGuide = (0, _lodash.some)(osqueryQueries, payload => {
              var _payload$configuratio, _payload$configuratio2;
              return (payload === null || payload === void 0 ? void 0 : (_payload$configuratio = payload.configuration) === null || _payload$configuratio === void 0 ? void 0 : _payload$configuratio.query) === request.body.query && (0, _fastDeepEqual.default)(payload === null || payload === void 0 ? void 0 : (_payload$configuratio2 = payload.configuration) === null || _payload$configuratio2 === void 0 ? void 0 : _payload$configuratio2.ecs_mapping, request.body.ecs_mapping);
            });
            if (!requestQueryExistsInTheInvestigationGuide) throw new Error();
          }
        } catch (error) {
          return response.forbidden();
        }
      } else {
        return response.forbidden();
      }
    }
    try {
      var _osqueryContext$secur;
      const currentUser = await ((_osqueryContext$secur = osqueryContext.security.authc.getCurrentUser(request)) === null || _osqueryContext$secur === void 0 ? void 0 : _osqueryContext$secur.username);
      const {
        response: osqueryAction
      } = await (0, _handlers.createActionHandler)(osqueryContext, request.body, soClient, {
        currentUser
      });
      return response.ok({
        body: {
          data: osqueryAction
        }
      });
    } catch (error) {
      // TODO validate for 400 (when agents are not found for selection)
      // return response.badRequest({ body: new Error('No agents found for selection') });

      return response.customError({
        statusCode: 500,
        body: new Error(`Error occurred while processing ${error}`)
      });
    }
  });
};
exports.createLiveQueryRoute = createLiveQueryRoute;