"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.securityConfigDeprecationProvider = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const securityConfigDeprecationProvider = ({
  rename,
  renameFromRoot,
  unused
}) => [rename('sessionTimeout', 'session.idleTimeout', {
  level: 'warning'
}), rename('authProviders', 'authc.providers', {
  level: 'warning'
}), rename('audit.appender.kind', 'audit.appender.type', {
  level: 'warning'
}), rename('audit.appender.layout.kind', 'audit.appender.layout.type', {
  level: 'warning'
}), rename('audit.appender.policy.kind', 'audit.appender.policy.type', {
  level: 'warning'
}), rename('audit.appender.strategy.kind', 'audit.appender.strategy.type', {
  level: 'warning'
}), rename('audit.appender.path', 'audit.appender.fileName', {
  level: 'warning'
}), renameFromRoot('security.showInsecureClusterWarning', 'xpack.security.showInsecureClusterWarning', {
  level: 'warning'
}), unused('authorization.legacyFallback.enabled', {
  level: 'warning'
}), unused('authc.saml.maxRedirectURLSize', {
  level: 'warning'
}),
// Deprecation warning for the old array-based format of `xpack.security.authc.providers`.
(settings, _fromPath, addDeprecation, {
  branch
}) => {
  var _settings$xpack, _settings$xpack$secur, _settings$xpack$secur2;
  if (Array.isArray(settings === null || settings === void 0 ? void 0 : (_settings$xpack = settings.xpack) === null || _settings$xpack === void 0 ? void 0 : (_settings$xpack$secur = _settings$xpack.security) === null || _settings$xpack$secur === void 0 ? void 0 : (_settings$xpack$secur2 = _settings$xpack$secur.authc) === null || _settings$xpack$secur2 === void 0 ? void 0 : _settings$xpack$secur2.providers)) {
    // TODO: remove when docs support "main"
    const docsBranch = branch === 'main' ? 'master' : 'branch';
    addDeprecation({
      configPath: 'xpack.security.authc.providers',
      title: _i18n.i18n.translate('xpack.security.deprecations.authcProvidersTitle', {
        defaultMessage: 'The array format for "xpack.security.authc.providers" is deprecated'
      }),
      message: _i18n.i18n.translate('xpack.security.deprecations.authcProvidersMessage', {
        defaultMessage: 'Use the new object format instead of an array of provider types.'
      }),
      level: 'warning',
      documentationUrl: `https://www.elastic.co/guide/en/kibana/${docsBranch}/security-settings-kb.html#authentication-security-settings`,
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.security.deprecations.authcProviders.manualSteps1', {
          defaultMessage: 'Remove the "xpack.security.authc.providers" setting from kibana.yml.'
        }), _i18n.i18n.translate('xpack.security.deprecations.authcProviders.manualSteps2', {
          defaultMessage: 'Add your authentication providers using the new object format.'
        })]
      }
    });
  }
}, (settings, _fromPath, addDeprecation, {
  branch
}) => {
  // TODO: remove when docs support "main"
  const docsBranch = branch === 'main' ? 'master' : 'branch';
  const hasProviderType = providerType => {
    var _settings$xpack2, _settings$xpack2$secu, _settings$xpack2$secu2;
    const providers = settings === null || settings === void 0 ? void 0 : (_settings$xpack2 = settings.xpack) === null || _settings$xpack2 === void 0 ? void 0 : (_settings$xpack2$secu = _settings$xpack2.security) === null || _settings$xpack2$secu === void 0 ? void 0 : (_settings$xpack2$secu2 = _settings$xpack2$secu.authc) === null || _settings$xpack2$secu2 === void 0 ? void 0 : _settings$xpack2$secu2.providers;
    if (Array.isArray(providers)) {
      return providers.includes(providerType);
    }
    return Object.values((providers === null || providers === void 0 ? void 0 : providers[providerType]) || {}).some(provider => (provider === null || provider === void 0 ? void 0 : provider.enabled) !== false);
  };
  if (hasProviderType('basic') && hasProviderType('token')) {
    const basicProvider = 'basic';
    const tokenProvider = 'token';
    addDeprecation({
      configPath: 'xpack.security.authc.providers',
      title: _i18n.i18n.translate('xpack.security.deprecations.basicAndTokenProvidersTitle', {
        defaultMessage: 'Using both "{basicProvider}" and "{tokenProvider}" providers in "xpack.security.authc.providers" has no effect',
        values: {
          basicProvider,
          tokenProvider
        }
      }),
      message: _i18n.i18n.translate('xpack.security.deprecations.basicAndTokenProvidersMessage', {
        defaultMessage: 'Use only one of these providers. When both providers are set, Kibana only uses the "{tokenProvider}" provider.',
        values: {
          tokenProvider
        }
      }),
      level: 'warning',
      documentationUrl: `https://www.elastic.co/guide/en/kibana/${docsBranch}/security-settings-kb.html#authentication-security-settings`,
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.security.deprecations.basicAndTokenProviders.manualSteps1', {
          defaultMessage: 'Remove the "{basicProvider}" provider from "xpack.security.authc.providers" in kibana.yml.',
          values: {
            basicProvider
          }
        })]
      }
    });
  }
}, (settings, _fromPath, addDeprecation, {
  branch
}) => {
  var _settings$xpack$secur3, _settings$xpack3, _settings$xpack3$secu, _settings$xpack3$secu2, _settings$xpack3$secu3;
  // TODO: remove when docs support "main"
  const docsBranch = branch === 'main' ? 'master' : 'branch';
  const samlProviders = (_settings$xpack$secur3 = settings === null || settings === void 0 ? void 0 : (_settings$xpack3 = settings.xpack) === null || _settings$xpack3 === void 0 ? void 0 : (_settings$xpack3$secu = _settings$xpack3.security) === null || _settings$xpack3$secu === void 0 ? void 0 : (_settings$xpack3$secu2 = _settings$xpack3$secu.authc) === null || _settings$xpack3$secu2 === void 0 ? void 0 : (_settings$xpack3$secu3 = _settings$xpack3$secu2.providers) === null || _settings$xpack3$secu3 === void 0 ? void 0 : _settings$xpack3$secu3.saml) !== null && _settings$xpack$secur3 !== void 0 ? _settings$xpack$secur3 : {};
  const foundProvider = Object.entries(samlProviders).find(([_, provider]) => !!provider.maxRedirectURLSize);
  if (foundProvider) {
    addDeprecation({
      configPath: `xpack.security.authc.providers.saml.${foundProvider[0]}.maxRedirectURLSize`,
      title: _i18n.i18n.translate('xpack.security.deprecations.maxRedirectURLSizeTitle', {
        defaultMessage: '"xpack.security.authc.providers.saml.<provider-name>.maxRedirectURLSize" has no effect'
      }),
      message: _i18n.i18n.translate('xpack.security.deprecations.maxRedirectURLSizeMessage', {
        defaultMessage: 'This setting is no longer used.'
      }),
      level: 'warning',
      documentationUrl: `https://www.elastic.co/guide/en/kibana/${docsBranch}/security-settings-kb.html#authentication-security-settings`,
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.security.deprecations.maxRedirectURLSize.manualSteps1', {
          defaultMessage: 'Remove "xpack.security.authc.providers.saml.<provider-name>.maxRedirectURLSize" from kibana.yml.'
        })]
      }
    });
  }
}, (settings, _fromPath, addDeprecation, {
  branch
}) => {
  var _settings$xpack$secur4, _settings$xpack4, _settings$xpack4$secu, _settings$xpack4$secu2, _settings$xpack4$secu3;
  // TODO: remove when docs support "main"
  const docsBranch = branch === 'main' ? 'master' : 'branch';
  const anonProviders = (_settings$xpack$secur4 = settings === null || settings === void 0 ? void 0 : (_settings$xpack4 = settings.xpack) === null || _settings$xpack4 === void 0 ? void 0 : (_settings$xpack4$secu = _settings$xpack4.security) === null || _settings$xpack4$secu === void 0 ? void 0 : (_settings$xpack4$secu2 = _settings$xpack4$secu.authc) === null || _settings$xpack4$secu2 === void 0 ? void 0 : (_settings$xpack4$secu3 = _settings$xpack4$secu2.providers) === null || _settings$xpack4$secu3 === void 0 ? void 0 : _settings$xpack4$secu3.anonymous) !== null && _settings$xpack$secur4 !== void 0 ? _settings$xpack$secur4 : {};
  const credTypeElasticsearchAnonUser = 'elasticsearch_anonymous_user';
  const credTypeApiKey = 'apiKey';
  for (const provider of Object.entries(anonProviders)) {
    if (!!provider[1].credentials.apiKey || provider[1].credentials === credTypeElasticsearchAnonUser) {
      const isApiKey = !!provider[1].credentials.apiKey;
      addDeprecation({
        configPath: `xpack.security.authc.providers.anonymous.${provider[0]}.credentials${isApiKey ? '.apiKey' : ''}`,
        title: _i18n.i18n.translate('xpack.security.deprecations.anonymousApiKeyOrElasticsearchAnonUserTitle', {
          values: {
            credType: isApiKey ? `${credTypeApiKey}` : `'${credTypeElasticsearchAnonUser}'`
          },
          defaultMessage: `Use of {credType} for "xpack.security.authc.providers.anonymous.credentials" is deprecated.`
        }),
        message: _i18n.i18n.translate('xpack.security.deprecations.anonymousApiKeyOrElasticsearchAnonUserMessage', {
          values: {
            credType: isApiKey ? `${credTypeApiKey}` : `'${credTypeElasticsearchAnonUser}'`
          },
          defaultMessage: `Support for {credType} is being removed from the 'anonymous' authentication provider. Use username and password credentials.`
        }),
        level: 'warning',
        documentationUrl: `https://www.elastic.co/guide/en/kibana/${docsBranch}/kibana-authentication.html#anonymous-authentication`,
        correctiveActions: {
          manualSteps: [_i18n.i18n.translate('xpack.security.deprecations.anonAuthCredentials.manualSteps1', {
            defaultMessage: 'Change the anonymous authentication provider to use username and password credentials.'
          })]
        }
      });
    }
  }
}];
exports.securityConfigDeprecationProvider = securityConfigDeprecationProvider;