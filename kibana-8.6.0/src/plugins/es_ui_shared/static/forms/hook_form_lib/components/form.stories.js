"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Validation = exports.Simple = exports.Schema = exports.IsModified = exports.GlobalFields = exports.DefaultValue = exports.DeSerializer = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireDefault(require("react"));
var _eui = require("@elastic/eui");
var _addonActions = require("@storybook/addon-actions");
var _components = require("../../components");
var _constants = require("../constants");
var _use_form = require("../hooks/use_form");
var _form = require("./form");
var _use_field = require("./use_field");
var _stories__ = require("./__stories__");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var _default = {
  component: _form.Form,
  title: `${_constants.STORYBOOK_SECTION}/Form`,
  subcomponents: {
    UseField: _use_field.UseField
  },
  decorators: [Story => /*#__PURE__*/_react.default.createElement("div", {
    style: {
      maxWidth: '600px'
    }
  }, Story())],
  parameters: {
    controls: {
      hideNoControlsWarning: true
    }
  }
};
exports.default = _default;
const {
  DefaultValue,
  Validation,
  DeSerializer,
  IsModified,
  GlobalFields
} = _stories__.formStories;

/**
 * Validate the form and return its data.
 *
 * @param form The FormHook instance
 */
exports.GlobalFields = GlobalFields;
exports.IsModified = IsModified;
exports.DeSerializer = DeSerializer;
exports.Validation = Validation;
exports.DefaultValue = DefaultValue;
const submitForm = async form => {
  const {
    isValid,
    data
  } = await form.submit();
  (0, _addonActions.action)('Send form')({
    isValid,
    data: JSON.stringify(data)
  });
};

/**
 * The "title" field base configuration
 */
const titleConfigBase = {
  label: 'Title',
  helpText: 'This is a help text for the field.'
};

// --- SIMPLE

const Simple = args => {
  const {
    form
  } = (0, _use_form.useForm)();
  return /*#__PURE__*/_react.default.createElement(_form.Form, (0, _extends2.default)({
    form: form
  }, args), /*#__PURE__*/_react.default.createElement(_use_field.UseField, {
    path: "title",
    component: _components.TextField,
    config: {
      ...titleConfigBase
    }
  }), /*#__PURE__*/_react.default.createElement(_eui.EuiButton, {
    onClick: () => submitForm(form)
  }, "Send"));
};
exports.Simple = Simple;
Simple.parameters = {
  docs: {
    source: {
      code: `
const MyFormComponent = () => {
  const { form } = useForm();

  const submitForm = async () => {
    const { isValid, data } = await form.submit();
    if (isValid) {
      // ... do something with the data
    }
  };

  return (
    <Form form={form}>
      <UseField<string>
        path="title"
        component={TextField}
        config={{
          label: 'Title',
          helpText: 'This is a help text for the field.',
        }}
      />
      <EuiButton onClick={submitForm}>Send</EuiButton>
    </Form>
  );
};
      `,
      language: 'tsx'
    }
  }
};

// --- FORM SCHEMA

const formSchema = {
  title: {
    ...titleConfigBase
  }
};
const Schema = args => {
  const {
    form
  } = (0, _use_form.useForm)({
    schema: formSchema
  });
  return /*#__PURE__*/_react.default.createElement(_form.Form, (0, _extends2.default)({
    form: form
  }, args), /*#__PURE__*/_react.default.createElement(_use_field.UseField, {
    path: "title",
    component: _components.TextField
  }), /*#__PURE__*/_react.default.createElement(_eui.EuiButton, {
    onClick: () => submitForm(form)
  }, "Send"));
};
exports.Schema = Schema;
Schema.parameters = {
  docs: {
    source: {
      code: `
const formSchema = {
  title: {
    label: 'Title',
    helpText: 'This is a help text for the field.',
  },
};

const MyFormComponent = () => {
  const { form } = useForm({
    schema: formSchema,
  });

  const submitForm = async () => {
    const { isValid, data } = await form.submit();
    if (isValid) {
      // ... do something with the data
    }
  };

  return (
    <Form form={form}>
      <UseField<string> path="title" component={TextField} />
      <EuiButton onClick={submitForm}>Send</EuiButton>
    </Form>
  );
};
      `,
      language: 'tsx'
    }
  }
};