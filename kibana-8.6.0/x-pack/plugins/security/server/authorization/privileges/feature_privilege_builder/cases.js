"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeaturePrivilegeCasesBuilder = void 0;
var _lodash = require("lodash");
var _feature_privilege_builder = require("./feature_privilege_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// if you add a value here you'll likely also need to make changes here:
// x-pack/plugins/cases/server/authorization/index.ts

const pushOperations = ['pushCase'];
const createOperations = ['createCase', 'createComment', 'createConfiguration'];
const readOperations = ['getCase', 'getComment', 'getTags', 'getReporters', 'getUserActions', 'findConfigurations'];
const updateOperations = ['updateCase', 'updateComment', 'updateConfiguration'];
const deleteOperations = ['deleteCase', 'deleteComment'];
const allOperations = [...pushOperations, ...createOperations, ...readOperations, ...updateOperations, ...deleteOperations];
class FeaturePrivilegeCasesBuilder extends _feature_privilege_builder.BaseFeaturePrivilegeBuilder {
  getActions(privilegeDefinition, feature) {
    var _privilegeDefinition$, _privilegeDefinition$2, _privilegeDefinition$3, _privilegeDefinition$4, _privilegeDefinition$5, _privilegeDefinition$6;
    const getCasesPrivilege = (operations, owners = []) => {
      return owners.flatMap(owner => operations.map(operation => this.actions.cases.get(owner, operation)));
    };
    return (0, _lodash.uniq)([...getCasesPrivilege(allOperations, (_privilegeDefinition$ = privilegeDefinition.cases) === null || _privilegeDefinition$ === void 0 ? void 0 : _privilegeDefinition$.all), ...getCasesPrivilege(pushOperations, (_privilegeDefinition$2 = privilegeDefinition.cases) === null || _privilegeDefinition$2 === void 0 ? void 0 : _privilegeDefinition$2.push), ...getCasesPrivilege(createOperations, (_privilegeDefinition$3 = privilegeDefinition.cases) === null || _privilegeDefinition$3 === void 0 ? void 0 : _privilegeDefinition$3.create), ...getCasesPrivilege(readOperations, (_privilegeDefinition$4 = privilegeDefinition.cases) === null || _privilegeDefinition$4 === void 0 ? void 0 : _privilegeDefinition$4.read), ...getCasesPrivilege(updateOperations, (_privilegeDefinition$5 = privilegeDefinition.cases) === null || _privilegeDefinition$5 === void 0 ? void 0 : _privilegeDefinition$5.update), ...getCasesPrivilege(deleteOperations, (_privilegeDefinition$6 = privilegeDefinition.cases) === null || _privilegeDefinition$6 === void 0 ? void 0 : _privilegeDefinition$6.delete)]);
  }
}
exports.FeaturePrivilegeCasesBuilder = FeaturePrivilegeCasesBuilder;