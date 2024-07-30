"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataView = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _fieldTypes = require("@kbn/field-types");
var _common = require("../../../kibana_utils/common");
var _lodash = require("lodash");
var _fields = require("../fields");
var _flatten_hit = require("./flatten_hit");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Data view class. Central kibana abstraction around multiple indices.
 */
class DataView {
  /**
   * Saved object id
   */

  /**
   * Title of data view
   * @deprecated use getIndexPattern instead
   */

  /**
   * Map of field formats by field name
   */

  /**
   * Only used by rollup indices, used by rollup specific endpoint to load field list.
   */

  /**
   * Field list, in extended array format
   */

  /**
   * Timestamp field name
   */

  /**
   * Type is used to identify rollup index patterns.
   */

  /**
   * @deprecated Use `flattenHit` utility method exported from data plugin instead.
   */

  /**
   * List of meta fields by name
   */

  /**
   * SavedObject version
   */

  /**
   * Array of filters - hides fields in discover
   */

  /**
   * Array of namespace ids
   */

  /**
   * Original saved object body. Used to check for saved object changes.
   */

  /**
   * Returns true if short dot notation is enabled
   */

  /**
   * FieldFormats service interface
   */

  /**
   * Map of field attributes by field name. Currently count and customLabel.
   */

  /**
   * Map of runtime field definitions by field name
   */

  /**
   * Prevents errors when index pattern exists before indices
   */

  /**
   * Name of the data view. Human readable name used to differentiate data view.
   */

  /*
   * list of indices that the index pattern matched
   */

  /**
   * constructor
   * @param config - config data and dependencies
   */

