"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStopTransformsResponseSchema = exports.isStartTransformsResponseSchema = exports.isResetTransformsResponseSchema = exports.isPutTransformsResponseSchema = exports.isPostTransformsUpdateResponseSchema = exports.isPostTransformsPreviewResponseSchema = exports.isMultiBucketAggregate = exports.isGetTransformsStatsResponseSchema = exports.isGetTransformsResponseSchema = exports.isGetTransformsAuditMessagesResponseSchema = exports.isGetTransformNodesResponseSchema = exports.isFieldHistogramsResponseSchema = exports.isEsSearchResponseWithAggregations = exports.isEsSearchResponse = exports.isEsIngestPipelines = exports.isEsIndices = exports.isDeleteTransformsResponseSchema = void 0;
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isGenericResponseSchema = arg => {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['count', 'transforms']) && Array.isArray(arg.transforms);
};
const isGetTransformNodesResponseSchema = arg => {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['count']) && typeof arg.count === 'number';
};
exports.isGetTransformNodesResponseSchema = isGetTransformNodesResponseSchema;
const isGetTransformsResponseSchema = arg => {
  return isGenericResponseSchema(arg);
};
exports.isGetTransformsResponseSchema = isGetTransformsResponseSchema;
const isGetTransformsStatsResponseSchema = arg => {
  return isGenericResponseSchema(arg);
};
exports.isGetTransformsStatsResponseSchema = isGetTransformsStatsResponseSchema;
const isDeleteTransformsResponseSchema = arg => {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg) && Object.values(arg).every(d => (0, _mlIsPopulatedObject.isPopulatedObject)(d, ['transformDeleted']));
};
exports.isDeleteTransformsResponseSchema = isDeleteTransformsResponseSchema;
const isResetTransformsResponseSchema = arg => {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg) && Object.values(arg).every(d => (0, _mlIsPopulatedObject.isPopulatedObject)(d, ['transformReset']));
};
exports.isResetTransformsResponseSchema = isResetTransformsResponseSchema;
const isEsIndices = arg => {
  return Array.isArray(arg);
};
exports.isEsIndices = isEsIndices;
const isEsIngestPipelines = arg => {
  return Array.isArray(arg) && arg.every(d => (0, _mlIsPopulatedObject.isPopulatedObject)(d, ['name']));
};
exports.isEsIngestPipelines = isEsIngestPipelines;
const isEsSearchResponse = arg => {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['hits']);
};
exports.isEsSearchResponse = isEsSearchResponse;
const isEsSearchResponseWithAggregations = arg => {
  return isEsSearchResponse(arg) && {}.hasOwnProperty.call(arg, 'aggregations');
};
exports.isEsSearchResponseWithAggregations = isEsSearchResponseWithAggregations;
const isMultiBucketAggregate = arg => {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['buckets']);
};
exports.isMultiBucketAggregate = isMultiBucketAggregate;
const isFieldHistogramsResponseSchema = arg => {
  return Array.isArray(arg);
};
exports.isFieldHistogramsResponseSchema = isFieldHistogramsResponseSchema;
const isGetTransformsAuditMessagesResponseSchema = arg => {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['messages', 'total']);
};
exports.isGetTransformsAuditMessagesResponseSchema = isGetTransformsAuditMessagesResponseSchema;
const isPostTransformsPreviewResponseSchema = arg => {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['generated_dest_index', 'preview']) && typeof arg.generated_dest_index !== undefined && Array.isArray(arg.preview);
};
exports.isPostTransformsPreviewResponseSchema = isPostTransformsPreviewResponseSchema;
const isPostTransformsUpdateResponseSchema = arg => {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['id']) && typeof arg.id === 'string';
};
exports.isPostTransformsUpdateResponseSchema = isPostTransformsUpdateResponseSchema;
const isPutTransformsResponseSchema = arg => {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg, ['transformsCreated', 'errors']) && Array.isArray(arg.transformsCreated) && Array.isArray(arg.errors);
};
exports.isPutTransformsResponseSchema = isPutTransformsResponseSchema;
const isGenericSuccessResponseSchema = arg => (0, _mlIsPopulatedObject.isPopulatedObject)(arg) && Object.values(arg).every(d => (0, _mlIsPopulatedObject.isPopulatedObject)(d, ['success']));
const isStartTransformsResponseSchema = arg => {
  return isGenericSuccessResponseSchema(arg);
};
exports.isStartTransformsResponseSchema = isStartTransformsResponseSchema;
const isStopTransformsResponseSchema = arg => {
  return isGenericSuccessResponseSchema(arg);
};
exports.isStopTransformsResponseSchema = isStopTransformsResponseSchema;