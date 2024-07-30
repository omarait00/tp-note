"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readPrebuiltDevToolContentRoute = void 0;
var _mustache = _interopRequireDefault(require("mustache"));
var _path = _interopRequireWildcard(require("path"));
var _fs = _interopRequireDefault(require("fs"));
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../common/constants");
var _console_mappings = require("../console_mappings");
var _schema = require("../schema");
var _search_strategy = require("../../../../../common/search_strategy");
var _utils = require("../utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getReadables = dataPath => _fs.default.promises.readFile(dataPath, {
  encoding: 'utf-8'
});
class ConsoleResponseFactory {
  constructor(response) {
    this.response = response;
  }
  error({
    statusCode,
    body,
    headers
  }) {
    const contentType = {
      'content-type': 'text/plain; charset=utf-8'
    };
    const defaultedHeaders = {
      ...contentType,
      ...(headers !== null && headers !== void 0 ? headers : {})
    };
    return this.response.custom({
      headers: defaultedHeaders,
      statusCode,
      body
    });
  }
}
const buildConsoleResponse = response => new ConsoleResponseFactory(response);
const readPrebuiltDevToolContentRoute = router => {
  router.get({
    path: _constants.DEV_TOOL_PREBUILT_CONTENT,
    validate: _schema.ReadConsoleRequestSchema,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = buildConsoleResponse(response);
    const {
      console_id: consoleId
    } = request.params;
    try {
      var _consoleMappings$cons;
      const securitySolution = await context.securitySolution;
      const spaceId = securitySolution.getSpaceId();
      const fileName = (_consoleMappings$cons = _console_mappings.consoleMappings[consoleId]) !== null && _consoleMappings$cons !== void 0 ? _consoleMappings$cons : null;
      if (!fileName) {
        return siemResponse.error({
          statusCode: 500,
          body: 'No such file or directory'
        });
      }
      const filePath = '../console_templates';
      const dir = (0, _path.resolve)((0, _path.join)(__dirname, filePath));
      const dataPath = _path.default.join(dir, fileName);
      const template = await getReadables(dataPath);
      const riskScoreEntity = consoleId === 'enable_host_risk_score' ? _search_strategy.RiskScoreEntity.host : _search_strategy.RiskScoreEntity.user;
      const view = (0, _utils.getView)({
        spaceId,
        riskScoreEntity
      });

      // override the mustache.js escape function to not escape special characters
      _mustache.default.escape = text => text;
      const output = _mustache.default.render(template, view);
      return response.ok({
        body: output
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.readPrebuiltDevToolContentRoute = readPrebuiltDevToolContentRoute;