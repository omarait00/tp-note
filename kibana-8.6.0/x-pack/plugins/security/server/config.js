"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigSchema = void 0;
exports.createConfig = createConfig;
var _crypto = _interopRequireDefault(require("crypto"));
var _path = _interopRequireDefault(require("path"));
var _configSchema = require("@kbn/config-schema");
var _server = require("../../../../src/core/server");
var _i18n = require("@kbn/i18n");
var _utils = require("@kbn/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const providerOptionsSchema = (providerType, optionsSchema) => _configSchema.schema.conditional(_configSchema.schema.siblingRef('providers'), _configSchema.schema.arrayOf(_configSchema.schema.string(), {
  validate: providers => !providers.includes(providerType) ? 'error' : undefined
}), optionsSchema, _configSchema.schema.never());
function getCommonProviderSchemaProperties(overrides = {}) {
  return {
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    showInSelector: _configSchema.schema.boolean({
      defaultValue: true
    }),
    order: _configSchema.schema.number({
      min: 0
    }),
    description: _configSchema.schema.maybe(_configSchema.schema.string()),
    hint: _configSchema.schema.maybe(_configSchema.schema.string()),
    icon: _configSchema.schema.maybe(_configSchema.schema.string()),
    accessAgreement: _configSchema.schema.maybe(_configSchema.schema.object({
      message: _configSchema.schema.string()
    })),
    session: _configSchema.schema.object({
      idleTimeout: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.duration(), _configSchema.schema.literal(null)])),
      lifespan: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.duration(), _configSchema.schema.literal(null)]))
    }),
    ...overrides
  };
}
function getUniqueProviderSchema(providerType, overrides, properties) {
  return _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object(properties ? {
    ...getCommonProviderSchemaProperties(overrides),
    ...properties
  } : getCommonProviderSchemaProperties(overrides)), {
    validate(config) {
      if (Object.values(config).filter(provider => provider.enabled).length > 1) {
        return `Only one "${providerType}" provider can be configured.`;
      }
    }
  }));
}
const providersConfigSchema = _configSchema.schema.object({
  basic: getUniqueProviderSchema('basic', {
    description: _configSchema.schema.string({
      defaultValue: _i18n.i18n.translate('xpack.security.loginWithElasticsearchLabel', {
        defaultMessage: 'Log in with Elasticsearch'
      })
    }),
    icon: _configSchema.schema.string({
      defaultValue: 'logoElasticsearch'
    }),
    showInSelector: _configSchema.schema.boolean({
      defaultValue: true,
      validate: value => {
        if (!value) {
          return '`basic` provider only supports `true` in `showInSelector`.';
        }
      }
    })
  }),
  token: getUniqueProviderSchema('token', {
    description: _configSchema.schema.string({
      defaultValue: _i18n.i18n.translate('xpack.security.loginWithElasticsearchLabel', {
        defaultMessage: 'Log in with Elasticsearch'
      })
    }),
    icon: _configSchema.schema.string({
      defaultValue: 'logoElasticsearch'
    }),
    showInSelector: _configSchema.schema.boolean({
      defaultValue: true,
      validate: value => {
        if (!value) {
          return '`token` provider only supports `true` in `showInSelector`.';
        }
      }
    })
  }),
  kerberos: getUniqueProviderSchema('kerberos'),
  pki: getUniqueProviderSchema('pki'),
  saml: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
    ...getCommonProviderSchemaProperties(),
    realm: _configSchema.schema.string(),
    maxRedirectURLSize: _configSchema.schema.maybe(_configSchema.schema.byteSize()),
    useRelayStateDeepLink: _configSchema.schema.boolean({
      defaultValue: false
    })
  }))),
  oidc: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
    ...getCommonProviderSchemaProperties(),
    realm: _configSchema.schema.string()
  }))),
  anonymous: getUniqueProviderSchema('anonymous', {
    description: _configSchema.schema.string({
      defaultValue: _i18n.i18n.translate('xpack.security.loginAsGuestLabel', {
        defaultMessage: 'Continue as Guest'
      })
    }),
    hint: _configSchema.schema.string({
      defaultValue: _i18n.i18n.translate('xpack.security.loginAsGuestHintLabel', {
        defaultMessage: 'For anonymous users'
      })
    }),
    icon: _configSchema.schema.string({
      defaultValue: 'globe'
    }),
    session: _configSchema.schema.object({
      idleTimeout: _configSchema.schema.nullable(_configSchema.schema.duration()),
      lifespan: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.duration(), _configSchema.schema.literal(null)]))
    })
  }, {
    credentials: _configSchema.schema.oneOf([_configSchema.schema.literal('elasticsearch_anonymous_user'), _configSchema.schema.object({
      username: _configSchema.schema.string(),
      password: _configSchema.schema.string()
    }), _configSchema.schema.object({
      apiKey: _configSchema.schema.oneOf([_configSchema.schema.object({
        id: _configSchema.schema.string(),
        key: _configSchema.schema.string()
      }), _configSchema.schema.string()])
    })])
  })
}, {
  validate(config) {
    const checks = {
      sameOrder: new Map(),
      sameName: new Map()
    };
    for (const [providerType, providerGroup] of Object.entries(config)) {
      for (const [providerName, {
        enabled,
        order
      }] of Object.entries(providerGroup !== null && providerGroup !== void 0 ? providerGroup : {})) {
        if (!enabled) {
          continue;
        }
        const providerPath = `xpack.security.authc.providers.${providerType}.${providerName}`;
        const providerWithSameOrderPath = checks.sameOrder.get(order);
        if (providerWithSameOrderPath) {
          return `Found multiple providers configured with the same order "${order}": [${providerWithSameOrderPath}, ${providerPath}]`;
        }
        checks.sameOrder.set(order, providerPath);
        const providerWithSameName = checks.sameName.get(providerName);
        if (providerWithSameName) {
          return `Found multiple providers configured with the same name "${providerName}": [${providerWithSameName}, ${providerPath}]`;
        }
        checks.sameName.set(providerName, providerPath);
      }
    }
  }
});
const ConfigSchema = _configSchema.schema.object({
  loginAssistanceMessage: _configSchema.schema.string({
    defaultValue: ''
  }),
  showInsecureClusterWarning: _configSchema.schema.boolean({
    defaultValue: true
  }),
  loginHelp: _configSchema.schema.maybe(_configSchema.schema.string()),
  cookieName: _configSchema.schema.string({
    defaultValue: 'sid'
  }),
  encryptionKey: _configSchema.schema.conditional(_configSchema.schema.contextRef('dist'), true, _configSchema.schema.maybe(_configSchema.schema.string({
    minLength: 32
  })), _configSchema.schema.string({
    minLength: 32,
    defaultValue: 'a'.repeat(32)
  })),
  session: _configSchema.schema.object({
    idleTimeout: _configSchema.schema.oneOf([_configSchema.schema.duration(), _configSchema.schema.literal(null)], {
      defaultValue: _configSchema.schema.duration().validate('8h')
    }),
    lifespan: _configSchema.schema.oneOf([_configSchema.schema.duration(), _configSchema.schema.literal(null)], {
      defaultValue: _configSchema.schema.duration().validate('30d')
    }),
    cleanupInterval: _configSchema.schema.duration({
      defaultValue: '1h',
      validate(value) {
        if (value.asSeconds() < 10) {
          return 'the value must be greater or equal to 10 seconds.';
        }
      }
    })
  }),
  secureCookies: _configSchema.schema.boolean({
    defaultValue: false
  }),
  sameSiteCookies: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('Strict'), _configSchema.schema.literal('Lax'), _configSchema.schema.literal('None')])),
  public: _configSchema.schema.object({
    protocol: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('http'), _configSchema.schema.literal('https')])),
    hostname: _configSchema.schema.maybe(_configSchema.schema.string({
      hostname: true
    })),
    port: _configSchema.schema.maybe(_configSchema.schema.number({
      min: 0,
      max: 65535
    }))
  }),
  accessAgreement: _configSchema.schema.maybe(_configSchema.schema.object({
    message: _configSchema.schema.string()
  })),
  authc: _configSchema.schema.object({
    selector: _configSchema.schema.object({
      enabled: _configSchema.schema.maybe(_configSchema.schema.boolean())
    }),
    providers: _configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string()), providersConfigSchema], {
      defaultValue: {
        basic: {
          basic: {
            enabled: true,
            showInSelector: true,
            order: 0,
            description: undefined,
            hint: undefined,
            icon: undefined,
            accessAgreement: undefined,
            session: {
              idleTimeout: undefined,
              lifespan: undefined
            }
          }
        },
        token: undefined,
        saml: undefined,
        oidc: undefined,
        pki: undefined,
        kerberos: undefined,
        anonymous: undefined
      }
    }),
    oidc: providerOptionsSchema('oidc', _configSchema.schema.object({
      realm: _configSchema.schema.string()
    })),
    saml: providerOptionsSchema('saml', _configSchema.schema.object({
      realm: _configSchema.schema.maybe(_configSchema.schema.string()),
      maxRedirectURLSize: _configSchema.schema.maybe(_configSchema.schema.byteSize())
    })),
    http: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      autoSchemesEnabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      schemes: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
        defaultValue: ['apikey', 'bearer']
      })
    })
  }),
  audit: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: false
    }),
    appender: _configSchema.schema.maybe(_server.config.logging.appenders),
    ignore_filters: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
      actions: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string(), {
        minSize: 1
      })),
      categories: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string(), {
        minSize: 1
      })),
      types: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string(), {
        minSize: 1
      })),
      outcomes: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string(), {
        minSize: 1
      })),
      spaces: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string(), {
        minSize: 1
      }))
    })))
  })
});
exports.ConfigSchema = ConfigSchema;
function createConfig(config, logger, {
  isTLSEnabled
}) {
  var _config$audit$appende;
  let encryptionKey = config.encryptionKey;
  if (encryptionKey === undefined) {
    logger.warn('Generating a random key for xpack.security.encryptionKey. To prevent sessions from being invalidated on ' + 'restart, please set xpack.security.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.');
    encryptionKey = _crypto.default.randomBytes(16).toString('hex');
  }
  let secureCookies = config.secureCookies;
  if (!isTLSEnabled) {
    if (secureCookies) {
      logger.warn('Using secure cookies, but SSL is not enabled inside Kibana. SSL must be configured outside of Kibana to ' + 'function properly.');
    } else {
      logger.warn('Session cookies will be transmitted over insecure connections. This is not recommended.');
    }
  } else if (!secureCookies) {
    secureCookies = true;
  }
  const isUsingLegacyProvidersFormat = Array.isArray(config.authc.providers);
  const providers = isUsingLegacyProvidersFormat ? [...new Set(config.authc.providers)].reduce((legacyProviders, providerType, order) => {
    legacyProviders[providerType] = {
      [providerType]: providerType === 'saml' || providerType === 'oidc' ? {
        enabled: true,
        showInSelector: true,
        order,
        ...config.authc[providerType]
      } : {
        enabled: true,
        showInSelector: true,
        order
      }
    };
    return legacyProviders;
  }, {}) : config.authc.providers;

  // Remove disabled providers and sort the rest.
  const sortedProviders = [];
  for (const [type, providerGroup] of Object.entries(providers)) {
    for (const [name, {
      enabled,
      order,
      accessAgreement
    }] of Object.entries(providerGroup !== null && providerGroup !== void 0 ? providerGroup : {})) {
      if (!enabled) {
        delete providerGroup[name];
      } else {
        const hasAccessAgreement = !!(accessAgreement !== null && accessAgreement !== void 0 && accessAgreement.message);
        sortedProviders.push({
          type: type,
          name,
          order,
          hasAccessAgreement
        });
      }
    }
  }
  sortedProviders.sort(({
    order: orderA
  }, {
    order: orderB
  }) => orderA < orderB ? -1 : orderA > orderB ? 1 : 0);

  // We enable Login Selector by default if a) it's not explicitly disabled, b) new config
  // format of providers is used and c) we have more than one provider enabled.
  const isLoginSelectorEnabled = typeof config.authc.selector.enabled === 'boolean' ? config.authc.selector.enabled : !isUsingLegacyProvidersFormat && sortedProviders.filter(({
    type,
    name
  }) => {
    var _providers$type;
    return (_providers$type = providers[type]) === null || _providers$type === void 0 ? void 0 : _providers$type[name].showInSelector;
  }).length > 1;
  const appender = (_config$audit$appende = config.audit.appender) !== null && _config$audit$appende !== void 0 ? _config$audit$appende : {
    type: 'rolling-file',
    fileName: _path.default.join((0, _utils.getLogsPath)(), 'audit.log'),
    layout: {
      type: 'json'
    },
    policy: {
      type: 'time-interval',
      interval: _configSchema.schema.duration().validate('24h')
    },
    strategy: {
      type: 'numeric',
      max: 10
    }
  };
  return {
    ...config,
    audit: {
      ...config.audit,
      ...(config.audit.enabled && {
        appender
      })
    },
    authc: {
      selector: {
        ...config.authc.selector,
        enabled: isLoginSelectorEnabled
      },
      providers,
      sortedProviders: Object.freeze(sortedProviders),
      http: config.authc.http
    },
    session: getSessionConfig(config.session, providers),
    encryptionKey,
    secureCookies
  };
}
function getSessionConfig(session, providers) {
  return {
    cleanupInterval: session.cleanupInterval,
    getExpirationTimeouts(provider) {
      var _providerSessionConfi, _providerSessionConfi2;
      // Both idle timeout and lifespan from the provider specific session config can have three
      // possible types of values: `Duration`, `null` and `undefined`. The `undefined` type means that
      // provider doesn't override session config and we should fall back to the global one instead.
      // Note: using an `undefined` provider argument returns the global timeouts.
      let providerSessionConfig;
      if (provider) {
        var _providers, _providers$name;
        const {
          type,
          name
        } = provider;
        providerSessionConfig = (_providers = providers[type]) === null || _providers === void 0 ? void 0 : (_providers$name = _providers[name]) === null || _providers$name === void 0 ? void 0 : _providers$name.session;
      }
      const [idleTimeout, lifespan] = [[session.idleTimeout, (_providerSessionConfi = providerSessionConfig) === null || _providerSessionConfi === void 0 ? void 0 : _providerSessionConfi.idleTimeout], [session.lifespan, (_providerSessionConfi2 = providerSessionConfig) === null || _providerSessionConfi2 === void 0 ? void 0 : _providerSessionConfi2.lifespan]].map(([globalTimeout, providerTimeout]) => {
        const timeout = providerTimeout === undefined ? globalTimeout !== null && globalTimeout !== void 0 ? globalTimeout : null : providerTimeout;
        return timeout && timeout.asMilliseconds() > 0 ? timeout : null;
      });
      return {
        idleTimeout,
        lifespan
      };
    }
  };
}