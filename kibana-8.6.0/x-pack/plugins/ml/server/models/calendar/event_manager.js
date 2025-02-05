"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventManager = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _calendars = require("../../../common/constants/calendars");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class EventManager {
  constructor(mlClient) {
    (0, _defineProperty2.default)(this, "_mlClient", void 0);
    this._mlClient = mlClient;
  }
  async getCalendarEvents(calendarId) {
    const body = await this._mlClient.getCalendarEvents({
      calendar_id: calendarId
    });
    return body.events;
  }

  // jobId is optional
  async getAllEvents(jobId) {
    const calendarId = _calendars.GLOBAL_CALENDAR;
    const body = await this._mlClient.getCalendarEvents({
      calendar_id: calendarId,
      job_id: jobId
    });
    return body.events;
  }
  async addEvents(calendarId, events) {
    const body = {
      events
    };
    return await this._mlClient.postCalendarEvents({
      calendar_id: calendarId,
      body
    });
  }
  async deleteEvent(calendarId, eventId) {
    return this._mlClient.deleteCalendarEvent({
      calendar_id: calendarId,
      event_id: eventId
    });
  }
  isEqual(ev1, ev2) {
    return ev1.event_id === ev2.event_id && ev1.description === ev2.description && ev1.start_time === ev2.start_time && ev1.end_time === ev2.end_time;
  }
}
exports.EventManager = EventManager;