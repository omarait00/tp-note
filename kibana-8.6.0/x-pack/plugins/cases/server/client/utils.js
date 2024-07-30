"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineAuthorizedAndOwnerFilter = exports.buildRangeFilter = exports.buildNestedFilter = exports.buildFilter = exports.buildAssigneesFilter = exports.arraysDifference = exports.addStatusFilter = exports.addSeverityFilter = void 0;
exports.combineFilters = combineFilters;
exports.sortToSnake = exports.getCaseToUpdate = exports.getAlertIds = exports.decodeCommentRequest = exports.constructQueryOptions = void 0;
exports.stringToKueryNode = stringToKueryNode;
var _boom = require("@hapi/boom");
var _lodash = require("lodash");
var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
var _pipeable = require("fp-ts/lib/pipeable");
var _esQuery = require("@kbn/es-query");
var _attachments = require("../../common/utils/attachments");
var _constants = require("../../common/constants");
var _api = require("../../common/api");
var _utils = require("../authorization/utils");
var _utils2 = require("../common/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const decodeCommentRequest = comment => {
  if ((0, _utils2.isCommentRequestTypeUser)(comment)) {
    (0, _pipeable.pipe)((0, _api.excess)(_api.ContextTypeUserRt).decode(comment), (0, _Either.fold)((0, _api.throwErrors)(_boom.badRequest), _function.identity));
  } else if ((0, _utils2.isCommentRequestTypeActions)(comment)) {
    (0, _pipeable.pipe)((0, _api.excess)(_api.ActionsCommentRequestRt).decode(comment), (0, _Either.fold)((0, _api.throwErrors)(_boom.badRequest), _function.identity));
  } else if ((0, _utils2.isCommentRequestTypeAlert)(comment)) {
    (0, _pipeable.pipe)((0, _api.excess)(_api.AlertCommentRequestRt).decode(comment), (0, _Either.fold)((0, _api.throwErrors)(_boom.badRequest), _function.identity));
    const {
      ids,
      indices
    } = (0, _utils2.getIDsAndIndicesAsArrays)(comment);

    /**
     * The alertId and index field must either be both of type string or they must both be string[] and be the same length.
     * Having a one-to-one relationship between the id and index of an alert avoids accidentally updating or
     * retrieving the wrong alert. Elasticsearch only guarantees that the _id (the field we use for alertId) to be
     * unique within a single index. So if we attempt to update or get a specific alert across multiple indices we could
     * update or receive the wrong one.
     *
     * Consider the situation where we have a alert1 with _id = '100' in index 'my-index-awesome' and also in index
     *  'my-index-hi'.
     * If we attempt to update the status of alert1 using an index pattern like `my-index-*` or even providing multiple
     * indices, there's a chance we'll accidentally update too many alerts.
     *
     * This check doesn't enforce that the API request has the correct alert ID to index relationship it just guards
     * against accidentally making a request like:
     * {
     *  alertId: [1,2,3],
     *  index: awesome,
     * }
     *
     * Instead this requires the requestor to provide:
     * {
     *  alertId: [1,2,3],
     *  index: [awesome, awesome, awesome]
     * }
     *
     * Ideally we'd change the format of the comment request to be an array of objects like:
     * {
     *  alerts: [{id: 1, index: awesome}, {id: 2, index: awesome}]
     * }
     *
     * But we'd need to also implement a migration because the saved object document currently stores the id and index
     * in separate fields.
     */
    if (ids.length !== indices.length) {
      throw (0, _boom.badRequest)(`Received an alert comment with ids and indices arrays of different lengths ids: ${JSON.stringify(ids)} indices: ${JSON.stringify(indices)}`);
    }
  } else if ((0, _attachments.isCommentRequestTypeExternalReference)(comment)) {
    decodeExternalReferenceAttachment(comment);
  } else if ((0, _attachments.isCommentRequestTypePersistableState)(comment)) {
    (0, _pipeable.pipe)((0, _api.excess)(_api.PersistableStateAttachmentRt).decode(comment), (0, _Either.fold)((0, _api.throwErrors)(_boom.badRequest), _function.identity));
  } else {
    /**
     * This assertion ensures that TS will show an error
     * when we add a new attachment type. This way, we rely on TS
     * to remind us that we have to do a check for the new attachment.
     */
    (0, _utils2.assertUnreachable)(comment);
  }
};
exports.decodeCommentRequest = decodeCommentRequest;
const decodeExternalReferenceAttachment = attachment => {
  if (attachment.externalReferenceStorage.type === _api.ExternalReferenceStorageType.savedObject) {
    (0, _pipeable.pipe)((0, _api.excess)(_api.ExternalReferenceSORt).decode(attachment), (0, _Either.fold)((0, _api.throwErrors)(_boom.badRequest), _function.identity));
  } else {
    (0, _pipeable.pipe)((0, _api.excess)(_api.ExternalReferenceNoSORt).decode(attachment), (0, _Either.fold)((0, _api.throwErrors)(_boom.badRequest), _function.identity));
  }
};

