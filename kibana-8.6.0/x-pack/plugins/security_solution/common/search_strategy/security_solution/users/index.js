"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  UsersQueries: true
};
exports.UsersQueries = void 0;
var _all = require("./all");
Object.keys(_all).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _all[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _all[key];
    }
  });
});
var _common = require("./common");
Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _common[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _common[key];
    }
  });
});
var _kpi = require("./kpi");
Object.keys(_kpi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _kpi[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _kpi[key];
    }
  });
});
var _details = require("./details");
Object.keys(_details).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _details[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _details[key];
    }
  });
});
var _authentications = require("./authentications");
Object.keys(_authentications).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _authentications[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _authentications[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let UsersQueries;
exports.UsersQueries = UsersQueries;
(function (UsersQueries) {
  UsersQueries["details"] = "userDetails";
  UsersQueries["kpiTotalUsers"] = "usersKpiTotalUsers";
  UsersQueries["users"] = "allUsers";
  UsersQueries["authentications"] = "authentications";
  UsersQueries["kpiAuthentications"] = "usersKpiAuthentications";
})(UsersQueries || (exports.UsersQueries = UsersQueries = {}));