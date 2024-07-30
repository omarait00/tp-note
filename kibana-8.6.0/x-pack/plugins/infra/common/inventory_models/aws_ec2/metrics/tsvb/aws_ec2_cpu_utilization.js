"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awsEC2CpuUtilization = void 0;
var _create_tsvb_model = require("../../../create_tsvb_model");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const awsEC2CpuUtilization = (0, _create_tsvb_model.createTSVBModel)('awsEC2CpuUtilization', ['aws.ec2'], [{
  id: 'total',
  split_mode: 'everything',
  metrics: [{
    field: 'aws.ec2.cpu.total.pct',
    id: 'avg-cpu',
    type: 'avg'
  }, {
    id: 'convert-to-percent',
    script: 'params.avg / 100',
    type: 'calculation',
    variables: [{
      field: 'avg-cpu',
      id: 'var-avg',
      name: 'avg'
    }]
  }]
}]);
exports.awsEC2CpuUtilization = awsEC2CpuUtilization;