"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _query_signals_index_schema = require("./query_signals_index_schema");
Object.keys(_query_signals_index_schema).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _query_signals_index_schema[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _query_signals_index_schema[key];
    }
  });
});
var _set_signal_status_schema = require("./set_signal_status_schema");
Object.keys(_set_signal_status_schema).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _set_signal_status_schema[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _set_signal_status_schema[key];
    }
  });
});