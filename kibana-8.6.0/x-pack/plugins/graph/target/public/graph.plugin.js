/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */!function(e){function t(t){for(var n,a,i=t[0],o=t[1],s=0,c=[];s<i.length;s++)a=i[s],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&c.push(r[a][0]),r[a]=0;for(n in o)Object.prototype.hasOwnProperty.call(o,n)&&(e[n]=o[n]);for(p&&p(t);c.length;)c.shift()()}var n={},r={0:0};function a(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.e=function(e){var t=[],n=r[e];if(0!==n)if(n)t.push(n[2]);else{var i=new Promise((function(t,a){n=r[e]=[t,a]}));t.push(n[2]=i);var o,s=document.createElement("script");s.charset="utf-8",s.timeout=120,a.nc&&s.setAttribute("nonce",a.nc),s.src=function(e){return a.p+"graph.chunk."+e+".js"}(e);var p=new Error;o=function(t){s.onerror=s.onload=null,clearTimeout(c);var n=r[e];if(0!==n){if(n){var a=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;p.message="Loading chunk "+e+" failed.\n("+a+": "+i+")",p.name="ChunkLoadError",p.type=a,p.request=i,n[1](p)}r[e]=void 0}};var c=setTimeout((function(){o({type:"timeout",target:s})}),12e4);s.onerror=s.onload=o,document.head.appendChild(s)}return Promise.all(t)},a.m=e,a.c=n,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a.oe=function(e){throw console.error(e),e};var i=window.graph_bundle_jsonpfunction=window.graph_bundle_jsonpfunction||[],o=i.push.bind(i);i.push=t,i=i.slice();for(var s=0;s<i.length;s++)t(i[s]);var p=o;a(a.s=7)}([function(e,t){e.exports=__kbnSharedDeps__.KbnI18n},function(e,t,n){n.r(t);var r=__kbnBundles__.get("entry/core/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))},function(e,t,n){e.exports=n(6)(2)},function(e,t){e.exports=__kbnSharedDeps__.Rxjs},function(e,t,n){n.r(t);var r=__kbnBundles__.get("plugin/kibanaUtils/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))},function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n(0);function a(e){if(!e||!e.isAvailable)return{showAppLink:!0,enableAppLink:!1,message:r.i18n.translate("xpack.graph.serverSideErrors.unavailableLicenseInformationErrorMessage",{defaultMessage:"Graph is unavailable - license information is not available at this time."})};if(!e.getFeature("graph").isEnabled)return{showAppLink:!1,enableAppLink:!1,message:r.i18n.translate("xpack.graph.serverSideErrors.unavailableGraphErrorMessage",{defaultMessage:"Graph is unavailable"})};const t=e.check("graph","platinum");switch(t.state){case"expired":return{showAppLink:!0,enableAppLink:!1,message:t.message};case"invalid":case"unavailable":return{showAppLink:!1,enableAppLink:!1,message:t.message};case"valid":return{showAppLink:!0,enableAppLink:!0};default:return function(e){throw new Error(`Unexpected object: ${e}`)}(t.state)}}},function(e,t){e.exports=__kbnSharedDeps_npm__},function(e,t,n){n(8),__kbnBundles__.define("plugin/graph/public",n,9)},function(e,t,n){n.p=window.__kbnPublicPath__.graph},function(e,t,n){"use strict";n.r(t),n.d(t,"plugin",(function(){return u}));var r=n(2),a=n.n(r),i=n(0),o=n(3),s=n(1),p=n(4),c=n(5);class plugin_GraphPlugin{constructor(e){a()(this,"appUpdater$",new o.BehaviorSubject((()=>({})))),this.initializerContext=e}setup(e,{home:t}){t&&t.featureCatalogue.register({id:"graph",title:"Graph",subtitle:i.i18n.translate("xpack.graph.pluginSubtitle",{defaultMessage:"Reveal patterns and relationships."}),description:i.i18n.translate("xpack.graph.pluginDescription",{defaultMessage:"Surface and analyze relevant relationships in your Elasticsearch data."}),icon:"graphApp",path:"/app/graph",showOnHomePage:!1,category:"data",solutionId:"kibana",order:600});const r=this.initializerContext.config.get();e.application.register({id:"graph",title:"Graph",order:6e3,appRoute:"/app/graph",euiIconType:"logoKibana",category:s.DEFAULT_APP_CATEGORIES.kibana,updater$:this.appUpdater$,mount:async t=>{const[a,o]=await e.getStartServices();a.chrome.docTitle.change(i.i18n.translate("xpack.graph.pageTitle",{defaultMessage:"Graph"}));const{renderApp:s}=await n.e(1).then(n.bind(null,159));return s({...t,pluginInitializerContext:this.initializerContext,licensing:o.licensing,core:a,coreStart:a,navigation:o.navigation,data:o.data,unifiedSearch:o.unifiedSearch,savedObjectsClient:a.savedObjects.client,addBasePath:e.http.basePath.prepend,getBasePath:e.http.basePath.get,canEditDrillDownUrls:r.canEditDrillDownUrls,graphSavePolicy:r.savePolicy,storage:new p.Storage(window.localStorage),capabilities:a.application.capabilities,chrome:a.chrome,toastNotifications:a.notifications.toasts,indexPatterns:o.data.indexPatterns,overlays:a.overlays,savedObjects:o.savedObjects,uiSettings:e.uiSettings,spaces:o.spaces,inspect:o.inspector})}})}start(e,{home:t,licensing:n}){n.license$.subscribe((e=>{const n=Object(c.a)(e);this.appUpdater$.next((()=>({navLinkStatus:n.showAppLink?n.enableAppLink?s.AppNavLinkStatus.visible:s.AppNavLinkStatus.disabled:s.AppNavLinkStatus.hidden,tooltip:n.showAppLink?n.message:void 0}))),t&&!n.enableAppLink&&t.featureCatalogue.removeFeature("graph")}))}stop(){}}const u=e=>new plugin_GraphPlugin(e)},function(e,t){e.exports=__kbnSharedDeps__.React},function(e,t){e.exports=__kbnSharedDeps__.EmotionReact},function(e,t){e.exports=__kbnSharedDeps__.ElasticEui},function(e,t){e.exports=__kbnSharedDeps__.Classnames},function(e,t){e.exports=__kbnSharedDeps__.KbnI18nReact},function(e,t){e.exports=__kbnSharedDeps__.ReactRouterDom},function(e,t,n){n.r(t);var r=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))},function(e,t,n){n.r(t);var r=__kbnBundles__.get("plugin/savedObjects/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))},function(e,t){e.exports=__kbnSharedDeps__.RisonNode},function(e,t){e.exports=__kbnSharedDeps__.ReactDom},function(e,t){e.exports=__kbnSharedDeps__.Lodash},function(e,t){e.exports=__kbnSharedDeps__.EmotionCache},function(e,t){e.exports=__kbnSharedDeps__.TsLib},function(e,t){e.exports=__kbnSharedDeps__.Moment},function(e,t){e.exports=__kbnSharedDeps__.History},function(e,t){e.exports=__kbnSharedDeps__.KbnStd},function(e,t,n){n.r(t);var r=__kbnBundles__.get("plugin/data/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))},function(e,t){e.exports=__kbnSharedDeps__.ElasticEuiLibServices},function(e,t){e.exports=__kbnSharedDeps__.Jquery},function(e,t){e.exports=__kbnSharedDeps__.KbnEsQuery},function(e,t,n){n.r(t);var r=__kbnBundles__.get("plugin/unifiedSearch/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))},function(e,t,n){n.r(t);var r=__kbnBundles__.get("plugin/inspector/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))}]);