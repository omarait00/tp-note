"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExceptionsListItemGenerator = void 0;
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _securitysolutionUtils = require("@kbn/securitysolution-utils");
var _base_data_generator = require("./base_data_generator");
var _constants = require("../service/artifacts/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const exceptionItemToCreateExceptionItem = exceptionItem => {
  const {
    /* eslint-disable @typescript-eslint/naming-convention */
    description,
    entries,
    list_id,
    name,
    type,
    comments,
    item_id,
    meta,
    namespace_type,
    os_types,
    tags
    /* eslint-enable @typescript-eslint/naming-convention */
  } = exceptionItem;
  return {
    description,
    entries,
    list_id,
    name,
    type,
    comments,
    item_id,
    meta,
    namespace_type,
    os_types,
    tags
  };
};
const exceptionItemToUpdateExceptionItem = exceptionItem => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const {
    id,
    item_id,
    _version
  } = exceptionItem;
  const {
    list_id: _,
    ...updateAttributes
  } = exceptionItemToCreateExceptionItem(exceptionItem);
  return {
    ...updateAttributes,
    id,
    item_id,
    _version: _version !== null && _version !== void 0 ? _version : 'some value'
  };
};
const EFFECTIVE_SCOPE = [`${_constants.BY_POLICY_ARTIFACT_TAG_PREFIX}123-456`,
// Policy Specific
_constants.GLOBAL_ARTIFACT_TAG];
class ExceptionsListItemGenerator extends _base_data_generator.BaseDataGenerator {
  generate(overrides = {}) {
    const exceptionItem = {
      _version: this.randomString(5),
      comments: [],
      created_at: this.randomPastDate(),
      created_by: this.randomUser(),
      description: 'created by ExceptionListItemGenerator',
      entries: [{
        field: 'process.hash.md5',
        operator: 'included',
        type: 'match',
        value: '741462ab431a22233C787BAAB9B653C7'
      }],
      id: this.seededUUIDv4(),
      item_id: this.seededUUIDv4(),
      list_id: 'endpoint_list_id',
      meta: undefined,
      name: `Generated Exception (${this.randomString(5)})`,
      namespace_type: 'agnostic',
      os_types: [this.randomOSFamily()],
      tags: [this.randomChoice(EFFECTIVE_SCOPE)],
      tie_breaker_id: this.seededUUIDv4(),
      type: 'simple',
      updated_at: '2020-04-20T15:25:31.830Z',
      updated_by: this.randomUser(),
      ...(overrides || {})
    };

    // If the `entries` was not overwritten, then add in the PATH condition with a
    // value that is OS appropriate
    if (!overrides.entries) {
      exceptionItem.entries.push({
        field: _securitysolutionUtils.ConditionEntryField.PATH,
        operator: 'included',
        type: 'match',
        value: exceptionItem.os_types[0] === 'windows' ? 'c:\\fol\\bin.exe' : '/one/two/three'
      });
    }
    return exceptionItem;
  }
  generateForCreate(overrides = {}) {
    return Object.assign(exceptionItemToCreateExceptionItem(this.generate()), overrides);
  }
  generateTrustedApp(overrides = {}) {
    return this.generate({
      name: `Trusted app (${this.randomString(5)})`,
      list_id: _securitysolutionListConstants.ENDPOINT_TRUSTED_APPS_LIST_ID,
      ...overrides
    });
  }
  generateTrustedAppForCreate(overrides = {}) {
    return {
      ...exceptionItemToCreateExceptionItem(this.generateTrustedApp()),
      ...overrides
    };
  }
  generateTrustedAppForUpdate(overrides = {}) {
    return {
      ...exceptionItemToUpdateExceptionItem(this.generateTrustedApp()),
      ...overrides
    };
  }
  generateEventFilter(overrides = {}) {
    return this.generate({
      name: `Event filter (${this.randomString(5)})`,
      list_id: _securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_ID,
      entries: [{
        field: 'process.pe.company',
        operator: 'excluded',
        type: 'match',
        value: 'elastic'
      }, {
        entries: [{
          field: 'status',
          operator: 'included',
          type: 'match',
          value: 'dfdfd'
        }],
        field: 'process.Ext.code_signature',
        type: 'nested'
      }],
      ...overrides
    });
  }
  generateEventFilterForCreate(overrides = {}) {
    return {
      ...exceptionItemToCreateExceptionItem(this.generateEventFilter()),
      ...overrides
    };
  }
  generateEventFilterForUpdate(overrides = {}) {
    return {
      ...exceptionItemToUpdateExceptionItem(this.generateEventFilter()),
      ...overrides
    };
  }
  generateHostIsolationException(overrides = {}) {
    return this.generate({
      name: `Host Isolation (${this.randomString(5)})`,
      list_id: _securitysolutionListConstants.ENDPOINT_HOST_ISOLATION_EXCEPTIONS_LIST_ID,
      os_types: ['macos', 'linux', 'windows'],
      entries: [{
        field: 'destination.ip',
        operator: 'included',
        type: 'match',
        value: '0.0.0.0/24'
      }],
      ...overrides
    });
  }
  generateHostIsolationExceptionForCreate(overrides = {}) {
    return {
      ...exceptionItemToCreateExceptionItem(this.generateHostIsolationException()),
      ...overrides
    };
  }
  generateHostIsolationExceptionForUpdate(overrides = {}) {
    return {
      ...exceptionItemToUpdateExceptionItem(this.generateHostIsolationException()),
      ...overrides
    };
  }
  generateBlocklist(overrides = {}) {
    const os = this.randomOSFamily();
    const entriesList = [{
      field: 'file.path',
      value: os === 'windows' ? ['C:\\some\\path', 'C:\\some\\other\\path', 'C:\\yet\\another\\path'] : ['/some/path', 'some/other/path', 'yet/another/path'],
      type: 'match_any',
      operator: 'included'
    }, {
      field: 'file.hash.sha256',
      value: ['a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', '2C26B46B68FFC68FF99B453C1D30413413422D706483BFA0F98A5E886266E7AE', 'FCDE2B2EDBA56BF408601FB721FE9B5C338D10EE429EA04FAE5511B68FBF8FB9'],
      type: 'match_any',
      operator: 'included'
    }, {
      field: 'file.hash.md5',
      value: ['741462ab431a22233C787BAAB9B653C7'],
      type: 'match_any',
      operator: 'included'
    }, {
      field: 'file.hash.sha1',
      value: ['aedb279e378BED6C2DB3C9DC9e12ba635e0b391c'],
      type: 'match_any',
      operator: 'included'
    }];
    if (os === 'windows') {
      entriesList.push({
        field: 'file.Ext.code_signature',
        entries: [{
          field: 'subject_name',
          value: ['notsus.exe', 'verynotsus.exe', 'superlegit.exe'],
          type: 'match_any',
          operator: 'included'
        }],
        type: 'nested'
      });
    }
    return this.generate({
      name: `Blocklist ${this.randomString(5)}`,
      list_id: _securitysolutionListConstants.ENDPOINT_BLOCKLISTS_LIST_ID,
      item_id: `generator_endpoint_blocklist_${this.seededUUIDv4()}`,
      tags: [this.randomChoice([_constants.BY_POLICY_ARTIFACT_TAG_PREFIX, _constants.GLOBAL_ARTIFACT_TAG])],
      os_types: [os],
      entries: [entriesList[this.randomN(entriesList.length)]],
      ...overrides
    });
  }
  generateBlocklistForCreate(overrides = {}) {
    return {
      ...exceptionItemToCreateExceptionItem(this.generateBlocklist()),
      ...overrides
    };
  }
  generateBlocklistForUpdate(overrides = {}) {
    return {
      ...exceptionItemToUpdateExceptionItem(this.generateBlocklist()),
      ...overrides
    };
  }
}
exports.ExceptionsListItemGenerator = ExceptionsListItemGenerator;