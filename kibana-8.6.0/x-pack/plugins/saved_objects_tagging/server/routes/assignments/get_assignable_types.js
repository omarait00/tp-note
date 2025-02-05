"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetAssignableTypesRoute = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerGetAssignableTypesRoute = router => {
  router.get({
    path: '/internal/saved_objects_tagging/assignments/_assignable_types',
    validate: {}
  }, router.handleLegacyErrors(async (ctx, req, res) => {
    const {
      assignmentService
    } = await ctx.tags;
    const types = await assignmentService.getAssignableTypes();
    return res.ok({
      body: {
        types
      }
    });
  }));
};
exports.registerGetAssignableTypesRoute = registerGetAssignableTypesRoute;