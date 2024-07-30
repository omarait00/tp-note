"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tagKibanaAssets = tagKibanaAssets;
var _constants = require("../../../../../../saved_objects_tagging/common/constants");
var _app_context = require("../../../app_context");
var _install = require("./install");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TAG_COLOR = '#FFFFFF';
const MANAGED_TAG_NAME = 'Managed';
const LEGACY_MANAGED_TAG_ID = 'managed';
const getManagedTagId = spaceId => `fleet-managed-${spaceId}`;
const getPackageTagId = (spaceId, pkgName) => `fleet-pkg-${pkgName}-${spaceId}`;
const getLegacyPackageTagId = pkgName => pkgName;
async function tagKibanaAssets(opts) {
  const {
    savedObjectTagAssignmentService,
    kibanaAssets,
    importedAssets
  } = opts;
  const getNewId = assetId => {
    var _importedAssets$find$, _importedAssets$find;
    return (_importedAssets$find$ = (_importedAssets$find = importedAssets.find(imported => imported.id === assetId)) === null || _importedAssets$find === void 0 ? void 0 : _importedAssets$find.destinationId) !== null && _importedAssets$find$ !== void 0 ? _importedAssets$find$ : assetId;
  };
  const taggableAssets = getTaggableAssets(kibanaAssets).map(asset => ({
    ...asset,
    id: getNewId(asset.id)
  }));

  // no assets to tag
  if (taggableAssets.length === 0) {
    return;
  }
  const [managedTagId, packageTagId] = await Promise.all([ensureManagedTag(opts), ensurePackageTag(opts)]);
  try {
    await savedObjectTagAssignmentService.updateTagAssignments({
      tags: [managedTagId, packageTagId],
      assign: taggableAssets,
      unassign: [],
      refresh: false
    });
  } catch (error) {
    if (error.status === 404) {
      _app_context.appContextService.getLogger().warn(error.message);
      return;
    }
    throw error;
  }
}
function getTaggableAssets(kibanaAssets) {
  return Object.entries(kibanaAssets).flatMap(([assetType, assets]) => {
    if (!_constants.taggableTypes.includes(_install.KibanaSavedObjectTypeMapping[assetType])) {
      return [];
    }
    if (!assets.length) {
      return [];
    }
    return assets;
  });
}
async function ensureManagedTag(opts) {
  const {
    spaceId,
    savedObjectTagClient
  } = opts;
  const managedTagId = getManagedTagId(spaceId);
  const managedTag = await savedObjectTagClient.get(managedTagId).catch(() => {});
  if (managedTag) return managedTagId;
  const legacyManagedTag = await savedObjectTagClient.get(LEGACY_MANAGED_TAG_ID).catch(() => {});
  if (legacyManagedTag) return LEGACY_MANAGED_TAG_ID;
  await savedObjectTagClient.create({
    name: MANAGED_TAG_NAME,
    description: '',
    color: TAG_COLOR
  }, {
    id: managedTagId,
    overwrite: true,
    refresh: false
  });
  return managedTagId;
}
async function ensurePackageTag(opts) {
  const {
    spaceId,
    savedObjectTagClient,
    pkgName,
    pkgTitle
  } = opts;
  const packageTagId = getPackageTagId(spaceId, pkgName);
  const packageTag = await savedObjectTagClient.get(packageTagId).catch(() => {});
  if (packageTag) return packageTagId;
  const legacyPackageTagId = getLegacyPackageTagId(pkgName);
  const legacyPackageTag = await savedObjectTagClient.get(legacyPackageTagId).catch(() => {});
  if (legacyPackageTag) return legacyPackageTagId;
  await savedObjectTagClient.create({
    name: pkgTitle,
    description: '',
    color: TAG_COLOR
  }, {
    id: packageTagId,
    overwrite: true,
    refresh: false
  });
  return packageTagId;
}