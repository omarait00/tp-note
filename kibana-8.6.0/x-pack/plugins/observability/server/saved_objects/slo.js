"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slo = exports.SO_SLO_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SO_SLO_TYPE = 'slo';
exports.SO_SLO_TYPE = SO_SLO_TYPE;
const slo = {
  name: SO_SLO_TYPE,
  hidden: false,
  namespaceType: 'multiple-isolated',
  mappings: {
    dynamic: false,
    properties: {
      name: {
        type: 'text'
      },
      description: {
        type: 'text'
      },
      indicator: {
        properties: {
          type: {
            type: 'keyword'
          },
          params: {
            type: 'flattened'
          }
        }
      },
      time_window: {
        properties: {
          duration: {
            type: 'keyword'
          },
          is_rolling: {
            type: 'boolean'
          },
          calendar: {
            properties: {
              start_time: {
                type: 'date'
              }
            }
          }
        }
      },
      budgeting_method: {
        type: 'keyword'
      },
      objective: {
        properties: {
          target: {
            type: 'float'
          },
          timeslice_target: {
            type: 'float'
          },
          timeslice_window: {
            type: 'keyword'
          }
        }
      },
      revision: {
        type: 'short'
      },
      created_at: {
        type: 'date'
      },
      updated_at: {
        type: 'date'
      }
    }
  },
  management: {
    displayName: 'SLO',
    importableAndExportable: true,
    getTitle(sloSavedObject) {
      return `SLO: [${sloSavedObject.attributes.name}]`;
    }
  }
};
exports.slo = slo;