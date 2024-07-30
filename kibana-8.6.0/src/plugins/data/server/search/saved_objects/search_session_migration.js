"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchSessionSavedObjectMigrations = void 0;
var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function getLocatorId(urlGeneratorId) {
  if (!urlGeneratorId) return;
  if (urlGeneratorId === 'DISCOVER_APP_URL_GENERATOR') return 'DISCOVER_APP_LOCATOR';
  if (urlGeneratorId === 'DASHBOARD_APP_URL_GENERATOR') return 'DASHBOARD_APP_LOCATOR';
  throw new Error(`No migration found for search session URL generator ${urlGeneratorId}`);
}
const searchSessionSavedObjectMigrations = {
  '7.13.0': doc => {
    if (doc.attributes.status === _common.SearchSessionStatus.COMPLETE) {
      return {
        ...doc,
        attributes: {
          ...doc.attributes,
          completed: doc.attributes.touched
        }
      };
    }
    return doc;
  },
  '7.14.0': doc => {
    return {
      ...doc,
      attributes: {
        ...doc.attributes,
        version: '7.13.0'
      }
    };
  },
  '8.0.0': doc => {
    const {
      attributes: {
        urlGeneratorId,
        ...otherAttrs
      }
    } = doc;
    const locatorId = getLocatorId(urlGeneratorId);
    const attributes = {
      ...otherAttrs,
      locatorId
    };
    return {
      ...doc,
      attributes
    };
  },
  '8.6.0': doc => {
    const {
      attributes: {
        touched,
        completed,
        persisted,
        idMapping,
        status,
        ...otherAttrs
      }
    } = doc;
    const attributes = {
      ...otherAttrs,
      idMapping: Object.entries(idMapping).reduce((res, [searchHash, {
        status: searchStatus,
        error,
        ...otherSearchAttrs
      }]) => {
        res[searchHash] = otherSearchAttrs;
        return res;
      }, {})
    };
    if (status === _common.SearchSessionStatus.CANCELLED) {
      attributes.isCanceled = true;
    }
    return {
      ...doc,
      attributes
    };
  }
};
exports.searchSessionSavedObjectMigrations = searchSessionSavedObjectMigrations;