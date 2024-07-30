"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCustomLink = deleteCustomLink;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function deleteCustomLink({
  customLinkId,
  internalESClient
}) {
  const params = {
    refresh: 'wait_for',
    index: internalESClient.apmIndices.apmCustomLinkIndex,
    id: customLinkId
  };
  return internalESClient.delete('delete_custom_link', params);
}