"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReindexStep = exports.ReindexStatus = exports.REINDEX_OP_TYPE = exports.ML_UPGRADE_OP_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let ReindexStep;
exports.ReindexStep = ReindexStep;
(function (ReindexStep) {
  ReindexStep[ReindexStep["created"] = 0] = "created";
  ReindexStep[ReindexStep["readonly"] = 20] = "readonly";
  ReindexStep[ReindexStep["newIndexCreated"] = 30] = "newIndexCreated";
  ReindexStep[ReindexStep["reindexStarted"] = 40] = "reindexStarted";
  ReindexStep[ReindexStep["reindexCompleted"] = 50] = "reindexCompleted";
  ReindexStep[ReindexStep["aliasCreated"] = 60] = "aliasCreated";
  ReindexStep[ReindexStep["originalIndexDeleted"] = 70] = "originalIndexDeleted";
  ReindexStep[ReindexStep["existingAliasesUpdated"] = 80] = "existingAliasesUpdated";
})(ReindexStep || (exports.ReindexStep = ReindexStep = {}));
let ReindexStatus;
exports.ReindexStatus = ReindexStatus;
(function (ReindexStatus) {
  ReindexStatus[ReindexStatus["inProgress"] = 0] = "inProgress";
  ReindexStatus[ReindexStatus["completed"] = 1] = "completed";
  ReindexStatus[ReindexStatus["failed"] = 2] = "failed";
  ReindexStatus[ReindexStatus["paused"] = 3] = "paused";
  ReindexStatus[ReindexStatus["cancelled"] = 4] = "cancelled";
  ReindexStatus[ReindexStatus["fetchFailed"] = 5] = "fetchFailed";
})(ReindexStatus || (exports.ReindexStatus = ReindexStatus = {}));
const REINDEX_OP_TYPE = 'upgrade-assistant-reindex-operation';
exports.REINDEX_OP_TYPE = REINDEX_OP_TYPE;
const ML_UPGRADE_OP_TYPE = 'upgrade-assistant-ml-upgrade-operation';
exports.ML_UPGRADE_OP_TYPE = ML_UPGRADE_OP_TYPE;