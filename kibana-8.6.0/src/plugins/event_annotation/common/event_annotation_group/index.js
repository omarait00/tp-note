"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventAnnotationGroup = eventAnnotationGroup;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function eventAnnotationGroup() {
  return {
    name: 'event_annotation_group',
    aliases: [],
    type: 'event_annotation_group',
    inputTypes: ['null'],
    help: _i18n.i18n.translate('eventAnnotation.group.description', {
      defaultMessage: 'Event annotation group'
    }),
    args: {
      dataView: {
        types: ['index_pattern'],
        required: true,
        help: _i18n.i18n.translate('eventAnnotation.group.args.annotationConfigs.dataView.help', {
          defaultMessage: 'Data view retrieved with indexPatternLoad'
        })
      },
      annotations: {
        types: ['manual_point_event_annotation', 'manual_range_event_annotation', 'query_point_event_annotation'],
        help: _i18n.i18n.translate('eventAnnotation.group.args.annotationConfigs', {
          defaultMessage: 'Annotation configs'
        }),
        required: true,
        multi: true
      }
    },
    fn: (input, args) => {
      return {
        type: 'event_annotation_group',
        annotations: args.annotations.filter(annotation => !annotation.isHidden),
        dataView: args.dataView
      };
    }
  };
}