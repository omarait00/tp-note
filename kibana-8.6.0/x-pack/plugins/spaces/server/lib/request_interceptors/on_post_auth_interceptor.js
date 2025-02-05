"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSpacesOnPostAuthRequestInterceptor = initSpacesOnPostAuthRequestInterceptor;
var _common = require("../../../common");
var _constants = require("../../../common/constants");
var _errors = require("../errors");
var _get_space_selector_url = require("../get_space_selector_url");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function initSpacesOnPostAuthRequestInterceptor({
  features,
  getSpacesService,
  log,
  http
}) {
  http.registerOnPostAuth(async (request, response, toolkit) => {
    const serverBasePath = http.basePath.serverBasePath;
    const path = request.url.pathname;
    const spacesService = getSpacesService();
    const spaceId = spacesService.getSpaceId(request);

    // The root of kibana is also the root of the defaut space,
    // since the default space does not have a URL Identifier (i.e., `/s/foo`).
    const isRequestingKibanaRoot = path === '/' && spaceId === _constants.DEFAULT_SPACE_ID;
    const isRequestingSpaceRoot = path === '/' && spaceId !== _constants.DEFAULT_SPACE_ID;
    const isRequestingApplication = path.startsWith('/app');

    // if requesting the application root, then show the Space Selector UI to allow the user to choose which space
    // they wish to visit. This is done "onPostAuth" to allow the Saved Objects Client to use the request's auth credentials,
    // which is not available at the time of "onRequest".
    if (isRequestingKibanaRoot) {
      try {
        const spacesClient = spacesService.createSpacesClient(request);
        const spaces = await spacesClient.getAll();
        if (spaces.length === 1) {
          // If only one space is available, then send user there directly.
          // No need for an interstitial screen where there is only one possible outcome.
          const space = spaces[0];
          const destination = (0, _common.addSpaceIdToPath)(serverBasePath, space.id, _constants.ENTER_SPACE_PATH);
          return response.redirected({
            headers: {
              location: destination
            }
          });
        }
        if (spaces.length > 0) {
          // render spaces selector instead of home page
          return response.redirected({
            headers: {
              location: (0, _get_space_selector_url.getSpaceSelectorUrl)(serverBasePath)
            }
          });
        }
      } catch (error) {
        return response.customError((0, _errors.wrapError)(error));
      }
    } else if (isRequestingSpaceRoot) {
      const destination = (0, _common.addSpaceIdToPath)(serverBasePath, spaceId, _constants.ENTER_SPACE_PATH);
      return response.redirected({
        headers: {
          location: destination
        }
      });
    }

    // This condition should only happen after selecting a space, or when transitioning from one application to another
    // e.g.: Navigating from Dashboard to Timelion
    if (isRequestingApplication) {
      let space;
      try {
        log.debug(`Verifying access to space "${spaceId}"`);
        const spacesClient = spacesService.createSpacesClient(request);
        space = await spacesClient.get(spaceId);
      } catch (error) {
        const wrappedError = (0, _errors.wrapError)(error);
        const statusCode = wrappedError.statusCode;
        switch (statusCode) {
          case 403:
            log.debug(`User unauthorized for space "${spaceId}". ${error}`);
            return response.forbidden();
          case 404:
            log.debug(`Unable to navigate to space "${spaceId}", redirecting to Space Selector. ${error}`);
            return response.redirected({
              headers: {
                location: (0, _get_space_selector_url.getSpaceSelectorUrl)(serverBasePath)
              }
            });
          default:
            log.error(`Unable to navigate to space "${spaceId}". ${error}`);
            return response.customError(wrappedError);
        }
      }

      // Verify application is available in this space
      // The management page is always visible, so we shouldn't be restricting access to the kibana application in any situation.
      const appId = path.split('/', 3)[2];
      if (appId !== 'kibana' && space && space.disabledFeatures.length > 0) {
        log.debug(`Verifying application is available: "${appId}"`);
        const allFeatures = features.getKibanaFeatures();
        const isRegisteredApp = allFeatures.some(feature => feature.app.includes(appId));
        if (isRegisteredApp) {
          const enabledFeatures = allFeatures.filter(feature => !space.disabledFeatures.includes(feature.id));
          const isAvailableInSpace = enabledFeatures.some(feature => feature.app.includes(appId));
          if (!isAvailableInSpace) {
            log.debug(`App ${appId} is not enabled within space "${spaceId}".`);
            return response.notFound();
          }
        }
      }
    }
    return toolkit.next();
  });
}