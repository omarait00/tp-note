"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkCreateSavedObjects = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _uuid = _interopRequireDefault(require("uuid"));
var _i18n = require("@kbn/i18n");
var _search_strategy = require("../../../../../common/search_strategy");
var savedObjectsToCreate = _interopRequireWildcard(require("../saved_object"));
var _find_or_create_tag = require("./find_or_create_tag");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const bulkCreateSavedObjects = async ({
  logger,
  savedObjectsClient,
  spaceId,
  savedObjectTemplate
}) => {
  var _tagResponse$hostRisk;
  const regex = /<REPLACE-WITH-SPACE>/g;
  const riskScoreEntity = savedObjectTemplate === 'userRiskScoreDashboards' ? _search_strategy.RiskScoreEntity.user : _search_strategy.RiskScoreEntity.host;
  const tagResponse = await (0, _find_or_create_tag.findOrCreateRiskScoreTag)({
    riskScoreEntity,
    logger,
    savedObjectsClient,
    spaceId
  });
  const tagResult = (_tagResponse$hostRisk = tagResponse === null || tagResponse === void 0 ? void 0 : tagResponse.hostRiskScoreDashboards) !== null && _tagResponse$hostRisk !== void 0 ? _tagResponse$hostRisk : tagResponse === null || tagResponse === void 0 ? void 0 : tagResponse.userRiskScoreDashboards;
  if (!(tagResult !== null && tagResult !== void 0 && tagResult.success)) {
    return tagResponse;
  }
  const mySavedObjects = savedObjectsToCreate[savedObjectTemplate];
  if (!mySavedObjects) {
    logger.error(`${savedObjectTemplate} template not found`);
    return {
      [savedObjectTemplate]: {
        success: false,
        error: (0, _securitysolutionEsUtils.transformError)(new Error(_i18n.i18n.translate('xpack.securitySolution.riskScore.savedObjects.templateNotFoundTitle', {
          values: {
            savedObjectTemplate
          },
          defaultMessage: `Failed to import saved objects: {savedObjectTemplate} were not created as template not found`
        })))
      }
    };
  }
  const idReplaceMappings = {};
  mySavedObjects.forEach(so => {
    if (so.id.startsWith('<REPLACE-WITH-ID')) {
      idReplaceMappings[so.id] = _uuid.default.v4();
    }
  });
  const mySavedObjectsWithRef = mySavedObjects.map(so => {
    var _so$references$map, _so$references, _idReplaceMappings$so, _tagResult$body, _tagResult$body2, _tagResult$body3;
    const references = (_so$references$map = (_so$references = so.references) === null || _so$references === void 0 ? void 0 : _so$references.map(ref => {
      var _idReplaceMappings$re;
      return {
        ...ref,
        id: (_idReplaceMappings$re = idReplaceMappings[ref.id]) !== null && _idReplaceMappings$re !== void 0 ? _idReplaceMappings$re : ref.id
      };
    })) !== null && _so$references$map !== void 0 ? _so$references$map : [];
    return {
      ...so,
      id: (_idReplaceMappings$so = idReplaceMappings[so.id]) !== null && _idReplaceMappings$so !== void 0 ? _idReplaceMappings$so : so.id,
      references: [...references, {
        id: tagResult === null || tagResult === void 0 ? void 0 : (_tagResult$body = tagResult.body) === null || _tagResult$body === void 0 ? void 0 : _tagResult$body.id,
        name: tagResult === null || tagResult === void 0 ? void 0 : (_tagResult$body2 = tagResult.body) === null || _tagResult$body2 === void 0 ? void 0 : _tagResult$body2.name,
        type: tagResult === null || tagResult === void 0 ? void 0 : (_tagResult$body3 = tagResult.body) === null || _tagResult$body3 === void 0 ? void 0 : _tagResult$body3.type
      }]
    };
  });
  const savedObjects = JSON.stringify(mySavedObjectsWithRef);
  const replacedSO = spaceId ? savedObjects.replace(regex, spaceId) : savedObjects;
  try {
    const result = await savedObjectsClient.bulkCreate(JSON.parse(replacedSO), {
      overwrite: true
    });
    return {
      [savedObjectTemplate]: {
        success: true,
        error: null,
        body: result.saved_objects.map(({
          id,
          type,
          attributes: {
            title,
            name
          }
        }) => ({
          id,
          type,
          title,
          name
        }))
      }
    };
  } catch (error) {
    const err = (0, _securitysolutionEsUtils.transformError)(error);
    logger.error(`Failed to create saved object: ${savedObjectTemplate}: ${err.message}`);
    return {
      [savedObjectTemplate]: {
        success: false,
        error: err
      }
    };
  }
};
exports.bulkCreateSavedObjects = bulkCreateSavedObjects;