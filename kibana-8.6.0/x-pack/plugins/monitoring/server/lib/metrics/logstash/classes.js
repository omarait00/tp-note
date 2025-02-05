"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogstashPipelineThroughputMetric = exports.LogstashPipelineQueueSizeMetric = exports.LogstashPipelineNodeCountMetric = exports.LogstashMetric = exports.LogstashEventsRateMetric = exports.LogstashEventsRateClusterMetric = exports.LogstashEventsLatencyMetric = exports.LogstashEventsLatencyClusterMetric = exports.LogstashClusterMetric = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = _interopRequireDefault(require("lodash"));
var _i18n = require("@kbn/i18n");
var _classes = require("../classes");
var _formatting = require("../../../../common/formatting");
var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

const msTimeUnitLabel = _i18n.i18n.translate('xpack.monitoring.metrics.logstash.msTimeUnitLabel', {
  defaultMessage: 'ms'
});
const perSecondUnitLabel = _i18n.i18n.translate('xpack.monitoring.metrics.logstash.perSecondUnitLabel', {
  defaultMessage: '/s'
});
class LogstashClusterMetric extends _classes.ClusterMetric {
  constructor(opts) {
    super({
      ...opts,
      app: 'logstash',
      ...LogstashClusterMetric.getMetricFields()
    });
  }
  static getMetricFields() {
    return {
      uuidField: 'cluster_uuid',
      timestampField: 'logstash_stats.timestamp'
    };
  }
}
exports.LogstashClusterMetric = LogstashClusterMetric;
class LogstashEventsLatencyClusterMetric extends LogstashClusterMetric {
  constructor(opts) {
    super({
      ...opts,
      format: _formatting.LARGE_FLOAT,
      metricAgg: 'max',
      units: msTimeUnitLabel
    });
    (0, _defineProperty2.default)(this, "calculation", bucket => {
      const timeInMillisDeriv = _lodash.default.get(bucket, 'events_time_in_millis_deriv.normalized_value', null);
      const totalEventsDeriv = _lodash.default.get(bucket, 'events_total_deriv.normalized_value', null);
      return _classes.Metric.calculateLatency(timeInMillisDeriv, totalEventsDeriv);
    });
    this.aggs = {
      logstash_uuids: {
        terms: {
          field: 'logstash_stats.logstash.uuid',
          size: 1000
        },
        aggs: {
          events_time_in_millis_per_node: {
            max: {
              field: 'logstash_stats.events.duration_in_millis'
            }
          },
          events_total_per_node: {
            max: {
              field: 'logstash_stats.events.out'
            }
          }
        }
      },
      events_time_in_millis: {
        sum_bucket: {
          buckets_path: 'logstash_uuids>events_time_in_millis_per_node',
          gap_policy: 'skip'
        }
      },
      events_total: {
        sum_bucket: {
          buckets_path: 'logstash_uuids>events_total_per_node',
          gap_policy: 'skip'
        }
      },
      events_time_in_millis_deriv: {
        derivative: {
          buckets_path: 'events_time_in_millis',
          gap_policy: 'skip',
          unit: _constants.NORMALIZED_DERIVATIVE_UNIT
        }
      },
      events_total_deriv: {
        derivative: {
          buckets_path: 'events_total',
          gap_policy: 'skip',
          unit: _constants.NORMALIZED_DERIVATIVE_UNIT
        }
      }
    };
  }
}
exports.LogstashEventsLatencyClusterMetric = LogstashEventsLatencyClusterMetric;
class LogstashEventsRateClusterMetric extends LogstashClusterMetric {
  constructor(opts) {
    super({
      ...opts,
      derivative: true,
      format: _formatting.LARGE_FLOAT,
      metricAgg: 'max',
      units: perSecondUnitLabel
    });
    this.aggs = {
      logstash_uuids: {
        terms: {
          field: 'logstash_stats.logstash.uuid',
          size: 1000
        },
        aggs: {
          event_rate_per_node: {
            max: {
              field: this.field
            }
          }
        }
      },
      event_rate: {
        sum_bucket: {
          buckets_path: 'logstash_uuids>event_rate_per_node',
          gap_policy: 'skip'
        }
      },
      metric_deriv: {
        derivative: {
          buckets_path: 'event_rate',
          gap_policy: 'skip',
          unit: _constants.NORMALIZED_DERIVATIVE_UNIT
        }
      }
    };
  }
}
exports.LogstashEventsRateClusterMetric = LogstashEventsRateClusterMetric;
class LogstashMetric extends _classes.Metric {
  constructor(opts) {
    super({
      ...opts,
      app: 'logstash',
      ...LogstashMetric.getMetricFields()
    });
  }
  static getMetricFields() {
    return {
      uuidField: 'logstash_stats.logstash.uuid',
      timestampField: 'logstash_stats.timestamp'
    };
  }
}
exports.LogstashMetric = LogstashMetric;
class LogstashEventsLatencyMetric extends LogstashMetric {
  constructor(opts) {
    super({
      ...opts,
      format: _formatting.LARGE_FLOAT,
      metricAgg: 'sum',
      units: msTimeUnitLabel
    });
    this.aggs = {
      events_time_in_millis: {
        max: {
          field: 'logstash_stats.events.duration_in_millis'
        }
      },
      events_total: {
        max: {
          field: 'logstash_stats.events.out'
        }
      },
      events_time_in_millis_deriv: {
        derivative: {
          buckets_path: 'events_time_in_millis',
          gap_policy: 'skip',
          unit: _constants.NORMALIZED_DERIVATIVE_UNIT
        }
      },
      events_total_deriv: {
        derivative: {
          buckets_path: 'events_total',
          gap_policy: 'skip',
          unit: _constants.NORMALIZED_DERIVATIVE_UNIT
        }
      }
    };
    this.calculation = bucket => {
      const timeInMillisDeriv = _lodash.default.get(bucket, 'events_time_in_millis_deriv.normalized_value', null);
      const totalEventsDeriv = _lodash.default.get(bucket, 'events_total_deriv.normalized_value', null);
      return _classes.Metric.calculateLatency(timeInMillisDeriv, totalEventsDeriv);
    };
  }
}
exports.LogstashEventsLatencyMetric = LogstashEventsLatencyMetric;
class LogstashEventsRateMetric extends LogstashMetric {
  constructor(opts) {
    super({
      ...opts,
      derivative: true,
      format: _formatting.LARGE_FLOAT,
      metricAgg: 'max',
      units: perSecondUnitLabel
    });
  }
}
exports.LogstashEventsRateMetric = LogstashEventsRateMetric;
class LogstashPipelineQueueSizeMetric extends LogstashMetric {
  constructor(opts) {
    super({
      ...opts
    });
    this.dateHistogramSubAggs = {
      pipelines: {
        nested: {
          path: 'logstash_stats.pipelines'
        },
        aggs: {
          pipeline_by_id: {
            terms: {
              field: 'logstash_stats.pipelines.id',
              size: 1000
            },
            aggs: {
              queue_size_field: {
                max: {
                  field: this.field
                }
              }
            }
          },
          total_queue_size_for_node: {
            sum_bucket: {
              buckets_path: 'pipeline_by_id>queue_size_field'
            }
          }
        }
      },
      pipelines_mb: {
        nested: {
          path: 'logstash.node.stats.pipelines'
        },
        aggs: {
          pipeline_by_id: {
            terms: {
              field: 'logstash.node.stats.pipelines.id',
              size: 1000
            },
            aggs: {
              queue_size_field: {
                max: {
                  field: this.mbField
                }
              }
            }
          },
          total_queue_size_for_node: {
            sum_bucket: {
              buckets_path: 'pipeline_by_id>queue_size_field'
            }
          }
        }
      }
    };
    this.calculation = bucket => {
      const legacyQueueSize = _lodash.default.get(bucket, 'pipelines.total_queue_size_for_node.value');
      const mbQueueSize = _lodash.default.get(bucket, 'pipelines_mb.total_queue_size_for_node.value');
      return Math.max(legacyQueueSize, mbQueueSize);
    };
  }
}
exports.LogstashPipelineQueueSizeMetric = LogstashPipelineQueueSizeMetric;
class LogstashPipelineThroughputMetric extends LogstashMetric {
  constructor(opts) {
    super({
      ...opts,
      derivative: true
    });
    this.getDateHistogramSubAggs = ({
      pipeline
    }) => {
      return {
        metric_deriv: {
          derivative: {
            buckets_path: 'sum',
            gap_policy: 'skip',
            unit: _constants.NORMALIZED_DERIVATIVE_UNIT
          }
        },
        metric_mb_deriv: {
          derivative: {
            buckets_path: 'sum_mb',
            gap_policy: 'skip',
            unit: _constants.NORMALIZED_DERIVATIVE_UNIT
          }
        },
        sum: {
          sum_bucket: {
            buckets_path: 'by_node_id>nest>pipeline>events_stats'
          }
        },
        sum_mb: {
          sum_bucket: {
            buckets_path: 'by_node_id>nest_mb>pipeline>events_stats'
          }
        },
        by_node_id: {
          terms: {
            field: 'logstash_stats.logstash.uuid',
            size: 1000,
            include: pipeline.uuids
          },
          aggs: {
            nest: {
              nested: {
                path: 'logstash_stats.pipelines'
              },
              aggs: {
                pipeline: {
                  filter: {
                    term: {
                      'logstash_stats.pipelines.id': pipeline.id
                    }
                  },
                  aggs: {
                    events_stats: {
                      max: {
                        field: this.field
                      }
                    }
                  }
                }
              }
            },
            nest_mb: {
              nested: {
                path: 'logstash.node.stats.pipelines'
              },
              aggs: {
                pipeline: {
                  filter: {
                    term: {
                      'logstash.node.stats.pipelines.id': pipeline.id
                    }
                  },
                  aggs: {
                    events_stats: {
                      max: {
                        field: this.mbField
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
    };
  }
}
exports.LogstashPipelineThroughputMetric = LogstashPipelineThroughputMetric;
class LogstashPipelineNodeCountMetric extends LogstashMetric {
  constructor(opts) {
    super({
      ...opts,
      derivative: false
    });
    this.getDateHistogramSubAggs = ({
      pageOfPipelines
    }) => {
      const termAggExtras = {
        include: []
      };
      if (pageOfPipelines) {
        termAggExtras.include = pageOfPipelines.map(pipeline => pipeline.id);
      }
      return {
        pipelines_nested: {
          nested: {
            path: 'logstash_stats.pipelines'
          },
          aggs: {
            by_pipeline_id: {
              terms: {
                field: 'logstash_stats.pipelines.id',
                size: 1000,
                ...termAggExtras
              },
              aggs: {
                to_root: {
                  reverse_nested: {},
                  aggs: {
                    node_count: {
                      cardinality: {
                        field: this.field
                      }
                    }
                  }
                }
              }
            }
          }
        },
        pipelines_mb_nested: {
          nested: {
            path: 'logstash.node.stats.pipelines'
          },
          aggs: {
            by_pipeline_id: {
              terms: {
                field: 'logstash.node.stats.pipelines.id',
                size: 1000,
                ...termAggExtras
              },
              aggs: {
                to_root: {
                  reverse_nested: {},
                  aggs: {
                    node_count: {
                      cardinality: {
                        field: this.field
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
    };
    this.calculation = bucket => {
      const pipelineNodesCounts = {};
      const legacyPipelineBuckets = _lodash.default.get(bucket, 'pipelines_nested.by_pipeline_id.buckets', []);
      const mbPiplineBuckets = _lodash.default.get(bucket, 'pipelines_mb_nested.by_pipeline_id.buckets', []);
      const pipelineBuckets = legacyPipelineBuckets.length ? legacyPipelineBuckets : mbPiplineBuckets;
      pipelineBuckets.forEach(pipelineBucket => {
        pipelineNodesCounts[pipelineBucket.key] = _lodash.default.get(pipelineBucket, 'to_root.node_count.value');
      });
      return pipelineNodesCounts;
    };
  }
}
exports.LogstashPipelineNodeCountMetric = LogstashPipelineNodeCountMetric;