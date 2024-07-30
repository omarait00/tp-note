"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCategories = getCategories;
Object.defineProperty(exports, "getFile", {
  enumerable: true,
  get: function () {
    return Registry.getFile;
  }
});
exports.getInstallation = getInstallation;
exports.getInstallationObject = getInstallationObject;
exports.getInstallationObjects = getInstallationObjects;
exports.getInstallations = void 0;
exports.getInstallationsByName = getInstallationsByName;
exports.getLimitedPackages = getLimitedPackages;
exports.getPackageFromSource = getPackageFromSource;
exports.getPackageInfo = getPackageInfo;
exports.getPackageSavedObjects = getPackageSavedObjects;
exports.getPackageUsageStats = void 0;
exports.getPackages = getPackages;
var _gte = _interopRequireDefault(require("semver/functions/gte"));
var _constants = require("../../../../common/constants");
var _services = require("../../../../common/services");
var _constants2 = require("../../../constants");
var _errors = require("../../../errors");
var _ = require("../..");
var Registry = _interopRequireWildcard(require("../registry"));
var _storage = require("../archive/storage");
var _archive = require("../archive");
var _saved_object = require("../../saved_object");
var _2 = require(".");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function nameAsTitle(name) {
  return name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
}
async function getCategories(options) {
  return Registry.fetchCategories(options);
}
async function getPackages(options) {
  const {
    savedObjectsClient,
    category,
    excludeInstallStatus = false,
    prerelease = false
  } = options;
  const registryItems = await Registry.fetchList({
    category,
    prerelease
  }).then(items => {
    return items.map(item => Object.assign({}, item, {
      title: item.title || nameAsTitle(item.name)
    }, {
      id: item.name
    }));
  });
  // get the installed packages
  const packageSavedObjects = await getPackageSavedObjects(savedObjectsClient);
  const packageList = registryItems.map(item => (0, _2.createInstallableFrom)(item, packageSavedObjects.saved_objects.find(({
    id
  }) => id === item.name))).sort(sortByName);
  if (!excludeInstallStatus) {
    return packageList;
  }

  // Exclude the `installStatus` value if the `excludeInstallStatus` query parameter is set to true
  // to better facilitate response caching
  const packageListWithoutStatus = packageList.map(pkg => {
    const newPkg = {
      ...pkg,
      status: undefined
    };
    return newPkg;
  });
  return packageListWithoutStatus;
}

