"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invalidEmailsAsMessage = invalidEmailsAsMessage;
exports.validateEmailAddresses = validateEmailAddresses;
exports.validateEmailAddressesAsAlwaysValid = validateEmailAddressesAsAlwaysValid;
var _emailAddresses = require("email-addresses");
var _types = require("./types");
var _mustache_template = require("./mustache_template");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// this can be useful for cases where a plugin needs this function,
// but the actions plugin may not be available.  This could be used
// as a stub for the real implementation.
function validateEmailAddressesAsAlwaysValid(addresses) {
  return addresses.map(address => ({
    address,
    valid: true
  }));
}
function validateEmailAddresses(allowedDomains, addresses, options = {}) {
  return addresses.map(address => validateEmailAddress(allowedDomains, address, options));
}
function invalidEmailsAsMessage(validatedEmails) {
  const invalid = validatedEmails.filter(validated => !validated.valid && validated.reason === _types.InvalidEmailReason.invalid);
  const notAllowed = validatedEmails.filter(validated => !validated.valid && validated.reason === _types.InvalidEmailReason.notAllowed);
  const messages = [];
  if (invalid.length !== 0) {
    messages.push(`not valid emails: ${addressesFromValidatedEmails(invalid).join(', ')}`);
  }
  if (notAllowed.length !== 0) {
    messages.push(`not allowed emails: ${addressesFromValidatedEmails(notAllowed).join(', ')}`);
  }
  if (messages.length === 0) return;
  return messages.join('; ');
}

// in case the npm email-addresses returns unexpected things ...
function validateEmailAddress(allowedDomains, address, options) {
  // The reason we bypass the validation in this case, is that email addresses
  // used in an alerting action could contain mustache templates which render
  // as the actual values. So we can't really validate them.  Fear not!
  // We always do a final validation in the executor where we do NOT
  // have this flag on.
  if (options.treatMustacheTemplatesAsValid && (0, _mustache_template.hasMustacheTemplate)(address)) {
    return {
      address,
      valid: true
    };
  }
  try {
    return validateEmailAddress_(allowedDomains, address);
  } catch (err) {
    return {
      address,
      valid: false,
      reason: _types.InvalidEmailReason.invalid
    };
  }
}
function validateEmailAddress_(allowedDomains, address) {
  const emailAddresses = (0, _emailAddresses.parseAddressList)(address);
  if (emailAddresses == null) {
    return {
      address,
      valid: false,
      reason: _types.InvalidEmailReason.invalid
    };
  }
  if (allowedDomains !== null) {
    const allowedDomainsSet = new Set(allowedDomains);
    for (const emailAddress of emailAddresses) {
      let domains = [];
      if (emailAddress.type === 'group') {
        domains = emailAddress.addresses.map(groupAddress => groupAddress.domain);
      } else if (emailAddress.type === 'mailbox') {
        domains = [emailAddress.domain];
      } else {
        return {
          address,
          valid: false,
          reason: _types.InvalidEmailReason.invalid
        };
      }
      for (const domain of domains) {
        if (!allowedDomainsSet.has(domain)) {
          return {
            address,
            valid: false,
            reason: _types.InvalidEmailReason.notAllowed
          };
        }
      }
    }
  }
  return {
    address,
    valid: true
  };
}
function addressesFromValidatedEmails(validatedEmails) {
  return validatedEmails.map(validatedEmail => validatedEmail.address);
}