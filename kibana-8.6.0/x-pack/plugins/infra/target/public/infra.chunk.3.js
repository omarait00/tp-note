/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.infra_bundle_jsonpfunction=window.infra_bundle_jsonpfunction||[]).push([[3],{103:function(e,t,r){"use strict";r.d(t,"a",(function(){return y})),r.d(t,"d",(function(){return O})),r.d(t,"b",(function(){return j})),r.d(t,"c",(function(){return S}));var n=r(2),a=r.n(n),i=r(15),o=r(1),s=r(55),c=r(70),u=r.n(c),l=r(173),d=r(13),p=r(88);class UnsupportedLanguageError extends Error{constructor(e){super(e),Object.setPrototypeOf(this,new.target.prototype)}}class QueryParsingError extends Error{constructor(e){super(e),Object.setPrototypeOf(this,new.target.prototype)}}const f={language:"kuery",query:""},m={filterQuery:null,queryStringQuery:null,validationError:null},g=o.i18n.translate("xpack.infra.logsPage.toolbar.logFilterErrorToastTitle",{defaultMessage:"Log filter error"}),b=o.i18n.translate("xpack.infra.logsPage.toolbar.logFilterUnsupportedLanguageError",{defaultMessage:"SQL is not supported"}),[y,O]=u()((({dataView:e})=>{const{notifications:{toasts:t},data:{query:{queryString:r}}}=Object(d.b)().services,a=Object(l.a)(),[o,c]=Object(n.useState)(m);Object(n.useEffect)((()=>{var e;o.validationError&&((e=o.validationError)instanceof UnsupportedLanguageError?(t.addError(e,{title:g}),r.setQuery(f)):e instanceof QueryParsingError&&t.addError(e,{title:g}))}),[o.validationError,r,t]);const u=Object(n.useCallback)((t=>Object(s.buildEsQuery)(e,t,[],a)),[e,a]),y=Object(n.useCallback)((e=>t=>{try{if(!Object(s.isOfQueryType)(e))throw new UnsupportedLanguageError(b);try{const t=u(e);return{filterQuery:{parsedQuery:t,serializedQuery:JSON.stringify(t),originalQuery:e},queryStringQuery:e,validationError:null}}catch(e){throw new QueryParsingError(e)}}catch(r){return{...t,queryStringQuery:e,validationError:r}}}),[u]);return Object(p.e)(Object(n.useMemo)((()=>Object(i.merge)(Object(i.of)(void 0),r.getUpdates$())),[r]),Object(n.useMemo)((()=>({next:()=>{c(y(r.getQuery()))}})),[y,r])),Object(n.useEffect)((()=>{e&&c(y(r.getQuery()))}),[e,y,r]),{queryStringQuery:o.queryStringQuery,filterQuery:o.filterQuery,validationError:o.validationError}}));var v=r(0),h=r(92);const j=()=>{const{data:{query:{queryString:e}}}=Object(d.b)().services,{queryStringQuery:t}=O();return a.a.createElement(h.a,{urlState:t,urlStateKey:"logFilter",mapToUrlState:E,onChange:t=>{t&&e.setQuery(t)},onInitialize:t=>{t?e.setQuery(t):e.setQuery(f)}})},E=e=>x.is(e)?{language:e.kind,query:e.expression}:w.is(e)?e:void 0,S=e=>Object(h.d)("logFilter",e),w=v.type({language:v.string,query:v.string}),x=v.type({kind:v.literal("kuery"),expression:v.string})},104:function(e,t,r){"use strict";r.d(t,"b",(function(){return u})),r.d(t,"a",(function(){return l}));var n=r(0),a=r(18),i=r(14),o=r(22),s=r(81);const c="sourceId",u=()=>Object(s.b)({defaultState:"default",decodeUrlState:f,encodeUrlState:p,urlStateKey:c}),l=e=>Object(s.a)(c,e),d=n.union([n.string,n[void 0]]),p=d.encode,f=e=>Object(a.pipe)(d.decode(e),Object(i.fold)(Object(o.constant)(void 0),o.identity))},105:function(e,t,r){"use strict";r.d(t,"c",(function(){return a})),r.d(t,"a",(function(){return i})),r.d(t,"d",(function(){return o})),r.d(t,"b",(function(){return s}));var n=r(92);const a=e=>{const t=Object(n.b)(Object(n.c)(e),"time");return t?parseFloat(t):NaN},i=e=>Object(n.b)(Object(n.c)(e),"filter")||"",o=e=>{const t=Object(n.b)(Object(n.c)(e),"to");return t?parseFloat(t):NaN},s=e=>{const t=Object(n.b)(Object(n.c)(e),"from");return t?parseFloat(t):NaN}},118:function(e,t,r){"use strict";r.d(t,"a",(function(){return O})),r.d(t,"b",(function(){return v}));var n=r(1),a=r(25),i=r(2),o=r.n(i),s=r(51),c=r(89),u=r.n(c),l=r(76),d=r(93),p=r(103),f=r(91),m=r(104),g=r(13),b=r(74),y=r(105);const O=({match:{params:{nodeId:e,nodeType:t,sourceId:r="default"}},location:i})=>{const{services:c}=Object(g.b)(),{isLoading:O,load:v}=Object(b.b)({fetch:c.http.fetch,logViewId:r,logViews:c.logViews.client});if(u()((()=>{v()})),O)return o.a.createElement(d.a,{"data-test-subj":`nodeLoadingPage-${t}`,message:n.i18n.translate("xpack.infra.redirectToNodeLogs.loadingNodeLogsMessage",{defaultMessage:"Loading {nodeType} logs",values:{nodeType:t}})});const h=`${Object(l.a)(t).id}: ${e}`,j=Object(y.a)(i),E=j?`(${h}) and (${j})`:h,S=Object(a.flowRight)(Object(p.c)({language:"kuery",query:E}),Object(f.b)(Object(y.c)(i)),Object(m.a)(r))("");return o.a.createElement(s.Redirect,{to:`/stream?${S}`})},v=({nodeId:e,nodeType:t,time:r})=>({app:"logs",pathname:`link-to/${t}-logs/${e}`,search:r?{time:`${r}`}:void 0})},128:function(e,t,r){"use strict";r(172),r(210);var n=r(118);r.d(t,"b",(function(){return n.b}));var a=r(137);r.d(t,"a",(function(){return a.b}))},129:function(e,t,r){"use strict";r.d(t,"a",(function(){return L}));var n=r(2),a=r(14),i=r(22),o=r(18),s=r(70),c=r.n(s),u=r(0),l=r(25);r(29),r(138);var d=function(e){return""===e},p=u.brand(u.string,(function(e){return!d(t=e)&&!t.includes(" ")&&!t.split(",").some(d);var t}),"IndexPattern");new u.Type("JSON",u.any.is,(function(e,t){return a.either.chain(u.string.validate(e,t),(function(r){try{return u.success(JSON.parse(r))}catch(r){return u.failure(e,t)}}))}),(function(e){return JSON.stringify(e)})),new u.Type("isoToEpochRt",u.number.is,(function(e,t){return a.either.chain(u.string.validate(e,t),(function(r){var n=new Date(r).getTime();return isNaN(n)?u.failure(e,t):u.success(n)}))}),(function(e){return new Date(e).toISOString()})),new u.Type("ToNumber",u.number.is,(function(e,t){var r=Number(e);return isNaN(r)?u.failure(e,t):u.success(r)}),u.identity),new u.Type("ToBoolean",u.boolean.is,(function(e){var t;return t="string"==typeof e?"true"===e:!!e,u.success(t)}),u.identity),u.brand(u.string,(function(e){return e.length>0}),"NonEmptyString");var f=r(49),m=r.n(f);const g=new u.Type("TimestampFromString",(e=>"number"==typeof e),((e,t)=>Object(o.pipe)(u.string.validate(e,t),Object(a.chain)((e=>{const r=m()(e);return r.isValid()?u.success(r.valueOf()):u.failure(e,t)})))),(e=>new Date(e).toISOString())),b=(u.type({sources:u.type({default:u.partial({fields:u.partial({message:u.array(u.string)})})})}),u.type({timestampColumn:u.type({id:u.string})})),y=u.type({messageColumn:u.type({id:u.string})}),O=u.type({fieldColumn:u.type({id:u.string,field:u.string})}),v=u.union([b,y,O]),h=u.type({type:u.literal("index_pattern"),indexPatternId:u.string}),j=u.type({type:u.literal("index_name"),indexName:u.string}),E=u.union([h,j]),S=u.type({message:u.array(u.string)}),w=u.type({name:u.string,description:u.string,metricAlias:u.string,logIndices:E,inventoryDefaultView:u.string,metricsExplorerDefaultView:u.string,fields:S,logColumns:u.array(v),anomalyThreshold:u.number}),x=u.partial(Object(l.omit)(S.props,["message"])),T=u.intersection([u.partial(Object(l.omit)(w.props,["fields"])),u.partial({fields:x})]),I=u.partial(S.props),R=(u.partial({...w.props,fields:I}),u.type({...w.props,fields:S,logColumns:u.array(v)})),k=u.type({name:u.string,type:u.string,searchable:u.boolean,aggregatable:u.boolean,displayable:u.boolean}),P=u.type({logIndicesExist:u.boolean,metricIndicesExist:u.boolean,indexFields:u.array(k)}),$=u.intersection([u.type({id:u.string,origin:u.keyof({fallback:null,internal:null,stored:null}),configuration:R}),u.partial({version:u.string,updatedAt:u.number,status:P})]),N=(u.type({source:$}),u.intersection([u.type({id:u.string,attributes:T}),u.partial({version:u.string,updated_at:g})]),u.strict({name:w.props.name,description:w.props.description,metricAlias:w.props.metricAlias,inventoryDefaultView:w.props.inventoryDefaultView,metricsExplorerDefaultView:w.props.metricsExplorerDefaultView,anomalyThreshold:u.number})),M=(u.partial({...N.type.props,metricAlias:p}),u.partial({...N.type.props}),u.keyof({fallback:null,internal:null,stored:null})),Q=u.strict({metricIndicesExist:P.props.metricIndicesExist,indexFields:P.props.indexFields}),F=u.exact(u.intersection([u.type({id:u.string,origin:M,configuration:N}),u.partial({updatedAt:u.number,version:u.string,status:Q})])),q=u.type({source:F});var C=r(86),A=r(21);const L=({sourceId:e="default",fetch:t,toastWarning:r})=>{const{error:s,loading:c,response:u,makeRequest:l}=Object(C.a)(`/api/metrics/source/${e}`,"GET",null,(e=>Object(o.pipe)(q.decode(e),Object(a.fold)(Object(A.c)(A.a),i.identity))),t,r);return Object(n.useEffect)((()=>{(async()=>{await l()})()}),[l]),{createDerivedIndexPattern:Object(n.useCallback)((()=>{return{fields:null!=u&&u.source.status?u.source.status.indexFields:[],title:(e=null==u?void 0:u.source,t="metrics",e?"metrics"===t?e.configuration.metricAlias:`${e.configuration.metricAlias}`:"unknown-index")};var e,t}),[u]),source:Object(n.useMemo)((()=>u?u.source:null),[u]),loading:c,error:s}},D=c()(L),[U,H]=D},137:function(e,t,r){"use strict";r.d(t,"a",(function(){return c})),r.d(t,"b",(function(){return u}));var n=r(2),a=r.n(n),i=r(51),o=r(155),s=r(105);const c=({match:{params:{nodeId:e,nodeType:t}},location:r})=>{const n=Object(o.b)(Object(s.b)(r),Object(s.d)(r))("");return a.a.createElement(i.Redirect,{to:`/detail/${t}/${e}?${n}`})},u=({nodeType:e,nodeId:t,to:r,from:n})=>({app:"metrics",pathname:`link-to/${e}-detail/${t}`,search:r&&n?{to:`${r}`,from:`${n}`}:void 0})},138:function(e,t,r){e.exports=r(26)(22)},154:function(e,t,r){"use strict";r.d(t,"a",(function(){return i})),r.d(t,"b",(function(){return o}));var n=r(12),a=r(20);const i=a.euiStyled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  width: 100%
`,o=a.euiStyled.div`
  flex: 1 0 0%;
  display: flex;
  flex-direction: row;
  background-color: ${e=>e.theme.eui.euiColorEmptyShade};
`;Object(a.euiStyled)(n.EuiPage)`
  align-self: stretch;
  flex: 1 0 0%;
`},155:function(e,t,r){"use strict";r.d(t,"b",(function(){return S})),r.d(t,"a",(function(){return x})),r.d(t,"c",(function(){return T}));var n=r(70),a=r.n(n),i=r(2),o=r(49),s=r.n(o),c=r(10),u=r.n(c),l=r(0),d=r(18),p=r(14),f=r(22),m=r(81),g=r(92);const b=e=>{const t=u.a.parse(e.from.toString()),r=u.a.parse(e.to.toString(),{roundUp:!0});return{...e,from:t&&t.valueOf()||s()().subtract(1,"hour").valueOf(),to:r&&r.valueOf()||s()().valueOf()}},y={from:"now-1h",to:"now",interval:">=1m"},O={time:y,autoReload:!1,refreshInterval:5e3},v=l.type({from:l.union([l.string,l.number]),to:l.union([l.string,l.number]),interval:l.string}),h=l.partial({time:v,autoReload:l.boolean,refreshInterval:l.number}),j=h.encode,E=e=>Object(d.pipe)(h.decode(e),Object(p.fold)(Object(f.constant)(void 0),f.identity)),S=(e,t)=>Number.isNaN(e)||Number.isNaN(t)?e=>e:Object(g.d)("metricTime",{autoReload:!1,time:{interval:">=1m",from:s()(e).toISOString(),to:s()(t).toISOString()}}),w=a()((()=>{const[e,t]=Object(m.b)({defaultState:O,decodeUrlState:E,encodeUrlState:j,urlStateKey:"metricTime"}),[r,n]=Object(i.useState)(e.autoReload||!1),[a,o]=Object(i.useState)(e.refreshInterval||5e3),[c,u]=Object(i.useState)(s()().valueOf()),[l,d]=Object(i.useState)(e.time||y);Object(i.useEffect)((()=>t({time:l,autoReload:r,refreshInterval:a})),[r,a,t,l]);const[p,f]=Object(i.useState)(b(e.time||y)),g=Object(i.useCallback)((e=>{d(e),f(b(e))}),[]);return{timeRange:l,setTimeRange:g,parsedTimeRange:p,refreshInterval:a,setRefreshInterval:o,isAutoReloading:r,setAutoReload:n,lastRefresh:c,triggerRefresh:Object(i.useCallback)((()=>u(s()().valueOf())),[u])}})),[x,T]=w},172:function(e,t,r){"use strict";r.d(t,"a",(function(){return m}));var n=r(2),a=r.n(n),i=r(51),o=r(25),s=r(103),c=r(91),u=r(104),l=r(105);const d=({location:e,match:t})=>{const r=t.params.sourceId||"default",n=Object(l.a)(e),d=Object(o.flowRight)(Object(s.c)({language:"kuery",query:n}),Object(c.b)(Object(l.c)(e)),Object(u.a)(r))("");return a.a.createElement(i.Redirect,{to:`/stream?${d}`})};var p=r(118);const f=r(76).d.map((e=>e.id)).join("|"),m=e=>a.a.createElement(i.Switch,null,a.a.createElement(i.Route,{path:`${e.match.url}/:sourceId?/:nodeType(${f})-logs/:nodeId`,component:p.a}),a.a.createElement(i.Route,{path:`${e.match.url}/:sourceId?/logs`,component:d}),a.a.createElement(i.Route,{path:`${e.match.url}/:sourceId?`,component:d}),a.a.createElement(i.Redirect,{to:"/"}))},210:function(e,t,r){"use strict";r.d(t,"a",(function(){return O}));var n=r(2),a=r.n(n),i=r(51),o=r(137),s=r(1),c=r(155),u=r(9),l=r(105),d=r(93),p=r(267),f=r(129);const m=({match:{params:{hostIp:e}},location:t})=>{const{source:r}=Object(f.a)({sourceId:"default"}),{error:o,name:m}=((e,t)=>{var r;const a=null===(r=Object(u.useKibana)().services.http)||void 0===r?void 0:r.fetch,[i,o]=Object(n.useState)(null),[s,c]=Object(n.useState)(!0),[l,d]=Object(n.useState)(null);return Object(n.useEffect)((()=>{(async()=>{c(!0),o(null);try{if(!a)throw new Error("HTTP service is unavailable");if(e&&t){const r=await a("/api/infra/ip_to_host",{method:"POST",body:JSON.stringify({ip:e,index_pattern:t})});c(!1),d(r)}}catch(e){c(!1),o(e)}})()}),[e,t,a]),{name:l&&l.host||null,loading:s,error:i}})(e,r&&r.configuration&&r.configuration.metricAlias||null);if(o)return a.a.createElement(p.a,{message:s.i18n.translate("xpack.infra.linkTo.hostWithIp.error",{defaultMessage:'Host not found with IP address "{hostIp}".',values:{hostIp:e}})});const g=Object(c.b)(Object(l.b)(t),Object(l.d)(t))("");return m?a.a.createElement(i.Redirect,{to:`/detail/host/${m}?${g}`}):a.a.createElement(d.a,{message:s.i18n.translate("xpack.infra.linkTo.hostWithIp.loading",{defaultMessage:'Loading host with IP address "{hostIp}".',values:{hostIp:e}})})};var g=r(34);const b=({location:e})=>{const t=function(e){if(0===e.length)return{};const t=Object(g.parse)(e.substring(1));for(const e in t)Object.hasOwnProperty.call(t,e)&&(t[e]||delete t[e],Array.isArray(t.key)&&(t[e]=t[e][0]));return t}(e.search),r="?waffleFilter=(expression:'',kind:kuery)&waffleTime=(currentTime:{timestamp},isAutoReloading:!f)&waffleOptions=(accountId:'',autoBounds:!t,boundsOverride:(max:1,min:0),customMetrics:!({customMetric}),customOptions:!(),groupBy:!(),legend:(palette:cool,reverseColors:!f,steps:10),metric:{metric},nodeType:{nodeType},region:'',sort:(by:name,direction:desc),timelineOpen:!f,view:map)".replace(/{(\w+)}/g,((e,r)=>t[r]||""));return a.a.createElement(i.Redirect,{to:"/inventory"+r})},y=r(76).d.map((e=>e.id)).join("|"),O=e=>a.a.createElement(i.Switch,null,a.a.createElement(i.Route,{path:`${e.match.url}/:nodeType(${y})-detail/:nodeId`,component:o.a}),a.a.createElement(i.Route,{path:`${e.match.url}/host-detail-via-ip/:hostIp`,component:m}),a.a.createElement(i.Route,{path:`${e.match.url}/inventory`,component:b}),a.a.createElement(i.Redirect,{to:"/"}))},267:function(e,t,r){"use strict";r.d(t,"a",(function(){return l})),r.d(t,"b",(function(){return d}));var n=r(12),a=r(19),i=r(2),o=r.n(i),s=r(20),c=r(154);const u=Object(s.euiStyled)(c.b)`
  overflow: auto;
  background-color: ${e=>e.theme.eui.euiColorLightestShade};
`,l=({message:e})=>o.a.createElement(c.a,null,o.a.createElement(u,null,o.a.createElement(d,{message:e}))),d=({message:e})=>o.a.createElement(n.EuiPage,{style:{flex:"1 0 auto"}},o.a.createElement(n.EuiPageBody,null,o.a.createElement(n.EuiPageHeader,null,o.a.createElement(n.EuiPageHeaderSection,null,o.a.createElement(n.EuiTitle,{size:"m"},o.a.createElement("h1",null,o.a.createElement(a.FormattedMessage,{id:"xpack.infra.errorPage.unexpectedErrorTitle",defaultMessage:"Oops!"}))))),o.a.createElement(n.EuiPageContent_Deprecated,null,o.a.createElement(n.EuiCallOut,{color:"danger",title:e,iconType:"alert"},o.a.createElement("p",null,o.a.createElement(a.FormattedMessage,{id:"xpack.infra.errorPage.tryAgainDescription ",defaultMessage:"Please click the back button and try again."}))))))},73:function(e,t,r){"use strict";r.d(t,"a",(function(){return l})),r.d(t,"b",(function(){return d}));var n=r(70),a=r.n(n),i=r(2),o=r(9),s=r(71);const c=(e,t)=>e?"metrics"===t?e.configuration.metricAlias:`${e.configuration.metricAlias}`:"unknown-index",u="Failed to load source: No fetch client available.",[l,d]=a()((({sourceId:e})=>{var t;const r=null===(t=Object(o.useKibana)().services.http)||void 0===t?void 0:t.fetch,n=`/api/metrics/source/${e}`,[a,l]=Object(i.useState)(void 0),[d,p]=Object(s.c)({cancelPreviousOn:"resolution",createPromise:async()=>{if(!r)throw new Error(u);return await r(`${n}`,{method:"GET"})},onResolve:e=>{l(e.source)}},[r,e]),[f,m]=Object(s.c)({createPromise:async e=>{if(!r)throw new Error(u);return await r(n,{method:"PATCH",body:JSON.stringify(e)})},onResolve:e=>{e&&l(e.source)}},[r,e]),[g,b]=Object(s.c)({createPromise:async e=>{if(!r)throw new Error(u);return await r(n,{method:"PATCH",body:JSON.stringify(e)})},onResolve:e=>{e&&l(e.source)}},[r,e]),y=Object(i.useMemo)((()=>[d.state,f.state,g.state].some((e=>"pending"===e))),[d.state,f.state,g.state]),O=Object(i.useMemo)((()=>"uninitialized"===d.state),[d.state]),v=Object(i.useMemo)((()=>a?!!a.version:void 0),[a]),h=Object(i.useMemo)((()=>a&&a.status&&a.status.metricIndicesExist),[a]);return Object(i.useEffect)((()=>{p()}),[p,e]),{createSourceConfiguration:m,createDerivedIndexPattern:()=>({fields:null!=a&&a.status?a.status.indexFields:[],title:c(a,"metrics")}),isLoading:y,isLoadingSource:"pending"===d.state,isUninitialized:O,hasFailedLoadingSource:"rejected"===d.state,loadSource:p,loadSourceRequest:d,loadSourceFailureMessage:"rejected"===d.state?`${d.value}`:void 0,metricIndicesExist:h,source:a,sourceExists:v,sourceId:e,updateSourceConfiguration:b,version:a&&a.version?a.version:void 0}}))},86:function(e,t,r){"use strict";r.d(t,"a",(function(){return c}));var n=r(2),a=r.n(n),i=r(1),o=r(9),s=r(71);function c(e,t,r,c=(e=>e),u,l){var d;const p=Object(o.useKibana)(),f=u||(null===(d=p.services.http)||void 0===d?void 0:d.fetch),m=l||p.notifications.toasts.danger,[g,b]=Object(n.useState)(null),[y,O]=Object(n.useState)(null),[v,h]=Object(s.c)({cancelPreviousOn:"resolution",createPromise:()=>{if(!f)throw new Error("HTTP service is unavailable");return f(e,{method:t,body:r})},onResolve:e=>b(c(e)),onReject:e=>{var t,r,n,o,c;const u=e;e&&e instanceof s.a||(O(u),m({toastLifeTimeMs:3e3,title:i.i18n.translate("xpack.infra.useHTTPRequest.error.title",{defaultMessage:"Error while fetching resource"}),body:a.a.createElement("div",null,u.response?a.a.createElement(a.a.Fragment,null,a.a.createElement("h5",null,i.i18n.translate("xpack.infra.useHTTPRequest.error.status",{defaultMessage:"Error"})),null===(t=u.response)||void 0===t?void 0:t.statusText," (",null===(r=u.response)||void 0===r?void 0:r.status,")",a.a.createElement("h5",null,i.i18n.translate("xpack.infra.useHTTPRequest.error.url",{defaultMessage:"URL"})),null===(n=u.response)||void 0===n?void 0:n.url,a.a.createElement("h5",null,i.i18n.translate("xpack.infra.useHTTPRequest.error.body.message",{defaultMessage:"Message"})),(null===(o=u.body)||void 0===o?void 0:o.message)||u.message):a.a.createElement("h5",null,(null===(c=u.body)||void 0===c?void 0:c.message)||u.message))}))}},[e,r,t,u,m]),j=Object(n.useMemo)((()=>"resolved"===v.state&&null===g||"pending"===v.state),[v.state,g]);return{response:g,error:y,loading:j,makeRequest:h}}},93:function(e,t,r){"use strict";r.d(t,"a",(function(){return s})),r.d(t,"b",(function(){return c}));var n=r(12),a=r(2),i=r.n(a),o=r(133);const s=({message:e,"data-test-subj":t="loadingPage"})=>i.a.createElement(o.a,{isEmptyState:!0,"data-test-subj":t},i.a.createElement(c,{message:e})),c=({message:e})=>i.a.createElement(n.EuiEmptyPrompt,{body:i.a.createElement(n.EuiFlexGroup,{alignItems:"center",gutterSize:"none"},i.a.createElement(n.EuiFlexItem,{grow:!1},i.a.createElement(n.EuiLoadingSpinner,{size:"xl",style:{marginRight:"8px"}})),i.a.createElement(n.EuiFlexItem,null,e))})}}]);