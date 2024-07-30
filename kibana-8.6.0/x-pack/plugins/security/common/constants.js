"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNKNOWN_SPACE = exports.SESSION_ROUTE = exports.SESSION_GRACE_PERIOD_MS = exports.SESSION_EXTENSION_THROTTLE_MS = exports.SESSION_EXPIRATION_WARNING_MS = exports.SESSION_ERROR_REASON_HEADER = exports.SESSION_CHECK_MS = exports.RESERVED_PRIVILEGES_APPLICATION_WILDCARD = exports.NEXT_URL_QUERY_STRING_PARAMETER = exports.NAME_REGEX = exports.MAX_NAME_LENGTH = exports.LOGOUT_REASON_QUERY_STRING_PARAMETER = exports.LOGOUT_PROVIDER_QUERY_STRING_PARAMETER = exports.GLOBAL_RESOURCE = exports.AUTH_URL_HASH_QUERY_STRING_PARAMETER = exports.AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER = exports.APPLICATION_PREFIX = exports.ALL_SPACES_ID = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The identifier in a saved object's `namespaces` array when it is shared globally to all spaces.
 */
const ALL_SPACES_ID = '*';

/**
 * The identifier in a saved object's `namespaces` array when it is shared to an unknown space (e.g., one that the end user is not authorized to see).
 */
exports.ALL_SPACES_ID = ALL_SPACES_ID;
const UNKNOWN_SPACE = '?';
exports.UNKNOWN_SPACE = UNKNOWN_SPACE;
const GLOBAL_RESOURCE = '*';
exports.GLOBAL_RESOURCE = GLOBAL_RESOURCE;
const APPLICATION_PREFIX = 'kibana-';

/**
 * Reserved application privileges are always assigned to this "wildcard" application.
 * This allows them to be applied to any Kibana "tenant" (`kibana.index`). Since reserved privileges are always assigned to reserved (built-in) roles,
 * it's not possible to know the tenant ahead of time.
 */
exports.APPLICATION_PREFIX = APPLICATION_PREFIX;
const RESERVED_PRIVILEGES_APPLICATION_WILDCARD = 'kibana-*';

/**
 * This is the key of a query parameter that contains the name of the authentication provider that should be used to
 * authenticate request. It's also used while the user is being redirected during single-sign-on authentication flows.
 * That query parameter is discarded after the authentication flow succeeds. See the `Authenticator`,
 * `OIDCAuthenticationProvider`, and `SAMLAuthenticationProvider` classes for more information.
 */
exports.RESERVED_PRIVILEGES_APPLICATION_WILDCARD = RESERVED_PRIVILEGES_APPLICATION_WILDCARD;
const AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER = 'auth_provider_hint';

/**
 * This is the key of a query parameter that contains metadata about the (client-side) URL hash while the user is being
 * redirected during single-sign-on authentication flows. That query parameter is discarded after the authentication
 * flow succeeds. See the `Authenticator`, `OIDCAuthenticationProvider`, and `SAMLAuthenticationProvider` classes for
 * more information.
 */
exports.AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER = AUTH_PROVIDER_HINT_QUERY_STRING_PARAMETER;
const AUTH_URL_HASH_QUERY_STRING_PARAMETER = 'auth_url_hash';
exports.AUTH_URL_HASH_QUERY_STRING_PARAMETER = AUTH_URL_HASH_QUERY_STRING_PARAMETER;
const LOGOUT_PROVIDER_QUERY_STRING_PARAMETER = 'provider';
exports.LOGOUT_PROVIDER_QUERY_STRING_PARAMETER = LOGOUT_PROVIDER_QUERY_STRING_PARAMETER;
const LOGOUT_REASON_QUERY_STRING_PARAMETER = 'msg';
exports.LOGOUT_REASON_QUERY_STRING_PARAMETER = LOGOUT_REASON_QUERY_STRING_PARAMETER;
const NEXT_URL_QUERY_STRING_PARAMETER = 'next';

/**
 * If there's a problem validating the session supplied in an AJAX request (i.e. a non-redirectable request),
 * a 401 error is returned. A header with the name defined in `SESSION_ERROR_REASON_HEADER` is added to the
 * HTTP response with more details of the problem.
 */
exports.NEXT_URL_QUERY_STRING_PARAMETER = NEXT_URL_QUERY_STRING_PARAMETER;
const SESSION_ERROR_REASON_HEADER = 'kbn-session-error-reason';

/**
 * Matches valid usernames and role names.
 *
 * - Must contain only letters, numbers, spaces, punctuation and printable symbols.
 * - Must not contain leading or trailing spaces.
 */
exports.SESSION_ERROR_REASON_HEADER = SESSION_ERROR_REASON_HEADER;
const NAME_REGEX = /^(?! )[a-zA-Z0-9 !"#$%&'()*+,\-./\\:;<=>?@\[\]^_`{|}~]*[a-zA-Z0-9!"#$%&'()*+,\-./\\:;<=>?@\[\]^_`{|}~]$/;

/**
 * Maximum length of usernames and role names.
 */
exports.NAME_REGEX = NAME_REGEX;
const MAX_NAME_LENGTH = 1024;

/**
 * Client session timeout is decreased by this number so that Kibana server can still access session
 * content during logout request to properly clean user session up (invalidate access tokens,
 * redirect to logout portal etc.).
 */
exports.MAX_NAME_LENGTH = MAX_NAME_LENGTH;
const SESSION_GRACE_PERIOD_MS = 5 * 1000;

/**
 * Duration we'll normally display the warning toast
 */
exports.SESSION_GRACE_PERIOD_MS = SESSION_GRACE_PERIOD_MS;
const SESSION_EXPIRATION_WARNING_MS = 5 * 60 * 1000;

/**
 * Current session info is checked this number of milliseconds before the warning toast shows. This
 * will prevent the toast from being shown if the session has already been extended.
 */
exports.SESSION_EXPIRATION_WARNING_MS = SESSION_EXPIRATION_WARNING_MS;
const SESSION_CHECK_MS = 1000;

/**
 * Session will be extended at most once this number of milliseconds while user activity is detected.
 */
exports.SESSION_CHECK_MS = SESSION_CHECK_MS;
const SESSION_EXTENSION_THROTTLE_MS = 60 * 1000;

/**
 * Route to get session info and extend session expiration
 */
exports.SESSION_EXTENSION_THROTTLE_MS = SESSION_EXTENSION_THROTTLE_MS;
const SESSION_ROUTE = '/internal/security/session';
exports.SESSION_ROUTE = SESSION_ROUTE;