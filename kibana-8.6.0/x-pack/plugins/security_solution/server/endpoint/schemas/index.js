"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _artifacts = require("./artifacts");
Object.keys(_artifacts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _artifacts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _artifacts[key];
    }
  });
});