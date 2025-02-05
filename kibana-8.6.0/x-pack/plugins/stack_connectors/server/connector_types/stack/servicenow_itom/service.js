"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExternalService = void 0;
var _axios_utils = require("../../../../../actions/server/lib/axios_utils");
var _service = require("../../lib/servicenow/service");
var _utils = require("../../lib/servicenow/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAddEventURL = url => `${url}/api/global/em/jsonv2`;
const createExternalService = ({
  credentials,
  logger,
  configurationUtilities,
  serviceConfig,
  axiosInstance
}) => {
  const snService = (0, _service.createExternalService)({
    credentials,
    logger,
    configurationUtilities,
    serviceConfig,
    axiosInstance
  });
  const addEvent = async params => {
    try {
      const res = await (0, _axios_utils.request)({
        axios: axiosInstance,
        url: getAddEventURL(snService.getUrl()),
        logger,
        method: 'post',
        data: {
          records: [params]
        },
        configurationUtilities
      });
      snService.checkInstance(res);
    } catch (error) {
      throw (0, _utils.createServiceError)(error, `Unable to add event`);
    }
  };
  return {
    addEvent,
    getChoices: snService.getChoices
  };
};
exports.createExternalService = createExternalService;