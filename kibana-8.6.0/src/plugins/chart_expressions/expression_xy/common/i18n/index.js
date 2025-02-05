"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strings = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const strings = {
  getXYHelp: () => _i18n.i18n.translate('expressionXY.xyVis.help', {
    defaultMessage: 'An X/Y chart'
  }),
  getMetricHelp: () => _i18n.i18n.translate('expressionXY.xyVis.logDatatable.metric', {
    defaultMessage: 'Vertical axis'
  }),
  getXAxisHelp: () => _i18n.i18n.translate('expressionXY.xyVis.logDatatable.x', {
    defaultMessage: 'Horizontal axis'
  }),
  getBreakdownHelp: () => _i18n.i18n.translate('expressionXY.xyVis.logDatatable.breakDown', {
    defaultMessage: 'Break down by'
  }),
  getSplitRowHelp: () => _i18n.i18n.translate('expressionXY.xyVis.logDatatable.splitRow', {
    defaultMessage: 'Split rows by'
  }),
  getSplitColumnHelp: () => _i18n.i18n.translate('expressionXY.xyVis.logDatatable.splitColumn', {
    defaultMessage: 'Split columns by'
  }),
  getMarkSizeHelp: () => _i18n.i18n.translate('expressionXY.xyVis.logDatatable.markSize', {
    defaultMessage: 'Mark size'
  }),
  getReferenceLineHelp: () => _i18n.i18n.translate('expressionXY.xyVis.logDatatable.breakDown', {
    defaultMessage: 'Break down by'
  }),
  getLegendHelp: () => _i18n.i18n.translate('expressionXY.xyVis.legend.help', {
    defaultMessage: 'Configure the chart legend.'
  }),
  getFittingFunctionHelp: () => _i18n.i18n.translate('expressionXY.xyVis.fittingFunction.help', {
    defaultMessage: 'Define how missing values are treated'
  }),
  getEndValueHelp: () => _i18n.i18n.translate('expressionXY.xyVis.endValue.help', {
    defaultMessage: 'End value'
  }),
  getValueLabelsHelp: () => _i18n.i18n.translate('expressionXY.xyVis.valueLabels.help', {
    defaultMessage: 'Value labels mode'
  }),
  getDataLayerHelp: () => _i18n.i18n.translate('expressionXY.xyVis.dataLayer.help', {
    defaultMessage: 'Data layer of visual series'
  }),
  getReferenceLinesHelp: () => _i18n.i18n.translate('expressionXY.xyVis.referenceLines.help', {
    defaultMessage: 'Reference line'
  }),
  getAnnotationLayerHelp: () => _i18n.i18n.translate('expressionXY.xyVis.annotationLayer.help', {
    defaultMessage: 'Annotation layer'
  }),
  getCurveTypeHelp: () => _i18n.i18n.translate('expressionXY.xyVis.curveType.help', {
    defaultMessage: 'Define how curve type is rendered for a line chart'
  }),
  getFillOpacityHelp: () => _i18n.i18n.translate('expressionXY.xyVis.fillOpacity.help', {
    defaultMessage: 'Define the area chart fill opacity'
  }),
  getHideEndzonesHelp: () => _i18n.i18n.translate('expressionXY.xyVis.hideEndzones.help', {
    defaultMessage: 'Hide endzone markers for partial data'
  }),
  getValuesInLegendHelp: () => _i18n.i18n.translate('expressionXY.xyVis.valuesInLegend.help', {
    defaultMessage: 'Show values in legend'
  }),
  getAriaLabelHelp: () => _i18n.i18n.translate('expressionXY.xyVis.ariaLabel.help', {
    defaultMessage: 'Specifies the aria label of the xy chart'
  }),
  getXAxisConfigHelp: () => _i18n.i18n.translate('expressionXY.xyVis.xAxisConfig.help', {
    defaultMessage: 'Specifies x-axis config'
  }),
  getyAxisConfigsHelp: () => _i18n.i18n.translate('expressionXY.xyVis.yAxisConfigs.help', {
    defaultMessage: 'Specifies y-axes configs'
  }),
  getDetailedTooltipHelp: () => _i18n.i18n.translate('expressionXY.xyVis.detailedTooltip.help', {
    defaultMessage: 'Show detailed tooltip'
  }),
  getShowTooltipHelp: () => _i18n.i18n.translate('expressionXY.xyVis.showTooltip.help', {
    defaultMessage: 'Show tooltip'
  }),
  getOrderBucketsBySum: () => _i18n.i18n.translate('expressionXY.xyVis.orderBucketsBySum.help', {
    defaultMessage: 'Order buckets by sum'
  }),
  getAddTimeMakerHelp: () => _i18n.i18n.translate('expressionXY.xyVis.addTimeMaker.help', {
    defaultMessage: 'Show time marker'
  }),
  getMarkSizeRatioHelp: () => _i18n.i18n.translate('expressionXY.xyVis.markSizeRatio.help', {
    defaultMessage: 'Specifies the ratio of the dots at the line and area charts'
  }),
  getMinTimeBarIntervalHelp: () => _i18n.i18n.translate('expressionXY.xyVis.xAxisInterval.help', {
    defaultMessage: 'Specifies the min interval for time bar chart'
  }),
  getSplitColumnAccessorHelp: () => _i18n.i18n.translate('expressionXY.xyVis.splitColumnAccessor.help', {
    defaultMessage: 'Specifies split column of the xy chart'
  }),
  getSplitRowAccessorHelp: () => _i18n.i18n.translate('expressionXY.xyVis.splitRowAccessor.help', {
    defaultMessage: 'Specifies split row of the xy chart'
  }),
  getLayersHelp: () => _i18n.i18n.translate('expressionXY.layeredXyVis.layers.help', {
    defaultMessage: 'Layers of visual series'
  }),
  getDataLayerFnHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.help', {
    defaultMessage: `Configure a layer in the xy chart`
  }),
  getSimpleView: () => _i18n.i18n.translate('expressionXY.dataLayer.simpleView.help', {
    defaultMessage: 'Show / hide details'
  }),
  getXAccessorHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.xAccessor.help', {
    defaultMessage: 'X-axis'
  }),
  getSeriesTypeHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.seriesType.help', {
    defaultMessage: 'The type of chart to display.'
  }),
  getXScaleTypeHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.xScaleType.help', {
    defaultMessage: 'The scale type of the x axis'
  }),
  getIsHistogramHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.isHistogram.help', {
    defaultMessage: 'Whether to layout the chart as a histogram'
  }),
  getIsStackedHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.isStacked.help', {
    defaultMessage: 'Layout of the chart in stacked mode'
  }),
  getIsPercentageHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.isPercentage.help', {
    defaultMessage: 'Whether to layout the chart has percentage mode'
  }),
  getIsHorizontalHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.isHorizontal.help', {
    defaultMessage: 'Layout of the chart is horizontal'
  }),
  getSplitAccessorHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.splitAccessor.help', {
    defaultMessage: 'The column to split by'
  }),
  getAccessorsHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.accessors.help', {
    defaultMessage: 'The columns to display on the y axis.'
  }),
  getMarkSizeAccessorHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.markSizeAccessor.help', {
    defaultMessage: 'Mark size accessor'
  }),
  getLineWidthHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.lineWidth.help', {
    defaultMessage: 'Line width'
  }),
  getShowPointsHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.showPoints.help', {
    defaultMessage: 'Show points'
  }),
  getPointsRadiusHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.pointsRadius.help', {
    defaultMessage: 'Points radius'
  }),
  getShowLinesHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.showLines.help', {
    defaultMessage: 'Show lines between points'
  }),
  getDecorationsHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.decorations.help', {
    defaultMessage: 'Additional decoration for data'
  }),
  getColumnToLabelHelp: () => _i18n.i18n.translate('expressionXY.layer.columnToLabel.help', {
    defaultMessage: 'JSON key-value pairs of column ID to label'
  }),
  getPaletteHelp: () => _i18n.i18n.translate('expressionXY.dataLayer.palette.help', {
    defaultMessage: 'Palette'
  }),
  getTableHelp: () => _i18n.i18n.translate('expressionXY.layers.table.help', {
    defaultMessage: 'Table'
  }),
  getLayerIdHelp: () => _i18n.i18n.translate('expressionXY.layers.layerId.help', {
    defaultMessage: 'Layer ID'
  }),
  getRLAccessorsHelp: () => _i18n.i18n.translate('expressionXY.referenceLineLayer.accessors.help', {
    defaultMessage: 'The columns to display on the y axis.'
  }),
  getRLDecorationConfigHelp: () => _i18n.i18n.translate('expressionXY.referenceLineLayer.decorationConfig.help', {
    defaultMessage: 'Additional decoration for reference line'
  }),
  getRLHelp: () => _i18n.i18n.translate('expressionXY.referenceLineLayer.help', {
    defaultMessage: `Configure a reference line in the xy chart`
  }),
  getForAccessorHelp: () => _i18n.i18n.translate('expressionXY.decorationConfig.forAccessor.help', {
    defaultMessage: 'The accessor this configuration is for'
  }),
  getColorHelp: () => _i18n.i18n.translate('expressionXY.decorationConfig.color.help', {
    defaultMessage: 'The color of the series'
  }),
  getAxisIdHelp: () => _i18n.i18n.translate('expressionXY.decorationConfig.axisId.help', {
    defaultMessage: 'Id of axis'
  }),
  getAnnotationLayerFnHelp: () => _i18n.i18n.translate('expressionXY.annotationLayer.help', {
    defaultMessage: `Configure an annotation layer in the xy chart`
  }),
  getAnnotationLayerSimpleViewHelp: () => _i18n.i18n.translate('expressionXY.annotationLayer.simpleView.help', {
    defaultMessage: 'Show / hide details'
  }),
  getAnnotationLayerAnnotationsHelp: () => _i18n.i18n.translate('expressionXY.annotationLayer.annotations.help', {
    defaultMessage: 'Annotations'
  }),
  getXAxisConfigFnHelp: () => _i18n.i18n.translate('expressionXY.xAxisConfigFn.help', {
    defaultMessage: `Configure the xy chart's x-axis config`
  }),
  getYAxisConfigFnHelp: () => _i18n.i18n.translate('expressionXY.yAxisConfigFn.help', {
    defaultMessage: `Configure the xy chart's y-axis config`
  }),
  getAxisModeHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.mode.help', {
    defaultMessage: 'Scale mode. Can be normal, percentage, wiggle or silhouette'
  }),
  getAxisBoundsMarginHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.boundsMargin.help', {
    defaultMessage: 'Margin of bounds'
  }),
  getAxisExtentHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.extent.help', {
    defaultMessage: 'Axis extents'
  }),
  getAxisScaleTypeHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.scaleType.help', {
    defaultMessage: 'The scale type of the axis'
  }),
  getAxisTitleHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.title.help', {
    defaultMessage: 'Title of axis'
  }),
  getAxisPositionHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.position.help', {
    defaultMessage: 'Position of axis'
  }),
  getAxisHideHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.hide.help', {
    defaultMessage: 'Hide the axis'
  }),
  getAxisLabelColorHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.labelColor.help', {
    defaultMessage: 'Color of the axis labels'
  }),
  getAxisShowOverlappingLabelsHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.showOverlappingLabels.help', {
    defaultMessage: 'Show overlapping labels'
  }),
  getAxisShowDuplicatesHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.showDuplicates.help', {
    defaultMessage: 'Show duplicated ticks'
  }),
  getAxisShowGridLinesHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.showGridLines.help', {
    defaultMessage: 'Specifies whether or not the gridlines of the axis are visible'
  }),
  getAxisLabelsOrientationHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.labelsOrientation.help', {
    defaultMessage: 'Specifies the labels orientation of the axis'
  }),
  getAxisShowLabelsHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.showLabels.help', {
    defaultMessage: 'Show labels'
  }),
  getAxisShowTitleHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.showTitle.help', {
    defaultMessage: 'Show title of the axis'
  }),
  getAxisTruncateHelp: () => _i18n.i18n.translate('expressionXY.axisConfig.truncate.help', {
    defaultMessage: 'The number of symbols before truncating'
  }),
  getReferenceLineNameHelp: () => _i18n.i18n.translate('expressionXY.referenceLine.name.help', {
    defaultMessage: 'Reference line name'
  }),
  getReferenceLineValueHelp: () => _i18n.i18n.translate('expressionXY.referenceLine.Value.help', {
    defaultMessage: 'Reference line value'
  }),
  getTimeLabel: () => _i18n.i18n.translate('expressionXY.annotation.time', {
    defaultMessage: 'Time'
  }),
  getLabelLabel: () => _i18n.i18n.translate('expressionXY.annotation.label', {
    defaultMessage: 'Label'
  })
};
exports.strings = strings;