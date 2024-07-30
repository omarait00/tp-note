"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPutPayloadSchema = getPutPayloadSchema;
exports.transformPutPayloadToElasticsearchRole = void 0;
var _configSchema = require("@kbn/config-schema");
var _lib = require("../../../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const transformPutPayloadToElasticsearchRole = (rolePayload, application, allExistingApplications = []) => {
  const {
    elasticsearch = {
      cluster: undefined,
      indices: undefined,
      run_as: undefined
    },
    kibana = []
  } = rolePayload;
  const otherApplications = allExistingApplications.filter(roleApplication => roleApplication.application !== application);
  return {
    metadata: rolePayload.metadata,
    cluster: elasticsearch.cluster || [],
    indices: elasticsearch.indices || [],
    run_as: elasticsearch.run_as || [],
    applications: [...(0, _lib.transformPrivilegesToElasticsearchPrivileges)(application, kibana), ...otherApplications]
  };
};
exports.transformPutPayloadToElasticsearchRole = transformPutPayloadToElasticsearchRole;
function getPutPayloadSchema(getBasePrivilegeNames) {
  return _configSchema.schema.object({
    /**
     * An optional meta-data dictionary. Within the metadata, keys that begin with _ are reserved
     * for system usage.
     */
    metadata: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())),
    /**
     * Elasticsearch specific portion of the role definition.
     */
    elasticsearch: _lib.elasticsearchRoleSchema,
    /**
     * Kibana specific portion of the role definition.
     */
    kibana: _configSchema.schema.maybe((0, _lib.getKibanaRoleSchema)(getBasePrivilegeNames))
  });
}