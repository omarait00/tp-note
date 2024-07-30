"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ENABLE_NEWS_FEED_SETTING = exports.ENABLE_GROUPED_NAVIGATION = exports.ENABLE_CCS_READ_WARNING_SETTING = exports.DEV_TOOL_PREBUILT_CONTENT = exports.DETECTION_RESPONSE_PATH = exports.DETECTION_ENGINE_URL = exports.DETECTION_ENGINE_TAGS_URL = exports.DETECTION_ENGINE_SIGNALS_URL = exports.DETECTION_ENGINE_SIGNALS_STATUS_URL = exports.DETECTION_ENGINE_SIGNALS_MIGRATION_URL = exports.DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL = exports.DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL = exports.DETECTION_ENGINE_RULES_URL_FIND = exports.DETECTION_ENGINE_RULES_URL = exports.DETECTION_ENGINE_RULES_PREVIEW = exports.DETECTION_ENGINE_RULES_BULK_UPDATE = exports.DETECTION_ENGINE_RULES_BULK_DELETE = exports.DETECTION_ENGINE_RULES_BULK_CREATE = exports.DETECTION_ENGINE_RULES_BULK_ACTION = exports.DETECTION_ENGINE_QUERY_SIGNALS_URL = exports.DETECTION_ENGINE_PRIVILEGES_URL = exports.DETECTION_ENGINE_INDEX_URL = exports.DETECTION_ENGINE_ALERTS_INDEX_URL = exports.DETECTIONS_PATH = exports.DEFAULT_TO = exports.DEFAULT_TIME_RANGE = exports.DEFAULT_TIME_FIELD = exports.DEFAULT_TIMEPICKER_QUICK_RANGES = exports.DEFAULT_THREAT_MATCH_QUERY = exports.DEFAULT_THREAT_INDEX_VALUE = exports.DEFAULT_THREAT_INDEX_KEY = exports.DEFAULT_SPACE_ID = exports.DEFAULT_SIGNALS_INDEX = exports.DEFAULT_SEARCH_AFTER_PAGE_SIZE = exports.DEFAULT_RULE_REFRESH_INTERVAL_VALUE = exports.DEFAULT_RULE_REFRESH_INTERVAL_ON = exports.DEFAULT_RULE_NOTIFICATION_QUERY_SIZE = exports.DEFAULT_RULES_TABLE_REFRESH_SETTING = exports.DEFAULT_RELATIVE_DATE_THRESHOLD = exports.DEFAULT_REFRESH_RATE_INTERVAL = exports.DEFAULT_PREVIEW_INDEX = exports.DEFAULT_NUMBER_FORMAT = exports.DEFAULT_MAX_TABLE_QUERY_SIZE = exports.DEFAULT_MAX_SIGNALS = exports.DEFAULT_LISTS_INDEX = exports.DEFAULT_ITEMS_INDEX = exports.DEFAULT_INTERVAL_VALUE = exports.DEFAULT_INTERVAL_TYPE = exports.DEFAULT_INTERVAL_PAUSE = exports.DEFAULT_INDICATOR_SOURCE_PATH = exports.DEFAULT_INDEX_PATTERN = exports.DEFAULT_INDEX_KEY = exports.DEFAULT_FROM = exports.DEFAULT_DATE_FORMAT_TZ = exports.DEFAULT_DATE_FORMAT = exports.DEFAULT_DATA_VIEW_ID = exports.DEFAULT_DARK_MODE = exports.DEFAULT_BYTES_FORMAT = exports.DEFAULT_APP_TIME_RANGE = exports.DEFAULT_APP_REFRESH_INTERVAL = exports.DEFAULT_ANOMALY_SCORE = exports.DEFAULT_ALERTS_INDEX = exports.DASHBOARDS_PATH = exports.CASES_PATH = exports.CASES_FEATURE_ID = exports.BulkActionsDryRunErrCode = exports.BULK_ADD_TO_TIMELINE_LIMIT = exports.BLOCKLIST_PATH = exports.APP_USERS_PATH = exports.APP_UI_ID = exports.APP_TRUSTED_APPS_PATH = exports.APP_TIMELINES_PATH = exports.APP_RULES_PATH = exports.APP_RESPONSE_ACTIONS_HISTORY_PATH = exports.APP_POLICIES_PATH = exports.APP_PATH = exports.APP_OVERVIEW_PATH = exports.APP_NETWORK_PATH = exports.APP_NAME = exports.APP_MANAGEMENT_PATH = exports.APP_LANDING_PATH = exports.APP_KUBERNETES_PATH = exports.APP_ID = exports.APP_ICON_SOLUTION = exports.APP_ICON = exports.APP_HOST_ISOLATION_EXCEPTIONS_PATH = exports.APP_HOSTS_PATH = exports.APP_EXCEPTIONS_PATH = exports.APP_EVENT_FILTERS_PATH = exports.APP_ENTITY_ANALYTICS_PATH = exports.APP_ENDPOINTS_PATH = exports.APP_DETECTION_RESPONSE_PATH = exports.APP_CASES_PATH = exports.APP_BLOCKLIST_PATH = exports.APP_ALERTS_PATH = exports.ALERTS_PATH = exports.ALERTS_AS_DATA_URL = exports.ALERTS_AS_DATA_FIND_URL = exports.ADD_THREAT_INTELLIGENCE_DATA_PATH = exports.ADD_DATA_PATH = void 0;
exports.showAllOthersBucket = exports.prebuiltSavedObjectsBulkDeleteUrl = exports.prebuiltSavedObjectsBulkCreateUrl = exports.devToolPrebuiltContentUrl = exports.WARNING_TRANSFORM_STATES = exports.USERS_PATH = exports.UPDATE_OR_CREATE_LEGACY_ACTIONS = exports.UNAUTHENTICATED_USER = exports.TRUSTED_APPS_PATH = exports.TRANSFORM_STATES = exports.TIMELINE_URL = exports.TIMELINE_RESOLVE_URL = exports.TIMELINE_PREPACKAGED_URL = exports.TIMELINE_IMPORT_URL = exports.TIMELINE_FAVORITE_URL = exports.TIMELINE_EXPORT_URL = exports.TIMELINE_DRAFT_URL = exports.TIMELINES_URL = exports.TIMELINES_PATH = exports.THREAT_INTELLIGENCE_PATH = exports.SecurityPageName = exports.STARTED_TRANSFORM_STATES = exports.SOURCERER_API_URL = exports.SIGNALS_INDEX_KEY = exports.SHOW_RELATED_INTEGRATIONS_SETTING = exports.SHARED_EXCEPTION_LIST_URL = exports.SERVER_APP_ID = exports.SECURITY_TELEMETRY_URL = exports.SECURITY_FEATURE_ID = exports.SCROLLING_DISABLED_CLASS_NAME = exports.RULE_DETAILS_EXECUTION_LOG_TABLE_SHOW_METRIC_COLUMNS_STORAGE_KEY = exports.RULES_TABLE_PAGE_SIZE_OPTIONS = exports.RULES_TABLE_MAX_PAGE_SIZE = exports.RULES_PATH = exports.RULES_CREATE_PATH = exports.RISK_SCORE_INDEX_STATUS_API_URL = exports.RISK_SCORE_DELETE_STORED_SCRIPT = exports.RISK_SCORE_DELETE_INDICES = exports.RISK_SCORE_CREATE_STORED_SCRIPT = exports.RISK_SCORE_CREATE_INDEX = exports.RISKY_USERS_INDEX_PREFIX = exports.RISKY_USERS_DOC_LINK = exports.RISKY_HOSTS_INDEX_PREFIX = exports.RISKY_HOSTS_DOC_LINK = exports.RESPONSE_ACTIONS_HISTORY_PATH = exports.PREBUILT_SAVED_OBJECTS_BULK_DELETE = exports.PREBUILT_SAVED_OBJECTS_BULK_CREATE = exports.POLICIES_PATH = exports.PINNED_EVENT_URL = exports.OVERVIEW_PATH = exports.NO_ALERT_INDEX = exports.NOTIFICATION_THROTTLE_RULE = exports.NOTIFICATION_THROTTLE_NO_ACTIONS = exports.NOTE_URL = exports.NEW_FEATURES_TOUR_STORAGE_KEYS = exports.NEWS_FEED_URL_SETTING_DEFAULT = exports.NEWS_FEED_URL_SETTING = exports.NETWORK_PATH = exports.ML_GROUP_IDS = exports.ML_GROUP_ID = exports.MINIMUM_ML_LICENSE = exports.MAX_RULES_TO_UPDATE_IN_PARALLEL = exports.MAX_NUMBER_OF_NEW_TERMS_FIELDS = exports.MANAGE_PATH = exports.MANAGEMENT_PATH = exports.LIMITED_CONCURRENCY_ROUTE_TAG_PREFIX = exports.LEGACY_NOTIFICATIONS_ID = exports.LEGACY_ML_GROUP_ID = exports.LANDING_PATH = exports.KUBERNETES_PATH = exports.IP_REPUTATION_LINKS_SETTING_DEFAULT = exports.IP_REPUTATION_LINKS_SETTING = exports.INTERNAL_RISK_SCORE_URL = exports.INTERNAL_DETECTION_ENGINE_URL = exports.INCLUDE_INDEX_PATTERN = exports.HOST_ISOLATION_EXCEPTIONS_PATH = exports.HOSTS_PATH = exports.FULL_SCREEN_TOGGLED_CLASS_NAME = exports.EXTENDED_RULE_EXECUTION_LOGGING_MIN_LEVEL_SETTING = exports.EXTENDED_RULE_EXECUTION_LOGGING_ENABLED_SETTING = exports.EXPLORE_PATH = exports.EXCLUDE_ELASTIC_CLOUD_INDICES = exports.EXCEPTION_LIST_DETAIL_PATH = exports.EXCEPTIONS_PATH = exports.EVENT_FILTERS_PATH = exports.ENTITY_ANALYTICS_PATH = exports.ENRICHMENT_DESTINATION_PATH = exports.ENDPOINT_METRICS_INDEX = exports.ENDPOINT_METADATA_INDEX = exports.ENDPOINTS_PATH = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * as const
 *
 * The const assertion ensures that type widening does not occur
 * https://mariusschulz.com/blog/literal-type-widening-in-typescript
 * Please follow this convention when adding to this file
 */

