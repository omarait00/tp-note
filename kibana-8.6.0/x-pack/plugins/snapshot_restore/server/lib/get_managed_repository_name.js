"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getManagedRepositoryName = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Cloud has its own system for managing snapshots and we want to make
// this clear when Snapshot and Restore is used in a Cloud deployment.
// Retrieve the Cloud-managed repository name so that UI can switch
// logical paths based on this information.
const getManagedRepositoryName = async client => {
  try {
    const {
      persistent,
      transient,
      defaults
    } = await client.cluster.getSettings({
      filter_path: '*.*managed_repository',
      flat_settings: true,
      include_defaults: true
    });
    const {
      'cluster.metadata.managed_repository': managedRepositoryName = undefined
    } = {
      ...defaults,
      ...persistent,
      ...transient
    };
    return managedRepositoryName;
  } catch (e) {
    // Silently swallow error and return undefined for managed repository name
    // so that downstream calls are not blocked. In a healthy environment we do
    // not expect to reach here.
    return;
  }
};
exports.getManagedRepositoryName = getManagedRepositoryName;