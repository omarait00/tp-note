"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExternalRoutes = void 0;
var _get_cases = require("./cases/alerts/get_cases");
var _delete_cases = require("./cases/delete_cases");
var _find_cases = require("./cases/find_cases");
var _get_case = require("./cases/get_case");
var _patch_cases = require("./cases/patch_cases");
var _post_case = require("./cases/post_case");
var _push_case = require("./cases/push_case");
var _get_reporters = require("./cases/reporters/get_reporters");
var _get_status = require("./stats/get_status");
var _get_all_user_actions = require("./user_actions/get_all_user_actions");
var _get_tags = require("./cases/tags/get_tags");
var _delete_all_comments = require("./comments/delete_all_comments");
var _delete_comment = require("./comments/delete_comment");
var _find_comments = require("./comments/find_comments");
var _get_comment = require("./comments/get_comment");
var _get_all_comment = require("./comments/get_all_comment");
var _patch_comment = require("./comments/patch_comment");
var _post_comment = require("./comments/post_comment");
var _get_configure = require("./configure/get_configure");
var _get_connectors = require("./configure/get_connectors");
var _patch_configure = require("./configure/patch_configure");
var _post_configure = require("./configure/post_configure");
var _get_alerts = require("./comments/get_alerts");
var _get_case_metrics = require("./metrics/get_case_metrics");
var _get_cases_metrics = require("./metrics/get_cases_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getExternalRoutes = () => [_delete_cases.deleteCaseRoute, _find_cases.findCaseRoute, _get_case.getCaseRoute, _get_case.resolveCaseRoute, _patch_cases.patchCaseRoute, _post_case.postCaseRoute, _push_case.pushCaseRoute, _get_all_user_actions.getUserActionsRoute, _get_status.getStatusRoute, _get_cases.getCasesByAlertIdRoute, _get_reporters.getReportersRoute, _get_tags.getTagsRoute, _delete_comment.deleteCommentRoute, _delete_all_comments.deleteAllCommentsRoute, _find_comments.findCommentsRoute, _get_comment.getCommentRoute, _get_all_comment.getAllCommentsRoute, _patch_comment.patchCommentRoute, _post_comment.postCommentRoute, _get_configure.getCaseConfigureRoute, _get_connectors.getConnectorsRoute, _patch_configure.patchCaseConfigureRoute, _post_configure.postCaseConfigureRoute, _get_alerts.getAllAlertsAttachedToCaseRoute, _get_case_metrics.getCaseMetricRoute, _get_cases_metrics.getCasesMetricRoute];
exports.getExternalRoutes = getExternalRoutes;