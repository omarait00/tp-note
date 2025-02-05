"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCreateMigration = void 0;
var _semver = _interopRequireDefault(require("semver"));
var _crypto = require("./crypto");
var _saved_objects = require("./saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getCreateMigration = (encryptedSavedObjectsService, instantiateServiceWithLegacyType) => opts => {
  const {
    isMigrationNeededPredicate,
    migration,
    shouldMigrateIfDecryptionFails,
    inputType,
    migratedType
  } = opts;
  if (inputType && migratedType && inputType.type !== migratedType.type) {
    throw new Error(`An Invalid Encrypted Saved Objects migration is trying to migrate across types ("${inputType.type}" => "${migratedType.type}"), which isn't permitted`);
  }
  const inputService = inputType ? instantiateServiceWithLegacyType(inputType) : encryptedSavedObjectsService;
  const migratedService = migratedType ? instantiateServiceWithLegacyType(migratedType) : encryptedSavedObjectsService;
  return (encryptedDoc, context) => {
    if (!isMigrationNeededPredicate(encryptedDoc)) {
      return encryptedDoc;
    }

    // After it is converted, the object's old ID is stored in the `originId` field. In addition, objects that are imported a certain way
    // may have this field set, but it would not be necessary to use this to decrypt saved object attributes.
    const {
      type,
      id,
      originId
    } = encryptedDoc;

    // If an object is slated to be converted, it should be decrypted flexibly:
    // * If this is an index migration:
    //   a. If there is one or more pending migration _before_ the conversion, the object will be decrypted and re-encrypted with its
    //      namespace in the descriptor. Then, after the conversion, the object will be decrypted with its namespace and old ID in the
    //      descriptor and re-encrypted with its new ID (without a namespace) in the descriptor.
    //   b. If there are no pending migrations before the conversion, then after the conversion the object will be decrypted with its
    //      namespace and old ID in the descriptor and re-encrypted with its new ID (without a namespace) in the descriptor.
    // * If this is *not* an index migration, then it is a single document migration. In that case, the object will be decrypted and
    //   re-encrypted without a namespace in the descriptor.
    // To account for these different scenarios, when this field is set, the ESO service will attempt several different permutations of
    // the descriptor when decrypting the object.
    const isTypeBeingConverted = !!context.convertToMultiNamespaceTypeVersion && _semver.default.lte(context.migrationVersion, context.convertToMultiNamespaceTypeVersion);

    // This approximates the behavior of getDescriptorNamespace(); the intent is that if there is ever a case where a multi-namespace object
    // has the `namespace` field, it will not be encrypted with that field in its descriptor. It would be preferable to rely on
    // getDescriptorNamespace() here, but that requires the SO type registry which can only be retrieved from a promise, and this is not an
    // async function
    const descriptorNamespace = context.isSingleNamespaceType ? encryptedDoc.namespace : undefined;
    let decryptDescriptorNamespace = descriptorNamespace;

    // If an object has been converted right before this migration function is called, it will no longer have a `namespace` field, but it
    // will have a `namespaces` field; in that case, the first/only element in that array should be used as the namespace in the descriptor
    // during decryption.
    if (isTypeBeingConverted) {
      var _encryptedDoc$namespa;
      decryptDescriptorNamespace = (_encryptedDoc$namespa = encryptedDoc.namespaces) !== null && _encryptedDoc$namespa !== void 0 && _encryptedDoc$namespa.length ? (0, _saved_objects.normalizeNamespace)(encryptedDoc.namespaces[0]) // `namespaces` contains string values, but we need to normalize this to the namespace ID representation
      : encryptedDoc.namespace;
    }

    // These descriptors might have a `namespace` that is undefined. That is expected for multi-namespace and namespace-agnostic types.
    const decryptDescriptor = {
      id,
      type,
      namespace: decryptDescriptorNamespace
    };
    const encryptDescriptor = {
      id,
      type,
      namespace: descriptorNamespace
    };

    // decrypt the attributes using the input type definition
    // if an error occurs during decryption, use the shouldMigrateIfDecryptionFails flag
    // to determine whether to throw the error or continue the migration
    // if we are continuing the migration, strip encrypted attributes from the document using stripOrDecryptAttributesSync
    const documentToMigrate = mapAttributes(encryptedDoc, inputAttributes => {
      try {
        return inputService.decryptAttributesSync(decryptDescriptor, inputAttributes, {
          isTypeBeingConverted,
          originId
        });
      } catch (err) {
        if (!shouldMigrateIfDecryptionFails || !(err instanceof _crypto.EncryptionError)) {
          throw err;
        }
        context.log.warn(`Decryption failed for encrypted Saved Object "${encryptedDoc.id}" of type "${encryptedDoc.type}" with error: ${err.message}. Encrypted attributes have been stripped from the original document and migration will be applied but this may cause errors later on.`);
        return inputService.stripOrDecryptAttributesSync(decryptDescriptor, inputAttributes, {
          isTypeBeingConverted,
          originId
        }).attributes;
      }
    });

    // migrate and encrypt the document
    return mapAttributes(migration(documentToMigrate, context), migratedAttributes => {
      return migratedService.encryptAttributesSync(encryptDescriptor, migratedAttributes);
    });
  };
};
exports.getCreateMigration = getCreateMigration;
function mapAttributes(obj, mapper) {
  return Object.assign(obj, {
    attributes: mapper(obj.attributes)
  });
}