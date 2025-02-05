"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CasesClientFactory = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _constants = require("../../common/constants");
var _authorization = require("../authorization/authorization");
var _services = require("../services");
var _authorization2 = require("../authorization");
var _ = require(".");
var _licensing = require("../services/licensing");
var _email_notification_service = require("../services/notifications/email_notification_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This class handles the logic for creating a CasesClient. We need this because some of the member variables
 * can't be initialized until a plugin's start() method but we need to register the case context in the setup() method.
 */
class CasesClientFactory {
  // The reason this is protected is because we'll get type collisions otherwise because we're using a type guard assert
  // to ensure the options member is instantiated before using it in various places
  // See for more info: https://stackoverflow.com/questions/66206180/typescript-typeguard-attribut-with-method

  constructor(logger) {
    (0, _defineProperty2.default)(this, "isInitialized", false);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "options", void 0);
    this.logger = logger;
  }

  /**
   * This should be called by the plugin's start() method.
   */
  initialize(options) {
    if (this.isInitialized) {
      throw new Error('CasesClientFactory already initialized');
    }
    this.isInitialized = true;
    this.options = options;
  }

  /**
   * Creates a cases client for the current request. This request will be used to authorize the operations done through
   * the client.
   */
  async create({
    request,
    scopedClusterClient,
    savedObjectsService
  }) {
    var _this$options$securit;
    this.validateInitialization();
    const auditLogger = this.options.securityPluginSetup.audit.asScoped(request);
    const auth = await _authorization.Authorization.create({
      request,
      securityAuth: (_this$options$securit = this.options.securityPluginStart) === null || _this$options$securit === void 0 ? void 0 : _this$options$securit.authz,
      spaces: this.options.spacesPluginStart,
      features: this.options.featuresPluginStart,
      auditLogger: new _authorization2.AuthorizationAuditLogger(auditLogger),
      logger: this.logger
    });
    const unsecuredSavedObjectsClient = savedObjectsService.getScopedClient(request, {
      includedHiddenTypes: _constants.SAVED_OBJECT_TYPES,
      // this tells the security plugin to not perform SO authorization and audit logging since we are handling
      // that manually using our Authorization class and audit logger.
      excludedWrappers: ['security']
    });
    const services = this.createServices({
      unsecuredSavedObjectsClient,
      esClient: scopedClusterClient,
      request
    });
    const userInfo = await this.getUserInfo(request);
    return (0, _.createCasesClient)({
      services,
      unsecuredSavedObjectsClient,
      user: userInfo,
      logger: this.logger,
      lensEmbeddableFactory: this.options.lensEmbeddableFactory,
      authorization: auth,
      actionsClient: await this.options.actionsPluginStart.getActionsClientWithRequest(request),
      persistableStateAttachmentTypeRegistry: this.options.persistableStateAttachmentTypeRegistry,
      externalReferenceAttachmentTypeRegistry: this.options.externalReferenceAttachmentTypeRegistry,
      securityStartPlugin: this.options.securityPluginStart,
      publicBaseUrl: this.options.publicBaseUrl,
      spaceId: this.options.spacesPluginStart.spacesService.getSpaceId(request)
    });
  }
  validateInitialization() {
    if (!this.isInitialized || this.options == null) {
      throw new Error('CasesClientFactory must be initialized before calling create');
    }
  }
  createServices({
    unsecuredSavedObjectsClient,
    esClient,
    request
  }) {
    this.validateInitialization();
    const attachmentService = new _services.AttachmentService(this.logger, this.options.persistableStateAttachmentTypeRegistry);
    const caseService = new _services.CasesService({
      log: this.logger,
      unsecuredSavedObjectsClient,
      attachmentService
    });
    const licensingService = new _licensing.LicensingService(this.options.licensingPluginStart.license$, this.options.licensingPluginStart.featureUsage.notifyUsage);

    /**
     * The notifications plugins only exports the EmailService.
     * We do the same. If in the future we use other means
     * of notifications we can refactor to use a factory.
     */
    const notificationService = new _email_notification_service.EmailNotificationService({
      logger: this.logger,
      notifications: this.options.notifications,
      security: this.options.securityPluginStart,
      publicBaseUrl: this.options.publicBaseUrl,
      spaceId: this.options.spacesPluginStart.spacesService.getSpaceId(request)
    });
    return {
      alertsService: new _services.AlertService(esClient, this.logger),
      caseService,
      caseConfigureService: new _services.CaseConfigureService(this.logger),
      connectorMappingsService: new _services.ConnectorMappingsService(this.logger),
      userActionService: new _services.CaseUserActionService(this.logger, this.options.persistableStateAttachmentTypeRegistry),
      attachmentService,
      licensingService,
      notificationService
    };
  }

  /**
   * This function attempts to retrieve the current user's info. The first method is using the user profile api
   * provided by the security plugin. If that fails or the session isn't found then we will attempt using authc
   * which will not retrieve the profile uid but at least gets us the username and sometimes full name, and email.
   *
   * This function also forces the fields to be strings or null (except the profile uid since it's optional anyway)
   * because the get case API expects a created_by field to be set. If we leave the fields as undefined
   * then the resulting object in ES will just be empty and it'll fail to encode the user when returning it to the API
   * request. If we force them to be null it will succeed.
   */
  async getUserInfo(request) {
    this.validateInitialization();
    try {
      const userProfile = await this.options.securityPluginStart.userProfiles.getCurrent({
        request
      });
      if (userProfile != null) {
        var _userProfile$user$ful, _userProfile$user$ema;
        return {
          username: userProfile.user.username,
          full_name: (_userProfile$user$ful = userProfile.user.full_name) !== null && _userProfile$user$ful !== void 0 ? _userProfile$user$ful : null,
          email: (_userProfile$user$ema = userProfile.user.email) !== null && _userProfile$user$ema !== void 0 ? _userProfile$user$ema : null,
          profile_uid: userProfile.uid
        };
      }
    } catch (error) {
      this.logger.debug(`Failed to retrieve user profile, falling back to authc: ${error}`);
    }
    try {
      const user = this.options.securityPluginStart.authc.getCurrentUser(request);
      if (user != null) {
        var _user$full_name, _user$email;
        return {
          username: user.username,
          full_name: (_user$full_name = user.full_name) !== null && _user$full_name !== void 0 ? _user$full_name : null,
          email: (_user$email = user.email) !== null && _user$email !== void 0 ? _user$email : null
        };
      }
    } catch (error) {
      this.logger.debug(`Failed to retrieve user info from authc: ${error}`);
    }
    return {
      username: null,
      full_name: null,
      email: null
    };
  }
}
exports.CasesClientFactory = CasesClientFactory;