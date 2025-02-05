"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortByTime = exports.postprocessAnnotations = exports.isRangeAnnotation = exports.isManualPointAnnotation = exports.isManualAnnotation = exports.isInRange = exports.getCalculatedInterval = exports.ANNOTATIONS_PER_BUCKET = void 0;
exports.toAbsoluteDates = toAbsoluteDates;
exports.wrapRowsInDatatable = void 0;
var _common = require("../../../data/common");
var _lodash = require("lodash");
var _datemath = _interopRequireDefault(require("@kbn/datemath"));
var _moment = _interopRequireDefault(require("moment"));
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const isRangeAnnotation = annotation => {
  return 'endTime' in annotation;
};
exports.isRangeAnnotation = isRangeAnnotation;
const isManualPointAnnotation = annotation => {
  return 'time' in annotation && !('endTime' in annotation);
};
exports.isManualPointAnnotation = isManualPointAnnotation;
const isManualAnnotation = annotation => isRangeAnnotation(annotation) || isManualPointAnnotation(annotation);
exports.isManualAnnotation = isManualAnnotation;
function toAbsoluteDate(date) {
  const parsed = _datemath.default.parse(date);
  return parsed ? parsed.toDate() : undefined;
}
function toAbsoluteDates(range) {
  const fromDate = _datemath.default.parse(range.from);
  const toDate = _datemath.default.parse(range.to, {
    roundUp: true
  });
  if (!fromDate || !toDate) {
    return;
  }
  return {
    from: fromDate.toDate(),
    to: toDate.toDate()
  };
}
const getCalculatedInterval = (uiSettings, usedInterval, timeRange) => {
  const dates = timeRange && toAbsoluteDates(timeRange);
  if (!dates) {
    return;
  }
  const buckets = new _common.TimeBuckets({
    'histogram:maxBars': uiSettings.get(_common.UI_SETTINGS.HISTOGRAM_MAX_BARS),
    'histogram:barTarget': uiSettings.get(_common.UI_SETTINGS.HISTOGRAM_BAR_TARGET),
    dateFormat: uiSettings.get('dateFormat'),
    'dateFormat:scaled': uiSettings.get('dateFormat:scaled')
  });
  buckets.setInterval(usedInterval);
  buckets.setBounds({
    min: (0, _moment.default)(dates.from),
    max: (0, _moment.default)(dates.to)
  });
  return buckets.getInterval().expression;
};
exports.getCalculatedInterval = getCalculatedInterval;
const isInRange = (annotation, timerange) => {
  if (!timerange) {
    return false;
  }
  const {
    from,
    to
  } = toAbsoluteDates(timerange) || {};
  if (!from || !to) {
    return false;
  }
  if (isRangeAnnotation(annotation)) {
    const time = toAbsoluteDate(annotation.time);
    const endTime = toAbsoluteDate(annotation.endTime);
    if (time && endTime) {
      return !(time >= to || endTime < from);
    }
  }
  if (isManualPointAnnotation(annotation)) {
    const time = toAbsoluteDate(annotation.time);
    if (time) {
      return time >= from && time <= to;
    }
  }
  return true;
};
exports.isInRange = isInRange;
const sortByTime = (a, b) => {
  return 'time' in a && 'time' in b ? a.time.localeCompare(b.time) : 0;
};
exports.sortByTime = sortByTime;
const wrapRowsInDatatable = (rows, columns = _types.annotationColumns) => {
  const datatable = {
    type: 'datatable',
    columns,
    rows
  };
  return datatable;
};
exports.wrapRowsInDatatable = wrapRowsInDatatable;
const ANNOTATIONS_PER_BUCKET = 10;
exports.ANNOTATIONS_PER_BUCKET = ANNOTATIONS_PER_BUCKET;
const postprocessAnnotations = (esaggsResponses, queryAnnotationConfigs, manualAnnotationDatatableRows) => {
  const datatableColumns = esaggsResponses.flatMap(({
    response,
    fieldsColIdMap
  }) => {
    const swappedFieldsColIdMap = Object.fromEntries(Object.entries(fieldsColIdMap).map(([k, v]) => [v, k]));
    return response.columns.filter(col => swappedFieldsColIdMap[col.id]).map(col => {
      return {
        ...col,
        name: swappedFieldsColIdMap[col.id],
        // we need to overwrite the name because esaggs column name is per bucket and not per row (eg. "First 10 fields...")
        id: `field:${swappedFieldsColIdMap[col.id]}`
      };
    });
  }).reduce((acc, col) => {
    if (!acc.find(c => c.id === col.id)) {
      acc.push(col);
    }
    return acc;
  }, []).concat(_types.annotationColumns);
  const modifiedRows = esaggsResponses.flatMap(({
    response,
    fieldsColIdMap
  }) => response.rows.map(row => {
    var _annotationConfig$ext;
    const annotationConfig = queryAnnotationConfigs.find(({
      id
    }) => id === row['col-0-1']);
    if (!annotationConfig) {
      throw new Error(`Could not find annotation config for id: ${row['col-0-1']}`);
    }
    let extraFields = {};
    if (annotationConfig !== null && annotationConfig !== void 0 && (_annotationConfig$ext = annotationConfig.extraFields) !== null && _annotationConfig$ext !== void 0 && _annotationConfig$ext.length) {
      extraFields = annotationConfig.extraFields.reduce((acc, field) => ({
        ...acc,
        [`field:${field}`]: row[fieldsColIdMap[field]]
      }), {});
    }
    if (annotationConfig !== null && annotationConfig !== void 0 && annotationConfig.textField) {
      extraFields[`field:${annotationConfig.textField}`] = row[fieldsColIdMap[annotationConfig.textField]];
    }
    let modifiedRow = {
      ...passStylesFromAnnotationConfig(annotationConfig),
      id: row['col-0-1'],
      timebucket: (0, _moment.default)(row['col-1-2']).toISOString(),
      time: row['col-3-4'],
      type: 'point',
      label: annotationConfig.label,
      extraFields
    };
    const countRow = row['col-2-3'];
    if (countRow > ANNOTATIONS_PER_BUCKET) {
      modifiedRow = {
        skippedCount: countRow - ANNOTATIONS_PER_BUCKET,
        ...modifiedRow
      };
    }
    return modifiedRow;
  })).concat(...manualAnnotationDatatableRows).sort((a, b) => a.timebucket.localeCompare(b.timebucket));
  const skippedCountPerBucket = getSkippedCountPerBucket(modifiedRows);
  const flattenedRows = modifiedRows.reduce((acc, row) => {
    if (!Array.isArray(row.time)) {
      acc.push({
        ...(0, _lodash.omit)(row, ['extraFields', 'skippedCount']),
        ...row.extraFields
      });
    } else {
      row.time.forEach((time, index) => {
        const extraFields = {};
        if (row.extraFields) {
          Object.entries(row === null || row === void 0 ? void 0 : row.extraFields).forEach(([fieldKey, fieldValue]) => {
            extraFields[fieldKey] = Array.isArray(fieldValue) ? fieldValue[index] : fieldValue;
          });
        }
        acc.push({
          ...(0, _lodash.omit)(row, ['extraFields', 'skippedCount']),
          ...extraFields,
          label: Array.isArray(row.label) ? row.label[index] : row.label,
          time
        });
      });
    }
    return acc;
  }, []).sort(sortByTime).reduce((acc, row, index, arr) => {
    if (index === arr.length - 1 || row.timebucket !== arr[index + 1].timebucket) {
      acc.push({
        ...row,
        skippedCount: skippedCountPerBucket[row.timebucket]
      });
      return acc;
    }
    acc.push(row);
    return acc;
  }, []);
  return wrapRowsInDatatable(flattenedRows, datatableColumns);
};
exports.postprocessAnnotations = postprocessAnnotations;
function getSkippedCountPerBucket(rows) {
  return rows.reduce((acc, current) => {
    if (current.skippedCount) {
      acc[current.timebucket] = (acc[current.timebucket] || 0) + current.skippedCount;
    }
    return acc;
  }, {});
}
function passStylesFromAnnotationConfig(annotationConfig) {
  return {
    ...(0, _lodash.pick)(annotationConfig, [`label`, `color`, `icon`, `lineWidth`, `lineStyle`, `textVisibility`])
  };
}