"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetDatastreams = void 0;
var _configSchema = require("@kbn/config-schema");
var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramsSchema = _configSchema.schema.object({
  name: _configSchema.schema.string()
});
async function getDatastreamsForComponentTemplate(esClient, name) {
  const {
    component_templates: componentTemplates
  } = await esClient.cluster.getComponentTemplate({
    name
  });
  if (!componentTemplates.find(componentTemplate => componentTemplate.name === name)) {
    return [];
  }
  const {
    index_templates: indexTemplates
  } = await esClient.indices.getIndexTemplate();
  const datastreamNames = indexTemplates.filter(indexTemplate => indexTemplate.index_template.composed_of.includes(name)).map(indexTemplate => indexTemplate.index_template.index_patterns).flat().join(',');
  if (datastreamNames.length < 0) {
    return [];
  }
  const {
    data_streams: dataStreams
  } = await esClient.indices.getDataStream({
    name: datastreamNames
  });
  return dataStreams;
}
const registerGetDatastreams = ({
  router,
  lib: {
    handleEsError
  }
}) => {
  router.get({
    path: (0, _.addBasePath)('/component_templates/{name}/datastreams'),
    validate: {
      params: paramsSchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    const {
      name
    } = request.params;
    try {
      const dataStreams = await getDatastreamsForComponentTemplate(client.asCurrentUser, name);
      return response.ok({
        body: {
          data_streams: dataStreams.map(ds => ds.name)
        }
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
};
exports.registerGetDatastreams = registerGetDatastreams;