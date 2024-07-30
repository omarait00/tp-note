"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userFieldsMap = exports.sourceFieldsMap = exports.processFieldsMap = exports.osFieldsMap = exports.hostFieldsMap = exports.cloudFieldsMap = void 0;
var _extend_map = require("./extend_map");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const cloudFieldsMap = {
  'cloud.account.id': 'cloud.account.id',
  'cloud.availability_zone': 'cloud.availability_zone',
  'cloud.instance.id': 'cloud.instance.id',
  'cloud.instance.name': 'cloud.instance.name',
  'cloud.machine.type': 'cloud.machine.type',
  'cloud.provider': 'cloud.provider',
  'cloud.region': 'cloud.region'
};
exports.cloudFieldsMap = cloudFieldsMap;
const osFieldsMap = {
  'os.platform': 'os.platform',
  'os.name': 'os.name',
  'os.full': 'os.full',
  'os.family': 'os.family',
  'os.version': 'os.version',
  'os.kernel': 'os.kernel'
};
exports.osFieldsMap = osFieldsMap;
const hostFieldsMap = {
  'host.architecture': 'host.architecture',
  'host.id': 'host.id',
  'host.ip': 'host.ip',
  'host.mac': 'host.mac',
  'host.name': 'host.name',
  ...(0, _extend_map.extendMap)('host', osFieldsMap)
};
exports.hostFieldsMap = hostFieldsMap;
const processFieldsMap = {
  'process.hash.md5': 'process.hash.md5',
  'process.hash.sha1': 'process.hash.sha1',
  'process.hash.sha256': 'process.hash.sha256',
  'process.pid': 'process.pid',
  'process.name': 'process.name',
  'process.ppid': 'process.ppid',
  'process.args': 'process.args',
  'process.entity_id': 'process.entity_id',
  'process.executable': 'process.executable',
  'process.title': 'process.title',
  'process.thread': 'process.thread',
  'process.working_directory': 'process.working_directory'
};
exports.processFieldsMap = processFieldsMap;
const userFieldsMap = {
  'user.domain': 'user.domain',
  'user.id': 'user.id',
  'user.name': 'user.name',
  // NOTE: This field is not tested and available from ECS. Please remove this tag once it is
  'user.full_name': 'user.full_name',
  // NOTE: This field is not tested and available from ECS. Please remove this tag once it is
  'user.email': 'user.email',
  // NOTE: This field is not tested and available from ECS. Please remove this tag once it is
  'user.hash': 'user.hash',
  // NOTE: This field is not tested and available from ECS. Please remove this tag once it is
  'user.group': 'user.group'
};
exports.userFieldsMap = userFieldsMap;
const sourceFieldsMap = {
  'source.bytes': 'source.bytes',
  'source.ip': 'source.ip',
  'source.packets': 'source.packets',
  'source.port': 'source.port',
  'source.domain': 'source.domain',
  'source.geo.continent_name': 'source.geo.continent_name',
  'source.geo.country_name': 'source.geo.country_name',
  'source.geo.country_iso_code': 'source.geo.country_iso_code',
  'source.geo.city_name': 'source.geo.city_name',
  'source.geo.region_iso_code': 'source.geo.region_iso_code',
  'source.geo.region_name': 'source.geo.region_name'
};
exports.sourceFieldsMap = sourceFieldsMap;