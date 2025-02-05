"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  ExtensionPointStorage: true
};
Object.defineProperty(exports, "ExtensionPointStorage", {
  enumerable: true,
  get: function () {
    return _extension_point_storage.ExtensionPointStorage;
  }
});
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _extension_point_storage = require("./extension_point_storage");