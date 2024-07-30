"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultResourceInstaller = void 0;
var _constants = require("../../assets/constants");
var _slo_mappings_template = require("../../assets/component_templates/slo_mappings_template");
var _slo_settings_template = require("../../assets/component_templates/slo_settings_template");
var _slo_index_templates = require("../../assets/index_templates/slo_index_templates");
var _slo_pipeline_template = require("../../assets/ingest_templates/slo_pipeline_template");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class DefaultResourceInstaller {
  constructor(esClient, logger) {
    this.esClient = esClient;
    this.logger = logger;
  }
  async ensureCommonResourcesInstalled() {
    const alreadyInstalled = await this.areResourcesAlreadyInstalled();
    if (alreadyInstalled) {
      this.logger.debug(`Skipping installation of resources shared for SLO since they already exist`);
      return;
    }
    try {
      await Promise.all([this.createOrUpdateComponentTemplate((0, _slo_mappings_template.getSLOMappingsTemplate)(_constants.SLO_COMPONENT_TEMPLATE_MAPPINGS_NAME)), this.createOrUpdateComponentTemplate((0, _slo_settings_template.getSLOSettingsTemplate)(_constants.SLO_COMPONENT_TEMPLATE_SETTINGS_NAME))]);
      await this.createOrUpdateIndexTemplate((0, _slo_index_templates.getSLOIndexTemplate)(_constants.SLO_INDEX_TEMPLATE_NAME, `${_constants.SLO_INDEX_TEMPLATE_NAME}-*`, [_constants.SLO_COMPONENT_TEMPLATE_MAPPINGS_NAME, _constants.SLO_COMPONENT_TEMPLATE_SETTINGS_NAME]));
      await this.createOrUpdateIngestPipelineTemplate((0, _slo_pipeline_template.getSLOPipelineTemplate)(_constants.SLO_INGEST_PIPELINE_NAME, this.getPipelinePrefix(_constants.SLO_RESOURCES_VERSION)));
    } catch (err) {
      this.logger.error(`Error installing resources shared for SLO - ${err.message}`);
      throw err;
    }
  }
  getPipelinePrefix(version) {
    // Following https://www.elastic.co/blog/an-introduction-to-the-elastic-data-stream-naming-scheme
    // slo-observability.sli-<version>.<index-date>
    return `${_constants.SLO_INDEX_TEMPLATE_NAME}-v${version}.`;
  }
  async areResourcesAlreadyInstalled() {
    const indexTemplateExists = await this.esClient.indices.existsIndexTemplate({
      name: _constants.SLO_INDEX_TEMPLATE_NAME
    });
    let ingestPipelineExists = false;
    try {
      const pipeline = await this.esClient.ingest.getPipeline({
        id: _constants.SLO_INGEST_PIPELINE_NAME
      });
      ingestPipelineExists =
      // @ts-ignore _meta is not defined on the type
      pipeline && pipeline[_constants.SLO_INGEST_PIPELINE_NAME]._meta.version === _constants.SLO_RESOURCES_VERSION;
    } catch (err) {
      return false;
    }
    return indexTemplateExists && ingestPipelineExists;
  }
  async createOrUpdateComponentTemplate(template) {
    this.logger.debug(`Installing SLO component template ${template.name}`);
    return this.esClient.cluster.putComponentTemplate(template);
  }
  async createOrUpdateIndexTemplate(template) {
    this.logger.debug(`Installing SLO index template ${template.name}`);
    return this.esClient.indices.putIndexTemplate(template);
  }
  async createOrUpdateIngestPipelineTemplate(template) {
    this.logger.debug(`Installing SLO ingest pipeline template ${template.id}`);
    await this.esClient.ingest.putPipeline(template);
  }
}
exports.DefaultResourceInstaller = DefaultResourceInstaller;