"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserProfileService = void 0;
exports.prefixCommaSeparatedValues = prefixCommaSeparatedValues;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _errors = require("../errors");
var _session_management = require("../session_management");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const KIBANA_DATA_ROOT = 'kibana';
const ACTIVATION_MAX_RETRIES = 10;
const ACTIVATION_RETRY_SCALE_DURATION_MS = 150;
const MAX_SUGGESTIONS_COUNT = 100;
const DEFAULT_SUGGESTIONS_COUNT = 10;
const MIN_SUGGESTIONS_FOR_PRIVILEGES_CHECK = 10;

/**
 * A set of methods to work with Kibana user profiles.
 */

function parseUserProfile(rawUserProfile) {
  var _rawUserProfile$enabl, _rawUserProfile$data$, _rawUserProfile$data, _rawUserProfile$user$, _rawUserProfile$user$2;
  return {
    uid: rawUserProfile.uid,
    // Get User Profile API returns `enabled` property, but Suggest User Profile API doesn't since it's assumed that the
    // API returns only enabled profiles. To simplify the API in Kibana we use the same interfaces for user profiles
    // irrespective to the source they are coming from, so we need to "normalize" `enabled` property here.
    enabled: (_rawUserProfile$enabl = rawUserProfile.enabled) !== null && _rawUserProfile$enabl !== void 0 ? _rawUserProfile$enabl : true,
    data: (_rawUserProfile$data$ = (_rawUserProfile$data = rawUserProfile.data) === null || _rawUserProfile$data === void 0 ? void 0 : _rawUserProfile$data[KIBANA_DATA_ROOT]) !== null && _rawUserProfile$data$ !== void 0 ? _rawUserProfile$data$ : {},
    user: {
      username: rawUserProfile.user.username,
      // @elastic/elasticsearch types support `null` values for the `email`, but we don't.
      email: (_rawUserProfile$user$ = rawUserProfile.user.email) !== null && _rawUserProfile$user$ !== void 0 ? _rawUserProfile$user$ : undefined,
      // @elastic/elasticsearch types support `null` values for the `full_name`, but we don't.
      full_name: (_rawUserProfile$user$2 = rawUserProfile.user.full_name) !== null && _rawUserProfile$user$2 !== void 0 ? _rawUserProfile$user$2 : undefined
    }
  };
}
function parseUserProfileWithSecurity(rawUserProfile) {
  var _rawUserProfile$label, _rawUserProfile$label2;
  const userProfile = parseUserProfile(rawUserProfile);
  return {
    ...userProfile,
    labels: (_rawUserProfile$label = (_rawUserProfile$label2 = rawUserProfile.labels) === null || _rawUserProfile$label2 === void 0 ? void 0 : _rawUserProfile$label2[KIBANA_DATA_ROOT]) !== null && _rawUserProfile$label !== void 0 ? _rawUserProfile$label : {},
    user: {
      ...userProfile.user,
      roles: rawUserProfile.user.roles,
      realm_name: rawUserProfile.user.realm_name,
      realm_domain: rawUserProfile.user.realm_domain
    }
  };
}
class UserProfileService {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "authz", void 0);
    (0, _defineProperty2.default)(this, "license", void 0);
    this.logger = logger;
  }
  setup({
    authz,
    license
  }) {
    this.authz = authz;
    this.license = license;
  }
  start({
    clusterClient,
    session
  }) {
    return {
      activate: this.activate.bind(this, clusterClient),
      getCurrent: this.getCurrent.bind(this, clusterClient, session),
      bulkGet: this.bulkGet.bind(this, clusterClient),
      update: this.update.bind(this, clusterClient),
      suggest: this.suggest.bind(this, clusterClient)
    };
  }

  /**
   * See {@link UserProfileServiceStartInternal} for documentation.
   */
  async activate(clusterClient, grant) {
    this.logger.debug(`Activating user profile via ${grant.type} grant.`);
    const activateRequest = grant.type === 'password' ? {
      grant_type: 'password',
      username: grant.username,
      password: grant.password
    } : {
      grant_type: 'access_token',
      access_token: grant.accessToken
    };

    // Profile activation is a multistep process that might or might not cause profile document to be created or
    // updated. If Elasticsearch needs to handle multiple profile activation requests for the same user in parallel
    // it can hit document version conflicts and fail (409 status code). In this case it's safe to retry activation
    // request after some time. Most of the Kibana users won't be affected by this issue, but there are edge cases
    // when users can be hit by the conflicts during profile activation, e.g. for PKI or Kerberos authentication when
    // client certificate/ticket changes and multiple requests can trigger profile re-activation at the same time.
    let activationRetriesLeft = ACTIVATION_MAX_RETRIES;
    do {
      try {
        const response = await clusterClient.asInternalUser.security.activateUserProfile(activateRequest);
        this.logger.debug(`Successfully activated profile for "${response.user.username}".`);
        return parseUserProfileWithSecurity(response);
      } catch (err) {
        const detailedErrorMessage = (0, _errors.getDetailedErrorMessage)(err);
        if ((0, _errors.getErrorStatusCode)(err) !== 409) {
          this.logger.error(`Failed to activate user profile: ${detailedErrorMessage}.`);
          throw err;
        }
        activationRetriesLeft--;
        this.logger.error(`Failed to activate user profile (retries left: ${activationRetriesLeft}): ${detailedErrorMessage}.`);
        if (activationRetriesLeft === 0) {
          throw err;
        }
      }
      await new Promise(resolve => setTimeout(resolve, (ACTIVATION_MAX_RETRIES - activationRetriesLeft) * ACTIVATION_RETRY_SCALE_DURATION_MS));
    } while (activationRetriesLeft > 0);

    // This should be unreachable code, unless we have a bug in retry handling logic.
    throw new Error('Failed to activate user profile, max retries exceeded.');
  }

  /**
   * See {@link UserProfileServiceStart} for documentation.
   */
  async getCurrent(clusterClient, session, {
    request,
    dataPath
  }) {
    let userSession;
    try {
      userSession = await session.get(request);
    } catch (error) {
      this.logger.error(`Failed to retrieve user session: ${(0, _errors.getDetailedErrorMessage)(error)}`);
      throw error;
    }
    if (userSession.error) {
      return null;
    }
    if (!userSession.value.userProfileId) {
      this.logger.debug(`User profile missing from the current session [sid=${(0, _session_management.getPrintableSessionId)(userSession.value.sid)}].`);
      return null;
    }
    let body;
    try {
      // @ts-expect-error Invalid response format.
      body = await clusterClient.asInternalUser.security.getUserProfile({
        uid: userSession.value.userProfileId,
        data: dataPath ? prefixCommaSeparatedValues(dataPath, KIBANA_DATA_ROOT) : undefined
      });
    } catch (error) {
      this.logger.error(`Failed to retrieve user profile for the current user [sid=${(0, _session_management.getPrintableSessionId)(userSession.value.sid)}]: ${(0, _errors.getDetailedErrorMessage)(error)}`);
      throw error;
    }
    if (body.profiles.length === 0) {
      this.logger.error(`The user profile for the current user [sid=${(0, _session_management.getPrintableSessionId)(userSession.value.sid)}] is not found.`);
      throw new Error(`User profile is not found.`);
    }
    return parseUserProfileWithSecurity(body.profiles[0]);
  }

  /**
   * See {@link UserProfileServiceStart} for documentation.
   */
  async bulkGet(clusterClient, {
    uids,
    dataPath
  }) {
    if (uids.size === 0) {
      return [];
    }
    try {
      // @ts-expect-error Invalid response format.
      const body = await clusterClient.asInternalUser.security.getUserProfile({
        uid: [...uids].join(','),
        data: dataPath ? prefixCommaSeparatedValues(dataPath, KIBANA_DATA_ROOT) : undefined
      });
      return body.profiles.map(rawUserProfile => parseUserProfile(rawUserProfile));
    } catch (error) {
      this.logger.error(`Failed to bulk get user profiles: ${(0, _errors.getDetailedErrorMessage)(error)}`);
      throw error;
    }
  }

  /**
   * See {@link UserProfileServiceStartInternal} for documentation.
   */
  async update(clusterClient, uid, data) {
    try {
      await clusterClient.asInternalUser.security.updateUserProfileData({
        uid,
        data: {
          [KIBANA_DATA_ROOT]: data
        }
      });
    } catch (error) {
      this.logger.error(`Failed to update user profile [uid=${uid}]: ${(0, _errors.getDetailedErrorMessage)(error)}`);
      throw error;
    }
  }

  /**
   * See {@link UserProfileServiceStart} for documentation.
   */
  async suggest(clusterClient, params) {
    var _this$license, _requiredPrivileges$p;
    if (!((_this$license = this.license) !== null && _this$license !== void 0 && _this$license.getFeatures().allowUserProfileCollaboration)) {
      throw Error("Current license doesn't support user profile collaboration APIs.");
    }
    const {
      name,
      hint,
      size = DEFAULT_SUGGESTIONS_COUNT,
      dataPath,
      requiredPrivileges
    } = params;
    if (size > MAX_SUGGESTIONS_COUNT) {
      throw Error(`Can return up to ${MAX_SUGGESTIONS_COUNT} suggestions, but ${size} suggestions were requested.`);
    }

    // 1. If privileges are not defined, request as many results as has been requested
    // 2. If privileges are defined, request two times more suggestions than requested to account
    // for the results that don't pass privileges check, but not less than minimal batch size
    // used to perform privileges check (fetching is cheap, privileges check is not).
    const numberOfResultsToRequest = ((_requiredPrivileges$p = requiredPrivileges === null || requiredPrivileges === void 0 ? void 0 : requiredPrivileges.privileges.kibana.length) !== null && _requiredPrivileges$p !== void 0 ? _requiredPrivileges$p : 0) > 0 ? Math.max(size * 2, MIN_SUGGESTIONS_FOR_PRIVILEGES_CHECK) : size;
    try {
      const body = await clusterClient.asInternalUser.security.suggestUserProfiles({
        name,
        size: numberOfResultsToRequest,
        hint,
        // If fetching data turns out to be a performance bottleneck, we can try to fetch data
        // only for the profiles that pass privileges check as a separate bulkGet request.
        data: dataPath ? prefixCommaSeparatedValues(dataPath, KIBANA_DATA_ROOT) : undefined
      });
      const filteredProfiles = requiredPrivileges && (requiredPrivileges === null || requiredPrivileges === void 0 ? void 0 : requiredPrivileges.privileges.kibana.length) > 0 ? await this.filterProfilesByPrivileges(body.profiles, requiredPrivileges, size) : body.profiles;
      return filteredProfiles.map(rawProfile => parseUserProfile(rawProfile));
    } catch (error) {
      this.logger.error(`Failed to get user profiles suggestions [name=${name}]: ${(0, _errors.getDetailedErrorMessage)(error)}`);
      throw error;
    }
  }
  async filterProfilesByPrivileges(profilesToFilter, requiredPrivileges, requiredSize) {
    // First try to check privileges for the maximum amount of profiles prioritizing a happy path i.e. first
    // `requiredSize` profiles have all necessary privileges. Otherwise, check privileges for the remaining profiles in
    // reasonably sized batches to optimize network round-trips until we find `requiredSize` profiles with necessary
    // privileges, or we check all returned profiles.
    const filteredProfiles = [];
    while (profilesToFilter.length > 0 && filteredProfiles.length < requiredSize) {
      var _response$errors;
      const profilesBatch = new Map(profilesToFilter.splice(0, Math.max(requiredSize - filteredProfiles.length, MIN_SUGGESTIONS_FOR_PRIVILEGES_CHECK)).map(profile => [profile.uid, profile]));
      const profileUidsToFilter = new Set(profilesBatch.keys());
      let response;
      try {
        response = await this.authz.checkUserProfilesPrivileges(profileUidsToFilter).atSpace(requiredPrivileges.spaceId, requiredPrivileges.privileges);
      } catch (error) {
        this.logger.error(`Failed to check required privileges for the suggested profiles: ${(0, _errors.getDetailedErrorMessage)(error)}`);
        throw error;
      }
      const unknownUids = [];
      for (const profileUid of response.hasPrivilegeUids) {
        const filteredProfile = profilesBatch.get(profileUid);
        // We check privileges in batches and the batch can have more users than requested. We ignore "excessive" users,
        // but still iterate through entire batch to collect and report all unknown uids.
        if (filteredProfile && filteredProfiles.length < requiredSize) {
          filteredProfiles.push(filteredProfile);
        } else if (!filteredProfile) {
          unknownUids.push(profileUid);
        }
      }

      // Log unknown profile UIDs.
      if (unknownUids.length > 0) {
        this.logger.error(`Privileges check API returned unknown profile UIDs: ${unknownUids}.`);
      }

      // Log profile UIDs and reason for which an error was encountered.
      if ((_response$errors = response.errors) !== null && _response$errors !== void 0 && _response$errors.count) {
        const uids = Object.keys(response.errors.details);
        for (const uid of uids) {
          this.logger.error(`Privileges check API failed for UID ${uid} because ${response.errors.details[uid].reason}.`);
        }
      }
    }
    return filteredProfiles;
  }
}

/**
 * Returns string of comma separated values prefixed with `prefix`.
 * @param str String of comma separated values
 * @param prefix Prefix to use prepend to each value
 */
exports.UserProfileService = UserProfileService;
function prefixCommaSeparatedValues(str, prefix) {
  return str.split(',').reduce((accumulator, value) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      accumulator.push(`${prefix}.${trimmedValue}`);
    }
    return accumulator;
  }, []).join(',');
}