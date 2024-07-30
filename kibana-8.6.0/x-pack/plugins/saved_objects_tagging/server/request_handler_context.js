"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TagsRequestHandlerContext = void 0;
var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));
var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));
var _services = require("./services");
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
var _client = /*#__PURE__*/new WeakMap();
var _assignmentService = /*#__PURE__*/new WeakMap();
class TagsRequestHandlerContext {
  constructor(request, coreContext, security) {
    _classPrivateFieldInitSpec(this, _client, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _assignmentService, {
      writable: true,
      value: void 0
    });
    this.request = request;
    this.coreContext = coreContext;
    this.security = security;
  }
  get tagsClient() {
    if ((0, _classPrivateFieldGet2.default)(this, _client) == null) {
      (0, _classPrivateFieldSet2.default)(this, _client, new _services.TagsClient({
        client: this.coreContext.savedObjects.client
      }));
    }
    return (0, _classPrivateFieldGet2.default)(this, _client);
  }
  get assignmentService() {
    if ((0, _classPrivateFieldGet2.default)(this, _assignmentService) == null) {
      var _this$security;
      (0, _classPrivateFieldSet2.default)(this, _assignmentService, new _services.AssignmentService({
        request: this.request,
        client: this.coreContext.savedObjects.client,
        typeRegistry: this.coreContext.savedObjects.typeRegistry,
        authorization: (_this$security = this.security) === null || _this$security === void 0 ? void 0 : _this$security.authz
      }));
    }
    return (0, _classPrivateFieldGet2.default)(this, _assignmentService);
  }
}
exports.TagsRequestHandlerContext = TagsRequestHandlerContext;