  constructor(config) {
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "title", '');
    (0, _defineProperty2.default)(this, "fieldFormatMap", void 0);
    (0, _defineProperty2.default)(this, "typeMeta", void 0);
    (0, _defineProperty2.default)(this, "fields", void 0);
    (0, _defineProperty2.default)(this, "timeFieldName", void 0);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "flattenHit", void 0);
    (0, _defineProperty2.default)(this, "metaFields", void 0);
    (0, _defineProperty2.default)(this, "version", void 0);
    (0, _defineProperty2.default)(this, "sourceFilters", void 0);
    (0, _defineProperty2.default)(this, "namespaces", void 0);
    (0, _defineProperty2.default)(this, "originalSavedObjectBody", {});
    (0, _defineProperty2.default)(this, "shortDotsEnable", false);
    (0, _defineProperty2.default)(this, "fieldFormats", void 0);
    (0, _defineProperty2.default)(this, "fieldAttrs", void 0);
    (0, _defineProperty2.default)(this, "runtimeFieldMap", void 0);
    (0, _defineProperty2.default)(this, "allowNoIndex", false);
    (0, _defineProperty2.default)(this, "name", '');
    (0, _defineProperty2.default)(this, "matchedIndices", []);
    (0, _defineProperty2.default)(this, "getName", () => this.name ? this.name : this.title);
    (0, _defineProperty2.default)(this, "getIndexPattern", () => this.title);
    (0, _defineProperty2.default)(this, "setIndexPattern", indexPattern => {
      this.title = indexPattern;
    });
    (0, _defineProperty2.default)(this, "getOriginalSavedObjectBody", () => ({
      ...this.originalSavedObjectBody
    }));
    (0, _defineProperty2.default)(this, "resetOriginalSavedObjectBody", () => {
      this.originalSavedObjectBody = this.getAsSavedObjectBody();
    });
    (0, _defineProperty2.default)(this, "getFieldAttrs", () => {
      const newFieldAttrs = {
        ...this.fieldAttrs
      };
      this.fields.forEach(field => {
        const attrs = {};
        let hasAttr = false;
        if (field.customLabel) {
          attrs.customLabel = field.customLabel;
          hasAttr = true;
        }
        if (field.count) {
          attrs.count = field.count;
          hasAttr = true;
        }
        if (hasAttr) {
          newFieldAttrs[field.name] = attrs;
        } else {
          delete newFieldAttrs[field.name];
        }
      });
      return newFieldAttrs;
    });
    (0, _defineProperty2.default)(this, "setFieldFormat", (fieldName, format) => {
      this.fieldFormatMap[fieldName] = format;
    });
    (0, _defineProperty2.default)(this, "deleteFieldFormat", fieldName => {
      delete this.fieldFormatMap[fieldName];
    });
    const {
      spec = {},
      fieldFormats,
      shortDotsEnable = false,
      metaFields = []
    } = config;

    // set dependencies
    this.fieldFormats = {
      ...fieldFormats
    };
    // set config
    this.shortDotsEnable = shortDotsEnable;
    this.metaFields = metaFields;
    // initialize functionality
    this.fields = (0, _fields.fieldList)([], this.shortDotsEnable);
    this.flattenHit = (0, _flatten_hit.flattenHitWrapper)(this, metaFields);

    // set values
    this.id = spec.id;
    this.fieldFormatMap = {
      ...spec.fieldFormats
    };
    this.version = spec.version;
    this.title = spec.title || '';
    this.timeFieldName = spec.timeFieldName;
    this.sourceFilters = [...(spec.sourceFilters || [])];
    this.fields.replaceAll(Object.values(spec.fields || {}));
    this.type = spec.type;
    this.typeMeta = spec.typeMeta;
    this.fieldAttrs = (0, _lodash.cloneDeep)(spec.fieldAttrs) || {};
    this.allowNoIndex = spec.allowNoIndex || false;
    this.runtimeFieldMap = (0, _lodash.cloneDeep)(spec.runtimeFieldMap) || {};
    this.namespaces = spec.namespaces || [];
    this.name = spec.name || '';
  }

  /**
   * Get name of Data View
   */

  /**
   * Returns scripted fields
   */

  getComputedFields() {
    const scriptFields = {};
    if (!this.fields) {
      return {
        storedFields: ['*'],
        scriptFields,
        docvalueFields: [],
        runtimeFields: {}
      };
    }

    // Date value returned in "_source" could be in a number of formats
    // Use a docvalue for each date field to ensure standardized formats when working with date fields
    // dataView.flattenHit will override "_source" values when the same field is also defined in "fields"
    const docvalueFields = (0, _lodash.reject)(this.fields.getByType('date'), 'scripted').map(dateField => {
      return {
        field: dateField.name,
        format: dateField.esTypes && dateField.esTypes.indexOf('date_nanos') !== -1 ? 'strict_date_time' : 'date_time'
      };
    });
    (0, _lodash.each)(this.getScriptedFields(), function (field) {
      scriptFields[field.name] = {
        script: {
          source: field.script,
          lang: field.lang
        }
      };
    });
    const runtimeFields = this.getRuntimeMappings();
    return {
      storedFields: ['*'],
      scriptFields,
      docvalueFields,
      runtimeFields
    };
  }
  isPersisted() {
    return typeof this.version === 'string';
  }

  /**
   * Creates static representation of the data view.
   * @param includeFields Whether or not to include the `fields` list as part of this spec. If not included, the list
   * will be fetched from Elasticsearch when instantiating a new Data View with this spec.
   */
  toSpec(includeFields = true) {
    const fields = includeFields && this.fields ? this.fields.toSpec({
      getFormatterForField: this.getFormatterForField.bind(this)
    }) : undefined;
    const spec = {
      id: this.id,
      version: this.version,
      title: this.getIndexPattern(),
      timeFieldName: this.timeFieldName,
      sourceFilters: [...(this.sourceFilters || [])],
      fields,
      typeMeta: this.typeMeta,
      type: this.type,
      fieldFormats: {
        ...this.fieldFormatMap
      },
      runtimeFieldMap: (0, _lodash.cloneDeep)(this.runtimeFieldMap),
      fieldAttrs: (0, _lodash.cloneDeep)(this.fieldAttrs),
      allowNoIndex: this.allowNoIndex,
      name: this.name
    };

    // Filter undefined values from the spec
    return Object.fromEntries(Object.entries(spec).filter(([, v]) => typeof v !== 'undefined'));
  }

  /**
   * Get the source filtering configuration for that index.
   */
  getSourceFiltering() {
    return {
      excludes: this.sourceFilters && this.sourceFilters.map(filter => filter.value) || []
    };
  }

  /**
   * Removes scripted field from field list.
   * @param fieldName name of scripted field to remove
   * @deprecated use runtime field instead
   */

  removeScriptedField(fieldName) {
    const field = this.fields.getByName(fieldName);
    if (field) {
      this.fields.remove(field);
    }
  }

  /**
   *
   * @deprecated Will be removed when scripted fields are removed.
   */
  getNonScriptedFields() {
    return [...this.fields.getAll().filter(field => !field.scripted)];
  }

  /**
   *
   * @deprecated Use runtime field instead.
   */
  getScriptedFields() {
    return [...this.fields.getAll().filter(field => field.scripted)];
  }

  /**
   * returns true if dataview contains TSDB fields
   */
  isTSDBMode() {
    return this.fields.some(field => field.timeSeriesDimension || field.timeSeriesMetric);
  }

  /**
   * Does the data view have a timestamp field?
   */

  isTimeBased() {
    return !!this.timeFieldName && (!this.fields || !!this.getTimeField());
  }

  /**
   * Does the data view have a timestamp field and is it a date nanos field?
   */

  isTimeNanosBased() {
    const timeField = this.getTimeField();
    return !!(timeField && timeField.esTypes && timeField.esTypes.indexOf('date_nanos') !== -1);
  }

  /**
   * Get timestamp field as DataViewField or return undefined
   */
  getTimeField() {
    if (!this.timeFieldName || !this.fields || !this.fields.getByName) return undefined;
    return this.fields.getByName(this.timeFieldName);
  }

  /**
   * Get field by name.
   * @param name field name
   */

  getFieldByName(name) {
    if (!this.fields || !this.fields.getByName) return undefined;
    return this.fields.getByName(name);
  }

  /**
   * Get aggregation restrictions. Rollup fields can only perform a subset of aggregations.
   */

  getAggregationRestrictions() {
    var _this$typeMeta;
    return (_this$typeMeta = this.typeMeta) === null || _this$typeMeta === void 0 ? void 0 : _this$typeMeta.aggs;
  }

  /**
   * Returns index pattern as saved object body for saving
   */
  getAsSavedObjectBody() {
    var _this$fields$filter, _this$fields, _this$typeMeta2;
    const fieldAttrs = this.getFieldAttrs();
    const runtimeFieldMap = this.runtimeFieldMap;
    return {
      fieldAttrs: fieldAttrs ? JSON.stringify(fieldAttrs) : undefined,
      title: this.getIndexPattern(),
      timeFieldName: this.timeFieldName,
      sourceFilters: this.sourceFilters ? JSON.stringify(this.sourceFilters) : undefined,
      fields: JSON.stringify((_this$fields$filter = (_this$fields = this.fields) === null || _this$fields === void 0 ? void 0 : _this$fields.filter(field => field.scripted)) !== null && _this$fields$filter !== void 0 ? _this$fields$filter : []),
      fieldFormatMap: this.fieldFormatMap ? JSON.stringify(this.fieldFormatMap) : undefined,
      type: this.type,
      typeMeta: JSON.stringify((_this$typeMeta2 = this.typeMeta) !== null && _this$typeMeta2 !== void 0 ? _this$typeMeta2 : {}),
      allowNoIndex: this.allowNoIndex ? this.allowNoIndex : undefined,
      runtimeFieldMap: runtimeFieldMap ? JSON.stringify(runtimeFieldMap) : undefined,
      name: this.name
    };
  }

  /**
   * Provide a field, get its formatter
   * @param field field to get formatter for
   */
  getFormatterForField(field) {
    const fieldFormat = this.getFormatterForFieldNoDefault(field.name);
    if (fieldFormat) {
      return fieldFormat;
    }
    return this.fieldFormats.getDefaultInstance(field.type, field.esTypes);
  }

  /**
   * Add a runtime field - Appended to existing mapped field or a new field is
   * created as appropriate.
   * @param name Field name
   * @param runtimeField Runtime field definition
   */
  addRuntimeField(name, runtimeField) {
    if (name.includes('*')) {
      throw new _common.CharacterNotAllowedInField('*', name);
    }
    const {
      type,
      script,
      customLabel,
      format,
      popularity
    } = runtimeField;
    if (type === 'composite') {
      return this.addCompositeRuntimeField(name, runtimeField);
    }
    this.runtimeFieldMap[name] = (0, _utils.removeFieldAttrs)(runtimeField);
    const field = this.updateOrAddRuntimeField(name, type, {
      type,
      script
    }, {
      customLabel,
      format,
      popularity
    });
    return [field];
  }

  /**
   * Checks if runtime field exists
   * @param name field name
   */
  hasRuntimeField(name) {
    return !!this.runtimeFieldMap[name];
  }

  /**
   * Returns runtime field if exists
   * @param name Runtime field name
   */
  getRuntimeField(name) {
    if (!this.runtimeFieldMap[name]) {
      return null;
    }
    const {
      type,
      script,
      fields
    } = {
      ...this.runtimeFieldMap[name]
    };
    const runtimeField = {
      type,
      script
    };
    if (type === 'composite') {
      runtimeField.fields = fields;
    }
    return runtimeField;
  }

  /**
   * Get all runtime field definitions.
   * NOTE: this does not strip out runtime fields that match mapped field names
   * @returns map of runtime field definitions by field name
   */

  getAllRuntimeFields() {
    return Object.keys(this.runtimeFieldMap).reduce((acc, fieldName) => ({
      ...acc,
      [fieldName]: this.getRuntimeField(fieldName)
    }), {});
  }

  /**
   * Returns data view fields backed by runtime fields.
   * @param name runtime field name
   * @returns map of DataViewFields (that are runtime fields) by field name
   */

  getFieldsByRuntimeFieldName(name) {
    const runtimeField = this.getRuntimeField(name);
    if (!runtimeField) {
      return;
    }
    if (runtimeField.type === 'composite') {
      return Object.entries(runtimeField.fields).reduce((acc, [subFieldName, subField]) => {
        const fieldFullName = `${name}.${subFieldName}`;
        const dataViewField = this.getFieldByName(fieldFullName);
        if (!dataViewField) {
          // We should never enter here as all composite runtime subfield
          // are converted to data view fields.
          return acc;
        }
        acc[subFieldName] = dataViewField;
        return acc;
      }, {});
    }
    const primitveRuntimeField = this.getFieldByName(name);
    return primitveRuntimeField && {
      [name]: primitveRuntimeField
    };
  }

  /**
   * Replaces all existing runtime fields with new fields.
   * @param newFields Map of runtime field definitions by field name
   */
  replaceAllRuntimeFields(newFields) {
    const oldRuntimeFieldNames = Object.keys(this.runtimeFieldMap);
    oldRuntimeFieldNames.forEach(name => {
      this.removeRuntimeField(name);
    });
    Object.entries(newFields).forEach(([name, field]) => {
      this.addRuntimeField(name, field);
    });
  }

  /**
   * Remove a runtime field - removed from mapped field or removed unmapped
   * field as appropriate. Doesn't clear associated field attributes.
   * @param name - Field name to remove
   */
  removeRuntimeField(name) {
    const existingField = this.getFieldByName(name);
    if (existingField && existingField.isMapped) {
      // mapped field, remove runtimeField def
      existingField.runtimeField = undefined;
    } else {
      Object.values(this.getFieldsByRuntimeFieldName(name) || {}).forEach(field => {
        this.fields.remove(field);
      });
    }
    delete this.runtimeFieldMap[name];
  }

  /**
   * Return the "runtime_mappings" section of the ES search query.
   */
  getRuntimeMappings() {
    const mappedFields = this.getMappedFieldNames();
    const records = Object.keys(this.runtimeFieldMap).reduce((acc, fieldName) => {
      // do not include fields that are mapped
      if (!mappedFields.includes(fieldName)) {
        acc[fieldName] = this.runtimeFieldMap[fieldName];
      }
      return acc;
    }, {});
    return records;
  }

  /**
   * Get formatter for a given field name. Return undefined if none exists.
   * @param fieldname name of field to get formatter for
   */
  getFormatterForFieldNoDefault(fieldname) {
    const formatSpec = this.fieldFormatMap[fieldname];
    if (formatSpec !== null && formatSpec !== void 0 && formatSpec.id) {
      return this.fieldFormats.getInstance(formatSpec.id, formatSpec.params);
    }
  }

  /**
   * Set field attribute
   * @param fieldName name of field to set attribute on
   * @param attrName name of attribute to set
   * @param value value of attribute
   */

  setFieldAttrs(fieldName, attrName, value) {
    if (!this.fieldAttrs[fieldName]) {
      this.fieldAttrs[fieldName] = {};
    }
    this.fieldAttrs[fieldName][attrName] = value;
  }

  /**
   * Set field custom label
   * @param fieldName name of field to set custom label on
   * @param customLabel custom label value. If undefined, custom label is removed
   */

  setFieldCustomLabel(fieldName, customLabel) {
    const fieldObject = this.fields.getByName(fieldName);
    const newCustomLabel = customLabel === null ? undefined : customLabel;
    if (fieldObject) {
      fieldObject.customLabel = newCustomLabel;
    }
    this.setFieldAttrs(fieldName, 'customLabel', newCustomLabel);
  }

  /**
   * Set field count
   * @param fieldName name of field to set count on
   * @param count count value. If undefined, count is removed
   */

  setFieldCount(fieldName, count) {
    const fieldObject = this.fields.getByName(fieldName);
    const newCount = count === null ? undefined : count;
    if (fieldObject) {
      if (!newCount) fieldObject.deleteCount();else fieldObject.count = newCount;
    }
    this.setFieldAttrs(fieldName, 'count', newCount);
  }

  /**
   * Set field formatter
   * @param fieldName name of field to set format on
   * @param format field format in serialized form
   */

  getMappedFieldNames() {
    return this.fields.getAll().reduce((acc, dataViewField) => {
      if (dataViewField.isMapped) {
        acc.push(dataViewField.name);
      }
      return acc;
    }, []);
  }

  /**
   * Add composite runtime field and all subfields.
   * @param name field name
   * @param runtimeField runtime field definition
   * @returns data view field instance
   */

  addCompositeRuntimeField(name, runtimeField) {
    const {
      fields
    } = runtimeField;

    // Make sure subFields are provided
    if (fields === undefined || Object.keys(fields).length === 0) {
      throw new Error(`Can't add composite runtime field [name = ${name}] without subfields.`);
    }

    // Make sure no field with the same name already exist
    if (this.getFieldByName(name) !== undefined) {
      throw new Error(`Can't create composite runtime field ["${name}"] as there is already a field with this name`);
    }

    // We first remove the runtime composite field with the same name which will remove all of its subFields.
    // This guarantees that we don't leave behind orphan data view fields
    this.removeRuntimeField(name);
    const runtimeFieldSpec = (0, _utils.removeFieldAttrs)(runtimeField);

    // We don't add composite runtime fields to the field list as
    // they are not fields but **holder** of fields.
    // What we do add to the field list are all their subFields.
    const dataViewFields = Object.entries(fields).map(([subFieldName, subField]) =>
    // Every child field gets the complete runtime field script for consumption by searchSource
    this.updateOrAddRuntimeField(`${name}.${subFieldName}`, subField.type, runtimeFieldSpec, {
      customLabel: subField.customLabel,
      format: subField.format,
      popularity: subField.popularity
    }));
    this.runtimeFieldMap[name] = (0, _utils.removeFieldAttrs)(runtimeField);
    return dataViewFields;
  }
  updateOrAddRuntimeField(fieldName, fieldType, runtimeFieldSpec, config) {
    var _createdField;
    if (fieldType === 'composite') {
      throw new Error(`Trying to add composite field as primmitive field, this shouldn't happen! [name = ${fieldName}]`);
    }

    // Create the field if it does not exist or update an existing one
    let createdField;
    const existingField = this.getFieldByName(fieldName);
    if (existingField) {
      existingField.runtimeField = runtimeFieldSpec;
    } else {
      var _config$popularity;
      createdField = this.fields.add({
        name: fieldName,
        runtimeField: runtimeFieldSpec,
        type: (0, _fieldTypes.castEsToKbnFieldTypeName)(fieldType),
        esTypes: [fieldType],
        aggregatable: true,
        searchable: true,
        count: (_config$popularity = config.popularity) !== null && _config$popularity !== void 0 ? _config$popularity : 0,
        readFromDocValues: false
      });
    }

    // Apply configuration to the field
    if (config.customLabel || config.customLabel === null) {
      this.setFieldCustomLabel(fieldName, config.customLabel);
    }
    if (config.popularity || config.popularity === null) {
      this.setFieldCount(fieldName, config.popularity);
    }
    if (config.format) {
      this.setFieldFormat(fieldName, config.format);
    } else if (config.format === null) {
      this.deleteFieldFormat(fieldName);
    }
    return (_createdField = createdField) !== null && _createdField !== void 0 ? _createdField : existingField;
  }
}
exports.DataView = DataView;