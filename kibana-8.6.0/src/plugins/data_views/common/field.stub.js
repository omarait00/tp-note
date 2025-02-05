"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stubLogstashFields = exports.stubLogstashFieldSpecMap = exports.stubFields = exports.stubFieldSpecMap = exports.createIndexPatternFieldStub = void 0;
var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const createIndexPatternFieldStub = ({
  spec
}) => {
  return new _.DataViewField(spec);
};
exports.createIndexPatternFieldStub = createIndexPatternFieldStub;
const stubFieldSpecMap = {
  'machine.os': {
    name: 'machine.os',
    customLabel: 'OS',
    esTypes: ['text'],
    type: 'string',
    aggregatable: false,
    searchable: false
  },
  'machine.os.raw': {
    name: 'machine.os.raw',
    type: 'string',
    esTypes: ['keyword'],
    aggregatable: true,
    searchable: true
  },
  'not.filterable': {
    name: 'not.filterable',
    type: 'string',
    esTypes: ['text'],
    aggregatable: true,
    searchable: false
  },
  bytes: {
    name: 'bytes',
    type: 'number',
    esTypes: ['long'],
    aggregatable: true,
    searchable: true
  },
  '@timestamp': {
    name: '@timestamp',
    type: 'date',
    esTypes: ['date'],
    aggregatable: true,
    searchable: true
  },
  clientip: {
    name: 'clientip',
    type: 'ip',
    esTypes: ['ip'],
    aggregatable: true,
    searchable: true
  },
  'bool.field': {
    name: 'bool.field',
    type: 'boolean',
    esTypes: ['boolean'],
    aggregatable: true,
    searchable: true
  },
  bytes_range: {
    name: 'bytes_range',
    type: 'number_range',
    esTypes: ['integer_range'],
    aggregatable: true,
    searchable: true
  }
};
exports.stubFieldSpecMap = stubFieldSpecMap;
const stubFields = Object.values(stubFieldSpecMap).map(spec => createIndexPatternFieldStub({
  spec
}));
exports.stubFields = stubFields;
const stubLogstashFieldSpecMap = {
  bytes: {
    name: 'bytes',
    type: 'number',
    esTypes: ['long'],
    aggregatable: true,
    searchable: true,
    count: 10,
    readFromDocValues: true,
    scripted: false,
    isMapped: true
  },
  ssl: {
    name: 'ssl',
    type: 'boolean',
    esTypes: ['boolean'],
    aggregatable: true,
    searchable: true,
    count: 20,
    readFromDocValues: true,
    scripted: false,
    isMapped: true
  },
  '@timestamp': {
    name: '@timestamp',
    type: 'date',
    esTypes: ['date'],
    aggregatable: true,
    searchable: true,
    count: 30,
    readFromDocValues: true,
    scripted: false,
    isMapped: true
  },
  time: {
    name: 'time',
    type: 'date',
    esTypes: ['date'],
    aggregatable: true,
    searchable: true,
    count: 30,
    readFromDocValues: true,
    scripted: false,
    isMapped: true
  },
  '@tags': {
    name: '@tags',
    type: 'string',
    esTypes: ['keyword'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: true,
    scripted: false,
    isMapped: true
  },
  utc_time: {
    name: 'utc_time',
    type: 'date',
    esTypes: ['date'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: true,
    scripted: false,
    isMapped: true
  },
  phpmemory: {
    name: 'phpmemory',
    type: 'number',
    esTypes: ['integer'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: true,
    scripted: false,
    isMapped: true
  },
  ip: {
    name: 'ip',
    type: 'ip',
    esTypes: ['ip'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: true,
    scripted: false,
    isMapped: true
  },
  request_body: {
    name: 'request_body',
    type: 'attachment',
    esTypes: ['attachment'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: true,
    scripted: false,
    isMapped: true
  },
  point: {
    name: 'point',
    type: 'geo_point',
    esTypes: ['geo_point'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: true,
    scripted: false,
    isMapped: true
  },
  area: {
    name: 'area',
    type: 'geo_shape',
    esTypes: ['geo_shape'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: false,
    scripted: false,
    isMapped: true
  },
  hashed: {
    name: 'hashed',
    type: 'murmur3',
    esTypes: ['murmur3'],
    aggregatable: false,
    searchable: true,
    count: 0,
    readFromDocValues: false,
    scripted: false,
    isMapped: true
  },
  'geo.coordinates': {
    name: 'geo.coordinates',
    type: 'geo_point',
    esTypes: ['geo_point'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: true,
    scripted: false,
    isMapped: true
  },
  extension: {
    name: 'extension',
    type: 'string',
    esTypes: ['text'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: false,
    scripted: false,
    isMapped: true
  },
  'extension.keyword': {
    name: 'extension.keyword',
    type: 'string',
    esTypes: ['keyword'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: true,
    scripted: false,
    subType: {
      multi: {
        parent: 'extension'
      }
    },
    isMapped: true
  },
  'machine.os': {
    name: 'machine.os',
    type: 'string',
    esTypes: ['text'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: false,
    scripted: false,
    isMapped: true
  },
  'machine.os.raw': {
    name: 'machine.os.raw',
    type: 'string',
    esTypes: ['keyword'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: true,
    scripted: false,
    subType: {
      multi: {
        parent: 'machine.os'
      }
    },
    isMapped: true
  },
  'geo.src': {
    name: 'geo.src',
    type: 'string',
    esTypes: ['keyword'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: true,
    scripted: false,
    isMapped: true
  },
  _id: {
    name: '_id',
    type: 'string',
    esTypes: ['_id'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: false,
    scripted: false,
    isMapped: true
  },
  _type: {
    name: '_type',
    type: 'string',
    esTypes: ['_type'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: false,
    scripted: false,
    isMapped: true
  },
  _source: {
    name: '_source',
    type: '_source',
    esTypes: ['_source'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: false,
    scripted: false,
    isMapped: true
  },
  'non-filterable': {
    name: 'non-filterable',
    type: 'string',
    esTypes: ['text'],
    aggregatable: true,
    searchable: false,
    count: 0,
    readFromDocValues: false,
    scripted: false,
    isMapped: true
  },
  'non-sortable': {
    name: 'non-sortable',
    type: 'string',
    esTypes: ['text'],
    aggregatable: false,
    searchable: false,
    count: 0,
    readFromDocValues: false,
    scripted: false,
    isMapped: true
  },
  custom_user_field: {
    name: 'custom_user_field',
    type: 'conflict',
    esTypes: ['conflict'],
    aggregatable: true,
    searchable: true,
    count: 0,
    readFromDocValues: true,
    scripted: false,
    isMapped: true
  },
  'script string': {
    name: 'script string',
    type: 'string',
    esTypes: ['text'],
    aggregatable: true,
    searchable: false,
    count: 0,
    readFromDocValues: false,
    script: "'i am a string'",
    lang: 'expression',
    scripted: true,
    isMapped: false
  },
  'script number': {
    name: 'script number',
    type: 'number',
    esTypes: ['long'],
    aggregatable: true,
    searchable: false,
    count: 0,
    readFromDocValues: true,
    script: '1234',
    lang: 'expression',
    scripted: true,
    isMapped: false
  },
  'script date': {
    name: 'script date',
    type: 'date',
    esTypes: ['date'],
    aggregatable: true,
    searchable: false,
    count: 0,
    readFromDocValues: true,
    script: '1234',
    lang: 'painless',
    scripted: true,
    isMapped: false
  },
  'script murmur3': {
    name: 'script murmur3',
    type: 'murmur3',
    esTypes: ['murmur3'],
    aggregatable: true,
    searchable: false,
    count: 0,
    readFromDocValues: true,
    script: '1234',
    lang: 'expression',
    scripted: true,
    isMapped: false
  }
};
exports.stubLogstashFieldSpecMap = stubLogstashFieldSpecMap;
const stubLogstashFields = Object.values(stubLogstashFieldSpecMap).map(spec => createIndexPatternFieldStub({
  spec
}));
exports.stubLogstashFields = stubLogstashFields;