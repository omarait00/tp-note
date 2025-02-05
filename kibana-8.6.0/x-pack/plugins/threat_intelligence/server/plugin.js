"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreatIntelligencePlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _constants = require("../common/constants");
var _search_strategy = require("./search_strategy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class ThreatIntelligencePlugin {
  constructor(context) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = context.logger.get();
  }
  setup(core, plugins) {
    this.logger.debug('setup');
    core.getStartServices().then(([_, {
      data: dataStartService
    }]) => {
      const threatIntelligenceSearchStrategy = (0, _search_strategy.threatIntelligenceSearchStrategyProvider)(dataStartService);
      plugins.data.search.registerSearchStrategy(_constants.THREAT_INTELLIGENCE_SEARCH_STRATEGY_NAME, threatIntelligenceSearchStrategy);
      this.logger.debug(`search strategy "${_constants.THREAT_INTELLIGENCE_SEARCH_STRATEGY_NAME}" registered`);
    });
    return {};
  }
  start() {
    this.logger.debug('start');
    return {};
  }
  stop() {
    this.logger.debug('stop');
  }
}
exports.ThreatIntelligencePlugin = ThreatIntelligencePlugin;