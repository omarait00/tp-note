/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.savedObjectsTagging_bundle_jsonpfunction=window.savedObjectsTagging_bundle_jsonpfunction||[]).push([[1],{29:function(e,t,a){"use strict";var n,s=function(){var e={};return function(t){if(void 0===e[t]){var a=document.querySelector(t);if(window.HTMLIFrameElement&&a instanceof window.HTMLIFrameElement)try{a=a.contentDocument.head}catch(e){a=null}e[t]=a}return e[t]}}(),i=[];function o(e){for(var t=-1,a=0;a<i.length;a++)if(i[a].identifier===e){t=a;break}return t}function c(e,t){for(var a={},n=[],s=0;s<e.length;s++){var c=e[s],l=t.base?c[0]+t.base:c[0],r=a[l]||0,g="".concat(l," ").concat(r);a[l]=r+1;var u=o(g),d={css:c[1],media:c[2],sourceMap:c[3]};-1!==u?(i[u].references++,i[u].updater(d)):i.push({identifier:g,updater:p(d,t),references:1}),n.push(g)}return n}function l(e){var t=document.createElement("style"),n=e.attributes||{};if(void 0===n.nonce){var i=a.nc;i&&(n.nonce=i)}if(Object.keys(n).forEach((function(e){t.setAttribute(e,n[e])})),"function"==typeof e.insert)e.insert(t);else{var o=s(e.insert||"head");if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(t)}return t}var r,g=(r=[],function(e,t){return r[e]=t,r.filter(Boolean).join("\n")});function u(e,t,a,n){var s=a?"":n.media?"@media ".concat(n.media," {").concat(n.css,"}"):n.css;if(e.styleSheet)e.styleSheet.cssText=g(t,s);else{var i=document.createTextNode(s),o=e.childNodes;o[t]&&e.removeChild(o[t]),o.length?e.insertBefore(i,o[t]):e.appendChild(i)}}function d(e,t,a){var n=a.css,s=a.media,i=a.sourceMap;if(s?e.setAttribute("media",s):e.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(n+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}var b=null,m=0;function p(e,t){var a,n,s;if(t.singleton){var i=m++;a=b||(b=l(t)),n=u.bind(null,a,i,!1),s=u.bind(null,a,i,!0)}else a=l(t),n=d.bind(null,a,t),s=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(a)};return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t)}else s()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===n&&(n=Boolean(window&&document&&document.all&&!window.atob)),n));var a=c(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var n=0;n<a.length;n++){var s=o(a[n]);i[s].references--}for(var l=c(e,t),r=0;r<a.length;r++){var g=o(a[r]);0===i[g].references&&(i[g].updater(),i.splice(g,1))}a=l}}}},30:function(e,t,a){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var a=function(e,t){var a,n,s,i=e[1]||"",o=e[3];if(!o)return i;if(t&&"function"==typeof btoa){var c=(a=o,n=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),s="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(n),"/*# ".concat(s," */")),l=o.sources.map((function(e){return"/*# sourceURL=".concat(o.sourceRoot||"").concat(e," */")}));return[i].concat(l).concat([c]).join("\n")}return[i].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(a,"}"):a})).join("")},t.i=function(e,a,n){"string"==typeof e&&(e=[[null,e,""]]);var s={};if(n)for(var i=0;i<this.length;i++){var o=this[i][0];null!=o&&(s[o]=!0)}for(var c=0;c<e.length;c++){var l=[].concat(e[c]);n&&s[l[0]]||(a&&(l[2]?l[2]="".concat(a," and ").concat(l[2]):l[2]=a),t.push(l))}},t}},32:function(e,t,a){switch(window.__kbnThemeTag__){case"v8dark":return a(33);case"v8light":return a(35)}},33:function(e,t,a){var n=a(29),s=a(34);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[e.i,s,""]]);n(s,{insert:"head",singleton:!1}),e.exports=s.locals||{}},34:function(e,t,a){(t=a(30)(!1)).push([e.i,".tagMgt__actionBar+.euiSpacer{display:none}.tagMgt__actionBarDivider{border-right:1px solid #343741;height:16px}.tagMgt__actionBar{border-bottom:1px solid #343741;padding-bottom:8px}.tagMgt__actionBarIcon{margin-left:4px}",""]),e.exports=t},35:function(e,t,a){var n=a(29),s=a(36);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[e.i,s,""]]);n(s,{insert:"head",singleton:!1}),e.exports=s.locals||{}},36:function(e,t,a){(t=a(30)(!1)).push([e.i,".tagMgt__actionBar+.euiSpacer{display:none}.tagMgt__actionBarDivider{border-right:1px solid #d3dae6;height:16px}.tagMgt__actionBar{border-bottom:1px solid #d3dae6;padding-bottom:8px}.tagMgt__actionBarIcon{margin-left:4px}",""]),e.exports=t},37:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(22).__importDefault(a(38));t.default=function(e){n.default((function(){e()}))}},38:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(1);t.default=function(e){n.useEffect(e,[])}},46:function(e,t,a){"use strict";a.r(t),a.d(t,"mountSection",(function(){return _}));var n=a(1),s=a.n(n),i=a(27),o=a.n(i),c=a(10),l=a(15),r=a(13),g=a(14),u=a(37),d=a.n(u),b=a(2),m=a(5),p=a(19),f=a(0);const j=({canCreate:e,onCreate:t})=>Object(f.jsx)(b.EuiPageHeader,{pageTitle:Object(f.jsx)(c.FormattedMessage,{id:"xpack.savedObjectsTagging.management.headerTitle",defaultMessage:"Tags"}),bottomBorder:!0,description:Object(f.jsx)(c.FormattedMessage,{id:"xpack.savedObjectsTagging.management.headerDescription",defaultMessage:"Use tags to categorize and easily find your objects."}),rightSideItems:[e&&Object(f.jsx)(b.EuiButton,{key:"createTag",iconType:"tag",color:"primary",fill:!0,"data-test-subj":"createTagButton",onClick:t,isDisabled:!1},Object(f.jsx)(c.FormattedMessage,{id:"xpack.savedObjectsTagging.management.actions.createTagButton",defaultMessage:"Create tag"}))]});var h=a(17);const v={initialPageSize:20,pageSizeOptions:[5,10,20,50]},x={sort:{field:"name",direction:"asc"}},T=({loading:e,capabilities:t,tags:a,initialQuery:s,allowSelection:i,onQueryChange:o,selectedTags:l,onSelectionChange:r,onShowRelations:g,getTagRelationUrl:u,actionBar:d,actions:p})=>{const j=Object(n.useRef)(null);Object(n.useEffect)((()=>{j.current&&j.current.setSelection(l)}),[l]);const T=[{field:"name",name:m.i18n.translate("xpack.savedObjectsTagging.management.table.columns.name",{defaultMessage:"Name"}),sortable:e=>e.name,"data-test-subj":"tagsTableRowName",render:(e,t)=>Object(f.jsx)(h.a,{tag:t})},{field:"description",name:m.i18n.translate("xpack.savedObjectsTagging.management.table.columns.description",{defaultMessage:"Description"}),sortable:!0,"data-test-subj":"tagsTableRowDescription"},{field:"relationCount",name:m.i18n.translate("xpack.savedObjectsTagging.management.table.columns.connections",{defaultMessage:"Connections"}),sortable:e=>e.relationCount,"data-test-subj":"tagsTableRowConnections",render:(e,a)=>{if(e<1)return;const n=Object(f.jsx)("span",{"data-test-subj":"tagsTableRowConnectionsText"},Object(f.jsx)(c.FormattedMessage,{id:"xpack.savedObjectsTagging.management.table.content.connectionCount",defaultMessage:"{relationCount, plural, one {1 saved object} other {# saved objects}}",values:{relationCount:e}}));return t.viewConnections?Object(f.jsx)(b.EuiLink,{"data-test-subj":"tagsTableRowConnectionsLink",href:u(a),onClick:e=>{var t;(t=e).metaKey||t.altKey||t.ctrlKey||t.shiftKey||t.defaultPrevented||0!==e.button||(e.preventDefault(),g(a))}},n):n}},...p.length?[{name:m.i18n.translate("xpack.savedObjectsTagging.management.table.columns.actions",{defaultMessage:"Actions"}),width:"100px",actions:p}]:[]];return Object(f.jsx)(b.EuiInMemoryTable,{"data-test-subj":"tagsManagementTable",ref:j,childrenBetween:d,loading:e,itemId:"id",columns:T,items:a,pagination:v,sorting:x,tableCaption:m.i18n.translate("xpack.savedObjectsTagging.management.table.columns.caption",{defaultMessage:"Tags"}),rowHeader:"name",selection:i?{initialSelected:l,onSelectionChange:r}:void 0,search:{defaultQuery:s,onChange:({query:e})=>{o(e||void 0)},box:{"data-test-subj":"tagsManagementSearchBar",incremental:!0,schema:{fields:{name:{type:"string"},description:{type:"string"}}}}},rowProps:e=>({"data-test-subj":"tagsTableRow"})})};a(32);const O=({actions:e,onActionSelected:t,selectedCount:a,totalCount:i})=>{const[o,l]=Object(n.useState)(!1),r=Object(n.useCallback)((()=>{l(!1)}),[l]),g=Object(n.useCallback)((()=>{l((e=>!e))}),[l]),u=Object(n.useMemo)((()=>[{id:0,items:e.map((e=>((e,t,a)=>({name:e.label,icon:e.icon,onClick:()=>{a(),t(e)},"data-test-subj":`actionBar-button-${e.id}`}))(e,t,r)))}]),[e,t,r]);return Object(f.jsx)("div",{className:"tagMgt__actionBar"},Object(f.jsx)(b.EuiFlexGroup,{justifyContent:"flexStart",alignItems:"center",gutterSize:"m"},Object(f.jsx)(b.EuiFlexItem,{grow:!1},Object(f.jsx)(b.EuiText,{size:"xs",color:"subdued"},Object(f.jsx)(c.FormattedMessage,{id:"xpack.savedObjectsTagging.management.actionBar.totalTagsLabel",defaultMessage:"{count, plural, one {1 tag} other {# tags}}",values:{count:i}}))),a>0&&Object(f.jsx)(s.a.Fragment,null,Object(f.jsx)(b.EuiFlexItem,{grow:!1},Object(f.jsx)("div",{className:"tagMgt__actionBarDivider"})),Object(f.jsx)(b.EuiFlexItem,{grow:!1},Object(f.jsx)(b.EuiPopover,{isOpen:o,closePopover:r,panelPaddingSize:"none",button:Object(f.jsx)(b.EuiText,{size:"xs"},Object(f.jsx)(b.EuiLink,{onClick:g,"data-test-subj":"actionBar-contextMenuButton"},Object(f.jsx)(c.FormattedMessage,{id:"xpack.savedObjectsTagging.management.actionBar.selectedTagsLabel",defaultMessage:"{count, plural, one {1 selected tag} other {# selected tags}}",values:{count:a}}),Object(f.jsx)(b.EuiIcon,{className:"tagMgt__actionBarIcon",type:"arrowDown",size:"s"})))},Object(f.jsx)(b.EuiContextMenu,{initialPanelId:0,panels:u,"data-test-subj":"actionBar-contextMenu"}))))))};var y=a(18);const C=()=>Object(f.jsx)(b.EuiDelayRender,null,Object(f.jsx)(b.EuiLoadingSpinner,null)),M=s.a.lazy((()=>a.e(2).then(a.bind(null,47)).then((({AssignFlyout:e})=>({default:e}))))),k=({overlays:e,notifications:t,theme:a,tagCache:n,assignmentService:i,assignableTypes:o})=>async({tagIds:c})=>{const r=e.openFlyout(Object(l.toMountPoint)(Object(f.jsx)(s.a.Suspense,{fallback:Object(f.jsx)(C,null)},Object(f.jsx)(M,{tagIds:c,tagCache:n,notifications:t,allowedTypes:o,assignmentService:i,onClose:()=>r.close()})),{theme$:a.theme$}),{size:"m",maxWidth:600});return r},S=({setBreadcrumbs:e,core:t,tagClient:a,tagCache:i,assignmentService:o,capabilities:c,assignableTypes:l})=>{const{overlays:r,notifications:u,application:h,http:v,theme:x}=t,[C,M]=Object(n.useState)(!1),[S,w]=Object(n.useState)([]),[_,B]=Object(n.useState)([]),[E,D]=Object(n.useState)(),I=Object(n.useMemo)((()=>E?b.Query.execute(E,S):S),[S,E]),A=Object(n.useMemo)((()=>new g.Subject),[]);Object(n.useEffect)((()=>()=>{A.next()}),[A]);const R=Object(n.useCallback)((async()=>{M(!0);const{tags:e}=await a.find({page:1,perPage:1e4});w(e),M(!1)}),[a]);d()((()=>{R()}));const L=Object(n.useMemo)((()=>Object(p.a)({overlays:r,theme:x,tagClient:a})),[r,x,a]),P=Object(n.useMemo)((()=>(({core:{notifications:e,overlays:t,theme:a},capabilities:n,tagClient:s,tagCache:i,assignmentService:o,assignableTypes:c,fetchTags:l,canceled$:r})=>{const u=[];return n.edit&&u.push((({notifications:e,theme:t,overlays:a,tagClient:n,fetchTags:s})=>{const i=Object(p.b)({overlays:a,theme:t,tagClient:n});return{id:"edit",name:({name:e})=>m.i18n.translate("xpack.savedObjectsTagging.management.table.actions.edit.title",{defaultMessage:"Edit {name} tag",values:{name:e}}),isPrimary:!0,description:m.i18n.translate("xpack.savedObjectsTagging.management.table.actions.edit.description",{defaultMessage:"Edit this tag"}),type:"icon",icon:"pencil",onClick:t=>{i({tagId:t.id,onUpdate:t=>{s(),e.toasts.addSuccess({title:m.i18n.translate("xpack.savedObjectsTagging.notifications.editTagSuccessTitle",{defaultMessage:'Saved changes to "{name}" tag',values:{name:t.name}})})}})},"data-test-subj":"tagsTableAction-edit"}})({notifications:e,overlays:t,theme:a,tagClient:s,fetchTags:l})),n.assign&&c.length>0&&u.push((({notifications:e,overlays:t,theme:a,assignableTypes:n,assignmentService:s,tagCache:i,fetchTags:o,canceled$:c})=>{const l=k({overlays:t,notifications:e,theme:a,tagCache:i,assignmentService:s,assignableTypes:n});return{id:"assign",name:({name:e})=>m.i18n.translate("xpack.savedObjectsTagging.management.table.actions.assign.title",{defaultMessage:"Manage {name} assignments",values:{name:e}}),description:m.i18n.translate("xpack.savedObjectsTagging.management.table.actions.assign.description",{defaultMessage:"Manage assignments"}),type:"icon",icon:"tag",onClick:async e=>{const t=await l({tagIds:[e.id]});c.pipe(Object(y.takeUntil)(Object(g.from)(t.onClose))).subscribe((()=>{t.close()})),await t.onClose,await o()},"data-test-subj":"tagsTableAction-assign"}})({tagCache:i,assignmentService:o,assignableTypes:c,fetchTags:l,notifications:e,overlays:t,theme:a,canceled$:r})),n.delete&&u.push((({notifications:e,overlays:t,tagClient:a,fetchTags:n})=>({id:"delete",name:({name:e})=>m.i18n.translate("xpack.savedObjectsTagging.management.table.actions.delete.title",{defaultMessage:"Delete {name} tag",values:{name:e}}),description:m.i18n.translate("xpack.savedObjectsTagging.management.table.actions.delete.description",{defaultMessage:"Delete this tag"}),type:"icon",icon:"trash",onClick:async s=>{await t.openConfirm(m.i18n.translate("xpack.savedObjectsTagging.modals.confirmDelete.text",{defaultMessage:"By deleting this tag, you will no longer be able to assign it to saved objects. This tag will be removed from any saved objects that currently use it."}),{title:m.i18n.translate("xpack.savedObjectsTagging.modals.confirmDelete.title",{defaultMessage:'Delete "{name}" tag',values:{name:s.name}}),confirmButtonText:m.i18n.translate("xpack.savedObjectsTagging.modals.confirmDelete.confirmButtonText",{defaultMessage:"Delete tag"}),buttonColor:"danger",maxWidth:560})&&(await a.delete(s.id),e.toasts.addSuccess({title:m.i18n.translate("xpack.savedObjectsTagging.notifications.deleteTagSuccessTitle",{defaultMessage:'Deleted "{name}" tag',values:{name:s.name}})}),await n())},"data-test-subj":"tagsTableAction-delete"}))({overlays:t,notifications:e,tagClient:s,fetchTags:l})),u})({core:t,capabilities:c,tagClient:a,tagCache:i,assignmentService:o,setLoading:M,assignableTypes:l,fetchTags:R,canceled$:A})),[t,c,a,i,o,M,l,R,A]),F=Object(n.useMemo)((()=>(({core:{notifications:e,overlays:t,theme:a},capabilities:n,tagClient:s,tagCache:i,assignmentService:o,clearSelection:c,setLoading:l,assignableTypes:r})=>{const u=[];return n.assign&&r.length>0&&u.push((({overlays:e,notifications:t,theme:a,tagCache:n,assignmentService:s,assignableTypes:i})=>{const o=k({overlays:e,notifications:t,theme:a,tagCache:n,assignmentService:s,assignableTypes:i});return{id:"assign",label:m.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkAssign.label",{defaultMessage:"Manage tag assignments"}),icon:"tag",refreshAfterExecute:!0,execute:async(e,{canceled$:t})=>{const a=await o({tagIds:e});return t.pipe(Object(y.takeUntil)(Object(g.from)(a.onClose))).subscribe((()=>{a.close()})),a.onClose}}})({notifications:e,overlays:t,theme:a,tagCache:i,assignmentService:o,assignableTypes:r,setLoading:l})),n.delete&&u.push((({overlays:e,notifications:t,tagClient:a,setLoading:n})=>({id:"delete",label:m.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkDelete.label",{defaultMessage:"Delete"}),"aria-label":m.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkDelete.ariaLabel",{defaultMessage:"Delete selected tags"}),icon:"trash",refreshAfterExecute:!0,execute:async s=>{await e.openConfirm(m.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkDelete.confirm.text",{defaultMessage:"By deleting {count, plural, one {this tag} other {these tags}}, you will no longer be able to assign {count, plural, one {it} other {them}} to saved objects. {count, plural, one {This tag} other {These tags}} will be removed from any saved objects that currently use {count, plural, one {it} other {them}}.",values:{count:s.length}}),{title:m.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkDelete.confirm.title",{defaultMessage:"Delete {count, plural, one {1 tag} other {# tags}}",values:{count:s.length}}),confirmButtonText:m.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkDelete.confirm.confirmButtonText",{defaultMessage:"Delete {count, plural, one {tag} other {tags}}",values:{count:s.length}}),buttonColor:"danger",maxWidth:560})&&(n(!0),await a.bulkDelete(s),n(!1),t.toasts.addSuccess({title:m.i18n.translate("xpack.savedObjectsTagging.management.actions.bulkDelete.notification.successTitle",{defaultMessage:"Deleted {count, plural, one {1 tag} other {# tags}}",values:{count:s.length}})}))}}))({notifications:e,overlays:t,tagClient:s,setLoading:l})),u.length>0&&u.push((({clearSelection:e})=>({id:"clear_selection",label:m.i18n.translate("xpack.savedObjectsTagging.management.actions.clearSelection.label",{defaultMessage:"Clear selection"}),icon:"cross",refreshAfterExecute:!0,execute:async()=>{e()}}))({clearSelection:c})),u})({core:t,capabilities:c,tagClient:a,tagCache:i,assignmentService:o,setLoading:M,assignableTypes:l,clearSelection:()=>B([])})),[t,c,a,i,o,l]);Object(n.useEffect)((()=>{e([{text:m.i18n.translate("xpack.savedObjectsTagging.management.breadcrumb.index",{defaultMessage:"Tags"})}])}),[e]);const N=Object(n.useCallback)((()=>{L({onCreate:e=>{R(),u.toasts.addSuccess({title:m.i18n.translate("xpack.savedObjectsTagging.notifications.createTagSuccessTitle",{defaultMessage:'Created "{name}" tag',values:{name:e.name}})})}})}),[u,L,R]),U=Object(n.useCallback)((e=>((e,t)=>{const a=encodeURIComponent(`tag:("${e.name}")`);return t.prepend(`/app/management/kibana/objects?initialQuery=${a}`)})(e,v.basePath)),[v]),$=Object(n.useCallback)((e=>{h.navigateToUrl(U(e))}),[h,U]),z=Object(n.useCallback)((async e=>{try{await e.execute(_.map((({id:e})=>e)),{canceled$:A})}catch(e){u.toasts.addError(e,{title:m.i18n.translate("xpack.savedObjectsTagging.notifications.bulkActionError",{defaultMessage:"An error occurred"})})}finally{M(!1)}e.refreshAfterExecute&&await R()}),[_,R,u,A]),Q=Object(n.useMemo)((()=>Object(f.jsx)(O,{actions:F,totalCount:I.length,selectedCount:_.length,onActionSelected:z})),[_,I,F,z]);return Object(f.jsx)(s.a.Fragment,null,Object(f.jsx)(j,{canCreate:c.create,onCreate:N}),Object(f.jsx)(b.EuiSpacer,{size:"l"}),Object(f.jsx)(T,{loading:C,tags:I,capabilities:c,actionBar:Q,actions:P,initialQuery:E,onQueryChange:e=>{D(e),B([])},allowSelection:F.length>0,selectedTags:_,onSelectionChange:e=>{B(e)},getTagRelationUrl:U,onShowRelations:e=>{$(e)}}))},w=({applications:e,children:t})=>{var a,n,s,i;return null!==(a=null===(n=e.capabilities)||void 0===n||null===(s=n.management)||void 0===s||null===(i=s.kibana)||void 0===i?void 0:i.tags)&&void 0!==a&&a?t:(e.navigateToApp("home"),null)},_=async({tagClient:e,tagCache:t,assignmentService:a,core:n,mountParams:s,title:i})=>{const[g]=await n.getStartServices(),{element:u,setBreadcrumbs:d,theme$:b}=s,m=Object(r.a)(g.application.capabilities),p=await a.getAssignableTypes();return g.chrome.docTitle.change(i),o.a.render(Object(f.jsx)(c.I18nProvider,null,Object(f.jsx)(l.KibanaThemeProvider,{theme$:b},Object(f.jsx)(w,{applications:g.application},Object(f.jsx)(S,{setBreadcrumbs:d,core:g,tagClient:e,tagCache:t,assignmentService:a,capabilities:m,assignableTypes:p})))),u),()=>{g.chrome.docTitle.reset(),o.a.unmountComponentAtNode(u)}}}}]);