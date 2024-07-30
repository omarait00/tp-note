"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createListIndexRoute = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _utils = require("./utils");
var _2 = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createListIndexRoute = router => {
  router.post({
    options: {
      tags: ['access:lists-all']
    },
    path: _securitysolutionListConstants.LIST_INDEX,
    validate: false
  }, async (context, _, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const lists = await (0, _2.getListClient)(context);
      const listIndexExists = await lists.getListIndexExists();
      const listItemIndexExists = await lists.getListItemIndexExists();
      const policyExists = await lists.getListPolicyExists();
      const policyListItemExists = await lists.getListItemPolicyExists();
      if (!policyExists) {
        await lists.setListPolicy();
      }
      if (!policyListItemExists) {
        await lists.setListItemPolicy();
      }
      const templateExists = await lists.getListTemplateExists();
      const templateListItemsExists = await lists.getListItemTemplateExists();
      const legacyTemplateExists = await lists.getLegacyListTemplateExists();
      const legacyTemplateListItemsExists = await lists.getLegacyListItemTemplateExists();
      if (!templateExists) {
        await lists.setListTemplate();
      }
      if (!templateListItemsExists) {
        await lists.setListItemTemplate();
      }
      try {
        // Check if the old legacy lists and items template exists and remove it
        if (legacyTemplateExists) {
          await lists.deleteLegacyListTemplate();
        }
        if (legacyTemplateListItemsExists) {
          await lists.deleteLegacyListItemTemplate();
        }
      } catch (err) {
        if (err.statusCode !== 404) {
          throw err;
        }
      }
      if (listIndexExists && listItemIndexExists) {
        return siemResponse.error({
          body: `index: "${lists.getListIndex()}" and "${lists.getListItemIndex()}" already exists`,
          statusCode: 409
        });
      } else {
        if (!listIndexExists) {
          await lists.createListBootStrapIndex();
        }
        if (!listItemIndexExists) {
          await lists.createListItemBootStrapIndex();
        }
        const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)({
          acknowledged: true
        }, _securitysolutionIoTsListTypes.acknowledgeSchema);
        if (errors != null) {
          return siemResponse.error({
            body: errors,
            statusCode: 500
          });
        } else {
          return response.ok({
            body: validated !== null && validated !== void 0 ? validated : {}
          });
        }
      }
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.createListIndexRoute = createListIndexRoute;