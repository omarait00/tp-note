(window.discover_bundle_jsonpfunction=window.discover_bundle_jsonpfunction||[]).push([[8],{125:function(e,t,r){"use strict";r.r(t),r.d(t,"getSharingData",(function(){return s})),r.d(t,"showPublicUrlSwitch",(function(){return o}));var i=r(67),n=r(7),a=r(73);async function s(e,t,r){const{uiSettings:s,data:o}=r,c=e.createCopy(),u=c.getField("index");let l=c.getField("filter");c.setField("sort",Object(i.d)(t.sort,u,s.get(n.SORT_DEFAULT_ORDER_SETTING))),c.removeField("filter"),c.removeField("highlight"),c.removeField("highlightAll"),c.removeField("aggs"),c.removeField("size");let d=t.columns||[];if(d&&d.length>0){let e;!s.get(n.DOC_HIDE_TIME_COLUMN_SETTING)&&u&&u.timeFieldName&&(e=u.timeFieldName),e&&!d.includes(e)&&(d=[e,...d])}const g=o.query.timefilter.timefilter.createFilter(u),f=o.query.timefilter.timefilter.createRelativeFilter(u);return{getSearchSource:e=>{const t=e?g:f;if(Array.isArray(l)?l=l.filter((e=>!Object(a.c)(e,g))):Object(a.c)(l,g)&&(l=void 0),l&&t)c.setField("filter",Array.isArray(l)?[t,...l]:[t,l]);else{const e=t||l;c.setField("filter",e)}return!s.get(n.SEARCH_FIELDS_FROM_SOURCE)&&d.length&&c.setField("fields",d.map((e=>({field:e,include_unmapped:"true"})))),c.getSerializedFields(!0)},columns:d}}const o=e=>!!e.discover&&!!e.discover.show},67:function(e,t,r){"use strict";r.d(t,"b",(function(){return c})),r.d(t,"c",(function(){return u})),r.d(t,"d",(function(){return l})),r.d(t,"a",(function(){return a}));var i=r(9),n=r(7);function a(e,t="desc",r=!1){return null!=e&&e.timeFieldName&&s(e.timeFieldName,e)&&!r?[[e.timeFieldName,t]]:[]}function s(e,t){const r=t.getFieldByName(e);return!(!r||!r.sortable)}function o(e,t){return Array.isArray(e)?function(e){return 2===e.length&&"string"==typeof e[0]&&("desc"===e[1]||"asc"===e[1])}(e)?[{[e[0]]:e[1]}]:e.map((e=>function(e,t){if(Array.isArray(e)&&2===e.length&&s(String(e[0]),t)){const[t,r]=e;return{[t]:r}}if(Object(i.isPlainObject)(e)&&s(Object.keys(e)[0],t))return e}(e,t))).filter((e=>"object"==typeof e)):[]}function c(e,t){return o(e,t).reduce(((e,t)=>{const r=Object.entries(t);return r&&r[0]&&e.push(r[0]),e}),[])}function u(e,t,r){return e&&e.length&&t?c(e,t):r?a(t,r.get(n.SORT_DEFAULT_ORDER_SETTING,"desc"),r.get(n.DOC_HIDE_TIME_COLUMN_SETTING,!1)):[]}function l(e,t,r="desc"){if(!e||!t||Array.isArray(e)&&0===e.length)return null!=t&&t.timeFieldName?[{_doc:r}]:[{_score:r}];const{timeFieldName:i}=t;return o(e,t).map((e=>t.isTimeNanosBased()&&i&&e[i]?{[i]:{order:e[i],numeric_type:"date_nanos"}}:e))}},73:function(e,t,r){"use strict";r.d(t,"b",(function(){return f})),r.d(t,"c",(function(){return S})),r.d(t,"a",(function(){return b}));var i=r(9),n=r(3),a=r(24),s=r(1),o=r(40),c=r(82),u=r(77),l=r(10);var d=r(81);const g="_a";function f({history:e,savedSearch:t,services:r}){const n=r.uiSettings.get("state:storeInSessionStorage"),l=r.core.notifications.toasts,f=Object(c.a)({savedSearch:t,services:r}),S=Object(s.createKbnUrlStateStorage)({useHash:n,history:e,...l&&Object(s.withNotifyOnErrors)(l)}),b=function(e){var t,r,n;return e&&e.query&&!Object(a.isOfAggregateQueryType)(e.query)&&!e.query.language&&(e.query=(r=e.query,Object(i.has)(r,"language")?r:{query:r,language:"lucene"})),"string"==typeof(null==e||null===(t=e.sort)||void 0===t?void 0:t[0])&&("asc"===(null==e||null===(n=e.sort)||void 0===n?void 0:n[1])||"desc"===e.sort[1]?e.sort=[[e.sort[0],e.sort[1]]]:delete e.sort),null!=e&&e.sort&&!e.sort.length&&delete e.sort,null==e||!e.rowsPerPage||"number"==typeof e.rowsPerPage&&e.rowsPerPage>0||delete e.rowsPerPage,e}(S.get(g));let m,O=Object(u.a)({...f,...b},r.uiSettings);const y=Object(s.createStateContainer)(O),p={...y,set:e=>{e&&(m=y.getState(),y.set(e))}},_=()=>Object(s.syncState)({storageKey:g,stateContainer:p,stateStorage:S}),j=async(e={})=>{const t={...y.getState(),...e};await S.set(g,t,{replace:!0})};return{kbnUrlStateStorage:S,appStateContainer:p,startSync:()=>{const{start:e,stop:t}=_();return e(),t},setAppState:e=>h(p,e),replaceUrlAppState:j,resetInitialAppState:()=>{O=y.getState()},resetAppState:e=>{const t=Object(u.a)(Object(c.a)({savedSearch:e,services:r}),r.uiSettings);h(p,t)},getPreviousAppState:()=>m,flushToUrl:()=>S.kbnUrlControls.flush(),isAppStateDirty:()=>!v(O,y.getState()),pauseAutoRefreshInterval:async()=>{const e=S.get("_g");null!=e&&e.refreshInterval&&!e.refreshInterval.pause&&await S.set("_g",{...e,refreshInterval:{...null==e?void 0:e.refreshInterval,pause:!0}},{replace:!0})},initializeAndSync:(e,t,r)=>{y.getState().index!==e.id&&h(p,{index:e.id});const n=y.getState().filters;n&&t.setAppFilters(Object(i.cloneDeep)(n));const s=y.getState().query;s&&r.query.queryString.setQuery(s);const c=Object(o.connectToQueryState)(r.query,y,{filters:a.FilterStateStore.APP_STATE,query:!0}),{stop:u}=Object(o.syncQueryStateWithUrl)(r.query,S),l=t.getFilters(),g=Object(d.a)(e,l);Object(i.isEqual)(l,g)||t.setFilters(g);const{start:f,stop:v}=_();return j({}).then((()=>{f()})),()=>{c(),u(),v()}}}}function h(e,t){const r=e.getState(),i={...r,...t};v(r,i)||e.set(i)}function S(e,t){return!e&&!t||!(!e||!t)&&Object(a.compareFilters)(e,t,a.COMPARE_ALL_OPTIONS)}function v(e,t){if(!e&&!t)return!0;if(!e||!t)return!1;const{filters:r=[],...n}=e,{filters:a=[],...s}=t;return Object(i.isEqual)(n,s)&&S(r,a)}function b(e){const t=()=>e.getSavedSearch().id;return{getName:async()=>{const t=e.getSavedSearch();return t.id&&t.title||n.i18n.translate("discover.discoverDefaultSearchSessionName",{defaultMessage:"Discover"})},getLocatorData:async()=>({id:l.a,initialState:m({...e,getSavedSearchId:t,shouldRestoreSearchSession:!1}),restoreState:m({...e,getSavedSearchId:t,shouldRestoreSearchSession:!0})})}}function m({appStateContainer:e,data:t,getSavedSearchId:r,shouldRestoreSearchSession:i}){const n=e.get();return{filters:t.query.filterManager.getFilters(),dataViewId:n.index,query:n.query,savedSearchId:r(),timeRange:i?t.query.timefilter.timefilter.getAbsoluteTime():t.query.timefilter.timefilter.getTime(),searchSessionId:i?t.search.session.getSessionId():void 0,columns:n.columns,sort:n.sort,savedQuery:n.savedQuery,interval:n.interval,refreshInterval:i?{pause:!0,value:0}:void 0,useHash:!1,viewMode:n.viewMode,hideAggregatedPreview:n.hideAggregatedPreview}}},77:function(e,t,r){"use strict";r.d(t,"a",(function(){return a}));var i=r(9),n=r(7);function a(e,t){if(!e.columns)return e;const r=!t.get(n.SEARCH_FIELDS_FROM_SOURCE),a=t.get(n.DEFAULT_COLUMNS_SETTING);if(r){let t=e.columns.filter((e=>"_source"!==e));return 0!==t.length||Object(i.isEqual)(a,["_source"])||(t=a,t=t.filter((e=>"_source"!==e))),{...e,columns:t}}if(0===e.columns.length){const t=a;return 0===t.length&&t.push("_source"),{...e,columns:[...t]}}return e}},78:function(e,t,r){"use strict";r.d(t,"a",(function(){return n}));var i=r(4);function n(e){const[t,r]=Object(i.useState)(e.getValue());return Object(i.useEffect)((()=>{const i=e.subscribe((e=>{e.fetchStatus!==t.fetchStatus&&r({...t,...e})}));return()=>i.unsubscribe()}),[e,t,r]),t}},81:function(e,t,r){"use strict";r.d(t,"a",(function(){return i}));const i=(e,t)=>t.map((t=>{var r;const i={...t.meta};return null!==(r=t.query)&&void 0!==r&&r.script&&i.index!==e.id&&(i.disabled=!0),{...t,meta:i}}))},82:function(e,t,r){"use strict";r.d(t,"a",(function(){return o}));var i=r(9),n=r(67),a=r(7),s=r(83);function o({savedSearch:e,services:t}){var r;const{searchSource:o}=e,{data:c,uiSettings:u,storage:l}=t,d=o.getField("index"),g=o.getField("query")||c.query.queryString.getDefaultQuery(),f=Object(n.b)(null!==(r=e.sort)&&void 0!==r?r:[],d),h=function(e,t){return e.columns&&e.columns.length>0?[...e.columns]:t.get(a.SEARCH_FIELDS_FROM_SOURCE)&&Object(i.isEqual)(t.get(a.DEFAULT_COLUMNS_SETTING),[])?["_source"]:[...t.get(a.DEFAULT_COLUMNS_SETTING)]}(e,u),S=l.get(s.a),v={query:g,sort:f.length?f:Object(n.a)(d,u.get(a.SORT_DEFAULT_ORDER_SETTING,"desc"),u.get(a.DOC_HIDE_TIME_COLUMN_SETTING,!1)),columns:h,index:null==d?void 0:d.id,interval:"auto",filters:Object(i.cloneDeep)(o.getOwnField("filter")),hideChart:"boolean"==typeof S?S:void 0,viewMode:void 0,hideAggregatedPreview:void 0,savedQuery:void 0,rowHeight:void 0,rowsPerPage:void 0,grid:void 0};return e.grid&&(v.grid=e.grid),void 0!==e.hideChart&&(v.hideChart=e.hideChart),void 0!==e.rowHeight&&(v.rowHeight=e.rowHeight),e.viewMode&&(v.viewMode=e.viewMode),e.hideAggregatedPreview&&(v.hideAggregatedPreview=e.hideAggregatedPreview),e.rowsPerPage&&(v.rowsPerPage=e.rowsPerPage),v}},83:function(e,t,r){"use strict";r.d(t,"a",(function(){return l})),r.d(t,"b",(function(){return g}));var i=r(44),n=r(49),a=r(4),s=r(6),o=r(7),c=r(18),u=r(78);const l="discover:chartHidden",d="discover:histogramHeight",g=({stateContainer:e,state:t,savedSearchData$:r,dataView:g,savedSearch:f,isTimeBased:h,isPlainRecord:S})=>{const{storage:v,data:b}=Object(c.a)(),m=g.timeFieldName&&g.getFieldByName(g.timeFieldName),[O,y]=Object(a.useState)(!1);Object(a.useEffect)((()=>{m&&Object(i.getVisualizeInformation)(Object(s.e)(),m,g,f.columns||[],[]).then((e=>{y(Boolean(e))}))}),[g,f.columns,m]);const p=Object(a.useCallback)((()=>{m&&Object(i.triggerVisualizeActions)(Object(s.e)(),m,f.columns||[],o.PLUGIN_ID,g)}),[g,f.columns,m]),[_,j]=Object(a.useState)((()=>{const e=v.get(d);return e?Number(e):void 0})),F=Object(a.useCallback)((e=>{v.set(d,e),j(e)}),[v]),A=Object(a.useCallback)((t=>{v.set(l,t),e.setAppState({hideChart:t})}),[e,v]),E=Object(a.useCallback)((t=>{e.setAppState({interval:t})}),[e]),{fetchStatus:I,result:T}=Object(u.a)(r.totalHits$),C=Object(a.useMemo)((()=>S?void 0:{status:I,total:T}),[I,T,S]),{fetchStatus:w,response:N,error:P}=Object(u.a)(r.charts$),{bucketInterval:D,chartData:q}=Object(a.useMemo)((()=>S||!h?{bucketInterval:void 0,chartData:void 0}:Object(n.buildChartData)({data:b,dataView:g,timeInterval:t.interval,response:N})),[b,g,S,h,N,t.interval]);return{topPanelHeight:_,hits:C,chart:Object(a.useMemo)((()=>S||!h?void 0:{status:w,hidden:t.hideChart,timeInterval:t.interval,bucketInterval:D,data:q,error:P}),[D,q,w,P,S,h,t.hideChart,t.interval]),onEditVisualization:O?p:void 0,onTopPanelHeightChange:F,onChartHiddenChange:A,onTimeIntervalChange:E}}}}]);