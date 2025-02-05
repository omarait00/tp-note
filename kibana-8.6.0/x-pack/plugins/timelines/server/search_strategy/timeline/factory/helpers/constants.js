"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIMELINE_EVENTS_FIELDS = exports.REFERENCE = exports.PROVIDER = exports.MATCHED_TYPE = exports.MATCHED_FIELD = exports.MATCHED_ATOMIC = exports.LAST_SEEN = exports.INDICATOR_REFERENCE = exports.INDICATOR_PROVIDER = exports.INDICATOR_MATCH_SUBFIELDS = exports.INDICATOR_MATCHED_TYPE = exports.INDICATOR_MATCHED_FIELD = exports.INDICATOR_MATCHED_ATOMIC = exports.INDICATOR_LASTSEEN = exports.INDICATOR_FIRSTSEEN = exports.FIRST_SEEN = exports.FEED_NAME_REFERENCE = exports.FEED_NAME = exports.EVENT_DATASET = exports.ECS_METADATA_FIELDS = exports.CTI_ROW_RENDERER_FIELDS = void 0;
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MATCHED_ATOMIC = 'matched.atomic';
exports.MATCHED_ATOMIC = MATCHED_ATOMIC;
const MATCHED_FIELD = 'matched.field';
exports.MATCHED_FIELD = MATCHED_FIELD;
const MATCHED_TYPE = 'matched.type';
exports.MATCHED_TYPE = MATCHED_TYPE;
const INDICATOR_MATCH_SUBFIELDS = [MATCHED_ATOMIC, MATCHED_FIELD, MATCHED_TYPE];
exports.INDICATOR_MATCH_SUBFIELDS = INDICATOR_MATCH_SUBFIELDS;
const INDICATOR_MATCHED_ATOMIC = `${_constants.ENRICHMENT_DESTINATION_PATH}.${MATCHED_ATOMIC}`;
exports.INDICATOR_MATCHED_ATOMIC = INDICATOR_MATCHED_ATOMIC;
const INDICATOR_MATCHED_FIELD = `${_constants.ENRICHMENT_DESTINATION_PATH}.${MATCHED_FIELD}`;
exports.INDICATOR_MATCHED_FIELD = INDICATOR_MATCHED_FIELD;
const INDICATOR_MATCHED_TYPE = `${_constants.ENRICHMENT_DESTINATION_PATH}.${MATCHED_TYPE}`;
exports.INDICATOR_MATCHED_TYPE = INDICATOR_MATCHED_TYPE;
const EVENT_DATASET = 'event.dataset';
exports.EVENT_DATASET = EVENT_DATASET;
const FIRST_SEEN = 'indicator.first_seen';
exports.FIRST_SEEN = FIRST_SEEN;
const LAST_SEEN = 'indicator.last_seen';
exports.LAST_SEEN = LAST_SEEN;
const PROVIDER = 'indicator.provider';
exports.PROVIDER = PROVIDER;
const REFERENCE = 'indicator.reference';
exports.REFERENCE = REFERENCE;
const FEED_NAME = 'feed.name';
exports.FEED_NAME = FEED_NAME;
const INDICATOR_FIRSTSEEN = `${_constants.ENRICHMENT_DESTINATION_PATH}.${FIRST_SEEN}`;
exports.INDICATOR_FIRSTSEEN = INDICATOR_FIRSTSEEN;
const INDICATOR_LASTSEEN = `${_constants.ENRICHMENT_DESTINATION_PATH}.${LAST_SEEN}`;
exports.INDICATOR_LASTSEEN = INDICATOR_LASTSEEN;
const INDICATOR_PROVIDER = `${_constants.ENRICHMENT_DESTINATION_PATH}.${PROVIDER}`;
exports.INDICATOR_PROVIDER = INDICATOR_PROVIDER;
const INDICATOR_REFERENCE = `${_constants.ENRICHMENT_DESTINATION_PATH}.${REFERENCE}`;
exports.INDICATOR_REFERENCE = INDICATOR_REFERENCE;
const FEED_NAME_REFERENCE = `${_constants.ENRICHMENT_DESTINATION_PATH}.${FEED_NAME}`;
exports.FEED_NAME_REFERENCE = FEED_NAME_REFERENCE;
const CTI_ROW_RENDERER_FIELDS = [INDICATOR_MATCHED_ATOMIC, INDICATOR_MATCHED_FIELD, INDICATOR_MATCHED_TYPE, INDICATOR_REFERENCE, INDICATOR_PROVIDER, FEED_NAME_REFERENCE];

