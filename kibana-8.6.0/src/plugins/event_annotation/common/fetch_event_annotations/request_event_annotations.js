"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeZone = getTimeZone;
exports.requestEventAnnotations = void 0;
var _rxjs = require("rxjs");
var _lodash = require("lodash");
var _common = require("../../../data/common");
var _moment = _interopRequireDefault(require("moment"));
var _charts = require("@elastic/charts");
var _handle_request = require("./handle_request");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function getTimeZone(uiSettings) {
  const configuredTimeZone = uiSettings.get('dateFormat:tz');
  if (configuredTimeZone === 'Browser') {
    return _moment.default.tz.guess();
  }
  return configuredTimeZone;
}
const emptyDatatable = {
  rows: [],
  columns: [],
  type: 'datatable'
};
const requestEventAnnotations = (input, args, {
  inspectorAdapters,
  abortSignal,
  getSearchSessionId,
  getExecutionContext
}, getStartDependencies) => {
  return (0, _rxjs.defer)(async () => {
    if (!(input !== null && input !== void 0 && input.timeRange) || !args.groups) {
      return emptyDatatable;
    }
    const {
      aggs,
      dataViews,
      searchSource,
      getNow,
      uiSettings
    } = await getStartDependencies();
    const interval = (0, _utils.getCalculatedInterval)(uiSettings, args.interval, input === null || input === void 0 ? void 0 : input.timeRange);
    if (!interval) {
      return emptyDatatable;
    }
    const uniqueDataViewsToLoad = args.groups.map(g => g.dataView.value).reduce((acc, current) => {
      if (acc.find(el => el.id === current.id)) return acc;
      return [...acc, current];
    }, []);
    const loadedDataViews = await Promise.all(uniqueDataViewsToLoad.map(dataView => dataViews.create(dataView, true)));
    const [manualGroups, queryGroups] = (0, _lodash.partition)(regroupForRequestOptimization(args, input, loadedDataViews), isManualSubGroup);
    const manualAnnotationDatatableRows = manualGroups.length ? convertManualToDatatableRows(manualGroups[0], interval, getTimeZone(uiSettings)) : [];
    if (!queryGroups.length) {
      return manualAnnotationDatatableRows.length ? (0, _utils.wrapRowsInDatatable)(manualAnnotationDatatableRows) : emptyDatatable;
    }
    const createEsaggsSingleRequest = async ({
      dataView,
      aggConfigs,
      timeFields,
      ignoreGlobalFilters
    }) => (0, _rxjs.lastValueFrom)((0, _handle_request.handleRequest)({
      aggs: aggConfigs,
      indexPattern: dataView,
      timeFields,
      filters: ignoreGlobalFilters ? undefined : input === null || input === void 0 ? void 0 : input.filters,
      query: ignoreGlobalFilters ? undefined : input === null || input === void 0 ? void 0 : input.query,
      timeRange: input === null || input === void 0 ? void 0 : input.timeRange,
      abortSignal,
      inspectorAdapters,
      searchSessionId: getSearchSessionId(),
      searchSourceService: searchSource,
      getNow,
      executionContext: getExecutionContext()
    }));
    const esaggsGroups = await prepareEsaggsForQueryGroups(queryGroups, interval, aggs);
    const allQueryAnnotationsConfigs = queryGroups.flatMap(group => group.annotations);
    const esaggsResponses = await Promise.all(esaggsGroups.map(async ({
      esaggsParams,
      fieldsColIdMap
    }) => ({
      response: await createEsaggsSingleRequest(esaggsParams),
      fieldsColIdMap
    })));
    return (0, _utils.postprocessAnnotations)(esaggsResponses, allQueryAnnotationsConfigs, manualAnnotationDatatableRows);
  });
};
exports.requestEventAnnotations = requestEventAnnotations;
const isManualSubGroup = group => {
  return group.type === 'manual';
};
const convertManualToDatatableRows = (manualGroup, interval, timezone) => {
  const datatableRows = manualGroup.annotations.map(annotation => {
    const initialDate = (0, _moment.default)(annotation.time).valueOf();
    const snappedDate = (0, _charts.roundDateToESInterval)(initialDate, (0, _common.parseEsInterval)(interval), 'start', timezone);
    return {
      timebucket: (0, _moment.default)(snappedDate).toISOString(),
      ...annotation,
      type: (0, _utils.isManualPointAnnotation)(annotation) ? 'point' : 'range'
    };
  }).sort(_utils.sortByTime);
  return datatableRows;
};
const prepareEsaggsForQueryGroups = (queryGroups, interval, aggs) => {
  return queryGroups.map(group => {
    var _aggregations$map, _group$allFields;
    const annotationsFilters = {
      type: 'agg_type',
      value: {
        enabled: true,
        schema: 'bucket',
        type: 'filters',
        params: {
          filters: group.annotations.map(annotation => ({
            label: annotation.id,
            input: {
              ...annotation.filter
            }
          }))
        }
      }
    };
    const dateHistogram = {
      type: 'agg_type',
      value: {
        enabled: true,
        schema: 'bucket',
        type: 'date_histogram',
        params: {
          useNormalizedEsInterval: true,
          field: group.timeField,
          interval
        }
      }
    };
    const count = {
      type: 'agg_type',
      value: {
        enabled: true,
        schema: 'metric',
        type: 'count'
      }
    };
    const timefieldTopMetric = {
      type: 'agg_type',
      value: {
        enabled: true,
        type: 'top_metrics',
        params: {
          field: group.timeField,
          size: _utils.ANNOTATIONS_PER_BUCKET,
          sortOrder: 'asc',
          sortField: group.timeField
        }
      }
    };
    const fieldsTopMetric = (group.allFields || []).map(field => ({
      type: 'agg_type',
      value: {
        enabled: true,
        type: 'top_metrics',
        params: {
          field,
          size: _utils.ANNOTATIONS_PER_BUCKET,
          sortOrder: 'asc',
          sortField: group.timeField
        }
      }
    }));
    const aggregations = [annotationsFilters, dateHistogram, count, timefieldTopMetric, ...fieldsTopMetric];
    const aggConfigs = aggs.createAggConfigs(group.dataView, (_aggregations$map = aggregations === null || aggregations === void 0 ? void 0 : aggregations.map(agg => agg.value)) !== null && _aggregations$map !== void 0 ? _aggregations$map : []);
    return {
      esaggsParams: {
        dataView: group.dataView,
        aggConfigs,
        timeFields: [group.timeField],
        ignoreGlobalFilters: Boolean(group.ignoreGlobalFilters)
      },
      fieldsColIdMap: ((_group$allFields = group.allFields) === null || _group$allFields === void 0 ? void 0 : _group$allFields.reduce((acc, fieldName, i) => ({
        ...acc,
        // esaggs names the columns col-0-1 (filters), col-1-2(date histogram), col-2-3(timefield), col-3-4(count), col-4-5 (all the extra fields, that's why we start with `col-${i + 4}-${i + 5}`)
        [fieldName]: `col-${i + 4}-${i + 5}`
      }), {})) || {}
    };
  });
};
function regroupForRequestOptimization({
  groups
}, input, loadedDataViews) {
  const outputGroups = groups.map(g => {
    return g.annotations.reduce((acc, current) => {
      if ((0, _utils.isManualAnnotation)(current)) {
        if (!(0, _utils.isInRange)(current, input === null || input === void 0 ? void 0 : input.timeRange)) {
          return acc;
        }
        if (!acc.manual) {
          acc.manual = {
            type: 'manual',
            annotations: []
          };
        }
        acc.manual.annotations.push(current);
        return acc;
      } else {
        var _current$timeField, _dataView$fields$find;
        const dataView = loadedDataViews.find(dv => dv.id === g.dataView.value.id);
        const timeField = (_current$timeField = current.timeField) !== null && _current$timeField !== void 0 ? _current$timeField : dataView.timeFieldName || ((_dataView$fields$find = dataView.fields.find(field => field.type === 'date' && field.displayName)) === null || _dataView$fields$find === void 0 ? void 0 : _dataView$fields$find.name);
        const key = `${g.dataView.value.id}-${timeField}-${Boolean(current.ignoreGlobalFilters)}`;
        const subGroup = acc[key];
        if (subGroup) {
          let allFields = [...(subGroup.allFields || []), ...(current.extraFields || [])];
          if (current.textField) {
            allFields = [...allFields, current.textField];
          }
          return {
            ...acc,
            [key]: {
              ...subGroup,
              allFields: [...new Set(allFields)],
              annotations: [...subGroup.annotations, current]
            }
          };
        }
        let allFields = current.extraFields || [];
        if (current.textField) {
          allFields = [...allFields, current.textField];
        }
        return {
          ...acc,
          [key]: {
            type: 'query',
            dataView,
            timeField: timeField,
            allFields,
            annotations: [current],
            ignoreGlobalFilters: Boolean(current.ignoreGlobalFilters)
          }
        };
      }
    }, {});
  }).reduce((acc, currentGroup) => {
    Object.keys(currentGroup).forEach(key => {
      if (acc[key]) {
        const currentSubGroup = currentGroup[key];
        const requestGroup = acc[key];
        if (isManualSubGroup(currentSubGroup) || isManualSubGroup(requestGroup)) {
          acc[key] = {
            ...requestGroup,
            annotations: [...requestGroup.annotations, ...currentSubGroup.annotations]
          };
        } else {
          acc[key] = {
            ...requestGroup,
            annotations: [...requestGroup.annotations, ...currentSubGroup.annotations],
            allFields: [...new Set([...(requestGroup.allFields || []), ...(currentSubGroup.allFields || [])])]
          };
        }
      } else {
        acc[key] = currentGroup[key];
      }
    });
    return acc;
  }, {});
  return Object.values(outputGroups);
}