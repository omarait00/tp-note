"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStaticDataView = createStaticDataView;
var _server = require("../../../../../../src/core/server");
var _i18n = require("@kbn/i18n");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _data_view_constants = require("../../../common/data_view_constants");
var _has_historical_agent_data = require("../historical_data/has_historical_agent_data");
var _with_apm_span = require("../../utils/with_apm_span");
var _get_apm_data_view_title = require("./get_apm_data_view_title");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function createStaticDataView({
  dataViewService,
  resources,
  apmEventClient
}) {
  const {
    config
  } = resources;
  return (0, _with_apm_span.withApmSpan)('create_static_data_view', async () => {
    // don't auto-create APM data view if it's been disabled via the config
    if (!config.autoCreateApmDataView) {
      return {
        created: false,
        reason: _i18n.i18n.translate('xpack.apm.dataView.autoCreateDisabled', {
          defaultMessage: 'Auto-creation of data views has been disabled via "autoCreateApmDataView" config option'
        })
      };
    }

    // Discover and other apps will throw errors if an data view exists without having matching indices.
    // The following ensures the data view is only created if APM data is found
    const hasData = await (0, _has_historical_agent_data.hasHistoricalAgentData)(apmEventClient);
    if (!hasData) {
      return {
        created: false,
        reason: _i18n.i18n.translate('xpack.apm.dataView.noApmData', {
          defaultMessage: 'No APM data'
        })
      };
    }
    const apmDataViewTitle = (0, _get_apm_data_view_title.getApmDataViewTitle)(apmEventClient.indices);
    const shouldCreateOrUpdate = await getShouldCreateOrUpdate({
      apmDataViewTitle,
      dataViewService
    });
    if (!shouldCreateOrUpdate) {
      return {
        created: false,
        reason: _i18n.i18n.translate('xpack.apm.dataView.alreadyExistsInActiveSpace', {
          defaultMessage: 'Dataview already exists in the active space'
        })
      };
    }
    return await (0, _with_apm_span.withApmSpan)('create_data_view', async () => {
      try {
        const dataView = await createAndSaveStaticDataView({
          dataViewService,
          apmDataViewTitle
        });
        await addDataViewToAllSpaces(resources);
        return {
          created: true,
          dataView
        };
      } catch (e) {
        // if the data view (saved object) already exists a conflict error (code: 409) will be thrown
        if (_server.SavedObjectsErrorHelpers.isConflictError(e)) {
          return {
            created: false,
            reason: _i18n.i18n.translate('xpack.apm.dataView.alreadyExistsInAnotherSpace', {
              defaultMessage: 'Dataview already exists in another space but is not made available in this space'
            })
          };
        }
        throw e;
      }
    });
  });
}

// only create data view if it doesn't exist or was changed
async function getShouldCreateOrUpdate({
  dataViewService,
  apmDataViewTitle
}) {
  try {
    const existingDataView = await dataViewService.get(_data_view_constants.APM_STATIC_DATA_VIEW_ID);
    return existingDataView.title !== apmDataViewTitle;
  } catch (e) {
    // ignore exception if the data view (saved object) is not found
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
      return true;
    }
    throw e;
  }
}
async function addDataViewToAllSpaces(resources) {
  const {
    request,
    core
  } = resources;
  const startServices = await core.start();
  const scopedClient = startServices.savedObjects.getScopedClient(request);

  // make data view available across all spaces
  return scopedClient.updateObjectsSpaces([{
    id: _data_view_constants.APM_STATIC_DATA_VIEW_ID,
    type: 'index-pattern'
  }], ['*'], []);
}
function createAndSaveStaticDataView({
  dataViewService,
  apmDataViewTitle
}) {
  return dataViewService.createAndSave({
    allowNoIndex: true,
    id: _data_view_constants.APM_STATIC_DATA_VIEW_ID,
    name: 'APM',
    title: apmDataViewTitle,
    timeFieldName: '@timestamp',
    // link to APM from Discover
    fieldFormats: {
      [_elasticsearch_fieldnames.TRACE_ID]: {
        id: 'url',
        params: {
          urlTemplate: 'apm/link-to/trace/{{value}}',
          labelTemplate: '{{value}}'
        }
      },
      [_elasticsearch_fieldnames.TRANSACTION_ID]: {
        id: 'url',
        params: {
          urlTemplate: 'apm/link-to/transaction/{{value}}',
          labelTemplate: '{{value}}'
        }
      },
      [_elasticsearch_fieldnames.TRANSACTION_DURATION]: {
        id: 'duration',
        params: {
          inputFormat: 'microseconds',
          outputFormat: 'asMilliseconds',
          showSuffix: true,
          useShortSuffix: true,
          outputPrecision: 2,
          includeSpaceWithSuffix: true
        }
      }
    }
  }, true);
}