"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCrawlerRoutes = registerCrawlerRoutes;
var _configSchema = require("@kbn/config-schema");
var _i18n = require("@kbn/i18n");
var _constants = require("../../../../common/constants");
var _error_codes = require("../../../../common/types/error_codes");
var _add_connector = require("../../../lib/connectors/add_connector");
var _delete_connector = require("../../../lib/connectors/delete_connector");
var _fetch_connectors = require("../../../lib/connectors/fetch_connectors");
var _fetch_crawlers = require("../../../lib/crawler/fetch_crawlers");
var _delete_index = require("../../../lib/indices/delete_index");
var _create_error = require("../../../utils/create_error");
var _elasticsearch_error_handler = require("../../../utils/elasticsearch_error_handler");
var _crawler_crawl_rules = require("./crawler_crawl_rules");
var _crawler_entry_points = require("./crawler_entry_points");
var _crawler_sitemaps = require("./crawler_sitemaps");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerCrawlerRoutes(routeDependencies) {
  const {
    router,
    enterpriseSearchRequestHandler,
    log
  } = routeDependencies;
  router.post({
    path: '/internal/enterprise_search/crawler',
    validate: {
      body: _configSchema.schema.object({
        index_name: _configSchema.schema.string(),
        language: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.literal(null)])
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const connParams = {
      delete_existing_connector: true,
      index_name: request.body.index_name,
      is_native: true,
      language: request.body.language,
      service_type: _constants.ENTERPRISE_SEARCH_CONNECTOR_CRAWLER_SERVICE_TYPE
    };
    const {
      client
    } = (await context.core).elasticsearch;
    const indexExists = await client.asCurrentUser.indices.exists({
      index: request.body.index_name
    });
    if (indexExists) {
      return (0, _create_error.createError)({
        errorCode: _error_codes.ErrorCode.INDEX_ALREADY_EXISTS,
        message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.addCrawler.indexExistsError', {
          defaultMessage: 'This index already exists'
        }),
        response,
        statusCode: 409
      });
    }
    const crawler = await (0, _fetch_crawlers.fetchCrawlerByIndexName)(client, request.body.index_name);
    if (crawler) {
      return (0, _create_error.createError)({
        errorCode: _error_codes.ErrorCode.CRAWLER_ALREADY_EXISTS,
        message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.addCrawler.crawlerExistsError', {
          defaultMessage: 'A crawler for this index already exists'
        }),
        response,
        statusCode: 409
      });
    }
    const connector = await (0, _fetch_connectors.fetchConnectorByIndexName)(client, request.body.index_name);
    if (connector) {
      return (0, _create_error.createError)({
        errorCode: _error_codes.ErrorCode.CONNECTOR_DOCUMENT_ALREADY_EXISTS,
        message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.addCrawler.connectorExistsError', {
          defaultMessage: 'A connector for this index already exists'
        }),
        response,
        statusCode: 409
      });
    }
    try {
      await (0, _add_connector.addConnector)(client, connParams);
      const res = await enterpriseSearchRequestHandler.createRequest({
        path: '/api/ent/v1/internal/indices'
      })(context, request, response);
      if (res.status !== 200) {
        throw new Error(res.payload.message);
      }
      return res;
    } catch (error) {
      // clean up connector index if it was created
      const createdConnector = await (0, _fetch_connectors.fetchConnectorByIndexName)(client, request.body.index_name);
      if (createdConnector) {
        await (0, _delete_connector.deleteConnectorById)(client, createdConnector.id);
        await (0, _delete_index.deleteIndex)(client, createdConnector.index_name);
      }
      throw error;
    }
  }));
  router.post({
    path: '/internal/enterprise_search/crawler/validate_url',
    validate: {
      body: _configSchema.schema.object({
        checks: _configSchema.schema.arrayOf(_configSchema.schema.string()),
        url: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/crawler2/validate_url'
  }));
  router.get({
    path: '/internal/enterprise_search/indices/{indexName}/crawler',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2'
  }));
  router.post({
    path: '/internal/enterprise_search/indices/{indexName}/crawler/crawl_requests',
    validate: {
      body: _configSchema.schema.object({
        overrides: _configSchema.schema.maybe(_configSchema.schema.object({
          domain_allowlist: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
          max_crawl_depth: _configSchema.schema.maybe(_configSchema.schema.number()),
          seed_urls: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
          sitemap_discovery_disabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
          sitemap_urls: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
        }))
      }),
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2/crawl_requests'
  }));
  router.post({
    path: '/internal/enterprise_search/indices/{indexName}/crawler/crawl_requests/cancel',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2/crawl_requests/active/cancel'
  }));
  router.get({
    path: '/internal/enterprise_search/indices/{indexName}/crawler/crawl_requests/{crawlRequestId}',
    validate: {
      params: _configSchema.schema.object({
        crawlRequestId: _configSchema.schema.string(),
        indexName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2/crawl_requests/:crawlRequestId'
  }));
  router.get({
    path: '/internal/enterprise_search/indices/{indexName}/crawler/domains',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        'page[current]': _configSchema.schema.number(),
        'page[size]': _configSchema.schema.number()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2/domains'
  }));
  router.post({
    path: '/internal/enterprise_search/indices/{indexName}/crawler/domains',
    validate: {
      body: _configSchema.schema.object({
        entry_points: _configSchema.schema.arrayOf(_configSchema.schema.object({
          value: _configSchema.schema.string()
        })),
        name: _configSchema.schema.string()
      }),
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2/domains'
  }));
  router.get({
    path: '/internal/enterprise_search/indices/{indexName}/crawler/domains/{domainId}',
    validate: {
      params: _configSchema.schema.object({
        domainId: _configSchema.schema.string(),
        indexName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2/domains/:domainId'
  }));
  router.put({
    path: '/internal/enterprise_search/indices/{indexName}/crawler/domains/{domainId}',
    validate: {
      body: _configSchema.schema.object({
        auth: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.object({
          header: _configSchema.schema.maybe(_configSchema.schema.string()),
          password: _configSchema.schema.maybe(_configSchema.schema.string()),
          type: _configSchema.schema.string(),
          username: _configSchema.schema.maybe(_configSchema.schema.string())
        }))),
        crawl_rules: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
          id: _configSchema.schema.string(),
          order: _configSchema.schema.number()
        }))),
        deduplication_enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
        deduplication_fields: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
      }),
      params: _configSchema.schema.object({
        domainId: _configSchema.schema.string(),
        indexName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2/domains/:domainId'
  }));
  router.delete({
    path: '/internal/enterprise_search/indices/{indexName}/crawler/domains/{domainId}',
    validate: {
      params: _configSchema.schema.object({
        domainId: _configSchema.schema.string(),
        indexName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2/domains/:domainId'
  }));
  router.get({
    path: '/internal/enterprise_search/indices/{indexName}/crawler/domain_configs',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        'page[current]': _configSchema.schema.maybe(_configSchema.schema.number()),
        'page[size]': _configSchema.schema.maybe(_configSchema.schema.number())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2/domain_configs'
  }));
  router.post({
    path: '/internal/enterprise_search/indices/{indexName}/crawler/process_crawls',
    validate: {
      body: _configSchema.schema.object({
        domains: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
      }),
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2/process_crawls'
  }));
  router.get({
    path: '/internal/enterprise_search/indices/{indexName}/crawler/crawl_schedule',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2/crawl_schedule'
  }));
  router.put({
    path: '/internal/enterprise_search/indices/{indexName}/crawler/crawl_schedule',
    validate: {
      body: _configSchema.schema.object({
        frequency: _configSchema.schema.number(),
        unit: _configSchema.schema.string(),
        use_connector_schedule: _configSchema.schema.boolean()
      }),
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2/crawl_schedule'
  }));
  router.delete({
    path: '/internal/enterprise_search/indices/{indexName}/crawler/crawl_schedule',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/ent/v1/internal/indices/:indexName/crawler2/crawl_schedule'
  }));
  (0, _crawler_crawl_rules.registerCrawlerCrawlRulesRoutes)(routeDependencies);
  (0, _crawler_entry_points.registerCrawlerEntryPointRoutes)(routeDependencies);
  (0, _crawler_sitemaps.registerCrawlerSitemapRoutes)(routeDependencies);
}