"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createWorkloadAggregator = createWorkloadAggregator;
exports.estimateRecurringTaskScheduling = estimateRecurringTaskScheduling;
exports.padBuckets = padBuckets;
exports.summarizeWorkloadStat = summarizeWorkloadStat;
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _lodash = require("lodash");
var _intervals = require("../lib/intervals");
var _monitoring_stats_stream = require("./monitoring_stats_stream");
var _task_run_calcultors = require("./task_run_calcultors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Set an upper bound just in case a customer sets a really high refresh rate
const MAX_SHCEDULE_DENSITY_BUCKETS = 50;
function createWorkloadAggregator(taskStore, elasticsearchAndSOAvailability$, refreshInterval, pollInterval, logger) {
  // calculate scheduleDensity going two refreshIntervals or 1 minute into into the future
  // (the longer of the two)
  const scheduleDensityBuckets = Math.min(Math.max(Math.round(60000 / pollInterval), Math.round(refreshInterval * 2 / pollInterval)), MAX_SHCEDULE_DENSITY_BUCKETS);
  const ownerIdsQueue = (0, _task_run_calcultors.createRunningAveragedStat)(scheduleDensityBuckets);
  return (0, _rxjs.combineLatest)([(0, _rxjs.timer)(0, refreshInterval), elasticsearchAndSOAvailability$]).pipe((0, _operators.filter)(([, areElasticsearchAndSOAvailable]) => areElasticsearchAndSOAvailable), (0, _operators.mergeMap)(() => taskStore.aggregate({
    aggs: {
      taskType: {
        terms: {
          size: 100,
          field: 'task.taskType'
        },
        aggs: {
          status: {
            terms: {
              field: 'task.status'
            }
          }
        }
      },
      schedule: {
        terms: {
          field: 'task.schedule.interval',
          size: 100
        }
      },
      nonRecurringTasks: {
        missing: {
          field: 'task.schedule'
        }
      },
      ownerIds: {
        filter: {
          range: {
            'task.startedAt': {
              gte: 'now-1w/w'
            }
          }
        },
        aggs: {
          ownerIds: {
            cardinality: {
              field: 'task.ownerId'
            }
          }
        }
      },
      idleTasks: {
        filter: {
          term: {
            'task.status': 'idle'
          }
        },
        aggs: {
          scheduleDensity: {
            // create a window of upcoming tasks
            range: {
              field: 'task.runAt',
              ranges: [{
                from: `now`,
                to: `now+${(0, _intervals.asInterval)(scheduleDensityBuckets * pollInterval)}`
              }]
            },
            aggs: {
              // create histogram of scheduling in the window, with each bucket being a polling interval
              histogram: {
                date_histogram: {
                  field: 'task.runAt',
                  fixed_interval: (0, _intervals.asInterval)(pollInterval)
                },
                // break down each bucket in the historgram by schedule
                aggs: {
                  interval: {
                    terms: {
                      field: 'task.schedule.interval'
                    }
                  }
                }
              }
            }
          },
          overdue: {
            filter: {
              range: {
                'task.runAt': {
                  lt: 'now'
                }
              }
            },
            aggs: {
              nonRecurring: {
                missing: {
                  field: 'task.schedule'
                }
              }
            }
          }
        }
      }
    }
  })), (0, _operators.map)(result => {
    var _total$value;
    const {
      aggregations,
      hits: {
        total
      }
    } = result;
    const count = typeof total === 'number' ? total : (_total$value = total === null || total === void 0 ? void 0 : total.value) !== null && _total$value !== void 0 ? _total$value : 0;
    if (!hasAggregations(aggregations)) {
      throw new Error(`Invalid workload: ${JSON.stringify(result)}`);
    }
    const taskTypes = aggregations.taskType.buckets;
    const nonRecurring = aggregations.nonRecurringTasks.doc_count;
    const ownerIds = aggregations.ownerIds.ownerIds.value;
    const {
      overdue: {
        doc_count: overdue,
        nonRecurring: {
          doc_count: overdueNonRecurring
        }
      },
      scheduleDensity: {
        buckets: [scheduleDensity] = []
      } = {}
    } = aggregations.idleTasks;
    const {
      schedules,
      cadence
    } = aggregations.schedule.buckets.reduce((accm, schedule) => {
      const parsedSchedule = {
        interval: schedule.key,
        asSeconds: (0, _intervals.parseIntervalAsSecond)(schedule.key),
        count: schedule.doc_count
      };
      accm.schedules.push(parsedSchedule);
      if (parsedSchedule.asSeconds <= 60) {
        accm.cadence.perMinute += parsedSchedule.count * Math.round(60 / parsedSchedule.asSeconds);
      } else if (parsedSchedule.asSeconds <= 3600) {
        accm.cadence.perHour += parsedSchedule.count * Math.round(3600 / parsedSchedule.asSeconds);
      } else {
        accm.cadence.perDay += parsedSchedule.count * Math.round(3600 * 24 / parsedSchedule.asSeconds);
      }
      return accm;
    }, {
      cadence: {
        perMinute: 0,
        perHour: 0,
        perDay: 0
      },
      schedules: []
    });
    const summary = {
      count,
      task_types: (0, _lodash.mapValues)((0, _lodash.keyBy)(taskTypes, 'key'), ({
        doc_count: docCount,
        status
      }) => {
        return {
          count: docCount,
          status: (0, _lodash.mapValues)((0, _lodash.keyBy)(status.buckets, 'key'), 'doc_count')
        };
      }),
      non_recurring: nonRecurring,
      owner_ids: ownerIdsQueue(ownerIds),
      schedule: schedules.sort((scheduleLeft, scheduleRight) => scheduleLeft.asSeconds - scheduleRight.asSeconds).map(schedule => [schedule.interval, schedule.count]),
      overdue,
      overdue_non_recurring: overdueNonRecurring,
      estimated_schedule_density: padBuckets(scheduleDensityBuckets, pollInterval, scheduleDensity),
      capacity_requirements: {
        per_minute: cadence.perMinute,
        per_hour: cadence.perHour,
        per_day: cadence.perDay
      }
    };
    return {
      key: 'workload',
      value: summary
    };
  }), (0, _operators.catchError)((ex, caught) => {
    logger.error(`[WorkloadAggregator]: ${ex}`);
    // continue to pull values from the same observable but only on the next refreshInterval
    return (0, _rxjs.timer)(refreshInterval).pipe((0, _operators.switchMap)(() => caught));
  }));
}
function padBuckets(scheduleDensityBuckets, pollInterval, scheduleDensity) {
  var _scheduleDensity$hist, _scheduleDensity$hist2;
  // @ts-expect-error cannot infer histogram
  if (scheduleDensity.from && scheduleDensity.to && (_scheduleDensity$hist = scheduleDensity.histogram) !== null && _scheduleDensity$hist !== void 0 && (_scheduleDensity$hist2 = _scheduleDensity$hist.buckets) !== null && _scheduleDensity$hist2 !== void 0 && _scheduleDensity$hist2.length) {
    // @ts-expect-error cannot infer histogram
    const {
      histogram,
      from,
      to
    } = scheduleDensity;
    const firstBucket = histogram.buckets[0].key;
    const lastBucket = histogram.buckets[histogram.buckets.length - 1].key;

    // detect when the first bucket is before the `from` so that we can take that into
    // account by begining the timeline earlier
    // This can happen when you have overdue tasks and Elasticsearch returns their bucket
    // as begining before the `from`
    const firstBucketStartsInThePast = firstBucket - from < 0;
    const bucketsToPadBeforeFirstBucket = firstBucketStartsInThePast ? [] : calculateBucketsBetween(firstBucket, from, pollInterval);
    const bucketsToPadAfterLast = calculateBucketsBetween(lastBucket + pollInterval, firstBucketStartsInThePast ? to - pollInterval : to, pollInterval);
    return estimateRecurringTaskScheduling([...bucketsToPadBeforeFirstBucket, ...histogram.buckets.map(countByIntervalInBucket), ...bucketsToPadAfterLast], pollInterval);
  }
  return new Array(scheduleDensityBuckets).fill(0);
}
function countByIntervalInBucket(bucket) {
  if (bucket.doc_count === 0) {
    return {
      nonRecurring: 0,
      key: bucket.key
    };
  }
  const recurring = [];
  let nonRecurring = bucket.doc_count;
  for (const intervalBucket of bucket.interval.buckets) {
    recurring.push([intervalBucket.doc_count, intervalBucket.key]);
    nonRecurring -= intervalBucket.doc_count;
  }
  return {
    nonRecurring,
    recurring,
    key: bucket.key
  };
}
function calculateBucketsBetween(from, to, interval, bucketInterval = interval) {
  const calcForwardInTime = from < to;

  // as task interval might not divide by the pollInterval (aka the bucket interval)
  // we have to adjust for the "drift" that occurs when estimating when the next
  // bucket the task might actually get scheduled in
  const actualInterval = Math.ceil(interval / bucketInterval) * bucketInterval;
  const buckets = [];
  const toBound = calcForwardInTime ? to : -(to + actualInterval);
  let fromBound = calcForwardInTime ? from : -from;
  while (fromBound < toBound) {
    buckets.push({
      key: fromBound
    });
    fromBound += actualInterval;
  }
  return calcForwardInTime ? buckets : buckets.reverse().map(bucket => {
    bucket.key = Math.abs(bucket.key);
    return bucket;
  });
}
function estimateRecurringTaskScheduling(scheduleDensity, pollInterval) {
  const lastKey = scheduleDensity[scheduleDensity.length - 1].key;
  return scheduleDensity.map((bucket, currentBucketIndex) => {
    var _bucket$nonRecurring;
    for (const [count, interval] of (_bucket$recurring = bucket.recurring) !== null && _bucket$recurring !== void 0 ? _bucket$recurring : []) {
      var _bucket$recurring;
      for (const recurrance of calculateBucketsBetween(bucket.key,
      // `calculateBucketsBetween` uses the `to` as a non-inclusive upper bound
      // but lastKey is a bucket we wish to include
      lastKey + pollInterval, (0, _intervals.parseIntervalAsMillisecond)(interval), pollInterval)) {
        const recurranceBucketIndex = currentBucketIndex + Math.ceil((recurrance.key - bucket.key) / pollInterval);
        if (recurranceBucketIndex < scheduleDensity.length) {
          var _scheduleDensity$recu;
          scheduleDensity[recurranceBucketIndex].nonRecurring = count + ((_scheduleDensity$recu = scheduleDensity[recurranceBucketIndex].nonRecurring) !== null && _scheduleDensity$recu !== void 0 ? _scheduleDensity$recu : 0);
        }
      }
    }
    return (_bucket$nonRecurring = bucket.nonRecurring) !== null && _bucket$nonRecurring !== void 0 ? _bucket$nonRecurring : 0;
  });
}
function summarizeWorkloadStat(workloadStats) {
  return {
    value: {
      ...workloadStats,
      // assume the largest number we've seen of active owner IDs
      // matches the number of active Task Managers in the cluster
      owner_ids: Math.max(...workloadStats.owner_ids)
    },
    status: _monitoring_stats_stream.HealthStatus.OK
  };
}
function hasAggregations(aggregations) {
  var _aggregations$idleTas, _aggregations$idleTas2;
  return !!(aggregations !== null && aggregations !== void 0 && aggregations.taskType && aggregations !== null && aggregations !== void 0 && aggregations.schedule && aggregations !== null && aggregations !== void 0 && (_aggregations$idleTas = aggregations.idleTasks) !== null && _aggregations$idleTas !== void 0 && _aggregations$idleTas.overdue && aggregations !== null && aggregations !== void 0 && (_aggregations$idleTas2 = aggregations.idleTasks) !== null && _aggregations$idleTas2 !== void 0 && _aggregations$idleTas2.scheduleDensity);
}