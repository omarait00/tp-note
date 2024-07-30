"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAttributesFromSourceConfiguration = exports.LogViewsClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../../../src/core/server");
var _log_views = require("../../../common/log_views");
var _runtime_types = require("../../../common/runtime_types");
var _log_view = require("../../saved_objects/log_view");
var _types = require("../../saved_objects/log_view/types");
var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class LogViewsClient {
  constructor(logger, dataViews, savedObjectsClient, infraSources, internalLogViews, config) {
    this.logger = logger;
    this.dataViews = dataViews;
    this.savedObjectsClient = savedObjectsClient;
    this.infraSources = infraSources;
    this.internalLogViews = internalLogViews;
    this.config = config;
  }
  async getLogView(logViewId) {
    return await this.getSavedLogView(logViewId).catch(err => _server.SavedObjectsErrorHelpers.isNotFoundError(err) || err instanceof _errors.NotFoundError ? this.getInternalLogView(logViewId) : Promise.reject(err)).catch(err => err instanceof _errors.NotFoundError ? this.getLogViewFromInfraSourceConfiguration(logViewId) : Promise.reject(err));
  }
  async getResolvedLogView(logViewId) {
    const logView = await this.getLogView(logViewId);
    const resolvedLogView = await this.resolveLogView(logView.id, logView.attributes);
    return resolvedLogView;
  }
  async putLogView(logViewId, logViewAttributes) {
    var _await$this$resolveLo;
    const resolvedLogViewId = (_await$this$resolveLo = await this.resolveLogViewId(logViewId)) !== null && _await$this$resolveLo !== void 0 ? _await$this$resolveLo : _server.SavedObjectsUtils.generateId();
    this.logger.debug(`Trying to store log view "${logViewId}" as "${resolvedLogViewId}"...`);
    const logViewAttributesWithDefaults = {
      ..._log_views.defaultLogViewAttributes,
      ...logViewAttributes
    };
    const {
      attributes,
      references
    } = (0, _log_view.extractLogViewSavedObjectReferences)(logViewAttributesWithDefaults);
    const savedObject = await this.savedObjectsClient.create(_log_view.logViewSavedObjectName, attributes, {
      id: resolvedLogViewId,
      overwrite: true,
      references
    });
    return getLogViewFromSavedObject(savedObject);
  }
  async resolveLogView(logViewId, logViewAttributes) {
    return await (0, _log_views.resolveLogView)(logViewId, logViewAttributes, await this.dataViews, this.config);
  }
  async getSavedLogView(logViewId) {
    this.logger.debug(`Trying to load stored log view "${logViewId}"...`);
    const resolvedLogViewId = await this.resolveLogViewId(logViewId);
    if (!resolvedLogViewId) {
      throw new _errors.NotFoundError(`Failed to load saved log view: the log view id "${logViewId}" could not be resolved.`);
    }
    const savedObject = await this.savedObjectsClient.get(_log_view.logViewSavedObjectName, resolvedLogViewId);
    return getLogViewFromSavedObject(savedObject);
  }
  async getInternalLogView(logViewId) {
    this.logger.debug(`Trying to load internal log view "${logViewId}"...`);
    const internalLogView = this.internalLogViews.get(logViewId);
    if (!internalLogView) {
      throw new _errors.NotFoundError(`Failed to load internal log view: no view with id "${logViewId}" found.`);
    }
    return internalLogView;
  }
  async getLogViewFromInfraSourceConfiguration(sourceId) {
    this.logger.debug(`Trying to load log view from source configuration "${sourceId}"...`);
    const sourceConfiguration = await this.infraSources.getSourceConfiguration(this.savedObjectsClient, sourceId);
    return {
      id: sourceConfiguration.id,
      version: sourceConfiguration.version,
      updatedAt: sourceConfiguration.updatedAt,
      origin: `infra-source-${sourceConfiguration.origin}`,
      attributes: getAttributesFromSourceConfiguration(sourceConfiguration)
    };
  }
  async resolveLogViewId(logViewId) {
    // only the default id needs to be transformed
    if (logViewId !== _log_views.defaultLogViewId) {
      return logViewId;
    }
    return await this.getNewestSavedLogViewId();
  }
  async getNewestSavedLogViewId() {
    var _newestSavedLogView$i;
    const response = await this.savedObjectsClient.find({
      type: _log_view.logViewSavedObjectName,
      sortField: 'updated_at',
      sortOrder: 'desc',
      perPage: 1,
      fields: []
    });
    const [newestSavedLogView] = response.saved_objects;
    return (_newestSavedLogView$i = newestSavedLogView === null || newestSavedLogView === void 0 ? void 0 : newestSavedLogView.id) !== null && _newestSavedLogView$i !== void 0 ? _newestSavedLogView$i : null;
  }
}
exports.LogViewsClient = LogViewsClient;
(0, _defineProperty2.default)(LogViewsClient, "errors", {
  NotFoundError: _errors.NotFoundError
});
const getLogViewFromSavedObject = savedObject => {
  const logViewSavedObject = (0, _runtime_types.decodeOrThrow)(_types.logViewSavedObjectRT)(savedObject);
  return {
    id: logViewSavedObject.id,
    version: logViewSavedObject.version,
    updatedAt: logViewSavedObject.updated_at,
    origin: 'stored',
    attributes: (0, _log_view.resolveLogViewSavedObjectReferences)(logViewSavedObject.attributes, savedObject.references)
  };
};
const getAttributesFromSourceConfiguration = ({
  configuration: {
    name,
    description,
    logIndices,
    logColumns
  }
}) => ({
  name,
  description,
  logIndices: getLogIndicesFromSourceConfigurationLogIndices(logIndices),
  logColumns
});
exports.getAttributesFromSourceConfiguration = getAttributesFromSourceConfiguration;
const getLogIndicesFromSourceConfigurationLogIndices = logIndices => logIndices.type === 'index_pattern' ? {
  type: 'data_view',
  dataViewId: logIndices.indexPatternId
} : logIndices;