"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExternalService = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _lodash = require("lodash");
var _mustache_renderer = require("../../../../../actions/server/lib/mustache_renderer");
var _axios_utils = require("../../../../../actions/server/lib/axios_utils");
var _validators = require("./validators");
var _utils = require("./utils");
var i18n = _interopRequireWildcard(require("./translations"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createExternalService = (actionId, {
  config,
  secrets
}, logger, configurationUtilities) => {
  const {
    createCommentJson,
    createCommentMethod,
    createCommentUrl,
    createIncidentJson,
    createIncidentMethod,
    createIncidentResponseKey,
    createIncidentUrl: createIncidentUrlConfig,
    getIncidentResponseExternalTitleKey,
    getIncidentUrl,
    hasAuth,
    headers,
    viewIncidentUrl,
    updateIncidentJson,
    updateIncidentMethod,
    updateIncidentUrl
  } = config;
  const {
    password,
    user
  } = secrets;
  if (!getIncidentUrl || !createIncidentUrlConfig || !viewIncidentUrl || !updateIncidentUrl || hasAuth && (!password || !user)) {
    throw Error(`[Action]${i18n.NAME}: Wrong configuration.`);
  }
  const createIncidentUrl = (0, _utils.removeSlash)(createIncidentUrlConfig);
  const axiosInstance = _axios.default.create({
    ...(hasAuth && (0, _lodash.isString)(secrets.user) && (0, _lodash.isString)(secrets.password) ? {
      auth: {
        username: secrets.user,
        password: secrets.password
      }
    } : {}),
    headers: {
      ['content-type']: 'application/json',
      ...(headers != null ? headers : {})
    }
  });
  const getIncident = async id => {
    try {
      const getUrl = (0, _mustache_renderer.renderMustacheStringNoEscape)(getIncidentUrl, {
        external: {
          system: {
            id: encodeURIComponent(id)
          }
        }
      });
      const normalizedUrl = (0, _validators.validateAndNormalizeUrl)(`${getUrl}`, configurationUtilities, 'Get case URL');
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: normalizedUrl,
        logger,
        configurationUtilities
      });
      (0, _utils.throwDescriptiveErrorIfResponseIsNotValid)({
        res,
        requiredAttributesToBeInTheResponse: [getIncidentResponseExternalTitleKey]
      });
      const title = (0, _utils.getObjectValueByKeyAsString)(res.data, getIncidentResponseExternalTitleKey);
      return {
        id,
        title
      };
    } catch (error) {
      throw (0, _utils.createServiceError)(error, `Unable to get case with id ${id}`);
    }
  };
  const createIncident = async ({
    incident
  }) => {
    try {
      const {
        tags,
        title,
        description
      } = incident;
      const normalizedUrl = (0, _validators.validateAndNormalizeUrl)(`${createIncidentUrl}`, configurationUtilities, 'Create case URL');
      const json = (0, _mustache_renderer.renderMustacheStringNoEscape)(createIncidentJson, (0, _utils.stringifyObjValues)({
        title,
        description: description !== null && description !== void 0 ? description : '',
        tags: tags !== null && tags !== void 0 ? tags : []
      }));
      (0, _validators.validateJson)(json, 'Create case JSON body');
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: normalizedUrl,
        logger,
        method: createIncidentMethod,
        data: json,
        configurationUtilities
      });
      const {
        status,
        statusText,
        data
      } = res;
      (0, _utils.throwDescriptiveErrorIfResponseIsNotValid)({
        res,
        requiredAttributesToBeInTheResponse: [createIncidentResponseKey]
      });
      const externalId = (0, _utils.getObjectValueByKeyAsString)(data, createIncidentResponseKey);
      const insertedIncident = await getIncident(externalId);
      logger.debug(`response from webhook action "${actionId}": [HTTP ${status}] ${statusText}`);
      const viewUrl = (0, _mustache_renderer.renderMustacheStringNoEscape)(viewIncidentUrl, {
        external: {
          system: {
            id: encodeURIComponent(externalId),
            title: encodeURIComponent(insertedIncident.title)
          }
        }
      });
      const normalizedViewUrl = (0, _validators.validateAndNormalizeUrl)(`${viewUrl}`, configurationUtilities, 'View case URL');
      return {
        id: externalId,
        title: insertedIncident.title,
        url: normalizedViewUrl,
        pushedDate: new Date().toISOString()
      };
    } catch (error) {
      throw (0, _utils.createServiceError)(error, 'Unable to create case');
    }
  };
  const updateIncident = async ({
    incidentId,
    incident
  }) => {
    try {
      const updateUrl = (0, _mustache_renderer.renderMustacheStringNoEscape)(updateIncidentUrl, {
        external: {
          system: {
            id: encodeURIComponent(incidentId)
          }
        }
      });
      const normalizedUrl = (0, _validators.validateAndNormalizeUrl)(`${updateUrl}`, configurationUtilities, 'Update case URL');
      const {
        tags,
        title,
        description
      } = incident;
      const json = (0, _mustache_renderer.renderMustacheStringNoEscape)(updateIncidentJson, {
        ...(0, _utils.stringifyObjValues)({
          title,
          description: description !== null && description !== void 0 ? description : '',
          tags: tags !== null && tags !== void 0 ? tags : []
        }),
        external: {
          system: {
            id: JSON.stringify(incidentId)
          }
        }
      });
      (0, _validators.validateJson)(json, 'Update case JSON body');
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        method: updateIncidentMethod,
        url: normalizedUrl,
        logger,
        data: json,
        configurationUtilities
      });
      (0, _utils.throwDescriptiveErrorIfResponseIsNotValid)({
        res
      });
      const updatedIncident = await getIncident(incidentId);
      const viewUrl = (0, _mustache_renderer.renderMustacheStringNoEscape)(viewIncidentUrl, {
        external: {
          system: {
            id: encodeURIComponent(incidentId),
            title: encodeURIComponent(updatedIncident.title)
          }
        }
      });
      const normalizedViewUrl = (0, _validators.validateAndNormalizeUrl)(`${viewUrl}`, configurationUtilities, 'View case URL');
      return {
        id: incidentId,
        title: updatedIncident.title,
        url: normalizedViewUrl,
        pushedDate: new Date().toISOString()
      };
    } catch (error) {
      throw (0, _utils.createServiceError)(error, `Unable to update case with id ${incidentId}`);
    }
  };
  const createComment = async ({
    incidentId,
    comment
  }) => {
    try {
      if (!createCommentUrl || !createCommentJson || !createCommentMethod) {
        return;
      }
      const commentUrl = (0, _mustache_renderer.renderMustacheStringNoEscape)(createCommentUrl, {
        external: {
          system: {
            id: encodeURIComponent(incidentId)
          }
        }
      });
      const normalizedUrl = (0, _validators.validateAndNormalizeUrl)(`${commentUrl}`, configurationUtilities, 'Create comment URL');
      const json = (0, _mustache_renderer.renderMustacheStringNoEscape)(createCommentJson, {
        ...(0, _utils.stringifyObjValues)({
          comment: comment.comment
        }),
        external: {
          system: {
            id: JSON.stringify(incidentId)
          }
        }
      });
      (0, _validators.validateJson)(json, 'Create comment JSON body');
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        method: createCommentMethod,
        url: normalizedUrl,
        logger,
        data: json,
        configurationUtilities
      });
      (0, _utils.throwDescriptiveErrorIfResponseIsNotValid)({
        res
      });
    } catch (error) {
      throw (0, _utils.createServiceError)(error, `Unable to create comment at case with id ${incidentId}`);
    }
  };
  return {
    createComment,
    createIncident,
    getIncident,
    updateIncident
  };
};
exports.createExternalService = createExternalService;