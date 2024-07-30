"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseStatusRt = void 0;
Object.defineProperty(exports, "CaseStatuses", {
  enumerable: true,
  get: function () {
    return _casesComponents.CaseStatuses;
  }
});
exports.caseStatuses = exports.CasesStatusResponseRt = exports.CasesStatusRequestRt = void 0;
var rt = _interopRequireWildcard(require("io-ts"));
var _casesComponents = require("@kbn/cases-components");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const CaseStatusRt = rt.union([rt.literal(_casesComponents.CaseStatuses.open), rt.literal(_casesComponents.CaseStatuses['in-progress']), rt.literal(_casesComponents.CaseStatuses.closed)]);
exports.CaseStatusRt = CaseStatusRt;
const caseStatuses = Object.values(_casesComponents.CaseStatuses);
exports.caseStatuses = caseStatuses;
const CasesStatusResponseRt = rt.type({
  count_open_cases: rt.number,
  count_in_progress_cases: rt.number,
  count_closed_cases: rt.number
});
exports.CasesStatusResponseRt = CasesStatusResponseRt;
const CasesStatusRequestRt = rt.partial({
  /**
   * A KQL date. If used all cases created after (gte) the from date will be returned
   */
  from: rt.string,
  /**
   * A KQL date. If used all cases created before (lte) the to date will be returned.
   */
  to: rt.string,
  /**
   * The owner of the cases to retrieve the status stats from. If no owner is provided the stats for all cases
   * that the user has access to will be returned.
   */
  owner: rt.union([rt.array(rt.string), rt.string])
});
exports.CasesStatusRequestRt = CasesStatusRequestRt;