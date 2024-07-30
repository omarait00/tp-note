"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSLOResponseSchema = exports.updateSLOParamsSchema = exports.getSLOResponseSchema = exports.getSLOParamsSchema = exports.findSLOResponseSchema = exports.findSLOParamsSchema = exports.deleteSLOParamsSchema = exports.createSLOParamsSchema = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _schema = require("../schema");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createSLOParamsSchema = t.type({
  body: t.type({
    name: t.string,
    description: t.string,
    indicator: _schema.indicatorSchema,
    time_window: _schema.timeWindowSchema,
    budgeting_method: _schema.budgetingMethodSchema,
    objective: _schema.objectiveSchema
  })
});
exports.createSLOParamsSchema = createSLOParamsSchema;
const createSLOResponseSchema = t.type({
  id: t.string
});
const deleteSLOParamsSchema = t.type({
  path: t.type({
    id: t.string
  })
});
exports.deleteSLOParamsSchema = deleteSLOParamsSchema;
const getSLOParamsSchema = t.type({
  path: t.type({
    id: t.string
  })
});
exports.getSLOParamsSchema = getSLOParamsSchema;
const findSLOParamsSchema = t.partial({
  query: t.partial({
    name: t.string,
    page: t.string,
    per_page: t.string
  })
});
exports.findSLOParamsSchema = findSLOParamsSchema;
const getSLOResponseSchema = t.type({
  id: t.string,
  name: t.string,
  description: t.string,
  indicator: _schema.indicatorSchema,
  time_window: _schema.timeWindowSchema,
  budgeting_method: _schema.budgetingMethodSchema,
  objective: _schema.objectiveSchema,
  summary: t.type({
    sli_value: t.number,
    error_budget: _schema.errorBudgetSchema
  }),
  revision: t.number,
  created_at: _schema.dateType,
  updated_at: _schema.dateType
});
exports.getSLOResponseSchema = getSLOResponseSchema;
const updateSLOParamsSchema = t.type({
  path: t.type({
    id: t.string
  }),
  body: t.partial({
    name: t.string,
    description: t.string,
    indicator: _schema.indicatorSchema,
    time_window: _schema.timeWindowSchema,
    budgeting_method: _schema.budgetingMethodSchema,
    objective: _schema.objectiveSchema
  })
});
exports.updateSLOParamsSchema = updateSLOParamsSchema;
const updateSLOResponseSchema = t.type({
  id: t.string,
  name: t.string,
  description: t.string,
  indicator: _schema.indicatorSchema,
  time_window: _schema.timeWindowSchema,
  budgeting_method: _schema.budgetingMethodSchema,
  objective: _schema.objectiveSchema,
  created_at: _schema.dateType,
  updated_at: _schema.dateType
});
exports.updateSLOResponseSchema = updateSLOResponseSchema;
const findSLOResponseSchema = t.type({
  page: t.number,
  per_page: t.number,
  total: t.number,
  results: t.array(t.type({
    id: t.string,
    name: t.string,
    description: t.string,
    indicator: _schema.indicatorSchema,
    time_window: _schema.timeWindowSchema,
    budgeting_method: _schema.budgetingMethodSchema,
    objective: _schema.objectiveSchema,
    revision: t.number,
    created_at: _schema.dateType,
    updated_at: _schema.dateType
  }))
});
exports.findSLOResponseSchema = findSLOResponseSchema;