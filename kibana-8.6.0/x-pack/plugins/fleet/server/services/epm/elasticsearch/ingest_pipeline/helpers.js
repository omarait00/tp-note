"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCustomPipelineProcessor = addCustomPipelineProcessor;
exports.isTopLevelPipeline = exports.getPipelineNameForInstallation = void 0;
exports.rewriteIngestPipeline = rewriteIngestPipeline;
var _jsYaml = require("js-yaml");
var _types = require("../../../../types");
var _archive = require("../../archive");
var _services = require("../../../../../common/services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isTopLevelPipeline = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return pathParts.type === _types.ElasticsearchAssetType.ingestPipeline && pathParts.dataset === undefined;
};
exports.isTopLevelPipeline = isTopLevelPipeline;
const getPipelineNameForInstallation = ({
  pipelineName,
  dataStream,
  packageVersion
}) => {
  if (dataStream !== undefined) {
    const isPipelineEntry = pipelineName === dataStream.ingest_pipeline;
    const suffix = isPipelineEntry ? '' : `-${pipelineName}`;
    // if this is the pipeline entry, don't add a suffix
    return `${(0, _services.getPipelineNameForDatastream)({
      dataStream,
      packageVersion
    })}${suffix}`;
  }
  // It's a top-level pipeline
  return `${packageVersion}-${pipelineName}`;
};
exports.getPipelineNameForInstallation = getPipelineNameForInstallation;
function rewriteIngestPipeline(pipeline, substitutions) {
  substitutions.forEach(sub => {
    const {
      source,
      target,
      templateFunction
    } = sub;
    // This fakes the use of the golang text/template expression {{SomeTemplateFunction 'some-param'}}
    // cf. https://github.com/elastic/beats/blob/master/filebeat/fileset/fileset.go#L294

    // "Standard style" uses '{{' and '}}' as delimiters
    const matchStandardStyle = `{{\\s?${templateFunction}\\s+['"]${source}['"]\\s?}}`;
    // "Beats style" uses '{<' and '>}' as delimiters because this is current practice in the beats project
    const matchBeatsStyle = `{<\\s?${templateFunction}\\s+['"]${source}['"]\\s?>}`;
    const regexStandardStyle = new RegExp(matchStandardStyle);
    const regexBeatsStyle = new RegExp(matchBeatsStyle);
    pipeline = pipeline.replace(regexStandardStyle, target).replace(regexBeatsStyle, target);
  });
  return pipeline;
}
function mutatePipelineContentWithNewProcessor(jsonPipelineContent, processor) {
  if (!jsonPipelineContent.processors) {
    jsonPipelineContent.processors = [];
  }
  jsonPipelineContent.processors.push(processor);
}
function addCustomPipelineProcessor(pipeline) {
  if (!pipeline.customIngestPipelineNameForInstallation) {
    return pipeline;
  }
  const customPipelineProcessor = {
    pipeline: {
      name: pipeline.customIngestPipelineNameForInstallation,
      ignore_missing_pipeline: true
    }
  };
  if (pipeline.extension === 'yml') {
    const parsedPipelineContent = (0, _jsYaml.safeLoad)(pipeline.contentForInstallation);
    mutatePipelineContentWithNewProcessor(parsedPipelineContent, customPipelineProcessor);
    return {
      ...pipeline,
      contentForInstallation: `---\n${(0, _jsYaml.safeDump)(parsedPipelineContent)}`
    };
  }
  const parsedPipelineContent = JSON.parse(pipeline.contentForInstallation);
  mutatePipelineContentWithNewProcessor(parsedPipelineContent, customPipelineProcessor);
  return {
    ...pipeline,
    contentForInstallation: JSON.stringify(parsedPipelineContent)
  };
}