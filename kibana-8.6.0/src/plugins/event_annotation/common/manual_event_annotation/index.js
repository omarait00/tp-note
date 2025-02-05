"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.manualRangeEventAnnotation = exports.manualPointEventAnnotation = void 0;
var _i18n = require("@kbn/i18n");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const manualPointEventAnnotation = {
  name: 'manual_point_event_annotation',
  aliases: [],
  type: 'manual_point_event_annotation',
  help: _i18n.i18n.translate('eventAnnotation.manualAnnotation.description', {
    defaultMessage: `Configure manual annotation`
  }),
  inputTypes: ['null'],
  args: {
    id: {
      required: true,
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.manualAnnotation.args.id', {
        defaultMessage: `Id for annotation`
      })
    },
    time: {
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.manualAnnotation.args.time', {
        defaultMessage: `Timestamp for annotation`
      })
    },
    label: {
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.manualAnnotation.args.label', {
        defaultMessage: `The name of the annotation`
      })
    },
    color: {
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.manualAnnotation.args.color', {
        defaultMessage: 'The color of the line'
      })
    },
    lineStyle: {
      types: ['string'],
      options: ['solid', 'dotted', 'dashed'],
      help: _i18n.i18n.translate('eventAnnotation.manualAnnotation.args.lineStyle', {
        defaultMessage: 'The style of the annotation line'
      })
    },
    lineWidth: {
      types: ['number'],
      help: _i18n.i18n.translate('eventAnnotation.manualAnnotation.args.lineWidth', {
        defaultMessage: 'The width of the annotation line'
      })
    },
    icon: {
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.manualAnnotation.args.icon', {
        defaultMessage: 'An optional icon used for annotation lines'
      }),
      options: [...Object.values(_constants.AvailableAnnotationIcons)],
      strict: true
    },
    textVisibility: {
      types: ['boolean'],
      help: _i18n.i18n.translate('eventAnnotation.manualAnnotation.args.textVisibility', {
        defaultMessage: 'Visibility of the label on the annotation line'
      })
    },
    isHidden: {
      types: ['boolean'],
      help: _i18n.i18n.translate('eventAnnotation.manualAnnotation.args.isHidden', {
        defaultMessage: `Switch to hide annotation`
      })
    }
  },
  fn: function fn(input, args) {
    return {
      type: 'manual_point_event_annotation',
      ...args
    };
  }
};
exports.manualPointEventAnnotation = manualPointEventAnnotation;
const manualRangeEventAnnotation = {
  name: 'manual_range_event_annotation',
  aliases: [],
  type: 'manual_range_event_annotation',
  help: _i18n.i18n.translate('eventAnnotation.rangeAnnotation.description', {
    defaultMessage: `Configure manual annotation`
  }),
  inputTypes: ['null'],
  args: {
    id: {
      required: true,
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.rangeAnnotation.args.id', {
        defaultMessage: `Id for annotation`
      })
    },
    time: {
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.rangeAnnotation.args.time', {
        defaultMessage: `Timestamp for annotation`
      })
    },
    endTime: {
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.rangeAnnotation.args.endTime', {
        defaultMessage: `Timestamp for range annotation`
      }),
      required: false
    },
    outside: {
      types: ['boolean'],
      help: '',
      required: false
    },
    label: {
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.rangeAnnotation.args.label', {
        defaultMessage: `The name of the annotation`
      })
    },
    color: {
      types: ['string'],
      help: _i18n.i18n.translate('eventAnnotation.rangeAnnotation.args.color', {
        defaultMessage: 'The color of the line'
      })
    },
    isHidden: {
      types: ['boolean'],
      help: _i18n.i18n.translate('eventAnnotation.rangeAnnotation.args.isHidden', {
        defaultMessage: `Switch to hide annotation`
      })
    }
  },
  fn: function fn(input, args) {
    return {
      type: 'manual_range_event_annotation',
      ...args
    };
  }
};
exports.manualRangeEventAnnotation = manualRangeEventAnnotation;