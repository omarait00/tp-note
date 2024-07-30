"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchArchiveBuffer = fetchArchiveBuffer;
exports.fetchCategories = fetchCategories;
exports.fetchFile = fetchFile;
exports.fetchFindLatestPackageOrThrow = fetchFindLatestPackageOrThrow;
exports.fetchFindLatestPackageOrUndefined = fetchFindLatestPackageOrUndefined;
exports.fetchInfo = fetchInfo;
exports.fetchList = fetchList;
exports.getBundledArchive = getBundledArchive;
exports.getFile = getFile;
exports.getInfo = getInfo;
exports.getLicensePath = getLicensePath;
exports.getNoticePath = getNoticePath;
exports.getPackage = getPackage;
exports.getPackageArchiveSignatureOrUndefined = getPackageArchiveSignatureOrUndefined;
exports.groupPathsByService = groupPathsByService;
exports.splitPkgKey = exports.pkgToPkgKey = void 0;
var _url = require("url");
var _mimeTypes = _interopRequireDefault(require("mime-types"));
var _gte = _interopRequireDefault(require("semver/functions/gte"));
var _services = require("../../../../common/services");
var _types = require("../../../types");
var _archive = require("../archive");
var _streams = require("../streams");
var _ = require("../..");
var _errors = require("../../../errors");
var _bundled_packages = require("../packages/bundled_packages");
var _utils = require("../packages/utils");
var _package_verification = require("../packages/package_verification");
var _requests = require("./requests");
var _registry_url = require("./registry_url");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const splitPkgKey = _services.splitPkgKey;
exports.splitPkgKey = splitPkgKey;
const pkgToPkgKey = ({
  name,
  version
}) => `${name}-${version}`;
exports.pkgToPkgKey = pkgToPkgKey;
async function fetchList(params) {
  const registryUrl = (0, _registry_url.getRegistryUrl)();
  const url = new _url.URL(`${registryUrl}/search`);
  if (params) {
    if (params.category) {
      url.searchParams.set('category', params.category);
    }
    if (params.prerelease) {
      url.searchParams.set('prerelease', params.prerelease.toString());
    }
  }
  setKibanaVersion(url);
  return (0, _requests.fetchUrl)(url.toString()).then(JSON.parse);
}
async function _fetchFindLatestPackage(packageName, options) {
  return (0, _utils.withPackageSpan)(`Find latest package ${packageName}`, async () => {
    const logger = _.appContextService.getLogger();
    const {
      ignoreConstraints = false,
      prerelease = false
    } = options !== null && options !== void 0 ? options : {};
    const bundledPackage = await (0, _bundled_packages.getBundledPackageByName)(packageName);

    // temporary workaround to allow synthetics package beta version until there is a GA available
    // needed because synthetics is installed by default on kibana startup
    const prereleaseAllowedExceptions = ['synthetics'];
    const prereleaseEnabled = prerelease || prereleaseAllowedExceptions.includes(packageName);
    const registryUrl = (0, _registry_url.getRegistryUrl)();
    const url = new _url.URL(`${registryUrl}/search?package=${packageName}&prerelease=${prereleaseEnabled}`);
    if (!ignoreConstraints) {
      setKibanaVersion(url);
    }
    try {
      var _searchResults$;
      const res = await (0, _requests.fetchUrl)(url.toString(), 1);
      const searchResults = JSON.parse(res);
      const latestPackageFromRegistry = (_searchResults$ = searchResults[0]) !== null && _searchResults$ !== void 0 ? _searchResults$ : null;
      if (bundledPackage && (0, _gte.default)(bundledPackage.version, latestPackageFromRegistry.version)) {
        return bundledPackage;
      }
      return latestPackageFromRegistry;
    } catch (error) {
      logger.error(`Failed to fetch latest version of ${packageName} from registry: ${error.message}`);

      // Fall back to the bundled version of the package if it exists
      if (bundledPackage) {
        return bundledPackage;
      }

      // Otherwise, return null and allow callers to determine whether they'll consider this an error or not
      return null;
    }
  });
}
async function fetchFindLatestPackageOrThrow(packageName, options) {
  const latestPackage = await _fetchFindLatestPackage(packageName, options);
  if (!latestPackage) {
    throw new _errors.PackageNotFoundError(`[${packageName}] package not found in registry`);
  }
  return latestPackage;
}
async function fetchFindLatestPackageOrUndefined(packageName, options) {
  const logger = _.appContextService.getLogger();
  try {
    const latestPackage = await _fetchFindLatestPackage(packageName, options);
    if (!latestPackage) {
      return undefined;
    }
    return latestPackage;
  } catch (error) {
    logger.warn(`Error fetching latest package for ${packageName}: ${error.message}`);
    return undefined;
  }
}
async function fetchInfo(pkgName, pkgVersion) {
  const registryUrl = (0, _registry_url.getRegistryUrl)();
  try {
    // Trailing slash avoids 301 redirect / extra hop
    const res = await (0, _requests.fetchUrl)(`${registryUrl}/package/${pkgName}/${pkgVersion}/`).then(JSON.parse);
    return res;
  } catch (err) {
    if (err instanceof _errors.RegistryResponseError && err.status === 404) {
      const archivePackage = await getBundledArchive(pkgName, pkgVersion);
      if (archivePackage) {
        return archivePackage.packageInfo;
      }
      throw new _errors.PackageNotFoundError(`${pkgName}@${pkgVersion} not found`);
    }
    throw err;
  }
}
async function getBundledArchive(pkgName, pkgVersion) {
  // Check bundled packages in case the exact package being requested is available on disk
  const bundledPackage = await (0, _bundled_packages.getBundledPackageByName)(pkgName);
  if (bundledPackage && bundledPackage.version === pkgVersion) {
    const archivePackage = await (0, _archive.generatePackageInfoFromArchiveBuffer)(bundledPackage.buffer, 'application/zip');
    return archivePackage;
  }
}
async function getFile(pkgName, pkgVersion, relPath) {
  const filePath = `/package/${pkgName}/${pkgVersion}/${relPath}`;
  return fetchFile(filePath);
}
async function fetchFile(filePath) {
  const registryUrl = (0, _registry_url.getRegistryUrl)();
  return (0, _requests.getResponse)(`${registryUrl}${filePath}`);
}
function setKibanaVersion(url) {
  var _appContextService$ge, _appContextService$ge2, _appContextService$ge3;
  const disableVersionCheck = (_appContextService$ge = (_appContextService$ge2 = _.appContextService.getConfig()) === null || _appContextService$ge2 === void 0 ? void 0 : (_appContextService$ge3 = _appContextService$ge2.developer) === null || _appContextService$ge3 === void 0 ? void 0 : _appContextService$ge3.disableRegistryVersionCheck) !== null && _appContextService$ge !== void 0 ? _appContextService$ge : false;
  if (disableVersionCheck) {
    return;
  }
  const kibanaVersion = _.appContextService.getKibanaVersion().split('-')[0]; // may be x.y.z-SNAPSHOT

  if (kibanaVersion) {
    url.searchParams.set('kibana.version', kibanaVersion);
  }
}
async function fetchCategories(params) {
  const registryUrl = (0, _registry_url.getRegistryUrl)();
  const url = new _url.URL(`${registryUrl}/categories`);
  if (params) {
    if (params.prerelease) {
      url.searchParams.set('prerelease', params.prerelease.toString());
    }
    if (params.include_policy_templates) {
      url.searchParams.set('include_policy_templates', params.include_policy_templates.toString());
    }
  }
  setKibanaVersion(url);
  return (0, _requests.fetchUrl)(url.toString()).then(JSON.parse);
}
async function getInfo(name, version) {
  return (0, _utils.withPackageSpan)('Fetch package info', async () => {
    const packageInfo = await fetchInfo(name, version);
    return packageInfo;
  });
}

