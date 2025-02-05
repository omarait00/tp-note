"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CiStatsPlugin = void 0;
var _path = _interopRequireDefault(require("path"));
var _toolingLog = require("@kbn/tooling-log");
var _utils = require("@kbn/utils");
var _normalizePath = _interopRequireDefault(require("normalize-path"));
var _ciStatsReporter = require("@kbn/ci-stats-reporter");
var _optimizerWebpackHelpers = require("@kbn/optimizer-webpack-helpers");
var _runtime_size_limit = require("./runtime_size_limit");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable import/no-extraneous-dependencies */

const IGNORED_EXTNAME = ['.map', '.br', '.gz'];
class CiStatsPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    const log = new _toolingLog.ToolingLog({
      level: 'error',
      writeTo: process.stdout
    });
    const ciStats = _ciStatsReporter.CiStatsReporter.fromEnv(log);
    if (!ciStats.isEnabled()) {
      return;
    }
    compiler.hooks.emit.tapPromise('CiStatsPlugin', async compilation => {
      const {
        entryName
      } = this.options;
      const assets = Object.entries(compilation.assets).map(([name, source]) => ({
        name,
        size: source.size()
      })).filter(asset => {
        const filename = _path.default.basename(asset.name);
        if (filename.startsWith('.')) {
          return false;
        }
        const ext = _path.default.extname(filename);
        if (IGNORED_EXTNAME.includes(ext)) {
          return false;
        }
        return true;
      });
      const entry = assets.find(a => a.name === `${entryName}.js`);
      if (!entry) {
        throw new Error(`Unable to find bundle entry named [${entryName}]`);
      }
      const moduleCount = compilation.modules.reduce((acc, module) => {
        if ((0, _optimizerWebpackHelpers.isNormalModule)(module)) {
          return acc + 1;
        }
        if ((0, _optimizerWebpackHelpers.isConcatenatedModule)(module)) {
          return acc + module.modules.length;
        }
        return acc;
      }, 0);
      if (moduleCount === 0) {
        throw new Error(`unable to determine module count`);
      }
      await ciStats.metrics([{
        group: `canvas shareable runtime`,
        id: 'total size',
        value: entry.size,
        limit: _runtime_size_limit.RUNTIME_SIZE_LIMIT,
        limitConfigPath: (0, _normalizePath.default)(_path.default.relative(_utils.REPO_ROOT, require.resolve('./runtime_size_limit')))
      }, {
        group: `canvas shareable runtime`,
        id: 'misc asset size',
        value: assets.filter(a => a !== entry).reduce((acc, a) => acc + a.size, 0)
      }, {
        group: `canvas shareable runtime`,
        id: 'module count',
        value: moduleCount
      }]);
    });
  }
}
exports.CiStatsPlugin = CiStatsPlugin;