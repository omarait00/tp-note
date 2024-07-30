"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usersFactory = void 0;
var _users = require("../../../../../common/search_strategy/security_solution/users");
var _all = require("./all");
var _authentications = require("./authentications");
var _details = require("./details");
var _authentications2 = require("./kpi/authentications");
var _total_users = require("./kpi/total_users");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const usersFactory = {
  [_users.UsersQueries.details]: _details.userDetails,
  [_users.UsersQueries.kpiTotalUsers]: _total_users.totalUsersKpi,
  [_users.UsersQueries.users]: _all.allUsers,
  [_users.UsersQueries.authentications]: _authentications.authentications,
  [_users.UsersQueries.kpiAuthentications]: _authentications2.usersKpiAuthentications
};
exports.usersFactory = usersFactory;