"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ZipUrlTLSSensitiveFieldsCodec = exports.ZipUrlTLSFieldsCodec = exports.ZipUrlTLSCodec = exports.ThrottlingConfigKeyCodec = exports.TLSSensitiveFieldsCodec = exports.TLSFieldsCodec = exports.TLSCodec = exports.TCPSimpleFieldsCodec = exports.TCPSensitiveAdvancedFieldsCodec = exports.TCPFieldsCodec = exports.TCPAdvancedFieldsCodec = exports.TCPAdvancedCodec = exports.SyntheticsMonitorWithSecretsCodec = exports.SyntheticsMonitorWithIdCodec = exports.SyntheticsMonitorCodec = exports.MonitorOverviewResultCodec = exports.MonitorOverviewItemCodec = exports.MonitorManagementListResultCodec = exports.MonitorFieldsCodec = exports.MonitorDefaultsCodec = exports.ICMPSimpleFieldsCodec = exports.HeartbeatConfigCodec = exports.HTTPSimpleFieldsCodec = exports.HTTPSensitiveAdvancedFieldsCodec = exports.HTTPFieldsCodec = exports.HTTPAdvancedFieldsCodec = exports.HTTPAdvancedCodec = exports.EncryptedTCPFieldsCodec = exports.EncryptedSyntheticsSavedMonitorCodec = exports.EncryptedSyntheticsMonitorWithIdCodec = exports.EncryptedSyntheticsMonitorCodec = exports.EncryptedHTTPFieldsCodec = exports.EncryptedBrowserSimpleFieldsCodec = exports.EncryptedBrowserFieldsCodec = exports.EncryptedBrowserAdvancedFieldsCodec = exports.CommonFieldsCodec = exports.BrowserSimpleFieldsCodec = exports.BrowserSensitiveSimpleFieldsCodec = exports.BrowserSensitiveAdvancedFieldsCodec = exports.BrowserFieldsCodec = exports.BrowserAdvancedFieldsCodec = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _config_key = require("./config_key");
var _locations = require("./locations");
var _monitor_configs = require("./monitor_configs");
var _monitor_meta_data = require("./monitor_meta_data");
var _synthetics_private_locations = require("./synthetics_private_locations");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ScheduleCodec = t.interface({
  number: t.string,
  unit: _monitor_configs.ScheduleUnitCodec
});
// TLSFields
const TLSFieldsCodec = t.partial({
  [_config_key.ConfigKey.TLS_CERTIFICATE_AUTHORITIES]: t.string,
  [_config_key.ConfigKey.TLS_CERTIFICATE]: t.string,
  [_config_key.ConfigKey.TLS_VERIFICATION_MODE]: _monitor_configs.VerificationModeCodec,
  [_config_key.ConfigKey.TLS_VERSION]: t.array(_monitor_configs.TLSVersionCodec)
});
exports.TLSFieldsCodec = TLSFieldsCodec;
const TLSSensitiveFieldsCodec = t.partial({
  [_config_key.ConfigKey.TLS_KEY]: t.string,
  [_config_key.ConfigKey.TLS_KEY_PASSPHRASE]: t.string
});
exports.TLSSensitiveFieldsCodec = TLSSensitiveFieldsCodec;
const TLSCodec = t.intersection([TLSFieldsCodec, TLSSensitiveFieldsCodec]);
exports.TLSCodec = TLSCodec;
// ZipUrlTLSFields
const ZipUrlTLSFieldsCodec = t.partial({
  [_config_key.ConfigKey.ZIP_URL_TLS_CERTIFICATE_AUTHORITIES]: t.string,
  [_config_key.ConfigKey.ZIP_URL_TLS_CERTIFICATE]: t.string,
  [_config_key.ConfigKey.ZIP_URL_TLS_VERIFICATION_MODE]: _monitor_configs.VerificationModeCodec,
  [_config_key.ConfigKey.ZIP_URL_TLS_VERSION]: t.array(_monitor_configs.TLSVersionCodec)
});
exports.ZipUrlTLSFieldsCodec = ZipUrlTLSFieldsCodec;
const ZipUrlTLSSensitiveFieldsCodec = t.partial({
  [_config_key.ConfigKey.ZIP_URL_TLS_KEY]: t.string,
  [_config_key.ConfigKey.ZIP_URL_TLS_KEY_PASSPHRASE]: t.string
});
exports.ZipUrlTLSSensitiveFieldsCodec = ZipUrlTLSSensitiveFieldsCodec;
const ZipUrlTLSCodec = t.intersection([ZipUrlTLSFieldsCodec, ZipUrlTLSSensitiveFieldsCodec]);
exports.ZipUrlTLSCodec = ZipUrlTLSCodec;
// CommonFields
const CommonFieldsCodec = t.intersection([t.interface({
  [_config_key.ConfigKey.NAME]: t.string,
  [_config_key.ConfigKey.NAMESPACE]: t.string,
  [_config_key.ConfigKey.MONITOR_TYPE]: _monitor_configs.DataStreamCodec,
  [_config_key.ConfigKey.ENABLED]: t.boolean,
  [_config_key.ConfigKey.SCHEDULE]: ScheduleCodec,
  [_config_key.ConfigKey.APM_SERVICE_NAME]: t.string,
  [_config_key.ConfigKey.TAGS]: t.array(t.string),
  [_config_key.ConfigKey.LOCATIONS]: t.array(t.union([_locations.MonitorServiceLocationCodec, _synthetics_private_locations.PrivateLocationCodec])),
  [_config_key.ConfigKey.MONITOR_QUERY_ID]: t.string,
  [_config_key.ConfigKey.CONFIG_ID]: t.string
}), t.partial({
  [_config_key.ConfigKey.FORM_MONITOR_TYPE]: _monitor_configs.FormMonitorTypeCodec,
  [_config_key.ConfigKey.TIMEOUT]: t.union([t.string, t.null]),
  [_config_key.ConfigKey.REVISION]: t.number,
  [_config_key.ConfigKey.MONITOR_SOURCE_TYPE]: _monitor_configs.SourceTypeCodec,
  [_config_key.ConfigKey.CONFIG_HASH]: t.string,
  [_config_key.ConfigKey.JOURNEY_ID]: t.string,
  [_config_key.ConfigKey.PROJECT_ID]: t.string,
  [_config_key.ConfigKey.ORIGINAL_SPACE]: t.string,
  [_config_key.ConfigKey.CUSTOM_HEARTBEAT_ID]: t.string
})]);
exports.CommonFieldsCodec = CommonFieldsCodec;
// TCP Simple Fields
const TCPSimpleFieldsCodec = t.intersection([t.interface({
  [_config_key.ConfigKey.METADATA]: _monitor_meta_data.MetadataCodec,
  [_config_key.ConfigKey.HOSTS]: t.string,
  [_config_key.ConfigKey.PORT]: t.union([t.number, t.null])
}), t.partial({
  [_config_key.ConfigKey.URLS]: t.string
}), CommonFieldsCodec]);
exports.TCPSimpleFieldsCodec = TCPSimpleFieldsCodec;
// TCPAdvancedFields
const TCPAdvancedFieldsCodec = t.interface({
  [_config_key.ConfigKey.PROXY_URL]: t.string,
  [_config_key.ConfigKey.PROXY_USE_LOCAL_RESOLVER]: t.boolean
});
exports.TCPAdvancedFieldsCodec = TCPAdvancedFieldsCodec;
const TCPSensitiveAdvancedFieldsCodec = t.interface({
  [_config_key.ConfigKey.RESPONSE_RECEIVE_CHECK]: t.string,
  [_config_key.ConfigKey.REQUEST_SEND_CHECK]: t.string
});
exports.TCPSensitiveAdvancedFieldsCodec = TCPSensitiveAdvancedFieldsCodec;
const TCPAdvancedCodec = t.intersection([TCPAdvancedFieldsCodec, TCPSensitiveAdvancedFieldsCodec]);
exports.TCPAdvancedCodec = TCPAdvancedCodec;
// TCPFields
const EncryptedTCPFieldsCodec = t.intersection([TCPSimpleFieldsCodec, TCPAdvancedFieldsCodec, TLSFieldsCodec]);
exports.EncryptedTCPFieldsCodec = EncryptedTCPFieldsCodec;
const TCPFieldsCodec = t.intersection([EncryptedTCPFieldsCodec, TCPSensitiveAdvancedFieldsCodec, TLSSensitiveFieldsCodec]);
exports.TCPFieldsCodec = TCPFieldsCodec;
// ICMP SimpleFields
const ICMPSimpleFieldsCodec = t.intersection([t.interface({
  [_config_key.ConfigKey.HOSTS]: t.string,
  [_config_key.ConfigKey.WAIT]: t.string
}), CommonFieldsCodec]);
exports.ICMPSimpleFieldsCodec = ICMPSimpleFieldsCodec;
// HTTPSimpleFields
const HTTPSimpleFieldsCodec = t.intersection([t.interface({
  [_config_key.ConfigKey.METADATA]: _monitor_meta_data.MetadataCodec,
  [_config_key.ConfigKey.MAX_REDIRECTS]: t.string,
  [_config_key.ConfigKey.URLS]: t.string,
  [_config_key.ConfigKey.PORT]: t.union([t.number, t.null])
}), CommonFieldsCodec]);
exports.HTTPSimpleFieldsCodec = HTTPSimpleFieldsCodec;
// HTTPAdvancedFields
const HTTPAdvancedFieldsCodec = t.interface({
  [_config_key.ConfigKey.PROXY_URL]: t.string,
  [_config_key.ConfigKey.RESPONSE_BODY_INDEX]: _monitor_configs.ResponseBodyIndexPolicyCodec,
  [_config_key.ConfigKey.RESPONSE_HEADERS_INDEX]: t.boolean,
  [_config_key.ConfigKey.RESPONSE_STATUS_CHECK]: t.array(t.string),
  [_config_key.ConfigKey.REQUEST_METHOD_CHECK]: t.string
});
exports.HTTPAdvancedFieldsCodec = HTTPAdvancedFieldsCodec;
const HTTPSensitiveAdvancedFieldsCodec = t.interface({
  [_config_key.ConfigKey.PASSWORD]: t.string,
  [_config_key.ConfigKey.RESPONSE_BODY_CHECK_NEGATIVE]: t.array(t.string),
  [_config_key.ConfigKey.RESPONSE_BODY_CHECK_POSITIVE]: t.array(t.string),
  [_config_key.ConfigKey.RESPONSE_HEADERS_CHECK]: t.record(t.string, t.string),
  [_config_key.ConfigKey.REQUEST_BODY_CHECK]: t.interface({
    value: t.string,
    type: _monitor_configs.ModeCodec
  }),
  [_config_key.ConfigKey.REQUEST_HEADERS_CHECK]: t.record(t.string, t.string),
  [_config_key.ConfigKey.USERNAME]: t.string
});
exports.HTTPSensitiveAdvancedFieldsCodec = HTTPSensitiveAdvancedFieldsCodec;
const HTTPAdvancedCodec = t.intersection([HTTPAdvancedFieldsCodec, HTTPSensitiveAdvancedFieldsCodec]);
exports.HTTPAdvancedCodec = HTTPAdvancedCodec;
// HTTPFields
const EncryptedHTTPFieldsCodec = t.intersection([HTTPSimpleFieldsCodec, HTTPAdvancedFieldsCodec, TLSFieldsCodec]);
exports.EncryptedHTTPFieldsCodec = EncryptedHTTPFieldsCodec;
const HTTPFieldsCodec = t.intersection([EncryptedHTTPFieldsCodec, HTTPSensitiveAdvancedFieldsCodec, TLSSensitiveFieldsCodec]);
exports.HTTPFieldsCodec = HTTPFieldsCodec;
// Browser Fields
const ThrottlingConfigKeyCodec = t.union([t.literal(_config_key.ConfigKey.DOWNLOAD_SPEED), t.literal(_config_key.ConfigKey.UPLOAD_SPEED), t.literal(_config_key.ConfigKey.LATENCY)]);
exports.ThrottlingConfigKeyCodec = ThrottlingConfigKeyCodec;
const EncryptedBrowserSimpleFieldsCodec = t.intersection([t.intersection([t.interface({
  [_config_key.ConfigKey.METADATA]: _monitor_meta_data.MetadataCodec,
  [_config_key.ConfigKey.SOURCE_ZIP_URL]: t.string,
  [_config_key.ConfigKey.SOURCE_ZIP_FOLDER]: t.string,
  [_config_key.ConfigKey.SOURCE_ZIP_PROXY_URL]: t.string
}), t.partial({
  [_config_key.ConfigKey.PLAYWRIGHT_OPTIONS]: t.string,
  [_config_key.ConfigKey.TEXT_ASSERTION]: t.string
})]), ZipUrlTLSFieldsCodec, ZipUrlTLSSensitiveFieldsCodec, CommonFieldsCodec]);
exports.EncryptedBrowserSimpleFieldsCodec = EncryptedBrowserSimpleFieldsCodec;
const BrowserSensitiveSimpleFieldsCodec = t.intersection([t.interface({
  [_config_key.ConfigKey.SOURCE_INLINE]: t.string,
  [_config_key.ConfigKey.SOURCE_PROJECT_CONTENT]: t.string,
  [_config_key.ConfigKey.SOURCE_ZIP_USERNAME]: t.string,
  [_config_key.ConfigKey.SOURCE_ZIP_PASSWORD]: t.string,
  [_config_key.ConfigKey.PARAMS]: t.string,
  [_config_key.ConfigKey.URLS]: t.union([t.string, t.null]),
  [_config_key.ConfigKey.PORT]: t.union([t.number, t.null])
}), ZipUrlTLSFieldsCodec, CommonFieldsCodec]);
exports.BrowserSensitiveSimpleFieldsCodec = BrowserSensitiveSimpleFieldsCodec;
const EncryptedBrowserAdvancedFieldsCodec = t.interface({
  [_config_key.ConfigKey.SCREENSHOTS]: t.string,
  [_config_key.ConfigKey.JOURNEY_FILTERS_MATCH]: t.string,
  [_config_key.ConfigKey.JOURNEY_FILTERS_TAGS]: t.array(t.string),
  [_config_key.ConfigKey.IGNORE_HTTPS_ERRORS]: t.boolean,
  [_config_key.ConfigKey.IS_THROTTLING_ENABLED]: t.boolean,
  [_config_key.ConfigKey.DOWNLOAD_SPEED]: t.string,
  [_config_key.ConfigKey.UPLOAD_SPEED]: t.string,
  [_config_key.ConfigKey.LATENCY]: t.string,
  [_config_key.ConfigKey.THROTTLING_CONFIG]: t.string
});
exports.EncryptedBrowserAdvancedFieldsCodec = EncryptedBrowserAdvancedFieldsCodec;
const BrowserSimpleFieldsCodec = t.intersection([EncryptedBrowserSimpleFieldsCodec, BrowserSensitiveSimpleFieldsCodec, ZipUrlTLSSensitiveFieldsCodec]);
exports.BrowserSimpleFieldsCodec = BrowserSimpleFieldsCodec;
const BrowserSensitiveAdvancedFieldsCodec = t.interface({
  [_config_key.ConfigKey.SYNTHETICS_ARGS]: t.array(t.string)
});
exports.BrowserSensitiveAdvancedFieldsCodec = BrowserSensitiveAdvancedFieldsCodec;
const BrowserAdvancedFieldsCodec = t.intersection([EncryptedBrowserAdvancedFieldsCodec, BrowserSensitiveAdvancedFieldsCodec]);
exports.BrowserAdvancedFieldsCodec = BrowserAdvancedFieldsCodec;
const EncryptedBrowserFieldsCodec = t.intersection([EncryptedBrowserSimpleFieldsCodec, EncryptedBrowserAdvancedFieldsCodec, TLSFieldsCodec]);
exports.EncryptedBrowserFieldsCodec = EncryptedBrowserFieldsCodec;
const BrowserFieldsCodec = t.intersection([BrowserSimpleFieldsCodec, BrowserAdvancedFieldsCodec, TLSCodec]);
exports.BrowserFieldsCodec = BrowserFieldsCodec;
// MonitorFields, represents any possible monitor type
const MonitorFieldsCodec = t.intersection([HTTPFieldsCodec, TCPFieldsCodec, ICMPSimpleFieldsCodec, BrowserFieldsCodec]);
exports.MonitorFieldsCodec = MonitorFieldsCodec;
// Monitor, represents one of (Icmp | Tcp | Http | Browser)
const SyntheticsMonitorCodec = t.union([HTTPFieldsCodec, TCPFieldsCodec, ICMPSimpleFieldsCodec, BrowserFieldsCodec]);
exports.SyntheticsMonitorCodec = SyntheticsMonitorCodec;
const EncryptedSyntheticsMonitorCodec = t.union([EncryptedHTTPFieldsCodec, EncryptedTCPFieldsCodec, ICMPSimpleFieldsCodec, EncryptedBrowserFieldsCodec]);
exports.EncryptedSyntheticsMonitorCodec = EncryptedSyntheticsMonitorCodec;
const SyntheticsMonitorWithIdCodec = t.intersection([SyntheticsMonitorCodec, t.interface({
  id: t.string
})]);
exports.SyntheticsMonitorWithIdCodec = SyntheticsMonitorWithIdCodec;
const HeartbeatConfigCodec = t.intersection([SyntheticsMonitorWithIdCodec, t.partial({
  fields_under_root: t.boolean,
  fields: t.intersection([t.interface({
    config_id: t.string
  }), t.partial({
    run_once: t.boolean,
    test_run_id: t.string,
    'monitor.project.name': t.string,
    'monitor.project.id': t.string
  })])
})]);
exports.HeartbeatConfigCodec = HeartbeatConfigCodec;
const EncryptedSyntheticsMonitorWithIdCodec = t.intersection([EncryptedSyntheticsMonitorCodec, t.interface({
  id: t.string
})]);

