"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCloudManagedTemplatePrefix = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Cloud has its own system for managing templates and we want to make
// this clear in the UI when a template is used in a Cloud deployment.
const getCloudManagedTemplatePrefix = async client => {
  try {
    const {
      persistent,
      transient,
      defaults
    } = await client.asCurrentUser.cluster.getSettings({
      filter_path: '*.*managed_index_templates',
      flat_settings: true,
      include_defaults: true
    });
    const {
      'cluster.metadata.managed_index_templates': managedTemplatesPrefix = undefined
    } = {
      ...defaults,
      ...persistent,
      ...transient
    };
    return managedTemplatesPrefix;
  } catch (e) {
    // Silently swallow error and return undefined for the prefix
    // so that downstream calls are not blocked.
    return;
  }
};
exports.getCloudManagedTemplatePrefix = getCloudManagedTemplatePrefix;