const APP_ID = 'securitySolution';
exports.APP_ID = APP_ID;
const APP_UI_ID = 'securitySolutionUI';
exports.APP_UI_ID = APP_UI_ID;
const CASES_FEATURE_ID = 'securitySolutionCases';
exports.CASES_FEATURE_ID = CASES_FEATURE_ID;
const SERVER_APP_ID = 'siem';
exports.SERVER_APP_ID = SERVER_APP_ID;
const APP_NAME = 'Security';
exports.APP_NAME = APP_NAME;
const APP_ICON = 'securityAnalyticsApp';
exports.APP_ICON = APP_ICON;
const APP_ICON_SOLUTION = 'logoSecurity';
exports.APP_ICON_SOLUTION = APP_ICON_SOLUTION;
const APP_PATH = `/app/security`;
exports.APP_PATH = APP_PATH;
const ADD_DATA_PATH = `/app/integrations/browse/security`;
exports.ADD_DATA_PATH = ADD_DATA_PATH;
const ADD_THREAT_INTELLIGENCE_DATA_PATH = `/app/integrations/browse/threat_intel`;
exports.ADD_THREAT_INTELLIGENCE_DATA_PATH = ADD_THREAT_INTELLIGENCE_DATA_PATH;
const DEFAULT_BYTES_FORMAT = 'format:bytes:defaultPattern';
exports.DEFAULT_BYTES_FORMAT = DEFAULT_BYTES_FORMAT;
const DEFAULT_DATE_FORMAT = 'dateFormat';
exports.DEFAULT_DATE_FORMAT = DEFAULT_DATE_FORMAT;
const DEFAULT_DATE_FORMAT_TZ = 'dateFormat:tz';
exports.DEFAULT_DATE_FORMAT_TZ = DEFAULT_DATE_FORMAT_TZ;
const DEFAULT_DARK_MODE = 'theme:darkMode';
exports.DEFAULT_DARK_MODE = DEFAULT_DARK_MODE;
const DEFAULT_INDEX_KEY = 'securitySolution:defaultIndex';
exports.DEFAULT_INDEX_KEY = DEFAULT_INDEX_KEY;
const DEFAULT_NUMBER_FORMAT = 'format:number:defaultPattern';
exports.DEFAULT_NUMBER_FORMAT = DEFAULT_NUMBER_FORMAT;
const DEFAULT_DATA_VIEW_ID = 'security-solution';
exports.DEFAULT_DATA_VIEW_ID = DEFAULT_DATA_VIEW_ID;
const DEFAULT_TIME_FIELD = '@timestamp';
exports.DEFAULT_TIME_FIELD = DEFAULT_TIME_FIELD;
const DEFAULT_TIME_RANGE = 'timepicker:timeDefaults';
exports.DEFAULT_TIME_RANGE = DEFAULT_TIME_RANGE;
const DEFAULT_REFRESH_RATE_INTERVAL = 'timepicker:refreshIntervalDefaults';
exports.DEFAULT_REFRESH_RATE_INTERVAL = DEFAULT_REFRESH_RATE_INTERVAL;
const DEFAULT_APP_TIME_RANGE = 'securitySolution:timeDefaults';
exports.DEFAULT_APP_TIME_RANGE = DEFAULT_APP_TIME_RANGE;
const DEFAULT_APP_REFRESH_INTERVAL = 'securitySolution:refreshIntervalDefaults';
exports.DEFAULT_APP_REFRESH_INTERVAL = DEFAULT_APP_REFRESH_INTERVAL;
const DEFAULT_ALERTS_INDEX = '.alerts-security.alerts';
exports.DEFAULT_ALERTS_INDEX = DEFAULT_ALERTS_INDEX;
const DEFAULT_SIGNALS_INDEX = '.siem-signals';
exports.DEFAULT_SIGNALS_INDEX = DEFAULT_SIGNALS_INDEX;
const DEFAULT_PREVIEW_INDEX = '.preview.alerts-security.alerts';
exports.DEFAULT_PREVIEW_INDEX = DEFAULT_PREVIEW_INDEX;
const DEFAULT_LISTS_INDEX = '.lists';
exports.DEFAULT_LISTS_INDEX = DEFAULT_LISTS_INDEX;
const DEFAULT_ITEMS_INDEX = '.items';
// The DEFAULT_MAX_SIGNALS value exists also in `x-pack/plugins/cases/common/constants.ts`
// If either changes, engineer should ensure both values are updated
exports.DEFAULT_ITEMS_INDEX = DEFAULT_ITEMS_INDEX;
const DEFAULT_MAX_SIGNALS = 100;
exports.DEFAULT_MAX_SIGNALS = DEFAULT_MAX_SIGNALS;
const DEFAULT_SEARCH_AFTER_PAGE_SIZE = 100;
exports.DEFAULT_SEARCH_AFTER_PAGE_SIZE = DEFAULT_SEARCH_AFTER_PAGE_SIZE;
const DEFAULT_ANOMALY_SCORE = 'securitySolution:defaultAnomalyScore';
exports.DEFAULT_ANOMALY_SCORE = DEFAULT_ANOMALY_SCORE;
const DEFAULT_MAX_TABLE_QUERY_SIZE = 10000;
exports.DEFAULT_MAX_TABLE_QUERY_SIZE = DEFAULT_MAX_TABLE_QUERY_SIZE;
const DEFAULT_FROM = 'now/d';
exports.DEFAULT_FROM = DEFAULT_FROM;
const DEFAULT_TO = 'now/d';
exports.DEFAULT_TO = DEFAULT_TO;
const DEFAULT_INTERVAL_PAUSE = true;
exports.DEFAULT_INTERVAL_PAUSE = DEFAULT_INTERVAL_PAUSE;
const DEFAULT_INTERVAL_TYPE = 'manual';
exports.DEFAULT_INTERVAL_TYPE = DEFAULT_INTERVAL_TYPE;
const DEFAULT_INTERVAL_VALUE = 300000; // ms
exports.DEFAULT_INTERVAL_VALUE = DEFAULT_INTERVAL_VALUE;
const DEFAULT_TIMEPICKER_QUICK_RANGES = 'timepicker:quickRanges';
exports.DEFAULT_TIMEPICKER_QUICK_RANGES = DEFAULT_TIMEPICKER_QUICK_RANGES;
const SCROLLING_DISABLED_CLASS_NAME = 'scrolling-disabled';
exports.SCROLLING_DISABLED_CLASS_NAME = SCROLLING_DISABLED_CLASS_NAME;
const FULL_SCREEN_TOGGLED_CLASS_NAME = 'fullScreenToggled';
exports.FULL_SCREEN_TOGGLED_CLASS_NAME = FULL_SCREEN_TOGGLED_CLASS_NAME;
const NO_ALERT_INDEX = 'no-alert-index-049FC71A-4C2C-446F-9901-37XMC5024C51';
exports.NO_ALERT_INDEX = NO_ALERT_INDEX;
const ENDPOINT_METADATA_INDEX = 'metrics-endpoint.metadata-*';
exports.ENDPOINT_METADATA_INDEX = ENDPOINT_METADATA_INDEX;
const ENDPOINT_METRICS_INDEX = '.ds-metrics-endpoint.metrics-*';
exports.ENDPOINT_METRICS_INDEX = ENDPOINT_METRICS_INDEX;
const DEFAULT_RULE_REFRESH_INTERVAL_ON = true;
exports.DEFAULT_RULE_REFRESH_INTERVAL_ON = DEFAULT_RULE_REFRESH_INTERVAL_ON;
const DEFAULT_RULE_REFRESH_INTERVAL_VALUE = 60000; // ms
exports.DEFAULT_RULE_REFRESH_INTERVAL_VALUE = DEFAULT_RULE_REFRESH_INTERVAL_VALUE;
const DEFAULT_RULE_NOTIFICATION_QUERY_SIZE = 100;
exports.DEFAULT_RULE_NOTIFICATION_QUERY_SIZE = DEFAULT_RULE_NOTIFICATION_QUERY_SIZE;
const SECURITY_FEATURE_ID = 'Security';
exports.SECURITY_FEATURE_ID = SECURITY_FEATURE_ID;
const DEFAULT_SPACE_ID = 'default';
exports.DEFAULT_SPACE_ID = DEFAULT_SPACE_ID;
const DEFAULT_RELATIVE_DATE_THRESHOLD = 24;

