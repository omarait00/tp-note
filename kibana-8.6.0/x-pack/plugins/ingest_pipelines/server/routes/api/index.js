"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "registerCreateRoute", {
  enumerable: true,
  get: function () {
    return _create.registerCreateRoute;
  }
});
Object.defineProperty(exports, "registerDeleteRoute", {
  enumerable: true,
  get: function () {
    return _delete.registerDeleteRoute;
  }
});
Object.defineProperty(exports, "registerDocumentsRoute", {
  enumerable: true,
  get: function () {
    return _documents.registerDocumentsRoute;
  }
});
Object.defineProperty(exports, "registerGetRoutes", {
  enumerable: true,
  get: function () {
    return _get.registerGetRoutes;
  }
});
Object.defineProperty(exports, "registerParseCsvRoute", {
  enumerable: true,
  get: function () {
    return _parse_csv.registerParseCsvRoute;
  }
});
Object.defineProperty(exports, "registerPrivilegesRoute", {
  enumerable: true,
  get: function () {
    return _privileges.registerPrivilegesRoute;
  }
});
Object.defineProperty(exports, "registerSimulateRoute", {
  enumerable: true,
  get: function () {
    return _simulate.registerSimulateRoute;
  }
});
Object.defineProperty(exports, "registerUpdateRoute", {
  enumerable: true,
  get: function () {
    return _update.registerUpdateRoute;
  }
});
var _get = require("./get");
var _create = require("./create");
var _update = require("./update");
var _privileges = require("./privileges");
var _delete = require("./delete");
var _simulate = require("./simulate");
var _documents = require("./documents");
var _parse_csv = require("./parse_csv");