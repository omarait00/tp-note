"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmSchema = exports.apmPerServiceSchema = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const long = {
  type: 'long'
};
const keyword = {
  type: 'keyword'
};
const aggregatedTransactionCountSchema = {
  expected_metric_document_count: long,
  transaction_count: long
};
const timeframeMap1dSchema = {
  '1d': long
};
const timeframeMapAllSchema = {
  all: long
};
const timeframeMapSchema = {
  ...timeframeMap1dSchema,
  ...timeframeMapAllSchema
};
const agentSchema = {
  agent: {
    version: {
      type: 'array',
      items: {
        type: 'keyword'
      }
    }
  },
  service: {
    framework: {
      name: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      },
      version: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      },
      composite: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      }
    },
    language: {
      name: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      },
      version: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      },
      composite: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      }
    },
    runtime: {
      name: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      },
      version: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      },
      composite: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      }
    }
  }
};
const apmPerAgentSchema = {
  // services_per_agent: AGENT_NAMES.reduce(
  //   (acc, name) => ({ ...acc, [name]: long }),
  //   {} as Record<AgentName, typeof long>
  // ),
  // agents: AGENT_NAMES.reduce(
  //   (acc, name) => ({ ...acc, [name]: agentSchema }),
  //   {} as Record<AgentName, typeof agentSchema>
  // ),
  // TODO: Find a way for `@kbn/telemetry-tools` to understand and evaluate expressions.
  //  In the meanwhile, we'll have to maintain these lists up to date (TS will remind us to update)
  services_per_agent: {
    'android/java': long,
    dotnet: long,
    'iOS/swift': long,
    go: long,
    java: long,
    'js-base': long,
    nodejs: long,
    php: long,
    python: long,
    ruby: long,
    'rum-js': long,
    otlp: long,
    'opentelemetry/cpp': long,
    'opentelemetry/dotnet': long,
    'opentelemetry/erlang': long,
    'opentelemetry/go': long,
    'opentelemetry/java': long,
    'opentelemetry/nodejs': long,
    'opentelemetry/php': long,
    'opentelemetry/python': long,
    'opentelemetry/ruby': long,
    'opentelemetry/swift': long,
    'opentelemetry/webjs': long
  },
  agents: {
    'android/java': agentSchema,
    dotnet: agentSchema,
    'iOS/swift': agentSchema,
    go: agentSchema,
    java: agentSchema,
    'js-base': agentSchema,
    nodejs: agentSchema,
    php: agentSchema,
    python: agentSchema,
    ruby: agentSchema,
    'rum-js': agentSchema
  }
};
const apmPerServiceSchema = {
  service_id: keyword,
  timed_out: {
    type: 'boolean'
  },
  cloud: {
    availability_zones: {
      type: 'array',
      items: {
        type: 'keyword'
      }
    },
    regions: {
      type: 'array',
      items: {
        type: 'keyword'
      }
    },
    providers: {
      type: 'array',
      items: {
        type: 'keyword'
      }
    }
  },
  faas: {
    trigger: {
      type: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      }
    }
  },
  agent: {
    name: keyword,
    version: keyword
  },
  service: {
    language: {
      name: keyword,
      version: keyword
    },
    framework: {
      name: keyword,
      version: keyword
    },
    runtime: {
      name: keyword,
      version: keyword
    }
  },
  kubernetes: {
    pod: {
      name: keyword
    }
  },
  container: {
    id: keyword
  }
};
exports.apmPerServiceSchema = apmPerServiceSchema;
const apmSchema = {
  ...apmPerAgentSchema,
  has_any_services: {
    type: 'boolean'
  },
  version: {
    apm_server: {
      major: long,
      minor: long,
      patch: long
    }
  },
  environments: {
    services_without_environment: long,
    services_with_multiple_environments: long,
    top_environments: {
      type: 'array',
      items: {
        type: 'keyword'
      }
    }
  },
  aggregated_transactions: {
    current_implementation: aggregatedTransactionCountSchema,
    no_observer_name: aggregatedTransactionCountSchema,
    no_rum: aggregatedTransactionCountSchema,
    no_rum_no_observer_name: aggregatedTransactionCountSchema,
    only_rum: aggregatedTransactionCountSchema,
    only_rum_no_observer_name: aggregatedTransactionCountSchema
  },
  cloud: {
    availability_zone: {
      type: 'array',
      items: {
        type: 'keyword'
      }
    },
    provider: {
      type: 'array',
      items: {
        type: 'keyword'
      }
    },
    region: {
      type: 'array',
      items: {
        type: 'keyword'
      }
    }
  },
  host: {
    os: {
      platform: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      }
    }
  },
  counts: {
    transaction: timeframeMapSchema,
    span: timeframeMapSchema,
    error: timeframeMapSchema,
    metric: timeframeMapSchema,
    sourcemap: timeframeMapSchema,
    onboarding: timeframeMapSchema,
    agent_configuration: timeframeMapAllSchema,
    max_transaction_groups_per_service: timeframeMapSchema,
    max_error_groups_per_service: timeframeMapSchema,
    traces: timeframeMapSchema,
    services: timeframeMapSchema
  },
  cardinality: {
    client: {
      geo: {
        country_iso_code: {
          rum: timeframeMap1dSchema
        }
      }
    },
    user_agent: {
      original: {
        all_agents: timeframeMap1dSchema,
        rum: timeframeMap1dSchema
      }
    },
    transaction: {
      name: {
        all_agents: timeframeMap1dSchema,
        rum: timeframeMap1dSchema
      }
    }
  },
  retainment: {
    span: {
      ms: long
    },
    transaction: {
      ms: long
    },
    error: {
      ms: long
    },
    metric: {
      ms: long
    },
    sourcemap: {
      ms: long
    },
    onboarding: {
      ms: long
    }
  },
  integrations: {
    ml: {
      all_jobs_count: long
    }
  },
  indices: {
    shards: {
      total: long
    },
    all: {
      total: {
        docs: {
          count: long
        },
        store: {
          size_in_bytes: long
        }
      }
    }
  },
  service_groups: {
    kuery_fields: {
      type: 'array',
      items: {
        type: 'keyword'
      }
    },
    total: long
  },
  per_service: {
    type: 'array',
    items: {
      ...apmPerServiceSchema
    }
  },
  tasks: {
    aggregated_transactions: {
      took: {
        ms: long
      }
    },
    cloud: {
      took: {
        ms: long
      }
    },
    host: {
      took: {
        ms: long
      }
    },
    processor_events: {
      took: {
        ms: long
      }
    },
    agent_configuration: {
      took: {
        ms: long
      }
    },
    services: {
      took: {
        ms: long
      }
    },
    versions: {
      took: {
        ms: long
      }
    },
    groupings: {
      took: {
        ms: long
      }
    },
    integrations: {
      took: {
        ms: long
      }
    },
    agents: {
      took: {
        ms: long
      }
    },
    indices_stats: {
      took: {
        ms: long
      }
    },
    cardinality: {
      took: {
        ms: long
      }
    },
    environments: {
      took: {
        ms: long
      }
    },
    service_groups: {
      took: {
        ms: long
      }
    },
    per_service: {
      took: {
        ms: long
      }
    }
  }
};
exports.apmSchema = apmSchema;