// Document path where threat indicator fields are expected. Fields are used
// to enrich signals, and are copied to threat.enrichments.
exports.DEFAULT_RELATIVE_DATE_THRESHOLD = DEFAULT_RELATIVE_DATE_THRESHOLD;
const DEFAULT_INDICATOR_SOURCE_PATH = 'threat.indicator';
exports.DEFAULT_INDICATOR_SOURCE_PATH = DEFAULT_INDICATOR_SOURCE_PATH;
const ENRICHMENT_DESTINATION_PATH = 'threat.enrichments';
exports.ENRICHMENT_DESTINATION_PATH = ENRICHMENT_DESTINATION_PATH;
const DEFAULT_THREAT_INDEX_KEY = 'securitySolution:defaultThreatIndex';
exports.DEFAULT_THREAT_INDEX_KEY = DEFAULT_THREAT_INDEX_KEY;
const DEFAULT_THREAT_INDEX_VALUE = ['logs-ti_*'];
exports.DEFAULT_THREAT_INDEX_VALUE = DEFAULT_THREAT_INDEX_VALUE;
const DEFAULT_THREAT_MATCH_QUERY = '@timestamp >= "now-30d/d"';
exports.DEFAULT_THREAT_MATCH_QUERY = DEFAULT_THREAT_MATCH_QUERY;
let SecurityPageName;
exports.SecurityPageName = SecurityPageName;
(function (SecurityPageName) {
  SecurityPageName["administration"] = "administration";
  SecurityPageName["alerts"] = "alerts";
  SecurityPageName["blocklist"] = "blocklist";
  SecurityPageName["case"] = "cases";
  SecurityPageName["caseConfigure"] = "cases_configure";
  SecurityPageName["caseCreate"] = "cases_create";
  SecurityPageName["cloudSecurityPostureBenchmarks"] = "cloud_security_posture-benchmarks";
  SecurityPageName["cloudSecurityPostureDashboard"] = "cloud_security_posture-dashboard";
  SecurityPageName["cloudSecurityPostureFindings"] = "cloud_security_posture-findings";
  SecurityPageName["cloudSecurityPostureRules"] = "cloud_security_posture-rules";
  SecurityPageName["dashboardsLanding"] = "dashboards";
  SecurityPageName["detections"] = "detections";
  SecurityPageName["detectionAndResponse"] = "detection_response";
  SecurityPageName["endpoints"] = "endpoints";
  SecurityPageName["eventFilters"] = "event_filters";
  SecurityPageName["exceptions"] = "exceptions";
  SecurityPageName["exploreLanding"] = "explore";
  SecurityPageName["hostIsolationExceptions"] = "host_isolation_exceptions";
  SecurityPageName["hosts"] = "hosts";
  SecurityPageName["hostsAnomalies"] = "hosts-anomalies";
  SecurityPageName["hostsRisk"] = "hosts-risk";
  SecurityPageName["hostsEvents"] = "hosts-events";
  SecurityPageName["investigate"] = "investigate";
  SecurityPageName["kubernetes"] = "kubernetes";
  SecurityPageName["landing"] = "get_started";
  SecurityPageName["network"] = "network";
  SecurityPageName["networkAnomalies"] = "network-anomalies";
  SecurityPageName["networkDns"] = "network-dns";
  SecurityPageName["networkEvents"] = "network-events";
  SecurityPageName["networkHttp"] = "network-http";
  SecurityPageName["networkTls"] = "network-tls";
  SecurityPageName["noPage"] = "";
  SecurityPageName["overview"] = "overview";
  SecurityPageName["policies"] = "policy";
  SecurityPageName["responseActionsHistory"] = "response_actions_history";
  SecurityPageName["rules"] = "rules";
  SecurityPageName["rulesCreate"] = "rules-create";
  SecurityPageName["sessions"] = "sessions";
  SecurityPageName["threatIntelligenceIndicators"] = "threat_intelligence-indicators";
  SecurityPageName["timelines"] = "timelines";
  SecurityPageName["timelinesTemplates"] = "timelines-templates";
  SecurityPageName["trustedApps"] = "trusted_apps";
  SecurityPageName["uncommonProcesses"] = "uncommon_processes";
  SecurityPageName["users"] = "users";
  SecurityPageName["usersAnomalies"] = "users-anomalies";
  SecurityPageName["usersAuthentications"] = "users-authentications";
  SecurityPageName["usersEvents"] = "users-events";
  SecurityPageName["usersRisk"] = "users-risk";
  SecurityPageName["entityAnalytics"] = "entity-analytics";
})(SecurityPageName || (exports.SecurityPageName = SecurityPageName = {}));
const EXPLORE_PATH = '/explore';
exports.EXPLORE_PATH = EXPLORE_PATH;
const DASHBOARDS_PATH = '/dashboards';
exports.DASHBOARDS_PATH = DASHBOARDS_PATH;
const MANAGE_PATH = '/manage';
exports.MANAGE_PATH = MANAGE_PATH;
const TIMELINES_PATH = '/timelines';
exports.TIMELINES_PATH = TIMELINES_PATH;
const CASES_PATH = '/cases';
exports.CASES_PATH = CASES_PATH;
const OVERVIEW_PATH = '/overview';
exports.OVERVIEW_PATH = OVERVIEW_PATH;
const LANDING_PATH = '/get_started';
exports.LANDING_PATH = LANDING_PATH;
const DETECTION_RESPONSE_PATH = '/detection_response';
exports.DETECTION_RESPONSE_PATH = DETECTION_RESPONSE_PATH;
const DETECTIONS_PATH = '/detections';
exports.DETECTIONS_PATH = DETECTIONS_PATH;
const ALERTS_PATH = '/alerts';
exports.ALERTS_PATH = ALERTS_PATH;
const RULES_PATH = '/rules';
exports.RULES_PATH = RULES_PATH;
const RULES_CREATE_PATH = `${RULES_PATH}/create`;
exports.RULES_CREATE_PATH = RULES_CREATE_PATH;
const EXCEPTIONS_PATH = '/exceptions';
exports.EXCEPTIONS_PATH = EXCEPTIONS_PATH;
const EXCEPTION_LIST_DETAIL_PATH = `${EXCEPTIONS_PATH}/details/:detailName`;
exports.EXCEPTION_LIST_DETAIL_PATH = EXCEPTION_LIST_DETAIL_PATH;
const HOSTS_PATH = '/hosts';
exports.HOSTS_PATH = HOSTS_PATH;
const USERS_PATH = '/users';
exports.USERS_PATH = USERS_PATH;
const KUBERNETES_PATH = '/kubernetes';
exports.KUBERNETES_PATH = KUBERNETES_PATH;
const NETWORK_PATH = '/network';
exports.NETWORK_PATH = NETWORK_PATH;
const MANAGEMENT_PATH = '/administration';
exports.MANAGEMENT_PATH = MANAGEMENT_PATH;
const THREAT_INTELLIGENCE_PATH = '/threat_intelligence';
exports.THREAT_INTELLIGENCE_PATH = THREAT_INTELLIGENCE_PATH;
const ENDPOINTS_PATH = `${MANAGEMENT_PATH}/endpoints`;
exports.ENDPOINTS_PATH = ENDPOINTS_PATH;
const POLICIES_PATH = `${MANAGEMENT_PATH}/policy`;
exports.POLICIES_PATH = POLICIES_PATH;
const TRUSTED_APPS_PATH = `${MANAGEMENT_PATH}/trusted_apps`;
exports.TRUSTED_APPS_PATH = TRUSTED_APPS_PATH;
const EVENT_FILTERS_PATH = `${MANAGEMENT_PATH}/event_filters`;
exports.EVENT_FILTERS_PATH = EVENT_FILTERS_PATH;
const HOST_ISOLATION_EXCEPTIONS_PATH = `${MANAGEMENT_PATH}/host_isolation_exceptions`;
exports.HOST_ISOLATION_EXCEPTIONS_PATH = HOST_ISOLATION_EXCEPTIONS_PATH;
const BLOCKLIST_PATH = `${MANAGEMENT_PATH}/blocklist`;
exports.BLOCKLIST_PATH = BLOCKLIST_PATH;
const RESPONSE_ACTIONS_HISTORY_PATH = `${MANAGEMENT_PATH}/response_actions_history`;
exports.RESPONSE_ACTIONS_HISTORY_PATH = RESPONSE_ACTIONS_HISTORY_PATH;
const ENTITY_ANALYTICS_PATH = '/entity_analytics';
exports.ENTITY_ANALYTICS_PATH = ENTITY_ANALYTICS_PATH;
const APP_OVERVIEW_PATH = `${APP_PATH}${OVERVIEW_PATH}`;
exports.APP_OVERVIEW_PATH = APP_OVERVIEW_PATH;
const APP_LANDING_PATH = `${APP_PATH}${LANDING_PATH}`;
exports.APP_LANDING_PATH = APP_LANDING_PATH;
const APP_DETECTION_RESPONSE_PATH = `${APP_PATH}${DETECTION_RESPONSE_PATH}`;
exports.APP_DETECTION_RESPONSE_PATH = APP_DETECTION_RESPONSE_PATH;
const APP_MANAGEMENT_PATH = `${APP_PATH}${MANAGEMENT_PATH}`;
exports.APP_MANAGEMENT_PATH = APP_MANAGEMENT_PATH;
const APP_ALERTS_PATH = `${APP_PATH}${ALERTS_PATH}`;
exports.APP_ALERTS_PATH = APP_ALERTS_PATH;
const APP_RULES_PATH = `${APP_PATH}${RULES_PATH}`;
exports.APP_RULES_PATH = APP_RULES_PATH;
const APP_EXCEPTIONS_PATH = `${APP_PATH}${EXCEPTIONS_PATH}`;
exports.APP_EXCEPTIONS_PATH = APP_EXCEPTIONS_PATH;
const APP_HOSTS_PATH = `${APP_PATH}${HOSTS_PATH}`;
exports.APP_HOSTS_PATH = APP_HOSTS_PATH;
const APP_USERS_PATH = `${APP_PATH}${USERS_PATH}`;
exports.APP_USERS_PATH = APP_USERS_PATH;
const APP_NETWORK_PATH = `${APP_PATH}${NETWORK_PATH}`;
exports.APP_NETWORK_PATH = APP_NETWORK_PATH;
const APP_KUBERNETES_PATH = `${APP_PATH}${KUBERNETES_PATH}`;
exports.APP_KUBERNETES_PATH = APP_KUBERNETES_PATH;
const APP_TIMELINES_PATH = `${APP_PATH}${TIMELINES_PATH}`;
exports.APP_TIMELINES_PATH = APP_TIMELINES_PATH;
const APP_CASES_PATH = `${APP_PATH}${CASES_PATH}`;
exports.APP_CASES_PATH = APP_CASES_PATH;
const APP_ENDPOINTS_PATH = `${APP_PATH}${ENDPOINTS_PATH}`;
exports.APP_ENDPOINTS_PATH = APP_ENDPOINTS_PATH;
const APP_POLICIES_PATH = `${APP_PATH}${POLICIES_PATH}`;
exports.APP_POLICIES_PATH = APP_POLICIES_PATH;
const APP_TRUSTED_APPS_PATH = `${APP_PATH}${TRUSTED_APPS_PATH}`;
exports.APP_TRUSTED_APPS_PATH = APP_TRUSTED_APPS_PATH;
const APP_EVENT_FILTERS_PATH = `${APP_PATH}${EVENT_FILTERS_PATH}`;
exports.APP_EVENT_FILTERS_PATH = APP_EVENT_FILTERS_PATH;
const APP_HOST_ISOLATION_EXCEPTIONS_PATH = `${APP_PATH}${HOST_ISOLATION_EXCEPTIONS_PATH}`;
exports.APP_HOST_ISOLATION_EXCEPTIONS_PATH = APP_HOST_ISOLATION_EXCEPTIONS_PATH;
const APP_BLOCKLIST_PATH = `${APP_PATH}${BLOCKLIST_PATH}`;
exports.APP_BLOCKLIST_PATH = APP_BLOCKLIST_PATH;
const APP_RESPONSE_ACTIONS_HISTORY_PATH = `${APP_PATH}${RESPONSE_ACTIONS_HISTORY_PATH}`;
exports.APP_RESPONSE_ACTIONS_HISTORY_PATH = APP_RESPONSE_ACTIONS_HISTORY_PATH;
const APP_ENTITY_ANALYTICS_PATH = `${APP_PATH}${ENTITY_ANALYTICS_PATH}`;

