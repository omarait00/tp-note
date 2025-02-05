"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.snExternalServiceConfig = exports.serviceNowSIRTable = exports.serviceNowITSMTable = exports.FIELD_PREFIX = exports.DEFAULT_ALERTS_GROUPING_KEY = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const serviceNowITSMTable = 'incident';
exports.serviceNowITSMTable = serviceNowITSMTable;
const serviceNowSIRTable = 'sn_si_incident';
exports.serviceNowSIRTable = serviceNowSIRTable;
const SN_ITSM_APP_ID = '7148dbc91bf1f450ced060a7234bcb88';
const SN_SIR_APP_ID = '2f0746801baeb01019ae54e4604bcb0f';
const snExternalServiceConfig = {
  '.servicenow': {
    importSetTable: 'x_elas2_inc_int_elastic_incident',
    appScope: 'x_elas2_inc_int',
    table: 'incident',
    useImportAPI: true,
    commentFieldKey: 'work_notes',
    appId: SN_ITSM_APP_ID
  },
  '.servicenow-sir': {
    importSetTable: 'x_elas2_sir_int_elastic_si_incident',
    appScope: 'x_elas2_sir_int',
    table: 'sn_si_incident',
    useImportAPI: true,
    commentFieldKey: 'work_notes',
    appId: SN_SIR_APP_ID
  },
  '.servicenow-itom': {
    importSetTable: 'x_elas2_inc_int_elastic_incident',
    appScope: 'x_elas2_inc_int',
    table: 'em_event',
    useImportAPI: false,
    commentFieldKey: 'work_notes'
  }
};
exports.snExternalServiceConfig = snExternalServiceConfig;
const FIELD_PREFIX = 'u_';
exports.FIELD_PREFIX = FIELD_PREFIX;
const DEFAULT_ALERTS_GROUPING_KEY = '{{rule.id}}:{{alert.id}}';
exports.DEFAULT_ALERTS_GROUPING_KEY = DEFAULT_ALERTS_GROUPING_KEY;