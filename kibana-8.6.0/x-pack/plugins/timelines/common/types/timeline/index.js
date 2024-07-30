"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  DataProviderType: true,
  TimelineStatus: true,
  TimelineStatusLiteralRt: true,
  RowRendererId: true,
  TimelineType: true,
  TimelineTypeLiteralRt: true,
  TimelineTypeLiteralWithNullRt: true,
  pageInfoTimeline: true,
  SortFieldTimeline: true,
  sortFieldTimeline: true,
  direction: true,
  sortTimeline: true
};
exports.sortTimeline = exports.sortFieldTimeline = exports.pageInfoTimeline = exports.direction = exports.TimelineTypeLiteralWithNullRt = exports.TimelineTypeLiteralRt = exports.TimelineType = exports.TimelineStatusLiteralRt = exports.TimelineStatus = exports.SortFieldTimeline = exports.RowRendererId = exports.DataProviderType = void 0;
var runtimeTypes = _interopRequireWildcard(require("io-ts"));
var _utility_types = require("../../utility_types");
var _search_strategy = require("../../search_strategy");
var _actions = require("./actions");
Object.keys(_actions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _actions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _actions[key];
    }
  });
});
var _cells = require("./cells");
Object.keys(_cells).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _cells[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cells[key];
    }
  });
});
var _columns = require("./columns");
Object.keys(_columns).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _columns[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _columns[key];
    }
  });
});
var _data_provider = require("./data_provider");
Object.keys(_data_provider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _data_provider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _data_provider[key];
    }
  });
});
var _rows = require("./rows");
Object.keys(_rows).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _rows[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rows[key];
    }
  });
});
var _store = require("./store");
Object.keys(_store).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _store[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _store[key];
    }
  });
});
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
/*
 *  DataProvider Types
 */
let DataProviderType;
/*
 *  Sort Types
 */
exports.DataProviderType = DataProviderType;
(function (DataProviderType) {
  DataProviderType["default"] = "default";
  DataProviderType["template"] = "template";
})(DataProviderType || (exports.DataProviderType = DataProviderType = {}));
const SavedSortObject = runtimeTypes.partial({
  columnId: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  columnType: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  sortDirection: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
const SavedSortRuntimeType = runtimeTypes.union([runtimeTypes.array(SavedSortObject), SavedSortObject]);
/*
 *  Timeline Statuses
 */
let TimelineStatus;
exports.TimelineStatus = TimelineStatus;
(function (TimelineStatus) {
  TimelineStatus["active"] = "active";
  TimelineStatus["draft"] = "draft";
  TimelineStatus["immutable"] = "immutable";
})(TimelineStatus || (exports.TimelineStatus = TimelineStatus = {}));
const TimelineStatusLiteralRt = runtimeTypes.union([runtimeTypes.literal(TimelineStatus.active), runtimeTypes.literal(TimelineStatus.draft), runtimeTypes.literal(TimelineStatus.immutable)]);
exports.TimelineStatusLiteralRt = TimelineStatusLiteralRt;
const TimelineStatusLiteralWithNullRt = (0, _utility_types.unionWithNullType)(TimelineStatusLiteralRt);
let RowRendererId;
/*
 *  Timeline Types
 */
exports.RowRendererId = RowRendererId;
(function (RowRendererId) {
  RowRendererId["alert"] = "alert";
  RowRendererId["alerts"] = "alerts";
  RowRendererId["auditd"] = "auditd";
  RowRendererId["auditd_file"] = "auditd_file";
  RowRendererId["library"] = "library";
  RowRendererId["netflow"] = "netflow";
  RowRendererId["plain"] = "plain";
  RowRendererId["registry"] = "registry";
  RowRendererId["suricata"] = "suricata";
  RowRendererId["system"] = "system";
  RowRendererId["system_dns"] = "system_dns";
  RowRendererId["system_endgame_process"] = "system_endgame_process";
  RowRendererId["system_file"] = "system_file";
  RowRendererId["system_fim"] = "system_fim";
  RowRendererId["system_security_event"] = "system_security_event";
  RowRendererId["system_socket"] = "system_socket";
  RowRendererId["threat_match"] = "threat_match";
  RowRendererId["zeek"] = "zeek";
})(RowRendererId || (exports.RowRendererId = RowRendererId = {}));
let TimelineType;
exports.TimelineType = TimelineType;
(function (TimelineType) {
  TimelineType["default"] = "default";
  TimelineType["template"] = "template";
  TimelineType["test"] = "test";
})(TimelineType || (exports.TimelineType = TimelineType = {}));
const TimelineTypeLiteralRt = runtimeTypes.union([runtimeTypes.literal(TimelineType.template), runtimeTypes.literal(TimelineType.default), runtimeTypes.literal(TimelineType.test)]);
exports.TimelineTypeLiteralRt = TimelineTypeLiteralRt;
const TimelineTypeLiteralWithNullRt = (0, _utility_types.unionWithNullType)(TimelineTypeLiteralRt);
exports.TimelineTypeLiteralWithNullRt = TimelineTypeLiteralWithNullRt;
var FlowTargetSourceDest;
(function (FlowTargetSourceDest) {
  FlowTargetSourceDest["destination"] = "destination";
  FlowTargetSourceDest["source"] = "source";
})(FlowTargetSourceDest || (FlowTargetSourceDest = {}));
const pageInfoTimeline = runtimeTypes.type({
  pageIndex: runtimeTypes.number,
  pageSize: runtimeTypes.number
});
exports.pageInfoTimeline = pageInfoTimeline;
let SortFieldTimeline;
exports.SortFieldTimeline = SortFieldTimeline;
(function (SortFieldTimeline) {
  SortFieldTimeline["title"] = "title";
  SortFieldTimeline["description"] = "description";
  SortFieldTimeline["updated"] = "updated";
  SortFieldTimeline["created"] = "created";
})(SortFieldTimeline || (exports.SortFieldTimeline = SortFieldTimeline = {}));
const sortFieldTimeline = runtimeTypes.union([runtimeTypes.literal(SortFieldTimeline.title), runtimeTypes.literal(SortFieldTimeline.description), runtimeTypes.literal(SortFieldTimeline.updated), runtimeTypes.literal(SortFieldTimeline.created)]);
exports.sortFieldTimeline = sortFieldTimeline;
const direction = runtimeTypes.union([runtimeTypes.literal(_search_strategy.Direction.asc), runtimeTypes.literal(_search_strategy.Direction.desc)]);
exports.direction = direction;
const sortTimeline = runtimeTypes.type({
  sortField: sortFieldTimeline,
  sortOrder: direction
});
exports.sortTimeline = sortTimeline;