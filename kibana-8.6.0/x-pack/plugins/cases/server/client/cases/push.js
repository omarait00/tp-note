"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.push = void 0;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _esQuery = require("@kbn/es-query");
var _api = require("../../../common/api");
var _constants = require("../../../common/constants");
var _utils = require("./utils");
var _error = require("../../common/error");
var _utils2 = require("../../common/utils");
var _authorization = require("../../authorization");
var _connectors = require("../../connectors");
var _get = require("../alerts/get");
var _utils3 = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns true if the case should be closed based on the configuration settings.
 */
function shouldCloseByPush(configureSettings) {
  return configureSettings.total > 0 && configureSettings.saved_objects[0].attributes.closure_type === 'close-by-pushing';
}
const changeAlertsStatusToClose = async (caseId, caseService, alertsService) => {
  const alertAttachments = await caseService.getAllCaseComments({
    id: [caseId],
    options: {
      filter: _esQuery.nodeBuilder.is(`${_constants.CASE_COMMENT_SAVED_OBJECT}.attributes.type`, _api.CommentType.alert)
    }
  });
  const alerts = alertAttachments.saved_objects.map(attachment => (0, _utils2.createAlertUpdateRequest)({
    comment: attachment.attributes,
    status: _api.CaseStatuses.closed
  })).flat();
  await alertsService.updateAlertsStatus(alerts);
};

/**
 * Parameters for pushing a case to an external system
 */

/**
 * Push a case to an external service.
 *
 * @ignore
 */
