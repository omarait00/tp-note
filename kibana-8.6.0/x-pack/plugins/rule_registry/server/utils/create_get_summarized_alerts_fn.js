"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetSummarizedAlertsFn = void 0;
var _ruleDataUtils = require("@kbn/rule-data-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_ALERT_DOCS_TO_RETURN = 1000;
const createGetSummarizedAlertsFn = opts => () => async ({
  start,
  end,
  executionUuid,
  ruleId,
  spaceId
}) => {
  if (!ruleId || !spaceId) {
    throw new Error(`Must specify both rule ID and space ID for summarized alert query.`);
  }
  const queryByExecutionUuid = !!executionUuid;
  const queryByTimeRange = !!start && !!end;
  // Either executionUuid or start/end dates must be specified, but not both
  if (!queryByExecutionUuid && !queryByTimeRange || queryByExecutionUuid && queryByTimeRange) {
    throw new Error(`Must specify either execution UUID or time range for summarized alert query.`);
  }

  // Get the rule data client reader
  const {
    ruleDataClient,
    useNamespace
  } = opts;
  const ruleDataClientReader = useNamespace ? ruleDataClient.getReader({
    namespace: spaceId
  }) : ruleDataClient.getReader();
  if (queryByExecutionUuid) {
    return await getAlertsByExecutionUuid({
      ruleDataClientReader,
      ruleId,
      executionUuid: executionUuid,
      isLifecycleAlert: opts.isLifecycleAlert
    });
  }
  return await getAlertsByTimeRange({
    ruleDataClientReader,
    ruleId,
    start: start,
    end: end,
    isLifecycleAlert: opts.isLifecycleAlert
  });
};
exports.createGetSummarizedAlertsFn = createGetSummarizedAlertsFn;
const getAlertsByExecutionUuid = async ({
  executionUuid,
  ruleId,
  ruleDataClientReader,
  isLifecycleAlert
}) => {
  if (isLifecycleAlert) {
    return getLifecycleAlertsByExecutionUuid({
      executionUuid,
      ruleId,
      ruleDataClientReader
    });
  }
  return getPersistentAlertsByExecutionUuid({
    executionUuid,
    ruleId,
    ruleDataClientReader
  });
};
const getPersistentAlertsByExecutionUuid = async ({
  executionUuid,
  ruleId,
  ruleDataClientReader
}) => {
  // persistent alerts only create new alerts so query by execution UUID to
  // get all alerts created during an execution
  const request = getQueryByExecutionUuid(executionUuid, ruleId);
  const response = await ruleDataClientReader.search(request);
  return {
    new: getHitsWithCount(response),
    ongoing: {
      count: 0,
      alerts: []
    },
    recovered: {
      count: 0,
      alerts: []
    }
  };
};
const getLifecycleAlertsByExecutionUuid = async ({
  executionUuid,
  ruleId,
  ruleDataClientReader
}) => {
  // lifecycle alerts assign a different action to an alert depending
  // on whether it is new/ongoing/recovered. query for each action in order
  // to get the count of each action type as well as up to the maximum number
  // of each type of alert.
  const requests = [getQueryByExecutionUuid(executionUuid, ruleId, 'open'), getQueryByExecutionUuid(executionUuid, ruleId, 'active'), getQueryByExecutionUuid(executionUuid, ruleId, 'close')];
  const responses = await Promise.all(requests.map(request => ruleDataClientReader.search(request)));
  return {
    new: getHitsWithCount(responses[0]),
    ongoing: getHitsWithCount(responses[1]),
    recovered: getHitsWithCount(responses[2])
  };
};
const getHitsWithCount = response => {
  return {
    count: response.hits.total.value,
    alerts: response.hits.hits.map(r => r._source)
  };
};
const getQueryByExecutionUuid = (executionUuid, ruleId, action) => {
  const filter = [{
    term: {
      [_ruleDataUtils.ALERT_RULE_EXECUTION_UUID]: executionUuid
    }
  }, {
    term: {
      [_ruleDataUtils.ALERT_RULE_UUID]: ruleId
    }
  }];
  if (action) {
    filter.push({
      term: {
        [_ruleDataUtils.EVENT_ACTION]: action
      }
    });
  }
  return {
    body: {
      size: MAX_ALERT_DOCS_TO_RETURN,
      track_total_hits: true,
      query: {
        bool: {
          filter
        }
      }
    }
  };
};
const getAlertsByTimeRange = async ({
  start,
  end,
  ruleId,
  ruleDataClientReader,
  isLifecycleAlert
}) => {
  if (isLifecycleAlert) {
    return getLifecycleAlertsByTimeRange({
      start,
      end,
      ruleId,
      ruleDataClientReader
    });
  }
  return getPersistentAlertsByTimeRange({
    start,
    end,
    ruleId,
    ruleDataClientReader
  });
};
var AlertTypes;
(function (AlertTypes) {
  AlertTypes[AlertTypes["NEW"] = 0] = "NEW";
  AlertTypes[AlertTypes["ONGOING"] = 1] = "ONGOING";
  AlertTypes[AlertTypes["RECOVERED"] = 2] = "RECOVERED";
})(AlertTypes || (AlertTypes = {}));
const getPersistentAlertsByTimeRange = async ({
  start,
  end,
  ruleId,
  ruleDataClientReader
}) => {
  // persistent alerts only create new alerts so query for all alerts within the time
  // range and treat them as NEW
  const request = getQueryByTimeRange(start, end, ruleId);
  const response = await ruleDataClientReader.search(request);
  return {
    new: getHitsWithCount(response),
    ongoing: {
      count: 0,
      alerts: []
    },
    recovered: {
      count: 0,
      alerts: []
    }
  };
};
const getLifecycleAlertsByTimeRange = async ({
  start,
  end,
  ruleId,
  ruleDataClientReader
}) => {
  const requests = [getQueryByTimeRange(start, end, ruleId, AlertTypes.NEW), getQueryByTimeRange(start, end, ruleId, AlertTypes.ONGOING), getQueryByTimeRange(start, end, ruleId, AlertTypes.RECOVERED)];
  const responses = await Promise.all(requests.map(request => ruleDataClientReader.search(request)));
  return {
    new: getHitsWithCount(responses[0]),
    ongoing: getHitsWithCount(responses[1]),
    recovered: getHitsWithCount(responses[2])
  };
};
const getQueryByTimeRange = (start, end, ruleId, type) => {
  // base query filters the alert documents for a rule by the given time range
  let filter = [{
    range: {
      [_ruleDataUtils.TIMESTAMP]: {
        gte: start.toISOString(),
        lt: end.toISOString()
      }
    }
  }, {
    term: {
      [_ruleDataUtils.ALERT_RULE_UUID]: ruleId
    }
  }];
  if (type === AlertTypes.NEW) {
    // alerts are considered NEW within the time range if they started after
    // the query start time
    filter.push({
      range: {
        [_ruleDataUtils.ALERT_START]: {
          gte: start.toISOString()
        }
      }
    });
  } else if (type === AlertTypes.ONGOING) {
    // alerts are considered ONGOING within the time range if they started
    // before the query start time and they have not been recovered (no end time)
    filter = [...filter, {
      range: {
        [_ruleDataUtils.ALERT_START]: {
          lt: start.toISOString()
        }
      }
    }, {
      bool: {
        must_not: {
          exists: {
            field: _ruleDataUtils.ALERT_END
          }
        }
      }
    }];
  } else if (type === AlertTypes.RECOVERED) {
    // alerts are considered RECOVERED within the time range if they recovered
    // within the query time range
    filter.push({
      range: {
        [_ruleDataUtils.ALERT_END]: {
          gte: start.toISOString(),
          lt: end.toISOString()
        }
      }
    });
  }
  return {
    body: {
      size: MAX_ALERT_DOCS_TO_RETURN,
      track_total_hits: true,
      query: {
        bool: {
          filter
        }
      }
    }
  };
};