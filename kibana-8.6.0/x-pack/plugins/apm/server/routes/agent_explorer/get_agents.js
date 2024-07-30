"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgents = getAgents;
var _get_agents_items = require("./get_agents_items");
var _get_agent_url_repository = require("./get_agent_url_repository");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getAgents({
  environment,
  serviceName,
  agentLanguage,
  kuery,
  apmEventClient,
  start,
  end,
  randomSampler
}) {
  const items = await (0, _get_agents_items.getAgentsItems)({
    environment,
    serviceName,
    agentLanguage,
    kuery,
    apmEventClient,
    start,
    end,
    randomSampler
  });
  return {
    items: items.map(item => ({
      ...item,
      agentDocsPageUrl: (0, _get_agent_url_repository.getAgentDocsPageUrl)(item.agentName)
    }))
  };
}