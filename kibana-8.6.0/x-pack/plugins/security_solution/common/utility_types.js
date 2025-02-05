"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unionWithNullType = exports.stringEnum = exports.assertUnreachable = void 0;
var runtimeTypes = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const unionWithNullType = type => runtimeTypes.union([type, runtimeTypes.null]);
exports.unionWithNullType = unionWithNullType;
const stringEnum = (enumObj, enumName = 'enum') => new runtimeTypes.Type(enumName, u => Object.values(enumObj).includes(u), (u, c) => Object.values(enumObj).includes(u) ? runtimeTypes.success(u) : runtimeTypes.failure(u, c), a => a);

/**
 * Unreachable Assertion helper for scenarios like exhaustive switches.
 * For references see: https://stackoverflow.com/questions/39419170/how-do-i-check-that-a-switch-block-is-exhaustive-in-typescript
 * This "x" should _always_ be a type of "never" and not change to "unknown" or any other type. See above link or the generic
 * concept of exhaustive checks in switch blocks.
 *
 * Optionally you can avoid the use of this by using early returns and TypeScript will clear your type checking without complaints
 * but there are situations and times where this function might still be needed.
 *
 * If you see an error, DO NOT cast "as never" such as:
 * assertUnreachable(x as never) // BUG IN YOUR CODE NOW AND IT WILL THROW DURING RUNTIME
 * If you see code like that remove it, as that deactivates the intent of this utility.
 * If you need to do that, then you should remove assertUnreachable from your code and
 * use a default at the end of the switch instead.
 * @param x Unreachable field
 * @param message Message of error thrown
 */
exports.stringEnum = stringEnum;
const assertUnreachable = (x,
// This should always be a type of "never"
message = 'Unknown Field in switch statement') => {
  throw new Error(`${message}: ${x}`);
};
exports.assertUnreachable = assertUnreachable;