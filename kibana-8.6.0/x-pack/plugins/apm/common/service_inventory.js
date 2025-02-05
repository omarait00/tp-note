"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServiceInventoryFieldName = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let ServiceInventoryFieldName;
exports.ServiceInventoryFieldName = ServiceInventoryFieldName;
(function (ServiceInventoryFieldName) {
  ServiceInventoryFieldName["ServiceName"] = "serviceName";
  ServiceInventoryFieldName["HealthStatus"] = "healthStatus";
  ServiceInventoryFieldName["Environments"] = "environments";
  ServiceInventoryFieldName["TransactionType"] = "transactionType";
  ServiceInventoryFieldName["Throughput"] = "throughput";
  ServiceInventoryFieldName["Latency"] = "latency";
  ServiceInventoryFieldName["TransactionErrorRate"] = "transactionErrorRate";
})(ServiceInventoryFieldName || (exports.ServiceInventoryFieldName = ServiceInventoryFieldName = {}));