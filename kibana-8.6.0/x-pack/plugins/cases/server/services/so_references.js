"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectAttachmentSOAttributesFromRefsForPatch = exports.injectAttachmentSOAttributesFromRefs = exports.getUniqueReferences = exports.getAttachmentSOExtractor = exports.extractAttachmentSORefsFromAttributes = void 0;
var _lodash = require("lodash");
var _so_references = require("../attachment_framework/so_references");
var _constants = require("../common/constants");
var _utils = require("../common/utils");
var _so_reference_extractor = require("./so_reference_extractor");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAttachmentSOExtractor = attachment => {
  const fieldsToExtract = [];
  if ((0, _utils.isCommentRequestTypeExternalReferenceSO)(attachment)) {
    fieldsToExtract.push({
      path: 'externalReferenceId',
      type: attachment.externalReferenceStorage.soType,
      name: _constants.EXTERNAL_REFERENCE_REF_NAME
    });
  }
  return new _so_reference_extractor.SOReferenceExtractor(fieldsToExtract);
};
exports.getAttachmentSOExtractor = getAttachmentSOExtractor;
const injectAttachmentSOAttributesFromRefs = (savedObject, persistableStateAttachmentTypeRegistry) => {
  const soExtractor = getAttachmentSOExtractor(savedObject.attributes);
  const so = soExtractor.populateFieldsFromReferences(savedObject);
  const injectedAttributes = (0, _so_references.injectPersistableReferencesToSO)(so.attributes, so.references, {
    persistableStateAttachmentTypeRegistry
  });
  return {
    ...so,
    attributes: {
      ...so.attributes,
      ...injectedAttributes
    }
  };
};
exports.injectAttachmentSOAttributesFromRefs = injectAttachmentSOAttributesFromRefs;
const injectAttachmentSOAttributesFromRefsForPatch = (updatedAttributes, savedObject, persistableStateAttachmentTypeRegistry) => {
  var _so$references;
  const soExtractor = getAttachmentSOExtractor(savedObject.attributes);
  const so = soExtractor.populateFieldsFromReferencesForPatch({
    dataBeforeRequest: updatedAttributes,
    dataReturnedFromRequest: savedObject
  });

  /**
   *  We don't allow partial updates of attachments attributes.
   * Consumers will always get state of the attachment.
   */
  const injectedAttributes = (0, _so_references.injectPersistableReferencesToSO)(so.attributes, (_so$references = so.references) !== null && _so$references !== void 0 ? _so$references : [], {
    persistableStateAttachmentTypeRegistry
  });
  return {
    ...so,
    attributes: {
      ...so.attributes,
      ...injectedAttributes
    }
  };
};
exports.injectAttachmentSOAttributesFromRefsForPatch = injectAttachmentSOAttributesFromRefsForPatch;
const extractAttachmentSORefsFromAttributes = (attributes, references, persistableStateAttachmentTypeRegistry) => {
  const soExtractor = getAttachmentSOExtractor(attributes);
  const {
    transformedFields,
    references: refsWithExternalRefId,
    didDeleteOperation
  } = soExtractor.extractFieldsToReferences({
    data: attributes,
    existingReferences: references
  });
  const {
    attributes: extractedAttributes,
    references: extractedReferences
  } = (0, _so_references.extractPersistableStateReferencesFromSO)(transformedFields, {
    persistableStateAttachmentTypeRegistry
  });
  return {
    attributes: {
      ...transformedFields,
      ...extractedAttributes
    },
    references: getUniqueReferences([...refsWithExternalRefId, ...extractedReferences]),
    didDeleteOperation
  };
};
exports.extractAttachmentSORefsFromAttributes = extractAttachmentSORefsFromAttributes;
const getUniqueReferences = references => (0, _lodash.uniqWith)(references, _lodash.isEqual);
exports.getUniqueReferences = getUniqueReferences;