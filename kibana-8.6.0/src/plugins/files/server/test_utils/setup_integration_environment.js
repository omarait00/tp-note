"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupIntegrationEnvironment = setupIntegrationEnvironment;
var _lodash = require("lodash");
var _kbn_server = require("../../../../core/test_helpers/kbn_server");
var _pRetry = _interopRequireDefault(require("p-retry"));
var _file_kinds_registry = require("../../common/file_kinds_registry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

async function setupIntegrationEnvironment() {
  const fileKind = 'test-file-kind';
  const testIndex = '.kibana-test-files';

  /**
   * Functionality to create files easily
   */
  let disposables = [];
  const createFile = async (fileAttrs = {}) => {
    const result = await _kbn_server.request.post(root, `/api/files/files/${fileKind}`).send((0, _lodash.defaults)(fileAttrs, {
      name: 'myFile',
      alt: 'a picture of my dog',
      meta: {},
      mimeType: 'image/png'
    })).expect(200);
    disposables.push(async () => {
      await _kbn_server.request.delete(root, `/api/files/files/${fileKind}/${result.body.file.id}`).send().expect(200);
    });
    return result.body.file;
  };
  const {
    startES
  } = (0, _kbn_server.createTestServers)({
    adjustTimeout: jest.setTimeout,
    settings: {
      es: {
        license: 'basic'
      }
    }
  });

  /**
   * Clean up methods
   */
  const cleanupAfterEach = async () => {
    await Promise.all(disposables.map(dispose => dispose()));
    disposables = [];
    await esClient.indices.delete({
      index: testIndex,
      ignore_unavailable: true
    });
  };
  const cleanupAfterAll = async () => {
    await root.shutdown();
    await manageES.stop();
  };

  /**
   * Start the servers and set them up
   */
  const manageES = await startES();
  const root = (0, _kbn_server.createRootWithCorePlugins)({}, {
    oss: false
  });
  await root.preboot();
  await root.setup();

  /**
   * Register a test file type
   */
  const testHttpConfig = {
    tags: ['access:myapp']
  };
  const myFileKind = {
    id: fileKind,
    blobStoreSettings: {
      esFixedSizeIndex: {
        index: testIndex
      }
    },
    http: {
      create: testHttpConfig,
      delete: testHttpConfig,
      update: testHttpConfig,
      download: testHttpConfig,
      getById: testHttpConfig,
      list: testHttpConfig,
      share: testHttpConfig
    }
  };
  (0, _file_kinds_registry.getFileKindsRegistry)().register(myFileKind);
  const coreStart = await root.start();
  const esClient = coreStart.elasticsearch.client.asInternalUser;

  /**
   * Wait for endpoints to be available
   */
  await (0, _pRetry.default)(() => _kbn_server.request.get(root, '/api/licensing/info').expect(200), {
    retries: 5
  });
  return {
    manageES,
    esClient,
    root,
    coreStart,
    fileKind,
    testIndex,
    request: _kbn_server.request,
    createFile,
    cleanupAfterEach,
    cleanupAfterAll
  };
}