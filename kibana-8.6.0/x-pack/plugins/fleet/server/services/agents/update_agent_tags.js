"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAgentTags = updateAgentTags;
var _errors = require("../../errors");
var _crud = require("./crud");
var _helpers = require("./helpers");
var _update_agent_tags_action_runner = require("./update_agent_tags_action_runner");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isMgetDoc(doc) {
  return Boolean(doc && 'found' in doc);
}
async function updateAgentTags(soClient, esClient, options, tagsToAdd, tagsToRemove) {
  const outgoingErrors = {};
  const givenAgents = [];
  if ('agentIds' in options) {
    const givenAgentsResults = await (0, _crud.getAgentDocuments)(esClient, options.agentIds);
    for (const agentResult of givenAgentsResults) {
      if (isMgetDoc(agentResult) && agentResult.found === false) {
        outgoingErrors[agentResult._id] = new _errors.AgentReassignmentError(`Cannot find agent ${agentResult._id}`);
      } else {
        givenAgents.push((0, _helpers.searchHitToAgent)(agentResult));
      }
    }
  } else if ('kuery' in options) {
    return await new _update_agent_tags_action_runner.UpdateAgentTagsActionRunner(esClient, soClient, {
      ...options,
      kuery: options.kuery,
      tagsToAdd,
      tagsToRemove
    }, {
      pitId: ''
    }).runActionAsyncWithRetry();
  }
  return await (0, _update_agent_tags_action_runner.updateTagsBatch)(soClient, esClient, givenAgents, outgoingErrors, {
    tagsToAdd,
    tagsToRemove
  });
}