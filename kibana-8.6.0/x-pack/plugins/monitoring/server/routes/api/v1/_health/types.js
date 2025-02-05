"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MonitoredProduct = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let MonitoredProduct;
exports.MonitoredProduct = MonitoredProduct;
(function (MonitoredProduct) {
  MonitoredProduct["Cluster"] = "cluster";
  MonitoredProduct["Elasticsearch"] = "elasticsearch";
  MonitoredProduct["Kibana"] = "kibana";
  MonitoredProduct["Beats"] = "beat";
  MonitoredProduct["Logstash"] = "logstash";
  MonitoredProduct["EnterpriseSearch"] = "enterpriseSearch";
})(MonitoredProduct || (exports.MonitoredProduct = MonitoredProduct = {}));