"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WatchErrors = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class WatchErrors {
  constructor({
    actions
  } = {}) {
    this.actions = actions;
  }

  // generate object to send to kibana
  get downstreamJson() {
    const json = {
      actions: this.actions
    };
    return json;
  }

  // generate object from elasticsearch response
  static fromUpstreamJson(sections) {
    return new WatchErrors(sections);
  }
}
exports.WatchErrors = WatchErrors;