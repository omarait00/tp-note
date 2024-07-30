"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "elasticsearchRoleSchema", {
  enumerable: true,
  get: function () {
    return _role_schema.elasticsearchRoleSchema;
  }
});
Object.defineProperty(exports, "getKibanaRoleSchema", {
  enumerable: true,
  get: function () {
    return _role_schema.getKibanaRoleSchema;
  }
});
Object.defineProperty(exports, "transformPrivilegesToElasticsearchPrivileges", {
  enumerable: true,
  get: function () {
    return _role_utils.transformPrivilegesToElasticsearchPrivileges;
  }
});
Object.defineProperty(exports, "validateKibanaPrivileges", {
  enumerable: true,
  get: function () {
    return _role_utils.validateKibanaPrivileges;
  }
});
var _role_schema = require("./role_schema");
var _role_utils = require("./role_utils");