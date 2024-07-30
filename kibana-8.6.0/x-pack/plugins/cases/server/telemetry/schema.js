"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.casesSchema = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const long = {
  type: 'long'
};
const string = {
  type: 'keyword'
};
const countSchema = {
  total: long,
  monthly: long,
  weekly: long,
  daily: long
};
const assigneesSchema = {
  total: long,
  totalWithZero: long,
  totalWithAtLeastOne: long
};
const solutionTelemetry = {
  ...countSchema,
  assignees: assigneesSchema
};
const statusSchema = {
  open: long,
  inProgress: long,
  closed: long
};
const latestDatesSchema = {
  createdAt: string,
  updatedAt: string,
  closedAt: string
};
const casesSchema = {
  cases: {
    all: {
      ...countSchema,
      assignees: assigneesSchema,
      status: statusSchema,
      syncAlertsOn: long,
      syncAlertsOff: long,
      totalUsers: long,
      totalParticipants: long,
      totalTags: long,
      totalWithAlerts: long,
      totalWithConnectors: long,
      latestDates: latestDatesSchema
    },
    sec: solutionTelemetry,
    obs: solutionTelemetry,
    main: solutionTelemetry
  },
  userActions: {
    all: {
      ...countSchema,
      maxOnACase: long
    }
  },
  comments: {
    all: {
      ...countSchema,
      maxOnACase: long
    }
  },
  alerts: {
    all: {
      ...countSchema,
      maxOnACase: long
    }
  },
  connectors: {
    all: {
      all: {
        totalAttached: long
      },
      itsm: {
        totalAttached: long
      },
      sir: {
        totalAttached: long
      },
      jira: {
        totalAttached: long
      },
      resilient: {
        totalAttached: long
      },
      swimlane: {
        totalAttached: long
      },
      maxAttachedToACase: long
    }
  },
  pushes: {
    all: {
      total: long,
      maxOnACase: long
    }
  },
  configuration: {
    all: {
      closure: {
        manually: long,
        automatic: long
      }
    }
  }
};
exports.casesSchema = casesSchema;