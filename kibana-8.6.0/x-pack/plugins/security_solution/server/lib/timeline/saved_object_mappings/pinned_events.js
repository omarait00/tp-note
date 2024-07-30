"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pinnedEventType = exports.pinnedEventSavedObjectType = exports.pinnedEventSavedObjectMappings = void 0;
var _pinned_events = require("./migrations/pinned_events");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const pinnedEventSavedObjectType = 'siem-ui-timeline-pinned-event';
exports.pinnedEventSavedObjectType = pinnedEventSavedObjectType;
const pinnedEventSavedObjectMappings = {
  properties: {
    eventId: {
      type: 'keyword'
    },
    created: {
      type: 'date'
    },
    createdBy: {
      type: 'text'
    },
    updated: {
      type: 'date'
    },
    updatedBy: {
      type: 'text'
    }
  }
};
exports.pinnedEventSavedObjectMappings = pinnedEventSavedObjectMappings;
const pinnedEventType = {
  name: pinnedEventSavedObjectType,
  hidden: false,
  namespaceType: 'multiple-isolated',
  convertToMultiNamespaceTypeVersion: '8.0.0',
  mappings: pinnedEventSavedObjectMappings,
  migrations: _pinned_events.pinnedEventsMigrations
};
exports.pinnedEventType = pinnedEventType;