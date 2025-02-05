"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPolicyDataForUpdate = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given a Policy Data (package policy) object, return back a new object with only the field
 * needed for an Update/Create API action
 * @param policy
 */
const getPolicyDataForUpdate = policy => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const {
    id,
    revision,
    created_by,
    created_at,
    updated_by,
    updated_at,
    ...newPolicy
  } = policy;
  // cast to `NewPolicyData` (mutable) since we cloned the entire object
  const policyDataForUpdate = (0, _lodash.cloneDeep)(newPolicy);
  const endpointPolicy = policyDataForUpdate.inputs[0].config.policy.value;

  // trim custom malware notification string
  [endpointPolicy.windows.popup.malware, endpointPolicy.mac.popup.malware].forEach(objWithMessage => objWithMessage.message.trim());
  return policyDataForUpdate;
};
exports.getPolicyDataForUpdate = getPolicyDataForUpdate;