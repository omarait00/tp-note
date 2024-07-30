"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateHistoryWindowStart = exports.transformBucketsToValues = exports.parseDateString = exports.getNewTermsRuntimeMappings = exports.getAggregationField = exports.decodeMatchedValues = exports.createFieldValuesMap = exports.AGG_FIELD_NAME = void 0;
var _datemath = _interopRequireDefault(require("@elastic/datemath"));
var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const AGG_FIELD_NAME = 'new_terms_values';
exports.AGG_FIELD_NAME = AGG_FIELD_NAME;
const DELIMITER = '_';
const parseDateString = ({
  date,
  forceNow,
  name
}) => {
  const parsedDate = _datemath.default.parse(date, {
    forceNow
  });
  if (parsedDate == null || !parsedDate.isValid()) {
    throw Error(`Failed to parse '${name !== null && name !== void 0 ? name : 'date string'}'`);
  }
  return parsedDate;
};
exports.parseDateString = parseDateString;
const validateHistoryWindowStart = ({
  historyWindowStart,
  from
}) => {
  const forceNow = (0, _moment.default)().toDate();
  const parsedHistoryWindowStart = parseDateString({
    date: historyWindowStart,
    forceNow,
    name: 'historyWindowStart'
  });
  const parsedFrom = parseDateString({
    date: from,
    forceNow,
    name: 'from'
  });
  if (parsedHistoryWindowStart.isSameOrAfter(parsedFrom)) {
    throw Error(`History window size is smaller than rule interval + additional lookback, 'historyWindowStart' must be earlier than 'from'`);
  }
};

/**
 * Takes a list of buckets and creates value from them to be used in 'include' clause of terms aggregation.
 * For a single new terms field, value equals to bucket name
 * For multiple new terms fields and buckets, value equals to concatenated base64 encoded bucket names
 * @returns for buckets('host-0', 'test'), resulted value equals to: 'aG9zdC0w_dGVzdA=='
 */
exports.validateHistoryWindowStart = validateHistoryWindowStart;
const transformBucketsToValues = (newTermsFields, buckets) => {
  // if new terms include only one field we don't use runtime mappings and don't stich fields buckets together
  if (newTermsFields.length === 1) {
    return buckets.map(bucket => Object.values(bucket.key)[0]).filter(value => value != null);
  }
  return buckets.map(bucket => Object.values(bucket.key)).filter(values => !values.some(value => value == null)).map(values => values.map(value => Buffer.from(typeof value !== 'string' ? value.toString() : value).toString('base64')).join(DELIMITER));
};

/**
 * transforms arrays of new terms fields and its values in object
 * [new_terms_field]: { [value1]: true, [value1]: true  }
 * It's needed to have constant time complexity of accessing whether value is present in new terms
 * It will be passed to Painless script used in runtime field
 */
exports.transformBucketsToValues = transformBucketsToValues;
const createFieldValuesMap = (newTermsFields, buckets) => {
  if (newTermsFields.length === 1) {
    return undefined;
  }
  const valuesMap = newTermsFields.reduce((acc, field) => ({
    ...acc,
    [field]: {}
  }), {});
  buckets.map(bucket => bucket.key).forEach(bucket => {
    Object.entries(bucket).forEach(([key, value]) => {
      if (value == null) {
        return;
      }
      const strValue = typeof value !== 'string' ? value.toString() : value;
      valuesMap[key][strValue] = true;
    });
  });
  return valuesMap;
};
exports.createFieldValuesMap = createFieldValuesMap;
const getNewTermsRuntimeMappings = (newTermsFields, buckets) => {
  // if new terms include only one field we don't use runtime mappings and don't stich fields buckets together
  if (newTermsFields.length <= 1) {
    return undefined;
  }
  const values = createFieldValuesMap(newTermsFields, buckets);
  return {
    [AGG_FIELD_NAME]: {
      type: 'keyword',
      script: {
        params: {
          fields: newTermsFields,
          values
        },
        source: `
          def stack = new Stack();
          // ES has limit in 100 values for runtime field, after this query will fail
          int emitLimit = 100;
          stack.add([0, '']);
          
          while (stack.length > 0) {
              if (emitLimit == 0) {
                break;
              }
              def tuple = stack.pop();
              def index = tuple[0];
              def line = tuple[1];    
              if (index === params['fields'].length) {
                emit(line);
                emitLimit = emitLimit - 1;
              } else {
                def fieldName = params['fields'][index];
                for (field in doc[fieldName]) {
                    def fieldStr = String.valueOf(field);
                    if (!params['values'][fieldName].containsKey(fieldStr)) {
                      continue;
                    }
                    def delimiter = index === 0 ? '' : '${DELIMITER}';
                    def nextLine = line + delimiter + fieldStr.encodeBase64();
          
                    stack.add([index + 1, nextLine])
                }
              }
          }
        `
      }
    }
  };
};

/**
 * For a single new terms field, aggregation field equals to new terms field
 * For multiple new terms fields, aggregation field equals to defined AGG_FIELD_NAME, which is runtime field
 */
exports.getNewTermsRuntimeMappings = getNewTermsRuntimeMappings;
const getAggregationField = newTermsFields => {
  // if new terms include only one field we don't use runtime mappings and don't stich fields buckets together
  if (newTermsFields.length === 1) {
    return newTermsFields[0];
  }
  return AGG_FIELD_NAME;
};
exports.getAggregationField = getAggregationField;
const decodeBucketKey = bucketKey => {
  return bucketKey.split(DELIMITER).map(encodedValue => Buffer.from(encodedValue, 'base64').toString());
};

/**
 * decodes matched values(bucket keys) from terms aggregation and returns fields as array
 * @returns 'aG9zdC0w_dGVzdA==' bucket key will result in ['host-0', 'test']
 */
const decodeMatchedValues = (newTermsFields, bucketKey) => {
  // if newTermsFields has length greater than 1, bucketKey can't be number, so casting is safe here
  const values = newTermsFields.length === 1 ? [bucketKey] : decodeBucketKey(bucketKey);
  return values;
};
exports.decodeMatchedValues = decodeMatchedValues;