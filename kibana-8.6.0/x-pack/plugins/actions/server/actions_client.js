"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_ACTIONS_RETURNED = exports.ActionsClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _url = _interopRequireDefault(require("url"));
var _i18n = require("@kbn/i18n");
var _lodash = require("lodash");
var _server = require("../../../../src/core/server");
var _lib = require("./lib");
var _preconfigured_action_disabled_modification = require("./lib/errors/preconfigured_action_disabled_modification");
var _get_authorization_mode_by_source = require("./authorization/get_authorization_mode_by_source");
var _audit_events = require("./lib/audit_events");
var _track_legacy_rbac_exemption = require("./lib/track_legacy_rbac_exemption");
var _is_connector_deprecated = require("./lib/is_connector_deprecated");
var _get_oauth_jwt_access_token = require("./lib/get_oauth_jwt_access_token");
var _get_oauth_client_credentials_access_token = require("./lib/get_oauth_client_credentials_access_token");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// We are assuming there won't be many actions. This is why we will load
// all the actions in advance and assume the total count to not go over 10000.
// We'll set this max setting assuming it's never reached.
const MAX_ACTIONS_RETURNED = 10000;
exports.MAX_ACTIONS_RETURNED = MAX_ACTIONS_RETURNED;
class ActionsClient {
  constructor({
    logger,
    actionTypeRegistry,
    defaultKibanaIndex,
    scopedClusterClient,
    unsecuredSavedObjectsClient,
    preconfiguredActions,
    actionExecutor,
    executionEnqueuer,
    ephemeralExecutionEnqueuer,
    bulkExecutionEnqueuer,
    request,
    authorization,
    auditLogger,
    usageCounter,
    connectorTokenClient
  }) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "defaultKibanaIndex", void 0);
    (0, _defineProperty2.default)(this, "scopedClusterClient", void 0);
    (0, _defineProperty2.default)(this, "unsecuredSavedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "actionTypeRegistry", void 0);
    (0, _defineProperty2.default)(this, "preconfiguredActions", void 0);
    (0, _defineProperty2.default)(this, "actionExecutor", void 0);
    (0, _defineProperty2.default)(this, "request", void 0);
    (0, _defineProperty2.default)(this, "authorization", void 0);
    (0, _defineProperty2.default)(this, "executionEnqueuer", void 0);
    (0, _defineProperty2.default)(this, "ephemeralExecutionEnqueuer", void 0);
    (0, _defineProperty2.default)(this, "bulkExecutionEnqueuer", void 0);
    (0, _defineProperty2.default)(this, "auditLogger", void 0);
    (0, _defineProperty2.default)(this, "usageCounter", void 0);
    (0, _defineProperty2.default)(this, "connectorTokenClient", void 0);
    this.logger = logger;
    this.actionTypeRegistry = actionTypeRegistry;
    this.unsecuredSavedObjectsClient = unsecuredSavedObjectsClient;
    this.scopedClusterClient = scopedClusterClient;
    this.defaultKibanaIndex = defaultKibanaIndex;
    this.preconfiguredActions = preconfiguredActions;
    this.actionExecutor = actionExecutor;
    this.executionEnqueuer = executionEnqueuer;
    this.ephemeralExecutionEnqueuer = ephemeralExecutionEnqueuer;
    this.bulkExecutionEnqueuer = bulkExecutionEnqueuer;
    this.request = request;
    this.authorization = authorization;
    this.auditLogger = auditLogger;
    this.usageCounter = usageCounter;
    this.connectorTokenClient = connectorTokenClient;
  }

  /**
   * Create an action
   */
  async create({
    action: {
      actionTypeId,
      name,
      config,
      secrets
    }
  }) {
    var _actionType$validate, _this$auditLogger2;
    const id = _server.SavedObjectsUtils.generateId();
    try {
      await this.authorization.ensureAuthorized('create', actionTypeId);
    } catch (error) {
      var _this$auditLogger;
      (_this$auditLogger = this.auditLogger) === null || _this$auditLogger === void 0 ? void 0 : _this$auditLogger.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.CREATE,
        savedObject: {
          type: 'action',
          id
        },
        error
      }));
      throw error;
    }
    const actionType = this.actionTypeRegistry.get(actionTypeId);
    const configurationUtilities = this.actionTypeRegistry.getUtils();
    const validatedActionTypeConfig = (0, _lib.validateConfig)(actionType, config, {
      configurationUtilities
    });
    const validatedActionTypeSecrets = (0, _lib.validateSecrets)(actionType, secrets, {
      configurationUtilities
    });
    if ((_actionType$validate = actionType.validate) !== null && _actionType$validate !== void 0 && _actionType$validate.connector) {
      (0, _lib.validateConnector)(actionType, {
        config,
        secrets
      });
    }
    this.actionTypeRegistry.ensureActionTypeEnabled(actionTypeId);
    (_this$auditLogger2 = this.auditLogger) === null || _this$auditLogger2 === void 0 ? void 0 : _this$auditLogger2.log((0, _audit_events.connectorAuditEvent)({
      action: _audit_events.ConnectorAuditAction.CREATE,
      savedObject: {
        type: 'action',
        id
      },
      outcome: 'unknown'
    }));
    const result = await this.unsecuredSavedObjectsClient.create('action', {
      actionTypeId,
      name,
      isMissingSecrets: false,
      config: validatedActionTypeConfig,
      secrets: validatedActionTypeSecrets
    }, {
      id
    });
    return {
      id: result.id,
      actionTypeId: result.attributes.actionTypeId,
      isMissingSecrets: result.attributes.isMissingSecrets,
      name: result.attributes.name,
      config: result.attributes.config,
      isPreconfigured: false,
      isDeprecated: (0, _is_connector_deprecated.isConnectorDeprecated)(result.attributes)
    };
  }

  /**
   * Update action
   */
  async update({
    id,
    action
  }) {
    var _actionType$validate2, _this$auditLogger4;
    try {
      await this.authorization.ensureAuthorized('update');
      if (this.preconfiguredActions.find(preconfiguredAction => preconfiguredAction.id === id) !== undefined) {
        throw new _preconfigured_action_disabled_modification.PreconfiguredActionDisabledModificationError(_i18n.i18n.translate('xpack.actions.serverSideErrors.predefinedActionUpdateDisabled', {
          defaultMessage: 'Preconfigured action {id} is not allowed to update.',
          values: {
            id
          }
        }), 'update');
      }
    } catch (error) {
      var _this$auditLogger3;
      (_this$auditLogger3 = this.auditLogger) === null || _this$auditLogger3 === void 0 ? void 0 : _this$auditLogger3.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.UPDATE,
        savedObject: {
          type: 'action',
          id
        },
        error
      }));
      throw error;
    }
    const {
      attributes,
      references,
      version
    } = await this.unsecuredSavedObjectsClient.get('action', id);
    const {
      actionTypeId
    } = attributes;
    const {
      name,
      config,
      secrets
    } = action;
    const actionType = this.actionTypeRegistry.get(actionTypeId);
    const configurationUtilities = this.actionTypeRegistry.getUtils();
    const validatedActionTypeConfig = (0, _lib.validateConfig)(actionType, config, {
      configurationUtilities
    });
    const validatedActionTypeSecrets = (0, _lib.validateSecrets)(actionType, secrets, {
      configurationUtilities
    });
    if ((_actionType$validate2 = actionType.validate) !== null && _actionType$validate2 !== void 0 && _actionType$validate2.connector) {
      (0, _lib.validateConnector)(actionType, {
        config,
        secrets
      });
    }
    this.actionTypeRegistry.ensureActionTypeEnabled(actionTypeId);
    (_this$auditLogger4 = this.auditLogger) === null || _this$auditLogger4 === void 0 ? void 0 : _this$auditLogger4.log((0, _audit_events.connectorAuditEvent)({
      action: _audit_events.ConnectorAuditAction.UPDATE,
      savedObject: {
        type: 'action',
        id
      },
      outcome: 'unknown'
    }));
    const result = await this.unsecuredSavedObjectsClient.create('action', {
      ...attributes,
      actionTypeId,
      name,
      isMissingSecrets: false,
      config: validatedActionTypeConfig,
      secrets: validatedActionTypeSecrets
    }, (0, _lodash.omitBy)({
      id,
      overwrite: true,
      references,
      version
    }, _lodash.isUndefined));
    try {
      await this.connectorTokenClient.deleteConnectorTokens({
        connectorId: id
      });
    } catch (e) {
      this.logger.error(`Failed to delete auth tokens for connector "${id}" after update: ${e.message}`);
    }
    return {
      id,
      actionTypeId: result.attributes.actionTypeId,
      isMissingSecrets: result.attributes.isMissingSecrets,
      name: result.attributes.name,
      config: result.attributes.config,
      isPreconfigured: false,
      isDeprecated: (0, _is_connector_deprecated.isConnectorDeprecated)(result.attributes)
    };
  }

  /**
   * Get an action
   */
  async get({
    id
  }) {
    var _this$auditLogger7;
    try {
      await this.authorization.ensureAuthorized('get');
    } catch (error) {
      var _this$auditLogger5;
      (_this$auditLogger5 = this.auditLogger) === null || _this$auditLogger5 === void 0 ? void 0 : _this$auditLogger5.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.GET,
        savedObject: {
          type: 'action',
          id
        },
        error
      }));
      throw error;
    }
    const preconfiguredActionsList = this.preconfiguredActions.find(preconfiguredAction => preconfiguredAction.id === id);
    if (preconfiguredActionsList !== undefined) {
      var _this$auditLogger6;
      (_this$auditLogger6 = this.auditLogger) === null || _this$auditLogger6 === void 0 ? void 0 : _this$auditLogger6.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.GET,
        savedObject: {
          type: 'action',
          id
        }
      }));
      return {
        id,
        actionTypeId: preconfiguredActionsList.actionTypeId,
        name: preconfiguredActionsList.name,
        isPreconfigured: true,
        isDeprecated: (0, _is_connector_deprecated.isConnectorDeprecated)(preconfiguredActionsList)
      };
    }
    const result = await this.unsecuredSavedObjectsClient.get('action', id);
    (_this$auditLogger7 = this.auditLogger) === null || _this$auditLogger7 === void 0 ? void 0 : _this$auditLogger7.log((0, _audit_events.connectorAuditEvent)({
      action: _audit_events.ConnectorAuditAction.GET,
      savedObject: {
        type: 'action',
        id
      }
    }));
    return {
      id,
      actionTypeId: result.attributes.actionTypeId,
      isMissingSecrets: result.attributes.isMissingSecrets,
      name: result.attributes.name,
      config: result.attributes.config,
      isPreconfigured: false,
      isDeprecated: (0, _is_connector_deprecated.isConnectorDeprecated)(result.attributes)
    };
  }

  /**
   * Get all actions with preconfigured list
   */
  async getAll() {
    try {
      await this.authorization.ensureAuthorized('get');
    } catch (error) {
      var _this$auditLogger8;
      (_this$auditLogger8 = this.auditLogger) === null || _this$auditLogger8 === void 0 ? void 0 : _this$auditLogger8.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.FIND,
        error
      }));
      throw error;
    }
    const savedObjectsActions = (await this.unsecuredSavedObjectsClient.find({
      perPage: MAX_ACTIONS_RETURNED,
      type: 'action'
    })).saved_objects.map(rawAction => actionFromSavedObject(rawAction, (0, _is_connector_deprecated.isConnectorDeprecated)(rawAction.attributes)));
    savedObjectsActions.forEach(({
      id
    }) => {
      var _this$auditLogger9;
      return (_this$auditLogger9 = this.auditLogger) === null || _this$auditLogger9 === void 0 ? void 0 : _this$auditLogger9.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.FIND,
        savedObject: {
          type: 'action',
          id
        }
      }));
    });
    const mergedResult = [...savedObjectsActions, ...this.preconfiguredActions.map(preconfiguredAction => ({
      id: preconfiguredAction.id,
      actionTypeId: preconfiguredAction.actionTypeId,
      name: preconfiguredAction.name,
      isPreconfigured: true,
      isDeprecated: (0, _is_connector_deprecated.isConnectorDeprecated)(preconfiguredAction)
    }))].sort((a, b) => a.name.localeCompare(b.name));
    return await injectExtraFindData(this.defaultKibanaIndex, this.scopedClusterClient, mergedResult);
  }

  /**
   * Get bulk actions with preconfigured list
   */
  async getBulk(ids) {
    try {
      await this.authorization.ensureAuthorized('get');
    } catch (error) {
      ids.forEach(id => {
        var _this$auditLogger10;
        return (_this$auditLogger10 = this.auditLogger) === null || _this$auditLogger10 === void 0 ? void 0 : _this$auditLogger10.log((0, _audit_events.connectorAuditEvent)({
          action: _audit_events.ConnectorAuditAction.GET,
          savedObject: {
            type: 'action',
            id
          },
          error
        }));
      });
      throw error;
    }
    const actionResults = new Array();
    for (const actionId of ids) {
      const action = this.preconfiguredActions.find(preconfiguredAction => preconfiguredAction.id === actionId);
      if (action !== undefined) {
        actionResults.push(action);
      }
    }

    // Fetch action objects in bulk
    // Excluding preconfigured actions to avoid an not found error, which is already added
    const actionSavedObjectsIds = [...new Set(ids.filter(actionId => !actionResults.find(actionResult => actionResult.id === actionId)))];
    const bulkGetOpts = actionSavedObjectsIds.map(id => ({
      id,
      type: 'action'
    }));
    const bulkGetResult = await this.unsecuredSavedObjectsClient.bulkGet(bulkGetOpts);
    bulkGetResult.saved_objects.forEach(({
      id,
      error
    }) => {
      if (!error && this.auditLogger) {
        this.auditLogger.log((0, _audit_events.connectorAuditEvent)({
          action: _audit_events.ConnectorAuditAction.GET,
          savedObject: {
            type: 'action',
            id
          }
        }));
      }
    });
    for (const action of bulkGetResult.saved_objects) {
      if (action.error) {
        throw _boom.default.badRequest(`Failed to load action ${action.id} (${action.error.statusCode}): ${action.error.message}`);
      }
      actionResults.push(actionFromSavedObject(action, (0, _is_connector_deprecated.isConnectorDeprecated)(action.attributes)));
    }
    return actionResults;
  }
  async getOAuthAccessToken({
    type,
    options
  }, configurationUtilities) {
    // Verify that user has edit access
    await this.authorization.ensureAuthorized('update');

    // Verify that token url is allowed by allowed hosts config
    try {
      configurationUtilities.ensureUriAllowed(options.tokenUrl);
    } catch (err) {
      throw _boom.default.badRequest(err.message);
    }

    // Verify that token url contains a hostname and uses https
    const parsedUrl = _url.default.parse(options.tokenUrl, false /* parseQueryString */, true /* slashesDenoteHost */);

    if (!parsedUrl.hostname) {
      throw _boom.default.badRequest(`Token URL must contain hostname`);
    }
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      throw _boom.default.badRequest(`Token URL must use http or https`);
    }
    let accessToken = null;
    if (type === 'jwt') {
      const tokenOpts = options;
      try {
        accessToken = await (0, _get_oauth_jwt_access_token.getOAuthJwtAccessToken)({
          logger: this.logger,
          configurationUtilities,
          credentials: {
            config: tokenOpts.config,
            secrets: tokenOpts.secrets
          },
          tokenUrl: tokenOpts.tokenUrl
        });
        this.logger.debug(`Successfully retrieved access token using JWT OAuth with tokenUrl ${tokenOpts.tokenUrl} and config ${JSON.stringify(tokenOpts.config)}`);
      } catch (err) {
        this.logger.debug(`Failed to retrieve access token using JWT OAuth with tokenUrl ${tokenOpts.tokenUrl} and config ${JSON.stringify(tokenOpts.config)} - ${err.message}`);
        throw _boom.default.badRequest(`Failed to retrieve access token`);
      }
    } else if (type === 'client') {
      const tokenOpts = options;
      try {
        accessToken = await (0, _get_oauth_client_credentials_access_token.getOAuthClientCredentialsAccessToken)({
          logger: this.logger,
          configurationUtilities,
          credentials: {
            config: tokenOpts.config,
            secrets: tokenOpts.secrets
          },
          tokenUrl: tokenOpts.tokenUrl,
          oAuthScope: tokenOpts.scope
        });
        this.logger.debug(`Successfully retrieved access token using Client Credentials OAuth with tokenUrl ${tokenOpts.tokenUrl}, scope ${tokenOpts.scope} and config ${JSON.stringify(tokenOpts.config)}`);
      } catch (err) {
        this.logger.debug(`Failed to retrieved access token using Client Credentials OAuth with tokenUrl ${tokenOpts.tokenUrl}, scope ${tokenOpts.scope} and config ${JSON.stringify(tokenOpts.config)} - ${err.message}`);
        throw _boom.default.badRequest(`Failed to retrieve access token`);
      }
    }
    return {
      accessToken
    };
  }

  /**
   * Delete action
   */
  async delete({
    id
  }) {
    var _this$auditLogger12;
    try {
      await this.authorization.ensureAuthorized('delete');
      if (this.preconfiguredActions.find(preconfiguredAction => preconfiguredAction.id === id) !== undefined) {
        throw new _preconfigured_action_disabled_modification.PreconfiguredActionDisabledModificationError(_i18n.i18n.translate('xpack.actions.serverSideErrors.predefinedActionDeleteDisabled', {
          defaultMessage: 'Preconfigured action {id} is not allowed to delete.',
          values: {
            id
          }
        }), 'delete');
      }
    } catch (error) {
      var _this$auditLogger11;
      (_this$auditLogger11 = this.auditLogger) === null || _this$auditLogger11 === void 0 ? void 0 : _this$auditLogger11.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.DELETE,
        savedObject: {
          type: 'action',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger12 = this.auditLogger) === null || _this$auditLogger12 === void 0 ? void 0 : _this$auditLogger12.log((0, _audit_events.connectorAuditEvent)({
      action: _audit_events.ConnectorAuditAction.DELETE,
      outcome: 'unknown',
      savedObject: {
        type: 'action',
        id
      }
    }));
    try {
      await this.connectorTokenClient.deleteConnectorTokens({
        connectorId: id
      });
    } catch (e) {
      this.logger.error(`Failed to delete auth tokens for connector "${id}" after delete: ${e.message}`);
    }
    return await this.unsecuredSavedObjectsClient.delete('action', id);
  }
  async execute({
    actionId,
    params,
    source,
    relatedSavedObjects
  }) {
    if ((await (0, _get_authorization_mode_by_source.getAuthorizationModeBySource)(this.unsecuredSavedObjectsClient, source)) === _get_authorization_mode_by_source.AuthorizationMode.RBAC) {
      await this.authorization.ensureAuthorized('execute');
    } else {
      (0, _track_legacy_rbac_exemption.trackLegacyRBACExemption)('execute', this.usageCounter);
    }
    return this.actionExecutor.execute({
      actionId,
      params,
      source,
      request: this.request,
      relatedSavedObjects
    });
  }
  async enqueueExecution(options) {
    const {
      source
    } = options;
    if ((await (0, _get_authorization_mode_by_source.getAuthorizationModeBySource)(this.unsecuredSavedObjectsClient, source)) === _get_authorization_mode_by_source.AuthorizationMode.RBAC) {
      await this.authorization.ensureAuthorized('execute');
    } else {
      (0, _track_legacy_rbac_exemption.trackLegacyRBACExemption)('enqueueExecution', this.usageCounter);
    }
    return this.executionEnqueuer(this.unsecuredSavedObjectsClient, options);
  }
  async bulkEnqueueExecution(options) {
    const sources = [];
    options.forEach(option => {
      if (option.source) {
        sources.push(option.source);
      }
    });
    const authCounts = await (0, _get_authorization_mode_by_source.getBulkAuthorizationModeBySource)(this.unsecuredSavedObjectsClient, sources);
    if (authCounts[_get_authorization_mode_by_source.AuthorizationMode.RBAC] > 0) {
      await this.authorization.ensureAuthorized('execute');
    }
    if (authCounts[_get_authorization_mode_by_source.AuthorizationMode.Legacy] > 0) {
      (0, _track_legacy_rbac_exemption.trackLegacyRBACExemption)('bulkEnqueueExecution', this.usageCounter, authCounts[_get_authorization_mode_by_source.AuthorizationMode.Legacy]);
    }
    return this.bulkExecutionEnqueuer(this.unsecuredSavedObjectsClient, options);
  }
  async ephemeralEnqueuedExecution(options) {
    const {
      source
    } = options;
    if ((await (0, _get_authorization_mode_by_source.getAuthorizationModeBySource)(this.unsecuredSavedObjectsClient, source)) === _get_authorization_mode_by_source.AuthorizationMode.RBAC) {
      await this.authorization.ensureAuthorized('execute');
    } else {
      (0, _track_legacy_rbac_exemption.trackLegacyRBACExemption)('ephemeralEnqueuedExecution', this.usageCounter);
    }
    return this.ephemeralExecutionEnqueuer(this.unsecuredSavedObjectsClient, options);
  }
  async listTypes(featureId) {
    return this.actionTypeRegistry.list(featureId);
  }
  isActionTypeEnabled(actionTypeId, options = {
    notifyUsage: false
  }) {
    return this.actionTypeRegistry.isActionTypeEnabled(actionTypeId, options);
  }
  isPreconfigured(connectorId) {
    return !!this.preconfiguredActions.find(preconfigured => preconfigured.id === connectorId);
  }
}
exports.ActionsClient = ActionsClient;
function actionFromSavedObject(savedObject, isDeprecated) {
  return {
    id: savedObject.id,
    ...savedObject.attributes,
    isPreconfigured: false,
    isDeprecated
  };
}
async function injectExtraFindData(defaultKibanaIndex, scopedClusterClient, actionResults) {
  const aggs = {};
  for (const actionResult of actionResults) {
    aggs[actionResult.id] = {
      filter: {
        bool: {
          must: {
            nested: {
              path: 'references',
              query: {
                bool: {
                  filter: {
                    bool: {
                      must: [{
                        term: {
                          'references.id': actionResult.id
                        }
                      }, {
                        term: {
                          'references.type': 'action'
                        }
                      }]
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  }
  const aggregationResult = await scopedClusterClient.asInternalUser.search({
    index: defaultKibanaIndex,
    body: {
      aggs,
      size: 0,
      query: {
        match_all: {}
      }
    }
  });
  return actionResults.map(actionResult => ({
    ...actionResult,
    // @ts-expect-error aggegation type is not specified
    referencedByCount: aggregationResult.aggregations[actionResult.id].doc_count
  }));
}