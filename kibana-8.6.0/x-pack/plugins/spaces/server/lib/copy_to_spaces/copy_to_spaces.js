"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copySavedObjectsToSpacesFactory = copySavedObjectsToSpacesFactory;
var _constants = require("../../../common/constants");
var _namespace = require("../utils/namespace");
var _create_empty_failure_response = require("./lib/create_empty_failure_response");
var _get_ineligible_types = require("./lib/get_ineligible_types");
var _read_stream_to_completion = require("./lib/read_stream_to_completion");
var _readable_stream_from_array = require("./lib/readable_stream_from_array");
var _saved_objects_client_opts = require("./lib/saved_objects_client_opts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function copySavedObjectsToSpacesFactory(savedObjects, request) {
  const {
    getTypeRegistry,
    getScopedClient,
    createExporter,
    createImporter
  } = savedObjects;
  const savedObjectsClient = getScopedClient(request, _saved_objects_client_opts.COPY_TO_SPACES_SAVED_OBJECTS_CLIENT_OPTS);
  const savedObjectsExporter = createExporter(savedObjectsClient);
  const savedObjectsImporter = createImporter(savedObjectsClient);
  const exportRequestedObjects = async (sourceSpaceId, options) => {
    const objectStream = await savedObjectsExporter.exportByObjects({
      request,
      namespace: (0, _namespace.spaceIdToNamespace)(sourceSpaceId),
      includeReferencesDeep: options.includeReferences,
      includeNamespaces: !options.createNewCopies,
      // if we are not creating new copies, then include namespaces; this will ensure we can check for objects that already exist in the destination space below
      excludeExportDetails: true,
      objects: options.objects
    });
    return (0, _read_stream_to_completion.readStreamToCompletion)(objectStream);
  };
  const importObjectsToSpace = async (spaceId, objectsStream, options) => {
    try {
      const importResponse = await savedObjectsImporter.import({
        namespace: (0, _namespace.spaceIdToNamespace)(spaceId),
        overwrite: options.overwrite,
        readStream: objectsStream,
        createNewCopies: options.createNewCopies
      });
      return {
        success: importResponse.success,
        successCount: importResponse.successCount,
        successResults: importResponse.successResults,
        errors: importResponse.errors
      };
    } catch (error) {
      return (0, _create_empty_failure_response.createEmptyFailureResponse)([error]);
    }
  };
  const copySavedObjectsToSpaces = async (sourceSpaceId, destinationSpaceIds, options) => {
    const response = {};
    const exportedSavedObjects = await exportRequestedObjects(sourceSpaceId, options);
    const ineligibleTypes = (0, _get_ineligible_types.getIneligibleTypes)(getTypeRegistry());
    const filteredObjects = exportedSavedObjects.filter(({
      type,
      namespaces
    }) =>
    // Don't attempt to copy ineligible types or objects that already exist in all spaces
    !ineligibleTypes.includes(type) && !(namespaces !== null && namespaces !== void 0 && namespaces.includes(_constants.ALL_SPACES_ID)));
    for (const spaceId of destinationSpaceIds) {
      const objectsToImport = [];
      for (const {
        namespaces,
        ...object
      } of filteredObjects) {
        if (!(namespaces !== null && namespaces !== void 0 && namespaces.includes(spaceId))) {
          // We check to ensure that each object doesn't already exist in the destination. If we don't do this, the consumer will see a
          // conflict and have the option to skip or overwrite the object, both of which are effectively a no-op.
          objectsToImport.push(object);
        }
      }
      response[spaceId] = await importObjectsToSpace(spaceId, (0, _readable_stream_from_array.createReadableStreamFromArray)(objectsToImport), options);
    }
    return response;
  };
  return copySavedObjectsToSpaces;
}