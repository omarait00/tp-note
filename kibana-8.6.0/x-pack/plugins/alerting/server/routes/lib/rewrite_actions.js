"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rewriteActions = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const rewriteActions = actions => {
  const rewriteFrequency = ({
    notify_when: notifyWhen,
    ...rest
  }) => ({
    ...rest,
    notifyWhen
  });
  if (!actions) return [];
  return actions.map(action => ({
    ...action,
    ...(action.frequency ? {
      frequency: rewriteFrequency(action.frequency)
    } : {})
  }));
};
exports.rewriteActions = rewriteActions;