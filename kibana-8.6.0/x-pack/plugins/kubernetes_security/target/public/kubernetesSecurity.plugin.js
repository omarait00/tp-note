/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */!function(e){function n(n){for(var t,o,u=n[0],i=n[1],c=0,a=[];c<u.length;c++)o=u[c],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&a.push(r[o][0]),r[o]=0;for(t in i)Object.prototype.hasOwnProperty.call(i,t)&&(e[t]=i[t]);for(s&&s(n);a.length;)a.shift()()}var t={},r={0:0};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(e){var n=[],t=r[e];if(0!==t)if(t)n.push(t[2]);else{var u=new Promise((function(n,o){t=r[e]=[n,o]}));n.push(t[2]=u);var i,c=document.createElement("script");c.charset="utf-8",c.timeout=120,o.nc&&c.setAttribute("nonce",o.nc),c.src=function(e){return o.p+"kubernetesSecurity.chunk."+e+".js"}(e);var s=new Error;i=function(n){c.onerror=c.onload=null,clearTimeout(a);var t=r[e];if(0!==t){if(t){var o=n&&("load"===n.type?"missing":n.type),u=n&&n.target&&n.target.src;s.message="Loading chunk "+e+" failed.\n("+o+": "+u+")",s.name="ChunkLoadError",s.type=o,s.request=u,t[1](s)}r[e]=void 0}};var a=setTimeout((function(){i({type:"timeout",target:c})}),12e4);c.onerror=c.onload=i,document.head.appendChild(c)}return Promise.all(n)},o.m=e,o.c=t,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)o.d(t,r,function(n){return e[n]}.bind(null,r));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="",o.oe=function(e){throw console.error(e),e};var u=window.kubernetesSecurity_bundle_jsonpfunction=window.kubernetesSecurity_bundle_jsonpfunction||[],i=u.push.bind(u);u.push=n,u=u.slice();for(var c=0;c<u.length;c++)n(u[c]);var s=i;o(o.s=4)}([function(e,n){e.exports=__kbnSharedDeps__.EmotionReact},function(e,n){e.exports=__kbnSharedDeps__.React},function(e,n){e.exports=__kbnSharedDeps__.ReactQuery},function(e,n){e.exports=__kbnSharedDeps__.ElasticEui},function(e,n,t){t(5),__kbnBundles__.define("plugin/kubernetesSecurity/public",t,6)},function(e,n,t){t.p=window.__kbnPublicPath__.kubernetesSecurity},function(e,n,t){"use strict";t.r(n),t.d(n,"plugin",(function(){return a}));var r=t(1),o=t(3),u=t(2),i=t(0);const c=new u.QueryClient({defaultOptions:{queries:{refetchOnWindowFocus:!1,refetchOnMount:!1,refetchOnReconnect:!1}}}),s=Object(r.lazy)((()=>t.e(1).then(t.bind(null,20))));class plugin_KubernetesSecurityPlugin{setup(e){}start(e){return{getKubernetesPage:e=>{return n=e,Object(i.jsx)(u.QueryClientProvider,{client:c},Object(i.jsx)(r.Suspense,{fallback:Object(i.jsx)(o.EuiLoadingSpinner,null)},Object(i.jsx)(s,n)));var n}}}stop(){}}function a(){return new plugin_KubernetesSecurityPlugin}},function(e,n,t){t.r(n);var r=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(n,Object.getOwnPropertyDescriptors(r))},function(e,n){e.exports=__kbnSharedDeps__.KbnI18n},function(e,n){e.exports=__kbnSharedDeps__.KbnI18nReact},function(e,n){e.exports=__kbnSharedDeps__.KbnUiTheme},function(e,n){e.exports=__kbnSharedDeps__.ReactRouterDom},function(e,n){e.exports=__kbnSharedDeps__.Lodash},function(e,n){e.exports=__kbnSharedDeps_npm__},function(e,n){e.exports=__kbnSharedDeps__.TsLib}]);