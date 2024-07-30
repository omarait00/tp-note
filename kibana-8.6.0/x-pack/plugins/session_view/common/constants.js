"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TTY_LINE_SPLITTER_REGEX = exports.TTY_LINES_PRE_SEEK = exports.TTY_CHAR_DEVICE_MINOR_PROPERTY = exports.TTY_CHAR_DEVICE_MAJOR_PROPERTY = exports.TOTAL_BYTES_CAPTURED_PROPERTY = exports.TIMESTAMP_PROPERTY = exports.SESSION_VIEW_APP_ID = exports.SECURITY_APP_ID = exports.QUERY_KEY_PROCESS_EVENTS = exports.QUERY_KEY_IO_EVENTS = exports.QUERY_KEY_GET_TOTAL_IO_BYTES = exports.QUERY_KEY_ALERTS = exports.PROCESS_EVENTS_ROUTE = exports.PROCESS_EVENTS_PER_PAGE = exports.PROCESS_EVENTS_INDEX = exports.PROCESS_ENTITY_ID_PROPERTY = exports.PREVIEW_ALERTS_INDEX = exports.POLICIES_PAGE_PATH = exports.MOUSE_EVENT_PLACEHOLDER = exports.LOCAL_STORAGE_DISPLAY_OPTIONS_KEY = exports.IO_EVENTS_ROUTE = exports.IO_EVENTS_PER_PAGE = exports.HOST_ID_PROPERTY = exports.GET_TOTAL_IO_BYTES_ROUTE = exports.ENTRY_SESSION_ENTITY_ID_PROPERTY = exports.DEFAULT_TTY_ROWS = exports.DEFAULT_TTY_PLAYSPEED_MS = exports.DEFAULT_TTY_FONT_SIZE = exports.DEFAULT_TTY_COLS = exports.DEFAULT_ALERT_FILTER_VALUE = exports.DEBOUNCE_TIMEOUT = exports.ALERT_UUID_PROPERTY = exports.ALERT_STATUS_ROUTE = exports.ALERT_STATUS = exports.ALERT_ORIGINAL_TIME_PROPERTY = exports.ALERT_ICONS = exports.ALERT_COUNT_THRESHOLD = exports.ALERTS_ROUTE = exports.ALERTS_PER_PROCESS_EVENTS_PAGE = exports.ALERTS_PER_PAGE = exports.ALERT = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SESSION_VIEW_APP_ID = 'sessionView';

// routes
exports.SESSION_VIEW_APP_ID = SESSION_VIEW_APP_ID;
const PROCESS_EVENTS_ROUTE = '/internal/session_view/process_events';
exports.PROCESS_EVENTS_ROUTE = PROCESS_EVENTS_ROUTE;
const ALERTS_ROUTE = '/internal/session_view/alerts';
exports.ALERTS_ROUTE = ALERTS_ROUTE;
const ALERT_STATUS_ROUTE = '/internal/session_view/alert_status';
exports.ALERT_STATUS_ROUTE = ALERT_STATUS_ROUTE;
const IO_EVENTS_ROUTE = '/internal/session_view/io_events';
exports.IO_EVENTS_ROUTE = IO_EVENTS_ROUTE;
const GET_TOTAL_IO_BYTES_ROUTE = '/internal/session_view/get_total_io_bytes';
exports.GET_TOTAL_IO_BYTES_ROUTE = GET_TOTAL_IO_BYTES_ROUTE;
const SECURITY_APP_ID = 'security';
exports.SECURITY_APP_ID = SECURITY_APP_ID;
const POLICIES_PAGE_PATH = '/administration/policy';

// index patterns
exports.POLICIES_PAGE_PATH = POLICIES_PAGE_PATH;
const PROCESS_EVENTS_INDEX = '*:logs-endpoint.events.process*,logs-endpoint.events.process*'; // match on both cross cluster and local indices
exports.PROCESS_EVENTS_INDEX = PROCESS_EVENTS_INDEX;
const PREVIEW_ALERTS_INDEX = '.preview.alerts-security.alerts-default';

// field properties
exports.PREVIEW_ALERTS_INDEX = PREVIEW_ALERTS_INDEX;
const ENTRY_SESSION_ENTITY_ID_PROPERTY = 'process.entry_leader.entity_id';
exports.ENTRY_SESSION_ENTITY_ID_PROPERTY = ENTRY_SESSION_ENTITY_ID_PROPERTY;
const PROCESS_ENTITY_ID_PROPERTY = 'process.entity_id';
exports.PROCESS_ENTITY_ID_PROPERTY = PROCESS_ENTITY_ID_PROPERTY;
const ALERT_UUID_PROPERTY = 'kibana.alert.uuid';
exports.ALERT_UUID_PROPERTY = ALERT_UUID_PROPERTY;
const ALERT_ORIGINAL_TIME_PROPERTY = 'kibana.alert.original_time';
exports.ALERT_ORIGINAL_TIME_PROPERTY = ALERT_ORIGINAL_TIME_PROPERTY;
const TOTAL_BYTES_CAPTURED_PROPERTY = 'process.io.total_bytes_captured';
exports.TOTAL_BYTES_CAPTURED_PROPERTY = TOTAL_BYTES_CAPTURED_PROPERTY;
const TTY_CHAR_DEVICE_MAJOR_PROPERTY = 'process.tty.char_device.major';
exports.TTY_CHAR_DEVICE_MAJOR_PROPERTY = TTY_CHAR_DEVICE_MAJOR_PROPERTY;
const TTY_CHAR_DEVICE_MINOR_PROPERTY = 'process.tty.char_device.minor';
exports.TTY_CHAR_DEVICE_MINOR_PROPERTY = TTY_CHAR_DEVICE_MINOR_PROPERTY;
const HOST_ID_PROPERTY = 'host.id';
exports.HOST_ID_PROPERTY = HOST_ID_PROPERTY;
const TIMESTAMP_PROPERTY = '@timestamp';

