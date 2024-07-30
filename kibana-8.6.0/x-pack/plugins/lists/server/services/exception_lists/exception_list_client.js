"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExceptionListClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _utils = require("@kbn/utils");
var _get_exception_list = require("./get_exception_list");
var _export_exception_list_and_items = require("./export_exception_list_and_items");
var _get_exception_list_summary = require("./get_exception_list_summary");
var _create_exception_list = require("./create_exception_list");
var _get_exception_list_item = require("./get_exception_list_item");
var _create_exception_list_item = require("./create_exception_list_item");
var _update_exception_list = require("./update_exception_list");
var _update_exception_list_item = require("./update_exception_list_item");
var _delete_exception_list = require("./delete_exception_list");
var _delete_exception_list_item = require("./delete_exception_list_item");
var _find_exception_list_item = require("./find_exception_list_item");
var _find_exception_list = require("./find_exception_list");
var _find_exception_list_items = require("./find_exception_list_items");
var _create_endpoint_list = require("./create_endpoint_list");
var _create_endpoint_trusted_apps_list = require("./create_endpoint_trusted_apps_list");
var _import_exception_list_and_items = require("./import_exception_list_and_items");
var _utils2 = require("./utils");
var _create_exceptions_stream_logic = require("./utils/import/create_exceptions_stream_logic");
var _open_point_in_time = require("./open_point_in_time");
var _close_point_in_time = require("./close_point_in_time");
var _find_exception_list_point_in_time_finder = require("./find_exception_list_point_in_time_finder");
var _find_value_list_exception_list_items = require("./find_value_list_exception_list_items");
var _find_exception_list_items_point_in_time_finder = require("./find_exception_list_items_point_in_time_finder");
var _find_value_list_exception_list_items_point_in_time_finder = require("./find_value_list_exception_list_items_point_in_time_finder");
var _find_exception_list_item_point_in_time_finder = require("./find_exception_list_item_point_in_time_finder");
var _duplicate_exception_list = require("./duplicate_exception_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Class for use for exceptions that are with trusted applications or
 * with rules.
 */
class ExceptionListClient {
  /** User creating, modifying, deleting, or updating an exception list */

  /** Saved objects client to create, modify, delete, an exception list */

  /** server extensions client that can be useful for injecting domain specific rules */

  /** Set to true to enable the server extension points, otherwise false */

  /** Optionally, the Kibana request which is useful for extension points */

  /**
   * Constructs the exception list
   * @param options
   * @param options.user The user associated with the action for exception list
   * @param options.savedObjectsClient The saved objects client to create, modify, delete, an exception list
   * @param options.serverExtensionsClient The server extensions client that can be useful for injecting domain specific rules
   * @param options.request optionally, the Kibana request which is useful for extension points
   */
  constructor({
    user: _user,
    savedObjectsClient: _savedObjectsClient,
    serverExtensionsClient,
    enableServerExtensionPoints = true,
    request
  }) {
    (0, _defineProperty2.default)(this, "user", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "serverExtensionsClient", void 0);
    (0, _defineProperty2.default)(this, "enableServerExtensionPoints", void 0);
    (0, _defineProperty2.default)(this, "request", void 0);
    (0, _defineProperty2.default)(this, "getExceptionList", async ({
      listId,
      id,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _get_exception_list.getExceptionList)({
        id,
        listId,
        namespaceType,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "getExceptionListSummary", async ({
      filter,
      listId,
      id,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      if (this.enableServerExtensionPoints) {
        await this.serverExtensionsClient.pipeRun('exceptionsListPreSummary', {
          filter,
          id,
          listId,
          namespaceType
        }, this.getServerExtensionCallbackContext());
      }
      return (0, _get_exception_list_summary.getExceptionListSummary)({
        filter,
        id,
        listId,
        namespaceType,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "getExceptionListItem", async ({
      itemId,
      id,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      if (this.enableServerExtensionPoints) {
        await this.serverExtensionsClient.pipeRun('exceptionsListPreGetOneItem', {
          id,
          itemId,
          namespaceType
        }, this.getServerExtensionCallbackContext());
      }
      return (0, _get_exception_list_item.getExceptionListItem)({
        id,
        itemId,
        namespaceType,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "createEndpointList", async () => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _create_endpoint_list.createEndpointList)({
        savedObjectsClient,
        user,
        version: 1
      });
    });
    (0, _defineProperty2.default)(this, "createTrustedAppsList", async () => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _create_endpoint_trusted_apps_list.createEndpointTrustedAppsList)({
        savedObjectsClient,
        user,
        version: 1
      });
    });
    (0, _defineProperty2.default)(this, "createEndpointListItem", async ({
      comments,
      description,
      entries,
      itemId,
      meta,
      name,
      osTypes,
      tags,
      type
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      await this.createEndpointList();
      return (0, _create_exception_list_item.createExceptionListItem)({
        comments,
        description,
        entries,
        itemId,
        listId: _securitysolutionListConstants.ENDPOINT_LIST_ID,
        meta,
        name,
        namespaceType: 'agnostic',
        osTypes,
        savedObjectsClient,
        tags,
        type,
        user
      });
    });
    (0, _defineProperty2.default)(this, "duplicateExceptionListAndItems", async ({
      listId,
      namespaceType
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _duplicate_exception_list.duplicateExceptionListAndItems)({
        listId,
        namespaceType,
        savedObjectsClient,
        user
      });
    });
    (0, _defineProperty2.default)(this, "updateEndpointListItem", async ({
      _version,
      comments,
      description,
      entries,
      id,
      itemId,
      meta,
      name,
      osTypes,
      tags,
      type
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      await this.createEndpointList();
      return (0, _update_exception_list_item.updateExceptionListItem)({
        _version,
        comments,
        description,
        entries,
        id,
        itemId,
        meta,
        name,
        namespaceType: 'agnostic',
        osTypes,
        savedObjectsClient,
        tags,
        type,
        user
      });
    });
    (0, _defineProperty2.default)(this, "getEndpointListItem", async ({
      itemId,
      id
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _get_exception_list_item.getExceptionListItem)({
        id,
        itemId,
        namespaceType: 'agnostic',
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "createExceptionList", async ({
      description,
      immutable,
      listId,
      meta,
      name,
      namespaceType,
      tags,
      type,
      version
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _create_exception_list.createExceptionList)({
        description,
        immutable,
        listId,
        meta,
        name,
        namespaceType,
        savedObjectsClient,
        tags,
        type,
        user,
        version
      });
    });
    (0, _defineProperty2.default)(this, "updateExceptionList", async ({
      _version,
      id,
      description,
      listId,
      meta,
      name,
      namespaceType,
      tags,
      type,
      version
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _update_exception_list.updateExceptionList)({
        _version,
        description,
        id,
        listId,
        meta,
        name,
        namespaceType,
        savedObjectsClient,
        tags,
        type,
        user,
        version
      });
    });
    (0, _defineProperty2.default)(this, "deleteExceptionList", async ({
      id,
      listId,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _delete_exception_list.deleteExceptionList)({
        id,
        listId,
        namespaceType,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "createExceptionListItem", async ({
      comments,
      description,
      entries,
      itemId,
      listId,
      meta,
      name,
      namespaceType,
      osTypes,
      tags,
      type
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      let itemData = {
        comments,
        description,
        entries,
        itemId,
        listId,
        meta,
        name,
        namespaceType,
        osTypes,
        tags,
        type
      };
      if (this.enableServerExtensionPoints) {
        itemData = await this.serverExtensionsClient.pipeRun('exceptionsListPreCreateItem', itemData, this.getServerExtensionCallbackContext(), data => {
          return (0, _utils2.validateData)(_securitysolutionIoTsListTypes.createExceptionListItemSchema, (0, _utils2.transformCreateExceptionListItemOptionsToCreateExceptionListItemSchema)(data));
        });
      }
      return (0, _create_exception_list_item.createExceptionListItem)({
        ...itemData,
        savedObjectsClient,
        user
      });
    });
    (0, _defineProperty2.default)(this, "updateExceptionListItem", async ({
      _version,
      comments,
      description,
      entries,
      id,
      itemId,
      meta,
      name,
      namespaceType,
      osTypes,
      tags,
      type
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      let updatedItem = {
        _version,
        comments,
        description,
        entries,
        id,
        itemId,
        meta,
        name,
        namespaceType,
        osTypes,
        tags,
        type
      };
      if (this.enableServerExtensionPoints) {
        updatedItem = await this.serverExtensionsClient.pipeRun('exceptionsListPreUpdateItem', updatedItem, this.getServerExtensionCallbackContext(), data => {
          return (0, _utils2.validateData)(_securitysolutionIoTsListTypes.updateExceptionListItemSchema, (0, _utils2.transformUpdateExceptionListItemOptionsToUpdateExceptionListItemSchema)(data));
        });
      }
      return (0, _update_exception_list_item.updateExceptionListItem)({
        ...updatedItem,
        savedObjectsClient,
        user
      });
    });
    (0, _defineProperty2.default)(this, "deleteExceptionListItem", async ({
      id,
      itemId,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      if (this.enableServerExtensionPoints) {
        await this.serverExtensionsClient.pipeRun('exceptionsListPreDeleteItem', {
          id,
          itemId,
          namespaceType
        }, this.getServerExtensionCallbackContext());
      }
      return (0, _delete_exception_list_item.deleteExceptionListItem)({
        id,
        itemId,
        namespaceType,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "deleteExceptionListItemById", async ({
      id,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      if (this.enableServerExtensionPoints) {
        await this.serverExtensionsClient.pipeRun('exceptionsListPreDeleteItem', {
          id,
          itemId: undefined,
          namespaceType
        }, this.getServerExtensionCallbackContext());
      }
      return (0, _delete_exception_list_item.deleteExceptionListItemById)({
        id,
        namespaceType,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "deleteEndpointListItem", async ({
      id,
      itemId
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _delete_exception_list_item.deleteExceptionListItem)({
        id,
        itemId,
        namespaceType: 'agnostic',
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "findExceptionListItem", async ({
      listId,
      filter,
      perPage,
      pit,
      page,
      search,
      searchAfter,
      sortField,
      sortOrder,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      if (this.enableServerExtensionPoints) {
        await this.serverExtensionsClient.pipeRun('exceptionsListPreSingleListFind', {
          filter,
          listId,
          namespaceType,
          page,
          perPage,
          pit,
          searchAfter,
          sortField,
          sortOrder
        }, this.getServerExtensionCallbackContext());
      }
      return (0, _find_exception_list_item.findExceptionListItem)({
        filter,
        listId,
        namespaceType,
        page,
        perPage,
        pit,
        savedObjectsClient,
        search,
        searchAfter,
        sortField,
        sortOrder
      });
    });
    (0, _defineProperty2.default)(this, "findExceptionListsItem", async ({
      listId,
      filter,
      perPage,
      pit,
      page,
      search,
      searchAfter,
      sortField,
      sortOrder,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      if (this.enableServerExtensionPoints) {
        await this.serverExtensionsClient.pipeRun('exceptionsListPreMultiListFind', {
          filter,
          listId,
          namespaceType,
          page,
          perPage,
          pit,
          search,
          searchAfter,
          sortField,
          sortOrder
        }, this.getServerExtensionCallbackContext());
      }
      return (0, _find_exception_list_items.findExceptionListsItem)({
        filter,
        listId,
        namespaceType,
        page,
        perPage,
        pit,
        savedObjectsClient,
        search,
        searchAfter,
        sortField,
        sortOrder
      });
    });
    (0, _defineProperty2.default)(this, "findValueListExceptionListItems", async ({
      perPage,
      pit,
      page,
      searchAfter,
      sortField,
      sortOrder,
      valueListId
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_value_list_exception_list_items.findValueListExceptionListItems)({
        page,
        perPage,
        pit,
        savedObjectsClient,
        searchAfter,
        sortField,
        sortOrder,
        valueListId
      });
    });
    (0, _defineProperty2.default)(this, "findExceptionList", async ({
      filter,
      perPage,
      page,
      pit,
      searchAfter,
      sortField,
      sortOrder,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_exception_list.findExceptionList)({
        filter,
        namespaceType,
        page,
        perPage,
        pit,
        savedObjectsClient,
        searchAfter,
        sortField,
        sortOrder
      });
    });
    (0, _defineProperty2.default)(this, "findEndpointListItem", async ({
      filter,
      perPage,
      page,
      pit,
      search,
      searchAfter,
      sortField,
      sortOrder
    }) => {
      const {
        savedObjectsClient
      } = this;
      await this.createEndpointList();
      return (0, _find_exception_list_item.findExceptionListItem)({
        filter,
        listId: _securitysolutionListConstants.ENDPOINT_LIST_ID,
        namespaceType: 'agnostic',
        page,
        perPage,
        pit,
        savedObjectsClient,
        search,
        searchAfter,
        sortField,
        sortOrder
      });
    });
    (0, _defineProperty2.default)(this, "exportExceptionListAndItems", async ({
      listId,
      id,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      if (this.enableServerExtensionPoints) {
        await this.serverExtensionsClient.pipeRun('exceptionsListPreExport', {
          id,
          listId,
          namespaceType
        }, this.getServerExtensionCallbackContext());
      }
      return (0, _export_exception_list_and_items.exportExceptionListAndItems)({
        id,
        listId,
        namespaceType,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "importExceptionListAndItems", async ({
      exceptionsToImport,
      maxExceptionsImportSize,
      overwrite,
      generateNewListId
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;

      // validation of import and sorting of lists and items
      const readStream = (0, _create_exceptions_stream_logic.createExceptionsStreamFromNdjson)(maxExceptionsImportSize);
      const [parsedObjects] = await (0, _utils.createPromiseFromStreams)([exceptionsToImport, ...readStream]);
      if (this.enableServerExtensionPoints) {
        await this.serverExtensionsClient.pipeRun('exceptionsListPreImport', parsedObjects, this.getServerExtensionCallbackContext());
      }
      return (0, _import_exception_list_and_items.importExceptions)({
        exceptions: parsedObjects,
        generateNewListId,
        overwrite,
        savedObjectsClient,
        user
      });
    });
    (0, _defineProperty2.default)(this, "importExceptionListAndItemsAsArray", async ({
      exceptionsToImport,
      maxExceptionsImportSize,
      overwrite
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;

      // validation of import and sorting of lists and items
      const parsedObjects = (0, _create_exceptions_stream_logic.exceptionsChecksFromArray)(exceptionsToImport, maxExceptionsImportSize);
      if (this.enableServerExtensionPoints) {
        await this.serverExtensionsClient.pipeRun('exceptionsListPreImport', parsedObjects, this.getServerExtensionCallbackContext());
      }
      return (0, _import_exception_list_and_items.importExceptions)({
        exceptions: parsedObjects,
        generateNewListId: false,
        overwrite,
        savedObjectsClient,
        user
      });
    });
    (0, _defineProperty2.default)(this, "openPointInTime", async ({
      namespaceType,
      options
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _open_point_in_time.openPointInTime)({
        namespaceType,
        options,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "closePointInTime", async ({
      pit
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _close_point_in_time.closePointInTime)({
        pit,
        savedObjectsClient
      });
    });
    (0, _defineProperty2.default)(this, "findExceptionListItemPointInTimeFinder", async ({
      executeFunctionOnStream,
      filter,
      listId,
      maxSize,
      namespaceType,
      perPage,
      sortField,
      sortOrder
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_exception_list_item_point_in_time_finder.findExceptionListItemPointInTimeFinder)({
        executeFunctionOnStream,
        filter,
        listId,
        maxSize,
        namespaceType,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder
      });
    });
    (0, _defineProperty2.default)(this, "findExceptionListPointInTimeFinder", async ({
      executeFunctionOnStream,
      filter,
      maxSize,
      namespaceType,
      perPage,
      sortField,
      sortOrder
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_exception_list_point_in_time_finder.findExceptionListPointInTimeFinder)({
        executeFunctionOnStream,
        filter,
        maxSize,
        namespaceType,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder
      });
    });
    (0, _defineProperty2.default)(this, "findExceptionListsItemPointInTimeFinder", async ({
      listId,
      namespaceType,
      executeFunctionOnStream,
      maxSize,
      filter,
      perPage,
      sortField,
      sortOrder
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_exception_list_items_point_in_time_finder.findExceptionListsItemPointInTimeFinder)({
        executeFunctionOnStream,
        filter,
        listId,
        maxSize,
        namespaceType,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder
      });
    });
    (0, _defineProperty2.default)(this, "findValueListExceptionListItemsPointInTimeFinder", async ({
      valueListId,
      executeFunctionOnStream,
      perPage,
      maxSize,
      sortField,
      sortOrder
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_value_list_exception_list_items_point_in_time_finder.findValueListExceptionListItemsPointInTimeFinder)({
        executeFunctionOnStream,
        maxSize,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder,
        valueListId
      });
    });
    this.user = _user;
    this.savedObjectsClient = _savedObjectsClient;
    this.serverExtensionsClient = serverExtensionsClient;
    this.enableServerExtensionPoints = enableServerExtensionPoints;
    this.request = request;
  }
  getServerExtensionCallbackContext() {
    const {
      user,
      serverExtensionsClient,
      savedObjectsClient,
      request
    } = this;
    let exceptionListClient;
    return {
      // Lazy getter so that we only initialize a new instance of the class if needed
      get exceptionListClient() {
        if (!exceptionListClient) {
          exceptionListClient = new ExceptionListClient({
            enableServerExtensionPoints: false,
            request,
            savedObjectsClient,
            serverExtensionsClient,
            user
          });
        }
        return exceptionListClient;
      },
      request: this.request
    };
  }

  /**
   * Fetch an exception list parent container
   * @param options
   * @param options.listId the "list_id" of an exception list
   * @param options.id the "id" of an exception list
   * @param options.namespaceType saved object namespace (single | agnostic)
   * @returns The found exception list or null if none exists
   */
}
exports.ExceptionListClient = ExceptionListClient;