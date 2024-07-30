"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EsIndexFilesMetadataClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _fp = require("lodash/fp");
var _esQuery = require("@kbn/es-query");
var _query_filters = require("./query_filters");
var _file = require("../../../saved_objects/file");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const filterArgsToESQuery = (0, _fp.pipe)(_query_filters.filterArgsToKuery, _esQuery.toElasticsearchQuery);
const fileMappings = {
  dynamic: false,
  type: 'object',
  properties: {
    ..._file.fileObjectType.mappings.properties
  }
};
class EsIndexFilesMetadataClient {
  constructor(index, esClient, logger) {
    (0, _defineProperty2.default)(this, "createIfNotExists", (0, _lodash.once)(async () => {
      try {
        if (await this.esClient.indices.exists({
          index: this.index
        })) {
          return;
        }
        await this.esClient.indices.create({
          index: this.index,
          mappings: {
            dynamic: false,
            properties: {
              file: fileMappings
            }
          }
        });
      } catch (e) {
        // best effort
      }
    }));
    (0, _defineProperty2.default)(this, "attrPrefix", 'file');
    this.index = index;
    this.esClient = esClient;
    this.logger = logger;
  }
  async create({
    id,
    metadata
  }) {
    await this.createIfNotExists();
    const result = await this.esClient.index({
      index: this.index,
      id,
      document: {
        file: metadata
      },
      refresh: true
    });
    return {
      id: result._id,
      metadata
    };
  }
  async get({
    id
  }) {
    const {
      _source: doc
    } = await this.esClient.get({
      index: this.index,
      id
    });
    if (!doc) {
      this.logger.error(`File with id "${id}" not found`);
      throw new Error('File not found');
    }
    return {
      id,
      metadata: doc.file
    };
  }
  async delete({
    id
  }) {
    await this.esClient.delete({
      index: this.index,
      id
    });
  }
  async update({
    id,
    metadata
  }) {
    await this.esClient.update({
      index: this.index,
      id,
      doc: {
        file: metadata
      },
      refresh: true
    });
    return this.get({
      id
    });
  }
  paginationToES({
    page = 1,
    perPage = 50
  }) {
    return {
      size: perPage,
      from: (page - 1) * perPage
    };
  }
  async find({
    page,
    perPage,
    ...filterArgs
  } = {}) {
    const result = await this.esClient.search({
      track_total_hits: true,
      index: this.index,
      expand_wildcards: 'hidden',
      query: filterArgsToESQuery({
        ...filterArgs,
        attrPrefix: this.attrPrefix
      }),
      ...this.paginationToES({
        page,
        perPage
      }),
      sort: 'file.created'
    });
    return {
      total: result.hits.total.value,
      files: result.hits.hits.map(r => {
        var _r$_source;
        return {
          id: r._id,
          metadata: (_r$_source = r._source) === null || _r$_source === void 0 ? void 0 : _r$_source.file
        };
      })
    };
  }
  async getUsageMetrics(arg) {
    throw new Error('Not implemented');
  }
}
exports.EsIndexFilesMetadataClient = EsIndexFilesMetadataClient;