const push = async ({
  connectorId,
  caseId
}, clientArgs, casesClient, casesClientInternal) => {
  const {
    unsecuredSavedObjectsClient,
    services: {
      attachmentService,
      caseService,
      caseConfigureService,
      userActionService,
      alertsService
    },
    actionsClient,
    user,
    logger,
    authorization,
    securityStartPlugin,
    spaceId,
    publicBaseUrl
  } = clientArgs;
  try {
    var _connector$id, _theCase$totalComment;
    /* Start of push to external service */
    const [theCase, connector, userActions] = await Promise.all([casesClient.cases.get({
      id: caseId,
      includeComments: true
    }), actionsClient.get({
      id: connectorId
    }), casesClient.userActions.getAll({
      caseId
    })]);
    await authorization.ensureAuthorized({
      entities: [{
        owner: theCase.owner,
        id: caseId
      }],
      operation: _authorization.Operations.pushCase
    });
    if ((theCase === null || theCase === void 0 ? void 0 : theCase.status) === _api.CaseStatuses.closed) {
      throw _boom.default.conflict(`The ${theCase.title} case is closed. Pushing a closed case is not allowed.`);
    }
    const alertsInfo = (0, _utils2.getAlertInfoFromComments)(theCase === null || theCase === void 0 ? void 0 : theCase.comments);
    const alerts = await (0, _get.getAlerts)(alertsInfo, clientArgs);
    const profiles = await getProfiles(theCase, securityStartPlugin);
    const externalServiceIncident = await (0, _utils.createIncident)({
      theCase,
      userActions,
      connector: connector,
      alerts,
      casesConnectors: _connectors.casesConnectors,
      userProfiles: profiles,
      spaceId,
      publicBaseUrl
    });
    const pushRes = await actionsClient.execute({
      actionId: (_connector$id = connector === null || connector === void 0 ? void 0 : connector.id) !== null && _connector$id !== void 0 ? _connector$id : '',
      params: {
        subAction: 'pushToService',
        subActionParams: externalServiceIncident
      }
    });
    if (pushRes.status === 'error') {
      var _ref, _pushRes$serviceMessa;
      throw _boom.default.failedDependency((_ref = (_pushRes$serviceMessa = pushRes.serviceMessage) !== null && _pushRes$serviceMessa !== void 0 ? _pushRes$serviceMessa : pushRes.message) !== null && _ref !== void 0 ? _ref : 'Error pushing to service');
    }

    /* End of push to external service */

    const ownerFilter = (0, _utils3.buildFilter)({
      filters: theCase.owner,
      field: _api.OWNER_FIELD,
      operator: 'or',
      type: _authorization.Operations.findConfigurations.savedObjectType
    });

    /* Start of update case with push information */
    const [myCase, myCaseConfigure, comments] = await Promise.all([caseService.getCase({
      id: caseId
    }), caseConfigureService.find({
      unsecuredSavedObjectsClient,
      options: {
        filter: ownerFilter
      }
    }), caseService.getAllCaseComments({
      id: caseId,
      options: {
        fields: [],
        page: 1,
        perPage: (_theCase$totalComment = theCase === null || theCase === void 0 ? void 0 : theCase.totalComment) !== null && _theCase$totalComment !== void 0 ? _theCase$totalComment : 0
      }
    })]);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      username,
      full_name,
      email,
      profile_uid
    } = user;
    const pushedDate = new Date().toISOString();
    const externalServiceResponse = pushRes.data;
    const externalService = {
      pushed_at: pushedDate,
      pushed_by: {
        username,
        full_name,
        email,
        profile_uid
      },
      connector_id: connector.id,
      connector_name: connector.name,
      external_id: externalServiceResponse.id,
      external_title: externalServiceResponse.title,
      external_url: externalServiceResponse.url
    };
    const shouldMarkAsClosed = shouldCloseByPush(myCaseConfigure);
    const [updatedCase, updatedComments] = await Promise.all([caseService.patchCase({
      originalCase: myCase,
      caseId,
      updatedAttributes: {
        ...(shouldMarkAsClosed ? {
          status: _api.CaseStatuses.closed,
          closed_at: pushedDate,
          closed_by: {
            email,
            full_name,
            username,
            profile_uid
          }
        } : {}),
        ...(shouldMarkAsClosed ? (0, _utils.getDurationInSeconds)({
          closedAt: pushedDate,
          createdAt: theCase.created_at
        }) : {}),
        external_service: externalService,
        updated_at: pushedDate,
        updated_by: {
          username,
          full_name,
          email,
          profile_uid
        }
      },
      version: myCase.version,
      refresh: false
    }), attachmentService.bulkUpdate({
      unsecuredSavedObjectsClient,
      comments: comments.saved_objects.filter(comment => comment.attributes.pushed_at == null).map(comment => ({
        attachmentId: comment.id,
        updatedAttributes: {
          pushed_at: pushedDate,
          pushed_by: {
            username,
            full_name,
            email,
            profile_uid
          }
        },
        version: comment.version
      })),
      refresh: false
    })]);
    if (shouldMarkAsClosed) {
      await userActionService.createUserAction({
        type: _api.ActionTypes.status,
        unsecuredSavedObjectsClient,
        payload: {
          status: _api.CaseStatuses.closed
        },
        user,
        caseId,
        owner: myCase.attributes.owner,
        refresh: false
      });
      if (myCase.attributes.settings.syncAlerts) {
        await changeAlertsStatusToClose(myCase.id, caseService, alertsService);
      }
    }
    await userActionService.createUserAction({
      type: _api.ActionTypes.pushed,
      unsecuredSavedObjectsClient,
      payload: {
        externalService
      },
      user,
      caseId,
      owner: myCase.attributes.owner
    });

    /* End of update case with push information */

    return _api.CaseResponseRt.encode((0, _utils2.flattenCaseSavedObject)({
      savedObject: {
        ...myCase,
        ...updatedCase,
        attributes: {
          ...myCase.attributes,
          ...(updatedCase === null || updatedCase === void 0 ? void 0 : updatedCase.attributes)
        },
        references: myCase.references
      },
      comments: comments.saved_objects.map(origComment => {
        var _updatedComment$versi, _origComment$referenc;
        const updatedComment = updatedComments.saved_objects.find(c => c.id === origComment.id);
        return {
          ...origComment,
          ...updatedComment,
          attributes: {
            ...origComment.attributes,
            ...(updatedComment === null || updatedComment === void 0 ? void 0 : updatedComment.attributes)
          },
          version: (_updatedComment$versi = updatedComment === null || updatedComment === void 0 ? void 0 : updatedComment.version) !== null && _updatedComment$versi !== void 0 ? _updatedComment$versi : origComment.version,
          references: (_origComment$referenc = origComment === null || origComment === void 0 ? void 0 : origComment.references) !== null && _origComment$referenc !== void 0 ? _origComment$referenc : []
        };
      })
    }));
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to push case: ${error}`,
      error,
      logger
    });
  }
};
exports.push = push;
const getProfiles = async (caseInfo, securityStartPlugin) => {
  var _caseInfo$updated_by, _caseInfo$created_by, _await$securityStartP;
  const uids = new Set([...(((_caseInfo$updated_by = caseInfo.updated_by) === null || _caseInfo$updated_by === void 0 ? void 0 : _caseInfo$updated_by.profile_uid) != null ? [caseInfo.updated_by.profile_uid] : []), ...(((_caseInfo$created_by = caseInfo.created_by) === null || _caseInfo$created_by === void 0 ? void 0 : _caseInfo$created_by.profile_uid) != null ? [caseInfo.created_by.profile_uid] : [])]);
  if (uids.size <= 0) {
    return;
  }
  const userProfiles = (_await$securityStartP = await securityStartPlugin.userProfiles.bulkGet({
    uids
  })) !== null && _await$securityStartP !== void 0 ? _await$securityStartP : [];
  return userProfiles.reduce((acc, profile) => {
    acc.set(profile.uid, profile);
    return acc;
  }, new Map());
};