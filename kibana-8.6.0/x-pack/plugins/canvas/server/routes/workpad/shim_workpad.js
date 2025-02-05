"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimWorkpad = shimWorkpad;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function shimWorkpad(workpad) {
  if (
  // not sure if we need to be this defensive
  workpad.type === 'canvas-workpad' && workpad.attributes && workpad.attributes.pages && workpad.attributes.pages.length) {
    workpad.attributes.pages.forEach(page => {
      const elements = (page.elements || []).filter(({
        id: pageId
      }) => !pageId.startsWith('group'));
      const groups = (page.groups || []).concat((page.elements || []).filter(({
        id: pageId
      }) => pageId.startsWith('group')));
      page.elements = elements;
      page.groups = groups;
    });
  }
}