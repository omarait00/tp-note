"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOldestIdleActionTask = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns the millisecond timestamp of the oldest action task that may still be executed (with a 24 hour delay).
 * Useful for cleaning up related objects that may no longer be needed.
 * @internal
 */
const getOldestIdleActionTask = async (client, taskManagerIndex) => {
  var _error, _response$hits, _response$hits$hits;
  // Default is now - 24h
  const oneDayAgo = `now-24h`;
  const response = await client.search({
    size: 1,
    index: taskManagerIndex,
    body: {
      sort: [{
        'task.runAt': {
          order: 'asc'
        }
      }],
      query: {
        bool: {
          filter: {
            bool: {
              must: [{
                terms: {
                  'task.taskType': ['actions:.email', 'actions:.index', 'actions:.pagerduty', 'actions:.swimlane', 'actions:.server-log', 'actions:.slack', 'actions:.webhook', 'actions:.servicenow', 'actions:.servicenow-sir', 'actions:.jira', 'actions:.resilient', 'actions:.teams']
                }
              }, {
                term: {
                  type: 'task'
                }
              }, {
                term: {
                  'task.status': 'idle'
                }
              }]
            }
          }
        }
      }
    }
  }, {
    ignore: [404]
  });
  if (((_error = response.error) === null || _error === void 0 ? void 0 : _error.status) === 404) {
    // If the index doesn't exist, fallback to default
    return oneDayAgo;
  } else if (((_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : (_response$hits$hits = _response$hits.hits) === null || _response$hits$hits === void 0 ? void 0 : _response$hits$hits.length) > 0) {
    var _response$hits$hits$, _response$hits$hits$$;
    // If there is a search result, return it's task.runAt field
    // If there is a search result but it has no task.runAt, assume something has gone very wrong and return 0 as a safe value
    // 0 should be safest since no docs should get filtered out
    const runAt = (_response$hits$hits$ = response.hits.hits[0]._source) === null || _response$hits$hits$ === void 0 ? void 0 : (_response$hits$hits$$ = _response$hits$hits$.task) === null || _response$hits$hits$$ === void 0 ? void 0 : _response$hits$hits$$.runAt;
    return runAt ? `${runAt}||-24h` : `0`;
  } else {
    // If no results, fallback to default
    return oneDayAgo;
  }
};
exports.getOldestIdleActionTask = getOldestIdleActionTask;