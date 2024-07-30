"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _monitor_duration = require("./monitor_duration");
Object.keys(_monitor_duration).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _monitor_duration[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _monitor_duration[key];
    }
  });
});
var _synthetics_monitor = require("./synthetics_monitor");
Object.keys(_synthetics_monitor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _synthetics_monitor[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _synthetics_monitor[key];
    }
  });
});
var _monitor_validation = require("./monitor_validation");
Object.keys(_monitor_validation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _monitor_validation[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _monitor_validation[key];
    }
  });
});
var _zip_url_deprecation = require("./zip_url_deprecation");
Object.keys(_zip_url_deprecation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _zip_url_deprecation[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _zip_url_deprecation[key];
    }
  });
});