"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// helper to correctly set the prototype of custom error constructor
function setErrorPrototype(CustomError) {
  CustomError.prototype = Object.create(Error.prototype, {
    constructor: {
      value: Error,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  Object.setPrototypeOf(CustomError, Error);
}

// helper to create a custom error by name
function createError(name) {
  function CustomError(...args) {
    const instance = new Error(...args);
    // @ts-expect-error this has not type annotation
    const self = this;
    instance.name = self.name = name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(instance, CustomError);
    } else {
      Object.defineProperty(self, 'stack', {
        get() {
          return instance.stack;
        }
      });
    }
    return instance;
  }
  setErrorPrototype(CustomError);
  return CustomError;
}
const RenderError = createError('RenderError');
exports.RenderError = RenderError;