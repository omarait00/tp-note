/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.security_bundle_jsonpfunction=window.security_bundle_jsonpfunction||[]).push([[17],{116:function(t,i,e){"use strict";e.r(i),e.d(i,"APIKeysAPIClient",(function(){return APIKeysAPIClient}));const n="/internal/security/api_key";class APIKeysAPIClient{constructor(t){this.http=t}async checkPrivileges(){return await this.http.get(`${n}/privileges`)}async getApiKeys(t=!1){return await this.http.get(n,{query:{isAdmin:t}})}async invalidateApiKeys(t,i=!1){return await this.http.post(`${n}/invalidate`,{body:JSON.stringify({apiKeys:t,isAdmin:i})})}async createApiKey(t){return await this.http.post(n,{body:JSON.stringify(t)})}}}}]);