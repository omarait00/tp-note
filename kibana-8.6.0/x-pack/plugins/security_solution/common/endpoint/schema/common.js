"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.size = exports.sha256 = exports.semanticVersion = exports.relativeUrl = exports.manifestSchemaVersion = exports.identifier = exports.encryptionAlgorithm = exports.compressionAlgorithmDispatch = exports.compressionAlgorithm = void 0;
var t = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const compressionAlgorithm = t.keyof({
  none: null,
  zlib: null
});
exports.compressionAlgorithm = compressionAlgorithm;
const compressionAlgorithmDispatch = t.keyof({
  zlib: null,
  none: null
});
exports.compressionAlgorithmDispatch = compressionAlgorithmDispatch;
const encryptionAlgorithm = t.keyof({
  none: null
});
exports.encryptionAlgorithm = encryptionAlgorithm;
const identifier = t.string;
exports.identifier = identifier;
const manifestSchemaVersion = t.keyof({
  v1: null
});
exports.manifestSchemaVersion = manifestSchemaVersion;
const relativeUrl = t.string;
exports.relativeUrl = relativeUrl;
const sha256 = t.string;
exports.sha256 = sha256;
const semanticVersion = t.string;
exports.semanticVersion = semanticVersion;
const size = t.number;
exports.size = size;