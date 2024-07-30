"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildArtifact = buildArtifact;
exports.getEndpointExceptionList = getEndpointExceptionList;
exports.getFilteredEndpointExceptionList = getFilteredEndpointExceptionList;
exports.translateToEndpointExceptions = translateToEndpointExceptions;
var _path = _interopRequireDefault(require("path"));
var _crypto = require("crypto");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _securitysolutionUtils = require("@kbn/securitysolution-utils");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _schemas = require("../../schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function buildArtifact(exceptions, schemaVersion, os, name) {
  const exceptionsBuffer = Buffer.from(JSON.stringify(exceptions));
  const sha256 = (0, _crypto.createHash)('sha256').update(exceptionsBuffer.toString()).digest('hex');

  // Keep compression info empty in case its a duplicate. Lazily compress before committing if needed.
  return {
    identifier: `${name}-${os}-${schemaVersion}`,
    compressionAlgorithm: 'none',
    encryptionAlgorithm: 'none',
    decodedSha256: sha256,
    encodedSha256: sha256,
    decodedSize: exceptionsBuffer.byteLength,
    encodedSize: exceptionsBuffer.byteLength,
    body: exceptionsBuffer.toString('base64')
  };
}
async function getFilteredEndpointExceptionList({
  elClient,
  filter,
  listId,
  schemaVersion
}) {
  const exceptions = {
    entries: []
  };
  let page = 1;
  let paging = true;
  while (paging) {
    const response = await elClient.findExceptionListItem({
      listId,
      namespaceType: 'agnostic',
      filter,
      perPage: 100,
      page,
      sortField: 'created_at',
      sortOrder: 'desc'
    });
    if ((response === null || response === void 0 ? void 0 : response.data) !== undefined) {
      exceptions.entries = exceptions.entries.concat(translateToEndpointExceptions(response.data, schemaVersion));
      paging = (page - 1) * 100 + response.data.length < response.total;
      page++;
    } else {
      break;
    }
  }
  const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(exceptions, _schemas.wrappedTranslatedExceptionList);
  if (errors != null) {
    throw new Error(errors);
  }
  return validated;
}
async function getEndpointExceptionList({
  elClient,
  listId,
  os,
  policyId,
  schemaVersion
}) {
  const osFilter = `exception-list-agnostic.attributes.os_types:\"${os}\"`;
  const policyFilter = `(exception-list-agnostic.attributes.tags:\"policy:all\"${policyId ? ` or exception-list-agnostic.attributes.tags:\"policy:${policyId}\"` : ''})`;

  // for endpoint list
  if (!listId || listId === _securitysolutionListConstants.ENDPOINT_LIST_ID) {
    return getFilteredEndpointExceptionList({
      elClient,
      schemaVersion,
      filter: `${osFilter}`,
      listId: _securitysolutionListConstants.ENDPOINT_LIST_ID
    });
  }
  // for TAs, EFs, Host IEs and Blocklists
  return getFilteredEndpointExceptionList({
    elClient,
    schemaVersion,
    filter: `${osFilter} and ${policyFilter}`,
    listId
  });
}

/**
 * Translates Exception list items to Exceptions the endpoint can understand
 * @param exceptions
 * @param schemaVersion
 */
