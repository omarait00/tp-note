"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notificationsMock = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const emailServiceMock = {
  sendPlainTextEmail: jest.fn()
};
const createEmailServiceMock = () => {
  return emailServiceMock;
};
const startMock = {
  isEmailServiceAvailable: jest.fn(),
  getEmailService: jest.fn(createEmailServiceMock)
};
const createStartMock = () => {
  return startMock;
};
const notificationsPluginMock = {
  setup: jest.fn(),
  start: jest.fn(createStartMock),
  stop: jest.fn()
};
const createNotificationsPluginMock = () => {
  return notificationsPluginMock;
};
const notificationsMock = {
  createNotificationsPlugin: createNotificationsPluginMock,
  createEmailService: createEmailServiceMock,
  createStart: createStartMock,
  clear: () => {
    emailServiceMock.sendPlainTextEmail.mockClear();
    startMock.getEmailService.mockClear();
    startMock.isEmailServiceAvailable.mockClear();
    notificationsPluginMock.setup.mockClear();
    notificationsPluginMock.start.mockClear();
    notificationsPluginMock.stop.mockClear();
  }
};
exports.notificationsMock = notificationsMock;