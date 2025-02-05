"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManifestEntry = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../../fleet/server");
var _common = require("./common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class ManifestEntry {
  constructor(artifact) {
    (0, _defineProperty2.default)(this, "artifact", void 0);
    this.artifact = artifact;
  }
  getDocId() {
    return (0, _common.getArtifactId)(this.artifact);
  }
  getIdentifier() {
    return this.artifact.identifier;
  }
  getCompressionAlgorithm() {
    return this.artifact.compressionAlgorithm;
  }
  getEncodedSha256() {
    return this.artifact.encodedSha256;
  }
  getDecodedSha256() {
    return this.artifact.decodedSha256;
  }
  getEncodedSize() {
    return this.artifact.encodedSize;
  }
  getDecodedSize() {
    return this.artifact.decodedSize;
  }
  getUrl() {
    return (0, _server.relativeDownloadUrlFromArtifact)({
      identifier: this.getIdentifier(),
      decodedSha256: this.getDecodedSha256()
    });
  }
  getArtifact() {
    return this.artifact;
  }
  getRecord() {
    return {
      compression_algorithm: this.getCompressionAlgorithm(),
      encryption_algorithm: 'none',
      decoded_sha256: this.getDecodedSha256(),
      decoded_size: this.getDecodedSize(),
      encoded_sha256: this.getEncodedSha256(),
      encoded_size: this.getEncodedSize(),
      relative_url: this.getUrl()
    };
  }
}
exports.ManifestEntry = ManifestEntry;