// TODO: update all of these fields to use the constants from technical field names
exports.CTI_ROW_RENDERER_FIELDS = CTI_ROW_RENDERER_FIELDS;
const TIMELINE_EVENTS_FIELDS = [_ruleDataUtils.ALERT_RULE_CONSUMER, '@timestamp', 'kibana.alert.workflow_status', 'kibana.alert.group.id', 'kibana.alert.original_time', 'kibana.alert.reason', 'kibana.alert.rule.from', 'kibana.alert.rule.name', 'kibana.alert.rule.to', 'kibana.alert.rule.uuid', 'kibana.alert.rule.rule_id', 'kibana.alert.rule.type', 'kibana.alert.original_event.kind', 'kibana.alert.original_event.module', 'kibana.alert.rule.version', _ruleDataUtils.ALERT_SEVERITY, _ruleDataUtils.ALERT_RISK_SCORE, _ruleDataUtils.ALERT_RULE_PARAMETERS, 'kibana.alert.threshold_result', 'kibana.alert.building_block_type', 'kibana.alert.suppression.docs_count', 'event.code', 'event.module', 'event.action', 'event.category', 'host.name', 'user.name', 'source.ip', 'destination.ip', 'message', 'system.auth.ssh.signature', 'system.auth.ssh.method', 'system.audit.package.arch', 'system.audit.package.entity_id', 'system.audit.package.name', 'system.audit.package.size', 'system.audit.package.summary', 'system.audit.package.version', 'event.created', 'event.dataset', 'event.duration', 'event.end', 'event.hash', 'event.id', 'event.kind', 'event.original', 'event.outcome', 'event.risk_score', 'event.risk_score_norm', 'event.severity', 'event.start', 'event.timezone', 'event.type', 'agent.type', 'agent.id', 'auditd.result', 'auditd.session', 'auditd.data.acct', 'auditd.data.terminal', 'auditd.data.op', 'auditd.summary.actor.primary', 'auditd.summary.actor.secondary', 'auditd.summary.object.primary', 'auditd.summary.object.secondary', 'auditd.summary.object.type', 'auditd.summary.how', 'auditd.summary.message_type', 'auditd.summary.sequence', 'file.Ext.original.path', 'file.name', 'file.target_path', 'file.extension', 'file.type', 'file.device', 'file.inode', 'file.uid', 'file.owner', 'file.gid', 'file.group', 'file.mode', 'file.size', 'file.mtime', 'file.ctime', 'file.path',
// NOTE: 7.10+ file.Ext.code_signature populated
// as array of objects, prior to that populated as
// single object
'file.Ext.code_signature', 'file.Ext.code_signature.subject_name', 'file.Ext.code_signature.trusted', 'file.hash.sha256', 'host.os.family', 'host.os.name', 'host.id', 'host.ip', 'registry.key', 'registry.path', 'rule.reference', 'source.bytes', 'source.packets', 'source.port', 'source.geo.continent_name', 'source.geo.country_name', 'source.geo.country_iso_code', 'source.geo.city_name', 'source.geo.region_iso_code', 'source.geo.region_name', 'destination.bytes', 'destination.packets', 'destination.port', 'destination.geo.continent_name', 'destination.geo.country_name', 'destination.geo.country_iso_code', 'destination.geo.city_name', 'destination.geo.region_iso_code', 'destination.geo.region_name', 'dns.question.name', 'dns.question.type', 'dns.resolved_ip', 'dns.response_code', 'endgame.exit_code', 'endgame.file_name', 'endgame.file_path', 'endgame.logon_type', 'endgame.parent_process_name', 'endgame.pid', 'endgame.process_name', 'endgame.subject_domain_name', 'endgame.subject_logon_id', 'endgame.subject_user_name', 'endgame.target_domain_name', 'endgame.target_logon_id', 'endgame.target_user_name', 'kibana.alert.rule.timeline_id', 'kibana.alert.rule.timeline_title', 'kibana.alert.rule.note', 'kibana.alert.rule.exceptions_list', 'kibana.alert.rule.building_block_type', 'suricata.eve.proto', 'suricata.eve.flow_id', 'suricata.eve.alert.signature', 'suricata.eve.alert.signature_id', 'network.bytes', 'network.community_id', 'network.direction', 'network.packets', 'network.protocol', 'network.transport', 'http.version', 'http.request.method', 'http.request.body.bytes', 'http.request.body.content', 'http.request.referrer', 'http.response.status_code', 'http.response.body.bytes', 'http.response.body.content', 'tls.client_certificate.fingerprint.sha1', 'tls.fingerprints.ja3.hash', 'tls.server_certificate.fingerprint.sha1', 'user.domain', 'winlog.event_id', 'process.end', 'process.entry_leader.entry_meta.type', 'process.entry_leader.entry_meta.source.ip', 'process.exit_code', 'process.hash.md5', 'process.hash.sha1', 'process.hash.sha256', 'process.interactive', 'process.parent.name', 'process.parent.pid', 'process.pid', 'process.name', 'process.ppid', 'process.args', 'process.entity_id', 'process.executable', 'process.start', 'process.title', 'process.working_directory', 'process.entry_leader.entity_id', 'process.entry_leader.name', 'process.entry_leader.pid', 'process.session_leader.entity_id', 'process.session_leader.name', 'process.session_leader.pid', 'process.group_leader.entity_id', 'process.group_leader.name', 'process.group_leader.pid', 'zeek.session_id', 'zeek.connection.local_resp', 'zeek.connection.local_orig', 'zeek.connection.missed_bytes', 'zeek.connection.state', 'zeek.connection.history', 'zeek.notice.suppress_for', 'zeek.notice.msg', 'zeek.notice.note', 'zeek.notice.sub', 'zeek.notice.dst', 'zeek.notice.dropped', 'zeek.notice.peer_descr', 'zeek.dns.AA', 'zeek.dns.qclass_name', 'zeek.dns.RD', 'zeek.dns.qtype_name', 'zeek.dns.qtype', 'zeek.dns.query', 'zeek.dns.trans_id', 'zeek.dns.qclass', 'zeek.dns.RA', 'zeek.dns.TC', 'zeek.http.resp_mime_types', 'zeek.http.trans_depth', 'zeek.http.status_msg', 'zeek.http.resp_fuids', 'zeek.http.tags', 'zeek.files.session_ids', 'zeek.files.timedout', 'zeek.files.local_orig', 'zeek.files.tx_host', 'zeek.files.source', 'zeek.files.is_orig', 'zeek.files.overflow_bytes', 'zeek.files.sha1', 'zeek.files.duration', 'zeek.files.depth', 'zeek.files.analyzers', 'zeek.files.mime_type', 'zeek.files.rx_host', 'zeek.files.total_bytes', 'zeek.files.fuid', 'zeek.files.seen_bytes', 'zeek.files.missing_bytes', 'zeek.files.md5', 'zeek.ssl.cipher', 'zeek.ssl.established', 'zeek.ssl.resumed', 'zeek.ssl.version', ...CTI_ROW_RENDERER_FIELDS];
exports.TIMELINE_EVENTS_FIELDS = TIMELINE_EVENTS_FIELDS;
const ECS_METADATA_FIELDS = ['_id', '_index', '_type', '_score'];
exports.ECS_METADATA_FIELDS = ECS_METADATA_FIELDS;