"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeExceptionLists = exports.getRulesToUpdate = exports.filterInstalledRules = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns the rules to update by doing a compare to the rules from the file system against
 * the installed rules already. This also merges exception list items between the two since
 * exception list items can exist on both rules to update and already installed rules.
 * @param latestPrebuiltRules The latest rules to check against installed
 * @param installedRules The installed rules
 */
const getRulesToUpdate = (latestPrebuiltRules, installedRules) => {
  return Array.from(latestPrebuiltRules.values()).filter(latestRule => filterInstalledRules(latestRule, installedRules)).map(latestRule => mergeExceptionLists(latestRule, installedRules));
};

/**
 * Filters latest prepackaged rules that do not match the installed rules so you
 * only get back rules that are going to be updated
 * @param latestPrebuiltRule The latest prepackaged rule version
 * @param installedRules The installed rules to compare against for updates
 */
exports.getRulesToUpdate = getRulesToUpdate;
const filterInstalledRules = (latestPrebuiltRule, installedRules) => {
  const installedRule = installedRules.get(latestPrebuiltRule.rule_id);
  return !!installedRule && installedRule.params.version < latestPrebuiltRule.version;
};

/**
 * Given a rule from the file system and the set of installed rules this will merge the exception lists
 * from the installed rules onto the rules from the file system.
 * @param latestPrebuiltRule The latest prepackaged rule version that might have exceptions_lists
 * @param installedRules The installed rules which might have user driven exceptions_lists
 */
exports.filterInstalledRules = filterInstalledRules;
const mergeExceptionLists = (latestPrebuiltRule, installedRules) => {
  if (latestPrebuiltRule.exceptions_list != null) {
    const installedRule = installedRules.get(latestPrebuiltRule.rule_id);
    if (installedRule != null && installedRule.params.exceptionsList != null) {
      const installedExceptionList = installedRule.params.exceptionsList;
      const fileSystemExceptions = latestPrebuiltRule.exceptions_list.filter(potentialDuplicate => installedExceptionList.every(item => item.list_id !== potentialDuplicate.list_id));
      return {
        ...latestPrebuiltRule,
        exceptions_list: [...fileSystemExceptions, ...installedRule.params.exceptionsList]
      };
    } else {
      return latestPrebuiltRule;
    }
  } else {
    return latestPrebuiltRule;
  }
};
exports.mergeExceptionLists = mergeExceptionLists;