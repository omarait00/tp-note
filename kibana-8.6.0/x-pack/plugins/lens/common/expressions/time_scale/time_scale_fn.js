"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeScaleFn = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _i18n = require("@kbn/i18n");
var _common = require("../../../../../../src/plugins/expressions/common");
var _common2 = require("../../../../../../src/plugins/data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const unitInMs = {
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24
};

// the datemath plugin always parses dates by using the current default moment time zone.
// to use the configured time zone, we are temporary switching it just for the calculation.

// The code between this call and the reset in the finally block is not allowed to get async,
// otherwise the timezone setting can leak out of this function.
const withChangedTimeZone = (timeZone, action) => {
  if (timeZone) {
    const defaultTimezone = (0, _momentTimezone.default)().zoneName();
    try {
      _momentTimezone.default.tz.setDefault(timeZone);
      return action();
    } finally {
      // reset default moment timezone
      _momentTimezone.default.tz.setDefault(defaultTimezone);
    }
  } else {
    return action();
  }
};
const getTimeBounds = (timeRange, timeZone, getForceNow) => withChangedTimeZone(timeZone, () => (0, _common2.calculateBounds)(timeRange, {
  forceNow: getForceNow === null || getForceNow === void 0 ? void 0 : getForceNow()
}));
const timeScaleFn = (getDatatableUtilities, getTimezone, getForceNow) => async (input, {
  dateColumnId,
  inputColumnId,
  outputColumnId,
  outputColumnName,
  targetUnit,
  reducedTimeRange
}, context) => {
  let timeBounds;
  const contextTimeZone = await getTimezone(context);
  let getStartEndOfBucketMeta;
  if (dateColumnId) {
    const dateColumnDefinition = input.columns.find(column => column.id === dateColumnId);
    if (!dateColumnDefinition) {
      throw new Error(_i18n.i18n.translate('xpack.lens.functions.timeScale.dateColumnMissingMessage', {
        defaultMessage: 'Specified dateColumnId {columnId} does not exist.',
        values: {
          columnId: dateColumnId
        }
      }));
    }
    const datatableUtilities = await getDatatableUtilities(context);
    const timeInfo = datatableUtilities.getDateHistogramMeta(dateColumnDefinition, {
      timeZone: contextTimeZone
    });
    const intervalDuration = (timeInfo === null || timeInfo === void 0 ? void 0 : timeInfo.interval) && (0, _common2.parseInterval)(timeInfo.interval);
    timeBounds = (timeInfo === null || timeInfo === void 0 ? void 0 : timeInfo.timeRange) && getTimeBounds(timeInfo.timeRange, timeInfo === null || timeInfo === void 0 ? void 0 : timeInfo.timeZone, getForceNow);
    getStartEndOfBucketMeta = row => {
      var _timeInfo$timeZone;
      const startOfBucket = _momentTimezone.default.tz(row[dateColumnId], (_timeInfo$timeZone = timeInfo === null || timeInfo === void 0 ? void 0 : timeInfo.timeZone) !== null && _timeInfo$timeZone !== void 0 ? _timeInfo$timeZone : contextTimeZone);
      return {
        startOfBucket,
        endOfBucket: startOfBucket.clone().add(intervalDuration)
      };
    };
    if (!timeInfo || !intervalDuration) {
      throw new Error(_i18n.i18n.translate('xpack.lens.functions.timeScale.timeInfoMissingMessage', {
        defaultMessage: 'Could not fetch date histogram information'
      }));
    }
  } else {
    const timeRange = context.getSearchContext().timeRange;
    timeBounds = getTimeBounds(timeRange, contextTimeZone, getForceNow);
    if (!timeBounds.max || !timeBounds.min) {
      throw new Error(_i18n.i18n.translate('xpack.lens.functions.timeScale.timeBoundsMissingMessage', {
        defaultMessage: 'Could not parse "Time Range"'
      }));
    }
    const endOfBucket = timeBounds.max;
    let startOfBucket = timeBounds.min;
    if (reducedTimeRange) {
      const reducedStartOfBucket = endOfBucket.clone().subtract((0, _common2.parseInterval)(reducedTimeRange));
      if (reducedStartOfBucket > startOfBucket) {
        startOfBucket = reducedStartOfBucket;
      }
    }
    getStartEndOfBucketMeta = () => ({
      startOfBucket,
      endOfBucket
    });
  }
  const resultColumns = (0, _common.buildResultColumns)(input, outputColumnId, inputColumnId, outputColumnName, {
    allowColumnOverwrite: true
  });
  if (!resultColumns) {
    return input;
  }
  return {
    ...input,
    columns: resultColumns,
    rows: input.rows.map(row => {
      const newRow = {
        ...row
      };
      let {
        startOfBucket,
        endOfBucket
      } = getStartEndOfBucketMeta(row);
      if (timeBounds && timeBounds.min) {
        startOfBucket = _momentTimezone.default.max(startOfBucket, timeBounds.min);
      }
      if (timeBounds && timeBounds.max) {
        endOfBucket = _momentTimezone.default.min(endOfBucket, timeBounds.max);
      }
      const bucketSize = endOfBucket.diff(startOfBucket);
      const factor = bucketSize / unitInMs[targetUnit];
      const currentValue = newRow[inputColumnId];
      if (currentValue != null) {
        newRow[outputColumnId] = Number(currentValue) / factor;
      }
      return newRow;
    })
  };
};
exports.timeScaleFn = timeScaleFn;