"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExceptionListHandler = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _routes = require("../routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createExceptionListHandler = async (context, request, response, siemResponse, options = {
  ignoreExisting: false
}) => {
  const {
    name,
    tags,
    meta,
    namespace_type: namespaceType,
    description,
    list_id: listId,
    type,
    version
  } = request.body;
  const exceptionLists = await (0, _routes.getExceptionListClient)(context);
  const exceptionList = await exceptionLists.getExceptionList({
    id: undefined,
    listId,
    namespaceType
  });
  if (exceptionList != null) {
    if (options.ignoreExisting) {
      return response.ok({
        body: exceptionList
      });
    }
    return siemResponse.error({
      body: `exception list id: "${listId}" already exists`,
      statusCode: 409
    });
  } else {
    const createdList = await exceptionLists.createExceptionList({
      description,
      immutable: false,
      listId,
      meta,
      name,
      namespaceType,
      tags,
      type,
      version
    });
    const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(createdList, _securitysolutionIoTsListTypes.exceptionListSchema);
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
};
exports.createExceptionListHandler = createExceptionListHandler;