"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TELEMETRY_CHANNEL_TIMELINE = exports.TELEMETRY_CHANNEL_LISTS = exports.TELEMETRY_CHANNEL_ENDPOINT_META = exports.TELEMETRY_CHANNEL_DETECTION_ALERTS = exports.TASK_METRICS_CHANNEL = exports.LIST_TRUSTED_APPLICATION = exports.LIST_ENDPOINT_EXCEPTION = exports.LIST_ENDPOINT_EVENT_FILTER = exports.LIST_DETECTION_RULE_EXCEPTION = exports.INSIGHTS_CHANNEL = exports.DEFAULT_ADVANCED_POLICY_CONFIG_SETTINGS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TELEMETRY_CHANNEL_LISTS = 'security-lists-v2';
exports.TELEMETRY_CHANNEL_LISTS = TELEMETRY_CHANNEL_LISTS;
const TELEMETRY_CHANNEL_ENDPOINT_META = 'endpoint-metadata';
exports.TELEMETRY_CHANNEL_ENDPOINT_META = TELEMETRY_CHANNEL_ENDPOINT_META;
const TELEMETRY_CHANNEL_DETECTION_ALERTS = 'alerts-detections';
exports.TELEMETRY_CHANNEL_DETECTION_ALERTS = TELEMETRY_CHANNEL_DETECTION_ALERTS;
const TELEMETRY_CHANNEL_TIMELINE = 'alerts-timeline';
exports.TELEMETRY_CHANNEL_TIMELINE = TELEMETRY_CHANNEL_TIMELINE;
const LIST_DETECTION_RULE_EXCEPTION = 'detection_rule_exception';
exports.LIST_DETECTION_RULE_EXCEPTION = LIST_DETECTION_RULE_EXCEPTION;
const LIST_ENDPOINT_EXCEPTION = 'endpoint_exception';
exports.LIST_ENDPOINT_EXCEPTION = LIST_ENDPOINT_EXCEPTION;
const LIST_ENDPOINT_EVENT_FILTER = 'endpoint_event_filter';
exports.LIST_ENDPOINT_EVENT_FILTER = LIST_ENDPOINT_EVENT_FILTER;
const LIST_TRUSTED_APPLICATION = 'trusted_application';
exports.LIST_TRUSTED_APPLICATION = LIST_TRUSTED_APPLICATION;
const INSIGHTS_CHANNEL = 'security-insights-v1';
exports.INSIGHTS_CHANNEL = INSIGHTS_CHANNEL;
const TASK_METRICS_CHANNEL = 'task-metrics';
exports.TASK_METRICS_CHANNEL = TASK_METRICS_CHANNEL;
const DEFAULT_ADVANCED_POLICY_CONFIG_SETTINGS = {
  linux: {
    advanced: {
      agent: {
        connection_delay: null
      },
      alerts: {
        require_user_artifacts: null
      },
      artifacts: {
        global: {
          base_url: null,
          manifest_relative_url: null,
          public_key: null,
          interval: null,
          ca_cert: null
        },
        user: {
          public_key: null,
          ca_cert: null,
          base_url: null,
          interval: null
        }
      },
      elasticsearch: {
        delay: null,
        tls: {
          verify_peer: null,
          verify_hostname: null,
          ca_cert: null
        }
      },
      fanotify: {
        ignore_unknown_filesystems: null,
        monitored_filesystems: null,
        ignored_filesystems: null
      },
      logging: {
        file: null,
        stdout: null,
        stderr: null,
        syslog: null
      },
      diagnostic: {
        enabled: null
      },
      malware: {
        quarantine: null
      },
      memory_protection: {
        memory_scan_collect_sample: null,
        memory_scan: null
      },
      kernel: {
        capture_mode: null
      },
      event_filter: {
        default: null
      },
      utilization_limits: {
        cpu: null
      },
      logstash: {
        delay: null
      }
    }
  },
  mac: {
    advanced: {
      agent: {
        connection_delay: null
      },
      artifacts: {
        global: {
          base_url: null,
          manifest_relative_url: null,
          public_key: null,
          interval: null,
          ca_cert: null
        },
        user: {
          public_key: null,
          ca_cert: null,
          base_url: null,
          interval: null
        }
      },
      elasticsearch: {
        delay: null,
        tls: {
          verify_peer: null,
          verify_hostname: null,
          ca_cert: null
        }
      },
      logging: {
        file: null,
        stdout: null,
        stderr: null,
        syslog: null
      },
      logstash: {
        delay: null
      },
      malware: {
        quarantine: null,
        threshold: null
      },
      kernel: {
        connect: null,
        harden: null,
        process: null,
        filewrite: null,
        network: null,
        network_extension: {
          enable_content_filtering: null,
          enable_packet_filtering: null
        }
      },
      harden: {
        self_protect: null
      },
      diagnostic: {
        enabled: null
      },
      alerts: {
        cloud_lookup: null,
        cloud_lookup_url: null
      },
      memory_protection: {
        memory_scan_collect_sample: false,
        memory_scan: null
      },
      event_filter: {
        default: null
      }
    }
  },
  windows: {
    advanced: {
      agent: {
        connection_delay: null
      },
      artifacts: {
        global: {
          base_url: null,
          manifest_relative_url: null,
          public_key: null,
          interval: null,
          ca_cert: null
        },
        user: {
          public_key: null,
          ca_cert: null,
          base_url: null,
          interval: null
        }
      },
      elasticsearch: {
        delay: null,
        tls: {
          verify_peer: null,
          verify_hostname: null,
          ca_cert: null
        }
      },
      logging: {
        file: null,
        stdout: null,
        stderr: null,
        syslog: null
      },
      malware: {
        quarantine: null,
        threshold: null
      },
      kernel: {
        connect: null,
        harden: null,
        process: null,
        filewrite: null,
        network: null,
        fileopen: null,
        asyncimageload: null,
        syncimageload: null,
        registry: null,
        fileaccess: null,
        registryaccess: null,
        process_handle: null
      },
      diagnostic: {
        enabled: null,
        rollback_telemetry_enabled: null
      },
      alerts: {
        cloud_lookup: null,
        cloud_lookup_url: null,
        require_user_artifacts: null
      },
      ransomware: {
        mbr: null,
        canary: null
      },
      memory_protection: {
        context_manipulation_detection: null,
        shellcode: null,
        memory_scan: null,
        shellcode_collect_sample: null,
        memory_scan_collect_sample: null,
        shellcode_enhanced_pe_parsing: null,
        shellcode_trampoline_detection: null
      },
      event_filter: {
        default: null
      },
      utilization_limits: {
        cpu: null
      }
    }
  }
};
exports.DEFAULT_ADVANCED_POLICY_CONFIG_SETTINGS = DEFAULT_ADVANCED_POLICY_CONFIG_SETTINGS;