"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syntheticsMonitorType = exports.getSyntheticsMonitorSavedObjectType = exports.SYNTHETICS_MONITOR_ENCRYPTED_TYPE = void 0;
var _i18n = require("@kbn/i18n");
var _monitor_management = require("../../../../common/constants/monitor_management");
var _monitors = require("./migrations/monitors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const syntheticsMonitorType = 'synthetics-monitor';
exports.syntheticsMonitorType = syntheticsMonitorType;
const SYNTHETICS_MONITOR_ENCRYPTED_TYPE = {
  type: syntheticsMonitorType,
  attributesToEncrypt: new Set(['secrets',
  /* adding secretKeys to the list of attributes to encrypt ensures
   * that secrets are never stored on the resulting saved object,
   * even in the presence of developer error.
   *
   * In practice, all secrets should be stored as a single JSON
   * payload on the `secrets` key. This ensures performant decryption. */
  ..._monitor_management.secretKeys])
};
exports.SYNTHETICS_MONITOR_ENCRYPTED_TYPE = SYNTHETICS_MONITOR_ENCRYPTED_TYPE;
const getSyntheticsMonitorSavedObjectType = encryptedSavedObjects => {
  return {
    name: syntheticsMonitorType,
    hidden: false,
    namespaceType: 'single',
    migrations: {
      '8.6.0': _monitors.monitorMigrations['8.6.0'](encryptedSavedObjects)
    },
    mappings: {
      dynamic: false,
      properties: {
        name: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
              normalizer: 'lowercase'
            }
          }
        },
        type: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        urls: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        hosts: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        journey_id: {
          type: 'keyword'
        },
        project_id: {
          type: 'keyword',
          fields: {
            text: {
              type: 'text'
            }
          }
        },
        origin: {
          type: 'keyword'
        },
        hash: {
          type: 'keyword'
        },
        locations: {
          properties: {
            id: {
              type: 'keyword',
              ignore_above: 256,
              fields: {
                text: {
                  type: 'text'
                }
              }
            },
            label: {
              type: 'text'
            }
          }
        },
        custom_heartbeat_id: {
          type: 'keyword'
        },
        id: {
          type: 'keyword'
        },
        tags: {
          type: 'keyword',
          fields: {
            text: {
              type: 'text'
            }
          }
        },
        schedule: {
          properties: {
            number: {
              type: 'integer'
            }
          }
        },
        enabled: {
          type: 'boolean'
        }
      }
    },
    management: {
      importableAndExportable: false,
      icon: 'uptimeApp',
      getTitle: savedObject => savedObject.attributes.name + ' - ' + _i18n.i18n.translate('xpack.synthetics.syntheticsMonitors', {
        defaultMessage: 'Uptime - Monitor'
      })
    }
  };
};
exports.getSyntheticsMonitorSavedObjectType = getSyntheticsMonitorSavedObjectType;