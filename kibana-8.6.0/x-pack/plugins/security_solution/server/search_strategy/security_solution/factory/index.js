"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.securitySolutionFactory = void 0;
var _hosts = require("./hosts");
var _matrix_histogram = require("./matrix_histogram");
var _network = require("./network");
var _cti = require("./cti");
var _risk_score = require("./risk_score");
var _users = require("./users");
var _last_first_seen = require("./last_first_seen");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const securitySolutionFactory = {
  ..._hosts.hostsFactory,
  ..._users.usersFactory,
  ..._matrix_histogram.matrixHistogramFactory,
  ..._network.networkFactory,
  ..._cti.ctiFactoryTypes,
  ..._risk_score.riskScoreFactory,
  ..._last_first_seen.firstLastSeenFactory
};
exports.securitySolutionFactory = securitySolutionFactory;