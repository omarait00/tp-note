"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetadataSortMethod = void 0;
exports.buildUnitedIndexQuery = buildUnitedIndexQuery;
exports.getESQueryHostMetadataByFleetAgentIds = getESQueryHostMetadataByFleetAgentIds;
exports.getESQueryHostMetadataByID = getESQueryHostMetadataByID;
exports.getESQueryHostMetadataByIDs = getESQueryHostMetadataByIDs;
exports.kibanaRequestToMetadataListESQuery = kibanaRequestToMetadataListESQuery;
var _esQuery = require("@kbn/es-query");
var _constants = require("../../../../common/endpoint/constants");
var _agent_status = require("./support/agent_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * 00000000-0000-0000-0000-000000000000 is initial Elastic Agent id sent by Endpoint before policy is configured
 * 11111111-1111-1111-1111-111111111111 is Elastic Agent id sent by Endpoint when policy does not contain an id
 */
const IGNORED_ELASTIC_AGENT_IDS = ['00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'];
// sort using either event.created, or HostDetails.event.created,
// depending on whichever exists. This works for QueryStrat v1 and v2, and the v2+ schema change.
// using unmapped_type avoids errors when the given field doesn't exist, and sets to the 0-value for that type
// effectively ignoring it
// https://www.elastic.co/guide/en/elasticsearch/reference/current/sort-search-results.html#_ignoring_unmapped_fields
const MetadataSortMethod = [{
  'event.created': {
    order: 'desc',
    unmapped_type: 'date'
  }
}, {
  'HostDetails.event.created': {
    order: 'desc',
    unmapped_type: 'date'
  }
}];
exports.MetadataSortMethod = MetadataSortMethod;
async function kibanaRequestToMetadataListESQuery(queryBuilderOptions) {
  var _queryBuilderOptions$;
  return {
    body: {
      query: buildQueryBody(queryBuilderOptions === null || queryBuilderOptions === void 0 ? void 0 : queryBuilderOptions.kuery, IGNORED_ELASTIC_AGENT_IDS.concat((_queryBuilderOptions$ = queryBuilderOptions === null || queryBuilderOptions === void 0 ? void 0 : queryBuilderOptions.unenrolledAgentIds) !== null && _queryBuilderOptions$ !== void 0 ? _queryBuilderOptions$ : []), queryBuilderOptions === null || queryBuilderOptions === void 0 ? void 0 : queryBuilderOptions.statusAgentIds),
      track_total_hits: true,
      sort: MetadataSortMethod
    },
    from: queryBuilderOptions.page * queryBuilderOptions.pageSize,
    size: queryBuilderOptions.pageSize,
    index: _constants.metadataCurrentIndexPattern
  };
}
function buildQueryBody(kuery = '', unerolledAgentIds, statusAgentIds) {
  // the filtered properties may be preceded by 'HostDetails' under an older index mapping
  const filterUnenrolledAgents = unerolledAgentIds && unerolledAgentIds.length > 0 ? {
    must_not: [{
      terms: {
        'elastic.agent.id': unerolledAgentIds
      }
    },
    // OR
    {
      terms: {
        'HostDetails.elastic.agent.id': unerolledAgentIds
      }
    }]
  } : null;
  const filterStatusAgents = statusAgentIds && statusAgentIds.length ? {
    filter: [{
      bool: {
        // OR's the two together
        should: [{
          terms: {
            'elastic.agent.id': statusAgentIds
          }
        }, {
          terms: {
            'HostDetails.elastic.agent.id': statusAgentIds
          }
        }]
      }
    }]
  } : null;
  const idFilter = {
    bool: {
      ...filterUnenrolledAgents,
      ...filterStatusAgents
    }
  };
  if (kuery) {
    const kqlQuery = (0, _esQuery.toElasticsearchQuery)((0, _esQuery.fromKueryExpression)(kuery));
    const q = [];
    if (filterUnenrolledAgents || filterStatusAgents) {
      q.push(idFilter);
    }
    q.push({
      ...kqlQuery
    });
    return {
      bool: {
        must: q
      }
    };
  }
  return filterUnenrolledAgents || filterStatusAgents ? idFilter : {
    match_all: {}
  };
}
function getESQueryHostMetadataByID(agentID) {
  return {
    body: {
      query: {
        bool: {
          filter: [{
            bool: {
              should: [{
                term: {
                  'agent.id': agentID
                }
              }, {
                term: {
                  'HostDetails.agent.id': agentID
                }
              }]
            }
          }]
        }
      },
      sort: MetadataSortMethod,
      size: 1
    },
    index: _constants.metadataCurrentIndexPattern
  };
}
function getESQueryHostMetadataByFleetAgentIds(fleetAgentIds) {
  return {
    body: {
      query: {
        bool: {
          filter: [{
            bool: {
              should: [{
                terms: {
                  'elastic.agent.id': fleetAgentIds
                }
              }]
            }
          }]
        }
      },
      sort: MetadataSortMethod
    },
    index: _constants.metadataCurrentIndexPattern
  };
}
function getESQueryHostMetadataByIDs(agentIDs) {
  return {
    body: {
      query: {
        bool: {
          filter: [{
            bool: {
              should: [{
                terms: {
                  'agent.id': agentIDs
                }
              }, {
                terms: {
                  'HostDetails.agent.id': agentIDs
                }
              }]
            }
          }]
        }
      },
      sort: MetadataSortMethod
    },
    index: _constants.metadataCurrentIndexPattern
  };
}
async function buildUnitedIndexQuery(queryOptions, endpointPolicyIds = []) {
  const {
    page = _constants.ENDPOINT_DEFAULT_PAGE,
    pageSize = _constants.ENDPOINT_DEFAULT_PAGE_SIZE,
    hostStatuses = [],
    kuery = ''
  } = queryOptions || {};
  const statusesKuery = (0, _agent_status.buildStatusesKuery)(hostStatuses);
  const filterIgnoredAgents = {
    must_not: {
      terms: {
        'agent.id': IGNORED_ELASTIC_AGENT_IDS
      }
    }
  };
  const filterEndpointPolicyAgents = {
    filter: [
    // must contain an endpoint policy id
    {
      terms: {
        'united.agent.policy_id': endpointPolicyIds
      }
    },
    // doc contains both agent and metadata
    {
      exists: {
        field: 'united.endpoint.agent.id'
      }
    }, {
      exists: {
        field: 'united.agent.agent.id'
      }
    },
    // agent is enrolled
    {
      term: {
        'united.agent.active': {
          value: true
        }
      }
    }]
  };
  const idFilter = {
    bool: {
      ...filterIgnoredAgents,
      ...filterEndpointPolicyAgents
    }
  };
  let query = idFilter;
  if (statusesKuery || kuery) {
    const kqlQuery = (0, _esQuery.toElasticsearchQuery)((0, _esQuery.fromKueryExpression)(kuery !== null && kuery !== void 0 ? kuery : ''));
    const q = [];
    if (filterIgnoredAgents || filterEndpointPolicyAgents) {
      q.push(idFilter);
    }
    if (statusesKuery) {
      q.push((0, _esQuery.toElasticsearchQuery)((0, _esQuery.fromKueryExpression)(statusesKuery)));
    }
    q.push({
      ...kqlQuery
    });
    query = {
      bool: {
        must: q
      }
    };
  }
  return {
    body: {
      query,
      track_total_hits: true,
      sort: MetadataSortMethod
    },
    from: page * pageSize,
    size: pageSize,
    index: _constants.METADATA_UNITED_INDEX
  };
}