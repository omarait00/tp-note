"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryOptionsSchema = exports.EventLogClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const optionalDateFieldSchema = _configSchema.schema.maybe(_configSchema.schema.string({
  validate(value) {
    if (isNaN(Date.parse(value))) {
      return 'Invalid Date';
    }
  }
}));
const sortSchema = _configSchema.schema.object({
  sort_field: _configSchema.schema.oneOf([_configSchema.schema.literal('@timestamp'), _configSchema.schema.literal('event.sequence'),
  // can be used as a tiebreaker for @timestamp
  _configSchema.schema.literal('event.start'), _configSchema.schema.literal('event.end'), _configSchema.schema.literal('event.provider'), _configSchema.schema.literal('event.duration'), _configSchema.schema.literal('event.action'), _configSchema.schema.literal('message')]),
  sort_order: _configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc')])
});
const queryOptionsSchema = _configSchema.schema.object({
  per_page: _configSchema.schema.number({
    defaultValue: 10,
    min: 0
  }),
  page: _configSchema.schema.number({
    defaultValue: 1,
    min: 1
  }),
  start: optionalDateFieldSchema,
  end: optionalDateFieldSchema,
  sort: _configSchema.schema.arrayOf(sortSchema, {
    defaultValue: [{
      sort_field: '@timestamp',
      sort_order: 'asc'
    }]
  }),
  filter: _configSchema.schema.maybe(_configSchema.schema.string())
});
exports.queryOptionsSchema = queryOptionsSchema;
// note that clusterClient may be null, indicating we can't write to ES
class EventLogClient {
  constructor({
    esContext,
    savedObjectGetter,
    spacesService,
    request
  }) {
    (0, _defineProperty2.default)(this, "esContext", void 0);
    (0, _defineProperty2.default)(this, "savedObjectGetter", void 0);
    (0, _defineProperty2.default)(this, "spacesService", void 0);
    (0, _defineProperty2.default)(this, "request", void 0);
    this.esContext = esContext;
    this.savedObjectGetter = savedObjectGetter;
    this.spacesService = spacesService;
    this.request = request;
  }
  async findEventsBySavedObjectIds(type, ids, options, legacyIds) {
    const findOptions = queryOptionsSchema.validate(options !== null && options !== void 0 ? options : {});

    // verify the user has the required permissions to view this saved object
    await this.savedObjectGetter(type, ids);
    return await this.esContext.esAdapter.queryEventsBySavedObjects({
      index: this.esContext.esNames.indexPattern,
      namespace: await this.getNamespace(),
      type,
      ids,
      findOptions,
      legacyIds
    });
  }
  async findEventsWithAuthFilter(type, ids, authFilter, namespace, options) {
    var _this$spacesService;
    if (!authFilter) {
      throw new Error('No authorization filter defined!');
    }
    const findOptions = queryOptionsSchema.validate(options !== null && options !== void 0 ? options : {});
    return await this.esContext.esAdapter.queryEventsWithAuthFilter({
      index: this.esContext.esNames.indexPattern,
      namespace: namespace ? (_this$spacesService = this.spacesService) === null || _this$spacesService === void 0 ? void 0 : _this$spacesService.spaceIdToNamespace(namespace) : await this.getNamespace(),
      type,
      ids,
      findOptions,
      authFilter
    });
  }
  async aggregateEventsBySavedObjectIds(type, ids, options, legacyIds) {
    var _omit;
    const aggs = options === null || options === void 0 ? void 0 : options.aggs;
    if (!aggs) {
      throw new Error('No aggregation defined!');
    }

    // validate other query options separately from
    const aggregateOptions = queryOptionsSchema.validate((_omit = (0, _lodash.omit)(options, 'aggs')) !== null && _omit !== void 0 ? _omit : {});

    // verify the user has the required permissions to view this saved object
    await this.savedObjectGetter(type, ids);
    return await this.esContext.esAdapter.aggregateEventsBySavedObjects({
      index: this.esContext.esNames.indexPattern,
      namespace: await this.getNamespace(),
      type,
      ids,
      aggregateOptions: {
        ...aggregateOptions,
        aggs
      },
      legacyIds
    });
  }
  async aggregateEventsWithAuthFilter(type, authFilter, options, namespaces) {
    var _omit2;
    if (!authFilter) {
      throw new Error('No authorization filter defined!');
    }
    const aggs = options === null || options === void 0 ? void 0 : options.aggs;
    if (!aggs) {
      throw new Error('No aggregation defined!');
    }

    // validate other query options separately from
    const aggregateOptions = queryOptionsSchema.validate((_omit2 = (0, _lodash.omit)(options, 'aggs')) !== null && _omit2 !== void 0 ? _omit2 : {});
    return await this.esContext.esAdapter.aggregateEventsWithAuthFilter({
      index: this.esContext.esNames.indexPattern,
      namespaces: namespaces !== null && namespaces !== void 0 ? namespaces : [await this.getNamespace()],
      type,
      authFilter,
      aggregateOptions: {
        ...aggregateOptions,
        aggs
      }
    });
  }
  async getNamespace() {
    var _this$spacesService2, _this$spacesService3;
    const space = await ((_this$spacesService2 = this.spacesService) === null || _this$spacesService2 === void 0 ? void 0 : _this$spacesService2.getActiveSpace(this.request));
    return space && ((_this$spacesService3 = this.spacesService) === null || _this$spacesService3 === void 0 ? void 0 : _this$spacesService3.spaceIdToNamespace(space.id));
  }
}
exports.EventLogClient = EventLogClient;