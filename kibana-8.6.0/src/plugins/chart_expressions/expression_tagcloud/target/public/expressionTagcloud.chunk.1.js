(window.expressionTagcloud_bundle_jsonpfunction=window.expressionTagcloud_bundle_jsonpfunction||[]).push([[1],{20:function(e,t,n){"use strict";var a,o=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),r=[];function i(e){for(var t=-1,n=0;n<r.length;n++)if(r[n].identifier===e){t=n;break}return t}function c(e,t){for(var n={},a=[],o=0;o<e.length;o++){var c=e[o],s=t.base?c[0]+t.base:c[0],l=n[s]||0,u="".concat(s," ").concat(l);n[s]=l+1;var d=i(u),f={css:c[1],media:c[2],sourceMap:c[3]};-1!==d?(r[d].references++,r[d].updater(f)):r.push({identifier:u,updater:h(f,t),references:1}),a.push(u)}return a}function s(e){var t=document.createElement("style"),a=e.attributes||{};if(void 0===a.nonce){var r=n.nc;r&&(a.nonce=r)}if(Object.keys(a).forEach((function(e){t.setAttribute(e,a[e])})),"function"==typeof e.insert)e.insert(t);else{var i=o(e.insert||"head");if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(t)}return t}var l,u=(l=[],function(e,t){return l[e]=t,l.filter(Boolean).join("\n")});function d(e,t,n,a){var o=n?"":a.media?"@media ".concat(a.media," {").concat(a.css,"}"):a.css;if(e.styleSheet)e.styleSheet.cssText=u(t,o);else{var r=document.createTextNode(o),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(r,i[t]):e.appendChild(r)}}function f(e,t,n){var a=n.css,o=n.media,r=n.sourceMap;if(o?e.setAttribute("media",o):e.removeAttribute("media"),r&&"undefined"!=typeof btoa&&(a+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),e.styleSheet)e.styleSheet.cssText=a;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(a))}}var g=null,p=0;function h(e,t){var n,a,o;if(t.singleton){var r=p++;n=g||(g=s(t)),a=d.bind(null,n,r,!1),o=d.bind(null,n,r,!0)}else n=s(t),a=f.bind(null,n,t),o=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return a(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;a(e=t)}else o()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===a&&(a=Boolean(window&&document&&document.all&&!window.atob)),a));var n=c(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var a=0;a<n.length;a++){var o=i(n[a]);r[o].references--}for(var s=c(e,t),l=0;l<n.length;l++){var u=i(n[l]);0===r[u].references&&(r[u].updater(),r.splice(u,1))}n=s}}}},21:function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n,a,o,r=e[1]||"",i=e[3];if(!i)return r;if(t&&"function"==typeof btoa){var c=(n=i,a=btoa(unescape(encodeURIComponent(JSON.stringify(n)))),o="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(o," */")),s=i.sources.map((function(e){return"/*# sourceURL=".concat(i.sourceRoot||"").concat(e," */")}));return[r].concat(s).concat([c]).join("\n")}return[r].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,a){"string"==typeof e&&(e=[[null,e,""]]);var o={};if(a)for(var r=0;r<this.length;r++){var i=this[r][0];null!=i&&(o[i]=!0)}for(var c=0;c<e.length;c++){var s=[].concat(e[c]);a&&o[s[0]]||(n&&(s[2]?s[2]="".concat(n," and ").concat(s[2]):s[2]=n),t.push(s))}},t}},22:function(e,t,n){switch(window.__kbnThemeTag__){case"v8dark":return n(23);case"v8light":return n(25)}},23:function(e,t,n){var a=n(20),o=n(24);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);a(o,{insert:"head",singleton:!1}),e.exports=o.locals||{}},24:function(e,t,n){(t=n(21)(!1)).push([e.i,".tgcChart__wrapper{display:flex;flex:1 1 0;flex-direction:column;height:100%}.tgcChart__wrapper text{cursor:pointer}.tgcChart__label{font-weight:700;text-align:center;width:100%}.tgcChart__warning{width:16px}",""]),e.exports=t},25:function(e,t,n){var a=n(20),o=n(26);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);a(o,{insert:"head",singleton:!1}),e.exports=o.locals||{}},26:function(e,t,n){(t=n(21)(!1)).push([e.i,".tgcChart__wrapper{display:flex;flex:1 1 0;flex-direction:column;height:100%}.tgcChart__wrapper text{cursor:pointer}.tgcChart__label{font-weight:700;text-align:center;width:100%}.tgcChart__warning{width:16px}",""]),e.exports=t},27:function(e,t,n){"use strict";n.r(t),n.d(t,"TagCloudChart",(function(){return p})),n.d(t,"default",(function(){return p}));var a=n(6),o=n(7),r=n(17),i=n(18),c=n(19),s=n(4),l=n(8),u=n(1),d=(n(22),n(2));const f=(e,t,n,a,o)=>{var r,i;return null==e||null===(r=e.get(null==t?void 0:t.name))||void 0===r?void 0:r.getCategoricalColor([{name:n,rankAtDepth:a.length?a.findIndex((e=>e===n)):0,totalSeriesAtDepth:a.length||1}],{maxDepth:1,totalSeries:a.length||1,behindText:!1,syncColors:o},null!==(i=null==t?void 0:t.params)&&void 0!==i?i:{colors:[]})},g={[u.b.SINGLE]:{endAngle:0,angleCount:360},[u.b.RIGHT_ANGLED]:{endAngle:90,angleCount:2},[u.b.MULTIPLE]:{endAngle:-90,angleCount:12}},p=({visData:e,visParams:t,palettesRegistry:n,fireEvent:p,renderComplete:h,syncColors:m})=>{const[b,v]=Object(a.useState)(!1),{bucket:j,metric:C,scale:x,palette:w,showLabel:y,orientation:_}=t,O=j?Object(l.a)().deserialize(Object(s.getFormatByAccessor)(j,e.columns)):null,T=Object(a.useMemo)((()=>{const t=j?Object(s.getColumnByAccessor)(j,e.columns):null,a=j?t.id:null,o=Object(s.getColumnByAccessor)(C,e.columns).id,r=e.rows.map((e=>e[o])),i=j&&null!==a?e.rows.map((e=>e[a])):[],c=Math.max(...r),l=Math.min(...r);return e.rows.map((t=>{const r=null===a?"all":t[a];return{text:O?O.convert(r,"text"):r,weight:"all"===r||e.rows.length<=1?1:(s=t[o],u=l,d=c,0,1,1*(s-u)/(d-u)+0||0),color:f(n,w,r,i,m)||"rgba(0,0,0,0)"};var s,u,d}))}),[j,O,C,w,n,m,e.columns,e.rows]),S=j?`${Object(s.getColumnByAccessor)(j,e.columns).name} - ${Object(s.getColumnByAccessor)(C,e.columns).name}`:"",A=Object(a.useCallback)((e=>{e&&h()}),[h]),M=Object(a.useMemo)((()=>Object(r.throttle)((()=>{v(!1)}),300)),[]),R=Object(a.useCallback)((t=>{if(!j)return;const n=Object(s.getColumnByAccessor)(j,e.columns).id,a=t[0][0].text,o=e.rows.findIndex((e=>(O?O.convert(e[n],"text"):e[n])===a));o<0||p({name:"filter",data:{data:[{table:e,column:Object(s.getAccessor)(j),row:o}]}})}),[j,O,p,e]);return Object(d.jsx)(i.EuiResizeObserver,{onResize:M},(e=>Object(d.jsx)("div",{className:"tgcChart__wrapper",ref:e,"data-test-subj":"tagCloudVisualization"},Object(d.jsx)(c.Chart,{size:"100%"},Object(d.jsx)(c.Settings,{onElementClick:R,onRenderChange:A,ariaLabel:t.ariaLabel,ariaUseDefaultSummary:!t.ariaLabel}),Object(d.jsx)(c.Wordcloud,{id:"tagCloud",startAngle:0,endAngle:g[_].endAngle,angleCount:g[_].angleCount,padding:5,fontWeight:400,fontFamily:"Inter UI, sans-serif",fontStyle:"normal",minFontSize:t.minFontSize,maxFontSize:t.maxFontSize,spiral:"archimedean",data:T,weightFn:x===u.c.SQUARE_ROOT?"squareRoot":x,outOfRoomCallback:()=>{v(!0)}})),S&&y&&Object(d.jsx)("div",{className:"tgcChart__label","data-test-subj":"tagCloudLabel"},S),b&&Object(d.jsx)("div",{className:"tgcChart__warning"},Object(d.jsx)(i.EuiIconTip,{type:"alert",color:"warning",content:Object(d.jsx)(o.FormattedMessage,{id:"expressionTagcloud.feedbackMessage.tooSmallContainerDescription",defaultMessage:"The container is too small to display the entire cloud. Tags might be cropped or omitted."})})),T.length>200&&Object(d.jsx)("div",{className:"tgcChart__warning"},Object(d.jsx)(i.EuiIconTip,{type:"alert",color:"warning",content:Object(d.jsx)(o.FormattedMessage,{id:"expressionTagcloud.feedbackMessage.truncatedTagsDescription",defaultMessage:"The number of tags has been truncated to avoid long draw times."})})))))}}}]);