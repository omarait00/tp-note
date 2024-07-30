"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.persistableStateAttachmentStateOnly = exports.persistableStateAttachmentAttributesWithoutInjectedId = exports.persistableStateAttachmentAttributes = exports.persistableStateAttachment = exports.getPersistableAttachment = exports.getExternalReferenceAttachment = exports.externalReferenceAttachmentSOAttributesWithoutRefs = exports.externalReferenceAttachmentSOAttributes = exports.externalReferenceAttachmentSO = exports.externalReferenceAttachmentESAttributes = exports.externalReferenceAttachmentES = exports.createPersistableStateAttachmentTypeRegistryMock = exports.createExternalReferenceAttachmentTypeRegistryMock = void 0;
var _lodash = require("lodash");
var _common = require("../../common");
var _api = require("../../common/api");
var _external_reference_registry = require("./external_reference_registry");
var _persistable_state_registry = require("./persistable_state_registry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getPersistableAttachment = () => ({
  id: '.test',
  inject: (state, references) => ({
    ...state,
    persistableStateAttachmentState: {
      ...state.persistableStateAttachmentState,
      injectedId: 'testRef'
    }
  }),
  extract: state => ({
    state: {
      ...state,
      persistableStateAttachmentTypeId: '.test',
      persistableStateAttachmentState: {
        foo: 'foo'
      }
    },
    references: [{
      id: 'testRef',
      name: 'myTestReference',
      type: 'test-so'
    }]
  }),
  migrations: () => ({
    '8.4.0': state => ({
      persistableStateAttachmentTypeId: '.test',
      persistableStateAttachmentState: {
        migrated: true
      }
    })
  })
});
exports.getPersistableAttachment = getPersistableAttachment;
const getExternalReferenceAttachment = () => ({
  id: '.test'
});
exports.getExternalReferenceAttachment = getExternalReferenceAttachment;
const externalReferenceAttachmentSO = {
  type: _common.CommentType.externalReference,
  externalReferenceId: 'my-id',
  externalReferenceStorage: {
    type: _api.ExternalReferenceStorageType.savedObject,
    soType: 'test-so'
  },
  externalReferenceAttachmentTypeId: '.test',
  externalReferenceMetadata: null,
  owner: _common.SECURITY_SOLUTION_OWNER
};
exports.externalReferenceAttachmentSO = externalReferenceAttachmentSO;
const externalReferenceAttachmentES = {
  type: _common.CommentType.externalReference,
  externalReferenceId: 'my-id',
  externalReferenceStorage: {
    type: _api.ExternalReferenceStorageType.elasticSearchDoc
  },
  externalReferenceAttachmentTypeId: '.test',
  externalReferenceMetadata: null,
  owner: _common.SECURITY_SOLUTION_OWNER
};
exports.externalReferenceAttachmentES = externalReferenceAttachmentES;
const externalReferenceAttachmentSOAttributes = {
  ...externalReferenceAttachmentSO,
  created_at: '2019-11-25T22:32:30.608Z',
  created_by: {
    full_name: 'elastic',
    email: 'testemail@elastic.co',
    username: 'elastic'
  },
  updated_at: null,
  updated_by: null,
  pushed_at: null,
  pushed_by: null
};
exports.externalReferenceAttachmentSOAttributes = externalReferenceAttachmentSOAttributes;
const externalReferenceAttachmentESAttributes = {
  ...externalReferenceAttachmentES,
  created_at: '2019-11-25T22:32:30.608Z',
  created_by: {
    full_name: 'elastic',
    email: 'testemail@elastic.co',
    username: 'elastic'
  },
  updated_at: null,
  updated_by: null,
  pushed_at: null,
  pushed_by: null
};
exports.externalReferenceAttachmentESAttributes = externalReferenceAttachmentESAttributes;
const persistableStateAttachmentStateOnly = {
  persistableStateAttachmentTypeId: '.test',
  persistableStateAttachmentState: {
    foo: 'foo',
    injectedId: 'testRef'
  }
};
exports.persistableStateAttachmentStateOnly = persistableStateAttachmentStateOnly;
const persistableStateAttachment = {
  ...persistableStateAttachmentStateOnly,
  type: _common.CommentType.persistableState,
  owner: 'securitySolutionFixture'
};
exports.persistableStateAttachment = persistableStateAttachment;
const persistableStateAttachmentAttributes = {
  ...persistableStateAttachment,
  type: _common.CommentType.persistableState,
  owner: 'securitySolutionFixture',
  created_at: '2019-11-25T22:32:30.608Z',
  created_by: {
    full_name: 'elastic',
    email: 'testemail@elastic.co',
    username: 'elastic'
  },
  updated_at: null,
  updated_by: null,
  pushed_at: null,
  pushed_by: null
};
exports.persistableStateAttachmentAttributes = persistableStateAttachmentAttributes;
const persistableStateAttachmentAttributesWithoutInjectedId = (0, _lodash.omit)(persistableStateAttachmentAttributes, 'persistableStateAttachmentState.injectedId');
exports.persistableStateAttachmentAttributesWithoutInjectedId = persistableStateAttachmentAttributesWithoutInjectedId;
const externalReferenceAttachmentSOAttributesWithoutRefs = (0, _lodash.omit)(externalReferenceAttachmentSOAttributes, 'externalReferenceId');
exports.externalReferenceAttachmentSOAttributesWithoutRefs = externalReferenceAttachmentSOAttributesWithoutRefs;
const createPersistableStateAttachmentTypeRegistryMock = () => {
  const persistableStateAttachmentTypeRegistry = new _persistable_state_registry.PersistableStateAttachmentTypeRegistry();
  persistableStateAttachmentTypeRegistry.register(getPersistableAttachment());
  return persistableStateAttachmentTypeRegistry;
};
exports.createPersistableStateAttachmentTypeRegistryMock = createPersistableStateAttachmentTypeRegistryMock;
const createExternalReferenceAttachmentTypeRegistryMock = () => {
  const externalReferenceAttachmentTypeRegistry = new _external_reference_registry.ExternalReferenceAttachmentTypeRegistry();
  externalReferenceAttachmentTypeRegistry.register(getExternalReferenceAttachment());
  return externalReferenceAttachmentTypeRegistry;
};
exports.createExternalReferenceAttachmentTypeRegistryMock = createExternalReferenceAttachmentTypeRegistryMock;