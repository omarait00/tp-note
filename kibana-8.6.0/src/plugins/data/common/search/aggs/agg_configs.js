"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AggConfigs = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _lodash = _interopRequireWildcard(require("lodash"));
var _i18n = require("@kbn/i18n");
var _esQuery = require("@kbn/es-query");
var _common = require("../../../../expressions/common");
var _agg_config = require("./agg_config");
var _agg_groups = require("./agg_groups");
var _2 = require("../..");
var _time_splits = require("./utils/time_splits");
var _sampler = require("./utils/sampler");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function removeParentAggs(obj) {
  for (const prop in obj) {
    if (prop === 'parentAggs') delete obj[prop];else if (typeof obj[prop] === 'object') {
      const hasParentAggsKey = ('parentAggs' in obj[prop]);
      removeParentAggs(obj[prop]);
      // delete object if parentAggs was the last key
      if (hasParentAggsKey && Object.keys(obj[prop]).length === 0) {
        delete obj[prop];
      }
    }
  }
}
function parseParentAggs(dslLvlCursor, dsl) {
  if (dsl.parentAggs) {
    _lodash.default.each(dsl.parentAggs, (agg, key) => {
      dslLvlCursor[key] = agg;
      parseParentAggs(dslLvlCursor, agg);
    });
  }
}
class AggConfigs {
  constructor(indexPattern, configStates = [], opts, getConfig) {
    var _opts$aggExecutionCon;
    (0, _defineProperty2.default)(this, "timeRange", void 0);
    (0, _defineProperty2.default)(this, "timeFields", void 0);
    (0, _defineProperty2.default)(this, "forceNow", void 0);
    (0, _defineProperty2.default)(this, "aggs", []);
    (0, _defineProperty2.default)(this, "timeZone", void 0);
    (0, _defineProperty2.default)(this, "createAggConfig", (params, {
      addToAggConfigs = true
    } = {}) => {
      const {
        type
      } = params;
      const getType = t => {
        const typeFromRegistry = this.opts.typesRegistry.get(t);
        if (!typeFromRegistry) {
          throw new Error(_i18n.i18n.translate('data.search.aggs.error.aggNotFound', {
            defaultMessage: 'Unable to find a registered agg type for "{type}".',
            values: {
              type: type
            }
          }));
        }
        return typeFromRegistry;
      };
      let aggConfig;
      if (params instanceof _agg_config.AggConfig) {
        aggConfig = params;
        params.parent = this;
      } else {
        aggConfig = new _agg_config.AggConfig(this, {
          ...params,
          type: typeof type === 'string' ? getType(type) : type
        });
      }
      if (addToAggConfigs) {
        this.aggs.push(aggConfig);
      }
      return aggConfig;
    });
    this.indexPattern = indexPattern;
    this.opts = opts;
    this.getConfig = getConfig;
    this.timeZone = (0, _2.getUserTimeZone)(this.getConfig, opts === null || opts === void 0 ? void 0 : (_opts$aggExecutionCon = opts.aggExecutionContext) === null || _opts$aggExecutionCon === void 0 ? void 0 : _opts$aggExecutionCon.shouldDetectTimeZone);
    configStates = _agg_config.AggConfig.ensureIds(configStates);
    configStates.forEach(params => this.createAggConfig(params));
  }
  get hierarchical() {
    var _this$opts$hierarchic;
    return (_this$opts$hierarchic = this.opts.hierarchical) !== null && _this$opts$hierarchic !== void 0 ? _this$opts$hierarchic : false;
  }
  get partialRows() {
    var _this$opts$partialRow;
    return (_this$opts$partialRow = this.opts.partialRows) !== null && _this$opts$partialRow !== void 0 ? _this$opts$partialRow : false;
  }
  get samplerConfig() {
    var _this$opts$probabilit;
    return {
      probability: (_this$opts$probabilit = this.opts.probability) !== null && _this$opts$probabilit !== void 0 ? _this$opts$probabilit : 1,
      seed: this.opts.samplerSeed
    };
  }
  isSamplingEnabled() {
    return (0, _sampler.isSamplingEnabled)(this.opts.probability) && this.getRequestAggs().filter(agg => !agg.type.hasNoDsl).length > 0;
  }
  setTimeFields(timeFields) {
    this.timeFields = timeFields;
  }
  setForceNow(now) {
    this.forceNow = now;
  }
  setTimeRange(timeRange) {
    this.timeRange = timeRange;
    const updateAggTimeRange = agg => {
      _lodash.default.each(agg.params, param => {
        if (param instanceof _agg_config.AggConfig) {
          updateAggTimeRange(param);
        }
      });
      if (_lodash.default.get(agg, 'type.name') === 'date_histogram') {
        agg.params.timeRange = timeRange;
      }
    };
    this.aggs.forEach(updateAggTimeRange);
  }

