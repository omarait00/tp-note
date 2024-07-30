"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExtractPanelReferencesMigration = createExtractPanelReferencesMigration;
var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * In 7.8.0 we introduced dashboard drilldowns which are stored inside dashboard saved object as part of embeddable state
 * In 7.11.0 we created an embeddable references/migrations system that allows to properly extract embeddable persistable state
 * https://github.com/elastic/kibana/issues/71409
 * The idea of this migration is to inject all the embeddable panel references and then run the extraction again.
 * As the result of the extraction:
 * 1. In addition to regular `panel_` we will get new references which are extracted by `embeddablePersistableStateService` (dashboard drilldown references)
 * 2. `panel_` references will be regenerated
 * All other references like index-patterns are forwarded non touched
 * @param deps
 */
function createExtractPanelReferencesMigration(deps) {
  return doc => {
    var _doc$references;
    const references = (_doc$references = doc.references) !== null && _doc$references !== void 0 ? _doc$references : [];

    /**
     * Remembering this because dashboard's extractReferences won't return those
     * All other references like `panel_` will be overwritten
     */
    const oldNonPanelReferences = references.filter(ref => !ref.name.startsWith('panel_'));
    const injectedAttributes = (0, _common.injectReferences)({
      attributes: doc.attributes,
      references
    }, {
      embeddablePersistableStateService: deps.embeddable
    });
    const {
      attributes,
      references: newPanelReferences
    } = (0, _common.extractReferences)({
      attributes: injectedAttributes,
      references: []
    }, {
      embeddablePersistableStateService: deps.embeddable
    });
    return {
      ...doc,
      references: [...oldNonPanelReferences, ...newPanelReferences],
      attributes
    };
  };
}