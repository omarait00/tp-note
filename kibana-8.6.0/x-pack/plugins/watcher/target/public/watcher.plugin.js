/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */!function(e){function t(t){for(var n,r,o=t[0],i=t[1],c=0,u=[];c<o.length;c++)r=o[c],Object.prototype.hasOwnProperty.call(a,r)&&a[r]&&u.push(a[r][0]),a[r]=0;for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n]);for(s&&s(t);u.length;)u.shift()()}var n={},a={0:0};function r(t){if(n[t])return n[t].exports;var a=n[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.e=function(e){var t=[],n=a[e];if(0!==n)if(n)t.push(n[2]);else{var o=new Promise((function(t,r){n=a[e]=[t,r]}));t.push(n[2]=o);var i,c=document.createElement("script");c.charset="utf-8",c.timeout=120,r.nc&&c.setAttribute("nonce",r.nc),c.src=function(e){return r.p+"watcher.chunk."+e+".js"}(e);var s=new Error;i=function(t){c.onerror=c.onload=null,clearTimeout(u);var n=a[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;s.message="Loading chunk "+e+" failed.\n("+r+": "+o+")",s.name="ChunkLoadError",s.type=r,s.request=o,n[1](s)}a[e]=void 0}};var u=setTimeout((function(){i({type:"timeout",target:c})}),12e4);c.onerror=c.onload=i,document.head.appendChild(c)}return Promise.all(t)},r.m=e,r.c=n,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r.oe=function(e){throw console.error(e),e};var o=window.watcher_bundle_jsonpfunction=window.watcher_bundle_jsonpfunction||[],i=o.push.bind(o);o.push=t,o=o.slice();for(var c=0;c<o.length;c++)t(o[c]);var s=i;r(r.s=8)}([function(e,t){e.exports=__kbnSharedDeps__.KbnI18n},function(e,t){e.exports=__kbnSharedDeps__.RxjsOperators},function(e,t,n){"use strict";n.d(t,"a",(function(){return a})),n.d(t,"b",(function(){return o})),n.d(t,"c",(function(){return i})),n.d(t,"d",(function(){return c})),n.d(t,"e",(function(){return s})),n.d(t,"g",(function(){return u})),n.d(t,"h",(function(){return l})),n.d(t,"i",(function(){return p})),n.d(t,"j",(function(){return f})),n.d(t,"k",(function(){return h})),n.d(t,"l",(function(){return g})),n.d(t,"m",(function(){return _})),n.d(t,"n",(function(){return m})),n.d(t,"f",(function(){return b}));const a={SIMULATE:"simulate",FORCE_SIMULATE:"force_simulate",EXECUTE:"execute",FORCE_EXECUTE:"force_execute",SKIP:"skip"};var r=n(0);const o={OK:r.i18n.translate("xpack.watcher.constants.actionStates.okStateText",{defaultMessage:"OK"}),ACKNOWLEDGED:r.i18n.translate("xpack.watcher.constants.actionStates.acknowledgedStateText",{defaultMessage:"Acknowledged"}),THROTTLED:r.i18n.translate("xpack.watcher.constants.actionStates.throttledStateText",{defaultMessage:"Throttled"}),ERROR:r.i18n.translate("xpack.watcher.constants.actionStates.errorStateText",{defaultMessage:"Error"}),CONFIG_ERROR:r.i18n.translate("xpack.watcher.constants.actionStates.configErrorStateText",{defaultMessage:"Config error"}),UNKNOWN:r.i18n.translate("xpack.watcher.constants.actionStates.unknownStateText",{defaultMessage:"Unknown"})},i={EMAIL:"email",WEBHOOK:"webhook",INDEX:"index",LOGGING:"logging",SLACK:"slack",JIRA:"jira",PAGERDUTY:"pagerduty",UNKNOWN:"unknown/invalid"},c={COUNT:"count",AVERAGE:"avg",SUM:"sum",MIN:"min",MAX:"max"},s={GREATER_THAN:">",GREATER_THAN_OR_EQUALS:">=",BETWEEN:"between",LESS_THAN:"<",LESS_THAN_OR_EQUALS:"<="},u={initialPageSize:10,pageSizeOptions:[10,50,100]},l={ID:"watcher",MINIMUM_LICENSE_REQUIRED:"gold",getI18nName:e=>e.translate("xpack.watcher.appName",{defaultMessage:"Watcher"})},d=6e4,p={WATCH_LIST:d,WATCH_HISTORY:d,WATCH_VISUALIZATION:d},f={API_ROOT:"/api/watcher"},h={ASCENDING:"asc",DESCENDING:"desc"},g={SECOND:"s",MINUTE:"m",HOUR:"h",DAY:"d"},_=(r.i18n.translate("xpack.watcher.constants.watchStateComments.partiallyThrottledStateCommentText",{defaultMessage:"Partially throttled"}),r.i18n.translate("xpack.watcher.constants.watchStateComments.throttledStateCommentText",{defaultMessage:"Throttled"}),r.i18n.translate("xpack.watcher.constants.watchStateComments.partiallyAcknowledgedStateCommentText",{defaultMessage:"Partially acknowledged"}),r.i18n.translate("xpack.watcher.constants.watchStateComments.acknowledgedStateCommentText",{defaultMessage:"Acknowledged"}),r.i18n.translate("xpack.watcher.constants.watchStateComments.executionFailingStateCommentText",{defaultMessage:"Execution failing"}),{INACTIVE:r.i18n.translate("xpack.watcher.constants.watchStates.inactiveStateText",{defaultMessage:"Inactive"}),ACTIVE:r.i18n.translate("xpack.watcher.constants.watchStates.activeStateText",{defaultMessage:"Active"}),ERROR:r.i18n.translate("xpack.watcher.constants.watchStates.errorStateText",{defaultMessage:"Error"}),CONFIG_ERROR:r.i18n.translate("xpack.watcher.constants.watchStates.configErrorStateText",{defaultMessage:"Config error"})}),m={JSON:"json",THRESHOLD:"threshold",MONITORING:"monitoring"},b={ERR_PROP_MISSING:"ERR_PROP_MISSING"}},function(e,t){e.exports=__kbnSharedDeps__.Rxjs},function(e,t,n){e.exports=n(7)(2)},function(e,t,n){"use strict";var a,r=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),o=[];function i(e){for(var t=-1,n=0;n<o.length;n++)if(o[n].identifier===e){t=n;break}return t}function c(e,t){for(var n={},a=[],r=0;r<e.length;r++){var c=e[r],s=t.base?c[0]+t.base:c[0],u=n[s]||0,l="".concat(s," ").concat(u);n[s]=u+1;var d=i(l),p={css:c[1],media:c[2],sourceMap:c[3]};-1!==d?(o[d].references++,o[d].updater(p)):o.push({identifier:l,updater:g(p,t),references:1}),a.push(l)}return a}function s(e){var t=document.createElement("style"),a=e.attributes||{};if(void 0===a.nonce){var o=n.nc;o&&(a.nonce=o)}if(Object.keys(a).forEach((function(e){t.setAttribute(e,a[e])})),"function"==typeof e.insert)e.insert(t);else{var i=r(e.insert||"head");if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(t)}return t}var u,l=(u=[],function(e,t){return u[e]=t,u.filter(Boolean).join("\n")});function d(e,t,n,a){var r=n?"":a.media?"@media ".concat(a.media," {").concat(a.css,"}"):a.css;if(e.styleSheet)e.styleSheet.cssText=l(t,r);else{var o=document.createTextNode(r),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(o,i[t]):e.appendChild(o)}}function p(e,t,n){var a=n.css,r=n.media,o=n.sourceMap;if(r?e.setAttribute("media",r):e.removeAttribute("media"),o&&"undefined"!=typeof btoa&&(a+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),e.styleSheet)e.styleSheet.cssText=a;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(a))}}var f=null,h=0;function g(e,t){var n,a,r;if(t.singleton){var o=h++;n=f||(f=s(t)),a=d.bind(null,n,o,!1),r=d.bind(null,n,o,!0)}else n=s(t),a=p.bind(null,n,t),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return a(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;a(e=t)}else r()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===a&&(a=Boolean(window&&document&&document.all&&!window.atob)),a));var n=c(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var a=0;a<n.length;a++){var r=i(n[a]);o[r].references--}for(var s=c(e,t),u=0;u<n.length;u++){var l=i(n[u]);0===o[l].references&&(o[l].updater(),o.splice(l,1))}n=s}}}},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n,a,r,o=e[1]||"",i=e[3];if(!i)return o;if(t&&"function"==typeof btoa){var c=(n=i,a=btoa(unescape(encodeURIComponent(JSON.stringify(n)))),r="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(r," */")),s=i.sources.map((function(e){return"/*# sourceURL=".concat(i.sourceRoot||"").concat(e," */")}));return[o].concat(s).concat([c]).join("\n")}return[o].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,a){"string"==typeof e&&(e=[[null,e,""]]);var r={};if(a)for(var o=0;o<this.length;o++){var i=this[o][0];null!=i&&(r[i]=!0)}for(var c=0;c<e.length;c++){var s=[].concat(e[c]);a&&r[s[0]]||(n&&(s[2]?s[2]="".concat(n," and ").concat(s[2]):s[2]=n),t.push(s))}},t}},function(e,t){e.exports=__kbnSharedDeps_npm__},function(e,t,n){n(9),__kbnBundles__.define("plugin/watcher/public",n,15)},function(e,t,n){n.p=window.__kbnPublicPath__.watcher},function(e,t,n){switch(window.__kbnThemeTag__){case"v8dark":return n(11);case"v8light":return n(13)}},function(e,t,n){var a=n(5),r=n(12);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);a(r,{insert:"head",singleton:!1}),e.exports=r.locals||{}},function(e,t,n){(t=n(6)(!1)).push([e.i,".watcherThresholdWatchActionDropdownContainer{flex-direction:row;justify-content:flex-end}.watcherThresholdWatchActionContextMenuItem,.watcherThresholdWatchInBetweenComparatorText{align-self:center}.watcherThresholdAlertAggFieldContainer{width:300px}",""]),e.exports=t},function(e,t,n){var a=n(5),r=n(14);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);a(r,{insert:"head",singleton:!1}),e.exports=r.locals||{}},function(e,t,n){(t=n(6)(!1)).push([e.i,".watcherThresholdWatchActionDropdownContainer{flex-direction:row;justify-content:flex-end}.watcherThresholdWatchActionContextMenuItem,.watcherThresholdWatchInBetweenComparatorText{align-self:center}.watcherThresholdAlertAggFieldContainer{width:300px}",""]),e.exports=t},function(e,t,n){"use strict";n.r(t),n.d(t,"plugin",(function(){return l})),n(10);var a=n(4),r=n.n(a),o=n(0),i=n(1),c=n(3),s=n(2);const u=e=>{const{state:t,message:n}=e.check(s.h.ID,s.h.MINIMUM_LICENSE_REQUIRED);return{valid:"valid"===t&&e.getFeature(s.h.ID).isAvailable,message:n}};class plugin_WatcherUIPlugin{constructor(){r()(this,"capabilities$",new c.Subject)}setup({notifications:e,http:t,uiSettings:a,getStartServices:r},{licensing:s,management:l,data:d,home:p,charts:f}){const h=l.sections.section.insightsAndAlerting,g=o.i18n.translate("xpack.watcher.sections.watchList.managementSection.watcherDisplayName",{defaultMessage:"Watcher"}),_=h.registerApp({id:"watcher",title:g,order:5,mount:async({element:o,setBreadcrumbs:c,history:l,theme$:p})=>{const[h]=await r(),{chrome:{docTitle:_},i18n:m,docLinks:b,savedObjects:w,application:S,executionContext:x}=h;_.change(g);const{renderApp:v}=await n.e(1).then(n.bind(null,43)),{TimeBuckets:T}=await n.e(2).then(n.bind(null,44)),E=v({licenseStatus$:s.license$.pipe(Object(i.skip)(1),Object(i.map)(u)),element:o,toasts:e.toasts,http:t,uiSettings:a,docLinks:b,setBreadcrumbs:c,theme:f.theme,savedObjects:w.client,I18nContext:m.Context,createTimeBuckets:()=>new T(a,d),history:l,getUrlForApp:S.getUrlForApp,theme$:p,executionContext:x});return()=>{_.reset(),E()}}}),m={id:"watcher",title:"Watcher",category:"admin",description:o.i18n.translate("xpack.watcher.watcherDescription",{defaultMessage:"Detect changes in your data by creating, managing, and monitoring alerts."}),icon:"watchesApp",path:"/app/management/insightsAndAlerting/watcher/watches",showOnHomePage:!1};p.featureCatalogue.register(m),Object(c.combineLatest)([s.license$.pipe(Object(i.first)(),Object(i.map)(u)),this.capabilities$]).subscribe((([{valid:e},t])=>{var n;e&&!0===(null===(n=t.management.insightsAndAlerting)||void 0===n?void 0:n.watcher)?_.enable():_.disable()}))}start(e){this.capabilities$.next(e.application.capabilities)}stop(){}}const l=()=>new plugin_WatcherUIPlugin},function(e,t){e.exports=__kbnSharedDeps__.React},function(e,t){e.exports=__kbnSharedDeps__.EmotionReact},function(e,t){e.exports=__kbnSharedDeps__.ElasticEui},function(e,t){e.exports=__kbnSharedDeps__.Lodash},function(e,t){e.exports=__kbnSharedDeps__.KbnI18nReact},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/esUiShared/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t){e.exports=__kbnSharedDeps__.SaferLodashSet},function(e,t){e.exports=__kbnSharedDeps__.Moment},function(e,t){e.exports=__kbnSharedDeps__.KbnDatemath},function(e,t){e.exports=__kbnSharedDeps__.ReactDom},function(e,t){e.exports=__kbnSharedDeps__.ReactRouterDom},function(e,t){e.exports=__kbnSharedDeps__.ElasticCharts},function(e,t){e.exports=__kbnSharedDeps__.MomentTimezone},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/data/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/fieldFormats/common");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))}]);