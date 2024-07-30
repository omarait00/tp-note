"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexLifecyclePhaseRt = exports.indexLifeCyclePhaseToDataTier = exports.IndexLifecyclePhaseSelectOption = void 0;
var t = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let IndexLifecyclePhaseSelectOption;
exports.IndexLifecyclePhaseSelectOption = IndexLifecyclePhaseSelectOption;
(function (IndexLifecyclePhaseSelectOption) {
  IndexLifecyclePhaseSelectOption["All"] = "all";
  IndexLifecyclePhaseSelectOption["Hot"] = "hot";
  IndexLifecyclePhaseSelectOption["Warm"] = "warm";
  IndexLifecyclePhaseSelectOption["Cold"] = "cold";
  IndexLifecyclePhaseSelectOption["Frozen"] = "frozen";
})(IndexLifecyclePhaseSelectOption || (exports.IndexLifecyclePhaseSelectOption = IndexLifecyclePhaseSelectOption = {}));
const indexLifeCyclePhaseToDataTier = {
  [IndexLifecyclePhaseSelectOption.Hot]: 'data_hot',
  [IndexLifecyclePhaseSelectOption.Warm]: 'data_warm',
  [IndexLifecyclePhaseSelectOption.Cold]: 'data_cold',
  [IndexLifecyclePhaseSelectOption.Frozen]: 'data_frozen'
};
exports.indexLifeCyclePhaseToDataTier = indexLifeCyclePhaseToDataTier;
const indexLifecyclePhaseRt = t.type({
  indexLifecyclePhase: t.union([t.literal(IndexLifecyclePhaseSelectOption.All), t.literal(IndexLifecyclePhaseSelectOption.Hot), t.literal(IndexLifecyclePhaseSelectOption.Warm), t.literal(IndexLifecyclePhaseSelectOption.Cold), t.literal(IndexLifecyclePhaseSelectOption.Frozen)])
});
exports.indexLifecyclePhaseRt = indexLifecyclePhaseRt;