"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCaseCommentSavedObjectType = void 0;
var _constants = require("../../common/constants");
var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createCaseCommentSavedObjectType = ({
  migrationDeps
}) => ({
  name: _constants.CASE_COMMENT_SAVED_OBJECT,
  hidden: true,
  namespaceType: 'multiple-isolated',
  convertToMultiNamespaceTypeVersion: '8.0.0',
  mappings: {
    properties: {
      comment: {
        type: 'text'
      },
      owner: {
        type: 'keyword'
      },
      type: {
        type: 'keyword'
      },
      actions: {
        properties: {
          targets: {
            type: 'nested',
            properties: {
              hostname: {
                type: 'keyword'
              },
              endpointId: {
                type: 'keyword'
              }
            }
          },
          type: {
            type: 'keyword'
          }
        }
      },
      alertId: {
        type: 'keyword'
      },
      index: {
        type: 'keyword'
      },
      created_at: {
        type: 'date'
      },
      created_by: {
        properties: {
          full_name: {
            type: 'keyword'
          },
          username: {
            type: 'keyword'
          },
          email: {
            type: 'keyword'
          },
          profile_uid: {
            type: 'keyword'
          }
        }
      },
      externalReferenceId: {
        type: 'keyword'
      },
      externalReferenceStorage: {
        dynamic: false,
        properties: {
          // externalReferenceStorage.type
          type: {
            type: 'keyword'
          }
        }
      },
      externalReferenceAttachmentTypeId: {
        type: 'keyword'
      },
      externalReferenceMetadata: {
        dynamic: false,
        type: 'object',
        enabled: false
      },
      persistableStateAttachmentTypeId: {
        type: 'keyword'
      },
      persistableStateAttachmentState: {
        dynamic: false,
        type: 'object',
        enabled: false
      },
      pushed_at: {
        type: 'date'
      },
      pushed_by: {
        properties: {
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          },
          email: {
            type: 'keyword'
          },
          profile_uid: {
            type: 'keyword'
          }
        }
      },
      rule: {
        properties: {
          id: {
            type: 'keyword'
          },
          name: {
            type: 'keyword'
          }
        }
      },
      updated_at: {
        type: 'date'
      },
      updated_by: {
        properties: {
          username: {
            type: 'keyword'
          },
          full_name: {
            type: 'keyword'
          },
          email: {
            type: 'keyword'
          },
          profile_uid: {
            type: 'keyword'
          }
        }
      }
    }
  },
  migrations: () => (0, _migrations.createCommentsMigrations)(migrationDeps),
  management: {
    importableAndExportable: true,
    visibleInManagement: false
  }
});
exports.createCaseCommentSavedObjectType = createCaseCommentSavedObjectType;