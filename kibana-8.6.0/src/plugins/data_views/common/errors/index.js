"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _duplicate_index_pattern = require("./duplicate_index_pattern");
Object.keys(_duplicate_index_pattern).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _duplicate_index_pattern[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _duplicate_index_pattern[key];
    }
  });
});
var _data_view_saved_object_conflict = require("./data_view_saved_object_conflict");
Object.keys(_data_view_saved_object_conflict).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _data_view_saved_object_conflict[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _data_view_saved_object_conflict[key];
    }
  });
});
var _insufficient_access = require("./insufficient_access");
Object.keys(_insufficient_access).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _insufficient_access[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _insufficient_access[key];
    }
  });
});