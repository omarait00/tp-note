"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DescendantsQuery = void 0;
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
class DescendantsQuery extends _base.BaseResolverQuery {
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
  query(nodes, size) {
    return {
      _source: false,
      fields: this.resolverFields,
      size,
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
              [this.schema.parent]: nodes
            }
          }, {
            exists: {
              field: this.schema.id
            }
          }, {
            exists: {
              field: this.schema.parent
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
  queryWithAncestryArray(nodes, ancestryField, size) {
    return {
      _source: false,
      fields: this.resolverFields,
      size,
      collapse: {
        field: this.schema.id
      },
      sort: [{
        _script: {
          type: 'number',
          script: {
            /**
             * This script is used to sort the returned documents in a breadth first order so that we return all of
             * a single level of nodes before returning the next level of nodes. This is needed because using the
             * ancestry array could result in the search going deep before going wide depending on when the nodes
             * spawned their children. If a node spawns a child before it's sibling is spawned then the child would
             * be found before the sibling because by default the sort was on timestamp ascending.
             */
            source: `
                Map ancestryToIndex = [:];
                List sourceAncestryArray = params._source.${ancestryField};
                int length = sourceAncestryArray.length;
                for (int i = 0; i < length; i++) {
                  ancestryToIndex[sourceAncestryArray[i]] = i;
                }
                for (String id : params.ids) {
                  def index = ancestryToIndex[id];
                  if (index != null) {
                    return index;
                  }
                }
                return -1;
              `,
            params: {
              ids: nodes
            }
          }
        }
      }, {
        '@timestamp': 'asc'
      }],
      query: {
        bool: {
          filter: [...this.getRangeFilter(), {
            terms: {
              [ancestryField]: nodes
            }
          }, {
            exists: {
              field: this.schema.id
            }
          }, {
            exists: {
              field: this.schema.parent
            }
          }, {
            exists: {
              field: ancestryField
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
   * Searches for descendant nodes matching the specified IDs.
   *
   * @param client for making requests to Elasticsearch
   * @param nodes the unique IDs to search for in Elasticsearch
   * @param limit the upper limit of documents to returned
   */
  async search(client, nodes, limit) {
    const validNodes = (0, _utils.validIDs)(nodes);
    if (validNodes.length <= 0) {
      return [];
    }
    const esClient = this.isInternalRequest ? client.asInternalUser : client.asCurrentUser;
    let response;
    if (this.schema.ancestry) {
      response = await esClient.search({
        body: this.queryWithAncestryArray(validNodes, this.schema.ancestry, limit),
        index: this.indexPatterns
      });
    } else {
      response = await esClient.search({
        body: this.query(validNodes, limit),
        index: this.indexPatterns
      });
    }

    /**
     * The returned values will look like:
     * [
     *  { 'schema_id_value': <value>, 'schema_parent_value': <value> }
     * ]
     *
     * So the schema fields are flattened ('process.parent.entity_id')
     */
    // @ts-expect-error @elastic/elasticsearch _source is optional
    return response.hits.hits.map(hit => hit.fields);
  }
}
exports.DescendantsQuery = DescendantsQuery;