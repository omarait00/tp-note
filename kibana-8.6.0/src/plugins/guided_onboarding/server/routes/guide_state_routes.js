"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetGuideStateRoute = void 0;
var _constants = require("../../common/constants");
var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const registerGetGuideStateRoute = router => {
  // Fetch all guides state
  router.get({
    path: `${_constants.API_BASE_PATH}/guides`,
    validate: false
  }, async (context, request, response) => {
    const coreContext = await context.core;
    const soClient = coreContext.savedObjects.client;
    const existingGuides = await (0, _helpers.findAllGuides)(soClient);
    if (existingGuides.total > 0) {
      const guidesState = existingGuides.saved_objects.map(guide => guide.attributes);
      return response.ok({
        body: {
          state: guidesState
        }
      });
    } else {
      // If no SO exists, we assume state hasn't been stored yet and return an empty array
      return response.ok({
        body: {
          state: []
        }
      });
    }
  });
};
exports.registerGetGuideStateRoute = registerGetGuideStateRoute;