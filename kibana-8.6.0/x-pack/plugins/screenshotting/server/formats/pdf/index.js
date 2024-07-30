"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPdf = toPdf;
var PDFJS = _interopRequireWildcard(require("pdfjs-dist/legacy/build/pdf.js"));
var _lodash = require("lodash");
var _event_logger = require("../../screenshots/event_logger");
var _pdf_maker = require("./pdf_maker");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// FIXME: Once/if we have the ability to get page count directly from Chrome/puppeteer
// we should get rid of this lib.

function getTimeRange(results) {
  const grouped = (0, _lodash.groupBy)(results.map(({
    timeRange
  }) => timeRange));
  const values = Object.values(grouped);
  if (values.length !== 1) {
    return;
  }
  return values[0][0];
}
async function toPdf(eventLogger, packageInfo, layout, {
  logo,
  title
}, {
  metrics,
  results
}) {
  let buffer;
  let pages;
  const shouldConvertPngsToPdf = layout.id !== 'print';
  if (shouldConvertPngsToPdf) {
    const timeRange = getTimeRange(results);
    try {
      ({
        buffer,
        pages
      } = await (0, _pdf_maker.pngsToPdf)({
        title: title ? `${title}${timeRange ? ` - ${timeRange}` : ''}` : undefined,
        results,
        layout,
        logo,
        packageInfo,
        eventLogger
      }));
      return {
        metrics: {
          ...(metrics !== null && metrics !== void 0 ? metrics : {}),
          pages
        },
        data: buffer,
        errors: results.flatMap(({
          error
        }) => error ? [error] : []),
        renderErrors: results.flatMap(({
          renderErrors
        }) => renderErrors !== null && renderErrors !== void 0 ? renderErrors : [])
      };
    } catch (error) {
      eventLogger.kbnLogger.error(`Could not generate the PDF buffer!`);
      eventLogger.error(error, _event_logger.Transactions.PDF);
      throw error;
    }
  } else {
    buffer = results[0].screenshots[0].data; // This buffer is already the PDF
    pages = await PDFJS.getDocument({
      data: buffer
    }).promise.then(doc => {
      const numPages = doc.numPages;
      doc.destroy();
      return numPages;
    });
  }
  return {
    metrics: {
      ...(metrics !== null && metrics !== void 0 ? metrics : {}),
      pages
    },
    data: buffer,
    errors: results.flatMap(({
      error
    }) => error ? [error] : []),
    renderErrors: results.flatMap(({
      renderErrors
    }) => renderErrors !== null && renderErrors !== void 0 ? renderErrors : [])
  };
}