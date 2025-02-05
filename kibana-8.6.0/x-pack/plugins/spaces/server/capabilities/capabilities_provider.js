"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capabilitiesProvider = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const capabilitiesProvider = () => ({
  spaces: {
    manage: true
  },
  catalogue: {
    spaces: true
  },
  management: {
    kibana: {
      spaces: true
    }
  }
});
exports.capabilitiesProvider = capabilitiesProvider;