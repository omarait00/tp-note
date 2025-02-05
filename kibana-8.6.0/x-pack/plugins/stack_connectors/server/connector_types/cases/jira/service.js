"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExternalService = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _lodash = require("lodash");
var _axios_utils = require("../../../../../actions/server/lib/axios_utils");
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

const VERSION = '2';
const BASE_URL = `rest/api/${VERSION}`;
const CAPABILITIES_URL = `rest/capabilities`;
const VIEW_INCIDENT_URL = `browse`;
const createMetaCapabilities = ['list-project-issuetypes', 'list-issuetype-fields'];
const createExternalService = ({
  config,
  secrets
}, logger, configurationUtilities) => {
  const {
    apiUrl: url,
    projectKey
  } = config;
  const {
    apiToken,
    email
  } = secrets;
  if (!url || !projectKey || !apiToken || !email) {
    throw Error(`[Action]${i18n.NAME}: Wrong configuration.`);
  }
  const urlWithoutTrailingSlash = url.endsWith('/') ? url.slice(0, -1) : url;
  const incidentUrl = `${urlWithoutTrailingSlash}/${BASE_URL}/issue`;
  const capabilitiesUrl = `${urlWithoutTrailingSlash}/${CAPABILITIES_URL}`;
  const commentUrl = `${incidentUrl}/{issueId}/comment`;
  const getIssueTypesOldAPIURL = `${urlWithoutTrailingSlash}/${BASE_URL}/issue/createmeta?projectKeys=${projectKey}&expand=projects.issuetypes.fields`;
  const getIssueTypeFieldsOldAPIURL = `${urlWithoutTrailingSlash}/${BASE_URL}/issue/createmeta?projectKeys=${projectKey}&issuetypeIds={issueTypeId}&expand=projects.issuetypes.fields`;
  const getIssueTypesUrl = `${urlWithoutTrailingSlash}/${BASE_URL}/issue/createmeta/${projectKey}/issuetypes`;
  const getIssueTypeFieldsUrl = `${urlWithoutTrailingSlash}/${BASE_URL}/issue/createmeta/${projectKey}/issuetypes/{issueTypeId}`;
  const searchUrl = `${urlWithoutTrailingSlash}/${BASE_URL}/search`;
  const axiosInstance = _axios.default.create({
    auth: {
      username: email,
      password: apiToken
    }
  });
  const getIncidentViewURL = key => {
    return `${urlWithoutTrailingSlash}/${VIEW_INCIDENT_URL}/${key}`;
  };
  const getCommentsURL = issueId => {
    return commentUrl.replace('{issueId}', issueId);
  };
  const createGetIssueTypeFieldsUrl = (uri, issueTypeId) => {
    return uri.replace('{issueTypeId}', issueTypeId);
  };
  const createFields = (key, incident) => {
    let fields = {
      summary: trimAndRemoveNewlines(incident.summary),
      project: {
        key
      }
    };
    if (incident.issueType) {
      fields = {
        ...fields,
        issuetype: {
          id: incident.issueType
        }
      };
    }
    if (incident.description) {
      fields = {
        ...fields,
        description: incident.description
      };
    }
    if (incident.labels) {
      fields = {
        ...fields,
        labels: incident.labels
      };
    }
    if (incident.priority) {
      fields = {
        ...fields,
        priority: {
          name: incident.priority
        }
      };
    }
    if (incident.parent) {
      fields = {
        ...fields,
        parent: {
          key: incident.parent
        }
      };
    }
    return fields;
  };
  const trimAndRemoveNewlines = str => str.split(/[\n\r]/gm).map(item => item.trim()).filter(item => !(0, _lodash.isEmpty)(item)).join(', ');
  const createErrorMessage = errorResponse => {
    if (errorResponse == null) {
      return 'unknown: errorResponse was null';
    }
    const {
      errorMessages,
      errors
    } = errorResponse;
    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
      return `${errorMessages.join(', ')}`;
    }
    if (errors == null) {
      return 'unknown: errorResponse.errors was null';
    }
    return Object.entries(errors).reduce((errorMessage, [, value]) => {
      const msg = errorMessage.length > 0 ? `${errorMessage} ${value}` : value;
      return msg;
    }, '');
  };
  const hasSupportForNewAPI = capabilities => createMetaCapabilities.every(c => {
    var _capabilities$capabil;
    return Object.keys((_capabilities$capabil = capabilities === null || capabilities === void 0 ? void 0 : capabilities.capabilities) !== null && _capabilities$capabil !== void 0 ? _capabilities$capabil : {}).includes(c);
  });
  const normalizeIssueTypes = issueTypes => issueTypes.map(type => ({
    id: type.id,
    name: type.name
  }));
  const normalizeFields = fields => Object.keys(fields !== null && fields !== void 0 ? fields : {}).reduce((fieldsAcc, fieldKey) => {
    var _fields$fieldKey, _fields$fieldKey$allo, _fields$fieldKey2, _fields$fieldKey$defa, _fields$fieldKey3, _fields$fieldKey4, _fields$fieldKey5;
    return {
      ...fieldsAcc,
      [fieldKey]: {
        required: (_fields$fieldKey = fields[fieldKey]) === null || _fields$fieldKey === void 0 ? void 0 : _fields$fieldKey.required,
        allowedValues: (_fields$fieldKey$allo = (_fields$fieldKey2 = fields[fieldKey]) === null || _fields$fieldKey2 === void 0 ? void 0 : _fields$fieldKey2.allowedValues) !== null && _fields$fieldKey$allo !== void 0 ? _fields$fieldKey$allo : [],
        defaultValue: (_fields$fieldKey$defa = (_fields$fieldKey3 = fields[fieldKey]) === null || _fields$fieldKey3 === void 0 ? void 0 : _fields$fieldKey3.defaultValue) !== null && _fields$fieldKey$defa !== void 0 ? _fields$fieldKey$defa : {},
        schema: (_fields$fieldKey4 = fields[fieldKey]) === null || _fields$fieldKey4 === void 0 ? void 0 : _fields$fieldKey4.schema,
        name: (_fields$fieldKey5 = fields[fieldKey]) === null || _fields$fieldKey5 === void 0 ? void 0 : _fields$fieldKey5.name
      }
    };
  }, {});
  const normalizeSearchResults = issues => issues.map(issue => {
    var _issue$fields$summary, _issue$fields;
    return {
      id: issue.id,
      key: issue.key,
      title: (_issue$fields$summary = (_issue$fields = issue.fields) === null || _issue$fields === void 0 ? void 0 : _issue$fields.summary) !== null && _issue$fields$summary !== void 0 ? _issue$fields$summary : null
    };
  });
  const normalizeIssue = issue => {
    var _issue$fields$summary2, _issue$fields2;
    return {
      id: issue.id,
      key: issue.key,
      title: (_issue$fields$summary2 = (_issue$fields2 = issue.fields) === null || _issue$fields2 === void 0 ? void 0 : _issue$fields2.summary) !== null && _issue$fields$summary2 !== void 0 ? _issue$fields$summary2 : null
    };
  };
  const getIncident = async id => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: `${incidentUrl}/${id}`,
        logger,
        configurationUtilities
      });
      (0, _axios_utils.throwIfResponseIsNotValid)({
        res,
        requiredAttributesToBeInTheResponse: ['id', 'key']
      });
      const {
        fields,
        id: incidentId,
        key
      } = res.data;
      return {
        id: incidentId,
        key,
        created: fields.created,
        updated: fields.updated,
        ...fields
      };
    } catch (error) {
      var _error$response;
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to get incident with id ${id}. Error: ${error.message} Reason: ${createErrorMessage((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.data)}`));
    }
  };
  const createIncident = async ({
    incident
  }) => {
    /* The response from Jira when creating an issue contains only the key and the id.
      The function makes the following calls when creating an issue:
        1. Get issueTypes to set a default ONLY when incident.issueType is missing
        2. Create the issue.
        3. Get the created issue with all the necessary fields.
    */

    let issueType = incident.issueType;
    if (!incident.issueType) {
      var _issueTypes$0$id, _issueTypes$;
      const issueTypes = await getIssueTypes();
      issueType = (_issueTypes$0$id = (_issueTypes$ = issueTypes[0]) === null || _issueTypes$ === void 0 ? void 0 : _issueTypes$.id) !== null && _issueTypes$0$id !== void 0 ? _issueTypes$0$id : '';
    }
    const fields = createFields(projectKey, {
      ...incident,
      issueType
    });
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: `${incidentUrl}`,
        logger,
        method: 'post',
        data: {
          fields
        },
        configurationUtilities
      });
      (0, _axios_utils.throwIfResponseIsNotValid)({
        res,
        requiredAttributesToBeInTheResponse: ['id']
      });
      const updatedIncident = await getIncident(res.data.id);
      return {
        title: updatedIncident.key,
        id: updatedIncident.id,
        pushedDate: new Date(updatedIncident.created).toISOString(),
        url: getIncidentViewURL(updatedIncident.key)
      };
    } catch (error) {
      var _error$response2;
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to create incident. Error: ${error.message}. Reason: ${createErrorMessage((_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.data)}`));
    }
  };
  const updateIncident = async ({
    incidentId,
    incident
  }) => {
    const incidentWithoutNullValues = Object.entries(incident).reduce((obj, [key, value]) => value != null ? {
      ...obj,
      [key]: value
    } : obj, {});
    const fields = createFields(projectKey, incidentWithoutNullValues);
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        method: 'put',
        url: `${incidentUrl}/${incidentId}`,
        logger,
        data: {
          fields
        },
        configurationUtilities
      });
      (0, _axios_utils.throwIfResponseIsNotValid)({
        res
      });
      const updatedIncident = await getIncident(incidentId);
      return {
        title: updatedIncident.key,
        id: updatedIncident.id,
        pushedDate: new Date(updatedIncident.updated).toISOString(),
        url: getIncidentViewURL(updatedIncident.key)
      };
    } catch (error) {
      var _error$response3;
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to update incident with id ${incidentId}. Error: ${error.message}. Reason: ${createErrorMessage((_error$response3 = error.response) === null || _error$response3 === void 0 ? void 0 : _error$response3.data)}`));
    }
  };
  const createComment = async ({
    incidentId,
    comment
  }) => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        method: 'post',
        url: getCommentsURL(incidentId),
        logger,
        data: {
          body: comment.comment
        },
        configurationUtilities
      });
      (0, _axios_utils.throwIfResponseIsNotValid)({
        res,
        requiredAttributesToBeInTheResponse: ['id', 'created']
      });
      return {
        commentId: comment.commentId,
        externalCommentId: res.data.id,
        pushedDate: new Date(res.data.created).toISOString()
      };
    } catch (error) {
      var _error$response4;
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to create comment at incident with id ${incidentId}. Error: ${error.message}. Reason: ${createErrorMessage((_error$response4 = error.response) === null || _error$response4 === void 0 ? void 0 : _error$response4.data)}`));
    }
  };
  const getCapabilities = async () => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        method: 'get',
        url: capabilitiesUrl,
        logger,
        configurationUtilities
      });
      (0, _axios_utils.throwIfResponseIsNotValid)({
        res,
        requiredAttributesToBeInTheResponse: ['capabilities']
      });
      return {
        ...res.data
      };
    } catch (error) {
      var _error$response5;
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to get capabilities. Error: ${error.message}. Reason: ${createErrorMessage((_error$response5 = error.response) === null || _error$response5 === void 0 ? void 0 : _error$response5.data)}`));
    }
  };
  const getIssueTypes = async () => {
    const capabilitiesResponse = await getCapabilities();
    const supportsNewAPI = hasSupportForNewAPI(capabilitiesResponse);
    try {
      if (!supportsNewAPI) {
        var _res$data$projects$0$, _res$data$projects$;
        const res = await (0, _axios_utils.request)({
          axios: axiosInstance,
          method: 'get',
          url: getIssueTypesOldAPIURL,
          logger,
          configurationUtilities
        });
        (0, _axios_utils.throwIfResponseIsNotValid)({
          res
        });
        const issueTypes = (_res$data$projects$0$ = (_res$data$projects$ = res.data.projects[0]) === null || _res$data$projects$ === void 0 ? void 0 : _res$data$projects$.issuetypes) !== null && _res$data$projects$0$ !== void 0 ? _res$data$projects$0$ : [];
        return normalizeIssueTypes(issueTypes);
      } else {
        const res = await (0, _axios_utils.request)({
          axios: axiosInstance,
          method: 'get',
          url: getIssueTypesUrl,
          logger,
          configurationUtilities
        });
        (0, _axios_utils.throwIfResponseIsNotValid)({
          res
        });
        const issueTypes = res.data.values;
        return normalizeIssueTypes(issueTypes);
      }
    } catch (error) {
      var _error$response6;
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to get issue types. Error: ${error.message}. Reason: ${createErrorMessage((_error$response6 = error.response) === null || _error$response6 === void 0 ? void 0 : _error$response6.data)}`));
    }
  };
  const getFieldsByIssueType = async issueTypeId => {
    const capabilitiesResponse = await getCapabilities();
    const supportsNewAPI = hasSupportForNewAPI(capabilitiesResponse);
    try {
      if (!supportsNewAPI) {
        var _res$data$projects$2, _res$data$projects$2$;
        const res = await (0, _axios_utils.request)({
          axios: axiosInstance,
          method: 'get',
          url: createGetIssueTypeFieldsUrl(getIssueTypeFieldsOldAPIURL, issueTypeId),
          logger,
          configurationUtilities
        });
        (0, _axios_utils.throwIfResponseIsNotValid)({
          res
        });
        const fields = ((_res$data$projects$2 = res.data.projects[0]) === null || _res$data$projects$2 === void 0 ? void 0 : (_res$data$projects$2$ = _res$data$projects$2.issuetypes[0]) === null || _res$data$projects$2$ === void 0 ? void 0 : _res$data$projects$2$.fields) || {};
        return normalizeFields(fields);
      } else {
        const res = await (0, _axios_utils.request)({
          axios: axiosInstance,
          method: 'get',
          url: createGetIssueTypeFieldsUrl(getIssueTypeFieldsUrl, issueTypeId),
          logger,
          configurationUtilities
        });
        (0, _axios_utils.throwIfResponseIsNotValid)({
          res
        });
        const fields = res.data.values.reduce((acc, value) => ({
          ...acc,
          [value.fieldId]: {
            ...value
          }
        }), {});
        return normalizeFields(fields);
      }
    } catch (error) {
      var _error$response7;
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to get fields. Error: ${error.message}. Reason: ${createErrorMessage((_error$response7 = error.response) === null || _error$response7 === void 0 ? void 0 : _error$response7.data)}`));
    }
  };
  const getFields = async () => {
    try {
      const issueTypes = await getIssueTypes();
      const fieldsPerIssueType = await Promise.all(issueTypes.map(issueType => getFieldsByIssueType(issueType.id)));
      return fieldsPerIssueType.reduce((acc, fieldTypesByIssue) => {
        const currentListOfFields = Object.keys(acc);
        return currentListOfFields.length === 0 ? fieldTypesByIssue : currentListOfFields.reduce((add, field) => Object.keys(fieldTypesByIssue).includes(field) ? {
          ...add,
          [field]: acc[field]
        } : add, {});
      }, {});
    } catch (error) {
      // errors that happen here would be thrown in the contained async calls
      throw error;
    }
  };
  const getIssues = async title => {
    const jqlEscapedTitle = (0, _utils.escapeJqlSpecialCharacters)(title);
    const query = `${searchUrl}?jql=${encodeURIComponent(`project="${projectKey}" and summary ~"${jqlEscapedTitle}"`)}`;
    try {
      var _res$data$issues, _res$data;
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        method: 'get',
        url: query,
        logger,
        configurationUtilities
      });
      (0, _axios_utils.throwIfResponseIsNotValid)({
        res
      });
      return normalizeSearchResults((_res$data$issues = (_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data.issues) !== null && _res$data$issues !== void 0 ? _res$data$issues : []);
    } catch (error) {
      var _error$response8;
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to get issues. Error: ${error.message}. Reason: ${createErrorMessage((_error$response8 = error.response) === null || _error$response8 === void 0 ? void 0 : _error$response8.data)}`));
    }
  };
  const getIssue = async id => {
    const getIssueUrl = `${incidentUrl}/${id}`;
    try {
      var _res$data2;
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        method: 'get',
        url: getIssueUrl,
        logger,
        configurationUtilities
      });
      (0, _axios_utils.throwIfResponseIsNotValid)({
        res
      });
      return normalizeIssue((_res$data2 = res.data) !== null && _res$data2 !== void 0 ? _res$data2 : {});
    } catch (error) {
      var _error$response9;
      throw new Error((0, _axios_utils.getErrorMessage)(i18n.NAME, `Unable to get issue with id ${id}. Error: ${error.message}. Reason: ${createErrorMessage((_error$response9 = error.response) === null || _error$response9 === void 0 ? void 0 : _error$response9.data)}`));
    }
  };
  return {
    getFields,
    getIncident,
    createIncident,
    updateIncident,
    createComment,
    getCapabilities,
    getIssueTypes,
    getFieldsByIssueType,
    getIssues,
    getIssue
  };
};
exports.createExternalService = createExternalService;