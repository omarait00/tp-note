"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListItemByValues = void 0;
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getListItemByValues = async ({
  listId,
  esClient,
  listItemIndex,
  type,
  value
}) => {
  // TODO: Will need to address this when we switch over to
  // using PIT, don't want it to get lost
  // https://github.com/elastic/kibana/issues/103944
  const response = await esClient.search({
    body: {
      query: {
        bool: {
          filter: (0, _utils.getQueryFilterFromTypeValue)({
            listId,
            type,
            value
          })
        }
      }
    },
    ignore_unavailable: true,
    index: listItemIndex,
    size: 10000 // TODO: This has a limit on the number which is 10,000 the default of Elastic but we might want to provide a way to increase that number
  });

  return (0, _utils.transformElasticToListItem)({
    response,
    type
  });
};
exports.getListItemByValues = getListItemByValues;