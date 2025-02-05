"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSampleData = registerSampleData;
var _i18n = require("@kbn/i18n");
var _common = require("../../../saved_search/common");
var _common2 = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function getDiscoverPathForSampleDataset(objId) {
  // TODO: remove the time range from the URL query when saved search objects start supporting time range configuration
  // https://github.com/elastic/kibana/issues/9761
  return `${(0, _common.getSavedSearchFullPathUrl)(objId)}?_g=(time:(from:now-7d,to:now))`;
}
function registerSampleData(sampleDataRegistry) {
  const linkLabel = _i18n.i18n.translate('discover.sampleData.viewLinkLabel', {
    defaultMessage: 'Discover'
  });
  const {
    addAppLinksToSampleDataset,
    getSampleDatasets
  } = sampleDataRegistry;
  const sampleDatasets = getSampleDatasets();
  sampleDatasets.forEach(sampleDataset => {
    const sampleSavedSearchObject = sampleDataset.savedObjects.find(object => object.type === 'search');
    if (sampleSavedSearchObject) {
      addAppLinksToSampleDataset(sampleDataset.id, [{
        sampleObject: sampleSavedSearchObject,
        getPath: getDiscoverPathForSampleDataset,
        label: linkLabel,
        icon: _common2.APP_ICON,
        order: -1
      }]);
    }
  });
}