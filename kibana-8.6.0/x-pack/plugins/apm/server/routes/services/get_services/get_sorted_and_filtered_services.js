"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceNamesFromTermsEnum = getServiceNamesFromTermsEnum;
exports.getSortedAndFilteredServices = getSortedAndFilteredServices;
var _common = require("../../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _environment_filter_values = require("../../../../common/environment_filter_values");
var _join_by_key = require("../../../../common/utils/join_by_key");
var _get_health_statuses = require("./get_health_statuses");
var _lookup_services = require("../../service_groups/lookup_services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServiceNamesFromTermsEnum({
  apmEventClient,
  environment,
  maxNumberOfServices
}) {
  if (environment !== _environment_filter_values.ENVIRONMENT_ALL.value) {
    return [];
  }
  const response = await apmEventClient.termsEnum('get_services_from_terms_enum', {
    apm: {
      events: [_common.ProcessorEvent.transaction, _common.ProcessorEvent.span, _common.ProcessorEvent.metric, _common.ProcessorEvent.error]
    },
    body: {
      size: maxNumberOfServices,
      field: _elasticsearch_fieldnames.SERVICE_NAME
    }
  });
  return response.terms;
}
async function getSortedAndFilteredServices({
  mlClient,
  apmEventClient,
  start,
  end,
  environment,
  logger,
  serviceGroup,
  maxNumberOfServices
}) {
  const [servicesWithHealthStatuses, selectedServices] = await Promise.all([(0, _get_health_statuses.getHealthStatuses)({
    mlClient,
    start,
    end,
    environment
  }).catch(error => {
    logger.error(error);
    return [];
  }), serviceGroup ? getServiceNamesFromServiceGroup({
    apmEventClient,
    start,
    end,
    maxNumberOfServices,
    serviceGroup
  }) : getServiceNamesFromTermsEnum({
    apmEventClient,
    environment,
    maxNumberOfServices
  })]);
  const services = (0, _join_by_key.joinByKey)([...servicesWithHealthStatuses, ...selectedServices.map(serviceName => ({
    serviceName
  }))], 'serviceName');
  return services;
}
async function getServiceNamesFromServiceGroup({
  apmEventClient,
  start,
  end,
  maxNumberOfServices,
  serviceGroup: {
    kuery
  }
}) {
  const services = await (0, _lookup_services.lookupServices)({
    apmEventClient,
    kuery,
    start,
    end,
    maxNumberOfServices
  });
  return services.map(({
    serviceName
  }) => serviceName);
}