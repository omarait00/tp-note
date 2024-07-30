"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reinstallPackageForInstallation = reinstallPackageForInstallation;
var _constants = require("../../../../../spaces/common/constants");
var _registry = require("../registry");
var _install = require("./install");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function reinstallPackageForInstallation({
  soClient,
  esClient,
  installation
}) {
  if (installation.install_source === 'upload') {
    throw new Error('Cannot reinstall an uploaded package');
  }
  return (0, _install.installPackage)({
    // If the package is bundled reinstall from the registry will still use the bundled package.
    installSource: 'registry',
    savedObjectsClient: soClient,
    pkgkey: (0, _registry.pkgToPkgKey)({
      name: installation.name,
      version: installation.version
    }),
    esClient,
    spaceId: installation.installed_kibana_space_id || _constants.DEFAULT_SPACE_ID,
    // Force install the package will update the index template and the datastream write indices
    force: true
  });
}