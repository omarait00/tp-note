"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadSourceService = void 0;
var _constants = require("../constants");
var _errors = require("../errors");
var _common = require("../../common");
var _agent_policy = require("./agent_policy");
var _app_context = require("./app_context");
var _saved_object = require("./saved_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function savedObjectToDownloadSource(so) {
  const {
    source_id: sourceId,
    ...attributes
  } = so.attributes;
  return {
    id: sourceId !== null && sourceId !== void 0 ? sourceId : so.id,
    ...attributes
  };
}
class DownloadSourceService {
  async get(soClient, id) {
    const soResponse = await soClient.get(_constants.DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE, id);
    if (soResponse.error) {
      throw new Error(soResponse.error.message);
    }
    return savedObjectToDownloadSource(soResponse);
  }
  async list(soClient) {
    const downloadSources = await soClient.find({
      type: _constants.DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE,
      page: 1,
      perPage: _common.SO_SEARCH_LIMIT,
      sortField: 'is_default',
      sortOrder: 'desc'
    });
    return {
      items: downloadSources.saved_objects.map(savedObjectToDownloadSource),
      total: downloadSources.total,
      page: downloadSources.page,
      perPage: downloadSources.per_page
    };
  }
  async create(soClient, downloadSource, options) {
    var _options$overwrite;
    const data = downloadSource;
    await this.requireUniqueName(soClient, {
      name: downloadSource.name,
      id: options === null || options === void 0 ? void 0 : options.id
    });

    // default should be only one
    if (data.is_default) {
      const defaultDownloadSourceId = await this.getDefaultDownloadSourceId(soClient);
      if (defaultDownloadSourceId) {
        await this.update(soClient, defaultDownloadSourceId, {
          is_default: false
        });
      }
    }
    if (options !== null && options !== void 0 && options.id) {
      data.source_id = options === null || options === void 0 ? void 0 : options.id;
    }
    const newSo = await soClient.create(_constants.DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE, data, {
      id: options === null || options === void 0 ? void 0 : options.id,
      overwrite: (_options$overwrite = options === null || options === void 0 ? void 0 : options.overwrite) !== null && _options$overwrite !== void 0 ? _options$overwrite : false
    });
    return savedObjectToDownloadSource(newSo);
  }

  // default should be only one
  async update(soClient, id, newData) {
    const updateData = newData;
    if (newData.name) {
      await this.requireUniqueName(soClient, {
        name: newData.name,
        id
      });
    }
    if (updateData.is_default) {
      const defaultDownloadSourceId = await this.getDefaultDownloadSourceId(soClient);
      if (defaultDownloadSourceId && defaultDownloadSourceId !== id) {
        await this.update(soClient, defaultDownloadSourceId, {
          is_default: false
        });
      }
    }
    const soResponse = await soClient.update(_constants.DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE, id, updateData);
    if (soResponse.error) {
      throw new Error(soResponse.error.message);
    }
  }
  async delete(soClient, id, {
    fromPreconfiguration = false
  } = {
    fromPreconfiguration: false
  }) {
    const targetDS = await this.get(soClient, id);
    if (targetDS.is_default) {
      throw new _errors.DownloadSourceError(`Default Download source ${id} cannot be deleted.`);
    }
    await _agent_policy.agentPolicyService.removeDefaultSourceFromAll(soClient, _app_context.appContextService.getInternalUserESClient(), id);
    return soClient.delete(_constants.DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE, id);
  }
  async getDefaultDownloadSourceId(soClient) {
    const results = await this._getDefaultDownloadSourceSO(soClient);
    if (!results.saved_objects.length) {
      return null;
    }
    return savedObjectToDownloadSource(results.saved_objects[0]).id;
  }
  async ensureDefault(soClient) {
    const downloadSources = await this.list(soClient);
    const defaultDS = downloadSources.items.find(o => o.is_default);
    if (!defaultDS) {
      const newDefaultDS = {
        name: 'Elastic Artifacts',
        is_default: true,
        host: _constants.DEFAULT_DOWNLOAD_SOURCE_URI
      };
      return await this.create(soClient, newDefaultDS, {
        id: _constants.DEFAULT_DOWNLOAD_SOURCE_ID,
        overwrite: true
      });
    }
    return defaultDS;
  }
  async requireUniqueName(soClient, downloadSource) {
    const results = await soClient.find({
      type: _constants.DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE,
      searchFields: ['name'],
      search: (0, _saved_object.escapeSearchQueryPhrase)(downloadSource.name)
    });
    const idsWithName = results.total && results.saved_objects.map(({
      id
    }) => id);
    if (Array.isArray(idsWithName)) {
      const isEditingSelf = (downloadSource === null || downloadSource === void 0 ? void 0 : downloadSource.id) && idsWithName.includes(downloadSource.id);
      if (!downloadSource.id || !isEditingSelf) {
        const isSingle = idsWithName.length === 1;
        const existClause = isSingle ? `Download Source '${idsWithName[0]}' already exists` : `Download Sources '${idsWithName.join(',')}' already exist`;
        throw new _errors.FleetError(`${existClause} with name '${downloadSource.name}'`);
      }
    }
  }
  async _getDefaultDownloadSourceSO(soClient) {
    return await soClient.find({
      type: _constants.DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE,
      searchFields: ['is_default'],
      search: 'true'
    });
  }
}
const downloadSourceService = new DownloadSourceService();
exports.downloadSourceService = downloadSourceService;