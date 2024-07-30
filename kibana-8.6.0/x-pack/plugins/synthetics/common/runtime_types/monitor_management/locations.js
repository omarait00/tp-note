"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isServiceLocationInvalid = exports.ThrottlingOptionsCodec = exports.ServiceLocationsCodec = exports.ServiceLocationsApiResponseCodec = exports.ServiceLocationErrors = exports.ServiceLocationCodec = exports.PublicLocationsCodec = exports.PublicLocationCodec = exports.MonitorServiceLocationsCodec = exports.MonitorServiceLocationCodec = exports.ManifestLocationCodec = exports.LocationsCodec = exports.LocationStatusCodec = exports.LocationStatus = exports.LocationGeoCodec = exports.LocationCodec = exports.DEFAULT_THROTTLING = exports.DEFAULT_BANDWIDTH_LIMIT = exports.BandwidthLimitKeyCodec = exports.BandwidthLimitKey = void 0;
var _Either = require("fp-ts/lib/Either");
var t = _interopRequireWildcard(require("io-ts"));
var _t_enum = require("../../utils/t_enum");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let LocationStatus;
exports.LocationStatus = LocationStatus;
(function (LocationStatus) {
  LocationStatus["GA"] = "ga";
  LocationStatus["EXPERIMENTAL"] = "experimental";
})(LocationStatus || (exports.LocationStatus = LocationStatus = {}));
let BandwidthLimitKey;
exports.BandwidthLimitKey = BandwidthLimitKey;
(function (BandwidthLimitKey) {
  BandwidthLimitKey["DOWNLOAD"] = "download";
  BandwidthLimitKey["UPLOAD"] = "upload";
})(BandwidthLimitKey || (exports.BandwidthLimitKey = BandwidthLimitKey = {}));
const DEFAULT_BANDWIDTH_LIMIT = {
  [BandwidthLimitKey.DOWNLOAD]: 100,
  [BandwidthLimitKey.UPLOAD]: 30
};
exports.DEFAULT_BANDWIDTH_LIMIT = DEFAULT_BANDWIDTH_LIMIT;
const DEFAULT_THROTTLING = {
  [BandwidthLimitKey.DOWNLOAD]: DEFAULT_BANDWIDTH_LIMIT[BandwidthLimitKey.DOWNLOAD],
  [BandwidthLimitKey.UPLOAD]: DEFAULT_BANDWIDTH_LIMIT[BandwidthLimitKey.UPLOAD]
};
exports.DEFAULT_THROTTLING = DEFAULT_THROTTLING;
const BandwidthLimitKeyCodec = (0, _t_enum.tEnum)('BandwidthLimitKey', BandwidthLimitKey);
exports.BandwidthLimitKeyCodec = BandwidthLimitKeyCodec;
const LocationGeoCodec = t.interface({
  lat: t.union([t.string, t.number]),
  lon: t.union([t.string, t.number])
});
exports.LocationGeoCodec = LocationGeoCodec;
const LocationStatusCodec = (0, _t_enum.tEnum)('LocationStatus', LocationStatus);
exports.LocationStatusCodec = LocationStatusCodec;
const ManifestLocationCodec = t.interface({
  url: t.string,
  geo: t.interface({
    name: t.string,
    location: LocationGeoCodec
  }),
  status: LocationStatusCodec
});
exports.ManifestLocationCodec = ManifestLocationCodec;
const ServiceLocationCodec = t.intersection([t.interface({
  id: t.string,
  label: t.string,
  isServiceManaged: t.boolean
}), t.partial({
  url: t.string,
  geo: LocationGeoCodec,
  status: LocationStatusCodec,
  isInvalid: t.boolean
})]);
exports.ServiceLocationCodec = ServiceLocationCodec;
const PublicLocationCodec = t.intersection([ServiceLocationCodec, t.interface({
  url: t.string
})]);
exports.PublicLocationCodec = PublicLocationCodec;
const PublicLocationsCodec = t.array(PublicLocationCodec);
exports.PublicLocationsCodec = PublicLocationsCodec;
const MonitorServiceLocationCodec = t.intersection([t.interface({
  id: t.string
}), t.partial({
  label: t.string,
  geo: LocationGeoCodec,
  url: t.string,
  isServiceManaged: t.boolean,
  status: t.string
})]);
exports.MonitorServiceLocationCodec = MonitorServiceLocationCodec;
const ServiceLocationErrors = t.array(t.interface({
  locationId: t.string,
  error: t.intersection([t.interface({
    reason: t.string,
    status: t.number
  }), t.partial({
    failed_monitors: t.union([t.array(t.interface({
      id: t.string,
      message: t.string
    })), t.null])
  })])
}));
exports.ServiceLocationErrors = ServiceLocationErrors;
const ServiceLocationsCodec = t.array(ServiceLocationCodec);
exports.ServiceLocationsCodec = ServiceLocationsCodec;
const MonitorServiceLocationsCodec = t.array(MonitorServiceLocationCodec);
exports.MonitorServiceLocationsCodec = MonitorServiceLocationsCodec;
const LocationCodec = t.intersection([ServiceLocationCodec, t.partial({
  isServiceManaged: t.boolean
})]);
exports.LocationCodec = LocationCodec;
const LocationsCodec = t.array(LocationCodec);
exports.LocationsCodec = LocationsCodec;
const isServiceLocationInvalid = location => (0, _Either.isLeft)(MonitorServiceLocationCodec.decode(location));
exports.isServiceLocationInvalid = isServiceLocationInvalid;
const ThrottlingOptionsCodec = t.interface({
  [BandwidthLimitKey.DOWNLOAD]: t.number,
  [BandwidthLimitKey.UPLOAD]: t.number
});
exports.ThrottlingOptionsCodec = ThrottlingOptionsCodec;
const ServiceLocationsApiResponseCodec = t.interface({
  throttling: t.union([ThrottlingOptionsCodec, t.undefined]),
  locations: ServiceLocationsCodec
});
exports.ServiceLocationsApiResponseCodec = ServiceLocationsApiResponseCodec;