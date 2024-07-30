"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskTypeDictionary = exports.REMOVED_TYPES = void 0;
exports.sanitizeTaskDefinitions = sanitizeTaskDefinitions;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _task = require("./task");
let _Symbol$iterator;
/**
 * Types that are no longer registered and will be marked as unregistered
 */
const REMOVED_TYPES = [
// for testing
'sampleTaskRemovedType',
// deprecated in https://github.com/elastic/kibana/pull/121442
'alerting:siem.signals', 'search_sessions_monitor', 'search_sessions_cleanup', 'search_sessions_expire'];

/**
 * Defines a task which can be scheduled and run by the Kibana
 * task manager.
 */
exports.REMOVED_TYPES = REMOVED_TYPES;
_Symbol$iterator = Symbol.iterator;
class TaskTypeDictionary {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "definitions", new Map());
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = logger;
  }
  [_Symbol$iterator]() {
    return this.definitions.entries();
  }
  getAllTypes() {
    return [...this.definitions.keys()];
  }
  getAllDefinitions() {
    return [...this.definitions.values()];
  }
  has(type) {
    return this.definitions.has(type);
  }
  get(type) {
    this.ensureHas(type);
    return this.definitions.get(type);
  }
  ensureHas(type) {
    if (!this.has(type)) {
      throw new Error(`Unsupported task type "${type}". Supported types are ${this.getAllTypes().join(', ')}`);
    }
  }

  /**
   * Method for allowing consumers to register task definitions into the system.
   * @param taskDefinitions - The Kibana task definitions dictionary
   */
  registerTaskDefinitions(taskDefinitions) {
    const duplicate = Object.keys(taskDefinitions).find(type => this.definitions.has(type));
    if (duplicate) {
      throw new Error(`Task ${duplicate} is already defined!`);
    }
    const removed = Object.keys(taskDefinitions).find(type => REMOVED_TYPES.indexOf(type) >= 0);
    if (removed) {
      throw new Error(`Task ${removed} has been removed from registration!`);
    }
    try {
      for (const definition of sanitizeTaskDefinitions(taskDefinitions)) {
        this.definitions.set(definition.type, definition);
      }
    } catch (e) {
      this.logger.error('Could not sanitize task definitions');
    }
  }
}

/**
 * Sanitizes the system's task definitions. Task definitions have optional properties, and
 * this ensures they all are given a reasonable default.
 *
 * @param taskDefinitions - The Kibana task definitions dictionary
 */
exports.TaskTypeDictionary = TaskTypeDictionary;
function sanitizeTaskDefinitions(taskDefinitions) {
  return Object.entries(taskDefinitions).map(([type, rawDefinition]) => {
    return _task.taskDefinitionSchema.validate({
      type,
      ...rawDefinition
    });
  });
}