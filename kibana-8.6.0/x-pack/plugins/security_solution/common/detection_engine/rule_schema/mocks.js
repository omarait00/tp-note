"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _rule_request_schema = require("./model/rule_request_schema.mock");
Object.keys(_rule_request_schema).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _rule_request_schema[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rule_request_schema[key];
    }
  });
});
var _rule_response_schema = require("./model/rule_response_schema.mock");
Object.keys(_rule_response_schema).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _rule_response_schema[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rule_response_schema[key];
    }
  });
});