"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformActionParams = transformActionParams;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function transformActionParams({
  actionsPlugin,
  alertId,
  alertType,
  actionId,
  actionTypeId,
  alertName,
  spaceId,
  tags,
  alertInstanceId,
  alertActionGroup,
  alertActionGroupName,
  context,
  actionParams,
  state,
  kibanaBaseUrl,
  alertParams,
  ruleUrl
}) {
  // when the list of variables we pass in here changes,
  // the UI will need to be updated as well; see:
  // x-pack/plugins/triggers_actions_ui/public/application/lib/action_variables.ts
  const variables = {
    alertId,
    alertName,
    spaceId,
    tags,
    alertInstanceId,
    alertActionGroup,
    alertActionGroupName,
    context,
    date: new Date().toISOString(),
    state,
    kibanaBaseUrl,
    params: alertParams,
    rule: {
      id: alertId,
      name: alertName,
      type: alertType,
      spaceId,
      tags,
      url: ruleUrl
    },
    alert: {
      id: alertInstanceId,
      actionGroup: alertActionGroup,
      actionGroupName: alertActionGroupName
    }
  };
  return actionsPlugin.renderActionParameterTemplates(actionTypeId, actionId, actionParams, variables);
}