"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filesSchema = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const filesSchema = {
  countByExtension: {
    type: 'array',
    items: {
      extension: {
        type: 'keyword'
      },
      count: {
        type: 'long'
      }
    }
  },
  countByStatus: {
    AWAITING_UPLOAD: {
      type: 'long',
      _meta: {
        description: 'Number of files awaiting upload'
      }
    },
    DELETED: {
      type: 'long',
      _meta: {
        description: 'Number of files that are marked as deleted'
      }
    },
    READY: {
      type: 'long',
      _meta: {
        description: 'Number of files that are ready for download'
      }
    },
    UPLOADING: {
      type: 'long',
      _meta: {
        description: 'Number of files that are currently uploading'
      }
    },
    UPLOAD_ERROR: {
      type: 'long',
      _meta: {
        description: 'Number of files that failed to upload'
      }
    }
  },
  storage: {
    esFixedSizeIndex: {
      capacity: {
        type: 'long',
        _meta: {
          description: 'Capacity of the fixed size index'
        }
      },
      available: {
        type: 'long',
        _meta: {
          description: 'Available storage in bytes'
        }
      },
      used: {
        type: 'long',
        _meta: {
          description: 'Used storage in bytes'
        }
      }
    }
  }
};
exports.filesSchema = filesSchema;