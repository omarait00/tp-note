"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimelinesPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _timeline = require("./search_strategy/timeline");
var _eql = require("./search_strategy/timeline/eql");
var _index_fields = require("./search_strategy/index_fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class TimelinesPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "security", void 0);
    this.logger = initializerContext.logger.get();
  }
  setup(core, plugins) {
    this.logger.debug('timelines: Setup');
    this.security = plugins.security;
    const IndexFields = (0, _index_fields.indexFieldsProvider)(core.getStartServices);
    // Register search strategy
    core.getStartServices().then(([_, depsStart]) => {
      const TimelineSearchStrategy = (0, _timeline.timelineSearchStrategyProvider)(depsStart.data, depsStart.alerting, this.security);
      const TimelineEqlSearchStrategy = (0, _eql.timelineEqlSearchStrategyProvider)(depsStart.data);
      plugins.data.search.registerSearchStrategy('indexFields', IndexFields);
      plugins.data.search.registerSearchStrategy('timelineSearchStrategy', TimelineSearchStrategy);
      plugins.data.search.registerSearchStrategy('timelineEqlSearchStrategy', TimelineEqlSearchStrategy);
    });
    return {};
  }
  start(core) {
    this.logger.debug('timelines: Started');
    return {};
  }
  stop() {}
}
exports.TimelinesPlugin = TimelinesPlugin;