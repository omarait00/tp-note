"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataViewsService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _i18n = require("@kbn/i18n");
var _fieldTypes = require("@kbn/field-types");
var _common = require("../../../field_formats/common");
var _common2 = require("../../../kibana_utils/common");
var _uuid = _interopRequireDefault(require("uuid"));
var _ = require("..");
var _2 = require(".");
var _data_view = require("./data_view");
var _lib = require("../lib");
var _utils = require("../utils");
var _errors = require("../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const MAX_ATTEMPTS_TO_RESOLVE_CONFLICTS = 3;

/*
 * Attributes of the data view saved object
 * @public
 */

/**
 * Data views service, providing CRUD operations for data views.
 * @public
 */
class DataViewsService {
  /**
   * Handler for service notifications
   * @param toastInputFields notification content in toast format
   * @param key used to indicate uniqueness of the notification
   */

  /*
   * Handler for service errors
   * @param error notification content in toast format
   * @param key used to indicate uniqueness of the error
   */

  /**
   * Can the user save advanced settings?
   */

  /**
   * Can the user save data views?
   */

  /**
   * DataViewsService constructor
   * @param deps Service dependencies
   */
  constructor(deps) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsCache", void 0);
    (0, _defineProperty2.default)(this, "apiClient", void 0);
    (0, _defineProperty2.default)(this, "fieldFormats", void 0);
    (0, _defineProperty2.default)(this, "onNotification", void 0);
    (0, _defineProperty2.default)(this, "onError", void 0);
    (0, _defineProperty2.default)(this, "dataViewCache", void 0);
    (0, _defineProperty2.default)(this, "getCanSaveAdvancedSettings", void 0);
    (0, _defineProperty2.default)(this, "getCanSave", void 0);
    (0, _defineProperty2.default)(this, "getIds", async (refresh = false) => {
      if (!this.savedObjectsCache || refresh) {
        await this.refreshSavedObjectsCache();
      }
      if (!this.savedObjectsCache) {
        return [];
      }
      return this.savedObjectsCache.map(obj => obj === null || obj === void 0 ? void 0 : obj.id);
    });
    (0, _defineProperty2.default)(this, "getTitles", async (refresh = false) => {
      if (!this.savedObjectsCache || refresh) {
        await this.refreshSavedObjectsCache();
      }
      if (!this.savedObjectsCache) {
        return [];
      }
      return this.savedObjectsCache.map(obj => {
        var _obj$attributes;
        return obj === null || obj === void 0 ? void 0 : (_obj$attributes = obj.attributes) === null || _obj$attributes === void 0 ? void 0 : _obj$attributes.title;
      });
    });
    (0, _defineProperty2.default)(this, "find", async (search, size = 10) => {
      const savedObjects = await this.savedObjectsClient.find({
        type: _.DATA_VIEW_SAVED_OBJECT_TYPE,
        fields: ['title'],
        search,
        searchFields: ['title'],
        perPage: size
      });
      const getIndexPatternPromises = savedObjects.map(async savedObject => {
        return await this.get(savedObject.id);
      });
      return await Promise.all(getIndexPatternPromises);
    });
    (0, _defineProperty2.default)(this, "getIdsWithTitle", async (refresh = false) => {
      if (!this.savedObjectsCache || refresh) {
        await this.refreshSavedObjectsCache();
      }
      if (!this.savedObjectsCache) {
        return [];
      }
      return this.savedObjectsCache.map(obj => {
        var _obj$attributes2, _obj$attributes3, _obj$attributes4, _obj$attributes5, _obj$attributes6;
        return {
          id: obj === null || obj === void 0 ? void 0 : obj.id,
          namespaces: obj === null || obj === void 0 ? void 0 : obj.namespaces,
          title: obj === null || obj === void 0 ? void 0 : (_obj$attributes2 = obj.attributes) === null || _obj$attributes2 === void 0 ? void 0 : _obj$attributes2.title,
          type: obj === null || obj === void 0 ? void 0 : (_obj$attributes3 = obj.attributes) === null || _obj$attributes3 === void 0 ? void 0 : _obj$attributes3.type,
          typeMeta: (obj === null || obj === void 0 ? void 0 : (_obj$attributes4 = obj.attributes) === null || _obj$attributes4 === void 0 ? void 0 : _obj$attributes4.typeMeta) && JSON.parse(obj === null || obj === void 0 ? void 0 : (_obj$attributes5 = obj.attributes) === null || _obj$attributes5 === void 0 ? void 0 : _obj$attributes5.typeMeta),
          name: obj === null || obj === void 0 ? void 0 : (_obj$attributes6 = obj.attributes) === null || _obj$attributes6 === void 0 ? void 0 : _obj$attributes6.name
        };
      });
    });
    (0, _defineProperty2.default)(this, "clearCache", () => {
      this.savedObjectsCache = null;
    });
    (0, _defineProperty2.default)(this, "clearInstanceCache", id => {
      if (id) {
        this.dataViewCache.clear(id);
      } else {
        this.dataViewCache.clearAll();
      }
    });
    (0, _defineProperty2.default)(this, "getCache", async () => {
      if (!this.savedObjectsCache) {
        await this.refreshSavedObjectsCache();
      }
      return this.savedObjectsCache;
    });
    (0, _defineProperty2.default)(this, "getDefault", async (displayErrors = true) => {
      const defaultIndexPatternId = await this.getDefaultId();
      if (defaultIndexPatternId) {
        return await this.get(defaultIndexPatternId, displayErrors);
      }
      return null;
    });
    (0, _defineProperty2.default)(this, "getDefaultId", async () => {
      const defaultIndexPatternId = await this.config.get('defaultIndex');
      return defaultIndexPatternId !== null && defaultIndexPatternId !== void 0 ? defaultIndexPatternId : null;
    });
    (0, _defineProperty2.default)(this, "setDefault", async (id, force = false) => {
      if (force || !(await this.config.get('defaultIndex'))) {
        await this.config.set('defaultIndex', id);
      }
    });
    (0, _defineProperty2.default)(this, "getFieldsForWildcard", async options => {
      const metaFields = await this.config.get(_.META_FIELDS);
      const {
        fields
      } = await this.apiClient.getFieldsForWildcard({
        pattern: options.pattern,
        metaFields,
        type: options.type,
        rollupIndex: options.rollupIndex,
        allowNoIndex: options.allowNoIndex,
        filter: options.filter
      });
      return fields;
    });
    (0, _defineProperty2.default)(this, "getFieldsForIndexPattern", async (indexPattern, options) => {
      var _indexPattern$typeMet, _indexPattern$typeMet2;
      return this.getFieldsForWildcard({
        type: indexPattern.type,
        rollupIndex: indexPattern === null || indexPattern === void 0 ? void 0 : (_indexPattern$typeMet = indexPattern.typeMeta) === null || _indexPattern$typeMet === void 0 ? void 0 : (_indexPattern$typeMet2 = _indexPattern$typeMet.params) === null || _indexPattern$typeMet2 === void 0 ? void 0 : _indexPattern$typeMet2.rollup_index,
        allowNoIndex: indexPattern.allowNoIndex,
        ...options,
        pattern: indexPattern.title
      });
    });
    (0, _defineProperty2.default)(this, "getFieldsAndIndicesForDataView", async dataView => {
      var _dataView$typeMeta, _dataView$typeMeta$pa;
      const metaFields = await this.config.get(_.META_FIELDS);
      return this.apiClient.getFieldsForWildcard({
        type: dataView.type,
        rollupIndex: dataView === null || dataView === void 0 ? void 0 : (_dataView$typeMeta = dataView.typeMeta) === null || _dataView$typeMeta === void 0 ? void 0 : (_dataView$typeMeta$pa = _dataView$typeMeta.params) === null || _dataView$typeMeta$pa === void 0 ? void 0 : _dataView$typeMeta$pa.rollup_index,
        allowNoIndex: dataView.allowNoIndex,
        pattern: dataView.getIndexPattern(),
        metaFields
      });
    });
    (0, _defineProperty2.default)(this, "getFieldsAndIndicesForWildcard", async options => {
      const metaFields = await this.config.get(_.META_FIELDS);
      return await this.apiClient.getFieldsForWildcard({
        pattern: options.pattern,
        metaFields,
        type: options.type,
        rollupIndex: options.rollupIndex,
        allowNoIndex: options.allowNoIndex,
        filter: options.filter
      });
    });
    (0, _defineProperty2.default)(this, "refreshFieldsFn", async indexPattern => {
      const {
        fields,
        indices
      } = await this.getFieldsAndIndicesForDataView(indexPattern);
      fields.forEach(field => field.isMapped = true);
      const scripted = indexPattern.getScriptedFields().map(field => field.spec);
      const fieldAttrs = indexPattern.getFieldAttrs();
      const fieldsWithSavedAttrs = Object.values(this.fieldArrayToMap([...fields, ...scripted], fieldAttrs));
      const runtimeFieldsMap = this.getRuntimeFields(indexPattern.getRuntimeMappings(), indexPattern.getFieldAttrs());
      const runtimeFieldsArray = Object.values(runtimeFieldsMap).filter(runtimeField => !fieldsWithSavedAttrs.find(mappedField => mappedField.name === runtimeField.name));
      indexPattern.fields.replaceAll([...runtimeFieldsArray, ...fieldsWithSavedAttrs]);
      indexPattern.matchedIndices = indices;
    });
    (0, _defineProperty2.default)(this, "refreshFields", async (dataView, displayErrors = true) => {
      if (!displayErrors) {
        return this.refreshFieldsFn(dataView);
      }
      try {
        await this.refreshFieldsFn(dataView);
      } catch (err) {
        if (err instanceof _lib.DataViewMissingIndices) {
          this.onNotification({
            title: err.message,
            color: 'danger',
            iconType: 'alert'
          }, `refreshFields:${dataView.getIndexPattern()}`);
        }
        this.onError(err, {
          title: _i18n.i18n.translate('dataViews.fetchFieldErrorTitle', {
            defaultMessage: 'Error fetching fields for data view {title} (ID: {id})',
            values: {
              id: dataView.id,
              title: dataView.getIndexPattern()
            }
          })
        }, dataView.getIndexPattern());
      }
    });
    (0, _defineProperty2.default)(this, "refreshFieldSpecMap", async (fields, id, title, options, fieldAttrs = {}) => {
      const fieldsAsArr = Object.values(fields);
      const scriptedFields = fieldsAsArr.filter(field => field.scripted);
      try {
        let updatedFieldList;
        const {
          fields: newFields,
          indices
        } = await this.getFieldsAndIndicesForWildcard(options);
        newFields.forEach(field => field.isMapped = true);

        // If allowNoIndex, only update field list if field caps finds fields. To support
        // beats creating index pattern and dashboard before docs
        if (!options.allowNoIndex || newFields && newFields.length > 5) {
          updatedFieldList = [...newFields, ...scriptedFields];
        } else {
          updatedFieldList = fieldsAsArr;
        }
        return {
          fields: this.fieldArrayToMap(updatedFieldList, fieldAttrs),
          indices
        };
      } catch (err) {
        if (err instanceof _lib.DataViewMissingIndices) {
          this.onNotification({
            title: err.message,
            color: 'danger',
            iconType: 'alert'
          }, `refreshFieldSpecMap:${title}`);
          return {};
        }
        this.onError(err, {
          title: _i18n.i18n.translate('dataViews.fetchFieldErrorTitle', {
            defaultMessage: 'Error fetching fields for data view {title} (ID: {id})',
            values: {
              id,
              title
            }
          })
        }, title);
        throw err;
      }
    });
    (0, _defineProperty2.default)(this, "fieldArrayToMap", (fields, fieldAttrs) => fields.reduce((collector, field) => {
      var _fieldAttrs$field$nam, _fieldAttrs$field$nam2;
      collector[field.name] = {
        ...field,
        customLabel: fieldAttrs === null || fieldAttrs === void 0 ? void 0 : (_fieldAttrs$field$nam = fieldAttrs[field.name]) === null || _fieldAttrs$field$nam === void 0 ? void 0 : _fieldAttrs$field$nam.customLabel,
        count: fieldAttrs === null || fieldAttrs === void 0 ? void 0 : (_fieldAttrs$field$nam2 = fieldAttrs[field.name]) === null || _fieldAttrs$field$nam2 === void 0 ? void 0 : _fieldAttrs$field$nam2.count
      };
      return collector;
    }, {}));
    (0, _defineProperty2.default)(this, "savedObjectToSpec", savedObject => {
      const {
        id,
        version,
        namespaces,
        attributes: {
          title,
          timeFieldName,
          fields,
          sourceFilters,
          fieldFormatMap,
          runtimeFieldMap,
          typeMeta,
          type,
          fieldAttrs,
          allowNoIndex,
          name
        }
      } = savedObject;
      const parsedSourceFilters = sourceFilters ? JSON.parse(sourceFilters) : undefined;
      const parsedTypeMeta = typeMeta ? JSON.parse(typeMeta) : undefined;
      const parsedFieldFormatMap = fieldFormatMap ? JSON.parse(fieldFormatMap) : {};
      const parsedFields = fields ? JSON.parse(fields) : [];
      const parsedFieldAttrs = fieldAttrs ? JSON.parse(fieldAttrs) : {};
      const parsedRuntimeFieldMap = runtimeFieldMap ? JSON.parse(runtimeFieldMap) : {};
      return {
        id,
        version,
        namespaces,
        title,
        timeFieldName,
        sourceFilters: parsedSourceFilters,
        fields: this.fieldArrayToMap(parsedFields, parsedFieldAttrs),
        typeMeta: parsedTypeMeta,
        type,
        fieldFormats: parsedFieldFormatMap,
        fieldAttrs: parsedFieldAttrs,
        allowNoIndex,
        runtimeFieldMap: parsedRuntimeFieldMap,
        name
      };
    });
    (0, _defineProperty2.default)(this, "getSavedObjectAndInit", async (id, displayErrors = true) => {
      const savedObject = await this.savedObjectsClient.get(_.DATA_VIEW_SAVED_OBJECT_TYPE, id);
      if (!savedObject.version) {
        throw new _common2.SavedObjectNotFound('data view', id, 'management/kibana/dataViews');
      }
      return this.initFromSavedObject(savedObject, displayErrors);
    });
    (0, _defineProperty2.default)(this, "initFromSavedObjectLoadFields", async ({
      savedObjectId,
      spec
    }) => {
      var _typeMeta$params;
      const {
        title,
        type,
        typeMeta,
        runtimeFieldMap
      } = spec;
      const {
        fields,
        indices
      } = await this.refreshFieldSpecMap(spec.fields || {}, savedObjectId, spec.title, {
        pattern: title,
        metaFields: await this.config.get(_.META_FIELDS),
        type,
        rollupIndex: typeMeta === null || typeMeta === void 0 ? void 0 : (_typeMeta$params = typeMeta.params) === null || _typeMeta$params === void 0 ? void 0 : _typeMeta$params.rollup_index,
        allowNoIndex: spec.allowNoIndex
      }, spec.fieldAttrs);
      const runtimeFieldSpecs = this.getRuntimeFields(runtimeFieldMap, spec.fieldAttrs);
      // mapped fields overwrite runtime fields
      return {
        fields: {
          ...runtimeFieldSpecs,
          ...fields
        },
        indices: indices || []
      };
    });
    (0, _defineProperty2.default)(this, "initFromSavedObject", async (savedObject, displayErrors = true) => {
      const spec = this.savedObjectToSpec(savedObject);
      spec.fieldAttrs = savedObject.attributes.fieldAttrs ? JSON.parse(savedObject.attributes.fieldAttrs) : {};
      let fields = {};
      let indices = [];
      if (!displayErrors) {
        const fieldsAndIndices = await this.initFromSavedObjectLoadFields({
          savedObjectId: savedObject.id,
          spec
        });
        fields = fieldsAndIndices.fields;
        indices = fieldsAndIndices.indices;
      } else {
        try {
          const fieldsAndIndices = await this.initFromSavedObjectLoadFields({
            savedObjectId: savedObject.id,
            spec
          });
          fields = fieldsAndIndices.fields;
          indices = fieldsAndIndices.indices;
        } catch (err) {
          if (err instanceof _lib.DataViewMissingIndices) {
            this.onNotification({
              title: err.message,
              color: 'danger',
              iconType: 'alert'
            }, `initFromSavedObject:${spec.title}`);
          } else {
            this.onError(err, {
              title: _i18n.i18n.translate('dataViews.fetchFieldErrorTitle', {
                defaultMessage: 'Error fetching fields for data view {title} (ID: {id})',
                values: {
                  id: savedObject.id,
                  title: spec.title
                }
              })
            }, spec.title || '');
          }
        }
      }
      spec.fields = fields;
      spec.fieldFormats = savedObject.attributes.fieldFormatMap ? JSON.parse(savedObject.attributes.fieldFormatMap) : {};
      const indexPattern = await this.createFromSpec(spec, true, displayErrors);
      indexPattern.matchedIndices = indices;
      indexPattern.resetOriginalSavedObjectBody();
      return indexPattern;
    });
    (0, _defineProperty2.default)(this, "getRuntimeFields", (runtimeFieldMap = {}, fieldAttrs = {}) => {
      const spec = {};
      const addRuntimeFieldToSpecFields = (name, fieldType, runtimeField, parentName) => {
        var _fieldAttrs$name, _fieldAttrs$name2;
        spec[name] = {
          name,
          type: (0, _fieldTypes.castEsToKbnFieldTypeName)(fieldType),
          esTypes: [fieldType],
          runtimeField,
          aggregatable: true,
          searchable: true,
          readFromDocValues: false,
          customLabel: fieldAttrs === null || fieldAttrs === void 0 ? void 0 : (_fieldAttrs$name = fieldAttrs[name]) === null || _fieldAttrs$name === void 0 ? void 0 : _fieldAttrs$name.customLabel,
          count: fieldAttrs === null || fieldAttrs === void 0 ? void 0 : (_fieldAttrs$name2 = fieldAttrs[name]) === null || _fieldAttrs$name2 === void 0 ? void 0 : _fieldAttrs$name2.count
        };
        if (parentName) {
          spec[name].parentName = parentName;
        }
      };

      // CREATE RUNTIME FIELDS
      for (const [name, runtimeField] of Object.entries(runtimeFieldMap || {})) {
        // For composite runtime field we add the subFields, **not** the composite
        if (runtimeField.type === 'composite') {
          Object.entries(runtimeField.fields).forEach(([subFieldName, subField]) => {
            addRuntimeFieldToSpecFields(`${name}.${subFieldName}`, subField.type, runtimeField, name);
          });
        } else {
          addRuntimeFieldToSpecFields(name, runtimeField.type, runtimeField);
        }
      }
      return spec;
    });
    (0, _defineProperty2.default)(this, "get", async (id, displayErrors = true) => {
      const indexPatternPromise = this.dataViewCache.get(id) || this.dataViewCache.set(id, this.getSavedObjectAndInit(id, displayErrors));

      // don't cache failed requests
      indexPatternPromise.catch(() => {
        this.dataViewCache.clear(id);
      });
      return indexPatternPromise;
    });
    const {
      uiSettings,
      savedObjectsClient,
      apiClient,
      fieldFormats,
      onNotification,
      onError,
      getCanSave = () => Promise.resolve(false),
      getCanSaveAdvancedSettings
    } = deps;
    this.apiClient = apiClient;
    this.config = uiSettings;
    this.savedObjectsClient = savedObjectsClient;
    this.fieldFormats = fieldFormats;
    this.onNotification = onNotification;
    this.onError = onError;
    this.getCanSave = getCanSave;
    this.getCanSaveAdvancedSettings = getCanSaveAdvancedSettings;
    this.dataViewCache = (0, _2.createDataViewCache)();
  }

  /**
   * Refresh cache of index pattern ids and titles.
   */
  async refreshSavedObjectsCache() {
    const so = await this.savedObjectsClient.find({
      type: _.DATA_VIEW_SAVED_OBJECT_TYPE,
      fields: ['title', 'type', 'typeMeta', 'name'],
      perPage: 10000
    });
    this.savedObjectsCache = so;
  }

  /**
   * Gets list of index pattern ids.
   * @param refresh Force refresh of index pattern list
   */

  /**
   * Checks if current user has a user created index pattern ignoring fleet's server default index patterns.
   */
  async hasUserDataView() {
    return this.apiClient.hasUserDataView();
  }

  /**
   * Get field list by providing { pattern }.
   * @param options options for getting field list
   * @returns FieldSpec[]
   */

  /**
   * Create a new data view instance.
   * @param spec data view spec
   * @param skipFetchFields if true, will not fetch fields
   * @param displayErrors - If set false, API consumer is responsible for displaying and handling errors.
   * @returns DataView
   */
  async createFromSpec({
    id,
    name,
    title,
    ...restOfSpec
  }, skipFetchFields = false, displayErrors = true) {
    const shortDotsEnable = await this.config.get(_common.FORMATS_UI_SETTINGS.SHORT_DOTS_ENABLE);
    const metaFields = await this.config.get(_.META_FIELDS);
    const spec = {
      id: id !== null && id !== void 0 ? id : _uuid.default.v4(),
      title,
      name: name || title,
      ...restOfSpec
    };
    const dataView = new _data_view.DataView({
      spec,
      fieldFormats: this.fieldFormats,
      shortDotsEnable,
      metaFields
    });
    if (!skipFetchFields) {
      await this.refreshFields(dataView, displayErrors);
    }
    return dataView;
  }

  /**
   * Create data view instance.
   * @param spec data view spec
   * @param skipFetchFields if true, will not fetch fields
   * @param displayErrors - If set false, API consumer is responsible for displaying and handling errors.
   * @returns DataView
   */
  async create(spec, skipFetchFields = false, displayErrors = true) {
    const doCreate = () => this.createFromSpec(spec, skipFetchFields, displayErrors);
    if (spec.id) {
      const cachedDataView = this.dataViewCache.get(spec.id);
      if (cachedDataView) {
        return cachedDataView;
      }
      return this.dataViewCache.set(spec.id, doCreate());
    }
    const dataView = await doCreate();
    return this.dataViewCache.set(dataView.id, Promise.resolve(dataView));
  }

  /**
   * Create a new data view and save it right away.
   * @param spec data view spec
   * @param override Overwrite if existing index pattern exists.
   * @param skipFetchFields Whether to skip field refresh step.
   * @param displayErrors - If set false, API consumer is responsible for displaying and handling errors.
   */

  async createAndSave(spec, override = false, skipFetchFields = false, displayErrors = true) {
    const indexPattern = await this.createFromSpec(spec, skipFetchFields, displayErrors);
    const createdIndexPattern = await this.createSavedObject(indexPattern, override, displayErrors);
    await this.setDefault(createdIndexPattern.id);
    return createdIndexPattern;
  }

  /**
   * Save a new data view.
   * @param dataView data view instance
   * @param override Overwrite if existing index pattern exists
   * @param displayErrors - If set false, API consumer is responsible for displaying and handling errors.
   */

  async createSavedObject(dataView, override = false, displayErrors = true) {
    if (!(await this.getCanSave())) {
      throw new _errors.DataViewInsufficientAccessError();
    }
    const dupe = await (0, _utils.findByName)(this.savedObjectsClient, dataView.getName());
    if (dupe) {
      if (override) {
        await this.delete(dupe.id);
      } else {
        throw new _errors.DuplicateDataViewError(`Duplicate data view: ${dataView.getName()}`);
      }
    }
    const body = dataView.getAsSavedObjectBody();
    const response = await this.savedObjectsClient.create(_.DATA_VIEW_SAVED_OBJECT_TYPE, body, {
      id: dataView.id
    });
    const createdIndexPattern = await this.initFromSavedObject(response, displayErrors);
    if (this.savedObjectsCache) {
      this.savedObjectsCache.push(response);
    }
    return createdIndexPattern;
  }

  /**
   * Save existing data view. Will attempt to merge differences if there are conflicts.
   * @param indexPattern
   * @param saveAttempts
   * @param ignoreErrors
   * @param displayErrors - If set false, API consumer is responsible for displaying and handling errors.
   */

  async updateSavedObject(indexPattern, saveAttempts = 0, ignoreErrors = false, displayErrors = true) {
    if (!indexPattern.id) return;
    if (!(await this.getCanSave())) {
      throw new _errors.DataViewInsufficientAccessError(indexPattern.id);
    }

    // get the list of attributes
    const body = indexPattern.getAsSavedObjectBody();
    const originalBody = indexPattern.getOriginalSavedObjectBody();

    // get changed keys
    const originalChangedKeys = [];
    Object.entries(body).forEach(([key, value]) => {
      const realKey = key;
      if (value !== originalBody[realKey]) {
        originalChangedKeys.push(key);
      }
    });
    return this.savedObjectsClient.update(_.DATA_VIEW_SAVED_OBJECT_TYPE, indexPattern.id, body, {
      version: indexPattern.version
    }).then(resp => {
      indexPattern.id = resp.id;
      indexPattern.version = resp.version;
      return indexPattern;
    }).catch(async err => {
      var _err$res;
      if ((err === null || err === void 0 ? void 0 : (_err$res = err.res) === null || _err$res === void 0 ? void 0 : _err$res.status) === 409 && saveAttempts++ < MAX_ATTEMPTS_TO_RESOLVE_CONFLICTS) {
        const samePattern = await this.get(indexPattern.id, displayErrors);
        // What keys changed from now and what the server returned
        const updatedBody = samePattern.getAsSavedObjectBody();

        // Build a list of changed keys from the server response
        // and ensure we ignore the key if the server response
        // is the same as the original response (since that is expected
        // if we made a change in that key)

        const serverChangedKeys = [];
        Object.entries(updatedBody).forEach(([key, value]) => {
          const realKey = key;
          if (value !== body[realKey] && value !== originalBody[realKey]) {
            serverChangedKeys.push(key);
          }
        });
        let unresolvedCollision = false;
        for (const originalKey of originalChangedKeys) {
          for (const serverKey of serverChangedKeys) {
            if (originalKey === serverKey) {
              unresolvedCollision = true;
              break;
            }
          }
        }
        if (unresolvedCollision) {
          if (ignoreErrors) {
            return;
          }
          const title = _i18n.i18n.translate('dataViews.unableWriteLabel', {
            defaultMessage: 'Unable to write data view! Refresh the page to get the most up to date changes for this data view.'
          });
          if (displayErrors) {
            this.onNotification({
              title,
              color: 'danger'
            }, `updateSavedObject:${indexPattern.getIndexPattern()}`);
          }
          throw err;
        }

        // Set the updated response on this object
        serverChangedKeys.forEach(key => {
          // FIXME: this overwrites read-only properties
          indexPattern[key] = samePattern[key];
        });
        indexPattern.version = samePattern.version;

        // Clear cache
        this.dataViewCache.clear(indexPattern.id);

        // Try the save again
        return this.updateSavedObject(indexPattern, saveAttempts, ignoreErrors, displayErrors);
      }
      throw err;
    });
  }

  /**
   * Deletes an index pattern from .kibana index.
   * @param indexPatternId: Id of kibana Index Pattern to delete
   */
  async delete(indexPatternId) {
    if (!(await this.getCanSave())) {
      throw new _errors.DataViewInsufficientAccessError(indexPatternId);
    }
    this.dataViewCache.clear(indexPatternId);
    return this.savedObjectsClient.delete(_.DATA_VIEW_SAVED_OBJECT_TYPE, indexPatternId);
  }

  /**
   * Returns the default data view as an object.
   * If no default is found, or it is missing
   * another data view is selected as default and returned.
   * If no possible data view found to become a default returns null.
   *
   * @returns default data view
   */
  async getDefaultDataView() {
    const patterns = await this.getIdsWithTitle();
    let defaultId = await this.config.get('defaultIndex');
    const exists = defaultId ? patterns.some(pattern => pattern.id === defaultId) : false;
    if (defaultId && !exists) {
      if (await this.getCanSaveAdvancedSettings()) {
        await this.config.remove('defaultIndex');
      }
      defaultId = undefined;
    }
    if (!defaultId && patterns.length >= 1 && (await this.hasUserDataView().catch(() => true))) {
      defaultId = patterns[0].id;
      if (await this.getCanSaveAdvancedSettings()) {
        await this.config.set('defaultIndex', defaultId);
      }
    }
    if (defaultId) {
      return this.get(defaultId);
    } else {
      return null;
    }
  }
}

/**
 * Data views service interface
 * @public
 */
exports.DataViewsService = DataViewsService;