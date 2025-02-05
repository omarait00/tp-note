"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PackageNotInstalledError = void 0;
Object.defineProperty(exports, "bulkInstallPackages", {
  enumerable: true,
  get: function () {
    return _bulk_install_packages.bulkInstallPackages;
  }
});
exports.createInstallableFrom = createInstallableFrom;
Object.defineProperty(exports, "ensureInstalledPackage", {
  enumerable: true,
  get: function () {
    return _install.ensureInstalledPackage;
  }
});
Object.defineProperty(exports, "getBundledPackages", {
  enumerable: true,
  get: function () {
    return _bundled_packages.getBundledPackages;
  }
});
Object.defineProperty(exports, "getCategories", {
  enumerable: true,
  get: function () {
    return _get.getCategories;
  }
});
Object.defineProperty(exports, "getFile", {
  enumerable: true,
  get: function () {
    return _get.getFile;
  }
});
Object.defineProperty(exports, "getInstallation", {
  enumerable: true,
  get: function () {
    return _get.getInstallation;
  }
});
Object.defineProperty(exports, "getInstallationObject", {
  enumerable: true,
  get: function () {
    return _get.getInstallationObject;
  }
});
Object.defineProperty(exports, "getInstallations", {
  enumerable: true,
  get: function () {
    return _get.getInstallations;
  }
});
Object.defineProperty(exports, "getLimitedPackages", {
  enumerable: true,
  get: function () {
    return _get.getLimitedPackages;
  }
});
Object.defineProperty(exports, "getPackageInfo", {
  enumerable: true,
  get: function () {
    return _get.getPackageInfo;
  }
});
Object.defineProperty(exports, "getPackages", {
  enumerable: true,
  get: function () {
    return _get.getPackages;
  }
});
Object.defineProperty(exports, "handleInstallPackageFailure", {
  enumerable: true,
  get: function () {
    return _install.handleInstallPackageFailure;
  }
});
Object.defineProperty(exports, "installPackage", {
  enumerable: true,
  get: function () {
    return _install.installPackage;
  }
});
Object.defineProperty(exports, "isBulkInstallError", {
  enumerable: true,
  get: function () {
    return _bulk_install_packages.isBulkInstallError;
  }
});
exports.kibanaSavedObjectTypes = void 0;
Object.defineProperty(exports, "reinstallPackageForInstallation", {
  enumerable: true,
  get: function () {
    return _reinstall.reinstallPackageForInstallation;
  }
});
Object.defineProperty(exports, "removeInstallation", {
  enumerable: true,
  get: function () {
    return _remove.removeInstallation;
  }
});
exports.savedObjectTypes = void 0;
var _types = require("../../../../common/types");
var _constants = require("../../../../common/constants");
var _types2 = require("../../../types");
var _bulk_install_packages = require("./bulk_install_packages");
var _get = require("./get");
var _bundled_packages = require("./bundled_packages");
var _install = require("./install");
var _reinstall = require("./reinstall");
var _remove = require("./remove");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class PackageNotInstalledError extends Error {
  constructor(pkgkey) {
    super(`${pkgkey} is not installed`);
  }
}

// only Kibana Assets use Saved Objects at this point
exports.PackageNotInstalledError = PackageNotInstalledError;
const savedObjectTypes = Object.values(_types2.KibanaAssetType);
exports.savedObjectTypes = savedObjectTypes;
const kibanaSavedObjectTypes = Object.values(_types.KibanaSavedObjectType);
exports.kibanaSavedObjectTypes = kibanaSavedObjectTypes;
function createInstallableFrom(from, savedObject) {
  return savedObject ? {
    ...from,
    status: savedObject.attributes.install_status,
    savedObject
  } : {
    ...from,
    status: _constants.installationStatuses.NotInstalled
  };
}