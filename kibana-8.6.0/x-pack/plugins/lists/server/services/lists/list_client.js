"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _items = require("../items");
var _list_item_policy = _interopRequireDefault(require("../items/list_item_policy.json"));
var _list_policy = _interopRequireDefault(require("./list_policy.json"));
var _create_list_if_it_does_not_exist = require("./create_list_if_it_does_not_exist");
var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Class for use for value lists are are associated with exception lists.
 * See {@link https://www.elastic.co/guide/en/security/current/lists-api-create-container.html}
 */
class ListClient {
  /** Kibana space id the value lists are part of */

  /** User creating, modifying, deleting, or updating a value list */

  /** Configuration for determining things such as maximum sizes  */

  /** The elastic search client to do the queries with */

  /**
   * Constructs the value list
   * @param options
   * @param options.spaceId Kibana space id the value lists are part of
   * @param options.user The user associated with the value list
   * @param options.config Configuration for determining things such as maximum sizes
   * @param options.esClient The elastic search client to do the queries with
   */
  constructor({
    spaceId: _spaceId,
    user: _user,
    config: _config,
    esClient: _esClient
  }) {
    (0, _defineProperty2.default)(this, "spaceId", void 0);
    (0, _defineProperty2.default)(this, "user", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "getListIndex", () => {
      const {
        spaceId,
        config: {
          listIndex: listsIndexName
        }
      } = this;
      return (0, _.getListIndex)({
        listsIndexName,
        spaceId
      });
    });
    (0, _defineProperty2.default)(this, "getListItemIndex", () => {
      const {
        spaceId,
        config: {
          listItemIndex: listsItemsIndexName
        }
      } = this;
      return (0, _items.getListItemIndex)({
        listsItemsIndexName,
        spaceId
      });
    });
    (0, _defineProperty2.default)(this, "getList", async ({
      id
    }) => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      return (0, _.getList)({
        esClient,
        id,
        listIndex
      });
    });
    (0, _defineProperty2.default)(this, "createList", async ({
      id,
      deserializer,
      immutable,
      serializer,
      name,
      description,
      type,
      meta,
      version
    }) => {
      const {
        esClient,
        user
      } = this;
      const listIndex = this.getListIndex();
      return (0, _.createList)({
        description,
        deserializer,
        esClient,
        id,
        immutable,
        listIndex,
        meta,
        name,
        serializer,
        type,
        user,
        version
      });
    });
    (0, _defineProperty2.default)(this, "createListIfItDoesNotExist", async ({
      id,
      deserializer,
      serializer,
      name,
      description,
      immutable,
      type,
      meta,
      version
    }) => {
      const {
        esClient,
        user
      } = this;
      const listIndex = this.getListIndex();
      return (0, _create_list_if_it_does_not_exist.createListIfItDoesNotExist)({
        description,
        deserializer,
        esClient,
        id,
        immutable,
        listIndex,
        meta,
        name,
        serializer,
        type,
        user,
        version
      });
    });
    (0, _defineProperty2.default)(this, "getListIndexExists", async () => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      return (0, _securitysolutionEsUtils.getBootstrapIndexExists)(esClient, listIndex);
    });
    (0, _defineProperty2.default)(this, "getListItemIndexExists", async () => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _securitysolutionEsUtils.getBootstrapIndexExists)(esClient, listItemIndex);
    });
    (0, _defineProperty2.default)(this, "createListBootStrapIndex", async () => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      return (0, _securitysolutionEsUtils.createBootstrapIndex)(esClient, listIndex);
    });
    (0, _defineProperty2.default)(this, "createListItemBootStrapIndex", async () => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _securitysolutionEsUtils.createBootstrapIndex)(esClient, listItemIndex);
    });
    (0, _defineProperty2.default)(this, "getListPolicyExists", async () => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      return (0, _securitysolutionEsUtils.getPolicyExists)(esClient, listIndex);
    });
    (0, _defineProperty2.default)(this, "getListItemPolicyExists", async () => {
      const {
        esClient
      } = this;
      const listsItemIndex = this.getListItemIndex();
      return (0, _securitysolutionEsUtils.getPolicyExists)(esClient, listsItemIndex);
    });
    (0, _defineProperty2.default)(this, "getListTemplateExists", async () => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      return (0, _securitysolutionEsUtils.getIndexTemplateExists)(esClient, listIndex);
    });
    (0, _defineProperty2.default)(this, "getListItemTemplateExists", async () => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _securitysolutionEsUtils.getIndexTemplateExists)(esClient, listItemIndex);
    });
    (0, _defineProperty2.default)(this, "getLegacyListTemplateExists", async () => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      return (0, _securitysolutionEsUtils.getTemplateExists)(esClient, listIndex);
    });
    (0, _defineProperty2.default)(this, "getLegacyListItemTemplateExists", async () => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _securitysolutionEsUtils.getTemplateExists)(esClient, listItemIndex);
    });
    (0, _defineProperty2.default)(this, "getListTemplate", () => {
      const listIndex = this.getListIndex();
      return (0, _.getListTemplate)(listIndex);
    });
    (0, _defineProperty2.default)(this, "getListItemTemplate", () => {
      const listItemIndex = this.getListItemIndex();
      return (0, _items.getListItemTemplate)(listItemIndex);
    });
    (0, _defineProperty2.default)(this, "setListTemplate", async () => {
      const {
        esClient
      } = this;
      const template = this.getListTemplate();
      const listIndex = this.getListIndex();
      return (0, _securitysolutionEsUtils.setIndexTemplate)(esClient, listIndex, template);
    });
    (0, _defineProperty2.default)(this, "setListItemTemplate", async () => {
      const {
        esClient
      } = this;
      const template = this.getListItemTemplate();
      const listItemIndex = this.getListItemIndex();
      return (0, _securitysolutionEsUtils.setIndexTemplate)(esClient, listItemIndex, template);
    });
    (0, _defineProperty2.default)(this, "setListPolicy", async () => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      return (0, _securitysolutionEsUtils.setPolicy)(esClient, listIndex, _list_policy.default);
    });
    (0, _defineProperty2.default)(this, "setListItemPolicy", async () => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _securitysolutionEsUtils.setPolicy)(esClient, listItemIndex, _list_item_policy.default);
    });
    (0, _defineProperty2.default)(this, "deleteListIndex", async () => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      return (0, _securitysolutionEsUtils.deleteAllIndex)(esClient, `${listIndex}-*`);
    });
    (0, _defineProperty2.default)(this, "deleteListItemIndex", async () => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _securitysolutionEsUtils.deleteAllIndex)(esClient, `${listItemIndex}-*`);
    });
    (0, _defineProperty2.default)(this, "deleteListPolicy", async () => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      return (0, _securitysolutionEsUtils.deletePolicy)(esClient, listIndex);
    });
    (0, _defineProperty2.default)(this, "deleteListItemPolicy", async () => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _securitysolutionEsUtils.deletePolicy)(esClient, listItemIndex);
    });
    (0, _defineProperty2.default)(this, "deleteListTemplate", async () => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      return (0, _securitysolutionEsUtils.deleteIndexTemplate)(esClient, listIndex);
    });
    (0, _defineProperty2.default)(this, "deleteListItemTemplate", async () => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _securitysolutionEsUtils.deleteIndexTemplate)(esClient, listItemIndex);
    });
    (0, _defineProperty2.default)(this, "deleteLegacyListTemplate", async () => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      return (0, _securitysolutionEsUtils.deleteTemplate)(esClient, listIndex);
    });
    (0, _defineProperty2.default)(this, "deleteLegacyListItemTemplate", async () => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _securitysolutionEsUtils.deleteTemplate)(esClient, listItemIndex);
    });
    (0, _defineProperty2.default)(this, "deleteListItem", async ({
      id
    }) => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.deleteListItem)({
        esClient,
        id,
        listItemIndex
      });
    });
    (0, _defineProperty2.default)(this, "deleteListItemByValue", async ({
      listId,
      value,
      type
    }) => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.deleteListItemByValue)({
        esClient,
        listId,
        listItemIndex,
        type,
        value
      });
    });
    (0, _defineProperty2.default)(this, "deleteList", async ({
      id
    }) => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      const listItemIndex = this.getListItemIndex();
      return (0, _.deleteList)({
        esClient,
        id,
        listIndex,
        listItemIndex
      });
    });
    (0, _defineProperty2.default)(this, "exportListItemsToStream", ({
      stringToAppend,
      listId,
      stream
    }) => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      (0, _items.exportListItemsToStream)({
        esClient,
        listId,
        listItemIndex,
        stream,
        stringToAppend
      });
    });
    (0, _defineProperty2.default)(this, "importListItemsToStream", async ({
      deserializer,
      serializer,
      type,
      listId,
      stream,
      meta,
      version
    }) => {
      const {
        esClient,
        user,
        config
      } = this;
      const listItemIndex = this.getListItemIndex();
      const listIndex = this.getListIndex();
      return (0, _items.importListItemsToStream)({
        config,
        deserializer,
        esClient,
        listId,
        listIndex,
        listItemIndex,
        meta,
        serializer,
        stream,
        type,
        user,
        version
      });
    });
    (0, _defineProperty2.default)(this, "getListItemByValue", async ({
      listId,
      value,
      type
    }) => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.getListItemByValue)({
        esClient,
        listId,
        listItemIndex,
        type,
        value
      });
    });
    (0, _defineProperty2.default)(this, "createListItem", async ({
      id,
      deserializer,
      serializer,
      listId,
      value,
      type,
      meta
    }) => {
      const {
        esClient,
        user
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.createListItem)({
        deserializer,
        esClient,
        id,
        listId,
        listItemIndex,
        meta,
        serializer,
        type,
        user,
        value
      });
    });
    (0, _defineProperty2.default)(this, "updateListItem", async ({
      _version,
      id,
      value,
      meta
    }) => {
      const {
        esClient,
        user
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.updateListItem)({
        _version,
        esClient,
        id,
        listItemIndex,
        meta,
        user,
        value
      });
    });
    (0, _defineProperty2.default)(this, "updateList", async ({
      _version,
      id,
      name,
      description,
      meta,
      version
    }) => {
      const {
        esClient,
        user
      } = this;
      const listIndex = this.getListIndex();
      return (0, _.updateList)({
        _version,
        description,
        esClient,
        id,
        listIndex,
        meta,
        name,
        user,
        version
      });
    });
    (0, _defineProperty2.default)(this, "getListItem", async ({
      id
    }) => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.getListItem)({
        esClient,
        id,
        listItemIndex
      });
    });
    (0, _defineProperty2.default)(this, "getListItemByValues", async ({
      type,
      listId,
      value
    }) => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.getListItemByValues)({
        esClient,
        listId,
        listItemIndex,
        type,
        value
      });
    });
    (0, _defineProperty2.default)(this, "searchListItemByValues", async ({
      type,
      listId,
      value
    }) => {
      const {
        esClient
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.searchListItemByValues)({
        esClient,
        listId,
        listItemIndex,
        type,
        value
      });
    });
    (0, _defineProperty2.default)(this, "findList", async ({
      filter,
      currentIndexPosition,
      perPage,
      page,
      sortField,
      sortOrder,
      searchAfter,
      runtimeMappings
    }) => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      return (0, _.findList)({
        currentIndexPosition,
        esClient,
        filter,
        listIndex,
        page,
        perPage,
        runtimeMappings,
        searchAfter,
        sortField,
        sortOrder
      });
    });
    (0, _defineProperty2.default)(this, "findListItem", async ({
      listId,
      filter,
      currentIndexPosition,
      perPage,
      page,
      runtimeMappings,
      sortField,
      sortOrder,
      searchAfter
    }) => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      const listItemIndex = this.getListItemIndex();
      return (0, _items.findListItem)({
        currentIndexPosition,
        esClient,
        filter,
        listId,
        listIndex,
        listItemIndex,
        page,
        perPage,
        runtimeMappings,
        searchAfter,
        sortField,
        sortOrder
      });
    });
    (0, _defineProperty2.default)(this, "findAllListItems", async ({
      listId,
      filter,
      sortField,
      sortOrder
    }) => {
      const {
        esClient
      } = this;
      const listIndex = this.getListIndex();
      const listItemIndex = this.getListItemIndex();
      return (0, _items.findAllListItems)({
        esClient,
        filter,
        listId,
        listIndex,
        listItemIndex,
        sortField,
        sortOrder
      });
    });
    this.spaceId = _spaceId;
    this.user = _user;
    this.config = _config;
    this.esClient = _esClient;
  }

  /**
   * Returns the list index name
   * @returns The list index name
   */
}
exports.ListClient = ListClient;