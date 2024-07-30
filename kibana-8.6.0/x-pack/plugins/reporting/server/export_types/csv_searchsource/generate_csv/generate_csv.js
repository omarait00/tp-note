"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CsvGenerator = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _elasticsearch = require("@elastic/elasticsearch");
var _common = require("../../../../../../../src/plugins/data/common");
var _rxjs = require("rxjs");
var _constants = require("../../../../common/constants");
var _errors = require("../../../../common/errors");
var _schema_utils = require("../../../../common/schema_utils");
var _get_export_settings = require("./get_export_settings");
var _i18n_texts = require("./i18n_texts");
var _max_size_string_builder = require("./max_size_string_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class CsvGenerator {
  constructor(job, config, clients, dependencies, cancellationToken, logger, stream) {
    (0, _defineProperty2.default)(this, "csvContainsFormulas", false);
    (0, _defineProperty2.default)(this, "maxSizeReached", false);
    (0, _defineProperty2.default)(this, "csvRowCount", 0);
    this.job = job;
    this.config = config;
    this.clients = clients;
    this.dependencies = dependencies;
    this.cancellationToken = cancellationToken;
    this.logger = logger;
    this.stream = stream;
  }
  async openPointInTime(indexPatternTitle, settings) {
    const {
      duration
    } = settings.scroll;
    let pitId;
    this.logger.debug(`Requesting point-in-time for: [${indexPatternTitle}]...`);
    try {
      // NOTE: if ES is overloaded, this request could time out
      const response = await this.clients.es.asCurrentUser.openPointInTime({
        index: indexPatternTitle,
        keep_alive: duration,
        ignore_unavailable: true
      }, {
        requestTimeout: duration,
        maxRetries: 0
      });
      pitId = response.id;
    } catch (err) {
      this.logger.error(err);
    }
    if (!pitId) {
      throw new Error(`Could not receive a point-in-time ID!`);
    }
    this.logger.debug(`Opened PIT ID: ${this.truncatePitId(pitId)}`);
    return pitId;
  }
  async doSearch(searchSource, settings, searchAfter) {
    var _searchSource$getFiel;
    const {
      scroll: scrollSettings,
      includeFrozen
    } = settings;
    searchSource.setField('size', scrollSettings.size);
    if (searchAfter) {
      searchSource.setField('searchAfter', searchAfter);
    }
    const pitId = (_searchSource$getFiel = searchSource.getField('pit')) === null || _searchSource$getFiel === void 0 ? void 0 : _searchSource$getFiel.id;
    this.logger.debug(`Executing search request with PIT ID: [${this.truncatePitId(pitId)}]` + (searchAfter ? ` search_after: [${searchAfter}]` : ''));
    const searchBody = searchSource.getSearchRequestBody();
    if (searchBody == null) {
      throw new Error('Could not retrieve the search body!');
    }
    const searchParams = {
      params: {
        body: searchBody,
        ignore_throttled: includeFrozen ? false : undefined // "true" will cause deprecation warnings logged in ES
      }
    };

    let results;
    try {
      results = (await (0, _rxjs.lastValueFrom)(this.clients.data.search(searchParams, {
        strategy: _common.ES_SEARCH_STRATEGY,
        transport: {
          maxRetries: 0,
          // retrying reporting jobs is handled in the task manager scheduling logic
          requestTimeout: scrollSettings.duration
        }
      }))).rawResponse;
    } catch (err) {
      this.logger.error(`CSV export search error: ${err}`);
      throw err;
    }
    return results;
  }

  /*
   * Load field formats for each field in the list
   */
  getFormatters(table) {
    // initialize field formats
    const formatters = {};
    table.columns.forEach(c => {
      const fieldFormat = this.dependencies.fieldFormatsRegistry.deserialize(c.meta.params);
      formatters[c.id] = fieldFormat;
    });
    return formatters;
  }
  escapeValues(settings) {
    return value => {
      if (settings.checkForFormulas && (0, _common.cellHasFormulas)(value)) {
        this.csvContainsFormulas = true; // set warning if cell value has a formula
      }

      return settings.escapeValue(value);
    };
  }
  getColumnsFromTabify(table) {
    const columnIds = table.columns.map(c => c.id);
    columnIds.sort();
    return columnIds;
  }
  formatCellValues(formatters) {
    return ({
      column: tableColumn,
      data: dataTableCell
    }) => {
      let cell;
      // check truthiness to guard against _score, _type, etc
      if (tableColumn && dataTableCell) {
        try {
          cell = formatters[tableColumn].convert(dataTableCell);
        } catch (err) {
          this.logger.error(err);
          cell = '-';
        }
        const isIdField = tableColumn === '_id'; // _id field can not be formatted or mutated
        if (!isIdField) {
          try {
            // unwrap the value
            // expected values are a string of JSON where the value(s) is in an array
            // examples: "[""Jan 1, 2020 @ 04:00:00.000""]","[""username""]"
            cell = JSON.parse(cell);
          } catch (e) {
            // ignore
          }
        }

        // We have to strip singular array values out of their array wrapper,
        // So that the value appears the visually the same as seen in Discover
        if (Array.isArray(cell)) {
          cell = cell.map(c => typeof c === 'object' ? JSON.stringify(c) : c).join(', ');
        }

        // Check for object-type value (geoip)
        if (typeof cell === 'object') {
          cell = JSON.stringify(cell);
        }
        return cell;
      }
      return '-'; // Unknown field: it existed in searchSource but has no value in the result
    };
  }

  /*
   * Use the list of columns to generate the header row
   */
  generateHeader(columns, builder, settings) {
    this.logger.debug(`Building CSV header row`);
    const header = Array.from(columns).map(this.escapeValues(settings)).join(settings.separator) + '\n';
    if (!builder.tryAppend(header)) {
      return {
        content: '',
        maxSizeReached: true,
        warnings: []
      };
    }
  }

  /*
   * Format a Datatable into rows of CSV content
   */
  async generateRows(columns, table, builder, formatters, settings) {
    this.logger.debug(`Building ${table.rows.length} CSV data rows`);
    for (const dataTableRow of table.rows) {
      if (this.cancellationToken.isCancelled()) {
        break;
      }

      /*
       * Intrinsically, generating the rows is a synchronous process. Awaiting
       * on a setImmediate call here partititions what could be a very long and
       * CPU-intenstive synchronous process into an asychronous process. This
       * give NodeJS to process other asychronous events that wait on the Event
       * Loop.
       *
       * See: https://nodejs.org/en/docs/guides/dont-block-the-event-loop/
       *
       * It's likely this creates a lot of context switching, and adds to the
       * time it would take to generate the CSV. There are alternatives to the
       * chosen performance solution:
       *
       * 1. Partition the synchronous process with fewer partitions, by using
       * the loop counter to call setImmediate only every N amount of rows.
       * Testing is required to see what the best N value for most data will
       * be.
       *
       * 2. Use a C++ add-on to generate the CSV using the Node Worker Pool
       * instead of using the Event Loop
       */
      await new Promise(setImmediate);
      const rowDefinition = [];
      const format = this.formatCellValues(formatters);
      const escape = this.escapeValues(settings);
      for (const column of columns) {
        rowDefinition.push(escape(format({
          column,
          data: dataTableRow[column]
        })));
      }
      if (!builder.tryAppend(rowDefinition.join(settings.separator) + '\n')) {
        this.logger.warn(`Max Size Reached after ${this.csvRowCount} rows.`);
        this.maxSizeReached = true;
        if (this.cancellationToken) {
          this.cancellationToken.cancel();
        }
        break;
      }
      this.csvRowCount++;
    }
  }
  async generateData() {
    var _this$job$columns, _reportingError;
    const [settings, searchSource] = await Promise.all([(0, _get_export_settings.getExportSettings)(this.clients.uiSettings, this.config, this.job.browserTimezone, this.logger), this.dependencies.searchSourceStart.create(this.job.searchSource)]);
    let reportingError;
    const index = searchSource.getField('index');
    if (!index) {
      throw new Error(`The search must have a reference to an index pattern!`);
    }
    const {
      maxSizeBytes,
      bom,
      escapeFormulaValues,
      timezone
    } = settings;
    const indexPatternTitle = index.getIndexPattern();
    const builder = new _max_size_string_builder.MaxSizeStringBuilder(this.stream, (0, _schema_utils.byteSizeValueToNumber)(maxSizeBytes), bom);
    const warnings = [];
    let first = true;
    let currentRecord = -1;
    let totalRecords;
    let totalRelation = 'eq';
    let searchAfter;
    let pitId = await this.openPointInTime(indexPatternTitle, settings);

    // apply timezone from the job to all date field formatters
    try {
      index.fields.getByType('date').forEach(({
        name
      }) => {
        var _index$fieldFormatMap, _index$fieldFormatMap2;
        this.logger.debug(`Setting timezone on ${name}`);
        const format = {
          ...index.fieldFormatMap[name],
          id: ((_index$fieldFormatMap = index.fieldFormatMap[name]) === null || _index$fieldFormatMap === void 0 ? void 0 : _index$fieldFormatMap.id) || 'date',
          // allow id: date_nanos
          params: {
            ...((_index$fieldFormatMap2 = index.fieldFormatMap[name]) === null || _index$fieldFormatMap2 === void 0 ? void 0 : _index$fieldFormatMap2.params),
            timezone
          }
        };
        index.setFieldFormat(name, format);
      });
    } catch (err) {
      this.logger.error(err);
    }
    const columns = new Set((_this$job$columns = this.job.columns) !== null && _this$job$columns !== void 0 ? _this$job$columns : []);
    try {
      do {
        var _results$pit_id, _hits$hits, _this$job$columns2;
        if (this.cancellationToken.isCancelled()) {
          break;
        }
        // set the latest pit, which could be different from the last request
        searchSource.setField('pit', {
          id: pitId,
          keep_alive: settings.scroll.duration
        });
        const results = await this.doSearch(searchSource, settings, searchAfter);
        const {
          hits
        } = results;
        if (first && hits.total != null) {
          if (typeof hits.total === 'number') {
            totalRecords = hits.total;
          } else {
            var _hits$total, _hits$total$relation, _hits$total2;
            totalRecords = (_hits$total = hits.total) === null || _hits$total === void 0 ? void 0 : _hits$total.value;
            totalRelation = (_hits$total$relation = (_hits$total2 = hits.total) === null || _hits$total2 === void 0 ? void 0 : _hits$total2.relation) !== null && _hits$total$relation !== void 0 ? _hits$total$relation : 'unknown';
          }
          this.logger.info(`Total hits ${totalRelation} ${totalRecords}.`);
        }
        if (!results) {
          this.logger.warn(`Search results are undefined!`);
          break;
        }
        const {
          hits: {
            hits: _hits,
            ...hitsMeta
          },
          ...headerWithPit
        } = results;
        const {
          pit_id: newPitId,
          ...header
        } = headerWithPit;
        const logInfo = {
          header: {
            pit_id: `${this.truncatePitId(newPitId)}`,
            ...header
          },
          hitsMeta
        };
        this.logger.debug(`Results metadata: ${JSON.stringify(logInfo)}`);

        // use the most recently received id for the next search request
        this.logger.debug(`Received PIT ID: [${this.truncatePitId(results.pit_id)}]`);
        pitId = (_results$pit_id = results.pit_id) !== null && _results$pit_id !== void 0 ? _results$pit_id : pitId;

        // Update last sort results for next query. PIT is used, so the sort results
        // automatically include _shard_doc as a tiebreaker
        searchAfter = (_hits$hits = hits.hits[hits.hits.length - 1]) === null || _hits$hits === void 0 ? void 0 : _hits$hits.sort;
        this.logger.debug(`Received search_after: [${searchAfter}]`);

        // check for shard failures, log them and add a warning if found
        const {
          _shards: shards
        } = header;
        if (shards.failures) {
          shards.failures.forEach(({
            reason
          }) => {
            warnings.push(`Shard failure: ${JSON.stringify(reason)}`);
            this.logger.warn(JSON.stringify(reason));
          });
        }
        let table;
        try {
          table = (0, _common.tabifyDocs)(results, index, {
            shallow: true,
            includeIgnoredValues: true
          });
        } catch (err) {
          var _err$message;
          this.logger.error(err);
          warnings.push(_i18n_texts.i18nTexts.unknownError((_err$message = err === null || err === void 0 ? void 0 : err.message) !== null && _err$message !== void 0 ? _err$message : err));
        }
        if (!table) {
          break;
        }
        if (!((_this$job$columns2 = this.job.columns) !== null && _this$job$columns2 !== void 0 && _this$job$columns2.length)) {
          this.getColumnsFromTabify(table).forEach(column => columns.add(column));
        }
        if (first) {
          first = false;
          this.generateHeader(columns, builder, settings);
        }
        if (table.rows.length < 1) {
          break; // empty report with just the header
        }

        // FIXME: make tabifyDocs handle the formatting, to get the same formatting logic as Discover?
        const formatters = this.getFormatters(table);
        await this.generateRows(columns, table, builder, formatters, settings);

        // update iterator
        currentRecord += table.rows.length;
      } while (totalRecords != null && currentRecord < totalRecords - 1);

      // Add warnings to be logged
      if (this.csvContainsFormulas && escapeFormulaValues) {
        warnings.push(_i18n_texts.i18nTexts.escapedFormulaValuesMessage);
      }
    } catch (err) {
      this.logger.error(err);
      if (err instanceof _elasticsearch.errors.ResponseError) {
        var _err$statusCode;
        if ([401, 403].includes((_err$statusCode = err.statusCode) !== null && _err$statusCode !== void 0 ? _err$statusCode : 0)) {
          reportingError = new _errors.AuthenticationExpiredError();
          warnings.push(_i18n_texts.i18nTexts.authenticationError.partialResultsMessage);
        } else {
          var _err$statusCode2;
          warnings.push(_i18n_texts.i18nTexts.esErrorMessage((_err$statusCode2 = err.statusCode) !== null && _err$statusCode2 !== void 0 ? _err$statusCode2 : 0, String(err.body)));
        }
      } else {
        var _err$message2;
        warnings.push(_i18n_texts.i18nTexts.unknownError((_err$message2 = err === null || err === void 0 ? void 0 : err.message) !== null && _err$message2 !== void 0 ? _err$message2 : err));
      }
    } finally {
      //
      if (pitId) {
        this.logger.debug(`Closing point-in-time`);
        await this.clients.es.asCurrentUser.closePointInTime({
          body: {
            id: pitId
          }
        });
      } else {
        this.logger.warn(`No PIT ID to clear!`);
      }
    }
    this.logger.info(`Finished generating. Row count: ${this.csvRowCount}.`);
    if (!this.maxSizeReached && this.csvRowCount !== totalRecords) {
      var _totalRecords;
      this.logger.warn(`ES scroll returned fewer total hits than expected! ` + `Search result total hits: ${totalRecords}. Row count: ${this.csvRowCount}`);
      warnings.push(_i18n_texts.i18nTexts.csvRowCountError({
        expected: (_totalRecords = totalRecords) !== null && _totalRecords !== void 0 ? _totalRecords : NaN,
        received: this.csvRowCount
      }));
    }
    return {
      content_type: _constants.CONTENT_TYPE_CSV,
      csv_contains_formulas: this.csvContainsFormulas && !escapeFormulaValues,
      max_size_reached: this.maxSizeReached,
      metrics: {
        csv: {
          rows: this.csvRowCount
        }
      },
      warnings,
      error_code: (_reportingError = reportingError) === null || _reportingError === void 0 ? void 0 : _reportingError.code
    };
  }
  truncatePitId(pitId) {
    return (pitId === null || pitId === void 0 ? void 0 : pitId.substring(0, 12)) + '...';
  }
}
exports.CsvGenerator = CsvGenerator;