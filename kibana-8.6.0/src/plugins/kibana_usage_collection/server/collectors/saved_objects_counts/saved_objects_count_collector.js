"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSavedObjectsCountUsageCollector = registerSavedObjectsCountUsageCollector;
var _get_saved_object_counts = require("./get_saved_object_counts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function registerSavedObjectsCountUsageCollector(usageCollection, kibanaIndex, getAllSavedObjectTypes) {
  usageCollection.registerCollector(usageCollection.makeUsageCollector({
    type: 'saved_objects_counts',
    isReady: () => true,
    schema: {
      total: {
        type: 'long',
        _meta: {
          description: 'Total number of saved objects in the cluster'
        }
      },
      by_type: {
        type: 'array',
        items: {
          type: {
            type: 'keyword',
            _meta: {
              description: 'The SavedObjects type'
            }
          },
          count: {
            type: 'long',
            _meta: {
              description: 'How many SavedObjects of that type are stored in the cluster across all Spaces'
            }
          }
        }
      },
      others: {
        type: 'long',
        _meta: {
          description: 'Number of SO objects outside the breakdown. If it is not 0, there may be an unexpected state of the deployment 0 and future migrations might fail.'
        }
      },
      non_registered_types: {
        type: 'array',
        items: {
          type: 'keyword',
          _meta: {
            description: 'List of SO types that showed up in the break down but are not registered in Kibana. They could be a potential cause of future migration failures.'
          }
        }
      }
    },
    async fetch({
      esClient
    }) {
      const allRegisteredSOTypes = await getAllSavedObjectTypes();
      const {
        total,
        per_type: buckets,
        non_expected_types: nonRegisteredTypes,
        others
      } = await (0, _get_saved_object_counts.getSavedObjectsCounts)(esClient, kibanaIndex, allRegisteredSOTypes, false);
      return {
        total,
        by_type: buckets.map(({
          key: type,
          doc_count: count
        }) => ({
          type,
          count
        })),
        non_registered_types: nonRegisteredTypes,
        others
      };
    }
  }));
}