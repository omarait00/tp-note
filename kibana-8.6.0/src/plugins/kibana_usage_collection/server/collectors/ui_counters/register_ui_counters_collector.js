"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchUiCounters = fetchUiCounters;
exports.registerUiCountersUsageCollector = registerUiCountersUsageCollector;
exports.transformRawUsageCounterObject = transformRawUsageCounterObject;
var _moment = _interopRequireDefault(require("moment"));
var _server = require("../../../../usage_collection/server");
var _ui_counters = require("../../../../usage_collection/common/ui_counters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function transformRawUsageCounterObject(rawUsageCounter) {
  const {
    attributes: {
      count,
      counterName,
      counterType,
      domainId
    },
    updated_at: lastUpdatedAt
  } = rawUsageCounter;
  if (domainId !== 'uiCounter' || typeof count !== 'number' || count < 1) {
    return;
  }
  const fromTimestamp = (0, _moment.default)(lastUpdatedAt).utc().startOf('day').format();
  const {
    appName,
    eventName
  } = (0, _ui_counters.deserializeUiCounterName)(counterName);
  return {
    appName,
    eventName,
    lastUpdatedAt,
    fromTimestamp,
    counterType,
    total: count
  };
}
async function fetchUiCounters({
  soClient
}) {
  const finder = soClient.createPointInTimeFinder({
    type: _server.USAGE_COUNTERS_SAVED_OBJECT_TYPE,
    fields: ['count', 'counterName', 'counterType', 'domainId'],
    filter: `${_server.USAGE_COUNTERS_SAVED_OBJECT_TYPE}.attributes.domainId: uiCounter`,
    perPage: 1000
  });
  const dailyEvents = [];
  for await (const {
    saved_objects: rawUsageCounters
  } of finder.find()) {
    rawUsageCounters.forEach(raw => {
      try {
        const event = transformRawUsageCounterObject(raw);
        if (event) {
          dailyEvents.push(event);
        }
      } catch (_) {
        // swallow error; allows sending successfully transformed objects.
      }
    });
  }
  return {
    dailyEvents
  };
}
function registerUiCountersUsageCollector(usageCollection) {
  const collector = usageCollection.makeUsageCollector({
    type: 'ui_counters',
    schema: {
      dailyEvents: {
        type: 'array',
        items: {
          appName: {
            type: 'keyword',
            _meta: {
              description: 'Name of the app reporting ui counts.'
            }
          },
          eventName: {
            type: 'keyword',
            _meta: {
              description: 'Name of the event that happened.'
            }
          },
          lastUpdatedAt: {
            type: 'date',
            _meta: {
              description: 'Time at which the metric was last updated.'
            }
          },
          fromTimestamp: {
            type: 'date',
            _meta: {
              description: 'Time at which the metric was captured.'
            }
          },
          counterType: {
            type: 'keyword',
            _meta: {
              description: 'The type of counter used.'
            }
          },
          total: {
            type: 'integer',
            _meta: {
              description: 'The total number of times the event happened.'
            }
          }
        }
      }
    },
    fetch: fetchUiCounters,
    isReady: () => true
  });
  usageCollection.registerCollector(collector);
}