"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editor = void 0;
var _react = _interopRequireWildcard(require("react"));
var _eui = require("@elastic/eui");
var _public = require("../../../../../../src/plugins/kibana_react/public");
var _usePrevious = _interopRequireDefault(require("react-use/lib/usePrevious"));
var _template_from_react_component = require("../../../public/lib/template_from_react_component");
var _i18n = require("../../../i18n");
var _with_debounce_arg = require("../../../public/components/with_debounce_arg");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const {
  Editor: strings
} = _i18n.ArgumentStrings;
const EditorArg = ({
  argValue,
  typeInstance,
  onValueChange,
  renderError
}) => {
  var _typeInstance$options;
  const [value, setValue] = (0, _react.useState)(argValue);
  const prevValue = (0, _usePrevious.default)(value);
  const onChange = (0, _react.useCallback)(text => setValue(text), [setValue]);
  (0, _react.useEffect)(() => {
    onValueChange(value);
  }, [onValueChange, value]);
  (0, _react.useEffect)(() => {
    // update editor content, if it has been changed from within the expression.
    if (prevValue === value && argValue !== value) {
      setValue(argValue);
    }
  }, [argValue, setValue, prevValue, value]);
  if (typeof argValue !== 'string') {
    renderError();
    return null;
  }
  const {
    language
  } = (_typeInstance$options = typeInstance === null || typeInstance === void 0 ? void 0 : typeInstance.options) !== null && _typeInstance$options !== void 0 ? _typeInstance$options : {};
  return /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    display: "rowCompressed"
  }, /*#__PURE__*/_react.default.createElement(_public.CodeEditorField, {
    languageId: language !== null && language !== void 0 ? language : '',
    value: value,
    onChange: onChange,
    options: {
      fontSize: 14,
      scrollBeyondLastLine: false,
      quickSuggestions: true,
      minimap: {
        enabled: false
      },
      wordWrap: 'on',
      wrappingIndent: 'indent',
      lineNumbers: 'off',
      glyphMargin: false,
      folding: false
    },
    height: "350px",
    editorDidMount: editor => {
      const model = editor.getModel();
      model === null || model === void 0 ? void 0 : model.updateOptions({
        tabSize: 2
      });
    }
  }));
};
const editor = () => ({
  name: 'editor',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  template: (0, _template_from_react_component.templateFromReactComponent)((0, _with_debounce_arg.withDebounceArg)(EditorArg, 250))
});
exports.editor = editor;