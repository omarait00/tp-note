"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RecoveryActionGroupId = exports.ParamsSchema = exports.GEO_CONTAINMENT_ID = exports.ActionGroupId = void 0;
exports.extractEntityAndBoundaryReferences = extractEntityAndBoundaryReferences;
exports.getAlertType = getAlertType;
exports.injectEntityAndBoundaryIds = injectEntityAndBoundaryIds;
var _i18n = require("@kbn/i18n");
var _configSchema = require("@kbn/config-schema");
var _common = require("../../../common");
var _geo_containment = require("./geo_containment");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ActionGroupId = 'Tracked entity contained';
exports.ActionGroupId = ActionGroupId;
const RecoveryActionGroupId = 'notGeoContained';
exports.RecoveryActionGroupId = RecoveryActionGroupId;
const GEO_CONTAINMENT_ID = '.geo-containment';
exports.GEO_CONTAINMENT_ID = GEO_CONTAINMENT_ID;
const actionVariables = {
  context: [
  // Alert-specific data
  {
    name: 'entityId',
    description: _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextEntityIdLabel', {
      defaultMessage: 'The entity ID of the document that triggered the alert'
    })
  }, {
    name: 'entityDateTime',
    description: _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextFromEntityDateTimeLabel', {
      defaultMessage: `The date the entity was recorded in the boundary`
    })
  }, {
    name: 'entityDocumentId',
    description: _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextFromEntityDocumentIdLabel', {
      defaultMessage: 'The id of the contained entity document'
    })
  }, {
    name: 'detectionDateTime',
    description: _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextDetectionDateTimeLabel', {
      defaultMessage: 'The alert interval end time this change was recorded'
    })
  }, {
    name: 'entityLocation',
    description: _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextFromEntityLocationLabel', {
      defaultMessage: 'The location of the entity'
    })
  }, {
    name: 'containingBoundaryId',
    description: _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextContainingBoundaryIdLabel', {
      defaultMessage: 'The id of the boundary containing the entity. Value not set for recovered alerts'
    })
  }, {
    name: 'containingBoundaryName',
    description: _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionVariableContextContainingBoundaryNameLabel', {
      defaultMessage: 'The name of the boundary containing the entity. Value not set for recovered alerts'
    })
  }]
};
const ParamsSchema = _configSchema.schema.object({
  index: _configSchema.schema.string({
    minLength: 1
  }),
  indexId: _configSchema.schema.string({
    minLength: 1
  }),
  geoField: _configSchema.schema.string({
    minLength: 1
  }),
  entity: _configSchema.schema.string({
    minLength: 1
  }),
  dateField: _configSchema.schema.string({
    minLength: 1
  }),
  boundaryType: _configSchema.schema.string({
    minLength: 1
  }),
  boundaryIndexTitle: _configSchema.schema.string({
    minLength: 1
  }),
  boundaryIndexId: _configSchema.schema.string({
    minLength: 1
  }),
  boundaryGeoField: _configSchema.schema.string({
    minLength: 1
  }),
  boundaryNameField: _configSchema.schema.maybe(_configSchema.schema.string({
    minLength: 1
  })),
  indexQuery: _configSchema.schema.maybe(_configSchema.schema.any({})),
  boundaryIndexQuery: _configSchema.schema.maybe(_configSchema.schema.any({}))
});
exports.ParamsSchema = ParamsSchema;
function extractEntityAndBoundaryReferences(params) {
  const {
    indexId,
    boundaryIndexId,
    ...otherParams
  } = params;

  //  Reference names omit the `param:`-prefix. This is handled by the alerting framework already
  const references = [{
    name: `tracked_index_${indexId}`,
    type: 'index-pattern',
    id: indexId
  }, {
    name: `boundary_index_${boundaryIndexId}`,
    type: 'index-pattern',
    id: boundaryIndexId
  }];
  return {
    params: {
      ...otherParams,
      indexRefName: `tracked_index_${indexId}`,
      boundaryIndexRefName: `boundary_index_${boundaryIndexId}`
    },
    references
  };
}
function injectEntityAndBoundaryIds(params, references) {
  const {
    indexRefName,
    boundaryIndexRefName,
    ...otherParams
  } = params;
  const {
    id: indexId = null
  } = references.find(ref => ref.name === indexRefName) || {};
  const {
    id: boundaryIndexId = null
  } = references.find(ref => ref.name === boundaryIndexRefName) || {};
  if (!indexId) {
    throw new Error(`Index "${indexId}" not found in references array`);
  }
  if (!boundaryIndexId) {
    throw new Error(`Boundary index "${boundaryIndexId}" not found in references array`);
  }
  return {
    ...otherParams,
    indexId,
    boundaryIndexId
  };
}
function getAlertType() {
  const alertTypeName = _i18n.i18n.translate('xpack.stackAlerts.geoContainment.alertTypeTitle', {
    defaultMessage: 'Tracking containment'
  });
  const actionGroupName = _i18n.i18n.translate('xpack.stackAlerts.geoContainment.actionGroupContainmentMetTitle', {
    defaultMessage: 'Tracking containment met'
  });
  return {
    id: GEO_CONTAINMENT_ID,
    name: alertTypeName,
    actionGroups: [{
      id: ActionGroupId,
      name: actionGroupName
    }],
    recoveryActionGroup: {
      id: RecoveryActionGroupId,
      name: _i18n.i18n.translate('xpack.stackAlerts.geoContainment.notGeoContained', {
        defaultMessage: 'No longer contained'
      })
    },
    doesSetRecoveryContext: true,
    defaultActionGroupId: ActionGroupId,
    executor: (0, _geo_containment.getGeoContainmentExecutor)(),
    producer: _common.STACK_ALERTS_FEATURE_ID,
    validate: {
      params: ParamsSchema
    },
    actionVariables,
    minimumLicenseRequired: 'gold',
    isExportable: true,
    useSavedObjectReferences: {
      extractReferences: params => {
        return extractEntityAndBoundaryReferences(params);
      },
      injectReferences: (params, references) => {
        return injectEntityAndBoundaryIds(params, references);
      }
    }
  };
}