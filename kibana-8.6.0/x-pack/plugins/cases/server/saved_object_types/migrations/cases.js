"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeCaseType = exports.caseMigrations = exports.caseConnectorIdMigration = exports.addSeverity = exports.addDuration = exports.addAssignees = void 0;
var _lodash = require("lodash");
var _ = require(".");
var _api = require("../../../common/api");
var _constants = require("../../common/constants");
var _connector_id = require("./user_actions/connector_id");
var _constants2 = require("./constants");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */

const caseConnectorIdMigration = doc => {
  // removing the id field since it will be stored in the references instead
  const {
    connector,
    external_service,
    ...restAttributes
  } = doc.attributes;
  const {
    transformedConnector,
    references: connectorReferences
  } = (0, _connector_id.transformConnectorIdToReference)(_constants.CONNECTOR_ID_REFERENCE_NAME, connector);
  const {
    transformedPushConnector,
    references: pushConnectorReferences
  } = (0, _connector_id.transformPushConnectorIdToReference)(_constants.PUSH_CONNECTOR_ID_REFERENCE_NAME, external_service);
  const {
    references = []
  } = doc;
  return {
    ...doc,
    attributes: {
      ...restAttributes,
      ...transformedConnector,
      ...transformedPushConnector
    },
    references: [...references, ...connectorReferences, ...pushConnectorReferences]
  };
};
exports.caseConnectorIdMigration = caseConnectorIdMigration;
const removeCaseType = doc => {
  var _doc$references;
  const docCopy = (0, _lodash.cloneDeep)(doc);
  (0, _lodash.unset)(docCopy, 'attributes.type');
  return {
    ...docCopy,
    references: (_doc$references = doc.references) !== null && _doc$references !== void 0 ? _doc$references : []
  };
};
exports.removeCaseType = removeCaseType;
const addDuration = doc => {
  var _doc$references2;
  let duration = null;
  try {
    const createdAt = doc.attributes.created_at;
    const closedAt = doc.attributes.closed_at;
    if (createdAt != null && closedAt != null) {
      const createdAtMillis = new Date(createdAt).getTime();
      const closedAtMillis = new Date(closedAt).getTime();
      if (!isNaN(createdAtMillis) && !isNaN(closedAtMillis) && closedAtMillis >= createdAtMillis) {
        duration = Math.floor((closedAtMillis - createdAtMillis) / 1000);
      }
    }
  } catch (err) {
    // Silence date errors
  }

  /**
   * Duration is the time from the creation of the case to the close of the case in seconds
   * If an error occurs or the case has not been closed then the duration is set to null
   */
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      duration
    },
    references: (_doc$references2 = doc.references) !== null && _doc$references2 !== void 0 ? _doc$references2 : []
  };
};
exports.addDuration = addDuration;
const addSeverity = doc => {
  var _doc$attributes$sever, _doc$references3;
  const severity = (_doc$attributes$sever = doc.attributes.severity) !== null && _doc$attributes$sever !== void 0 ? _doc$attributes$sever : _api.CaseSeverity.LOW;
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      severity
    },
    references: (_doc$references3 = doc.references) !== null && _doc$references3 !== void 0 ? _doc$references3 : []
  };
};
exports.addSeverity = addSeverity;
const addAssignees = doc => {
  var _doc$attributes$assig, _doc$references4;
  const assignees = (_doc$attributes$assig = doc.attributes.assignees) !== null && _doc$attributes$assig !== void 0 ? _doc$attributes$assig : [];
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      assignees
    },
    references: (_doc$references4 = doc.references) !== null && _doc$references4 !== void 0 ? _doc$references4 : []
  };
};
exports.addAssignees = addAssignees;
const caseMigrations = {
  '7.10.0': doc => {
    const {
      connector_id,
      ...attributesWithoutConnectorId
    } = doc.attributes;
    return {
      ...doc,
      attributes: {
        ...attributesWithoutConnectorId,
        connector: {
          id: connector_id !== null && connector_id !== void 0 ? connector_id : 'none',
          name: 'none',
          type: _api.ConnectorTypes.none,
          fields: null
        }
      },
      references: doc.references || []
    };
  },
  '7.11.0': doc => {
    return {
      ...doc,
      attributes: {
        ...doc.attributes,
        settings: {
          syncAlerts: true
        }
      },
      references: doc.references || []
    };
  },
  '7.12.0': doc => {
    const {
      fields,
      type
    } = doc.attributes.connector;
    return {
      ...doc,
      attributes: {
        ...doc.attributes,
        type: _constants2.CASE_TYPE_INDIVIDUAL,
        connector: {
          ...doc.attributes.connector,
          fields: Array.isArray(fields) && fields.length > 0 && type === _api.ConnectorTypes.serviceNowITSM ? [...fields, {
            key: 'category',
            value: null
          }, {
            key: 'subcategory',
            value: null
          }] : fields
        }
      },
      references: doc.references || []
    };
  },
  '7.14.0': doc => {
    return (0, _.addOwnerToSO)(doc);
  },
  '7.15.0': caseConnectorIdMigration,
  '8.1.0': removeCaseType,
  '8.3.0': (0, _utils.pipeMigrations)(addDuration, addSeverity),
  '8.5.0': addAssignees
};
exports.caseMigrations = caseMigrations;