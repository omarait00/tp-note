"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createPrepackagedRules: true
};
Object.defineProperty(exports, "createPrepackagedRules", {
  enumerable: true,
  get: function () {
    return _route.createPrepackagedRules;
  }
});
var _route = require("./api/install_prebuilt_rules_and_timelines/route");
var _register_routes = require("./api/register_routes");
Object.keys(_register_routes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _register_routes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _register_routes[key];
    }
  });
});