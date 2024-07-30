"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkEditInternalRulesRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _lib = require("../lib");
var _lib2 = require("./lib");
var _types = require("../types");
var _snooze_rule = require("./snooze_rule");
var _unsnooze_rule = require("./unsnooze_rule");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ruleActionSchema = _configSchema.schema.object({
  group: _configSchema.schema.string(),
  id: _configSchema.schema.string(),
  params: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  })
});
const operationsSchema = _configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.object({
  operation: _configSchema.schema.oneOf([_configSchema.schema.literal('add'), _configSchema.schema.literal('delete'), _configSchema.schema.literal('set')]),
  field: _configSchema.schema.literal('tags'),
  value: _configSchema.schema.arrayOf(_configSchema.schema.string())
}), _configSchema.schema.object({
  operation: _configSchema.schema.oneOf([_configSchema.schema.literal('add'), _configSchema.schema.literal('set')]),
  field: _configSchema.schema.literal('actions'),
  value: _configSchema.schema.arrayOf(ruleActionSchema)
}), _configSchema.schema.object({
  operation: _configSchema.schema.literal('set'),
  field: _configSchema.schema.literal('schedule'),
  value: _configSchema.schema.object({
    interval: _configSchema.schema.string({
      validate: _lib.validateDurationSchema
    })
  })
}), _configSchema.schema.object({
  operation: _configSchema.schema.literal('set'),
  field: _configSchema.schema.literal('throttle'),
  value: _configSchema.schema.nullable(_configSchema.schema.string())
}), _configSchema.schema.object({
  operation: _configSchema.schema.literal('set'),
  field: _configSchema.schema.literal('notifyWhen'),
  value: _configSchema.schema.nullable(_configSchema.schema.oneOf([_configSchema.schema.literal('onActionGroupChange'), _configSchema.schema.literal('onActiveAlert'), _configSchema.schema.literal('onThrottleInterval')]))
}), _configSchema.schema.object({
  operation: _configSchema.schema.oneOf([_configSchema.schema.literal('set')]),
  field: _configSchema.schema.literal('snoozeSchedule'),
  value: _snooze_rule.snoozeScheduleSchema
}), _configSchema.schema.object({
  operation: _configSchema.schema.oneOf([_configSchema.schema.literal('delete')]),
  field: _configSchema.schema.literal('snoozeSchedule'),
  value: _configSchema.schema.maybe(_unsnooze_rule.scheduleIdsSchema)
}), _configSchema.schema.object({
  operation: _configSchema.schema.literal('set'),
  field: _configSchema.schema.literal('apiKey')
})]), {
  minSize: 1
});
const bodySchema = _configSchema.schema.object({
  filter: _configSchema.schema.maybe(_configSchema.schema.string()),
  ids: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string(), {
    minSize: 1
  })),
  operations: operationsSchema
});
const buildBulkEditRulesRoute = ({
  licenseState,
  path,
  router
}) => {
  router.post({
    path,
    validate: {
      body: bodySchema
    }
  }, (0, _lib2.handleDisabledApiKeysError)(router.handleLegacyErrors((0, _lib2.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = (await context.alerting).getRulesClient();
    const {
      filter,
      operations,
      ids
    } = req.body;
    try {
      const bulkEditResults = await rulesClient.bulkEdit({
        filter,
        ids: ids,
        operations
      });
      return res.ok({
        body: {
          ...bulkEditResults,
          rules: bulkEditResults.rules.map(_lib2.rewriteRule)
        }
      });
    } catch (e) {
      if (e instanceof _lib.RuleTypeDisabledError) {
        return e.sendResponse(res);
      }
      throw e;
    }
  }))));
};
const bulkEditInternalRulesRoute = (router, licenseState) => buildBulkEditRulesRoute({
  licenseState,
  path: `${_types.INTERNAL_BASE_ALERTING_API_PATH}/rules/_bulk_edit`,
  router
});
exports.bulkEditInternalRulesRoute = bulkEditInternalRulesRoute;