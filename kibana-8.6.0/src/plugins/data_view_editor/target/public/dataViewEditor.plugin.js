!function(e){function t(t){for(var n,o,i=t[0],a=t[1],c=0,u=[];c<i.length;c++)o=i[c],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&u.push(r[o][0]),r[o]=0;for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&(e[n]=a[n]);for(s&&s(t);u.length;)u.shift()()}var n={},r={0:0};function o(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(e){var t=[],n=r[e];if(0!==n)if(n)t.push(n[2]);else{var i=new Promise((function(t,o){n=r[e]=[t,o]}));t.push(n[2]=i);var a,c=document.createElement("script");c.charset="utf-8",c.timeout=120,o.nc&&c.setAttribute("nonce",o.nc),c.src=function(e){return o.p+"dataViewEditor.chunk."+e+".js"}(e);var s=new Error;a=function(t){c.onerror=c.onload=null,clearTimeout(u);var n=r[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;s.message="Loading chunk "+e+" failed.\n("+o+": "+i+")",s.name="ChunkLoadError",s.type=o,s.request=i,n[1](s)}r[e]=void 0}};var u=setTimeout((function(){a({type:"timeout",target:c})}),12e4);c.onerror=c.onload=a,document.head.appendChild(c)}return Promise.all(t)},o.m=e,o.c=n,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o.oe=function(e){throw console.error(e),e};var i=window.dataViewEditor_bundle_jsonpfunction=window.dataViewEditor_bundle_jsonpfunction||[],a=i.push.bind(i);i.push=t,i=i.slice();for(var c=0;c<i.length;c++)t(i[c]);var s=a;o(o.s=15)}([function(e,t){e.exports=__kbnSharedDeps__.EmotionReact},function(e,t,n){n.r(t);var r=__kbnBundles__.get("plugin/esUiShared/static/forms/hook_form_lib");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))},function(e,t,n){n.r(t);var r=__kbnBundles__.get("plugin/esUiShared/static/forms/components");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))},function(e,t){e.exports=__kbnSharedDeps__.React},function(e,t,n){"use strict";var r=n(5);n.d(t,"e",(function(){return r.createKibanaReactContext})),n.d(t,"h",(function(){return r.toMountPoint})),n.d(t,"k",(function(){return r.useKibana}));var o=n(1);n.d(t,"i",(function(){return o.useForm})),n.d(t,"j",(function(){return o.useFormData})),n.d(t,"a",(function(){return o.Form})),n.d(t,"d",(function(){return o.UseField})),n.d(t,"g",(function(){return o.getFieldValidityAndErrorMessage}));var i=n(13);n.d(t,"f",(function(){return i.fieldValidators}));var a=n(2);n.d(t,"b",(function(){return a.TextField})),n.d(t,"c",(function(){return a.ToggleField}))},function(e,t,n){n.r(t);var r=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))},function(e,t){e.exports=__kbnSharedDeps__.ElasticEui},function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var r=n(3),o=n(6),i=n(0);const a=Object(r.lazy)((()=>n.e(1).then(n.bind(null,29)))),c=e=>Object(i.jsx)(r.Suspense,{fallback:Object(i.jsx)(o.EuiLoadingSpinner,{size:"xl"})},Object(i.jsx)(a,e))},function(e,t,n){e.exports=n(14)(3)},function(e,t){e.exports=__kbnSharedDeps__.KbnI18nReact},function(e,t,n){"use strict";var r,o=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),i=[];function a(e){for(var t=-1,n=0;n<i.length;n++)if(i[n].identifier===e){t=n;break}return t}function c(e,t){for(var n={},r=[],o=0;o<e.length;o++){var c=e[o],s=t.base?c[0]+t.base:c[0],u=n[s]||0,l="".concat(s," ").concat(u);n[s]=u+1;var d=a(l),f={css:c[1],media:c[2],sourceMap:c[3]};-1!==d?(i[d].references++,i[d].updater(f)):i.push({identifier:l,updater:h(f,t),references:1}),r.push(l)}return r}function s(e){var t=document.createElement("style"),r=e.attributes||{};if(void 0===r.nonce){var i=n.nc;i&&(r.nonce=i)}if(Object.keys(r).forEach((function(e){t.setAttribute(e,r[e])})),"function"==typeof e.insert)e.insert(t);else{var a=o(e.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(t)}return t}var u,l=(u=[],function(e,t){return u[e]=t,u.filter(Boolean).join("\n")});function d(e,t,n,r){var o=n?"":r.media?"@media ".concat(r.media," {").concat(r.css,"}"):r.css;if(e.styleSheet)e.styleSheet.cssText=l(t,o);else{var i=document.createTextNode(o),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(i,a[t]):e.appendChild(i)}}function f(e,t,n){var r=n.css,o=n.media,i=n.sourceMap;if(o?e.setAttribute("media",o):e.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=r;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(r))}}var p=null,_=0;function h(e,t){var n,r,o;if(t.singleton){var i=_++;n=p||(p=s(t)),r=d.bind(null,n,i,!1),o=d.bind(null,n,i,!0)}else n=s(t),r=f.bind(null,n,t),o=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else o()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r));var n=c(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var r=0;r<n.length;r++){var o=a(n[r]);i[o].references--}for(var s=c(e,t),u=0;u<n.length;u++){var l=a(n[u]);0===i[l].references&&(i[l].updater(),i.splice(l,1))}n=s}}}},function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n,r,o,i=e[1]||"",a=e[3];if(!a)return i;if(t&&"function"==typeof btoa){var c=(n=a,r=btoa(unescape(encodeURIComponent(JSON.stringify(n)))),o="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(r),"/*# ".concat(o," */")),s=a.sources.map((function(e){return"/*# sourceURL=".concat(a.sourceRoot||"").concat(e," */")}));return[i].concat(s).concat([c]).join("\n")}return[i].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,r){"string"==typeof e&&(e=[[null,e,""]]);var o={};if(r)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(o[a]=!0)}for(var c=0;c<e.length;c++){var s=[].concat(e[c]);r&&o[s[0]]||(n&&(s[2]?s[2]="".concat(n," and ").concat(s[2]):s[2]=n),t.push(s))}},t}},function(e,t,n){"use strict";n.d(t,"a",(function(){return c})),n(3);var r=n(6),o=n(7),i=n(4),a=(n(17),n(0));const c=({onSave:e,onCancel:t=(()=>{}),services:n,defaultTypeIsRollup:c=!1,requireTimestampField:s=!1,editData:u,allowAdHocDataView:l})=>{const{Provider:d}=Object(i.e)(n);return Object(a.jsx)(d,null,Object(a.jsx)(r.EuiFlyout,{onClose:()=>{},hideCloseButton:!0,size:"l"},Object(a.jsx)(o.a,{onSave:e,onCancel:t,defaultTypeIsRollup:c,requireTimestampField:s,editData:u,allowAdHocDataView:l})))}},function(e,t,n){n.r(t);var r=__kbnBundles__.get("plugin/esUiShared/static/forms/helpers");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))},function(e,t){e.exports=__kbnSharedDeps_npm__},function(e,t,n){n(16),__kbnBundles__.define("plugin/dataViewEditor/public",n,22)},function(e,t,n){n.p=window.__kbnPublicPath__.dataViewEditor},function(e,t,n){switch(window.__kbnThemeTag__){case"v8dark":return n(18);case"v8light":return n(20)}},function(e,t,n){var r=n(10),o=n(19);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);r(o,{insert:"head",singleton:!1}),e.exports=o.locals||{}},function(e,t,n){(t=n(11)(!1)).push([e.i,".indexPatternEditor__form{flex-grow:1}.fieldEditor__mainFlyoutPanel{display:flex;flex-direction:column}.indexPatternEditor__footer{margin-left:-24px;margin-right:-24px}",""]),e.exports=t},function(e,t,n){var r=n(10),o=n(21);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);r(o,{insert:"head",singleton:!1}),e.exports=o.locals||{}},function(e,t,n){(t=n(11)(!1)).push([e.i,".indexPatternEditor__form{flex-grow:1}.fieldEditor__mainFlyoutPanel{display:flex;flex-direction:column}.indexPatternEditor__footer{margin-left:-24px;margin-right:-24px}",""]),e.exports=t},function(e,t,n){"use strict";n.r(t),n.d(t,"plugin",(function(){return d}));var r=n(8),o=n.n(r),i=(n(3),n(9)),a=n(4),c=n(7),s=n(0);const u=({core:e,searchClient:t,dataViews:n})=>r=>{const{uiSettings:o,overlays:u,docLinks:l,notifications:d,http:f,application:p}=e,{Provider:_}=Object(a.e)({uiSettings:o,docLinks:l,http:f,notifications:d,application:p,dataViews:n,overlays:u,searchClient:t});let h=null;return(({onSave:t,onCancel:n=(()=>{}),defaultTypeIsRollup:r=!1,requireTimestampField:o=!1,allowAdHocDataView:l=!1,editData:d})=>{const f=()=>{h&&(h.close(),h=null)};return h=u.openFlyout(Object(a.h)(Object(s.jsx)(_,null,Object(s.jsx)(i.I18nProvider,null,Object(s.jsx)(c.a,{onSave:e=>{f(),t&&t(e)},onCancel:()=>{f(),n()},editData:d,defaultTypeIsRollup:r,requireTimestampField:o,allowAdHocDataView:l,showManagementLink:Boolean(d&&d.isPersisted())}))),{theme$:e.theme.theme$}),{hideCloseButton:!0,size:"l"}),f})(r)};var l=n(12);class plugin_DataViewEditorPlugin{setup(e,t){return{}}start(e,t){const{application:n,uiSettings:r,docLinks:i,http:a,notifications:c,overlays:d}=e,{data:f,dataViews:p}=t;return{openEditor:u({core:e,dataViews:p,searchClient:f.search.search}),IndexPatternEditorComponent:e=>Object(s.jsx)(l.a,o()({services:{uiSettings:r,docLinks:i,http:a,notifications:c,application:n,overlays:d,dataViews:p,searchClient:f.search.search}},e)),userPermissions:{editDataView:()=>p.getCanSaveSync()}}}stop(){return{}}}function d(){return new plugin_DataViewEditorPlugin}},function(e,t){e.exports=__kbnSharedDeps__.KbnI18n},function(e,t,n){n.r(t);var r=__kbnBundles__.get("plugin/dataViews/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))},function(e,t){e.exports=__kbnSharedDeps__.Rxjs},function(e,t){e.exports=__kbnSharedDeps__.Classnames},function(e,t){e.exports=__kbnSharedDeps__.TsLib},function(e,t){e.exports=__kbnSharedDeps__.KbnUiTheme}]);