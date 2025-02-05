"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveLogIndicesSavedObjectReferences = exports.logIndicesDataViewReferenceName = exports.extractLogIndicesSavedObjectReferences = void 0;
var _common = require("../../../../../../../src/plugins/data_views/common");
var _references = require("../../references");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const logIndicesDataViewReferenceName = 'log-indices-data-view-0';
exports.logIndicesDataViewReferenceName = logIndicesDataViewReferenceName;
const extractLogIndicesSavedObjectReferences = unextractedAttributes => {
  if (unextractedAttributes.logIndices.type === 'data_view') {
    const logDataViewReference = {
      id: unextractedAttributes.logIndices.dataViewId,
      type: _common.DATA_VIEW_SAVED_OBJECT_TYPE,
      name: logIndicesDataViewReferenceName
    };
    const attributes = {
      ...unextractedAttributes,
      logIndices: {
        ...unextractedAttributes.logIndices,
        dataViewId: logDataViewReference.name
      }
    };
    return {
      attributes,
      references: [logDataViewReference]
    };
  } else {
    return {
      attributes: unextractedAttributes,
      references: []
    };
  }
};
exports.extractLogIndicesSavedObjectReferences = extractLogIndicesSavedObjectReferences;
const resolveLogIndicesSavedObjectReferences = (attributes, references) => {
  var _attributes$logIndice;
  if (((_attributes$logIndice = attributes.logIndices) === null || _attributes$logIndice === void 0 ? void 0 : _attributes$logIndice.type) === 'data_view') {
    const logDataViewReference = references.find(reference => reference.name === logIndicesDataViewReferenceName);
    if (logDataViewReference == null) {
      throw new _references.SavedObjectReferenceResolutionError(`Failed to resolve log data view reference "${logIndicesDataViewReferenceName}".`);
    }
    return {
      ...attributes,
      logIndices: {
        ...attributes.logIndices,
        dataViewId: logDataViewReference.id
      }
    };
  } else {
    return attributes;
  }
};
exports.resolveLogIndicesSavedObjectReferences = resolveLogIndicesSavedObjectReferences;