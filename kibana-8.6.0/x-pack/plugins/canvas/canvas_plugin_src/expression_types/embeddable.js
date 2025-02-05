"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmbeddableExpressionType = void 0;
Object.defineProperty(exports, "EmbeddableTypes", {
  enumerable: true,
  get: function () {
    return _embeddable_types.EmbeddableTypes;
  }
});
exports.embeddableType = void 0;
var _embeddable_types = require("./embeddable_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const EmbeddableExpressionType = 'embeddable';
exports.EmbeddableExpressionType = EmbeddableExpressionType;
const embeddableType = () => ({
  name: EmbeddableExpressionType,
  to: {
    render: embeddableExpression => {
      return {
        type: 'render',
        as: EmbeddableExpressionType,
        value: embeddableExpression
      };
    }
  }
});
exports.embeddableType = embeddableType;