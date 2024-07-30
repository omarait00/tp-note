"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolverEntity = resolverEntity;
var _supported_schemas = require("./supported_schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function resolverEntity(hits) {
  const responseBody = [];
  for (const hit of hits) {
    for (const supportedSchema of _supported_schemas.supportedSchemas) {
      let foundSchema = true;
      // check that the constraint and id fields are defined and that the id field is not an empty string
      const id = (0, _supported_schemas.getFieldAsString)(hit._source, supportedSchema.schema.id);
      for (const constraint of supportedSchema.constraints) {
        const fieldValue = (0, _supported_schemas.getFieldAsString)(hit._source, constraint.field);
        // track that all the constraints are true, if one of them is false then this schema is not valid so mark it
        // that we did not find the schema
        foundSchema = foundSchema && (fieldValue === null || fieldValue === void 0 ? void 0 : fieldValue.toLowerCase()) === constraint.value.toLowerCase();
      }
      if (foundSchema && id !== undefined && id !== '') {
        responseBody.push({
          name: supportedSchema.name,
          schema: supportedSchema.schema,
          id
        });
      }
    }
  }
  return responseBody;
}