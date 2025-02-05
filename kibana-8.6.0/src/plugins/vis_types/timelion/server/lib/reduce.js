"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _std = require("@kbn/std");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function allSeriesContainKey(seriesList, key) {
  const containsKeyInitialValue = true;
  return seriesList.list.reduce((containsKey, series) => {
    return containsKey && _lodash.default.has(series, key);
  }, containsKeyInitialValue);
}

/**
 * Pairwise reduce seriesList
 * @params {seriesList} left
 * @params {seriesList} right
 * @params {Function} fn - Function used to combine points at same index in each array of each series in the seriesList.
 * @return {seriesList}
 */
async function pairwiseReduce(left, right, fn) {
  if (left.list.length !== right.list.length) {
    throw new Error('Unable to pairwise reduce seriesLists, number of series are not the same');
  }
  let pairwiseField = 'label';
  if (allSeriesContainKey(left, 'split') && allSeriesContainKey(right, 'split')) {
    pairwiseField = 'split';
  }
  const indexedList = _lodash.default.keyBy(right.list, pairwiseField);

  // ensure seriesLists contain same pairwise labels
  left.list.forEach(leftSeries => {
    if (!indexedList[leftSeries[pairwiseField]]) {
      const rightSeriesLabels = right.list.map(rightSeries => {
        return `"${rightSeries[pairwiseField]}"`;
      }).join(',');
      throw new Error(`Matching series could not be found for "${leftSeries[pairwiseField]}" in [${rightSeriesLabels}]`);
    }
  });

  // pairwise reduce seriesLists
  return {
    type: 'seriesList',
    list: await (0, _std.asyncMap)(left.list, async leftSeries => {
      const first = {
        type: 'seriesList',
        list: [leftSeries]
      };
      const second = {
        type: 'seriesList',
        list: [indexedList[leftSeries[pairwiseField]]]
      };
      const reducedSeriesList = await reduce([first, second], fn);
      const reducedSeries = reducedSeriesList.list[0];
      reducedSeries.label = leftSeries[pairwiseField];
      return reducedSeries;
    })
  };
}

/**
 * Reduces multiple arrays into a single array using a function
 * @param {Array} args - args[0] must always be a {type: 'seriesList'}
 *
 * - If only arg[0] exists, the seriesList will be reduced to a seriesList containing a single series
 * - If multiple arguments are passed, each argument will be mapped onto each series in the seriesList.

 * @params {Function} fn - Function used to combine points at same index in each array of each series in the seriesList.
 * @return {seriesList}
 */
async function reduce(argsPromises, fn) {
  const args = await Promise.all(argsPromises);
  const seriesList = args.shift();
  let argument = args.shift();
  if (seriesList.type !== 'seriesList') {
    throw new Error('input must be a seriesList');
  }
  if (_lodash.default.isObject(argument) && argument.type === 'seriesList') {
    if (argument.list.length > 1) {
      return await pairwiseReduce(seriesList, argument, fn);
    } else {
      argument = argument.list[0];
    }
  }
  function reduceSeries(series) {
    return _lodash.default.reduce(series, function (destinationObject, argument, i, p) {
      let output = _lodash.default.map(destinationObject.data, function (point, index) {
        const value = point[1];
        if (value == null) {
          return [point[0], null];
        }
        if (_lodash.default.isNumber(argument)) {
          return [point[0], fn(value, argument, i, p)];
        }
        if (argument.data[index] == null || argument.data[index][1] == null) {
          return [point[0], null];
        }
        return [point[0], fn(value, argument.data[index][1], i, p)];
      });

      // Output = single series

      output = {
        data: output
      };
      output = _lodash.default.defaults(output, destinationObject);
      return output;
    });
  }
  let reduced;
  if (argument != null) {
    reduced = _lodash.default.map(seriesList.list, function (series) {
      return reduceSeries([series].concat(argument));
    });
  } else {
    reduced = [reduceSeries(seriesList.list)];
  }
  seriesList.list = reduced;
  return seriesList;
}
var _default = reduce;
exports.default = _default;
module.exports = exports.default;