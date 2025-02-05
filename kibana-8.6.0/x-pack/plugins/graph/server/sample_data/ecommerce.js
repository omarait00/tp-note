"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEcommerceSampleData = registerEcommerceSampleData;
exports.registerEcommerceSampleDataLink = registerEcommerceSampleDataLink;
var _i18n = require("@kbn/i18n");
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const datasetId = 'ecommerce';
const wsState = {
  selectedFields: [{
    name: 'customer_gender',
    hopSize: 5,
    lastValidHopSize: 5,
    color: '#7B000B',
    selected: true,
    iconClass: 'fa-user'
  }, {
    name: 'geoip.continent_name',
    hopSize: 5,
    lastValidHopSize: 5,
    color: '#B0916F',
    selected: true,
    iconClass: 'fa-map-marker'
  }, {
    name: 'products.category.keyword',
    hopSize: 5,
    lastValidHopSize: 5,
    color: '#34130C',
    selected: true,
    iconClass: 'fa-heart'
  }],
  blocklist: [{
    x: 491.3880229084531,
    y: 572.375603969653,
    label: 'South America',
    color: '#B0916F',
    field: 'geoip.continent_name',
    term: 'South America',
    parent: null,
    size: 15
  }],
  vertices: [{
    x: 458.033767981859,
    y: 181.9021747060339,
    label: "Women's Shoes",
    color: '#34130C',
    field: 'products.category.keyword',
    term: "Women's Shoes",
    parent: null,
    size: 15
  }, {
    x: 236.16141155056786,
    y: 371.69388982857515,
    label: "Men's Accessories",
    color: '#34130C',
    field: 'products.category.keyword',
    term: "Men's Accessories",
    parent: null,
    size: 15
  }, {
    x: 334.27149182482333,
    y: 244.99855207230468,
    label: "Women's Accessories",
    color: '#34130C',
    field: 'products.category.keyword',
    term: "Women's Accessories",
    parent: null,
    size: 15
  }, {
    x: 452.21475063865597,
    y: 330.39076195279216,
    label: 'Asia',
    color: '#B0916F',
    field: 'geoip.continent_name',
    term: 'Asia',
    parent: null,
    size: 15
  }, {
    x: 397.79868111013536,
    y: 280.55152377990424,
    label: 'Europe',
    color: '#B0916F',
    field: 'geoip.continent_name',
    term: 'Europe',
    parent: null,
    size: 15
  }, {
    x: 324.72030800021247,
    y: 352.6641597050945,
    label: "Men's Shoes",
    color: '#34130C',
    field: 'products.category.keyword',
    term: "Men's Shoes",
    parent: null,
    size: 15
  }, {
    x: 372.16854727881645,
    y: 390.62646298282147,
    label: "Men's Clothing",
    color: '#34130C',
    field: 'products.category.keyword',
    term: "Men's Clothing",
    parent: null,
    size: 15
  }, {
    x: 508.049093768632,
    y: 242.4089619805834,
    label: "Women's Clothing",
    color: '#34130C',
    field: 'products.category.keyword',
    term: "Women's Clothing",
    parent: null,
    size: 15
  }, {
    x: 440.1331838313072,
    y: 289.96431350734645,
    label: 'Africa',
    color: '#B0916F',
    field: 'geoip.continent_name',
    term: 'Africa',
    parent: null,
    size: 15
  }, {
    x: 387.0908385779075,
    y: 210.10263143650025,
    label: 'FEMALE',
    color: '#7B000B',
    field: 'customer_gender',
    term: 'FEMALE',
    parent: null,
    size: 15
  }, {
    x: 290.59483393305874,
    y: 298.89363320612324,
    label: 'MALE',
    color: '#7B000B',
    field: 'customer_gender',
    term: 'MALE',
    parent: null,
    size: 15
  }, {
    x: 413.02719526683677,
    y: 322.2286023727188,
    label: 'North America',
    color: '#B0916F',
    field: 'geoip.continent_name',
    term: 'North America',
    parent: null,
    size: 15
  }],
  links: [{
    weight: 0.005857130017177792,
    width: 8.232101279777059,
    inferred: false,
    source: 7,
    target: 7
  }, {
    weight: 0.00040740358951793883,
    width: 2,
    inferred: false,
    source: 2,
    target: 10
  }, {
    weight: 0.00013791546585173228,
    width: 2,
    inferred: false,
    source: 5,
    target: 1
  }, {
    weight: 0.0004858267848737237,
    width: 2,
    inferred: false,
    source: 4,
    target: 2
  }, {
    weight: 0.0010153751000293245,
    width: 2,
    inferred: false,
    source: 10,
    target: 11
  }, {
    weight: 0.0028264125846644674,
    width: 2,
    inferred: false,
    source: 2,
    target: 9
  }, {
    weight: 0.0005650580249547761,
    width: 2,
    inferred: false,
    source: 3,
    target: 0
  }, {
    weight: 0.0009324185728321393,
    width: 2,
    inferred: false,
    source: 6,
    target: 11
  }, {
    weight: 0.0014323721292750112,
    width: 2.0131758052049205,
    inferred: false,
    source: 4,
    target: 4
  }, {
    weight: 0.002342547575207893,
    width: 3.2924126381437944,
    inferred: false,
    source: 0,
    target: 0
  }, {
    weight: 0.000591872989689757,
    width: 2,
    inferred: false,
    source: 8,
    target: 5
  }, {
    weight: 0.0008255717897066532,
    width: 2,
    inferred: false,
    source: 3,
    target: 5
  }, {
    weight: 0.0006448216532672799,
    width: 2,
    inferred: false,
    source: 7,
    target: 8
  }, {
    weight: 0.0002511052407839208,
    width: 2,
    inferred: false,
    source: 8,
    target: 0
  }, {
    weight: 0.0013789044568299467,
    width: 2,
    inferred: false,
    source: 8,
    target: 10
  }, {
    weight: 0.000783301409144887,
    width: 2,
    inferred: false,
    source: 8,
    target: 9
  }, {
    weight: 0.00560336629275442,
    width: 7.875440479272377,
    inferred: false,
    source: 10,
    target: 6
  }, {
    weight: 0.0005016633048258001,
    width: 2,
    inferred: false,
    source: 5,
    target: 11
  }, {
    weight: 0.0003926052511049418,
    width: 2,
    inferred: false,
    source: 2,
    target: 3
  }, {
    weight: 0.0008115500826586831,
    width: 2,
    inferred: false,
    source: 8,
    target: 8
  }, {
    weight: 0.0014948001891181592,
    width: 2,
    inferred: false,
    source: 3,
    target: 9
  }, {
    weight: 0.000029981623011246145,
    width: 2,
    inferred: false,
    source: 2,
    target: 5
  }, {
    weight: 0.002480454462292142,
    width: 3.4862385321100913,
    inferred: false,
    source: 9,
    target: 4
  }, {
    weight: 0.002025814694014704,
    width: 2,
    inferred: false,
    source: 11,
    target: 7
  }, {
    weight: 0.0026700604482252604,
    width: 2.137643910722111,
    inferred: false,
    source: 3,
    target: 10
  }, {
    weight: 0.00010444018788598492,
    width: 2,
    inferred: false,
    source: 9,
    target: 6
  }, {
    weight: 0.0024519155063363668,
    width: 3.44612749220522,
    inferred: false,
    source: 6,
    target: 3
  }, {
    weight: 0.0006267747531045212,
    width: 2,
    inferred: false,
    source: 10,
    target: 1
  }, {
    weight: 0.00016502073678324177,
    width: 2,
    inferred: false,
    source: 2,
    target: 8
  }, {
    weight: 0.0005870783606720878,
    width: 2,
    inferred: false,
    source: 6,
    target: 4
  }, {
    weight: 0.00038852356835608306,
    width: 2,
    inferred: false,
    source: 6,
    target: 2
  }, {
    weight: 0.001950556798534224,
    width: 2.741475956722648,
    inferred: false,
    source: 5,
    target: 5
  }, {
    weight: 0.0005728452602402718,
    width: 2,
    inferred: false,
    source: 2,
    target: 11
  }, {
    weight: 0.0068966839555125534,
    width: 9.693177486223698,
    inferred: false,
    source: 9,
    target: 9
  }, {
    weight: 0.003985530212040768,
    width: 3.2924126381437944,
    inferred: false,
    source: 0,
    target: 7
  }, {
    weight: 0.0005390262876698882,
    width: 2,
    inferred: false,
    source: 4,
    target: 10
  }, {
    weight: 0.001230534654985059,
    width: 2,
    inferred: false,
    source: 3,
    target: 7
  }, {
    weight: 0.0012265720435530507,
    width: 2,
    inferred: false,
    source: 2,
    target: 2
  }, {
    weight: 0.00010444018788598492,
    width: 2,
    inferred: false,
    source: 9,
    target: 5
  }, {
    weight: 0.00246087192706352,
    width: 2,
    inferred: false,
    source: 11,
    target: 9
  }, {
    weight: 0.001266247444586856,
    width: 2,
    inferred: false,
    source: 6,
    target: 8
  }, {
    weight: 0.0040928391377725235,
    width: 5.752419052533403,
    inferred: false,
    source: 10,
    target: 5
  }, {
    weight: 0.003998804111234147,
    width: 2.741475956722648,
    inferred: false,
    source: 5,
    target: 6
  }, {
    weight: 0.0000201191575509262,
    width: 2,
    inferred: false,
    source: 2,
    target: 1
  }, {
    weight: 0.0019559590149107486,
    width: 2,
    inferred: false,
    source: 4,
    target: 7
  }, {
    weight: 0.005399134008600699,
    width: 7.588395315032752,
    inferred: false,
    source: 10,
    target: 10
  }, {
    weight: 0.0008406249972756651,
    width: 2,
    inferred: false,
    source: 11,
    target: 0
  }, {
    weight: 0.002434040312854235,
    width: 2,
    inferred: false,
    source: 2,
    target: 7
  }, {
    weight: 0.0007632277713300751,
    width: 2,
    inferred: false,
    source: 4,
    target: 0
  }, {
    weight: 0.007114987799732724,
    width: 10,
    inferred: false,
    source: 9,
    target: 7
  }, {
    weight: 0.00029149607092423423,
    width: 2,
    inferred: false,
    source: 4,
    target: 5
  }, {
    weight: 0.004628005825697707,
    width: 3.2924126381437944,
    inferred: false,
    source: 0,
    target: 9
  }, {
    weight: 0.0001769629690348846,
    width: 2,
    inferred: false,
    source: 0,
    target: 2
  }, {
    weight: 0.0017862657198589743,
    width: 2.510567509231816,
    inferred: false,
    source: 11,
    target: 11
  }, {
    weight: 0.0023385207220538266,
    width: 3.286752961321555,
    inferred: false,
    source: 3,
    target: 3
  }, {
    weight: 0.0005977285667016662,
    width: 2,
    inferred: false,
    source: 6,
    target: 1
  }, {
    weight: 0.00523765988442745,
    width: 7.361446051424297,
    inferred: false,
    source: 6,
    target: 6
  }],
  urlTemplates: [{
    url: '/app/discover#/?_a=(columns%3A!(_source)%2Cindex%3Aff959d40-b880-11e8-a6d9-e546fe2bba5f%2Cinterval%3Aauto%2Cquery%3A(language%3Akuery%2Cquery%3A{{gquery}})%2Csort%3A!(_score%2Cdesc))',
    description: 'Raw documents',
    isDefault: true,
    encoderID: 'kql-loose'
  }],
  exploreControls: {
    useSignificance: false,
    sampleSize: 2000,
    timeoutMillis: 5000,
    maxValuesPerDoc: 1,
    minDocCount: 3
  }
};
function registerEcommerceSampleData(sampleDataRegistry) {
  sampleDataRegistry.addSavedObjectsToSampleDataset(datasetId, [{
    type: 'graph-workspace',
    id: '46fa9d30-319c-11ea-bbe4-818d9c786051',
    version: '2',
    attributes: {
      title: 'Kibana Sample Data - eCommerce',
      description: 'This is a sample graph based on an eCommerce data set.  It shows the gender, continent, and product category of purchases.  The thicker the line is, there are more correlated documents between the vertices.',
      numLinks: 57,
      numVertices: 12,
      version: 1,
      wsState: JSON.stringify(JSON.stringify(wsState)),
      legacyIndexPatternRef: 'kibana_sample_data_ecommerce'
    },
    references: [],
    migrationVersion: {
      'graph-workspace': '7.11.0'
    },
    updated_at: '2020-01-09T16:40:36.122Z'
  }]);
}
function registerEcommerceSampleDataLink(sampleDataRegistry) {
  sampleDataRegistry.addAppLinksToSampleDataset(datasetId, [{
    sampleObject: {
      type: 'graph-workspace',
      id: '46fa9d30-319c-11ea-bbe4-818d9c786051'
    },
    getPath: _constants.createWorkspacePath,
    label: _i18n.i18n.translate('xpack.graph.sampleData.label', {
      defaultMessage: 'Graph'
    }),
    icon: _constants.APP_ICON
  }]);
}