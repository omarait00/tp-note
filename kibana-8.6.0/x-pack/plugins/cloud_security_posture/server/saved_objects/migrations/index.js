"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _csp_rule = require("./csp_rule");
Object.keys(_csp_rule).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _csp_rule[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _csp_rule[key];
    }
  });
});
var _csp_rule_template = require("./csp_rule_template");
Object.keys(_csp_rule_template).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _csp_rule_template[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _csp_rule_template[key];
    }
  });
});