"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPrivilegesFactory = checkPrivilegesFactory;
var _lodash = require("lodash");
var _constants = require("../../common/constants");
var _resource_serializer = require("./resource_serializer");
var _validate_es_response = require("./validate_es_response");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function checkPrivilegesFactory(actions, getClusterClient, applicationName) {
  const hasIncompatibleVersion = applicationPrivilegesResponse => {
    return Object.values(applicationPrivilegesResponse).some(resource => !resource[actions.version] && resource[actions.login]);
  };
  const createApplicationPrivilegesCheck = (resources, kibanaPrivileges, {
    requireLoginAction
  }) => {
    const normalizedKibanaPrivileges = Array.isArray(kibanaPrivileges) ? kibanaPrivileges : [kibanaPrivileges];
    return {
      application: applicationName,
      resources,
      privileges: (0, _lodash.uniq)([actions.version, ...(requireLoginAction ? [actions.login] : []), ...normalizedKibanaPrivileges])
    };
  };
  function checkUserProfilesPrivileges(userProfileUids) {
    const checkPrivilegesAtResources = async (resources, privileges) => {
      const clusterClient = await getClusterClient();
      const applicationPrivilegesCheck = createApplicationPrivilegesCheck(resources, privileges.kibana, {
        requireLoginAction: true
      });
      const response = await clusterClient.asInternalUser.transport.request({
        method: 'POST',
        path: '_security/profile/_has_privileges',
        body: {
          uids: [...userProfileUids],
          privileges: {
            application: [applicationPrivilegesCheck]
          }
        }
      });
      return {
        hasPrivilegeUids: response.has_privilege_uids,
        ...(response.errors && {
          errors: response.errors
        })
      };
    };
    return {
      async atSpace(spaceId, privileges) {
        const spaceResource = _resource_serializer.ResourceSerializer.serializeSpaceResource(spaceId);
        return await checkPrivilegesAtResources([spaceResource], privileges);
      }
    };
  }
  function checkPrivilegesWithRequest(request) {
    const checkPrivilegesAtResources = async (resources, privileges, {
      requireLoginAction = true
    } = {}) => {
      var _privileges$kibana, _privileges$elasticse, _privileges$elasticse2, _privileges$elasticse3, _hasPrivilegesRespons, _hasPrivilegesRespons2;
      const applicationPrivilegesCheck = createApplicationPrivilegesCheck(resources, (_privileges$kibana = privileges.kibana) !== null && _privileges$kibana !== void 0 ? _privileges$kibana : [], {
        requireLoginAction
      });
      const clusterClient = await getClusterClient();
      const body = await clusterClient.asScoped(request).asCurrentUser.security.hasPrivileges({
        body: {
          cluster: (_privileges$elasticse = privileges.elasticsearch) === null || _privileges$elasticse === void 0 ? void 0 : _privileges$elasticse.cluster,
          index: Object.entries((_privileges$elasticse2 = (_privileges$elasticse3 = privileges.elasticsearch) === null || _privileges$elasticse3 === void 0 ? void 0 : _privileges$elasticse3.index) !== null && _privileges$elasticse2 !== void 0 ? _privileges$elasticse2 : {}).map(([name, indexPrivileges]) => ({
            names: [name],
            privileges: indexPrivileges
          })),
          application: [applicationPrivilegesCheck]
        }
      });
      const hasPrivilegesResponse = body;
      (0, _validate_es_response.validateEsPrivilegeResponse)(hasPrivilegesResponse, applicationName, applicationPrivilegesCheck.privileges, resources);
      const applicationPrivilegesResponse = hasPrivilegesResponse.application[applicationName];
      const clusterPrivilegesResponse = (_hasPrivilegesRespons = hasPrivilegesResponse.cluster) !== null && _hasPrivilegesRespons !== void 0 ? _hasPrivilegesRespons : {};
      const clusterPrivileges = Object.entries(clusterPrivilegesResponse).map(([privilege, authorized]) => ({
        privilege,
        authorized
      }));
      const indexPrivileges = Object.entries((_hasPrivilegesRespons2 = hasPrivilegesResponse.index) !== null && _hasPrivilegesRespons2 !== void 0 ? _hasPrivilegesRespons2 : {}).reduce((acc, [index, indexResponse]) => {
        return {
          ...acc,
          [index]: Object.entries(indexResponse).map(([privilege, authorized]) => ({
            privilege,
            authorized
          }))
        };
      }, {});
      if (hasIncompatibleVersion(applicationPrivilegesResponse)) {
        throw new Error('Multiple versions of Kibana are running against the same Elasticsearch cluster, unable to authorize user.');
      }

      // we need to filter out the non requested privileges from the response
      const resourcePrivileges = (0, _lodash.transform)(applicationPrivilegesResponse, (result, value, key) => {
        var _privileges$kibana2;
        result[key] = (0, _lodash.pick)(value, (_privileges$kibana2 = privileges.kibana) !== null && _privileges$kibana2 !== void 0 ? _privileges$kibana2 : []);
      });
      const privilegeArray = Object.entries(resourcePrivileges).map(([key, val]) => {
        // we need to turn the resource responses back into the space ids
        const resource = key !== _constants.GLOBAL_RESOURCE ? _resource_serializer.ResourceSerializer.deserializeSpaceResource(key) : undefined;
        return Object.entries(val).map(([privilege, authorized]) => ({
          resource,
          privilege,
          authorized
        }));
      }).flat();
      return {
        hasAllRequested: hasPrivilegesResponse.has_all_requested,
        username: hasPrivilegesResponse.username,
        privileges: {
          kibana: privilegeArray,
          elasticsearch: {
            cluster: clusterPrivileges,
            index: indexPrivileges
          }
        }
      };
    };
    return {
      async atSpace(spaceId, privileges, options) {
        const spaceResource = _resource_serializer.ResourceSerializer.serializeSpaceResource(spaceId);
        return await checkPrivilegesAtResources([spaceResource], privileges, options);
      },
      async atSpaces(spaceIds, privileges, options) {
        const spaceResources = spaceIds.map(spaceId => _resource_serializer.ResourceSerializer.serializeSpaceResource(spaceId));
        return await checkPrivilegesAtResources(spaceResources, privileges, options);
      },
      async globally(privileges, options) {
        return await checkPrivilegesAtResources([_constants.GLOBAL_RESOURCE], privileges, options);
      }
    };
  }
  return {
    checkPrivilegesWithRequest,
    checkUserProfilesPrivileges
  };
}