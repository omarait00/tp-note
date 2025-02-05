"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.safeChildProcess = safeChildProcess;
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Our process can get sent various signals, and when these occur we wish to
// kill the subprocess and then kill our process as long as the observer isn't cancelled
function safeChildProcess(logger, childProcess) {
  const ownTerminateSignal$ = (0, _rxjs.merge)((0, _rxjs.fromEvent)(process, 'SIGTERM').pipe((0, _operators.mapTo)('SIGTERM')), (0, _rxjs.fromEvent)(process, 'SIGINT').pipe((0, _operators.mapTo)('SIGINT')), (0, _rxjs.fromEvent)(process, 'SIGBREAK').pipe((0, _operators.mapTo)('SIGBREAK'))).pipe((0, _operators.take)(1), (0, _operators.share)());
  const ownTerminateMapToKill$ = ownTerminateSignal$.pipe((0, _operators.tap)(signal => {
    logger.debug(`Kibana process received terminate signal: ${signal}`);
  }), (0, _operators.mapTo)('SIGKILL'));
  const kibanaForceExit$ = (0, _rxjs.fromEvent)(process, 'exit').pipe((0, _operators.take)(1), (0, _operators.tap)(signal => {
    logger.debug(`Kibana process forcefully exited with signal: ${signal}`);
  }), (0, _operators.mapTo)('SIGKILL'));
  const signalForChildProcess$ = (0, _rxjs.merge)(ownTerminateMapToKill$, kibanaForceExit$);
  const logAndKillChildProcess = (0, _operators.tap)(signal => {
    logger.debug(`Child process terminate signal was: ${signal}. Closing the browser...`);
    return childProcess.kill(signal);
  });

  // send termination signals
  const terminate$ = (0, _rxjs.merge)(signalForChildProcess$.pipe(logAndKillChildProcess), ownTerminateSignal$.pipe((0, _operators.delay)(1), (0, _operators.tap)(signal => {
    logger.debug(`Kibana process terminate signal was: ${signal}. Closing the browser...`);
    return process.kill(process.pid, signal);
  })));
  return {
    terminate$
  };
}