// Get package names for packages which cannot have more than one package policy on an agent policy
async function getLimitedPackages(options) {
  const {
    savedObjectsClient,
    prerelease
  } = options;
  const allPackages = await getPackages({
    savedObjectsClient,
    prerelease
  });
  const installedPackages = allPackages.filter(pkg => pkg.status === _constants.installationStatuses.Installed);
  const installedPackagesInfo = await Promise.all(installedPackages.map(pkgInstall => {
    return getPackageInfo({
      savedObjectsClient,
      pkgName: pkgInstall.name,
      pkgVersion: pkgInstall.version
    });
  }));
  return installedPackagesInfo.filter(_services.isPackageLimited).map(pkgInfo => pkgInfo.name);
}
async function getPackageSavedObjects(savedObjectsClient, options) {
  return savedObjectsClient.find({
    ...(options || {}),
    type: _constants2.PACKAGES_SAVED_OBJECT_TYPE
  });
}
const getInstallations = getPackageSavedObjects;
exports.getInstallations = getInstallations;
async function getPackageInfo({
  savedObjectsClient,
  pkgName,
  pkgVersion,
  skipArchive = false,
  ignoreUnverified = false,
  prerelease
}) {
  var _savedObject$attribut, _savedObject$attribut2;
  const [savedObject, latestPackage] = await Promise.all([getInstallationObject({
    savedObjectsClient,
    pkgName
  }), Registry.fetchFindLatestPackageOrUndefined(pkgName, {
    prerelease
  })]);
  if (!savedObject && !latestPackage) {
    throw new _errors.PackageNotFoundError(`[${pkgName}] package not installed or found in registry`);
  }

  // If no package version is provided, use the installed version in the response, fallback to package from registry
  const resolvedPkgVersion = pkgVersion !== '' ? pkgVersion : (_savedObject$attribut = savedObject === null || savedObject === void 0 ? void 0 : savedObject.attributes.install_version) !== null && _savedObject$attribut !== void 0 ? _savedObject$attribut : latestPackage.version;

  // If same version is available in registry and skipArchive is true, use the info from the registry (faster),
  // otherwise build it from the archive
  let paths;
  const registryInfo = await Registry.fetchInfo(pkgName, resolvedPkgVersion).catch(() => undefined);
  let packageInfo;
  // We need to get input only packages from source to get all fields
  // see https://github.com/elastic/package-registry/issues/864
  if (registryInfo && skipArchive && registryInfo.type !== 'input') {
    var _packageInfo$assets$m, _packageInfo$assets;
    packageInfo = registryInfo;
    // Fix the paths
    paths = (_packageInfo$assets$m = (_packageInfo$assets = packageInfo.assets) === null || _packageInfo$assets === void 0 ? void 0 : _packageInfo$assets.map(path => path.replace(`/package/${pkgName}/${pkgVersion}`, `${pkgName}-${pkgVersion}`))) !== null && _packageInfo$assets$m !== void 0 ? _packageInfo$assets$m : [];
  } else {
    ({
      paths,
      packageInfo
    } = await getPackageFromSource({
      pkgName,
      pkgVersion: resolvedPkgVersion,
      savedObjectsClient,
      installedPkg: savedObject === null || savedObject === void 0 ? void 0 : savedObject.attributes,
      ignoreUnverified
    }));
  }

  // add properties that aren't (or aren't yet) on the package
  const additions = {
    latestVersion: latestPackage !== null && latestPackage !== void 0 && latestPackage.version && (0, _gte.default)(latestPackage.version, resolvedPkgVersion) ? latestPackage.version : resolvedPkgVersion,
    title: packageInfo.title || nameAsTitle(packageInfo.name),
    assets: Registry.groupPathsByService(paths || []),
    notice: Registry.getNoticePath(paths || []),
    licensePath: Registry.getLicensePath(paths || []),
    keepPoliciesUpToDate: (_savedObject$attribut2 = savedObject === null || savedObject === void 0 ? void 0 : savedObject.attributes.keep_policies_up_to_date) !== null && _savedObject$attribut2 !== void 0 ? _savedObject$attribut2 : false
  };
  const updated = {
    ...packageInfo,
    ...additions
  };
  return (0, _2.createInstallableFrom)(updated, savedObject);
}
const getPackageUsageStats = async ({
  savedObjectsClient,
  pkgName
}) => {
  const filter = (0, _saved_object.normalizeKuery)(_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE, `${_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name: ${pkgName}`);
  const agentPolicyCount = new Set();
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    // using saved Objects client directly, instead of the `list()` method of `package_policy` service
    // in order to not cause a circular dependency (package policy service imports from this module)
    const packagePolicies = await savedObjectsClient.find({
      type: _constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE,
      perPage: 1000,
      page: page++,
      filter
    });
    for (let index = 0, total = packagePolicies.saved_objects.length; index < total; index++) {
      agentPolicyCount.add(packagePolicies.saved_objects[index].attributes.policy_id);
    }
    hasMore = packagePolicies.saved_objects.length > 0;
  }
  return {
    agent_policy_count: agentPolicyCount.size
  };
};
exports.getPackageUsageStats = getPackageUsageStats;
// gets package from install_source
async function getPackageFromSource(options) {
  const logger = _.appContextService.getLogger();
  const {
    pkgName,
    pkgVersion,
    installedPkg,
    savedObjectsClient,
    ignoreUnverified = false
  } = options;
  let res;

  // If the package is installed
  if (installedPkg && installedPkg.version === pkgVersion) {
    const {
      install_source: pkgInstallSource
    } = installedPkg;
    // check cache
    res = (0, _archive.getArchivePackage)({
      name: pkgName,
      version: pkgVersion
    });
    if (res) {
      logger.debug(`retrieved installed package ${pkgName}-${pkgVersion} from cache`);
    }
    if (!res && installedPkg.package_assets) {
      res = await (0, _storage.getEsPackage)(pkgName, pkgVersion, installedPkg.package_assets, savedObjectsClient);
      if (res) {
        logger.debug(`retrieved installed package ${pkgName}-${pkgVersion} from ES`);
      }
    }
    // install source is now archive in all cases
    // See https://github.com/elastic/kibana/issues/115032
    if (!res && pkgInstallSource === 'registry') {
      try {
        res = await Registry.getPackage(pkgName, pkgVersion);
        logger.debug(`retrieved installed package ${pkgName}-${pkgVersion}`);
      } catch (error) {
        if (error instanceof _errors.PackageFailedVerificationError) {
          throw error;
        }
        // treating this is a 404 as no status code returned
        // in the unlikely event its missing from cache, storage, and never installed from registry
      }
    }
  } else {
    res = (0, _archive.getArchivePackage)({
      name: pkgName,
      version: pkgVersion
    });
    if (res) {
      logger.debug(`retrieved package ${pkgName}-${pkgVersion} from cache`);
    } else {
      try {
        res = await Registry.getPackage(pkgName, pkgVersion, {
          ignoreUnverified
        });
        logger.debug(`retrieved package ${pkgName}-${pkgVersion} from registry`);
      } catch (err) {
        if (err instanceof _errors.RegistryResponseError && err.status === 404) {
          res = await Registry.getBundledArchive(pkgName, pkgVersion);
        } else {
          throw err;
        }
      }
    }
  }
  if (!res) {
    throw new _errors.FleetError(`package info for ${pkgName}-${pkgVersion} does not exist`);
  }
  return {
    paths: res.paths,
    packageInfo: res.packageInfo
  };
}
async function getInstallationObject(options) {
  const {
    savedObjectsClient,
    pkgName,
    logger
  } = options;
  return savedObjectsClient.get(_constants2.PACKAGES_SAVED_OBJECT_TYPE, pkgName).catch(e => {
    logger === null || logger === void 0 ? void 0 : logger.error(e);
    return undefined;
  });
}
async function getInstallationObjects(options) {
  const {
    savedObjectsClient,
    pkgNames
  } = options;
  const res = await savedObjectsClient.bulkGet(pkgNames.map(pkgName => ({
    id: pkgName,
    type: _constants2.PACKAGES_SAVED_OBJECT_TYPE
  })));
  return res.saved_objects.filter(so => so === null || so === void 0 ? void 0 : so.attributes);
}
async function getInstallation(options) {
  const savedObject = await getInstallationObject(options);
  return savedObject === null || savedObject === void 0 ? void 0 : savedObject.attributes;
}
async function getInstallationsByName(options) {
  const savedObjects = await getInstallationObjects(options);
  return savedObjects.map(so => so.attributes);
}
function sortByName(a, b) {
  if (a.name > b.name) {
    return 1;
  } else if (a.name < b.name) {
    return -1;
  } else {
    return 0;
  }
}