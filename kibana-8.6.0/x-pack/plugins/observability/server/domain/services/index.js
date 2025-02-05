"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _compute_error_budget = require("./compute_error_budget");
Object.keys(_compute_error_budget).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _compute_error_budget[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _compute_error_budget[key];
    }
  });
});
var _compute_sli = require("./compute_sli");
Object.keys(_compute_sli).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _compute_sli[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _compute_sli[key];
    }
  });
});
var _compute_burn_rate = require("./compute_burn_rate");
Object.keys(_compute_burn_rate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _compute_burn_rate[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _compute_burn_rate[key];
    }
  });
});
var _date_range = require("./date_range");
Object.keys(_date_range).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _date_range[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _date_range[key];
    }
  });
});
var _validate_slo = require("./validate_slo");
Object.keys(_validate_slo).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _validate_slo[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _validate_slo[key];
    }
  });
});