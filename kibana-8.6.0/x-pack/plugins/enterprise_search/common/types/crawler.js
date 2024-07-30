"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crawlerStatusToSyncStatus = exports.crawlerStatusToConnectorStatus = exports.CrawlerStatus = void 0;
var _connectors = require("./connectors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// See SharedTogo::Crawler::Status for details on how these are generated
let CrawlerStatus;
exports.CrawlerStatus = CrawlerStatus;
(function (CrawlerStatus) {
  CrawlerStatus["Pending"] = "pending";
  CrawlerStatus["Suspended"] = "suspended";
  CrawlerStatus["Starting"] = "starting";
  CrawlerStatus["Running"] = "running";
  CrawlerStatus["Suspending"] = "suspending";
  CrawlerStatus["Canceling"] = "canceling";
  CrawlerStatus["Success"] = "success";
  CrawlerStatus["Failed"] = "failed";
  CrawlerStatus["Canceled"] = "canceled";
  CrawlerStatus["Skipped"] = "skipped";
})(CrawlerStatus || (exports.CrawlerStatus = CrawlerStatus = {}));
const crawlerStatusSyncMap = {
  [CrawlerStatus.Canceling]: _connectors.SyncStatus.CANCELING,
  [CrawlerStatus.Canceled]: _connectors.SyncStatus.CANCELED,
  [CrawlerStatus.Failed]: _connectors.SyncStatus.ERROR,
  [CrawlerStatus.Pending]: _connectors.SyncStatus.PENDING,
  [CrawlerStatus.Running]: _connectors.SyncStatus.IN_PROGRESS,
  [CrawlerStatus.Skipped]: _connectors.SyncStatus.CANCELED,
  [CrawlerStatus.Starting]: _connectors.SyncStatus.PENDING,
  [CrawlerStatus.Success]: _connectors.SyncStatus.COMPLETED,
  [CrawlerStatus.Suspended]: _connectors.SyncStatus.SUSPENDED,
  [CrawlerStatus.Suspending]: _connectors.SyncStatus.IN_PROGRESS
};
const crawlerStatusConnectorStatusMap = {
  [CrawlerStatus.Canceling]: _connectors.ConnectorStatus.CONNECTED,
  [CrawlerStatus.Canceled]: _connectors.ConnectorStatus.CONNECTED,
  [CrawlerStatus.Failed]: _connectors.ConnectorStatus.ERROR,
  [CrawlerStatus.Pending]: _connectors.ConnectorStatus.CONNECTED,
  [CrawlerStatus.Running]: _connectors.ConnectorStatus.CONNECTED,
  [CrawlerStatus.Skipped]: _connectors.ConnectorStatus.CONNECTED,
  [CrawlerStatus.Starting]: _connectors.ConnectorStatus.CONNECTED,
  [CrawlerStatus.Success]: _connectors.ConnectorStatus.CONNECTED,
  [CrawlerStatus.Suspended]: _connectors.ConnectorStatus.CONNECTED,
  [CrawlerStatus.Suspending]: _connectors.ConnectorStatus.CONNECTED
};
const crawlerStatusToSyncStatus = crawlerStatus => {
  return crawlerStatusSyncMap[crawlerStatus];
};
exports.crawlerStatusToSyncStatus = crawlerStatusToSyncStatus;
const crawlerStatusToConnectorStatus = crawlerStatus => {
  return crawlerStatusConnectorStatusMap[crawlerStatus];
};
exports.crawlerStatusToConnectorStatus = crawlerStatusToConnectorStatus;