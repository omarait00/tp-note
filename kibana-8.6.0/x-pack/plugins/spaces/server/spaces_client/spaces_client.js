"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpacesClient = void 0;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _lodash = require("lodash");
var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SUPPORTED_GET_SPACE_PURPOSES = ['any', 'copySavedObjectsIntoSpace', 'findSavedObjects', 'shareSavedObjectsIntoSpace'];
const DEFAULT_PURPOSE = 'any';
const LEGACY_URL_ALIAS_TYPE = 'legacy-url-alias';

/**
 * Client interface for interacting with spaces.
 */

/**
 * Client for interacting with spaces.
 */
class SpacesClient {
  constructor(debugLogger, config, repository, nonGlobalTypeNames) {
    this.debugLogger = debugLogger;
    this.config = config;
    this.repository = repository;
    this.nonGlobalTypeNames = nonGlobalTypeNames;
  }
  async getAll(options = {}) {
    const {
      purpose = DEFAULT_PURPOSE
    } = options;
    if (!SUPPORTED_GET_SPACE_PURPOSES.includes(purpose)) {
      throw _boom.default.badRequest(`unsupported space purpose: ${purpose}`);
    }
    this.debugLogger(`SpacesClient.getAll(). querying all spaces`);
    const {
      saved_objects: savedObjects
    } = await this.repository.find({
      type: 'space',
      page: 1,
      perPage: this.config.maxSpaces,
      sortField: 'name.keyword'
    });
    this.debugLogger(`SpacesClient.getAll(). Found ${savedObjects.length} spaces.`);
    return savedObjects.map(this.transformSavedObjectToSpace);
  }
  async get(id) {
    const savedObject = await this.repository.get('space', id);
    return this.transformSavedObjectToSpace(savedObject);
  }
  async create(space) {
    const {
      total
    } = await this.repository.find({
      type: 'space',
      page: 1,
      perPage: 0
    });
    if (total >= this.config.maxSpaces) {
      throw _boom.default.badRequest('Unable to create Space, this exceeds the maximum number of spaces set by the xpack.spaces.maxSpaces setting');
    }
    this.debugLogger(`SpacesClient.create(), using RBAC. Attempting to create space`);
    const attributes = (0, _lodash.omit)(space, ['id', '_reserved']);
    const id = space.id;
    const createdSavedObject = await this.repository.create('space', attributes, {
      id
    });
    this.debugLogger(`SpacesClient.create(), created space object`);
    return this.transformSavedObjectToSpace(createdSavedObject);
  }
  async update(id, space) {
    const attributes = (0, _lodash.omit)(space, 'id', '_reserved');
    await this.repository.update('space', id, attributes);
    const updatedSavedObject = await this.repository.get('space', id);
    return this.transformSavedObjectToSpace(updatedSavedObject);
  }
  createSavedObjectFinder(id) {
    return this.repository.createPointInTimeFinder({
      type: this.nonGlobalTypeNames,
      namespaces: [id]
    });
  }
  async delete(id) {
    const existingSavedObject = await this.repository.get('space', id);
    if ((0, _common.isReservedSpace)(this.transformSavedObjectToSpace(existingSavedObject))) {
      throw _boom.default.badRequest(`The ${id} space cannot be deleted because it is reserved.`);
    }
    await this.repository.deleteByNamespace(id);
    await this.repository.delete('space', id);
  }
  async disableLegacyUrlAliases(aliases) {
    const attributes = {
      disabled: true
    };
    const objectsToUpdate = aliases.map(({
      targetSpace,
      targetType,
      sourceId
    }) => {
      const id = `${targetSpace}:${targetType}:${sourceId}`;
      return {
        type: LEGACY_URL_ALIAS_TYPE,
        id,
        attributes
      };
    });
    await this.repository.bulkUpdate(objectsToUpdate);
  }
  transformSavedObjectToSpace(savedObject) {
    return {
      id: savedObject.id,
      ...savedObject.attributes
    };
  }
}
exports.SpacesClient = SpacesClient;