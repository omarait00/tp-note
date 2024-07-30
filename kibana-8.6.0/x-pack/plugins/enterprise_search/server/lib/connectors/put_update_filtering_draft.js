"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateFilteringDraft = void 0;
var _ = require("../..");
var _connectors = require("../../../common/types/connectors");
var _fetch_connectors = require("./fetch_connectors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const updateFilteringDraft = async (client, connectorId, {
  advancedSnippet,
  filteringRules
}) => {
  const now = new Date().toISOString();
  const parsedAdvancedSnippet = advancedSnippet ? JSON.parse(advancedSnippet) : {};
  const parsedFilteringRules = filteringRules.map(filteringRule => ({
    ...filteringRule,
    created_at: filteringRule.created_at ? filteringRule.created_at : now,
    updated_at: now
  }));
  const draft = {
    advanced_snippet: {
      created_at: now,
      updated_at: now,
      value: parsedAdvancedSnippet
    },
    rules: parsedFilteringRules,
    validation: {
      errors: [],
      state: _connectors.FilteringValidationState.EDITED
    }
  };
  const connectorResult = await (0, _fetch_connectors.fetchConnectorById)(client, connectorId);
  if (!connectorResult) {
    throw new Error(`Could not find connector with id ${connectorId}`);
  }
  const {
    value: connector,
    seqNo,
    primaryTerm
  } = connectorResult;
  const result = await client.asCurrentUser.update({
    doc: {
      ...connector,
      filtering: [{
        ...connector.filtering[0],
        draft
      }]
    },
    id: connectorId,
    if_primary_term: primaryTerm,
    if_seq_no: seqNo,
    index: _.CONNECTORS_INDEX,
    refresh: true
  });
  return result.result === 'updated' ? draft : undefined;
};
exports.updateFilteringDraft = updateFilteringDraft;