"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strings = exports.errors = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const strings = {
  getPieVisFunctionName: () => _i18n.i18n.translate('expressionPartitionVis.pieVis.function.help', {
    defaultMessage: 'Pie visualization'
  }),
  getMetricArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.metricHelpText', {
    defaultMessage: 'Metric dimensions config'
  }),
  getMetricToLabelHelp: () => _i18n.i18n.translate('expressionPartitionVis.metricToLabel.help', {
    defaultMessage: 'JSON key-value pairs of column ID to label'
  }),
  getBucketsArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.bucketsHelpText', {
    defaultMessage: 'Buckets dimensions config'
  }),
  getBucketArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.waffle.function.args.bucketHelpText', {
    defaultMessage: 'Bucket dimensions config'
  }),
  getSplitColumnArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.splitColumnHelpText', {
    defaultMessage: 'Split by column dimension config'
  }),
  getSplitRowArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.splitRowHelpText', {
    defaultMessage: 'Split by row dimension config'
  }),
  getAddTooltipArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.addTooltipHelpText', {
    defaultMessage: 'Show tooltip on slice hover'
  }),
  getLegendDisplayArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.legendDisplayHelpText', {
    defaultMessage: 'Show legend chart legend'
  }),
  getLegendPositionArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.legendPositionHelpText', {
    defaultMessage: 'Position the legend on top, bottom, left, right of the chart'
  }),
  getLegendSizeArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.legendSizeHelpText', {
    defaultMessage: 'Specifies the legend size'
  }),
  getNestedLegendArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.nestedLegendHelpText', {
    defaultMessage: 'Show a more detailed legend'
  }),
  getTruncateLegendArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.truncateLegendHelpText', {
    defaultMessage: 'Defines if the legend items will be truncated or not'
  }),
  getMaxLegendLinesArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.maxLegendLinesHelpText', {
    defaultMessage: 'Defines the number of lines per legend item'
  }),
  getDistinctColorsArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.pieVis.function.args.distinctColorsHelpText', {
    defaultMessage: 'Maps different color per slice. Slices with the same value have the same color'
  }),
  getIsDonutArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.isDonutHelpText', {
    defaultMessage: 'Displays the pie chart as donut'
  }),
  getRespectSourceOrderArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.respectSourceOrderHelpText', {
    defaultMessage: 'Keeps an order of the elements, returned from the datasource'
  }),
  getStartFromSecondLargestSliceArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.startPlacementWithSecondLargestSliceHelpText', {
    defaultMessage: 'Starts placement with the second largest slice'
  }),
  getEmptySizeRatioArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.emptySizeRatioHelpText', {
    defaultMessage: 'Defines donut inner empty area size'
  }),
  getPaletteArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.paletteHelpText', {
    defaultMessage: 'Defines the chart palette name'
  }),
  getLabelsArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.args.labelsHelpText', {
    defaultMessage: 'Pie labels config'
  }),
  getShowValuesInLegendArgHelp: () => _i18n.i18n.translate('expressionPartitionVis.waffle.function.args.showValuesInLegendHelpText', {
    defaultMessage: 'Show values in legend'
  }),
  getAriaLabelHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.functions.args.ariaLabelHelpText', {
    defaultMessage: 'Specifies the aria label of the chart'
  }),
  getSliceSizeHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.dimension.metric', {
    defaultMessage: 'Slice size'
  }),
  getSliceHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.dimension.buckets', {
    defaultMessage: 'Slice'
  }),
  getColumnSplitHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.dimension.splitcolumn', {
    defaultMessage: 'Column split'
  }),
  getRowSplitHelp: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.dimension.splitrow', {
    defaultMessage: 'Row split'
  })
};
exports.strings = strings;
const errors = {
  moreThanNBucketsAreNotSupportedError: maxLength => _i18n.i18n.translate('expressionPartitionVis.reusable.function.errors.moreThenNumberBuckets', {
    defaultMessage: 'More than {maxLength} buckets are not supported.',
    values: {
      maxLength
    }
  }),
  splitRowAndSplitColumnAreSpecifiedError: () => _i18n.i18n.translate('expressionPartitionVis.reusable.function.errors.splitRowAndColumnSpecified', {
    defaultMessage: 'A split row and column are specified. Expression is supporting only one of them at once.'
  })
};
exports.errors = errors;