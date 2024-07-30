"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRAINED_MODEL_TYPE = exports.SUPPORTED_PYTORCH_TASKS = exports.DEPLOYMENT_STATE = exports.BUILT_IN_MODEL_TYPE = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEPLOYMENT_STATE = {
  STARTED: 'started',
  STARTING: 'starting',
  STOPPING: 'stopping'
};
exports.DEPLOYMENT_STATE = DEPLOYMENT_STATE;
const TRAINED_MODEL_TYPE = {
  PYTORCH: 'pytorch',
  TREE_ENSEMBLE: 'tree_ensemble',
  LANG_IDENT: 'lang_ident'
};
exports.TRAINED_MODEL_TYPE = TRAINED_MODEL_TYPE;
const SUPPORTED_PYTORCH_TASKS = {
  NER: 'ner',
  QUESTION_ANSWERING: 'question_answering',
  ZERO_SHOT_CLASSIFICATION: 'zero_shot_classification',
  TEXT_CLASSIFICATION: 'text_classification',
  TEXT_EMBEDDING: 'text_embedding',
  FILL_MASK: 'fill_mask'
};
exports.SUPPORTED_PYTORCH_TASKS = SUPPORTED_PYTORCH_TASKS;
const BUILT_IN_MODEL_TYPE = _i18n.i18n.translate('xpack.ml.trainedModels.modelsList.builtInModelLabel', {
  defaultMessage: 'built-in'
});
exports.BUILT_IN_MODEL_TYPE = BUILT_IN_MODEL_TYPE;