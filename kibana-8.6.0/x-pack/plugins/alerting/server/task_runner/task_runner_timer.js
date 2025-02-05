"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskRunnerTimerSpan = exports.TaskRunnerTimer = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let TaskRunnerTimerSpan;
exports.TaskRunnerTimerSpan = TaskRunnerTimerSpan;
(function (TaskRunnerTimerSpan) {
  TaskRunnerTimerSpan["StartTaskRun"] = "claim_to_start_duration_ms";
  TaskRunnerTimerSpan["TotalRunDuration"] = "total_run_duration_ms";
  TaskRunnerTimerSpan["PrepareRule"] = "prepare_rule_duration_ms";
  TaskRunnerTimerSpan["RuleTypeRun"] = "rule_type_run_duration_ms";
  TaskRunnerTimerSpan["ProcessAlerts"] = "process_alerts_duration_ms";
  TaskRunnerTimerSpan["TriggerActions"] = "trigger_actions_duration_ms";
  TaskRunnerTimerSpan["ProcessRuleRun"] = "process_rule_duration_ms";
})(TaskRunnerTimerSpan || (exports.TaskRunnerTimerSpan = TaskRunnerTimerSpan = {}));
class TaskRunnerTimer {
  constructor(options) {
    (0, _defineProperty2.default)(this, "timings", {});
    this.options = options;
  }

  /**
   * Calcuate the time passed since a given start time and store this
   * duration for the give name.
   */
  setDuration(name, start) {
    if (this.timings[name]) {
      this.options.logger.warn(`Duration already exists for "${name}" and will be overwritten`);
    }

    // Calculate duration in millis from start until now and store
    this.timings[name] = new Date().getTime() - start.getTime();
  }
  async runWithTimer(name, cb) {
    if (this.timings[name]) {
      this.options.logger.warn(`Duration already exists for "${name}" and will be overwritten`);
    }
    const start = new Date();
    const result = await cb();
    const end = new Date();
    this.timings[name] = end.getTime() - start.getTime();
    return result;
  }
  toJson() {
    var _this$timings$TaskRun, _this$timings$TaskRun2, _this$timings$TaskRun3, _this$timings$TaskRun4, _this$timings$TaskRun5, _this$timings$TaskRun6, _this$timings$TaskRun7;
    return {
      [TaskRunnerTimerSpan.StartTaskRun]: (_this$timings$TaskRun = this.timings[TaskRunnerTimerSpan.StartTaskRun]) !== null && _this$timings$TaskRun !== void 0 ? _this$timings$TaskRun : 0,
      [TaskRunnerTimerSpan.TotalRunDuration]: (_this$timings$TaskRun2 = this.timings[TaskRunnerTimerSpan.TotalRunDuration]) !== null && _this$timings$TaskRun2 !== void 0 ? _this$timings$TaskRun2 : 0,
      [TaskRunnerTimerSpan.PrepareRule]: (_this$timings$TaskRun3 = this.timings[TaskRunnerTimerSpan.PrepareRule]) !== null && _this$timings$TaskRun3 !== void 0 ? _this$timings$TaskRun3 : 0,
      [TaskRunnerTimerSpan.RuleTypeRun]: (_this$timings$TaskRun4 = this.timings[TaskRunnerTimerSpan.RuleTypeRun]) !== null && _this$timings$TaskRun4 !== void 0 ? _this$timings$TaskRun4 : 0,
      [TaskRunnerTimerSpan.ProcessAlerts]: (_this$timings$TaskRun5 = this.timings[TaskRunnerTimerSpan.ProcessAlerts]) !== null && _this$timings$TaskRun5 !== void 0 ? _this$timings$TaskRun5 : 0,
      [TaskRunnerTimerSpan.TriggerActions]: (_this$timings$TaskRun6 = this.timings[TaskRunnerTimerSpan.TriggerActions]) !== null && _this$timings$TaskRun6 !== void 0 ? _this$timings$TaskRun6 : 0,
      [TaskRunnerTimerSpan.ProcessRuleRun]: (_this$timings$TaskRun7 = this.timings[TaskRunnerTimerSpan.ProcessRuleRun]) !== null && _this$timings$TaskRun7 !== void 0 ? _this$timings$TaskRun7 : 0
    };
  }
}
exports.TaskRunnerTimer = TaskRunnerTimer;