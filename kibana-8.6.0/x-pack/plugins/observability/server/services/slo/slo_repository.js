"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaSavedObjectsSLORepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _Either = require("fp-ts/lib/Either");
var _pipeable = require("fp-ts/lib/pipeable");
var _coreSavedObjectsUtilsServer = require("@kbn/core-saved-objects-utils-server");
var _saved_objects = require("../../saved_objects");
var _errors = require("../../errors");
var _schema = require("../../types/schema");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class KibanaSavedObjectsSLORepository {
  constructor(soClient) {
    this.soClient = soClient;
  }
  async save(slo) {
    const savedSLO = await this.soClient.create(_saved_objects.SO_SLO_TYPE, toStoredSLO(slo), {
      id: slo.id,
      overwrite: true
    });
    return toSLO(savedSLO.attributes);
  }
  async findById(id) {
    try {
      const slo = await this.soClient.get(_saved_objects.SO_SLO_TYPE, id);
      return toSLO(slo.attributes);
    } catch (err) {
      if (_coreSavedObjectsUtilsServer.SavedObjectsErrorHelpers.isNotFoundError(err)) {
        throw new _errors.SLONotFound(`SLO [${id}] not found`);
      }
      throw err;
    }
  }
  async deleteById(id) {
    try {
      await this.soClient.delete(_saved_objects.SO_SLO_TYPE, id);
    } catch (err) {
      if (_coreSavedObjectsUtilsServer.SavedObjectsErrorHelpers.isNotFoundError(err)) {
        throw new _errors.SLONotFound(`SLO [${id}] not found`);
      }
      throw err;
    }
  }
  async find(criteria, pagination) {
    const filterKuery = buildFilterKuery(criteria);
    const response = await this.soClient.find({
      type: _saved_objects.SO_SLO_TYPE,
      page: pagination.page,
      perPage: pagination.perPage,
      filter: filterKuery
    });
    return {
      total: response.total,
      page: response.page,
      perPage: response.per_page,
      results: response.saved_objects.map(slo => toSLO(slo.attributes))
    };
  }
}
exports.KibanaSavedObjectsSLORepository = KibanaSavedObjectsSLORepository;
function buildFilterKuery(criteria) {
  const filters = [];
  if (!!criteria.name) {
    filters.push(`slo.attributes.name: ${criteria.name}`);
  }
  return filters.length > 0 ? filters.join(' and ') : undefined;
}
function toStoredSLO(slo) {
  return _schema.sloSchema.encode(slo);
}
function toSLO(storedSLO) {
  return (0, _pipeable.pipe)(_schema.sloSchema.decode(storedSLO), (0, _Either.fold)(() => {
    throw new Error('Invalid Stored SLO');
  }, t.identity));
}