"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapCaseFieldsToExternalSystemFields = exports.getLatestPushInfo = exports.getEntity = exports.getDurationInSeconds = exports.getDurationForUpdate = exports.getClosedInfoForUpdate = exports.formatComments = exports.dedupAssignees = exports.createIncident = exports.addKibanaInformationToDescription = void 0;
var _lodash = require("lodash");
var _types = require("../../../common/types");
var _user_actions = require("../../../common/utils/user_actions");
var _api = require("../../../common/api");
var _utils = require("../utils");
var _utils2 = require("../../common/utils");
var i18n = _interopRequireWildcard(require("./translations"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const dedupAssignees = assignees => {
  if (assignees == null) {
    return;
  }
  return (0, _lodash.uniqBy)(assignees, 'uid');
};
exports.dedupAssignees = dedupAssignees;
const getLatestPushInfo = (connectorId, userActions) => {
  for (const [index, action] of [...userActions].reverse().entries()) {
    if ((0, _user_actions.isPushedUserAction)(action) && connectorId === action.payload.externalService.connector_id) {
      try {
        const pushedInfo = action.payload.externalService;
        // We returned the index of the element in the userActions array.
        // As we traverse the userActions in reverse we need to calculate the index of a normal traversal
        return {
          index: userActions.length - index - 1,
          pushedInfo
        };
      } catch (e) {
        // ignore parse failures and check the next user action
      }
    }
  }
  return null;
};
exports.getLatestPushInfo = getLatestPushInfo;
const getCommentContent = comment => {
  if (comment.type === _api.CommentType.user) {
    return comment.comment;
  } else if (comment.type === _api.CommentType.alert) {
    const ids = (0, _utils.getAlertIds)(comment);
    return `Alert with ids ${ids.join(', ')} added to case`;
  } else if (comment.type === _api.CommentType.actions && (comment.actions.type === 'isolate' || comment.actions.type === 'unisolate')) {
    var _comment$actions$targ;
    const firstHostname = ((_comment$actions$targ = comment.actions.targets) === null || _comment$actions$targ === void 0 ? void 0 : _comment$actions$targ.length) > 0 ? comment.actions.targets[0].hostname : 'unknown';
    const totalHosts = comment.actions.targets.length;
    const actionText = comment.actions.type === 'isolate' ? 'Isolated' : 'Released';
    const additionalHostsText = totalHosts - 1 > 0 ? `and ${totalHosts - 1} more ` : ``;
    return `${actionText} host ${firstHostname} ${additionalHostsText}with comment: ${comment.comment}`;
  }
  return '';
};
const getAlertsInfo = comments => {
  var _comments$reduce;
  const countingInfo = {
    totalComments: 0,
    pushed: 0,
    totalAlerts: 0
  };
  const res = (_comments$reduce = comments === null || comments === void 0 ? void 0 : comments.reduce(({
    totalComments,
    pushed,
    totalAlerts
  }, comment) => {
    if (comment.type === _api.CommentType.alert) {
      return {
        totalComments: totalComments + 1,
        pushed: comment.pushed_at != null ? pushed + 1 : pushed,
        totalAlerts: totalAlerts + (Array.isArray(comment.alertId) ? comment.alertId.length : 1)
      };
    }
    return {
      totalComments,
      pushed,
      totalAlerts
    };
  }, countingInfo)) !== null && _comments$reduce !== void 0 ? _comments$reduce : countingInfo;
  return {
    totalAlerts: res.totalAlerts,
    hasUnpushedAlertComments: res.totalComments > res.pushed
  };
};
const addAlertMessage = params => {
  const {
    theCase,
    externalServiceComments,
    spaceId,
    publicBaseUrl
  } = params;
  const {
    totalAlerts,
    hasUnpushedAlertComments
  } = getAlertsInfo(theCase.comments);
  const newComments = [...externalServiceComments];
  if (hasUnpushedAlertComments) {
    let comment = `Elastic Alerts attached to the case: ${totalAlerts}`;
    if (publicBaseUrl) {
      const alertsTableUrl = (0, _utils2.getCaseViewPath)({
        publicBaseUrl,
        spaceId,
        caseId: theCase.id,
        owner: theCase.owner,
        tabId: _types.CASE_VIEW_PAGE_TABS.ALERTS
      });
      comment = `${comment}\n\n${i18n.VIEW_ALERTS_IN_KIBANA}\n${i18n.ALERTS_URL(alertsTableUrl)}`;
    }
    newComments.push({
      comment,
      commentId: `${theCase.id}-total-alerts`
    });
  }
  return newComments;
};
const createIncident = async ({
  theCase,
  userActions,
  connector,
  alerts,
  casesConnectors,
  userProfiles,
  spaceId,
  publicBaseUrl
}) => {
  var _latestPushInfo$pushe, _latestPushInfo$pushe2, _casesConnectors$get$, _casesConnectors$get, _casesConnectors$get$2, _casesConnectors$get2;
  const latestPushInfo = getLatestPushInfo(connector.id, userActions);
  const externalId = (_latestPushInfo$pushe = latestPushInfo === null || latestPushInfo === void 0 ? void 0 : (_latestPushInfo$pushe2 = latestPushInfo.pushedInfo) === null || _latestPushInfo$pushe2 === void 0 ? void 0 : _latestPushInfo$pushe2.external_id) !== null && _latestPushInfo$pushe !== void 0 ? _latestPushInfo$pushe : null;
  const externalServiceFields = (_casesConnectors$get$ = (_casesConnectors$get = casesConnectors.get(connector.actionTypeId)) === null || _casesConnectors$get === void 0 ? void 0 : _casesConnectors$get.format(theCase, alerts)) !== null && _casesConnectors$get$ !== void 0 ? _casesConnectors$get$ : {};
  const connectorMappings = (_casesConnectors$get$2 = (_casesConnectors$get2 = casesConnectors.get(connector.actionTypeId)) === null || _casesConnectors$get2 === void 0 ? void 0 : _casesConnectors$get2.getMapping()) !== null && _casesConnectors$get$2 !== void 0 ? _casesConnectors$get$2 : [];
  const descriptionWithKibanaInformation = addKibanaInformationToDescription(theCase, spaceId, userProfiles, publicBaseUrl);
  const comments = formatComments({
    userActions,
    latestPushInfo,
    theCase,
    userProfiles,
    spaceId,
    publicBaseUrl
  });
  const mappedIncident = mapCaseFieldsToExternalSystemFields({
    title: theCase.title,
    description: descriptionWithKibanaInformation
  }, connectorMappings);
  const incident = {
    ...mappedIncident,
    ...externalServiceFields,
    externalId
  };
  return {
    incident,
    comments
  };
};
exports.createIncident = createIncident;
const mapCaseFieldsToExternalSystemFields = (caseFields, mapping) => {
  const mappedCaseFields = {};
  for (const caseFieldKey of Object.keys(caseFields)) {
    const mapDefinition = mapping.find(mappingEntry => mappingEntry.source === caseFieldKey && mappingEntry.target !== 'not_mapped');
    if (mapDefinition) {
      mappedCaseFields[mapDefinition.target] = caseFields[caseFieldKey];
    }
  }
  return mappedCaseFields;
};
exports.mapCaseFieldsToExternalSystemFields = mapCaseFieldsToExternalSystemFields;
const formatComments = ({
  userActions,
  latestPushInfo,
  theCase,
  spaceId,
  userProfiles,
  publicBaseUrl
}) => {
  var _latestPushInfo$index, _theCase$comments;
  const commentsIdsToBeUpdated = new Set(userActions.slice((_latestPushInfo$index = latestPushInfo === null || latestPushInfo === void 0 ? void 0 : latestPushInfo.index) !== null && _latestPushInfo$index !== void 0 ? _latestPushInfo$index : 0).filter(action => action.type === _api.ActionTypes.comment).map(action => action.comment_id));
  const commentsToBeUpdated = (_theCase$comments = theCase.comments) === null || _theCase$comments === void 0 ? void 0 : _theCase$comments.filter(comment =>
  // We push only user's comments
  (comment.type === _api.CommentType.user || comment.type === _api.CommentType.actions) && commentsIdsToBeUpdated.has(comment.id));
  let comments = [];
  if (commentsToBeUpdated && Array.isArray(commentsToBeUpdated) && commentsToBeUpdated.length > 0) {
    comments = addKibanaInformationToComments(commentsToBeUpdated, userProfiles);
  }
  comments = addAlertMessage({
    theCase,
    externalServiceComments: comments,
    spaceId,
    publicBaseUrl
  });
  return comments;
};
exports.formatComments = formatComments;
const addKibanaInformationToDescription = (theCase, spaceId, userProfiles, publicBaseUrl) => {
  const addedBy = i18n.ADDED_BY(getEntity({
    createdBy: theCase.created_by,
    updatedBy: theCase.updated_by
  }, userProfiles));
  const descriptionWithKibanaInformation = `${theCase.description}\n\n${addedBy}.`;
  if (!publicBaseUrl) {
    return descriptionWithKibanaInformation;
  }
  const caseUrl = (0, _utils2.getCaseViewPath)({
    publicBaseUrl,
    spaceId,
    caseId: theCase.id,
    owner: theCase.owner
  });
  return `${descriptionWithKibanaInformation}\n${i18n.VIEW_IN_KIBANA}.\n${i18n.CASE_URL(caseUrl)}`;
};
exports.addKibanaInformationToDescription = addKibanaInformationToDescription;
const addKibanaInformationToComments = (comments = [], userProfiles) => comments.map(theComment => {
  const addedBy = i18n.ADDED_BY(getEntity({
    createdBy: theComment.created_by,
    updatedBy: theComment.updated_by
  }, userProfiles));
  return {
    comment: `${getCommentContent(theComment)}\n\n${addedBy}.`,
    commentId: theComment.id
  };
});
const getEntity = (entity, userProfiles) => {
  var _ref, _getDisplayName;
  return (_ref = (_getDisplayName = getDisplayName(entity.updatedBy, userProfiles)) !== null && _getDisplayName !== void 0 ? _getDisplayName : getDisplayName(entity.createdBy, userProfiles)) !== null && _ref !== void 0 ? _ref : i18n.UNKNOWN;
};
exports.getEntity = getEntity;
const getDisplayName = (user, userProfiles) => {
  var _ref2, _validOrUndefined2;
  if (user == null) {
    return;
  }
  if (user.profile_uid != null) {
    const updatedByProfile = userProfiles === null || userProfiles === void 0 ? void 0 : userProfiles.get(user.profile_uid);
    if (updatedByProfile != null) {
      var _validOrUndefined;
      return (_validOrUndefined = validOrUndefined(updatedByProfile.user.full_name)) !== null && _validOrUndefined !== void 0 ? _validOrUndefined : validOrUndefined(updatedByProfile.user.username);
    }
  }
  return (_ref2 = (_validOrUndefined2 = validOrUndefined(user.full_name)) !== null && _validOrUndefined2 !== void 0 ? _validOrUndefined2 : validOrUndefined(user.username)) !== null && _ref2 !== void 0 ? _ref2 : i18n.UNKNOWN;
};
const validOrUndefined = value => {
  if (value == null || (0, _lodash.isEmpty)(value)) {
    return;
  }
  return value;
};
const getClosedInfoForUpdate = ({
  user,
  status,
  closedDate
}) => {
  if (status && status === _api.CaseStatuses.closed) {
    return {
      closed_at: closedDate,
      closed_by: user
    };
  }
  if (status && (status === _api.CaseStatuses.open || status === _api.CaseStatuses['in-progress'])) {
    return {
      closed_at: null,
      closed_by: null
    };
  }
};
exports.getClosedInfoForUpdate = getClosedInfoForUpdate;
const getDurationInSeconds = ({
  closedAt,
  createdAt
}) => {
  try {
    if (createdAt != null && closedAt != null) {
      const createdAtMillis = new Date(createdAt).getTime();
      const closedAtMillis = new Date(closedAt).getTime();
      if (!isNaN(createdAtMillis) && !isNaN(closedAtMillis) && closedAtMillis >= createdAtMillis) {
        return {
          duration: Math.floor((closedAtMillis - createdAtMillis) / 1000)
        };
      }
    }
  } catch (err) {
    // Silence date errors
  }
};
exports.getDurationInSeconds = getDurationInSeconds;
const getDurationForUpdate = ({
  status,
  closedAt,
  createdAt
}) => {
  if (status && status === _api.CaseStatuses.closed) {
    return getDurationInSeconds({
      createdAt,
      closedAt
    });
  }
  if (status && (status === _api.CaseStatuses.open || status === _api.CaseStatuses['in-progress'])) {
    return {
      duration: null
    };
  }
};
exports.getDurationForUpdate = getDurationForUpdate;