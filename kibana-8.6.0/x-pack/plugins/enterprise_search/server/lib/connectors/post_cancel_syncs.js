"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelSyncs = void 0;
var _ = require("../..");
var _connectors = require("../../../common/types/connectors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const cancelSyncs = async (client, connectorId) => {
  await client.asCurrentUser.updateByQuery({
    index: _.CONNECTORS_JOBS_INDEX,
    query: {
      bool: {
        must: [{
          term: {
            'connector.id': connectorId
          }
        }, {
          terms: {
            status: [_connectors.SyncStatus.PENDING, _connectors.SyncStatus.SUSPENDED]
          }
        }]
      }
    },
    refresh: true,
    script: {
      lang: 'painless',
      source: `
      ctx._source['status'] = '${_connectors.SyncStatus.CANCELED}';
      ctx._source['cancelation_requested_at'] = '${new Date(Date.now()).toISOString()}';
      ctx._source['canceled_at'] = '${new Date(Date.now()).toISOString()}';
      ctx._source['completed_at'] = '${new Date(Date.now()).toISOString()}';
`
    }
  });
  await client.asCurrentUser.updateByQuery({
    index: _.CONNECTORS_JOBS_INDEX,
    query: {
      bool: {
        must: [{
          term: {
            'connector.id': connectorId
          }
        }, {
          terms: {
            status: [_connectors.SyncStatus.IN_PROGRESS]
          }
        }]
      }
    },
    refresh: true,
    script: {
      lang: 'painless',
      source: `
        ctx._source['status'] = '${_connectors.SyncStatus.CANCELING}'
        ctx._source['cancelation_requested_at'] = '${new Date(Date.now()).toISOString()}';
`
    }
  });
  await client.asCurrentUser.update({
    doc: {
      last_sync_status: _connectors.SyncStatus.CANCELED,
      sync_now: false
    },
    id: connectorId,
    index: _.CONNECTORS_INDEX,
    refresh: true
  });
};
exports.cancelSyncs = cancelSyncs;