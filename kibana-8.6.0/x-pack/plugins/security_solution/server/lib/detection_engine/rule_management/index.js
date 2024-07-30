"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  legacyMigrate: true,
  commonParamsCamelToSnake: true,
  typeSpecificCamelToSnake: true,
  convertCreateAPIToInternalSchema: true
};
Object.defineProperty(exports, "commonParamsCamelToSnake", {
  enumerable: true,
  get: function () {
    return _rule_converters.commonParamsCamelToSnake;
  }
});
Object.defineProperty(exports, "convertCreateAPIToInternalSchema", {
  enumerable: true,
  get: function () {
    return _rule_converters.convertCreateAPIToInternalSchema;
  }
});
Object.defineProperty(exports, "legacyMigrate", {
  enumerable: true,
  get: function () {
    return _legacy_action_migration.legacyMigrate;
  }
});
Object.defineProperty(exports, "typeSpecificCamelToSnake", {
  enumerable: true,
  get: function () {
    return _rule_converters.typeSpecificCamelToSnake;
  }
});
var _register_routes = require("./api/register_routes");
Object.keys(_register_routes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _register_routes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _register_routes[key];
    }
  });
});
var _legacy_action_migration = require("./logic/rule_actions/legacy_action_migration");
var _rule_converters = require("./normalization/rule_converters");