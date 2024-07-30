"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useImportAssets = void 0;
var _reactQuery = require("@tanstack/react-query");
var _kibana = require("../common/lib/kibana");
var _use_error_toast = require("../common/hooks/use_error_toast");
var _constants = require("../packs/constants");
var _constants2 = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const useImportAssets = ({
  successToastText
}) => {
  const queryClient = (0, _reactQuery.useQueryClient)();
  const {
    http,
    notifications: {
      toasts
    }
  } = (0, _kibana.useKibana)().services;
  const setErrorToast = (0, _use_error_toast.useErrorToast)();
  return (0, _reactQuery.useMutation)(() => http.post('/internal/osquery/assets/update'), {
    onSuccess: () => {
      setErrorToast();
      queryClient.invalidateQueries([_constants.PACKS_ID]);
      queryClient.invalidateQueries([_constants2.INTEGRATION_ASSETS_STATUS_ID]);
      toasts.addSuccess(successToastText);
    },
    onError: error => {
      setErrorToast(error);
    }
  });
};
exports.useImportAssets = useImportAssets;