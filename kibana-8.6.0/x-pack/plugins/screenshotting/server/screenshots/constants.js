"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_PAGELOAD_SELECTOR = exports.CONTEXT_WAITFORRENDER = exports.CONTEXT_WAITFORELEMENTSTOBEINDOM = exports.CONTEXT_SKIPTELEMETRY = exports.CONTEXT_READMETADATA = exports.CONTEXT_INJECTCSS = exports.CONTEXT_GETTIMERANGE = exports.CONTEXT_GETRENDERERRORS = exports.CONTEXT_GETNUMBEROFITEMS = exports.CONTEXT_ELEMENTATTRIBUTES = exports.CONTEXT_DEBUG = void 0;
var _server = require("../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_PAGELOAD_SELECTOR = `.${_server.APP_WRAPPER_CLASS}`;

// FIXME: cleanup: remove this file and use the EventLogger's Actions enum instead
exports.DEFAULT_PAGELOAD_SELECTOR = DEFAULT_PAGELOAD_SELECTOR;
const CONTEXT_GETNUMBEROFITEMS = 'GetNumberOfItems';
exports.CONTEXT_GETNUMBEROFITEMS = CONTEXT_GETNUMBEROFITEMS;
const CONTEXT_INJECTCSS = 'InjectCss';
exports.CONTEXT_INJECTCSS = CONTEXT_INJECTCSS;
const CONTEXT_WAITFORRENDER = 'WaitForRender';
exports.CONTEXT_WAITFORRENDER = CONTEXT_WAITFORRENDER;
const CONTEXT_GETRENDERERRORS = 'GetVisualisationsRenderErrors';
exports.CONTEXT_GETRENDERERRORS = CONTEXT_GETRENDERERRORS;
const CONTEXT_GETTIMERANGE = 'GetTimeRange';
exports.CONTEXT_GETTIMERANGE = CONTEXT_GETTIMERANGE;
const CONTEXT_ELEMENTATTRIBUTES = 'ElementPositionAndAttributes';
exports.CONTEXT_ELEMENTATTRIBUTES = CONTEXT_ELEMENTATTRIBUTES;
const CONTEXT_WAITFORELEMENTSTOBEINDOM = 'WaitForElementsToBeInDOM';
exports.CONTEXT_WAITFORELEMENTSTOBEINDOM = CONTEXT_WAITFORELEMENTSTOBEINDOM;
const CONTEXT_SKIPTELEMETRY = 'SkipTelemetry';
exports.CONTEXT_SKIPTELEMETRY = CONTEXT_SKIPTELEMETRY;
const CONTEXT_READMETADATA = 'ReadVisualizationsMetadata';
exports.CONTEXT_READMETADATA = CONTEXT_READMETADATA;
const CONTEXT_DEBUG = 'Debug';
exports.CONTEXT_DEBUG = CONTEXT_DEBUG;