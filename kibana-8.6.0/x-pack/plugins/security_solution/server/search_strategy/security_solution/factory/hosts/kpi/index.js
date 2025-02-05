"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _hosts = require("./hosts");
Object.keys(_hosts).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _hosts[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _hosts[key];
    }
  });
});
var _unique_ips = require("./unique_ips");
Object.keys(_unique_ips).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _unique_ips[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _unique_ips[key];
    }
  });
});