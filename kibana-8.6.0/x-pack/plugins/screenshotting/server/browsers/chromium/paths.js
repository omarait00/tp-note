"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChromiumArchivePaths = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _path = _interopRequireDefault(require("path"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const REVISION = 1036745;
var BaseUrl;
(function (BaseUrl) {
  BaseUrl["common"] = "https://commondatastorage.googleapis.com/chromium-browser-snapshots";
  BaseUrl["custom"] = "https://storage.googleapis.com/headless_shell";
})(BaseUrl || (BaseUrl = {}));
function isCommonPackage(p) {
  return p.location === 'common';
}
class ChromiumArchivePaths {
  constructor() {
    (0, _defineProperty2.default)(this, "packages", [{
      platform: 'darwin',
      architecture: 'x64',
      archiveFilename: 'chrome-mac.zip',
      archiveChecksum: 'dd4d44ad97ba2fef5dc47d7f2a39ccaa',
      binaryChecksum: '4a7a663b2656d66ce975b00a30df3ab4',
      binaryRelativePath: 'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
      location: 'common',
      archivePath: 'Mac',
      isPreInstalled: false
    }, {
      platform: 'darwin',
      architecture: 'arm64',
      archiveFilename: 'chrome-mac.zip',
      archiveChecksum: '5afc0d49865d55b69ea1ff65b9cc5794',
      binaryChecksum: '4a7a663b2656d66ce975b00a30df3ab4',
      binaryRelativePath: 'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
      location: 'common',
      archivePath: 'Mac_Arm',
      isPreInstalled: false
    }, {
      platform: 'linux',
      architecture: 'x64',
      archiveFilename: 'chromium-749e738-locales-linux_x64.zip',
      archiveChecksum: '09ba194e6c720397728fbec3d3895b0b',
      binaryChecksum: 'df1c957f41dcca8e33369b1d255406c2',
      binaryRelativePath: 'headless_shell-linux_x64/headless_shell',
      location: 'custom',
      isPreInstalled: true
    }, {
      platform: 'linux',
      architecture: 'arm64',
      archiveFilename: 'chromium-749e738-locales-linux_arm64.zip',
      archiveChecksum: '1f535b1c2875d471829c6ff128a13262',
      binaryChecksum: 'ca6b91d0ba8a65712554572dabc66968',
      binaryRelativePath: 'headless_shell-linux_arm64/headless_shell',
      location: 'custom',
      isPreInstalled: true
    }, {
      platform: 'win32',
      architecture: 'x64',
      archiveFilename: 'chrome-win.zip',
      archiveChecksum: '42db052673414b89d8cb45657c1a6aeb',
      binaryChecksum: '1b6eef775198ffd48fb9669ac0c818f7',
      binaryRelativePath: _path.default.join('chrome-win', 'chrome.exe'),
      location: 'common',
      archivePath: 'Win',
      isPreInstalled: true
    }]);
    (0, _defineProperty2.default)(this, "archivesPath", _path.default.resolve(__dirname, '../../../../../../.chromium'));
  }
  find(platform, architecture, packages = this.packages) {
    return packages.find(p => p.platform === platform && p.architecture === architecture);
  }
  resolvePath(p) {
    // adding architecture to the path allows it to download two binaries that have the same name, but are different architecture
    return _path.default.resolve(this.archivesPath, p.architecture, p.archiveFilename);
  }
  getAllArchiveFilenames() {
    return this.packages.map(p => this.resolvePath(p));
  }
  getDownloadUrl(p) {
    if (isCommonPackage(p)) {
      return `${BaseUrl.common}/${p.archivePath}/${REVISION}/${p.archiveFilename}`;
    }
    return BaseUrl.custom + '/' + p.archiveFilename; // revision is not used for URL if package is a custom build
  }

  getBinaryPath(p, chromiumPath) {
    return _path.default.join(chromiumPath, p.binaryRelativePath);
  }
}
exports.ChromiumArchivePaths = ChromiumArchivePaths;