// cloud logs to exclude from default index pattern
exports.APP_ENTITY_ANALYTICS_PATH = APP_ENTITY_ANALYTICS_PATH;
const EXCLUDE_ELASTIC_CLOUD_INDICES = ['-*elastic-cloud-logs-*'];

/** The comma-delimited list of Elasticsearch indices from which the SIEM app collects events */
exports.EXCLUDE_ELASTIC_CLOUD_INDICES = EXCLUDE_ELASTIC_CLOUD_INDICES;
const INCLUDE_INDEX_PATTERN = ['apm-*-transaction*', 'auditbeat-*', 'endgame-*', 'filebeat-*', 'logs-*', 'packetbeat-*', 'traces-apm*', 'winlogbeat-*'];
/** The comma-delimited list of Elasticsearch indices from which the SIEM app collects events, and the exclude index pattern */
exports.INCLUDE_INDEX_PATTERN = INCLUDE_INDEX_PATTERN;
const DEFAULT_INDEX_PATTERN = [...INCLUDE_INDEX_PATTERN, ...EXCLUDE_ELASTIC_CLOUD_INDICES];

/** This Kibana Advanced Setting enables the grouped navigation in Security Solution */
exports.DEFAULT_INDEX_PATTERN = DEFAULT_INDEX_PATTERN;
const ENABLE_GROUPED_NAVIGATION = 'securitySolution:enableGroupedNav';

