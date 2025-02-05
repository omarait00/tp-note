"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJourneyDetails = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getJourneyDetails = async ({
  uptimeEsClient,
  checkGroup
}) => {
  const baseParams = {
    query: {
      bool: {
        filter: [{
          term: {
            'monitor.check_group': checkGroup
          }
        }, {
          term: {
            'synthetics.type': 'journey/start'
          }
        }]
      }
    },
    size: 1
  };
  const {
    body: thisJourney
  } = await uptimeEsClient.search({
    body: baseParams
  });
  if (thisJourney.hits.hits.length > 0) {
    var _previousJourneyResul, _previousJourneyResul2, _nextJourneyResult$hi, _nextJourneyResult$hi2;
    const {
      _id,
      _source
    } = thisJourney.hits.hits[0];
    const thisJourneySource = Object.assign({
      _id
    }, _source);
    const baseSiblingParams = {
      query: {
        bool: {
          filter: [{
            term: {
              'monitor.id': thisJourneySource.monitor.id
            }
          }, {
            term: {
              'synthetics.type': 'journey/start'
            }
          }]
        }
      },
      _source: ['@timestamp', 'monitor.check_group'],
      size: 1
    };
    const previousParams = {
      ...baseSiblingParams,
      query: {
        bool: {
          filter: [...baseSiblingParams.query.bool.filter, {
            range: {
              '@timestamp': {
                lt: thisJourneySource['@timestamp']
              }
            }
          }]
        }
      },
      sort: [{
        '@timestamp': {
          order: 'desc'
        }
      }]
    };
    const nextParams = {
      ...baseSiblingParams,
      query: {
        bool: {
          filter: [...baseSiblingParams.query.bool.filter, {
            range: {
              '@timestamp': {
                gt: thisJourneySource['@timestamp']
              }
            }
          }]
        }
      },
      sort: [{
        '@timestamp': {
          order: 'asc'
        }
      }]
    };
    const {
      body: previousJourneyResult
    } = await uptimeEsClient.search({
      body: previousParams
    });
    const {
      body: nextJourneyResult
    } = await uptimeEsClient.search({
      body: nextParams
    });
    const previousJourney = (previousJourneyResult === null || previousJourneyResult === void 0 ? void 0 : (_previousJourneyResul = previousJourneyResult.hits) === null || _previousJourneyResul === void 0 ? void 0 : _previousJourneyResul.hits.length) > 0 ? previousJourneyResult === null || previousJourneyResult === void 0 ? void 0 : (_previousJourneyResul2 = previousJourneyResult.hits) === null || _previousJourneyResul2 === void 0 ? void 0 : _previousJourneyResul2.hits[0] : null;
    const nextJourney = (nextJourneyResult === null || nextJourneyResult === void 0 ? void 0 : (_nextJourneyResult$hi = nextJourneyResult.hits) === null || _nextJourneyResult$hi === void 0 ? void 0 : _nextJourneyResult$hi.hits.length) > 0 ? nextJourneyResult === null || nextJourneyResult === void 0 ? void 0 : (_nextJourneyResult$hi2 = nextJourneyResult.hits) === null || _nextJourneyResult$hi2 === void 0 ? void 0 : _nextJourneyResult$hi2.hits[0] : null;
    return {
      timestamp: thisJourneySource['@timestamp'],
      journey: thisJourneySource,
      previous: previousJourney ? {
        checkGroup: previousJourney._source.monitor.check_group,
        timestamp: previousJourney._source['@timestamp']
      } : undefined,
      next: nextJourney ? {
        checkGroup: nextJourney._source.monitor.check_group,
        timestamp: nextJourney._source['@timestamp']
      } : undefined
    };
  } else {
    return null;
  }
};
exports.getJourneyDetails = getJourneyDetails;