"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderParameterTemplates = void 0;
var _mustache_renderer = require("../../../../../actions/server/lib/mustache_renderer");
var _lodash = require("lodash");
var _opsgenie = require("../../../../common/opsgenie");
var _common = require("../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const renderParameterTemplates = (params, variables) => {
  var _paramsCopy$subAction;
  if (!isCreateAlertSubAction(params) || !params.subActionParams.tags) {
    return (0, _mustache_renderer.renderMustacheObject)(params, variables);
  }
  const foundRuleTagsTemplate = params.subActionParams.tags.includes(_opsgenie.RULE_TAGS_TEMPLATE);
  if (!foundRuleTagsTemplate) {
    return (0, _mustache_renderer.renderMustacheObject)(params, variables);
  }
  const paramsCopy = (0, _lodash.cloneDeep)(params);
  const tagsWithoutRuleTagsTemplate = (_paramsCopy$subAction = paramsCopy.subActionParams.tags) === null || _paramsCopy$subAction === void 0 ? void 0 : _paramsCopy$subAction.filter(tag => tag !== _opsgenie.RULE_TAGS_TEMPLATE);
  (0, _lodash.set)(paramsCopy, 'subActionParams.tags', [...(tagsWithoutRuleTagsTemplate !== null && tagsWithoutRuleTagsTemplate !== void 0 ? tagsWithoutRuleTagsTemplate : []), ...getRuleTags(variables)]);
  return (0, _mustache_renderer.renderMustacheObject)(paramsCopy, variables);
};
exports.renderParameterTemplates = renderParameterTemplates;
const isCreateAlertSubAction = params => params.subAction === _common.OpsgenieSubActions.CreateAlert;
const getRuleTags = variables => {
  const ruleTagsAsUnknown = (0, _lodash.get)(variables, 'rule.tags', []);
  if (!Array.isArray(ruleTagsAsUnknown)) {
    return [];
  }
  return ruleTagsAsUnknown.filter(tag => (0, _lodash.isString)(tag));
};