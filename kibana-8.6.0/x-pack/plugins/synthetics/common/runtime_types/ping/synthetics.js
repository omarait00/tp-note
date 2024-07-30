"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SyntheticsJourneyApiResponseType = exports.SyntheticsDataType = exports.ScreenshotRefImageDataType = exports.ScreenshotImageBlobType = exports.ScreenshotBlockType = exports.ScreenshotBlockDocType = exports.RefResultType = exports.JourneyStepType = exports.FullScreenshotType = exports.FailedStepsApiResponseType = void 0;
exports.isFullScreenshot = isFullScreenshot;
exports.isPendingBlock = isPendingBlock;
exports.isRefResult = isRefResult;
exports.isScreenshotBlockDoc = isScreenshotBlockDoc;
exports.isScreenshotImageBlob = isScreenshotImageBlob;
exports.isScreenshotRef = isScreenshotRef;
var _Either = require("fp-ts/lib/Either");
var t = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This type has some overlap with the Ping type, but it helps avoid runtime type
 * check failures and removes a lot of unnecessary fields that our Synthetics UI code
 * does not care about.
 */
const SyntheticsDataType = t.partial({
  index: t.number,
  journey: t.type({
    id: t.string,
    name: t.string
  }),
  error: t.partial({
    message: t.string,
    name: t.string,
    stack: t.string
  }),
  package_version: t.string,
  step: t.type({
    status: t.string,
    index: t.number,
    name: t.string,
    duration: t.type({
      us: t.number
    })
  }),
  type: t.string,
  blob: t.string,
  blob_mime: t.string,
  payload: t.partial({
    duration: t.number,
    index: t.number,
    is_navigation_request: t.boolean,
    message: t.string,
    method: t.string,
    name: t.string,
    params: t.partial({
      homepage: t.string
    }),
    source: t.string,
    start: t.number,
    status: t.string,
    ts: t.number,
    type: t.string,
    url: t.string,
    end: t.number,
    text: t.string
  }),
  isFullScreenshot: t.boolean,
  isScreenshotRef: t.boolean
});
exports.SyntheticsDataType = SyntheticsDataType;
const JourneyStepType = t.intersection([t.partial({
  config_id: t.string,
  monitor: t.partial({
    duration: t.type({
      us: t.number
    }),
    name: t.string,
    status: t.string,
    type: t.string,
    timespan: t.type({
      gte: t.string,
      lt: t.string
    })
  }),
  observer: t.partial({
    geo: t.type({
      name: t.string
    })
  }),
  synthetics: SyntheticsDataType,
  error: t.type({
    message: t.string
  })
}), t.type({
  _id: t.string,
  '@timestamp': t.string,
  monitor: t.type({
    id: t.string,
    check_group: t.string
  }),
  synthetics: t.type({
    type: t.string
  })
})]);
exports.JourneyStepType = JourneyStepType;
const FailedStepsApiResponseType = t.type({
  checkGroups: t.array(t.string),
  steps: t.array(JourneyStepType)
});
exports.FailedStepsApiResponseType = FailedStepsApiResponseType;
/**
 * The individual screenshot blocks Synthetics uses to reduce disk footprint.
 */
const ScreenshotBlockType = t.type({
  hash: t.string,
  top: t.number,
  left: t.number,
  height: t.number,
  width: t.number
});

/**
 * The old style of screenshot document that contains a full screenshot blob.
 */
exports.ScreenshotBlockType = ScreenshotBlockType;
const FullScreenshotType = t.type({
  synthetics: t.intersection([t.partial({
    blob: t.string,
    blob_mime: t.string
  }), t.type({
    step: t.type({
      name: t.string
    }),
    type: t.literal('step/screenshot')
  })])
});
exports.FullScreenshotType = FullScreenshotType;
function isFullScreenshot(data) {
  return (0, _Either.isRight)(FullScreenshotType.decode(data));
}

/**
 * The ref used by synthetics to organize the blocks needed to recompose a
 * fragmented image.
 */
const RefResultType = t.type({
  '@timestamp': t.string,
  monitor: t.type({
    check_group: t.string
  }),
  screenshot_ref: t.type({
    width: t.number,
    height: t.number,
    blocks: t.array(ScreenshotBlockType)
  }),
  synthetics: t.type({
    package_version: t.string,
    step: t.type({
      name: t.string,
      index: t.number
    }),
    type: t.literal('step/screenshot_ref')
  })
});
exports.RefResultType = RefResultType;
function isRefResult(data) {
  return (0, _Either.isRight)(RefResultType.decode(data));
}

/**
 * Represents the result of querying for the legacy-style full screenshot blob.
 */
const ScreenshotImageBlobType = t.type({
  stepName: t.union([t.null, t.string]),
  maxSteps: t.number,
  src: t.string
});
exports.ScreenshotImageBlobType = ScreenshotImageBlobType;
function isScreenshotImageBlob(data) {
  return (0, _Either.isRight)(ScreenshotImageBlobType.decode(data));
}

/**
 * Represents the block blobs stored by hash. These documents are used to recompose synthetics images.
 */
const ScreenshotBlockDocType = t.type({
  id: t.string,
  synthetics: t.type({
    blob: t.string,
    blob_mime: t.string
  })
});
exports.ScreenshotBlockDocType = ScreenshotBlockDocType;
function isScreenshotBlockDoc(data) {
  return (0, _Either.isRight)(ScreenshotBlockDocType.decode(data));
}
function isPendingBlock(data) {
  return ['pending', 'loading'].some(s => s === (data === null || data === void 0 ? void 0 : data.status));
}

/**
 * Contains the fields requried by the Synthetics UI when utilizing screenshot refs.
 */
const ScreenshotRefImageDataType = t.type({
  stepName: t.union([t.null, t.string]),
  maxSteps: t.number,
  ref: t.type({
    screenshotRef: RefResultType
  })
});
exports.ScreenshotRefImageDataType = ScreenshotRefImageDataType;
function isScreenshotRef(data) {
  return (0, _Either.isRight)(ScreenshotRefImageDataType.decode(data));
}
const SyntheticsJourneyApiResponseType = t.intersection([t.type({
  checkGroup: t.string,
  steps: t.array(JourneyStepType)
}), t.partial({
  details: t.union([t.intersection([t.type({
    timestamp: t.string,
    journey: JourneyStepType
  }), t.partial({
    next: t.type({
      timestamp: t.string,
      checkGroup: t.string
    }),
    previous: t.type({
      timestamp: t.string,
      checkGroup: t.string
    })
  })]), t.null])
})]);
exports.SyntheticsJourneyApiResponseType = SyntheticsJourneyApiResponseType;