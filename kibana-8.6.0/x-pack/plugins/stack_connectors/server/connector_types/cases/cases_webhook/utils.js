"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwDescriptiveErrorIfResponseIsNotValid = exports.stringifyObjValues = exports.removeSlash = exports.getObjectValueByKeyAsString = exports.createServiceError = void 0;
var _lodash = require("lodash");
var _axios_utils = require("../../../../../actions/server/lib/axios_utils");
var i18n = _interopRequireWildcard(require("./translations"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createServiceError = (error, message) => {
  var _error$response, _error$response2;
  const serverResponse = error.response && error.response.data ? JSON.stringify(error.response.data) : null;
  return new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `${message}. Error: ${error.message}. ${serverResponse != null ? serverResponse : ''} ${((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.statusText) != null ? `Reason: ${(_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.statusText}` : ''}`));
};
exports.createServiceError = createServiceError;
const getObjectValueByKeyAsString = (obj, key) => {
  const value = (0, _lodash.get)(obj, key);
  return value === undefined ? value : `${value}`;
};
exports.getObjectValueByKeyAsString = getObjectValueByKeyAsString;
const throwDescriptiveErrorIfResponseIsNotValid = ({
  res,
  requiredAttributesToBeInTheResponse = []
}) => {
  const requiredContentType = 'application/json';
  const contentType = res.headers['content-type'];
  const data = res.data;

  /**
   * Check that the content-type of the response is application/json.
   * Then includes is added because the header can be application/json;charset=UTF-8.
   */
  if (contentType == null) {
    throw new Error(`Missing content type header in ${res.config.method} ${res.config.url}. Supported content types: ${requiredContentType}`);
  }
  if (!contentType.includes(requiredContentType)) {
    throw new Error(`Unsupported content type: ${contentType} in ${res.config.method} ${res.config.url}. Supported content types: ${requiredContentType}`);
  }
  if (!(0, _lodash.isEmpty)(data) && !(0, _lodash.isObjectLike)(data)) {
    throw new Error('Response is not a valid JSON');
  }
  if (requiredAttributesToBeInTheResponse.length > 0) {
    const requiredAttributesError = attrs => new Error(`Response is missing the expected ${attrs.length > 1 ? `fields` : `field`}: ${attrs.join(', ')}`);
    const errorAttributes = [];
    /**
     * If the response is an array and requiredAttributesToBeInTheResponse
     * are not empty then we throw an error if we are missing data for the given attributes
     */
    requiredAttributesToBeInTheResponse.forEach(attr => {
      // Check only for undefined as null is a valid value
      if (typeof getObjectValueByKeyAsString(data, attr) === 'undefined') {
        errorAttributes.push(attr);
      }
    });
    if (errorAttributes.length) {
      throw requiredAttributesError(errorAttributes);
    }
  }
};
exports.throwDescriptiveErrorIfResponseIsNotValid = throwDescriptiveErrorIfResponseIsNotValid;
const removeSlash = url => url.endsWith('/') ? url.slice(0, -1) : url;
exports.removeSlash = removeSlash;
const stringifyObjValues = properties => ({
  case: Object.entries(properties).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: JSON.stringify(value)
  }), {})
});
exports.stringifyObjValues = stringifyObjValues;