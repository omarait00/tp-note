"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseUserActionService = void 0;
exports.transformFindResponseToExternalModel = transformFindResponseToExternalModel;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _attachments = require("../../../common/utils/attachments");
var _user_actions = require("../../../common/utils/user_actions");
var _api = require("../../../common/api");
var _constants = require("../../../common/constants");
var _constants2 = require("../../common/constants");
var _transform = require("../transform");
var _utils = require("../../client/utils");
var _builder_factory = require("./builder_factory");
var _utils2 = require("../../common/utils");
var _so_references = require("../../attachment_framework/so_references");
var _type_guards = require("./type_guards");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class CaseUserActionService {
  constructor(log, persistableStateAttachmentTypeRegistry) {
    (0, _defineProperty2.default)(this, "builderFactory", void 0);
    this.log = log;
    this.persistableStateAttachmentTypeRegistry = persistableStateAttachmentTypeRegistry;
    this.builderFactory = new _builder_factory.BuilderFactory({
      persistableStateAttachmentTypeRegistry: this.persistableStateAttachmentTypeRegistry
    });
  }
  getUserActionItemByDifference(params) {
    const {
      field,
      originalValue,
      newValue,
      caseId,
      owner,
      user
    } = params;
    if (!CaseUserActionService.userActionFieldsAllowed.has(field)) {
      return [];
    } else if (field === _api.ActionTypes.assignees && (0, _type_guards.isAssigneesArray)(originalValue) && (0, _type_guards.isAssigneesArray)(newValue)) {
      return this.buildAssigneesUserActions({
        ...params,
        originalValue,
        newValue
      });
    } else if (field === _api.ActionTypes.tags && (0, _type_guards.isStringArray)(originalValue) && (0, _type_guards.isStringArray)(newValue)) {
      return this.buildTagsUserActions({
        ...params,
        originalValue,
        newValue
      });
    } else if ((0, _user_actions.isUserActionType)(field) && newValue != null) {
      const userActionBuilder = this.builderFactory.getBuilder(_api.ActionTypes[field]);
      const fieldUserAction = userActionBuilder === null || userActionBuilder === void 0 ? void 0 : userActionBuilder.build({
        caseId,
        owner,
        user,
        payload: {
          [field]: newValue
        }
      });
      return fieldUserAction ? [fieldUserAction] : [];
    }
    return [];
  }
  buildAssigneesUserActions(params) {
    const createPayload = items => ({
      assignees: items
    });
    return this.buildAddDeleteUserActions(params, createPayload, _api.ActionTypes.assignees);
  }
  buildTagsUserActions(params) {
    const createPayload = items => ({
      tags: items
    });
    return this.buildAddDeleteUserActions(params, createPayload, _api.ActionTypes.tags);
  }
  buildAddDeleteUserActions(params, createPayload, actionType) {
    const {
      originalValue,
      newValue
    } = params;
    const compareValues = (0, _utils.arraysDifference)(originalValue, newValue);
    const addUserAction = this.buildUserAction({
      commonArgs: params,
      actionType,
      action: _api.Actions.add,
      createPayload,
      modifiedItems: compareValues === null || compareValues === void 0 ? void 0 : compareValues.addedItems
    });
    const deleteUserAction = this.buildUserAction({
      commonArgs: params,
      actionType,
      action: _api.Actions.delete,
      createPayload,
      modifiedItems: compareValues === null || compareValues === void 0 ? void 0 : compareValues.deletedItems
    });
    return [...(addUserAction ? [addUserAction] : []), ...(deleteUserAction ? [deleteUserAction] : [])];
  }
  buildUserAction({
    commonArgs,
    actionType,
    action,
    createPayload,
    modifiedItems
  }) {
    const userActionBuilder = this.builderFactory.getBuilder(actionType);
    if (!userActionBuilder || !modifiedItems || modifiedItems.length <= 0) {
      return;
    }
    const {
      caseId,
      owner,
      user
    } = commonArgs;
    const userAction = userActionBuilder.build({
      action,
      caseId,
      user,
      owner,
      payload: createPayload(modifiedItems)
    });
    return userAction;
  }
  async bulkCreateCaseDeletion({
    unsecuredSavedObjectsClient,
    cases,
    user,
    refresh
  }) {
    this.log.debug(`Attempting to create a create case user action`);
    const userActionsWithReferences = cases.reduce((acc, caseInfo) => {
      const userActionBuilder = this.builderFactory.getBuilder(_api.ActionTypes.delete_case);
      const deleteCaseUserAction = userActionBuilder === null || userActionBuilder === void 0 ? void 0 : userActionBuilder.build({
        action: _api.Actions.delete,
        caseId: caseInfo.id,
        user,
        owner: caseInfo.owner,
        connectorId: caseInfo.connectorId,
        payload: {}
      });
      if (deleteCaseUserAction == null) {
        return acc;
      }
      return [...acc, deleteCaseUserAction];
    }, []);
    await this.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: userActionsWithReferences,
      refresh
    });
  }
  async bulkCreateUpdateCase({
    unsecuredSavedObjectsClient,
    originalCases,
    updatedCases,
    user,
    refresh
  }) {
    const userActionsWithReferences = updatedCases.reduce((acc, updatedCase) => {
      const originalCase = originalCases.find(({
        id
      }) => id === updatedCase.id);
      if (originalCase == null) {
        return acc;
      }
      const caseId = updatedCase.id;
      const owner = originalCase.attributes.owner;
      const userActions = [];
      const updatedFields = Object.keys(updatedCase.attributes);
      updatedFields.filter(field => CaseUserActionService.userActionFieldsAllowed.has(field)).forEach(field => {
        const originalValue = (0, _lodash.get)(originalCase, ['attributes', field]);
        const newValue = (0, _lodash.get)(updatedCase, ['attributes', field]);
        userActions.push(...this.getUserActionItemByDifference({
          unsecuredSavedObjectsClient,
          field,
          originalValue,
          newValue,
          user,
          owner,
          caseId
        }));
      });
      return [...acc, ...userActions];
    }, []);
    await this.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: userActionsWithReferences,
      refresh
    });
  }
  async bulkCreateAttachment({
    unsecuredSavedObjectsClient,
    caseId,
    attachments,
    user,
    action = _api.Actions.create,
    refresh
  }) {
    this.log.debug(`Attempting to create a bulk create case user action`);
    const userActionsWithReferences = attachments.reduce((acc, attachment) => {
      const userActionBuilder = this.builderFactory.getBuilder(_api.ActionTypes.comment);
      const commentUserAction = userActionBuilder === null || userActionBuilder === void 0 ? void 0 : userActionBuilder.build({
        action,
        caseId,
        user,
        owner: attachment.owner,
        attachmentId: attachment.id,
        payload: {
          attachment: attachment.attachment
        }
      });
      if (commentUserAction == null) {
        return acc;
      }
      return [...acc, commentUserAction];
    }, []);
    await this.bulkCreate({
      unsecuredSavedObjectsClient,
      actions: userActionsWithReferences,
      refresh
    });
  }
  async bulkCreateAttachmentDeletion({
    unsecuredSavedObjectsClient,
    caseId,
    attachments,
    user,
    refresh
  }) {
    await this.bulkCreateAttachment({
      unsecuredSavedObjectsClient,
      caseId,
      attachments,
      user,
      action: _api.Actions.delete,
      refresh
    });
  }
  async bulkCreateAttachmentCreation({
    unsecuredSavedObjectsClient,
    caseId,
    attachments,
    user,
    refresh
  }) {
    await this.bulkCreateAttachment({
      unsecuredSavedObjectsClient,
      caseId,
      attachments,
      user,
      action: _api.Actions.create,
      refresh
    });
  }
  async createUserAction({
    unsecuredSavedObjectsClient,
    action,
    type,
    caseId,
    user,
    owner,
    payload,
    connectorId,
    attachmentId,
    refresh
  }) {
    try {
      this.log.debug(`Attempting to create a user action of type: ${type}`);
      const userActionBuilder = this.builderFactory.getBuilder(type);
      const userAction = userActionBuilder === null || userActionBuilder === void 0 ? void 0 : userActionBuilder.build({
        action,
        caseId,
        user,
        owner,
        connectorId,
        attachmentId,
        payload
      });
      if (userAction) {
        const {
          attributes,
          references
        } = userAction;
        await this.create({
          unsecuredSavedObjectsClient,
          attributes,
          references,
          refresh
        });
      }
    } catch (error) {
      this.log.error(`Error on creating user action of type: ${type}. Error: ${error}`);
      throw error;
    }
  }
  async getAll({
    unsecuredSavedObjectsClient,
    caseId
  }) {
    try {
      const id = caseId;
      const type = _constants.CASE_SAVED_OBJECT;
      const userActions = await unsecuredSavedObjectsClient.find({
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT,
        hasReference: {
          type,
          id
        },
        page: 1,
        perPage: _constants.MAX_DOCS_PER_PAGE,
        sortField: 'created_at',
        sortOrder: 'asc'
      });
      return transformFindResponseToExternalModel(userActions, this.persistableStateAttachmentTypeRegistry);
    } catch (error) {
      this.log.error(`Error on GET case user action case id: ${caseId}: ${error}`);
      throw error;
    }
  }
  async create({
    unsecuredSavedObjectsClient,
    attributes,
    references,
    refresh
  }) {
    try {
      this.log.debug(`Attempting to POST a new case user action`);
      await unsecuredSavedObjectsClient.create(_constants.CASE_USER_ACTION_SAVED_OBJECT, attributes, {
        references: references !== null && references !== void 0 ? references : [],
        refresh
      });
    } catch (error) {
      this.log.error(`Error on POST a new case user action: ${error}`);
      throw error;
    }
  }
  async bulkCreate({
    unsecuredSavedObjectsClient,
    actions,
    refresh
  }) {
    if ((0, _lodash.isEmpty)(actions)) {
      return;
    }
    try {
      this.log.debug(`Attempting to POST a new case user action`);
      await unsecuredSavedObjectsClient.bulkCreate(actions.map(action => ({
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT,
        ...action
      })), {
        refresh
      });
    } catch (error) {
      this.log.error(`Error on POST a new case user action: ${error}`);
      throw error;
    }
  }
  async findStatusChanges({
    unsecuredSavedObjectsClient,
    caseId,
    filter
  }) {
    try {
      this.log.debug('Attempting to find status changes');
      const updateActionFilter = (0, _utils.buildFilter)({
        filters: _api.Actions.update,
        field: 'action',
        operator: 'or',
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT
      });
      const statusChangeFilter = (0, _utils.buildFilter)({
        filters: _api.ActionTypes.status,
        field: 'type',
        operator: 'or',
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT
      });
      const combinedFilters = (0, _utils.combineFilters)([updateActionFilter, statusChangeFilter, filter]);
      const finder = unsecuredSavedObjectsClient.createPointInTimeFinder({
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT,
        hasReference: {
          type: _constants.CASE_SAVED_OBJECT,
          id: caseId
        },
        sortField: _utils2.defaultSortField,
        sortOrder: 'asc',
        filter: combinedFilters,
        perPage: _constants.MAX_DOCS_PER_PAGE
      });
      let userActions = [];
      for await (const findResults of finder.find()) {
        userActions = userActions.concat(findResults.saved_objects.map(so => transformToExternalModel(so, this.persistableStateAttachmentTypeRegistry)));
      }
      return userActions;
    } catch (error) {
      this.log.error(`Error finding status changes: ${error}`);
      throw error;
    }
  }
  async getUniqueConnectors({
    caseId,
    filter,
    unsecuredSavedObjectsClient
  }) {
    try {
      var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4, _response$aggregation5, _response$aggregation6;
      this.log.debug(`Attempting to count connectors for case id ${caseId}`);
      const connectorsFilter = (0, _utils.buildFilter)({
        filters: [_api.ActionTypes.connector, _api.ActionTypes.create_case],
        field: 'type',
        operator: 'or',
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT
      });
      const combinedFilter = (0, _utils.combineFilters)([connectorsFilter, filter]);
      const response = await unsecuredSavedObjectsClient.find({
        type: _constants.CASE_USER_ACTION_SAVED_OBJECT,
        hasReference: {
          type: _constants.CASE_SAVED_OBJECT,
          id: caseId
        },
        page: 1,
        perPage: 1,
        sortField: _utils2.defaultSortField,
        aggs: this.buildCountConnectorsAggs(),
        filter: combinedFilter
      });
      return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : (_response$aggregation3 = _response$aggregation2.references) === null || _response$aggregation3 === void 0 ? void 0 : (_response$aggregation4 = _response$aggregation3.connectors) === null || _response$aggregation4 === void 0 ? void 0 : (_response$aggregation5 = _response$aggregation4.ids) === null || _response$aggregation5 === void 0 ? void 0 : (_response$aggregation6 = _response$aggregation5.buckets) === null || _response$aggregation6 === void 0 ? void 0 : _response$aggregation6.map(({
        key
      }) => ({
        id: key
      }))) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
    } catch (error) {
      this.log.error(`Error while counting connectors for case id ${caseId}: ${error}`);
      throw error;
    }
  }
  buildCountConnectorsAggs(
  /**
   * It is high unlikely for a user to have more than
   * 100 connectors attached to a case
   */
  size = 100) {
    return {
      references: {
        nested: {
          path: `${_constants.CASE_USER_ACTION_SAVED_OBJECT}.references`
        },
        aggregations: {
          connectors: {
            filter: {
              term: {
                [`${_constants.CASE_USER_ACTION_SAVED_OBJECT}.references.type`]: 'action'
              }
            },
            aggregations: {
              ids: {
                terms: {
                  field: `${_constants.CASE_USER_ACTION_SAVED_OBJECT}.references.id`,
                  size
                }
              }
            }
          }
        }
      }
    };
  }
}
exports.CaseUserActionService = CaseUserActionService;
(0, _defineProperty2.default)(CaseUserActionService, "userActionFieldsAllowed", new Set(Object.keys(_api.ActionTypes)));
function transformFindResponseToExternalModel(userActions, persistableStateAttachmentTypeRegistry) {
  return {
    ...userActions,
    saved_objects: userActions.saved_objects.map(so => ({
      ...so,
      ...transformToExternalModel(so, persistableStateAttachmentTypeRegistry)
    }))
  };
}
function transformToExternalModel(userAction, persistableStateAttachmentTypeRegistry) {
  var _findReferenceId, _findReferenceId2;
  const {
    references
  } = userAction;
  const caseId = (_findReferenceId = findReferenceId(_constants2.CASE_REF_NAME, _constants.CASE_SAVED_OBJECT, references)) !== null && _findReferenceId !== void 0 ? _findReferenceId : '';
  const commentId = (_findReferenceId2 = findReferenceId(_constants2.COMMENT_REF_NAME, _constants.CASE_COMMENT_SAVED_OBJECT, references)) !== null && _findReferenceId2 !== void 0 ? _findReferenceId2 : null;
  const payload = addReferenceIdToPayload(userAction, persistableStateAttachmentTypeRegistry);
  return {
    ...userAction,
    attributes: {
      ...userAction.attributes,
      action_id: userAction.id,
      case_id: caseId,
      comment_id: commentId,
      payload
    }
  };
}
const addReferenceIdToPayload = (userAction, persistableStateAttachmentTypeRegistry) => {
  const connectorId = getConnectorIdFromReferences(userAction);
  const userActionAttributes = userAction.attributes;
  if ((0, _user_actions.isConnectorUserAction)(userActionAttributes) || (0, _user_actions.isCreateCaseUserAction)(userActionAttributes)) {
    return {
      ...userActionAttributes.payload,
      connector: {
        ...userActionAttributes.payload.connector,
        id: connectorId !== null && connectorId !== void 0 ? connectorId : _api.NONE_CONNECTOR_ID
      }
    };
  } else if ((0, _user_actions.isPushedUserAction)(userActionAttributes)) {
    return {
      ...userAction.attributes.payload,
      externalService: {
        ...userActionAttributes.payload.externalService,
        connector_id: connectorId !== null && connectorId !== void 0 ? connectorId : _api.NONE_CONNECTOR_ID
      }
    };
  } else if ((0, _user_actions.isCommentUserAction)(userActionAttributes)) {
    if ((0, _utils2.isCommentRequestTypeExternalReferenceSO)(userActionAttributes.payload.comment)) {
      const externalReferenceId = findReferenceId(_constants2.EXTERNAL_REFERENCE_REF_NAME, userActionAttributes.payload.comment.externalReferenceStorage.soType, userAction.references);
      return {
        ...userAction.attributes.payload,
        comment: {
          ...userActionAttributes.payload.comment,
          externalReferenceId: externalReferenceId !== null && externalReferenceId !== void 0 ? externalReferenceId : ''
        }
      };
    }
    if ((0, _attachments.isCommentRequestTypePersistableState)(userActionAttributes.payload.comment)) {
      const injectedAttributes = (0, _so_references.injectPersistableReferencesToSO)(userActionAttributes.payload.comment, userAction.references, {
        persistableStateAttachmentTypeRegistry
      });
      return {
        ...userAction.attributes.payload,
        comment: {
          ...userActionAttributes.payload.comment,
          ...injectedAttributes
        }
      };
    }
  }
  return userAction.attributes.payload;
};
function getConnectorIdFromReferences(userAction) {
  const {
    references
  } = userAction;
  if ((0, _user_actions.isConnectorUserAction)(userAction.attributes) || (0, _user_actions.isCreateCaseUserAction)(userAction.attributes)) {
    var _findConnectorIdRefer, _findConnectorIdRefer2;
    return (_findConnectorIdRefer = (_findConnectorIdRefer2 = (0, _transform.findConnectorIdReference)(_constants2.CONNECTOR_ID_REFERENCE_NAME, references)) === null || _findConnectorIdRefer2 === void 0 ? void 0 : _findConnectorIdRefer2.id) !== null && _findConnectorIdRefer !== void 0 ? _findConnectorIdRefer : null;
  } else if ((0, _user_actions.isPushedUserAction)(userAction.attributes)) {
    var _findConnectorIdRefer3, _findConnectorIdRefer4;
    return (_findConnectorIdRefer3 = (_findConnectorIdRefer4 = (0, _transform.findConnectorIdReference)(_constants2.PUSH_CONNECTOR_ID_REFERENCE_NAME, references)) === null || _findConnectorIdRefer4 === void 0 ? void 0 : _findConnectorIdRefer4.id) !== null && _findConnectorIdRefer3 !== void 0 ? _findConnectorIdRefer3 : null;
  }
  return null;
}
function findReferenceId(name, type, references) {
  var _references$find;
  return (_references$find = references.find(ref => ref.name === name && ref.type === type)) === null || _references$find === void 0 ? void 0 : _references$find.id;
}