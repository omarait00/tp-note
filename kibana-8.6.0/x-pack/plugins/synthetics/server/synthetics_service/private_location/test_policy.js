"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testMonitorPolicy = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const testMonitorPolicy = {
  name: 'synthetics-1',
  namespace: '',
  package: {
    name: 'synthetics',
    title: 'Elastic Synthetics',
    version: '0.9.10'
  },
  enabled: true,
  policy_id: '',
  inputs: [{
    type: 'synthetics/http',
    policy_template: 'synthetics',
    enabled: false,
    streams: [{
      enabled: false,
      data_stream: {
        type: 'synthetics',
        dataset: 'http'
      },
      vars: {
        __ui: {
          type: 'yaml'
        },
        enabled: {
          value: true,
          type: 'bool'
        },
        type: {
          value: 'http',
          type: 'text'
        },
        name: {
          type: 'text'
        },
        schedule: {
          value: '"@every 3m"',
          type: 'text'
        },
        urls: {
          type: 'text'
        },
        'service.name': {
          type: 'text'
        },
        timeout: {
          type: 'text'
        },
        max_redirects: {
          type: 'integer'
        },
        proxy_url: {
          type: 'text'
        },
        tags: {
          type: 'yaml'
        },
        username: {
          type: 'text'
        },
        password: {
          type: 'password'
        },
        'response.include_headers': {
          type: 'bool'
        },
        'response.include_body': {
          type: 'text'
        },
        'check.request.method': {
          type: 'text'
        },
        'check.request.headers': {
          type: 'yaml'
        },
        'check.request.body': {
          type: 'yaml'
        },
        'check.response.status': {
          type: 'yaml'
        },
        'check.response.headers': {
          type: 'yaml'
        },
        'check.response.body.positive': {
          type: 'yaml'
        },
        'check.response.body.negative': {
          type: 'yaml'
        },
        'ssl.certificate_authorities': {
          type: 'yaml'
        },
        'ssl.certificate': {
          type: 'yaml'
        },
        'ssl.key': {
          type: 'yaml'
        },
        'ssl.key_passphrase': {
          type: 'text'
        },
        'ssl.verification_mode': {
          type: 'text'
        },
        'ssl.supported_protocols': {
          type: 'yaml'
        },
        location_name: {
          value: 'Fleet managed',
          type: 'text'
        },
        config_id: {
          type: 'text'
        },
        run_once: {
          value: false,
          type: 'bool'
        }
      }
    }]
  }, {
    type: 'synthetics/tcp',
    policy_template: 'synthetics',
    enabled: false,
    streams: [{
      enabled: false,
      data_stream: {
        type: 'synthetics',
        dataset: 'tcp'
      },
      vars: {
        __ui: {
          type: 'yaml'
        },
        enabled: {
          value: true,
          type: 'bool'
        },
        type: {
          value: 'tcp',
          type: 'text'
        },
        name: {
          type: 'text'
        },
        schedule: {
          value: '"@every 3m"',
          type: 'text'
        },
        hosts: {
          type: 'text'
        },
        'service.name': {
          type: 'text'
        },
        timeout: {
          type: 'text'
        },
        proxy_url: {
          type: 'text'
        },
        proxy_use_local_resolver: {
          value: false,
          type: 'bool'
        },
        tags: {
          type: 'yaml'
        },
        'check.send': {
          type: 'text'
        },
        'check.receive': {
          type: 'text'
        },
        'ssl.certificate_authorities': {
          type: 'yaml'
        },
        'ssl.certificate': {
          type: 'yaml'
        },
        'ssl.key': {
          type: 'yaml'
        },
        'ssl.key_passphrase': {
          type: 'text'
        },
        'ssl.verification_mode': {
          type: 'text'
        },
        'ssl.supported_protocols': {
          type: 'yaml'
        },
        location_name: {
          value: 'Fleet managed',
          type: 'text'
        },
        config_id: {
          type: 'text'
        },
        run_once: {
          value: false,
          type: 'bool'
        }
      }
    }]
  }, {
    type: 'synthetics/icmp',
    policy_template: 'synthetics',
    enabled: false,
    streams: [{
      enabled: false,
      data_stream: {
        type: 'synthetics',
        dataset: 'icmp'
      },
      vars: {
        __ui: {
          type: 'yaml'
        },
        enabled: {
          value: true,
          type: 'bool'
        },
        type: {
          value: 'icmp',
          type: 'text'
        },
        name: {
          type: 'text'
        },
        schedule: {
          value: '"@every 3m"',
          type: 'text'
        },
        wait: {
          value: '1s',
          type: 'text'
        },
        hosts: {
          type: 'text'
        },
        'service.name': {
          type: 'text'
        },
        timeout: {
          type: 'text'
        },
        tags: {
          type: 'yaml'
        },
        location_name: {
          value: 'Fleet managed',
          type: 'text'
        },
        config_id: {
          type: 'text'
        },
        run_once: {
          value: false,
          type: 'bool'
        }
      }
    }]
  }, {
    type: 'synthetics/browser',
    policy_template: 'synthetics',
    enabled: true,
    streams: [{
      enabled: true,
      data_stream: {
        type: 'synthetics',
        dataset: 'browser.network'
      }
    }, {
      enabled: true,
      data_stream: {
        type: 'synthetics',
        dataset: 'browser'
      },
      vars: {
        __ui: {
          type: 'yaml'
        },
        enabled: {
          value: true,
          type: 'bool'
        },
        type: {
          value: 'browser',
          type: 'text'
        },
        name: {
          type: 'text'
        },
        schedule: {
          value: '"@every 3m"',
          type: 'text'
        },
        'service.name': {
          type: 'text'
        },
        timeout: {
          type: 'text'
        },
        tags: {
          type: 'yaml'
        },
        'source.zip_url.url': {
          type: 'text'
        },
        'source.zip_url.username': {
          type: 'text'
        },
        'source.zip_url.folder': {
          type: 'text'
        },
        'source.zip_url.password': {
          type: 'password'
        },
        'source.inline.script': {
          type: 'yaml'
        },
        params: {
          type: 'yaml'
        },
        screenshots: {
          type: 'text'
        },
        synthetics_args: {
          type: 'text'
        },
        ignore_https_errors: {
          type: 'bool'
        },
        'throttling.config': {
          type: 'text'
        },
        'filter_journeys.tags': {
          type: 'yaml'
        },
        'filter_journeys.match': {
          type: 'text'
        },
        'source.zip_url.ssl.certificate_authorities': {
          type: 'yaml'
        },
        'source.zip_url.ssl.certificate': {
          type: 'yaml'
        },
        'source.zip_url.ssl.key': {
          type: 'yaml'
        },
        'source.zip_url.ssl.key_passphrase': {
          type: 'text'
        },
        'source.zip_url.ssl.verification_mode': {
          type: 'text'
        },
        'source.zip_url.ssl.supported_protocols': {
          type: 'yaml'
        },
        'source.zip_url.proxy_url': {
          type: 'text'
        },
        location_name: {
          value: 'Fleet managed',
          type: 'text'
        },
        config_id: {
          type: 'text'
        },
        run_once: {
          value: false,
          type: 'bool'
        }
      }
    }, {
      enabled: true,
      data_stream: {
        type: 'synthetics',
        dataset: 'browser.screenshot'
      }
    }]
  }]
};
exports.testMonitorPolicy = testMonitorPolicy;