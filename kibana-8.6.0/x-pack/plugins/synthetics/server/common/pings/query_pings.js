"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryPings = queryPings;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_PAGE_SIZE = 25;

/**
 * This branch of filtering is used for monitors of type `browser`. This monitor
 * type represents an unbounded set of steps, with each `check_group` representing
 * a distinct journey. The document containing the `summary` field is indexed last, and
 * contains the data necessary for querying a journey.
 *
 * Because of this, when querying for "pings", it is important that we treat `browser` summary
 * checks as the "ping" we want. Without this filtering, we will receive >= N pings for a journey
 * of N steps, because an individual step may also contain multiple documents.
 */
const REMOVE_NON_SUMMARY_BROWSER_CHECKS = {
  must_not: [{
    bool: {
      filter: [{
        term: {
          'monitor.type': 'browser'
        }
      }, {
        bool: {
          must_not: [{
            exists: {
              field: 'summary'
            }
          }]
        }
      }]
    }
  }]
};
function isStringArray(value) {
  if (!Array.isArray(value)) return false;
  // are all array items strings
  if (!value.some(s => typeof s !== 'string')) return true;
  throw Error('Excluded locations can only be strings');
}
async function queryPings(params) {
  const {
    uptimeEsClient,
    dateRange: {
      from,
      to
    },
    index,
    monitorId,
    status,
    sort,
    size: sizeParam,
    pageIndex,
    locations,
    excludedLocations
  } = params;
  const size = sizeParam !== null && sizeParam !== void 0 ? sizeParam : DEFAULT_PAGE_SIZE;
  const searchBody = {
    size,
    from: pageIndex !== undefined ? pageIndex * size : 0,
    ...(index ? {
      from: index * size
    } : {}),
    query: {
      bool: {
        filter: [{
          range: {
            '@timestamp': {
              gte: from,
              lte: to
            }
          }
        }, ...(monitorId ? [{
          term: {
            'monitor.id': monitorId
          }
        }] : []), ...(status ? [{
          term: {
            'monitor.status': status
          }
        }] : [])],
        ...REMOVE_NON_SUMMARY_BROWSER_CHECKS
      }
    },
    sort: [{
      '@timestamp': {
        order: sort !== null && sort !== void 0 ? sort : 'desc'
      }
    }],
    ...((locations !== null && locations !== void 0 ? locations : []).length > 0 ? {
      post_filter: {
        terms: {
          'observer.geo.name': locations
        }
      }
    } : {}),
    _source: true,
    fields: []
  };

  // if there are excluded locations, add a clause to the query's filter
  const excludedLocationsArray = excludedLocations && JSON.parse(excludedLocations);
  if (isStringArray(excludedLocationsArray) && excludedLocationsArray.length > 0) {
    searchBody.query.bool.filter.push({
      bool: {
        must_not: [{
          terms: {
            'observer.geo.name': excludedLocationsArray
          }
        }]
      }
    });
  }

  // If fields are queried, only query the subset of asked fields and omit _source
  if (isGetParamsWithFields(params)) {
    searchBody._source = false;
    searchBody.fields = params.fields;
    const {
      body: {
        hits: {
          hits,
          total
        }
      }
    } = await uptimeEsClient.search({
      body: searchBody
    });
    return {
      total: total.value,
      pings: hits.map(doc => params.fieldsExtractorFn(doc))
    };
  }
  const {
    body: {
      hits: {
        hits,
        total
      }
    }
  } = await uptimeEsClient.search({
    body: searchBody
  });
  const pings = hits.map(doc => {
    var _source$http, _source$http$response;
    const {
      _id,
      _source
    } = doc;
    // Calculate here the length of the content string in bytes, this is easier than in client JS, where
    // we don't have access to Buffer.byteLength. There are some hacky ways to do this in the
    // client but this is cleaner.
    const httpBody = _source === null || _source === void 0 ? void 0 : (_source$http = _source.http) === null || _source$http === void 0 ? void 0 : (_source$http$response = _source$http.response) === null || _source$http$response === void 0 ? void 0 : _source$http$response.body;
    if (httpBody && httpBody.content) {
      httpBody.content_bytes = Buffer.byteLength(httpBody.content);
    }
    return {
      ..._source,
      timestamp: _source['@timestamp'],
      docId: _id
    };
  });
  return {
    total: total.value,
    pings
  };
}
function isGetParamsWithFields(params) {
  var _fields;
  return ((_fields = params.fields) === null || _fields === void 0 ? void 0 : _fields.length) > 0;
}