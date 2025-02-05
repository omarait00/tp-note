"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchSessionService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _boom = require("@hapi/boom");
var _esQuery = require("@kbn/es-query");
var _common = require("../../../../kibana_utils/common");
var _lodash = require("lodash");
var _common2 = require("../../../common");
var _ = require("../..");
var _utils = require("./utils");
var _get_session_status = require("./get_session_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Used to batch requests that add searches into the session saved object
 */
const DEBOUNCE_TRACK_ID_WAIT = 1000;
const DEBOUNCE_TRACK_ID_MAX_WAIT = 5000;
class SearchSessionService {
  constructor(logger, config, version) {
    (0, _defineProperty2.default)(this, "sessionConfig", void 0);
    (0, _defineProperty2.default)(this, "security", void 0);
    (0, _defineProperty2.default)(this, "setupCompleted", false);
    (0, _defineProperty2.default)(this, "save", async (deps, user, sessionId, {
      name,
      appId,
      locatorId,
      initialState = {},
      restoreState = {}
    }) => {
      if (!this.sessionConfig.enabled) throw new Error('Search sessions are disabled');
      if (!name) throw new Error('Name is required');
      if (!appId) throw new Error('AppId is required');
      if (!locatorId) throw new Error('locatorId is required');
      return this.create(deps, user, sessionId, {
        name,
        appId,
        locatorId,
        initialState,
        restoreState
      });
    });
    (0, _defineProperty2.default)(this, "create", ({
      savedObjectsClient
    }, user, sessionId, attributes) => {
      this.logger.debug(`SearchSessionService: create | ${sessionId}`);
      const realmType = user === null || user === void 0 ? void 0 : user.authentication_realm.type;
      const realmName = user === null || user === void 0 ? void 0 : user.authentication_realm.name;
      const username = user === null || user === void 0 ? void 0 : user.username;
      return savedObjectsClient.create(_common2.SEARCH_SESSION_TYPE, {
        sessionId,
        expires: new Date(Date.now() + this.sessionConfig.defaultExpiration.asMilliseconds()).toISOString(),
        created: new Date().toISOString(),
        idMapping: {},
        version: this.version,
        realmType,
        realmName,
        username,
        ...attributes
      }, {
        id: sessionId
      });
    });
    (0, _defineProperty2.default)(this, "get", async ({
      savedObjectsClient
    }, user, sessionId) => {
      this.logger.debug(`get | ${sessionId}`);
      const session = await savedObjectsClient.get(_common2.SEARCH_SESSION_TYPE, sessionId);
      this.throwOnUserConflict(user, session);
      return session;
    });
    (0, _defineProperty2.default)(this, "find", async ({
      savedObjectsClient,
      internalElasticsearchClient
    }, user, options) => {
      const userFilters = user === null ? [] : [_esQuery.nodeBuilder.is(`${_common2.SEARCH_SESSION_TYPE}.attributes.realmType`, `${user.authentication_realm.type}`), _esQuery.nodeBuilder.is(`${_common2.SEARCH_SESSION_TYPE}.attributes.realmName`, `${user.authentication_realm.name}`), _esQuery.nodeBuilder.is(`${_common2.SEARCH_SESSION_TYPE}.attributes.username`, `${user.username}`)];
      const filterKueryNode = typeof options.filter === 'string' ? (0, _esQuery.fromKueryExpression)(options.filter) : options.filter;
      const filter = _esQuery.nodeBuilder.and(userFilters.concat(filterKueryNode !== null && filterKueryNode !== void 0 ? filterKueryNode : []));
      const findResponse = await savedObjectsClient.find({
        ...options,
        filter,
        type: _common2.SEARCH_SESSION_TYPE
      });
      const sessionStatuses = await Promise.all(findResponse.saved_objects.map(async so => {
        const sessionStatus = await (0, _get_session_status.getSessionStatus)({
          internalClient: internalElasticsearchClient
        }, so.attributes, this.sessionConfig);
        return sessionStatus;
      }));
      return {
        ...findResponse,
        statuses: sessionStatuses.reduce((res, {
          status,
          errors
        }, index) => {
          res[findResponse.saved_objects[index].id] = {
            status,
            errors
          };
          return res;
        }, {})
      };
    });
    (0, _defineProperty2.default)(this, "update", async (deps, user, sessionId, attributes) => {
      this.logger.debug(`SearchSessionService: update | ${sessionId}`);
      if (!this.sessionConfig.enabled) throw new Error('Search sessions are disabled');
      await this.get(deps, user, sessionId); // Verify correct user
      return deps.savedObjectsClient.update(_common2.SEARCH_SESSION_TYPE, sessionId, {
        ...attributes
      }, {
        retryOnConflict: this.sessionConfig.maxUpdateRetries
      });
    });
    (0, _defineProperty2.default)(this, "cancel", async (deps, user, sessionId) => {
      this.logger.debug(`SearchSessionService: cancel | ${sessionId}`);
      return this.update(deps, user, sessionId, {
        isCanceled: true
      });
    });
    (0, _defineProperty2.default)(this, "delete", async (deps, user, sessionId) => {
      if (!this.sessionConfig.enabled) throw new Error('Search sessions are disabled');
      this.logger.debug(`SearchSessionService: delete | ${sessionId}`);
      await this.get(deps, user, sessionId); // Verify correct user
      return deps.savedObjectsClient.delete(_common2.SEARCH_SESSION_TYPE, sessionId);
    });
    (0, _defineProperty2.default)(this, "trackIdBatchQueueMap", new Map());
    (0, _defineProperty2.default)(this, "trackId", async (deps, user, searchRequest, searchId, options) => {
      const {
        sessionId,
        strategy = _common2.ENHANCED_ES_SEARCH_STRATEGY
      } = options;
      if (!this.sessionConfig.enabled || !sessionId || !searchId) return;
      if (!searchRequest.params) return;
      const requestHash = (0, _utils.createRequestHash)(searchRequest.params);
      this.logger.debug(`SearchSessionService: trackId | sessionId: "${sessionId}" | searchId:"${searchId}" | requestHash: "${requestHash}"`);
      const searchInfo = {
        id: searchId,
        strategy
      };
      if (!this.trackIdBatchQueueMap.has(sessionId)) {
        this.trackIdBatchQueueMap.set(sessionId, {
          queue: [],
          scheduleProcessQueue: (0, _lodash.debounce)(() => {
            var _this$trackIdBatchQue, _this$trackIdBatchQue2;
            const queue = (_this$trackIdBatchQue = (_this$trackIdBatchQue2 = this.trackIdBatchQueueMap.get(sessionId)) === null || _this$trackIdBatchQue2 === void 0 ? void 0 : _this$trackIdBatchQue2.queue) !== null && _this$trackIdBatchQue !== void 0 ? _this$trackIdBatchQue : [];
            if (queue.length === 0) return;
            this.trackIdBatchQueueMap.delete(sessionId);
            const batchedIdMapping = queue.reduce((res, next) => {
              res[next.requestHash] = next.searchInfo;
              return res;
            }, {});
            this.update(queue[0].deps, queue[0].user, sessionId, {
              idMapping: batchedIdMapping
            }).then(() => {
              queue.forEach(q => q.resolve());
            }).catch(e => {
              queue.forEach(q => q.reject(e));
            });
          }, DEBOUNCE_TRACK_ID_WAIT, {
            maxWait: DEBOUNCE_TRACK_ID_MAX_WAIT
          })
        });
      }
      const deferred = (0, _common.defer)();
      const {
        queue,
        scheduleProcessQueue
      } = this.trackIdBatchQueueMap.get(sessionId);
      queue.push({
        deps,
        sessionId,
        searchInfo,
        requestHash,
        resolve: deferred.resolve,
        reject: deferred.reject,
        user
      });
      scheduleProcessQueue();
      return deferred.promise;
    });
    (0, _defineProperty2.default)(this, "getId", async (deps, user, searchRequest, {
      sessionId,
      isStored,
      isRestore
    }) => {
      if (!this.sessionConfig.enabled) {
        throw new Error('Search sessions are disabled');
      } else if (!sessionId) {
        throw new Error('Session ID is required');
      } else if (!isStored) {
        throw new Error('Cannot get search ID from a session that is not stored');
      } else if (!isRestore) {
        throw new Error('Get search ID is only supported when restoring a session');
      }
      const session = await this.get(deps, user, sessionId);
      const requestHash = (0, _utils.createRequestHash)(searchRequest.params);
      if (!session.attributes.idMapping.hasOwnProperty(requestHash)) {
        this.logger.error(`SearchSessionService: getId | ${sessionId} | ${requestHash} not found`);
        this.logger.debug(`SearchSessionService: getId not found search with params: ${JSON.stringify(searchRequest.params)}`);
        throw new _.NoSearchIdInSessionError();
      }
      this.logger.debug(`SearchSessionService: getId | ${sessionId} | ${requestHash}`);
      return session.attributes.idMapping[requestHash].id;
    });
    (0, _defineProperty2.default)(this, "asScopedProvider", ({
      savedObjects,
      elasticsearch
    }) => {
      return request => {
        var _this$security$authc$, _this$security;
        const user = (_this$security$authc$ = (_this$security = this.security) === null || _this$security === void 0 ? void 0 : _this$security.authc.getCurrentUser(request)) !== null && _this$security$authc$ !== void 0 ? _this$security$authc$ : null;
        const savedObjectsClient = savedObjects.getScopedClient(request, {
          includedHiddenTypes: [_common2.SEARCH_SESSION_TYPE]
        });
        const internalElasticsearchClient = elasticsearch.client.asScoped(request).asInternalUser;
        const deps = {
          savedObjectsClient,
          internalElasticsearchClient
        };
        return {
          getId: this.getId.bind(this, deps, user),
          trackId: this.trackId.bind(this, deps, user),
          getSearchIdMapping: this.getSearchIdMapping.bind(this, deps, user),
          save: this.save.bind(this, deps, user),
          get: this.get.bind(this, deps, user),
          find: this.find.bind(this, deps, user),
          update: this.update.bind(this, deps, user),
          extend: this.extend.bind(this, deps, user),
          cancel: this.cancel.bind(this, deps, user),
          delete: this.delete.bind(this, deps, user),
          status: this.status.bind(this, deps, user),
          getConfig: () => this.config.search.sessions
        };
      };
    });
    (0, _defineProperty2.default)(this, "throwOnUserConflict", (user, session) => {
      if (user === null || !session) return;
      if (user.authentication_realm.type !== session.attributes.realmType || user.authentication_realm.name !== session.attributes.realmName || user.username !== session.attributes.username) {
        this.logger.debug(`User ${user.username} has no access to search session ${session.attributes.sessionId}`);
        throw (0, _boom.notFound)();
      }
    });
    this.logger = logger;
    this.config = config;
    this.version = version;
    this.sessionConfig = this.config.search.sessions;
  }
  setup(core, deps) {
    this.security = deps.security;
    this.setupCompleted = true;
  }
  start(core, deps) {
    if (!this.setupCompleted) throw new Error('SearchSessionService setup() must be called before start()');
  }
  stop() {}
  async extend(deps, user, sessionId, expires) {
    this.logger.debug(`SearchSessionService: extend | ${sessionId}`);
    return this.update(deps, user, sessionId, {
      expires: expires.toISOString()
    });
  }
  async getSearchIdMapping(deps, user, sessionId) {
    const searchSession = await this.get(deps, user, sessionId);
    const searchIdMapping = new Map();
    Object.values(searchSession.attributes.idMapping).forEach(requestInfo => {
      searchIdMapping.set(requestInfo.id, requestInfo.strategy);
    });
    return searchIdMapping;
  }
  async status(deps, user, sessionId) {
    this.logger.debug(`SearchSessionService: status | ${sessionId}`);
    const session = await this.get(deps, user, sessionId);
    const sessionStatus = await (0, _get_session_status.getSessionStatus)({
      internalClient: deps.internalElasticsearchClient
    }, session.attributes, this.sessionConfig);
    return {
      status: sessionStatus.status,
      errors: sessionStatus.errors
    };
  }

  /**
   * Look up an existing search ID that matches the given request in the given session so that the
   * request can continue rather than restart.
   * @internal
   */
}
exports.SearchSessionService = SearchSessionService;