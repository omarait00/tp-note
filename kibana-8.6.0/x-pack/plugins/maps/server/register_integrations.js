"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerIntegrations = registerIntegrations;
var _i18n = require("@kbn/i18n");
var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerIntegrations(core, customIntegrations) {
  customIntegrations.registerCustomIntegration({
    id: 'ingest_with_gdal',
    title: _i18n.i18n.translate('xpack.maps.registerIntegrations.gdal.integrationTitle', {
      defaultMessage: 'GDAL'
    }),
    description: _i18n.i18n.translate('xpack.maps.registerIntegrations.gdal.integrationDescription', {
      defaultMessage: 'Upload shapefiles and ingest from relational databases such as PostGIS or Oracle Spatial with GDAL.'
    }),
    uiInternalPath: 'https://www.elastic.co/blog/how-to-ingest-geospatial-data-into-elasticsearch-with-gdal',
    icons: [{
      type: 'svg',
      src: core.http.basePath.prepend(`/plugins/${_constants.APP_ID}/assets/gdal_logo.svg`)
    }],
    categories: ['upload_file', 'geo'],
    shipper: 'other',
    isBeta: false
  });
  customIntegrations.registerCustomIntegration({
    id: 'ingest_geojson',
    title: _i18n.i18n.translate('xpack.maps.registerIntegrations.geojson.integrationTitle', {
      defaultMessage: 'GeoJSON'
    }),
    description: _i18n.i18n.translate('xpack.maps.registerIntegrations.geojson.integrationDescription', {
      defaultMessage: 'Upload GeoJSON files with Elastic Maps.'
    }),
    uiInternalPath: `${(0, _constants.getFullPath)('')}#?${_constants.OPEN_LAYER_WIZARD}=${_constants.WIZARD_ID.GEO_FILE}`,
    icons: [{
      type: 'eui',
      src: 'logoMaps'
    }],
    categories: ['upload_file', 'geo'],
    shipper: 'other',
    isBeta: false
  });
  customIntegrations.registerCustomIntegration({
    id: 'ingest_shape',
    title: _i18n.i18n.translate('xpack.maps.registerIntegrations.shapefile.integrationTitle', {
      defaultMessage: 'Shapefile'
    }),
    description: _i18n.i18n.translate('xpack.maps.registerIntegrations.shapefile.integrationDescription', {
      defaultMessage: 'Upload Shapefiles with Elastic Maps.'
    }),
    uiInternalPath: `${(0, _constants.getFullPath)('')}#?${_constants.OPEN_LAYER_WIZARD}=${_constants.WIZARD_ID.GEO_FILE}`,
    icons: [{
      type: 'eui',
      src: 'logoMaps'
    }],
    categories: ['upload_file', 'geo'],
    shipper: 'other',
    isBeta: false
  });
}