"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "normalizeNamespace", {
  enumerable: true,
  get: function () {
    return _get_descriptor_namespace.normalizeNamespace;
  }
});
exports.setupSavedObjects = setupSavedObjects;
var _pMap = _interopRequireDefault(require("p-map"));
var _encrypted_saved_objects_client_wrapper = require("./encrypted_saved_objects_client_wrapper");
var _get_descriptor_namespace = require("./get_descriptor_namespace");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function setupSavedObjects({
  service,
  savedObjects,
  security,
  getStartServices
}) {
  // Register custom saved object client that will encrypt, decrypt and strip saved object
  // attributes where appropriate for any saved object repository request. We choose max possible
  // priority for this wrapper to allow all other wrappers to set proper `namespace` for the Saved
  // Object (e.g. wrapper registered by the Spaces plugin) before we encrypt attributes since
  // `namespace` is included into AAD.
  savedObjects.addClientWrapper(Number.MAX_SAFE_INTEGER, 'encryptedSavedObjects', ({
    client: baseClient,
    typeRegistry: baseTypeRegistry,
    request
  }) => new _encrypted_saved_objects_client_wrapper.EncryptedSavedObjectsClientWrapper({
    baseClient,
    baseTypeRegistry,
    service,
    getCurrentUser: () => {
      var _security$authc$getCu;
      return (_security$authc$getCu = security === null || security === void 0 ? void 0 : security.authc.getCurrentUser(request)) !== null && _security$authc$getCu !== void 0 ? _security$authc$getCu : undefined;
    }
  }));
  return clientOpts => {
    const internalRepositoryAndTypeRegistryPromise = getStartServices().then(([core]) => [core.savedObjects.createInternalRepository(clientOpts === null || clientOpts === void 0 ? void 0 : clientOpts.includedHiddenTypes), core.savedObjects.getTypeRegistry()]);
    return {
      getDecryptedAsInternalUser: async (type, id, options) => {
        const [internalRepository, typeRegistry] = await internalRepositoryAndTypeRegistryPromise;
        const savedObject = await internalRepository.get(type, id, options);
        if (!service.isRegistered(savedObject.type)) {
          return savedObject;
        }
        return {
          ...savedObject,
          attributes: await service.decryptAttributes({
            type,
            id,
            namespace: (0, _get_descriptor_namespace.getDescriptorNamespace)(typeRegistry, type, options === null || options === void 0 ? void 0 : options.namespace)
          }, savedObject.attributes)
        };
      },
      createPointInTimeFinderDecryptedAsInternalUser: async (findOptions, dependencies) => {
        const [internalRepository, typeRegistry] = await internalRepositoryAndTypeRegistryPromise;
        const finder = internalRepository.createPointInTimeFinder(findOptions, dependencies);
        const finderAsyncGenerator = finder.find();
        async function* encryptedFinder() {
          for await (const res of finderAsyncGenerator) {
            const encryptedSavedObjects = await (0, _pMap.default)(res.saved_objects, async savedObject => {
              if (!service.isRegistered(savedObject.type)) {
                return savedObject;
              }
              const descriptor = {
                type: savedObject.type,
                id: savedObject.id,
                namespace: (0, _get_descriptor_namespace.getDescriptorNamespace)(typeRegistry, savedObject.type, findOptions.namespaces)
              };
              try {
                return {
                  ...savedObject,
                  attributes: await service.decryptAttributes(descriptor, savedObject.attributes)
                };
              } catch (error) {
                // catch error and enrich SO with it, return stripped attributes. Then consumer of API can decide either proceed
                // with only unsecured properties or stop when error happens
                const {
                  attributes: strippedAttrs
                } = await service.stripOrDecryptAttributes(descriptor, savedObject.attributes);
                return {
                  ...savedObject,
                  attributes: strippedAttrs,
                  error
                };
              }
            }, {
              concurrency: 50
            });
            yield {
              ...res,
              saved_objects: encryptedSavedObjects
            };
          }
        }
        return {
          find: () => encryptedFinder(),
          close: finder.close.bind(finder)
        };
      }
    };
  };
}