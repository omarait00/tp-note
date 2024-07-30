"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentUploadFile = getAgentUploadFile;
exports.getAgentUploads = getAgentUploads;
exports.getDownloadHeadersForFile = getDownloadHeadersForFile;
var _moment = _interopRequireDefault(require("moment"));
var _server = require("../../../../../../src/plugins/files/server");
var _app_context = require("../app_context");
var _common = require("../../../common");
var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getAgentUploads(esClient, agentId) {
  const getFile = async fileId => {
    if (!fileId) return;
    try {
      var _file$_source;
      const file = await esClient.get({
        index: _constants.FILE_STORAGE_METADATA_AGENT_INDEX,
        id: fileId
      });
      return {
        id: file._id,
        ...((_file$_source = file._source) === null || _file$_source === void 0 ? void 0 : _file$_source.file)
      };
    } catch (err) {
      if (err.statusCode === 404) {
        _app_context.appContextService.getLogger().debug(err);
        return;
      } else {
        throw err;
      }
    }
  };
  const actions = await _getRequestDiagnosticsActions(esClient, agentId);
  const results = [];
  for (const action of actions) {
    var _file$name, _file$id, _file$Status;
    const file = await getFile(action.fileId);
    const fileName = (_file$name = file === null || file === void 0 ? void 0 : file.name) !== null && _file$name !== void 0 ? _file$name : `${(0, _moment.default)(action.timestamp).format('YYYY-MM-DD HH:mm:ss')}.zip`;
    const filePath = file ? _common.agentRouteService.getAgentFileDownloadLink(file.id, file.name) : '';
    const result = {
      actionId: action.actionId,
      id: (_file$id = file === null || file === void 0 ? void 0 : file.id) !== null && _file$id !== void 0 ? _file$id : action.actionId,
      status: (_file$Status = file === null || file === void 0 ? void 0 : file.Status) !== null && _file$Status !== void 0 ? _file$Status : 'IN_PROGRESS',
      name: fileName,
      createTime: action.timestamp,
      filePath
    };
    results.push(result);
  }
  return results;
}
async function _getRequestDiagnosticsActions(esClient, agentId) {
  const agentActionRes = await esClient.search({
    index: _common.AGENT_ACTIONS_INDEX,
    ignore_unavailable: true,
    size: _constants.SO_SEARCH_LIMIT,
    query: {
      bool: {
        must: [{
          term: {
            type: 'REQUEST_DIAGNOSTICS'
          }
        }, {
          term: {
            agents: agentId
          }
        }]
      }
    }
  });
  const agentActionIds = agentActionRes.hits.hits.map(hit => {
    var _hit$_source;
    return (_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : _hit$_source.action_id;
  });
  if (agentActionIds.length === 0) {
    return [];
  }
  try {
    const actionResults = await esClient.search({
      index: _common.AGENT_ACTIONS_RESULTS_INDEX,
      ignore_unavailable: true,
      size: _constants.SO_SEARCH_LIMIT,
      query: {
        bool: {
          must: [{
            terms: {
              action_id: agentActionIds
            }
          }, {
            term: {
              agent_id: agentId
            }
          }]
        }
      }
    });
    return actionResults.hits.hits.map(hit => {
      var _hit$_source2, _hit$_source3, _hit$_source4, _hit$_source4$data;
      return {
        actionId: (_hit$_source2 = hit._source) === null || _hit$_source2 === void 0 ? void 0 : _hit$_source2.action_id,
        timestamp: (_hit$_source3 = hit._source) === null || _hit$_source3 === void 0 ? void 0 : _hit$_source3['@timestamp'],
        fileId: (_hit$_source4 = hit._source) === null || _hit$_source4 === void 0 ? void 0 : (_hit$_source4$data = _hit$_source4.data) === null || _hit$_source4$data === void 0 ? void 0 : _hit$_source4$data.file_id
      };
    });
  } catch (err) {
    if (err.statusCode === 404) {
      // .fleet-actions-results does not yet exist
      _app_context.appContextService.getLogger().debug(err);
      return [];
    } else {
      throw err;
    }
  }
}
async function getAgentUploadFile(esClient, id, fileName) {
  try {
    const fileClient = (0, _server.createEsFileClient)({
      blobStorageIndex: _constants.FILE_STORAGE_DATA_AGENT_INDEX,
      metadataIndex: _constants.FILE_STORAGE_METADATA_AGENT_INDEX,
      elasticsearchClient: esClient,
      logger: _app_context.appContextService.getLogger()
    });
    const file = await fileClient.get({
      id
    });
    return {
      body: await file.downloadContent(),
      headers: getDownloadHeadersForFile(fileName)
    };
  } catch (error) {
    _app_context.appContextService.getLogger().error(error);
    throw error;
  }
}
function getDownloadHeadersForFile(fileName) {
  return {
    'content-type': 'application/octet-stream',
    // Note, this name can be overridden by the client if set via a "download" attribute on the HTML tag.
    'content-disposition': `attachment; filename="${fileName}"`,
    'cache-control': 'max-age=31536000, immutable',
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
    'x-content-type-options': 'nosniff'
  };
}