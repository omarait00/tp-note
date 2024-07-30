"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getLogViewUrl: true,
  LOG_VIEW_URL: true
};
Object.defineProperty(exports, "LOG_VIEW_URL", {
  enumerable: true,
  get: function () {
    return _common.LOG_VIEW_URL;
  }
});
Object.defineProperty(exports, "getLogViewUrl", {
  enumerable: true,
  get: function () {
    return _common.getLogViewUrl;
  }
});
var _common = require("./common");
var _get_log_view = require("./get_log_view");
Object.keys(_get_log_view).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _get_log_view[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _get_log_view[key];
    }
  });
});
var _put_log_view = require("./put_log_view");
Object.keys(_put_log_view).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _put_log_view[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _put_log_view[key];
    }
  });
});