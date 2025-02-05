"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createList = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createList = async ({
  id,
  deserializer,
  serializer,
  name,
  type,
  description,
  esClient,
  listIndex,
  user,
  meta,
  dateNow,
  tieBreaker,
  immutable,
  version
}) => {
  const createdAt = dateNow !== null && dateNow !== void 0 ? dateNow : new Date().toISOString();
  const body = {
    created_at: createdAt,
    created_by: user,
    description,
    deserializer,
    immutable,
    meta,
    name,
    serializer,
    tie_breaker_id: tieBreaker !== null && tieBreaker !== void 0 ? tieBreaker : _uuid.default.v4(),
    type,
    updated_at: createdAt,
    updated_by: user,
    version
  };
  const response = await esClient.index({
    body,
    id,
    index: listIndex,
    refresh: 'wait_for'
  });
  return {
    _version: (0, _securitysolutionEsUtils.encodeHitVersion)(response),
    id: response._id,
    ...body
  };
};
exports.createList = createList;