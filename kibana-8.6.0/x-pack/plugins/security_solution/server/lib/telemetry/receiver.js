"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetryReceiver = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _helpers = require("./helpers");
var _fetch = require("../../endpoint/routes/resolver/tree/utils/fetch");
var _configuration = require("./configuration");
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class TelemetryReceiver {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "agentClient", void 0);
    (0, _defineProperty2.default)(this, "agentPolicyService", void 0);
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "exceptionListClient", void 0);
    (0, _defineProperty2.default)(this, "soClient", void 0);
    (0, _defineProperty2.default)(this, "kibanaIndex", void 0);
    (0, _defineProperty2.default)(this, "alertsIndex", void 0);
    (0, _defineProperty2.default)(this, "clusterInfo", void 0);
    (0, _defineProperty2.default)(this, "processTreeFetcher", void 0);
    (0, _defineProperty2.default)(this, "maxRecords", 10_000);
    this.logger = logger.get('telemetry_events');
  }
  async start(core, kibanaIndex, alertsIndex, endpointContextService, exceptionListClient) {
    var _endpointContextServi;
    this.kibanaIndex = kibanaIndex;
    this.alertsIndex = alertsIndex;
    this.agentClient = endpointContextService === null || endpointContextService === void 0 ? void 0 : (_endpointContextServi = endpointContextService.getAgentService()) === null || _endpointContextServi === void 0 ? void 0 : _endpointContextServi.asInternalUser;
    this.agentPolicyService = endpointContextService === null || endpointContextService === void 0 ? void 0 : endpointContextService.getAgentPolicyService();
    this.esClient = core === null || core === void 0 ? void 0 : core.elasticsearch.client.asInternalUser;
    this.exceptionListClient = exceptionListClient;
    this.soClient = core === null || core === void 0 ? void 0 : core.savedObjects.createInternalRepository();
    this.clusterInfo = await this.fetchClusterInfo();
    const elasticsearch = core === null || core === void 0 ? void 0 : core.elasticsearch.client;
    this.processTreeFetcher = new _fetch.Fetcher(elasticsearch);
  }
  getClusterInfo() {
    return this.clusterInfo;
  }
  async fetchFleetAgents() {
    var _this$agentClient;
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve fleet agents');
    }
    return (_this$agentClient = this.agentClient) === null || _this$agentClient === void 0 ? void 0 : _this$agentClient.listAgents({
      perPage: this.maxRecords,
      showInactive: true,
      sortField: 'enrolled_at',
      sortOrder: 'desc'
    });
  }
  async fetchEndpointPolicyResponses(executeFrom, executeTo) {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve elastic endpoint policy responses');
    }
    const query = {
      expand_wildcards: ['open', 'hidden'],
      index: `.ds-metrics-endpoint.policy*`,
      ignore_unavailable: false,
      body: {
        size: 0,
        // no query results required - only aggregation quantity
        query: {
          range: {
            '@timestamp': {
              gte: executeFrom,
              lt: executeTo
            }
          }
        },
        aggs: {
          policy_responses: {
            terms: {
              size: this.maxRecords,
              field: 'agent.id'
            },
            aggs: {
              latest_response: {
                top_hits: {
                  size: 1,
                  sort: [{
                    '@timestamp': {
                      order: 'desc'
                    }
                  }]
                }
              }
            }
          }
        }
      }
    };
    return this.esClient.search(query, {
      meta: true
    });
  }
  async fetchEndpointMetrics(executeFrom, executeTo) {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve elastic endpoint metrics');
    }
    const query = {
      expand_wildcards: ['open', 'hidden'],
      index: _constants.ENDPOINT_METRICS_INDEX,
      ignore_unavailable: false,
      body: {
        size: 0,
        // no query results required - only aggregation quantity
        query: {
          range: {
            '@timestamp': {
              gte: executeFrom,
              lt: executeTo
            }
          }
        },
        aggs: {
          endpoint_agents: {
            terms: {
              field: 'agent.id',
              size: this.maxRecords
            },
            aggs: {
              latest_metrics: {
                top_hits: {
                  size: 1,
                  sort: [{
                    '@timestamp': {
                      order: 'desc'
                    }
                  }]
                }
              }
            }
          },
          endpoint_count: {
            cardinality: {
              field: 'agent.id'
            }
          }
        }
      }
    };
    return this.esClient.search(query, {
      meta: true
    });
  }
  async fetchEndpointMetadata(executeFrom, executeTo) {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve elastic endpoint metrics');
    }
    const query = {
      expand_wildcards: ['open', 'hidden'],
      index: `.ds-metrics-endpoint.metadata-*`,
      ignore_unavailable: false,
      body: {
        size: 0,
        // no query results required - only aggregation quantity
        query: {
          range: {
            '@timestamp': {
              gte: executeFrom,
              lt: executeTo
            }
          }
        },
        aggs: {
          endpoint_metadata: {
            terms: {
              field: 'agent.id',
              size: this.maxRecords
            },
            aggs: {
              latest_metadata: {
                top_hits: {
                  size: 1,
                  sort: [{
                    '@timestamp': {
                      order: 'desc'
                    }
                  }]
                }
              }
            }
          }
        }
      }
    };
    return this.esClient.search(query, {
      meta: true
    });
  }
  async fetchDiagnosticAlerts(executeFrom, executeTo) {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve diagnostic alerts');
    }
    const query = {
      expand_wildcards: ['open', 'hidden'],
      index: '.logs-endpoint.diagnostic.collection-*',
      ignore_unavailable: true,
      size: _configuration.telemetryConfiguration.telemetry_max_buffer_size,
      body: {
        query: {
          range: {
            'event.ingested': {
              gte: executeFrom,
              lt: executeTo
            }
          }
        },
        sort: [{
          'event.ingested': {
            order: 'desc'
          }
        }]
      }
    };
    return this.esClient.search(query);
  }
  async fetchPolicyConfigs(id) {
    var _this$agentPolicyServ;
    if (this.soClient === undefined || this.soClient === null) {
      throw Error('saved object client is unavailable: cannot retrieve endpoint policy configurations');
    }
    return (_this$agentPolicyServ = this.agentPolicyService) === null || _this$agentPolicyServ === void 0 ? void 0 : _this$agentPolicyServ.get(this.soClient, id);
  }
  async fetchTrustedApplications() {
    var _results$total, _results$page, _results$per_page;
    if ((this === null || this === void 0 ? void 0 : this.exceptionListClient) === undefined || (this === null || this === void 0 ? void 0 : this.exceptionListClient) === null) {
      throw Error('exception list client is unavailable: cannot retrieve trusted applications');
    }

    // Ensure list is created if it does not exist
    await this.exceptionListClient.createTrustedAppsList();
    const results = await this.exceptionListClient.findExceptionListItem({
      listId: _securitysolutionListConstants.ENDPOINT_TRUSTED_APPS_LIST_ID,
      page: 1,
      perPage: 10_000,
      filter: undefined,
      namespaceType: 'agnostic',
      sortField: 'name',
      sortOrder: 'asc'
    });
    return {
      data: results === null || results === void 0 ? void 0 : results.data.map(_helpers.trustedApplicationToTelemetryEntry),
      total: (_results$total = results === null || results === void 0 ? void 0 : results.total) !== null && _results$total !== void 0 ? _results$total : 0,
      page: (_results$page = results === null || results === void 0 ? void 0 : results.page) !== null && _results$page !== void 0 ? _results$page : 1,
      per_page: (_results$per_page = results === null || results === void 0 ? void 0 : results.per_page) !== null && _results$per_page !== void 0 ? _results$per_page : this.maxRecords
    };
  }
  async fetchEndpointList(listId) {
    var _results$data$map, _results$total2, _results$page2, _results$per_page2;
    if ((this === null || this === void 0 ? void 0 : this.exceptionListClient) === undefined || (this === null || this === void 0 ? void 0 : this.exceptionListClient) === null) {
      throw Error('exception list client is unavailable: could not retrieve trusted applications');
    }

    // Ensure list is created if it does not exist
    await this.exceptionListClient.createEndpointList();
    const results = await this.exceptionListClient.findExceptionListItem({
      listId,
      page: 1,
      perPage: this.maxRecords,
      filter: undefined,
      namespaceType: 'agnostic',
      sortField: 'name',
      sortOrder: 'asc'
    });
    return {
      data: (_results$data$map = results === null || results === void 0 ? void 0 : results.data.map(_helpers.exceptionListItemToTelemetryEntry)) !== null && _results$data$map !== void 0 ? _results$data$map : [],
      total: (_results$total2 = results === null || results === void 0 ? void 0 : results.total) !== null && _results$total2 !== void 0 ? _results$total2 : 0,
      page: (_results$page2 = results === null || results === void 0 ? void 0 : results.page) !== null && _results$page2 !== void 0 ? _results$page2 : 1,
      per_page: (_results$per_page2 = results === null || results === void 0 ? void 0 : results.per_page) !== null && _results$per_page2 !== void 0 ? _results$per_page2 : this.maxRecords
    };
  }

  /**
   * Gets the elastic rules which are the rules that have immutable set to true and are of a particular rule type
   * @returns The elastic rules
   */
  async fetchDetectionRules() {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve detection rules');
    }
    const query = {
      expand_wildcards: ['open', 'hidden'],
      index: `${this.kibanaIndex}*`,
      ignore_unavailable: true,
      body: {
        size: this.maxRecords,
        query: {
          bool: {
            must: [{
              bool: {
                filter: {
                  terms: {
                    'alert.alertTypeId': [_securitysolutionRules.SIGNALS_ID, _securitysolutionRules.EQL_RULE_TYPE_ID, _securitysolutionRules.ML_RULE_TYPE_ID, _securitysolutionRules.QUERY_RULE_TYPE_ID, _securitysolutionRules.SAVED_QUERY_RULE_TYPE_ID, _securitysolutionRules.INDICATOR_RULE_TYPE_ID, _securitysolutionRules.THRESHOLD_RULE_TYPE_ID, _securitysolutionRules.NEW_TERMS_RULE_TYPE_ID]
                  }
                }
              }
            }, {
              bool: {
                filter: {
                  terms: {
                    'alert.params.immutable': [true]
                  }
                }
              }
            }]
          }
        }
      }
    };
    return this.esClient.search(query, {
      meta: true
    });
  }
  async fetchDetectionExceptionList(listId, ruleVersion) {
    var _this$exceptionListCl, _results$data$map2, _results$total3, _results$page3, _results$per_page3;
    if ((this === null || this === void 0 ? void 0 : this.exceptionListClient) === undefined || (this === null || this === void 0 ? void 0 : this.exceptionListClient) === null) {
      throw Error('exception list client is unavailable: could not retrieve trusted applications');
    }

    // Ensure list is created if it does not exist
    await this.exceptionListClient.createTrustedAppsList();
    const results = await ((_this$exceptionListCl = this.exceptionListClient) === null || _this$exceptionListCl === void 0 ? void 0 : _this$exceptionListCl.findExceptionListsItem({
      listId: [listId],
      filter: [],
      perPage: this.maxRecords,
      page: 1,
      sortField: 'exception-list.created_at',
      sortOrder: 'desc',
      namespaceType: ['single']
    }));
    return {
      data: (_results$data$map2 = results === null || results === void 0 ? void 0 : results.data.map(r => (0, _helpers.ruleExceptionListItemToTelemetryEvent)(r, ruleVersion))) !== null && _results$data$map2 !== void 0 ? _results$data$map2 : [],
      total: (_results$total3 = results === null || results === void 0 ? void 0 : results.total) !== null && _results$total3 !== void 0 ? _results$total3 : 0,
      page: (_results$page3 = results === null || results === void 0 ? void 0 : results.page) !== null && _results$page3 !== void 0 ? _results$page3 : 1,
      per_page: (_results$per_page3 = results === null || results === void 0 ? void 0 : results.per_page) !== null && _results$per_page3 !== void 0 ? _results$per_page3 : this.maxRecords
    };
  }

  /**
   * Fetch an overview of detection rule alerts over the last 3 hours.
   * Filters out custom rules and endpoint rules.
   * @returns total of alerts by rules
   */
  async fetchPrebuiltRuleAlerts() {
    var _response$body, _aggregations$prebuil;
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve pre-built rule alerts');
    }
    const query = {
      expand_wildcards: ['open', 'hidden'],
      index: `${this.alertsIndex}*`,
      ignore_unavailable: true,
      body: {
        size: 1_000,
        _source: {
          exclude: ['message', 'kibana.alert.rule.note', 'kibana.alert.rule.parameters.note', 'powershell.file.script_block_text']
        },
        query: {
          bool: {
            filter: [{
              bool: {
                should: [{
                  bool: {
                    must_not: {
                      bool: {
                        should: [{
                          match_phrase: {
                            'kibana.alert.rule.name': 'Malware Prevention Alert'
                          }
                        }]
                      }
                    }
                  }
                }, {
                  bool: {
                    must_not: {
                      bool: {
                        should: [{
                          match_phrase: {
                            'kibana.alert.rule.name': 'Malware Detection Alert'
                          }
                        }]
                      }
                    }
                  }
                }, {
                  bool: {
                    must_not: {
                      bool: {
                        should: [{
                          match_phrase: {
                            'kibana.alert.rule.name': 'Ransomware Prevention Alert'
                          }
                        }]
                      }
                    }
                  }
                }, {
                  bool: {
                    must_not: {
                      bool: {
                        should: [{
                          match_phrase: {
                            'kibana.alert.rule.name': 'Ransomware Detection Alert'
                          }
                        }]
                      }
                    }
                  }
                }]
              }
            }, {
              bool: {
                should: [{
                  match_phrase: {
                    'kibana.alert.rule.parameters.immutable': 'true'
                  }
                }]
              }
            }, {
              range: {
                '@timestamp': {
                  gte: 'now-1h',
                  lte: 'now'
                }
              }
            }]
          }
        },
        aggs: {
          prebuilt_rule_alert_count: {
            cardinality: {
              field: 'event.id'
            }
          }
        }
      }
    };
    const response = await this.esClient.search(query, {
      meta: true
    });
    (0, _helpers.tlog)(this.logger, `received prebuilt alerts: (${response.body.hits.hits.length})`);
    const telemetryEvents = response.body.hits.hits.flatMap(h => h._source != null ? [h._source] : []);
    const aggregations = (_response$body = response.body) === null || _response$body === void 0 ? void 0 : _response$body.aggregations;
    return {
      events: telemetryEvents,
      count: (_aggregations$prebuil = aggregations === null || aggregations === void 0 ? void 0 : aggregations.prebuilt_rule_alert_count.value) !== null && _aggregations$prebuil !== void 0 ? _aggregations$prebuil : 0
    };
  }
  async fetchTimelineEndpointAlerts(interval) {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve cluster infomation');
    }
    const query = {
      expand_wildcards: ['open', 'hidden'],
      index: `${this.alertsIndex}*`,
      ignore_unavailable: true,
      body: {
        size: 30,
        query: {
          bool: {
            filter: [{
              bool: {
                should: [{
                  match_phrase: {
                    'event.module': 'endpoint'
                  }
                }]
              }
            }, {
              bool: {
                should: [{
                  match_phrase: {
                    'kibana.alert.rule.parameters.immutable': 'true'
                  }
                }]
              }
            }, {
              range: {
                '@timestamp': {
                  gte: `now-${interval}h`,
                  lte: 'now'
                }
              }
            }]
          }
        },
        aggs: {
          endpoint_alert_count: {
            cardinality: {
              field: 'event.id'
            }
          }
        }
      }
    };
    return this.esClient.search(query);
  }
  async buildProcessTree(entityId, resolverSchema, startOfDay, endOfDay) {
    if (this.processTreeFetcher === undefined || this.processTreeFetcher === null) {
      throw Error('resolver tree builder is unavailable: cannot build encoded endpoint event graph');
    }
    const request = {
      ancestors: 200,
      descendants: 500,
      timeRange: {
        from: startOfDay,
        to: endOfDay
      },
      schema: resolverSchema,
      nodes: [entityId],
      indexPatterns: [`${this.alertsIndex}*`, 'logs-*'],
      descendantLevels: 20
    };
    return this.processTreeFetcher.tree(request, true);
  }
  async fetchTimelineEvents(nodeIds) {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve timeline endpoint events');
    }
    const query = {
      expand_wildcards: ['open', 'hidden'],
      index: [`${this.alertsIndex}*`, 'logs-*'],
      ignore_unavailable: true,
      body: {
        size: 100,
        _source: {
          include: ['@timestamp', 'process', 'event', 'file', 'network', 'dns', 'kibana.rule.alert.uuid']
        },
        query: {
          bool: {
            filter: [{
              terms: {
                'process.entity_id': nodeIds
              }
            }, {
              term: {
                'event.category': 'process'
              }
            }]
          }
        }
      }
    };
    return this.esClient.search(query);
  }
  async fetchValueListMetaData(interval) {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve diagnostic alerts');
    }
    const listQuery = {
      expand_wildcards: ['open', 'hidden'],
      index: '.lists-*',
      ignore_unavailable: true,
      body: {
        size: 0,
        // no query results required - only aggregation quantity
        aggs: {
          total_value_list_count: {
            cardinality: {
              field: 'name'
            }
          },
          type_breakdown: {
            terms: {
              field: 'type',
              size: 50
            }
          }
        }
      }
    };
    const itemQuery = {
      expand_wildcards: ['open', 'hidden'],
      index: '.items-*',
      ignore_unavailable: true,
      body: {
        size: 0,
        // no query results required - only aggregation quantity
        aggs: {
          value_list_item_count: {
            terms: {
              field: 'list_id',
              size: 100
            }
          }
        }
      }
    };
    const exceptionListQuery = {
      expand_wildcards: ['open', 'hidden'],
      index: `${this.kibanaIndex}*`,
      ignore_unavailable: true,
      body: {
        size: 0,
        // no query results required - only aggregation quantity
        query: {
          bool: {
            must: [{
              match: {
                'exception-list.entries.type': 'list'
              }
            }]
          }
        },
        aggs: {
          vl_included_in_exception_lists_count: {
            cardinality: {
              field: 'exception-list.entries.list.id'
            }
          }
        }
      }
    };
    const indicatorMatchRuleQuery = {
      expand_wildcards: ['open', 'hidden'],
      index: `${this.kibanaIndex}*`,
      ignore_unavailable: true,
      body: {
        size: 0,
        query: {
          bool: {
            must: [{
              prefix: {
                'alert.params.threatIndex': '.items'
              }
            }]
          }
        },
        aggs: {
          vl_used_in_indicator_match_rule_count: {
            cardinality: {
              field: 'alert.params.ruleId'
            }
          }
        }
      }
    };
    const [listMetrics, itemMetrics, exceptionListMetrics, indicatorMatchMetrics] = await Promise.all([this.esClient.search(listQuery), this.esClient.search(itemQuery), this.esClient.search(exceptionListQuery), this.esClient.search(indicatorMatchRuleQuery)]);
    const listMetricsResponse = listMetrics;
    const itemMetricsResponse = itemMetrics;
    const exceptionListMetricsResponse = exceptionListMetrics;
    const indicatorMatchMetricsResponse = indicatorMatchMetrics;
    return (0, _helpers.metricsResponseToValueListMetaData)({
      listMetricsResponse,
      itemMetricsResponse,
      exceptionListMetricsResponse,
      indicatorMatchMetricsResponse
    });
  }
  async fetchClusterInfo() {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve cluster infomation');
    }

    // @ts-expect-error version.build_date is of type estypes.DateTime
    return this.esClient.info();
  }
  async fetchLicenseInfo() {
    if (this.esClient === undefined || this.esClient === null) {
      throw Error('elasticsearch client is unavailable: cannot retrieve license information');
    }
    try {
      const ret = await this.esClient.transport.request({
        method: 'GET',
        path: '/_license',
        querystring: {
          local: true
        }
      });
      return ret.license;
    } catch (err) {
      (0, _helpers.tlog)(this.logger, `failed retrieving license: ${err}`);
      return undefined;
    }
  }
  copyLicenseFields(lic) {
    return {
      uid: lic.uid,
      status: lic.status,
      type: lic.type,
      ...(lic.issued_to ? {
        issued_to: lic.issued_to
      } : {}),
      ...(lic.issuer ? {
        issuer: lic.issuer
      } : {})
    };
  }
}
exports.TelemetryReceiver = TelemetryReceiver;