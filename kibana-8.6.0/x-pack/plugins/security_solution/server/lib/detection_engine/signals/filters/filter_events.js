"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.partitionEvents = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Check if for each tuple, the entry is not in both for when two or more value list entries exist.
 * If the entry is in both an inclusion and exclusion list it will not be filtered out.
 * @param events The events to check against
 * @param fieldAndSetTuples The field and set tuples
 * @returns A tuple where the first element is an array of alerts that should be created and second element is
 * an array of alerts that matched the exception and should not be created.
 */
const partitionEvents = ({
  events,
  fieldAndSetTuples
}) => {
  return (0, _lodash.partition)(events, item => {
    return fieldAndSetTuples.map(tuple => {
      const eventItem = item.fields ? item.fields[tuple.field] : undefined;
      if (tuple.operator === 'included') {
        if (eventItem == null) {
          return true;
        }
        // only create a signal if the event is not in the value list
        return !tuple.matchedSet.has(JSON.stringify(eventItem));
      } else if (tuple.operator === 'excluded') {
        if (eventItem == null) {
          return false;
        }
        // only create a signal if the event is in the value list
        return tuple.matchedSet.has(JSON.stringify(eventItem));
      } else {
        return false;
      }
    }).some(value => value);
  });
};
exports.partitionEvents = partitionEvents;