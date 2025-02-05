"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Authenticator = void 0;
exports.enrichWithUserProfileId = enrichWithUserProfileId;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../../src/core/server");
var _constants = require("../../common/constants");
var _model = require("../../common/model");
var _audit = require("../audit");
var _errors = require("../errors");
var _session_management = require("../session_management");
var _authentication_result = require("./authentication_result");
var _can_redirect_request = require("./can_redirect_request");
var _deauthentication_result = require("./deauthentication_result");
var _http_authentication = require("./http_authentication");
var _providers = require("./providers");
var _tokens = require("./tokens");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * List of query string parameters used to pass various authentication related metadata that should
 * be stripped away from URL as soon as they are no longer needed.
 */
const AUTH_METADATA_QUERY_STRING_PARAMETERS = [_constants.AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER, _constants.AUTH_URL_HASH_QUERY_STRING_PARAMETER];

/**
 * The shape of the login attempt.
 */

// Mapping between provider key defined in the config and authentication
// provider class that can handle specific authentication mechanism.
const providerMap = new Map([[_providers.BasicAuthenticationProvider.type, _providers.BasicAuthenticationProvider], [_providers.KerberosAuthenticationProvider.type, _providers.KerberosAuthenticationProvider], [_providers.SAMLAuthenticationProvider.type, _providers.SAMLAuthenticationProvider], [_providers.TokenAuthenticationProvider.type, _providers.TokenAuthenticationProvider], [_providers.OIDCAuthenticationProvider.type, _providers.OIDCAuthenticationProvider], [_providers.PKIAuthenticationProvider.type, _providers.PKIAuthenticationProvider], [_providers.AnonymousAuthenticationProvider.type, _providers.AnonymousAuthenticationProvider]]);

/**
 * The route to the access agreement UI.
 */
const ACCESS_AGREEMENT_ROUTE = '/security/access_agreement';

/**
 * The route to the overwritten session UI.
 */
const OVERWRITTEN_SESSION_ROUTE = '/security/overwritten_session';
function assertRequest(request) {
  if (!(request instanceof _server.CoreKibanaRequest)) {
    throw new Error(`Request should be a valid "KibanaRequest" instance, was [${typeof request}].`);
  }
}
function assertLoginAttempt(attempt) {
  if (!isLoginAttemptWithProviderType(attempt) && !isLoginAttemptWithProviderName(attempt)) {
    throw new Error('Login attempt should be an object with non-empty "provider.type" or "provider.name" property.');
  }
}
function isLoginAttemptWithProviderName(attempt) {
  var _provider, _provider2;
  return typeof attempt === 'object' && (attempt === null || attempt === void 0 ? void 0 : (_provider = attempt.provider) === null || _provider === void 0 ? void 0 : _provider.name) && typeof (attempt === null || attempt === void 0 ? void 0 : (_provider2 = attempt.provider) === null || _provider2 === void 0 ? void 0 : _provider2.name) === 'string';
}
function isLoginAttemptWithProviderType(attempt) {
  var _provider3, _provider4;
  return typeof attempt === 'object' && (attempt === null || attempt === void 0 ? void 0 : (_provider3 = attempt.provider) === null || _provider3 === void 0 ? void 0 : _provider3.type) && typeof (attempt === null || attempt === void 0 ? void 0 : (_provider4 = attempt.provider) === null || _provider4 === void 0 ? void 0 : _provider4.type) === 'string';
}
function isSessionAuthenticated(sessionValue) {
  return !!(sessionValue !== null && sessionValue !== void 0 && sessionValue.username);
}

/**
 * Instantiates authentication provider based on the provider key from config.
 * @param providerType Provider type key.
 * @param options Options to pass to provider's constructor.
 * @param providerSpecificOptions Options that are specific to {@param providerType}.
 */
function instantiateProvider(providerType, options, providerSpecificOptions) {
  const ProviderClassName = providerMap.get(providerType);
  if (!ProviderClassName) {
    throw new Error(`Unsupported authentication provider name: ${providerType}.`);
  }
  return new ProviderClassName(options, providerSpecificOptions);
}

/**
 * Authenticator is responsible for authentication of the request using chain of
 * authentication providers. The chain is essentially a prioritized list of configured
 * providers (typically of various types). The order of the list determines the order in
 * which the providers will be consulted. During the authentication process, Authenticator
 * will try to authenticate the request via one provider at a time. Once one of the
 * providers successfully authenticates the request, the authentication is considered
 * to be successful and the authenticated user will be associated with the request.
 * If provider cannot authenticate the request, the next in line provider in the chain
 * will be used. If all providers in the chain could not authenticate the request,
 * the authentication is then considered to be unsuccessful and an authentication error
 * will be returned.
 */
class Authenticator {
  /**
   * List of configured and instantiated authentication providers.
   */

  /**
   * Session instance.
   */

