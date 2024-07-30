"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlertIconTooltipContent = void 0;
var _process_tree = require("../types/process_tree");
var i18n = _interopRequireWildcard(require("../translations"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAlertIconTooltipContent = processEventAlertCategory => {
  let tooltipContent = '';
  switch (processEventAlertCategory) {
    case _process_tree.ProcessEventAlertCategory.file:
      tooltipContent = i18n.ALERT_TYPE_TOOLTIP_FILE;
      break;
    case _process_tree.ProcessEventAlertCategory.network:
      tooltipContent = i18n.ALERT_TYPE_TOOLTIP_NETWORK;
      break;
    default:
      tooltipContent = i18n.ALERT_TYPE_TOOLTIP_PROCESS;
  }
  return tooltipContent;
};
exports.getAlertIconTooltipContent = getAlertIconTooltipContent;