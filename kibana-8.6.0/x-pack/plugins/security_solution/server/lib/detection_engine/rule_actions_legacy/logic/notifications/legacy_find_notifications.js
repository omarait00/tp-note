"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyGetFilter = exports.legacyFindNotifications = void 0;
var _constants = require("../../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
const legacyGetFilter = filter => {
  if (filter == null) {
    return `alert.attributes.alertTypeId: ${_constants.LEGACY_NOTIFICATIONS_ID}`;
  } else {
    return `alert.attributes.alertTypeId: ${_constants.LEGACY_NOTIFICATIONS_ID} AND ${filter}`;
  }
};

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
exports.legacyGetFilter = legacyGetFilter;
const legacyFindNotifications = async ({
  rulesClient,
  perPage,
  page,
  fields,
  filter,
  sortField,
  sortOrder
}) => rulesClient.find({
  options: {
    fields,
    page,
    perPage,
    filter: legacyGetFilter(filter),
    sortOrder,
    sortField
  }
});
exports.legacyFindNotifications = legacyFindNotifications;