"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _error_schema = require("./error_schema");
Object.keys(_error_schema).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _error_schema[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _error_schema[key];
    }
  });
});