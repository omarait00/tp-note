"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggregationTypeTransform = exports.ENTITY_FIELD_TYPE = exports.ENTITY_FIELD_OPERATIONS = void 0;
exports.getEntityFieldList = getEntityFieldList;
exports.getEntityFieldName = getEntityFieldName;
exports.getEntityFieldValue = getEntityFieldValue;
exports.getFormattedSeverityScore = getFormattedSeverityScore;
exports.getMultiBucketImpactLabel = getMultiBucketImpactLabel;
exports.getSeverity = getSeverity;
exports.getSeverityColor = getSeverityColor;
exports.getSeverityType = getSeverityType;
exports.getSeverityWithLow = getSeverityWithLow;
exports.isCategorizationAnomaly = isCategorizationAnomaly;
exports.isRuleSupported = isRuleSupported;
exports.showActualForFunction = showActualForFunction;
exports.showTypicalForFunction = showTypicalForFunction;
var _i18n = require("@kbn/i18n");
var _detector_rule = require("../constants/detector_rule");
var _multi_bucket_impact = require("../constants/multi_bucket_impact");
var _anomalies = require("../constants/anomalies");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
/*
 * Contains functions for operations commonly performed on anomaly data
 * to extract information for display in dashboards.
 */
let ENTITY_FIELD_TYPE;
exports.ENTITY_FIELD_TYPE = ENTITY_FIELD_TYPE;
(function (ENTITY_FIELD_TYPE) {
  ENTITY_FIELD_TYPE["BY"] = "by";
  ENTITY_FIELD_TYPE["OVER"] = "over";
  ENTITY_FIELD_TYPE["PARTITON"] = "partition";
})(ENTITY_FIELD_TYPE || (exports.ENTITY_FIELD_TYPE = ENTITY_FIELD_TYPE = {}));
const ENTITY_FIELD_OPERATIONS = {
  ADD: '+',
  REMOVE: '-'
};
exports.ENTITY_FIELD_OPERATIONS = ENTITY_FIELD_OPERATIONS;
// List of function descriptions for which actual values from record level results should be displayed.
const DISPLAY_ACTUAL_FUNCTIONS = ['count', 'distinct_count', 'lat_long', 'mean', 'max', 'min', 'sum', 'median', 'varp', 'info_content', 'time'];

// List of function descriptions for which typical values from record level results should be displayed.
const DISPLAY_TYPICAL_FUNCTIONS = ['count', 'distinct_count', 'lat_long', 'mean', 'max', 'min', 'sum', 'median', 'varp', 'info_content', 'time'];
let severityTypes;
function getSeverityTypes() {
  if (severityTypes) {
    return severityTypes;
  }
  return severityTypes = {
    critical: {
      id: _anomalies.ANOMALY_SEVERITY.CRITICAL,
      label: _i18n.i18n.translate('xpack.ml.anomalyUtils.severity.criticalLabel', {
        defaultMessage: 'critical'
      })
    },
    major: {
      id: _anomalies.ANOMALY_SEVERITY.MAJOR,
      label: _i18n.i18n.translate('xpack.ml.anomalyUtils.severity.majorLabel', {
        defaultMessage: 'major'
      })
    },
    minor: {
      id: _anomalies.ANOMALY_SEVERITY.MINOR,
      label: _i18n.i18n.translate('xpack.ml.anomalyUtils.severity.minorLabel', {
        defaultMessage: 'minor'
      })
    },
    warning: {
      id: _anomalies.ANOMALY_SEVERITY.WARNING,
      label: _i18n.i18n.translate('xpack.ml.anomalyUtils.severity.warningLabel', {
        defaultMessage: 'warning'
      })
    },
    unknown: {
      id: _anomalies.ANOMALY_SEVERITY.UNKNOWN,
      label: _i18n.i18n.translate('xpack.ml.anomalyUtils.severity.unknownLabel', {
        defaultMessage: 'unknown'
      })
    },
    low: {
      id: _anomalies.ANOMALY_SEVERITY.LOW,
      label: _i18n.i18n.translate('xpack.ml.anomalyUtils.severityWithLow.lowLabel', {
        defaultMessage: 'low'
      })
    }
  };
}
function isCategorizationAnomaly(anomaly) {
  return anomaly.entityName === 'mlcategory';
}

/**
 * Returns formatted severity score.
 * @param score - A normalized score between 0-100, which is based on the probability of the anomalousness of this record
 */
function getFormattedSeverityScore(score) {
  return score < 1 ? '< 1' : String(parseInt(String(score), 10));
}

/**
 * Returns a severity label (one of critical, major, minor, warning or unknown)
 * for the supplied normalized anomaly score (a value between 0 and 100).
 * @param normalizedScore - A normalized score between 0-100, which is based on the probability of the anomalousness of this record
 */
