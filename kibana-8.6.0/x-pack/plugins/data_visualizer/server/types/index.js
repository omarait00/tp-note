"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _deps = require("./deps");
Object.keys(_deps).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _deps[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _deps[key];
    }
  });
});