"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InternalFileShareService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _moment = _interopRequireDefault(require("moment"));
var _server = require("../../../../core/server");
var _esQuery = require("@kbn/es-query");
var _constants = require("../../common/constants");
var _saved_objects = require("../saved_objects");
var _usage = require("../usage");
var _generate_share_token = require("./generate_share_token");
var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function toFileShareJSON(so) {
  var _so$references$;
  return {
    id: so.id,
    fileId: (_so$references$ = so.references[0]) === null || _so$references$ === void 0 ? void 0 : _so$references$.id,
    // Assuming a single file reference
    created: so.attributes.created,
    validUntil: so.attributes.valid_until,
    name: so.attributes.name
  };
}
function validateCreateArgs({
  validUntil
}) {
  if ((validUntil || validUntil === 0) && validUntil < Date.now()) {
    throw new _errors.ExpiryDateInThePastError('Share expiry date must be in the future.');
  }
}

/**
 * Service for managing file shares and associated Saved Objects.
 *
 * @internal
 */
class InternalFileShareService {
  static configureUsageCounter(uc) {
    InternalFileShareService.usageCounter = uc;
  }
  constructor(savedObjects) {
    (0, _defineProperty2.default)(this, "savedObjectsType", _saved_objects.fileShareObjectType.name);
    this.savedObjects = savedObjects;
  }
  incrementUsageCounter(counter) {
    var _InternalFileShareSer;
    (_InternalFileShareSer = InternalFileShareService.usageCounter) === null || _InternalFileShareSer === void 0 ? void 0 : _InternalFileShareSer.incrementCounter({
      counterName: (0, _usage.getCounters)('share_service')[counter]
    });
  }
  async share(args) {
    this.incrementUsageCounter('SHARE');
    try {
      validateCreateArgs(args);
      const {
        file,
        name,
        validUntil
      } = args;
      const so = await this.savedObjects.create(this.savedObjectsType, {
        created: new Date().toISOString(),
        name,
        valid_until: validUntil ? validUntil : Number((0, _moment.default)().add(30, 'days')),
        token: (0, _generate_share_token.generateShareToken)()
      }, {
        references: [{
          name: file.data.name,
          id: file.data.id,
          type: _constants.FILE_SO_TYPE
        }]
      });
      return {
        ...toFileShareJSON(so),
        token: so.attributes.token
      };
    } catch (e) {
      if (e instanceof _errors.ExpiryDateInThePastError) {
        this.incrementUsageCounter('SHARE_ERROR_EXPIRATION_IN_PAST');
      } else if (_server.SavedObjectsErrorHelpers.isForbiddenError(e)) {
        this.incrementUsageCounter('SHARE_ERROR_FORBIDDEN');
      } else if (_server.SavedObjectsErrorHelpers.isConflictError(e)) {
        this.incrementUsageCounter('SHARE_ERROR_CONFLICT');
      } else {
        this.incrementUsageCounter('SHARE_ERROR');
      }
      throw e;
    }
  }
  async delete({
    id
  }) {
    this.incrementUsageCounter('UNSHARE');
    try {
      await this.savedObjects.delete(this.savedObjectsType, id);
    } catch (e) {
      if (_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
        this.incrementUsageCounter('UNSHARE_ERROR_NOT_FOUND');
      } else {
        this.incrementUsageCounter('UNSHARE_ERROR');
      }
      if (_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
        throw new _errors.FileShareNotFoundError(`File share with id "${id}" not found.`);
      }
      throw e;
    }
  }
  async internalList({
    fileId,
    perPage,
    page
  }) {
    const result = await this.savedObjects.find({
      type: this.savedObjectsType,
      hasReference: fileId ? {
        type: _constants.FILE_SO_TYPE,
        id: fileId
      } : undefined,
      perPage,
      page,
      sortField: 'created',
      sortOrder: 'desc'
    });
    return result.saved_objects;
  }
  async deleteForFile({
    id: fileId
  }) {
    const savedObjects = await this.internalList({
      fileId
    });
    await Promise.all(savedObjects.map(({
      id
    }) => this.delete({
      id
    })));
  }

  /**
   * Get a share token and also check whether it is valid.
   */
  async getByToken(token) {
    const {
      saved_objects: [share]
    } = await this.savedObjects.find({
      type: this.savedObjectsType,
      filter: _esQuery.nodeBuilder.is(`${this.savedObjectsType}.attributes.token`, (0, _esQuery.escapeKuery)(token))
    });
    if (!share) {
      throw new _errors.FileShareNotFoundError(`Could not find file share with token "${token}".`);
    }
    if (share.attributes.valid_until < Date.now() / 1000) {
      throw new _errors.FileShareTokenInvalidError(`Share "${token}" has expired.`);
    }
    return toFileShareJSON(share);
  }
  async get({
    id
  }) {
    try {
      return toFileShareJSON(await this.savedObjects.get(this.savedObjectsType, id));
    } catch (e) {
      if (_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
        throw new _errors.FileShareNotFoundError(e);
      }
      throw e;
    }
  }
  async update({
    id,
    attributes
  }) {
    const result = await this.savedObjects.update(this.savedObjectsType, id, attributes);
    return {
      id,
      ...result.attributes
    };
  }
  async list(args) {
    const savedObjects = await this.internalList(args);
    return {
      shares: savedObjects.map(toFileShareJSON)
    };
  }
}
exports.InternalFileShareService = InternalFileShareService;
(0, _defineProperty2.default)(InternalFileShareService, "usageCounter", void 0);