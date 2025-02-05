"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatColumnFn = void 0;
var _supported_formats = require("./supported_formats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isNestedFormat(params) {
  var _params$params;
  // if there is a nested params object with an id, it's a nested format
  // suffix formatters do not count as nested
  return !!(params !== null && params !== void 0 && (_params$params = params.params) !== null && _params$params !== void 0 && _params$params.id) && params.id !== 'suffix';
}
function withParams(col, params) {
  return {
    ...col,
    meta: {
      ...col.meta,
      params
    }
  };
}
const formatColumnFn = (input, {
  format,
  columnId,
  decimals,
  suffix,
  parentFormat
}) => ({
  ...input,
  columns: input.columns.map(col => {
    if (col.id === columnId) {
      var _parsedParentFormat$p, _col$meta$params;
      if (!parentFormat) {
        if (_supported_formats.supportedFormats[format]) {
          const serializedFormat = {
            id: _supported_formats.supportedFormats[format].formatId,
            params: {
              pattern: _supported_formats.supportedFormats[format].decimalsToPattern(decimals)
            }
          };
          return withParams(col, serializedFormat);
        } else if (format) {
          return withParams(col, {
            id: format
          });
        } else {
          return col;
        }
      }
      const parsedParentFormat = JSON.parse(parentFormat);
      const parentFormatId = parsedParentFormat.id;
      const parentFormatParams = (_parsedParentFormat$p = parsedParentFormat.params) !== null && _parsedParentFormat$p !== void 0 ? _parsedParentFormat$p : {};

      // Be careful here to check for undefined custom format
      const isDuplicateParentFormatter = parentFormatId === ((_col$meta$params = col.meta.params) === null || _col$meta$params === void 0 ? void 0 : _col$meta$params.id) && format == null;
      if (!parentFormatId || isDuplicateParentFormatter) {
        return col;
      }
      if (format && _supported_formats.supportedFormats[format]) {
        var _col$meta$params2, _col$meta$params2$par, _col$meta$params2$par2, _col$meta$params5;
        const customParams = {
          pattern: _supported_formats.supportedFormats[format].decimalsToPattern(decimals)
        };
        // Some parent formatters are multi-fields and wrap the custom format into a "paramsPerField"
        // property. Here the format is passed to this property to make it work properly
        if ((_col$meta$params2 = col.meta.params) !== null && _col$meta$params2 !== void 0 && (_col$meta$params2$par = _col$meta$params2.params) !== null && _col$meta$params2$par !== void 0 && (_col$meta$params2$par2 = _col$meta$params2$par.paramsPerField) !== null && _col$meta$params2$par2 !== void 0 && _col$meta$params2$par2.length) {
          var _col$meta$params3, _col$meta$params4, _col$meta$params4$par;
          return withParams(col, {
            id: parentFormatId,
            params: {
              ...((_col$meta$params3 = col.meta.params) === null || _col$meta$params3 === void 0 ? void 0 : _col$meta$params3.params),
              id: _supported_formats.supportedFormats[format].formatId,
              ...parentFormatParams,
              // some wrapper formatters require params to be flatten out (i.e. terms) while others
              // require them to be in the params property (i.e. ranges)
              // so for now duplicate
              paramsPerField: ((_col$meta$params4 = col.meta.params) === null || _col$meta$params4 === void 0 ? void 0 : (_col$meta$params4$par = _col$meta$params4.params) === null || _col$meta$params4$par === void 0 ? void 0 : _col$meta$params4$par.paramsPerField).map(f => ({
                ...f,
                params: {
                  ...f.params,
                  ...customParams
                },
                ...customParams
              }))
            }
          });
        }
        return withParams(col, {
          id: parentFormatId,
          params: {
            ...((_col$meta$params5 = col.meta.params) === null || _col$meta$params5 === void 0 ? void 0 : _col$meta$params5.params),
            id: _supported_formats.supportedFormats[format].formatId,
            // some wrapper formatters require params to be flatten out (i.e. terms) while others
            // require them to be in the params property (i.e. ranges)
            // so for now duplicate
            ...customParams,
            params: customParams,
            ...parentFormatParams
          }
        });
      }
      if (parentFormatParams) {
        var _col$meta$params6, _col$meta$params7, _col$meta$params8, _col$meta$params9;
        // if original format is already a nested one, we are just replacing the wrapper params
        // otherwise wrapping it inside parentFormatId/parentFormatParams
        const isNested = isNestedFormat(col.meta.params);
        const innerParams = isNested ? (_col$meta$params6 = col.meta.params) === null || _col$meta$params6 === void 0 ? void 0 : _col$meta$params6.params : {
          id: (_col$meta$params7 = col.meta.params) === null || _col$meta$params7 === void 0 ? void 0 : _col$meta$params7.id,
          params: (_col$meta$params8 = col.meta.params) === null || _col$meta$params8 === void 0 ? void 0 : _col$meta$params8.params
        };
        const formatId = isNested ? (_col$meta$params9 = col.meta.params) === null || _col$meta$params9 === void 0 ? void 0 : _col$meta$params9.id : parentFormatId;
        return withParams(col, {
          ...col.meta.params,
          id: formatId,
          params: {
            ...innerParams,
            ...parentFormatParams
          }
        });
      }
    }
    return col;
  }).map(col => {
    if (!suffix) return col;
    if (col.id !== columnId) return col;
    if (!col.meta.params) return col;
    return {
      ...col,
      meta: {
        ...col.meta,
        params: {
          id: 'suffix',
          params: {
            ...col.meta.params,
            suffixString: suffix
          }
        }
      }
    };
  })
});
exports.formatColumnFn = formatColumnFn;