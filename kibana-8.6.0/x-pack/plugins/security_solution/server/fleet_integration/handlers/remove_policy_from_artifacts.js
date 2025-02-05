"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removePolicyFromArtifacts = void 0;
var _pMap = _interopRequireDefault(require("p-map"));
var _constants = require("../../../common/endpoint/service/artifacts/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Removes policy from artifacts
 */
const removePolicyFromArtifacts = async (exceptionsClient, policy) => {
  let page = 1;
  const findArtifactsByPolicy = currentPage => {
    return exceptionsClient.findExceptionListsItem({
      listId: _constants.ALL_ENDPOINT_ARTIFACT_LIST_IDS,
      filter: _constants.ALL_ENDPOINT_ARTIFACT_LIST_IDS.map(() => `exception-list-agnostic.attributes.tags:"policy:${policy.id}"`),
      namespaceType: _constants.ALL_ENDPOINT_ARTIFACT_LIST_IDS.map(() => 'agnostic'),
      page: currentPage,
      perPage: 50,
      sortField: undefined,
      sortOrder: undefined
    });
  };
  let findResponse = await findArtifactsByPolicy(page);
  if (!findResponse) {
    return;
  }
  const artifacts = findResponse.data;
  while (findResponse && (artifacts.length < findResponse.total || findResponse.data.length)) {
    page += 1;
    findResponse = await findArtifactsByPolicy(page);
    if (findResponse) {
      artifacts.push(...findResponse.data);
    }
  }
  await (0, _pMap.default)(artifacts, artifact => exceptionsClient.updateExceptionListItem({
    ...artifact,
    itemId: artifact.item_id,
    namespaceType: artifact.namespace_type,
    osTypes: artifact.os_types,
    tags: artifact.tags.filter(currentPolicy => currentPolicy !== `policy:${policy.id}`)
  }), {
    /** Number of concurrent executions till the end of the artifacts array */
    concurrency: 5,
    /** When set to false, instead of stopping when a promise rejects, it will wait for all the promises to
     * settle and then reject with an aggregated error containing all the errors from the rejected promises. */
    stopOnError: false
  });
};
exports.removePolicyFromArtifacts = removePolicyFromArtifacts;