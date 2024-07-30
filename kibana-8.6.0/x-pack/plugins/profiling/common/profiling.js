"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FrameType = void 0;
exports.createStackFrameID = createStackFrameID;
exports.createStackFrameMetadata = createStackFrameMetadata;
exports.describeFrameType = describeFrameType;
exports.emptyStackTrace = exports.emptyStackFrame = exports.emptyExecutable = void 0;
exports.getAddressFromStackFrameID = getAddressFromStackFrameID;
exports.getCalleeFunction = getCalleeFunction;
exports.getCalleeLabel = getCalleeLabel;
exports.getCalleeSource = getCalleeSource;
exports.getFileIDFromStackFrameID = getFileIDFromStackFrameID;
exports.groupStackFrameMetadataByStackTrace = groupStackFrameMetadataByStackTrace;
var _base = require("./base64");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createStackFrameID(fileID, addressOrLine) {
  const buf = Buffer.alloc(24);
  Buffer.from(fileID, 'base64url').copy(buf);
  buf.writeBigUInt64BE(BigInt(addressOrLine), 16);
  return buf.toString('base64url');
}

/* eslint no-bitwise: ["error", { "allow": ["&"] }] */
function getFileIDFromStackFrameID(frameID) {
  return frameID.slice(0, 21) + _base.safeBase64Encoder[frameID.charCodeAt(21) & 0x30];
}

