"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterArgsToKuery = filterArgsToKuery;
exports.filterDeletedFiles = filterDeletedFiles;
var _fp = require("lodash/fp");
var _esQuery = require("@kbn/es-query");
var _std = require("@kbn/std");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const deletedStatus = 'DELETED';
function filterDeletedFiles({
  attrPrefix
}) {
  return _esQuery.nodeTypes.function.buildNode('not', _esQuery.nodeBuilder.is(`${attrPrefix}.Status`, deletedStatus));
}
function filterArgsToKuery({
  extension,
  kind,
  meta,
  name,
  status,
  attrPrefix = ''
}) {
  const kueryExpressions = [filterDeletedFiles({
    attrPrefix
  })];
  const addFilters = (fieldName, values = [], isWildcard = false) => {
    if (values.length) {
      const orExpressions = values.filter(Boolean).map(value => _esQuery.nodeBuilder.is(`${attrPrefix}.${fieldName}`, isWildcard ? _esQuery.nodeTypes.wildcard.buildNode(value) : (0, _esQuery.escapeKuery)(value)));
      kueryExpressions.push(_esQuery.nodeBuilder.or(orExpressions));
    }
  };
  addFilters('name', name, true);
  addFilters('FileKind', kind);
  addFilters('Status', status);
  addFilters('extension', extension);
  if (meta) {
    const addMetaFilters = (0, _fp.pipe)(_std.getFlattenedObject, Object.entries, (0, _fp.forEach)(([fieldName, value]) => {
      addFilters(`Meta.${fieldName}`, Array.isArray(value) ? value : [value], true);
    }));
    addMetaFilters(meta);
  }
  return _esQuery.nodeBuilder.and(kueryExpressions);
}