function getSeverity(normalizedScore) {
  const severityTypesList = getSeverityTypes();
  if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.CRITICAL) {
    return severityTypesList.critical;
  } else if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.MAJOR) {
    return severityTypesList.major;
  } else if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.MINOR) {
    return severityTypesList.minor;
  } else if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.LOW) {
    return severityTypesList.warning;
  } else {
    return severityTypesList.unknown;
  }
}

/**
 * Returns a severity type (indicating a critical, major, minor, warning or low severity anomaly)
 * for the supplied normalized anomaly score (a value between 0 and 100).
 * @param normalizedScore - A normalized score between 0-100, which is based on the probability of the anomalousness of this record
 */
function getSeverityType(normalizedScore) {
  if (normalizedScore >= 75) {
    return _anomalies.ANOMALY_SEVERITY.CRITICAL;
  } else if (normalizedScore >= 50) {
    return _anomalies.ANOMALY_SEVERITY.MAJOR;
  } else if (normalizedScore >= 25) {
    return _anomalies.ANOMALY_SEVERITY.MINOR;
  } else if (normalizedScore >= 3) {
    return _anomalies.ANOMALY_SEVERITY.WARNING;
  } else if (normalizedScore >= 0) {
    return _anomalies.ANOMALY_SEVERITY.LOW;
  } else {
    return _anomalies.ANOMALY_SEVERITY.UNKNOWN;
  }
}

/**
 * Returns a severity label (one of critical, major, minor, warning, low or unknown)
 * for the supplied normalized anomaly score (a value between 0 and 100), where scores
 * less than 3 are assigned a severity of 'low'.
 * @param normalizedScore - A normalized score between 0-100, which is based on the probability of the anomalousness of this record
 */
function getSeverityWithLow(normalizedScore) {
  const severityTypesList = getSeverityTypes();
  if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.CRITICAL) {
    return severityTypesList.critical;
  } else if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.MAJOR) {
    return severityTypesList.major;
  } else if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.MINOR) {
    return severityTypesList.minor;
  } else if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.WARNING) {
    return severityTypesList.warning;
  } else if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.LOW) {
    return severityTypesList.low;
  } else {
    return severityTypesList.unknown;
  }
}

/**
 * Returns a severity RGB color (one of critical, major, minor, warning, low or blank)
 * for the supplied normalized anomaly score (a value between 0 and 100).
 * @param normalizedScore - A normalized score between 0-100, which is based on the probability of the anomalousness of this record
 */
function getSeverityColor(normalizedScore) {
  if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.CRITICAL) {
    return _anomalies.SEVERITY_COLORS.CRITICAL;
  } else if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.MAJOR) {
    return _anomalies.SEVERITY_COLORS.MAJOR;
  } else if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.MINOR) {
    return _anomalies.SEVERITY_COLORS.MINOR;
  } else if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.WARNING) {
    return _anomalies.SEVERITY_COLORS.WARNING;
  } else if (normalizedScore >= _anomalies.ANOMALY_THRESHOLD.LOW) {
    return _anomalies.SEVERITY_COLORS.LOW;
  } else {
    return _anomalies.SEVERITY_COLORS.BLANK;
  }
}

/**
 * Returns a label to use for the multi-bucket impact of an anomaly
 * according to the value of the multi_bucket_impact field of a record,
 * which ranges from -5 to +5.
 * @param multiBucketImpact - Value of the multi_bucket_impact field of a record, from -5 to +5
 */
function getMultiBucketImpactLabel(multiBucketImpact) {
  if (multiBucketImpact >= _multi_bucket_impact.MULTI_BUCKET_IMPACT.HIGH) {
    return _i18n.i18n.translate('xpack.ml.anomalyUtils.multiBucketImpact.highLabel', {
      defaultMessage: 'high'
    });
  } else if (multiBucketImpact >= _multi_bucket_impact.MULTI_BUCKET_IMPACT.MEDIUM) {
    return _i18n.i18n.translate('xpack.ml.anomalyUtils.multiBucketImpact.mediumLabel', {
      defaultMessage: 'medium'
    });
  } else if (multiBucketImpact >= _multi_bucket_impact.MULTI_BUCKET_IMPACT.LOW) {
    return _i18n.i18n.translate('xpack.ml.anomalyUtils.multiBucketImpact.lowLabel', {
      defaultMessage: 'low'
    });
  } else {
    return _i18n.i18n.translate('xpack.ml.anomalyUtils.multiBucketImpact.noneLabel', {
      defaultMessage: 'none'
    });
  }
}

/**
 * Returns the name of the field to use as the entity name from the source record
 * obtained from Elasticsearch. The function looks first for a by_field, then over_field,
 * then partition_field, returning undefined if none of these fields are present.
 * @param record - anomaly record result for which to obtain the entity field name.
 */
