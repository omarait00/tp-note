"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSnapshotCount = void 0;
var _get_query_string_filter = require("./search/get_query_string_filter");
var _constants = require("../../../../common/constants");
var _search = require("./search");
var _client_defaults = require("../../../../common/constants/client_defaults");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getSnapshotCount = async ({
  uptimeEsClient,
  dateRangeStart,
  dateRangeEnd,
  filters,
  query
}) => {
  const context = new _search.QueryContext(uptimeEsClient, dateRangeStart, dateRangeEnd, _constants.CONTEXT_DEFAULTS.CURSOR_PAGINATION, filters && filters !== '' ? JSON.parse(filters) : null, Infinity, undefined, query);

  // Calculate the total, up, and down counts.
  const count = await statusCount(context);
  return {
    total: count.total,
    up: count.up,
    down: count.down
  };
};
exports.getSnapshotCount = getSnapshotCount;
const statusCount = async context => {
  var _ref, _res$aggregations, _res$aggregations$cou;
  const {
    body: res
  } = await context.search({
    body: statusCountBody(await context.dateAndCustomFilters(), context)
  }, 'getSnapshotCount');
  return (_ref = (_res$aggregations = res.aggregations) === null || _res$aggregations === void 0 ? void 0 : (_res$aggregations$cou = _res$aggregations.counts) === null || _res$aggregations$cou === void 0 ? void 0 : _res$aggregations$cou.value) !== null && _ref !== void 0 ? _ref : {
    total: 0,
    up: 0,
    down: 0
  };
};
const statusCountBody = (filters, context) => {
  if (context.query) {
    filters.push((0, _get_query_string_filter.getQueryStringFilter)(context.query));
  }
  return {
    size: 0,
    query: {
      bool: {
        filter: [_client_defaults.SUMMARY_FILTER, _client_defaults.EXCLUDE_RUN_ONCE_FILTER, ...filters]
      }
    },
    aggs: {
      counts: {
        scripted_metric: {
          init_script: 'state.locStatus = new HashMap(); state.totalDocs = 0;',
          map_script: `
          def loc = doc["observer.geo.name"].size() == 0 ? "" : doc["observer.geo.name"][0];

          // One concern here is memory since we could build pretty gigantic maps. I've opted to
          // stick to a simple <String,String> map to reduce memory overhead. This means we do
          // a little string parsing to treat these strings as records that stay lexicographically
          // sortable (which is important later).
          // We encode the ID and location as $id.len:$id$loc
          String id = doc["monitor.id"][0];
          String idLenDelim = Integer.toHexString(id.length()) + ":" + id;
          String idLoc = loc == null ? idLenDelim : idLenDelim + loc;

          String status = doc["summary.down"][0] > 0 ? "d" : "u";
          String timeAndStatus = doc["@timestamp"][0].toInstant().toEpochMilli().toString() + status;
          if(state.locStatus[idLoc] == null){
            state.locStatus[idLoc] = timeAndStatus;
          }else if(timeAndStatus.compareTo(state.locStatus[idLoc]) > 0){
            state.locStatus[idLoc] = timeAndStatus;
          }

          state.totalDocs++;
        `,
          combine_script: `
          return state;
        `,
          reduce_script: `
          // Use a treemap since it's traversable in sorted order.
          // This is important later.
          TreeMap locStatus = new TreeMap();
          long totalDocs = 0;
          int uniqueIds = 0;
          for (state in states) {
            totalDocs += state.totalDocs;
            for (entry in state.locStatus.entrySet()) {
              // Update the value for the given key if we have a more recent check from this location.
              locStatus.merge(entry.getKey(), entry.getValue(), (a,b) -> a.compareTo(b) > 0 ? a : b)
            }
          }

          HashMap locTotals = new HashMap();
          int total = 0;
          int down = 0;
          String curId = "";
          boolean curIdDown = false;
          // We now iterate through our tree map in order, which means records for a given ID
          // always are encountered one after the other. This saves us having to make an intermediate
          // map.
          for (entry in locStatus.entrySet()) {
            String idLoc = entry.getKey();
            String timeStatus = entry.getValue();

            // Parse the length delimited id/location strings described in the map section
            int colonIndex = idLoc.indexOf(":");
            int idEnd = Integer.parseInt(idLoc.substring(0, colonIndex), 16) + colonIndex + 1;
            String id = idLoc.substring(colonIndex + 1, idEnd);
            String loc = idLoc.substring(idEnd, idLoc.length());
            String status = timeStatus.substring(timeStatus.length() - 1);

            // Here we increment counters for the up/down key per location
            // We also create a new hashmap in locTotals if we've never seen this location
            // before.
            locTotals.compute(loc, (k,v) -> {
              HashMap res = v;
              if (v == null) {
                res = new HashMap();
                res.put('up', 0);
                res.put('down', 0);
              }

              if (status == 'u') {
                res.up++;
              } else {
                res.down++;
              }

              return res;
            });


            // We've encountered a new ID
            if (curId != id) {
              total++;
              curId = id;
              if (status == "d") {
                curIdDown = true;
                down++;
              } else {
                curIdDown = false;
              }
            } else if (!curIdDown) {
              if (status == "d") {
                curIdDown = true;
                down++;
              } else {
                curIdDown = false;
              }
            }
          }

          Map result = new HashMap();
          result.total = total;
          result.location_totals = locTotals;
          result.up = total - down;
          result.down = down;
          result.totalDocs = totalDocs;
          return result;
        `
        }
      }
    }
  };
};