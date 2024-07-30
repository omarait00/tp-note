"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.latestFindingsTransform = void 0;
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const latestFindingsTransform = {
  transform_id: 'cloud_security_posture.findings_latest-default-8.4.0',
  description: 'Defines findings transformation to view only the latest finding per resource',
  source: {
    index: _constants.FINDINGS_INDEX_PATTERN
  },
  dest: {
    index: _constants.LATEST_FINDINGS_INDEX_DEFAULT_NS
  },
  frequency: '5m',
  sync: {
    time: {
      field: 'event.ingested',
      delay: '60s'
    }
  },
  retention_policy: {
    time: {
      field: '@timestamp',
      max_age: '5h'
    }
  },
  latest: {
    sort: '@timestamp',
    unique_key: ['resource.id', 'rule.id']
  },
  _meta: {
    package: {
      name: _constants.CLOUD_SECURITY_POSTURE_PACKAGE_NAME
    },
    managed_by: 'cloud_security_posture',
    managed: true
  }
};
exports.latestFindingsTransform = latestFindingsTransform;