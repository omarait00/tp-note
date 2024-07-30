"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSLOTransformId = exports.SLO_RESOURCES_VERSION = exports.SLO_INGEST_PIPELINE_NAME = exports.SLO_INDEX_TEMPLATE_NAME = exports.SLO_DESTINATION_INDEX_NAME = exports.SLO_COMPONENT_TEMPLATE_SETTINGS_NAME = exports.SLO_COMPONENT_TEMPLATE_MAPPINGS_NAME = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SLO_COMPONENT_TEMPLATE_MAPPINGS_NAME = 'slo-observability.sli-mappings';
exports.SLO_COMPONENT_TEMPLATE_MAPPINGS_NAME = SLO_COMPONENT_TEMPLATE_MAPPINGS_NAME;
const SLO_COMPONENT_TEMPLATE_SETTINGS_NAME = 'slo-observability.sli-settings';
exports.SLO_COMPONENT_TEMPLATE_SETTINGS_NAME = SLO_COMPONENT_TEMPLATE_SETTINGS_NAME;
const SLO_INDEX_TEMPLATE_NAME = 'slo-observability.sli';
exports.SLO_INDEX_TEMPLATE_NAME = SLO_INDEX_TEMPLATE_NAME;
const SLO_RESOURCES_VERSION = 1;
exports.SLO_RESOURCES_VERSION = SLO_RESOURCES_VERSION;
const SLO_INGEST_PIPELINE_NAME = `${SLO_INDEX_TEMPLATE_NAME}.monthly`;
exports.SLO_INGEST_PIPELINE_NAME = SLO_INGEST_PIPELINE_NAME;
const SLO_DESTINATION_INDEX_NAME = `${SLO_INDEX_TEMPLATE_NAME}-v${SLO_RESOURCES_VERSION}`;
exports.SLO_DESTINATION_INDEX_NAME = SLO_DESTINATION_INDEX_NAME;
const getSLOTransformId = (sloId, sloRevision) => `slo-${sloId}-${sloRevision}`;
exports.getSLOTransformId = getSLOTransformId;