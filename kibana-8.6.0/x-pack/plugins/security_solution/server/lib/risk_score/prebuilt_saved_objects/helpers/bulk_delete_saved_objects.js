"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkDeleteSavedObjects = void 0;
var _search_strategy = require("../../../../../common/search_strategy");
var savedObjectsToCreate = _interopRequireWildcard(require("../saved_object"));
var _find_or_create_tag = require("./find_or_create_tag");
var _utils = require("./utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteSavedObject = async ({
  checkObjectExists,
  savedObjectsClient,
  options: {
    type,
    id
  }
}) => {
  try {
    if (checkObjectExists) {
      await savedObjectsClient.get(type, id);
    }
    await savedObjectsClient.delete(type, id);
    return `Deleted saved object: ${id}`;
  } catch (e) {
    var _e$output$payload$mes, _e$output, _e$output$payload;
    return (_e$output$payload$mes = e === null || e === void 0 ? void 0 : (_e$output = e.output) === null || _e$output === void 0 ? void 0 : (_e$output$payload = _e$output.payload) === null || _e$output$payload === void 0 ? void 0 : _e$output$payload.message) !== null && _e$output$payload$mes !== void 0 ? _e$output$payload$mes : `Failed to delete saved object: ${id}`;
  }
};
const deleteSavedObjects = async ({
  checkObjectExists,
  savedObjects,
  savedObjectsClient
}) => {
  const result = await Promise.all(savedObjects.map(so => {
    return deleteSavedObject({
      checkObjectExists,
      savedObjectsClient,
      options: {
        type: so.type,
        id: so.id
      }
    });
  }));
  return result;
};
const deleteSavedObjectsWithTag = async ({
  savedObjectsClient,
  savedObjectTypes,
  tagId
}) => {
  const linkedSavedObjects = await (0, _find_or_create_tag.findSavedObjectsWithTagReference)({
    savedObjectsClient,
    savedObjectTypes,
    tagId
  });
  const deletedIds = await deleteSavedObjects({
    checkObjectExists: false,
    savedObjectsClient,
    savedObjects: linkedSavedObjects
  });
  const deletedTagId = await deleteSavedObject({
    savedObjectsClient,
    options: {
      type: 'tag',
      id: tagId
    }
  });
  return [...deletedIds, deletedTagId];
};
const bulkDeleteSavedObjects = async ({
  deleteAll,
  savedObjectsClient,
  spaceId,
  savedObjectTemplate
}) => {
  const savedObjects = savedObjectsToCreate[savedObjectTemplate];
  const idReplaceMappings = _utils.RISK_SCORE_REPLACE_ID_MAPPINGS[savedObjectTemplate];
  const riskScoreEntity = savedObjectTemplate === 'userRiskScoreDashboards' ? _search_strategy.RiskScoreEntity.user : _search_strategy.RiskScoreEntity.host;
  if (savedObjects == null) {
    return new Error('Template not found.');
  }
  const tagName = (0, _utils.getRiskScoreTagName)(riskScoreEntity, spaceId);
  const tag = await (0, _find_or_create_tag.findRiskScoreTag)({
    savedObjectsClient,
    search: tagName
  });

  /**
   * This is to delete the saved objects installed before 8.5
   * These saved objects were created according to these mappings:
   * prebuilt_saved_objects/helpers/utils.ts RISK_SCORE_REPLACE_ID_MAPPINGS
   * */
  const regex = /<REPLACE-WITH-SPACE>/g;
  const deleteLegacySavedObjectResults = await deleteSavedObjects({
    checkObjectExists: true,
    savedObjectsClient,
    savedObjects: savedObjects.map(so => {
      var _idReplaceMappings$so;
      const legacyId = (_idReplaceMappings$so = idReplaceMappings[so.id]) !== null && _idReplaceMappings$so !== void 0 ? _idReplaceMappings$so : so.id;
      return {
        id: spaceId ? legacyId.replace(regex, spaceId) : legacyId,
        type: so.type
      };
    })
  });
  let deleteSavedObjectResults = [];
  if (tag && deleteAll) {
    /**
     * Since 8.5 all the saved objects are created with dynamic ids and all link to a tag.
     * (As create saved objects with static ids causes conflict across different spaces)
     * so just need to delete all the objects that links to the tag
     * and the tag itself
     * */
    const savedObjectsTypes = new Set(savedObjects.map(so => so.type));
    deleteSavedObjectResults = await deleteSavedObjectsWithTag({
      savedObjectsClient,
      tagId: tag.id,
      savedObjectTypes: Array.from(savedObjectsTypes)
    });
  }
  return [...deleteLegacySavedObjectResults, ...deleteSavedObjectResults];
};
exports.bulkDeleteSavedObjects = bulkDeleteSavedObjects;