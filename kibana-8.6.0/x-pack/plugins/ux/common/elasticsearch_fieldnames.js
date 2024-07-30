"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.USER_AGENT_OS = exports.USER_AGENT_NAME = exports.USER_AGENT_DEVICE = exports.URL_FULL = exports.TRANSACTION_URL = exports.TRANSACTION_TYPE = exports.TRANSACTION_TIME_TO_FIRST_BYTE = exports.TRANSACTION_RESULT = exports.TRANSACTION_NAME = exports.TRANSACTION_ID = exports.TRANSACTION_DURATION = exports.TRANSACTION_DOM_INTERACTIVE = exports.TBT_FIELD = exports.SERVICE_NAME = exports.SERVICE_LANGUAGE_NAME = exports.SERVICE_ENVIRONMENT = exports.SERVICE = exports.PROCESSOR_EVENT = exports.LCP_FIELD = exports.FID_FIELD = exports.FCP_FIELD = exports.ERROR_GROUP_ID = exports.ERROR_EXC_TYPE = exports.ERROR_EXC_MESSAGE = exports.CLS_FIELD = exports.CLIENT_GEO_COUNTRY_ISO_CODE = exports.CLIENT_GEO = exports.AGENT_VERSION = exports.AGENT_NAME = exports.AGENT = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SERVICE = 'service';
exports.SERVICE = SERVICE;
const SERVICE_NAME = 'service.name';
exports.SERVICE_NAME = SERVICE_NAME;
const SERVICE_ENVIRONMENT = 'service.environment';
exports.SERVICE_ENVIRONMENT = SERVICE_ENVIRONMENT;
const AGENT = 'agent';
exports.AGENT = AGENT;
const AGENT_NAME = 'agent.name';
exports.AGENT_NAME = AGENT_NAME;
const AGENT_VERSION = 'agent.version';
exports.AGENT_VERSION = AGENT_VERSION;
const ERROR_EXC_MESSAGE = 'error.exception.message';
exports.ERROR_EXC_MESSAGE = ERROR_EXC_MESSAGE;
const ERROR_EXC_TYPE = 'error.exception.type';
exports.ERROR_EXC_TYPE = ERROR_EXC_TYPE;
const ERROR_GROUP_ID = 'error.grouping_key';
exports.ERROR_GROUP_ID = ERROR_GROUP_ID;
const PROCESSOR_EVENT = 'processor.event';
exports.PROCESSOR_EVENT = PROCESSOR_EVENT;
const URL_FULL = 'url.full';
exports.URL_FULL = URL_FULL;
const USER_AGENT_NAME = 'user_agent.name';
exports.USER_AGENT_NAME = USER_AGENT_NAME;
const SERVICE_LANGUAGE_NAME = 'service.language.name';
exports.SERVICE_LANGUAGE_NAME = SERVICE_LANGUAGE_NAME;
const TRANSACTION_DURATION = 'transaction.duration.us';
exports.TRANSACTION_DURATION = TRANSACTION_DURATION;
const TRANSACTION_TYPE = 'transaction.type';
exports.TRANSACTION_TYPE = TRANSACTION_TYPE;
const TRANSACTION_RESULT = 'transaction.result';
exports.TRANSACTION_RESULT = TRANSACTION_RESULT;
const TRANSACTION_NAME = 'transaction.name';
exports.TRANSACTION_NAME = TRANSACTION_NAME;
const TRANSACTION_ID = 'transaction.id';
exports.TRANSACTION_ID = TRANSACTION_ID;
const CLIENT_GEO_COUNTRY_ISO_CODE = 'client.geo.country_iso_code';

// RUM Labels
exports.CLIENT_GEO_COUNTRY_ISO_CODE = CLIENT_GEO_COUNTRY_ISO_CODE;
const TRANSACTION_URL = 'url.full';
exports.TRANSACTION_URL = TRANSACTION_URL;
const CLIENT_GEO = 'client.geo';
exports.CLIENT_GEO = CLIENT_GEO;
const USER_AGENT_DEVICE = 'user_agent.device.name';
exports.USER_AGENT_DEVICE = USER_AGENT_DEVICE;
const USER_AGENT_OS = 'user_agent.os.name';
exports.USER_AGENT_OS = USER_AGENT_OS;
const TRANSACTION_TIME_TO_FIRST_BYTE = 'transaction.marks.agent.timeToFirstByte';
exports.TRANSACTION_TIME_TO_FIRST_BYTE = TRANSACTION_TIME_TO_FIRST_BYTE;
const TRANSACTION_DOM_INTERACTIVE = 'transaction.marks.agent.domInteractive';
exports.TRANSACTION_DOM_INTERACTIVE = TRANSACTION_DOM_INTERACTIVE;
const FCP_FIELD = 'transaction.marks.agent.firstContentfulPaint';
exports.FCP_FIELD = FCP_FIELD;
const LCP_FIELD = 'transaction.marks.agent.largestContentfulPaint';
exports.LCP_FIELD = LCP_FIELD;
const TBT_FIELD = 'transaction.experience.tbt';
exports.TBT_FIELD = TBT_FIELD;
const FID_FIELD = 'transaction.experience.fid';
exports.FID_FIELD = FID_FIELD;
const CLS_FIELD = 'transaction.experience.cls';
exports.CLS_FIELD = CLS_FIELD;