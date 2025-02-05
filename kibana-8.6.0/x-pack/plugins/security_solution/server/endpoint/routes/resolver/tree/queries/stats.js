"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatsQuery = void 0;
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
class StatsQuery extends _base.BaseResolverQuery {
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
      size: 0,
      query: {
        bool: {
          filter: [...this.getRangeFilter(), {
            terms: {
              [this.schema.id]: nodes
            }
          }, {
            term: {
              'event.kind': 'event'
            }
          }, {
            bool: {
              must_not: {
                term: {
                  'event.category': 'process'
                }
              }
            }
          }]
        }
      },
      aggs: {
        ids: {
          terms: {
            field: this.schema.id,
            size: nodes.length
          },
          aggs: {
            categories: {
              terms: {
                field: 'event.category',
                size: 1000
              }
            }
          }
        }
      }
    };
  }
  alertStatsQuery(nodes, index, includeHits) {
    return {
      size: includeHits ? 5000 : 0,
      query: {
        bool: {
          filter: [...this.getRangeFilter(), {
            terms: {
              [this.schema.id]: nodes
            }
          }]
        }
      },
      index,
      aggs: {
        ids: {
          terms: {
            field: this.schema.id
          }
        }
      }
    };
  }
  static getEventStats(catAgg) {
    var _catAgg$categories;
    const total = catAgg.doc_count;
    if (!((_catAgg$categories = catAgg.categories) !== null && _catAgg$categories !== void 0 && _catAgg$categories.buckets)) {
      return {
        total,
        byCategory: {}
      };
    }
    const byCategory = catAgg.categories.buckets.reduce((cummulative, bucket) => ({
      ...cummulative,
      [bucket.key]: bucket.doc_count
    }), {});
    return {
      total,
      byCategory
    };
  }

  /**
   * Returns the related event statistics for a set of nodes.
   * @param client used to make requests to Elasticsearch
   * @param nodes an array of unique IDs representing nodes in a resolver graph
   */
  async search(client, nodes, alertsClient, includeHits) {
    var _body$aggregations$id, _body$aggregations, _body$aggregations$id2, _alertsBody$aggregati, _alertsBody$aggregati2, _alertsBody$aggregati3;
    if (nodes.length <= 0) {
      return {};
    }
    const esClient = this.isInternalRequest ? client.asInternalUser : client.asCurrentUser;
    const alertIndex = typeof this.indexPatterns === 'string' ? this.indexPatterns : this.indexPatterns.join(',');
    const [body, alertsBody] = await Promise.all([await esClient.search({
      body: this.query(nodes),
      index: this.indexPatterns
    }), alertsClient ? await alertsClient.find(this.alertStatsQuery(nodes, alertIndex, includeHits)) : {
      hits: {
        hits: []
      }
    }]);
    // @ts-expect-error declare aggegations type explicitly
    const eventAggs = (_body$aggregations$id = (_body$aggregations = body.aggregations) === null || _body$aggregations === void 0 ? void 0 : (_body$aggregations$id2 = _body$aggregations.ids) === null || _body$aggregations$id2 === void 0 ? void 0 : _body$aggregations$id2.buckets) !== null && _body$aggregations$id !== void 0 ? _body$aggregations$id : [];
    // @ts-expect-error declare aggegations type explicitly
    const alertAggs = (_alertsBody$aggregati = (_alertsBody$aggregati2 = alertsBody.aggregations) === null || _alertsBody$aggregati2 === void 0 ? void 0 : (_alertsBody$aggregati3 = _alertsBody$aggregati2.ids) === null || _alertsBody$aggregati3 === void 0 ? void 0 : _alertsBody$aggregati3.buckets) !== null && _alertsBody$aggregati !== void 0 ? _alertsBody$aggregati : [];
    const eventsWithAggs = new Set([...eventAggs.map(agg => agg.key), ...alertAggs.map(agg => agg.key)]);
    const alertsAggsMap = new Map(alertAggs.map(({
      key,
      doc_count: docCount
    }) => [key, docCount]));
    const eventAggsMap = new Map(eventAggs.map(({
      key,
      doc_count: docCount,
      categories
    }) => [key, {
      ...StatsQuery.getEventStats({
        key,
        doc_count: docCount,
        categories
      })
    }]));
    const alertIdsRaw = alertsBody.hits.hits.map(hit => hit._id);
    const alertIds = alertIdsRaw.flatMap(id => !id ? [] : [id]);
    const eventAggStats = [...eventsWithAggs.values()];
    const eventStats = eventAggStats.reduce((cummulative, id) => {
      const alertCount = alertsAggsMap.get(id);
      const otherEvents = eventAggsMap.get(id);
      if (alertCount !== undefined) {
        if (otherEvents !== undefined) {
          return {
            ...cummulative,
            [id]: {
              total: alertCount + otherEvents.total,
              byCategory: {
                alert: alertCount,
                ...otherEvents.byCategory
              }
            }
          };
        } else {
          return {
            ...cummulative,
            [id]: {
              total: alertCount,
              byCategory: {
                alert: alertCount
              }
            }
          };
        }
      } else {
        if (otherEvents !== undefined) {
          return {
            ...cummulative,
            [id]: {
              total: otherEvents.total,
              byCategory: otherEvents.byCategory
            }
          };
        } else {
          return {};
        }
      }
    }, {});
    if (includeHits) {
      return {
        alertIds,
        eventStats
      };
    } else {
      return {
        eventStats
      };
    }
  }
}
exports.StatsQuery = StatsQuery;