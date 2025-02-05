"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.persistNoteSchema = exports.globalNotes = exports.eventNotes = void 0;
var runtimeTypes = _interopRequireWildcard(require("io-ts"));
var _utility_types = require("../../../../../common/utility_types");
var _note = require("../../../../../common/types/timeline/note");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const eventNotes = (0, _utility_types.unionWithNullType)(runtimeTypes.array(_note.SavedNoteRuntimeType));
exports.eventNotes = eventNotes;
const globalNotes = (0, _utility_types.unionWithNullType)(runtimeTypes.array(_note.SavedNoteRuntimeType));
exports.globalNotes = globalNotes;
const persistNoteSchema = runtimeTypes.intersection([runtimeTypes.type({
  note: _note.SavedNoteRuntimeType
}), runtimeTypes.partial({
  overrideOwner: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  noteId: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  version: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
})]);
exports.persistNoteSchema = persistNoteSchema;