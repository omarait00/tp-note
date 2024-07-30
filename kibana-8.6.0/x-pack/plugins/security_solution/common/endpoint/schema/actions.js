"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResponseActionBodySchema = exports.NoParametersRequestSchema = exports.KillOrSuspendProcessRequestSchema = exports.EndpointActionLogRequestSchema = exports.EndpointActionListRequestSchema = exports.EndpointActionGetFileSchema = exports.EndpointActionFileInfoSchema = exports.EndpointActionFileDownloadSchema = exports.ActionStatusRequestSchema = exports.ActionDetailsRequestSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../constants");
var _constants2 = require("../service/response_actions/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const BaseActionRequestSchema = {
  /** A list of endpoint IDs whose hosts will be isolated (Fleet Agent IDs will be retrieved for these) */
  endpoint_ids: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    minSize: 1
  }),
  /** If defined, any case associated with the given IDs will be updated */
  alert_ids: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  /** Case IDs to be updated */
  case_ids: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  comment: _configSchema.schema.maybe(_configSchema.schema.string()),
  parameters: _configSchema.schema.maybe(_configSchema.schema.object({}))
};
const NoParametersRequestSchema = {
  body: _configSchema.schema.object({
    ...BaseActionRequestSchema
  })
};
exports.NoParametersRequestSchema = NoParametersRequestSchema;
const KillOrSuspendProcessRequestSchema = {
  body: _configSchema.schema.object({
    ...BaseActionRequestSchema,
    parameters: _configSchema.schema.oneOf([_configSchema.schema.object({
      pid: _configSchema.schema.number({
        min: 1
      })
    }), _configSchema.schema.object({
      entity_id: _configSchema.schema.string({
        minLength: 1
      })
    })])
  })
};
exports.KillOrSuspendProcessRequestSchema = KillOrSuspendProcessRequestSchema;
const ResponseActionBodySchema = _configSchema.schema.oneOf([NoParametersRequestSchema.body, KillOrSuspendProcessRequestSchema.body]);
exports.ResponseActionBodySchema = ResponseActionBodySchema;
const EndpointActionLogRequestSchema = {
  query: _configSchema.schema.object({
    page: _configSchema.schema.number({
      defaultValue: 1,
      min: 1
    }),
    page_size: _configSchema.schema.number({
      defaultValue: 10,
      min: 1,
      max: 100
    }),
    start_date: _configSchema.schema.string(),
    end_date: _configSchema.schema.string()
  }),
  params: _configSchema.schema.object({
    agent_id: _configSchema.schema.string()
  })
};
exports.EndpointActionLogRequestSchema = EndpointActionLogRequestSchema;
const ActionStatusRequestSchema = {
  query: _configSchema.schema.object({
    agent_ids: _configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string({
      minLength: 1
    }), {
      minSize: 1,
      maxSize: 50
    }), _configSchema.schema.string({
      minLength: 1
    })])
  })
};
exports.ActionStatusRequestSchema = ActionStatusRequestSchema;
const ActionDetailsRequestSchema = {
  params: _configSchema.schema.object({
    action_id: _configSchema.schema.string()
  })
};

// TODO: fix the odd TS error
exports.ActionDetailsRequestSchema = ActionDetailsRequestSchema;
const commandsSchema = _configSchema.schema.oneOf(
// @ts-expect-error TS2769: No overload matches this call
_constants2.RESPONSE_ACTION_API_COMMANDS_NAMES.map(command => _configSchema.schema.literal(command)));

// TODO: fix the odd TS error
// @ts-expect-error TS2769: No overload matches this call
const statusesSchema = _configSchema.schema.oneOf(_constants2.RESPONSE_ACTION_STATUS.map(status => _configSchema.schema.literal(status)));
const EndpointActionListRequestSchema = {
  query: _configSchema.schema.object({
    agentIds: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string({
      minLength: 1
    }), {
      minSize: 1
    }), _configSchema.schema.string({
      minLength: 1
    })])),
    commands: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.arrayOf(commandsSchema, {
      minSize: 1
    }), commandsSchema])),
    page: _configSchema.schema.maybe(_configSchema.schema.number({
      defaultValue: 1,
      min: 1
    })),
    pageSize: _configSchema.schema.maybe(_configSchema.schema.number({
      defaultValue: _constants.ENDPOINT_DEFAULT_PAGE_SIZE,
      min: 1,
      max: 10000
    })),
    startDate: _configSchema.schema.maybe(_configSchema.schema.string()),
    // date ISO strings or moment date
    endDate: _configSchema.schema.maybe(_configSchema.schema.string()),
    // date ISO strings or moment date
    statuses: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.arrayOf(statusesSchema, {
      minSize: 1,
      maxSize: 3
    }), statusesSchema])),
    userIds: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string({
      minLength: 1
    }), {
      minSize: 1
    }), _configSchema.schema.string({
      minLength: 1
    })]))
  })
};
exports.EndpointActionListRequestSchema = EndpointActionListRequestSchema;
const EndpointActionGetFileSchema = {
  body: _configSchema.schema.object({
    ...BaseActionRequestSchema,
    parameters: _configSchema.schema.object({
      path: _configSchema.schema.string({
        minLength: 1
      })
    })
  })
};
exports.EndpointActionGetFileSchema = EndpointActionGetFileSchema;
/** Schema that validates the file download API */
const EndpointActionFileDownloadSchema = {
  params: _configSchema.schema.object({
    action_id: _configSchema.schema.string({
      minLength: 1
    }),
    agent_id: _configSchema.schema.string({
      minLength: 1
    })
  })
};
exports.EndpointActionFileDownloadSchema = EndpointActionFileDownloadSchema;
/** Schema that validates the file info API */
const EndpointActionFileInfoSchema = {
  params: _configSchema.schema.object({
    action_id: _configSchema.schema.string({
      minLength: 1
    }),
    agent_id: _configSchema.schema.string({
      minLength: 1
    })
  })
};
exports.EndpointActionFileInfoSchema = EndpointActionFileInfoSchema;