"use strict";

var _commander = require("commander");
var _utils = require("@kbn/utils");
var _healthGatewayServer = require("@kbn/health-gateway-server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const program = new _commander.Command('bin/kibana-health-gateway');
program.version(_utils.kibanaPackageJson.version).description('This command starts up a health gateway server that can be ' + 'configured to send requests to multiple Kibana instances').option('-c, --config', 'Path to a gateway.yml configuration file').action(async () => {
  return await (0, _healthGatewayServer.bootstrap)();
});
program.parse(process.argv);