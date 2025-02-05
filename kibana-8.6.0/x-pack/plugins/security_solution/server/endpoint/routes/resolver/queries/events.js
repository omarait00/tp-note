"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventsQuery = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _serialized_query = require("../../../../utils/serialized_query");
var _base = require("../tree/queries/base");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Builds a query for retrieving events.
 */
class EventsQuery extends _base.BaseResolverQuery {
  constructor({
    indexPatterns,
    timeRange,
    isInternalRequest,
    pagination
  }) {
    super({
      indexPatterns,
      timeRange,
      isInternalRequest
    });
    (0, _defineProperty2.default)(this, "pagination", void 0);
    this.pagination = pagination;
  }
  query(filters) {
    return {
      query: {
        bool: {
          filter: [...filters, ...this.getRangeFilter(), {
            term: {
              'event.kind': 'event'
            }
          }]
        }
      },
      ...this.pagination.buildQueryFields('event.id', 'desc')
    };
  }
  alertDetailQuery(id) {
    return {
      query: {
        bool: {
          filter: [{
            term: {
              'event.id': id
            }
          }, ...this.getRangeFilter()]
        }
      },
      index: typeof this.indexPatterns === 'string' ? this.indexPatterns : this.indexPatterns.join(','),
      ...this.pagination.buildQueryFields('event.id', 'desc')
    };
  }
  alertsForProcessQuery(id) {
    return {
      query: {
        bool: {
          filter: [{
            term: {
              'process.entity_id': id
            }
          }, ...this.getRangeFilter()]
        }
      },
      index: typeof this.indexPatterns === 'string' ? this.indexPatterns : this.indexPatterns.join(','),
      ...this.pagination.buildQueryFields('event.id', 'desc')
    };
  }
  buildSearch(filters) {
    return {
      body: this.query(filters),
      index: this.indexPatterns
    };
  }
  static buildFilters(filter) {
    if (filter === undefined) {
      return [];
    }
    return [(0, _serialized_query.parseFilterQuery)(filter)];
  }

  /**
   * Will search ES using a filter for normal events associated with a process, or an entity type and event id for alert events.
   *
   * @param client a client for searching ES
   * @param filter an optional string representation of a raw Elasticsearch clause for filtering the results
   */
  async search(client, body, alertsClient) {
    if (body.filter) {
      const parsedFilters = EventsQuery.buildFilters(body.filter);
      const response = await client.asCurrentUser.search(this.buildSearch(parsedFilters));
      // @ts-expect-error @elastic/elasticsearch _source is optional
      return response.hits.hits.map(hit => hit._source);
    } else {
      const {
        eventID,
        entityType
      } = body;
      if (entityType === 'alertDetail') {
        const response = await alertsClient.find(this.alertDetailQuery(eventID));
        // @ts-expect-error @elastic/elasticsearch _source is optional
        return response.hits.hits.map(hit => hit._source);
      } else {
        const response = await alertsClient.find(this.alertsForProcessQuery(eventID));
        // @ts-expect-error @elastic/elasticsearch _source is optional
        return response.hits.hits.map(hit => hit._source);
      }
    }
  }
}
exports.EventsQuery = EventsQuery;