/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=3)}([function(e,t){e.exports=__kbnSharedDeps__.RxjsOperators},function(e,t){e.exports=__kbnSharedDeps__.Rxjs},function(e,t,r){"use strict";e.exports=function(){function e(e,t,r,n,o){return e<t||r<t?e>r?r+1:e+1:n===o?t:t+1}return function(t,r){if(t===r)return 0;if(t.length>r.length){var n=t;t=r,r=n}for(var o=t.length,a=r.length;o>0&&t.charCodeAt(o-1)===r.charCodeAt(a-1);)o--,a--;for(var i=0;i<o&&t.charCodeAt(i)===r.charCodeAt(i);)i++;if(a-=i,0==(o-=i)||a<3)return a;var l,s,u,p,c,d,f,b,h,v,g,y,k=0,m=[];for(l=0;l<o;l++)m.push(l+1),m.push(t.charCodeAt(i+l));for(var _=m.length-1;k<a-3;)for(h=r.charCodeAt(i+(s=k)),v=r.charCodeAt(i+(u=k+1)),g=r.charCodeAt(i+(p=k+2)),y=r.charCodeAt(i+(c=k+3)),d=k+=4,l=0;l<_;l+=2)s=e(f=m[l],s,u,h,b=m[l+1]),u=e(s,u,p,v,b),p=e(u,p,c,g,b),d=e(p,c,d,y,b),m[l]=d,c=p,p=u,u=s,s=f;for(;k<a;)for(h=r.charCodeAt(i+(s=k)),d=++k,l=0;l<_;l+=2)f=m[l],m[l]=d=e(f,s,d,h,m[l+1]),s=f;return d}}()},function(e,t,r){r(4),__kbnBundles__.define("plugin/globalSearchProviders/public",r,5)},function(e,t,r){r.p=window.__kbnPublicPath__.globalSearchProviders},function(e,t,r){"use strict";r.r(t),r.d(t,"plugin",(function(){return d}));var n=r(1),o=r(0),a=r(2),i=r.n(a);const l=(e,t)=>{e=e.toLowerCase();const r=[t.app.title,...t.subLinkTitles].join(" ").toLowerCase(),n=s(e,r),o=[...t.app.keywords.map((e=>e.toLowerCase())),...t.keywords.map((e=>e.toLowerCase()))],a=u(e,o);return Math.max(n,.8*a)},s=(e,t)=>{if(t===e)return 100;if(t.startsWith(e))return 90;if(t.includes(e))return 75;const r=Math.max(e.length,t.length),n=i()(e,t),o=Math.floor(100*(1-n/r));return o>=60?o:0},u=(e,t)=>{const r=t.map((t=>s(e,t)));return Math.max(...r)},p=(e,t)=>{var r,n;return t?[...t.path&&t.searchable?[{id:`${e.id}-${t.id}`,app:e,path:`${e.appRoute}${t.path}`,subLinkTitles:[t.title],keywords:[...null!==(r=t.keywords)&&void 0!==r?r:[]]}]:[],...t.deepLinks.flatMap((t=>p(e,t))).map((e=>({...e,subLinkTitles:[t.title,...e.subLinkTitles],keywords:[...t.keywords,...e.keywords]})))]:[...e.searchable?[{id:e.id,app:e,path:e.appRoute,subLinkTitles:[],keywords:null!==(n=null==e?void 0:e.keywords)&&void 0!==n?n:[]}]:[],...e.deepLinks.flatMap((t=>p(e,t)))]},c="application";class plugin_GlobalSearchProvidersPlugin{setup({getStartServices:e},{globalSearch:t}){const r=e().then((([e])=>e.application));return t.registerResultProvider((e=>{const t=Object(n.from)(e).pipe(Object(o.mergeMap)((e=>e.applications$)),Object(o.map)((e=>[...e.values()].filter((e=>0===e.status&&!0!==e.chromeless)))),Object(o.shareReplay)(1));return{id:"application",find:({term:e,types:r,tags:a},{aborted$:i,maxResults:s})=>a||r&&!r.includes(c)?Object(n.of)([]):t.pipe(Object(o.takeUntil)(i),Object(o.take)(1),Object(o.map)((t=>{const r=((e,t)=>t.flatMap((t=>{var r;return e.length>0?p(t):t.searchable?[{id:t.id,app:t,path:t.appRoute,subLinkTitles:[],keywords:null!==(r=t.keywords)&&void 0!==r?r:[]}]:[]})).map((t=>({appLink:t,score:l(e,t)}))).filter((({score:e})=>e>0)).map((({appLink:e,score:t})=>((e,t)=>{var r,n,o,a;const i="management"===e.app.id&&e.subLinkTitles.length>0?e.subLinkTitles:[e.app.title,...e.subLinkTitles];return{id:e.id,title:i.join(" / "),type:"application",icon:e.app.euiIconType,url:e.path,meta:{categoryId:null!==(r=null===(n=e.app.category)||void 0===n?void 0:n.id)&&void 0!==r?r:null,categoryLabel:null!==(o=null===(a=e.app.category)||void 0===a?void 0:a.label)&&void 0!==o?o:null},score:t}})(e,t))))(null!=e?e:"",[...t.values()]);return r.sort(((e,t)=>t.score-e.score)).slice(0,s)}))),getSearchableTypes:()=>[c]}})(r)),{}}start(){return{}}}const d=()=>new plugin_GlobalSearchProvidersPlugin}]);