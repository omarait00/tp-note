"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "calculateEndpointAuthz", {
  enumerable: true,
  get: function () {
    return _authz.calculateEndpointAuthz;
  }
});
Object.defineProperty(exports, "calculatePermissionsFromCapabilities", {
  enumerable: true,
  get: function () {
    return _authz.calculatePermissionsFromCapabilities;
  }
});
Object.defineProperty(exports, "calculatePermissionsFromPrivileges", {
  enumerable: true,
  get: function () {
    return _authz.calculatePermissionsFromPrivileges;
  }
});
Object.defineProperty(exports, "defaultEndpointPermissions", {
  enumerable: true,
  get: function () {
    return _authz.defaultEndpointPermissions;
  }
});
Object.defineProperty(exports, "getEndpointAuthzInitialState", {
  enumerable: true,
  get: function () {
    return _authz.getEndpointAuthzInitialState;
  }
});
var _authz = require("./authz");