"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PersistableStateAttachmentTypeRegistry = void 0;
var _lodash = require("lodash");
var _registry = require("../../common/registry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class PersistableStateAttachmentTypeRegistry extends _registry.AttachmentTypeRegistry {
  constructor() {
    super('PersistableStateAttachmentTypeRegistry');
  }
  register(attachmentType) {
    const item = {
      id: attachmentType.id,
      telemetry: attachmentType.telemetry || ((state, stats) => stats),
      inject: attachmentType.inject || _lodash.identity,
      extract: attachmentType.extract || (state => ({
        state,
        references: []
      })),
      migrations: attachmentType.migrations || {}
    };
    super.register(item);
  }
}
exports.PersistableStateAttachmentTypeRegistry = PersistableStateAttachmentTypeRegistry;