function translateToEndpointExceptions(exceptions, schemaVersion) {
  const entrySet = new Set();
  const entriesFiltered = [];
  if (schemaVersion === 'v1') {
    exceptions.forEach(entry => {
      const translatedItem = translateItem(schemaVersion, entry);
      const entryHash = (0, _crypto.createHash)('sha256').update(JSON.stringify(translatedItem)).digest('hex');
      if (!entrySet.has(entryHash)) {
        entriesFiltered.push(translatedItem);
        entrySet.add(entryHash);
      }
    });
    return entriesFiltered;
  } else {
    throw new Error('unsupported schemaVersion');
  }
}
function getMatcherFunction({
  field,
  matchAny,
  os
}) {
  const doesFieldEndWith = field.endsWith('.caseless') || field.endsWith('.name') || field.endsWith('.text');
  return matchAny ? doesFieldEndWith ? os === 'linux' ? 'exact_cased_any' : 'exact_caseless_any' : 'exact_cased_any' : doesFieldEndWith ? os === 'linux' ? 'exact_cased' : 'exact_caseless' : 'exact_cased';
}
function getMatcherWildcardFunction({
  field,
  os
}) {
  return field.endsWith('.caseless') || field.endsWith('.text') ? os === 'linux' ? 'wildcard_cased' : 'wildcard_caseless' : 'wildcard_cased';
}
function normalizeFieldName(field) {
  return field.endsWith('.caseless') || field.endsWith('.text') ? field.substring(0, field.lastIndexOf('.')) : field;
}
function translateItem(schemaVersion, item) {
  const itemSet = new Set();
  const getEntries = () => {
    return item.entries.reduce((translatedEntries, entry) => {
      const translatedEntry = translateEntry(schemaVersion, item.entries, entry, item.os_types[0]);
      if (translatedEntry !== undefined) {
        if (_schemas.translatedEntry.is(translatedEntry)) {
          const itemHash = (0, _crypto.createHash)('sha256').update(JSON.stringify(translatedEntry)).digest('hex');
          if (!itemSet.has(itemHash)) {
            translatedEntries.push(translatedEntry);
            itemSet.add(itemHash);
          }
        }
        if (_schemas.translatedPerformantEntries.is(translatedEntry)) {
          translatedEntry.forEach(tpe => {
            const itemHash = (0, _crypto.createHash)('sha256').update(JSON.stringify(tpe)).digest('hex');
            if (!itemSet.has(itemHash)) {
              translatedEntries.push(tpe);
              itemSet.add(itemHash);
            }
          });
        }
      }
      return translatedEntries;
    }, []);
  };
  return {
    type: item.type,
    entries: getEntries()
  };
}
function appendOptimizedEntryForEndpoint({
  entry,
  os,
  wildcardProcessEntry
}) {
  const entries = [wildcardProcessEntry, {
    field: entry.field === 'file.path.text' ? normalizeFieldName('file.name') : normalizeFieldName('process.name'),
    operator: entry.operator,
    type: os === 'linux' ? 'exact_cased' : 'exact_caseless',
    value: os === 'windows' ? _path.default.win32.basename(entry.value) : _path.default.posix.basename(entry.value)
  }].reduce((p, c) => {
    p.push(c);
    return p;
  }, []);
  return entries;
}
function translateEntry(schemaVersion, exceptionListItemEntries, entry, os) {
  switch (entry.type) {
    case 'nested':
      {
        const nestedEntries = entry.entries.reduce((entries, nestedEntry) => {
          const translatedEntry = translateEntry(schemaVersion, exceptionListItemEntries, nestedEntry, os);
          if (nestedEntry !== undefined && _schemas.translatedEntryNestedEntry.is(translatedEntry)) {
            entries.push(translatedEntry);
          }
          return entries;
        }, []);
        return {
          entries: nestedEntries,
          field: entry.field,
          type: 'nested'
        };
      }
    case 'match':
      {
        const matcher = getMatcherFunction({
          field: entry.field,
          os
        });
        return _schemas.translatedEntryMatchMatcher.is(matcher) ? {
          field: normalizeFieldName(entry.field),
          operator: entry.operator,
          type: matcher,
          value: entry.value
        } : undefined;
      }
    case 'match_any':
      {
        const matcher = getMatcherFunction({
          field: entry.field,
          matchAny: true,
          os
        });
        return _schemas.translatedEntryMatchAnyMatcher.is(matcher) ? {
          field: normalizeFieldName(entry.field),
          operator: entry.operator,
          type: matcher,
          value: entry.value
        } : undefined;
      }
    case 'wildcard':
      {
        const wildcardMatcher = getMatcherWildcardFunction({
          field: entry.field,
          os
        });
        const translatedEntryWildcardMatcher = _schemas.translatedEntryMatchWildcardMatcher.is(wildcardMatcher);
        const buildEntries = () => {
          if (translatedEntryWildcardMatcher) {
            // default process.executable entry
            const wildcardProcessEntry = {
              field: normalizeFieldName(entry.field),
              operator: entry.operator,
              type: wildcardMatcher,
              value: entry.value
            };
            const hasExecutableName = (0, _securitysolutionUtils.hasSimpleExecutableName)({
              os: os,
              type: entry.type,
              value: entry.value
            });
            const existingFields = exceptionListItemEntries.map(e => e.field);
            const doAddPerformantEntries = !(existingFields.includes('process.name') || existingFields.includes('file.name'));
            if (hasExecutableName && doAddPerformantEntries) {
              // when path has a full executable name
              // append a process.name entry based on os
              // `exact_cased` for linux and `exact_caseless` for others
              return appendOptimizedEntryForEndpoint({
                entry,
                os,
                wildcardProcessEntry
              });
            } else {
              return wildcardProcessEntry;
            }
          }
        };
        return buildEntries();
      }
  }
}