/** This Kibana Advanced Setting enables the `Security news` feed widget */
exports.ENABLE_GROUPED_NAVIGATION = ENABLE_GROUPED_NAVIGATION;
const ENABLE_NEWS_FEED_SETTING = 'securitySolution:enableNewsFeed';

/** This Kibana Advanced Setting enables the warnings for CCS read permissions */
exports.ENABLE_NEWS_FEED_SETTING = ENABLE_NEWS_FEED_SETTING;
const ENABLE_CCS_READ_WARNING_SETTING = 'securitySolution:enableCcsWarning';

/** This Kibana Advanced Setting sets the auto refresh interval for the detections all rules table */
exports.ENABLE_CCS_READ_WARNING_SETTING = ENABLE_CCS_READ_WARNING_SETTING;
const DEFAULT_RULES_TABLE_REFRESH_SETTING = 'securitySolution:rulesTableRefresh';

/** This Kibana Advanced Setting specifies the URL of the News feed widget */
exports.DEFAULT_RULES_TABLE_REFRESH_SETTING = DEFAULT_RULES_TABLE_REFRESH_SETTING;
const NEWS_FEED_URL_SETTING = 'securitySolution:newsFeedUrl';

/** The default value for News feed widget */
exports.NEWS_FEED_URL_SETTING = NEWS_FEED_URL_SETTING;
const NEWS_FEED_URL_SETTING_DEFAULT = 'https://feeds.elastic.co/security-solution';

/** This Kibana Advanced Setting specifies the URLs of `IP Reputation Links`*/
exports.NEWS_FEED_URL_SETTING_DEFAULT = NEWS_FEED_URL_SETTING_DEFAULT;
const IP_REPUTATION_LINKS_SETTING = 'securitySolution:ipReputationLinks';

/** The default value for `IP Reputation Links` */
exports.IP_REPUTATION_LINKS_SETTING = IP_REPUTATION_LINKS_SETTING;
const IP_REPUTATION_LINKS_SETTING_DEFAULT = `[
  { "name": "virustotal.com", "url_template": "https://www.virustotal.com/gui/search/{{ip}}" },
  { "name": "talosIntelligence.com", "url_template": "https://talosintelligence.com/reputation_center/lookup?search={{ip}}" }
]`;

