"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleType = getRuleType;
var _i18n = require("@kbn/i18n");
var _common = require("../../../../../../src/plugins/data/common");
var _rule_type_params = require("./rule_type_params");
var _common2 = require("../../../common");
var _constants = require("./constants");
var _executor = require("./executor");
var _util = require("./util");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getRuleType(core) {
  const ruleTypeName = _i18n.i18n.translate('xpack.stackAlerts.esQuery.alertTypeTitle', {
    defaultMessage: 'Elasticsearch query'
  });
  const actionGroupName = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionGroupThresholdMetTitle', {
    defaultMessage: 'Query matched'
  });
  const actionVariableContextDateLabel = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionVariableContextDateLabel', {
    defaultMessage: 'The date that the alert met the threshold condition.'
  });
  const actionVariableContextValueLabel = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionVariableContextValueLabel', {
    defaultMessage: 'The value that met the threshold condition.'
  });
  const actionVariableContextHitsLabel = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionVariableContextHitsLabel', {
    defaultMessage: 'The documents that met the threshold condition.'
  });
  const actionVariableContextMessageLabel = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionVariableContextMessageLabel', {
    defaultMessage: 'A message for the alert.'
  });
  const actionVariableContextTitleLabel = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionVariableContextTitleLabel', {
    defaultMessage: 'A title for the alert.'
  });
  const actionVariableContextIndexLabel = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionVariableContextIndexLabel', {
    defaultMessage: 'The index the query was run against.'
  });
  const actionVariableContextQueryLabel = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionVariableContextQueryLabel', {
    defaultMessage: 'The string representation of the Elasticsearch query.'
  });
  const actionVariableContextSizeLabel = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionVariableContextSizeLabel', {
    defaultMessage: 'The number of hits to retrieve for each query.'
  });
  const actionVariableContextThresholdLabel = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionVariableContextThresholdLabel', {
    defaultMessage: "An array of values to use as the threshold. 'between' and 'notBetween' require two values."
  });
  const actionVariableContextThresholdComparatorLabel = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionVariableContextThresholdComparatorLabel', {
    defaultMessage: 'A function to determine if the threshold was met.'
  });
  const actionVariableContextConditionsLabel = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionVariableContextConditionsLabel', {
    defaultMessage: 'A string that describes the threshold condition.'
  });
  const actionVariableSearchConfigurationLabel = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionVariableContextSearchConfigurationLabel', {
    defaultMessage: 'Serialized search source fields used to fetch the documents from Elasticsearch.'
  });
  const actionVariableContextLinkLabel = _i18n.i18n.translate('xpack.stackAlerts.esQuery.actionVariableContextLinkLabel', {
    defaultMessage: `Navigate to Discover and show the records that triggered
       the alert when the rule is created in Discover. Otherwise, navigate to the status page for the rule.`
  });
  return {
    id: _constants.ES_QUERY_ID,
    name: ruleTypeName,
    actionGroups: [{
      id: _constants.ActionGroupId,
      name: actionGroupName
    }],
    defaultActionGroupId: _constants.ActionGroupId,
    validate: {
      params: _rule_type_params.EsQueryRuleParamsSchema
    },
    actionVariables: {
      context: [{
        name: 'message',
        description: actionVariableContextMessageLabel
      }, {
        name: 'title',
        description: actionVariableContextTitleLabel
      }, {
        name: 'date',
        description: actionVariableContextDateLabel
      }, {
        name: 'value',
        description: actionVariableContextValueLabel
      }, {
        name: 'hits',
        description: actionVariableContextHitsLabel
      }, {
        name: 'conditions',
        description: actionVariableContextConditionsLabel
      }, {
        name: 'link',
        description: actionVariableContextLinkLabel
      }],
      params: [{
        name: 'size',
        description: actionVariableContextSizeLabel
      }, {
        name: 'threshold',
        description: actionVariableContextThresholdLabel
      }, {
        name: 'thresholdComparator',
        description: actionVariableContextThresholdComparatorLabel
      }, {
        name: 'searchConfiguration',
        description: actionVariableSearchConfigurationLabel
      }, {
        name: 'esQuery',
        description: actionVariableContextQueryLabel
      }, {
        name: 'index',
        description: actionVariableContextIndexLabel
      }]
    },
    useSavedObjectReferences: {
      extractReferences: params => {
        if ((0, _util.isEsQueryRule)(params.searchType)) {
          return {
            params: params,
            references: []
          };
        }
        const [searchConfiguration, references] = (0, _common.extractReferences)(params.searchConfiguration);
        const newParams = {
          ...params,
          searchConfiguration
        };
        return {
          params: newParams,
          references
        };
      },
      injectReferences: (params, references) => {
        if ((0, _util.isEsQueryRule)(params.searchType)) {
          return params;
        }
        return {
          ...params,
          searchConfiguration: (0, _common.injectReferences)(params.searchConfiguration, references)
        };
      }
    },
    minimumLicenseRequired: 'basic',
    isExportable: true,
    executor: async options => {
      return await (0, _executor.executor)(core, options);
    },
    producer: _common2.STACK_ALERTS_FEATURE_ID,
    doesSetRecoveryContext: true
  };
}