function getEntityFieldName(record) {
  // Analyses with by and over fields, will have a top-level by_field_name, but
  // the by_field_value(s) will be in the nested causes array.
  if (record.by_field_name !== undefined && record.by_field_value !== undefined) {
    return record.by_field_name;
  }
  if (record.over_field_name !== undefined) {
    return record.over_field_name;
  }
  if (record.partition_field_name !== undefined) {
    return record.partition_field_name;
  }
}

/**
 * Returns the value of the field to use as the entity value from the source record
 * obtained from Elasticsearch. The function looks first for a by_field, then over_field,
 * then partition_field, returning undefined if none of these fields are present.
 * @param record - anomaly record result for which to obtain the entity field value.
 */
function getEntityFieldValue(record) {
  if (record.by_field_value !== undefined) {
    return record.by_field_value;
  }
  if (record.over_field_value !== undefined) {
    return record.over_field_value;
  }
  if (record.partition_field_value !== undefined) {
    return record.partition_field_value;
  }
}

/**
 * Returns the list of partitioning entity fields for the source record as a list
 * of objects in the form { fieldName: airline, fieldValue: AAL, fieldType: partition }
 * @param record - anomaly record result for which to obtain the entity field list.
 */
function getEntityFieldList(record) {
  const entityFields = [];
  if (record.partition_field_name !== undefined) {
    entityFields.push({
      fieldName: record.partition_field_name,
      fieldValue: record.partition_field_value,
      fieldType: ENTITY_FIELD_TYPE.PARTITON
    });
  }
  if (record.over_field_name !== undefined) {
    entityFields.push({
      fieldName: record.over_field_name,
      fieldValue: record.over_field_value,
      fieldType: ENTITY_FIELD_TYPE.OVER
    });
  }

  // For jobs with by and over fields, don't add the 'by' field as this
  // field will only be added to the top-level fields for record type results
  // if it also an influencer over the bucket.
  if (record.by_field_name !== undefined && record.over_field_name === undefined) {
    entityFields.push({
      fieldName: record.by_field_name,
      fieldValue: record.by_field_value,
      fieldType: ENTITY_FIELD_TYPE.BY
    });
  }
  return entityFields;
}

/**
 * Returns whether actual values should be displayed for a record with the specified function description.
 * Note that the 'function' field in a record contains what the user entered e.g. 'high_count',
 * whereas the 'function_description' field holds a ML-built display hint for function e.g. 'count'.
 * @param functionDescription - function_description value for the anomaly record
 */
function showActualForFunction(functionDescription) {
  return DISPLAY_ACTUAL_FUNCTIONS.indexOf(functionDescription) > -1;
}

/**
 * Returns whether typical values should be displayed for a record with the specified function description.
 * Note that the 'function' field in a record contains what the user entered e.g. 'high_count',
 * whereas the 'function_description' field holds a ML-built display hint for function e.g. 'count'.
 * @param functionDescription - function_description value for the anomaly record
 */
function showTypicalForFunction(functionDescription) {
  return DISPLAY_TYPICAL_FUNCTIONS.indexOf(functionDescription) > -1;
}

/**
 * Returns whether a rule can be configured against the specified anomaly.
 * @param record - anomaly record result
 */
function isRuleSupported(record) {
  // A rule can be configured with a numeric condition if the function supports it,
  // and/or with scope if there is a partitioning fields.
  return _detector_rule.CONDITIONS_NOT_SUPPORTED_FUNCTIONS.indexOf(record.function) === -1 || getEntityFieldName(record) !== undefined;
}

/**
 * Two functions for converting aggregation type names.
 * ML and ES use different names for the same function.
 * Possible values for ML aggregation type are (defined in lib/model/CAnomalyDetector.cc):
 *    count
 *    distinct_count
 *    rare
 *    info_content
 *    mean
 *    median
 *    min
 *    max
 *    varp
 *    sum
 *    lat_long
 *    time
 * The input to toES and the output from toML correspond to the value of the
 * function_description field of anomaly records.
 */
const aggregationTypeTransform = {
  toES(oldAggType) {
    let newAggType = oldAggType;
    if (newAggType === 'mean') {
      newAggType = 'avg';
    } else if (newAggType === 'distinct_count') {
      newAggType = 'cardinality';
    } else if (newAggType === 'median') {
      newAggType = 'percentiles';
    }
    return newAggType;
  },
  toML(oldAggType) {
    let newAggType = oldAggType;
    if (newAggType === 'avg') {
      newAggType = 'mean';
    } else if (newAggType === 'cardinality') {
      newAggType = 'distinct_count';
    } else if (newAggType === 'percentiles') {
      newAggType = 'median';
    }
    return newAggType;
  }
};
exports.aggregationTypeTransform = aggregationTypeTransform;