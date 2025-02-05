"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importListItemRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _utils = require("./utils");
var _create_stream_from_buffer = require("./utils/create_stream_from_buffer");
var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const importListItemRoute = (router, config) => {
  router.post({
    options: {
      body: {
        accepts: ['multipart/form-data'],
        maxBytes: config.maxImportPayloadBytes,
        parse: false
      },
      tags: ['access:lists-all'],
      timeout: {
        payload: config.importTimeout.asMilliseconds()
      }
    },
    path: `${_securitysolutionListConstants.LIST_ITEM_URL}/_import`,
    validate: {
      body: _configSchema.schema.buffer(),
      query: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.importListItemQuerySchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const stream = (0, _create_stream_from_buffer.createStreamFromBuffer)(request.body);
      const {
        deserializer,
        list_id: listId,
        serializer,
        type
      } = request.query;
      const lists = await (0, _.getListClient)(context);
      const listExists = await lists.getListIndexExists();
      if (!listExists) {
        return siemResponse.error({
          body: `To import a list item, the index must exist first. Index "${lists.getListIndex()}" does not exist`,
          statusCode: 400
        });
      }
      if (listId != null) {
        const list = await lists.getList({
          id: listId
        });
        if (list == null) {
          return siemResponse.error({
            body: `list id: "${listId}" does not exist`,
            statusCode: 409
          });
        }
        await lists.importListItemsToStream({
          deserializer: list.deserializer,
          listId,
          meta: undefined,
          serializer: list.serializer,
          stream,
          type: list.type,
          version: 1
        });
        const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(list, _securitysolutionIoTsListTypes.listSchema);
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
      } else if (type != null) {
        const importedList = await lists.importListItemsToStream({
          deserializer,
          listId: undefined,
          meta: undefined,
          serializer,
          stream,
          type,
          version: 1
        });
        if (importedList == null) {
          return siemResponse.error({
            body: 'Unable to parse a valid fileName during import',
            statusCode: 400
          });
        }
        const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(importedList, _securitysolutionIoTsListTypes.listSchema);
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
      } else {
        return siemResponse.error({
          body: 'Either type or list_id need to be defined in the query',
          statusCode: 400
        });
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
exports.importListItemRoute = importListItemRoute;