"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findSavedObjectsWithTagReference = exports.findRiskScoreTag = exports.findOrCreateRiskScoreTag = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _i18n = require("@kbn/i18n");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const findRiskScoreTag = async ({
  savedObjectsClient,
  search
}) => {
  const tagResponse = await savedObjectsClient.find({
    type: 'tag',
    search,
    searchFields: ['name'],
    sortField: 'updated_at',
    sortOrder: 'desc'
  });
  const existingRiskScoreTag = tagResponse.saved_objects.find(({
    attributes
  }) => attributes.name === search);
  return existingRiskScoreTag ? {
    id: existingRiskScoreTag.id,
    name: existingRiskScoreTag === null || existingRiskScoreTag === void 0 ? void 0 : existingRiskScoreTag.attributes.name,
    type: existingRiskScoreTag.type
  } : undefined;
};
exports.findRiskScoreTag = findRiskScoreTag;
const findOrCreateRiskScoreTag = async ({
  riskScoreEntity,
  logger,
  savedObjectsClient,
  spaceId = 'default'
}) => {
  const tagName = (0, _utils.getRiskScoreTagName)(riskScoreEntity, spaceId);
  const savedObjectTemplate = `${riskScoreEntity}RiskScoreDashboards`;
  const existingRiskScoreTag = await findRiskScoreTag({
    savedObjectsClient,
    search: tagName
  });
  const tag = {
    id: existingRiskScoreTag === null || existingRiskScoreTag === void 0 ? void 0 : existingRiskScoreTag.id,
    type: 'tag',
    name: tagName,
    description: _utils.RISK_SCORE_TAG_DESCRIPTION
  };
  if ((existingRiskScoreTag === null || existingRiskScoreTag === void 0 ? void 0 : existingRiskScoreTag.id) != null) {
    logger.error(`${savedObjectTemplate} already exists`);
    return {
      [savedObjectTemplate]: {
        success: false,
        error: (0, _securitysolutionEsUtils.transformError)(new Error(_i18n.i18n.translate('xpack.securitySolution.riskScore.savedObjects.templateAlreadyExistsTitle', {
          values: {
            savedObjectTemplate
          },
          defaultMessage: `Failed to import saved objects: {savedObjectTemplate} were not created as already exist`
        })))
      }
    };
  } else {
    try {
      const {
        id: tagId
      } = await savedObjectsClient.create('tag', {
        name: tagName,
        description: _utils.RISK_SCORE_TAG_DESCRIPTION,
        color: '#6edb7f'
      });
      return {
        [savedObjectTemplate]: {
          success: true,
          error: null,
          body: {
            ...tag,
            id: tagId
          }
        }
      };
    } catch (e) {
      logger.error(`${savedObjectTemplate} cannot be installed as failed to create the tag: ${tagName}`);
      return {
        [savedObjectTemplate]: {
          success: false,
          error: (0, _securitysolutionEsUtils.transformError)(new Error(_i18n.i18n.translate('xpack.securitySolution.riskScore.savedObjects.failedToCreateTagTitle', {
            values: {
              savedObjectTemplate,
              tagName
            },
            defaultMessage: `Failed to import saved objects: {savedObjectTemplate} were not created as failed to create the tag: {tagName}`
          })))
        }
      };
    }
  }
};
exports.findOrCreateRiskScoreTag = findOrCreateRiskScoreTag;
const findSavedObjectsWithTagReference = async ({
  savedObjectsClient,
  savedObjectTypes,
  tagId
}) => {
  const linkedSavedObjects = await savedObjectsClient.find({
    type: savedObjectTypes,
    hasReference: {
      type: 'tag',
      id: tagId
    }
  });
  return linkedSavedObjects === null || linkedSavedObjects === void 0 ? void 0 : linkedSavedObjects.saved_objects;
};
exports.findSavedObjectsWithTagReference = findSavedObjectsWithTagReference;