"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestIndexFieldSearch = exports.indexFieldsProvider = exports.formatIndexFields = exports.findExistingIndices = exports.dedupeIndexName = exports.createFieldItem = void 0;
var _rxjs = require("rxjs");
var _isEmpty = _interopRequireDefault(require("lodash/isEmpty"));
var _get = _interopRequireDefault(require("lodash/get"));
var _server = require("../../../../../../src/plugins/data/server");
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const apmIndexPattern = 'apm-*-transaction*';
const apmDataStreamsPattern = 'traces-apm*';
const indexFieldsProvider = getStartServices => {
  // require the fields once we actually need them, rather than ahead of time, and pass
  // them to createFieldItem to reduce the amount of work done as much as possible
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const beatFields = require('../../utils/beat_schema/fields').fieldsBeat;
  return {
    search: (request, options, deps) => (0, _rxjs.from)(requestIndexFieldSearch(request, deps, beatFields, getStartServices))
  };
};
exports.indexFieldsProvider = indexFieldsProvider;
const findExistingIndices = async (indices, esClient) => Promise.all(indices.map(async index => {
  if ([apmIndexPattern, apmDataStreamsPattern].includes(index)) {
    const searchResponse = await esClient.search({
      index,
      body: {
        query: {
          match_all: {}
        },
        size: 0
      }
    });
    return (0, _get.default)(searchResponse, 'hits.total.value', 0) > 0;
  }
  const searchResponse = await esClient.fieldCaps({
    index,
    fields: '_id',
    ignore_unavailable: true,
    allow_no_indices: false
  });
  return searchResponse.indices.length > 0;
}).map(p => p.catch(e => false)));
exports.findExistingIndices = findExistingIndices;
const requestIndexFieldSearch = async (request, {
  savedObjectsClient,
  esClient,
  request: kRequest
}, beatFields, getStartServices) => {
  const indexPatternsFetcherAsCurrentUser = new _server.IndexPatternsFetcher(esClient.asCurrentUser);
  const indexPatternsFetcherAsInternalUser = new _server.IndexPatternsFetcher(esClient.asInternalUser);
  if ('dataViewId' in request && 'indices' in request) {
    throw new Error('Provide index field search with either `dataViewId` or `indices`, not both');
  }
  const [, {
    data: {
      indexPatterns
    }
  }] = await getStartServices();
  const dataViewService = await indexPatterns.dataViewsServiceFactory(savedObjectsClient, esClient.asCurrentUser, kRequest, true);
  let indicesExist = [];
  let indexFields = [];
  let runtimeMappings = {};

  // if dataViewId is provided, get fields and indices from the Kibana Data View
  if ('dataViewId' in request) {
    let dataView;
    try {
      dataView = await dataViewService.get(request.dataViewId);
    } catch (r) {
      if (r.output.payload.statusCode === 404 &&
      // this is the only place this id is hard coded as there are no security_solution dependencies in timeline
      // needs to match value in DEFAULT_DATA_VIEW_ID security_solution/common/constants.ts
      r.output.payload.message.indexOf('security-solution') > -1) {
        throw new Error(_constants.DELETED_SECURITY_SOLUTION_DATA_VIEW);
      } else {
        throw r;
      }
    }
    const patternList = dataView.title.split(',');
    indicesExist = (await findExistingIndices(patternList, esClient.asCurrentUser)).reduce((acc, doesIndexExist, i) => doesIndexExist ? [...acc, patternList[i]] : acc, []);
    if (!request.onlyCheckIfIndicesExist) {
      var _dataViewSpec$fields, _dataViewSpec$runtime;
      const dataViewSpec = dataView.toSpec();
      const fieldDescriptor = [Object.values((_dataViewSpec$fields = dataViewSpec.fields) !== null && _dataViewSpec$fields !== void 0 ? _dataViewSpec$fields : {})];
      runtimeMappings = (_dataViewSpec$runtime = dataViewSpec.runtimeFieldMap) !== null && _dataViewSpec$runtime !== void 0 ? _dataViewSpec$runtime : {};
      indexFields = await formatIndexFields(beatFields, fieldDescriptor, patternList);
    }
  } else if ('indices' in request) {
    const patternList = dedupeIndexName(request.indices);
    indicesExist = (await findExistingIndices(patternList, esClient.asCurrentUser)).reduce((acc, doesIndexExist, i) => doesIndexExist ? [...acc, patternList[i]] : acc, []);
    if (!request.onlyCheckIfIndicesExist) {
      const fieldDescriptor = (await Promise.all(indicesExist.map(async (index, n) => {
        if (index.startsWith('.alerts-observability')) {
          return indexPatternsFetcherAsInternalUser.getFieldsForWildcard({
            pattern: index
          });
        }
        return indexPatternsFetcherAsCurrentUser.getFieldsForWildcard({
          pattern: index
        });
      }))).map(response => response.fields || []);
      indexFields = await formatIndexFields(beatFields, fieldDescriptor, patternList);
    }
  }
  return {
    indexFields,
    runtimeMappings,
    indicesExist,
    rawResponse: {
      timed_out: false,
      took: -1,
      _shards: {
        total: -1,
        successful: -1,
        failed: -1,
        skipped: -1
      },
      hits: {
        total: -1,
        max_score: -1,
        hits: [{
          _index: '',
          _id: '',
          _score: -1,
          fields: {}
        }]
      }
    }
  };
};
exports.requestIndexFieldSearch = requestIndexFieldSearch;
const dedupeIndexName = indices => indices.reduce((acc, index) => {
  if (index.trim() !== '' && index.trim() !== '_all' && !acc.includes(index.trim())) {
    return [...acc, index];
  }
  return acc;
}, []);
exports.dedupeIndexName = dedupeIndexName;
const missingFields = [{
  name: '_id',
  type: 'string',
  searchable: true,
  aggregatable: false,
  readFromDocValues: false,
  esTypes: []
}, {
  name: '_index',
  type: 'string',
  searchable: true,
  aggregatable: true,
  readFromDocValues: false,
  esTypes: []
}];

