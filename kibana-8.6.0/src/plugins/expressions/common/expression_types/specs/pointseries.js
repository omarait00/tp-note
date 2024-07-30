"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointseries = exports.PointSeriesColumnNames = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const name = 'pointseries';
const PointSeriesColumnNames = {
  X: 'x',
  Y: 'y',
  COLOR: 'color',
  SIZE: 'size',
  TEXT: 'text'
};

/**
 * Allowed column names in a PointSeries
 */
exports.PointSeriesColumnNames = PointSeriesColumnNames;
const pointseries = {
  name,
  from: {
    null: () => {
      return {
        type: name,
        rows: [],
        columns: {}
      };
    }
  },
  to: {
    render: (pseries, types) => {
      const datatable = types.datatable.from(pseries, types);
      return {
        type: 'render',
        as: 'table',
        value: {
          datatable,
          showHeader: true
        }
      };
    }
  }
};
exports.pointseries = pointseries;