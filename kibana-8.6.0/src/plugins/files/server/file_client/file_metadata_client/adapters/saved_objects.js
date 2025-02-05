"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsFileMetadataClient = void 0;
var _lodash = require("lodash");
var _constants = require("../../../../common/constants");
var _query_filters = require("./query_filters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class SavedObjectsFileMetadataClient {
  constructor(soType, soClient, logger) {
    this.soType = soType;
    this.soClient = soClient;
    this.logger = logger;
  }
  async create({
    id,
    metadata
  }) {
    const result = await this.soClient.create(this.soType, metadata, {
      id
    });
    return {
      id: result.id,
      metadata: result.attributes
    };
  }
  async update({
    id,
    metadata
  }) {
    const result = await this.soClient.update(this.soType, id, metadata);
    return {
      id: result.id,
      metadata: result.attributes
    };
  }
  async get({
    id
  }) {
    const result = await this.soClient.get(this.soType, id);
    return {
      id: result.id,
      metadata: result.attributes
    };
  }
  async find({
    page,
    perPage,
    ...filterArgs
  } = {}) {
    const result = await this.soClient.find({
      type: this.soType,
      filter: (0, _query_filters.filterArgsToKuery)({
        ...filterArgs,
        attrPrefix: `${this.soType}.attributes`
      }),
      page,
      perPage,
      sortOrder: 'desc',
      sortField: 'created'
    });
    return {
      files: result.saved_objects.map(so => ({
        id: so.id,
        metadata: so.attributes
      })),
      total: result.total
    };
  }
  async delete({
    id
  }) {
    await this.soClient.delete(this.soType, id);
  }
  async getUsageMetrics({
    esFixedSizeIndex: {
      capacity
    }
  }) {
    let pit;
    try {
      pit = await this.soClient.openPointInTimeForType(this.soType);
      const {
        aggregations
      } = await this.soClient.find({
        type: this.soType,
        pit,
        aggs: {
          bytesUsed: {
            sum: {
              field: `${this.soType}.attributes.size`
            }
          },
          status: {
            terms: {
              field: `${this.soType}.attributes.Status`
            }
          },
          extension: {
            terms: {
              field: `${this.soType}.attributes.extension`
            }
          }
        }
      });
      if (aggregations) {
        const used = aggregations.bytesUsed.value;
        return {
          storage: {
            [_constants.ES_FIXED_SIZE_INDEX_BLOB_STORE]: {
              capacity,
              available: capacity - used,
              used
            }
          },
          countByExtension: (0, _lodash.reduce)(aggregations.extension.buckets, (acc, {
            key,
            doc_count: docCount
          }) => ({
            ...acc,
            [key]: docCount
          }), {}),
          countByStatus: (0, _lodash.reduce)(aggregations.status.buckets, (acc, {
            key,
            doc_count: docCount
          }) => ({
            ...acc,
            [key]: docCount
          }), {})
        };
      }
      throw new Error('Could not retrieve usage metrics');
    } finally {
      if (pit) {
        await this.soClient.closePointInTime(pit.id).catch(this.logger.error.bind(this.logger));
      }
    }
  }
}
exports.SavedObjectsFileMetadataClient = SavedObjectsFileMetadataClient;