/**
 * Creates a single field item with category and indexes (index alias)
 *
 * This is a mutatious HOT CODE PATH function that will have array sizes up to 4.7 megs
 * in size at a time calling this function repeatedly. This function should be as optimized as possible
 * and should avoid any and all creation of new arrays, iterating over the arrays or performing
 * any n^2 operations.
 * @param beatFields: BeatFields,
 * @param indexesAlias The index alias
 * @param index The index its self
 * @param indexesAliasIdx The index within the alias
 */
const createFieldItem = (beatFields, indexesAlias, index, indexesAliasIdx) => {
  var _beatFields$indexName, _index$format$id, _index$format;
  const alias = indexesAliasIdx != null ? [indexesAlias[indexesAliasIdx]] : indexesAlias;
  const splitIndexName = index.name.split('.');
  const indexName = splitIndexName[splitIndexName.length - 1] === 'text' ? splitIndexName.slice(0, splitIndexName.length - 1).join('.') : index.name;
  const beatIndex = (_beatFields$indexName = beatFields[indexName]) !== null && _beatFields$indexName !== void 0 ? _beatFields$indexName : {};
  if ((0, _isEmpty.default)(beatIndex.category)) {
    beatIndex.category = splitIndexName[0];
  }
  return {
    ...beatIndex,
    ...index,
    // the format type on FieldSpec is SerializedFieldFormat
    // and is a string on beatIndex
    format: (_index$format$id = (_index$format = index.format) === null || _index$format === void 0 ? void 0 : _index$format.id) !== null && _index$format$id !== void 0 ? _index$format$id : beatIndex.format,
    indexes: alias
  };
};

/**
 * Iterates over each field, adds description, category, and indexes (index alias)
 *
 * This is a mutatious HOT CODE PATH function that will have array sizes up to 4.7 megs
 * in size at a time when being called. This function should be as optimized as possible
 * and should avoid any and all creation of new arrays, iterating over the arrays or performing
 * any n^2 operations. The `.push`, and `forEach` operations are expected within this function
 * to speed up performance.
 *
 * This intentionally waits for the next tick on the event loop to process as the large 4.7 megs
 * has already consumed a lot of the event loop processing up to this function and we want to give
 * I/O opportunity to occur by scheduling this on the next loop.
 * @param beatFields: BeatFields,
 * @param responsesFieldSpec The response index fields to loop over
 * @param indexesAlias The index aliases such as filebeat-*
 */
exports.createFieldItem = createFieldItem;
const formatIndexFields = async (beatFields, responsesFieldSpec, indexesAlias) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const indexFieldNameHash = {};
      resolve(responsesFieldSpec.reduce((accumulator, fieldSpec, indexesAliasId) => {
        const indexesAliasIdx = responsesFieldSpec.length > 1 ? indexesAliasId : null;
        missingFields.concat(fieldSpec).forEach(index => {
          const item = createFieldItem(beatFields, indexesAlias, index, indexesAliasIdx);
          const alreadyExistingIndexField = indexFieldNameHash[item.name];
          if (alreadyExistingIndexField != null) {
            const existingIndexField = accumulator[alreadyExistingIndexField];
            if ((0, _isEmpty.default)(accumulator[alreadyExistingIndexField].description)) {
              accumulator[alreadyExistingIndexField].description = item.description;
            }
            accumulator[alreadyExistingIndexField].indexes = Array.from(new Set(existingIndexField.indexes.concat(item.indexes)));
            return;
          }
          accumulator.push(item);
          indexFieldNameHash[item.name] = accumulator.length - 1;
        });
        return accumulator;
      }, []));
    });
  });
};
exports.formatIndexFields = formatIndexFields;