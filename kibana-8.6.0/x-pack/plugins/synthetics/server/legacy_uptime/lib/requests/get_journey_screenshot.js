"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJourneyScreenshot = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getJourneyScreenshot = async ({
  checkGroup,
  stepIndex,
  uptimeEsClient
}) => {
  var _ref, _result$body$aggregat;
  const body = {
    track_total_hits: true,
    size: 0,
    query: {
      bool: {
        filter: [{
          term: {
            'monitor.check_group': checkGroup
          }
        }, {
          terms: {
            'synthetics.type': ['step/screenshot', 'step/screenshot_ref']
          }
        }]
      }
    },
    aggs: {
      step: {
        filter: {
          term: {
            'synthetics.step.index': stepIndex
          }
        },
        aggs: {
          image: {
            top_hits: {
              size: 1
            }
          }
        }
      }
    }
  };
  const result = await uptimeEsClient.search({
    body
  });
  const screenshotsOrRefs = (_ref = (_result$body$aggregat = result.body.aggregations) === null || _result$body$aggregat === void 0 ? void 0 : _result$body$aggregat.step.image.hits.hits) !== null && _ref !== void 0 ? _ref : null;
  if (screenshotsOrRefs.length === 0) return null;
  return {
    ...screenshotsOrRefs[0]._source,
    totalSteps: result.body.hits.total.value
  };
};
exports.getJourneyScreenshot = getJourneyScreenshot;