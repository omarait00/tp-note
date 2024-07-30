"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchConnectors = exports.fetchConnectorByIndexName = exports.fetchConnectorById = void 0;
var _ = require("../..");
var _setup_indices = require("../../index_management/setup_indices");
var _identify_exceptions = require("../../utils/identify_exceptions");
var _fetch_all = require("../fetch_all");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchConnectorById = async (client, connectorId) => {
  try {
    const connectorResult = await client.asCurrentUser.get({
      id: connectorId,
      index: _.CONNECTORS_INDEX
    });
    return connectorResult._source ? {
      primaryTerm: connectorResult._primary_term,
      seqNo: connectorResult._seq_no,
      value: {
        ...connectorResult._source,
        id: connectorResult._id
      }
    } : undefined;
  } catch (error) {
    if ((0, _identify_exceptions.isIndexNotFoundException)(error)) {
      await (0, _setup_indices.setupConnectorsIndices)(client.asCurrentUser);
    }
    return undefined;
  }
};
exports.fetchConnectorById = fetchConnectorById;
const fetchConnectorByIndexName = async (client, indexName) => {
  try {
    var _connectorResult$hits;
    const connectorResult = await client.asCurrentUser.search({
      index: _.CONNECTORS_INDEX,
      query: {
        term: {
          index_name: indexName
        }
      }
    });
    const result = (_connectorResult$hits = connectorResult.hits.hits[0]) !== null && _connectorResult$hits !== void 0 && _connectorResult$hits._source ? {
      ...connectorResult.hits.hits[0]._source,
      id: connectorResult.hits.hits[0]._id
    } : undefined;
    return result;
  } catch (error) {
    if ((0, _identify_exceptions.isIndexNotFoundException)(error)) {
      await (0, _setup_indices.setupConnectorsIndices)(client.asCurrentUser);
    }
    return undefined;
  }
};
exports.fetchConnectorByIndexName = fetchConnectorByIndexName;
const fetchConnectors = async (client, indexNames) => {
  const query = indexNames ? {
    terms: {
      index_name: indexNames
    }
  } : {
    match_all: {}
  };
  try {
    return await (0, _fetch_all.fetchAll)(client, _.CONNECTORS_INDEX, query);
  } catch (error) {
    if ((0, _identify_exceptions.isIndexNotFoundException)(error)) {
      await (0, _setup_indices.setupConnectorsIndices)(client.asCurrentUser);
    }
    return [];
  }
};
exports.fetchConnectors = fetchConnectors;