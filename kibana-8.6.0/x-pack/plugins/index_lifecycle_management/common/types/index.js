"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _api = require("./api");
Object.keys(_api).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _api[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _api[key];
    }
  });
});
var _policies = require("./policies");
Object.keys(_policies).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _policies[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _policies[key];
    }
  });
});