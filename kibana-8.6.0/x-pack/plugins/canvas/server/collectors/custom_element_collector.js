"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.customElementSchema = exports.customElementCollector = void 0;
exports.summarizeCustomElements = summarizeCustomElements;
var _lodash = require("lodash");
var _common = require("../../../../../src/plugins/expressions/common");
var _collector_helpers = require("./collector_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const CUSTOM_ELEMENT_TYPE = 'canvas-element';
const customElementSchema = {
  custom_elements: {
    count: {
      type: 'long',
      _meta: {
        description: 'The total number of custom Canvas elements'
      }
    },
    elements: {
      min: {
        type: 'long',
        _meta: {
          description: 'The minimum number of elements used across all Canvas Custom Elements'
        }
      },
      max: {
        type: 'long',
        _meta: {
          description: 'The maximum number of elements used across all Canvas Custom Elements'
        }
      },
      avg: {
        type: 'float',
        _meta: {
          description: 'The average number of elements used in Canvas Custom Element'
        }
      }
    },
    functions_in_use: {
      type: 'array',
      items: {
        type: 'keyword',
        _meta: {
          description: 'The functions in use by Canvas Custom Elements'
        }
      }
    }
  }
};
exports.customElementSchema = customElementSchema;
function isCustomElement(maybeCustomElement) {
  return maybeCustomElement !== null && Array.isArray(maybeCustomElement.selectedNodes) && maybeCustomElement.selectedNodes.every(node => node.expression && typeof node.expression === 'string');
}
function parseJsonOrNull(maybeJson) {
  try {
    return JSON.parse(maybeJson);
  } catch (e) {
    return null;
  }
}

/**
  Calculate statistics about a collection of CustomElement Documents
  @param customElements - Array of CustomElement documents
  @returns Statistics about how Custom Elements are being used
*/
function summarizeCustomElements(customElements) {
  const functionSet = new Set();
  const parsedContents = customElements.map(element => element.content).map(parseJsonOrNull).filter(isCustomElement);
  if (parsedContents.length === 0) {
    return {};
  }
  const elements = {
    min: Infinity,
    max: -Infinity,
    avg: 0
  };
  let totalElements = 0;
  parsedContents.map(contents => {
    contents.selectedNodes.map(node => {
      const ast = (0, _common.parseExpression)(node.expression);
      (0, _collector_helpers.collectFns)(ast, cFunction => {
        functionSet.add(cFunction);
      });
    });
    elements.min = Math.min(elements.min, contents.selectedNodes.length);
    elements.max = Math.max(elements.max, contents.selectedNodes.length);
    totalElements += contents.selectedNodes.length;
  });
  elements.avg = totalElements / parsedContents.length;
  return {
    custom_elements: {
      elements,
      count: customElements.length,
      functions_in_use: Array.from(functionSet)
    }
  };
}
const customElementCollector = async function customElementCollector(kibanaIndex, esClient) {
  const customElementParams = {
    size: 10000,
    index: kibanaIndex,
    ignore_unavailable: true,
    filter_path: [`hits.hits._source.${CUSTOM_ELEMENT_TYPE}.content`],
    body: {
      query: {
        bool: {
          filter: {
            term: {
              type: CUSTOM_ELEMENT_TYPE
            }
          }
        }
      }
    }
  };
  const esResponse = await esClient.search(customElementParams);
  if ((0, _lodash.get)(esResponse, 'hits.hits.length') > 0) {
    const customElements = esResponse.hits.hits.map(hit => hit._source[CUSTOM_ELEMENT_TYPE]);
    return summarizeCustomElements(customElements);
  }
  return {};
};
exports.customElementCollector = customElementCollector;