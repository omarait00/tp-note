/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */!function(t){function e(e){for(var n,o,i=e[0],u=e[1],l=0,a=[];l<i.length;l++)o=i[l],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&a.push(r[o][0]),r[o]=0;for(n in u)Object.prototype.hasOwnProperty.call(u,n)&&(t[n]=u[n]);for(c&&c(e);a.length;)a.shift()()}var n={},r={0:0};function o(e){if(n[e])return n[e].exports;var r=n[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(t){var e=[],n=r[t];if(0!==n)if(n)e.push(n[2]);else{var i=new Promise((function(e,o){n=r[t]=[e,o]}));e.push(n[2]=i);var u,l=document.createElement("script");l.charset="utf-8",l.timeout=120,o.nc&&l.setAttribute("nonce",o.nc),l.src=function(t){return o.p+"cloudFullStory.chunk."+t+".js"}(t);var c=new Error;u=function(e){l.onerror=l.onload=null,clearTimeout(a);var n=r[t];if(0!==n){if(n){var o=e&&("load"===e.type?"missing":e.type),i=e&&e.target&&e.target.src;c.message="Loading chunk "+t+" failed.\n("+o+": "+i+")",c.name="ChunkLoadError",c.type=o,c.request=i,n[1](c)}r[t]=void 0}};var a=setTimeout((function(){u({type:"timeout",target:l})}),12e4);l.onerror=l.onload=u,document.head.appendChild(l)}return Promise.all(e)},o.m=t,o.c=n,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o.oe=function(t){throw console.error(t),t};var i=window.cloudFullStory_bundle_jsonpfunction=window.cloudFullStory_bundle_jsonpfunction||[],u=i.push.bind(i);i.push=e,i=i.slice();for(var l=0;l<i.length;l++)e(i[l]);var c=u;o(o.s=2)}([function(t,e,n){t.exports=n(1)(2)},function(t,e){t.exports=__kbnSharedDeps_npm__},function(t,e,n){n(3),__kbnBundles__.define("plugin/cloudFullStory/public",n,4)},function(t,e,n){n.p=window.__kbnPublicPath__.cloudFullStory},function(t,e,n){"use strict";n.r(e),n.d(e,"plugin",(function(){return i}));var r=n(0),o=n.n(r);class plugin_CloudFullStoryPlugin{constructor(t){o()(this,"config",void 0),this.initializerContext=t,this.config=this.initializerContext.config.get()}setup(t,{cloud:e}){e.isCloudEnabled&&this.setupFullStory({analytics:t.analytics,basePath:t.http.basePath}).catch((t=>console.debug(`Error setting up FullStory: ${t.toString()}`)))}start(){}stop(){}async setupFullStory({analytics:t,basePath:e}){const{org_id:r,eventTypesAllowlist:o}=this.config;if(!r)return;const{FullStoryShipper:i}=await n.e(1).then(n.bind(null,14));t.registerShipper(i,{eventTypesAllowlist:o,fullStoryOrgId:r,scriptUrl:e.prepend(`/internal/cloud/${this.initializerContext.env.packageInfo.buildNum}/fullstory.js`),namespace:"FSKibana"})}}function i(t){return new plugin_CloudFullStoryPlugin(t)}},function(t,e){t.exports=__kbnSharedDeps__.Moment}]);