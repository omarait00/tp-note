"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LifecycleQuery = void 0;
var _utils = require("../utils");
var _base = require("./base");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Builds a query for retrieving descendants of a node.
 */
class LifecycleQuery extends _base.BaseResolverQuery {
  constructor({
    schema,
    indexPatterns,
    timeRange,
    isInternalRequest
  }) {
    super({
      schema,
      indexPatterns,
      timeRange,
      isInternalRequest
    });
  }
  query(nodes) {
    return {
      _source: false,
      fields: this.resolverFields,
      size: nodes.length,
      collapse: {
        field: this.schema.id
      },
      sort: [{
        '@timestamp': 'asc'
      }],
      query: {
        bool: {
          filter: [...this.getRangeFilter(), {
            terms: {
              [this.schema.id]: nodes
            }
          }, {
            exists: {
              field: this.schema.id
            }
          }, {
            bool: {
              must_not: {
                term: {
                  [this.schema.id]: ''
                }
              }
            }
          }, {
            term: {
              'event.category': 'process'
            }
          }, {
            term: {
              'event.kind': 'event'
            }
          }]
        }
      }
    };
  }

  /**
   * Searches for lifecycle events matching the specified node IDs.
   *
   * @param client for making requests to Elasticsearch
   * @param nodes the unique IDs to search for in Elasticsearch
   */
  async search(client, nodes) {
    const validNodes = (0, _utils.validIDs)(nodes);
    if (validNodes.length <= 0) {
      return [];
    }
    const esClient = this.isInternalRequest ? client.asInternalUser : client.asCurrentUser;
    const body = await esClient.search({
      body: this.query(validNodes),
      index: this.indexPatterns
    });

    /**
     * The returned values will look like:
     * [
     *  { 'schema_id_value': <value>, 'schema_parent_value': <value> }
     * ]
     *
     * So the schema fields are flattened ('process.parent.entity_id')
     */
    // @ts-expect-error @elastic/elasticsearch _source is optional
    return body.hits.hits.map(hit => hit.fields);
  }
}
exports.LifecycleQuery = LifecycleQuery;