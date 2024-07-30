"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HostIsolationExceptionsValidator = void 0;
var _configSchema = require("@kbn/config-schema");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _securitysolutionUtils = require("@kbn/securitysolution-utils");
var _base_validator = require("./base_validator");
var _errors = require("./errors");
var _is_valid_ip = require("../../../../common/endpoint/utils/is_valid_ip");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function validateIp(value) {
  if (!(0, _is_valid_ip.isValidIPv4OrCIDR)(value)) {
    return `invalid ip: ${value}`;
  }
}
const EntrySchema = _configSchema.schema.object({
  field: _configSchema.schema.literal('destination.ip'),
  operator: _configSchema.schema.literal('included'),
  type: _configSchema.schema.literal('match'),
  value: _configSchema.schema.string({
    validate: validateIp
  })
});
const HostIsolationDataSchema = _configSchema.schema.object({
  entries: _configSchema.schema.arrayOf(EntrySchema, {
    minSize: 1,
    maxSize: 1
  })
}, {
  unknowns: 'ignore'
});

// use the baseSchema and overwrite the os_type
// to accept all OSs in the list for host isolation exception
const HostIsolationBasicDataSchema = _base_validator.BasicEndpointExceptionDataSchema.extends({
  osTypes: _configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.literal(_securitysolutionUtils.OperatingSystem.WINDOWS), _configSchema.schema.literal(_securitysolutionUtils.OperatingSystem.LINUX), _configSchema.schema.literal(_securitysolutionUtils.OperatingSystem.MAC)]), {
    minSize: 3,
    maxSize: 3
  })
});
class HostIsolationExceptionsValidator extends _base_validator.BaseValidator {
  static isHostIsolationException(item) {
    return item.listId === _securitysolutionListConstants.ENDPOINT_HOST_ISOLATION_EXCEPTIONS_LIST_ID;
  }

  // TODO: 8.7 rbac
  // protected async validateHasWritePrivilege(): Promise<void> {
  //   return super.validateHasPrivilege('canWriteHostIsolationExceptions');
  // }

  // TODO: 8.7 rbac
  // protected async validateHasReadPrivilege(): Promise<void> {
  //   return super.validateHasPrivilege('canReadHostIsolationExceptions');
  // }

  async validatePreCreateItem(item) {
    // TODO add this to 8.7 rbac await this.validateHasWritePrivilege();
    await this.validateCanIsolateHosts();
    await this.validateHostIsolationData(item);
    await this.validateByPolicyItem(item);
    return item;
  }
  async validatePreUpdateItem(_updatedItem) {
    const updatedItem = _updatedItem;

    // TODO add this to 8.7 rbac add
    // await this.validateHasWritePrivilege();
    await this.validateCanIsolateHosts();
    await this.validateHostIsolationData(updatedItem);
    await this.validateByPolicyItem(updatedItem);
    return _updatedItem;
  }
  async validatePreGetOneItem() {
    // TODO: for 8.7 rbac replace with
    // await this.validateHasReadPrivilege();
    await this.validateCanManageEndpointArtifacts();
  }
  async validatePreSummary() {
    // TODO: for 8.7 rbac replace with
    // await this.validateHasReadPrivilege();
    await this.validateCanManageEndpointArtifacts();
  }
  async validatePreDeleteItem() {
    // TODO: for 8.7 rbac replace with
    // await this.validateHasWritePrivilege();
    await this.validateCanManageEndpointArtifacts();
  }
  async validatePreExport() {
    // TODO: for 8.7 rbac replace with
    // await this.validateHasReadPrivilege();
    await this.validateCanManageEndpointArtifacts();
  }
  async validatePreSingleListFind() {
    // TODO: for 8.7 rbac replace with
    // await this.validateHasReadPrivilege();
    await this.validateCanManageEndpointArtifacts();
  }
  async validatePreMultiListFind() {
    // TODO: for 8.7 rbac replace with
    // await this.validateHasReadPrivilege();
    await this.validateCanManageEndpointArtifacts();
  }
  async validatePreImport() {
    throw new _errors.EndpointArtifactExceptionValidationError('Import is not supported for Endpoint artifact exceptions');
  }
  async validateHostIsolationData(item) {
    try {
      HostIsolationBasicDataSchema.validate(item);
      HostIsolationDataSchema.validate(item);
    } catch (error) {
      throw new _errors.EndpointArtifactExceptionValidationError(error.message);
    }
  }
}
exports.HostIsolationExceptionsValidator = HostIsolationExceptionsValidator;