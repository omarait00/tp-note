"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEnterpriseSearchIntegrations = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const workplaceSearchIntegrations = [{
  id: 'box',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.boxName', {
    defaultMessage: 'Box'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.boxDescription', {
    defaultMessage: 'Search over your files and folders stored on Box with Workplace Search.'
  }),
  categories: ['file_storage']
}, {
  id: 'confluence_cloud',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.confluenceCloudName', {
    defaultMessage: 'Confluence Cloud'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.confluenceCloudDescription', {
    defaultMessage: 'Search over your organizational content on Confluence Cloud with Workplace Search.'
  }),
  categories: ['productivity']
}, {
  id: 'confluence_server',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.confluenceServerName', {
    defaultMessage: 'Confluence Server'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.confluenceServerDescription', {
    defaultMessage: 'Search over your organizational content on Confluence Server with Workplace Search.'
  }),
  categories: ['productivity']
}, {
  id: 'dropbox',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.dropboxName', {
    defaultMessage: 'Dropbox'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.dropboxDescription', {
    defaultMessage: 'Search over your files and folders stored on Dropbox with Workplace Search.'
  }),
  categories: ['file_storage']
}, {
  id: 'github',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.githubName', {
    defaultMessage: 'GitHub'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.githubDescription', {
    defaultMessage: 'Search over your projects and repos on GitHub with Workplace Search.'
  }),
  categories: ['productivity']
}, {
  id: 'github_enterprise_server',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.githubEnterpriseServerName', {
    defaultMessage: 'GitHub Enterprise Server'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.githubEnterpriseServerDescription', {
    defaultMessage: 'Search over your projects and repos on GitHub Enterprise Server with Workplace Search.'
  }),
  categories: ['productivity']
}, {
  id: 'gmail',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.gmailName', {
    defaultMessage: 'Gmail'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.gmailDescription', {
    defaultMessage: 'Search over your emails managed by Gmail with Workplace Search.'
  }),
  categories: ['communications']
}, {
  id: 'google_drive',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.googleDriveName', {
    defaultMessage: 'Google Drive'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.googleDriveDescription', {
    defaultMessage: 'Search over your documents on Google Drive with Workplace Search.'
  }),
  categories: ['file_storage']
}, {
  id: 'jira_cloud',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.jiraCloudName', {
    defaultMessage: 'Jira Cloud'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.jiraCloudDescription', {
    defaultMessage: 'Search over your project workflow on Jira Cloud with Workplace Search.'
  }),
  categories: ['productivity']
}, {
  id: 'jira_server',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.jiraServerName', {
    defaultMessage: 'Jira Server'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.jiraServerDescription', {
    defaultMessage: 'Search over your project workflow on Jira Server with Workplace Search.'
  }),
  categories: ['productivity']
}, {
  id: 'network_drive',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.networkDriveName', {
    defaultMessage: 'Network Drive'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.networkDriveDescription', {
    defaultMessage: 'Search over your files and folders stored on network drives with Workplace Search.'
  }),
  categories: ['file_storage'],
  uiInternalPath: '/app/enterprise_search/workplace_search/sources/add/network_drive/custom'
}, {
  id: 'onedrive',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.onedriveName', {
    defaultMessage: 'OneDrive'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.onedriveDescription', {
    defaultMessage: 'Search over your files stored on OneDrive with Workplace Search.'
  }),
  categories: ['file_storage'],
  uiInternalPath: '/app/enterprise_search/workplace_search/sources/add/one_drive'
}, {
  id: 'salesforce',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.salesforceName', {
    defaultMessage: 'Salesforce'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.salesforceDescription', {
    defaultMessage: 'Search over your content on Salesforce with Workplace Search.'
  }),
  categories: ['productivity']
}, {
  id: 'salesforce_sandbox',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.salesforceSandboxName', {
    defaultMessage: 'Salesforce Sandbox'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.salesforceSandboxDescription', {
    defaultMessage: 'Search over your content on Salesforce Sandbox with Workplace Search.'
  }),
  categories: ['productivity']
}, {
  id: 'servicenow',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.servicenowName', {
    defaultMessage: 'ServiceNow'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.servicenowDescription', {
    defaultMessage: 'Search over your content on ServiceNow with Workplace Search.'
  }),
  categories: ['productivity']
}, {
  id: 'sharepoint_online',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.sharepointOnlineName', {
    defaultMessage: 'SharePoint Online'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.sharepointOnlineDescription', {
    defaultMessage: 'Search over your files stored on SharePoint Online with Workplace Search.'
  }),
  categories: ['file_storage', 'microsoft_365'],
  uiInternalPath: '/app/enterprise_search/workplace_search/sources/add/share_point'
}, {
  id: 'sharepoint_server',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.sharepointServerName', {
    defaultMessage: 'SharePoint Server'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.sharepointServerDescription', {
    defaultMessage: 'Search over your files stored on Microsoft SharePoint Server with Workplace Search.'
  }),
  categories: ['file_storage', 'microsoft_365'],
  uiInternalPath: '/app/enterprise_search/workplace_search/sources/add/share_point_server/custom'
}, {
  id: 'slack',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.slackName', {
    defaultMessage: 'Slack'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.slackDescription', {
    defaultMessage: 'Search over your messages on Slack with Workplace Search.'
  }),
  categories: ['communications']
}, {
  id: 'zendesk',
  title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.zendeskName', {
    defaultMessage: 'Zendesk'
  }),
  description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.zendeskDescription', {
    defaultMessage: 'Search over your tickets on Zendesk with Workplace Search.'
  }),
  categories: ['communications']
}];
const registerEnterpriseSearchIntegrations = (http, customIntegrations) => {
  workplaceSearchIntegrations.forEach(integration => {
    customIntegrations.registerCustomIntegration({
      uiInternalPath: `/app/enterprise_search/workplace_search/sources/add/${integration.id}`,
      icons: [{
        type: 'svg',
        src: http.basePath.prepend(`/plugins/enterpriseSearch/assets/source_icons/${integration.id}.svg`)
      }],
      isBeta: false,
      shipper: 'enterprise_search',
      ...integration
    });
  });
  customIntegrations.registerCustomIntegration({
    id: 'app_search_json',
    title: _i18n.i18n.translate('xpack.enterpriseSearch.appSearch.integrations.jsonName', {
      defaultMessage: 'JSON'
    }),
    description: _i18n.i18n.translate('xpack.enterpriseSearch.appSearch.integrations.jsonDescription', {
      defaultMessage: 'Search over your JSON data with App Search.'
    }),
    categories: ['upload_file'],
    uiInternalPath: '/app/enterprise_search/app_search/engines/new?method=json',
    icons: [{
      type: 'eui',
      src: 'logoAppSearch'
    }],
    shipper: 'enterprise_search',
    isBeta: false
  });
  customIntegrations.registerCustomIntegration({
    id: 'web_crawler',
    title: _i18n.i18n.translate('xpack.enterpriseSearch.integrations.webCrawlerName', {
      defaultMessage: 'Web crawler'
    }),
    description: _i18n.i18n.translate('xpack.enterpriseSearch.integrations.webCrawlerDescription', {
      defaultMessage: 'Add search to your website with the Enterprise Search web crawler.'
    }),
    categories: ['enterprise_search', 'website_search', 'web', 'elastic_stack'],
    uiInternalPath: '/app/enterprise_search/content/search_indices/new_index?method=crawler',
    icons: [{
      type: 'eui',
      src: 'logoEnterpriseSearch'
    }],
    shipper: 'enterprise_search',
    isBeta: false
  });
  customIntegrations.registerCustomIntegration({
    id: 'api',
    title: _i18n.i18n.translate('xpack.enterpriseSearch.integrations.apiName', {
      defaultMessage: 'API'
    }),
    description: _i18n.i18n.translate('xpack.enterpriseSearch.integrations.apiDescription', {
      defaultMessage: "Add search to your application with Elasticsearch's robust APIs."
    }),
    categories: ['enterprise_search', 'custom', 'elastic_stack'],
    uiInternalPath: '/app/enterprise_search/content/search_indices/new_index?method=api',
    icons: [{
      type: 'eui',
      src: 'logoEnterpriseSearch'
    }],
    shipper: 'enterprise_search',
    isBeta: false
  });
  customIntegrations.registerCustomIntegration({
    id: 'build_a_connector',
    title: _i18n.i18n.translate('xpack.enterpriseSearch.integrations.buildAConnectorName', {
      defaultMessage: 'Build a connector'
    }),
    description: _i18n.i18n.translate('xpack.enterpriseSearch.integrations.buildAConnectorDescription', {
      defaultMessage: 'Search over data stored on custom data sources with Enterprise Search.'
    }),
    categories: ['enterprise_search', 'custom', 'elastic_stack'],
    uiInternalPath: '/app/enterprise_search/content/search_indices/new_index?method=connector',
    icons: [{
      type: 'eui',
      src: 'logoEnterpriseSearch'
    }],
    shipper: 'enterprise_search',
    isBeta: false
  });
  customIntegrations.registerCustomIntegration({
    id: 'native_connector',
    title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.nativeConnectorName', {
      defaultMessage: 'Use a connector'
    }),
    description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.nativeConnectorDescription', {
      defaultMessage: 'Search over your data sources with a native Enterprise Search connector.'
    }),
    categories: ['elastic_stack', 'enterprise_search'],
    uiInternalPath: '/app/enterprise_search/content/search_indices/new_index?method=native_connector',
    icons: [{
      type: 'eui',
      src: 'logoEnterpriseSearch'
    }],
    shipper: 'enterprise_search',
    isBeta: false
  });
  customIntegrations.registerCustomIntegration({
    id: 'mongodb',
    title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.mongoDBName', {
      defaultMessage: 'MongoDB'
    }),
    description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.mongoDBDescription', {
      defaultMessage: 'Search over your MongoDB content with Enterprise Search.'
    }),
    categories: ['datastore', 'enterprise_search'],
    uiInternalPath: '/app/enterprise_search/content/search_indices/new_index?method=native_connector',
    icons: [{
      type: 'svg',
      src: http.basePath.prepend('/plugins/enterpriseSearch/assets/source_icons/mongodb.svg')
    }],
    shipper: 'enterprise_search',
    isBeta: false
  });
  customIntegrations.registerCustomIntegration({
    id: 'mysql',
    title: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.mysqlName', {
      defaultMessage: 'MySQL'
    }),
    description: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.integrations.mysqlDescription', {
      defaultMessage: 'Search over your MySQL content with Enterprise Search.'
    }),
    categories: ['datastore', 'enterprise_search'],
    uiInternalPath: '/app/enterprise_search/content/search_indices/new_index?method=native_connector',
    icons: [{
      type: 'svg',
      src: http.basePath.prepend('/plugins/enterpriseSearch/assets/source_icons/mysql.svg')
    }],
    shipper: 'enterprise_search',
    isBeta: false
  });
};
exports.registerEnterpriseSearchIntegrations = registerEnterpriseSearchIntegrations;