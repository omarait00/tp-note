"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isArtifactGlobal = exports.isArtifactByPolicy = exports.getPolicyIdsFromArtifact = exports.createExceptionListItemForCreate = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const POLICY_ID_START_POSITION = _constants.BY_POLICY_ARTIFACT_TAG_PREFIX.length;
const isArtifactGlobal = item => {
  var _item$tags;
  return ((_item$tags = item.tags) !== null && _item$tags !== void 0 ? _item$tags : []).find(tag => tag === _constants.GLOBAL_ARTIFACT_TAG) !== undefined;
};
exports.isArtifactGlobal = isArtifactGlobal;
const isArtifactByPolicy = item => {
  return !isArtifactGlobal(item);
};
exports.isArtifactByPolicy = isArtifactByPolicy;
const getPolicyIdsFromArtifact = item => {
  var _item$tags2;
  const policyIds = [];
  const tags = (_item$tags2 = item.tags) !== null && _item$tags2 !== void 0 ? _item$tags2 : [];
  for (const tag of tags) {
    if (tag !== _constants.GLOBAL_ARTIFACT_TAG && tag.startsWith(_constants.BY_POLICY_ARTIFACT_TAG_PREFIX)) {
      policyIds.push(tag.substring(POLICY_ID_START_POSITION));
    }
  }
  return policyIds;
};
exports.getPolicyIdsFromArtifact = getPolicyIdsFromArtifact;
const createExceptionListItemForCreate = listId => {
  return {
    comments: [],
    description: '',
    entries: [],
    item_id: undefined,
    list_id: listId,
    meta: {
      temporaryUuid: _uuid.default.v4()
    },
    name: '',
    namespace_type: 'agnostic',
    tags: [_constants.GLOBAL_ARTIFACT_TAG],
    type: 'simple',
    os_types: ['windows']
  };
};
exports.createExceptionListItemForCreate = createExceptionListItemForCreate;