// TODO: Remove EncryptedSyntheticsMonitorWithIdCodec (as well as SyntheticsMonitorWithIdCodec if possible) along with respective TypeScript types in favor of EncryptedSyntheticsSavedMonitorCodec
exports.EncryptedSyntheticsMonitorWithIdCodec = EncryptedSyntheticsMonitorWithIdCodec;
const EncryptedSyntheticsSavedMonitorCodec = t.intersection([EncryptedSyntheticsMonitorCodec, t.interface({
  id: t.string,
  updated_at: t.string,
  created_at: t.string
})]);
exports.EncryptedSyntheticsSavedMonitorCodec = EncryptedSyntheticsSavedMonitorCodec;
const MonitorDefaultsCodec = t.interface({
  [_monitor_configs.DataStream.HTTP]: HTTPFieldsCodec,
  [_monitor_configs.DataStream.TCP]: TCPFieldsCodec,
  [_monitor_configs.DataStream.ICMP]: ICMPSimpleFieldsCodec,
  [_monitor_configs.DataStream.BROWSER]: BrowserFieldsCodec
});
exports.MonitorDefaultsCodec = MonitorDefaultsCodec;
const MonitorManagementListResultCodec = t.type({
  monitors: t.array(t.interface({
    id: t.string,
    attributes: EncryptedSyntheticsMonitorCodec,
    updated_at: t.string,
    created_at: t.string
  })),
  page: t.number,
  perPage: t.number,
  total: t.union([t.number, t.null]),
  absoluteTotal: t.union([t.number, t.null]),
  syncErrors: t.union([_locations.ServiceLocationErrors, t.null])
});
exports.MonitorManagementListResultCodec = MonitorManagementListResultCodec;
const MonitorOverviewItemCodec = t.interface({
  name: t.string,
  id: t.string,
  configId: t.string,
  location: _locations.MonitorServiceLocationCodec,
  isEnabled: t.boolean
});
exports.MonitorOverviewItemCodec = MonitorOverviewItemCodec;
const MonitorOverviewResultCodec = t.type({
  total: t.number,
  allMonitorIds: t.array(t.string),
  monitors: t.array(MonitorOverviewItemCodec)
});
exports.MonitorOverviewResultCodec = MonitorOverviewResultCodec;
const SyntheticsMonitorWithSecretsCodec = t.intersection([EncryptedSyntheticsMonitorCodec, t.interface({
  secrets: t.string
})]);
exports.SyntheticsMonitorWithSecretsCodec = SyntheticsMonitorWithSecretsCodec;