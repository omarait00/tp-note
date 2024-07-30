!function(e){function t(t){for(var n,a,o=t[0],r=t[1],i=0,l=[];i<o.length;i++)a=o[i],Object.prototype.hasOwnProperty.call(s,a)&&s[a]&&l.push(s[a][0]),s[a]=0;for(n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);for(c&&c(t);l.length;)l.shift()()}var n={},s={0:0};function a(t){if(n[t])return n[t].exports;var s=n[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,a),s.l=!0,s.exports}a.e=function(e){var t=[],n=s[e];if(0!==n)if(n)t.push(n[2]);else{var o=new Promise((function(t,a){n=s[e]=[t,a]}));t.push(n[2]=o);var r,i=document.createElement("script");i.charset="utf-8",i.timeout=120,a.nc&&i.setAttribute("nonce",a.nc),i.src=function(e){return a.p+"savedObjectsManagement.chunk."+e+".js"}(e);var c=new Error;r=function(t){i.onerror=i.onload=null,clearTimeout(l);var n=s[e];if(0!==n){if(n){var a=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;c.message="Loading chunk "+e+" failed.\n("+a+": "+o+")",c.name="ChunkLoadError",c.type=a,c.request=o,n[1](c)}s[e]=void 0}};var l=setTimeout((function(){r({type:"timeout",target:i})}),12e4);i.onerror=i.onload=r,document.head.appendChild(i)}return Promise.all(t)},a.m=e,a.c=n,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)a.d(n,s,function(t){return e[t]}.bind(null,s));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a.oe=function(e){throw console.error(e),e};var o=window.savedObjectsManagement_bundle_jsonpfunction=window.savedObjectsManagement_bundle_jsonpfunction||[],r=o.push.bind(o);o.push=t,o=o.slice();for(var i=0;i<o.length;i++)t(o[i]);var c=r;a(a.s=10)}([function(e,t,n){e.exports=n(8)(2)},function(e,t){e.exports=__kbnSharedDeps__.KbnI18n},function(e,t){e.exports=__kbnSharedDeps__.EmotionReact},function(e,t){e.exports=__kbnSharedDeps__.React},function(e,t,n){"use strict";async function s({http:e,search:t,types:n,references:s,includeReferencesDeep:a=!1}){return e.post("/api/saved_objects/_export",{body:JSON.stringify({type:n,search:t,hasReference:s,includeReferencesDeep:a})})}async function a(e,t,n=!1){return e.post("/api/saved_objects/_export",{body:JSON.stringify({objects:t,includeReferencesDeep:n})})}n.r(t),n.d(t,"fetchExportByTypeAndSearch",(function(){return s})),n.d(t,"fetchExportObjects",(function(){return a})),n.d(t,"getRelationships",(function(){return r})),n.d(t,"getSavedObjectCounts",(function(){return i})),n.d(t,"getSavedObjectLabel",(function(){return c})),n.d(t,"importFile",(function(){return l})),n.d(t,"parseQuery",(function(){return p})),n.d(t,"resolveImportErrors",(function(){return g})),n.d(t,"processImportResponse",(function(){return v})),n.d(t,"getDefaultTitle",(function(){return j})),n.d(t,"findObjects",(function(){return y})),n.d(t,"bulkGetObjects",(function(){return _.a})),n.d(t,"extractExportDetails",(function(){return O})),n.d(t,"getAllowedTypes",(function(){return S})),n.d(t,"getTagFindReferences",(function(){return C}));var o=n(5);async function r(e,t,n,s){const a=`/api/kibana/management/saved_objects/relationships/${encodeURIComponent(t)}/${encodeURIComponent(n)}`;try{return await e.get(a,{query:{savedObjectTypes:s}})}catch(e){const t=Object(o.get)(e,"data",{}),n=new Error(t.message||t.error||`${e.status} Response`);throw n.statusCode=t.statusCode||e.status,n.body=t,n}}async function i({http:e,searchString:t,typesToInclude:n,references:s}){return await e.post("/api/kibana/management/saved_objects/scroll/counts",{body:JSON.stringify({typesToInclude:n,searchString:t,references:s})})}function c(e,t){var n;const s=t.find((t=>t.name===e));return null!==(n=null==s?void 0:s.displayName)&&void 0!==n?n:e}async function l(e,t,{createNewCopies:n,overwrite:s}){const a=new FormData;a.append("file",t);const o=n?{createNewCopies:n}:{overwrite:s};return await e.post("/api/saved_objects/_import",{body:a,headers:{"Content-Type":void 0},query:o})}function p(e,t){let n,s,a;if(e){if(e.ast.getTermClauses().length&&(n=e.ast.getTermClauses().map((e=>e.value)).join(" ")),e.ast.getFieldClauses("type")){const n=e.ast.getFieldClauses("type")[0].value,a=t.reduce(((e,t)=>(e.set(t.displayName,t.name),e)),new Map);s=n.map((e=>{var t;return null!==(t=a.get(e))&&void 0!==t?t:e}))}e.ast.getFieldClauses("tag")&&(a=e.ast.getFieldClauses("tag")[0].value)}return{queryText:n,visibleTypes:s,selectedTags:a}}const u=["conflict","ambiguous_conflict","missing_references"],d=e=>"conflict"===e.error.type,f=e=>"ambiguous_conflict"===e.error.type,b=e=>d(e)||f(e),h=e=>{const t=e.filter((({error:{type:e}})=>"missing_references"===e)).reduce(((e,{obj:{type:t,id:n}})=>e.add(`${t}:${n}`)),new Set);return e.filter((e=>!b(e)||b(e)&&!t.has(`${e.obj.type}:${e.obj.id}`)))};async function m(e,t,n,s){const a=new FormData;a.append("file",t),a.append("retries",JSON.stringify(n));const o=s?{createNewCopies:s}:{};return e.post("/api/saved_objects/_resolve_import_errors",{headers:{"Content-Type":void 0},body:a,query:o})}async function g({http:e,getConflictResolutions:t,state:n}){const s=new Map,a=new Map;let{importCount:o,failedImports:r=[],successfulImports:i=[]}=n;const{file:c,importMode:{createNewCopies:l,overwrite:p}}=n,g=({obj:e})=>!s.has(`${e.type}:${e.id}`),v=e=>function({failure:e,retryDecisionCache:t,replaceReferencesCache:n,state:s}){const{unmatchedReferences:a=[]}=s,o=t.get(`${e.obj.type}:${e.obj.id}`);if(null!=o&&o.retry||"conflict"!==e.error.type&&"ambiguous_conflict"!==e.error.type){if("missing_references"===e.error.type){const t=n.get(`${e.obj.type}:${e.obj.id}`)||[],s=e.error.references.filter((e=>"index-pattern"===e.type));for(const e of s)for(const{existingIndexPatternId:n,newIndexPatternId:s}of a){const a=n===e.id;if(!s||!a)continue;const o="index-pattern";t.some((e=>e.type===o&&e.from===n&&e.to===s))||t.push({type:o,from:n,to:s})}if(n.set(`${e.obj.type}:${e.obj.id}`,t),0===t.length)return}return{id:e.obj.id,type:e.obj.type,...(null==o?void 0:o.retry)&&o.options,replaceReferences:n.get(`${e.obj.type}:${e.obj.id}`)}}}({failure:e,retryDecisionCache:s,replaceReferencesCache:a,state:n}),j=e=>{var t;const{type:n}=e.error;return!u.includes(n)||(null===(t=(({obj:e})=>s.get(`${e.type}:${e.id}`))(e))||void 0===t?void 0:t.retry)};for(;r.some((e=>u.includes(e.error.type)));){const n=h(r);p&&n.filter(d).forEach((({obj:{type:e,id:t},error:{destinationId:n}})=>s.set(`${e}:${t}`,{retry:!0,options:{overwrite:!0,...n&&{destinationId:n}}})));const u=await t(p?n.filter(f).filter(g):n.filter(b).filter(g));for(const e of Object.keys(u))s.set(e,u[e]);const y=[...n.map(v).filter((e=>!!e)),...i.map((({type:e,id:t,overwrite:n,destinationId:s,createNewCopy:o})=>{const r=a.get(`${e}:${t}`);return{type:e,id:t,...n&&{overwrite:n},...r&&{replaceReferences:r},destinationId:s,createNewCopy:o}}))];if(0===y.length){r=n.filter(j);break}const _=await m(e,c,y,l);o=_.successCount,r=[];for(const{error:e,...t}of _.errors||[])r.push({error:e,obj:t});i=_.successResults||[]}return{status:"success",importCount:o,failedImports:r,successfulImports:i}}function v(e){var t;const n=[],s=new Map;for(const{error:t,...a}of e.errors||[]){if(n.push({obj:a,error:t}),"missing_references"!==t.type)continue;const e=t.references.filter((e=>"index-pattern"===e.type));for(const t of e){const e=s.get(`${t.type}:${t.id}`)||{existingIndexPatternId:t.id,list:[],newIndexPatternId:void 0};e.list.some((({type:e,id:t})=>e===a.type&&t===a.id))||(e.list.push(a),s.set(`${t.type}:${t.id}`,e))}}return{failedImports:n,successfulImports:null!==(t=e.successResults)&&void 0!==t?t:[],unmatchedReferences:Array.from(s.values()),status:0!==s.size||n.some((e=>(({type:e})=>"conflict"===e||"ambiguous_conflict"===e)(e.error)))?"idle":"success",importCount:e.successCount,importWarnings:e.warnings}}function j(e){return`${e.type} [id=${e.id}]`}async function y(e,t){return n=await e.get("/api/kibana/management/saved_objects/_find",{query:{...t,hasReference:t.hasReference?JSON.stringify(t.hasReference):void 0}}),Object(o.mapKeys)(n,((e,t)=>Object(o.camelCase)(t)));var n}var _=n(9);async function O(e){const t=new FileReader,n=(await new Promise(((n,s)=>{t.addEventListener("loadend",(e=>{n(e.target.result)})),t.addEventListener("error",(e=>{s(e)})),t.readAsText(e,"utf-8")}))).split("\n").filter((e=>e.length>0)),s=JSON.parse(n[n.length-1]);if("exportedCount"in(a=s)&&"missingRefCount"in a&&"missingReferences"in a)return s;var a}async function S(e){return(await e.get("/api/kibana/management/saved_objects/_allowed_types")).types}const C=({selectedTags:e,taggingApi:t})=>{if(t&&e){const n=[];return e.forEach((e=>{const s=t.ui.convertNameToReference(e);s&&n.push(s)})),n}}},function(e,t){e.exports=__kbnSharedDeps__.Lodash},function(e,t,n){e.exports=n(8)(3)},function(e,t){e.exports=__kbnSharedDeps__.ElasticEui},function(e,t){e.exports=__kbnSharedDeps_npm__},function(e,t,n){"use strict";async function s(e,t){return await e.post("/api/kibana/management/saved_objects/_bulk_get",{body:JSON.stringify(t)})}n.d(t,"a",(function(){return s}))},function(e,t,n){n(11),__kbnBundles__.define("plugin/savedObjectsManagement/public",n,12),__kbnBundles__.define("plugin/savedObjectsManagement/public/lib",n,4)},function(e,t,n){n.p=window.__kbnPublicPath__.savedObjectsManagement},function(e,t,n){"use strict";n.r(t),n.d(t,"SavedObjectsManagementAction",(function(){return action_SavedObjectsManagementAction})),n.d(t,"processImportResponse",(function(){return C.processImportResponse})),n.d(t,"plugin",(function(){return T}));var s=n(0),a=n.n(s),o=n(1),r=n(3),i=n.n(r);class action_SavedObjectsManagementAction{constructor(){a()(this,"render",void 0),a()(this,"id",void 0),a()(this,"euiAction",void 0),a()(this,"refreshOnFinish",void 0),a()(this,"callbacks",[]),a()(this,"actionContext",null),a()(this,"record",null)}setActionContext(e){this.actionContext=e}registerOnFinishCallback(e){this.callbacks.push(e)}start(e){this.record=e}finish(){this.record=null,this.callbacks.forEach((e=>e()))}}class column_SavedObjectsManagementColumn{constructor(){a()(this,"id",void 0),a()(this,"euiColumn",void 0),a()(this,"refreshOnFinish",void 0),a()(this,"callbacks",[]),a()(this,"columnContext",null)}setColumnContext(e){this.columnContext=e}registerOnFinishCallback(e){this.callbacks.push(e)}finish(){this.callbacks.forEach((e=>e()))}}var c=n(2);const l=({spacesApiUi:e,props:t})=>{const n=Object(r.useMemo)((()=>e.components.getCopyToSpaceFlyout),[e]);return Object(c.jsx)(n,t)};class copy_saved_objects_to_space_action_CopyToSpaceSavedObjectsManagementAction extends action_SavedObjectsManagementAction{constructor(e){super(),a()(this,"id","copy_saved_objects_to_space"),a()(this,"euiAction",{name:o.i18n.translate("savedObjectsManagement.copyToSpace.actionTitle",{defaultMessage:"Copy to spaces"}),description:o.i18n.translate("savedObjectsManagement.copyToSpace.actionDescription",{defaultMessage:"Make a copy of this saved object in one or more spaces"}),icon:"copy",type:"icon",available:e=>"agnostic"!==e.meta.namespaceType&&!e.meta.hiddenType,onClick:e=>{this.start(e)}}),a()(this,"render",(()=>{var e;if(!this.record)throw new Error("No record available! `render()` was likely called before `start()`.");const t={onClose:this.onClose,savedObjectTarget:{type:this.record.type,id:this.record.id,namespaces:null!==(e=this.record.namespaces)&&void 0!==e?e:[],title:this.record.meta.title,icon:this.record.meta.icon}};return Object(c.jsx)(l,{spacesApiUi:this.spacesApiUi,props:t})})),a()(this,"onClose",(()=>{this.finish()})),this.spacesApiUi=e}}const p=({spacesApiUi:e,props:t})=>{const n=Object(r.useMemo)((()=>e.components.getShareToSpaceFlyout),[e]);return Object(c.jsx)(n,t)};class share_saved_objects_to_space_action_ShareToSpaceSavedObjectsManagementAction extends action_SavedObjectsManagementAction{constructor(e){super(),a()(this,"id","share_saved_objects_to_space"),a()(this,"euiAction",{name:o.i18n.translate("savedObjectsManagement.shareToSpace.actionTitle",{defaultMessage:"Share to spaces"}),description:o.i18n.translate("savedObjectsManagement.shareToSpace.actionDescription",{defaultMessage:"Share this object to one or more spaces"}),icon:"share",type:"icon",available:e=>{const t=!this.actionContext||!!this.actionContext.capabilities.savedObjectsManagement.shareIntoSpace,{namespaceType:n,hiddenType:s}=e.meta;return"multiple"===n&&!s&&t},onClick:e=>{this.objectsToRefresh=[],this.start(e)}}),a()(this,"refreshOnFinish",(()=>this.objectsToRefresh)),a()(this,"objectsToRefresh",[]),a()(this,"render",(()=>{var e;if(!this.record)throw new Error("No record available! `render()` was likely called before `start()`.");const t={savedObjectTarget:{type:this.record.type,id:this.record.id,namespaces:null!==(e=this.record.namespaces)&&void 0!==e?e:[],title:this.record.meta.title,icon:this.record.meta.icon},flyoutIcon:"share",onUpdate:e=>this.objectsToRefresh=[...e],onClose:this.onClose,enableCreateCopyCallout:!0,enableCreateNewSpaceLink:!0};return Object(c.jsx)(p,{spacesApiUi:this.spacesApiUi,props:t})})),a()(this,"onClose",(()=>{this.finish()})),this.spacesApiUi=e}}class action_service_SavedObjectsManagementActionService{constructor(){a()(this,"actions",new Map)}setup(){return{register:e=>{if(this.actions.has(e.id))throw new Error(`Saved Objects Management Action with id '${e.id}' already exists`);this.actions.set(e.id,e)}}}start(e){return e&&function(e,t){e.setup().register(new share_saved_objects_to_space_action_ShareToSpaceSavedObjectsManagementAction(t.ui)),e.setup().register(new copy_saved_objects_to_space_action_CopyToSpaceSavedObjectsManagementAction(t.ui))}(this,e),{has:e=>this.actions.has(e),getAll:()=>[...this.actions.values()]}}}var u=n(6),d=n.n(u),f=n(7);const b=["tag","dashboard","canvas-workpad","canvas-element","lens","visualization","map","graph-workspace","search","query","rule","connector"],h=o.i18n.translate("savedObjectsManagement.shareToSpace.columnTitle",{defaultMessage:"Spaces"}),m=o.i18n.translate("savedObjectsManagement.shareToSpace.columnDescription",{defaultMessage:"The spaces that this object is currently assigned to"}),g=o.i18n.translate("savedObjectsManagement.shareToSpace.isolatedObjectTypeTitle",{defaultMessage:"Isolated saved object"}),v=o.i18n.translate("savedObjectsManagement.shareToSpace.isolatedObjectTypeContent",{defaultMessage:"This saved object is available in only one space, it cannot be assigned to multiple spaces."}),j=o.i18n.translate("savedObjectsManagement.shareToSpace.shareableSoonObjectTypeTitle",{defaultMessage:"Coming soon: Assign saved object to multiple spaces"}),y=o.i18n.translate("savedObjectsManagement.shareToSpace.shareableSoonObjectTypeContent",{defaultMessage:"This saved object is available in only one space. In a future release, you can assign it to multiple spaces."}),_=o.i18n.translate("savedObjectsManagement.shareToSpace.globalObjectTypeTitle",{defaultMessage:"Global saved object"}),O=o.i18n.translate("savedObjectsManagement.shareToSpace.globalObjectTypeContent",{defaultMessage:"This saved object is available in all spaces and cannot be changed."}),S=({objectType:e,objectNamespaceType:t,spacesApiUi:n,capabilities:s,spaceListProps:a,flyoutProps:o})=>{const[l,p]=Object(r.useState)(!1),u=Object(r.useMemo)((()=>n.components.getSpaceList),[n]),h=Object(r.useMemo)((()=>n.components.getShareToSpaceFlyout),[n]),m=Object(r.useMemo)((()=>n.components.getSpaceAvatar),[n]);if("single"===t||"multiple-isolated"===t){const t=b.includes(e)?{title:j,content:y}:{title:g,content:v};return Object(c.jsx)(f.EuiIconTip,d()({type:"minus",position:"left",delay:"long"},t))}if("agnostic"===t)return Object(c.jsx)(f.EuiToolTip,{position:"left",delay:"long",title:_,content:O},Object(c.jsx)(m,{space:{id:"*",initials:"*",color:"#D3DAE6"},isDisabled:!0,size:"s"}));const S=!s||s.savedObjectsManagement.shareIntoSpace?{cursorStyle:"pointer",listOnClick:function(){p(!0)}}:{cursorStyle:"not-allowed"};return Object(c.jsx)(i.a.Fragment,null,Object(c.jsx)(u,d()({},a,S)),l&&Object(c.jsx)(h,d()({},o,{onClose:function(){var e;p(!1),null===(e=o.onClose)||void 0===e||e.call(o)}})))};class share_saved_objects_to_space_column_ShareToSpaceSavedObjectsManagementColumn extends column_SavedObjectsManagementColumn{constructor(e){super(),a()(this,"id","share_saved_objects_to_space"),a()(this,"euiColumn",{field:"namespaces",name:h,description:m,render:(e,t)=>{var n;const s={namespaces:null!=e?e:[],behaviorContext:"outside-space"},a={savedObjectTarget:{type:t.type,id:t.id,namespaces:null!=e?e:[],title:t.meta.title,icon:t.meta.icon},flyoutIcon:"share",onUpdate:e=>this.objectsToRefresh=[...e],onClose:this.onClose,enableCreateCopyCallout:!0,enableCreateNewSpaceLink:!0};return Object(c.jsx)(S,{objectType:t.type,objectNamespaceType:t.meta.namespaceType,spacesApiUi:this.spacesApiUi,capabilities:null===(n=this.columnContext)||void 0===n?void 0:n.capabilities,spaceListProps:s,flyoutProps:a})}}),a()(this,"refreshOnFinish",(()=>this.objectsToRefresh)),a()(this,"objectsToRefresh",[]),a()(this,"onClose",(()=>{this.finish()})),this.spacesApiUi=e}}class column_service_SavedObjectsManagementColumnService{constructor(){a()(this,"columns",new Map)}setup(){return{register:e=>{if(this.columns.has(e.id))throw new Error(`Saved Objects Management Column with id '${e.id}' already exists`);this.columns.set(e.id,e)}}}start(e){return e&&function(e,t){e.setup().register(new share_saved_objects_to_space_column_ShareToSpaceSavedObjectsManagementColumn(t.ui))}(this,e),{getAll:()=>[...this.columns.values()]}}}var C=n(4);class plugin_SavedObjectsManagementPlugin{constructor(){a()(this,"actionService",new action_service_SavedObjectsManagementActionService),a()(this,"columnService",new column_service_SavedObjectsManagementColumnService)}setup(e,{home:t,management:s}){const a=this.actionService.setup(),r=this.columnService.setup();return t&&t.featureCatalogue.register({id:"saved_objects",title:o.i18n.translate("savedObjectsManagement.objects.savedObjectsTitle",{defaultMessage:"Saved Objects"}),description:o.i18n.translate("savedObjectsManagement.objects.savedObjectsDescription",{defaultMessage:"Import, export, and manage your saved objects."}),icon:"savedObjectsApp",path:"/app/management/kibana/objects",showOnHomePage:!1,category:"admin"}),s.sections.section.kibana.registerApp({id:"objects",title:o.i18n.translate("savedObjectsManagement.managementSectionLabel",{defaultMessage:"Saved Objects"}),order:1,mount:async t=>{const{mountManagementSection:s}=await n.e(3).then(n.bind(null,45));return s({core:e,mountParams:t})}}),{actions:a,columns:r}}start(e,{spaces:t}){return{actions:this.actionService.start(t),columns:this.columnService.start(t),getAllowedTypes:()=>Object(C.getAllowedTypes)(e.http),getRelationships:(t,n,s)=>Object(C.getRelationships)(e.http,t,n,s),getSavedObjectLabel:C.getSavedObjectLabel,getDefaultTitle:C.getDefaultTitle,parseQuery:C.parseQuery,getTagFindReferences:C.getTagFindReferences}}}function T(e){return new plugin_SavedObjectsManagementPlugin}},function(e,t){e.exports=__kbnSharedDeps__.KbnI18nReact},function(e,t,n){n.r(t);var s=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(s))},function(e,t){e.exports=__kbnSharedDeps__.ReactRouterDom},function(e,t){e.exports=__kbnSharedDeps__.Moment},function(e,t){e.exports=__kbnSharedDeps__.ReactDom},function(e,t){e.exports=__kbnSharedDeps__.KbnMonaco}]);