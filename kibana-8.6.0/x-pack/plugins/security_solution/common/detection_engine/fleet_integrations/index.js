"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _response_schema = require("./api/get_installed_integrations/response_schema");
Object.keys(_response_schema).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _response_schema[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _response_schema[key];
    }
  });
});
var _urls = require("./api/urls");
Object.keys(_urls).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _urls[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _urls[key];
    }
  });
});
var _installed_integrations = require("./model/installed_integrations");
Object.keys(_installed_integrations).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _installed_integrations[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _installed_integrations[key];
    }
  });
});