/** This Kibana Advanced Setting shows related integrations on the Rules Table */
exports.IP_REPUTATION_LINKS_SETTING_DEFAULT = IP_REPUTATION_LINKS_SETTING_DEFAULT;
const SHOW_RELATED_INTEGRATIONS_SETTING = 'securitySolution:showRelatedIntegrations';

/** This Kibana Advanced Setting enables extended rule execution logging to Event Log */
exports.SHOW_RELATED_INTEGRATIONS_SETTING = SHOW_RELATED_INTEGRATIONS_SETTING;
const EXTENDED_RULE_EXECUTION_LOGGING_ENABLED_SETTING = 'securitySolution:extendedRuleExecutionLoggingEnabled';

/** This Kibana Advanced Setting sets minimum log level starting from which execution logs will be written to Event Log */
exports.EXTENDED_RULE_EXECUTION_LOGGING_ENABLED_SETTING = EXTENDED_RULE_EXECUTION_LOGGING_ENABLED_SETTING;
const EXTENDED_RULE_EXECUTION_LOGGING_MIN_LEVEL_SETTING = 'securitySolution:extendedRuleExecutionLoggingMinLevel';

/**
 * Id for the notifications alerting type
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
exports.EXTENDED_RULE_EXECUTION_LOGGING_MIN_LEVEL_SETTING = EXTENDED_RULE_EXECUTION_LOGGING_MIN_LEVEL_SETTING;
const LEGACY_NOTIFICATIONS_ID = `siem.notifications`;

/**
 * Internal actions route
 */
exports.LEGACY_NOTIFICATIONS_ID = LEGACY_NOTIFICATIONS_ID;
const UPDATE_OR_CREATE_LEGACY_ACTIONS = '/internal/api/detection/legacy/notifications';

/**
 * Exceptions management routes
 */
exports.UPDATE_OR_CREATE_LEGACY_ACTIONS = UPDATE_OR_CREATE_LEGACY_ACTIONS;
const SHARED_EXCEPTION_LIST_URL = `/api${EXCEPTIONS_PATH}/shared`;

/**
 * Detection engine routes
 */
exports.SHARED_EXCEPTION_LIST_URL = SHARED_EXCEPTION_LIST_URL;
const DETECTION_ENGINE_URL = '/api/detection_engine';
exports.DETECTION_ENGINE_URL = DETECTION_ENGINE_URL;
const DETECTION_ENGINE_PRIVILEGES_URL = `${DETECTION_ENGINE_URL}/privileges`;
exports.DETECTION_ENGINE_PRIVILEGES_URL = DETECTION_ENGINE_PRIVILEGES_URL;
const DETECTION_ENGINE_INDEX_URL = `${DETECTION_ENGINE_URL}/index`;
exports.DETECTION_ENGINE_INDEX_URL = DETECTION_ENGINE_INDEX_URL;
const DETECTION_ENGINE_RULES_URL = `${DETECTION_ENGINE_URL}/rules`;
exports.DETECTION_ENGINE_RULES_URL = DETECTION_ENGINE_RULES_URL;
const DETECTION_ENGINE_RULES_URL_FIND = `${DETECTION_ENGINE_RULES_URL}/_find`;
exports.DETECTION_ENGINE_RULES_URL_FIND = DETECTION_ENGINE_RULES_URL_FIND;
const DETECTION_ENGINE_TAGS_URL = `${DETECTION_ENGINE_URL}/tags`;
exports.DETECTION_ENGINE_TAGS_URL = DETECTION_ENGINE_TAGS_URL;
const DETECTION_ENGINE_RULES_BULK_ACTION = `${DETECTION_ENGINE_RULES_URL}/_bulk_action`;
exports.DETECTION_ENGINE_RULES_BULK_ACTION = DETECTION_ENGINE_RULES_BULK_ACTION;
const DETECTION_ENGINE_RULES_PREVIEW = `${DETECTION_ENGINE_RULES_URL}/preview`;
exports.DETECTION_ENGINE_RULES_PREVIEW = DETECTION_ENGINE_RULES_PREVIEW;
const DETECTION_ENGINE_RULES_BULK_DELETE = `${DETECTION_ENGINE_RULES_URL}/_bulk_delete`;
exports.DETECTION_ENGINE_RULES_BULK_DELETE = DETECTION_ENGINE_RULES_BULK_DELETE;
const DETECTION_ENGINE_RULES_BULK_CREATE = `${DETECTION_ENGINE_RULES_URL}/_bulk_create`;
exports.DETECTION_ENGINE_RULES_BULK_CREATE = DETECTION_ENGINE_RULES_BULK_CREATE;
const DETECTION_ENGINE_RULES_BULK_UPDATE = `${DETECTION_ENGINE_RULES_URL}/_bulk_update`;
exports.DETECTION_ENGINE_RULES_BULK_UPDATE = DETECTION_ENGINE_RULES_BULK_UPDATE;
const INTERNAL_RISK_SCORE_URL = '/internal/risk_score';
exports.INTERNAL_RISK_SCORE_URL = INTERNAL_RISK_SCORE_URL;
const DEV_TOOL_PREBUILT_CONTENT = `${INTERNAL_RISK_SCORE_URL}/prebuilt_content/dev_tool/{console_id}`;
exports.DEV_TOOL_PREBUILT_CONTENT = DEV_TOOL_PREBUILT_CONTENT;
const devToolPrebuiltContentUrl = (spaceId, consoleId) => `/s/${spaceId}${INTERNAL_RISK_SCORE_URL}/prebuilt_content/dev_tool/${consoleId}`;
exports.devToolPrebuiltContentUrl = devToolPrebuiltContentUrl;
const PREBUILT_SAVED_OBJECTS_BULK_CREATE = `${INTERNAL_RISK_SCORE_URL}/prebuilt_content/saved_objects/_bulk_create/{template_name}`;
exports.PREBUILT_SAVED_OBJECTS_BULK_CREATE = PREBUILT_SAVED_OBJECTS_BULK_CREATE;
const prebuiltSavedObjectsBulkCreateUrl = templateName => `${INTERNAL_RISK_SCORE_URL}/prebuilt_content/saved_objects/_bulk_create/${templateName}`;
exports.prebuiltSavedObjectsBulkCreateUrl = prebuiltSavedObjectsBulkCreateUrl;
const PREBUILT_SAVED_OBJECTS_BULK_DELETE = `${INTERNAL_RISK_SCORE_URL}/prebuilt_content/saved_objects/_bulk_delete/{template_name}`;
exports.PREBUILT_SAVED_OBJECTS_BULK_DELETE = PREBUILT_SAVED_OBJECTS_BULK_DELETE;
const prebuiltSavedObjectsBulkDeleteUrl = templateName => `${INTERNAL_RISK_SCORE_URL}/prebuilt_content/saved_objects/_bulk_delete/${templateName}`;
exports.prebuiltSavedObjectsBulkDeleteUrl = prebuiltSavedObjectsBulkDeleteUrl;
const RISK_SCORE_CREATE_INDEX = `${INTERNAL_RISK_SCORE_URL}/indices/create`;
exports.RISK_SCORE_CREATE_INDEX = RISK_SCORE_CREATE_INDEX;
const RISK_SCORE_DELETE_INDICES = `${INTERNAL_RISK_SCORE_URL}/indices/delete`;
exports.RISK_SCORE_DELETE_INDICES = RISK_SCORE_DELETE_INDICES;
const RISK_SCORE_CREATE_STORED_SCRIPT = `${INTERNAL_RISK_SCORE_URL}/stored_scripts/create`;
exports.RISK_SCORE_CREATE_STORED_SCRIPT = RISK_SCORE_CREATE_STORED_SCRIPT;
const RISK_SCORE_DELETE_STORED_SCRIPT = `${INTERNAL_RISK_SCORE_URL}/stored_scripts/delete`;
/**
 * Internal detection engine routes
 */
