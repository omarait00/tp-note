"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inventoryModels = exports.getFieldByType = exports.findInventoryModel = exports.findInventoryFields = void 0;
Object.defineProperty(exports, "metrics", {
  enumerable: true,
  get: function () {
    return _metrics.metrics;
  }
});
var _i18n = require("@kbn/i18n");
var _constants = require("../constants");
var _host = require("./host");
var _pod = require("./pod");
var _aws_ec = require("./aws_ec2");
var _aws_s = require("./aws_s3");
var _aws_rds = require("./aws_rds");
var _aws_sqs = require("./aws_sqs");
var _container = require("./container");
var _metrics = require("./metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const inventoryModels = [_host.host, _pod.pod, _container.container, _aws_ec.awsEC2, _aws_s.awsS3, _aws_rds.awsRDS, _aws_sqs.awsSQS];
exports.inventoryModels = inventoryModels;
const findInventoryModel = type => {
  const model = inventoryModels.find(m => m.id === type);
  if (!model) {
    throw new Error(_i18n.i18n.translate('xpack.infra.inventoryModels.findInventoryModel.error', {
      defaultMessage: "The inventory model you've attempted to find does not exist"
    }));
  }
  return model;
};
exports.findInventoryModel = findInventoryModel;
const LEGACY_TYPES = ['host', 'pod', 'container'];
const getFieldByType = type => {
  switch (type) {
    case 'pod':
      return _constants.POD_FIELD;
    case 'host':
      return _constants.HOST_FIELD;
    case 'container':
      return _constants.CONTAINER_FIELD;
  }
};
exports.getFieldByType = getFieldByType;
const findInventoryFields = type => {
  const inventoryModel = findInventoryModel(type);
  if (LEGACY_TYPES.includes(type)) {
    const id = getFieldByType(type) || inventoryModel.fields.id;
    return {
      ...inventoryModel.fields,
      id
    };
  } else {
    return inventoryModel.fields;
  }
};
exports.findInventoryFields = findInventoryFields;