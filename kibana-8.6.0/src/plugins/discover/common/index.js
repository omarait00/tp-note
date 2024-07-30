"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRUNCATE_MAX_HEIGHT = exports.SORT_DEFAULT_ORDER_SETTING = exports.SHOW_MULTIFIELDS = exports.SHOW_LEGACY_FIELD_TOP_VALUES = exports.SHOW_FIELD_STATISTICS = exports.SEARCH_ON_PAGE_LOAD_SETTING = exports.SEARCH_FIELDS_FROM_SOURCE = exports.SEARCH_EMBEDDABLE_TYPE = exports.SAMPLE_SIZE_SETTING = exports.SAMPLE_ROWS_PER_PAGE_SETTING = exports.ROW_HEIGHT_OPTION = exports.PLUGIN_ID = exports.MODIFY_COLUMNS_ON_SWITCH = exports.MAX_DOC_FIELDS_DISPLAYED = exports.HIDE_ANNOUNCEMENTS = exports.FIELDS_LIMIT_SETTING = exports.ENABLE_SQL = exports.DOC_TABLE_LEGACY = exports.DOC_HIDE_TIME_COLUMN_SETTING = exports.DEFAULT_COLUMNS_SETTING = exports.CONTEXT_TIE_BREAKER_FIELDS_SETTING = exports.CONTEXT_STEP_SETTING = exports.CONTEXT_DEFAULT_SIZE_SETTING = exports.APP_ICON = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const PLUGIN_ID = 'discover';
exports.PLUGIN_ID = PLUGIN_ID;
const APP_ICON = 'discoverApp';
exports.APP_ICON = APP_ICON;
const DEFAULT_COLUMNS_SETTING = 'defaultColumns';
exports.DEFAULT_COLUMNS_SETTING = DEFAULT_COLUMNS_SETTING;
const SAMPLE_SIZE_SETTING = 'discover:sampleSize';
exports.SAMPLE_SIZE_SETTING = SAMPLE_SIZE_SETTING;
const SAMPLE_ROWS_PER_PAGE_SETTING = 'discover:sampleRowsPerPage';
exports.SAMPLE_ROWS_PER_PAGE_SETTING = SAMPLE_ROWS_PER_PAGE_SETTING;
const SORT_DEFAULT_ORDER_SETTING = 'discover:sort:defaultOrder';
exports.SORT_DEFAULT_ORDER_SETTING = SORT_DEFAULT_ORDER_SETTING;
const SEARCH_ON_PAGE_LOAD_SETTING = 'discover:searchOnPageLoad';
exports.SEARCH_ON_PAGE_LOAD_SETTING = SEARCH_ON_PAGE_LOAD_SETTING;
const DOC_HIDE_TIME_COLUMN_SETTING = 'doc_table:hideTimeColumn';
exports.DOC_HIDE_TIME_COLUMN_SETTING = DOC_HIDE_TIME_COLUMN_SETTING;
const FIELDS_LIMIT_SETTING = 'fields:popularLimit';
exports.FIELDS_LIMIT_SETTING = FIELDS_LIMIT_SETTING;
const CONTEXT_DEFAULT_SIZE_SETTING = 'context:defaultSize';
exports.CONTEXT_DEFAULT_SIZE_SETTING = CONTEXT_DEFAULT_SIZE_SETTING;
const CONTEXT_STEP_SETTING = 'context:step';
exports.CONTEXT_STEP_SETTING = CONTEXT_STEP_SETTING;
const CONTEXT_TIE_BREAKER_FIELDS_SETTING = 'context:tieBreakerFields';
exports.CONTEXT_TIE_BREAKER_FIELDS_SETTING = CONTEXT_TIE_BREAKER_FIELDS_SETTING;
const DOC_TABLE_LEGACY = 'doc_table:legacy';
exports.DOC_TABLE_LEGACY = DOC_TABLE_LEGACY;
const MODIFY_COLUMNS_ON_SWITCH = 'discover:modifyColumnsOnSwitch';
exports.MODIFY_COLUMNS_ON_SWITCH = MODIFY_COLUMNS_ON_SWITCH;
const SEARCH_FIELDS_FROM_SOURCE = 'discover:searchFieldsFromSource';
exports.SEARCH_FIELDS_FROM_SOURCE = SEARCH_FIELDS_FROM_SOURCE;
const MAX_DOC_FIELDS_DISPLAYED = 'discover:maxDocFieldsDisplayed';
exports.MAX_DOC_FIELDS_DISPLAYED = MAX_DOC_FIELDS_DISPLAYED;
const SHOW_FIELD_STATISTICS = 'discover:showFieldStatistics';
exports.SHOW_FIELD_STATISTICS = SHOW_FIELD_STATISTICS;
const SHOW_MULTIFIELDS = 'discover:showMultiFields';
exports.SHOW_MULTIFIELDS = SHOW_MULTIFIELDS;
const TRUNCATE_MAX_HEIGHT = 'truncate:maxHeight';
exports.TRUNCATE_MAX_HEIGHT = TRUNCATE_MAX_HEIGHT;
const ROW_HEIGHT_OPTION = 'discover:rowHeightOption';
exports.ROW_HEIGHT_OPTION = ROW_HEIGHT_OPTION;
const SEARCH_EMBEDDABLE_TYPE = 'search';
exports.SEARCH_EMBEDDABLE_TYPE = SEARCH_EMBEDDABLE_TYPE;
const HIDE_ANNOUNCEMENTS = 'hideAnnouncements';
exports.HIDE_ANNOUNCEMENTS = HIDE_ANNOUNCEMENTS;
const SHOW_LEGACY_FIELD_TOP_VALUES = 'discover:showLegacyFieldTopValues';
exports.SHOW_LEGACY_FIELD_TOP_VALUES = SHOW_LEGACY_FIELD_TOP_VALUES;
const ENABLE_SQL = 'discover:enableSql';
exports.ENABLE_SQL = ENABLE_SQL;