exports.RISK_SCORE_DELETE_STORED_SCRIPT = RISK_SCORE_DELETE_STORED_SCRIPT;
const INTERNAL_DETECTION_ENGINE_URL = '/internal/detection_engine';
exports.INTERNAL_DETECTION_ENGINE_URL = INTERNAL_DETECTION_ENGINE_URL;
const DETECTION_ENGINE_ALERTS_INDEX_URL = `${INTERNAL_DETECTION_ENGINE_URL}/signal/index`;

/**
 * Telemetry detection endpoint for any previews requested of what data we are
 * providing through UI/UX and for e2e tests.
 *   curl http//localhost:5601/internal/security_solution/telemetry
 * to see the contents
 */
exports.DETECTION_ENGINE_ALERTS_INDEX_URL = DETECTION_ENGINE_ALERTS_INDEX_URL;
const SECURITY_TELEMETRY_URL = `/internal/security_solution/telemetry`;
exports.SECURITY_TELEMETRY_URL = SECURITY_TELEMETRY_URL;
const TIMELINE_RESOLVE_URL = '/api/timeline/resolve';
exports.TIMELINE_RESOLVE_URL = TIMELINE_RESOLVE_URL;
const TIMELINE_URL = '/api/timeline';
exports.TIMELINE_URL = TIMELINE_URL;
const TIMELINES_URL = '/api/timelines';
exports.TIMELINES_URL = TIMELINES_URL;
const TIMELINE_FAVORITE_URL = '/api/timeline/_favorite';
exports.TIMELINE_FAVORITE_URL = TIMELINE_FAVORITE_URL;
const TIMELINE_DRAFT_URL = `${TIMELINE_URL}/_draft`;
exports.TIMELINE_DRAFT_URL = TIMELINE_DRAFT_URL;
const TIMELINE_EXPORT_URL = `${TIMELINE_URL}/_export`;
exports.TIMELINE_EXPORT_URL = TIMELINE_EXPORT_URL;
const TIMELINE_IMPORT_URL = `${TIMELINE_URL}/_import`;
exports.TIMELINE_IMPORT_URL = TIMELINE_IMPORT_URL;
const TIMELINE_PREPACKAGED_URL = `${TIMELINE_URL}/_prepackaged`;
exports.TIMELINE_PREPACKAGED_URL = TIMELINE_PREPACKAGED_URL;
const NOTE_URL = '/api/note';
exports.NOTE_URL = NOTE_URL;
const PINNED_EVENT_URL = '/api/pinned_event';
exports.PINNED_EVENT_URL = PINNED_EVENT_URL;
const SOURCERER_API_URL = '/internal/security_solution/sourcerer';
exports.SOURCERER_API_URL = SOURCERER_API_URL;
const RISK_SCORE_INDEX_STATUS_API_URL = '/internal/risk_score/index_status';

/**
 * Default signals index key for kibana.dev.yml
 */
exports.RISK_SCORE_INDEX_STATUS_API_URL = RISK_SCORE_INDEX_STATUS_API_URL;
const SIGNALS_INDEX_KEY = 'signalsIndex';
exports.SIGNALS_INDEX_KEY = SIGNALS_INDEX_KEY;
const DETECTION_ENGINE_SIGNALS_URL = `${DETECTION_ENGINE_URL}/signals`;
exports.DETECTION_ENGINE_SIGNALS_URL = DETECTION_ENGINE_SIGNALS_URL;
const DETECTION_ENGINE_SIGNALS_STATUS_URL = `${DETECTION_ENGINE_SIGNALS_URL}/status`;
exports.DETECTION_ENGINE_SIGNALS_STATUS_URL = DETECTION_ENGINE_SIGNALS_STATUS_URL;
const DETECTION_ENGINE_QUERY_SIGNALS_URL = `${DETECTION_ENGINE_SIGNALS_URL}/search`;
exports.DETECTION_ENGINE_QUERY_SIGNALS_URL = DETECTION_ENGINE_QUERY_SIGNALS_URL;
const DETECTION_ENGINE_SIGNALS_MIGRATION_URL = `${DETECTION_ENGINE_SIGNALS_URL}/migration`;
exports.DETECTION_ENGINE_SIGNALS_MIGRATION_URL = DETECTION_ENGINE_SIGNALS_MIGRATION_URL;
const DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL = `${DETECTION_ENGINE_SIGNALS_URL}/migration_status`;
exports.DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL = DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL;
const DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL = `${DETECTION_ENGINE_SIGNALS_URL}/finalize_migration`;
exports.DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL = DETECTION_ENGINE_SIGNALS_FINALIZE_MIGRATION_URL;
const ALERTS_AS_DATA_URL = '/internal/rac/alerts';
exports.ALERTS_AS_DATA_URL = ALERTS_AS_DATA_URL;
const ALERTS_AS_DATA_FIND_URL = `${ALERTS_AS_DATA_URL}/find`;

/**
 * Common naming convention for an unauthenticated user
 */
exports.ALERTS_AS_DATA_FIND_URL = ALERTS_AS_DATA_FIND_URL;
const UNAUTHENTICATED_USER = 'Unauthenticated';

/*
  Licensing requirements
 */
exports.UNAUTHENTICATED_USER = UNAUTHENTICATED_USER;
const MINIMUM_ML_LICENSE = 'platinum';

/*
  Machine Learning constants
 */
