"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newJobCapsProvider = newJobCapsProvider;
var _field_types = require("../../../../common/constants/field_types");
var _field_service = require("./field_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function newJobCapsProvider(client) {
  async function newJobCaps(indexPattern, isRollup = false, dataViewsService) {
    const fieldService = (0, _field_service.fieldServiceProvider)(indexPattern, isRollup, client, dataViewsService);
    const {
      aggs,
      fields
    } = await fieldService.getData();
    convertForStringify(aggs, fields);

    // Remove the _doc_count field as we don't want to display this in the fields lists in the UI
    const fieldsWithoutDocCount = fields.filter(({
      id
    }) => id !== _field_types._DOC_COUNT);
    return {
      [indexPattern]: {
        aggs,
        fields: fieldsWithoutDocCount
      }
    };
  }
  return {
    newJobCaps
  };
}

// replace the recursive field and agg references with a
// map of ids to allow it to be stringified for transportation
// over the network.
function convertForStringify(aggs, fields) {
  fields.forEach(f => {
    f.aggIds = f.aggs ? f.aggs.map(a => a.id) : [];
    delete f.aggs;
  });
  aggs.forEach(a => {
    if (a.fields !== undefined) {
      // if the aggregation supports fields, i.e. it's fields list isn't undefined,
      // create a list of field ids
      a.fieldIds = a.fields.map(f => f.id);
    }
    delete a.fields;
  });
}