"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwIfSubActionIsNotSupported = exports.prepareIncident = exports.getPushedDate = exports.getAxiosInstance = exports.createServiceError = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _axios_utils = require("../../../../../actions/server/lib/axios_utils");
var _get_oauth_jwt_access_token = require("../../../../../actions/server/lib/get_oauth_jwt_access_token");
var _config = require("./config");
var i18n = _interopRequireWildcard(require("./translations"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const prepareIncident = (useOldApi, incident) => useOldApi ? incident : Object.entries(incident).reduce((acc, [key, value]) => ({
  ...acc,
  [`${_config.FIELD_PREFIX}${key}`]: value
}), {});
exports.prepareIncident = prepareIncident;
const createErrorMessage = errorResponse => {
  if (errorResponse == null) {
    return 'unknown: errorResponse was null';
  }
  const {
    error
  } = errorResponse;
  return error != null ? `${error === null || error === void 0 ? void 0 : error.message}: ${error === null || error === void 0 ? void 0 : error.detail}` : 'unknown: no error in error response';
};
const createServiceError = (error, message) => {
  var _error$response;
  return new Error((0, _axios_utils.getErrorMessage)(i18n.SERVICENOW, `${message}. Error: ${error.message} Reason: ${createErrorMessage((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.data)}`));
};
exports.createServiceError = createServiceError;
const getPushedDate = timestamp => {
  if (timestamp != null) {
    return new Date((0, _axios_utils.addTimeZoneToDate)(timestamp)).toISOString();
  }
  return new Date().toISOString();
};
exports.getPushedDate = getPushedDate;
const throwIfSubActionIsNotSupported = ({
  api,
  subAction,
  supportedSubActions,
  logger
}) => {
  if (!api[subAction]) {
    const errorMessage = `[Action][ExternalService] Unsupported subAction type ${subAction}.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
  if (!supportedSubActions.includes(subAction)) {
    const errorMessage = `[Action][ExternalService] subAction ${subAction} not implemented.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};
exports.throwIfSubActionIsNotSupported = throwIfSubActionIsNotSupported;
const getAxiosInstance = ({
  connectorId,
  logger,
  configurationUtilities,
  credentials,
  snServiceUrl,
  connectorTokenClient
}) => {
  const {
    config,
    secrets
  } = credentials;
  const {
    isOAuth
  } = config;
  const {
    username,
    password
  } = secrets;
  let axiosInstance;
  if (!isOAuth && username && password) {
    axiosInstance = _axios.default.create({
      auth: {
        username,
        password
      }
    });
  } else {
    axiosInstance = _axios.default.create();
    axiosInstance.interceptors.request.use(async axiosConfig => {
      const accessToken = await (0, _get_oauth_jwt_access_token.getOAuthJwtAccessToken)({
        connectorId,
        logger,
        configurationUtilities,
        credentials: {
          config: {
            clientId: config.clientId,
            jwtKeyId: config.jwtKeyId,
            userIdentifierValue: config.userIdentifierValue
          },
          secrets: {
            clientSecret: secrets.clientSecret,
            privateKey: secrets.privateKey,
            privateKeyPassword: secrets.privateKeyPassword ? secrets.privateKeyPassword : null
          }
        },
        tokenUrl: `${snServiceUrl}/oauth_token.do`,
        connectorTokenClient
      });
      if (!accessToken) {
        throw new Error(`Unable to retrieve access token for connectorId: ${connectorId}`);
      }
      axiosConfig.headers = {
        ...axiosConfig.headers,
        Authorization: accessToken
      };
      return axiosConfig;
    }, error => {
      return Promise.reject(error);
    });
    axiosInstance.interceptors.response.use(response => response, async error => {
      var _error$response2;
      const statusCode = error === null || error === void 0 ? void 0 : (_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.status;

      // Look for 4xx errors that indicate something is wrong with the request
      // We don't know for sure that it is an access token issue but remove saved
      // token just to be sure
      if (statusCode >= 400 && statusCode < 500) {
        await connectorTokenClient.deleteConnectorTokens({
          connectorId
        });
      }
      return Promise.reject(error);
    });
  }
  return axiosInstance;
};
exports.getAxiosInstance = getAxiosInstance;