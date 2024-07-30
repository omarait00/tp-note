"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.policyFactoryWithoutPaidFeatures = exports.policyFactoryWithSupportedFeatures = exports.policyFactory = exports.DefaultPolicyRuleNotificationMessage = exports.DefaultPolicyNotificationMessage = void 0;
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Return a new default `PolicyConfig` for platinum and above licenses
 */
const policyFactory = () => {
  return {
    windows: {
      events: {
        dll_and_driver_load: true,
        dns: true,
        file: true,
        network: true,
        process: true,
        registry: true,
        security: true
      },
      malware: {
        mode: _types.ProtectionModes.prevent,
        blocklist: true
      },
      ransomware: {
        mode: _types.ProtectionModes.prevent,
        supported: true
      },
      memory_protection: {
        mode: _types.ProtectionModes.prevent,
        supported: true
      },
      behavior_protection: {
        mode: _types.ProtectionModes.prevent,
        supported: true
      },
      popup: {
        malware: {
          message: '',
          enabled: true
        },
        ransomware: {
          message: '',
          enabled: true
        },
        memory_protection: {
          message: '',
          enabled: true
        },
        behavior_protection: {
          message: '',
          enabled: true
        }
      },
      logging: {
        file: 'info'
      },
      antivirus_registration: {
        enabled: false
      },
      attack_surface_reduction: {
        credential_hardening: {
          enabled: true
        }
      }
    },
    mac: {
      events: {
        process: true,
        file: true,
        network: true
      },
      malware: {
        mode: _types.ProtectionModes.prevent,
        blocklist: true
      },
      behavior_protection: {
        mode: _types.ProtectionModes.prevent,
        supported: true
      },
      memory_protection: {
        mode: _types.ProtectionModes.prevent,
        supported: true
      },
      popup: {
        malware: {
          message: '',
          enabled: true
        },
        behavior_protection: {
          message: '',
          enabled: true
        },
        memory_protection: {
          message: '',
          enabled: true
        }
      },
      logging: {
        file: 'info'
      }
    },
    linux: {
      events: {
        process: true,
        file: true,
        network: true,
        session_data: false,
        tty_io: false
      },
      malware: {
        mode: _types.ProtectionModes.prevent,
        blocklist: true
      },
      behavior_protection: {
        mode: _types.ProtectionModes.prevent,
        supported: true
      },
      memory_protection: {
        mode: _types.ProtectionModes.prevent,
        supported: true
      },
      popup: {
        malware: {
          message: '',
          enabled: true
        },
        behavior_protection: {
          message: '',
          enabled: true
        },
        memory_protection: {
          message: '',
          enabled: true
        }
      },
      logging: {
        file: 'info'
      }
    }
  };
};

/**
 * Strips paid features from an existing or new `PolicyConfig` for gold and below license
 */
exports.policyFactory = policyFactory;
const policyFactoryWithoutPaidFeatures = (policy = policyFactory()) => {
  const rollbackConfig = {
    rollback: {
      self_healing: {
        enabled: false
      }
    }
  };
  return {
    ...policy,
    windows: {
      ...policy.windows,
      advanced: policy.windows.advanced === undefined ? undefined : {
        ...policy.windows.advanced,
        alerts: policy.windows.advanced.alerts === undefined ? {
          ...rollbackConfig
        } : {
          ...policy.windows.advanced.alerts,
          ...rollbackConfig
        }
      },
      ransomware: {
        mode: _types.ProtectionModes.off,
        supported: false
      },
      memory_protection: {
        mode: _types.ProtectionModes.off,
        supported: false
      },
      behavior_protection: {
        mode: _types.ProtectionModes.off,
        supported: false
      },
      attack_surface_reduction: {
        credential_hardening: {
          enabled: false
        }
      },
      popup: {
        ...policy.windows.popup,
        malware: {
          message: '',
          enabled: true // disabling/configuring malware popup is a paid feature
        },

        ransomware: {
          message: '',
          enabled: false
        },
        memory_protection: {
          message: '',
          enabled: false
        },
        behavior_protection: {
          message: '',
          enabled: false
        }
      }
    },
    mac: {
      ...policy.mac,
      behavior_protection: {
        mode: _types.ProtectionModes.off,
        supported: false
      },
      memory_protection: {
        mode: _types.ProtectionModes.off,
        supported: false
      },
      popup: {
        ...policy.mac.popup,
        malware: {
          message: '',
          enabled: true // disabling/configuring malware popup is a paid feature
        },

        memory_protection: {
          message: '',
          enabled: false
        },
        behavior_protection: {
          message: '',
          enabled: false
        }
      }
    },
    linux: {
      ...policy.linux,
      behavior_protection: {
        mode: _types.ProtectionModes.off,
        supported: false
      },
      memory_protection: {
        mode: _types.ProtectionModes.off,
        supported: false
      },
      popup: {
        ...policy.linux.popup,
        malware: {
          message: '',
          enabled: true // disabling/configuring malware popup is a paid feature
        },

        memory_protection: {
          message: '',
          enabled: false
        },
        behavior_protection: {
          message: '',
          enabled: false
        }
      }
    }
  };
};

/**
 * Enables support for paid features for an existing or new `PolicyConfig` for platinum and above license
 */
exports.policyFactoryWithoutPaidFeatures = policyFactoryWithoutPaidFeatures;
const policyFactoryWithSupportedFeatures = (policy = policyFactory()) => {
  return {
    ...policy,
    windows: {
      ...policy.windows,
      ransomware: {
        ...policy.windows.ransomware,
        supported: true
      },
      memory_protection: {
        ...policy.windows.memory_protection,
        supported: true
      },
      behavior_protection: {
        ...policy.windows.behavior_protection,
        supported: true
      }
    },
    mac: {
      ...policy.mac,
      behavior_protection: {
        ...policy.windows.behavior_protection,
        supported: true
      },
      memory_protection: {
        ...policy.mac.memory_protection,
        supported: true
      }
    },
    linux: {
      ...policy.linux,
      behavior_protection: {
        ...policy.windows.behavior_protection,
        supported: true
      },
      memory_protection: {
        ...policy.linux.memory_protection,
        supported: true
      }
    }
  };
};

/**
 * Reflects what string the Endpoint will use when message field is default/empty
 */
exports.policyFactoryWithSupportedFeatures = policyFactoryWithSupportedFeatures;
const DefaultPolicyNotificationMessage = 'Elastic Security {action} {filename}';
exports.DefaultPolicyNotificationMessage = DefaultPolicyNotificationMessage;
const DefaultPolicyRuleNotificationMessage = 'Elastic Security {action} {rule}';
exports.DefaultPolicyRuleNotificationMessage = DefaultPolicyRuleNotificationMessage;