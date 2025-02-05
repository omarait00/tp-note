"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCasesByAlertID = exports.get = void 0;
exports.getReporters = getReporters;
exports.getTags = getTags;
exports.resolve = void 0;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
var _api = require("../../../common/api");
var _error = require("../../common/error");
var _utils = require("../../common/utils");
var _authorization = require("../../authorization");
var _utils2 = require("../utils");
var _services = require("../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Case Client wrapper function for retrieving the case IDs and titles that have a particular alert ID
 * attached to them. This handles RBAC before calling the saved object API.
 *
 * @ignore
 */
const getCasesByAlertID = async ({
  alertID,
  options
}, clientArgs) => {
  const {
    services: {
      caseService,
      attachmentService
    },
    logger,
    authorization,
    unsecuredSavedObjectsClient
  } = clientArgs;
  try {
    const queryParams = (0, _pipeable.pipe)((0, _api.excess)(_api.CasesByAlertIDRequestRt).decode(options), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      filter: authorizationFilter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.getCaseIDsByAlertID);
    const filter = (0, _utils2.combineAuthorizedAndOwnerFilter)(queryParams.owner, authorizationFilter, _authorization.Operations.getCaseIDsByAlertID.savedObjectType);

    // This will likely only return one comment saved object, the response aggregation will contain
    // the keys we need to retrieve the cases
    const commentsWithAlert = await caseService.getCaseIdsByAlertId({
      alertId: alertID,
      filter
    });

    // make sure the comments returned have the right owner
    ensureSavedObjectsAreAuthorized(commentsWithAlert.saved_objects.map(comment => ({
      owner: comment.attributes.owner,
      id: comment.id
    })));
    const caseIds = _services.CasesService.getCaseIDsFromAlertAggs(commentsWithAlert);

    // if we didn't find any case IDs then let's return early because there's nothing to request
    if (caseIds.length <= 0) {
      return [];
    }
    const commentStats = await attachmentService.getCaseCommentStats({
      unsecuredSavedObjectsClient,
      caseIds
    });
    const casesInfo = await caseService.getCases({
      caseIds
    });

    // if there was an error retrieving one of the cases (maybe it was deleted, but the alert comment still existed)
    // just ignore it
    const validCasesInfo = casesInfo.saved_objects.filter(caseInfo => caseInfo.error === undefined);
    ensureSavedObjectsAreAuthorized(validCasesInfo.map(caseInfo => ({
      owner: caseInfo.attributes.owner,
      id: caseInfo.id
    })));
    return _api.CasesByAlertIdRt.encode(validCasesInfo.map(caseInfo => ({
      id: caseInfo.id,
      title: caseInfo.attributes.title,
      description: caseInfo.attributes.description,
      status: caseInfo.attributes.status,
      createdAt: caseInfo.attributes.created_at,
      totals: getAttachmentTotalsForCaseId(caseInfo.id, commentStats)
    })));
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to get case IDs using alert ID: ${alertID} options: ${JSON.stringify(options)}: ${error}`,
      error,
      logger
    });
  }
};
exports.getCasesByAlertID = getCasesByAlertID;
const getAttachmentTotalsForCaseId = (id, stats) => {
  var _stats$get;
  return (_stats$get = stats.get(id)) !== null && _stats$get !== void 0 ? _stats$get : {
    alerts: 0,
    userComments: 0
  };
};

/**
 * The parameters for retrieving a case
 */

/**
 * Retrieves a case and optionally its comments.
 *
 * @ignore
 */
const get = async ({
  id,
  includeComments
}, clientArgs) => {
  const {
    services: {
      caseService
    },
    logger,
    authorization
  } = clientArgs;
  try {
    const theCase = await caseService.getCase({
      id
    });
    await authorization.ensureAuthorized({
      operation: _authorization.Operations.getCase,
      entities: [{
        owner: theCase.attributes.owner,
        id: theCase.id
      }]
    });
    if (!includeComments) {
      return _api.CaseResponseRt.encode((0, _utils.flattenCaseSavedObject)({
        savedObject: theCase
      }));
    }
    const theComments = await caseService.getAllCaseComments({
      id,
      options: {
        sortField: 'created_at',
        sortOrder: 'asc'
      }
    });
    return _api.CaseResponseRt.encode((0, _utils.flattenCaseSavedObject)({
      savedObject: theCase,
      comments: theComments.saved_objects,
      totalComment: theComments.total,
      totalAlerts: (0, _utils.countAlertsForID)({
        comments: theComments,
        id
      })
    }));
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to get case id: ${id}: ${error}`,
      error,
      logger
    });
  }
};