/**
 * Return the alert IDs from the comment if it is an alert style comment. Otherwise return an empty array.
 */
const getAlertIds = comment => {
  if ((0, _utils2.isCommentRequestTypeAlert)(comment)) {
    return Array.isArray(comment.alertId) ? comment.alertId : [comment.alertId];
  }
  return [];
};
exports.getAlertIds = getAlertIds;
const addStatusFilter = ({
  status,
  appendFilter,
  type = _constants.CASE_SAVED_OBJECT
}) => {
  const filters = [];
  filters.push(_esQuery.nodeBuilder.is(`${type}.attributes.status`, status));
  if (appendFilter) {
    filters.push(appendFilter);
  }
  return filters.length > 1 ? _esQuery.nodeBuilder.and(filters) : filters[0];
};
exports.addStatusFilter = addStatusFilter;
const addSeverityFilter = ({
  severity,
  appendFilter,
  type = _constants.CASE_SAVED_OBJECT
}) => {
  const filters = [];
  filters.push(_esQuery.nodeBuilder.is(`${type}.attributes.severity`, severity));
  if (appendFilter) {
    filters.push(appendFilter);
  }
  return filters.length > 1 ? _esQuery.nodeBuilder.and(filters) : filters[0];
};
exports.addSeverityFilter = addSeverityFilter;
const buildFilter = ({
  filters,
  field,
  operator,
  type = _constants.CASE_SAVED_OBJECT
}) => {
  if (filters === undefined) {
    return;
  }
  const filtersAsArray = Array.isArray(filters) ? filters : [filters];
  if (filtersAsArray.length === 0) {
    return;
  }
  return _esQuery.nodeBuilder[operator](filtersAsArray.map(filter => _esQuery.nodeBuilder.is(`${(0, _esQuery.escapeKuery)(type)}.attributes.${(0, _esQuery.escapeKuery)(field)}`, (0, _esQuery.escapeKuery)(filter))));
};

/**
 * Creates a KueryNode filter for the Saved Object find API's filter field. This handles constructing a filter for
 * a nested field.
 *
 * @param filters is a string or array of strings that defines the values to search for
 * @param field is the location to search for
 * @param nestedField is the field in the saved object that has a type of 'nested'
 * @param operator whether to 'or'/'and' the created filters together
 * @type the type of saved object being searched
 * @returns a constructed KueryNode representing the filter or undefined if one could not be built
 */
exports.buildFilter = buildFilter;
const buildNestedFilter = ({
  filters,
  field,
  nestedField,
  operator,
  type = _constants.CASE_SAVED_OBJECT
}) => {
  if (filters === undefined) {
    return;
  }
  const filtersAsArray = Array.isArray(filters) ? filters : [filters];
  if (filtersAsArray.length === 0) {
    return;
  }
  return _esQuery.nodeBuilder[operator](filtersAsArray.map(filter => (0, _esQuery.fromKueryExpression)(`${(0, _esQuery.escapeKuery)(type)}.attributes.${(0, _esQuery.escapeKuery)(nestedField)}:{ ${(0, _esQuery.escapeKuery)(field)}: ${(0, _esQuery.escapeKuery)(filter)} }`)));
};

