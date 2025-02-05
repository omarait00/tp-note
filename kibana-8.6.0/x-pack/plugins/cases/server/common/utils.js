"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.countAlertsForID = exports.countAlerts = exports.assertUnreachable = exports.asArray = void 0;
exports.createAlertUpdateRequest = createAlertUpdateRequest;
exports.transformNewComment = exports.transformNewCase = exports.transformComments = exports.transformCases = exports.nullUser = exports.isCommentRequestTypeUser = exports.isCommentRequestTypeExternalReferenceSO = exports.isCommentRequestTypeAlert = exports.isCommentRequestTypeActions = exports.groupTotalAlertsByID = exports.getOrUpdateLensReferences = exports.getNoneCaseConnector = exports.getIDsAndIndicesAsArrays = exports.getCaseViewPath = exports.getApplicationRoute = exports.getAlertInfoFromComments = exports.flattenCommentSavedObjects = exports.flattenCommentSavedObject = exports.flattenCaseSavedObject = exports.extractLensReferencesFromCommentString = exports.defaultSortField = void 0;
var _lodash = require("lodash");
var _common = require("../../../spaces/common");
var _owner = require("../../common/utils/owner");
var _constants = require("../../common/constants");
var _api = require("../../common/api");
var _utils = require("../../common/utils/markdown_plugins/utils");
var _utils2 = require("../client/cases/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Default sort field for querying saved objects.
 */
const defaultSortField = 'created_at';

/**
 * Default unknown user
 */
exports.defaultSortField = defaultSortField;
const nullUser = {
  username: null,
  full_name: null,
  email: null
};
exports.nullUser = nullUser;
const transformNewCase = ({
  user,
  newCase
}) => {
  var _newCase$severity, _dedupAssignees;
  return {
    ...newCase,
    duration: null,
    severity: (_newCase$severity = newCase.severity) !== null && _newCase$severity !== void 0 ? _newCase$severity : _api.CaseSeverity.LOW,
    closed_at: null,
    closed_by: null,
    created_at: new Date().toISOString(),
    created_by: user,
    external_service: null,
    status: _api.CaseStatuses.open,
    updated_at: null,
    updated_by: null,
    assignees: (_dedupAssignees = (0, _utils2.dedupAssignees)(newCase.assignees)) !== null && _dedupAssignees !== void 0 ? _dedupAssignees : []
  };
};
exports.transformNewCase = transformNewCase;
const transformCases = ({
  casesMap,
  countOpenCases,
  countInProgressCases,
  countClosedCases,
  page,
  perPage,
  total
}) => ({
  page,
  per_page: perPage,
  total,
  cases: Array.from(casesMap.values()),
  count_open_cases: countOpenCases,
  count_in_progress_cases: countInProgressCases,
  count_closed_cases: countClosedCases
});
exports.transformCases = transformCases;
const flattenCaseSavedObject = ({
  savedObject,
  comments = [],
  totalComment = comments.length,
  totalAlerts = 0
}) => {
  var _savedObject$version;
  return {
    id: savedObject.id,
    version: (_savedObject$version = savedObject.version) !== null && _savedObject$version !== void 0 ? _savedObject$version : '0',
    comments: flattenCommentSavedObjects(comments),
    totalComment,
    totalAlerts,
    ...savedObject.attributes
  };
};
exports.flattenCaseSavedObject = flattenCaseSavedObject;
const transformComments = comments => ({
  page: comments.page,
  per_page: comments.per_page,
  total: comments.total,
  comments: flattenCommentSavedObjects(comments.saved_objects)
});
exports.transformComments = transformComments;
const flattenCommentSavedObjects = savedObjects => savedObjects.reduce((acc, savedObject) => {
  return [...acc, flattenCommentSavedObject(savedObject)];
}, []);
exports.flattenCommentSavedObjects = flattenCommentSavedObjects;
const flattenCommentSavedObject = savedObject => {
  var _savedObject$version2;
  return {
    id: savedObject.id,
    version: (_savedObject$version2 = savedObject.version) !== null && _savedObject$version2 !== void 0 ? _savedObject$version2 : '0',
    ...savedObject.attributes
  };
};
exports.flattenCommentSavedObject = flattenCommentSavedObject;
const getIDsAndIndicesAsArrays = comment => {
  return {
    ids: Array.isArray(comment.alertId) ? comment.alertId : [comment.alertId],
    indices: Array.isArray(comment.index) ? comment.index : [comment.index]
  };
};

/**
 * This functions extracts the ids and indices from an alert comment. It enforces that the alertId and index are either
 * both strings or string arrays that are the same length. If they are arrays they represent a 1-to-1 mapping of
 * id existing in an index at each position in the array. This is not ideal. Ideally an alert comment request would
 * accept an array of objects like this: Array<{id: string; index: string; ruleName: string ruleID: string}> instead.
 *
 * To reformat the alert comment request requires a migration and a breaking API change.
 */
exports.getIDsAndIndicesAsArrays = getIDsAndIndicesAsArrays;
const getAndValidateAlertInfoFromComment = comment => {
  if (!isCommentRequestTypeAlert(comment)) {
    return [];
  }
  const {
    ids,
    indices
  } = getIDsAndIndicesAsArrays(comment);
  if (ids.length !== indices.length) {
    return [];
  }
  return ids.map((id, index) => ({
    id,
    index: indices[index]
  }));
};

/**
 * Builds an AlertInfo object accumulating the alert IDs and indices for the passed in alerts.
 */
const getAlertInfoFromComments = (comments = []) => comments.reduce((acc, comment) => {
  const alertInfo = getAndValidateAlertInfoFromComment(comment);
  acc.push(...alertInfo);
  return acc;
}, []);
exports.getAlertInfoFromComments = getAlertInfoFromComments;
const transformNewComment = ({
  createdDate,
  email,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  full_name,
  username,
  profile_uid: profileUid,
  ...comment
}) => {
  return {
    ...comment,
    created_at: createdDate,
    created_by: {
      email,
      full_name,
      username,
      profile_uid: profileUid
    },
    pushed_at: null,
    pushed_by: null,
    updated_at: null,
    updated_by: null
  };
};

/**
 * A type narrowing function for user comments.
 */
exports.transformNewComment = transformNewComment;
const isCommentRequestTypeUser = context => {
  return context.type === _api.CommentType.user;
};

/**
 * A type narrowing function for actions comments.
 */
exports.isCommentRequestTypeUser = isCommentRequestTypeUser;
const isCommentRequestTypeActions = context => {
  return context.type === _api.CommentType.actions;
};

/**
 * A type narrowing function for alert comments.
 */
exports.isCommentRequestTypeActions = isCommentRequestTypeActions;
const isCommentRequestTypeAlert = context => {
  return context.type === _api.CommentType.alert;
};

/**
 * A type narrowing function for external reference so attachments.
 */
exports.isCommentRequestTypeAlert = isCommentRequestTypeAlert;
const isCommentRequestTypeExternalReferenceSO = context => {
  var _context$externalRefe;
  return context.type === _api.CommentType.externalReference && ((_context$externalRefe = context.externalReferenceStorage) === null || _context$externalRefe === void 0 ? void 0 : _context$externalRefe.type) === _api.ExternalReferenceStorageType.savedObject;
};

/**
 * Adds the ids and indices to a map of statuses
 */
exports.isCommentRequestTypeExternalReferenceSO = isCommentRequestTypeExternalReferenceSO;
function createAlertUpdateRequest({
  comment,
  status
}) {
  return getAlertInfoFromComments([comment]).map(alert => ({
    ...alert,
    status
  }));
}

/**
 * Counts the total alert IDs within a single comment.
 */
const countAlerts = comment => {
  let totalAlerts = 0;
  if (comment.attributes.type === _api.CommentType.alert) {
    if (Array.isArray(comment.attributes.alertId)) {
      totalAlerts += comment.attributes.alertId.length;
    } else {
      totalAlerts++;
    }
  }
  return totalAlerts;
};

/**
 * Count the number of alerts for each id in the alert's references.
 */
exports.countAlerts = countAlerts;
const groupTotalAlertsByID = ({
  comments
}) => {
  return comments.saved_objects.reduce((acc, alertsInfo) => {
    const alertTotalForComment = countAlerts(alertsInfo);
    for (const alert of alertsInfo.references) {
      if (alert.id) {
        const totalAlerts = acc.get(alert.id);
        if (totalAlerts !== undefined) {
          acc.set(alert.id, totalAlerts + alertTotalForComment);
        } else {
          acc.set(alert.id, alertTotalForComment);
        }
      }
    }
    return acc;
  }, new Map());
};

/**
 * Counts the total alert IDs for a single case.
 */
exports.groupTotalAlertsByID = groupTotalAlertsByID;
const countAlertsForID = ({
  comments,
  id
}) => {
  return groupTotalAlertsByID({
    comments
  }).get(id);
};

/**
 * Returns a connector that indicates that no connector was set.
 *
 * @returns the 'none' connector
 */
exports.countAlertsForID = countAlertsForID;
const getNoneCaseConnector = () => ({
  id: 'none',
  name: 'none',
  type: _api.ConnectorTypes.none,
  fields: null
});
exports.getNoneCaseConnector = getNoneCaseConnector;
const extractLensReferencesFromCommentString = (lensEmbeddableFactory, comment) => {
  var _lensEmbeddableFactor;
  const extract = (_lensEmbeddableFactor = lensEmbeddableFactory()) === null || _lensEmbeddableFactor === void 0 ? void 0 : _lensEmbeddableFactor.extract;
  if (extract) {
    const parsedComment = (0, _utils.parseCommentString)(comment);
    const lensVisualizations = (0, _utils.getLensVisualizations)(parsedComment.children);
    const flattenRefs = (0, _lodash.flatMap)(lensVisualizations, lensObject => {
      var _extract$references, _extract;
      return (_extract$references = (_extract = extract(lensObject)) === null || _extract === void 0 ? void 0 : _extract.references) !== null && _extract$references !== void 0 ? _extract$references : [];
    });
    const uniqRefs = (0, _lodash.uniqWith)(flattenRefs, (refA, refB) => refA.type === refB.type && refA.id === refB.id && refA.name === refB.name);
    return uniqRefs;
  }
  return [];
};
exports.extractLensReferencesFromCommentString = extractLensReferencesFromCommentString;
const getOrUpdateLensReferences = (lensEmbeddableFactory, newComment, currentComment) => {
  if (!currentComment) {
    return extractLensReferencesFromCommentString(lensEmbeddableFactory, newComment);
  }
  const savedObjectReferences = currentComment.references;
  const savedObjectLensReferences = extractLensReferencesFromCommentString(lensEmbeddableFactory, currentComment.attributes.comment);
  const currentNonLensReferences = (0, _lodash.xorWith)(savedObjectReferences, savedObjectLensReferences, (refA, refB) => refA.type === refB.type && refA.id === refB.id);
  const newCommentLensReferences = extractLensReferencesFromCommentString(lensEmbeddableFactory, newComment);
  return currentNonLensReferences.concat(newCommentLensReferences);
};
exports.getOrUpdateLensReferences = getOrUpdateLensReferences;
const asArray = field => {
  if (field === undefined || field === null) {
    return [];
  }
  return Array.isArray(field) ? field : [field];
};
exports.asArray = asArray;
const assertUnreachable = x => {
  throw new Error('You should not reach this part of code');
};
exports.assertUnreachable = assertUnreachable;
const getApplicationRoute = (appRouteInfo, owner) => {
  const appRoute = (0, _owner.isValidOwner)(owner) ? appRouteInfo[owner].appRoute : _constants.OWNER_INFO[_constants.GENERAL_CASES_OWNER].appRoute;
  return appRoute.startsWith('/') ? appRoute : `/${appRoute}`;
};
exports.getApplicationRoute = getApplicationRoute;
const getCaseViewPath = params => {
  const normalizePath = path => path.replaceAll('//', '/');
  const removeEndingSlash = path => path.endsWith('/') ? path.slice(0, -1) : path;
  const {
    publicBaseUrl,
    caseId,
    owner,
    commentId,
    tabId,
    spaceId
  } = params;
  const publicBaseUrlWithoutEndingSlash = removeEndingSlash(publicBaseUrl);
  const publicBaseUrlWithSpace = (0, _common.addSpaceIdToPath)(publicBaseUrlWithoutEndingSlash, spaceId);
  const appRoute = getApplicationRoute(_constants.OWNER_INFO, owner);
  const basePath = `${publicBaseUrlWithSpace}${appRoute}/cases`;
  if (commentId) {
    const commentPath = normalizePath(_constants.CASE_VIEW_COMMENT_PATH.replace(':detailName', caseId).replace(':commentId', commentId));
    return `${basePath}${commentPath}`;
  }
  if (tabId) {
    const tabPath = normalizePath(_constants.CASE_VIEW_TAB_PATH.replace(':detailName', caseId).replace(':tabId', tabId));
    return `${basePath}${tabPath}`;
  }
  return `${basePath}${normalizePath(_constants.CASE_VIEW_PATH.replace(':detailName', caseId))}`;
};
exports.getCaseViewPath = getCaseViewPath;