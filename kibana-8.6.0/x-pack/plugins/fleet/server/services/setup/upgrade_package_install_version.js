"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upgradePackageInstallVersion = upgradePackageInstallVersion;
var _pMap = _interopRequireDefault(require("p-map"));
var _constants = require("../../constants");
var _fleet_es_assets = require("../../constants/fleet_es_assets");
var _packages = require("../epm/packages");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function findOutdatedInstallations(soClient) {
  return soClient.find({
    type: _constants.PACKAGES_SAVED_OBJECT_TYPE,
    perPage: _constants.SO_SEARCH_LIMIT,
    filter: `${_constants.PACKAGES_SAVED_OBJECT_TYPE}.attributes.install_status:installed and (${_constants.PACKAGES_SAVED_OBJECT_TYPE}.attributes.install_format_schema_version < ${_fleet_es_assets.FLEET_INSTALL_FORMAT_VERSION} or not ${_constants.PACKAGES_SAVED_OBJECT_TYPE}.attributes.install_format_schema_version:*)`
  });
}
/**
 * Upgrade package install version for packages installed with an older version of Kibana
 */
async function upgradePackageInstallVersion({
  soClient,
  esClient,
  logger
}) {
  const res = await findOutdatedInstallations(soClient);
  if (res.total === 0) {
    return;
  }
  await (0, _pMap.default)(res.saved_objects, ({
    attributes: installation
  }) => {
    // Uploaded package cannot be reinstalled
    if (installation.install_source === 'upload') {
      logger.warn(`Uploaded package needs to be manually reinstalled ${installation.name}.`);
      return;
    }
    return (0, _packages.reinstallPackageForInstallation)({
      soClient,
      esClient,
      installation
    }).catch(err => {
      logger.error(`Package needs to be manually reinstalled ${installation.name} updating install_version failed. ${err.message}`);
    });
  }, {
    concurrency: 10
  });
}