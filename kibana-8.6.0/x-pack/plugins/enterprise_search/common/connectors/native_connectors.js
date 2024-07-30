"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NATIVE_CONNECTOR_DEFINITIONS = void 0;
var _i18n = require("@kbn/i18n");
var _connectors = require("../types/connectors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const NATIVE_CONNECTOR_DEFINITIONS = {
  mongodb: {
    configuration: {
      host: {
        label: _i18n.i18n.translate('xpack.enterpriseSearch.nativeConnectors.mongodb.configuration.hostLabel', {
          defaultMessage: 'Host'
        }),
        value: ''
      },
      user: {
        label: _i18n.i18n.translate('xpack.enterpriseSearch.nativeConnectors.mongodb.configuration.usernameLabel', {
          defaultMessage: 'Username'
        }),
        value: ''
      },
      password: {
        label: _i18n.i18n.translate('xpack.enterpriseSearch.nativeConnectors.mongodb.configuration.passwordLabel', {
          defaultMessage: 'Password'
        }),
        value: ''
      },
      database: {
        label: _i18n.i18n.translate('xpack.enterpriseSearch.nativeConnectors.mongodb.configuration.databaseLabel', {
          defaultMessage: 'Database'
        }),
        value: ''
      },
      collection: {
        label: _i18n.i18n.translate('xpack.enterpriseSearch.nativeConnectors.mongodb.configuration.collectionLabel', {
          defaultMessage: 'Collection'
        }),
        value: ''
      },
      direct_connection: {
        label: _i18n.i18n.translate('xpack.enterpriseSearch.nativeConnectors.mongodb.configuration.directConnectionLabel', {
          defaultMessage: 'Direct connection (true/false)'
        }),
        value: ''
      }
    },
    features: {
      [_connectors.FeatureName.FILTERING_ADVANCED_CONFIG]: true,
      [_connectors.FeatureName.FILTERING_RULES]: true
    },
    name: _i18n.i18n.translate('xpack.enterpriseSearch.nativeConnectors.mongodb.name', {
      defaultMessage: 'MongoDB'
    }),
    serviceType: 'mongodb'
  },
  mysql: {
    configuration: {
      host: {
        label: _i18n.i18n.translate('xpack.enterpriseSearch.nativeConnectors.mysql.configuration.hostLabel', {
          defaultMessage: 'Host'
        }),
        value: ''
      },
      port: {
        label: _i18n.i18n.translate('xpack.enterpriseSearch.nativeConnectors.mysql.configuration.portLabel', {
          defaultMessage: 'Port'
        }),
        value: ''
      },
      user: {
        label: _i18n.i18n.translate('xpack.enterpriseSearch.nativeConnectors.mysql.configuration.usernameLabel', {
          defaultMessage: 'Username'
        }),
        value: ''
      },
      password: {
        value: '',
        label: _i18n.i18n.translate('xpack.enterpriseSearch.nativeConnectors.mysql.configuration.passwordLabel', {
          defaultMessage: 'Password'
        })
      },
      database: {
        label: _i18n.i18n.translate('xpack.enterpriseSearch.nativeConnectors.mysql.configuration.databasesLabel', {
          defaultMessage: 'Databases'
        }),
        value: ''
      }
    },
    features: {},
    name: _i18n.i18n.translate('xpack.enterpriseSearch.nativeConnectors.mysql.name', {
      defaultMessage: 'MySQL'
    }),
    serviceType: 'mysql'
  }
};
exports.NATIVE_CONNECTOR_DEFINITIONS = NATIVE_CONNECTOR_DEFINITIONS;