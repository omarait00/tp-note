"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNormalizedInputs = exports.getNormalizedDataStreams = void 0;
exports.isInputOnlyPolicyTemplate = isInputOnlyPolicyTemplate;
exports.isIntegrationPolicyTemplate = isIntegrationPolicyTemplate;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DATA_STREAM_DATASET_VAR = {
  name: 'data_stream.dataset',
  type: 'text',
  title: 'Dataset name',
  description: "Set the name for your dataset. Changing the dataset will send the data to a different index. You can't use `-` in the name of a dataset and only valid characters for [Elasticsearch index names](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-index_.html).\n",
  multi: false,
  required: true,
  show_user: true
};
function isInputOnlyPolicyTemplate(policyTemplate) {
  return 'input' in policyTemplate;
}
function isIntegrationPolicyTemplate(policyTemplate) {
  return !isInputOnlyPolicyTemplate(policyTemplate);
}
const getNormalizedInputs = policyTemplate => {
  if (isIntegrationPolicyTemplate(policyTemplate)) {
    return policyTemplate.inputs || [];
  }
  const input = {
    type: policyTemplate.input,
    title: policyTemplate.title,
    description: policyTemplate.description
  };
  return [input];
};
exports.getNormalizedInputs = getNormalizedInputs;
const getNormalizedDataStreams = packageInfo => {
  if (packageInfo.type !== 'input') {
    return packageInfo.data_streams || [];
  }
  const policyTemplates = packageInfo.policy_templates;
  if (!policyTemplates || policyTemplates.length === 0) {
    return [];
  }
  return policyTemplates.map(policyTemplate => {
    const dataStream = {
      type: policyTemplate.type,
      dataset: createDefaultDatasetName(packageInfo, policyTemplate),
      title: policyTemplate.title + ' Dataset',
      release: packageInfo.release || 'ga',
      package: packageInfo.name,
      path: packageInfo.name,
      streams: [{
        input: policyTemplate.input,
        vars: addDatasetVarIfNotPresent(policyTemplate.vars),
        template_path: policyTemplate.template_path,
        title: policyTemplate.title,
        description: policyTemplate.title,
        enabled: true
      }]
    };
    return dataStream;
  });
};

// Input only packages must provide a dataset name in order to differentiate their data streams
// here we add the dataset var if it is not defined in the package already.
exports.getNormalizedDataStreams = getNormalizedDataStreams;
const addDatasetVarIfNotPresent = vars => {
  const newVars = vars !== null && vars !== void 0 ? vars : [];
  const isDatasetAlreadyAdded = newVars.find(varEntry => varEntry.name === DATA_STREAM_DATASET_VAR.name);
  if (isDatasetAlreadyAdded) {
    return newVars;
  } else {
    return [...newVars, DATA_STREAM_DATASET_VAR];
  }
};
const createDefaultDatasetName = (packageInfo, policyTemplate) => packageInfo.name + '.' + policyTemplate.name;