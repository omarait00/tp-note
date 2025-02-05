"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.USER_AVATAR_MAX_INITIALS = exports.USER_AVATAR_FALLBACK_CODE_POINT = void 0;
exports.getUserAvatarColor = getUserAvatarColor;
exports.getUserAvatarInitials = getUserAvatarInitials;
var _eui = require("@elastic/eui");
var _user = require("./user");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const USER_AVATAR_FALLBACK_CODE_POINT = 97; // code point for lowercase "a"
exports.USER_AVATAR_FALLBACK_CODE_POINT = USER_AVATAR_FALLBACK_CODE_POINT;
const USER_AVATAR_MAX_INITIALS = 2;

/**
 * Determines the color for the provided user profile.
 * If a color is present on the user profile itself, then that is used.
 * Otherwise, a color is provided from EUI's Visualization Colors based on the display name.
 *
 * @param {UserProfileUserInfo} user User info
 * @param {UserProfileAvatarData} avatar User avatar
 */
exports.USER_AVATAR_MAX_INITIALS = USER_AVATAR_MAX_INITIALS;
function getUserAvatarColor(user, avatar) {
  if (avatar && avatar.color) {
    return avatar.color;
  }
  const firstCodePoint = (0, _user.getUserDisplayName)(user).codePointAt(0) || USER_AVATAR_FALLBACK_CODE_POINT;
  return _eui.VISUALIZATION_COLORS[firstCodePoint % _eui.VISUALIZATION_COLORS.length];
}

/**
 * Determines the initials for the provided user profile.
 * If initials are present on the user profile itself, then that is used.
 * Otherwise, the initials are calculated based off the words in the display name, with a max length of 2 characters.
 *
 * @param {UserProfileUserInfo} user User info
 * @param {UserProfileAvatarData} avatar User avatar
 */
function getUserAvatarInitials(user, avatar) {
  if (avatar && avatar.initials) {
    return avatar.initials;
  }
  const words = (0, _user.getUserDisplayName)(user).split(' ');
  const numInitials = Math.min(USER_AVATAR_MAX_INITIALS, words.length);
  words.splice(numInitials, words.length);
  return words.map(word => word.substring(0, 1)).join('');
}