"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexInfo = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _config = require("../config");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Internal info used by the index bootstrapping logic, reader and writer.
 * Should not be exposed to clients of the library.
 *
 * Names returned by methods of this class should be used in Elasticsearch APIs.
 */
class IndexInfo {
  constructor(options) {
    (0, _defineProperty2.default)(this, "indexOptions", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "baseName", void 0);
    (0, _defineProperty2.default)(this, "basePattern", void 0);
    (0, _defineProperty2.default)(this, "baseNameForBackingIndices", void 0);
    const {
      indexOptions,
      kibanaVersion
    } = options;
    const {
      registrationContext,
      dataset,
      additionalPrefix
    } = indexOptions;
    this.indexOptions = indexOptions;
    this.kibanaVersion = kibanaVersion;
    this.baseName = (0, _utils.joinWithDash)(`${additionalPrefix !== null && additionalPrefix !== void 0 ? additionalPrefix : ''}${_config.INDEX_PREFIX}`, `${registrationContext}.${dataset}`);
    this.basePattern = (0, _utils.joinWithDash)(this.baseName, '*');
    this.baseNameForBackingIndices = `.internal${this.baseName}`;
  }

  /**
   * Options provided by the plugin/solution defining the index.
   */

  /**
   * Primary index alias. Includes a namespace.
   * Used as a write target when writing documents to the index.
   * @example '.alerts-security.alerts-default'
   */
  getPrimaryAlias(namespace) {
    return (0, _utils.joinWithDash)(this.baseName, namespace);
  }

  /**
   * Optional secondary alias that can be applied to concrete indices in
   * addition to the primary one.
   * @example '.siem-signals-default', null
   */
  getSecondaryAlias(namespace) {
    const {
      secondaryAlias
    } = this.indexOptions;
    return secondaryAlias ? (0, _utils.joinWithDash)(secondaryAlias, namespace) : null;
  }

  /**
   * Name of the initial concrete index, with the namespace and the ILM suffix.
   * @example '.internal.alerts-security.alerts-default-000001'
   */
  getConcreteIndexInitialName(namespace) {
    return (0, _utils.joinWithDash)(this.baseNameForBackingIndices, namespace, '000001');
  }

  /**
   * Index pattern for internal backing indices. Used in the index bootstrapping logic.
   * Can include or exclude the namespace.
   *
   * WARNING: Must not be used for reading documents! If you use it, you should know what you're doing.
   *
   * @example '.internal.alerts-security.alerts-default-*', '.internal.alerts-security.alerts-*'
   */
  getPatternForBackingIndices(namespace) {
    return (0, _utils.joinWithDash)(this.baseNameForBackingIndices, namespace, '*');
  }

  /**
   * Index pattern that should be used when reading documents from the index.
   * Can include or exclude the namespace.
   *
   * IMPORTANT: The namespace is user-defined in general. Because of that, when
   * reading data from the index, we want to do this by default:
   *   - pass namespace = undefined
   *   - search over all the namespaces
   *   - include nested registration contexts eagerly
   *   - e.g. if baseName='.alerts-observability', include '.alerts-observability.apm'
   *
   * @example '.alerts-security.alerts-default*', '.alerts-security.alerts*'
   */
  getPatternForReading(namespace) {
    return `${(0, _utils.joinWithDash)(this.baseName, namespace)}*`;
  }

  /**
   * Name of the custom ILM policy (if it's provided by the plugin/solution).
   * Specific to the index. Shared between all namespaces of the index.
   * @example '.alerts-security.alerts-policy'
   */
  getIlmPolicyName() {
    return (0, _utils.joinWithDash)(this.baseName, 'policy');
  }

  /**
   * Full name of a component template.
   * @example '.alerts-security.alerts-mappings'
   */
  getComponentTemplateName(relativeName) {
    return (0, _utils.joinWithDash)(this.baseName, relativeName);
  }

  /**
   * Full name of the index template. Each namespace gets its own template.
   * @example '.alerts-security.alerts-default-index-template'
   */
  getIndexTemplateName(namespace) {
    return (0, _utils.joinWithDash)(this.baseName, namespace, 'index-template');
  }
}
exports.IndexInfo = IndexInfo;