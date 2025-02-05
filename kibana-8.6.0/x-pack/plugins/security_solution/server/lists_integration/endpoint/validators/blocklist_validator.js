"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlocklistValidator = void 0;
var _lodash = require("lodash");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _configSchema = require("@kbn/config-schema");
var _securitysolutionUtils = require("@kbn/securitysolution-utils");
var _base_validator = require("./base_validator");
var _validations = require("../../../../common/endpoint/service/artifacts/validations");
var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const allowedHashes = ['file.hash.md5', 'file.hash.sha1', 'file.hash.sha256'];
const FileHashField = _configSchema.schema.oneOf(allowedHashes.map(hash => _configSchema.schema.literal(hash)));
const FilePath = _configSchema.schema.literal('file.path');
const FileCodeSigner = _configSchema.schema.literal('file.Ext.code_signature');
const ConditionEntryTypeSchema = _configSchema.schema.literal('match_any');
const ConditionEntryOperatorSchema = _configSchema.schema.literal('included');
/*
 * A generic Entry schema to be used for a specific entry schema depending on the OS
 */
const CommonEntrySchema = {
  field: _configSchema.schema.oneOf([FileHashField, FilePath]),
  type: ConditionEntryTypeSchema,
  operator: ConditionEntryOperatorSchema,
  // If field === HASH then validate hash with custom method, else validate string with minLength = 1
  value: _configSchema.schema.conditional(_configSchema.schema.siblingRef('field'), FileHashField, _configSchema.schema.arrayOf(_configSchema.schema.string({
    validate: hash => (0, _validations.isValidHash)(hash) ? undefined : `invalid hash value [${hash}]`
  }), {
    minSize: 1
  }), _configSchema.schema.conditional(_configSchema.schema.siblingRef('field'), FilePath, _configSchema.schema.arrayOf(_configSchema.schema.string({
    validate: pathValue => pathValue.length > 0 ? undefined : `invalid path value [${pathValue}]`
  }), {
    minSize: 1
  }), _configSchema.schema.arrayOf(_configSchema.schema.string({
    validate: signerValue => signerValue.length > 0 ? undefined : `invalid signer value [${signerValue}]`
  }), {
    minSize: 1
  })))
};

// Windows Signer entries use a Nested field that checks to ensure
// that the certificate is trusted
const WindowsSignerEntrySchema = _configSchema.schema.object({
  type: _configSchema.schema.literal('nested'),
  field: FileCodeSigner,
  entries: _configSchema.schema.arrayOf(_configSchema.schema.object({
    field: _configSchema.schema.literal('subject_name'),
    value: _configSchema.schema.arrayOf(_configSchema.schema.string({
      minLength: 1
    })),
    type: _configSchema.schema.literal('match_any'),
    operator: _configSchema.schema.literal('included')
  }), {
    minSize: 1
  })
});
const WindowsEntrySchema = _configSchema.schema.oneOf([WindowsSignerEntrySchema, _configSchema.schema.object({
  ...CommonEntrySchema,
  field: _configSchema.schema.oneOf([FileHashField, FilePath])
})]);
const LinuxEntrySchema = _configSchema.schema.object({
  ...CommonEntrySchema
});
const MacEntrySchema = _configSchema.schema.object({
  ...CommonEntrySchema
});

// Hash entries validator method.
const hashEntriesValidation = entries => {
  const currentHashes = entries.map(entry => entry.field);
  // If there are more hashes than allowed (three) then return an error
  if (currentHashes.length > allowedHashes.length) {
    const allowedHashesMessage = allowedHashes.map(hash => hash.replace('file.hash.', '')).join(',');
    return `There are more hash types than allowed [${allowedHashesMessage}]`;
  }
  const hashesCount = {};
  const invalidHash = [];

  // Check hash entries individually
  currentHashes.forEach(hash => {
    if (!allowedHashes.includes(hash)) invalidHash.push(hash);
    hashesCount[hash] = true;
  });

  // There is an entry with an invalid hash type
  if (invalidHash.length) {
    return `There are some invalid fields for hash type: ${invalidHash.join(',')}`;
  }
};

