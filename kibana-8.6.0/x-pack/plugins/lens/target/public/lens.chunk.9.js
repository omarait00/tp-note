/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.lens_bundle_jsonpfunction=window.lens_bundle_jsonpfunction||[]).push([[9],{59:function(e,t,n){"use strict";n.r(t),n.d(t,"getVisualizeGeoFieldMessage",(function(){return s})),n.d(t,"getResolvedDateRange",(function(){return c})),n.d(t,"containsDynamicMath",(function(){return l})),n.d(t,"getTimeZone",(function(){return d})),n.d(t,"getActiveDatasourceIdFromDoc",(function(){return f})),n.d(t,"getInitialDatasourceId",(function(){return g})),n.d(t,"getInitialDataViewsObject",(function(){return m})),n.d(t,"refreshIndexPatternsList",(function(){return p})),n.d(t,"getIndexPatternsIds",(function(){return v})),n.d(t,"getIndexPatternsObjects",(function(){return I})),n.d(t,"getRemoveOperation",(function(){return b})),n.d(t,"inferTimeField",(function(){return O})),n.d(t,"renewIDs",(function(){return j})),n.d(t,"DONT_CLOSE_DIMENSION_CONTAINER_ON_CLICK_CLASS",(function(){return y})),n.d(t,"isDraggedField",(function(){return D})),n.d(t,"isDraggedDataViewField",(function(){return h})),n.d(t,"isOperationFromCompatibleGroup",(function(){return S})),n.d(t,"isOperationFromTheSameGroup",(function(){return x})),n.d(t,"sortDataViewRefs",(function(){return P})),n.d(t,"getSearchWarningMessages",(function(){return w}));var r=n(21),i=n(0),o=n(39),a=n.n(o),u=n(70);function s(e){return i.i18n.translate("xpack.lens.visualizeGeoFieldMessage",{defaultMessage:"Lens cannot visualize {fieldType} fields",values:{fieldType:e}})}const c=function(e){const{from:t,to:n}=e.getTime(),{min:r,max:i}=e.calculateBounds({from:t,to:n});return{fromDate:(null==r?void 0:r.toISOString())||t,toDate:(null==i?void 0:i.toISOString())||n}};function l(e){return e.includes("now")}function d(e){const t=e.get("dateFormat:tz");return"Browser"===t?a.a.tz.guess():t}function f(e){if(!e)return null;const[t]=Object.keys(e.state.datasourceStates);return t||null}const g=(e,t)=>t&&f(t)||Object.keys(e)[0]||null;function m(e,t){return{indexPatterns:e,indexPatternRefs:t}}async function p({activeDatasources:e,indexPatternService:t,indexPatternId:n,indexPatternsCache:r}){const i=Object.values(e).map((e=>null==e?void 0:e.onRefreshIndexPattern)).filter(Boolean),o=(await t.loadIndexPatterns({cache:{},patterns:[n],onIndexPatternRefresh:()=>i.forEach((e=>e()))}))[n];t.updateDataViewsState({indexPatterns:{...r,[n]:o}})}function v({activeDatasources:e,datasourceStates:t,visualizationState:n,activeVisualization:i}){let o;const a=[];if(Object.entries(e).forEach((([e,n])=>{const{savedObjectReferences:r}=n.getPersistableState(t[e].state),i=n.getUsedDataView(t[e].state);o=i,a.push(...r)})),null!=i&&i.getPersistableState){const{savedObjectReferences:e}=i.getPersistableState(n);a.push(...e)}const u=a.filter((({type:e})=>"index-pattern"===e)).map((({id:e})=>e));return o&&u.unshift(o),Object(r.uniq)(u)}async function I(e,t){const n=await Promise.allSettled(e.map((e=>t.get(e)))),r=n.filter((e=>"fulfilled"===e.status)),i=n.map(((t,n)=>e[n])).filter(((e,t)=>"rejected"===n[t].status));return{indexPatterns:r.map((e=>e.value)),rejectedIds:i}}function b(e,t,n,r){return e.getRemoveOperation?e.getRemoveOperation(t,n):1===r?"clear":"remove"}function O(e,t){return("table"in t?[{table:t.table,column:t.column}]:t.negate?[]:t.data).map((({table:t,column:n})=>{var r;const i=t.columns[n];if(Boolean(i&&(null===(r=e.getDateHistogramMeta(i))||void 0===r?void 0:r.timeRange)))return i.meta.field})).find(Boolean)}function j(e,t,n){e=Object(r.cloneDeep)(e);const i=(e,o,a)=>{if("object"==typeof e)Array.isArray(e)?e.forEach(((e,t,n)=>i(e,n,t))):e&&Object.keys(e).forEach((r=>{let o=r;var a;t.includes(r)&&(o=null!==(a=n(r))&&void 0!==a?a:r,e[o]=e[r],delete e[r]),i(e[o],e,o)}));else if(o&&void 0!==a&&"string"==typeof e&&t.includes(e)){var u;Object(r.set)(o,a,null!==(u=n(e))&&void 0!==u?u:e)}};return i(e),e}const y="lensDontCloseDimensionContainerOnClick";function D(e){return"object"==typeof e&&null!==e&&["id","field"].every((t=>t in e))}function h(e){return"object"==typeof e&&null!==e&&["id","field","indexPatternId"].every((t=>t in e))}const S=(e,t)=>Object(u.e)(e)&&Object(u.e)(t)&&e.columnId!==t.columnId&&e.groupId===t.groupId&&e.layerId!==t.layerId,x=(e,t)=>Object(u.e)(e)&&Object(u.e)(t)&&e.columnId!==t.columnId&&e.groupId===t.groupId&&e.layerId===t.layerId,P=e=>e.sort(((e,t)=>e.title.localeCompare(t.title))),w=(e,t,n,r)=>{const i=new Map;return r.searchService.showWarnings(e,((e,r)=>{var o;const{request:a,response:u,requestId:s}=r,c=null===(o=t.getSearchWarningMessages)||void 0===o?void 0:o.call(t,n,e,a,u);if(null!=c&&c.length){var l,d;const t=null!==(l=(null!=s?s:"")+e.type+(null===(d=e.reason)||void 0===d?void 0:d.type))&&void 0!==l?l:"";return i.has(t)||i.set(t,c),!0}return!1})),[...i.values()].flat()}},70:function(e,t,n){"use strict";function r(e){return"object"==typeof e&&null!==e&&"columnId"in e}function i(e){return"filter"===e.name}function o(e){return"brush"===e.name}function a(e){return"edit"===e.name}function u(e){return"tableRowContextMenuClick"===e.name}n.d(t,"e",(function(){return r})),n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return o})),n.d(t,"b",(function(){return a})),n.d(t,"d",(function(){return u}))}}]);