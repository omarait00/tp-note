"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchSyncJobsStats = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _ = require("../..");
var _connectors = require("../../../common/types/connectors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchSyncJobsStats = async client => {
  const connectorIdsResult = await client.asCurrentUser.search({
    index: _.CONNECTORS_INDEX,
    scroll: '10s',
    stored_fields: []
  });
  const ids = connectorIdsResult.hits.hits.map(hit => hit._id);
  const orphanedJobsCountResponse = await client.asCurrentUser.count({
    index: _.CONNECTORS_JOBS_INDEX,
    query: {
      bool: {
        must_not: [{
          terms: {
            'connector.id': ids
          }
        }]
      }
    }
  });
  const inProgressJobsCountResponse = await client.asCurrentUser.count({
    index: _.CONNECTORS_JOBS_INDEX,
    query: {
      term: {
        status: _connectors.SyncStatus.IN_PROGRESS
      }
    }
  });
  const stuckJobsCountResponse = await client.asCurrentUser.count({
    index: _.CONNECTORS_JOBS_INDEX,
    query: {
      bool: {
        filter: [{
          term: {
            status: _connectors.SyncStatus.IN_PROGRESS
          }
        }, {
          range: {
            last_seen: {
              lt: (0, _moment.default)().subtract(1, 'minute').toISOString()
            }
          }
        }]
      }
    }
  });
  const errorResponse = await client.asCurrentUser.count({
    index: _.CONNECTORS_INDEX,
    query: {
      term: {
        last_sync_status: _connectors.SyncStatus.ERROR
      }
    }
  });
  const connectedResponse = await client.asCurrentUser.count({
    index: _.CONNECTORS_INDEX,
    query: {
      bool: {
        filter: [{
          term: {
            status: _connectors.ConnectorStatus.CONNECTED
          }
        }, {
          range: {
            last_seen: {
              gte: (0, _moment.default)().subtract(30, 'minutes').toISOString()
            }
          }
        }]
      }
    }
  });
  const incompleteResponse = await client.asCurrentUser.count({
    index: _.CONNECTORS_INDEX,
    query: {
      bool: {
        should: [{
          bool: {
            must_not: {
              terms: {
                status: [_connectors.ConnectorStatus.CONNECTED, _connectors.ConnectorStatus.ERROR]
              }
            }
          }
        }, {
          range: {
            last_seen: {
              lt: (0, _moment.default)().subtract(30, 'minutes').toISOString()
            }
          }
        }]
      }
    }
  });
  const response = {
    connected: connectedResponse.count,
    errors: errorResponse.count,
    in_progress: inProgressJobsCountResponse.count,
    incomplete: incompleteResponse.count,
    orphaned_jobs: orphanedJobsCountResponse.count,
    stuck: stuckJobsCountResponse.count
  };
  return response;
};
exports.fetchSyncJobsStats = fetchSyncJobsStats;