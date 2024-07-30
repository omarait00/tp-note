"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makePing = exports.X509Type = exports.X509ExpiryType = exports.TlsType = exports.PingsResponseType = exports.PingType = exports.PingStatusesResponseType = exports.PingStatusType = exports.PingHeadersType = exports.PingErrorType = exports.MonitorType = exports.MonitorDetailsType = exports.HttpResponseBodyType = exports.GetPingsParamsType = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _error_state = require("./error_state");
var _common = require("../common");
var _synthetics = require("./synthetics");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// IO type for validation
const PingErrorType = t.intersection([t.partial({
  code: t.string,
  id: t.string,
  stack_trace: t.string,
  type: t.string
}), t.type({
  // this is _always_ on the error field
  message: t.string
})]);

// Typescript type for type checking
exports.PingErrorType = PingErrorType;
const MonitorDetailsType = t.intersection([t.type({
  monitorId: t.string
}), t.partial({
  error: PingErrorType,
  timestamp: t.string,
  alerts: t.unknown
})]);
exports.MonitorDetailsType = MonitorDetailsType;
const HttpResponseBodyType = t.partial({
  bytes: t.number,
  content: t.string,
  content_bytes: t.number,
  hash: t.string
});
exports.HttpResponseBodyType = HttpResponseBodyType;
const ECSDistinguishedName = t.type({
  common_name: t.string,
  distinguished_name: t.string
});
const X509ExpiryType = t.type({
  not_after: t.string,
  not_before: t.string
});
exports.X509ExpiryType = X509ExpiryType;
const X509Type = t.intersection([t.type({
  issuer: ECSDistinguishedName,
  subject: ECSDistinguishedName,
  serial_number: t.string,
  public_key_algorithm: t.string,
  signature_algorithm: t.string
}), X509ExpiryType, t.partial({
  public_key_curve: t.string,
  public_key_exponent: t.number,
  public_key_size: t.number
})]);
exports.X509Type = X509Type;
const TlsType = t.partial({
  // deprecated in favor of server.x509.not_after/not_before
  certificate_not_valid_after: t.string,
  certificate_not_valid_before: t.string,
  cipher: t.string,
  established: t.boolean,
  server: t.partial({
    hash: t.type({
      sha256: t.string,
      sha1: t.string
    }),
    x509: X509Type
  })
});
exports.TlsType = TlsType;
const MonitorType = t.intersection([t.type({
  id: t.string,
  status: t.string,
  type: t.string,
  check_group: t.string
}), t.partial({
  duration: t.type({
    us: t.number
  }),
  ip: t.string,
  name: t.string,
  timespan: t.type({
    gte: t.string,
    lt: t.string
  }),
  fleet_managed: t.boolean,
  project: t.type({
    id: t.string,
    name: t.string
  })
})]);
exports.MonitorType = MonitorType;
const PingHeadersType = t.record(t.string, t.union([t.string, t.array(t.string)]));
exports.PingHeadersType = PingHeadersType;
const PingType = t.intersection([t.type({
  timestamp: t.string,
  monitor: MonitorType,
  docId: t.string
}), t.partial({
  agent: t.intersection([t.type({
    ephemeral_id: t.string,
    id: t.string,
    type: t.string,
    version: t.string
  }), t.partial({
    name: t.string,
    hostname: t.string
  })]),
  container: t.partial({
    id: t.string,
    image: t.partial({
      name: t.string,
      tag: t.string
    }),
    name: t.string,
    runtime: t.string
  }),
  ecs: t.partial({
    version: t.string
  }),
  error: PingErrorType,
  http: t.partial({
    request: t.partial({
      body: t.partial({
        bytes: t.number,
        content: t.partial({
          text: t.string
        })
      }),
      bytes: t.number,
      method: t.string,
      referrer: t.string
    }),
    response: t.partial({
      body: HttpResponseBodyType,
      bytes: t.number,
      redirects: t.array(t.string),
      status_code: t.number,
      headers: PingHeadersType
    }),
    version: t.string
  }),
  icmp: t.partial({
    requests: t.number,
    rtt: t.partial({
      us: t.number
    })
  }),
  kubernetes: t.partial({
    pod: t.partial({
      name: t.string,
      uid: t.string
    })
  }),
  observer: t.partial({
    hostname: t.string,
    ip: t.array(t.string),
    mac: t.array(t.string),
    geo: t.partial({
      name: t.string,
      continent_name: t.string,
      city_name: t.string,
      country_iso_code: t.string,
      location: t.union([t.string, t.partial({
        lat: t.number,
        lon: t.number
      }), t.partial({
        lat: t.string,
        lon: t.string
      })])
    })
  }),
  resolve: t.partial({
    ip: t.string,
    rtt: t.partial({
      us: t.number
    })
  }),
  summary: t.partial({
    down: t.number,
    up: t.number
  }),
  synthetics: _synthetics.SyntheticsDataType,
  tags: t.array(t.string),
  tcp: t.partial({
    rtt: t.partial({
      connect: t.partial({
        us: t.number
      })
    })
  }),
  tls: TlsType,
  // should this be partial?
  url: t.partial({
    domain: t.string,
    full: t.string,
    port: t.number,
    scheme: t.string,
    path: t.string
  }),
  service: t.partial({
    name: t.string
  }),
  config_id: t.string,
  state: _error_state.ErrorStateCodec,
  data_stream: t.interface({
    namespace: t.string,
    type: t.string,
    dataset: t.string
  })
})]);
exports.PingType = PingType;
const PingStatusType = t.intersection([t.type({
  timestamp: t.string,
  docId: t.string,
  config_id: t.string,
  locationId: t.string,
  summary: t.partial({
    down: t.number,
    up: t.number
  })
}), t.partial({
  error: PingErrorType
})]);
exports.PingStatusType = PingStatusType;
// Convenience function for tests etc that makes an empty ping
// object with the minimum of fields.
const makePing = f => {
  return {
    docId: f.docId || 'myDocId',
    timestamp: f.timestamp || '2020-07-07T01:14:08Z',
    monitor: {
      id: f.id || 'myId',
      type: f.type || 'myType',
      ip: f.ip || '127.0.0.1',
      status: f.status || 'up',
      duration: {
        us: f.duration || 100000
      },
      name: f.name,
      check_group: 'myCheckGroup'
    },
    ...(f.location ? {
      observer: {
        geo: {
          name: f.location
        }
      }
    } : {}),
    ...(f.url ? {
      url: {
        full: f.url
      }
    } : {})
  };
};
exports.makePing = makePing;
const PingsResponseType = t.type({
  total: t.number,
  pings: t.array(PingType)
});
exports.PingsResponseType = PingsResponseType;
const PingStatusesResponseType = t.type({
  total: t.number,
  pings: t.array(PingStatusType),
  from: t.string,
  to: t.string
});
exports.PingStatusesResponseType = PingStatusesResponseType;
const GetPingsParamsType = t.intersection([t.type({
  dateRange: _common.DateRangeType
}), t.partial({
  excludedLocations: t.string,
  index: t.number,
  size: t.number,
  pageIndex: t.number,
  locations: t.string,
  monitorId: t.string,
  sort: t.string,
  status: t.string
})]);
exports.GetPingsParamsType = GetPingsParamsType;