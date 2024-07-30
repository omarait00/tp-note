"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApmUsers = createApmUsers;
var _std = require("@kbn/std");
var _call_kibana = require("./helpers/call_kibana");
var _create_or_update_user = require("./helpers/create_or_update_user");
var _authentication = require("./authentication");
var _create_custom_role = require("./helpers/create_custom_role");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function createApmUsers({
  kibana,
  elasticsearch
}) {
  const isCredentialsValid = await getIsCredentialsValid({
    elasticsearch,
    kibana
  });
  if (!isCredentialsValid) {
    throw new _call_kibana.AbortError('Invalid username/password');
  }
  const isSecurityEnabled = await getIsSecurityEnabled({
    elasticsearch,
    kibana
  });
  if (!isSecurityEnabled) {
    throw new _call_kibana.AbortError('Security must be enabled!');
  }
  const apmUsers = Object.values(_authentication.ApmUsername);
  await (0, _std.asyncForEach)(apmUsers, async username => {
    const user = _authentication.users[username];
    const {
      builtInRoleNames = [],
      customRoleNames = []
    } = user;

    // create custom roles
    await Promise.all(customRoleNames.map(async roleName => (0, _create_custom_role.createCustomRole)({
      elasticsearch,
      kibana,
      roleName
    })));

    // create user
    const roles = builtInRoleNames.concat(customRoleNames);
    await (0, _create_or_update_user.createOrUpdateUser)({
      elasticsearch,
      kibana,
      user: {
        username,
        roles
      }
    });
  });
  return apmUsers;
}
async function getIsSecurityEnabled({
  elasticsearch,
  kibana
}) {
  try {
    await (0, _call_kibana.callKibana)({
      elasticsearch,
      kibana,
      options: {
        url: `/internal/security/me`
      }
    });
    return true;
  } catch (err) {
    return false;
  }
}
async function getIsCredentialsValid({
  elasticsearch,
  kibana
}) {
  try {
    await (0, _call_kibana.callKibana)({
      elasticsearch,
      kibana,
      options: {
        validateStatus: status => status >= 200 && status < 400,
        url: `/`
      }
    });
    return true;
  } catch (err) {
    return false;
  }
}