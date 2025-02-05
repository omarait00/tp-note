"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._readGpgKey = _readGpgKey;
exports.formatVerificationResultForSO = formatVerificationResultForSO;
exports.getGpgKeyIdOrUndefined = getGpgKeyIdOrUndefined;
exports.getGpgKeyOrUndefined = getGpgKeyOrUndefined;
exports.verifyPackageArchiveSignature = verifyPackageArchiveSignature;
var _promises = require("fs/promises");
var openpgp = _interopRequireWildcard(require("openpgp"));
var Registry = _interopRequireWildcard(require("../registry"));
var _app_context = require("../../app_context");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let cachedKey = null;
async function getGpgKeyIdOrUndefined() {
  const key = await getGpgKeyOrUndefined();
  if (!key) return undefined;
  return key.getKeyID().toHex();
}
async function getGpgKeyOrUndefined() {
  if (cachedKey !== null) return cachedKey;
  cachedKey = await _readGpgKey();
  return cachedKey;
}
async function _readGpgKey() {
  var _config$packageVerifi;
  const config = _app_context.appContextService.getConfig();
  const logger = _app_context.appContextService.getLogger();
  const gpgKeyPath = config === null || config === void 0 ? void 0 : (_config$packageVerifi = config.packageVerification) === null || _config$packageVerifi === void 0 ? void 0 : _config$packageVerifi.gpgKeyPath;
  if (!gpgKeyPath) {
    logger.warn('GPG key path not configured at "xpack.fleet.packageVerification.gpgKeyPath"');
    return undefined;
  }
  let buffer;
  try {
    buffer = await (0, _promises.readFile)(gpgKeyPath);
  } catch (e) {
    logger.warn(`Unable to retrieve GPG key from '${gpgKeyPath}': ${e.code}`);
    return undefined;
  }
  let key;
  try {
    key = await openpgp.readKey({
      armoredKey: buffer.toString()
    });
  } catch (e) {
    logger.warn(`Unable to parse GPG key from '${gpgKeyPath}': ${e}`);
  }
  return key;
}
async function verifyPackageArchiveSignature({
  pkgName,
  pkgVersion,
  pkgArchiveBuffer,
  logger
}) {
  const verificationKey = await getGpgKeyOrUndefined();
  const result = {
    verificationStatus: 'unknown'
  };
  if (!verificationKey) {
    logger.warn(`Not performing package verification as no local verification key found`);
    return result;
  }
  const pkgArchiveSignature = await Registry.getPackageArchiveSignatureOrUndefined({
    pkgName,
    pkgVersion,
    logger
  });
  if (!pkgArchiveSignature) {
    logger.warn(`Package ${pkgName}-${pkgVersion} has no corresponding signature. Skipping verification.`);
    return result;
  }
  const {
    isVerified,
    keyId
  } = await _verifyPackageSignature({
    pkgArchiveBuffer,
    pkgArchiveSignature,
    verificationKey,
    logger
  });
  return {
    verificationStatus: isVerified ? 'verified' : 'unverified',
    verificationKeyId: keyId
  };
}
async function _verifyPackageSignature({
  pkgArchiveBuffer,
  pkgArchiveSignature,
  verificationKey,
  logger
}) {
  const signature = await openpgp.readSignature({
    armoredSignature: pkgArchiveSignature
  });
  const message = await openpgp.createMessage({
    binary: pkgArchiveBuffer
  });
  const verificationResult = await openpgp.verify({
    verificationKeys: verificationKey,
    signature,
    message
  });
  const signatureVerificationResult = verificationResult.signatures[0];
  let isVerified = false;
  try {
    isVerified = await signatureVerificationResult.verified;
  } catch (e) {
    logger.error(`Error verifying package signature: ${e}`);
  }
  return {
    isVerified,
    keyId: verificationKey.getKeyID().toHex()
  };
}
function formatVerificationResultForSO(verificationResult) {
  const verification = {
    verification_status: verificationResult.verificationStatus
  };
  if (verificationResult.verificationKeyId) {
    verification.verification_key_id = verificationResult.verificationKeyId;
  }
  return verification;
}