/**
 * Retrieves a case resolving its ID and optionally loading its comments.
 *
 * @experimental
 */
exports.get = get;
const resolve = async ({
  id,
  includeComments
}, clientArgs) => {
  const {
    services: {
      caseService
    },
    logger,
    authorization
  } = clientArgs;
  try {
    const {
      saved_object: resolvedSavedObject,
      ...resolveData
    } = await caseService.getResolveCase({
      id
    });
    await authorization.ensureAuthorized({
      operation: _authorization.Operations.resolveCase,
      entities: [{
        id: resolvedSavedObject.id,
        owner: resolvedSavedObject.attributes.owner
      }]
    });
    if (!includeComments) {
      return _api.CaseResolveResponseRt.encode({
        ...resolveData,
        case: (0, _utils.flattenCaseSavedObject)({
          savedObject: resolvedSavedObject
        })
      });
    }
    const theComments = await caseService.getAllCaseComments({
      id: resolvedSavedObject.id,
      options: {
        sortField: 'created_at',
        sortOrder: 'asc'
      }
    });
    return _api.CaseResolveResponseRt.encode({
      ...resolveData,
      case: (0, _utils.flattenCaseSavedObject)({
        savedObject: resolvedSavedObject,
        comments: theComments.saved_objects,
        totalComment: theComments.total,
        totalAlerts: (0, _utils.countAlertsForID)({
          comments: theComments,
          id: resolvedSavedObject.id
        })
      })
    });
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to resolve case id: ${id}: ${error}`,
      error,
      logger
    });
  }
};

/**
 * Retrieves the tags from all the cases.
 */
exports.resolve = resolve;
async function getTags(params, clientArgs) {
  const {
    unsecuredSavedObjectsClient,
    services: {
      caseService
    },
    logger,
    authorization
  } = clientArgs;
  try {
    const queryParams = (0, _pipeable.pipe)((0, _api.excess)(_api.AllTagsFindRequestRt).decode(params), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      filter: authorizationFilter
    } = await authorization.getAuthorizationFilter(_authorization.Operations.findCases);
    const filter = (0, _utils2.combineAuthorizedAndOwnerFilter)(queryParams.owner, authorizationFilter);
    const tags = await caseService.getTags({
      unsecuredSavedObjectsClient,
      filter
    });
    return tags;
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to get tags: ${error}`,
      error,
      logger
    });
  }
}

/**
 * Retrieves the reporters from all the cases.
 */
async function getReporters(params, clientArgs) {
  const {
    unsecuredSavedObjectsClient,
    services: {
      caseService
    },
    logger,
    authorization
  } = clientArgs;
  try {
    const queryParams = (0, _pipeable.pipe)((0, _api.excess)(_api.AllReportersFindRequestRt).decode(params), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      filter: authorizationFilter
    } = await authorization.getAuthorizationFilter(_authorization.Operations.getReporters);
    const filter = (0, _utils2.combineAuthorizedAndOwnerFilter)(queryParams.owner, authorizationFilter);
    const reporters = await caseService.getReporters({
      unsecuredSavedObjectsClient,
      filter
    });
    return reporters;
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to get reporters: ${error}`,
      error,
      logger
    });
  }
}