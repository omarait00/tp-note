(window.dataViewFieldEditor_bundle_jsonpfunction=window.dataViewFieldEditor_bundle_jsonpfunction||[]).push([[11],{49:function(e,t,n){"use strict";var a,r=function(){var e={};return function(t){if(void 0===e[t]){var n=document.querySelector(t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}e[t]=n}return e[t]}}(),i=[];function o(e){for(var t=-1,n=0;n<i.length;n++)if(i[n].identifier===e){t=n;break}return t}function s(e,t){for(var n={},a=[],r=0;r<e.length;r++){var s=e[r],u=t.base?s[0]+t.base:s[0],l=n[u]||0,c="".concat(u," ").concat(l);n[u]=l+1;var d=o(c),m={css:s[1],media:s[2],sourceMap:s[3]};-1!==d?(i[d].references++,i[d].updater(m)):i.push({identifier:c,updater:h(m,t),references:1}),a.push(c)}return a}function u(e){var t=document.createElement("style"),a=e.attributes||{};if(void 0===a.nonce){var i=n.nc;i&&(a.nonce=i)}if(Object.keys(a).forEach((function(e){t.setAttribute(e,a[e])})),"function"==typeof e.insert)e.insert(t);else{var o=r(e.insert||"head");if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(t)}return t}var l,c=(l=[],function(e,t){return l[e]=t,l.filter(Boolean).join("\n")});function d(e,t,n,a){var r=n?"":a.media?"@media ".concat(a.media," {").concat(a.css,"}"):a.css;if(e.styleSheet)e.styleSheet.cssText=c(t,r);else{var i=document.createTextNode(r),o=e.childNodes;o[t]&&e.removeChild(o[t]),o.length?e.insertBefore(i,o[t]):e.appendChild(i)}}function m(e,t,n){var a=n.css,r=n.media,i=n.sourceMap;if(r?e.setAttribute("media",r):e.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(a+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=a;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(a))}}var f=null,p=0;function h(e,t){var n,a,r;if(t.singleton){var i=p++;n=f||(f=u(t)),a=d.bind(null,n,i,!1),r=d.bind(null,n,i,!0)}else n=u(t),a=m.bind(null,n,t),r=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)};return a(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;a(e=t)}else r()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===a&&(a=Boolean(window&&document&&document.all&&!window.atob)),a));var n=s(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var a=0;a<n.length;a++){var r=o(n[a]);i[r].references--}for(var u=s(e,t),l=0;l<n.length;l++){var c=o(n[l]);0===i[c].references&&(i[c].updater(),i.splice(c,1))}n=u}}}},50:function(e,t,n){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=function(e,t){var n,a,r,i=e[1]||"",o=e[3];if(!o)return i;if(t&&"function"==typeof btoa){var s=(n=o,a=btoa(unescape(encodeURIComponent(JSON.stringify(n)))),r="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(r," */")),u=o.sources.map((function(e){return"/*# sourceURL=".concat(o.sourceRoot||"").concat(e," */")}));return[i].concat(u).concat([s]).join("\n")}return[i].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(n,"}"):n})).join("")},t.i=function(e,n,a){"string"==typeof e&&(e=[[null,e,""]]);var r={};if(a)for(var i=0;i<this.length;i++){var o=this[i][0];null!=o&&(r[o]=!0)}for(var s=0;s<e.length;s++){var u=[].concat(e[s]);a&&r[u[0]]||(n&&(u[2]?u[2]="".concat(n," and ").concat(u[2]):u[2]=n),t.push(u))}},t}},51:function(e,t,n){switch(window.__kbnThemeTag__){case"v8dark":return n(52);case"v8light":return n(54)}},52:function(e,t,n){var a=n(49),r=n(53);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);a(r,{insert:"head",singleton:!1}),e.exports=r.locals||{}},53:function(e,t,n){(t=n(50)(!1)).push([e.i,".kbnFieldFormatEditor__samples audio{max-width:100%}",""]),e.exports=t},54:function(e,t,n){var a=n(49),r=n(55);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);a(r,{insert:"head",singleton:!1}),e.exports=r.locals||{}},55:function(e,t,n){(t=n(50)(!1)).push([e.i,".kbnFieldFormatEditor__samples audio{max-width:100%}",""]),e.exports=t},56:function(e,t,n){"use strict";n.d(t,"a",(function(){return samples_FormatEditorSamples}));var a=n(3),r=n.n(a),i=(n(51),n(1)),o=n(4),s=n(2),u=n(12),l=n(0);class samples_FormatEditorSamples extends i.PureComponent{render(){const{samples:e,sampleType:t}=this.props,n=[{field:"input",name:s.i18n.translate("indexPatternFieldEditor.samples.inputHeader",{defaultMessage:"Input"}),render:e=>"object"==typeof e?JSON.stringify(e):e},{field:"output",name:s.i18n.translate("indexPatternFieldEditor.samples.outputHeader",{defaultMessage:"Output"}),render:e=>"html"===t?Object(l.jsx)("div",{dangerouslySetInnerHTML:{__html:e}}):Object(l.jsx)("div",null,e)}];return e.length?Object(l.jsx)(o.EuiFormRow,{label:Object(l.jsx)(u.FormattedMessage,{id:"indexPatternFieldEditor.samplesHeader",defaultMessage:"Samples"})},Object(l.jsx)(o.EuiBasicTable,{className:"kbnFieldFormatEditor__samples",compressed:!0,items:e,columns:n})):null}}r()(samples_FormatEditorSamples,"defaultProps",{sampleType:"text"})},92:function(e,t,n){"use strict";n.r(t),n.d(t,"TruncateFormatEditor",(function(){return truncate_TruncateFormatEditor}));var a=n(3),r=n.n(a),i=n(1),o=n(4),s=n(12),u=n(7),l=n(56),c=n(33),d=n(0);class truncate_TruncateFormatEditor extends u.DefaultFormatEditor{constructor(...e){super(...e),r()(this,"state",{...u.defaultState,sampleInputs:["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae sem consequat, sollicitudin enim a, feugiat mi. Curabitur congue laoreet elit, eu dictum nisi commodo ut. Nullam congue sem a blandit commodo. Suspendisse eleifend sodales leo ac hendrerit. Nam fringilla tempor fermentum. Ut tristique pharetra sapien sit amet pharetra. Ut turpis massa, viverra id erat quis, fringilla vehicula risus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus tincidunt gravida gravida. Praesent et ligula viverra, semper lacus in, tristique elit. Cras ac eleifend diam. Nulla facilisi. Morbi id sagittis magna. Sed fringilla, magna in suscipit aliquet."]})}render(){var e;const{formatParams:t,onError:n}=this.props,{error:a,samples:r}=this.state;return Object(d.jsx)(i.Fragment,null,Object(d.jsx)(o.EuiFormRow,{label:Object(d.jsx)(s.FormattedMessage,{id:"indexPatternFieldEditor.truncate.lengthLabel",defaultMessage:"Field length"}),isInvalid:!!a,error:a},Object(d.jsx)(o.EuiFieldNumber,{defaultValue:null!==(e=t.fieldLength)&&void 0!==e?e:void 0,min:1,"data-test-subj":"truncateEditorLength",onChange:e=>{e.target.checkValidity()?this.onChange({fieldLength:e.target.value?Number(e.target.value):null}):n(e.target.validationMessage)},isInvalid:!!a})),Object(d.jsx)(l.a,{samples:r}))}}r()(truncate_TruncateFormatEditor,"formatId",c.a)}}]);