"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outputIdToUuid = outputIdToUuid;
exports.outputService = void 0;
var _v = _interopRequireDefault(require("uuid/v5"));
var _lodash = require("lodash");
var _constants = require("../constants");
var _constants2 = require("../../common/constants");
var _services = require("../../common/services");
var _errors = require("../errors");
var _agent_policy = require("./agent_policy");
var _app_context = require("./app_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SAVED_OBJECT_TYPE = _constants.OUTPUT_SAVED_OBJECT_TYPE;
const DEFAULT_ES_HOSTS = ['http://localhost:9200'];
const fakeRequest = {
  headers: {},
  getBasePath: () => '',
  path: '/',
  route: {
    settings: {}
  },
  url: {
    href: '/'
  },
  raw: {
    req: {
      url: '/'
    }
  }
};

// differentiate
function isUUID(val) {
  return typeof val === 'string' && val.match(/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/);
}
function outputIdToUuid(id) {
  if (isUUID(id)) {
    return id;
  }

  // UUID v5 need a namespace (uuid.DNS), changing this params will result in loosing the ability to generate predicable uuid
  return (0, _v.default)(id, _v.default.DNS);
}
function outputSavedObjectToOutput(so) {
  const {
    output_id: outputId,
    ssl,
    ...atributes
  } = so.attributes;
  return {
    id: outputId !== null && outputId !== void 0 ? outputId : so.id,
    ...atributes,
    ...(ssl ? {
      ssl: JSON.parse(ssl)
    } : {})
  };
}
async function validateLogstashOutputNotUsedInAPMPolicy(soClient, outputId, isDefault) {
  // Validate no policy with APM use that policy
  let kuery;
  if (outputId) {
    if (isDefault) {
      kuery = `${_constants.AGENT_POLICY_SAVED_OBJECT_TYPE}.data_output_id:"${outputId}" or not ${_constants.AGENT_POLICY_SAVED_OBJECT_TYPE}.data_output_id:*`;
    } else {
      kuery = `${_constants.AGENT_POLICY_SAVED_OBJECT_TYPE}.data_output_id:"${outputId}"`;
    }
  } else {
    if (isDefault) {
      kuery = `not ${_constants.AGENT_POLICY_SAVED_OBJECT_TYPE}.data_output_id:*`;
    } else {
      return;
    }
  }
  const agentPolicySO = await _agent_policy.agentPolicyService.list(soClient, {
    kuery,
    perPage: _constants2.SO_SEARCH_LIMIT,
    withPackagePolicies: true
  });
  for (const agentPolicy of agentPolicySO.items) {
    if (_agent_policy.agentPolicyService.hasAPMIntegration(agentPolicy)) {
      throw new _errors.OutputInvalidError('Logstash output cannot be used with APM integration.');
    }
  }
}
class OutputService {
  get encryptedSoClient() {
    return _app_context.appContextService.getInternalUserSOClient(fakeRequest);
  }
  async _getDefaultDataOutputsSO(soClient) {
    return await this.encryptedSoClient.find({
      type: _constants.OUTPUT_SAVED_OBJECT_TYPE,
      searchFields: ['is_default'],
      search: 'true'
    });
  }
  async _getDefaultMonitoringOutputsSO(soClient) {
    return await this.encryptedSoClient.find({
      type: _constants.OUTPUT_SAVED_OBJECT_TYPE,
      searchFields: ['is_default_monitoring'],
      search: 'true'
    });
  }
  async ensureDefaultOutput(soClient) {
    const outputs = await this.list(soClient);
    const defaultOutput = outputs.items.find(o => o.is_default);
    const defaultMonitoringOutput = outputs.items.find(o => o.is_default_monitoring);
    if (!defaultOutput) {
      const newDefaultOutput = {
        ..._constants.DEFAULT_OUTPUT,
        hosts: this.getDefaultESHosts(),
        ca_sha256: _app_context.appContextService.getConfig().agents.elasticsearch.ca_sha256,
        is_default_monitoring: !defaultMonitoringOutput
      };
      return await this.create(soClient, newDefaultOutput, {
        id: _constants.DEFAULT_OUTPUT_ID,
        overwrite: true
      });
    }
    return defaultOutput;
  }
  getDefaultESHosts() {
    var _decodeCloudId, _agents, _agents$elasticsearch, _agents$elasticsearch2;
    const cloud = _app_context.appContextService.getCloud();
    const cloudId = (cloud === null || cloud === void 0 ? void 0 : cloud.isCloudEnabled) && cloud.cloudId;
    const cloudUrl = cloudId && ((_decodeCloudId = (0, _services.decodeCloudId)(cloudId)) === null || _decodeCloudId === void 0 ? void 0 : _decodeCloudId.elasticsearchUrl);
    const cloudHosts = cloudUrl ? [cloudUrl] : undefined;
    const flagHosts = (_agents = _app_context.appContextService.getConfig().agents) !== null && _agents !== void 0 && (_agents$elasticsearch = _agents.elasticsearch) !== null && _agents$elasticsearch !== void 0 && _agents$elasticsearch.hosts && (_agents$elasticsearch2 = _app_context.appContextService.getConfig().agents.elasticsearch.hosts) !== null && _agents$elasticsearch2 !== void 0 && _agents$elasticsearch2.length ? _app_context.appContextService.getConfig().agents.elasticsearch.hosts : undefined;
    return cloudHosts || flagHosts || DEFAULT_ES_HOSTS;
  }
  async getDefaultDataOutputId(soClient) {
    const outputs = await this._getDefaultDataOutputsSO(soClient);
    if (!outputs.saved_objects.length) {
      return null;
    }
    return outputSavedObjectToOutput(outputs.saved_objects[0]).id;
  }
  async getDefaultMonitoringOutputId(soClient) {
    const outputs = await this._getDefaultMonitoringOutputsSO(soClient);
    if (!outputs.saved_objects.length) {
      return null;
    }
    return outputSavedObjectToOutput(outputs.saved_objects[0]).id;
  }
  async create(soClient, output, options) {
    const data = {
      ...(0, _lodash.omit)(output, 'ssl')
    };
    if (output.type === _constants2.outputType.Logstash) {
      var _appContextService$ge;
      await validateLogstashOutputNotUsedInAPMPolicy(soClient, undefined, data.is_default);
      if (!((_appContextService$ge = _app_context.appContextService.getEncryptedSavedObjectsSetup()) !== null && _appContextService$ge !== void 0 && _appContextService$ge.canEncrypt)) {
        throw new _errors.FleetEncryptedSavedObjectEncryptionKeyRequired('Logstash output needs encrypted saved object api key to be set');
      }
    }

    // ensure only default output exists
    if (data.is_default) {
      const defaultDataOuputId = await this.getDefaultDataOutputId(soClient);
      if (defaultDataOuputId) {
        var _options$fromPreconfi;
        await this.update(soClient, defaultDataOuputId, {
          is_default: false
        }, {
          fromPreconfiguration: (_options$fromPreconfi = options === null || options === void 0 ? void 0 : options.fromPreconfiguration) !== null && _options$fromPreconfi !== void 0 ? _options$fromPreconfi : false
        });
      }
    }
    if (data.is_default_monitoring) {
      const defaultMonitoringOutputId = await this.getDefaultMonitoringOutputId(soClient);
      if (defaultMonitoringOutputId) {
        var _options$fromPreconfi2;
        await this.update(soClient, defaultMonitoringOutputId, {
          is_default_monitoring: false
        }, {
          fromPreconfiguration: (_options$fromPreconfi2 = options === null || options === void 0 ? void 0 : options.fromPreconfiguration) !== null && _options$fromPreconfi2 !== void 0 ? _options$fromPreconfi2 : false
        });
      }
    }
    if (data.type === _constants2.outputType.Elasticsearch && data.hosts) {
      data.hosts = data.hosts.map(_services.normalizeHostsForAgents);
    }
    if (options !== null && options !== void 0 && options.id) {
      data.output_id = options === null || options === void 0 ? void 0 : options.id;
    }
    if (output.ssl) {
      data.ssl = JSON.stringify(output.ssl);
    }
    const newSo = await this.encryptedSoClient.create(SAVED_OBJECT_TYPE, data, {
      overwrite: (options === null || options === void 0 ? void 0 : options.overwrite) || (options === null || options === void 0 ? void 0 : options.fromPreconfiguration),
      id: options !== null && options !== void 0 && options.id ? outputIdToUuid(options.id) : undefined
    });
    return outputSavedObjectToOutput(newSo);
  }
  async bulkGet(soClient, ids, {
    ignoreNotFound = false
  } = {
    ignoreNotFound: true
  }) {
    const res = await this.encryptedSoClient.bulkGet(ids.map(id => ({
      id: outputIdToUuid(id),
      type: SAVED_OBJECT_TYPE
    })));
    return res.saved_objects.map(so => {
      if (so.error) {
        if (!ignoreNotFound || so.error.statusCode !== 404) {
          throw so.error;
        }
        return undefined;
      }
      return outputSavedObjectToOutput(so);
    }).filter(output => typeof output !== 'undefined');
  }
  async list(soClient) {
    const outputs = await this.encryptedSoClient.find({
      type: SAVED_OBJECT_TYPE,
      page: 1,
      perPage: _constants2.SO_SEARCH_LIMIT,
      sortField: 'is_default',
      sortOrder: 'desc'
    });
    return {
      items: outputs.saved_objects.map(outputSavedObjectToOutput),
      total: outputs.total,
      page: outputs.page,
      perPage: outputs.per_page
    };
  }
  async get(soClient, id) {
    const outputSO = await this.encryptedSoClient.get(SAVED_OBJECT_TYPE, outputIdToUuid(id));
    if (outputSO.error) {
      throw new Error(outputSO.error.message);
    }
    return outputSavedObjectToOutput(outputSO);
  }
  async delete(soClient, id, {
    fromPreconfiguration = false
  } = {
    fromPreconfiguration: false
  }) {
    const originalOutput = await this.get(soClient, id);
    if (originalOutput.is_preconfigured && !fromPreconfiguration) {
      throw new _errors.OutputUnauthorizedError(`Preconfigured output ${id} cannot be deleted outside of kibana config file.`);
    }
    if (originalOutput.is_default && !fromPreconfiguration) {
      throw new _errors.OutputUnauthorizedError(`Default output ${id} cannot be deleted.`);
    }
    if (originalOutput.is_default_monitoring && !fromPreconfiguration) {
      throw new _errors.OutputUnauthorizedError(`Default monitoring output ${id} cannot be deleted.`);
    }
    await _agent_policy.agentPolicyService.removeOutputFromAll(soClient, _app_context.appContextService.getInternalUserESClient(), id);
    return this.encryptedSoClient.delete(SAVED_OBJECT_TYPE, outputIdToUuid(id));
  }
  async update(soClient, id, data, {
    fromPreconfiguration = false
  } = {
    fromPreconfiguration: false
  }) {
    var _data$type, _data$is_default;
    const originalOutput = await this.get(soClient, id);
    if (originalOutput.is_preconfigured && !fromPreconfiguration) {
      throw new _errors.OutputUnauthorizedError(`Preconfigured output ${id} cannot be updated outside of kibana config file.`);
    }
    const updateData = {
      ...(0, _lodash.omit)(data, 'ssl')
    };
    const mergedType = (_data$type = data.type) !== null && _data$type !== void 0 ? _data$type : originalOutput.type;
    const mergedIsDefault = (_data$is_default = data.is_default) !== null && _data$is_default !== void 0 ? _data$is_default : originalOutput.is_default;
    if (mergedType === _constants2.outputType.Logstash) {
      await validateLogstashOutputNotUsedInAPMPolicy(soClient, id, mergedIsDefault);
    }

    // If the output type changed
    if (data.type && data.type !== originalOutput.type) {
      if (data.type === _constants2.outputType.Logstash) {
        // remove ES specific field
        updateData.ca_trusted_fingerprint = null;
        updateData.ca_sha256 = null;
      } else {
        // remove logstash specific field
        updateData.ssl = null;
      }
    }
    if (data.ssl) {
      updateData.ssl = JSON.stringify(data.ssl);
    } else if (data.ssl === null) {
      // Explicitly set to null to allow to delete the field
      updateData.ssl = null;
    }

    // ensure only default output exists
    if (data.is_default) {
      const defaultDataOuputId = await this.getDefaultDataOutputId(soClient);
      if (defaultDataOuputId && defaultDataOuputId !== id) {
        await this.update(soClient, defaultDataOuputId, {
          is_default: false
        }, {
          fromPreconfiguration
        });
      }
    }
    if (data.is_default_monitoring) {
      const defaultMonitoringOutputId = await this.getDefaultMonitoringOutputId(soClient);
      if (defaultMonitoringOutputId && defaultMonitoringOutputId !== id) {
        await this.update(soClient, defaultMonitoringOutputId, {
          is_default_monitoring: false
        }, {
          fromPreconfiguration
        });
      }
    }
    if (mergedType === _constants2.outputType.Elasticsearch && updateData.hosts) {
      updateData.hosts = updateData.hosts.map(_services.normalizeHostsForAgents);
    }
    const outputSO = await this.encryptedSoClient.update(SAVED_OBJECT_TYPE, outputIdToUuid(id), updateData);
    if (outputSO.error) {
      throw new Error(outputSO.error.message);
    }
  }
}
const outputService = new OutputService();
exports.outputService = outputService;