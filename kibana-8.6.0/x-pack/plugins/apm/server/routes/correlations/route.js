"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.correlationsRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _i18n = require("@kbn/i18n");
var _ioTsUtils = require("@kbn/io-ts-utils");
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _license_check = require("../../../common/license_check");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _default_api_types = require("../default_api_types");
var _fetch_duration_field_candidates = require("./queries/fetch_duration_field_candidates");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _fetch_field_value_field_stats = require("./queries/field_stats/fetch_field_value_field_stats");
var _fetch_field_value_pairs = require("./queries/fetch_field_value_pairs");
var _fetch_significant_correlations = require("./queries/fetch_significant_correlations");
var _fetch_p_values = require("./queries/fetch_p_values");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const INVALID_LICENSE = _i18n.i18n.translate('xpack.apm.correlations.license.text', {
  defaultMessage: 'To use the correlations API, you must be subscribed to an Elastic Platinum license.'
});
const fieldCandidatesTransactionsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/correlations/field_candidates/transactions',
  params: t.type({
    query: t.intersection([t.partial({
      serviceName: t.string,
      transactionName: t.string,
      transactionType: t.string
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context
    } = resources;
    const {
      license
    } = await context.licensing;
    if (!(0, _license_check.isActivePlatinumLicense)(license)) {
      throw _boom.default.forbidden(INVALID_LICENSE);
    }
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      query: {
        serviceName,
        transactionName,
        transactionType,
        start,
        end,
        environment,
        kuery
      }
    } = resources.params;
    return (0, _fetch_duration_field_candidates.fetchDurationFieldCandidates)({
      eventType: _common.ProcessorEvent.transaction,
      start,
      end,
      environment,
      kuery,
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_NAME, transactionName)]
        }
      },
      apmEventClient
    });
  }
});
const fieldValueStatsTransactionsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/correlations/field_value_stats/transactions',
  params: t.type({
    query: t.intersection([t.partial({
      serviceName: t.string,
      transactionName: t.string,
      transactionType: t.string,
      samplerShardSize: t.string
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.type({
      fieldName: t.string,
      fieldValue: t.union([t.string, t.number])
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context
    } = resources;
    const {
      license
    } = await context.licensing;
    if (!(0, _license_check.isActivePlatinumLicense)(license)) {
      throw _boom.default.forbidden(INVALID_LICENSE);
    }
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      query: {
        serviceName,
        transactionName,
        transactionType,
        start,
        end,
        environment,
        kuery,
        fieldName,
        fieldValue,
        samplerShardSize: samplerShardSizeStr
      }
    } = resources.params;
    const samplerShardSize = samplerShardSizeStr ? parseInt(samplerShardSizeStr, 10) : undefined;
    return (0, _fetch_field_value_field_stats.fetchFieldValueFieldStats)({
      apmEventClient,
      eventType: _common.ProcessorEvent.transaction,
      start,
      end,
      environment,
      kuery,
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_NAME, transactionName)]
        }
      },
      field: {
        fieldName,
        fieldValue
      },
      samplerShardSize
    });
  }
});
const fieldValuePairsTransactionsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/correlations/field_value_pairs/transactions',
  params: t.type({
    body: t.intersection([t.partial({
      serviceName: t.string,
      transactionName: t.string,
      transactionType: t.string
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.type({
      fieldCandidates: t.array(t.string)
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context
    } = resources;
    const {
      license
    } = await context.licensing;
    if (!(0, _license_check.isActivePlatinumLicense)(license)) {
      throw _boom.default.forbidden(INVALID_LICENSE);
    }
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      body: {
        serviceName,
        transactionName,
        transactionType,
        start,
        end,
        environment,
        kuery,
        fieldCandidates
      }
    } = resources.params;
    return (0, _fetch_field_value_pairs.fetchFieldValuePairs)({
      apmEventClient,
      eventType: _common.ProcessorEvent.transaction,
      start,
      end,
      environment,
      kuery,
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_NAME, transactionName)]
        }
      },
      fieldCandidates
    });
  }
});
const significantCorrelationsTransactionsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/correlations/significant_correlations/transactions',
  params: t.type({
    body: t.intersection([t.partial({
      serviceName: t.string,
      transactionName: t.string,
      transactionType: t.string,
      durationMin: _ioTsUtils.toNumberRt,
      durationMax: _ioTsUtils.toNumberRt
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.type({
      fieldValuePairs: t.array(t.type({
        fieldName: t.string,
        fieldValue: t.union([t.string, _ioTsUtils.toNumberRt])
      }))
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      body: {
        serviceName,
        transactionName,
        transactionType,
        start,
        end,
        environment,
        kuery,
        durationMin,
        durationMax,
        fieldValuePairs
      }
    } = resources.params;
    return (0, _fetch_significant_correlations.fetchSignificantCorrelations)({
      apmEventClient,
      start,
      end,
      environment,
      kuery,
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_NAME, transactionName)]
        }
      },
      durationMinOverride: durationMin,
      durationMaxOverride: durationMax,
      fieldValuePairs
    });
  }
});
const pValuesTransactionsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/correlations/p_values/transactions',
  params: t.type({
    body: t.intersection([t.partial({
      serviceName: t.string,
      transactionName: t.string,
      transactionType: t.string,
      durationMin: _ioTsUtils.toNumberRt,
      durationMax: _ioTsUtils.toNumberRt
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.type({
      fieldCandidates: t.array(t.string)
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      body: {
        serviceName,
        transactionName,
        transactionType,
        start,
        end,
        environment,
        kuery,
        durationMin,
        durationMax,
        fieldCandidates
      }
    } = resources.params;
    return (0, _fetch_p_values.fetchPValues)({
      apmEventClient,
      start,
      end,
      environment,
      kuery,
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_NAME, transactionName)]
        }
      },
      durationMin,
      durationMax,
      fieldCandidates
    });
  }
});
const correlationsRouteRepository = {
  ...fieldCandidatesTransactionsRoute,
  ...fieldValueStatsTransactionsRoute,
  ...fieldValuePairsTransactionsRoute,
  ...significantCorrelationsTransactionsRoute,
  ...pValuesTransactionsRoute
};
exports.correlationsRouteRepository = correlationsRouteRepository;