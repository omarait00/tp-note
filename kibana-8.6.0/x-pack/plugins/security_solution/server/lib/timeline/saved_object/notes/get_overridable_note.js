"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOverridableNote = void 0;
var _saved_object = require("./saved_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * When importing timeline with an existing note by others, we don't want override the owner.
 *  In this case we can set overrideOwner to false to keep the original author
 */

const getOverridableNote = async (frameworkRequest, note, timelineSavedObjectId, overrideOwner) => {
  let savedNote = note;
  try {
    savedNote = await (0, _saved_object.getNote)(frameworkRequest, note.noteId);
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return overrideOwner ? {
    eventId: note.eventId,
    note: note.note,
    timelineId: timelineSavedObjectId
  } : {
    eventId: savedNote.eventId,
    note: savedNote.note,
    created: savedNote.created,
    createdBy: savedNote.createdBy,
    updated: savedNote.updated,
    updatedBy: savedNote.updatedBy,
    timelineId: timelineSavedObjectId
  };
};
exports.getOverridableNote = getOverridableNote;