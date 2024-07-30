"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEntitiesAndGenerateAlerts = getEntitiesAndGenerateAlerts;
exports.getGeoContainmentExecutor = void 0;
exports.transformResults = transformResults;
var _lodash = _interopRequireDefault(require("lodash"));
var _es_query_builder = require("./es_query_builder");
var _alert_type = require("./alert_type");
var _get_context = require("./get_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Flatten agg results and get latest locations for each entity
function transformResults(results, dateField, geoField) {
  if (!results) {
    return new Map();
  }
  const buckets = _lodash.default.get(results, 'aggregations.shapes.buckets', {});
  const arrResults = _lodash.default.flatMap(buckets, (bucket, bucketKey) => {
    const subBuckets = _lodash.default.get(bucket, 'entitySplit.buckets', []);
    return _lodash.default.map(subBuckets, subBucket => {
      const locationFieldResult = _lodash.default.get(subBucket, `entityHits.hits.hits[0].fields["${geoField}"][0]`, '');
      const location = locationFieldResult ? _lodash.default.chain(locationFieldResult).split(', ').map(coordString => +coordString).reverse().value() : [];
      const dateInShape = _lodash.default.get(subBucket, `entityHits.hits.hits[0].fields["${dateField}"][0]`, null);
      const docId = _lodash.default.get(subBucket, `entityHits.hits.hits[0]._id`);
      return {
        location,
        shapeLocationId: bucketKey,
        entityName: subBucket.key,
        dateInShape,
        docId
      };
    });
  });
  const orderedResults = _lodash.default.orderBy(arrResults, ['entityName', 'dateInShape'], ['asc', 'desc'])
  // Get unique
  .reduce((accu, el) => {
    const {
      entityName,
      ...locationData
    } = el;
    if (entityName) {
      if (!accu.has(entityName)) {
        accu.set(entityName, []);
      }
      accu.get(entityName).push(locationData);
    }
    return accu;
  }, new Map());
  return orderedResults;
}
function getEntitiesAndGenerateAlerts(prevLocationMap, currLocationMap, alertFactory, shapesIdsNamesMap, windowEnd) {
  const activeEntities = new Map([...prevLocationMap, ...currLocationMap]);
  const inactiveEntities = new Map();
  activeEntities.forEach((containments, entityName) => {
    // Generate alerts
    containments.forEach(containment => {
      if (containment.shapeLocationId !== _es_query_builder.OTHER_CATEGORY) {
        const context = (0, _get_context.getContainedAlertContext)({
          entityName,
          containment,
          shapesIdsNamesMap,
          windowEnd
        });
        alertFactory.create((0, _get_context.getAlertId)(entityName, context.containingBoundaryName)).scheduleActions(_alert_type.ActionGroupId, context);
      }
    });

    // Entity in "other" filter bucket is no longer contained by any boundary and switches from "active" to "inactive"
    if (containments[0].shapeLocationId === _es_query_builder.OTHER_CATEGORY) {
      inactiveEntities.set(entityName, containments);
      activeEntities.delete(entityName);
      return;
    }
    const otherCatIndex = containments.findIndex(({
      shapeLocationId
    }) => shapeLocationId === _es_query_builder.OTHER_CATEGORY);
    if (otherCatIndex >= 0) {
      const afterOtherLocationsArr = containments.slice(0, otherCatIndex);
      activeEntities.set(entityName, afterOtherLocationsArr);
    } else {
      activeEntities.set(entityName, containments);
    }
  });
  return {
    activeEntities,
    inactiveEntities
  };
}
const getGeoContainmentExecutor = () => async function ({
  previousStartedAt: windowStart,
  startedAt: windowEnd,
  services,
  params,
  rule: {
    id: ruleId
  },
  state,
  logger
}) {
  const {
    shapesFilters,
    shapesIdsNamesMap
  } = state.shapesFilters ? state : await (0, _es_query_builder.getShapesFilters)(params.boundaryIndexTitle, params.boundaryGeoField, params.geoField, services.scopedClusterClient.asCurrentUser, logger, ruleId, params.boundaryNameField, params.boundaryIndexQuery);
  const executeEsQuery = await (0, _es_query_builder.executeEsQueryFactory)(params, services.scopedClusterClient.asCurrentUser, logger, shapesFilters);

  // Start collecting data only on the first cycle
  let currentIntervalResults;
  if (!windowStart) {
    logger.debug(`alert ${_alert_type.GEO_CONTAINMENT_ID}:${ruleId} alert initialized. Collecting data`);
    // Consider making first time window configurable?
    const START_TIME_WINDOW = 1;
    const tempPreviousEndTime = new Date(windowEnd);
    tempPreviousEndTime.setMinutes(tempPreviousEndTime.getMinutes() - START_TIME_WINDOW);
    currentIntervalResults = await executeEsQuery(tempPreviousEndTime, windowEnd);
  } else {
    currentIntervalResults = await executeEsQuery(windowStart, windowEnd);
  }
  const currLocationMap = transformResults(currentIntervalResults, params.dateField, params.geoField);
  const prevLocationMap = new Map([...Object.entries(state.prevLocationMap || {})]);
  const {
    activeEntities,
    inactiveEntities
  } = getEntitiesAndGenerateAlerts(prevLocationMap, currLocationMap, services.alertFactory, shapesIdsNamesMap, windowEnd);
  const {
    getRecoveredAlerts
  } = services.alertFactory.done();
  for (const recoveredAlert of getRecoveredAlerts()) {
    const recoveredAlertId = recoveredAlert.getId();
    try {
      const context = (0, _get_context.getRecoveredAlertContext)({
        alertId: recoveredAlertId,
        activeEntities,
        inactiveEntities,
        windowEnd
      });
      if (context) {
        recoveredAlert.setContext(context);
      }
    } catch (e) {
      logger.warn(`Unable to set alert context for recovered alert, error: ${e.message}`);
    }
  }
  return {
    shapesFilters,
    shapesIdsNamesMap,
    prevLocationMap: Object.fromEntries(activeEntities)
  };
};
exports.getGeoContainmentExecutor = getGeoContainmentExecutor;