/* eslint no-bitwise: ["error", { "allow": ["<<=", "&"] }] */
function getAddressFromStackFrameID(frameID) {
  let address = (0, _base.charCodeAt)(frameID, 21) & 0xf;
  address <<= 6;
  address += (0, _base.charCodeAt)(frameID, 22);
  address <<= 6;
  address += (0, _base.charCodeAt)(frameID, 23);
  address <<= 6;
  address += (0, _base.charCodeAt)(frameID, 24);
  address <<= 6;
  address += (0, _base.charCodeAt)(frameID, 25);
  address <<= 6;
  address += (0, _base.charCodeAt)(frameID, 26);
  address <<= 6;
  address += (0, _base.charCodeAt)(frameID, 27);
  address <<= 6;
  address += (0, _base.charCodeAt)(frameID, 28);
  address <<= 6;
  address += (0, _base.charCodeAt)(frameID, 29);
  address <<= 6;
  address += (0, _base.charCodeAt)(frameID, 30);
  address <<= 6;
  address += (0, _base.charCodeAt)(frameID, 31);
  return address;
}
let FrameType;
exports.FrameType = FrameType;
(function (FrameType) {
  FrameType[FrameType["Unsymbolized"] = 0] = "Unsymbolized";
  FrameType[FrameType["Python"] = 1] = "Python";
  FrameType[FrameType["PHP"] = 2] = "PHP";
  FrameType[FrameType["Native"] = 3] = "Native";
  FrameType[FrameType["Kernel"] = 4] = "Kernel";
  FrameType[FrameType["JVM"] = 5] = "JVM";
  FrameType[FrameType["Ruby"] = 6] = "Ruby";
  FrameType[FrameType["Perl"] = 7] = "Perl";
  FrameType[FrameType["JavaScript"] = 8] = "JavaScript";
})(FrameType || (exports.FrameType = FrameType = {}));
const frameTypeDescriptions = {
  [FrameType.Unsymbolized]: '<unsymbolized frame>',
  [FrameType.Python]: 'Python',
  [FrameType.PHP]: 'PHP',
  [FrameType.Native]: 'Native',
  [FrameType.Kernel]: 'Kernel',
  [FrameType.JVM]: 'JVM/Hotspot',
  [FrameType.Ruby]: 'Ruby',
  [FrameType.Perl]: 'Perl',
  [FrameType.JavaScript]: 'JavaScript'
};
function describeFrameType(ft) {
  return frameTypeDescriptions[ft];
}
const emptyStackTrace = {
  FrameIDs: [],
  FileIDs: [],
  AddressOrLines: [],
  Types: []
};
exports.emptyStackTrace = emptyStackTrace;
const emptyStackFrame = {
  FileName: '',
  FunctionName: '',
  FunctionOffset: 0,
  LineNumber: 0,
  SourceType: 0
};
exports.emptyStackFrame = emptyStackFrame;
const emptyExecutable = {
  FileName: ''
};
exports.emptyExecutable = emptyExecutable;
function createStackFrameMetadata(options = {}) {
  var _options$FrameID, _options$FileID, _options$FrameType, _options$AddressOrLin, _options$FunctionName, _options$FunctionOffs, _options$SourceID, _options$SourceLine, _options$ExeFileName, _options$CommitHash, _options$SourceCodeUR, _options$SourceFilena, _options$SourcePackag, _options$SourcePackag2, _options$SourceType;
  const metadata = {};
  metadata.FrameID = (_options$FrameID = options.FrameID) !== null && _options$FrameID !== void 0 ? _options$FrameID : '';
  metadata.FileID = (_options$FileID = options.FileID) !== null && _options$FileID !== void 0 ? _options$FileID : '';
  metadata.FrameType = (_options$FrameType = options.FrameType) !== null && _options$FrameType !== void 0 ? _options$FrameType : 0;
  metadata.AddressOrLine = (_options$AddressOrLin = options.AddressOrLine) !== null && _options$AddressOrLin !== void 0 ? _options$AddressOrLin : 0;
  metadata.FunctionName = (_options$FunctionName = options.FunctionName) !== null && _options$FunctionName !== void 0 ? _options$FunctionName : '';
  metadata.FunctionOffset = (_options$FunctionOffs = options.FunctionOffset) !== null && _options$FunctionOffs !== void 0 ? _options$FunctionOffs : 0;
  metadata.SourceID = (_options$SourceID = options.SourceID) !== null && _options$SourceID !== void 0 ? _options$SourceID : '';
  metadata.SourceLine = (_options$SourceLine = options.SourceLine) !== null && _options$SourceLine !== void 0 ? _options$SourceLine : 0;
  metadata.ExeFileName = (_options$ExeFileName = options.ExeFileName) !== null && _options$ExeFileName !== void 0 ? _options$ExeFileName : '';
  metadata.CommitHash = (_options$CommitHash = options.CommitHash) !== null && _options$CommitHash !== void 0 ? _options$CommitHash : '';
  metadata.SourceCodeURL = (_options$SourceCodeUR = options.SourceCodeURL) !== null && _options$SourceCodeUR !== void 0 ? _options$SourceCodeUR : '';
  metadata.SourceFilename = (_options$SourceFilena = options.SourceFilename) !== null && _options$SourceFilena !== void 0 ? _options$SourceFilena : '';
  metadata.SourcePackageHash = (_options$SourcePackag = options.SourcePackageHash) !== null && _options$SourcePackag !== void 0 ? _options$SourcePackag : '';
  metadata.SourcePackageURL = (_options$SourcePackag2 = options.SourcePackageURL) !== null && _options$SourcePackag2 !== void 0 ? _options$SourcePackag2 : '';
  metadata.SourceType = (_options$SourceType = options.SourceType) !== null && _options$SourceType !== void 0 ? _options$SourceType : 0;

  // Unknown/invalid offsets are currently set to 0.
  //
  // In this case we leave FunctionSourceLine=0 as a flag for the UI that the
  // FunctionSourceLine should not be displayed.
  //
  // As FunctionOffset=0 could also be a legit value, this work-around needs
  // a real fix. The idea for after GA is to change FunctionOffset=-1 to
  // indicate unknown/invalid.
  if (metadata.FunctionOffset > 0) {
    metadata.FunctionSourceLine = metadata.SourceLine - metadata.FunctionOffset;
  } else {
    metadata.FunctionSourceLine = 0;
  }
  return metadata;
}
function checkIfStringHasParentheses(s) {
  return /\(|\)/.test(s);
}
function getFunctionName(metadata) {
  return metadata.FunctionName !== '' && !checkIfStringHasParentheses(metadata.FunctionName) ? `${metadata.FunctionName}()` : metadata.FunctionName;
}
function getExeFileName(metadata) {
  if ((metadata === null || metadata === void 0 ? void 0 : metadata.ExeFileName) === undefined) {
    return '';
  }
  if (metadata.ExeFileName !== '') {
    return metadata.ExeFileName;
  }
  return describeFrameType(metadata.FrameType);
}
function getCalleeLabel(metadata) {
  if (metadata.FunctionName !== '') {
    const sourceFilename = metadata.SourceFilename;
    const sourceURL = sourceFilename ? sourceFilename.split('/').pop() : '';
    return `${getExeFileName(metadata)}: ${getFunctionName(metadata)} in ${sourceURL}#${metadata.SourceLine}`;
  }
  return getExeFileName(metadata);
}
function getCalleeFunction(frame) {
  // In the best case scenario, we have the file names, source lines,
  // and function names. However we need to deal with missing function or
  // executable info.
  const exeDisplayName = frame.ExeFileName ? frame.ExeFileName : describeFrameType(frame.FrameType);

  // When there is no function name, only use the executable name
  return frame.FunctionName ? exeDisplayName + ': ' + frame.FunctionName : exeDisplayName;
}
function getCalleeSource(frame) {
  if (frame.SourceFilename === '' && frame.SourceLine === 0) {
    if (frame.ExeFileName) {
      // If no source line or filename available, display the executable offset
      return frame.ExeFileName + '+0x' + frame.AddressOrLine.toString(16);
    }

    // If we don't have the executable filename, display <unsymbolized>
    return '<unsymbolized>';
  }
  if (frame.SourceFilename !== '' && frame.SourceLine === 0) {
    return frame.SourceFilename;
  }
  return frame.SourceFilename + (frame.SourceLine !== 0 ? `#${frame.SourceLine}` : '');
}
function groupStackFrameMetadataByStackTrace(stackTraces, stackFrames, executables) {
  const stackTraceMap = {};
  for (const [stackTraceID, trace] of stackTraces) {
    const numFramesPerTrace = trace.FrameIDs.length;
    const frameMetadata = new Array(numFramesPerTrace);
    for (let i = 0; i < numFramesPerTrace; i++) {
      var _stackFrames$get, _executables$get;
      const frameID = trace.FrameIDs[i];
      const fileID = trace.FileIDs[i];
      const addressOrLine = trace.AddressOrLines[i];
      const frame = (_stackFrames$get = stackFrames.get(frameID)) !== null && _stackFrames$get !== void 0 ? _stackFrames$get : emptyStackFrame;
      const executable = (_executables$get = executables.get(fileID)) !== null && _executables$get !== void 0 ? _executables$get : emptyExecutable;
      frameMetadata[i] = createStackFrameMetadata({
        FrameID: frameID,
        FileID: fileID,
        AddressOrLine: addressOrLine,
        FrameType: trace.Types[i],
        FunctionName: frame.FunctionName,
        FunctionOffset: frame.FunctionOffset,
        SourceLine: frame.LineNumber,
        SourceFilename: frame.FileName,
        ExeFileName: executable.FileName
      });
    }
    stackTraceMap[stackTraceID] = frameMetadata;
  }
  return stackTraceMap;
}