/**
 * Combines the authorized filters with the requested owners.
 */
exports.buildNestedFilter = buildNestedFilter;
const combineAuthorizedAndOwnerFilter = (owner, authorizationFilter, savedObjectType) => {
  const ownerFilter = buildFilter({
    filters: owner,
    field: _api.OWNER_FIELD,
    operator: 'or',
    type: savedObjectType
  });
  return (0, _utils.combineFilterWithAuthorizationFilter)(ownerFilter, authorizationFilter);
};

/**
 * Combines Kuery nodes and accepts an array with a mixture of undefined and KueryNodes. This will filter out the undefined
 * filters and return a KueryNode with the filters and'd together.
 */
exports.combineAuthorizedAndOwnerFilter = combineAuthorizedAndOwnerFilter;
function combineFilters(nodes) {
  const filters = nodes.filter(node => node !== undefined);
  if (filters.length <= 0) {
    return;
  }
  return _esQuery.nodeBuilder.and(filters);
}

/**
 * Creates a KueryNode from a string expression. Returns undefined if the expression is undefined.
 */
function stringToKueryNode(expression) {
  if (!expression) {
    return;
  }
  return (0, _esQuery.fromKueryExpression)(expression);
}
const buildRangeFilter = ({
  from,
  to,
  field = 'created_at',
  savedObjectType = _constants.CASE_SAVED_OBJECT
}) => {
  if (from == null && to == null) {
    return;
  }
  try {
    const fromKQL = from != null ? `${(0, _esQuery.escapeKuery)(savedObjectType)}.attributes.${(0, _esQuery.escapeKuery)(field)} >= ${(0, _esQuery.escapeKuery)(from)}` : undefined;
    const toKQL = to != null ? `${(0, _esQuery.escapeKuery)(savedObjectType)}.attributes.${(0, _esQuery.escapeKuery)(field)} <= ${(0, _esQuery.escapeKuery)(to)}` : undefined;
    const rangeKQLQuery = `${fromKQL != null ? fromKQL : ''} ${fromKQL != null && toKQL != null ? 'and' : ''} ${toKQL != null ? toKQL : ''}`;
    return stringToKueryNode(rangeKQLQuery);
  } catch (error) {
    throw (0, _boom.badRequest)('Invalid "from" and/or "to" query parameters');
  }
};
exports.buildRangeFilter = buildRangeFilter;
const buildAssigneesFilter = ({
  assignees
}) => {
  if (assignees === undefined) {
    return;
  }
  const assigneesAsArray = Array.isArray(assignees) ? assignees : [assignees];
  if (assigneesAsArray.length === 0) {
    return;
  }
  const assigneesWithoutNone = assigneesAsArray.filter(assignee => assignee !== _constants.NO_ASSIGNEES_FILTERING_KEYWORD);
  const hasNoneAssignee = assigneesAsArray.some(assignee => assignee === _constants.NO_ASSIGNEES_FILTERING_KEYWORD);
  const assigneesFilter = assigneesWithoutNone.map(filter => _esQuery.nodeBuilder.is(`${_constants.CASE_SAVED_OBJECT}.attributes.assignees.uid`, (0, _esQuery.escapeKuery)(filter)));
  if (!hasNoneAssignee) {
    return _esQuery.nodeBuilder.or(assigneesFilter);
  }
  const filterCasesWithoutAssigneesKueryNode = (0, _esQuery.fromKueryExpression)(`not ${_constants.CASE_SAVED_OBJECT}.attributes.assignees.uid: *`);
  return _esQuery.nodeBuilder.or([...assigneesFilter, filterCasesWithoutAssigneesKueryNode]);
};
exports.buildAssigneesFilter = buildAssigneesFilter;
const constructQueryOptions = ({
  tags,
  reporters,
  status,
  severity,
  sortByField,
  owner,
  authorizationFilter,
  from,
  to,
  assignees
}) => {
  const tagsFilter = buildFilter({
    filters: tags,
    field: 'tags',
    operator: 'or'
  });
  const reportersFilter = createReportersFilter(reporters);
  const sortField = sortToSnake(sortByField);
  const ownerFilter = buildFilter({
    filters: owner,
    field: _api.OWNER_FIELD,
    operator: 'or'
  });
  const statusFilter = status != null ? addStatusFilter({
    status
  }) : undefined;
  const severityFilter = severity != null ? addSeverityFilter({
    severity
  }) : undefined;
  const rangeFilter = buildRangeFilter({
    from,
    to
  });
  const assigneesFilter = buildAssigneesFilter({
    assignees
  });
  const filters = combineFilters([statusFilter, severityFilter, tagsFilter, reportersFilter, rangeFilter, ownerFilter, assigneesFilter]);
  return {
    filter: (0, _utils.combineFilterWithAuthorizationFilter)(filters, authorizationFilter),
    sortField
  };
};
exports.constructQueryOptions = constructQueryOptions;
const createReportersFilter = reporters => {
  const reportersFilter = buildFilter({
    filters: reporters,
    field: 'created_by.username',
    operator: 'or'
  });
  const reportersProfileUidFilter = buildFilter({
    filters: reporters,
    field: 'created_by.profile_uid',
    operator: 'or'
  });
  const filters = [reportersFilter, reportersProfileUidFilter].filter(filter => filter != null);
  if (filters.length <= 0) {
    return;
  }
  return _esQuery.nodeBuilder.or(filters);
};
const arraysDifference = (originalValue, updatedValue) => {
  if (originalValue != null && updatedValue != null && Array.isArray(updatedValue) && Array.isArray(originalValue)) {
    const addedItems = (0, _lodash.differenceWith)(updatedValue, originalValue, _lodash.isEqual);
    const deletedItems = (0, _lodash.differenceWith)(originalValue, updatedValue, _lodash.isEqual);
    if (addedItems.length > 0 || deletedItems.length > 0) {
      return {
        addedItems,
        deletedItems
      };
    }
  }
  return null;
};
exports.arraysDifference = arraysDifference;
const getCaseToUpdate = (currentCase, queryCase) => Object.entries(queryCase).reduce((acc, [key, value]) => {
  const currentValue = (0, _lodash.get)(currentCase, key);
  if (Array.isArray(currentValue) && Array.isArray(value)) {
    if (arraysDifference(value, currentValue)) {
      return {
        ...acc,
        [key]: value
      };
    }
    return acc;
  } else if ((0, _lodash.isPlainObject)(currentValue) && (0, _lodash.isPlainObject)(value)) {
    if (!(0, _fastDeepEqual.default)(currentValue, value)) {
      return {
        ...acc,
        [key]: value
      };
    }
    return acc;
  } else if (currentValue != null && value !== currentValue) {
    return {
      ...acc,
      [key]: value
    };
  }
  return acc;
}, {
  id: queryCase.id,
  version: queryCase.version
});
exports.getCaseToUpdate = getCaseToUpdate;
var SortFieldCase;
(function (SortFieldCase) {
  SortFieldCase["closedAt"] = "closed_at";
  SortFieldCase["createdAt"] = "created_at";
  SortFieldCase["status"] = "status";
})(SortFieldCase || (SortFieldCase = {}));
const sortToSnake = sortField => {
  switch (sortField) {
    case 'status':
      return SortFieldCase.status;
    case 'createdAt':
    case 'created_at':
      return SortFieldCase.createdAt;
    case 'closedAt':
    case 'closed_at':
      return SortFieldCase.closedAt;
    default:
      return SortFieldCase.createdAt;
  }
};
exports.sortToSnake = sortToSnake;