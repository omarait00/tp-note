"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildExecutor = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isFunction = v => {
  return typeof v === 'function';
};
const getConnectorErrorMsg = (actionId, connector) => `Connector id: ${actionId}. Connector name: ${connector.name}. Connector type: ${connector.id}`;
const buildExecutor = ({
  configurationUtilities,
  connector,
  logger
}) => {
  return async ({
    actionId,
    params,
    config,
    secrets,
    services
  }) => {
    const subAction = params.subAction;
    const subActionParams = params.subActionParams;
    const service = new connector.Service({
      connector: {
        id: actionId,
        type: connector.id
      },
      config,
      secrets,
      configurationUtilities,
      logger,
      services
    });
    const subActions = service.getSubActions();
    if (subActions.size === 0) {
      throw new Error('You should register at least one subAction for your connector type');
    }
    const action = subActions.get(subAction);
    if (!action) {
      throw new Error(`Sub action "${subAction}" is not registered. ${getConnectorErrorMsg(actionId, connector)}`);
    }
    const method = action.method;
    if (!service[method]) {
      throw new Error(`Method "${method}" does not exists in service. Sub action: "${subAction}". ${getConnectorErrorMsg(actionId, connector)}`);
    }
    const func = service[method];
    if (!isFunction(func)) {
      throw new Error(`Method "${method}" must be a function. ${getConnectorErrorMsg(actionId, connector)}`);
    }
    if (action.schema) {
      try {
        action.schema.validate(subActionParams);
      } catch (reqValidationError) {
        throw new Error(`Request validation failed (${reqValidationError})`);
      }
    }
    const data = await func.call(service, subActionParams);
    return {
      status: 'ok',
      data: data !== null && data !== void 0 ? data : {},
      actionId
    };
  };
};
exports.buildExecutor = buildExecutor;