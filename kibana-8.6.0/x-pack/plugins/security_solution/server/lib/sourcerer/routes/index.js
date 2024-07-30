"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSourcererDataViewRoute = exports.createSourcererDataViewRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../common/constants");
var _route_validation = require("../../../utils/build_validation/route_validation");
var _utils = require("../../detection_engine/routes/utils");
var _helpers = require("./helpers");
var _schema = require("./schema");
var _sourcerer = require("../../../../common/utils/sourcerer");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createSourcererDataViewRoute = (router, getStartServices) => {
  router.post({
    path: _constants.SOURCERER_API_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_schema.sourcererSchema)
    },
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _await$context$securi;
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const coreContext = await context.core;
    const siemClient = (_await$context$securi = await context.securitySolution) === null || _await$context$securi === void 0 ? void 0 : _await$context$securi.getAppClient();
    const dataViewId = siemClient.getSourcererDataViewId();
    try {
      var _allDataViews$find;
      const [, {
        data: {
          indexPatterns
        }
      }] = await getStartServices();
      const dataViewService = await indexPatterns.dataViewsServiceFactory(coreContext.savedObjects.client, coreContext.elasticsearch.client.asCurrentUser, request, true);
      let allDataViews = await dataViewService.getIdsWithTitle();
      let siemDataView = (_allDataViews$find = allDataViews.find(dv => dv.id === dataViewId)) !== null && _allDataViews$find !== void 0 ? _allDataViews$find : null;
      const {
        patternList
      } = request.body;
      const patternListAsTitle = (0, _sourcerer.ensurePatternFormat)(patternList).join();
      const siemDataViewTitle = siemDataView ? (0, _sourcerer.ensurePatternFormat)(siemDataView.title.split(',')).join() : '';
      if (siemDataView == null) {
        try {
          siemDataView = await dataViewService.createAndSave({
            allowNoIndex: true,
            id: dataViewId,
            title: patternListAsTitle,
            timeFieldName: _constants.DEFAULT_TIME_FIELD
          },
          // Override property - if a data view exists with the security solution pattern
          // delete it and replace it with our data view
          true);
        } catch (err) {
          const error = (0, _securitysolutionEsUtils.transformError)(err);
          if (err.name === 'DuplicateDataViewError' || error.statusCode === 409) {
            siemDataView = await dataViewService.get(dataViewId);
          } else {
            throw error;
          }
        }
      } else if (patternListAsTitle !== siemDataViewTitle) {
        siemDataView = await dataViewService.get(dataViewId);
        siemDataView.title = patternListAsTitle;
        await dataViewService.updateSavedObject(siemDataView);
      }
      if (allDataViews.some(dv => dv.id === dataViewId)) {
        allDataViews = allDataViews.map(v => v.id === dataViewId ? {
          ...v,
          title: patternListAsTitle
        } : v);
      } else {
        var _siemDataView$id;
        allDataViews.push({
          ...siemDataView,
          id: (_siemDataView$id = siemDataView.id) !== null && _siemDataView$id !== void 0 ? _siemDataView$id : dataViewId
        });
      }
      const defaultDataView = await buildSourcererDataView(siemDataView, coreContext.elasticsearch.client.asCurrentUser);
      return response.ok({
        body: {
          defaultDataView,
          kibanaDataViews: allDataViews.map(dv => dv.id === dataViewId ? defaultDataView : dv)
        }
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.statusCode === 403 ? 'Users with write permissions need to access the Elastic Security app to initialize the app source data.' : error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.createSourcererDataViewRoute = createSourcererDataViewRoute;
const getSourcererDataViewRoute = (router, getStartServices) => {
  router.get({
    path: _constants.SOURCERER_API_URL,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(_schema.sourcererDataViewSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const coreContext = await context.core;
    const {
      dataViewId
    } = request.query;
    try {
      var _allDataViews$find2;
      const [, {
        data: {
          indexPatterns
        }
      }] = await getStartServices();
      const dataViewService = await indexPatterns.dataViewsServiceFactory(coreContext.savedObjects.client, coreContext.elasticsearch.client.asCurrentUser, request, true);
      const allDataViews = await dataViewService.getIdsWithTitle();
      const siemDataView = (_allDataViews$find2 = allDataViews.find(dv => dv.id === dataViewId)) !== null && _allDataViews$find2 !== void 0 ? _allDataViews$find2 : null;
      const kibanaDataView = siemDataView ? await buildSourcererDataView(siemDataView, coreContext.elasticsearch.client.asCurrentUser) : {};
      return response.ok({
        body: kibanaDataView
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.statusCode === 403 ? 'Users with write permissions need to access the Elastic Security app to initialize the app source data.' : error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.getSourcererDataViewRoute = getSourcererDataViewRoute;
const buildSourcererDataView = async (dataView, clientAsCurrentUser) => {
  var _dataView$id;
  const patternList = dataView.title.split(',');
  const activePatternBools = await (0, _helpers.findExistingIndices)(patternList, clientAsCurrentUser);
  const activePatternLists = patternList.filter((pattern, j, self) => self.indexOf(pattern) === j && activePatternBools[j]);
  return {
    id: (_dataView$id = dataView.id) !== null && _dataView$id !== void 0 ? _dataView$id : '',
    title: dataView.title,
    patternList: activePatternLists
  };
};