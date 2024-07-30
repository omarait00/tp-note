"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockOptionsListReduxEmbeddableTools = void 0;
var _create_redux_embeddable_tools = require("../../../presentation_util/public/redux_embeddables/create_redux_embeddable_tools");
var _public = require("../../public");
var _options_list_reducers = require("../../public/options_list/options_list_reducers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const mockOptionsListComponentState = {
  field: undefined,
  totalCardinality: 0,
  availableOptions: ['woof', 'bark', 'meow', 'quack', 'moo'],
  invalidSelections: [],
  validSelections: [],
  searchString: {
    value: '',
    valid: true
  }
};
const mockOptionsListEmbeddableInput = {
  id: 'sample options list',
  fieldName: 'sample field',
  dataViewId: 'sample id',
  selectedOptions: [],
  runPastTimeout: false,
  singleSelect: false,
  allowExclude: false,
  exclude: false
};
const mockOptionsListOutput = {
  loading: false
};
const mockOptionsListReduxEmbeddableTools = async partialState => {
  const optionsListFactoryStub = new _public.OptionsListEmbeddableFactory();
  const optionsListControlFactory = optionsListFactoryStub;
  optionsListControlFactory.getDefaultInput = () => ({});
  const mockEmbeddable = await optionsListControlFactory.create({
    ...mockOptionsListEmbeddableInput,
    ...(partialState === null || partialState === void 0 ? void 0 : partialState.explicitInput)
  });
  mockEmbeddable.getOutput = jest.fn().mockReturnValue(mockOptionsListOutput);
  const mockReduxEmbeddableTools = (0, _create_redux_embeddable_tools.createReduxEmbeddableTools)({
    embeddable: mockEmbeddable,
    reducers: _options_list_reducers.optionsListReducers,
    initialComponentState: {
      ...mockOptionsListComponentState,
      ...(partialState === null || partialState === void 0 ? void 0 : partialState.componentState)
    }
  });
  return mockReduxEmbeddableTools;
};
exports.mockOptionsListReduxEmbeddableTools = mockOptionsListReduxEmbeddableTools;