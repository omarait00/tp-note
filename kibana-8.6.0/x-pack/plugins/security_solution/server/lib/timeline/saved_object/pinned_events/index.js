"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savePinnedEvents = exports.pickSavedPinnedEvent = exports.persistPinnedEventOnTimeline = exports.getAllPinnedEventsByTimelineId = exports.deletePinnedEventOnTimeline = exports.deleteAllPinnedEventsOnTimeline = exports.convertSavedObjectToSavedPinnedEvent = exports.PINNED_EVENTS_PER_PAGE = void 0;
var _PathReporter = require("io-ts/lib/PathReporter");
var _fp = require("lodash/fp");
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
var _constants = require("../../../../../common/constants");
var _pinned_event = require("../../../../../common/types/timeline/pinned_event");
var _timelines = require("../timelines");
var _pinned_events = require("../../saved_object_mappings/pinned_events");
var _field_migrator = require("./field_migrator");
var _saved_object_mappings = require("../../saved_object_mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deletePinnedEventOnTimeline = async (request, pinnedEventIds) => {
  const savedObjectsClient = (await request.context.core).savedObjects.client;
  await Promise.all(pinnedEventIds.map(pinnedEventId => savedObjectsClient.delete(_pinned_events.pinnedEventSavedObjectType, pinnedEventId)));
};
exports.deletePinnedEventOnTimeline = deletePinnedEventOnTimeline;
const deleteAllPinnedEventsOnTimeline = async (request, timelineId) => {
  const savedObjectsClient = (await request.context.core).savedObjects.client;
  const options = {
    type: _pinned_events.pinnedEventSavedObjectType,
    search: timelineId,
    searchFields: ['timelineId']
  };
  const pinnedEventToBeDeleted = await getAllSavedPinnedEvents(request, options);
  await Promise.all(pinnedEventToBeDeleted.map(pinnedEvent => savedObjectsClient.delete(_pinned_events.pinnedEventSavedObjectType, pinnedEvent.pinnedEventId)));
};
exports.deleteAllPinnedEventsOnTimeline = deleteAllPinnedEventsOnTimeline;
const PINNED_EVENTS_PER_PAGE = 10000; // overrides the saved object client's FIND_DEFAULT_PER_PAGE (20)
exports.PINNED_EVENTS_PER_PAGE = PINNED_EVENTS_PER_PAGE;
const getAllPinnedEventsByTimelineId = async (request, timelineId) => {
  const options = {
    type: _pinned_events.pinnedEventSavedObjectType,
    hasReference: {
      type: _saved_object_mappings.timelineSavedObjectType,
      id: timelineId
    },
    perPage: PINNED_EVENTS_PER_PAGE
  };
  return getAllSavedPinnedEvents(request, options);
};
exports.getAllPinnedEventsByTimelineId = getAllPinnedEventsByTimelineId;
const persistPinnedEventOnTimeline = async (request, pinnedEventId, eventId, timelineId) => {
  try {
    if (pinnedEventId != null) {
      // Delete Pinned Event on Timeline
      await deletePinnedEventOnTimeline(request, [pinnedEventId]);
      return null;
    }
    const {
      timelineId: validatedTimelineId,
      timelineVersion
    } = await getValidTimelineIdAndVersion(request, timelineId);
    const pinnedEvents = await getPinnedEventsInTimelineWithEventId(request, validatedTimelineId, eventId);

    // we already had this event pinned so let's just return the one we already had
    if (pinnedEvents.length > 0) {
      return pinnedEvents[0];
    }
    return await createPinnedEvent({
      request,
      eventId,
      timelineId: validatedTimelineId,
      timelineVersion
    });
  } catch (err) {
    if ((0, _fp.getOr)(null, 'output.statusCode', err) === 404) {
      /*
       * Why we are doing that, because if it is not found for sure that it will be unpinned
       * There is no need to bring back this error since we can assume that it is unpinned
       */
      return null;
    }
    if ((0, _fp.getOr)(null, 'output.statusCode', err) === 403) {
      return pinnedEventId != null ? {
        code: 403,
        message: err.message,
        pinnedEventId: eventId,
        timelineId: '',
        timelineVersion: ''
      } : null;
    }
    throw err;
  }
};
exports.persistPinnedEventOnTimeline = persistPinnedEventOnTimeline;
const getValidTimelineIdAndVersion = async (request, timelineId) => {
  if (timelineId != null) {
    return {
      timelineId
    };
  }
  const savedObjectsClient = (await request.context.core).savedObjects.client;

  // create timeline because it didn't exist
  const {
    timeline: timelineResult
  } = await (0, _timelines.createTimeline)({
    timelineId: null,
    timeline: {},
    savedObjectsClient,
    userInfo: request.user
  });
  return {
    timelineId: timelineResult.savedObjectId,
    timelineVersion: timelineResult.version
  };
};
const getPinnedEventsInTimelineWithEventId = async (request, timelineId, eventId) => {
  const allPinnedEventId = await getAllPinnedEventsByTimelineId(request, timelineId);
  const pinnedEvents = allPinnedEventId.filter(pinnedEvent => pinnedEvent.eventId === eventId);
  return pinnedEvents;
};
const createPinnedEvent = async ({
  request,
  eventId,
  timelineId,
  timelineVersion
}) => {
  const savedObjectsClient = (await request.context.core).savedObjects.client;
  const savedPinnedEvent = {
    eventId,
    timelineId
  };
  const pinnedEventWithCreator = pickSavedPinnedEvent(null, savedPinnedEvent, request.user);
  const {
    transformedFields: migratedAttributes,
    references
  } = _field_migrator.pinnedEventFieldsMigrator.extractFieldsToReferences({
    data: pinnedEventWithCreator
  });
  const createdPinnedEvent = await savedObjectsClient.create(_pinned_events.pinnedEventSavedObjectType, migratedAttributes, {
    references
  });
  const repopulatedSavedObject = _field_migrator.pinnedEventFieldsMigrator.populateFieldsFromReferences(createdPinnedEvent);

  // create Pinned Event on Timeline
  return convertSavedObjectToSavedPinnedEvent(repopulatedSavedObject, timelineVersion);
};
const getAllSavedPinnedEvents = async (request, options) => {
  const savedObjectsClient = (await request.context.core).savedObjects.client;
  const savedObjects = await savedObjectsClient.find(options);
  return savedObjects.saved_objects.map(savedObject => {
    const populatedPinnedEvent = _field_migrator.pinnedEventFieldsMigrator.populateFieldsFromReferences(savedObject);
    return convertSavedObjectToSavedPinnedEvent(populatedPinnedEvent);
  });
};
const savePinnedEvents = (frameworkRequest, timelineSavedObjectId, pinnedEventIds) => Promise.all(pinnedEventIds.map(eventId => persistPinnedEventOnTimeline(frameworkRequest, null,
// pinnedEventSavedObjectId
eventId, timelineSavedObjectId)));
exports.savePinnedEvents = savePinnedEvents;
const convertSavedObjectToSavedPinnedEvent = (savedObject, timelineVersion) => (0, _pipeable.pipe)(_pinned_event.PinnedEventSavedObjectRuntimeType.decode(savedObject), (0, _Either.map)(savedPinnedEvent => ({
  pinnedEventId: savedPinnedEvent.id,
  version: savedPinnedEvent.version,
  timelineVersion,
  ...savedPinnedEvent.attributes
})), (0, _Either.fold)(errors => {
  throw new Error((0, _PathReporter.failure)(errors).join('\n'));
}, _function.identity));
exports.convertSavedObjectToSavedPinnedEvent = convertSavedObjectToSavedPinnedEvent;
const pickSavedPinnedEvent = (pinnedEventId, savedPinnedEvent, userInfo) => {
  var _userInfo$username2;
  const dateNow = new Date().valueOf();
  if (pinnedEventId == null) {
    var _userInfo$username;
    savedPinnedEvent.created = dateNow;
    savedPinnedEvent.createdBy = (_userInfo$username = userInfo === null || userInfo === void 0 ? void 0 : userInfo.username) !== null && _userInfo$username !== void 0 ? _userInfo$username : _constants.UNAUTHENTICATED_USER;
  }
  savedPinnedEvent.updated = dateNow;
  savedPinnedEvent.updatedBy = (_userInfo$username2 = userInfo === null || userInfo === void 0 ? void 0 : userInfo.username) !== null && _userInfo$username2 !== void 0 ? _userInfo$username2 : _constants.UNAUTHENTICATED_USER;
  return savedPinnedEvent;
};
exports.pickSavedPinnedEvent = pickSavedPinnedEvent;