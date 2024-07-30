"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _prebuilt_rule = require("./model/prebuilt_rule.mock");
Object.keys(_prebuilt_rule).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _prebuilt_rule[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _prebuilt_rule[key];
    }
  });
});