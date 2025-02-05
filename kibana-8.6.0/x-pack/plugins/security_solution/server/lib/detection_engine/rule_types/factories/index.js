"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _bulk_create_factory = require("./bulk_create_factory");
Object.keys(_bulk_create_factory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _bulk_create_factory[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _bulk_create_factory[key];
    }
  });
});
var _wrap_hits_factory = require("./wrap_hits_factory");
Object.keys(_wrap_hits_factory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _wrap_hits_factory[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _wrap_hits_factory[key];
    }
  });
});
var _wrap_sequences_factory = require("./wrap_sequences_factory");
Object.keys(_wrap_sequences_factory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _wrap_sequences_factory[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _wrap_sequences_factory[key];
    }
  });
});