// Check that the packageInfo exists in cache
// If not, retrieve it from the archive
async function getPackageInfoFromArchiveOrCache(name, version, archiveBuffer, archivePath) {
  const cachedInfo = (0, _archive.getPackageInfo)({
    name,
    version
  });
  if (!cachedInfo) {
    const {
      packageInfo
    } = await (0, _archive.generatePackageInfoFromArchiveBuffer)(archiveBuffer, ensureContentType(archivePath));
    (0, _archive.setPackageInfo)({
      packageInfo,
      name,
      version
    });
    return packageInfo;
  } else {
    return cachedInfo;
  }
}
async function getPackage(name, version, options) {
  const verifyPackage = _.appContextService.getExperimentalFeatures().packageVerification;
  let paths = (0, _archive.getArchiveFilelist)({
    name,
    version
  });
  let packageInfo = (0, _archive.getPackageInfo)({
    name,
    version
  });
  let verificationResult = verifyPackage ? (0, _archive.getVerificationResult)({
    name,
    version
  }) : undefined;
  if (paths && packageInfo) {
    return {
      paths,
      packageInfo,
      verificationResult
    };
  }
  const {
    archiveBuffer,
    archivePath,
    verificationResult: latestVerificationResult
  } = await (0, _utils.withPackageSpan)('Fetch package archive from archive buffer', () => fetchArchiveBuffer({
    pkgName: name,
    pkgVersion: version,
    shouldVerify: verifyPackage,
    ignoreUnverified: options === null || options === void 0 ? void 0 : options.ignoreUnverified
  }));
  if (latestVerificationResult) {
    verificationResult = latestVerificationResult;
    (0, _archive.setVerificationResult)({
      name,
      version
    }, latestVerificationResult);
  }
  if (!paths || paths.length === 0) {
    paths = await (0, _utils.withPackageSpan)('Unpack archive', () => (0, _archive.unpackBufferToCache)({
      name,
      version,
      archiveBuffer,
      contentType: ensureContentType(archivePath)
    }));
  }
  if (!packageInfo) {
    packageInfo = await getPackageInfoFromArchiveOrCache(name, version, archiveBuffer, archivePath);
  }
  return {
    paths,
    packageInfo,
    verificationResult
  };
}
function ensureContentType(archivePath) {
  const contentType = _mimeTypes.default.lookup(archivePath);
  if (!contentType) {
    throw new Error(`Unknown compression format for '${archivePath}'. Please use .zip or .gz`);
  }
  return contentType;
}
async function fetchArchiveBuffer({
  pkgName,
  pkgVersion,
  shouldVerify,
  ignoreUnverified = false
}) {
  const logger = _.appContextService.getLogger();
  let {
    download: archivePath
  } = await getInfo(pkgName, pkgVersion);

  // Bundled packages don't have a download path when they're installed, as they're
  // ArchivePackage objects - so we fake the download path here instead
  if (!archivePath) {
    archivePath = `/epr/${pkgName}/${pkgName}-${pkgVersion}.zip`;
  }
  const archiveUrl = `${(0, _registry_url.getRegistryUrl)()}${archivePath}`;
  const archiveBuffer = await (0, _requests.getResponseStream)(archiveUrl).then(_streams.streamToBuffer);
  if (shouldVerify) {
    const verificationResult = await (0, _package_verification.verifyPackageArchiveSignature)({
      pkgName,
      pkgVersion,
      pkgArchiveBuffer: archiveBuffer,
      logger
    });
    if (verificationResult.verificationStatus === 'unverified' && !ignoreUnverified) {
      throw new _errors.PackageFailedVerificationError(pkgName, pkgVersion);
    }
    return {
      archiveBuffer,
      archivePath,
      verificationResult
    };
  }
  return {
    archiveBuffer,
    archivePath
  };
}
async function getPackageArchiveSignatureOrUndefined({
  pkgName,
  pkgVersion,
  logger
}) {
  const {
    signature_path: signaturePath
  } = await getInfo(pkgName, pkgVersion);
  if (!signaturePath) {
    logger.debug(`Package ${pkgName}-${pkgVersion} does not have a signature_path, verification will not be possible.`);
    return undefined;
  }
  try {
    const {
      body
    } = await fetchFile(signaturePath);
    return (0, _streams.streamToString)(body);
  } catch (e) {
    logger.error(`Error retrieving package signature at '${signaturePath}' : ${e}`);
    return undefined;
  }
}
function groupPathsByService(paths) {
  const kibanaAssetTypes = Object.values(_types.KibanaAssetType);

  // ASK: best way, if any, to avoid `any`?
  const assets = paths.reduce((map, path) => {
    const parts = (0, _archive.getPathParts)(path.replace(/^\/package\//, ''));
    if (parts.service === 'kibana' && kibanaAssetTypes.includes(parts.type) || parts.service === 'elasticsearch') {
      if (!map[parts.service]) map[parts.service] = {};
      if (!map[parts.service][parts.type]) map[parts.service][parts.type] = [];
      map[parts.service][parts.type].push(parts);
    }
    return map;
  }, {});
  return {
    kibana: assets.kibana,
    elasticsearch: assets.elasticsearch
  };
}
function getNoticePath(paths) {
  for (const path of paths) {
    const parts = (0, _archive.getPathParts)(path.replace(/^\/package\//, ''));
    if (parts.type === 'notice') {
      const {
        pkgName,
        pkgVersion
      } = splitPkgKey(parts.pkgkey);
      return `/package/${pkgName}/${pkgVersion}/${parts.file}`;
    }
  }
  return undefined;
}
function getLicensePath(paths) {
  for (const path of paths) {
    const parts = (0, _archive.getPathParts)(path.replace(/^\/package\//, ''));
    if (parts.type === 'license') {
      const {
        pkgName,
        pkgVersion
      } = splitPkgKey(parts.pkgkey);
      return `/package/${pkgName}/${pkgVersion}/${parts.file}`;
    }
  }
  return undefined;
}