"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FleetEncryptedSavedObjectEncryptionKeyRequired = exports.DownloadSourceError = exports.ConcurrentInstallOperationError = exports.BundledPackageNotFoundError = exports.ArtifactsElasticsearchError = exports.ArtifactsClientError = exports.ArtifactsClientAccessDeniedError = exports.AgentReassignmentError = exports.AgentPolicyNotFoundError = exports.AgentPolicyNameExistsError = exports.AgentPolicyError = exports.AgentNotFoundError = exports.AgentActionNotFoundError = void 0;
Object.defineProperty(exports, "FleetError", {
  enumerable: true,
  get: function () {
    return _errors.FleetError;
  }
});
exports.RegistryResponseError = exports.RegistryError = exports.RegistryConnectionError = exports.PackageUnsupportedMediaTypeError = exports.PackagePolicyValidationError = exports.PackagePolicyRestrictionRelatedError = exports.PackagePolicyNotFoundError = exports.PackagePolicyIneligibleForUpgradeError = exports.PackageOutdatedError = exports.PackageOperationNotSupportedError = exports.PackageNotFoundError = exports.PackageKeyInvalidError = exports.PackageInvalidArchiveError = exports.PackageFailedVerificationError = exports.PackageCacheError = exports.OutputUnauthorizedError = exports.OutputLicenceError = exports.OutputInvalidError = exports.HostedAgentPolicyRestrictionRelatedError = exports.GenerateServiceTokenError = exports.FleetUnauthorizedError = exports.FleetSetupError = exports.FleetServerHostUnauthorizedError = void 0;
Object.defineProperty(exports, "defaultFleetErrorHandler", {
  enumerable: true,
  get: function () {
    return _handlers.defaultFleetErrorHandler;
  }
});
Object.defineProperty(exports, "fleetErrorToResponseOptions", {
  enumerable: true,
  get: function () {
    return _handlers.fleetErrorToResponseOptions;
  }
});
Object.defineProperty(exports, "isESClientError", {
  enumerable: true,
  get: function () {
    return _utils.isESClientError;
  }
});
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _errors = require("../../common/errors");
var _utils = require("./utils");
var _handlers = require("./handlers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class RegistryError extends _errors.FleetError {}
exports.RegistryError = RegistryError;
class RegistryConnectionError extends RegistryError {}
exports.RegistryConnectionError = RegistryConnectionError;
class RegistryResponseError extends RegistryError {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
exports.RegistryResponseError = RegistryResponseError;
class PackageNotFoundError extends _errors.FleetError {}
exports.PackageNotFoundError = PackageNotFoundError;
class PackageKeyInvalidError extends _errors.FleetError {}
exports.PackageKeyInvalidError = PackageKeyInvalidError;
class PackageOutdatedError extends _errors.FleetError {}
exports.PackageOutdatedError = PackageOutdatedError;
class PackageFailedVerificationError extends _errors.FleetError {
  constructor(pkgName, pkgVersion) {
    super(`${pkgName}-${pkgVersion} failed signature verification.`);
    this.attributes = {
      type: 'verification_failed'
    };
  }
}
exports.PackageFailedVerificationError = PackageFailedVerificationError;
class AgentPolicyError extends _errors.FleetError {}
exports.AgentPolicyError = AgentPolicyError;
class AgentPolicyNotFoundError extends _errors.FleetError {}
exports.AgentPolicyNotFoundError = AgentPolicyNotFoundError;
class AgentNotFoundError extends _errors.FleetError {}
exports.AgentNotFoundError = AgentNotFoundError;
class AgentActionNotFoundError extends _errors.FleetError {}
exports.AgentActionNotFoundError = AgentActionNotFoundError;
class AgentPolicyNameExistsError extends AgentPolicyError {}
exports.AgentPolicyNameExistsError = AgentPolicyNameExistsError;
class PackageUnsupportedMediaTypeError extends _errors.FleetError {}
exports.PackageUnsupportedMediaTypeError = PackageUnsupportedMediaTypeError;
class PackageInvalidArchiveError extends _errors.FleetError {}
exports.PackageInvalidArchiveError = PackageInvalidArchiveError;
class PackageCacheError extends _errors.FleetError {}
exports.PackageCacheError = PackageCacheError;
class PackageOperationNotSupportedError extends _errors.FleetError {}
exports.PackageOperationNotSupportedError = PackageOperationNotSupportedError;
class ConcurrentInstallOperationError extends _errors.FleetError {}
exports.ConcurrentInstallOperationError = ConcurrentInstallOperationError;
class AgentReassignmentError extends _errors.FleetError {}
exports.AgentReassignmentError = AgentReassignmentError;
class PackagePolicyIneligibleForUpgradeError extends _errors.FleetError {}
exports.PackagePolicyIneligibleForUpgradeError = PackagePolicyIneligibleForUpgradeError;
class PackagePolicyValidationError extends _errors.FleetError {}
exports.PackagePolicyValidationError = PackagePolicyValidationError;
class PackagePolicyNotFoundError extends _errors.FleetError {}
exports.PackagePolicyNotFoundError = PackagePolicyNotFoundError;
class BundledPackageNotFoundError extends _errors.FleetError {}
exports.BundledPackageNotFoundError = BundledPackageNotFoundError;
class HostedAgentPolicyRestrictionRelatedError extends _errors.FleetError {
  constructor(message = 'Cannot perform that action') {
    super(`${message} in Fleet because the agent policy is managed by an external orchestration solution, such as Elastic Cloud, Kubernetes, etc. Please make changes using your orchestration solution.`);
  }
}
exports.HostedAgentPolicyRestrictionRelatedError = HostedAgentPolicyRestrictionRelatedError;
class PackagePolicyRestrictionRelatedError extends _errors.FleetError {
  constructor(message = 'Cannot perform that action') {
    super(`${message} in Fleet because the package policy is managed by an external orchestration solution, such as Elastic Cloud, Kubernetes, etc. Please make changes using your orchestration solution.`);
  }
}
exports.PackagePolicyRestrictionRelatedError = PackagePolicyRestrictionRelatedError;
class FleetEncryptedSavedObjectEncryptionKeyRequired extends _errors.FleetError {}
exports.FleetEncryptedSavedObjectEncryptionKeyRequired = FleetEncryptedSavedObjectEncryptionKeyRequired;
class FleetSetupError extends _errors.FleetError {}
exports.FleetSetupError = FleetSetupError;
class GenerateServiceTokenError extends _errors.FleetError {}
exports.GenerateServiceTokenError = GenerateServiceTokenError;
class FleetUnauthorizedError extends _errors.FleetError {}
exports.FleetUnauthorizedError = FleetUnauthorizedError;
class OutputUnauthorizedError extends _errors.FleetError {}
exports.OutputUnauthorizedError = OutputUnauthorizedError;
class OutputInvalidError extends _errors.FleetError {}
exports.OutputInvalidError = OutputInvalidError;
class OutputLicenceError extends _errors.FleetError {}
exports.OutputLicenceError = OutputLicenceError;
class DownloadSourceError extends _errors.FleetError {}
exports.DownloadSourceError = DownloadSourceError;
class FleetServerHostUnauthorizedError extends _errors.FleetError {}
exports.FleetServerHostUnauthorizedError = FleetServerHostUnauthorizedError;
class ArtifactsClientError extends _errors.FleetError {}
exports.ArtifactsClientError = ArtifactsClientError;
class ArtifactsClientAccessDeniedError extends _errors.FleetError {
  constructor(deniedPackageName, allowedPackageName) {
    super(`Access denied. Artifact package name (${deniedPackageName}) does not match ${allowedPackageName}`);
  }
}
exports.ArtifactsClientAccessDeniedError = ArtifactsClientAccessDeniedError;
class ArtifactsElasticsearchError extends _errors.FleetError {
  constructor(meta) {
    var _meta$meta$body, _meta$meta$body$error, _meta$meta$body2, _meta$meta$body2$erro;
    super(`${(0, _utils.isESClientError)(meta) && (_meta$meta$body = meta.meta.body) !== null && _meta$meta$body !== void 0 && (_meta$meta$body$error = _meta$meta$body.error) !== null && _meta$meta$body$error !== void 0 && _meta$meta$body$error.reason ? (_meta$meta$body2 = meta.meta.body) === null || _meta$meta$body2 === void 0 ? void 0 : (_meta$meta$body2$erro = _meta$meta$body2.error) === null || _meta$meta$body2$erro === void 0 ? void 0 : _meta$meta$body2$erro.reason : `Elasticsearch error while working with artifacts: ${meta.message}`}`);
    (0, _defineProperty2.default)(this, "requestDetails", void 0);
    this.meta = meta;
    if ((0, _utils.isESClientError)(meta)) {
      const {
        method,
        path,
        querystring = '',
        body = ''
      } = meta.meta.meta.request.params;
      this.requestDetails = `${method} ${path}${querystring ? `?${querystring}` : ''}${body ? `\n${body}` : ''}`;
    } else {
      this.requestDetails = 'unable to determine request details';
    }
  }
}
exports.ArtifactsElasticsearchError = ArtifactsElasticsearchError;