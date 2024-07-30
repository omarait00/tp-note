/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.infra_bundle_jsonpfunction=window.infra_bundle_jsonpfunction||[]).push([[8],{117:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2);t.default=function(e){r.useEffect(e,[])}},119:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2);t.default=function(){var e=r.useRef(!1),t=r.useCallback((function(){return e.current}),[]);return r.useEffect((function(){return e.current=!0,function(){e.current=!1}})),t}},129:function(e,t,n){"use strict";n.d(t,"a",(function(){return L}));var r=n(2),a=n(14),i=n(22),s=n(18),o=n(70),l=n.n(o),u=n(0),c=n(25);n(29),n(138);var d=function(e){return""===e},p=u.brand(u.string,(function(e){return!d(t=e)&&!t.includes(" ")&&!t.split(",").some(d);var t}),"IndexPattern");new u.Type("JSON",u.any.is,(function(e,t){return a.either.chain(u.string.validate(e,t),(function(n){try{return u.success(JSON.parse(n))}catch(n){return u.failure(e,t)}}))}),(function(e){return JSON.stringify(e)})),new u.Type("isoToEpochRt",u.number.is,(function(e,t){return a.either.chain(u.string.validate(e,t),(function(n){var r=new Date(n).getTime();return isNaN(r)?u.failure(e,t):u.success(r)}))}),(function(e){return new Date(e).toISOString()})),new u.Type("ToNumber",u.number.is,(function(e,t){var n=Number(e);return isNaN(n)?u.failure(e,t):u.success(n)}),u.identity),new u.Type("ToBoolean",u.boolean.is,(function(e){var t;return t="string"==typeof e?"true"===e:!!e,u.success(t)}),u.identity),u.brand(u.string,(function(e){return e.length>0}),"NonEmptyString");var f=n(49),m=n.n(f);const b=new u.Type("TimestampFromString",(e=>"number"==typeof e),((e,t)=>Object(s.pipe)(u.string.validate(e,t),Object(a.chain)((e=>{const n=m()(e);return n.isValid()?u.success(n.valueOf()):u.failure(e,t)})))),(e=>new Date(e).toISOString())),g=(u.type({sources:u.type({default:u.partial({fields:u.partial({message:u.array(u.string)})})})}),u.type({timestampColumn:u.type({id:u.string})})),y=u.type({messageColumn:u.type({id:u.string})}),h=u.type({fieldColumn:u.type({id:u.string,field:u.string})}),v=u.union([g,y,h]),E=u.type({type:u.literal("index_pattern"),indexPatternId:u.string}),j=u.type({type:u.literal("index_name"),indexName:u.string}),O=u.union([E,j]),x=u.type({message:u.array(u.string)}),T=u.type({name:u.string,description:u.string,metricAlias:u.string,logIndices:O,inventoryDefaultView:u.string,metricsExplorerDefaultView:u.string,fields:x,logColumns:u.array(v),anomalyThreshold:u.number}),w=u.partial(Object(c.omit)(x.props,["message"])),M=u.intersection([u.partial(Object(c.omit)(T.props,["fields"])),u.partial({fields:w})]),k=u.partial(x.props),P=(u.partial({...T.props,fields:k}),u.type({...T.props,fields:x,logColumns:u.array(v)})),R=u.type({name:u.string,type:u.string,searchable:u.boolean,aggregatable:u.boolean,displayable:u.boolean}),S=u.type({logIndicesExist:u.boolean,metricIndicesExist:u.boolean,indexFields:u.array(R)}),_=u.intersection([u.type({id:u.string,origin:u.keyof({fallback:null,internal:null,stored:null}),configuration:P}),u.partial({version:u.string,updatedAt:u.number,status:S})]),A=(u.type({source:_}),u.intersection([u.type({id:u.string,attributes:M}),u.partial({version:u.string,updated_at:b})]),u.strict({name:T.props.name,description:T.props.description,metricAlias:T.props.metricAlias,inventoryDefaultView:T.props.inventoryDefaultView,metricsExplorerDefaultView:T.props.metricsExplorerDefaultView,anomalyThreshold:u.number})),C=(u.partial({...A.type.props,metricAlias:p}),u.partial({...A.type.props}),u.keyof({fallback:null,internal:null,stored:null})),D=u.strict({metricIndicesExist:S.props.metricIndicesExist,indexFields:S.props.indexFields}),I=u.exact(u.intersection([u.type({id:u.string,origin:C,configuration:A}),u.partial({updatedAt:u.number,version:u.string,status:D})])),N=u.type({source:I});var F=n(86),V=n(21);const L=({sourceId:e="default",fetch:t,toastWarning:n})=>{const{error:o,loading:l,response:u,makeRequest:c}=Object(F.a)(`/api/metrics/source/${e}`,"GET",null,(e=>Object(s.pipe)(N.decode(e),Object(a.fold)(Object(V.c)(V.a),i.identity))),t,n);return Object(r.useEffect)((()=>{(async()=>{await c()})()}),[c]),{createDerivedIndexPattern:Object(r.useCallback)((()=>{return{fields:null!=u&&u.source.status?u.source.status.indexFields:[],title:(e=null==u?void 0:u.source,t="metrics",e?"metrics"===t?e.configuration.metricAlias:`${e.configuration.metricAlias}`:"unknown-index")};var e,t}),[u]),source:Object(r.useMemo)((()=>u?u.source:null),[u]),loading:l,error:o}},H=l()(L),[$,q]=H},136:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=n(9),a=n(58);function i(){const[e]=Object(r.useUiSetting$)(a.UI_SETTINGS.DATEFORMAT_TZ);return e&&"Browser"!==e?e:"local"}},138:function(e,t,n){e.exports=n(26)(22)},158:function(e,t,n){"use strict";n.d(t,"i",(function(){return f})),n.d(t,"d",(function(){return m})),n.d(t,"f",(function(){return b})),n.d(t,"j",(function(){return g})),n.d(t,"k",(function(){return y})),n.d(t,"h",(function(){return h})),n.d(t,"g",(function(){return v})),n.d(t,"a",(function(){return j})),n.d(t,"e",(function(){return O})),n.d(t,"c",(function(){return x})),n.d(t,"b",(function(){return T}));var r=n(2),a=n.n(r),i=n(52),s=n(49),o=n.n(s),l=n(1),u=n(12),c=n(19),d=n(25),p=n(11);const f={headerFormatter:e=>o()(e.value).format("Y-MM-DD HH:mm:ss")},m=20,b={s:l.i18n.translate("xpack.infra.alerts.timeLabels.seconds",{defaultMessage:"seconds"}),m:l.i18n.translate("xpack.infra.alerts.timeLabels.minutes",{defaultMessage:"minutes"}),h:l.i18n.translate("xpack.infra.alerts.timeLabels.hours",{defaultMessage:"hours"}),d:l.i18n.translate("xpack.infra.alerts.timeLabels.days",{defaultMessage:"days"})},g=(e,t)=>Object(r.useMemo)((()=>"number"==typeof e&&"number"==typeof t?Object(i.niceTimeFormatter)([e,t]):e=>`${e}`),[e,t]),y=p.a,h=(e,t=!1)=>{let n=null,r=null;const a=e.reduce(((e,t)=>(t.points.forEach((t=>{const n=e[t.timestamp]||[];e[t.timestamp]=[...n,t.value]})),e)),{});Object.values(a).forEach((e=>{const a=t?Object(d.sum)(e):Object(d.max)(e),i=Object(d.min)(e);a&&(!r||a>r)&&(r=a),i&&(!n||i<n)&&(n=i)}));const i=Object.keys(a).map(Number),s=Object(d.min)(i)||0,o=Object(d.max)(i)||0;return{yMin:n||0,yMax:r||0,xMin:s,xMax:o}},v=e=>e?i.DARK_THEME:i.LIGHT_THEME,E=({children:e})=>a.a.createElement("div",{style:{width:"100%",height:150,display:"flex",justifyContent:"center",alignItems:"center"}},e),j=({children:e})=>a.a.createElement("div",{style:{width:"100%",height:150}},e),O=()=>a.a.createElement(E,null,a.a.createElement(u.EuiText,{color:"subdued","data-test-subj":"noChartData"},a.a.createElement(c.FormattedMessage,{id:"xpack.infra.alerts.charts.noDataMessage",defaultMessage:"No chart data available"}))),x=()=>a.a.createElement(E,null,a.a.createElement(u.EuiText,{color:"subdued","data-test-subj":"loadingData"},a.a.createElement(c.FormattedMessage,{id:"xpack.infra.alerts.charts.loadingMessage",defaultMessage:"Loading"}))),T=()=>a.a.createElement(E,null,a.a.createElement(u.EuiText,{color:"subdued","data-test-subj":"chartErrorState"},a.a.createElement(c.FormattedMessage,{id:"xpack.infra.alerts.charts.errorMessage",defaultMessage:"Uh oh, something went wrong"})))},273:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var r=n(52),a=n(25),i=n(2),s=n.n(i),o=n(7),l=n(82);const u=.3,c=({threshold:e,sortedThresholds:t,comparator:n,color:i,id:c,firstTimestamp:d,lastTimestamp:p,domain:f})=>{if(!n||!e)return null;const m=[o.b.GT,o.b.GT_OR_EQ].includes(n),b=[o.b.LT,o.b.LT_OR_EQ].includes(n);return s.a.createElement(s.a.Fragment,null,s.a.createElement(r.LineAnnotation,{id:`${c}-thresholds`,domainType:r.AnnotationDomainType.YDomain,"data-test-subj":"threshold-line",dataValues:t.map((e=>({dataValue:e}))),style:{line:{strokeWidth:2,stroke:Object(l.b)(i),opacity:1}}}),2===t.length&&n===o.b.BETWEEN?s.a.createElement(s.a.Fragment,null,s.a.createElement(r.RectAnnotation,{id:`${c}-lower-threshold`,"data-test-subj":"between-rect",style:{fill:Object(l.b)(i),opacity:u},dataValues:[{coordinates:{x0:d,x1:p,y0:Object(a.first)(e),y1:Object(a.last)(e)}}]})):null,2===t.length&&n===o.b.OUTSIDE_RANGE?s.a.createElement(s.a.Fragment,null,s.a.createElement(r.RectAnnotation,{id:`${c}-lower-threshold`,"data-test-subj":"outside-range-lower-rect",style:{fill:Object(l.b)(i),opacity:u},dataValues:[{coordinates:{x0:d,x1:p,y0:f.min,y1:Object(a.first)(e)}}]}),s.a.createElement(r.RectAnnotation,{id:`${c}-upper-threshold`,"data-test-subj":"outside-range-upper-rect",style:{fill:Object(l.b)(i),opacity:u},dataValues:[{coordinates:{x0:d,x1:p,y0:Object(a.last)(e),y1:f.max}}]})):null,b&&null!=Object(a.first)(e)?s.a.createElement(r.RectAnnotation,{id:`${c}-upper-threshold`,"data-test-subj":"below-rect",style:{fill:Object(l.b)(i),opacity:u},dataValues:[{coordinates:{x0:d,x1:p,y0:f.min,y1:Object(a.first)(e)}}]}):null,m&&null!=Object(a.first)(e)?s.a.createElement(r.RectAnnotation,{id:`${c}-upper-threshold`,"data-test-subj":"above-rect",style:{fill:Object(l.b)(i),opacity:u},dataValues:[{coordinates:{x0:d,x1:p,y0:Object(a.first)(e),y1:f.max}}]}):null)}},70:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(2);function a(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}var i={};function s(e){return function(){return r.useContext(e)}}t.default=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),o=1;o<t;o++)n[o-1]=arguments[o];var l=[],u=[],c=function(e){var t=r.createContext(i);l.push(t),u.push(s(t))};n.length?n.forEach((function(e){return c(e.name)})):c(e.name);var d=function(t){for(var i=t.children,s=a(t,["children"]),o=e(s),u=i,c=0;c<l.length;c+=1){var d=l[c],p=n[c]||function(e){return e};u=r.createElement(d.Provider,{value:p(o)},u)}return u};return[d].concat(u)}},71:function(e,t,n){"use strict";n.d(t,"c",(function(){return l})),n.d(t,"b",(function(){return u})),n.d(t,"a",(function(){return CanceledPromiseError}));var r=n(6),a=n.n(r),i=n(2),s=n(119),o=n.n(s);const l=({createPromise:e,onResolve:t=c,onReject:n=c,cancelPreviousOn:r="never",triggerOrThrow:a="whenMounted"},s)=>{const l=o()(),u=Object(i.useCallback)((()=>{switch(a){case"always":return!0;case"whenMounted":return l()}}),[l,a]),d=Object(i.useRef)([]),[p,f]=Object(i.useState)({state:"uninitialized"}),m=Object(i.useMemo)((()=>(...a)=>{let i;const s=new Promise(((e,t)=>{i=t})),o=d.current,l=()=>{o.forEach((e=>e.cancel()))},p=e(...a),m=Promise.race([p,s]);f({state:"pending",promise:m}),"creation"===r&&l();const b={cancel:()=>{i(new CanceledPromiseError)},cancelSilently:()=>{i(new SilentCanceledPromiseError)},promise:m.then((e=>(f((t=>"pending"===t.state&&t.promise===m?{state:"resolved",promise:b.promise,value:e}:t)),["settlement","resolution"].includes(r)&&l(),d.current=d.current.filter((e=>e.promise!==b.promise)),t&&u()&&t(e),e)),(e=>{if(e instanceof SilentCanceledPromiseError||f((t=>"pending"===t.state&&t.promise===m?{state:"rejected",promise:m,value:e}:t)),["settlement","rejection"].includes(r)&&l(),d.current=d.current.filter((e=>e.promise!==b.promise)),u())throw n&&n(e),e}))};return d.current=[...d.current,b],b.promise.catch(c),b.promise}),s);return Object(i.useEffect)((()=>()=>{d.current.forEach((e=>e.cancelSilently()))}),[]),[p,m]},u=e=>"rejected"===e.state;class CanceledPromiseError extends Error{constructor(e){super(e),a()(this,"isCanceled",!0),Object.setPrototypeOf(this,new.target.prototype)}}class SilentCanceledPromiseError extends CanceledPromiseError{}const c=()=>{}},86:function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var r=n(2),a=n.n(r),i=n(1),s=n(9),o=n(71);function l(e,t,n,l=(e=>e),u,c){var d;const p=Object(s.useKibana)(),f=u||(null===(d=p.services.http)||void 0===d?void 0:d.fetch),m=c||p.notifications.toasts.danger,[b,g]=Object(r.useState)(null),[y,h]=Object(r.useState)(null),[v,E]=Object(o.c)({cancelPreviousOn:"resolution",createPromise:()=>{if(!f)throw new Error("HTTP service is unavailable");return f(e,{method:t,body:n})},onResolve:e=>g(l(e)),onReject:e=>{var t,n,r,s,l;const u=e;e&&e instanceof o.a||(h(u),m({toastLifeTimeMs:3e3,title:i.i18n.translate("xpack.infra.useHTTPRequest.error.title",{defaultMessage:"Error while fetching resource"}),body:a.a.createElement("div",null,u.response?a.a.createElement(a.a.Fragment,null,a.a.createElement("h5",null,i.i18n.translate("xpack.infra.useHTTPRequest.error.status",{defaultMessage:"Error"})),null===(t=u.response)||void 0===t?void 0:t.statusText," (",null===(n=u.response)||void 0===n?void 0:n.status,")",a.a.createElement("h5",null,i.i18n.translate("xpack.infra.useHTTPRequest.error.url",{defaultMessage:"URL"})),null===(r=u.response)||void 0===r?void 0:r.url,a.a.createElement("h5",null,i.i18n.translate("xpack.infra.useHTTPRequest.error.body.message",{defaultMessage:"Message"})),(null===(s=u.body)||void 0===s?void 0:s.message)||u.message):a.a.createElement("h5",null,(null===(l=u.body)||void 0===l?void 0:l.message)||u.message))}))}},[e,n,t,u,m]),j=Object(r.useMemo)((()=>"resolved"===v.state&&null===b||"pending"===v.state),[v.state,b]);return{response:b,error:y,loading:j,makeRequest:E}}},94:function(e,t,n){"use strict";n.d(t,"a",(function(){return a})),n.d(t,"c",(function(){return s})),n.d(t,"d",(function(){return u})),n.d(t,"b",(function(){return f})),n.d(t,"e",(function(){return E}));var r=n(0);const a=["avg","max","min","cardinality","rate","count","sum","p95","p99"],i=a.reduce(((e,t)=>({...e,[t]:null})),{}),s=r.keyof(i),o=r.type({aggregation:s}),l=r.partial({field:r.union([r.string,r[void 0]])}),u=r.intersection([o,l]),c=r.type({from:r.number,to:r.number,interval:r.string}),d=r.type({timerange:c,indexPattern:r.string,metrics:r.array(u)}),p=r.union([r.string,r.null,r[void 0]]),f=r.record(r.string,r.union([r.string,r.null])),m=r.partial({groupBy:r.union([p,r.array(p)]),afterKey:r.union([r.string,r.null,r[void 0],f]),limit:r.union([r.number,r.null,r[void 0]]),filterQuery:r.union([r.string,r.null,r[void 0]]),forceInterval:r.boolean,dropLastBucket:r.boolean}),b=(r.intersection([d,m]),r.type({total:r.number,afterKey:r.union([r.string,r.null,f])})),g=r.keyof({date:null,number:null,string:null}),y=r.type({name:r.string,type:g}),h=r.intersection([r.type({timestamp:r.number}),r.record(r.string,r.union([r.string,r.number,r.null,r[void 0],r.array(r.object)]))]),v=r.intersection([r.type({id:r.string,columns:r.array(y),rows:r.array(h)}),r.partial({keys:r.array(r.string)})]),E=r.type({series:r.array(v),pageInfo:b})}}]);