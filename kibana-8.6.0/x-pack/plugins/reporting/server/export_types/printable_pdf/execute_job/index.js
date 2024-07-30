"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTaskFnFactory = void 0;
var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));
var Rx = _interopRequireWildcard(require("rxjs"));
var _operators = require("rxjs/operators");
var _constants = require("../../../../common/constants");
var _common = require("../../common");
var _generate_pdf = require("../lib/generate_pdf");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const runTaskFnFactory = function executeJobFactoryFn(reporting, parentLogger) {
  const config = reporting.getConfig();
  const encryptionKey = config.get('encryptionKey');
  return async function runTask(jobId, job, cancellationToken, stream) {
    const jobLogger = parentLogger.get(`execute-job:${jobId}`);
    const apmTrans = _elasticApmNode.default.startTransaction('execute-job-pdf', _constants.REPORTING_TRANSACTION_TYPE);
    const apmGetAssets = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('get-assets', 'setup');
    let apmGeneratePdf;
    const process$ = Rx.of(1).pipe((0, _operators.mergeMap)(() => (0, _common.decryptJobHeaders)(encryptionKey, job.headers, jobLogger)), (0, _operators.mergeMap)(headers => (0, _common.getCustomLogo)(reporting, headers, job.spaceId, jobLogger)), (0, _operators.mergeMap)(({
      headers,
      logo
    }) => {
      const urls = (0, _common.getFullUrls)(config, job);
      const {
        browserTimezone,
        layout,
        title
      } = job;
      apmGetAssets === null || apmGetAssets === void 0 ? void 0 : apmGetAssets.end();
      apmGeneratePdf = apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('generate-pdf-pipeline', 'execute');
      return (0, _generate_pdf.generatePdfObservable)(reporting, {
        format: 'pdf',
        title,
        logo,
        urls,
        browserTimezone,
        headers,
        layout
      });
    }), (0, _operators.tap)(({
      buffer
    }) => {
      var _apmGeneratePdf;
      (_apmGeneratePdf = apmGeneratePdf) === null || _apmGeneratePdf === void 0 ? void 0 : _apmGeneratePdf.end();
      if (buffer) {
        stream.write(buffer);
      }
    }), (0, _operators.map)(({
      metrics,
      warnings
    }) => ({
      content_type: 'application/pdf',
      metrics: {
        pdf: metrics
      },
      warnings
    })), (0, _operators.catchError)(err => {
      jobLogger.error(err);
      return Rx.throwError(err);
    }));
    const stop$ = Rx.fromEventPattern(cancellationToken.on);
    apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.end();
    return Rx.lastValueFrom(process$.pipe((0, _operators.takeUntil)(stop$)));
  };
};
exports.runTaskFnFactory = runTaskFnFactory;