"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExceptionItemLikeOptionsMock = exports.BaseValidatorMock = void 0;
var _mocks = require("../../../../../lists/server/mocks");
var _base_validator = require("./base_validator");
var _artifacts = require("../../../../common/endpoint/service/artifacts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Exposes all `protected` methods of `BaseValidator` by prefixing them with an underscore.
 */
class BaseValidatorMock extends _base_validator.BaseValidator {
  _isItemByPolicy(item) {
    return this.isItemByPolicy(item);
  }
  async _isAllowedToCreateArtifactsByPolicy() {
    return this.isAllowedToCreateArtifactsByPolicy();
  }
  async _validateCanManageEndpointArtifacts() {
    return this.validateCanManageEndpointArtifacts();
  }
  async _validateBasicData(item) {
    return this.validateBasicData(item);
  }
  async _validateCanCreateByPolicyArtifacts(item) {
    return this.validateCanCreateByPolicyArtifacts(item);
  }
  async _validateByPolicyItem(item) {
    return this.validateByPolicyItem(item);
  }
  _wasByPolicyEffectScopeChanged(updatedItem, currentItem) {
    return this.wasByPolicyEffectScopeChanged(updatedItem, currentItem);
  }
}
exports.BaseValidatorMock = BaseValidatorMock;
const createExceptionItemLikeOptionsMock = (overrides = {}) => {
  return {
    ..._mocks.listMock.getCreateExceptionListItemOptionsMock(),
    namespaceType: 'agnostic',
    osTypes: ['windows'],
    tags: [`${_artifacts.BY_POLICY_ARTIFACT_TAG_PREFIX}123`],
    ...overrides
  };
};
exports.createExceptionItemLikeOptionsMock = createExceptionItemLikeOptionsMock;