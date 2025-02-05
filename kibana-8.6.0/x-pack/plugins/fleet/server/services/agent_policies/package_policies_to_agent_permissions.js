"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_CLUSTER_PERMISSIONS = void 0;
exports.getDataStreamPrivileges = getDataStreamPrivileges;
exports.storedPackagePoliciesToAgentPermissions = storedPackagePoliciesToAgentPermissions;
var _services = require("../../../common/services");
var _constants = require("../../constants");
var _registry = require("../epm/registry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_CLUSTER_PERMISSIONS = ['monitor'];
exports.DEFAULT_CLUSTER_PERMISSIONS = DEFAULT_CLUSTER_PERMISSIONS;
async function storedPackagePoliciesToAgentPermissions(packageInfoCache, packagePolicies) {
  // I'm not sure what permissions to return for this case, so let's return the defaults
  if (!packagePolicies) {
    throw new Error('storedPackagePoliciesToAgentPermissions should be called with a PackagePolicy');
  }
  if (packagePolicies.length === 0) {
    return;
  }
  const permissionEntries = packagePolicies.map(async packagePolicy => {
    var _packagePolicy$elasti, _packagePolicy$elasti2, _packagePolicy$elasti3;
    if (!packagePolicy.package) {
      var _packagePolicy$name;
      throw new Error(`No package for package policy ${(_packagePolicy$name = packagePolicy.name) !== null && _packagePolicy$name !== void 0 ? _packagePolicy$name : packagePolicy.id}`);
    }
    const pkg = packageInfoCache.get((0, _registry.pkgToPkgKey)(packagePolicy.package));
    const dataStreams = (0, _services.getNormalizedDataStreams)(pkg);
    if (!dataStreams || dataStreams.length === 0) {
      return [packagePolicy.name, undefined];
    }
    let dataStreamsForPermissions;
    switch (pkg.name) {
      case 'endpoint':
        // - Endpoint doesn't store the `data_stream` metadata in
        // `packagePolicy.inputs`, so we will use _all_ data_streams from the
        // package.
        dataStreamsForPermissions = dataStreams;
        break;
      case 'apm':
        // - APM doesn't store the `data_stream` metadata in
        //   `packagePolicy.inputs`, so we will use _all_ data_streams from
        //   the package.
        dataStreamsForPermissions = dataStreams;
        break;
      case 'osquery_manager':
        // - Osquery manager doesn't store the `data_stream` metadata in
        //   `packagePolicy.inputs`, so we will use _all_ data_streams from
        //   the package.
        dataStreamsForPermissions = dataStreams;
        break;
      default:
        // - Normal packages store some of the `data_stream` metadata in
        //   `packagePolicy.inputs[].streams[].data_stream`
        // - The rest of the metadata needs to be fetched from the
        //   `data_stream` object in the package. The link is
        //   `packagePolicy.inputs[].type == dataStreams.streams[].input`
        // - Some packages (custom logs) have a compiled dataset, stored in
        //   `input.streams.compiled_stream.data_stream.dataset`
        dataStreamsForPermissions = packagePolicy.inputs.filter(i => i.enabled).flatMap(input => {
          if (!input.streams) {
            return [];
          }
          const dataStreams_ = [];
          input.streams.filter(s => s.enabled).forEach(stream => {
            var _stream$compiled_stre, _stream$compiled_stre2, _stream$compiled_stre3;
            if (!('data_stream' in stream)) {
              return;
            }
            const ds = {
              type: stream.data_stream.type,
              dataset: (_stream$compiled_stre = (_stream$compiled_stre2 = stream.compiled_stream) === null || _stream$compiled_stre2 === void 0 ? void 0 : (_stream$compiled_stre3 = _stream$compiled_stre2.data_stream) === null || _stream$compiled_stre3 === void 0 ? void 0 : _stream$compiled_stre3.dataset) !== null && _stream$compiled_stre !== void 0 ? _stream$compiled_stre : stream.data_stream.dataset
            };
            if (stream.data_stream.elasticsearch) {
              ds.elasticsearch = stream.data_stream.elasticsearch;
            }
            dataStreams_.push(ds);
          });
          return dataStreams_;
        });
    }
    let clusterRoleDescriptor = {};
    const cluster = (_packagePolicy$elasti = packagePolicy === null || packagePolicy === void 0 ? void 0 : (_packagePolicy$elasti2 = packagePolicy.elasticsearch) === null || _packagePolicy$elasti2 === void 0 ? void 0 : (_packagePolicy$elasti3 = _packagePolicy$elasti2.privileges) === null || _packagePolicy$elasti3 === void 0 ? void 0 : _packagePolicy$elasti3.cluster) !== null && _packagePolicy$elasti !== void 0 ? _packagePolicy$elasti : [];
    if (cluster.length > 0) {
      clusterRoleDescriptor = {
        cluster
      };
    }
    return [packagePolicy.id, {
      indices: dataStreamsForPermissions.map(ds => getDataStreamPrivileges(ds, packagePolicy.namespace)),
      ...clusterRoleDescriptor
    }];
  });
  return Object.fromEntries(await Promise.all(permissionEntries));
}
function getDataStreamPrivileges(dataStream, namespace = '*') {
  var _dataStream$elasticse, _dataStream$elasticse2, _dataStream$elasticse3;
  let index = `${dataStream.type}-${dataStream.dataset}`;
  if (dataStream.dataset_is_prefix) {
    index = `${index}.*`;
  }
  if (dataStream.hidden) {
    index = `.${index}`;
  }
  index += `-${namespace}`;
  const privileges = dataStream !== null && dataStream !== void 0 && (_dataStream$elasticse = dataStream.elasticsearch) !== null && _dataStream$elasticse !== void 0 && (_dataStream$elasticse2 = _dataStream$elasticse.privileges) !== null && _dataStream$elasticse2 !== void 0 && (_dataStream$elasticse3 = _dataStream$elasticse2.indices) !== null && _dataStream$elasticse3 !== void 0 && _dataStream$elasticse3.length ? dataStream.elasticsearch.privileges.indices : _constants.PACKAGE_POLICY_DEFAULT_INDEX_PRIVILEGES;
  return {
    names: [index],
    privileges
  };
}