  /**
   * Internal authenticator logger.
   */

  /**
   * Instantiates Authenticator and bootstrap configured providers.
   * @param options Authenticator options.
   */
  constructor(options) {
    (0, _defineProperty2.default)(this, "providers", void 0);
    (0, _defineProperty2.default)(this, "session", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.options = options;
    this.session = this.options.session;
    this.logger = this.options.loggers.get('authenticator');
    const providerCommonOptions = {
      client: this.options.clusterClient,
      basePath: this.options.basePath,
      getRequestOriginalURL: this.getRequestOriginalURL.bind(this),
      tokens: new _tokens.Tokens({
        client: this.options.clusterClient.asInternalUser,
        logger: this.options.loggers.get('tokens')
      }),
      getServerBaseURL: this.options.getServerBaseURL,
      isElasticCloudDeployment: this.options.isElasticCloudDeployment
    };
    this.providers = new Map(this.options.config.authc.sortedProviders.map(({
      type,
      name
    }) => {
      var _this$options$config$;
      this.logger.debug(`Enabling "${name}" (${type}) authentication provider.`);
      return [name, instantiateProvider(type, Object.freeze({
        ...providerCommonOptions,
        name,
        logger: options.loggers.get(type, name),
        urls: {
          loggedOut: request => this.getLoggedOutURL(request, type)
        }
      }), (_this$options$config$ = this.options.config.authc.providers[type]) === null || _this$options$config$ === void 0 ? void 0 : _this$options$config$[name])];
    }));

    // For the BWC reasons we always include HTTP authentication provider unless it's explicitly disabled.
    if (this.options.config.authc.http.enabled) {
      this.setupHTTPAuthenticationProvider(Object.freeze({
        ...providerCommonOptions,
        name: '__http__',
        logger: options.loggers.get(_providers.HTTPAuthenticationProvider.type),
        urls: {
          loggedOut: request => this.getLoggedOutURL(request, _providers.HTTPAuthenticationProvider.type)
        }
      }));
    }
    if (this.providers.size === 0) {
      throw new Error('No authentication provider is configured. Verify `xpack.security.authc.*` config value.');
    }
  }

  /**
   * Performs the initial login request using the provider login attempt description.
   * @param request Request instance.
   * @param attempt Login attempt description.
   */
  async login(request, attempt) {
    assertRequest(request);
    assertLoginAttempt(attempt);
    const {
      value: existingSessionValue
    } = await this.getSessionValue(request);

    // Login attempt can target specific provider by its name (e.g. chosen at the Login Selector UI)
    // or a group of providers with the specified type (e.g. in case of 3rd-party initiated login
    // attempts we may not know what provider exactly can handle that attempt and we have to try
    // every enabled provider of the specified type).
    const providers = isLoginAttemptWithProviderName(attempt) && this.providers.has(attempt.provider.name) ? [[attempt.provider.name, this.providers.get(attempt.provider.name)]] : isLoginAttemptWithProviderType(attempt) ? [...this.providerIterator(existingSessionValue === null || existingSessionValue === void 0 ? void 0 : existingSessionValue.provider.name)].filter(([, {
      type
    }]) => type === attempt.provider.type) : [];
    if (providers.length === 0) {
      this.logger.debug(`Login attempt for provider with ${isLoginAttemptWithProviderName(attempt) ? `name ${attempt.provider.name}` : `type "${attempt.provider.type}"`} is detected, but it isn't enabled.`);
      return _authentication_result.AuthenticationResult.notHandled();
    }
    for (const [providerName, provider] of providers) {
      // Check if current session has been set by this provider.
      const ownsSession = (existingSessionValue === null || existingSessionValue === void 0 ? void 0 : existingSessionValue.provider.name) === providerName && (existingSessionValue === null || existingSessionValue === void 0 ? void 0 : existingSessionValue.provider.type) === provider.type;
      const authenticationResult = await provider.login(request, attempt.value, ownsSession ? existingSessionValue.state : null);
      if (!authenticationResult.notHandled()) {
        const sessionUpdateResult = await this.updateSessionValue(request, {
          provider: {
            type: provider.type,
            name: providerName
          },
          authenticationResult,
          existingSessionValue
        });
        return enrichWithUserProfileId(this.handlePreAccessRedirects(request, authenticationResult, sessionUpdateResult, attempt.redirectURL), sessionUpdateResult ? sessionUpdateResult.value : null);
      }
    }
    return _authentication_result.AuthenticationResult.notHandled();
  }

  /**
   * Performs request authentication using configured chain of authentication providers.
   * @param request Request instance.
   */
  async authenticate(request) {
    var _existingSession$valu, _existingSession$valu2;
    assertRequest(request);
    const existingSession = await this.getSessionValue(request);
    if (this.shouldRedirectToLoginSelector(request, existingSession.value)) {
      const providerNameSuggestedByHint = request.url.searchParams.get(_constants.AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER);
      this.logger.debug(`Redirecting request to Login Selector (provider hint: ${providerNameSuggestedByHint !== null && providerNameSuggestedByHint !== void 0 ? providerNameSuggestedByHint : 'n/a'}).`);
      return _authentication_result.AuthenticationResult.redirectTo(`${this.options.basePath.serverBasePath}/login?${_constants.NEXT_URL_QUERY_STRING_PARAMETER}=${encodeURIComponent(`${this.options.basePath.get(request)}${request.url.pathname}${request.url.search}`)}${providerNameSuggestedByHint ? `&${_constants.AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER}=${encodeURIComponent(providerNameSuggestedByHint)}` : ''}${existingSession.error instanceof _session_management.SessionExpiredError ? `&${_constants.LOGOUT_REASON_QUERY_STRING_PARAMETER}=${encodeURIComponent(existingSession.error.code)}` : ''}`);
    }
    const requestIsRedirectable = (0, _can_redirect_request.canRedirectRequest)(request);
    const suggestedProviderName = (_existingSession$valu = (_existingSession$valu2 = existingSession.value) === null || _existingSession$valu2 === void 0 ? void 0 : _existingSession$valu2.provider.name) !== null && _existingSession$valu !== void 0 ? _existingSession$valu : request.url.searchParams.get(_constants.AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER);
    for (const [providerName, provider] of this.providerIterator(suggestedProviderName)) {
      var _existingSession$valu3, _existingSession$valu4;
      // Check if current session has been set by this provider.
      const ownsSession = ((_existingSession$valu3 = existingSession.value) === null || _existingSession$valu3 === void 0 ? void 0 : _existingSession$valu3.provider.name) === providerName && ((_existingSession$valu4 = existingSession.value) === null || _existingSession$valu4 === void 0 ? void 0 : _existingSession$valu4.provider.type) === provider.type;
      let authenticationResult = await provider.authenticate(request, ownsSession ? existingSession.value.state : null);
      if (!authenticationResult.notHandled()) {
        const sessionUpdateResult = await this.updateSessionValue(request, {
          provider: {
            type: provider.type,
            name: providerName
          },
          authenticationResult,
          existingSessionValue: existingSession.value
        });
        if (requestIsRedirectable) {
          var _authenticationResult;
          if (existingSession.error instanceof _session_management.SessionExpiredError && (_authenticationResult = authenticationResult.redirectURL) !== null && _authenticationResult !== void 0 && _authenticationResult.startsWith(`${this.options.basePath.get(request)}/login?`)) {
            // TODO: Make this less verbose!
            authenticationResult = _authentication_result.AuthenticationResult.redirectTo(authenticationResult.redirectURL + `&${_constants.LOGOUT_REASON_QUERY_STRING_PARAMETER}=${encodeURIComponent(existingSession.error.code)}`, {
              user: authenticationResult.user,
              userProfileGrant: authenticationResult.userProfileGrant,
              authResponseHeaders: authenticationResult.authResponseHeaders,
              state: authenticationResult.state
            });
          }
          return enrichWithUserProfileId(this.handlePreAccessRedirects(request, authenticationResult, sessionUpdateResult), sessionUpdateResult ? sessionUpdateResult.value : null);
        } else {
          if (existingSession.error instanceof _session_management.SessionExpiredError) {
            // TODO: Make this less verbose! Possible alternatives:
            // 1. Make authResponseHeaders editable
            // 2. Create utility function outside of the AuthenticationResult class to create clones of AuthenticationResult objects with certain properties augmented
            // 3. Create utility function inside of the AuthenticationResult class to create clones of AuthenticationResult objects with certain properties augmented
            // Whatever we choose, we probably want to consider doing the same for editing the `redirectURL` and the `user`, both of which we need to edit in this file
            if (authenticationResult.succeeded()) {
              authenticationResult = _authentication_result.AuthenticationResult.succeeded(authenticationResult.user, {
                userProfileGrant: authenticationResult.userProfileGrant,
                authHeaders: authenticationResult.authHeaders,
                state: authenticationResult.state,
                authResponseHeaders: {
                  ...authenticationResult.authResponseHeaders,
                  [_constants.SESSION_ERROR_REASON_HEADER]: existingSession.error.code
                }
              });
            } else if (authenticationResult.failed()) {
              authenticationResult = _authentication_result.AuthenticationResult.failed(authenticationResult.error, {
                authResponseHeaders: {
                  ...authenticationResult.authResponseHeaders,
                  [_constants.SESSION_ERROR_REASON_HEADER]: existingSession.error.code
                }
              });
            } else {
              // Currently we can only get to here if the request is 1) not redirectable, and 2) handled. This leaves only the states `succeeded` and `failed` that we have to handle
              throw new Error(`Unexpected state: ${authenticationResult.status}`);
            }
          }
          return enrichWithUserProfileId(authenticationResult, sessionUpdateResult ? sessionUpdateResult.value : null);
        }
      }
    }
    if (existingSession.error instanceof _session_management.SessionExpiredError || existingSession.error instanceof _session_management.SessionUnexpectedError) {
      const options = requestIsRedirectable ? undefined : {
        authResponseHeaders: {
          [_constants.SESSION_ERROR_REASON_HEADER]: existingSession.error.code
        }
      };
      return _authentication_result.AuthenticationResult.failed(existingSession.error, options);
    } else {
      return _authentication_result.AuthenticationResult.notHandled();
    }
  }

  /**
   * Tries to reauthenticate request with the existing session.
   * @param request Request instance.
   */
  async reauthenticate(request) {
    assertRequest(request);
    const {
      value: existingSessionValue
    } = await this.getSessionValue(request);
    if (!existingSessionValue) {
      this.logger.warn('Session is no longer available and cannot be re-authenticated.');
      return _authentication_result.AuthenticationResult.notHandled();
    }

    // We can ignore `undefined` value here since it's ruled out on the previous step, if provider isn't
    // available then `getSessionValue` should have returned `null`.
    const provider = this.providers.get(existingSessionValue.provider.name);
    const authenticationResult = await provider.authenticate(request, existingSessionValue.state);
    if (!authenticationResult.notHandled()) {
      const sessionUpdateResult = await this.updateSessionValue(request, {
        provider: existingSessionValue.provider,
        authenticationResult,
        existingSessionValue
      });
      if (sessionUpdateResult) {
        return enrichWithUserProfileId(authenticationResult, sessionUpdateResult.value);
      }
    }
    return authenticationResult;
  }

  /**
   * Deauthenticates current request.
   * @param request Request instance.
   */
  async logout(request) {
    var _sessionValue$provide;
    assertRequest(request);
    const {
      value: sessionValue
    } = await this.getSessionValue(request);
    const suggestedProviderName = (_sessionValue$provide = sessionValue === null || sessionValue === void 0 ? void 0 : sessionValue.provider.name) !== null && _sessionValue$provide !== void 0 ? _sessionValue$provide : request.url.searchParams.get(_constants.LOGOUT_PROVIDER_QUERY_STRING_PARAMETER);
    if (suggestedProviderName) {
      await this.invalidateSessionValue({
        request,
        sessionValue
      });

      // Provider name may be passed in a query param and sourced from the browser's local storage;
      // hence, we can't assume that this provider exists, so we have to check it.
      const provider = this.providers.get(suggestedProviderName);
      if (provider) {
        var _sessionValue$state;
        return provider.logout(request, (_sessionValue$state = sessionValue === null || sessionValue === void 0 ? void 0 : sessionValue.state) !== null && _sessionValue$state !== void 0 ? _sessionValue$state : null);
      }
    } else {
      // In case logout is called and we cannot figure out what provider is supposed to handle it,
      // we should iterate through all providers and let them decide if they can perform a logout.
      // This can be necessary if some 3rd-party initiates logout. And even if user doesn't have an
      // active session already some providers can still properly respond to the 3rd-party logout
      // request. For example SAML provider can process logout request encoded in `SAMLRequest`
      // query string parameter.
      for (const [, provider] of this.providerIterator()) {
        const deauthenticationResult = await provider.logout(request);
        if (!deauthenticationResult.notHandled()) {
          return deauthenticationResult;
        }
      }
    }

    // If none of the configured providers could perform a logout, we should redirect user to the
    // default logout location.
    return _deauthentication_result.DeauthenticationResult.redirectTo(this.getLoggedOutURL(request));
  }

  /**
   * Acknowledges access agreement on behalf of the currently authenticated user.
   * @param request Request instance.
   */
  async acknowledgeAccessAgreement(request) {
    assertRequest(request);
    const {
      value: existingSessionValue
    } = await this.getSessionValue(request);
    const currentUser = this.options.getCurrentUser(request);
    if (!existingSessionValue || !currentUser) {
      throw new Error('Cannot acknowledge access agreement for unauthenticated user.');
    }
    if (!this.options.license.getFeatures().allowAccessAgreement) {
      throw new Error('Current license does not allow access agreement acknowledgement.');
    }
    await this.session.update(request, {
      ...existingSessionValue,
      accessAgreementAcknowledged: true
    });
    const auditLogger = this.options.audit.asScoped(request);
    auditLogger.log((0, _audit.accessAgreementAcknowledgedEvent)({
      username: currentUser.username,
      provider: existingSessionValue.provider
    }));
    this.options.featureUsageService.recordPreAccessAgreementUsage();
  }
  getRequestOriginalURL(request, additionalQueryStringParameters) {
    const originalURLSearchParams = [...[...request.url.searchParams.entries()].filter(([key]) => !AUTH_METADATA_QUERY_STRING_PARAMETERS.includes(key)), ...(additionalQueryStringParameters !== null && additionalQueryStringParameters !== void 0 ? additionalQueryStringParameters : [])];
    return `${this.options.basePath.get(request)}${request.url.pathname}${originalURLSearchParams.length > 0 ? `?${new URLSearchParams(originalURLSearchParams).toString()}` : ''}`;
  }

  /**
   * Initializes HTTP Authentication provider and appends it to the end of the list of enabled
   * authentication providers.
   * @param options Common provider options.
   */
  setupHTTPAuthenticationProvider(options) {
    const supportedSchemes = new Set(this.options.config.authc.http.schemes.map(scheme => scheme.toLowerCase()));

    // If `autoSchemesEnabled` is set we should allow schemes that other providers use to
    // authenticate requests with Elasticsearch.
    if (this.options.config.authc.http.autoSchemesEnabled) {
      for (const provider of this.providers.values()) {
        const supportedScheme = provider.getHTTPAuthenticationScheme();
        if (supportedScheme) {
          supportedSchemes.add(supportedScheme.toLowerCase());
        }
      }
    }
    if (this.providers.has(options.name)) {
      throw new Error(`Provider name "${options.name}" is reserved.`);
    }
    this.providers.set(options.name, new _providers.HTTPAuthenticationProvider(options, {
      supportedSchemes
    }));
  }

  /**
   * Returns provider iterator starting from the suggested provider if any.
   * @param suggestedProviderName Optional name of the provider to return first.
   */
  *providerIterator(suggestedProviderName) {
    // If there is no provider suggested or suggested provider isn't configured, let's use the order
    // providers are configured in. Otherwise return suggested provider first, and only then the rest
    // of providers.
    if (!suggestedProviderName || !this.providers.has(suggestedProviderName)) {
      yield* this.providers;
    } else {
      yield [suggestedProviderName, this.providers.get(suggestedProviderName)];
      for (const [providerName, provider] of this.providers) {
        if (providerName !== suggestedProviderName) {
          yield [providerName, provider];
        }
      }
    }
  }

  /**
   * Extracts session value for the specified request. Under the hood it can clear session if it
   * belongs to the provider that is not available.
   * @param request Request instance.
   */
  async getSessionValue(request) {
    var _this$providers$get;
    const existingSession = await this.session.get(request);

    // If we detect that for some reason we have a session stored for the provider that is not
    // available anymore (e.g. when user was logged in with one provider, but then configuration has
    // changed and that provider is no longer available), then we should clear session entirely.
    if (existingSession.value && ((_this$providers$get = this.providers.get(existingSession.value.provider.name)) === null || _this$providers$get === void 0 ? void 0 : _this$providers$get.type) !== existingSession.value.provider.type) {
      this.logger.warn(`Attempted to retrieve session for the "${existingSession.value.provider.type}/${existingSession.value.provider.name}" provider, but it is not configured.`);
      await this.invalidateSessionValue({
        request,
        sessionValue: existingSession.value
      });
      return {
        error: new _session_management.SessionUnexpectedError(),
        value: null
      };
    }
    return existingSession;
  }

  /**
   * Updates, creates, extends or clears session value based on the received authentication result.
   * @param request Request instance.
   * @param provider Provider that produced provided authentication result.
   * @param authenticationResult Result of the authentication or login attempt.
   * @param existingSessionValue Value of the existing session if any.
   */
  async updateSessionValue(request, {
    provider,
    authenticationResult,
    existingSessionValue
  }) {
    var _existingSessionValue3, _existingSessionValue4, _existingSessionValue5;
    // Log failed `user_login` attempt only if creating a brand new session or if the existing session is
    // not authenticated (e.g. during SAML handshake). If the existing session is authenticated we will
    // invalidate it and log a `user_logout` event instead.
    if (authenticationResult.failed() && !isSessionAuthenticated(existingSessionValue)) {
      var _existingSessionValue, _existingSessionValue2;
      const auditLogger = this.options.audit.asScoped(request);
      auditLogger.log((0, _audit.userLoginEvent)({
        userProfileId: (_existingSessionValue = existingSessionValue) === null || _existingSessionValue === void 0 ? void 0 : _existingSessionValue.userProfileId,
        sessionId: (_existingSessionValue2 = existingSessionValue) === null || _existingSessionValue2 === void 0 ? void 0 : _existingSessionValue2.sid,
        authenticationResult,
        authenticationProvider: provider.name,
        authenticationType: provider.type
      }));
    }
    if (!existingSessionValue && !authenticationResult.shouldUpdateState()) {
      return null;
    }

    // Provider can specifically ask to clear session by setting it to `null` even if authentication
    // attempt didn't fail.
    if (authenticationResult.shouldClearState()) {
      this.logger.debug('Authentication provider requested to invalidate existing session.');
      await this.invalidateSessionValue({
        request,
        sessionValue: existingSessionValue
      });
      return null;
    }
    const ownsSession = ((_existingSessionValue3 = existingSessionValue) === null || _existingSessionValue3 === void 0 ? void 0 : _existingSessionValue3.provider.name) === provider.name && ((_existingSessionValue4 = existingSessionValue) === null || _existingSessionValue4 === void 0 ? void 0 : _existingSessionValue4.provider.type) === provider.type;

    // If provider owned the session, but failed to authenticate anyway, that likely means that
    // session is not valid and we should clear it. Unexpected errors should not cause session
    // invalidation (e.g. when Elasticsearch is temporarily unavailable).
    if (authenticationResult.failed()) {
      if (ownsSession && (0, _errors.getErrorStatusCode)(authenticationResult.error) === 401) {
        this.logger.debug('Authentication attempt failed, existing session will be invalidated.');
        await this.invalidateSessionValue({
          request,
          sessionValue: existingSessionValue
        });
      }
      return null;
    }

    // If authentication succeeds or requires redirect we should automatically extend existing user session,
    // unless authentication has been triggered by a system API request. In case provider explicitly returns new
    // state we should store it in the session regardless of whether it's a system API request or not.
    const sessionShouldBeUpdatedOrExtended = (authenticationResult.succeeded() || authenticationResult.redirected()) && (authenticationResult.shouldUpdateState() || !request.isSystemRequest && ownsSession);
    if (!sessionShouldBeUpdatedOrExtended) {
      return ownsSession ? {
        value: existingSessionValue,
        overwritten: false
      } : null;
    }
    const isExistingSessionAuthenticated = isSessionAuthenticated(existingSessionValue);
    const isNewSessionAuthenticated = !!authenticationResult.user;
    const providerHasChanged = !!existingSessionValue && !ownsSession;
    const sessionHasBeenAuthenticated = !!existingSessionValue && !isExistingSessionAuthenticated && isNewSessionAuthenticated;
    const usernameHasChanged = isExistingSessionAuthenticated && isNewSessionAuthenticated && authenticationResult.user.username !== existingSessionValue.username;

    // There are 3 cases when we SHOULD invalidate existing session and create a new one with
    // regenerated SID/AAD:
    // 1. If a new session must be created while existing is still valid (e.g. IdP initiated login
    // for the user with active session created by another provider).
    // 2. If the existing session was unauthenticated (e.g. intermediate session used during SSO
    // handshake) and can now be turned into an authenticated one.
    // 3. If we re-authenticated user with another username (e.g. during IdP initiated SSO login or
    // when client certificate changes and PKI provider needs to re-authenticate user).
    if (providerHasChanged) {
      this.logger.debug('Authentication provider has changed, existing session will be invalidated.');
      await this.invalidateSessionValue({
        request,
        sessionValue: existingSessionValue
      });
      existingSessionValue = null;
    } else if (sessionHasBeenAuthenticated) {
      this.logger.debug('Session is authenticated, existing unauthenticated session will be invalidated.');
      await this.invalidateSessionValue({
        request,
        sessionValue: existingSessionValue,
        skipAuditEvent: true // Skip writing an audit event when we are replacing an intermediate session with a fullly authenticated session
      });

      existingSessionValue = null;
    } else if (usernameHasChanged) {
      this.logger.debug('Username has changed, existing session will be invalidated.');
      await this.invalidateSessionValue({
        request,
        sessionValue: existingSessionValue
      });
      existingSessionValue = null;
    }
    let userProfileId = (_existingSessionValue5 = existingSessionValue) === null || _existingSessionValue5 === void 0 ? void 0 : _existingSessionValue5.userProfileId;

    // If authentication result includes user profile grant, we should try to activate user profile for this user and
    // store user profile identifier in the session value.
    const shouldActivateProfile = authenticationResult.userProfileGrant;
    if (shouldActivateProfile) {
      var _authenticationResult2, _existingSessionValue6;
      this.logger.debug(`Activating profile for "${(_authenticationResult2 = authenticationResult.user) === null || _authenticationResult2 === void 0 ? void 0 : _authenticationResult2.username}".`);
      userProfileId = (await this.options.userProfileService.activate(authenticationResult.userProfileGrant)).uid;
      if ((_existingSessionValue6 = existingSessionValue) !== null && _existingSessionValue6 !== void 0 && _existingSessionValue6.userProfileId && existingSessionValue.userProfileId !== userProfileId) {
        var _authenticationResult3;
        this.logger.warn(`User profile for "${(_authenticationResult3 = authenticationResult.user) === null || _authenticationResult3 === void 0 ? void 0 : _authenticationResult3.username}" has changed.`);
      }
    }
    let newSessionValue;
    if (!existingSessionValue) {
      var _authenticationResult4;
      newSessionValue = await this.session.create(request, {
        username: (_authenticationResult4 = authenticationResult.user) === null || _authenticationResult4 === void 0 ? void 0 : _authenticationResult4.username,
        userProfileId,
        provider,
        state: authenticationResult.shouldUpdateState() ? authenticationResult.state : null
      });

      // Log successful `user_login` event if a new authenticated session was created or an existing session was overwritten and
      // the username or authentication provider changed. When username or authentication provider changes the session
      // gets invalidated (logging `user_logout` event) before a new session is created.
      if (isNewSessionAuthenticated && (!isExistingSessionAuthenticated || usernameHasChanged || providerHasChanged)) {
        var _newSessionValue;
        const auditLogger = this.options.audit.asScoped(request);
        auditLogger.log((0, _audit.userLoginEvent)({
          userProfileId,
          // We must explicitly specify the `userProfileId` here since we just created the session and it can't be inferred from the request context.
          sessionId: (_newSessionValue = newSessionValue) === null || _newSessionValue === void 0 ? void 0 : _newSessionValue.sid,
          // We must explicitly specify the `sessionId` here since we just created the session and it can't be inferred from the request context.
          authenticationResult,
          authenticationProvider: provider.name,
          authenticationType: provider.type
        }));
      }
    } else if (authenticationResult.shouldUpdateState()) {
      newSessionValue = await this.session.update(request, {
        ...existingSessionValue,
        userProfileId,
        state: authenticationResult.shouldUpdateState() ? authenticationResult.state : existingSessionValue.state
      });
    } else {
      newSessionValue = await this.session.extend(request, existingSessionValue);
    }
    return {
      value: newSessionValue,
      // We care only about cases when one authenticated session has been overwritten by another
      // authenticated session that belongs to a different user (different name or provider/realm).
      overwritten: isExistingSessionAuthenticated && isNewSessionAuthenticated && (providerHasChanged || usernameHasChanged)
    };
  }

  /**
   * Invalidates session value associated with the specified request.
   */
  async invalidateSessionValue({
    request,
    sessionValue,
    skipAuditEvent
  }) {
    if (isSessionAuthenticated(sessionValue) && !skipAuditEvent) {
      const auditLogger = this.options.audit.asScoped(request);
      auditLogger.log((0, _audit.userLogoutEvent)(sessionValue));
    }
    await this.session.invalidate(request, {
      match: 'current'
    });
  }

  /**
   * Checks whether request should be redirected to the Login Selector UI.
   * @param request Request instance.
   * @param sessionValue Current session value if any.
   */
  shouldRedirectToLoginSelector(request, sessionValue) {
    // Request should be redirected to Login Selector UI only if all following conditions are met:
    //  1. Request can be redirected (not API call)
    //  2. Request is not authenticated yet
    //  3. Login Selector UI is enabled
    //  4. Request isn't attributed with HTTP Authorization header
    return (0, _can_redirect_request.canRedirectRequest)(request) && !isSessionAuthenticated(sessionValue) && this.options.config.authc.selector.enabled && _http_authentication.HTTPAuthorizationHeader.parseFromRequest(request) == null;
  }

  /**
   * Checks whether request should be redirected to the Access Agreement UI.
   * @param sessionValue Current session value if any.
   */
  shouldRedirectToAccessAgreement(sessionValue) {
    var _sessionValue$provide2, _this$options$config$2, _providerConfig$acces;
    // If user doesn't have an active session or if they already acknowledged
    // access agreement (based on the flag we store in the session) - bail out.
    if (sessionValue == null || sessionValue.accessAgreementAcknowledged) {
      return false;
    }

    // If access agreement is neither enabled globally (for all providers)
    // nor for the provider that authenticated user request - bail out.
    const providerConfig = (_sessionValue$provide2 = this.options.config.authc.providers[sessionValue.provider.type]) === null || _sessionValue$provide2 === void 0 ? void 0 : _sessionValue$provide2[sessionValue.provider.name];
    if (!((_this$options$config$2 = this.options.config.accessAgreement) !== null && _this$options$config$2 !== void 0 && _this$options$config$2.message) && !(providerConfig !== null && providerConfig !== void 0 && (_providerConfig$acces = providerConfig.accessAgreement) !== null && _providerConfig$acces !== void 0 && _providerConfig$acces.message)) {
      return false;
    }

    // Check if the current license allows access agreement.
    return this.options.license.getFeatures().allowAccessAgreement;
  }

  /**
   * In some cases we'd like to redirect user to another page right after successful authentication
   * before they can access anything else in Kibana. This method makes sure we do a proper redirect
   * that would eventually lead user to a initially requested Kibana URL.
   * @param request Request instance.
   * @param authenticationResult Result of the authentication.
   * @param sessionUpdateResult Result of the session update.
   * @param redirectURL
   */
  handlePreAccessRedirects(request, authenticationResult, sessionUpdateResult, redirectURL) {
    var _sessionUpdateResult$;
    if (authenticationResult.failed() || request.url.pathname === ACCESS_AGREEMENT_ROUTE || request.url.pathname === OVERWRITTEN_SESSION_ROUTE) {
      return authenticationResult;
    }
    const isUpdatedSessionAuthenticated = isSessionAuthenticated(sessionUpdateResult === null || sessionUpdateResult === void 0 ? void 0 : sessionUpdateResult.value);
    let preAccessRedirectURL;
    if (isUpdatedSessionAuthenticated && sessionUpdateResult !== null && sessionUpdateResult !== void 0 && sessionUpdateResult.overwritten) {
      this.logger.debug('Redirecting user to the overwritten session UI.');
      preAccessRedirectURL = `${this.options.basePath.serverBasePath}${OVERWRITTEN_SESSION_ROUTE}`;
    } else if (isUpdatedSessionAuthenticated && this.shouldRedirectToAccessAgreement((_sessionUpdateResult$ = sessionUpdateResult === null || sessionUpdateResult === void 0 ? void 0 : sessionUpdateResult.value) !== null && _sessionUpdateResult$ !== void 0 ? _sessionUpdateResult$ : null)) {
      this.logger.debug('Redirecting user to the access agreement UI.');
      preAccessRedirectURL = `${this.options.basePath.serverBasePath}${ACCESS_AGREEMENT_ROUTE}`;
    }

    // If we need to redirect user to anywhere else before they can access Kibana we should remember
    // redirect URL in the `next` parameter. Redirect URL provided in authentication result, if any,
    // always takes precedence over what is specified in `redirectURL` parameter.
    if (preAccessRedirectURL) {
      preAccessRedirectURL = `${preAccessRedirectURL}?${_constants.NEXT_URL_QUERY_STRING_PARAMETER}=${encodeURIComponent(authenticationResult.redirectURL || redirectURL || `${this.options.basePath.get(request)}${request.url.pathname}${request.url.search}`)}`;
    } else if (redirectURL && !authenticationResult.redirectURL) {
      preAccessRedirectURL = redirectURL;
    }
    return preAccessRedirectURL ? _authentication_result.AuthenticationResult.redirectTo(preAccessRedirectURL, {
      state: authenticationResult.state,
      user: authenticationResult.user,
      authResponseHeaders: authenticationResult.authResponseHeaders,
      userProfileGrant: authenticationResult.userProfileGrant
    }) : authenticationResult;
  }

  /**
   * Creates a logged out URL for the specified request and provider.
   * @param request Request that initiated logout.
   * @param providerType Type of the provider that handles logout. If not specified, then the first
   * provider in the chain (default) is assumed.
   */
  getLoggedOutURL(request, providerType) {
    // The app that handles logout needs to know the reason of the logout and the URL we may need to
    // redirect user to once they log in again (e.g. when session expires).
    const searchParams = new URLSearchParams();
    for (const [key, defaultValue] of [[_constants.NEXT_URL_QUERY_STRING_PARAMETER, null], [_constants.LOGOUT_REASON_QUERY_STRING_PARAMETER, 'LOGGED_OUT']]) {
      const value = request.url.searchParams.get(key) || defaultValue;
      if (value) {
        searchParams.append(key, value);
      }
    }

    // Query string may contain the path where logout has been called or
    // logout reason that login page may need to know.
    return this.options.config.authc.selector.enabled || (providerType ? (0, _model.shouldProviderUseLoginForm)(providerType) : this.options.config.authc.sortedProviders.length > 0 ? (0, _model.shouldProviderUseLoginForm)(this.options.config.authc.sortedProviders[0].type) : false) ? `${this.options.basePath.serverBasePath}/login?${searchParams.toString()}` : `${this.options.basePath.serverBasePath}/security/logged_out?${searchParams.toString()}`;
  }
}
exports.Authenticator = Authenticator;
function enrichWithUserProfileId(authenticationResult, sessionValue) {
  if (!authenticationResult.user || !(sessionValue !== null && sessionValue !== void 0 && sessionValue.userProfileId) || authenticationResult.user.profile_uid === sessionValue.userProfileId) {
    return authenticationResult;
  }
  const enrichedUser = {
    ...authenticationResult.user,
    profile_uid: sessionValue.userProfileId
  };
  if (authenticationResult.redirected()) {
    return _authentication_result.AuthenticationResult.redirectTo(authenticationResult.redirectURL, {
      user: enrichedUser,
      userProfileGrant: authenticationResult.userProfileGrant,
      authResponseHeaders: authenticationResult.authResponseHeaders,
      state: authenticationResult.state
    });
  }
  return _authentication_result.AuthenticationResult.succeeded(enrichedUser, {
    userProfileGrant: authenticationResult.userProfileGrant,
    authHeaders: authenticationResult.authHeaders,
    authResponseHeaders: authenticationResult.authResponseHeaders,
    state: authenticationResult.state
  });
}