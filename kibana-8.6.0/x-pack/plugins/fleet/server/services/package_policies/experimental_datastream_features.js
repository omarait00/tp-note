"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builRoutingPath = builRoutingPath;
exports.handleExperimentalDatastreamFeatureOptIn = handleExperimentalDatastreamFeatureOptIn;
var _packages = require("../epm/packages");
var _update = require("../epm/packages/update");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function mapFields(mappingProperties) {
  const mappings = Object.keys(mappingProperties).reduce((acc, curr) => {
    const property = mappingProperties[curr];
    if (property.properties) {
      const childMappings = mapFields(property.properties);
      Object.keys(childMappings).forEach(key => {
        acc[curr + '.' + key] = childMappings[key];
      });
    } else {
      acc[curr] = property;
    }
    return acc;
  }, {});
  return mappings;
}
function builRoutingPath(properties) {
  const mappingsProperties = mapFields(properties);
  return Object.keys(mappingsProperties).filter(mapping => mappingsProperties[mapping].type === 'keyword' && mappingsProperties[mapping].time_series_dimension);
}
async function handleExperimentalDatastreamFeatureOptIn({
  soClient,
  esClient,
  packagePolicy
}) {
  var _packagePolicy$packag;
  if (!((_packagePolicy$packag = packagePolicy.package) !== null && _packagePolicy$packag !== void 0 && _packagePolicy$packag.experimental_data_stream_features)) {
    return;
  }

  // If we're performing an update, we want to check if we actually need to perform
  // an update to the component templates for the package. So we fetch the saved object
  // for the package policy here to compare later.
  let installation;
  if (packagePolicy.package) {
    installation = await (0, _packages.getInstallation)({
      savedObjectsClient: soClient,
      pkgName: packagePolicy.package.name
    });
  }
  for (const featureMapEntry of packagePolicy.package.experimental_data_stream_features) {
    var _installation, _installation$experim;
    const existingOptIn = (_installation = installation) === null || _installation === void 0 ? void 0 : (_installation$experim = _installation.experimental_data_stream_features) === null || _installation$experim === void 0 ? void 0 : _installation$experim.find(optIn => optIn.data_stream === featureMapEntry.data_stream);
    const isSyntheticSourceOptInChanged = (existingOptIn === null || existingOptIn === void 0 ? void 0 : existingOptIn.features.synthetic_source) !== featureMapEntry.features.synthetic_source;
    const isTSDBOptInChanged = (existingOptIn === null || existingOptIn === void 0 ? void 0 : existingOptIn.features.tsdb) !== featureMapEntry.features.tsdb;
    if (!isSyntheticSourceOptInChanged && !isTSDBOptInChanged) continue;
    const componentTemplateName = `${featureMapEntry.data_stream}@package`;
    const componentTemplateRes = await esClient.cluster.getComponentTemplate({
      name: componentTemplateName
    });
    const componentTemplate = componentTemplateRes.component_templates[0].component_template;
    if (isSyntheticSourceOptInChanged) {
      const body = {
        template: {
          ...componentTemplate.template,
          mappings: {
            ...componentTemplate.template.mappings,
            _source: {
              mode: featureMapEntry.features.synthetic_source ? 'synthetic' : 'stored'
            }
          }
        }
      };
      await esClient.cluster.putComponentTemplate({
        name: componentTemplateName,
        // @ts-expect-error - TODO: Remove when ES client typings include support for synthetic source
        body
      });
    }
    if (isTSDBOptInChanged && featureMapEntry.features.tsdb) {
      var _componentTemplate$te, _componentTemplate$te2, _componentTemplate$te3, _indexTemplate$templa, _indexTemplate$templa2, _indexTemplate$templa3;
      const mappingsProperties = (_componentTemplate$te = (_componentTemplate$te2 = componentTemplate.template) === null || _componentTemplate$te2 === void 0 ? void 0 : (_componentTemplate$te3 = _componentTemplate$te2.mappings) === null || _componentTemplate$te3 === void 0 ? void 0 : _componentTemplate$te3.properties) !== null && _componentTemplate$te !== void 0 ? _componentTemplate$te : {};

      // All mapped fields of type keyword and time_series_dimension enabled will be included in the generated routing path
      // Temporarily generating routing_path here until fixed in elasticsearch https://github.com/elastic/elasticsearch/issues/91592
      const routingPath = builRoutingPath(mappingsProperties);
      if (routingPath.length === 0) continue;
      const indexTemplateRes = await esClient.indices.getIndexTemplate({
        name: featureMapEntry.data_stream
      });
      const indexTemplate = indexTemplateRes.index_templates[0].index_template;
      const indexTemplateBody = {
        ...indexTemplate,
        template: {
          ...((_indexTemplate$templa = indexTemplate.template) !== null && _indexTemplate$templa !== void 0 ? _indexTemplate$templa : {}),
          settings: {
            ...((_indexTemplate$templa2 = (_indexTemplate$templa3 = indexTemplate.template) === null || _indexTemplate$templa3 === void 0 ? void 0 : _indexTemplate$templa3.settings) !== null && _indexTemplate$templa2 !== void 0 ? _indexTemplate$templa2 : {}),
            index: {
              mode: 'time_series',
              routing_path: routingPath
            }
          }
        }
      };
      await esClient.indices.putIndexTemplate({
        name: featureMapEntry.data_stream,
        body: indexTemplateBody
      });
    }
  }

  // Update the installation object to persist the experimental feature map
  await (0, _update.updateDatastreamExperimentalFeatures)(soClient, packagePolicy.package.name, packagePolicy.package.experimental_data_stream_features);

  // Delete the experimental features map from the package policy so it doesn't get persisted
  delete packagePolicy.package.experimental_data_stream_features;
}