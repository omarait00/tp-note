"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryPointEventAnnotation = void 0;
var _i18n = require("@kbn/i18n");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const queryPointEventAnnotation = {
  name: 'query_point_event_annotation',
  aliases: [],
  type: 'query_point_event_annotation',
  help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.description', {
    defaultMessage: `Configure manual annotation`
  }),
  inputTypes: ['null'],
  args: {
    id: {
      required: true,
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.args.id', {
        defaultMessage: `The id of the annotation`
      })
    },
    filter: {
      types: ['kibana_query'],
      help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.args.filter', {
        defaultMessage: `Annotation filter`
      })
    },
    extraFields: {
      multi: true,
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.args.field', {
        defaultMessage: `The extra fields of the annotation`
      })
    },
    timeField: {
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.args.timeField', {
        defaultMessage: `The time field of the annotation`
      })
    },
    label: {
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.args.label', {
        defaultMessage: `The name of the annotation`
      })
    },
    color: {
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.args.color', {
        defaultMessage: 'The color of the line'
      })
    },
    lineStyle: {
      types: ['string'],
      options: ['solid', 'dotted', 'dashed'],
      help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.args.lineStyle', {
        defaultMessage: 'The style of the annotation line'
      })
    },
    lineWidth: {
      types: ['number'],
      help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.args.lineWidth', {
        defaultMessage: 'The width of the annotation line'
      })
    },
    icon: {
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.args.icon', {
        defaultMessage: 'An optional icon used for annotation lines'
      }),
      options: [...Object.values(_constants.AvailableAnnotationIcons)],
      strict: true
    },
    textVisibility: {
      types: ['boolean'],
      help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.args.textVisibility', {
        defaultMessage: 'Visibility of the label on the annotation line'
      })
    },
    textField: {
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.args.textField', {
        defaultMessage: `Field name used for the annotation label`
      })
    },
    isHidden: {
      types: ['boolean'],
      help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.args.isHidden', {
        defaultMessage: `Switch to hide annotation`
      })
    },
    ignoreGlobalFilters: {
      types: ['boolean'],
      help: _i18n.i18n.translate('eventAnnotation.queryAnnotation.args.ignoreGlobalFilters', {
        defaultMessage: `Switch to ignore global filters for the annotation`
      }),
      default: true
    }
  },
  fn: function fn(input, args) {
    return {
      type: 'query_point_event_annotation',
      ...args
    };
  }
};
exports.queryPointEventAnnotation = queryPointEventAnnotation;