"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updated_by = exports.updated_at = exports.total = exports.success_count = exports.success = exports.status_code = exports.status = exports.signal_status_query = exports.signal_ids = exports.saved_id = exports.savedIdOrUndefined = exports.queryFilterOrUndefined = exports.queryFilter = exports.privilege = exports.perPage = exports.message = exports.indexType = exports.indexRecord = exports.file_name = exports.fieldsOrUndefined = exports.fields = exports.exclude_export_details = exports.created_by = exports.created_at = exports.conflicts = exports.anomaly_threshold = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */

const file_name = t.string;
exports.file_name = file_name;
const exclude_export_details = t.boolean;
exports.exclude_export_details = exclude_export_details;
const saved_id = t.string;
exports.saved_id = saved_id;
const savedIdOrUndefined = t.union([saved_id, t.undefined]);
exports.savedIdOrUndefined = savedIdOrUndefined;
const anomaly_threshold = _securitysolutionIoTsTypes.PositiveInteger;
exports.anomaly_threshold = anomaly_threshold;
const status = t.keyof({
  open: null,
  closed: null,
  acknowledged: null,
  'in-progress': null
});
exports.status = status;
const conflicts = t.keyof({
  abort: null,
  proceed: null
});
exports.conflicts = conflicts;
const queryFilter = t.string;
exports.queryFilter = queryFilter;
const queryFilterOrUndefined = t.union([queryFilter, t.undefined]);
exports.queryFilterOrUndefined = queryFilterOrUndefined;
const signal_ids = t.array(t.string);
exports.signal_ids = signal_ids;
// TODO: Can this be more strict or is this is the set of all Elastic Queries?
const signal_status_query = t.object;
exports.signal_status_query = signal_status_query;
const fields = t.array(t.string);
exports.fields = fields;
const fieldsOrUndefined = t.union([fields, t.undefined]);
exports.fieldsOrUndefined = fieldsOrUndefined;
const created_at = _securitysolutionIoTsTypes.IsoDateString;
exports.created_at = created_at;
const updated_at = _securitysolutionIoTsTypes.IsoDateString;
exports.updated_at = updated_at;
const created_by = t.string;
exports.created_by = created_by;
const updated_by = t.string;
exports.updated_by = updated_by;
const status_code = _securitysolutionIoTsTypes.PositiveInteger;
exports.status_code = status_code;
const message = t.string;
exports.message = message;
const perPage = _securitysolutionIoTsTypes.PositiveInteger;
exports.perPage = perPage;
const total = _securitysolutionIoTsTypes.PositiveInteger;
exports.total = total;
const success = t.boolean;
exports.success = success;
const success_count = _securitysolutionIoTsTypes.PositiveInteger;
exports.success_count = success_count;
const indexRecord = t.record(t.string, t.type({
  all: t.boolean,
  maintenance: t.boolean,
  manage_ilm: t.boolean,
  read: t.boolean,
  create_index: t.boolean,
  read_cross_cluster: t.boolean,
  index: t.boolean,
  monitor: t.boolean,
  delete: t.boolean,
  manage: t.boolean,
  delete_index: t.boolean,
  create_doc: t.boolean,
  view_index_metadata: t.boolean,
  create: t.boolean,
  manage_follow_index: t.boolean,
  manage_leader_index: t.boolean,
  write: t.boolean
}));
exports.indexRecord = indexRecord;
const indexType = t.type({
  index: indexRecord
});
exports.indexType = indexType;
const privilege = t.type({
  username: t.string,
  has_all_requested: t.boolean,
  cluster: t.type({
    monitor_ml: t.boolean,
    manage_ccr: t.boolean,
    manage_index_templates: t.boolean,
    monitor_watcher: t.boolean,
    monitor_transform: t.boolean,
    read_ilm: t.boolean,
    manage_security: t.boolean,
    manage_own_api_key: t.boolean,
    manage_saml: t.boolean,
    all: t.boolean,
    manage_ilm: t.boolean,
    manage_ingest_pipelines: t.boolean,
    read_ccr: t.boolean,
    manage_rollup: t.boolean,
    monitor: t.boolean,
    manage_watcher: t.boolean,
    manage: t.boolean,
    manage_transform: t.boolean,
    manage_token: t.boolean,
    manage_ml: t.boolean,
    manage_pipeline: t.boolean,
    monitor_rollup: t.boolean,
    transport_client: t.boolean,
    create_snapshot: t.boolean
  }),
  index: indexRecord,
  is_authenticated: t.boolean,
  has_encryption_key: t.boolean
});
exports.privilege = privilege;