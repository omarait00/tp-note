"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newCase = exports.mockCasesErrorTriggerData = exports.mockCases = exports.mockCaseComments = void 0;
var _api = require("../common/api");
var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const mockCases = [{
  type: 'cases',
  id: 'mock-id-1',
  attributes: {
    closed_at: null,
    closed_by: null,
    connector: {
      id: 'none',
      name: 'none',
      type: _api.ConnectorTypes.none,
      fields: null
    },
    created_at: '2019-11-25T21:54:48.952Z',
    created_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    severity: _api.CaseSeverity.LOW,
    duration: null,
    description: 'This is a brand new case of a bad meanie defacing data',
    external_service: null,
    title: 'Super Bad Security Issue',
    status: _api.CaseStatuses.open,
    tags: ['defacement'],
    updated_at: '2019-11-25T21:54:48.952Z',
    updated_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    settings: {
      syncAlerts: true
    },
    owner: _constants.SECURITY_SOLUTION_OWNER,
    assignees: []
  },
  references: [],
  updated_at: '2019-11-25T21:54:48.952Z',
  version: 'WzAsMV0='
}, {
  type: 'cases',
  id: 'mock-id-2',
  attributes: {
    closed_at: null,
    closed_by: null,
    connector: {
      id: 'none',
      name: 'none',
      type: _api.ConnectorTypes.none,
      fields: null
    },
    created_at: '2019-11-25T22:32:00.900Z',
    created_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    severity: _api.CaseSeverity.LOW,
    duration: null,
    description: 'Oh no, a bad meanie destroying data!',
    external_service: null,
    title: 'Damaging Data Destruction Detected',
    status: _api.CaseStatuses.open,
    tags: ['Data Destruction'],
    updated_at: '2019-11-25T22:32:00.900Z',
    updated_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    settings: {
      syncAlerts: true
    },
    owner: _constants.SECURITY_SOLUTION_OWNER,
    assignees: []
  },
  references: [],
  updated_at: '2019-11-25T22:32:00.900Z',
  version: 'WzQsMV0='
}, {
  type: 'cases',
  id: 'mock-id-3',
  attributes: {
    closed_at: null,
    closed_by: null,
    connector: {
      id: '123',
      name: 'My connector',
      type: _api.ConnectorTypes.jira,
      fields: {
        issueType: 'Task',
        priority: 'High',
        parent: null
      }
    },
    created_at: '2019-11-25T22:32:17.947Z',
    created_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    severity: _api.CaseSeverity.LOW,
    duration: null,
    description: 'Oh no, a bad meanie going LOLBins all over the place!',
    external_service: null,
    title: 'Another bad one',
    status: _api.CaseStatuses.open,
    tags: ['LOLBins'],
    updated_at: '2019-11-25T22:32:17.947Z',
    updated_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    settings: {
      syncAlerts: true
    },
    owner: _constants.SECURITY_SOLUTION_OWNER,
    assignees: []
  },
  references: [],
  updated_at: '2019-11-25T22:32:17.947Z',
  version: 'WzUsMV0='
}, {
  type: 'cases',
  id: 'mock-id-4',
  attributes: {
    closed_at: '2019-11-25T22:32:17.947Z',
    closed_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    connector: {
      id: '123',
      name: 'My connector',
      type: _api.ConnectorTypes.jira,
      fields: {
        issueType: 'Task',
        priority: 'High',
        parent: null
      }
    },
    created_at: '2019-11-25T22:32:17.947Z',
    created_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    severity: _api.CaseSeverity.LOW,
    duration: null,
    description: 'Oh no, a bad meanie going LOLBins all over the place!',
    external_service: null,
    status: _api.CaseStatuses.closed,
    title: 'Another bad one',
    tags: ['LOLBins'],
    updated_at: '2019-11-25T22:32:17.947Z',
    updated_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    settings: {
      syncAlerts: true
    },
    owner: _constants.SECURITY_SOLUTION_OWNER,
    assignees: []
  },
  references: [],
  updated_at: '2019-11-25T22:32:17.947Z',
  version: 'WzUsMV0='
}];
exports.mockCases = mockCases;
const mockCasesErrorTriggerData = [{
  id: 'valid-id'
}, {
  id: 'bad-guy'
}];
exports.mockCasesErrorTriggerData = mockCasesErrorTriggerData;
const mockCaseComments = [{
  type: 'cases-comment',
  id: 'mock-comment-1',
  attributes: {
    comment: 'Wow, good luck catching that bad meanie!',
    type: _api.CommentType.user,
    created_at: '2019-11-25T21:55:00.177Z',
    created_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    owner: _constants.SECURITY_SOLUTION_OWNER,
    pushed_at: null,
    pushed_by: null,
    updated_at: '2019-11-25T21:55:00.177Z',
    updated_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    }
  },
  references: [{
    type: 'cases',
    name: 'associated-cases',
    id: 'mock-id-1'
  }],
  updated_at: '2019-11-25T21:55:00.177Z',
  version: 'WzEsMV0='
}, {
  type: 'cases-comment',
  id: 'mock-comment-2',
  attributes: {
    comment: 'Well I decided to update my comment. So what? Deal with it.',
    type: _api.CommentType.user,
    created_at: '2019-11-25T21:55:14.633Z',
    created_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    owner: _constants.SECURITY_SOLUTION_OWNER,
    pushed_at: null,
    pushed_by: null,
    updated_at: '2019-11-25T21:55:14.633Z',
    updated_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    }
  },
  references: [{
    type: 'cases',
    name: 'associated-cases',
    id: 'mock-id-1'
  }],
  updated_at: '2019-11-25T21:55:14.633Z',
  version: 'WzMsMV0='
}, {
  type: 'cases-comment',
  id: 'mock-comment-3',
  attributes: {
    comment: 'Wow, good luck catching that bad meanie!',
    type: _api.CommentType.user,
    created_at: '2019-11-25T22:32:30.608Z',
    created_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    owner: _constants.SECURITY_SOLUTION_OWNER,
    pushed_at: null,
    pushed_by: null,
    updated_at: '2019-11-25T22:32:30.608Z',
    updated_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    }
  },
  references: [{
    type: 'cases',
    name: 'associated-cases',
    id: 'mock-id-3'
  }],
  updated_at: '2019-11-25T22:32:30.608Z',
  version: 'WzYsMV0='
}, {
  type: 'cases-comment',
  id: 'mock-comment-4',
  attributes: {
    type: _api.CommentType.alert,
    index: 'test-index',
    alertId: 'test-id',
    created_at: '2019-11-25T22:32:30.608Z',
    created_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    owner: _constants.SECURITY_SOLUTION_OWNER,
    pushed_at: null,
    pushed_by: null,
    rule: {
      id: 'rule-id-1',
      name: 'rule-name-1'
    },
    updated_at: '2019-11-25T22:32:30.608Z',
    updated_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    }
  },
  references: [{
    type: 'cases',
    name: 'associated-cases',
    id: 'mock-id-4'
  }],
  updated_at: '2019-11-25T22:32:30.608Z',
  version: 'WzYsMV0='
}, {
  type: 'cases-comment',
  id: 'mock-comment-5',
  attributes: {
    type: _api.CommentType.alert,
    index: 'test-index-2',
    alertId: 'test-id-2',
    created_at: '2019-11-25T22:32:30.608Z',
    created_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    owner: _constants.SECURITY_SOLUTION_OWNER,
    pushed_at: null,
    pushed_by: null,
    rule: {
      id: 'rule-id-2',
      name: 'rule-name-2'
    },
    updated_at: '2019-11-25T22:32:30.608Z',
    updated_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    }
  },
  references: [{
    type: 'cases',
    name: 'associated-cases',
    id: 'mock-id-4'
  }],
  updated_at: '2019-11-25T22:32:30.608Z',
  version: 'WzYsMV0='
}, {
  type: 'cases-comment',
  id: 'mock-comment-6',
  attributes: {
    type: _api.CommentType.alert,
    index: 'test-index',
    alertId: 'test-id',
    created_at: '2019-11-25T22:32:30.608Z',
    created_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    },
    owner: _constants.SECURITY_SOLUTION_OWNER,
    pushed_at: null,
    pushed_by: null,
    rule: {
      id: 'rule-id-1',
      name: 'rule-name-1'
    },
    updated_at: '2019-11-25T22:32:30.608Z',
    updated_by: {
      full_name: 'elastic',
      email: 'testemail@elastic.co',
      username: 'elastic'
    }
  },
  references: [{
    type: 'cases',
    name: 'associated-cases',
    id: 'mock-id-4'
  }],
  updated_at: '2019-11-25T22:32:30.608Z',
  version: 'WzYsMV0='
}];
exports.mockCaseComments = mockCaseComments;
const newCase = {
  title: 'My new case',
  description: 'A description',
  tags: ['new', 'case'],
  connector: {
    id: 'none',
    name: 'none',
    type: _api.ConnectorTypes.none,
    fields: null
  },
  settings: {
    syncAlerts: true
  },
  owner: _constants.SECURITY_SOLUTION_OWNER
};
exports.newCase = newCase;