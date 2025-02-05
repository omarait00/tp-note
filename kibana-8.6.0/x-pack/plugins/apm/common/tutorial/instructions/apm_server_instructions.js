"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEditConfig = exports.createDownloadServerRpm = exports.createDownloadServerOsx = exports.createDownloadServerDeb = void 0;
exports.createStartServerUnix = createStartServerUnix;
exports.createStartServerUnixSysv = createStartServerUnixSysv;
exports.createWindowsServerInstructions = createWindowsServerInstructions;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createEditConfig = () => ({
  title: _i18n.i18n.translate('xpack.apm.tutorial.editConfig.title', {
    defaultMessage: 'Edit the configuration'
  }),
  textPre: _i18n.i18n.translate('xpack.apm.tutorial.editConfig.textPre', {
    defaultMessage: "If you're using an X-Pack secured version of Elastic Stack, you must specify \
credentials in the `apm-server.yml` config file."
  }),
  commands: ['output.elasticsearch:', '    hosts: ["<es_url>"]', '    username: <username>', '    password: <password>']
});
exports.createEditConfig = createEditConfig;
const createStartServer = () => ({
  title: _i18n.i18n.translate('xpack.apm.tutorial.startServer.title', {
    defaultMessage: 'Start APM Server'
  }),
  textPre: _i18n.i18n.translate('xpack.apm.tutorial.startServer.textPre', {
    defaultMessage: 'The server processes and stores application performance metrics in Elasticsearch.'
  })
});
function createStartServerUnixSysv() {
  const START_SERVER = createStartServer();
  return {
    title: START_SERVER.title,
    textPre: START_SERVER.textPre,
    commands: ['service apm-server start']
  };
}
function createStartServerUnix() {
  const START_SERVER = createStartServer();
  return {
    title: START_SERVER.title,
    textPre: START_SERVER.textPre,
    commands: ['./apm-server -e']
  };
}
const createDownloadServerTitle = () => _i18n.i18n.translate('xpack.apm.tutorial.downloadServer.title', {
  defaultMessage: 'Download and unpack APM Server'
});
const createDownloadServerOsx = () => ({
  title: createDownloadServerTitle(),
  commands: ['curl -L -O https://artifacts.elastic.co/downloads/apm-server/apm-server-{config.kibana.version}-darwin-x86_64.tar.gz', 'tar xzvf apm-server-{config.kibana.version}-darwin-x86_64.tar.gz', 'cd apm-server-{config.kibana.version}-darwin-x86_64/']
});
exports.createDownloadServerOsx = createDownloadServerOsx;
const createDownloadServerDeb = () => ({
  title: createDownloadServerTitle(),
  commands: ['curl -L -O https://artifacts.elastic.co/downloads/apm-server/apm-server-{config.kibana.version}-amd64.deb', 'sudo dpkg -i apm-server-{config.kibana.version}-amd64.deb'],
  textPost: _i18n.i18n.translate('xpack.apm.tutorial.downloadServerTitle', {
    defaultMessage: 'Looking for the 32-bit packages? See the [Download page]({downloadPageLink}).',
    values: {
      downloadPageLink: '{config.docs.base_url}downloads/apm/apm-server'
    }
  })
});
exports.createDownloadServerDeb = createDownloadServerDeb;
const createDownloadServerRpm = () => ({
  title: createDownloadServerTitle(),
  commands: ['curl -L -O https://artifacts.elastic.co/downloads/apm-server/apm-server-{config.kibana.version}-x86_64.rpm', 'sudo rpm -vi apm-server-{config.kibana.version}-x86_64.rpm'],
  textPost: _i18n.i18n.translate('xpack.apm.tutorial.downloadServerRpm', {
    defaultMessage: 'Looking for the 32-bit packages? See the [Download page]({downloadPageLink}).',
    values: {
      downloadPageLink: '{config.docs.base_url}downloads/apm/apm-server'
    }
  })
});
exports.createDownloadServerRpm = createDownloadServerRpm;
function createWindowsServerInstructions() {
  const START_SERVER = createStartServer();
  return [{
    title: createDownloadServerTitle(),
    textPre: _i18n.i18n.translate('xpack.apm.tutorial.windowsServerInstructions.textPre', {
      defaultMessage: '1. Download the APM Server Windows zip file from the \
[Download page]({downloadPageLink}).\n2. Extract the contents of \
the zip file into {zipFileExtractFolder}.\n3. Rename the {apmServerDirectory} \
directory to `APM-Server`.\n4. Open a PowerShell prompt as an Administrator \
(right-click the PowerShell icon and select \
**Run As Administrator**). If you are running Windows XP, you might need to download and install \
PowerShell.\n5. From the PowerShell prompt, run the following commands to install APM Server as a Windows service:',
      values: {
        downloadPageLink: 'https://www.elastic.co/downloads/apm/apm-server',
        zipFileExtractFolder: '`C:\\Program Files`',
        apmServerDirectory: '`apm-server-{config.kibana.version}-windows`'
      }
    }),
    commands: [`cd 'C:\\Program Files\\APM-Server'`, `.\\install-service-apm-server.ps1`],
    textPost: _i18n.i18n.translate('xpack.apm.tutorial.windowsServerInstructions.textPost', {
      defaultMessage: 'Note: If script execution is disabled on your system, \
you need to set the execution policy for the current session \
to allow the script to run. For example: {command}.',
      values: {
        command: '`PowerShell.exe -ExecutionPolicy UnRestricted -File .\\install-service-apm-server.ps1`'
      }
    })
  }, createEditConfig(), {
    title: START_SERVER.title,
    textPre: START_SERVER.textPre,
    commands: ['Start-Service apm-server']
  }];
}