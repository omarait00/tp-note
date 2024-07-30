"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerificationModeCodec = exports.VerificationMode = exports.ThrottlingSuffixCodec = exports.ThrottlingSuffix = exports.TLSVersionCodec = exports.TLSVersion = exports.SourceTypeCodec = exports.SourceType = exports.ScreenshotOptionCodec = exports.ScreenshotOption = exports.ScheduleUnitCodec = exports.ScheduleUnit = exports.ResponseBodyIndexPolicyCodec = exports.ResponseBodyIndexPolicy = exports.MonacoEditorLangIdCodec = exports.MonacoEditorLangId = exports.ModeCodec = exports.Mode = exports.HTTPMethodCodec = exports.HTTPMethod = exports.FormMonitorTypeCodec = exports.FormMonitorType = exports.DataStreamCodec = exports.DataStream = exports.ContentTypeCodec = exports.ContentType = void 0;
var _t_enum = require("../../utils/t_enum");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let DataStream;
exports.DataStream = DataStream;
(function (DataStream) {
  DataStream["HTTP"] = "http";
  DataStream["TCP"] = "tcp";
  DataStream["ICMP"] = "icmp";
  DataStream["BROWSER"] = "browser";
})(DataStream || (exports.DataStream = DataStream = {}));
const DataStreamCodec = (0, _t_enum.tEnum)('DataStream', DataStream);
exports.DataStreamCodec = DataStreamCodec;
let HTTPMethod;
exports.HTTPMethod = HTTPMethod;
(function (HTTPMethod) {
  HTTPMethod["GET"] = "GET";
  HTTPMethod["POST"] = "POST";
  HTTPMethod["PUT"] = "PUT";
  HTTPMethod["DELETE"] = "DELETE";
  HTTPMethod["HEAD"] = "HEAD";
})(HTTPMethod || (exports.HTTPMethod = HTTPMethod = {}));
const HTTPMethodCodec = (0, _t_enum.tEnum)('HTTPMethod', HTTPMethod);
exports.HTTPMethodCodec = HTTPMethodCodec;
let ResponseBodyIndexPolicy;
exports.ResponseBodyIndexPolicy = ResponseBodyIndexPolicy;
(function (ResponseBodyIndexPolicy) {
  ResponseBodyIndexPolicy["ALWAYS"] = "always";
  ResponseBodyIndexPolicy["NEVER"] = "never";
  ResponseBodyIndexPolicy["ON_ERROR"] = "on_error";
})(ResponseBodyIndexPolicy || (exports.ResponseBodyIndexPolicy = ResponseBodyIndexPolicy = {}));
const ResponseBodyIndexPolicyCodec = (0, _t_enum.tEnum)('ResponseBodyIndexPolicy', ResponseBodyIndexPolicy);
exports.ResponseBodyIndexPolicyCodec = ResponseBodyIndexPolicyCodec;
let MonacoEditorLangId;
exports.MonacoEditorLangId = MonacoEditorLangId;
(function (MonacoEditorLangId) {
  MonacoEditorLangId["JSON"] = "xjson";
  MonacoEditorLangId["PLAINTEXT"] = "plaintext";
  MonacoEditorLangId["XML"] = "xml";
  MonacoEditorLangId["JAVASCRIPT"] = "javascript";
})(MonacoEditorLangId || (exports.MonacoEditorLangId = MonacoEditorLangId = {}));
const MonacoEditorLangIdCodec = (0, _t_enum.tEnum)('MonacoEditorLangId', MonacoEditorLangId);
exports.MonacoEditorLangIdCodec = MonacoEditorLangIdCodec;
let Mode;
exports.Mode = Mode;
(function (Mode) {
  Mode["FORM"] = "form";
  Mode["JSON"] = "json";
  Mode["PLAINTEXT"] = "text";
  Mode["XML"] = "xml";
})(Mode || (exports.Mode = Mode = {}));
const ModeCodec = (0, _t_enum.tEnum)('Mode', Mode);
exports.ModeCodec = ModeCodec;
let ContentType;
exports.ContentType = ContentType;
(function (ContentType) {
  ContentType["JSON"] = "application/json";
  ContentType["TEXT"] = "text/plain";
  ContentType["XML"] = "application/xml";
  ContentType["FORM"] = "application/x-www-form-urlencoded";
})(ContentType || (exports.ContentType = ContentType = {}));
const ContentTypeCodec = (0, _t_enum.tEnum)('ContentType', ContentType);
exports.ContentTypeCodec = ContentTypeCodec;
let ScheduleUnit;
exports.ScheduleUnit = ScheduleUnit;
(function (ScheduleUnit) {
  ScheduleUnit["MINUTES"] = "m";
  ScheduleUnit["SECONDS"] = "s";
})(ScheduleUnit || (exports.ScheduleUnit = ScheduleUnit = {}));
const ScheduleUnitCodec = (0, _t_enum.tEnum)('ScheduleUnit', ScheduleUnit);
exports.ScheduleUnitCodec = ScheduleUnitCodec;
let VerificationMode;
exports.VerificationMode = VerificationMode;
(function (VerificationMode) {
  VerificationMode["CERTIFICATE"] = "certificate";
  VerificationMode["FULL"] = "full";
  VerificationMode["NONE"] = "none";
  VerificationMode["STRICT"] = "strict";
})(VerificationMode || (exports.VerificationMode = VerificationMode = {}));
const VerificationModeCodec = (0, _t_enum.tEnum)('VerificationMode', VerificationMode);
exports.VerificationModeCodec = VerificationModeCodec;
let TLSVersion;
exports.TLSVersion = TLSVersion;
(function (TLSVersion) {
  TLSVersion["ONE_ZERO"] = "TLSv1.0";
  TLSVersion["ONE_ONE"] = "TLSv1.1";
  TLSVersion["ONE_TWO"] = "TLSv1.2";
  TLSVersion["ONE_THREE"] = "TLSv1.3";
})(TLSVersion || (exports.TLSVersion = TLSVersion = {}));
const TLSVersionCodec = (0, _t_enum.tEnum)('TLSVersion', TLSVersion);
exports.TLSVersionCodec = TLSVersionCodec;
let ScreenshotOption;
exports.ScreenshotOption = ScreenshotOption;
(function (ScreenshotOption) {
  ScreenshotOption["ON"] = "on";
  ScreenshotOption["OFF"] = "off";
  ScreenshotOption["ONLY_ON_FAILURE"] = "only-on-failure";
})(ScreenshotOption || (exports.ScreenshotOption = ScreenshotOption = {}));
const ScreenshotOptionCodec = (0, _t_enum.tEnum)('ScreenshotOption', ScreenshotOption);
exports.ScreenshotOptionCodec = ScreenshotOptionCodec;
let ThrottlingSuffix;
exports.ThrottlingSuffix = ThrottlingSuffix;
(function (ThrottlingSuffix) {
  ThrottlingSuffix["DOWNLOAD"] = "d";
  ThrottlingSuffix["UPLOAD"] = "u";
  ThrottlingSuffix["LATENCY"] = "l";
})(ThrottlingSuffix || (exports.ThrottlingSuffix = ThrottlingSuffix = {}));
const ThrottlingSuffixCodec = (0, _t_enum.tEnum)('ThrottlingSuffix', ThrottlingSuffix);
exports.ThrottlingSuffixCodec = ThrottlingSuffixCodec;
let SourceType;
exports.SourceType = SourceType;
(function (SourceType) {
  SourceType["UI"] = "ui";
  SourceType["PROJECT"] = "project";
})(SourceType || (exports.SourceType = SourceType = {}));
const SourceTypeCodec = (0, _t_enum.tEnum)('SourceType', SourceType);
exports.SourceTypeCodec = SourceTypeCodec;
let FormMonitorType;
exports.FormMonitorType = FormMonitorType;
(function (FormMonitorType) {
  FormMonitorType["SINGLE"] = "single";
  FormMonitorType["MULTISTEP"] = "multistep";
  FormMonitorType["HTTP"] = "http";
  FormMonitorType["TCP"] = "tcp";
  FormMonitorType["ICMP"] = "icmp";
})(FormMonitorType || (exports.FormMonitorType = FormMonitorType = {}));
const FormMonitorTypeCodec = (0, _t_enum.tEnum)('FormMonitorType', FormMonitorType);
exports.FormMonitorTypeCodec = FormMonitorTypeCodec;