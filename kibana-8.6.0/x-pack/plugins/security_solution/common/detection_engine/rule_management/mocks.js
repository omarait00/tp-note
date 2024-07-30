"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _request_schema = require("./api/rules/bulk_actions/request_schema.mock");
Object.keys(_request_schema).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _request_schema[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _request_schema[key];
    }
  });
});
var _request_schema2 = require("./api/rules/crud/patch_rule/request_schema.mock");
Object.keys(_request_schema2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _request_schema2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _request_schema2[key];
    }
  });
});
var _export_rules_details_schema = require("./model/export/export_rules_details_schema.mock");
Object.keys(_export_rules_details_schema).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _export_rules_details_schema[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _export_rules_details_schema[key];
    }
  });
});
var _rule_to_import = require("./model/import/rule_to_import.mock");
Object.keys(_rule_to_import).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _rule_to_import[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rule_to_import[key];
    }
  });
});