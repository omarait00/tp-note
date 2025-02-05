"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFileKindsRegistry = exports.getFileKindsRegistry = exports.FileKindsRegistryImpl = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _common = require("../../../kibana_utils/common");
var _assert = _interopRequireDefault(require("assert"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @internal
 */
class FileKindsRegistryImpl {
  constructor(onRegister) {
    (0, _defineProperty2.default)(this, "fileKinds", new Map());
    this.onRegister = onRegister;
  }
  register(fileKind) {
    var _this$onRegister;
    if (this.fileKinds.get(fileKind.id)) {
      throw new Error(`File kind "${fileKind.id}" already registered.`);
    }
    if (fileKind.id !== encodeURIComponent(fileKind.id)) {
      throw new Error(`File kind id "${fileKind.id}" is not a valid file kind ID. Choose an ID that does not need to be URI encoded.`);
    }
    this.fileKinds.set(fileKind.id, fileKind);
    (_this$onRegister = this.onRegister) === null || _this$onRegister === void 0 ? void 0 : _this$onRegister.call(this, fileKind);
  }
  get(id) {
    const fileKind = this.fileKinds.get(id);
    (0, _assert.default)(fileKind, `File kind with id "${id}" not found.`);
    return fileKind;
  }
  getAll() {
    return Array.from(this.fileKinds.values());
  }
}
exports.FileKindsRegistryImpl = FileKindsRegistryImpl;
const [getFileKindsRegistry, setFileKindsRegistry] = (0, _common.createGetterSetter)('fileKindsRegistry');
exports.setFileKindsRegistry = setFileKindsRegistry;
exports.getFileKindsRegistry = getFileKindsRegistry;