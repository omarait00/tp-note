"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveLogView = void 0;
var _constants = require("../constants");
var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const resolveLogView = async (logViewId, logViewAttributes, dataViewsService, config) => {
  if (logViewAttributes.logIndices.type === 'index_name') {
    return await resolveLegacyReference(logViewId, logViewAttributes, dataViewsService, config);
  } else {
    return await resolveDataViewReference(logViewAttributes, dataViewsService);
  }
};
exports.resolveLogView = resolveLogView;
const resolveLegacyReference = async (logViewId, logViewAttributes, dataViewsService, config) => {
  if (logViewAttributes.logIndices.type !== 'index_name') {
    throw new Error('This function can only resolve legacy references');
  }
  const indices = logViewAttributes.logIndices.indexName;
  const dataViewReference = await dataViewsService.create({
    id: `log-view-${logViewId}`,
    title: indices,
    timeFieldName: _constants.TIMESTAMP_FIELD,
    allowNoIndex: true
  }, false, false).catch(error => {
    throw new _errors.ResolveLogViewError(`Failed to create Data View reference: ${error}`, error);
  });
  return {
    indices,
    timestampField: _constants.TIMESTAMP_FIELD,
    tiebreakerField: _constants.TIEBREAKER_FIELD,
    messageField: config.messageFields,
    fields: dataViewReference.fields,
    runtimeMappings: {},
    columns: logViewAttributes.logColumns,
    name: logViewAttributes.name,
    description: logViewAttributes.description,
    dataViewReference
  };
};
const resolveDataViewReference = async (logViewAttributes, dataViewsService) => {
  var _dataView$timeFieldNa;
  if (logViewAttributes.logIndices.type !== 'data_view') {
    throw new Error('This function can only resolve Kibana data view references');
  }
  const {
    dataViewId
  } = logViewAttributes.logIndices;
  const dataView = await dataViewsService.get(dataViewId).catch(error => {
    throw new _errors.ResolveLogViewError(`Failed to fetch data view "${dataViewId}": ${error}`, error);
  });
  return {
    indices: dataView.title,
    timestampField: (_dataView$timeFieldNa = dataView.timeFieldName) !== null && _dataView$timeFieldNa !== void 0 ? _dataView$timeFieldNa : _constants.TIMESTAMP_FIELD,
    tiebreakerField: _constants.TIEBREAKER_FIELD,
    messageField: ['message'],
    fields: dataView.fields,
    runtimeMappings: resolveRuntimeMappings(dataView),
    columns: logViewAttributes.logColumns,
    name: logViewAttributes.name,
    description: logViewAttributes.description,
    dataViewReference: dataView
  };
};

// this might take other sources of runtime fields into account in the future
const resolveRuntimeMappings = dataView => {
  return dataView.getRuntimeMappings();
};