exports.MINIMUM_ML_LICENSE = MINIMUM_ML_LICENSE;
const ML_GROUP_ID = 'security';
exports.ML_GROUP_ID = ML_GROUP_ID;
const LEGACY_ML_GROUP_ID = 'siem';
exports.LEGACY_ML_GROUP_ID = LEGACY_ML_GROUP_ID;
const ML_GROUP_IDS = [ML_GROUP_ID, LEGACY_ML_GROUP_ID];
exports.ML_GROUP_IDS = ML_GROUP_IDS;
const NOTIFICATION_THROTTLE_NO_ACTIONS = 'no_actions';
exports.NOTIFICATION_THROTTLE_NO_ACTIONS = NOTIFICATION_THROTTLE_NO_ACTIONS;
const NOTIFICATION_THROTTLE_RULE = 'rule';
exports.NOTIFICATION_THROTTLE_RULE = NOTIFICATION_THROTTLE_RULE;
const showAllOthersBucket = ['destination.ip', 'event.action', 'event.category', 'event.dataset', 'event.module', 'signal.rule.threat.tactic.name', 'source.ip', 'destination.ip', 'user.name'];
exports.showAllOthersBucket = showAllOthersBucket;
const RISKY_HOSTS_INDEX_PREFIX = 'ml_host_risk_score_';
exports.RISKY_HOSTS_INDEX_PREFIX = RISKY_HOSTS_INDEX_PREFIX;
const RISKY_USERS_INDEX_PREFIX = 'ml_user_risk_score_';
exports.RISKY_USERS_INDEX_PREFIX = RISKY_USERS_INDEX_PREFIX;
const TRANSFORM_STATES = {
  ABORTING: 'aborting',
  FAILED: 'failed',
  INDEXING: 'indexing',
  STARTED: 'started',
  STOPPED: 'stopped',
  STOPPING: 'stopping',
  WAITING: 'waiting'
};
exports.TRANSFORM_STATES = TRANSFORM_STATES;
const WARNING_TRANSFORM_STATES = new Set([TRANSFORM_STATES.ABORTING, TRANSFORM_STATES.FAILED, TRANSFORM_STATES.STOPPED, TRANSFORM_STATES.STOPPING]);
exports.WARNING_TRANSFORM_STATES = WARNING_TRANSFORM_STATES;
const STARTED_TRANSFORM_STATES = new Set([TRANSFORM_STATES.INDEXING, TRANSFORM_STATES.STARTED]);

/**
 * How many rules to update at a time is set to 50 from errors coming from
 * the slow environments such as cloud when the rule updates are > 100 we were
 * seeing timeout issues.
 *
 * Since there is not timeout options at the alerting API level right now, we are
 * at the mercy of the Elasticsearch server client/server default timeouts and what
 * we are doing could be considered a workaround to not being able to increase the timeouts.
 *
 * However, other bad effects and saturation of connections beyond 50 makes this a "noisy neighbor"
 * if we don't limit its number of connections as we increase the number of rules that can be
 * installed at a time.
 *
 * Lastly, we saw weird issues where Chrome on upstream 408 timeouts will re-call the REST route
 * which in turn could create additional connections we want to avoid.
 *
 * See file import_rules_route.ts for another area where 50 was chosen, therefore I chose
 * 50 here to mimic it as well. If you see this re-opened or what similar to it, consider
 * reducing the 50 above to a lower number.
 *
 * See the original ticket here:
 * https://github.com/elastic/kibana/issues/94418
 */
exports.STARTED_TRANSFORM_STATES = STARTED_TRANSFORM_STATES;
const MAX_RULES_TO_UPDATE_IN_PARALLEL = 50;
exports.MAX_RULES_TO_UPDATE_IN_PARALLEL = MAX_RULES_TO_UPDATE_IN_PARALLEL;
const LIMITED_CONCURRENCY_ROUTE_TAG_PREFIX = `${APP_ID}:limitedConcurrency`;

/**
 * Max number of rules to display on UI in table, max number of rules that can be edited in a single bulk edit API request
 * We limit number of rules in bulk edit API, because rulesClient doesn't support bulkGet of rules by ids.
 * Given this limitation, current implementation fetches each rule separately through rulesClient.resolve method.
 * As max number of rules displayed on a page is 100, max 100 rules can be bulk edited by passing their ids to API.
 * We decided add this limit(number of ids less than 100) in bulk edit API as well, to prevent a huge number of single rule fetches
 */
exports.LIMITED_CONCURRENCY_ROUTE_TAG_PREFIX = LIMITED_CONCURRENCY_ROUTE_TAG_PREFIX;
const RULES_TABLE_MAX_PAGE_SIZE = 100;
exports.RULES_TABLE_MAX_PAGE_SIZE = RULES_TABLE_MAX_PAGE_SIZE;
const RULES_TABLE_PAGE_SIZE_OPTIONS = [5, 10, 20, 50, RULES_TABLE_MAX_PAGE_SIZE];

/**
 * Local storage keys we use to store the state of our new features tours we currently show in the app.
 *
 * NOTE: As soon as we want to show tours for new features in the upcoming release,
 * we will need to update these constants with the corresponding version.
 */
exports.RULES_TABLE_PAGE_SIZE_OPTIONS = RULES_TABLE_PAGE_SIZE_OPTIONS;
const NEW_FEATURES_TOUR_STORAGE_KEYS = {
  RULE_MANAGEMENT_PAGE: 'securitySolution.rulesManagementPage.newFeaturesTour.v8.6'
};
exports.NEW_FEATURES_TOUR_STORAGE_KEYS = NEW_FEATURES_TOUR_STORAGE_KEYS;
const RULE_DETAILS_EXECUTION_LOG_TABLE_SHOW_METRIC_COLUMNS_STORAGE_KEY = 'securitySolution.ruleDetails.ruleExecutionLog.showMetrics.v8.2';

// TODO: https://github.com/elastic/kibana/pull/142950
/**
 * Error codes that can be thrown during _bulk_action API dry_run call and be processed and displayed to end user
 */
exports.RULE_DETAILS_EXECUTION_LOG_TABLE_SHOW_METRIC_COLUMNS_STORAGE_KEY = RULE_DETAILS_EXECUTION_LOG_TABLE_SHOW_METRIC_COLUMNS_STORAGE_KEY;
let BulkActionsDryRunErrCode;
exports.BulkActionsDryRunErrCode = BulkActionsDryRunErrCode;
(function (BulkActionsDryRunErrCode) {
  BulkActionsDryRunErrCode["IMMUTABLE"] = "IMMUTABLE";
  BulkActionsDryRunErrCode["MACHINE_LEARNING_AUTH"] = "MACHINE_LEARNING_AUTH";
  BulkActionsDryRunErrCode["MACHINE_LEARNING_INDEX_PATTERN"] = "MACHINE_LEARNING_INDEX_PATTERN";
})(BulkActionsDryRunErrCode || (exports.BulkActionsDryRunErrCode = BulkActionsDryRunErrCode = {}));
const RISKY_HOSTS_DOC_LINK = 'https://www.elastic.co/guide/en/security/current/host-risk-score.html';
exports.RISKY_HOSTS_DOC_LINK = RISKY_HOSTS_DOC_LINK;
const RISKY_USERS_DOC_LINK = 'https://www.elastic.co/guide/en/security/current/user-risk-score.html';
exports.RISKY_USERS_DOC_LINK = RISKY_USERS_DOC_LINK;
const MAX_NUMBER_OF_NEW_TERMS_FIELDS = 3;
exports.MAX_NUMBER_OF_NEW_TERMS_FIELDS = MAX_NUMBER_OF_NEW_TERMS_FIELDS;
const BULK_ADD_TO_TIMELINE_LIMIT = 2000;
exports.BULK_ADD_TO_TIMELINE_LIMIT = BULK_ADD_TO_TIMELINE_LIMIT;