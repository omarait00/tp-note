"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getById = getById;
var _server = require("../../../../../core/server");
var _file_service = require("../../file_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * A helper that given an ID will return a file or map errors to an http response.
 */
async function getById(fileService, id, fileKind) {
  let result;
  try {
    result = await fileService.getById({
      id,
      fileKind
    });
  } catch (e) {
    let error;
    if (e instanceof _file_service.errors.FileNotFoundError) {
      error = _server.kibanaResponseFactory.notFound({
        body: {
          message: e.message
        }
      });
    } else {
      error = _server.kibanaResponseFactory.custom({
        statusCode: 500,
        body: {
          message: e.message
        }
      });
    }
    return {
      error
    };
  }
  return {
    result
  };
}