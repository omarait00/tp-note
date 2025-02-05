"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJourneySteps = exports.formatSyntheticEvents = void 0;
var _as_mutable_array = require("../../../../common/utils/as_mutable_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const defaultEventTypes = ['cmd/status', 'journey/browserconsole', 'step/end', 'step/screenshot', 'step/screenshot_ref'];
const formatSyntheticEvents = eventTypes => {
  if (!eventTypes) {
    return defaultEventTypes;
  } else {
    return Array.isArray(eventTypes) ? eventTypes : [eventTypes];
  }
};
exports.formatSyntheticEvents = formatSyntheticEvents;
const getJourneySteps = async ({
  uptimeEsClient,
  checkGroup,
  syntheticEventTypes
}) => {
  const params = {
    query: {
      bool: {
        filter: [{
          terms: {
            'synthetics.type': formatSyntheticEvents(syntheticEventTypes)
          }
        }, {
          term: {
            'monitor.check_group': checkGroup
          }
        }]
      }
    },
    sort: (0, _as_mutable_array.asMutableArray)([{
      'synthetics.step.index': {
        order: 'asc'
      }
    }, {
      '@timestamp': {
        order: 'asc'
      }
    }]),
    _source: {
      excludes: ['synthetics.blob', 'screenshot_ref']
    },
    size: 500
  };
  const {
    body: result
  } = await uptimeEsClient.search({
    body: params
  });
  const steps = result.hits.hits.map(({
    _id,
    _source
  }) => Object.assign({
    _id
  }, _source));
  const screenshotIndexList = [];
  const refIndexList = [];
  const stepsWithoutImages = [];

  /**
   * Store screenshot indexes, we use these to determine if a step has a screenshot below.
   * Store steps that are not screenshots, we return these to the client.
   */
  for (const step of steps) {
    var _synthetics$step, _synthetics$step2;
    const {
      synthetics
    } = step;
    if (synthetics.type === 'step/screenshot' && synthetics !== null && synthetics !== void 0 && (_synthetics$step = synthetics.step) !== null && _synthetics$step !== void 0 && _synthetics$step.index) {
      screenshotIndexList.push(synthetics.step.index);
    } else if (synthetics.type === 'step/screenshot_ref' && synthetics !== null && synthetics !== void 0 && (_synthetics$step2 = synthetics.step) !== null && _synthetics$step2 !== void 0 && _synthetics$step2.index) {
      refIndexList.push(synthetics.step.index);
    } else {
      stepsWithoutImages.push(step);
    }
  }
  return stepsWithoutImages.map(({
    _id,
    ...rest
  }) => ({
    _id,
    ...rest,
    timestamp: rest['@timestamp'],
    synthetics: {
      ...rest.synthetics,
      isFullScreenshot: screenshotIndexList.some(i => {
        var _rest$synthetics, _rest$synthetics$step;
        return i === (rest === null || rest === void 0 ? void 0 : (_rest$synthetics = rest.synthetics) === null || _rest$synthetics === void 0 ? void 0 : (_rest$synthetics$step = _rest$synthetics.step) === null || _rest$synthetics$step === void 0 ? void 0 : _rest$synthetics$step.index);
      }),
      isScreenshotRef: refIndexList.some(i => {
        var _rest$synthetics2, _rest$synthetics2$ste;
        return i === (rest === null || rest === void 0 ? void 0 : (_rest$synthetics2 = rest.synthetics) === null || _rest$synthetics2 === void 0 ? void 0 : (_rest$synthetics2$ste = _rest$synthetics2.step) === null || _rest$synthetics2$ste === void 0 ? void 0 : _rest$synthetics2$ste.index);
      })
    }
  }));
};
exports.getJourneySteps = getJourneySteps;