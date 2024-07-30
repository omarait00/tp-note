"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _mocks = require("./control_group/mocks");
Object.keys(_mocks).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _mocks[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mocks[key];
    }
  });
});
var _mocks2 = require("./options_list/mocks");
Object.keys(_mocks2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _mocks2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mocks2[key];
    }
  });
});