  /**
   * Returns the current time range as moment instance (date math will get resolved using the current "now" value or system time if not set)
   * @returns Current time range as resolved date.
   */
  getResolvedTimeRange() {
    return this.timeRange && (0, _2.calculateBounds)(this.timeRange, {
      forceNow: this.forceNow
    });
  }

  // clone method will reuse existing AggConfig in the list (will not create new instances)
  clone({
    enabledOnly = true,
    opts
  } = {}) {
    const filterAggs = agg => {
      if (!enabledOnly) return true;
      return agg.enabled;
    };
    return new AggConfigs(this.indexPattern, this.aggs.filter(filterAggs), {
      ...this.opts,
      ...opts
    }, this.getConfig);
  }
  /**
   * Data-by-data comparison of this Aggregation
   * Ignores the non-array indexes
   * @param aggConfigs an AggConfigs instance
   */
  jsonDataEquals(aggConfigs) {
    if (aggConfigs.length !== this.aggs.length) {
      return false;
    }
    for (let i = 0; i < this.aggs.length; i += 1) {
      if (!_lodash.default.isEqual(aggConfigs[i].toJSON(), this.aggs[i].toJSON())) {
        return false;
      }
    }
    return true;
  }
  toDsl() {
    const dslTopLvl = {};
    let dslLvlCursor;
    let nestedMetrics;
    const timeShifts = this.getTimeShifts();
    const hasMultipleTimeShifts = Object.keys(timeShifts).length > 1;
    if (this.hierarchical) {
      if (hasMultipleTimeShifts) {
        throw new Error('Multiple time shifts not supported for hierarchical metrics');
      }
      // collect all metrics, and filter out the ones that we won't be copying
      nestedMetrics = this.aggs.filter(function (agg) {
        return agg.type.type === 'metrics' && agg.type.name !== 'count';
      }).map(agg => {
        return {
          config: agg,
          dsl: agg.toDsl(this)
        };
      });
    }
    const requestAggs = this.getRequestAggs();
    const aggsWithDsl = requestAggs.filter(agg => !agg.type.hasNoDsl).length;
    const timeSplitIndex = this.getAll().findIndex(config => 'splitForTimeShift' in config.type && config.type.splitForTimeShift(config, this));
    if (this.isSamplingEnabled()) {
      var _this$opts$probabilit2;
      dslTopLvl.sampling = (0, _sampler.createSamplerAgg)({
        probability: (_this$opts$probabilit2 = this.opts.probability) !== null && _this$opts$probabilit2 !== void 0 ? _this$opts$probabilit2 : 1,
        seed: this.opts.samplerSeed
      });
    }
    requestAggs.forEach((config, i, list) => {
      if (!dslLvlCursor) {
        // start at the top level
        dslLvlCursor = dslTopLvl;
        // when sampling jump directly to the aggs
        if (this.isSamplingEnabled()) {
          dslLvlCursor = dslLvlCursor.sampling.aggs;
        }
      } else {
        const prevConfig = list[i - 1];
        const prevDsl = dslLvlCursor[prevConfig.id];

        // advance the cursor and nest under the previous agg, or
        // put it on the same level if the previous agg doesn't accept
        // sub aggs
        dslLvlCursor = (prevDsl === null || prevDsl === void 0 ? void 0 : prevDsl.aggs) || dslLvlCursor;
      }
      if (hasMultipleTimeShifts) {
        dslLvlCursor = (0, _time_splits.insertTimeShiftSplit)(this, config, timeShifts, dslLvlCursor, this.timeZone);
      }
      if (config.type.hasNoDsl) {
        return;
      }
      const dsl = config.type.hasNoDslParams ? config.toDsl(this) : dslLvlCursor[config.id] = config.toDsl(this);
      let subAggs;
      parseParentAggs(dslLvlCursor, dsl);
      if (config.type.type === _agg_groups.AggGroupNames.Buckets && (i < aggsWithDsl - 1 || timeSplitIndex > i)) {
        // buckets that are not the last item in the list of dsl producing aggs or have a time split coming up accept sub-aggs
        subAggs = dsl.aggs || (dsl.aggs = {});
      }
      if (subAggs) {
        _lodash.default.each(subAggs, agg => {
          parseParentAggs(subAggs, agg);
        });
      }
      if (subAggs && nestedMetrics) {
        nestedMetrics.forEach(agg => {
          subAggs[agg.config.id] = agg.dsl;
          // if a nested metric agg has parent aggs, we have to add them to every level of the tree
          // to make sure "bucket_path" references in the nested metric agg itself are still working
          if (agg.dsl.parentAggs) {
            Object.entries(agg.dsl.parentAggs).forEach(([parentAggId, parentAgg]) => {
              subAggs[parentAggId] = parentAgg;
            });
          }
        });
      }
    });
    removeParentAggs(dslTopLvl);
    return dslTopLvl;
  }
  getAll() {
    return [...this.aggs];
  }
  byIndex(index) {
    return this.aggs[index];
  }
  byId(id) {
    return this.aggs.find(agg => agg.id === id);
  }
  byName(name) {
    return this.aggs.filter(agg => {
      var _agg$type;
      return ((_agg$type = agg.type) === null || _agg$type === void 0 ? void 0 : _agg$type.name) === name;
    });
  }
  byType(type) {
    return this.aggs.filter(agg => {
      var _agg$type2;
      return ((_agg$type2 = agg.type) === null || _agg$type2 === void 0 ? void 0 : _agg$type2.type) === type;
    });
  }
  byTypeName(type) {
    return this.byName(type);
  }
  bySchemaName(schema) {
    return this.aggs.filter(agg => agg.schema === schema);
  }
  getRequestAggs() {
    // collect all the aggregations
    const aggregations = this.aggs.filter(agg => agg.enabled && agg.type).reduce((requestValuesAggs, agg) => {
      const aggs = agg.getRequestAggs();
      return aggs ? requestValuesAggs.concat(aggs) : requestValuesAggs;
    }, []);
    // move metrics to the end
    return _lodash.default.sortBy(aggregations, agg => agg.type.type === _agg_groups.AggGroupNames.Metrics ? 1 : 0);
  }
  getTimeShifts() {
    const timeShifts = {};
    this.getAll().filter(agg => agg.schema === 'metric').map(agg => agg.getTimeShift()).forEach(timeShift => {
      if (timeShift) {
        timeShifts[String(timeShift.asMilliseconds())] = timeShift;
      } else {
        timeShifts[0] = _momentTimezone.default.duration(0);
      }
    });
    return timeShifts;
  }
  getTimeShiftInterval() {
    const splitAgg = this.getAll().filter(agg => agg.type.type === _agg_groups.AggGroupNames.Buckets).find(agg => agg.type.splitForTimeShift(agg, this));
    return splitAgg === null || splitAgg === void 0 ? void 0 : splitAgg.type.getTimeShiftInterval(splitAgg);
  }
  hasTimeShifts() {
    return this.getAll().some(agg => agg.hasTimeShift());
  }
  getSearchSourceTimeFilter(forceNow) {
    var _this$indexPattern;
    if (!this.timeFields || !this.timeRange) {
      return [];
    }
    const timeRange = this.timeRange;
    const timeFields = this.timeFields;
    const timeShifts = this.getTimeShifts();
    if (!this.hasTimeShifts()) {
      return this.timeFields.map(fieldName => (0, _2.getTime)(this.indexPattern, timeRange, {
        fieldName,
        forceNow
      })).filter(_esQuery.isRangeFilter);
    }
    return [{
      meta: {
        index: (_this$indexPattern = this.indexPattern) === null || _this$indexPattern === void 0 ? void 0 : _this$indexPattern.id,
        params: {},
        alias: '',
        disabled: false,
        negate: false
      },
      query: {
        bool: {
          should: Object.entries(timeShifts).map(([, shift]) => {
            return {
              bool: {
                filter: timeFields.map(fieldName => [(0, _2.getTime)(this.indexPattern, timeRange, {
                  fieldName,
                  forceNow
                }), fieldName]).filter(([filter]) => (0, _esQuery.isRangeFilter)(filter)).map(([filter, field]) => ({
                  range: {
                    [field]: {
                      format: 'strict_date_optional_time',
                      gte: _momentTimezone.default.tz(filter === null || filter === void 0 ? void 0 : filter.query.range[field].gte, this.timeZone).subtract(shift).toISOString(),
                      lte: _momentTimezone.default.tz(filter === null || filter === void 0 ? void 0 : filter.query.range[field].lte, this.timeZone).subtract(shift).toISOString()
                    }
                  }
                }))
              }
            };
          }),
          minimum_should_match: 1
        }
      }
    }];
  }
  postFlightTransform(response) {
    if (!this.hasTimeShifts()) {
      return response;
    }
    const transformedRawResponse = (0, _lodash.cloneDeep)(response.rawResponse);
    if (!transformedRawResponse.aggregations) {
      var _response$rawResponse;
      transformedRawResponse.aggregations = {
        doc_count: (_response$rawResponse = response.rawResponse.hits) === null || _response$rawResponse === void 0 ? void 0 : _response$rawResponse.total
      };
    }
    const aggCursor = this.isSamplingEnabled() ? transformedRawResponse.aggregations.sampling : transformedRawResponse.aggregations;
    (0, _time_splits.mergeTimeShifts)(this, aggCursor);
    return {
      ...response,
      rawResponse: transformedRawResponse
    };
  }
  getRequestAggById(id) {
    return this.aggs.find(agg => agg.id === id);
  }

