(window.visTypeTimeseries_bundle_jsonpfunction=window.visTypeTimeseries_bundle_jsonpfunction||[]).push([[7],{105:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var i=n(33),a=n.n(i);const r={M:0,d:1};function s(e,t,n,i){const s=a()(r).utcOffset();return r=>{var l;const o=a()(r);return i&&o.utcOffset(s),o.format(null!==(l=function(e,t=[]){for(let n=t.length-1;n>=0;n--){const i=t[n];if(!i[0]||e>=Number(a.a.duration(i[0])))return i[1]}}(e,t))&&void 0!==l?l:n)}}},177:function(e,t,n){switch(window.__kbnThemeTag__){case"v8dark":return n(178);case"v8light":return n(180)}},178:function(e,t,n){var i=n(46),a=n(179);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);i(a,{insert:"head",singleton:!1}),e.exports=a.locals||{}},179:function(e,t,n){(t=n(47)(!1)).push([e.i,".tvbLastValueIndicator{align-self:flex-end}",""]),e.exports=t},180:function(e,t,n){var i=n(46),a=n(181);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);i(a,{insert:"head",singleton:!1}),e.exports=a.locals||{}},181:function(e,t,n){(t=n(47)(!1)).push([e.i,".tvbLastValueIndicator{align-self:flex-end}",""]),e.exports=t},182:function(e,t,n){switch(window.__kbnThemeTag__){case"v8dark":return n(183);case"v8light":return n(185)}},183:function(e,t,n){var i=n(46),a=n(184);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);i(a,{insert:"head",singleton:!1}),e.exports=a.locals||{}},184:function(e,t,n){(t=n(47)(!1)).push([e.i,".tvbVis{display:flex;flex:1 1 100%;flex-direction:column;position:relative}.tvbVis .tvbVisTimeSeries{bottom:0;left:0;position:absolute;right:0;top:0}.tvbVis .tvbVisTimeSeriesDark .echLegendItem,.tvbVis .tvbVisTimeSeriesDark .echReactiveChart_unavailable{color:#dfe5ef}.tvbVis .tvbVisTimeSeriesLight .echLegendItem,.tvbVis .tvbVisTimeSeriesLight .echReactiveChart_unavailable{color:#343741}",""]),e.exports=t},185:function(e,t,n){var i=n(46),a=n(186);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);i(a,{insert:"head",singleton:!1}),e.exports=a.locals||{}},186:function(e,t,n){(t=n(47)(!1)).push([e.i,".tvbVis{display:flex;flex:1 1 100%;flex-direction:column;position:relative}.tvbVis .tvbVisTimeSeries{bottom:0;left:0;position:absolute;right:0;top:0}.tvbVis .tvbVisTimeSeriesDark .echLegendItem,.tvbVis .tvbVisTimeSeriesDark .echReactiveChart_unavailable{color:#dfe5ef}.tvbVis .tvbVisTimeSeriesLight .echLegendItem,.tvbVis .tvbVisTimeSeriesLight .echReactiveChart_unavailable{color:#343741}",""]),e.exports=t},228:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return x})),n(177);var i=n(5),a=n(15),r=n(2);const s=()=>Object(r.jsx)("div",{className:"visChart__spinner"},Object(r.jsx)(a.EuiLoadingChart,{mono:!0,size:"l"}));n(182);const l={timeseries:Object(i.lazy)((()=>Promise.all([n.e(0),n.e(1),n.e(13)]).then(n.bind(null,227)))),metric:Object(i.lazy)((()=>Promise.all([n.e(0),n.e(1),n.e(6)]).then(n.bind(null,231)))),top_n:Object(i.lazy)((()=>Promise.all([n.e(0),n.e(1),n.e(10)]).then(n.bind(null,232)))),table:Object(i.lazy)((()=>Promise.all([n.e(1),n.e(8)]).then(n.bind(null,226)))),gauge:Object(i.lazy)((()=>Promise.all([n.e(0),n.e(1),n.e(5)]).then(n.bind(null,229)))),markdown:Object(i.lazy)((()=>Promise.all([n.e(0),n.e(1),n.e(9)]).then(n.bind(null,233))))};var o=n(19),c=n(30),u=n(61),d=n(1),f=n(12),m=n(0),v=n(52);const b=(e,t)=>e.map((e=>{const n=t.getFieldByName(e.name),i=(null==n?void 0:n.spec.type)||"number";let a={field:null==n?void 0:n.spec.name};if(e.type===c.BUCKET_TYPES.MULTI_TERMS)a={fields:e.fields,otherBucket:!0};else if(e.type===d.a.FILTERS&&e.params)a={filters:e.params.map((e=>({input:e.filter,label:e.label})))};else if("date_histogram"===e.type){const{query:e}=Object(m.c)();a={timeRange:e.timefilter.timefilter.getTime()}}return{id:e.id.toString(),name:e.name,meta:{type:i,field:null==n?void 0:n.spec.name,index:t.title,source:"esaggs",sourceParams:{enabled:!0,indexPatternId:null==t?void 0:t.id,type:e.type,schema:e.isMetric?"metric":"group",params:a}}}})),p=async(e,t,n)=>{const i={},a=Object(m.d)();for(let r=0;r<e.series.length;r++){const s=e.series[r];let l=n;if(s.override_index_pattern){const{indexPattern:e}=await Object(f.b)(s.series_index_pattern,a);e&&(l=e)}const o=s.split_mode===d.a.TERMS&&!s.metrics.some((e=>e.type===d.i.SERIES_AGG)),m=s.split_mode===d.a.FILTERS,p=t.filter((e=>e.seriesId===s.id));let g=v.e;const h=[{id:g,name:l.timeFieldName||"",isMetric:!1,type:"date_histogram"}];if(p.length){g++;const e=s.metrics;if(h.push({id:g,name:e[e.length-1].field||p[0].splitByLabel,isMetric:!0,type:e[e.length-1].type}),o){const e=Object(u.d)(s.terms_field);g++,h.push({id:g,name:Object(u.e)(e),fields:e,isMetric:!1,type:e.length>1?c.BUCKET_TYPES.MULTI_TERMS:d.a.TERMS})}else m&&(g++,h.push({id:g,name:d.a.FILTERS,isMetric:!1,params:null==s?void 0:s.split_filters,type:d.a.FILTERS}))}const y=b(h,l),j=h.find((e=>e.type===d.a.FILTERS));let C=[];for(let e=0;e<p.length;e++){const{data:t,label:n,isSplitByTerms:i,termsSplitKey:a}=p[e],r=t.map((e=>{let t=v.e;const r={[t++]:e[0],[t++]:e[1]};let s;if(o||j){const e=Array.isArray(a)?new c.MultiFieldKey({key:a}):a;s={[t]:i&&void 0!==e?e:[n].flat()[0]}}return s?{...r,...s}:r}));C=[...C,...r]}i[s.id]={type:"datatable",rows:C,columns:y}}return i};var g=n(8),h=n(3),y=n(16),j=n(73),C=n(105);const T=h.i18n.translate("visTypeTimeseries.lastValueModeIndicator.lastValue",{defaultMessage:"Last value"}),O=({seriesData:e,panelInterval:t,modelInterval:n,ignoreDaylightTime:i})=>{if(null==e||!e.length)return Object(r.jsx)(a.EuiBadge,null,T);const s=Object(m.g)().get("dateFormat"),l=Object(m.g)().get("dateFormat:scaled"),o=Object(C.a)(t,l,s,i)(e[e.length-1][0]),c=(Object(j.c)(n)||Object(j.d)(n))&&(()=>{const e=Object(j.a)(t,!1);return e&&`${e.unitValue}${e.unitString}`})(),u=Object(r.jsx)(a.EuiFlexGroup,{direction:"column",gutterSize:"none"},Object(r.jsx)(a.EuiFlexItem,{grow:!1},Object(r.jsx)(y.FormattedMessage,{id:"visTypeTimeseries.lastValueModeIndicator.lastBucketDate",defaultMessage:"Bucket: {lastBucketDate}",values:{lastBucketDate:o}})),c&&Object(r.jsx)(a.EuiFlexItem,{grow:!1},Object(r.jsx)(y.FormattedMessage,{id:"visTypeTimeseries.lastValueModeIndicator.panelInterval",defaultMessage:"Interval: {formattedPanelInterval}",values:{formattedPanelInterval:c}})));return Object(r.jsx)(a.EuiToolTip,{position:"top",display:"inlineBlock",content:u},Object(r.jsx)(a.EuiBadge,{iconType:"iInCircle",iconSide:"right",onClick:()=>{},onClickAriaLabel:h.i18n.translate("visTypeTimeseries.lastValueModeIndicator.lastValueModeBadgeAriaLabel",{defaultMessage:"View last value details"})},T))};function x({visData:e,model:t,handlers:n,uiState:c,getConfig:u,syncColors:b,syncCursor:h,syncTooltips:y,initialRender:C}){var T,x,L;const[_,M]=Object(i.useState)(null),[E,I]=Object(i.useState)(null);Object(i.useEffect)((()=>{Object(m.a)().palettes.getPalettes().then((e=>I(e)))}),[]),Object(i.useEffect)((()=>{Object(f.b)(t.index_pattern,Object(m.d)()).then((e=>M(e.indexPattern)))}),[t.index_pattern]);const S=Object(i.useCallback)((async(e,i,a)=>{let r;if(_){const n=_?await p(t,a,_):null,s=null==n?void 0:n[t.series[0].id],l=[parseInt(e,10),parseInt(i,10)];r={data:{table:s,column:v.e,range:l,timeFieldName:null==_?void 0:_.timeFieldName},name:"brush"}}else r={name:"applyFilter",data:{timeFieldName:"*",filters:[{query:{range:{"*":{gte:e,lte:i}}}}]}};n.event(r)}),[n,_,t]),w=Object(i.useCallback)((async(e,i)=>{if(!_)return;const a=_?await p(t,e,_):null;if(!a)return;const r=((e,t,n)=>{const i=[];return e.forEach((e=>{const[a]=e,{specId:r}=e[1],[s,l]=r.split(g.c),o=t[s],c=n.series.filter((({id:e})=>e===s));let u=l;if(l&&c.length&&c[0].split_mode===d.a.FILTERS){var f,m,b;const e=null===(f=c[0])||void 0===f||null===(m=f.split_filters)||void 0===m?void 0:m.filter((({id:e})=>e===l));u=(null==e?void 0:e[0].label)||(null==e||null===(b=e[0].filter)||void 0===b?void 0:b.query)}const p=o.rows.findIndex((e=>{const t=a.x===e[v.e]&&a.y===e[v.e+1];if(l){var n,i;const a=null!==(n=null===(i=e[v.e+2].keys)||void 0===i?void 0:i.join())&&void 0!==n?n:e[v.e+2].toString();return t&&a===u}return t}));if(p<0)return;const h=o.columns.filter((e=>{var t;return"group"===(null===(t=e.meta.sourceParams)||void 0===t?void 0:t.schema)})).map((({id:e})=>{var t;return{table:o,column:parseInt(e,10),row:p,value:null!==(t=o.rows[p][e])&&void 0!==t?t:null}}));h.length&&i.push(...h)})),i})(i,a,t),s={name:"filter",data:{data:r,negate:!1,timeFieldName:_.timeFieldName}};n.event(s)}),[n,_,t]),F=Object(i.useCallback)(((e,t)=>{c.set(e,t),c.emit("reload")}),[c]),V=l[t.type],R=!(t.time_range_mode&&t.time_range_mode!==d.f.LAST_VALUE||t.hide_last_value_indicator||t.type===d.e.TIMESERIES),[k]=null!==(T=Object(o.a)(e)?e.series:null===(x=e[t.id])||void 0===x?void 0:x.series)&&void 0!==T?T:[];return V&&null!==E&&null!==_?Object(r.jsx)(a.EuiFlexGroup,{direction:"column",gutterSize:"none",responsive:!1},R&&Object(r.jsx)(a.EuiFlexItem,{className:"tvbLastValueIndicator",grow:!1},Object(r.jsx)(O,{seriesData:null==k?void 0:k.data,ignoreDaylightTime:t.ignore_daylight_time,panelInterval:Object(j.b)(e,t),modelInterval:null!==(L=t.interval)&&void 0!==L?L:g.a})),Object(r.jsx)(a.EuiFlexItem,null,Object(r.jsx)(i.Suspense,{fallback:Object(r.jsx)("div",{className:"visChart__spinner"},Object(r.jsx)(a.EuiLoadingChart,{mono:!0,size:"l"}))},Object(r.jsx)(V,{getConfig:u,model:t,visData:e,uiState:c,onBrush:S,initialRender:C,onFilterClick:w,onUiState:F,syncColors:b,syncTooltips:y,syncCursor:h,palettesService:E,indexPattern:_,fieldFormatMap:null==_?void 0:_.fieldFormatMap})))):Object(r.jsx)(s,null)}},46:function(e,t,n){"use strict";var i,a=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),r=[];function s(e){for(var t=-1,n=0;n<r.length;n++)if(r[n].identifier===e){t=n;break}return t}function l(e,t){for(var n={},i=[],a=0;a<e.length;a++){var l=e[a],o=t.base?l[0]+t.base:l[0],c=n[o]||0,u="".concat(o," ").concat(c);n[o]=c+1;var d=s(u),f={css:l[1],media:l[2],sourceMap:l[3]};-1!==d?(r[d].references++,r[d].updater(f)):r.push({identifier:u,updater:b(f,t),references:1}),i.push(u)}return i}function o(e){var t=document.createElement("style"),i=e.attributes||{};if(void 0===i.nonce){var r=n.nc;r&&(i.nonce=r)}if(Object.keys(i).forEach((function(e){t.setAttribute(e,i[e])})),"function"==typeof e.insert)e.insert(t);else{var s=a(e.insert||"head");if(!s)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");s.appendChild(t)}return t}var c,u=(c=[],function(e,t){return c[e]=t,c.filter(Boolean).join("\n")});function d(e,t,n,i){var a=n?"":i.media?"@media ".concat(i.media," {").concat(i.css,"}"):i.css;if(e.styleSheet)e.styleSheet.cssText=u(t,a);else{var r=document.createTextNode(a),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(r,s[t]):e.appendChild(r)}}function f(e,t,n){var i=n.css,a=n.media,r=n.sourceMap;if(a?e.setAttribute("media",a):e.removeAttribute("media"),r&&"undefined"!=typeof btoa&&(i+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),e.styleSheet)e.styleSheet.cssText=i;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(i))}}var m=null,v=0;function b(e,t){var n,i,a;if(t.singleton){var r=v++;n=m||(m=o(t)),i=d.bind(null,n,r,!1),a=d.bind(null,n,r,!0)}else n=o(t),i=f.bind(null,n,t),a=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return i(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;i(e=t)}else a()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===i&&(i=Boolean(window&&document&&document.all&&!window.atob)),i));var n=l(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var i=0;i<n.length;i++){var a=s(n[i]);r[a].references--}for(var o=l(e,t),c=0;c<n.length;c++){var u=s(n[c]);0===r[u].references&&(r[u].updater(),r.splice(u,1))}n=o}}}},47:function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n,i,a,r=e[1]||"",s=e[3];if(!s)return r;if(t&&"function"==typeof btoa){var l=(n=s,i=btoa(unescape(encodeURIComponent(JSON.stringify(n)))),a="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(i),"/*# ".concat(a," */")),o=s.sources.map((function(e){return"/*# sourceURL=".concat(s.sourceRoot||"").concat(e," */")}));return[r].concat(o).concat([l]).join("\n")}return[r].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,i){"string"==typeof e&&(e=[[null,e,""]]);var a={};if(i)for(var r=0;r<this.length;r++){var s=this[r][0];null!=s&&(a[s]=!0)}for(var l=0;l<e.length;l++){var o=[].concat(e[l]);i&&a[o[0]]||(n&&(o[2]?o[2]="".concat(n," and ").concat(o[2]):o[2]=n),t.push(o))}},t}},52:function(e,t,n){"use strict";var i=n(55);n.d(t,"a",(function(){return i.b})),n.d(t,"c",(function(){return i.c})),n.d(t,"d",(function(){return i.d})),n.d(t,"e",(function(){return i.e})),n.d(t,"f",(function(){return i.f})),n.d(t,"g",(function(){return i.g}));var a=n(57);n.d(t,"b",(function(){return a.a}))},55:function(e,t,n){"use strict";n.d(t,"a",(function(){return i})),n.d(t,"b",(function(){return a})),n.d(t,"e",(function(){return r})),n.d(t,"d",(function(){return s})),n.d(t,"g",(function(){return l})),n.d(t,"f",(function(){return o})),n.d(t,"c",(function(){return c}));const i={LINE_COLOR:"rgba(105,112,125,0.2)",TEXT_COLOR:"rgba(0,0,0,0.4)",TEXT_COLOR_REVERSED:"rgba(255,255,255,0.5)",VALUE_COLOR:"rgba(0,0,0,0.7)",VALUE_COLOR_REVERSED:"rgba(255,255,255,0.8)"},a={stroke:"rgba(125,125,125,0.1)"},r=0,s=[0],l=[1],o=[2],c={NONE:"none",PERCENT:"percent",STACKED:"stacked",STACKED_WITHIN_SERIES:"stacked_within_series"}},57:function(e,t,n){"use strict";n.d(t,"a",(function(){return a})),n(5);var i=n(2);const a={"fa-asterisk":"asterisk","fa-bell":"bell","fa-bolt":"bolt","fa-bomb":()=>Object(i.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},Object(i.jsx)("path",{d:"M3.92176768,4.53361616 L3.46466635,5.59664282 L2.65302767,4.14840719 L0.999875397,3.99598886 L2.12641918,2.77654518 L1.76052549,1.15720408 L3.26840652,1.85178207 L4.69542405,1.00339256 L4.500802,2.65210905 L5.74864103,3.7471166 L4.73514583,3.9490388 L5.61669633,5.03766301 C6.0459022,4.69009896 6.67559863,4.75628272 7.02316269,5.18548858 L7.15815921,5.3521954 C7.8837785,5.06498672 8.68754455,4.943927 9.51742529,5.03115098 C12.2637217,5.31979836 14.2560398,7.78010639 13.9673924,10.5264028 C13.6787451,13.2726992 11.218437,15.2650173 8.47214065,14.9763699 C5.72584427,14.6877226 3.73352611,12.2274145 4.02217349,9.48111814 C4.10939747,8.6512374 4.39492411,7.8902053 4.82672133,7.24015658 L4.6917248,7.07344975 C4.34416075,6.64424389 4.41034451,6.01454746 4.83955037,5.6669834 L3.92176768,4.53361616 Z M5.46887076,6.44412936 L6.12580983,7.24015658 C6.03489722,7.30663504 5.87952666,7.491071 5.65969815,7.79346445 C5.30650784,8.32517447 5.08508565,8.93495668 5.01669539,9.5856466 C4.78577748,11.7826837 6.37963201,13.7509301 8.57666912,13.981848 C10.7737062,14.2127659 12.7419526,12.6189114 12.9728706,10.4218743 C13.2037885,8.2248372 11.6099339,6.25659078 9.41289682,6.02567287 C8.7622069,5.95728261 8.11971364,6.04708534 7.52619036,6.28200886 C7.24048061,6.40187373 7.0242157,6.5121707 6.87739563,6.61289978 L6.24601673,5.81480897 L5.46887076,6.44412936 Z M3.34009664,3.61834468 C3.6160708,3.60870745 3.83197954,3.37717367 3.82234231,3.10119951 C3.81270508,2.82522536 3.5811713,2.60931662 3.30519715,2.61895385 C3.02922299,2.62859108 2.81331425,2.86012485 2.82295148,3.13609901 C2.83258871,3.41207317 3.06412249,3.62798191 3.34009664,3.61834468 Z M9.2038399,8.01471666 C8.92921026,7.98585193 8.72997844,7.73982112 8.75884318,7.46519148 C8.78770792,7.19056185 9.03373872,6.99133003 9.30836836,7.02019477 C10.7411945,7.17079087 11.8319627,8.30660625 11.9782919,9.68376241 C11.9842403,9.72621687 11.9855849,9.77015886 11.9808868,9.81485847 C11.9520221,10.0894881 11.7059913,10.2887199 11.4313616,10.2598552 C11.1835304,10.2338071 10.9971003,10.0309074 10.9842889,9.78973323 C10.8859009,8.87197536 10.1588372,8.11509093 9.2038399,8.01471666 Z"})),"fa-bug":"bug","fa-comment":"editorComment","fa-exclamation-triangle":"alert","fa-fire":()=>Object(i.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},Object(i.jsx)("path",{d:"M10.4285489,13.2131862 C11.3850613,12.5116211 12,11.4062861 12,10.1681623 C12,8.88948911 11.7647926,7.64522527 11.315853,6.48027409 L10.7184365,8.07936372 L9.62838732,6.51595716 C8.65161637,5.11502026 7.41222171,3.90368767 5.9820674,2.94508952 C5.99399825,3.12925457 6,3.31436795 6,3.50022638 C6,5.08794888 5.48443413,6.95085436 4.74437685,7.94154468 C4.26219055,8.5870316 4,9.35779518 4,10.1681623 C4,11.4427639 4.65170744,12.5766371 5.65687647,13.2741368 C5.73557697,13.041105 5.84196228,12.8229717 5.97161458,12.624616 C6.26836682,12.1706132 6.5,11.2280234 6.5,10.4287008 C6.5,9.92871906 6.42479348,9.44813694 6.28619258,9 C7.47628141,9.64169048 8.4897566,10.6210605 9.22434324,11.8251557 C9.23213615,11.8013168 9.2406884,11.7775998 9.25,11.7540048 C9.39656041,11.3826304 9.5,11.0805724 9.5,10.6495848 C9.5,10.6240812 9.49971537,10.5986511 9.49914944,10.5732981 C9.96875289,11.3529062 10.2928315,12.2486386 10.4285489,13.2131862 Z M10.4486865,5.94402249 C10.4642723,5.90230435 10.4813768,5.86079967 10.5,5.81950846 C10.7931208,5.16960326 11,4.64100165 11,3.88677339 C11,3.84214218 10.9994307,3.79763944 10.9982989,3.7532716 C12.2630338,5.59045545 13,7.7961396 13,10.1681623 C13,12.8367126 10.7614237,15 8,15 C5.23857625,15 3,12.8367126 3,10.1681623 C3,9.11340491 3.34972471,8.13758287 3.94322917,7.34307798 C4.53673363,6.54857309 5,4.8990409 5,3.50022638 C5,2.62525836 4.84958695,1.78423964 4.57238517,1 C6.95256283,2.12295834 8.97951321,3.83685594 10.4486865,5.94402249 Z"})),"fa-flag":"flag","fa-heart":"heart","fa-map-marker":"mapMarker","fa-map-pin":"pinFilled","fa-star":"starFilled","fa-tag":"tag"}},61:function(e,t,n){"use strict";n.d(t,"c",(function(){return s})),n.d(t,"f",(function(){return l})),n.d(t,"d",(function(){return o})),n.d(t,"e",(function(){return c})),n.d(t,"b",(function(){return u})),n.d(t,"a",(function(){return d}));var i=n(3),a=n(30),r=n(18);const s=(e,t,n=!0)=>{if(e.length&&t){const i=e.find((e=>e.name===t));if(i)return i.label||i.name;if(n)throw new r.b(t)}return t},l=e=>e.filter((e=>e.aggregatable&&!Object(a.isNestedField)(e))).map((e=>{var t;return{name:e.name,label:null!==(t=e.customLabel)&&void 0!==t?t:e.name,type:e.type}})),o=e=>e?[e].flat().filter(Boolean):[],c=(e,t)=>{const n=t?s(t,e[0]):e[0];return e.length>1?i.i18n.translate("visTypeTimeseries.fieldUtils.multiFieldLabel",{defaultMessage:"{firstFieldLabel} + {count} {count, plural, one {other} other {others}}",values:{firstFieldLabel:n,count:e.length-1}}):null!=n?n:""},u=(e,t,n,i,a=[])=>{const r=new Map;return(s,l,o="text")=>{var c,u;const d=r.get(s),f=e=>e.convert(l,o,i?{timezone:i.timezone}:void 0);if(d)return f(d);const m=null==e||null===(c=e.fieldFormatMap)||void 0===c||null===(u=c[s])||void 0===u?void 0:u.id;if(e&&!a.includes(m)){const t=e.fields.getByName(s);if(t){const n=e.getFormatterForField(t);if(n)return r.set(s,n),f(n)}}else if(n&&t){const e=t.find((e=>e.name===s));if(e){const t=n.getDefaultInstance(e.type);if(t)return r.set(s,t),f(t)}}}},d=" › "},73:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"d",(function(){return p})),n.d(t,"c",(function(){return g})),n.d(t,"e",(function(){return h})),n.d(t,"b",(function(){return y}));var i=n(33),a=n.n(i),r=n(3),s=n(9),l=n(29),o=n(36),c=n.n(o);const u=new RegExp(`^>=([\\d\\.]+\\s*(${c.a.units.join("|")}))$`);new RegExp(`^([\\d\\.]+)\\s*(${c.a.units.join("|")})$`);var d=n(8),f=n(19);const{parseEsInterval:m}=l.search.aggs,v={s:r.i18n.translate("visTypeTimeseries.getInterval.secondsLabel",{defaultMessage:"seconds"}),m:r.i18n.translate("visTypeTimeseries.getInterval.minutesLabel",{defaultMessage:"minutes"}),h:r.i18n.translate("visTypeTimeseries.getInterval.hoursLabel",{defaultMessage:"hours"}),d:r.i18n.translate("visTypeTimeseries.getInterval.daysLabel",{defaultMessage:"days"}),w:r.i18n.translate("visTypeTimeseries.getInterval.weeksLabel",{defaultMessage:"weeks"}),M:r.i18n.translate("visTypeTimeseries.getInterval.monthsLabel",{defaultMessage:"months"}),y:r.i18n.translate("visTypeTimeseries.getInterval.yearsLabel",{defaultMessage:"years"})},b=(e,t=!0)=>{const n=Object.keys(v).reverse(),i=a.a.duration(e,"ms");for(let e=0;e<n.length;e++){const a=i.as(n[e]);if(Math.abs(a)>1)return{unitValue:Math.round(Math.abs(a)),unitString:t?v[n[e]]:n[e]}}},p=e=>u.test(e),g=e=>!e||e===d.a,h=e=>{const t={};try{m(e)}catch({message:e}){t.errorMessage=e}finally{t.isValid=!t.errorMessage}return t},y=(e,t)=>Object(s.get)(e,Object(f.a)(e)?"series[0].series":`${t.id}.series`,[]).reduce(((e,t)=>{if(t.data.length>1&&"number"==typeof t.data[1][0]&&"number"==typeof t.data[0][0]){const n=t.data[1][0]-t.data[0][0];if(!e||n<e)return n}return e}),0)}}]);