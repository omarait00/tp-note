"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFrameGroupID = createFrameGroupID;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// createFrameGroupID is the "standard" way of grouping frames, by commonly
// shared group identifiers.
//
// For ELF-symbolized frames, group by FunctionName, ExeFileName and FileID.
// For non-symbolized frames, group by FileID and AddressOrLine.
// otherwise group by ExeFileName, SourceFilename and FunctionName.
function createFrameGroupID(fileID, addressOrLine, exeFilename, sourceFilename, functionName) {
  if (functionName === '') {
    return `empty;${fileID};${addressOrLine}`;
  }
  if (sourceFilename === '') {
    return `elf;${exeFilename};${functionName}`;
  }
  return `full;${exeFilename};${functionName};${sourceFilename}`;
}