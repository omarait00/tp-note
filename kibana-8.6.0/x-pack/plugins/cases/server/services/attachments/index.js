"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AttachmentService = void 0;
var _api = require("../../../common/api");
var _constants = require("../../../common/constants");
var _utils = require("../../client/utils");
var _utils2 = require("../../common/utils");
var _so_references = require("../so_references");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class AttachmentService {
  constructor(log, persistableStateAttachmentTypeRegistry) {
    this.log = log;
    this.persistableStateAttachmentTypeRegistry = persistableStateAttachmentTypeRegistry;
  }
  async countAlertsAttachedToCase(params) {
    try {
      var _res$alerts;
      this.log.debug(`Attempting to count alerts for case id ${params.caseId}`);
      const res = await this.executeCaseAggregations({
        ...params,
        attachmentType: _api.CommentType.alert,
        aggregations: this.buildAlertsAggs('cardinality')
      });
      return res === null || res === void 0 ? void 0 : (_res$alerts = res.alerts) === null || _res$alerts === void 0 ? void 0 : _res$alerts.value;
    } catch (error) {
      this.log.error(`Error while counting alerts for case id ${params.caseId}: ${error}`);
      throw error;
    }
  }
  buildAlertsAggs(agg) {
    return {
      alerts: {
        [agg]: {
          field: `${_constants.CASE_COMMENT_SAVED_OBJECT}.attributes.alertId`
        }
      }
    };
  }
  async valueCountAlertsAttachedToCase(params) {
    try {
      var _res$alerts$value, _res$alerts2;
      this.log.debug(`Attempting to value count alerts for case id ${params.caseId}`);
      const res = await this.executeCaseAggregations({
        ...params,
        attachmentType: _api.CommentType.alert,
        aggregations: this.buildAlertsAggs('value_count')
      });
      return (_res$alerts$value = res === null || res === void 0 ? void 0 : (_res$alerts2 = res.alerts) === null || _res$alerts2 === void 0 ? void 0 : _res$alerts2.value) !== null && _res$alerts$value !== void 0 ? _res$alerts$value : 0;
    } catch (error) {
      this.log.error(`Error while value counting alerts for case id ${params.caseId}: ${error}`);
      throw error;
    }
  }

  /**
   * Retrieves all the alerts attached to a case.
   */
  async getAllAlertsAttachToCase({
    unsecuredSavedObjectsClient,
    caseId,
    filter
  }) {
    try {
      this.log.debug(`Attempting to GET all alerts for case id ${caseId}`);
      const alertsFilter = (0, _utils.buildFilter)({
        filters: [_api.CommentType.alert],
        field: 'type',
        operator: 'or',
        type: _constants.CASE_COMMENT_SAVED_OBJECT
      });
      const combinedFilter = (0, _utils.combineFilters)([alertsFilter, filter]);
      const finder = unsecuredSavedObjectsClient.createPointInTimeFinder({
        type: _constants.CASE_COMMENT_SAVED_OBJECT,
        hasReference: {
          type: _constants.CASE_SAVED_OBJECT,
          id: caseId
        },
        sortField: 'created_at',
        sortOrder: 'asc',
        filter: combinedFilter,
        perPage: _constants.MAX_DOCS_PER_PAGE
      });
      let result = [];
      for await (const userActionSavedObject of finder.find()) {
        result = result.concat(userActionSavedObject.saved_objects);
      }
      return result;
    } catch (error) {
      this.log.error(`Error on GET all alerts for case id ${caseId}: ${error}`);
      throw error;
    }
  }

  /**
   * Executes the aggregations against a type of attachment attached to a case.
   */
  async executeCaseAggregations({
    unsecuredSavedObjectsClient,
    caseId,
    filter,
    aggregations,
    attachmentType
  }) {
    try {
      this.log.debug(`Attempting to aggregate for case id ${caseId}`);
      const attachmentFilter = (0, _utils.buildFilter)({
        filters: attachmentType,
        field: 'type',
        operator: 'or',
        type: _constants.CASE_COMMENT_SAVED_OBJECT
      });
      const combinedFilter = (0, _utils.combineFilters)([attachmentFilter, filter]);
      const response = await unsecuredSavedObjectsClient.find({
        type: _constants.CASE_COMMENT_SAVED_OBJECT,
        hasReference: {
          type: _constants.CASE_SAVED_OBJECT,
          id: caseId
        },
        page: 1,
        perPage: 1,
        sortField: _utils2.defaultSortField,
        aggs: aggregations,
        filter: combinedFilter
      });
      return response.aggregations;
    } catch (error) {
      this.log.error(`Error while executing aggregation for case id ${caseId}: ${error}`);
      throw error;
    }
  }

  /**
   * Executes the aggregations against the actions attached to a case.
   */
  async executeCaseActionsAggregations(params) {
    try {
      this.log.debug(`Attempting to count actions for case id ${params.caseId}`);
      return await this.executeCaseAggregations({
        ...params,
        attachmentType: _api.CommentType.actions
      });
    } catch (error) {
      this.log.error(`Error while counting actions for case id ${params.caseId}: ${error}`);
      throw error;
    }
  }
  async get({
    unsecuredSavedObjectsClient,
    attachmentId
  }) {
    try {
      this.log.debug(`Attempting to GET attachment ${attachmentId}`);
      const res = await unsecuredSavedObjectsClient.get(_constants.CASE_COMMENT_SAVED_OBJECT, attachmentId);
      return (0, _so_references.injectAttachmentSOAttributesFromRefs)(res, this.persistableStateAttachmentTypeRegistry);
    } catch (error) {
      this.log.error(`Error on GET attachment ${attachmentId}: ${error}`);
      throw error;
    }
  }
  async delete({
    unsecuredSavedObjectsClient,
    attachmentId,
    refresh
  }) {
    try {
      this.log.debug(`Attempting to DELETE attachment ${attachmentId}`);
      return await unsecuredSavedObjectsClient.delete(_constants.CASE_COMMENT_SAVED_OBJECT, attachmentId, {
        refresh
      });
    } catch (error) {
      this.log.error(`Error on DELETE attachment ${attachmentId}: ${error}`);
      throw error;
    }
  }
  async create({
    unsecuredSavedObjectsClient,
    attributes,
    references,
    id,
    refresh
  }) {
    try {
      this.log.debug(`Attempting to POST a new comment`);
      const {
        attributes: extractedAttributes,
        references: extractedReferences
      } = (0, _so_references.extractAttachmentSORefsFromAttributes)(attributes, references, this.persistableStateAttachmentTypeRegistry);
      const attachment = await unsecuredSavedObjectsClient.create(_constants.CASE_COMMENT_SAVED_OBJECT, extractedAttributes, {
        references: extractedReferences,
        id,
        refresh
      });
      return (0, _so_references.injectAttachmentSOAttributesFromRefs)(attachment, this.persistableStateAttachmentTypeRegistry);
    } catch (error) {
      this.log.error(`Error on POST a new comment: ${error}`);
      throw error;
    }
  }
  async bulkCreate({
    unsecuredSavedObjectsClient,
    attachments,
    refresh
  }) {
    try {
      this.log.debug(`Attempting to bulk create attachments`);
      const res = await unsecuredSavedObjectsClient.bulkCreate(attachments.map(attachment => {
        const {
          attributes: extractedAttributes,
          references: extractedReferences
        } = (0, _so_references.extractAttachmentSORefsFromAttributes)(attachment.attributes, attachment.references, this.persistableStateAttachmentTypeRegistry);
        return {
          type: _constants.CASE_COMMENT_SAVED_OBJECT,
          ...attachment,
          attributes: extractedAttributes,
          references: extractedReferences
        };
      }), {
        refresh
      });
      return {
        saved_objects: res.saved_objects.map(so => {
          return (0, _so_references.injectAttachmentSOAttributesFromRefs)(so, this.persistableStateAttachmentTypeRegistry);
        })
      };
    } catch (error) {
      this.log.error(`Error on bulk create attachments: ${error}`);
      throw error;
    }
  }
  async update({
    unsecuredSavedObjectsClient,
    attachmentId,
    updatedAttributes,
    options
  }) {
    try {
      var _options$references;
      this.log.debug(`Attempting to UPDATE comment ${attachmentId}`);
      const {
        attributes: extractedAttributes,
        references: extractedReferences,
        didDeleteOperation
      } = (0, _so_references.extractAttachmentSORefsFromAttributes)(updatedAttributes, (_options$references = options === null || options === void 0 ? void 0 : options.references) !== null && _options$references !== void 0 ? _options$references : [], this.persistableStateAttachmentTypeRegistry);
      const shouldUpdateRefs = extractedReferences.length > 0 || didDeleteOperation;
      const res = await unsecuredSavedObjectsClient.update(_constants.CASE_COMMENT_SAVED_OBJECT, attachmentId, extractedAttributes, {
        ...options,
        /**
         * If options?.references are undefined and there is no field to move to the refs
         * then the extractedReferences will be an empty array. If we pass the empty array
         * on the update then all previously refs will be removed. The check below is needed
         * to prevent this.
         */
        references: shouldUpdateRefs ? extractedReferences : undefined
      });
      return (0, _so_references.injectAttachmentSOAttributesFromRefsForPatch)(updatedAttributes, res, this.persistableStateAttachmentTypeRegistry);
    } catch (error) {
      this.log.error(`Error on UPDATE comment ${attachmentId}: ${error}`);
      throw error;
    }
  }
  async bulkUpdate({
    unsecuredSavedObjectsClient,
    comments,
    refresh
  }) {
    try {
      this.log.debug(`Attempting to UPDATE comments ${comments.map(c => c.attachmentId).join(', ')}`);
      const res = await unsecuredSavedObjectsClient.bulkUpdate(comments.map(c => {
        var _c$options$references, _c$options;
        const {
          attributes: extractedAttributes,
          references: extractedReferences,
          didDeleteOperation
        } = (0, _so_references.extractAttachmentSORefsFromAttributes)(c.updatedAttributes, (_c$options$references = (_c$options = c.options) === null || _c$options === void 0 ? void 0 : _c$options.references) !== null && _c$options$references !== void 0 ? _c$options$references : [], this.persistableStateAttachmentTypeRegistry);
        const shouldUpdateRefs = extractedReferences.length > 0 || didDeleteOperation;
        return {
          ...c.options,
          type: _constants.CASE_COMMENT_SAVED_OBJECT,
          id: c.attachmentId,
          attributes: extractedAttributes,
          /* If c.options?.references are undefined and there is no field to move to the refs
           * then the extractedAttributes will be an empty array. If we pass the empty array
           * on the update then all previously refs will be removed. The check below is needed
           * to prevent this.
           */
          references: shouldUpdateRefs ? extractedReferences : undefined
        };
      }), {
        refresh
      });
      return {
        saved_objects: res.saved_objects.map((so, index) => {
          return (0, _so_references.injectAttachmentSOAttributesFromRefsForPatch)(comments[index].updatedAttributes, so, this.persistableStateAttachmentTypeRegistry);
        })
      };
    } catch (error) {
      this.log.error(`Error on UPDATE comments ${comments.map(c => c.attachmentId).join(', ')}: ${error}`);
      throw error;
    }
  }
  async getCaseCommentStats({
    unsecuredSavedObjectsClient,
    caseIds
  }) {
    var _res$aggregations$ref, _res$aggregations;
    if (caseIds.length <= 0) {
      return new Map();
    }
    const res = await unsecuredSavedObjectsClient.find({
      hasReference: caseIds.map(id => ({
        type: _constants.CASE_SAVED_OBJECT,
        id
      })),
      hasReferenceOperator: 'OR',
      type: _constants.CASE_COMMENT_SAVED_OBJECT,
      perPage: 0,
      aggs: AttachmentService.buildCommentStatsAggs(caseIds)
    });
    return (_res$aggregations$ref = (_res$aggregations = res.aggregations) === null || _res$aggregations === void 0 ? void 0 : _res$aggregations.references.caseIds.buckets.reduce((acc, idBucket) => {
      acc.set(idBucket.key, {
        userComments: idBucket.reverse.comments.doc_count,
        alerts: idBucket.reverse.alerts.value
      });
      return acc;
    }, new Map())) !== null && _res$aggregations$ref !== void 0 ? _res$aggregations$ref : new Map();
  }
  async find({
    unsecuredSavedObjectsClient,
    options
  }) {
    try {
      this.log.debug(`Attempting to find comments`);
      const res = await unsecuredSavedObjectsClient.find({
        sortField: _utils2.defaultSortField,
        ...options,
        type: _constants.CASE_COMMENT_SAVED_OBJECT
      });
      return {
        ...res,
        saved_objects: res.saved_objects.map(so => {
          const injectedSO = (0, _so_references.injectAttachmentSOAttributesFromRefs)(so, this.persistableStateAttachmentTypeRegistry);
          return {
            ...so,
            ...injectedSO
          };
        })
      };
    } catch (error) {
      this.log.error(`Error on find comments: ${error}`);
      throw error;
    }
  }
  static buildCommentStatsAggs(ids) {
    return {
      references: {
        nested: {
          path: `${_constants.CASE_COMMENT_SAVED_OBJECT}.references`
        },
        aggregations: {
          caseIds: {
            terms: {
              field: `${_constants.CASE_COMMENT_SAVED_OBJECT}.references.id`,
              size: ids.length
            },
            aggregations: {
              reverse: {
                reverse_nested: {},
                aggregations: {
                  alerts: {
                    cardinality: {
                      field: `${_constants.CASE_COMMENT_SAVED_OBJECT}.attributes.alertId`
                    }
                  },
                  comments: {
                    filter: {
                      term: {
                        [`${_constants.CASE_COMMENT_SAVED_OBJECT}.attributes.type`]: _api.CommentType.user
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  }
}
exports.AttachmentService = AttachmentService;