"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrations850 = void 0;
var _common = require("../../../../../../../src/plugins/data/common");
var _lodash = require("lodash");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function stripOutRuntimeFieldsInOldESQuery(doc, context) {
  const isESDSLrule = (0, _utils.isEsQueryRuleType)(doc) && !(0, _common.isSerializedSearchSource)(doc.attributes.params.searchConfiguration);
  if (isESDSLrule) {
    try {
      const parsedQuery = JSON.parse(doc.attributes.params.esQuery);
      // parsing and restringifying will cause us to lose the formatting so we only do so if this rule has
      // fields other than `query` which is the only valid field at this stage
      const hasFieldsOtherThanQuery = Object.keys(parsedQuery).some(key => key !== 'query');
      return hasFieldsOtherThanQuery ? {
        ...doc,
        attributes: {
          ...doc.attributes,
          params: {
            ...doc.attributes.params,
            esQuery: JSON.stringify((0, _lodash.pick)(parsedQuery, 'query'), null, 4)
          }
        }
      } : doc;
    } catch (err) {
      // Instead of failing the upgrade when an unparsable rule is encountered, we log that the rule caouldn't be migrated and
      // as a result legacy parameters might cause the rule to behave differently if it is, in fact, still running at all
      context.log.error(`unable to migrate and remove legacy runtime fields in rule ${doc.id} due to invalid query: "${doc.attributes.params.esQuery}" - query must be JSON`, {
        migrations: {
          alertDocument: doc
        }
      });
    }
  }
  return doc;
}
const getMigrations850 = encryptedSavedObjects => (0, _utils.createEsoMigration)(encryptedSavedObjects, doc => (0, _utils.isEsQueryRuleType)(doc), (0, _utils.pipeMigrations)(stripOutRuntimeFieldsInOldESQuery));
exports.getMigrations850 = getMigrations850;