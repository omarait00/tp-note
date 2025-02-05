"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegistryVarsEntryKeys = exports.RegistryStreamKeys = exports.RegistryPolicyTemplateKeys = exports.RegistryInputKeys = exports.RegistryDataStreamKeys = exports.KibanaSavedObjectType = exports.KibanaAssetType = exports.InstallStatus = exports.ElasticsearchAssetType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Follow pattern from https://github.com/elastic/kibana/pull/52447
// TODO: Update when https://github.com/elastic/kibana/issues/53021 is closed
let InstallStatus;
exports.InstallStatus = InstallStatus;
(function (InstallStatus) {
  InstallStatus["installed"] = "installed";
  InstallStatus["notInstalled"] = "not_installed";
  InstallStatus["installing"] = "installing";
  InstallStatus["reinstalling"] = "reinstalling";
  InstallStatus["uninstalling"] = "uninstalling";
})(InstallStatus || (exports.InstallStatus = InstallStatus = {}));
/*
  Enum mapping of a saved object asset type to how it would appear in a package file path (snake cased)
*/
let KibanaAssetType;
/*
 Enum of saved object types that are allowed to be installed
*/
exports.KibanaAssetType = KibanaAssetType;
(function (KibanaAssetType) {
  KibanaAssetType["dashboard"] = "dashboard";
  KibanaAssetType["visualization"] = "visualization";
  KibanaAssetType["search"] = "search";
  KibanaAssetType["indexPattern"] = "index_pattern";
  KibanaAssetType["map"] = "map";
  KibanaAssetType["lens"] = "lens";
  KibanaAssetType["securityRule"] = "security_rule";
  KibanaAssetType["cloudSecurityPostureRuleTemplate"] = "csp_rule_template";
  KibanaAssetType["mlModule"] = "ml_module";
  KibanaAssetType["tag"] = "tag";
  KibanaAssetType["osqueryPackAsset"] = "osquery_pack_asset";
  KibanaAssetType["osquerySavedQuery"] = "osquery_saved_query";
})(KibanaAssetType || (exports.KibanaAssetType = KibanaAssetType = {}));
let KibanaSavedObjectType;
exports.KibanaSavedObjectType = KibanaSavedObjectType;
(function (KibanaSavedObjectType) {
  KibanaSavedObjectType["dashboard"] = "dashboard";
  KibanaSavedObjectType["visualization"] = "visualization";
  KibanaSavedObjectType["search"] = "search";
  KibanaSavedObjectType["indexPattern"] = "index-pattern";
  KibanaSavedObjectType["map"] = "map";
  KibanaSavedObjectType["lens"] = "lens";
  KibanaSavedObjectType["mlModule"] = "ml-module";
  KibanaSavedObjectType["securityRule"] = "security-rule";
  KibanaSavedObjectType["cloudSecurityPostureRuleTemplate"] = "csp-rule-template";
  KibanaSavedObjectType["tag"] = "tag";
  KibanaSavedObjectType["osqueryPackAsset"] = "osquery-pack-asset";
  KibanaSavedObjectType["osquerySavedQuery"] = "osquery-saved-query";
})(KibanaSavedObjectType || (exports.KibanaSavedObjectType = KibanaSavedObjectType = {}));
let ElasticsearchAssetType;
exports.ElasticsearchAssetType = ElasticsearchAssetType;
(function (ElasticsearchAssetType) {
  ElasticsearchAssetType["componentTemplate"] = "component_template";
  ElasticsearchAssetType["ingestPipeline"] = "ingest_pipeline";
  ElasticsearchAssetType["indexTemplate"] = "index_template";
  ElasticsearchAssetType["ilmPolicy"] = "ilm_policy";
  ElasticsearchAssetType["transform"] = "transform";
  ElasticsearchAssetType["dataStreamIlmPolicy"] = "data_stream_ilm_policy";
  ElasticsearchAssetType["mlModel"] = "ml_model";
})(ElasticsearchAssetType || (exports.ElasticsearchAssetType = ElasticsearchAssetType = {}));
let RegistryPolicyTemplateKeys;
exports.RegistryPolicyTemplateKeys = RegistryPolicyTemplateKeys;
(function (RegistryPolicyTemplateKeys) {
  RegistryPolicyTemplateKeys["categories"] = "categories";
  RegistryPolicyTemplateKeys["data_streams"] = "data_streams";
  RegistryPolicyTemplateKeys["inputs"] = "inputs";
  RegistryPolicyTemplateKeys["readme"] = "readme";
  RegistryPolicyTemplateKeys["multiple"] = "multiple";
  RegistryPolicyTemplateKeys["type"] = "type";
  RegistryPolicyTemplateKeys["vars"] = "vars";
  RegistryPolicyTemplateKeys["input"] = "input";
  RegistryPolicyTemplateKeys["template_path"] = "template_path";
  RegistryPolicyTemplateKeys["name"] = "name";
  RegistryPolicyTemplateKeys["title"] = "title";
  RegistryPolicyTemplateKeys["description"] = "description";
  RegistryPolicyTemplateKeys["icons"] = "icons";
  RegistryPolicyTemplateKeys["screenshots"] = "screenshots";
})(RegistryPolicyTemplateKeys || (exports.RegistryPolicyTemplateKeys = RegistryPolicyTemplateKeys = {}));
let RegistryInputKeys;
exports.RegistryInputKeys = RegistryInputKeys;
(function (RegistryInputKeys) {
  RegistryInputKeys["type"] = "type";
  RegistryInputKeys["title"] = "title";
  RegistryInputKeys["description"] = "description";
  RegistryInputKeys["template_path"] = "template_path";
  RegistryInputKeys["condition"] = "condition";
  RegistryInputKeys["input_group"] = "input_group";
  RegistryInputKeys["vars"] = "vars";
})(RegistryInputKeys || (exports.RegistryInputKeys = RegistryInputKeys = {}));
let RegistryStreamKeys;
exports.RegistryStreamKeys = RegistryStreamKeys;
(function (RegistryStreamKeys) {
  RegistryStreamKeys["input"] = "input";
  RegistryStreamKeys["title"] = "title";
  RegistryStreamKeys["description"] = "description";
  RegistryStreamKeys["enabled"] = "enabled";
  RegistryStreamKeys["vars"] = "vars";
  RegistryStreamKeys["template_path"] = "template_path";
})(RegistryStreamKeys || (exports.RegistryStreamKeys = RegistryStreamKeys = {}));
let RegistryDataStreamKeys;
exports.RegistryDataStreamKeys = RegistryDataStreamKeys;
(function (RegistryDataStreamKeys) {
  RegistryDataStreamKeys["type"] = "type";
  RegistryDataStreamKeys["ilm_policy"] = "ilm_policy";
  RegistryDataStreamKeys["hidden"] = "hidden";
  RegistryDataStreamKeys["dataset"] = "dataset";
  RegistryDataStreamKeys["title"] = "title";
  RegistryDataStreamKeys["release"] = "release";
  RegistryDataStreamKeys["streams"] = "streams";
  RegistryDataStreamKeys["package"] = "package";
  RegistryDataStreamKeys["path"] = "path";
  RegistryDataStreamKeys["ingest_pipeline"] = "ingest_pipeline";
  RegistryDataStreamKeys["elasticsearch"] = "elasticsearch";
  RegistryDataStreamKeys["dataset_is_prefix"] = "dataset_is_prefix";
})(RegistryDataStreamKeys || (exports.RegistryDataStreamKeys = RegistryDataStreamKeys = {}));
let RegistryVarsEntryKeys; // EPR types this as `[]map[string]interface{}`
// which means the official/possible type is Record<string, any>
// but we effectively only see this shape
exports.RegistryVarsEntryKeys = RegistryVarsEntryKeys;
(function (RegistryVarsEntryKeys) {
  RegistryVarsEntryKeys["name"] = "name";
  RegistryVarsEntryKeys["title"] = "title";
  RegistryVarsEntryKeys["description"] = "description";
  RegistryVarsEntryKeys["type"] = "type";
  RegistryVarsEntryKeys["required"] = "required";
  RegistryVarsEntryKeys["show_user"] = "show_user";
  RegistryVarsEntryKeys["multi"] = "multi";
  RegistryVarsEntryKeys["default"] = "default";
  RegistryVarsEntryKeys["os"] = "os";
})(RegistryVarsEntryKeys || (exports.RegistryVarsEntryKeys = RegistryVarsEntryKeys = {}));