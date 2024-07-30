"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupConnectorsIndices = exports.defaultConnectorsPipelineMeta = exports.SETUP_ERRORS = void 0;
var _ = require("..");
var _identify_exceptions = require("../utils/identify_exceptions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let SETUP_ERRORS;
exports.SETUP_ERRORS = SETUP_ERRORS;
(function (SETUP_ERRORS) {
  SETUP_ERRORS[SETUP_ERRORS["insufficient_permissions"] = 0] = "insufficient_permissions";
  SETUP_ERRORS[SETUP_ERRORS["index_already_exists"] = 1] = "index_already_exists";
})(SETUP_ERRORS || (exports.SETUP_ERRORS = SETUP_ERRORS = {}));
const connectorMappingsProperties = {
  api_key_id: {
    type: 'keyword'
  },
  configuration: {
    type: 'object'
  },
  description: {
    type: 'text'
  },
  error: {
    type: 'keyword'
  },
  features: {
    properties: {
      filtering_advanced_config: {
        type: 'boolean'
      },
      filtering_rules: {
        type: 'boolean'
      }
    }
  },
  filtering: {
    properties: {
      active: {
        properties: {
          advanced_snippet: {
            properties: {
              created_at: {
                type: 'date'
              },
              updated_at: {
                type: 'date'
              },
              value: {
                type: 'object'
              }
            }
          },
          rules: {
            properties: {
              created_at: {
                type: 'date'
              },
              field: {
                type: 'keyword'
              },
              id: {
                type: 'keyword'
              },
              order: {
                type: 'short'
              },
              policy: {
                type: 'keyword'
              },
              rule: {
                type: 'keyword'
              },
              updated_at: {
                type: 'date'
              },
              value: {
                type: 'keyword'
              }
            }
          },
          validation: {
            properties: {
              errors: {
                properties: {
                  ids: {
                    type: 'keyword'
                  },
                  messages: {
                    type: 'text'
                  }
                }
              },
              state: {
                type: 'keyword'
              }
            }
          }
        }
      },
      domain: {
        type: 'keyword'
      },
      draft: {
        properties: {
          advanced_snippet: {
            properties: {
              created_at: {
                type: 'date'
              },
              updated_at: {
                type: 'date'
              },
              value: {
                type: 'object'
              }
            }
          },
          rules: {
            properties: {
              created_at: {
                type: 'date'
              },
              field: {
                type: 'keyword'
              },
              id: {
                type: 'keyword'
              },
              order: {
                type: 'short'
              },
              policy: {
                type: 'keyword'
              },
              rule: {
                type: 'keyword'
              },
              updated_at: {
                type: 'date'
              },
              value: {
                type: 'keyword'
              }
            }
          },
          validation: {
            properties: {
              errors: {
                properties: {
                  ids: {
                    type: 'keyword'
                  },
                  messages: {
                    type: 'text'
                  }
                }
              },
              state: {
                type: 'keyword'
              }
            }
          }
        }
      }
    }
  },
  index_name: {
    type: 'keyword'
  },
  is_native: {
    type: 'boolean'
  },
  language: {
    type: 'keyword'
  },
  last_deleted_document_count: {
    type: 'long'
  },
  last_indexed_document_count: {
    type: 'long'
  },
  last_seen: {
    type: 'date'
  },
  last_sync_error: {
    type: 'keyword'
  },
  last_sync_status: {
    type: 'keyword'
  },
  last_synced: {
    type: 'date'
  },
  name: {
    type: 'keyword'
  },
  pipeline: {
    properties: {
      extract_binary_content: {
        type: 'boolean'
      },
      name: {
        type: 'keyword'
      },
      reduce_whitespace: {
        type: 'boolean'
      },
      run_ml_inference: {
        type: 'boolean'
      }
    }
  },
  scheduling: {
    properties: {
      enabled: {
        type: 'boolean'
      },
      interval: {
        type: 'text'
      }
    }
  },
  service_type: {
    type: 'keyword'
  },
  status: {
    type: 'keyword'
  },
  sync_now: {
    type: 'boolean'
  }
};
const defaultSettings = {
  auto_expand_replicas: '0-3',
  hidden: true,
  number_of_replicas: 0
};
const defaultConnectorsPipelineMeta = {
  default_extract_binary_content: true,
  default_name: 'ent-search-generic-ingestion',
  default_reduce_whitespace: true,
  default_run_ml_inference: true
};
exports.defaultConnectorsPipelineMeta = defaultConnectorsPipelineMeta;
const indices = [{
  aliases: ['.elastic-connectors'],
  mappings: {
    _meta: {
      pipeline: defaultConnectorsPipelineMeta,
      version: 1
    },
    properties: connectorMappingsProperties
  },
  name: '.elastic-connectors-v1',
  settings: defaultSettings
}, {
  aliases: ['.elastic-connectors-sync-jobs'],
  mappings: {
    _meta: {
      version: 1
    },
    properties: {
      cancelation_requested_at: {
        type: 'date'
      },
      canceled_at: {
        type: 'date'
      },
      completed_at: {
        type: 'date'
      },
      connector: {
        properties: {
          configuration: {
            type: 'object'
          },
          filtering: {
            properties: {
              advanced_snippet: {
                properties: {
                  created_at: {
                    type: 'date'
                  },
                  updated_at: {
                    type: 'date'
                  },
                  value: {
                    type: 'object'
                  }
                }
              },
              domain: {
                type: 'keyword'
              },
              rules: {
                properties: {
                  created_at: {
                    type: 'date'
                  },
                  field: {
                    type: 'keyword'
                  },
                  id: {
                    type: 'keyword'
                  },
                  order: {
                    type: 'short'
                  },
                  policy: {
                    type: 'keyword'
                  },
                  rule: {
                    type: 'keyword'
                  },
                  updated_at: {
                    type: 'date'
                  },
                  value: {
                    type: 'keyword'
                  }
                }
              },
              warnings: {
                properties: {
                  ids: {
                    type: 'keyword'
                  },
                  messages: {
                    type: 'text'
                  }
                }
              }
            }
          },
          id: {
            type: 'keyword'
          },
          index_name: {
            type: 'keyword'
          },
          language: {
            type: 'keyword'
          },
          pipeline: {
            properties: {
              extract_binary_content: {
                type: 'boolean'
              },
              name: {
                type: 'keyword'
              },
              reduce_whitespace: {
                type: 'boolean'
              },
              run_ml_inference: {
                type: 'boolean'
              }
            }
          },
          service_type: {
            type: 'keyword'
          }
        }
      },
      created_at: {
        type: 'date'
      },
      deleted_document_count: {
        type: 'integer'
      },
      error: {
        type: 'keyword'
      },
      indexed_document_count: {
        type: 'integer'
      },
      indexed_document_volume: {
        type: 'integer'
      },
      last_seen: {
        type: 'date'
      },
      metadata: {
        type: 'object'
      },
      started_at: {
        type: 'date'
      },
      status: {
        type: 'keyword'
      },
      total_document_count: {
        type: 'integer'
      },
      trigger_method: {
        type: 'keyword'
      },
      worker_hostname: {
        type: 'keyword'
      }
    }
  },
  name: '.elastic-connectors-sync-jobs-v1',
  settings: defaultSettings
}];
const createConnectorsIndex = async (client, indexDefinition) => {
  try {
    const {
      aliases,
      mappings,
      name: index,
      settings
    } = indexDefinition;
    await client.indices.create({
      index,
      mappings,
      settings
    });
    await client.indices.updateAliases({
      actions: [{
        add: {
          aliases,
          index,
          is_hidden: true,
          is_write_index: true
        }
      }]
    });
  } catch (error) {
    if ((0, _identify_exceptions.isResourceAlreadyExistsException)(error)) {
      // We hit a race condition, do nothing
      return;
    }
    return error;
  }
};
const setupConnectorsIndices = async client => {
  const connectorsIndexResponse = await client.indices.get({
    index: `${_.CONNECTORS_INDEX}*`
  });
  for (const indexDefinition of indices) {
    if (!connectorsIndexResponse[indexDefinition.name]) {
      await createConnectorsIndex(client, indexDefinition);
    }
    // TODO handle migrations once we start migrating stuff
  }
};
exports.setupConnectorsIndices = setupConnectorsIndices;