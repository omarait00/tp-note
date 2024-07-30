"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addConnector = void 0;
var _ = require("../..");
var _connectors = require("../../../common/types/connectors");
var _error_codes = require("../../../common/types/error_codes");
var _setup_indices = require("../../index_management/setup_indices");
var _fetch_crawlers = require("../crawler/fetch_crawlers");
var _create_index = require("../indices/create_index");
var _delete_connector = require("./delete_connector");
var _fetch_connectors = require("./fetch_connectors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createConnector = async (document, client, language, deleteExisting) => {
  const index = document.index_name;
  const indexExists = await client.asCurrentUser.indices.exists({
    index
  });
  if (indexExists) {
    {
      throw new Error(_error_codes.ErrorCode.INDEX_ALREADY_EXISTS);
    }
  }
  const connector = await (0, _fetch_connectors.fetchConnectorByIndexName)(client, index);
  if (connector) {
    if (deleteExisting) {
      await (0, _delete_connector.deleteConnectorById)(client, connector.id);
    } else {
      throw new Error(_error_codes.ErrorCode.CONNECTOR_DOCUMENT_ALREADY_EXISTS);
    }
  }
  const crawler = await (0, _fetch_crawlers.fetchCrawlerByIndexName)(client, index);
  if (crawler) {
    throw new Error(_error_codes.ErrorCode.CRAWLER_ALREADY_EXISTS);
  }
  const result = await client.asCurrentUser.index({
    document,
    index: _.CONNECTORS_INDEX
  });
  await (0, _create_index.createIndex)(client, document.index_name, language, false);
  await client.asCurrentUser.indices.refresh({
    index: _.CONNECTORS_INDEX
  });
  return {
    id: result._id,
    index_name: document.index_name
  };
};
const addConnector = async (client, input) => {
  var _connectorsIndicesMap, _connectorsIndicesMap2, _connectorsIndicesMap3;
  const connectorsIndexExists = await client.asCurrentUser.indices.exists({
    index: _.CONNECTORS_INDEX
  });
  if (!connectorsIndexExists) {
    await (0, _setup_indices.setupConnectorsIndices)(client.asCurrentUser);
  }
  const connectorsIndicesMapping = await client.asCurrentUser.indices.getMapping({
    index: _.CONNECTORS_INDEX
  });
  const connectorsPipelineMeta = (_connectorsIndicesMap = connectorsIndicesMapping[`${_.CONNECTORS_INDEX}-v${_.CONNECTORS_VERSION}`]) === null || _connectorsIndicesMap === void 0 ? void 0 : (_connectorsIndicesMap2 = _connectorsIndicesMap.mappings) === null || _connectorsIndicesMap2 === void 0 ? void 0 : (_connectorsIndicesMap3 = _connectorsIndicesMap2._meta) === null || _connectorsIndicesMap3 === void 0 ? void 0 : _connectorsIndicesMap3.pipeline;
  const currentTimestamp = new Date().toISOString();
  const document = {
    api_key_id: null,
    configuration: {},
    description: null,
    error: null,
    features: null,
    filtering: [{
      active: {
        advanced_snippet: {
          created_at: currentTimestamp,
          updated_at: currentTimestamp,
          value: {}
        },
        rules: [{
          created_at: currentTimestamp,
          field: '_',
          id: 'DEFAULT',
          order: 0,
          policy: _connectors.FilteringPolicy.INCLUDE,
          rule: _connectors.FilteringRuleRule.REGEX,
          updated_at: currentTimestamp,
          value: '.*'
        }],
        validation: {
          errors: [],
          state: _connectors.FilteringValidationState.VALID
        }
      },
      domain: 'DEFAULT',
      draft: {
        advanced_snippet: {
          created_at: currentTimestamp,
          updated_at: currentTimestamp,
          value: {}
        },
        rules: [{
          created_at: currentTimestamp,
          field: '_',
          id: 'DEFAULT',
          order: 0,
          policy: _connectors.FilteringPolicy.INCLUDE,
          rule: _connectors.FilteringRuleRule.REGEX,
          updated_at: currentTimestamp,
          value: '.*'
        }],
        validation: {
          errors: [],
          state: _connectors.FilteringValidationState.VALID
        }
      }
    }],
    index_name: input.index_name,
    is_native: input.is_native,
    language: input.language,
    last_seen: null,
    last_sync_error: null,
    last_sync_status: null,
    last_synced: null,
    name: input.index_name.startsWith('search-') ? input.index_name.substring(7) : input.index_name,
    pipeline: connectorsPipelineMeta ? {
      extract_binary_content: connectorsPipelineMeta.default_extract_binary_content,
      name: connectorsPipelineMeta.default_name,
      reduce_whitespace: connectorsPipelineMeta.default_reduce_whitespace,
      run_ml_inference: connectorsPipelineMeta.default_run_ml_inference
    } : null,
    scheduling: {
      enabled: false,
      interval: '0 0 0 * * ?'
    },
    service_type: input.service_type || null,
    status: _connectors.ConnectorStatus.CREATED,
    sync_now: false
  };
  return await createConnector(document, client, input.language, !!input.delete_existing_connector);
};
exports.addConnector = addConnector;