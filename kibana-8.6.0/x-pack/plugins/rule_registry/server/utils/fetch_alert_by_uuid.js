"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAlertByAlertUUID = void 0;
var _technical_rule_data_field_names = require("../../common/technical_rule_data_field_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchAlertByAlertUUID = async (ruleDataClient, alertUuid) => {
  const request = {
    body: {
      query: {
        bool: {
          filter: [{
            term: {
              [_technical_rule_data_field_names.ALERT_UUID]: alertUuid
            }
          }]
        }
      },
      size: 1
    },
    allow_no_indices: true
  };
  const {
    hits
  } = await ruleDataClient.getReader().search(request);
  return hits === null || hits === void 0 ? void 0 : hits.hits;
};
exports.fetchAlertByAlertUUID = fetchAlertByAlertUUID;