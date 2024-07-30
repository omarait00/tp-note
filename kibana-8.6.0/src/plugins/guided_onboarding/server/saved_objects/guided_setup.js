"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginStateSavedObjectsType = exports.pluginStateSavedObjectsId = exports.pluginStateSavedObjects = exports.guideStateSavedObjectsType = exports.guideStateSavedObjects = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const guideStateSavedObjectsType = 'guided-onboarding-guide-state';
exports.guideStateSavedObjectsType = guideStateSavedObjectsType;
const guideStateSavedObjects = {
  name: guideStateSavedObjectsType,
  hidden: false,
  // make it available in all spaces for now https://github.com/elastic/kibana/issues/144227
  namespaceType: 'agnostic',
  mappings: {
    dynamic: false,
    properties: {
      guideId: {
        type: 'keyword'
      },
      isActive: {
        type: 'boolean'
      }
    }
  }
};
exports.guideStateSavedObjects = guideStateSavedObjects;
const pluginStateSavedObjectsType = 'guided-onboarding-plugin-state';
exports.pluginStateSavedObjectsType = pluginStateSavedObjectsType;
const pluginStateSavedObjectsId = 'guided-onboarding-plugin-state-id';
exports.pluginStateSavedObjectsId = pluginStateSavedObjectsId;
const pluginStateSavedObjects = {
  name: pluginStateSavedObjectsType,
  hidden: false,
  // make it available in all spaces for now https://github.com/elastic/kibana/issues/144227
  namespaceType: 'agnostic',
  mappings: {
    dynamic: false,
    // we don't query this SO so no need for mapping properties, see PluginState intefrace
    properties: {}
  }
};

// plugin state SO interface
exports.pluginStateSavedObjects = pluginStateSavedObjects;