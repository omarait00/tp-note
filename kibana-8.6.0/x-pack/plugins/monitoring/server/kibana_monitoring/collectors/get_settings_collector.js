"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkForEmailValue = checkForEmailValue;
exports.getDefaultAdminEmail = getDefaultAdminEmail;
exports.getEmailValueStructure = getEmailValueStructure;
exports.getKibanaSettings = getKibanaSettings;
exports.getSettingsCollector = getSettingsCollector;
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Check if Cluster Alert email notifications is enabled in config
 * If so, get email from kibana.yml
 */
async function getDefaultAdminEmail(config) {
  return config.cluster_alerts.email_notifications.email_address || null;
}

// we use shouldUseNull to determine if we need to send nulls; we only send nulls if the last email wasn't null
let shouldUseNull = true;
async function checkForEmailValue(config, _shouldUseNull = shouldUseNull, _getDefaultAdminEmail = getDefaultAdminEmail) {
  const defaultAdminEmail = await _getDefaultAdminEmail(config);

  // Allow null so clearing the advanced setting will be reflected in the data
  const isAcceptableNull = defaultAdminEmail === null && _shouldUseNull;

  /* NOTE we have no real validation checking here. If the user enters a bad
   * string for email, their email server will alert the admin the fact what
   * went wrong and they'll have to track it back to cluster alerts email
   * notifications on their own. */

  if (isAcceptableNull || defaultAdminEmail !== null) {
    return defaultAdminEmail;
  }
}
function getEmailValueStructure(email) {
  return {
    xpack: {
      default_admin_email: email
    }
  };
}
async function getKibanaSettings(logger, config) {
  let kibanaSettingsData;
  const defaultAdminEmail = await checkForEmailValue(config);

  // skip everything if defaultAdminEmail === undefined
  if (defaultAdminEmail || defaultAdminEmail === null && shouldUseNull) {
    kibanaSettingsData = getEmailValueStructure(defaultAdminEmail);
    logger.debug(`[${defaultAdminEmail}] default admin email setting found, sending [${_constants.KIBANA_SETTINGS_TYPE}] monitoring document.`);
  } else {
    logger.debug(`not sending [${_constants.KIBANA_SETTINGS_TYPE}] monitoring document because [${defaultAdminEmail}] is null or invalid.`);
  }

  // remember the current email so that we can mark it as successful if the bulk does not error out
  shouldUseNull = !!defaultAdminEmail;

  // returns undefined if there was no result
  return kibanaSettingsData;
}
function getSettingsCollector(usageCollection, config) {
  return usageCollection.makeStatsCollector({
    type: 'kibana_settings',
    isReady: () => true,
    schema: {
      xpack: {
        default_admin_email: {
          type: 'text'
        }
      }
    },
    async fetch() {
      return getKibanaSettings(this.log, config);
    },
    getEmailValueStructure(email) {
      return getEmailValueStructure(email);
    }
  });
}