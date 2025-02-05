"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventFilterValidator = void 0;
var _configSchema = require("@kbn/config-schema");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _exceptionable_endpoint_event_fields = require("../../../../common/endpoint/exceptions/exceptionable_endpoint_event_fields");
var _base_validator = require("./base_validator");
var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function validateField(field) {
  if (!_exceptionable_endpoint_event_fields.EXCEPTIONABLE_ENDPOINT_EVENT_FIELDS.includes(field)) {
    return `invalid field: ${field}`;
  }
}
const EventFilterDataSchema = _configSchema.schema.object({
  entries: _configSchema.schema.arrayOf(_configSchema.schema.object({
    field: _configSchema.schema.string({
      validate: validateField
    })
  }, {
    unknowns: 'ignore'
  }), {
    minSize: 1
  })
}, {
  unknowns: 'ignore'
});
class EventFilterValidator extends _base_validator.BaseValidator {
  static isEventFilter(item) {
    return item.listId === _securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_ID;
  }
  async validateHasWritePrivilege() {
    return super.validateHasPrivilege('canWriteEventFilters');
  }
  async validateHasReadPrivilege() {
    return super.validateHasPrivilege('canReadEventFilters');
  }
  async validatePreCreateItem(item) {
    await this.validateHasWritePrivilege();
    await this.validateEventFilterData(item);

    // user can always create a global entry so additional checks not needed
    if (this.isItemByPolicy(item)) {
      await this.validateCanCreateByPolicyArtifacts(item);
      await this.validateByPolicyItem(item);
    }
    return item;
  }
  async validatePreUpdateItem(_updatedItem, currentItem) {
    const updatedItem = _updatedItem;
    await this.validateHasWritePrivilege();
    await this.validateEventFilterData(updatedItem);
    try {
      await this.validateCanCreateByPolicyArtifacts(updatedItem);
    } catch (noByPolicyAuthzError) {
      // Not allowed to create/update by policy data. Validate that the effective scope of the item
      // remained unchanged with this update or was set to `global` (only allowed update). If not,
      // then throw the validation error that was catch'ed
      if (this.wasByPolicyEffectScopeChanged(updatedItem, currentItem)) {
        throw noByPolicyAuthzError;
      }
    }
    await this.validateByPolicyItem(updatedItem);
    return _updatedItem;
  }
  async validateEventFilterData(item) {
    await this.validateBasicData(item);
    try {
      EventFilterDataSchema.validate(item);
    } catch (error) {
      throw new _errors.EndpointArtifactExceptionValidationError(error.message);
    }
  }
  async validatePreGetOneItem() {
    await this.validateHasReadPrivilege();
  }
  async validatePreSummary() {
    await this.validateHasReadPrivilege();
  }
  async validatePreDeleteItem() {
    await this.validateHasWritePrivilege();
  }
  async validatePreExport() {
    await this.validateHasReadPrivilege();
  }
  async validatePreSingleListFind() {
    await this.validateHasReadPrivilege();
  }
  async validatePreMultiListFind() {
    await this.validateHasReadPrivilege();
  }
  async validatePreImport() {
    throw new _errors.EndpointArtifactExceptionValidationError('Import is not supported for Endpoint artifact exceptions');
  }
}
exports.EventFilterValidator = EventFilterValidator;