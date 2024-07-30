/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */!function(e){var t={};function n(a){if(t[a])return t[a].exports;var r=t[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(a,r,function(t){return e[t]}.bind(null,r));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=14)}([function(e,t){e.exports=__kbnSharedDeps__.EmotionReact},function(e,t){e.exports=__kbnSharedDeps__.ElasticEui},function(e,t){e.exports=__kbnSharedDeps__.React},function(e,t){e.exports=__kbnSharedDeps__.KbnI18n},function(e,t){e.exports=__kbnSharedDeps__.KbnI18nReact},function(e,t){e.exports=__kbnSharedDeps__.KbnAnalytics},function(e,t){e.exports=__kbnSharedDeps__.ReactDom},function(e,t,n){"use strict";var a,r=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),s=[];function i(e){for(var t=-1,n=0;n<s.length;n++)if(s[n].identifier===e){t=n;break}return t}function o(e,t){for(var n={},a=[],r=0;r<e.length;r++){var o=e[r],c=t.base?o[0]+t.base:o[0],l=n[c]||0,u="".concat(c," ").concat(l);n[c]=l+1;var d=i(u),p={css:o[1],media:o[2],sourceMap:o[3]};-1!==d?(s[d].references++,s[d].updater(p)):s.push({identifier:u,updater:b(p,t),references:1}),a.push(u)}return a}function c(e){var t=document.createElement("style"),a=e.attributes||{};if(void 0===a.nonce){var s=n.nc;s&&(a.nonce=s)}if(Object.keys(a).forEach((function(e){t.setAttribute(e,a[e])})),"function"==typeof e.insert)e.insert(t);else{var i=r(e.insert||"head");if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(t)}return t}var l,u=(l=[],function(e,t){return l[e]=t,l.filter(Boolean).join("\n")});function d(e,t,n,a){var r=n?"":a.media?"@media ".concat(a.media," {").concat(a.css,"}"):a.css;if(e.styleSheet)e.styleSheet.cssText=u(t,r);else{var s=document.createTextNode(r),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(s,i[t]):e.appendChild(s)}}function p(e,t,n){var a=n.css,r=n.media,s=n.sourceMap;if(r?e.setAttribute("media",r):e.removeAttribute("media"),s&&"undefined"!=typeof btoa&&(a+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(s))))," */")),e.styleSheet)e.styleSheet.cssText=a;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(a))}}var f=null,g=0;function b(e,t){var n,a,r;if(t.singleton){var s=g++;n=f||(f=c(t)),a=d.bind(null,n,s,!1),r=d.bind(null,n,s,!0)}else n=c(t),a=p.bind(null,n,t),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return a(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;a(e=t)}else r()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===a&&(a=Boolean(window&&document&&document.all&&!window.atob)),a));var n=o(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var a=0;a<n.length;a++){var r=i(n[a]);s[r].references--}for(var c=o(e,t),l=0;l<n.length;l++){var u=i(n[l]);0===s[u].references&&(s[u].updater(),s.splice(u,1))}n=c}}}},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n,a,r,s=e[1]||"",i=e[3];if(!i)return s;if(t&&"function"==typeof btoa){var o=(n=i,a=btoa(unescape(encodeURIComponent(JSON.stringify(n)))),r="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(r," */")),c=i.sources.map((function(e){return"/*# sourceURL=".concat(i.sourceRoot||"").concat(e," */")}));return[s].concat(c).concat([o]).join("\n")}return[s].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,a){"string"==typeof e&&(e=[[null,e,""]]);var r={};if(a)for(var s=0;s<this.length;s++){var i=this[s][0];null!=i&&(r[i]=!0)}for(var o=0;o<e.length;o++){var c=[].concat(e[o]);a&&r[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),t.push(c))}},t}},function(e,t){e.exports=__kbnSharedDeps__.TsLib},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(2);t.default=function(){var e=a.useRef(!1),t=a.useCallback((function(){return e.current}),[]);return a.useEffect((function(){return e.current=!0,function(){e.current=!1}})),t}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(9),r=n(2),s=a.__importDefault(n(21));t.default=function(e,t,n){void 0===t&&(t=0),void 0===n&&(n=[]);var a=s.default(e,t),i=a[0],o=a[1],c=a[2];return r.useEffect(c,n),[i,o]}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(2),r=n(22).isClient?window:null,s=function(e){return!!e.addEventListener},i=function(e){return!!e.on};t.default=function(e,t,n,o){void 0===n&&(n=r),a.useEffect((function(){if(t&&n)return s(n)?n.addEventListener(e,t,o):i(n)&&n.on(e,t,o),function(){s(n)?n.removeEventListener(e,t,o):i(n)&&n.off(e,t,o)}}),[e,t,n,JSON.stringify(o)])}},function(e,t,n){n(15),__kbnBundles__.define("plugin/globalSearchBar/public",n,24)},function(e,t,n){n.p=window.__kbnPublicPath__.globalSearchBar},function(e,t,n){switch(window.__kbnThemeTag__){case"v8dark":return n(17);case"v8light":return n(19)}},function(e,t,n){var a=n(7),r=n(18);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);a(r,{insert:"head",singleton:!1}),e.exports=r.locals||{}},function(e,t,n){(t=n(8)(!1)).push([e.i,".kbnSearchOption__tagsList{display:inline-block;line-height:16px!important}.kbnSearchOption__tagsList .kbnSearchOption__tagsListItem{display:inline-block;margin-right:8px;max-width:80px}.euiSelectableListItem-isFocused .kbnSearchOption__tagsList{border-right:1px solid #343741;margin-right:4px}@media only screen and (max-width:574px){.kbnSearchOption__tagsList{display:none}}@media only screen and (min-width:575px) and (max-width:767px){.kbnSearchOption__tagsList{display:none}}@media only screen and (min-width:768px) and (max-width:991px){.kbnSearchBar{width:400px}}@media only screen and (min-width:992px) and (max-width:1199px){.kbnSearchBar{width:400px}}@media only screen and (min-width:1200px){.kbnSearchBar{width:600px}}",""]),e.exports=t},function(e,t,n){var a=n(7),r=n(20);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);a(r,{insert:"head",singleton:!1}),e.exports=r.locals||{}},function(e,t,n){(t=n(8)(!1)).push([e.i,".kbnSearchOption__tagsList{display:inline-block;line-height:16px!important}.kbnSearchOption__tagsList .kbnSearchOption__tagsListItem{display:inline-block;margin-right:8px;max-width:80px}.euiSelectableListItem-isFocused .kbnSearchOption__tagsList{border-right:1px solid #d3dae6;margin-right:4px}@media only screen and (max-width:574px){.kbnSearchOption__tagsList{display:none}}@media only screen and (min-width:575px) and (max-width:767px){.kbnSearchOption__tagsList{display:none}}@media only screen and (min-width:768px) and (max-width:991px){.kbnSearchBar{width:400px}}@media only screen and (min-width:992px) and (max-width:1199px){.kbnSearchBar{width:400px}}@media only screen and (min-width:1200px){.kbnSearchBar{width:600px}}",""]),e.exports=t},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(2);t.default=function(e,t){void 0===t&&(t=0);var n=a.useRef(!1),r=a.useRef(),s=a.useRef(e),i=a.useCallback((function(){return n.current}),[]),o=a.useCallback((function(){n.current=!1,r.current&&clearTimeout(r.current),r.current=setTimeout((function(){n.current=!0,s.current()}),t)}),[t]),c=a.useCallback((function(){n.current=null,r.current&&clearTimeout(r.current)}),[]);return a.useEffect((function(){s.current=e}),[e]),a.useEffect((function(){return o(),c}),[t]),[i,c,o]}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isDeepEqual=t.off=t.on=t.isClient=void 0;var a=n(9).__importDefault(n(23));t.isClient="object"==typeof window,t.on=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return e.addEventListener.apply(e,t)},t.off=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];return e.removeEventListener.apply(e,t)},t.isDeepEqual=a.default},function(e,t,n){"use strict";e.exports=function e(t,n){if(t===n)return!0;if(t&&n&&"object"==typeof t&&"object"==typeof n){if(t.constructor!==n.constructor)return!1;var a,r,s;if(Array.isArray(t)){if((a=t.length)!=n.length)return!1;for(r=a;0!=r--;)if(!e(t[r],n[r]))return!1;return!0}if(t.constructor===RegExp)return t.source===n.source&&t.flags===n.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===n.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===n.toString();if((a=(s=Object.keys(t)).length)!==Object.keys(n).length)return!1;for(r=a;0!=r--;)if(!Object.prototype.hasOwnProperty.call(n,s[r]))return!1;for(r=a;0!=r--;){var i=s[r];if(!("_owner"===i&&t.$$typeof||e(t[i],n[i])))return!1}return!0}return t!=t&&n!=n}},function(e,t,n){"use strict";n.r(t),n.d(t,"plugin",(function(){return P}));var a=n(2),r=n(6),s=n.n(r),i=n(4),o=n(10),c=n(0),l=n(12),u=n.n(l),d=n(13),p=n.n(d),f=n(11),g=n.n(f),b=n(1),h=n(5),m=n(3);const _=["tag","type"],v={tag:["tags"],type:["types"]},x=e=>e.map((e=>String(e))),j=(e,t)=>e.toLowerCase()===t.toLowerCase(),y=e=>/\s/g.test(e)?`"${e}"`:e,O=({children:e})=>Object(c.jsx)("ul",{className:"kbnSearchOption__tagsList","aria-label":m.i18n.translate("xpack.globalSearchBar.searchBar.optionTagListAriaLabel",{defaultMessage:"Tags"})},e),S=({color:e,name:t,id:n})=>Object(c.jsx)("li",{className:"kbnSearchOption__tagsListItem",key:n},Object(c.jsx)(b.EuiBadge,{color:e},t)),k=({tags:e,searchTagIds:t})=>{if(!(e.length>3))return Object(c.jsx)(O,null,e.map(S));e.sort((e=>t.find((t=>t===e.id))?-1:1));const n=e.splice(3),a=m.i18n.translate("xpack.globalSearchBar.searchbar.overflowTagsAriaLabel",{defaultMessage:"{n} more {n, plural, one {tag} other {tags}}: {tags}",values:{n:n.length,tags:n.map((({name:e})=>e))}});return Object(c.jsx)(O,null,e.map(S),Object(c.jsx)("li",{className:"kbnSearchOption__tagsListItem","aria-label":a},Object(c.jsx)(b.EuiBadge,{title:a},"+",n.length)))},w=e=>{const{key:t,label:n,description:a,icon:r,suggestedSearch:s}=e;return{key:t,label:n,type:"__suggestion__",icon:{type:r},suggestion:s,meta:[{text:a}],"data-test-subj":"nav-search-option"}},T=({isMac:e})=>Object(c.jsx)(b.EuiFlexGroup,{alignItems:"center",justifyContent:"spaceBetween",gutterSize:"s",responsive:!1,wrap:!0},Object(c.jsx)(b.EuiFlexItem,null,Object(c.jsx)(b.EuiText,{color:"subdued",size:"xs"},Object(c.jsx)("p",null,Object(c.jsx)(i.FormattedMessage,{id:"xpack.globalSearchBar.searchBar.helpText.helpTextPrefix",defaultMessage:"Filter by"})," ",Object(c.jsx)(b.EuiCode,null,"type:")," ",Object(c.jsx)(i.FormattedMessage,{id:"xpack.globalSearchBar.searchBar.helpText.helpTextConjunction",defaultMessage:"or"})," ",Object(c.jsx)(b.EuiCode,null,"tag:")))),Object(c.jsx)(b.EuiFlexItem,{grow:!1},Object(c.jsx)(b.EuiText,{color:"subdued",size:"xs"},Object(c.jsx)("p",null,Object(c.jsx)(i.FormattedMessage,{id:"xpack.globalSearchBar.searchBar.shortcutDescription.shortcutDetail",defaultMessage:"{shortcutDescription} {commandDescription}",values:{shortcutDescription:Object(c.jsx)(i.FormattedMessage,{id:"xpack.globalSearchBar.searchBar.shortcutDescription.shortcutInstructionDescription",defaultMessage:"Shortcut"}),commandDescription:Object(c.jsx)(b.EuiCode,null,e?Object(c.jsx)(i.FormattedMessage,{id:"xpack.globalSearchBar.searchBar.shortcutDescription.macCommandDescription",defaultMessage:"Command + /"}):Object(c.jsx)(i.FormattedMessage,{id:"xpack.globalSearchBar.searchBar.shortcutDescription.windowsCommandDescription",defaultMessage:"Control + /"}))}}))))),C=({basePath:e,darkMode:t})=>Object(c.jsx)(b.EuiFlexGroup,{style:{minHeight:300},"data-test-subj":"nav-search-no-results",direction:"column",gutterSize:"xs",alignItems:"center",justifyContent:"center"},Object(c.jsx)(b.EuiFlexItem,{grow:!1},Object(c.jsx)(b.EuiImage,{alt:m.i18n.translate("xpack.globalSearchBar.searchBar.noResultsImageAlt",{defaultMessage:"Illustration of black hole"}),size:"fullWidth",url:`${e}illustration_product_no_search_results_${t?"dark":"light"}.svg`}),Object(c.jsx)(b.EuiText,{size:"m"},Object(c.jsx)("p",null,Object(c.jsx)(i.FormattedMessage,{id:"xpack.globalSearchBar.searchBar.noResultsHeading",defaultMessage:"No results found"}))),Object(c.jsx)("p",null,Object(c.jsx)(i.FormattedMessage,{id:"xpack.globalSearchBar.searchBar.noResults",defaultMessage:"Try searching for applications, dashboards, visualizations, and more."}))));n(16);const M=navigator.platform.toLowerCase().indexOf("mac")>=0,E=new FocusEvent("focusout",{bubbles:!0}),B=(e,t)=>e.score<t.score?1:e.score>t.score?-1:0,L=(e,t)=>{const n=e.title.toUpperCase(),a=t.title.toUpperCase();return n<a?-1:n>a?1:0},I=({globalSearch:e,taggingApi:t,navigateToUrl:n,trackUiMetric:r,basePathUrl:s,darkMode:i})=>{const o=g()(),{euiTheme:l}=Object(b.useEuiTheme)(),[d,f]=Object(a.useState)(!1),[O,S]=Object(a.useState)(""),[I,P]=Object(a.useState)(""),[D,F]=Object(a.useState)(null),[R,U]=Object(a.useState)(null),N=Object(a.useRef)(null),[A,$]=Object(a.useState)([]),[z,K]=Object(a.useState)([]),[H,Y]=Object(a.useState)(!0),G="__unknown__";Object(a.useEffect)((()=>{d&&(async()=>{const t=await e.getSearchableTypes();K(t)})()}),[e,d]);const q=Object(a.useCallback)((e=>(({searchTerm:e,searchableTypes:t,tagCache:n})=>{const a=[],r=e.trim(),s=((e,t)=>{for(const n of e)if(j(n,t))return n})(t,r);if(s){const e=y(s);a.push({key:"__type__suggestion__",label:`type: ${s}`,icon:"filter",description:m.i18n.translate("xpack.globalSearchBar.suggestions.filterByTypeLabel",{defaultMessage:"Filter by type"}),suggestedSearch:`type:${e}`})}if(n&&e){const e=n.getState().find((e=>j(e.name,r)));if(e){const t=y(e.name);a.push({key:"__tag__suggestion__",label:`tag: ${e.name}`,icon:"tag",description:m.i18n.translate("xpack.globalSearchBar.suggestions.filterByTagLabel",{defaultMessage:"Filter by tag name"}),suggestedSearch:`tag:${t}`})}}return a})({searchTerm:e,searchableTypes:z,tagCache:null==t?void 0:t.cache})),[t,z]),J=Object(a.useCallback)(((e,n,a=[])=>{o()&&$([...n.map(w),...e.map((e=>{var n;return((e,t,n)=>{var a;const{id:r,title:s,url:i,icon:o,type:l,meta:u={}}=e,{tagIds:d=[],categoryLabel:p=""}=u,f={key:r,label:s,url:i,type:l,icon:{type:"application"!==l&&"integration"!==l||!o?"empty":o},"data-test-subj":"nav-search-option"};var g;return f.meta="application"===l?[{text:p}]:[{text:(g=null!==(a=u.displayName)&&void 0!==a?a:l,(g.charAt(0).toUpperCase()+g.slice(1)).replace(/-/g," "))}],n&&d.length&&(f.append=Object(c.jsx)(k,{tags:d.map(n),searchTagIds:t})),f})(e,null!==(n=null==a?void 0:a.filter((e=>e!==G)))&&void 0!==n?n:[],null==t?void 0:t.ui.getTag)}))])}),[o,$,t]);u()((()=>{if(d){var n;N.current&&(N.current.unsubscribe(),N.current=null);const a=q(O);let s=[];0!==O.length&&r(h.METRIC_TYPE.COUNT,"search_request");const i=(e=>{let t;try{t=b.Query.parse(e)}catch(t){return{term:e,filters:{unknowns:{}}}}const n=(e=>{var t;let n;return e.ast.getTermClauses().length&&(n=e.ast.getTermClauses().map((e=>e.value)).join(" ").replace(/\s{2,}/g," ").trim()),null!==(t=n)&&void 0!==t&&t.length?n:void 0})(t),a=((e,t)=>{const n={};Object.entries(t).forEach((([e,t])=>{t.forEach((t=>{n[t]=e}))}));const a=new Map;return e.forEach(((e,t)=>{var r,s;const i=null!==(r=n[t])&&void 0!==r?r:t;a.set(i,[...null!==(s=a.get(i))&&void 0!==s?s:[],...e])})),a})((e=>{const t=new Map;return e.ast.clauses.forEach((e=>{if("field"===e.type){var n;const{field:a,value:r}=e;t.set(a,[...null!==(n=t.get(a))&&void 0!==n?n:[],...Array.isArray(r)?r:[r]])}})),t})(t),v),r=[...a.entries()].filter((([e])=>!_.includes(e))).reduce(((e,[t,n])=>({...e,[t]:n})),{}),s=a.get("tag"),i=a.get("type");return{term:n,filters:{tags:s?x(s):void 0,types:i?x(i):void 0,unknowns:r}}})(O),o=t&&i.filters.tags?i.filters.tags.map((e=>{var n;return null!==(n=t.ui.getTagIdFromName(e))&&void 0!==n?n:G})):void 0,c={term:i.term,types:i.filters.types,tags:o};P(null!==(n=i.term)&&void 0!==n?n:""),N.current=e.find(c,{}).subscribe({next:({results:e})=>{if(O.length>0)return s=[...e,...s].sort(B),void J(s,a,c.tags);e=e.filter((({type:e})=>"application"===e)),s=[...e,...s].sort(L),J(s,a,c.tags)},error:()=>{r(h.METRIC_TYPE.COUNT,"unhandled_error")},complete:()=>{}})}}),350,[O,q,z,d]);const W=Object(a.useCallback)((e=>{"/"===e.key&&(M?e.metaKey:e.ctrlKey)&&(e.preventDefault(),r(h.METRIC_TYPE.COUNT,"shortcut_used"),D?D.focus():R&&R.children[0].click())}),[R,D,r]),Q=Object(a.useCallback)((e=>{const t=e.find((({checked:e})=>"on"===e));if(!t)return;const{url:a,type:s,suggestion:i}=t;if("__suggestion__"!==s){try{if("application"===s){var o;const e=null!==(o=t.keys)&&void 0!==o?o:"unknown";r(h.METRIC_TYPE.CLICK,["user_navigated_to_application",`user_navigated_to_application_${e.toLowerCase().replaceAll(" ","_")}`])}else r(h.METRIC_TYPE.CLICK,["user_navigated_to_saved_object",`user_navigated_to_saved_object_${s}`])}catch(e){console.log("Error trying to track searchbar metrics",e)}n(a),document.activeElement.blur(),D&&(V(),D.dispatchEvent(E))}else S(i)}),[r,n,D]),V=()=>S(""),X=Object(c.jsx)(C,{darkMode:i,basePath:s}),Z=Object(c.jsx)(b.EuiFlexGroup,{direction:"column",justifyContent:"center",style:{minHeight:"300px"}},Object(c.jsx)(b.EuiFlexItem,{grow:!1},Object(c.jsx)(b.EuiLoadingSpinner,{size:"xl"}))),ee=m.i18n.translate("xpack.globalSearchBar.searchBar.placeholder",{defaultMessage:"Find apps, content, and more."}),te=`${m.i18n.translate("xpack.globalSearchBar.searchBar.shortcutTooltip.description",{defaultMessage:"Keyboard shortcut"})}: ${M?m.i18n.translate("xpack.globalSearchBar.searchBar.shortcutTooltip.macCommandDescription",{defaultMessage:"Command + /"}):m.i18n.translate("xpack.globalSearchBar.searchBar.shortcutTooltip.windowsCommandDescription",{defaultMessage:"Control + /"})}`;return p()("keydown",W),Object(c.jsx)(b.EuiSelectableTemplateSitewide,{isPreFiltered:!0,onChange:Q,options:A,className:"kbnSearchBar",popoverButtonBreakpoints:["xs","s"],singleSelection:!0,renderOption:e=>Object(b.euiSelectableTemplateSitewideRenderOptions)(e,I),searchProps:{value:O,onInput:e=>S(e.currentTarget.value),"data-test-subj":"nav-search-input",inputRef:F,compressed:!0,"aria-label":ee,placeholder:ee,onFocus:()=>{r(h.METRIC_TYPE.COUNT,"search_focus"),f(!0),Y(!1)},onBlur:()=>{Y(!O.length)},fullWidth:!0,append:H?Object(c.jsx)(b.EuiFormLabel,{title:te,css:Object(c.css)({fontFamily:l.font.familyCode},"","")},M?"⌘/":"^/"):void 0},emptyMessage:Z,noMatchesMessage:X,popoverProps:{"data-test-subj":"nav-search-popover",panelClassName:"navSearch__panel",repositionOnScroll:!0,buttonRef:U},popoverButton:Object(c.jsx)(b.EuiHeaderSectionItemButton,{"aria-label":m.i18n.translate("xpack.globalSearchBar.searchBar.mobileSearchButtonAriaLabel",{defaultMessage:"Site-wide search"})},Object(c.jsx)(b.EuiIcon,{type:"search",size:"m"})),popoverFooter:Object(c.jsx)(T,{isMac:M})})};class plugin_GlobalSearchBarPlugin{setup(){return{}}start(e,{globalSearch:t,savedObjectsTagging:n,usageCollection:a}){const r=a?a.reportUiCounter.bind(a,"global_search_bar"):(e,t)=>{};return e.chrome.navControls.registerCenter({order:1e3,mount:a=>this.mount({container:a,globalSearch:t,savedObjectsTagging:n,navigateToUrl:e.application.navigateToUrl,basePathUrl:e.http.basePath.prepend("/plugins/globalSearchBar/assets/"),darkMode:e.uiSettings.get("theme:darkMode"),theme$:e.theme.theme$,trackUiMetric:r})}),{}}mount({container:e,globalSearch:t,savedObjectsTagging:n,navigateToUrl:a,basePathUrl:r,darkMode:l,theme$:u,trackUiMetric:d}){return s.a.render(Object(c.jsx)(o.KibanaThemeProvider,{theme$:u},Object(c.jsx)(i.I18nProvider,null,Object(c.jsx)(I,{globalSearch:t,navigateToUrl:a,taggingApi:n,basePathUrl:r,darkMode:l,trackUiMetric:d}))),e),()=>s.a.unmountComponentAtNode(e)}}const P=()=>new plugin_GlobalSearchBarPlugin}]);