  /**
   * Gets the AggConfigs (and possibly ResponseAggConfigs) that
   * represent the values that will be produced when all aggs
   * are run.
   *
   * With multi-value metric aggs it is possible for a single agg
   * request to result in multiple agg values, which is why the length
   * of a vis' responseValuesAggs may be different than the vis' aggs
   *
   * @return {array[AggConfig]}
   */
  getResponseAggs() {
    return this.getRequestAggs().reduce(function (responseValuesAggs, agg) {
      const aggs = agg.getResponseAggs();
      return aggs ? responseValuesAggs.concat(aggs) : responseValuesAggs;
    }, []);
  }

  /**
   * Find a response agg by it's id. This may be an agg in the aggConfigs, or one
   * created specifically for a response value
   *
   * @param  {string} id - the id of the agg to find
   * @return {AggConfig}
   */
  getResponseAggById(id) {
    id = String(id);
    const reqAgg = _lodash.default.find(this.getRequestAggs(), function (agg) {
      const aggId = String(agg.id);
      // only multi-value aggs like percentiles are allowed to contain dots and [
      const isMultiValueId = id.includes('[') || id.includes('.');
      if (!isMultiValueId) {
        return id === aggId;
      }
      const baseId = id.substring(0, id.indexOf('[') !== -1 ? id.indexOf('[') : id.indexOf('.'));
      return baseId === aggId;
    });
    if (!reqAgg) return;
    return _lodash.default.find(reqAgg.getResponseAggs(), {
      id
    });
  }
  onSearchRequestStart(searchSource, options) {
    return Promise.all(
    // @ts-ignore
    this.getRequestAggs().map(agg => agg.onSearchRequestStart(searchSource, options)));
  }

  /**
   * Generates an expression abstract syntax tree using the `esaggs` expression function.
   * @returns The expression AST.
   */
  toExpressionAst() {
    return (0, _common.buildExpression)([(0, _common.buildExpressionFunction)('esaggs', {
      index: (0, _common.buildExpression)([(0, _common.buildExpressionFunction)('indexPatternLoad', {
        id: this.indexPattern.id
      })]),
      metricsAtAllLevels: this.hierarchical,
      partialRows: this.partialRows,
      aggs: this.aggs.map(agg => (0, _common.buildExpression)(agg.toExpressionAst())),
      probability: this.opts.probability,
      samplerSeed: this.opts.samplerSeed
    })]).toAst();
  }
}
exports.AggConfigs = AggConfigs;