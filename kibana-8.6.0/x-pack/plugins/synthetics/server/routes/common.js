"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMonitorsQueryFiltered = exports.getMonitors = exports.getKqlFilter = exports.findLocationItem = exports.SEARCH_FIELDS = exports.QuerySchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _saved_objects = require("../../common/types/saved_objects");
var _synthetics_monitor = require("../legacy_uptime/lib/saved_objects/synthetics_monitor");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const QuerySchema = _configSchema.schema.object({
  page: _configSchema.schema.maybe(_configSchema.schema.number()),
  perPage: _configSchema.schema.maybe(_configSchema.schema.number()),
  sortField: _configSchema.schema.maybe(_configSchema.schema.string()),
  sortOrder: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('desc'), _configSchema.schema.literal('asc')])),
  query: _configSchema.schema.maybe(_configSchema.schema.string()),
  filter: _configSchema.schema.maybe(_configSchema.schema.string()),
  tags: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
  monitorType: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
  locations: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
  status: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
  fields: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  searchAfter: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
});
exports.QuerySchema = QuerySchema;
const SEARCH_FIELDS = ['name', 'tags.text', 'locations.id.text', 'locations.label', 'urls', 'hosts', 'project_id.text'];
exports.SEARCH_FIELDS = SEARCH_FIELDS;
const getMonitors = (request, syntheticsService, savedObjectsClient) => {
  const {
    perPage = 50,
    page,
    sortField,
    sortOrder,
    query,
    tags,
    monitorType,
    locations,
    filter = '',
    fields,
    searchAfter
  } = request;
  const locationFilter = parseLocationFilter(syntheticsService.locations, locations);
  const filterStr = [filter, getKqlFilter({
    field: 'tags',
    values: tags
  }), getKqlFilter({
    field: 'type',
    values: monitorType
  }), getKqlFilter({
    field: 'locations.id',
    values: locationFilter
  })].filter(f => !!f).join(' AND ');
  return savedObjectsClient.find({
    type: _synthetics_monitor.syntheticsMonitorType,
    perPage,
    page,
    sortField: sortField === 'schedule.keyword' ? 'schedule.number' : sortField,
    sortOrder,
    searchFields: SEARCH_FIELDS,
    search: query ? `${query}*` : undefined,
    filter: filterStr,
    fields,
    searchAfter
  });
};
exports.getMonitors = getMonitors;
const getKqlFilter = ({
  field,
  values,
  operator = 'OR',
  searchAtRoot = false
}) => {
  if (!values) {
    return '';
  }
  let fieldKey = '';
  if (searchAtRoot) {
    fieldKey = `${field}`;
  } else {
    fieldKey = `${_saved_objects.monitorAttributes}.${field}`;
  }
  if (Array.isArray(values)) {
    return `${fieldKey}:"${values.join(`" ${operator} ${fieldKey}:"`)}"`;
  }
  return `${fieldKey}:"${values}"`;
};
exports.getKqlFilter = getKqlFilter;
const parseLocationFilter = (serviceLocations, locations) => {
  var _findLocationItem$id2, _findLocationItem2;
  if (!locations) {
    return '';
  }
  if (Array.isArray(locations)) {
    return locations.map(loc => {
      var _findLocationItem$id, _findLocationItem;
      return (_findLocationItem$id = (_findLocationItem = findLocationItem(loc, serviceLocations)) === null || _findLocationItem === void 0 ? void 0 : _findLocationItem.id) !== null && _findLocationItem$id !== void 0 ? _findLocationItem$id : '';
    }).filter(val => !val);
  }
  return (_findLocationItem$id2 = (_findLocationItem2 = findLocationItem(locations, serviceLocations)) === null || _findLocationItem2 === void 0 ? void 0 : _findLocationItem2.id) !== null && _findLocationItem$id2 !== void 0 ? _findLocationItem$id2 : '';
};
const findLocationItem = (query, locations) => {
  return locations.find(({
    id,
    label
  }) => query === id || label === query);
};

/**
 * Returns whether the query is likely to return a subset of monitor objects.
 * Useful where `absoluteTotal` needs to be determined with a separate call
 * @param monitorQuery { MonitorsQuery }
 */
exports.findLocationItem = findLocationItem;
const isMonitorsQueryFiltered = monitorQuery => {
  const {
    query,
    tags,
    monitorType,
    locations,
    status,
    filter
  } = monitorQuery;
  return !!query || !!filter || !!(locations !== null && locations !== void 0 && locations.length) || !!(monitorType !== null && monitorType !== void 0 && monitorType.length) || !!(tags !== null && tags !== void 0 && tags.length) || !!(status !== null && status !== void 0 && status.length);
};
exports.isMonitorsQueryFiltered = isMonitorsQueryFiltered;