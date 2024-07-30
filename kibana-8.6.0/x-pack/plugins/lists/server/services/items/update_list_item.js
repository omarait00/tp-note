"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateListItem = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _utils = require("../utils");
var _get_list_item = require("./get_list_item");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const updateListItem = async ({
  _version,
  id,
  value,
  esClient,
  listItemIndex,
  user,
  meta,
  dateNow
}) => {
  const updatedAt = dateNow !== null && dateNow !== void 0 ? dateNow : new Date().toISOString();
  const listItem = await (0, _get_list_item.getListItem)({
    esClient,
    id,
    listItemIndex
  });
  if (listItem == null) {
    return null;
  } else {
    const elasticQuery = (0, _utils.transformListItemToElasticQuery)({
      serializer: listItem.serializer,
      type: listItem.type,
      value: value !== null && value !== void 0 ? value : listItem.value
    });
    if (elasticQuery == null) {
      return null;
    } else {
      const doc = {
        meta,
        updated_at: updatedAt,
        updated_by: user,
        ...elasticQuery
      };
      const response = await esClient.update({
        ...(0, _securitysolutionEsUtils.decodeVersion)(_version),
        body: {
          doc
        },
        id: listItem.id,
        index: listItemIndex,
        refresh: 'wait_for'
      });
      return {
        _version: (0, _securitysolutionEsUtils.encodeHitVersion)(response),
        created_at: listItem.created_at,
        created_by: listItem.created_by,
        deserializer: listItem.deserializer,
        id: response._id,
        list_id: listItem.list_id,
        meta: meta !== null && meta !== void 0 ? meta : listItem.meta,
        serializer: listItem.serializer,
        tie_breaker_id: listItem.tie_breaker_id,
        type: listItem.type,
        updated_at: updatedAt,
        updated_by: listItem.updated_by,
        value: value !== null && value !== void 0 ? value : listItem.value
      };
    }
  }
};
exports.updateListItem = updateListItem;