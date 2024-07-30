"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdatePackagePolicySchema = exports.UpdatePackagePolicyRequestBodySchema = exports.SimplifiedCreatePackagePolicyRequestBodySchema = exports.PackagePolicySchema = exports.NewPackagePolicySchema = exports.NamespaceSchema = exports.CreatePackagePolicyRequestBodySchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _services = require("../../../common/services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const NamespaceSchema = _configSchema.schema.string({
  minLength: 1,
  validate: value => {
    const namespaceValidation = (0, _services.isValidNamespace)(value || '');
    if (!namespaceValidation.valid && namespaceValidation.error) {
      return namespaceValidation.error;
    }
  }
});
exports.NamespaceSchema = NamespaceSchema;
const ConfigRecordSchema = _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
  type: _configSchema.schema.maybe(_configSchema.schema.string()),
  value: _configSchema.schema.maybe(_configSchema.schema.any()),
  frozen: _configSchema.schema.maybe(_configSchema.schema.boolean())
}));
const PackagePolicyStreamsSchema = {
  id: _configSchema.schema.maybe(_configSchema.schema.string()),
  // BWC < 7.11
  enabled: _configSchema.schema.boolean(),
  keep_enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  release: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('ga'), _configSchema.schema.literal('beta'), _configSchema.schema.literal('experimental')])),
  data_stream: _configSchema.schema.object({
    dataset: _configSchema.schema.string(),
    type: _configSchema.schema.string(),
    elasticsearch: _configSchema.schema.maybe(_configSchema.schema.object({
      privileges: _configSchema.schema.maybe(_configSchema.schema.object({
        indices: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
      }))
    }))
  }),
  vars: _configSchema.schema.maybe(ConfigRecordSchema),
  config: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
    type: _configSchema.schema.maybe(_configSchema.schema.string()),
    value: _configSchema.schema.maybe(_configSchema.schema.any())
  }))),
  compiled_stream: _configSchema.schema.maybe(_configSchema.schema.any())
};
const PackagePolicyInputsSchema = {
  type: _configSchema.schema.string(),
  policy_template: _configSchema.schema.maybe(_configSchema.schema.string()),
  enabled: _configSchema.schema.boolean(),
  keep_enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  vars: _configSchema.schema.maybe(ConfigRecordSchema),
  config: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
    type: _configSchema.schema.maybe(_configSchema.schema.string()),
    value: _configSchema.schema.maybe(_configSchema.schema.any())
  }))),
  streams: _configSchema.schema.arrayOf(_configSchema.schema.object(PackagePolicyStreamsSchema))
};
const ExperimentalDataStreamFeatures = _configSchema.schema.arrayOf(_configSchema.schema.object({
  data_stream: _configSchema.schema.string(),
  features: _configSchema.schema.object({
    synthetic_source: _configSchema.schema.boolean(),
    tsdb: _configSchema.schema.boolean()
  })
}));
const PackagePolicyBaseSchema = {
  name: _configSchema.schema.string(),
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  namespace: NamespaceSchema,
  policy_id: _configSchema.schema.string(),
  enabled: _configSchema.schema.boolean(),
  package: _configSchema.schema.maybe(_configSchema.schema.object({
    name: _configSchema.schema.string(),
    title: _configSchema.schema.string(),
    version: _configSchema.schema.string(),
    experimental_data_stream_features: _configSchema.schema.maybe(ExperimentalDataStreamFeatures)
  })),
  // Deprecated TODO create remove issue
  output_id: _configSchema.schema.maybe(_configSchema.schema.string()),
  inputs: _configSchema.schema.arrayOf(_configSchema.schema.object(PackagePolicyInputsSchema)),
  vars: _configSchema.schema.maybe(ConfigRecordSchema)
};
const NewPackagePolicySchema = _configSchema.schema.object({
  ...PackagePolicyBaseSchema,
  id: _configSchema.schema.maybe(_configSchema.schema.string()),
  force: _configSchema.schema.maybe(_configSchema.schema.boolean())
});
exports.NewPackagePolicySchema = NewPackagePolicySchema;
const CreatePackagePolicyProps = {
  ...PackagePolicyBaseSchema,
  namespace: _configSchema.schema.maybe(NamespaceSchema),
  policy_id: _configSchema.schema.maybe(_configSchema.schema.string()),
  enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  package: _configSchema.schema.maybe(_configSchema.schema.object({
    name: _configSchema.schema.string(),
    title: _configSchema.schema.maybe(_configSchema.schema.string()),
    version: _configSchema.schema.string(),
    experimental_data_stream_features: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
      data_stream: _configSchema.schema.string(),
      features: _configSchema.schema.object({
        synthetic_source: _configSchema.schema.boolean(),
        tsdb: _configSchema.schema.boolean()
      })
    })))
  })),
  // Deprecated TODO create remove issue
  output_id: _configSchema.schema.maybe(_configSchema.schema.string()),
  inputs: _configSchema.schema.arrayOf(_configSchema.schema.object({
    ...PackagePolicyInputsSchema,
    streams: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object(PackagePolicyStreamsSchema)))
  }))
};
const CreatePackagePolicyRequestBodySchema = _configSchema.schema.object({
  ...CreatePackagePolicyProps,
  id: _configSchema.schema.maybe(_configSchema.schema.string()),
  force: _configSchema.schema.maybe(_configSchema.schema.boolean())
});
exports.CreatePackagePolicyRequestBodySchema = CreatePackagePolicyRequestBodySchema;
const SimplifiedVarsSchema = _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.nullable(_configSchema.schema.oneOf([_configSchema.schema.boolean(), _configSchema.schema.string(), _configSchema.schema.number(), _configSchema.schema.arrayOf(_configSchema.schema.string()), _configSchema.schema.arrayOf(_configSchema.schema.number())])));
const SimplifiedCreatePackagePolicyRequestBodySchema = _configSchema.schema.object({
  id: _configSchema.schema.maybe(_configSchema.schema.string()),
  name: _configSchema.schema.string(),
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  policy_id: _configSchema.schema.string(),
  namespace: _configSchema.schema.string({
    defaultValue: 'default'
  }),
  package: _configSchema.schema.object({
    name: _configSchema.schema.string(),
    version: _configSchema.schema.string(),
    experimental_data_stream_features: _configSchema.schema.maybe(ExperimentalDataStreamFeatures)
  }),
  force: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  vars: _configSchema.schema.maybe(SimplifiedVarsSchema),
  inputs: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
    enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    vars: _configSchema.schema.maybe(SimplifiedVarsSchema),
    streams: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
      enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
      vars: _configSchema.schema.maybe(SimplifiedVarsSchema)
    })))
  })))
});
exports.SimplifiedCreatePackagePolicyRequestBodySchema = SimplifiedCreatePackagePolicyRequestBodySchema;
const UpdatePackagePolicyRequestBodySchema = _configSchema.schema.object({
  ...CreatePackagePolicyProps,
  name: _configSchema.schema.maybe(_configSchema.schema.string()),
  inputs: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    ...PackagePolicyInputsSchema,
    streams: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object(PackagePolicyStreamsSchema)))
  }))),
  version: _configSchema.schema.maybe(_configSchema.schema.string()),
  force: _configSchema.schema.maybe(_configSchema.schema.boolean())
});
exports.UpdatePackagePolicyRequestBodySchema = UpdatePackagePolicyRequestBodySchema;
const UpdatePackagePolicySchema = _configSchema.schema.object({
  ...PackagePolicyBaseSchema,
  version: _configSchema.schema.maybe(_configSchema.schema.string())
});
exports.UpdatePackagePolicySchema = UpdatePackagePolicySchema;
const PackagePolicySchema = _configSchema.schema.object({
  ...PackagePolicyBaseSchema,
  id: _configSchema.schema.string(),
  version: _configSchema.schema.maybe(_configSchema.schema.string()),
  revision: _configSchema.schema.number(),
  updated_at: _configSchema.schema.string(),
  updated_by: _configSchema.schema.string(),
  created_at: _configSchema.schema.string(),
  created_by: _configSchema.schema.string(),
  elasticsearch: _configSchema.schema.maybe(_configSchema.schema.object({
    privileges: _configSchema.schema.maybe(_configSchema.schema.object({
      cluster: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
    }))
  })),
  inputs: _configSchema.schema.arrayOf(_configSchema.schema.object({
    ...PackagePolicyInputsSchema,
    compiled_input: _configSchema.schema.maybe(_configSchema.schema.any())
  }))
});
exports.PackagePolicySchema = PackagePolicySchema;