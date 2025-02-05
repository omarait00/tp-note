"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.archiveEntryToBulkCreateObject = archiveEntryToBulkCreateObject;
exports.archiveEntryToESDocument = archiveEntryToESDocument;
exports.assetPathToObjectId = assetPathToObjectId;
exports.getAsset = getAsset;
exports.getEsPackage = void 0;
exports.packageAssetToArchiveEntry = packageAssetToArchiveEntry;
exports.removeArchiveEntries = removeArchiveEntries;
exports.saveArchiveEntries = saveArchiveEntries;
var _path = require("path");
var _lodash = require("lodash");
var _jsYaml = require("js-yaml");
var _isbinaryfile = require("isbinaryfile");
var _mimeTypes = _interopRequireDefault(require("mime-types"));
var _v = _interopRequireDefault(require("uuid/v5"));
var _server = require("../../../../../../../src/core/server");
var _common = require("../../../../common");
var _registry = require("../registry");
var _app_context = require("../../app_context");
var _ = require(".");
var _parse = require("./parse");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ONE_BYTE = 1024 * 1024;
// could be anything, picked this from https://github.com/elastic/elastic-agent-client/issues/17
const MAX_ES_ASSET_BYTES = 4 * ONE_BYTE;
// Updated to accomodate larger package size in some ML model packages
const ML_MAX_ES_ASSET_BYTES = 50 * ONE_BYTE;
function assetPathToObjectId(assetPath) {
  // uuid v5 requires a SHA-1 UUID as a namespace
  // used to ensure same input produces the same id
  return (0, _v.default)(assetPath, '71403015-cdd5-404b-a5da-6c43f35cad84');
}
async function archiveEntryToESDocument(opts) {
  const {
    path,
    buffer,
    name,
    version,
    installSource
  } = opts;
  const fileExt = (0, _path.extname)(path);
  const contentType = _mimeTypes.default.lookup(fileExt);
  const mediaType = _mimeTypes.default.contentType(contentType || fileExt);
  // can use to create a data URL like `data:${mediaType};base64,${base64Data}`

  const bufferIsBinary = await (0, _isbinaryfile.isBinaryFile)(buffer);
  const dataUtf8 = bufferIsBinary ? '' : buffer.toString('utf8');
  const dataBase64 = bufferIsBinary ? buffer.toString('base64') : '';
  const currentMaxAssetBytes = path.includes('ml_model') ? ML_MAX_ES_ASSET_BYTES : MAX_ES_ASSET_BYTES;

  // validation: filesize? asset type? anything else
  if (dataUtf8.length > currentMaxAssetBytes) {
    throw new Error(`File at ${path} is larger than maximum allowed size of ${currentMaxAssetBytes}`);
  }
  if (dataBase64.length > currentMaxAssetBytes) {
    throw new Error(`After base64 encoding file at ${path} is larger than maximum allowed size of ${currentMaxAssetBytes}`);
  }
  return {
    package_name: name,
    package_version: version,
    install_source: installSource,
    asset_path: path,
    media_type: mediaType || '',
    data_utf8: dataUtf8,
    data_base64: dataBase64
  };
}
async function removeArchiveEntries(opts) {
  const {
    savedObjectsClient,
    refs
  } = opts;
  if (!refs) return;
  const results = await Promise.all(refs.map(ref => savedObjectsClient.delete(_common.ASSETS_SAVED_OBJECT_TYPE, ref.id)));
  return results;
}
async function saveArchiveEntries(opts) {
  const {
    savedObjectsClient,
    paths,
    packageInfo,
    installSource
  } = opts;
  const bulkBody = await Promise.all(paths.map(path => {
    const buffer = (0, _.getArchiveEntry)(path);
    if (!buffer) throw new Error(`Could not find ArchiveEntry at ${path}`);
    const {
      name,
      version
    } = packageInfo;
    return archiveEntryToBulkCreateObject({
      path,
      buffer,
      name,
      version,
      installSource
    });
  }));
  const results = await savedObjectsClient.bulkCreate(bulkBody, {
    refresh: false
  });
  return results;
}
async function archiveEntryToBulkCreateObject(opts) {
  const {
    path,
    buffer,
    name,
    version,
    installSource
  } = opts;
  const doc = await archiveEntryToESDocument({
    path,
    buffer,
    name,
    version,
    installSource
  });
  return {
    id: assetPathToObjectId(doc.asset_path),
    type: _common.ASSETS_SAVED_OBJECT_TYPE,
    attributes: doc
  };
}
function packageAssetToArchiveEntry(asset) {
  const {
    asset_path: path,
    data_utf8: utf8,
    data_base64: base64
  } = asset;
  const buffer = utf8 ? Buffer.from(utf8, 'utf8') : Buffer.from(base64, 'base64');
  return {
    path,
    buffer
  };
}
async function getAsset(opts) {
  const {
    savedObjectsClient,
    path
  } = opts;
  try {
    const assetSavedObject = await savedObjectsClient.get(_common.ASSETS_SAVED_OBJECT_TYPE, assetPathToObjectId(path));
    const storedAsset = assetSavedObject === null || assetSavedObject === void 0 ? void 0 : assetSavedObject.attributes;
    if (!storedAsset) {
      return;
    }
    return storedAsset;
  } catch (error) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(error)) {
      _app_context.appContextService.getLogger().warn(error.message);
      return;
    }
    throw error;
  }
}
const getEsPackage = async (pkgName, pkgVersion, references, savedObjectsClient) => {
  const logger = _app_context.appContextService.getLogger();
  const pkgKey = (0, _registry.pkgToPkgKey)({
    name: pkgName,
    version: pkgVersion
  });
  const bulkRes = await savedObjectsClient.bulkGet(references.map(reference => ({
    ...reference,
    fields: ['asset_path', 'data_utf8', 'data_base64']
  })));
  const errors = bulkRes.saved_objects.filter(so => so.error || !so.attributes);
  const assets = bulkRes.saved_objects.map(so => so.attributes);
  if (errors.length) {
    const resolvedErrors = errors.map(so => so.error ? {
      type: so.type,
      id: so.id,
      error: so.error
    } : !so.attributes ? {
      type: so.type,
      id: so.id,
      error: {
        error: `No attributes retrieved`
      }
    } : {
      type: so.type,
      id: so.id,
      error: {
        error: `Unknown`
      }
    });
    logger.warn(`Failed to retrieve ${pkgName}-${pkgVersion} package from ES storage. bulkGet failed for assets: ${JSON.stringify(resolvedErrors)}`);
    return undefined;
  }
  const paths = [];
  const entries = assets.map(packageAssetToArchiveEntry);
  entries.forEach(({
    path,
    buffer
  }) => {
    if (path && buffer) {
      (0, _.setArchiveEntry)(path, buffer);
      paths.push(path);
    }
  });

  // create the packageInfo
  // TODO: this is mostly copied from validtion.ts, needed in case package does not exist in storage yet or is missing from cache
  // we don't want to reach out to the registry again so recreate it here.  should check whether it exists in packageInfoCache first
  const manifestPath = `${pkgName}-${pkgVersion}/manifest.yml`;
  const soResManifest = await savedObjectsClient.get(_common.ASSETS_SAVED_OBJECT_TYPE, assetPathToObjectId(manifestPath));
  const packageInfo = (0, _jsYaml.safeLoad)(soResManifest.attributes.data_utf8);
  try {
    const readmePath = `docs/README.md`;
    await savedObjectsClient.get(_common.ASSETS_SAVED_OBJECT_TYPE, assetPathToObjectId(`${pkgName}-${pkgVersion}/${readmePath}`));
    packageInfo.readme = `/package/${pkgName}/${pkgVersion}/${readmePath}`;
  } catch (err) {
    // read me doesn't exist
  }
  let dataStreamPaths = [];
  const dataStreams = [];
  paths.filter(path => path.startsWith(`${pkgKey}/data_stream/`)).forEach(path => {
    const parts = path.split('/');
    if (parts.length > 2 && parts[2]) dataStreamPaths.push(parts[2]);
  });
  dataStreamPaths = (0, _lodash.uniq)(dataStreamPaths);
  await Promise.all(dataStreamPaths.map(async dataStreamPath => {
    const dataStreamManifestPath = `${pkgKey}/data_stream/${dataStreamPath}/manifest.yml`;
    const soResDataStreamManifest = await savedObjectsClient.get(_common.ASSETS_SAVED_OBJECT_TYPE, assetPathToObjectId(dataStreamManifestPath));
    const dataStreamManifest = (0, _jsYaml.safeLoad)(soResDataStreamManifest.attributes.data_utf8);
    const {
      ingest_pipeline: ingestPipeline,
      dataset,
      streams: manifestStreams,
      ...dataStreamManifestProps
    } = dataStreamManifest;
    const streams = (0, _parse.parseAndVerifyStreams)(manifestStreams, dataStreamPath);
    dataStreams.push({
      dataset: dataset || `${pkgName}.${dataStreamPath}`,
      package: pkgName,
      ingest_pipeline: ingestPipeline,
      path: dataStreamPath,
      streams,
      ...dataStreamManifestProps
    });
  }));
  packageInfo.policy_templates = (0, _parse.parseAndVerifyPolicyTemplates)(packageInfo);
  packageInfo.data_streams = dataStreams;
  packageInfo.assets = paths.map(path => {
    return path.replace(`${pkgName}-${pkgVersion}`, `/package/${pkgName}/${pkgVersion}`);
  });

  // Add asset references to cache
  (0, _.setArchiveFilelist)({
    name: pkgName,
    version: pkgVersion
  }, paths);
  (0, _.setPackageInfo)({
    name: pkgName,
    version: pkgVersion,
    packageInfo
  });
  return {
    paths,
    packageInfo
  };
};
exports.getEsPackage = getEsPackage;