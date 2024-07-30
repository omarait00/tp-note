"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TREE_VIEW_SWITCHER_LEGEND = exports.TREE_VIEW_LOGICAL_VIEW = exports.TREE_VIEW_INFRASTRUCTURE_VIEW = exports.TREE_NAVIGATION_SHOW_MORE = exports.TREE_NAVIGATION_LOADING = exports.TREE_NAVIGATION_EXPAND = exports.TREE_NAVIGATION_COLLAPSE = exports.SEARCH_GROUP_SORT_BY = exports.SEARCH_GROUP_GROUP_BY = exports.SEARCH_GROUP_CLUSTER = exports.COUNT_WIDGET_PODS = exports.COUNT_WIDGET_NODES = exports.COUNT_WIDGET_NAMESPACE = exports.COUNT_WIDGET_CONTAINER_IMAGES = exports.COUNT_WIDGET_CLUSTERS = exports.CONTAINER_NAME_SESSION_COUNT_COLUMN = exports.CONTAINER_NAME_SESSION_ARIA_LABEL = exports.CONTAINER_NAME_SESSION = exports.CHART_TOGGLE_SHOW = exports.CHART_TOGGLE_HIDE = exports.BETA = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const BETA = _i18n.i18n.translate('xpack.kubernetesSecurity.beta', {
  defaultMessage: 'Beta'
});
exports.BETA = BETA;
const SEARCH_GROUP_CLUSTER = _i18n.i18n.translate('xpack.kubernetesSecurity.searchGroup.cluster', {
  defaultMessage: 'Cluster'
});
exports.SEARCH_GROUP_CLUSTER = SEARCH_GROUP_CLUSTER;
const SEARCH_GROUP_GROUP_BY = _i18n.i18n.translate('xpack.kubernetesSecurity.searchGroup.groupBy', {
  defaultMessage: 'Group by'
});
exports.SEARCH_GROUP_GROUP_BY = SEARCH_GROUP_GROUP_BY;
const SEARCH_GROUP_SORT_BY = _i18n.i18n.translate('xpack.kubernetesSecurity.searchGroup.sortBy', {
  defaultMessage: 'Sort by'
});
exports.SEARCH_GROUP_SORT_BY = SEARCH_GROUP_SORT_BY;
const TREE_VIEW_LOGICAL_VIEW = _i18n.i18n.translate('xpack.kubernetesSecurity.treeView.logicalView', {
  defaultMessage: 'Logical view'
});
exports.TREE_VIEW_LOGICAL_VIEW = TREE_VIEW_LOGICAL_VIEW;
const TREE_VIEW_INFRASTRUCTURE_VIEW = _i18n.i18n.translate('xpack.kubernetesSecurity.treeView.infrastructureView', {
  defaultMessage: 'Infrastructure view'
});
exports.TREE_VIEW_INFRASTRUCTURE_VIEW = TREE_VIEW_INFRASTRUCTURE_VIEW;
const TREE_VIEW_SWITCHER_LEGEND = _i18n.i18n.translate('xpack.kubernetesSecurity.treeView.switherLegend', {
  defaultMessage: 'You can switch between the Logical and Infrastructure view'
});
exports.TREE_VIEW_SWITCHER_LEGEND = TREE_VIEW_SWITCHER_LEGEND;
const TREE_NAVIGATION_LOADING = _i18n.i18n.translate('xpack.kubernetesSecurity.treeNavigation.loading', {
  defaultMessage: 'Loading'
});
exports.TREE_NAVIGATION_LOADING = TREE_NAVIGATION_LOADING;
const TREE_NAVIGATION_SHOW_MORE = name => _i18n.i18n.translate('xpack.kubernetesSecurity.treeNavigation.loadMore', {
  values: {
    name
  },
  defaultMessage: 'Show more {name}'
});
exports.TREE_NAVIGATION_SHOW_MORE = TREE_NAVIGATION_SHOW_MORE;
const TREE_NAVIGATION_COLLAPSE = _i18n.i18n.translate('xpack.kubernetesSecurity.treeNavigation.collapse', {
  defaultMessage: 'Collapse Tree Navigation'
});
exports.TREE_NAVIGATION_COLLAPSE = TREE_NAVIGATION_COLLAPSE;
const TREE_NAVIGATION_EXPAND = _i18n.i18n.translate('xpack.kubernetesSecurity.treeNavigation.expand', {
  defaultMessage: 'Expand Tree Navigation'
});
exports.TREE_NAVIGATION_EXPAND = TREE_NAVIGATION_EXPAND;
const CHART_TOGGLE_SHOW = _i18n.i18n.translate('xpack.kubernetesSecurity.chartsToggle.show', {
  defaultMessage: 'Show charts'
});
exports.CHART_TOGGLE_SHOW = CHART_TOGGLE_SHOW;
const CHART_TOGGLE_HIDE = _i18n.i18n.translate('xpack.kubernetesSecurity.chartsToggle.hide', {
  defaultMessage: 'Hide charts'
});
exports.CHART_TOGGLE_HIDE = CHART_TOGGLE_HIDE;
const COUNT_WIDGET_CLUSTERS = _i18n.i18n.translate('xpack.kubernetesSecurity.countWidget.clusters', {
  defaultMessage: 'Clusters'
});
exports.COUNT_WIDGET_CLUSTERS = COUNT_WIDGET_CLUSTERS;
const COUNT_WIDGET_NAMESPACE = _i18n.i18n.translate('xpack.kubernetesSecurity.countWidget.namespace', {
  defaultMessage: 'Namespace'
});
exports.COUNT_WIDGET_NAMESPACE = COUNT_WIDGET_NAMESPACE;
const COUNT_WIDGET_NODES = _i18n.i18n.translate('xpack.kubernetesSecurity.countWidget.nodes', {
  defaultMessage: 'Nodes'
});
exports.COUNT_WIDGET_NODES = COUNT_WIDGET_NODES;
const COUNT_WIDGET_PODS = _i18n.i18n.translate('xpack.kubernetesSecurity.countWidget.pods', {
  defaultMessage: 'Pods'
});
exports.COUNT_WIDGET_PODS = COUNT_WIDGET_PODS;
const COUNT_WIDGET_CONTAINER_IMAGES = _i18n.i18n.translate('xpack.kubernetesSecurity.countWidget.containerImages', {
  defaultMessage: 'Container Images'
});
exports.COUNT_WIDGET_CONTAINER_IMAGES = COUNT_WIDGET_CONTAINER_IMAGES;
const CONTAINER_NAME_SESSION = _i18n.i18n.translate('xpack.kubernetesSecurity.containerNameWidget.containerImage', {
  defaultMessage: 'Container images'
});
exports.CONTAINER_NAME_SESSION = CONTAINER_NAME_SESSION;
const CONTAINER_NAME_SESSION_COUNT_COLUMN = _i18n.i18n.translate('xpack.kubernetesSecurity.containerNameWidget.containerImageCountColumn', {
  defaultMessage: 'Session count'
});
exports.CONTAINER_NAME_SESSION_COUNT_COLUMN = CONTAINER_NAME_SESSION_COUNT_COLUMN;
const CONTAINER_NAME_SESSION_ARIA_LABEL = _i18n.i18n.translate('xpack.kubernetesSecurity.containerNameWidget.containerImageAriaLabel', {
  defaultMessage: 'Container Name Session Widget'
});
exports.CONTAINER_NAME_SESSION_ARIA_LABEL = CONTAINER_NAME_SESSION_ARIA_LABEL;