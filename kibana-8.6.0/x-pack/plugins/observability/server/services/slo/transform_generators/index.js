"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _transform_generator = require("./transform_generator");
Object.keys(_transform_generator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _transform_generator[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _transform_generator[key];
    }
  });
});
var _apm_transaction_error_rate = require("./apm_transaction_error_rate");
Object.keys(_apm_transaction_error_rate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _apm_transaction_error_rate[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _apm_transaction_error_rate[key];
    }
  });
});
var _apm_transaction_duration = require("./apm_transaction_duration");
Object.keys(_apm_transaction_duration).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _apm_transaction_duration[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _apm_transaction_duration[key];
    }
  });
});
var _kql_custom = require("./kql_custom");
Object.keys(_kql_custom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _kql_custom[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _kql_custom[key];
    }
  });
});