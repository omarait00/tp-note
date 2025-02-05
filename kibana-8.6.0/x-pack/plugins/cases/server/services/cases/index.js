"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CasesService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _esQuery = require("@kbn/es-query");
var _constants = require("../../../common/constants");
var _api = require("../../../common/api");
var _utils = require("../../common/utils");
var _api2 = require("../../routes/api");
var _utils2 = require("../../client/utils");
var _utils3 = require("../../authorization/utils");
var _transform = require("./transform");
var _error = require("../../common/error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class CasesService {
  constructor({
    log,
    unsecuredSavedObjectsClient,
    attachmentService
  }) {
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "unsecuredSavedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "attachmentService", void 0);
    (0, _defineProperty2.default)(this, "buildCaseIdsAggs", (size = 100) => ({
      references: {
        nested: {
          path: `${_constants.CASE_COMMENT_SAVED_OBJECT}.references`
        },
        aggregations: {
          caseIds: {
            terms: {
              field: `${_constants.CASE_COMMENT_SAVED_OBJECT}.references.id`,
              size
            }
          }
        }
      }
    }));
    this.log = log;
    this.unsecuredSavedObjectsClient = unsecuredSavedObjectsClient;
    this.attachmentService = attachmentService;
  }
  async getCaseIdsByAlertId({
    alertId,
    filter
  }) {
    try {
      this.log.debug(`Attempting to GET all cases for alert id ${alertId}`);
      const combinedFilter = (0, _utils2.combineFilters)([_esQuery.nodeBuilder.is(`${_constants.CASE_COMMENT_SAVED_OBJECT}.attributes.alertId`, alertId), filter]);
      const response = await this.unsecuredSavedObjectsClient.find({
        type: _constants.CASE_COMMENT_SAVED_OBJECT,
        fields: (0, _utils3.includeFieldsRequiredForAuthentication)(),
        page: 1,
        perPage: 1,
        sortField: _utils.defaultSortField,
        aggs: this.buildCaseIdsAggs(_constants.MAX_DOCS_PER_PAGE),
        filter: combinedFilter
      });
      return response;
    } catch (error) {
      this.log.error(`Error on GET all cases for alert id ${alertId}: ${error}`);
      throw error;
    }
  }

  /**
   * Extracts the case IDs from the alert aggregation
   */
  static getCaseIDsFromAlertAggs(result) {
    var _result$aggregations$, _result$aggregations;
    return (_result$aggregations$ = (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : _result$aggregations.references.caseIds.buckets.map(b => b.key)) !== null && _result$aggregations$ !== void 0 ? _result$aggregations$ : [];
  }

  /**
   * Returns a map of all cases.
   */
  async findCasesGroupedByID({
    caseOptions
  }) {
    const cases = await this.findCases(caseOptions);
    const casesMap = cases.saved_objects.reduce((accMap, caseInfo) => {
      accMap.set(caseInfo.id, caseInfo);
      return accMap;
    }, new Map());
    const commentTotals = await this.attachmentService.getCaseCommentStats({
      unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
      caseIds: Array.from(casesMap.keys())
    });
    const casesWithComments = new Map();
    for (const [id, caseInfo] of casesMap.entries()) {
      var _commentTotals$get;
      const {
        alerts,
        userComments
      } = (_commentTotals$get = commentTotals.get(id)) !== null && _commentTotals$get !== void 0 ? _commentTotals$get : {
        alerts: 0,
        userComments: 0
      };
      casesWithComments.set(id, (0, _utils.flattenCaseSavedObject)({
        savedObject: caseInfo,
        totalComment: userComments,
        totalAlerts: alerts
      }));
    }
    return {
      casesMap: casesWithComments,
      page: cases.page,
      perPage: cases.per_page,
      total: cases.total
    };
  }
  async getCaseStatusStats({
    searchOptions
  }) {
    var _cases$aggregations, _statusBuckets$get, _statusBuckets$get2, _statusBuckets$get3;
    const cases = await this.unsecuredSavedObjectsClient.find({
      ...searchOptions,
      type: _constants.CASE_SAVED_OBJECT,
      perPage: 0,
      aggs: {
        statuses: {
          terms: {
            field: `${_constants.CASE_SAVED_OBJECT}.attributes.status`,
            size: _api.caseStatuses.length,
            order: {
              _key: 'asc'
            }
          }
        }
      }
    });
    const statusBuckets = CasesService.getStatusBuckets((_cases$aggregations = cases.aggregations) === null || _cases$aggregations === void 0 ? void 0 : _cases$aggregations.statuses.buckets);
    return {
      open: (_statusBuckets$get = statusBuckets === null || statusBuckets === void 0 ? void 0 : statusBuckets.get('open')) !== null && _statusBuckets$get !== void 0 ? _statusBuckets$get : 0,
      'in-progress': (_statusBuckets$get2 = statusBuckets === null || statusBuckets === void 0 ? void 0 : statusBuckets.get('in-progress')) !== null && _statusBuckets$get2 !== void 0 ? _statusBuckets$get2 : 0,
      closed: (_statusBuckets$get3 = statusBuckets === null || statusBuckets === void 0 ? void 0 : statusBuckets.get('closed')) !== null && _statusBuckets$get3 !== void 0 ? _statusBuckets$get3 : 0
    };
  }
  static getStatusBuckets(buckets) {
    return buckets === null || buckets === void 0 ? void 0 : buckets.reduce((acc, bucket) => {
      acc.set(bucket.key, bucket.doc_count);
      return acc;
    }, new Map());
  }
  async deleteCase({
    id: caseId,
    refresh
  }) {
    try {
      this.log.debug(`Attempting to DELETE case ${caseId}`);
      return await this.unsecuredSavedObjectsClient.delete(_constants.CASE_SAVED_OBJECT, caseId, {
        refresh
      });
    } catch (error) {
      this.log.error(`Error on DELETE case ${caseId}: ${error}`);
      throw error;
    }
  }
  async getCase({
    id: caseId
  }) {
    try {
      this.log.debug(`Attempting to GET case ${caseId}`);
      const caseSavedObject = await this.unsecuredSavedObjectsClient.get(_constants.CASE_SAVED_OBJECT, caseId);
      return (0, _transform.transformSavedObjectToExternalModel)(caseSavedObject);
    } catch (error) {
      this.log.error(`Error on GET case ${caseId}: ${error}`);
      throw error;
    }
  }
  async getResolveCase({
    id: caseId
  }) {
    try {
      this.log.debug(`Attempting to resolve case ${caseId}`);
      const resolveCaseResult = await this.unsecuredSavedObjectsClient.resolve(_constants.CASE_SAVED_OBJECT, caseId);
      return {
        ...resolveCaseResult,
        saved_object: (0, _transform.transformSavedObjectToExternalModel)(resolveCaseResult.saved_object)
      };
    } catch (error) {
      this.log.error(`Error on resolve case ${caseId}: ${error}`);
      throw error;
    }
  }
  async getCases({
    caseIds
  }) {
    try {
      this.log.debug(`Attempting to GET cases ${caseIds.join(', ')}`);
      const cases = await this.unsecuredSavedObjectsClient.bulkGet(caseIds.map(caseId => ({
        type: _constants.CASE_SAVED_OBJECT,
        id: caseId
      })));
      return (0, _transform.transformBulkResponseToExternalModel)(cases);
    } catch (error) {
      this.log.error(`Error on GET cases ${caseIds.join(', ')}: ${error}`);
      throw error;
    }
  }
  async findCases(options) {
    try {
      this.log.debug(`Attempting to find cases`);
      const cases = await this.unsecuredSavedObjectsClient.find({
        sortField: _utils.defaultSortField,
        ...options,
        type: _constants.CASE_SAVED_OBJECT
      });
      return (0, _transform.transformFindResponseToExternalModel)(cases);
    } catch (error) {
      this.log.error(`Error on find cases: ${error}`);
      throw error;
    }
  }
  asArray(id) {
    if (id === undefined) {
      return [];
    } else if (Array.isArray(id)) {
      return id;
    } else {
      return [id];
    }
  }
  async getAllComments({
    id,
    options
  }) {
    try {
      this.log.debug(`Attempting to GET all comments internal for id ${JSON.stringify(id)}`);
      if ((options === null || options === void 0 ? void 0 : options.page) !== undefined || (options === null || options === void 0 ? void 0 : options.perPage) !== undefined) {
        return this.attachmentService.find({
          unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
          options: {
            sortField: _utils.defaultSortField,
            ...options
          }
        });
      }
      return this.attachmentService.find({
        unsecuredSavedObjectsClient: this.unsecuredSavedObjectsClient,
        options: {
          page: 1,
          perPage: _constants.MAX_DOCS_PER_PAGE,
          sortField: _utils.defaultSortField,
          ...options
        }
      });
    } catch (error) {
      this.log.error(`Error on GET all comments internal for ${JSON.stringify(id)}: ${error}`);
      throw error;
    }
  }

  /**
   * Default behavior is to retrieve all comments that adhere to a given filter (if one is included).
   * to override this pass in the either the page or perPage options.
   */
  async getAllCaseComments({
    id,
    options
  }) {
    try {
      const refs = this.asArray(id).map(caseID => ({
        type: _constants.CASE_SAVED_OBJECT,
        id: caseID
      }));
      if (refs.length <= 0) {
        var _options$perPage, _options$page;
        return {
          saved_objects: [],
          total: 0,
          per_page: (_options$perPage = options === null || options === void 0 ? void 0 : options.perPage) !== null && _options$perPage !== void 0 ? _options$perPage : _api2.DEFAULT_PER_PAGE,
          page: (_options$page = options === null || options === void 0 ? void 0 : options.page) !== null && _options$page !== void 0 ? _options$page : _api2.DEFAULT_PAGE
        };
      }
      this.log.debug(`Attempting to GET all comments for case caseID ${JSON.stringify(id)}`);
      return await this.getAllComments({
        id,
        options: {
          hasReferenceOperator: 'OR',
          hasReference: refs,
          filter: options === null || options === void 0 ? void 0 : options.filter,
          ...options
        }
      });
    } catch (error) {
      this.log.error(`Error on GET all comments for case ${JSON.stringify(id)}: ${error}`);
      throw error;
    }
  }
  async getReporters({
    filter
  }) {
    try {
      var _results$aggregations, _results$aggregations2, _results$aggregations3;
      this.log.debug(`Attempting to GET all reporters`);
      const results = await this.unsecuredSavedObjectsClient.find({
        type: _constants.CASE_SAVED_OBJECT,
        page: 1,
        perPage: 1,
        filter,
        aggs: {
          reporters: {
            terms: {
              field: `${_constants.CASE_SAVED_OBJECT}.attributes.created_by.username`,
              size: _constants.MAX_DOCS_PER_PAGE,
              order: {
                _key: 'asc'
              }
            },
            aggs: {
              top_docs: {
                top_hits: {
                  sort: [{
                    [`${_constants.CASE_SAVED_OBJECT}.created_at`]: {
                      order: 'desc'
                    }
                  }],
                  size: 1,
                  _source: [`${_constants.CASE_SAVED_OBJECT}.created_by`]
                }
              }
            }
          }
        }
      });
      return (_results$aggregations = results === null || results === void 0 ? void 0 : (_results$aggregations2 = results.aggregations) === null || _results$aggregations2 === void 0 ? void 0 : (_results$aggregations3 = _results$aggregations2.reporters) === null || _results$aggregations3 === void 0 ? void 0 : _results$aggregations3.buckets.map(({
        key: username,
        top_docs: topDocs
      }) => {
        var _topDocs$hits$hits$0$, _topDocs$hits, _topDocs$hits$hits, _topDocs$hits$hits$, _topDocs$hits$hits$$_, _topDocs$hits$hits$$_2, _user$full_name, _user$email;
        const user = (_topDocs$hits$hits$0$ = topDocs === null || topDocs === void 0 ? void 0 : (_topDocs$hits = topDocs.hits) === null || _topDocs$hits === void 0 ? void 0 : (_topDocs$hits$hits = _topDocs$hits.hits) === null || _topDocs$hits$hits === void 0 ? void 0 : (_topDocs$hits$hits$ = _topDocs$hits$hits[0]) === null || _topDocs$hits$hits$ === void 0 ? void 0 : (_topDocs$hits$hits$$_ = _topDocs$hits$hits$._source) === null || _topDocs$hits$hits$$_ === void 0 ? void 0 : (_topDocs$hits$hits$$_2 = _topDocs$hits$hits$$_.cases) === null || _topDocs$hits$hits$$_2 === void 0 ? void 0 : _topDocs$hits$hits$$_2.created_by) !== null && _topDocs$hits$hits$0$ !== void 0 ? _topDocs$hits$hits$0$ : {};
        return {
          username,
          full_name: (_user$full_name = user.full_name) !== null && _user$full_name !== void 0 ? _user$full_name : null,
          email: (_user$email = user.email) !== null && _user$email !== void 0 ? _user$email : null,
          // TODO: verify that adding a new field is ok, shouldn't be a breaking change
          profile_uid: user.profile_uid
        };
      })) !== null && _results$aggregations !== void 0 ? _results$aggregations : [];
    } catch (error) {
      this.log.error(`Error on GET all reporters: ${error}`);
      throw error;
    }
  }
  async getTags({
    filter
  }) {
    try {
      var _results$aggregations4, _results$aggregations5, _results$aggregations6;
      this.log.debug(`Attempting to GET all cases`);
      const results = await this.unsecuredSavedObjectsClient.find({
        type: _constants.CASE_SAVED_OBJECT,
        page: 1,
        perPage: 1,
        filter,
        aggs: {
          tags: {
            terms: {
              field: `${_constants.CASE_SAVED_OBJECT}.attributes.tags`,
              size: _constants.MAX_DOCS_PER_PAGE,
              order: {
                _key: 'asc'
              }
            }
          }
        }
      });
      return (_results$aggregations4 = results === null || results === void 0 ? void 0 : (_results$aggregations5 = results.aggregations) === null || _results$aggregations5 === void 0 ? void 0 : (_results$aggregations6 = _results$aggregations5.tags) === null || _results$aggregations6 === void 0 ? void 0 : _results$aggregations6.buckets.map(({
        key
      }) => key)) !== null && _results$aggregations4 !== void 0 ? _results$aggregations4 : [];
    } catch (error) {
      this.log.error(`Error on GET tags: ${error}`);
      throw error;
    }
  }
  async postNewCase({
    attributes,
    id,
    refresh
  }) {
    try {
      this.log.debug(`Attempting to POST a new case`);
      const transformedAttributes = (0, _transform.transformAttributesToESModel)(attributes);
      const createdCase = await this.unsecuredSavedObjectsClient.create(_constants.CASE_SAVED_OBJECT, transformedAttributes.attributes, {
        id,
        references: transformedAttributes.referenceHandler.build(),
        refresh
      });
      return (0, _transform.transformSavedObjectToExternalModel)(createdCase);
    } catch (error) {
      this.log.error(`Error on POST a new case: ${error}`);
      throw error;
    }
  }
  async patchCase({
    caseId,
    updatedAttributes,
    originalCase,
    version,
    refresh
  }) {
    try {
      this.log.debug(`Attempting to UPDATE case ${caseId}`);
      const transformedAttributes = (0, _transform.transformAttributesToESModel)(updatedAttributes);
      const updatedCase = await this.unsecuredSavedObjectsClient.update(_constants.CASE_SAVED_OBJECT, caseId, transformedAttributes.attributes, {
        version,
        references: transformedAttributes.referenceHandler.build(originalCase.references),
        refresh
      });
      return (0, _transform.transformUpdateResponseToExternalModel)(updatedCase);
    } catch (error) {
      this.log.error(`Error on UPDATE case ${caseId}: ${error}`);
      throw error;
    }
  }
  async patchCases({
    cases,
    refresh
  }) {
    try {
      this.log.debug(`Attempting to UPDATE case ${cases.map(c => c.caseId).join(', ')}`);
      const bulkUpdate = cases.map(({
        caseId,
        updatedAttributes,
        version,
        originalCase
      }) => {
        const {
          attributes,
          referenceHandler
        } = (0, _transform.transformAttributesToESModel)(updatedAttributes);
        return {
          type: _constants.CASE_SAVED_OBJECT,
          id: caseId,
          attributes,
          references: referenceHandler.build(originalCase.references),
          version
        };
      });
      const updatedCases = await this.unsecuredSavedObjectsClient.bulkUpdate(bulkUpdate, {
        refresh
      });
      return (0, _transform.transformUpdateResponsesToExternalModels)(updatedCases);
    } catch (error) {
      this.log.error(`Error on UPDATE case ${cases.map(c => c.caseId).join(', ')}: ${error}`);
      throw error;
    }
  }
  async executeAggregations({
    aggregationBuilders,
    options
  }) {
    try {
      const builtAggs = aggregationBuilders.reduce((acc, agg) => {
        return {
          ...acc,
          ...agg.build()
        };
      }, {});
      const res = await this.unsecuredSavedObjectsClient.find({
        sortField: _utils.defaultSortField,
        ...options,
        aggs: builtAggs,
        type: _constants.CASE_SAVED_OBJECT
      });
      return res.aggregations;
    } catch (error) {
      const aggregationNames = aggregationBuilders.map(agg => agg.getName());
      throw (0, _error.createCaseError)({
        message: `Failed to execute aggregations [${aggregationNames.join(',')}]: ${error}`,
        error,
        logger: this.log
      });
    }
  }
}
exports.CasesService = CasesService;