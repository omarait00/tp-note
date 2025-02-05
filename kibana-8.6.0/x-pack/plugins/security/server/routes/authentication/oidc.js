"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineOIDCRoutes = defineOIDCRoutes;
var _configSchema = require("@kbn/config-schema");
var _i18n = require("@kbn/i18n");
var _authentication = require("../../authentication");
var _errors = require("../../errors");
var _licensed_route_handler = require("../licensed_route_handler");
var _tags = require("../tags");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Defines routes required for SAML authentication.
 */
function defineOIDCRoutes({
  router,
  httpResources,
  logger,
  getAuthenticationService,
  basePath
}) {
  // Generate two identical routes with new and deprecated URL and issue a warning if route with deprecated URL is ever used.
  for (const path of ['/api/security/oidc/implicit', '/api/security/v1/oidc/implicit']) {
    /**
     * The route should be configured as a redirect URI in OP when OpenID Connect implicit flow
     * is used, so that we can extract authentication response from URL fragment and send it to
     * the `/api/security/oidc/callback` route.
     */
    httpResources.register({
      path,
      validate: false,
      options: {
        authRequired: false
      }
    }, (context, request, response) => {
      const serverBasePath = basePath.serverBasePath;
      if (path === '/api/security/v1/oidc/implicit') {
        logger.warn(`The "${serverBasePath}${path}" URL is deprecated and will stop working in the next major version, please use "${serverBasePath}/api/security/oidc/implicit" URL instead.`, {
          tags: ['deprecation']
        });
      }
      return response.renderHtml({
        body: `
            <!DOCTYPE html>
            <title>Kibana OpenID Connect Login</title>
            <link rel="icon" href="data:,">
            <script src="${serverBasePath}/internal/security/oidc/implicit.js"></script>
          `
      });
    });
  }

  /**
   * The route that accompanies `/api/security/oidc/implicit` and renders a JavaScript snippet
   * that extracts fragment part from the URL and send it to the `/api/security/oidc/callback` route.
   * We need this separate endpoint because of default CSP policy that forbids inline scripts.
   */
  httpResources.register({
    path: '/internal/security/oidc/implicit.js',
    validate: false,
    options: {
      authRequired: false
    }
  }, (context, request, response) => {
    const serverBasePath = basePath.serverBasePath;
    return response.renderJs({
      body: `
          window.location.replace(
            '${serverBasePath}/api/security/oidc/callback?authenticationResponseURI=' + encodeURIComponent(window.location.href)
          );
        `
    });
  });

  // Generate two identical routes with new and deprecated URL and issue a warning if route with deprecated URL is ever used.
  for (const path of ['/api/security/oidc/callback', '/api/security/v1/oidc']) {
    router.get({
      path,
      validate: {
        query: _configSchema.schema.object({
          authenticationResponseURI: _configSchema.schema.maybe(_configSchema.schema.uri()),
          code: _configSchema.schema.maybe(_configSchema.schema.string()),
          error: _configSchema.schema.maybe(_configSchema.schema.string()),
          error_description: _configSchema.schema.maybe(_configSchema.schema.string()),
          error_uri: _configSchema.schema.maybe(_configSchema.schema.uri()),
          iss: _configSchema.schema.maybe(_configSchema.schema.uri({
            scheme: ['https']
          })),
          login_hint: _configSchema.schema.maybe(_configSchema.schema.string()),
          target_link_uri: _configSchema.schema.maybe(_configSchema.schema.uri()),
          state: _configSchema.schema.maybe(_configSchema.schema.string())
        },
        // The client MUST ignore unrecognized response parameters according to
        // https://openid.net/specs/openid-connect-core-1_0.html#AuthResponseValidation and
        // https://tools.ietf.org/html/rfc6749#section-4.1.2.
        {
          unknowns: 'allow'
        })
      },
      options: {
        authRequired: false,
        tags: [_tags.ROUTE_TAG_CAN_REDIRECT, _tags.ROUTE_TAG_AUTH_FLOW]
      }
    }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
      const serverBasePath = basePath.serverBasePath;

      // An HTTP GET request with a query parameter named `authenticationResponseURI` that includes URL fragment OpenID
      // Connect Provider sent during implicit authentication flow to the Kibana own proxy page that extracted that URL
      // fragment and put it into `authenticationResponseURI` query string parameter for this endpoint. See more details
      // at https://openid.net/specs/openid-connect-core-1_0.html#ImplicitFlowAuth
      let loginAttempt;
      if (request.query.authenticationResponseURI) {
        loginAttempt = {
          type: _authentication.OIDCLogin.LoginWithImplicitFlow,
          authenticationResponseURI: request.query.authenticationResponseURI
        };
      } else if (request.query.code || request.query.error) {
        if (path === '/api/security/v1/oidc') {
          logger.warn(`The "${serverBasePath}${path}" URL is deprecated and will stop working in the next major version, please use "${serverBasePath}/api/security/oidc/callback" URL instead.`, {
            tags: ['deprecation']
          });
        }

        // An HTTP GET request with a query parameter named `code` (or `error`) as the response to a successful (or
        // failed) authentication from an OpenID Connect Provider during authorization code authentication flow.
        // See more details at https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth.
        loginAttempt = {
          type: _authentication.OIDCLogin.LoginWithAuthorizationCodeFlow,
          //  We pass the path only as we can't be sure of the full URL and Elasticsearch doesn't need it anyway.
          authenticationResponseURI: request.url.pathname + request.url.search
        };
      } else if (request.query.iss) {
        logger.warn(`The "${serverBasePath}${path}" URL is deprecated and will stop working in the next major version, please use "${serverBasePath}/api/security/oidc/initiate_login" URL for Third-Party Initiated login instead.`, {
          tags: ['deprecation']
        });
        // An HTTP GET request with a query parameter named `iss` as part of a 3rd party initiated authentication.
        // See more details at https://openid.net/specs/openid-connect-core-1_0.html#ThirdPartyInitiatedLogin
        loginAttempt = {
          type: _authentication.OIDCLogin.LoginInitiatedBy3rdParty,
          iss: request.query.iss,
          loginHint: request.query.login_hint
        };
      }
      if (!loginAttempt) {
        return response.badRequest({
          body: 'Unrecognized login attempt.'
        });
      }
      return performOIDCLogin(request, response, loginAttempt);
    }));
  }

  // Generate two identical routes with new and deprecated URL and issue a warning if route with deprecated URL is ever used.
  for (const path of ['/api/security/oidc/initiate_login', '/api/security/v1/oidc']) {
    /**
     * An HTTP POST request with the payload parameter named `iss` as part of a 3rd party initiated authentication.
     * See more details at https://openid.net/specs/openid-connect-core-1_0.html#ThirdPartyInitiatedLogin
     */
    router.post({
      path,
      validate: {
        body: _configSchema.schema.object({
          iss: _configSchema.schema.uri({
            scheme: ['https']
          }),
          login_hint: _configSchema.schema.maybe(_configSchema.schema.string()),
          target_link_uri: _configSchema.schema.maybe(_configSchema.schema.uri())
        },
        // Other parameters MAY be sent, if defined by extensions. Any parameters used that are not understood MUST
        // be ignored by the Client according to https://openid.net/specs/openid-connect-core-1_0.html#ThirdPartyInitiatedLogin.
        {
          unknowns: 'allow'
        })
      },
      options: {
        authRequired: false,
        xsrfRequired: false,
        tags: [_tags.ROUTE_TAG_CAN_REDIRECT, _tags.ROUTE_TAG_AUTH_FLOW]
      }
    }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
      const serverBasePath = basePath.serverBasePath;
      if (path === '/api/security/v1/oidc') {
        logger.warn(`The "${serverBasePath}${path}" URL is deprecated and will stop working in the next major version, please use "${serverBasePath}/api/security/oidc/initiate_login" URL for Third-Party Initiated login instead.`, {
          tags: ['deprecation']
        });
      }
      return performOIDCLogin(request, response, {
        type: _authentication.OIDCLogin.LoginInitiatedBy3rdParty,
        iss: request.body.iss,
        loginHint: request.body.login_hint
      });
    }));
  }

  /**
   * An HTTP GET request with the query string parameter named `iss` as part of a 3rd party initiated authentication.
   * See more details at https://openid.net/specs/openid-connect-core-1_0.html#ThirdPartyInitiatedLogin
   */
  router.get({
    path: '/api/security/oidc/initiate_login',
    validate: {
      query: _configSchema.schema.object({
        iss: _configSchema.schema.uri({
          scheme: ['https']
        }),
        login_hint: _configSchema.schema.maybe(_configSchema.schema.string()),
        target_link_uri: _configSchema.schema.maybe(_configSchema.schema.uri())
      },
      // Other parameters MAY be sent, if defined by extensions. Any parameters used that are not understood MUST
      // be ignored by the Client according to https://openid.net/specs/openid-connect-core-1_0.html#ThirdPartyInitiatedLogin.
      {
        unknowns: 'allow'
      })
    },
    options: {
      authRequired: false,
      tags: [_tags.ROUTE_TAG_CAN_REDIRECT, _tags.ROUTE_TAG_AUTH_FLOW]
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    return performOIDCLogin(request, response, {
      type: _authentication.OIDCLogin.LoginInitiatedBy3rdParty,
      iss: request.query.iss,
      loginHint: request.query.login_hint
    });
  }));
  async function performOIDCLogin(request, response, loginAttempt) {
    try {
      // We handle the fact that the user might get redirected to Kibana while already having a session
      // Return an error notifying the user they are already logged in.
      const authenticationResult = await getAuthenticationService().login(request, {
        provider: {
          type: _authentication.OIDCAuthenticationProvider.type
        },
        value: loginAttempt
      });
      if (authenticationResult.succeeded()) {
        return response.forbidden({
          body: _i18n.i18n.translate('xpack.security.conflictingSessionError', {
            defaultMessage: 'Sorry, you already have an active Kibana session. ' + 'If you want to start a new one, please logout from the existing session first.'
          })
        });
      }
      if (authenticationResult.redirected()) {
        return response.redirected({
          headers: {
            location: authenticationResult.redirectURL
          }
        });
      }
      return response.unauthorized({
        body: authenticationResult.error
      });
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }
}