"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeCspIndices = void 0;
var _elasticsearch = require("@elastic/elasticsearch");
var _constants = require("../../common/constants");
var _create_processor = require("./create_processor");
var _benchmark_score_mapping = require("./benchmark_score_mapping");
var _ingest_pipelines = require("./ingest_pipelines");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// TODO: Add integration tests

const initializeCspIndices = async (esClient, logger) => {
  await Promise.all([(0, _create_processor.createPipelineIfNotExists)(esClient, _ingest_pipelines.scorePipelineIngestConfig, logger), (0, _create_processor.createPipelineIfNotExists)(esClient, _ingest_pipelines.latestFindingsPipelineIngestConfig, logger)]);
  return Promise.all([createLatestFindingsIndex(esClient, logger), createBenchmarkScoreIndex(esClient, logger)]);
};
exports.initializeCspIndices = initializeCspIndices;
const createBenchmarkScoreIndex = async (esClient, logger) => {
  try {
    // Deletes old assets from previous versions as part of upgrade process
    const INDEX_TEMPLATE_V830 = 'cloud_security_posture.scores';
    await deleteIndexTemplateSafe(esClient, logger, INDEX_TEMPLATE_V830);

    // We always want to keep the index template updated
    await esClient.indices.putIndexTemplate({
      name: _constants.BENCHMARK_SCORE_INDEX_TEMPLATE_NAME,
      index_patterns: _constants.BENCHMARK_SCORE_INDEX_PATTERN,
      template: {
        mappings: _benchmark_score_mapping.benchmarkScoreMapping,
        settings: {
          default_pipeline: _ingest_pipelines.scorePipelineIngestConfig.id,
          // TODO: once we will convert the score index to datastream we will no longer override the ilm to be empty
          lifecycle: {
            name: ''
          }
        }
      },
      _meta: {
        package: {
          name: _constants.CLOUD_SECURITY_POSTURE_PACKAGE_NAME
        },
        managed_by: 'cloud_security_posture',
        managed: true
      },
      priority: 500
    });
    await createIndexSafe(esClient, logger, _constants.BENCHMARK_SCORE_INDEX_DEFAULT_NS);
  } catch (e) {
    logger.error(`Failed to upsert index template [Template: ${_constants.BENCHMARK_SCORE_INDEX_TEMPLATE_NAME}]`);
    logger.error(e);
  }
};
const createLatestFindingsIndex = async (esClient, logger) => {
  try {
    // Deletes old assets from previous versions as part of upgrade process
    const INDEX_TEMPLATE_V830 = 'cloud_security_posture.findings_latest';
    await deleteIndexTemplateSafe(esClient, logger, INDEX_TEMPLATE_V830);

    // We want that our latest findings index template would be identical to the findings index template
    const findingsIndexTemplateResponse = await esClient.indices.getIndexTemplate({
      name: _constants.FINDINGS_INDEX_NAME
    });
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      template,
      composed_of,
      _meta
    } = findingsIndexTemplateResponse.index_templates[0].index_template;

    // We always want to keep the index template updated
    await esClient.indices.putIndexTemplate({
      name: _constants.LATEST_FINDINGS_INDEX_TEMPLATE_NAME,
      index_patterns: _constants.LATEST_FINDINGS_INDEX_PATTERN,
      priority: 500,
      template: {
        mappings: template === null || template === void 0 ? void 0 : template.mappings,
        settings: {
          ...(template === null || template === void 0 ? void 0 : template.settings),
          default_pipeline: _ingest_pipelines.latestFindingsPipelineIngestConfig.id,
          lifecycle: {
            name: ''
          }
        },
        aliases: template === null || template === void 0 ? void 0 : template.aliases
      },
      _meta,
      composed_of
    });
    await createIndexSafe(esClient, logger, _constants.LATEST_FINDINGS_INDEX_DEFAULT_NS);
  } catch (e) {
    logger.error(`Failed to upsert index template [Template: ${_constants.LATEST_FINDINGS_INDEX_TEMPLATE_NAME}]`);
    logger.error(e);
  }
};
const deleteIndexTemplateSafe = async (esClient, logger, name) => {
  try {
    const resp = await esClient.indices.getIndexTemplate({
      name
    });
    if (resp.index_templates) {
      await esClient.indices.deleteIndexTemplate({
        name
      });
      logger.info(`Deleted index template successfully [Name: ${name}]`);
    }
  } catch (e) {
    if (e instanceof _elasticsearch.errors.ResponseError && e.statusCode === 404) {
      logger.trace(`Index template no longer exists [Name: ${name}]`);
    } else {
      logger.error(`Failed to delete index template [Name: ${name}]`);
      logger.error(e);
    }
  }
};
const createIndexSafe = async (esClient, logger, index) => {
  try {
    const isLatestIndexExists = await esClient.indices.exists({
      index
    });
    if (!isLatestIndexExists) {
      await esClient.indices.create({
        index
      });
      logger.info(`Created index successfully [Name: ${index}]`);
    } else {
      logger.trace(`Index already exists [Name: ${index}]`);
    }
  } catch (e) {
    logger.error(`Failed to create index [Name: ${index}]`);
    logger.error(e);
  }
};