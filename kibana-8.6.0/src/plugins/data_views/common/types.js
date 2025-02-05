"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataViewType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
/**
 * Runtime field types
 */
/**
 * Runtime field primitive types - excluding composite
 */
/**
 * Runtime field definition
 * @public
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
/**
 * The RuntimeField that will be sent in the ES Query "runtime_mappings" object
 */
/**
 * Field attributes that are user configurable
 * @public
 */
/**
 * This is the RuntimeField interface enhanced with Data view field
 * configuration: field format definition, customLabel or popularity.
 * @public
 */
/**
 * Runtime field composite subfield
 * @public
 */
/**
 * Interface for the data view saved object
 * @public
 */
/**
 * Set of field attributes
 * @public
 * Storage of field attributes. Necessary since the field list isn't saved.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
/**
 * Field attributes that are stored on the data view
 * @public
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
/**
 * Handler for data view notifications
 * @public
 * @param toastInputFields Toast notif config
 * @param key Used to dedupe notifs
 */
/**
 * Handler for data view errors
 * @public
 * @param error Error object
 * @param toastInputFields Toast notif config
 * @param key Used to dedupe notifs
 */
/**
 * Interface for UiSettings common interface {@link UiSettingsClient}
 */
/**
 * Saved objects common find args
 * @public
 */
/**
 * Common interface for the saved objects client
 * @public
 */
/**
 * FieldsForWildcard response
 */
/**
 * Interface for metadata about rollup indices
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
/**
 * Data View type. Default or rollup
 */
let DataViewType;
exports.DataViewType = DataViewType;
(function (DataViewType) {
  DataViewType["DEFAULT"] = "default";
  DataViewType["ROLLUP"] = "rollup";
})(DataViewType || (exports.DataViewType = DataViewType = {}));