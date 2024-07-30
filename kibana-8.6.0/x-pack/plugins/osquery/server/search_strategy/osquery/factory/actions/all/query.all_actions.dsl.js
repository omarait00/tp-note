"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildActionsQuery = void 0;
var _common = require("../../../../../../../fleet/common");
var _constants = require("../../../../../../common/constants");
var _build_query = require("../../../../../../common/utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildActionsQuery = ({
  filterQuery,
  sort,
  pagination: {
    cursorStart,
    querySize
  },
  componentTemplateExists
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery)];
  const dslQuery = {
    allow_no_indices: true,
    index: componentTemplateExists ? `${_constants.ACTIONS_INDEX}*` : _common.AGENT_ACTIONS_INDEX,
    ignore_unavailable: true,
    body: {
      query: {
        bool: {
          filter,
          must: [{
            term: {
              type: {
                value: 'INPUT_ACTION'
              }
            }
          }, {
            term: {
              input_type: {
                value: 'osquery'
              }
            }
          }]
        }
      },
      from: cursorStart,
      size: querySize,
      track_total_hits: true,
      fields: ['*'],
      sort: [{
        [sort.field]: {
          order: sort.direction
        }
      }]
    }
  };
  return dslQuery;
};
exports.buildActionsQuery = buildActionsQuery;