// page sizes
exports.TIMESTAMP_PROPERTY = TIMESTAMP_PROPERTY;
const PROCESS_EVENTS_PER_PAGE = 500;
exports.PROCESS_EVENTS_PER_PAGE = PROCESS_EVENTS_PER_PAGE;
const ALERTS_PER_PROCESS_EVENTS_PAGE = 1500;
exports.ALERTS_PER_PROCESS_EVENTS_PAGE = ALERTS_PER_PROCESS_EVENTS_PAGE;
const ALERTS_PER_PAGE = 100;
exports.ALERTS_PER_PAGE = ALERTS_PER_PAGE;
const IO_EVENTS_PER_PAGE = 10;

// react-query caching keys
exports.IO_EVENTS_PER_PAGE = IO_EVENTS_PER_PAGE;
const QUERY_KEY_PROCESS_EVENTS = 'sessionViewProcessEvents';
exports.QUERY_KEY_PROCESS_EVENTS = QUERY_KEY_PROCESS_EVENTS;
const QUERY_KEY_ALERTS = 'sessionViewAlerts';
exports.QUERY_KEY_ALERTS = QUERY_KEY_ALERTS;
const QUERY_KEY_IO_EVENTS = 'sessionViewIOEvents';
exports.QUERY_KEY_IO_EVENTS = QUERY_KEY_IO_EVENTS;
const QUERY_KEY_GET_TOTAL_IO_BYTES = 'sessionViewGetTotalIOBytes';

// other
exports.QUERY_KEY_GET_TOTAL_IO_BYTES = QUERY_KEY_GET_TOTAL_IO_BYTES;
const ALERT_STATUS = {
  OPEN: 'open',
  ACKNOWLEDGED: 'acknowledged',
  CLOSED: 'closed'
};
exports.ALERT_STATUS = ALERT_STATUS;
const LOCAL_STORAGE_DISPLAY_OPTIONS_KEY = 'sessionView:displayOptions';
exports.LOCAL_STORAGE_DISPLAY_OPTIONS_KEY = LOCAL_STORAGE_DISPLAY_OPTIONS_KEY;
const MOUSE_EVENT_PLACEHOLDER = {
  stopPropagation: () => undefined
};
exports.MOUSE_EVENT_PLACEHOLDER = MOUSE_EVENT_PLACEHOLDER;
const DEBOUNCE_TIMEOUT = 500;
exports.DEBOUNCE_TIMEOUT = DEBOUNCE_TIMEOUT;
const DEFAULT_TTY_PLAYSPEED_MS = 30; // milliseconds per render loop
exports.DEFAULT_TTY_PLAYSPEED_MS = DEFAULT_TTY_PLAYSPEED_MS;
const TTY_LINES_PRE_SEEK = 200; // number of lines to redraw before the point we are seeking to.
exports.TTY_LINES_PRE_SEEK = TTY_LINES_PRE_SEEK;
const DEFAULT_TTY_FONT_SIZE = 11;
exports.DEFAULT_TTY_FONT_SIZE = DEFAULT_TTY_FONT_SIZE;
const DEFAULT_TTY_ROWS = 66;
exports.DEFAULT_TTY_ROWS = DEFAULT_TTY_ROWS;
const DEFAULT_TTY_COLS = 280;

// we split terminal output on both newlines, carriage returns and cursor movements.
// this helps search navigate through results without having a single line rewrite itself before we highlight the match.
// it also creates a more interesting play by play
exports.DEFAULT_TTY_COLS = DEFAULT_TTY_COLS;
const TTY_LINE_SPLITTER_REGEX = /(\r?\n|\r\n?|\x1b\[\d+;\d*[Hf]?)/gi;

// when showing the count of alerts in details panel tab, if the number
// exceeds ALERT_COUNT_THRESHOLD we put a + next to it, e.g  999+
exports.TTY_LINE_SPLITTER_REGEX = TTY_LINE_SPLITTER_REGEX;
const ALERT_COUNT_THRESHOLD = 999;
exports.ALERT_COUNT_THRESHOLD = ALERT_COUNT_THRESHOLD;
const ALERT_ICONS = {
  process: 'gear',
  file: 'document',
  network: 'globe'
};
exports.ALERT_ICONS = ALERT_ICONS;
const DEFAULT_ALERT_FILTER_VALUE = 'all';
exports.DEFAULT_ALERT_FILTER_VALUE = DEFAULT_ALERT_FILTER_VALUE;
const ALERT = 'alert';
exports.ALERT = ALERT;