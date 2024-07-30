"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticsearchService = void 0;
var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));
var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _server = require("../../../../../src/core/server");
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
var _logger = /*#__PURE__*/new WeakMap();
var _coreStatus$ = /*#__PURE__*/new WeakMap();
/**
 * Service responsible for interactions with the Elasticsearch.
 */
class ElasticsearchService {
  constructor(logger) {
    _classPrivateFieldInitSpec(this, _logger, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _coreStatus$, {
      writable: true,
      value: void 0
    });
    (0, _classPrivateFieldSet2.default)(this, _logger, logger);
  }
  setup({
    status,
    license
  }) {
    (0, _classPrivateFieldSet2.default)(this, _coreStatus$, (0, _rxjs.combineLatest)([status.core$, license.features$]).pipe((0, _operators.map)(([coreStatus]) => license.isEnabled() && coreStatus.elasticsearch.level === _server.ServiceStatusLevels.available), (0, _operators.shareReplay)(1)));
  }
  start() {
    return {
      // We'll need to get rid of this as soon as Core's Elasticsearch service exposes this
      // functionality in the scope of https://github.com/elastic/kibana/issues/41983.
      watchOnlineStatus$: () => {
        const RETRY_SCALE_DURATION = 100;
        const RETRY_TIMEOUT_MAX = 10000;
        const retries$ = new _rxjs.BehaviorSubject(0);
        const retryScheduler = {
          scheduleRetry: () => {
            const retriesElapsed = retries$.getValue() + 1;
            const nextRetryTimeout = Math.min(retriesElapsed * RETRY_SCALE_DURATION, RETRY_TIMEOUT_MAX);
            (0, _classPrivateFieldGet2.default)(this, _logger).debug(`Scheduling re-try in ${nextRetryTimeout} ms.`);
            retryTimeout = setTimeout(() => retries$.next(retriesElapsed), nextRetryTimeout);
          }
        };
        let retryTimeout;
        return (0, _rxjs.combineLatest)([(0, _classPrivateFieldGet2.default)(this, _coreStatus$).pipe((0, _operators.tap)(() => {
          // If status or license change occurred before retry timeout we should cancel
          // it and reset retry counter.
          if (retryTimeout) {
            clearTimeout(retryTimeout);
          }
          if (retries$.value > 0) {
            retries$.next(0);
          }
        })), retries$.asObservable().pipe(
        // We shouldn't emit new value if retry counter is reset. This comparator isn't called for
        // the initial value.
        (0, _operators.distinctUntilChanged)((prev, curr) => prev === curr || curr === 0))]).pipe((0, _operators.filter)(([isAvailable]) => isAvailable), (0, _operators.map)(() => retryScheduler));
      }
    };
  }
}
exports.ElasticsearchService = ElasticsearchService;