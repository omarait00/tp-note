/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */!function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=2)}([function(e,t,r){e.exports=r(4)(2)},function(e,t,r){"use strict";r.r(t),r.d(t,"ElasticsearchFeature",(function(){return ElasticsearchFeature})),r.d(t,"KibanaFeature",(function(){return kibana_feature_KibanaFeature})),r.d(t,"SubFeature",(function(){return SubFeature}));class ElasticsearchFeature{constructor(e){this.config=e}get id(){return this.config.id}get catalogue(){return this.config.catalogue}get management(){return this.config.management}get privileges(){return this.config.privileges}toRaw(){return{...this.config}}}var n=r(0),i=r.n(n);class SubFeature{constructor(e){this.config=e}get name(){return this.config.name}get privilegeGroups(){return this.config.privilegeGroups}get requireAllSpaces(){var e;return null!==(e=this.config.requireAllSpaces)&&void 0!==e&&e}toRaw(){return{...this.config}}}class kibana_feature_KibanaFeature{constructor(e){var t;i()(this,"subFeatures",void 0),this.config=e,this.subFeatures=(null!==(t=e.subFeatures)&&void 0!==t?t:[]).map((e=>new SubFeature(e)))}get id(){return this.config.id}get name(){return this.config.name}get order(){return this.config.order}get category(){return this.config.category}get app(){return this.config.app}get catalogue(){return this.config.catalogue}get management(){return this.config.management}get minimumLicense(){return this.config.minimumLicense}get privileges(){return this.config.privileges}get alerting(){return this.config.alerting}get cases(){return this.config.cases}get excludeFromBasePrivileges(){var e;return null!==(e=this.config.excludeFromBasePrivileges)&&void 0!==e&&e}get reserved(){return this.config.reserved}toRaw(){return{...this.config}}}},function(e,t,r){r(3),__kbnBundles__.define("plugin/features/public",r,5),__kbnBundles__.define("plugin/features/common",r,1)},function(e,t,r){r.p=window.__kbnPublicPath__.features},function(e,t){e.exports=__kbnSharedDeps_npm__},function(e,t,r){"use strict";r.r(t),r.d(t,"KibanaFeature",(function(){return u.KibanaFeature})),r.d(t,"plugin",(function(){return a}));var n=r(0),i=r.n(n);class features_api_client_FeaturesAPIClient{constructor(e){this.http=e}async getFeatures(){return(await this.http.get("/api/features")).map((e=>new u.KibanaFeature(e)))}}class plugin_FeaturesPlugin{constructor(){i()(this,"apiClient",void 0)}setup(e){this.apiClient=new features_api_client_FeaturesAPIClient(e.http)}start(){return{getFeatures:()=>this.apiClient.getFeatures()}}stop(){}}var u=r(1);const a=()=>new plugin_FeaturesPlugin}]);