// Validate there is only one entry when signer or path and the allowed entries for hashes
const entriesSchemaOptions = {
  minSize: 1,
  validate(entries) {
    if (allowedHashes.includes(entries[0].field)) {
      return hashEntriesValidation(entries);
    } else {
      if (entries.length > 1) {
        return 'Only one entry is allowed when not using hash field type';
      }
    }
  }
};

/*
 * Entities array schema depending on Os type using schema.conditional.
 * If OS === WINDOWS then use Windows schema,
 * else if OS === LINUX then use Linux schema,
 * else use Mac schema
 *
 * The validate function checks there is only one item for entries excepts for hash
 */
const EntriesSchema = _configSchema.schema.conditional(_configSchema.schema.contextRef('os'), _securitysolutionUtils.OperatingSystem.WINDOWS, _configSchema.schema.arrayOf(WindowsEntrySchema, entriesSchemaOptions), _configSchema.schema.conditional(_configSchema.schema.contextRef('os'), _securitysolutionUtils.OperatingSystem.LINUX, _configSchema.schema.arrayOf(LinuxEntrySchema, entriesSchemaOptions), _configSchema.schema.arrayOf(MacEntrySchema, entriesSchemaOptions)));

/**
 * Schema to validate Blocklist data for create and update.
 * When called, it must be given an `context` with a `os` property set
 *
 * @example
 *
 * BlocklistDataSchema.validate(item, { os: 'windows' });
 */
const BlocklistDataSchema = _configSchema.schema.object({
  entries: EntriesSchema
},
// Because we are only validating some fields from the Exception Item, we set `unknowns` to `ignore` here
{
  unknowns: 'ignore'
});
function removeDuplicateEntryValues(entries) {
  return entries.map(entry => {
    const nextEntry = (0, _lodash.cloneDeep)(entry);
    if (nextEntry.type === 'match_any') {
      nextEntry.value = (0, _lodash.uniq)(nextEntry.value);
    } else if (nextEntry.type === 'nested') {
      removeDuplicateEntryValues(nextEntry.entries);
    }
    return nextEntry;
  });
}
class BlocklistValidator extends _base_validator.BaseValidator {
  static isBlocklist(item) {
    return item.listId === _securitysolutionListConstants.ENDPOINT_BLOCKLISTS_LIST_ID;
  }
  async validateHasWritePrivilege() {
    return super.validateHasPrivilege('canWriteBlocklist');
  }
  async validateHasReadPrivilege() {
    return super.validateHasPrivilege('canReadBlocklist');
  }
  async validatePreCreateItem(item) {
    await this.validateHasWritePrivilege();
    item.entries = removeDuplicateEntryValues(item.entries);
    await this.validateBlocklistData(item);
    await this.validateCanCreateByPolicyArtifacts(item);
    await this.validateByPolicyItem(item);
    return item;
  }
  async validatePreDeleteItem() {
    await this.validateHasWritePrivilege();
  }
  async validatePreGetOneItem() {
    await this.validateHasReadPrivilege();
  }
  async validatePreMultiListFind() {
    await this.validateHasReadPrivilege();
  }
  async validatePreExport() {
    await this.validateHasReadPrivilege();
  }
  async validatePreSingleListFind() {
    await this.validateHasReadPrivilege();
  }
  async validatePreGetListSummary() {
    await this.validateHasReadPrivilege();
  }
  async validatePreUpdateItem(_updatedItem, currentItem) {
    const updatedItem = _updatedItem;
    await this.validateHasWritePrivilege();
    _updatedItem.entries = removeDuplicateEntryValues(_updatedItem.entries);
    await this.validateBlocklistData(updatedItem);
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
  async validateBlocklistData(item) {
    await this.validateBasicData(item);
    try {
      BlocklistDataSchema.validate(item, {
        os: item.osTypes[0]
      });
    } catch (error) {
      throw new _errors.EndpointArtifactExceptionValidationError(error.message);
    }
  }
}
exports.BlocklistValidator = BlocklistValidator;