"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndexRoute = exports.createDetectionIndex = void 0;
var _lodash = require("lodash");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../common/constants");
var _utils = require("../utils");
var _get_signals_template = require("./get_signals_template");
var _migration_cleanup = require("../../migrations/migration_cleanup");
var _signals_policy = _interopRequireDefault(require("./signals_policy.json"));
var _check_template_version = require("./check_template_version");
var _get_index_version = require("./get_index_version");
var _helpers = require("../../migrations/helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createIndexRoute = router => {
  router.post({
    path: _constants.DETECTION_ENGINE_INDEX_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, _, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const securitySolution = await context.securitySolution;
      const siemClient = securitySolution === null || securitySolution === void 0 ? void 0 : securitySolution.getAppClient();
      if (!siemClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }
      await createDetectionIndex(securitySolution);
      return response.ok({
        body: {
          acknowledged: true
        }
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.createIndexRoute = createIndexRoute;
const createDetectionIndex = async context => {
  const esClient = context.core.elasticsearch.client.asCurrentUser;
  const siemClient = context.getAppClient();
  const spaceId = context.getSpaceId();
  const index = siemClient.getSignalsIndex();
  const indexExists = await (0, _securitysolutionEsUtils.getBootstrapIndexExists)(context.core.elasticsearch.client.asInternalUser, index);

  // We don't want to create new .siem-signals indices - only create/update
  // resources if there are existing indices
  if (!indexExists) {
    return;
  }
  await (0, _migration_cleanup.ensureMigrationCleanupPolicy)({
    alias: index,
    esClient
  });
  const policyExists = await (0, _securitysolutionEsUtils.getPolicyExists)(esClient, index);
  if (!policyExists) {
    await (0, _securitysolutionEsUtils.setPolicy)(esClient, index, _signals_policy.default);
  }
  const ruleDataService = context.getRuleDataService();
  const aadIndexAliasName = ruleDataService.getResourceName(`security.alerts-${spaceId}`);
  if (await (0, _check_template_version.templateNeedsUpdate)({
    alias: index,
    esClient
  })) {
    await esClient.indices.putIndexTemplate({
      name: index,
      body: (0, _get_signals_template.getSignalsTemplate)(index, aadIndexAliasName)
    });
  }
  // Check if the old legacy siem signals template exists and remove it
  try {
    await esClient.indices.deleteTemplate({
      name: index
    });
  } catch (err) {
    if (err.statusCode !== 404) {
      throw err;
    }
  }
  if (indexExists) {
    await addFieldAliasesToIndices({
      esClient,
      index
    });
    // The internal user is used here because Elasticsearch requires the PUT alias requestor to have 'manage' permissions
    // for BOTH the index AND alias name. However, through 7.14 admins only needed permissions for .siem-signals (the index)
    // and not .alerts-security.alerts (the alias). From the security solution perspective, all .siem-signals-<space id>-*
    // indices should have an alias to .alerts-security.alerts-<space id> so it's safe to add those aliases as the internal user.
    await addIndexAliases({
      esClient: context.core.elasticsearch.client.asInternalUser,
      index,
      aadIndexAliasName
    });
    const indexVersion = await (0, _get_index_version.getIndexVersion)(esClient, index);
    if ((0, _helpers.isOutdated)({
      current: indexVersion,
      target: _get_signals_template.SIGNALS_TEMPLATE_VERSION
    })) {
      await esClient.indices.rollover({
        alias: index
      });
    }
  } else {
    await (0, _securitysolutionEsUtils.createBootstrapIndex)(esClient, index);
  }
};

// This function can be expensive if there are lots of existing .siem-signals indices
// because any new backwards compatibility mappings need to be applied to all of them
// while also preserving the original 'version' of the mapping. To do it somewhat efficiently,
// we first group the indices by version and exclude any that already have up-to-date
// aliases. Then we start updating the mappings sequentially in chunks.
exports.createDetectionIndex = createDetectionIndex;
const addFieldAliasesToIndices = async ({
  esClient,
  index
}) => {
  const indexMappings = await esClient.indices.get({
    index
  });
  const indicesByVersion = {};
  const versions = new Set();
  for (const [indexName, mapping] of Object.entries(indexMappings)) {
    var _get, _mapping$mappings, _get2, _mapping$mappings2;
    // The `version` tells us which set of backwards compatibility mappings to apply: `version` never changes
    // and represents what was actually shipped. `aliases_version` tells us if the most up to date backwards
    // compatibility mappings have already been applied to the index. `aliases_version` DOES get updated when we apply
    // new compatibility mappings like runtime fields and aliases.
    const version = (_get = (0, _lodash.get)((_mapping$mappings = mapping.mappings) === null || _mapping$mappings === void 0 ? void 0 : _mapping$mappings._meta, 'version')) !== null && _get !== void 0 ? _get : 0;
    const aliasesVersion = (_get2 = (0, _lodash.get)((_mapping$mappings2 = mapping.mappings) === null || _mapping$mappings2 === void 0 ? void 0 : _mapping$mappings2._meta, _get_signals_template.ALIAS_VERSION_FIELD)) !== null && _get2 !== void 0 ? _get2 : 0;
    // Only attempt to add backwards compatibility mappings to indices whose names start with the alias
    // This limits us to legacy .siem-signals indices, since alerts as data indices use a different naming
    // scheme (but have the same alias, so will also be returned by the "get" request)
    if (indexName.startsWith(`${index}-`) && (0, _helpers.isOutdated)({
      current: aliasesVersion,
      target: _get_signals_template.SIGNALS_FIELD_ALIASES_VERSION
    })) {
      indicesByVersion[version] = indicesByVersion[version] ? [...indicesByVersion[version], indexName] : [indexName];
      versions.add(version);
    }
  }
  for (const version of versions) {
    const body = (0, _get_signals_template.createBackwardsCompatibilityMapping)(version);
    const indexNameChunks = (0, _lodash.chunk)(indicesByVersion[version], 20);
    for (const indexNameChunk of indexNameChunks) {
      await esClient.indices.putMapping({
        index: indexNameChunk,
        body,
        allow_no_indices: true
      });
    }
  }
};
const addIndexAliases = async ({
  esClient,
  index,
  aadIndexAliasName
}) => {
  const indices = await esClient.indices.getAlias({
    index: `${index}-*`,
    name: index
  });
  const aliasActions = {
    actions: Object.keys(indices).map(concreteIndexName => {
      return {
        add: {
          index: concreteIndexName,
          alias: aadIndexAliasName,
          is_write_index: false
        }
      };
    })
  };
  await esClient.indices.updateAliases({
    body: aliasActions
  });
};