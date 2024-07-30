(window.visTypeVega_bundle_jsonpfunction=window.visTypeVega_bundle_jsonpfunction||[]).push([[5],{224:function(e,t,n){switch(window.__kbnThemeTag__){case"v8dark":return n(225);case"v8light":return n(227)}},225:function(e,t,n){var i=n(44),a=n(226);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);i(a,{insert:"head",singleton:!1}),e.exports=a.locals||{}},226:function(e,t,n){(t=n(45)(!1)).push([e.i,".visEditor--vega .visEditorSidebar__config{display:flex;flex-direction:row;min-height:240px;overflow:hidden;padding:0}@media only screen and (max-width:574px){.visEditor--vega .visEditorSidebar__config{max-height:240px}}@media only screen and (min-width:575px) and (max-width:767px){.visEditor--vega .visEditorSidebar__config{max-height:240px}}@media only screen and (min-width:768px) and (max-width:991px){.visEditor--vega .visEditorSidebar__config{max-height:240px}}.vgaEditor{flex-grow:1;width:100%}.vgaEditor .kibanaCodeEditor{width:100%}.vgaEditor__editorActions{line-height:1;position:absolute;right:40px;top:8px;z-index:1000}",""]),e.exports=t},227:function(e,t,n){var i=n(44),a=n(228);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);i(a,{insert:"head",singleton:!1}),e.exports=a.locals||{}},228:function(e,t,n){(t=n(45)(!1)).push([e.i,".visEditor--vega .visEditorSidebar__config{display:flex;flex-direction:row;min-height:240px;overflow:hidden;padding:0}@media only screen and (max-width:574px){.visEditor--vega .visEditorSidebar__config{max-height:240px}}@media only screen and (min-width:575px) and (max-width:767px){.visEditor--vega .visEditorSidebar__config{max-height:240px}}@media only screen and (min-width:768px) and (max-width:991px){.visEditor--vega .visEditorSidebar__config{max-height:240px}}.vgaEditor{flex-grow:1;width:100%}.vgaEditor .kibanaCodeEditor{width:100%}.vgaEditor__editorActions{line-height:1;position:absolute;right:40px;top:8px;z-index:1000}",""]),e.exports=t},229:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(37).__importDefault(n(230));t.default=function(e){i.default((function(){e()}))}},230:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n(2);t.default=function(e){i.useEffect(e,[])}},307:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return j}));var i=n(34),a=n(229),o=n.n(a),r=n(11),s=n.n(r),c=n(2),u=n(62),d=n.n(u),l=n(3),f=n(13),p=n(1),g=n(6),v=n(14),h=n(0);function b(){const[e,t]=Object(c.useState)(!1),n=Object(c.useCallback)((()=>t(!e)),[e]),i=Object(c.useCallback)((()=>t(!1)),[]),a=Object(h.jsx)(g.EuiButtonIcon,{iconType:"questionInCircle",onClick:n,"aria-label":l.i18n.translate("visTypeVega.editor.vegaHelpButtonAriaLabel",{defaultMessage:"Vega help"})}),o=[Object(h.jsx)(g.EuiContextMenuItem,{key:"vegaHelp",href:Object(p.c)().links.visualize.vega,target:"_blank",onClick:i},Object(h.jsx)(v.FormattedMessage,{id:"visTypeVega.editor.vegaHelpLinkText",defaultMessage:"Kibana Vega help"})),Object(h.jsx)(g.EuiContextMenuItem,{key:"vegaLiteDocs",href:"https://vega.github.io/vega-lite/docs/",target:"_blank",onClick:i},Object(h.jsx)(v.FormattedMessage,{id:"visTypeVega.editor.vegaLiteDocumentationLinkText",defaultMessage:"Vega-Lite documentation"})),Object(h.jsx)(g.EuiContextMenuItem,{key:"vegaDoc",href:"https://vega.github.io/vega/docs/",target:"_blank",onClick:i},Object(h.jsx)(v.FormattedMessage,{id:"visTypeVega.editor.vegaDocumentationLinkText",defaultMessage:"Vega documentation"}))];return Object(h.jsx)(g.EuiPopover,{id:"helpMenu",button:a,isOpen:e,closePopover:i,panelPaddingSize:"none",anchorPosition:"downLeft"},Object(h.jsx)(g.EuiContextMenuPanel,{items:o}))}function m({formatHJson:e,formatJson:t}){const[n,i]=Object(c.useState)(!1),a=Object(c.useCallback)((()=>i((e=>!e))),[]),o=Object(c.useCallback)((()=>{e(),i(!1)}),[e]),r=Object(c.useCallback)((()=>{t(),i(!1)}),[t]),s=Object(c.useCallback)((()=>i(!1)),[]),u=Object(h.jsx)(g.EuiButtonIcon,{iconType:"wrench",onClick:a,"aria-label":l.i18n.translate("visTypeVega.editor.vegaEditorOptionsButtonAriaLabel",{defaultMessage:"Vega editor options"})}),d=[Object(h.jsx)(g.EuiContextMenuItem,{key:"hjson",onClick:o},Object(h.jsx)(v.FormattedMessage,{id:"visTypeVega.editor.reformatAsHJSONButtonLabel",defaultMessage:"Reformat as HJSON"})),Object(h.jsx)(g.EuiContextMenuItem,{key:"json",onClick:r},Object(h.jsx)(v.FormattedMessage,{id:"visTypeVega.editor.reformatAsJSONButtonLabel",defaultMessage:"Reformat as JSON, delete comments"}))];return Object(h.jsx)(g.EuiPopover,{id:"actionsMenu",button:u,isOpen:n,closePopover:s,panelPaddingSize:"none",anchorPosition:"downLeft"},Object(h.jsx)(g.EuiContextMenuPanel,{items:d}))}function x(e,t,n){try{return{value:t(s.a.parse(e,{legacyRoot:!1,keepWsc:!0}),n),isValid:!0}}catch(t){return Object(p.f)().toasts.addError(t,{title:l.i18n.translate("visTypeVega.editor.formatError",{defaultMessage:"Error formatting spec"})}),{value:e,isValid:!1}}}function j({stateParams:e,setValue:t}){const[n,a]=Object(c.useState)();o()((()=>{let t=i.XJsonLang.ID;try{JSON.parse(e.spec)}catch{t=f.HJsonLang}a(t)}));const r=Object(c.useCallback)(((e,n)=>{t("spec",e),n&&a(n)}),[t]),u=Object(c.useCallback)((e=>r(e)),[r]),l=Object(c.useCallback)((()=>{const{value:t,isValid:n}=x(e.spec,d.a);n&&r(t,i.XJsonLang.ID)}),[r,e.spec]),p=Object(c.useCallback)((()=>{const{value:t,isValid:n}=x(e.spec,s.a.stringify,{bracesSameLine:!0,keepWsc:!0});n&&r(t,f.HJsonLang)}),[r,e.spec]);return n?Object(h.jsx)("div",{className:"vgaEditor","data-test-subj":"vega-editor"},Object(h.jsx)("div",{className:"vgaEditor__editorActions"},Object(h.jsx)(b,null),Object(h.jsx)(m,{formatHJson:p,formatJson:l})),Object(h.jsx)(f.CodeEditor,{width:"100%",height:"100%",languageId:n,value:e.spec,onChange:u,options:{lineNumbers:"on",fontSize:12,minimap:{enabled:!1},folding:!0,wordWrap:"on",wrappingIndent:"indent",automaticLayout:!0}})):null}n(224)},44:function(e,t,n){"use strict";var i,a=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),o=[];function r(e){for(var t=-1,n=0;n<o.length;n++)if(o[n].identifier===e){t=n;break}return t}function s(e,t){for(var n={},i=[],a=0;a<e.length;a++){var s=e[a],c=t.base?s[0]+t.base:s[0],u=n[c]||0,d="".concat(c," ").concat(u);n[c]=u+1;var l=r(d),f={css:s[1],media:s[2],sourceMap:s[3]};-1!==l?(o[l].references++,o[l].updater(f)):o.push({identifier:d,updater:v(f,t),references:1}),i.push(d)}return i}function c(e){var t=document.createElement("style"),i=e.attributes||{};if(void 0===i.nonce){var o=n.nc;o&&(i.nonce=o)}if(Object.keys(i).forEach((function(e){t.setAttribute(e,i[e])})),"function"==typeof e.insert)e.insert(t);else{var r=a(e.insert||"head");if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");r.appendChild(t)}return t}var u,d=(u=[],function(e,t){return u[e]=t,u.filter(Boolean).join("\n")});function l(e,t,n,i){var a=n?"":i.media?"@media ".concat(i.media," {").concat(i.css,"}"):i.css;if(e.styleSheet)e.styleSheet.cssText=d(t,a);else{var o=document.createTextNode(a),r=e.childNodes;r[t]&&e.removeChild(r[t]),r.length?e.insertBefore(o,r[t]):e.appendChild(o)}}function f(e,t,n){var i=n.css,a=n.media,o=n.sourceMap;if(a?e.setAttribute("media",a):e.removeAttribute("media"),o&&"undefined"!=typeof btoa&&(i+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),e.styleSheet)e.styleSheet.cssText=i;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(i))}}var p=null,g=0;function v(e,t){var n,i,a;if(t.singleton){var o=g++;n=p||(p=c(t)),i=l.bind(null,n,o,!1),a=l.bind(null,n,o,!0)}else n=c(t),i=f.bind(null,n,t),a=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return i(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;i(e=t)}else a()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===i&&(i=Boolean(window&&document&&document.all&&!window.atob)),i));var n=s(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var i=0;i<n.length;i++){var a=r(n[i]);o[a].references--}for(var c=s(e,t),u=0;u<n.length;u++){var d=r(n[u]);0===o[d].references&&(o[d].updater(),o.splice(d,1))}n=c}}}},45:function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n,i,a,o=e[1]||"",r=e[3];if(!r)return o;if(t&&"function"==typeof btoa){var s=(n=r,i=btoa(unescape(encodeURIComponent(JSON.stringify(n)))),a="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(i),"/*# ".concat(a," */")),c=r.sources.map((function(e){return"/*# sourceURL=".concat(r.sourceRoot||"").concat(e," */")}));return[o].concat(c).concat([s]).join("\n")}return[o].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,i){"string"==typeof e&&(e=[[null,e,""]]);var a={};if(i)for(var o=0;o<this.length;o++){var r=this[o][0];null!=r&&(a[r]=!0)}for(var s=0;s<e.length;s++){var c=[].concat(e[s]);i&&a[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),t.push(c))}},t}},62:function(e,t){var n=/("(?:[^\\"]|\\.)*")|[:,\][}{]/g;function i(e,t,n){return t in e?e[t]:n}e.exports=function(e,t){t=t||{};var a=JSON.stringify([1],null,i(t,"indent",2)).slice(2,-3),o=i(t,"margins",!1),r=""===a?1/0:i(t,"maxLength",80);return function e(t,i,s){t&&"function"==typeof t.toJSON&&(t=t.toJSON());var c=JSON.stringify(t);if(void 0===c)return c;var u=r-i.length-s;if(c.length<=u){var d=function(e,t){var i=t?" ":"",a={"{":"{"+i,"[":"["+i,"}":i+"}","]":i+"]",",":", ",":":": "};return e.replace(n,(function(e,t){return t?e:a[e]}))}(c,o);if(d.length<=u)return d}if("object"==typeof t&&null!==t){var l,f=i+a,p=[],g=function(e,t){return t===e.length-1?0:1};if(Array.isArray(t)){for(var v=0;v<t.length;v++)p.push(e(t[v],f,g(t,v))||"null");l="[]"}else Object.keys(t).forEach((function(n,i,a){var o=JSON.stringify(n)+": ",r=e(t[n],f,o.length+g(a,i));void 0!==r&&p.push(o+r)})),l="{}";if(p.length>0)return[l[0],a+p.join(",\n"+f),l[1]].join("\n"+i)}return c}(e,"",0)}}}]);