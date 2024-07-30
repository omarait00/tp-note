"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FindSLO = void 0;
var _rest_specs = require("../../types/rest_specs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 25;
class FindSLO {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(params) {
    const pagination = toPagination(params);
    const criteria = toCriteria(params);
    const result = await this.repository.find(criteria, pagination);
    return this.toResponse(result);
  }
  toResponse(result) {
    return _rest_specs.findSLOResponseSchema.encode({
      page: result.page,
      per_page: result.perPage,
      total: result.total,
      results: result.results
    });
  }
}
exports.FindSLO = FindSLO;
function toPagination(params) {
  const page = Number(params.page);
  const perPage = Number(params.per_page);
  return {
    page: !isNaN(page) && page >= 1 ? page : DEFAULT_PAGE,
    perPage: !isNaN(perPage) && perPage >= 1 ? perPage : DEFAULT_PER_PAGE
  };
}
function toCriteria(params) {
  return {
    name: params.name
  };
}