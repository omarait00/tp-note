"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ENTER_SPACE_PATH", {
  enumerable: true,
  get: function () {
    return _constants.ENTER_SPACE_PATH;
  }
});
Object.defineProperty(exports, "MAX_SPACE_INITIALS", {
  enumerable: true,
  get: function () {
    return _constants.MAX_SPACE_INITIALS;
  }
});
Object.defineProperty(exports, "SPACE_SEARCH_COUNT_THRESHOLD", {
  enumerable: true,
  get: function () {
    return _constants.SPACE_SEARCH_COUNT_THRESHOLD;
  }
});
Object.defineProperty(exports, "addSpaceIdToPath", {
  enumerable: true,
  get: function () {
    return _spaces_url_parser.addSpaceIdToPath;
  }
});
Object.defineProperty(exports, "getSpaceIdFromPath", {
  enumerable: true,
  get: function () {
    return _spaces_url_parser.getSpaceIdFromPath;
  }
});
Object.defineProperty(exports, "isReservedSpace", {
  enumerable: true,
  get: function () {
    return _is_reserved_space.isReservedSpace;
  }
});
var _is_reserved_space = require("./is_reserved_space");
var _constants = require("./constants");
var _spaces_url_parser = require("./lib/spaces_url_parser");