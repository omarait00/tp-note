"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEncryptedSavedObjects = registerEncryptedSavedObjects;
exports.registerSavedObjects = registerSavedObjects;
var _constants = require("../constants");
var _to_v7_10_ = require("./migrations/to_v7_10_0");
var _to_v7_11_ = require("./migrations/to_v7_11_0");
var _to_v7_12_ = require("./migrations/to_v7_12_0");
var _to_v7_13_ = require("./migrations/to_v7_13_0");
var _to_v7_14_ = require("./migrations/to_v7_14_0");
var _to_v7_15_ = require("./migrations/to_v7_15_0");
var _to_v7_16_ = require("./migrations/to_v7_16_0");
var _to_v8_0_ = require("./migrations/to_v8_0_0");
var _to_v8_2_ = require("./migrations/to_v8_2_0");
var _to_v8_3_ = require("./migrations/to_v8_3_0");
var _to_v8_4_ = require("./migrations/to_v8_4_0");
var _to_v8_5_ = require("./migrations/to_v8_5_0");
var _to_v8_6_ = require("./migrations/to_v8_6_0");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Saved object types and mappings
 *
 * Please update typings in `/common/types` as well as
 * schemas in `/server/types` if mappings are updated.
 */
const getSavedObjectTypes = encryptedSavedObjects => ({
  // Deprecated
  [_constants.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE]: {
    name: _constants.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        fleet_server_hosts: {
          type: 'keyword'
        },
        has_seen_add_data_notice: {
          type: 'boolean',
          index: false
        },
        prerelease_integrations_enabled: {
          type: 'boolean'
        }
      }
    },
    migrations: {
      '7.10.0': _to_v7_10_.migrateSettingsToV7100,
      '7.13.0': _to_v7_13_.migrateSettingsToV7130,
      '8.6.0': _to_v8_6_.migrateSettingsToV860
    }
  },
  [_constants.AGENT_POLICY_SAVED_OBJECT_TYPE]: {
    name: _constants.AGENT_POLICY_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        name: {
          type: 'keyword'
        },
        schema_version: {
          type: 'version'
        },
        description: {
          type: 'text'
        },
        namespace: {
          type: 'keyword'
        },
        is_managed: {
          type: 'boolean'
        },
        is_default: {
          type: 'boolean'
        },
        is_default_fleet_server: {
          type: 'boolean'
        },
        status: {
          type: 'keyword'
        },
        unenroll_timeout: {
          type: 'integer'
        },
        updated_at: {
          type: 'date'
        },
        updated_by: {
          type: 'keyword'
        },
        revision: {
          type: 'integer'
        },
        monitoring_enabled: {
          type: 'keyword',
          index: false
        },
        is_preconfigured: {
          type: 'keyword'
        },
        data_output_id: {
          type: 'keyword'
        },
        monitoring_output_id: {
          type: 'keyword'
        },
        download_source_id: {
          type: 'keyword'
        },
        fleet_server_host_id: {
          type: 'keyword'
        }
      }
    },
    migrations: {
      '7.10.0': _to_v7_10_.migrateAgentPolicyToV7100,
      '7.12.0': _to_v7_12_.migrateAgentPolicyToV7120,
      '8.4.0': _to_v8_4_.migrateAgentPolicyToV840,
      '8.5.0': _to_v8_5_.migrateAgentPolicyToV850
    }
  },
  [_constants.OUTPUT_SAVED_OBJECT_TYPE]: {
    name: _constants.OUTPUT_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        output_id: {
          type: 'keyword',
          index: false
        },
        name: {
          type: 'keyword'
        },
        type: {
          type: 'keyword'
        },
        is_default: {
          type: 'boolean'
        },
        is_default_monitoring: {
          type: 'boolean'
        },
        hosts: {
          type: 'keyword'
        },
        ca_sha256: {
          type: 'keyword',
          index: false
        },
        ca_trusted_fingerprint: {
          type: 'keyword',
          index: false
        },
        config: {
          type: 'flattened'
        },
        config_yaml: {
          type: 'text'
        },
        is_preconfigured: {
          type: 'boolean',
          index: false
        },
        ssl: {
          type: 'binary'
        }
      }
    },
    migrations: {
      '7.13.0': _to_v7_13_.migrateOutputToV7130,
      '8.0.0': _to_v8_0_.migrateOutputToV800
    }
  },
  [_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE]: {
    name: _constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        name: {
          type: 'keyword'
        },
        description: {
          type: 'text'
        },
        namespace: {
          type: 'keyword'
        },
        enabled: {
          type: 'boolean'
        },
        is_managed: {
          type: 'boolean'
        },
        policy_id: {
          type: 'keyword'
        },
        package: {
          properties: {
            name: {
              type: 'keyword'
            },
            title: {
              type: 'keyword'
            },
            version: {
              type: 'keyword'
            }
          }
        },
        elasticsearch: {
          enabled: false,
          properties: {
            privileges: {
              properties: {
                cluster: {
                  type: 'keyword'
                }
              }
            }
          }
        },
        vars: {
          type: 'flattened'
        },
        inputs: {
          type: 'nested',
          enabled: false,
          properties: {
            type: {
              type: 'keyword'
            },
            policy_template: {
              type: 'keyword'
            },
            enabled: {
              type: 'boolean'
            },
            vars: {
              type: 'flattened'
            },
            config: {
              type: 'flattened'
            },
            compiled_input: {
              type: 'flattened'
            },
            streams: {
              type: 'nested',
              properties: {
                id: {
                  type: 'keyword'
                },
                enabled: {
                  type: 'boolean'
                },
                data_stream: {
                  properties: {
                    dataset: {
                      type: 'keyword'
                    },
                    type: {
                      type: 'keyword'
                    },
                    elasticsearch: {
                      properties: {
                        privileges: {
                          type: 'flattened'
                        }
                      }
                    }
                  }
                },
                vars: {
                  type: 'flattened'
                },
                config: {
                  type: 'flattened'
                },
                compiled_stream: {
                  type: 'flattened'
                }
              }
            }
          }
        },
        revision: {
          type: 'integer'
        },
        updated_at: {
          type: 'date'
        },
        updated_by: {
          type: 'keyword'
        },
        created_at: {
          type: 'date'
        },
        created_by: {
          type: 'keyword'
        }
      }
    },
    migrations: {
      '7.10.0': _to_v7_10_.migratePackagePolicyToV7100,
      '7.11.0': _to_v7_11_.migratePackagePolicyToV7110,
      '7.12.0': _to_v7_12_.migratePackagePolicyToV7120,
      '7.13.0': _to_v7_13_.migratePackagePolicyToV7130,
      '7.14.0': _to_v7_14_.migratePackagePolicyToV7140,
      '7.15.0': _to_v7_15_.migratePackagePolicyToV7150,
      '7.16.0': _to_v7_16_.migratePackagePolicyToV7160,
      '8.2.0': _to_v8_2_.migratePackagePolicyToV820,
      '8.3.0': _to_v8_3_.migratePackagePolicyToV830,
      '8.4.0': _to_v8_4_.migratePackagePolicyToV840,
      '8.5.0': _to_v8_5_.migratePackagePolicyToV850,
      '8.6.0': _to_v8_6_.migratePackagePolicyToV860
    }
  },
  [_constants.PACKAGES_SAVED_OBJECT_TYPE]: {
    name: _constants.PACKAGES_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        name: {
          type: 'keyword'
        },
        version: {
          type: 'keyword'
        },
        internal: {
          type: 'boolean'
        },
        keep_policies_up_to_date: {
          type: 'boolean',
          index: false
        },
        es_index_patterns: {
          enabled: false,
          type: 'object'
        },
        verification_status: {
          type: 'keyword'
        },
        verification_key_id: {
          type: 'keyword'
        },
        installed_es: {
          type: 'nested',
          properties: {
            id: {
              type: 'keyword'
            },
            type: {
              type: 'keyword'
            }
          }
        },
        installed_kibana: {
          type: 'nested',
          properties: {
            id: {
              type: 'keyword'
            },
            type: {
              type: 'keyword'
            }
          }
        },
        installed_kibana_space_id: {
          type: 'keyword'
        },
        package_assets: {
          type: 'nested',
          properties: {
            id: {
              type: 'keyword'
            },
            type: {
              type: 'keyword'
            }
          }
        },
        install_started_at: {
          type: 'date'
        },
        install_version: {
          type: 'keyword'
        },
        install_status: {
          type: 'keyword'
        },
        install_source: {
          type: 'keyword'
        },
        install_format_schema_version: {
          type: 'version'
        },
        experimental_data_stream_features: {
          type: 'nested',
          properties: {
            data_stream: {
              type: 'keyword'
            },
            features: {
              type: 'nested',
              properties: {
                synthetic_source: {
                  type: 'boolean'
                },
                tsdb: {
                  type: 'boolean'
                }
              }
            }
          }
        }
      }
    },
    migrations: {
      '7.14.0': _to_v7_14_.migrateInstallationToV7140,
      '7.14.1': _to_v7_14_.migrateInstallationToV7140,
      '7.16.0': _to_v7_16_.migrateInstallationToV7160,
      '8.0.0': _to_v8_0_.migrateInstallationToV800,
      '8.3.0': _to_v8_3_.migrateInstallationToV830,
      '8.4.0': _to_v8_4_.migrateInstallationToV840,
      '8.6.0': _to_v8_6_.migrateInstallationToV860
    }
  },
  [_constants.ASSETS_SAVED_OBJECT_TYPE]: {
    name: _constants.ASSETS_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        package_name: {
          type: 'keyword'
        },
        package_version: {
          type: 'keyword'
        },
        install_source: {
          type: 'keyword'
        },
        asset_path: {
          type: 'keyword'
        },
        media_type: {
          type: 'keyword'
        },
        data_utf8: {
          type: 'text',
          index: false
        },
        data_base64: {
          type: 'binary'
        }
      }
    }
  },
  [_constants.PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE]: {
    name: _constants.PRECONFIGURATION_DELETION_RECORD_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        id: {
          type: 'keyword'
        }
      }
    }
  },
  [_constants.DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE]: {
    name: _constants.DOWNLOAD_SOURCE_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        source_id: {
          type: 'keyword',
          index: false
        },
        name: {
          type: 'keyword'
        },
        is_default: {
          type: 'boolean'
        },
        host: {
          type: 'keyword'
        }
      }
    }
  },
  [_constants.FLEET_SERVER_HOST_SAVED_OBJECT_TYPE]: {
    name: _constants.FLEET_SERVER_HOST_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false
    },
    mappings: {
      properties: {
        name: {
          type: 'keyword'
        },
        is_default: {
          type: 'boolean'
        },
        host_urls: {
          type: 'keyword',
          index: false
        },
        is_preconfigured: {
          type: 'boolean'
        }
      }
    }
  }
});
function registerSavedObjects(savedObjects, encryptedSavedObjects) {
  const savedObjectTypes = getSavedObjectTypes(encryptedSavedObjects);
  Object.values(savedObjectTypes).forEach(type => {
    savedObjects.registerType(type);
  });
}
function registerEncryptedSavedObjects(encryptedSavedObjects) {
  encryptedSavedObjects.registerType({
    type: _constants.OUTPUT_SAVED_OBJECT_TYPE,
    attributesToEncrypt: new Set([{
      key: 'ssl',
      dangerouslyExposeValue: true
    }]),
    attributesToExcludeFromAAD: new Set(['output_id', 'name', 'type', 'is_default', 'is_default_monitoring', 'hosts', 'ca_sha256', 'ca_trusted_fingerprint', 'config', 'config_yaml', 'is_preconfigured'])
  });
  // Encrypted saved objects
}