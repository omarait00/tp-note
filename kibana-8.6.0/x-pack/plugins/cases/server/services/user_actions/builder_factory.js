"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BuilderFactory = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _create_case = require("./builders/create_case");
var _title = require("./builders/title");
var _comment = require("./builders/comment");
var _connector = require("./builders/connector");
var _description = require("./builders/description");
var _pushed = require("./builders/pushed");
var _status = require("./builders/status");
var _tags = require("./builders/tags");
var _settings = require("./builders/settings");
var _delete_case = require("./builders/delete_case");
var _severity = require("./builders/severity");
var _assignees = require("./builders/assignees");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const builderMap = {
  assignees: _assignees.AssigneesUserActionBuilder,
  title: _title.TitleUserActionBuilder,
  create_case: _create_case.CreateCaseUserActionBuilder,
  connector: _connector.ConnectorUserActionBuilder,
  comment: _comment.CommentUserActionBuilder,
  description: _description.DescriptionUserActionBuilder,
  pushed: _pushed.PushedUserActionBuilder,
  tags: _tags.TagsUserActionBuilder,
  status: _status.StatusUserActionBuilder,
  severity: _severity.SeverityUserActionBuilder,
  settings: _settings.SettingsUserActionBuilder,
  delete_case: _delete_case.DeleteCaseUserActionBuilder
};
class BuilderFactory {
  constructor(deps) {
    (0, _defineProperty2.default)(this, "persistableStateAttachmentTypeRegistry", void 0);
    this.persistableStateAttachmentTypeRegistry = deps.persistableStateAttachmentTypeRegistry;
  }
  getBuilder(type) {
    return new builderMap[type]({
      persistableStateAttachmentTypeRegistry: this.persistableStateAttachmentTypeRegistry
    });
  }
}
exports.BuilderFactory = BuilderFactory;