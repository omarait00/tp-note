/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.infra_bundle_jsonpfunction=window.infra_bundle_jsonpfunction||[]).push([[13],{114:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var s=a(1);const r=e=>{const t={avg:s.i18n.translate("xpack.infra.waffle.aggregationNames.avg",{defaultMessage:"Avg of {field}",values:{field:e.field}}),max:s.i18n.translate("xpack.infra.waffle.aggregationNames.max",{defaultMessage:"Max of {field}",values:{field:e.field}}),min:s.i18n.translate("xpack.infra.waffle.aggregationNames.min",{defaultMessage:"Min of {field}",values:{field:e.field}}),rate:s.i18n.translate("xpack.infra.waffle.aggregationNames.rate",{defaultMessage:"Rate of {field}",values:{field:e.field}})};return e.label?e.label:t[e.aggregation]}},120:function(e,t,a){"use strict";a.d(t,"a",(function(){return p}));var s=a(0),r=a(78),n=a(94);const l=s.type({from:s.number,to:s.number,interval:s.string}),i=s.union([s.string,s.null,s[void 0]]),o=s.type({id:s.string,aggregations:r.d}),c=(s.intersection([s.type({timerange:l,indexPattern:s.string,metrics:s.array(o)}),s.partial({groupBy:s.array(i),modules:s.array(s.string),afterKey:s.union([s.null,n.b]),limit:s.union([s.number,s.null,s[void 0]]),filters:s.array(s.object),dropPartialBuckets:s.boolean,alignDataToEnd:s.boolean})]),s.type({afterKey:s.union([s.null,n.b,s[void 0]]),interval:s.number})),u=s.keyof({date:null,number:null,string:null}),d=s.type({name:s.string,type:u}),m=s.intersection([s.type({timestamp:s.number}),s.record(s.string,s.union([s.string,s.number,s.null,s[void 0],s.array(s.object)]))]),p=s.intersection([s.type({id:s.string,columns:s.array(d),rows:s.array(m)}),s.partial({keys:s.array(s.string)})]);s.type({series:s.array(s.intersection([p,s.partial({metricsets:s.array(s.string)})])),info:c})},126:function(e,t,a){"use strict";a.d(t,"a",(function(){return u}));var s=a(14),r=a(22),n=a(18),l=a(2),i=a(21),o=a(86),c=a(77);function u(e,t,a,u,d,m,p,f,g=!0,b){b=b||{interval:"1m",to:m,from:m-12e5,lookbackSize:5};const{error:y,loading:v,response:x,makeRequest:E}=Object(o.a)("/api/metrics/snapshot","POST",JSON.stringify({metrics:t,groupBy:a,nodeType:u,timerange:b,filterQuery:e,sourceId:d,accountId:p,region:f,includeTimeseries:!0}),(e=>Object(n.pipe)(c.g.decode(e),Object(s.fold)(Object(i.c)(i.a),r.identity))));return Object(l.useEffect)((()=>{(async()=>{g&&await E()})()}),[E,g]),{error:y&&y.message||null,loading:v,nodes:x?x.nodes:[],interval:x?x.interval:"60s",reload:E}}},127:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));var s=a(25),r=a(31),n=a(77),l=a(124),i=a(33);const o={count:{formatter:r.b.number,template:"{{value}}"},cpu:{formatter:r.b.percent,template:"{{value}}"},cpuCores:{formatter:r.b.number,template:"{{value}}"},memory:{formatter:r.b.percent,template:"{{value}}"},memoryTotal:{formatter:r.b.bytes,template:"{{value}}"},diskLatency:{formatter:r.b.number,template:"{{value}} ms"},rx:{formatter:r.b.bits,template:"{{value}}/s"},tx:{formatter:r.b.bits,template:"{{value}}/s"},logRate:{formatter:r.b.abbreviatedNumber,template:"{{value}}/s"},diskIOReadBytes:{formatter:r.b.bytes,template:"{{value}}/s"},diskIOWriteBytes:{formatter:r.b.bytes,template:"{{value}}/s"},s3BucketSize:{formatter:r.b.bytes,template:"{{value}}"},s3TotalRequests:{formatter:r.b.abbreviatedNumber,template:"{{value}}"},s3NumberOfObjects:{formatter:r.b.abbreviatedNumber,template:"{{value}}"},s3UploadBytes:{formatter:r.b.bytes,template:"{{value}}"},s3DownloadBytes:{formatter:r.b.bytes,template:"{{value}}"},sqsOldestMessage:{formatter:r.b.number,template:"{{value}} seconds"},rdsLatency:{formatter:r.b.number,template:"{{value}} ms"}},c=e=>t=>{if(n.d.is(e))return Object(l.a)(e)(t);const a=Object(s.get)(o,e.type,o.count);return null==t?"":Object(i.b)(a.formatter,a.template)(t)}},139:function(e,t,a){"use strict";a.d(t,"a",(function(){return i}));var s=a(1),r=a(25);const n={CPUUsage:s.i18n.translate("xpack.infra.waffle.metricOptions.cpuUsageText",{defaultMessage:"CPU usage"}),MemoryUsage:s.i18n.translate("xpack.infra.waffle.metricOptions.memoryUsageText",{defaultMessage:"memory usage"}),InboundTraffic:s.i18n.translate("xpack.infra.waffle.metricOptions.inboundTrafficText",{defaultMessage:"inbound traffic"}),OutboundTraffic:s.i18n.translate("xpack.infra.waffle.metricOptions.outboundTrafficText",{defaultMessage:"outbound traffic"}),LogRate:s.i18n.translate("xpack.infra.waffle.metricOptions.hostLogRateText",{defaultMessage:"log rate"}),Load:s.i18n.translate("xpack.infra.waffle.metricOptions.loadText",{defaultMessage:"load"}),Count:s.i18n.translate("xpack.infra.waffle.metricOptions.countText",{defaultMessage:"count"}),DiskIOReadBytes:s.i18n.translate("xpack.infra.waffle.metricOptions.diskIOReadBytes",{defaultMessage:"disk reads"}),DiskIOWriteBytes:s.i18n.translate("xpack.infra.waffle.metricOptions.diskIOWriteBytes",{defaultMessage:"disk writes"}),s3BucketSize:s.i18n.translate("xpack.infra.waffle.metricOptions.s3BucketSize",{defaultMessage:"bucket size"}),s3TotalRequests:s.i18n.translate("xpack.infra.waffle.metricOptions.s3TotalRequests",{defaultMessage:"total requests"}),s3NumberOfObjects:s.i18n.translate("xpack.infra.waffle.metricOptions.s3NumberOfObjects",{defaultMessage:"number of objects"}),s3DownloadBytes:s.i18n.translate("xpack.infra.waffle.metricOptions.s3DownloadBytes",{defaultMessage:"downloads (bytes)"}),s3UploadBytes:s.i18n.translate("xpack.infra.waffle.metricOptions.s3UploadBytes",{defaultMessage:"uploads (bytes)"}),rdsConnections:s.i18n.translate("xpack.infra.waffle.metricOptions.rdsConnections",{defaultMessage:"connections"}),rdsQueriesExecuted:s.i18n.translate("xpack.infra.waffle.metricOptions.rdsQueriesExecuted",{defaultMessage:"queries executed"}),rdsActiveTransactions:s.i18n.translate("xpack.infra.waffle.metricOptions.rdsActiveTransactions",{defaultMessage:"active transactions"}),rdsLatency:s.i18n.translate("xpack.infra.waffle.metricOptions.rdsLatency",{defaultMessage:"latency"}),sqsMessagesVisible:s.i18n.translate("xpack.infra.waffle.metricOptions.sqsMessagesVisible",{defaultMessage:"messages available"}),sqsMessagesDelayed:s.i18n.translate("xpack.infra.waffle.metricOptions.sqsMessagesDelayed",{defaultMessage:"messages delayed"}),sqsMessagesSent:s.i18n.translate("xpack.infra.waffle.metricOptions.sqsMessagesSent",{defaultMessage:"messages added"}),sqsMessagesEmpty:s.i18n.translate("xpack.infra.waffle.metricOptions.sqsMessagesEmpty",{defaultMessage:"messages returned empty"}),sqsOldestMessage:s.i18n.translate("xpack.infra.waffle.metricOptions.sqsOldestMessage",{defaultMessage:"oldest message"})},l=Object(r.mapValues)(n,(e=>`${e[0].toUpperCase()}${e.slice(1)}`)),i=e=>{switch(e){case"cpu":return{text:l.CPUUsage,textLC:n.CPUUsage,value:"cpu"};case"memory":return{text:l.MemoryUsage,textLC:n.MemoryUsage,value:"memory"};case"rx":return{text:l.InboundTraffic,textLC:n.InboundTraffic,value:"rx"};case"tx":return{text:l.OutboundTraffic,textLC:n.OutboundTraffic,value:"tx"};case"logRate":return{text:l.LogRate,textLC:n.LogRate,value:"logRate"};case"load":return{text:l.Load,textLC:n.Load,value:"load"};case"count":return{text:l.Count,textLC:n.Count,value:"count"};case"diskIOReadBytes":return{text:l.DiskIOReadBytes,textLC:n.DiskIOReadBytes,value:"diskIOReadBytes"};case"diskIOWriteBytes":return{text:l.DiskIOWriteBytes,textLC:n.DiskIOWriteBytes,value:"diskIOWriteBytes"};case"s3BucketSize":return{text:l.s3BucketSize,textLC:n.s3BucketSize,value:"s3BucketSize"};case"s3TotalRequests":return{text:l.s3TotalRequests,textLC:n.s3TotalRequests,value:"s3TotalRequests"};case"s3NumberOfObjects":return{text:l.s3NumberOfObjects,textLC:n.s3NumberOfObjects,value:"s3NumberOfObjects"};case"s3DownloadBytes":return{text:l.s3DownloadBytes,textLC:n.s3DownloadBytes,value:"s3DownloadBytes"};case"s3UploadBytes":return{text:l.s3UploadBytes,textLC:n.s3UploadBytes,value:"s3UploadBytes"};case"rdsConnections":return{text:l.rdsConnections,textLC:n.rdsConnections,value:"rdsConnections"};case"rdsQueriesExecuted":return{text:l.rdsQueriesExecuted,textLC:n.rdsQueriesExecuted,value:"rdsQueriesExecuted"};case"rdsActiveTransactions":return{text:l.rdsActiveTransactions,textLC:n.rdsActiveTransactions,value:"rdsActiveTransactions"};case"rdsLatency":return{text:l.rdsLatency,textLC:n.rdsLatency,value:"rdsLatency"};case"sqsMessagesVisible":return{text:l.sqsMessagesVisible,textLC:n.sqsMessagesVisible,value:"sqsMessagesVisible"};case"sqsMessagesDelayed":return{text:l.sqsMessagesDelayed,textLC:n.sqsMessagesDelayed,value:"sqsMessagesDelayed"};case"sqsMessagesSent":return{text:l.sqsMessagesSent,textLC:n.sqsMessagesSent,value:"sqsMessagesSent"};case"sqsMessagesEmpty":return{text:l.sqsMessagesEmpty,textLC:n.sqsMessagesEmpty,value:"sqsMessagesEmpty"};case"sqsOldestMessage":return{text:l.sqsOldestMessage,textLC:n.sqsOldestMessage,value:"sqsOldestMessage"}}}},482:function(e,t,a){"use strict";a.r(t),a.d(t,"defaultExpression",(function(){return J})),a.d(t,"Expressions",(function(){return X})),a.d(t,"ExpressionRow",(function(){return ae})),a.d(t,"nodeTypes",(function(){return ne}));var s=a(12),r=a(1),n=a(19),l=a(20),i=a(61),o=a(25),c=a(2),u=a.n(c),d=a(7),m=a(77),p=a(76),f=a(176),g=a(178),b=a(177),y=a(179),v=a(180),x=a(174),E=a(175),O=a(78),k=a(139),h=a(129),w=a(13),C=a(157),M=a(113),T=a(52),S=a(49),j=a.n(S),B=a(82),I=a(126),L=a(80),F=a(127),R=a(123),q=a(156),D=a(125),z=a(84),U=a(158),P=a(273);const N=({expression:e,filterQuery:t,nodeType:a,sourceId:r})=>{var l,i,d,m,p;const f=Object(c.useMemo)((()=>({interval:`${e.timeSize||1}${e.timeUnit}`,from:j()().subtract(20*(e.timeSize||1),e.timeUnit).valueOf(),to:j()().valueOf(),forceInterval:!0,ignoreLookback:!0})),[e.timeSize,e.timeUnit]),g=e=>({...e,type:"custom"}),b=Object(L.d)(),{loading:y,nodes:v}=Object(I.a)(t,"custom"===e.metric?[g(e.customMetric)]:[{type:e.metric}],[],a,r,0,b.accountId,b.region,!0,f),{uiSettings:x}=Object(w.b)().services,E={field:e.metric,aggregation:"avg",color:B.a.color0},O=(null==x?void 0:x.get("theme:darkMode"))||!1,k=Object(c.useMemo)((()=>{var e,t,a,s;const r=null===(e=v[0])||void 0===e||null===(t=e.metrics[0])||void 0===t?void 0:t.timeseries,n=null===(a=Object(o.first)(null==r?void 0:r.rows))||void 0===a?void 0:a.timestamp,l=null===(s=Object(o.last)(null==r?void 0:r.rows))||void 0===s?void 0:s.timestamp;return null==n||null==l?e=>`${e}`:Object(T.niceTimeFormatter)([n,l])}),[v]),h=Object(c.useCallback)(Object(F.a)("custom"===e.metric?g(e.customMetric):{type:e.metric}),[e.metric]);if(y||!v)return u.a.createElement(U.c,null);const C=t=>_(e.metric,t),M=e.threshold.map(C),S=null!==(l=null===(i=e.warningThreshold)||void 0===i?void 0:i.map(C))&&void 0!==l?l:[],N=M.slice().sort(),W=S.slice().sort(),Q=[...N,...W].sort(),A=null===(d=v[0])||void 0===d||null===(m=d.metrics[0])||void 0===m?void 0:m.timeseries;if(!A||!A.rows||0===A.rows.length)return u.a.createElement(U.e,null);const K={...A,id:null===(p=v[0])||void 0===p?void 0:p.name,rows:A.rows.map((e=>{const t={...e};return Q.forEach(((e,a)=>{t[Object(q.a)(E,`threshold_${a}`)]=e})),t}))},G=Object(o.first)(A.rows).timestamp,V=Object(o.last)(A.rows).timestamp,$=Object(R.a)(K,[E],!1),H={max:1.1*Math.max($.max,Object(o.last)(Q)||$.max),min:.9*Math.min($.min,Object(o.first)(Q)||$.min)};H.min===Object(o.first)(M)&&(H.min=.9*H.min);const{timeSize:J,timeUnit:X}=e,Y=U.f[X];return u.a.createElement(u.a.Fragment,null,u.a.createElement(U.a,null,u.a.createElement(T.Chart,null,u.a.createElement(D.a,{type:z.b.bar,metric:E,id:"0",series:K,stack:!1}),u.a.createElement(P.a,{comparator:e.comparator,threshold:M,sortedThresholds:N,color:B.a.color1,id:"critical",firstTimestamp:G,lastTimestamp:V,domain:H}),e.warningComparator&&e.warningThreshold&&u.a.createElement(P.a,{comparator:e.warningComparator,threshold:S,sortedThresholds:W,color:B.a.color5,id:"warning",firstTimestamp:G,lastTimestamp:V,domain:H}),u.a.createElement(T.Axis,{id:"timestamp",position:T.Position.Bottom,showOverlappingTicks:!0,tickFormat:k}),u.a.createElement(T.Axis,{id:"values",position:T.Position.Left,tickFormat:h,domain:H}),u.a.createElement(T.Settings,{tooltip:U.i,theme:Object(U.g)(O)}))),u.a.createElement("div",{style:{textAlign:"center"}},"ALL"!==K.id?u.a.createElement(s.EuiText,{size:"xs",color:"subdued"},u.a.createElement(n.FormattedMessage,{id:"xpack.infra.metrics.alerts.dataTimeRangeLabelWithGrouping",defaultMessage:"Last {lookback} {timeLabel} of data for {id}",values:{id:K.id,timeLabel:Y,lookback:20*J}})):u.a.createElement(s.EuiText,{size:"xs",color:"subdued"},u.a.createElement(n.FormattedMessage,{id:"xpack.infra.metrics.alerts.dataTimeRangeLabel",defaultMessage:"Last {lookback} {timeLabel}",values:{timeLabel:Y,lookback:20*J}}))))},_=(e,t)=>W[e]?W[e](t):t,W={cpu:e=>Number(e)/100,memory:e=>Number(e)/100};var Q=a(114);const A={avg:r.i18n.translate("xpack.infra.waffle.customMetrics.aggregationLables.avg",{defaultMessage:"Average"}),max:r.i18n.translate("xpack.infra.waffle.customMetrics.aggregationLables.max",{defaultMessage:"Max"}),min:r.i18n.translate("xpack.infra.waffle.customMetrics.aggregationLables.min",{defaultMessage:"Min"}),rate:r.i18n.translate("xpack.infra.waffle.customMetrics.aggregationLables.rate",{defaultMessage:"Rate"})},K=m.b.map((e=>({text:A[e],value:e}))),G=({metric:e,metrics:t,customMetric:a,fields:l,errors:i,onChange:d,onChangeCustom:p,popupPosition:f})=>{var g;const[b,y]=Object(c.useState)(!1),[v,x]=Object(c.useState)("custom"===(null==e?void 0:e.value)),[E,O]=Object(c.useState)(null==e?void 0:e.value),[k,h]=Object(c.useState)(null==a?void 0:a.label),w={text:r.i18n.translate("xpack.infra.metrics.alertFlyout.expression.metric.selectFieldLabel",{defaultMessage:"Select a metric"}),value:""},C=Object(c.useMemo)((()=>l.filter((e=>e.aggregatable&&"number"===e.type&&!((null==a?void 0:a.field)===e.name))).map((e=>({label:e.name})))),[l,null==a?void 0:a.field]),M=Object(c.useMemo)((()=>v?(null==a?void 0:a.field)&&Object(Q.a)(a):(null==e?void 0:e.text)||w.text),[v,e,a,w]),T=Object(c.useCallback)((e=>{"metric-popover-custom"===e?(x(!0),d("custom")):(x(!1),d(E))}),[x,d,E]),S=Object(c.useCallback)((e=>{const t=e.target.value,s=m.c.is(t)?t:"avg",r={...a,aggregation:s};m.d.is(r)&&p(r)}),[a,p]),j=Object(c.useCallback)((e=>{const t={...a,field:e[0].label};m.d.is(t)&&p(t)}),[a,p]),B=Object(o.debounce)(p,500),I=Object(c.useCallback)((e=>{h(e.target.value);const t={...a,label:e.target.value};m.d.is(t)&&B(t)}),[a,B]),L=t.map((e=>({label:e.text,value:e.value})),[]);return u.a.createElement(s.EuiPopover,{id:"metricPopover",button:u.a.createElement(s.EuiExpression,{description:r.i18n.translate("xpack.infra.metrics.alertFlyout.expression.metric.whenLabel",{defaultMessage:"When"}),value:M,isActive:Boolean(b||i.metric&&i.metric.length>0),onClick:()=>{y(!0)},color:null!==(g=i.metric)&&void 0!==g&&g.length?"danger":"success"}),isOpen:b,closePopover:()=>{y(!1)},anchorPosition:null!=f?f:"downRight",zIndex:8e3},u.a.createElement("div",{style:{width:620}},u.a.createElement(V,{onClose:()=>y(!1)},u.a.createElement(n.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.expression.metric.popoverTitle",defaultMessage:"Metric"})),u.a.createElement(s.EuiButtonGroup,{isFullWidth:!0,buttonSize:"compressed",legend:"Metric type",options:[{id:"metric-popover-default",label:"Default metric"},{id:"metric-popover-custom",label:"Custom metric"}],idSelected:v?"metric-popover-custom":"metric-popover-default",onChange:T}),u.a.createElement(s.EuiSpacer,{size:"m"}),v?u.a.createElement(u.a.Fragment,null,u.a.createElement(s.EuiFormRow,{fullWidth:!0},u.a.createElement(s.EuiFlexGroup,{alignItems:"center",gutterSize:"s"},u.a.createElement(s.EuiFlexItem,{grow:!1},u.a.createElement(s.EuiSelect,{onChange:S,value:(null==a?void 0:a.aggregation)||"avg",options:K,fullWidth:!0})),u.a.createElement(s.EuiFlexItem,{grow:!1},u.a.createElement(s.EuiText,{color:"subdued"},u.a.createElement("span",null,r.i18n.translate("xpack.infra.waffle.customMetrics.of",{defaultMessage:"of"})))),u.a.createElement(s.EuiFlexItem,null,u.a.createElement(s.EuiComboBox,{fullWidth:!0,placeholder:r.i18n.translate("xpack.infra.waffle.customMetrics.fieldPlaceholder",{defaultMessage:"Select a field"}),singleSelection:{asPlainText:!0},selectedOptions:null!=a&&a.field?[{label:a.field}]:[],options:C,onChange:j,isClearable:!1,isInvalid:i.metric.length>0})))),u.a.createElement(s.EuiFormRow,{label:r.i18n.translate("xpack.infra.waffle.alerting.customMetrics.labelLabel",{defaultMessage:"Metric name (optional)"}),display:"rowCompressed",fullWidth:!0,helpText:r.i18n.translate("xpack.infra.waffle.alerting.customMetrics.helpText",{defaultMessage:'Choose a name to help identify your custom metric. Defaults to "<function> of <field name>".'})},u.a.createElement(s.EuiFieldText,{name:"label",placeholder:r.i18n.translate("xpack.infra.waffle.customMetrics.labelPlaceholder",{defaultMessage:'Choose a name to appear in the "Metric" dropdown'}),value:k,fullWidth:!0,onChange:I}))):u.a.createElement(s.EuiFormRow,{fullWidth:!0},u.a.createElement(s.EuiFlexGroup,null,u.a.createElement(s.EuiFlexItem,{className:"actOf__metricContainer"},u.a.createElement(s.EuiComboBox,{fullWidth:!0,singleSelection:{asPlainText:!0},"data-test-subj":"availablefieldsOptionsComboBox",isInvalid:i.metric.length>0,placeholder:w.text,options:L,noSuggestions:!L.length,selectedOptions:e?L.filter((t=>t.value===e.value)):[],renderOption:e=>e.label,onChange:e=>{e.length>0?(d(e[0].value),O(e[0].value)):d()}}))))))},V=({children:e,onClose:t})=>u.a.createElement(s.EuiPopoverTitle,null,u.a.createElement(s.EuiFlexGroup,{alignItems:"center",gutterSize:"s"},u.a.createElement(s.EuiFlexItem,null,e),u.a.createElement(s.EuiFlexItem,{grow:!1},u.a.createElement(s.EuiButtonIcon,{iconType:"cross",color:"danger","aria-label":r.i18n.translate("xpack.infra.metrics.expressionItems.components.closablePopoverTitle.closeLabel",{defaultMessage:"Close"}),onClick:()=>t()})))),$=({value:e,options:t,onChange:a,popupPosition:l})=>{const[i,o]=Object(c.useState)(!1);return u.a.createElement(s.EuiPopover,{button:u.a.createElement(s.EuiExpression,{"data-test-subj":"nodeTypeExpression",description:r.i18n.translate("xpack.infra.metrics.alertFlyout.expression.for.descriptionLabel",{defaultMessage:"For"}),value:t[e].text,isActive:i,onClick:()=>{o(!0)}}),isOpen:i,closePopover:()=>{o(!1)},ownFocus:!0,anchorPosition:null!=l?l:"downLeft"},u.a.createElement("div",null,u.a.createElement(H,{onClose:()=>o(!1)},u.a.createElement(n.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.expression.for.popoverTitle",defaultMessage:"Node Type"})),u.a.createElement(s.EuiSelect,{"data-test-subj":"forExpressionSelect",value:e,fullWidth:!0,onChange:e=>{a(e.target.value),o(!1)},options:Object.values(t).map((e=>e))})))},H=({children:e,onClose:t})=>u.a.createElement(s.EuiPopoverTitle,null,u.a.createElement(s.EuiFlexGroup,{alignItems:"center",gutterSize:"s"},u.a.createElement(s.EuiFlexItem,null,e),u.a.createElement(s.EuiFlexItem,{grow:!1},u.a.createElement(s.EuiButtonIcon,{iconType:"cross",color:"danger","aria-label":r.i18n.translate("xpack.infra.metrics.expressionItems.components.closablePopoverTitle.closeLabel",{defaultMessage:"Close"}),onClick:()=>t()})))),J={metric:"cpu",comparator:d.b.GT,threshold:[],timeSize:1,timeUnit:"m",customMetric:{type:"custom",id:"alert-custom-metric",field:"",aggregation:"avg"}},X=e=>{const{http:t,notifications:a}=Object(w.b)().services,{setRuleParams:l,ruleParams:p,errors:f,metadata:g}=e,{source:b,createDerivedIndexPattern:y}=Object(h.a)({sourceId:"default",fetch:t.fetch,toastWarning:a.toasts.addWarning}),[v,x]=Object(c.useState)(1),[E,O]=Object(c.useState)("m"),k=Object(c.useMemo)((()=>y()),[y]),T=Object(c.useCallback)(((e,t)=>{const a=p.criteria?p.criteria.slice():[];a[e]=t,l("criteria",a)}),[l,p.criteria]),S=Object(c.useCallback)((()=>{var e;const t=(null===(e=p.criteria)||void 0===e?void 0:e.slice())||[];t.push({...J,timeSize:null!=v?v:J.timeSize,timeUnit:null!=E?E:J.timeUnit}),l("criteria",t)}),[l,p.criteria,v,E]),j=Object(c.useCallback)((e=>{const t=p.criteria.slice();t.length>1&&(t.splice(e,1),l("criteria",t))}),[l,p.criteria]),B=Object(c.useCallback)((e=>{l("filterQueryText",e||"");try{l("filterQuery",Object(M.a)(e,k,!1)||"")}catch(e){l("filterQuery",d.f)}}),[k,l]),I=Object(c.useCallback)(Object(o.debounce)(B,500),[B]),L=Object(c.useMemo)((()=>({aggField:[],timeSizeUnit:[],timeWindowSize:[]})),[]),F=Object(c.useCallback)((e=>{const t=p.criteria.map((t=>({...t,timeSize:e})));x(e||void 0),l("criteria",t)}),[p.criteria,l]),R=Object(c.useCallback)((e=>{const t=p.criteria.map((t=>({...t,timeUnit:e})));O(e),l("criteria",t)}),[p.criteria,l]),q=Object(c.useCallback)((e=>{l("nodeType",e)}),[l]),D=Object(c.useCallback)((e=>B(e.target.value)),[B]),z=Object(c.useCallback)((()=>{const e=g;e&&e.options?l("criteria",[{...J,metric:e.options.metric.type,customMetric:m.d.is(e.options.metric)?e.options.metric:J.customMetric}]):l("criteria",[J])}),[g,l]),U=Object(c.useCallback)((()=>{const e=g;e&&e.filter&&(l("filterQueryText",e.filter),l("filterQuery",Object(M.a)(e.filter,k)||""))}),[g,k,l]);return Object(c.useEffect)((()=>{const e=g;p.nodeType||(e&&e.nodeType?l("nodeType",e.nodeType):l("nodeType","host")),p.criteria&&p.criteria.length?(x(p.criteria[0].timeSize),O(p.criteria[0].timeUnit)):z(),p.filterQuery||U(),p.sourceId||l("sourceId",(null==b?void 0:b.id)||"default")}),[g,k,J,b]),u.a.createElement(u.a.Fragment,null,u.a.createElement(s.EuiSpacer,{size:"m"}),u.a.createElement(s.EuiText,{size:"xs"},u.a.createElement("h4",null,u.a.createElement(n.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.conditions",defaultMessage:"Conditions"}))),u.a.createElement(ee,null,u.a.createElement(Z,null,u.a.createElement(Y,null,u.a.createElement($,{options:ne,value:p.nodeType||"host",onChange:q})))),u.a.createElement(s.EuiSpacer,{size:"xs"}),p.criteria&&p.criteria.map(((e,t)=>u.a.createElement(ae,{nodeType:p.nodeType,canDelete:p.criteria.length>1,remove:j,addExpression:S,key:t,expressionId:t,setRuleParams:T,errors:f[t]||L,expression:e||{},fields:k.fields},u.a.createElement(N,{expression:e,filterQuery:p.filterQuery,nodeType:p.nodeType,sourceId:p.sourceId,"data-test-subj":"preview-chart"})))),u.a.createElement(Y,null,u.a.createElement(i.ForLastExpression,{timeWindowSize:v,timeWindowUnit:E,errors:L,onChangeWindowSize:F,onChangeWindowUnit:R})),u.a.createElement("div",null,u.a.createElement(s.EuiButtonEmpty,{color:"primary",iconSide:"left",flush:"left",iconType:"plusInCircleFilled",onClick:S},u.a.createElement(n.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.addCondition",defaultMessage:"Add condition"}))),u.a.createElement(s.EuiSpacer,{size:"m"}),u.a.createElement(s.EuiCheckbox,{id:"metrics-alert-no-data-toggle",label:u.a.createElement(u.a.Fragment,null,r.i18n.translate("xpack.infra.metrics.alertFlyout.alertOnNoData",{defaultMessage:"Alert me if there's no data"})," ",u.a.createElement(s.EuiToolTip,{content:r.i18n.translate("xpack.infra.metrics.alertFlyout.noDataHelpText",{defaultMessage:"Enable this to trigger the action if the metric(s) do not report any data over the expected time period, or if the alert fails to query Elasticsearch"})},u.a.createElement(s.EuiIcon,{type:"questionInCircle",color:"subdued"}))),checked:p.alertOnNoData,onChange:e=>l("alertOnNoData",e.target.checked)}),u.a.createElement(s.EuiSpacer,{size:"m"}),u.a.createElement(s.EuiFormRow,{label:r.i18n.translate("xpack.infra.metrics.alertFlyout.filterLabel",{defaultMessage:"Filter (optional)"}),helpText:r.i18n.translate("xpack.infra.metrics.alertFlyout.filterHelpText",{defaultMessage:"Use a KQL expression to limit the scope of your alert trigger."}),fullWidth:!0,display:"rowCompressed"},g&&u.a.createElement(C.a,{derivedIndexPattern:k,onSubmit:B,onChange:I,value:p.filterQueryText})||u.a.createElement(s.EuiFieldSearch,{onChange:D,value:p.filterQueryText,fullWidth:!0})),u.a.createElement(s.EuiSpacer,{size:"m"}))};t.default=X;const Y=l.euiStyled.div`
  margin-left: 28px;
`,Z=Object(l.euiStyled)(s.EuiFlexGroup)`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -4px;
`,ee=l.euiStyled.div`
  padding: 0 4px;
`,te=Object(l.euiStyled)(s.EuiHealth)`
  margin-left: 4px;
`,ae=e=>{var t,a,l;const[i,p]=Object(c.useState)(!0),h=Object(c.useCallback)((()=>p(!i)),[i]),{children:w,setRuleParams:C,expression:M,errors:T,expressionId:S,remove:j,canDelete:B,fields:I}=e,{metric:L,comparator:F=d.b.GT,threshold:R=[],customMetric:q,warningThreshold:D=[],warningComparator:z}=M,[U,P]=Object(c.useState)(Boolean(null==D?void 0:D.length)),N=Object(c.useCallback)((e=>{const t=O.f.is(e)?e:Boolean(e)?"custom":void 0,a={...M,metric:t};C(S,a)}),[S,M,C]),_=Object(c.useCallback)((e=>{m.d.is(e)&&C(S,{...M,customMetric:e})}),[S,M,C]),W=Object(c.useCallback)((e=>{C(S,{...M,comparator:e})}),[S,M,C]),Q=Object(c.useCallback)((e=>{C(S,{...M,warningComparator:e})}),[S,M,C]),A=Object(c.useCallback)((e=>{e.join()!==M.threshold.join()&&C(S,{...M,threshold:e})}),[S,M,C]),K=Object(c.useCallback)((e=>{var t;e.join()!==(null===(t=M.warningThreshold)||void 0===t?void 0:t.join())&&C(S,{...M,warningThreshold:e})}),[S,M,C]),V=Object(c.useCallback)((()=>{U?(P(!1),C(S,Object(o.omit)(M,"warningComparator","warningThreshold"))):(P(!0),C(S,{...M,warningComparator:F,warningThreshold:[]}))}),[U,P,C,F,M,S]),$=u.a.createElement(se,{comparator:F,threshold:R,updateComparator:W,updateThreshold:A,errors:null!==(t=T.critical)&&void 0!==t?t:{},metric:L}),H=U&&u.a.createElement(se,{comparator:z||F,threshold:D,updateComparator:Q,updateThreshold:K,errors:null!==(a=T.warning)&&void 0!==a?a:{},metric:L}),J=Object(c.useMemo)((()=>{let t=x.b;switch(e.nodeType){case"awsEC2":t=f.b;break;case"awsRDS":t=g.b;break;case"awsS3":t=b.b;break;case"awsSQS":t=y.b;break;case"host":t=x.b;break;case"pod":t=E.b;break;case"container":t=v.b}return t.map(k.a)}),[e.nodeType]);return u.a.createElement(u.a.Fragment,null,u.a.createElement(s.EuiFlexGroup,{gutterSize:"xs"},u.a.createElement(s.EuiFlexItem,{grow:!1},u.a.createElement(s.EuiButtonIcon,{iconType:i?"arrowDown":"arrowRight",onClick:h,"aria-label":r.i18n.translate("xpack.infra.metrics.alertFlyout.expandRowLabel",{defaultMessage:"Expand row."})})),u.a.createElement(s.EuiFlexItem,{grow:!0},u.a.createElement(Z,null,u.a.createElement(ee,null,u.a.createElement(G,{metric:{value:L,text:(null===(l=J.find((e=>(null==e?void 0:e.value)===L)))||void 0===l?void 0:l.text)||""},metrics:J.filter((e=>void 0!==e&&void 0!==e.value)),onChange:N,onChangeCustom:_,errors:T,customMetric:q,fields:I})),!U&&$),U&&u.a.createElement(u.a.Fragment,null,u.a.createElement(Z,null,$,u.a.createElement(te,{color:"danger"},u.a.createElement(n.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.criticalThreshold",defaultMessage:"Alert"}))),u.a.createElement(Z,null,H,u.a.createElement(te,{color:"warning"},u.a.createElement(n.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.warningThreshold",defaultMessage:"Warning"})),u.a.createElement(s.EuiButtonIcon,{"aria-label":r.i18n.translate("xpack.infra.metrics.alertFlyout.removeWarningThreshold",{defaultMessage:"Remove warningThreshold"}),iconSize:"s",color:"text",iconType:"crossInACircleFilled",onClick:V}))),!U&&u.a.createElement(u.a.Fragment,null," ",u.a.createElement(s.EuiSpacer,{size:"xs"}),u.a.createElement(Z,null,u.a.createElement(s.EuiButtonEmpty,{color:"primary",flush:"left",size:"xs",iconType:"plusInCircleFilled",onClick:V},u.a.createElement(n.FormattedMessage,{id:"xpack.infra.metrics.alertFlyout.addWarningThreshold",defaultMessage:"Add warning threshold"}))))),B&&u.a.createElement(s.EuiFlexItem,{grow:!1},u.a.createElement(s.EuiButtonIcon,{"aria-label":r.i18n.translate("xpack.infra.metrics.alertFlyout.removeCondition",{defaultMessage:"Remove condition"}),color:"danger",iconType:"trash",onClick:()=>j(S)}))),i?u.a.createElement("div",{style:{padding:"0 0 0 28px"}},w):null,u.a.createElement(s.EuiSpacer,{size:"s"}))},se=({updateComparator:e,updateThreshold:t,threshold:a,metric:r,comparator:n,errors:l})=>{var o;return u.a.createElement(u.a.Fragment,null,u.a.createElement(ee,null,u.a.createElement(i.ThresholdExpression,{thresholdComparator:n||d.b.GT,threshold:a,onChangeSelectedThresholdComparator:e,onChangeSelectedThreshold:t,errors:l})),r&&u.a.createElement("div",{style:{alignSelf:"center"}},u.a.createElement(s.EuiText,{size:"s"},(null===(o=le[r])||void 0===o?void 0:o.label)||"")))},re=e=>Object(p.b)(e).displayName,ne={host:{text:re("host"),value:"host"},pod:{text:re("pod"),value:"pod"},container:{text:re("container"),value:"container"},awsEC2:{text:re("awsEC2"),value:"awsEC2"},awsS3:{text:re("awsS3"),value:"awsS3"},awsRDS:{text:re("awsRDS"),value:"awsRDS"},awsSQS:{text:re("awsSQS"),value:"awsSQS"}},le={count:{label:""},cpu:{label:"%"},memory:{label:"%"},rx:{label:"bits/s"},tx:{label:"bits/s"},logRate:{label:"/s"},diskIOReadBytes:{label:"bytes/s"},diskIOWriteBytes:{label:"bytes/s"},s3BucketSize:{label:"bytes"},s3TotalRequests:{label:""},s3NumberOfObjects:{label:""},s3UploadBytes:{label:"bytes"},s3DownloadBytes:{label:"bytes"},sqsOldestMessage:{label:"seconds"},rdsLatency:{label:"ms"},custom:{label:""}}},77:function(e,t,a){"use strict";a.d(t,"g",(function(){return d})),a.d(t,"a",(function(){return m})),a.d(t,"e",(function(){return p})),a.d(t,"b",(function(){return g})),a.d(t,"c",(function(){return y})),a.d(t,"d",(function(){return v})),a.d(t,"f",(function(){return x}));var s=a(0),r=a(78),n=a(120);const l=s.intersection([s.type({value:s.string,label:s.string}),s.partial({ip:s.union([s.string,s.null])}),s.partial({os:s.union([s.string,s.null])})]),i=s.partial({value:s.union([s.number,s.null]),avg:s.union([s.number,s.null]),max:s.union([s.number,s.null]),timeseries:n.a}),o=s.type({name:s.union([r.f,s.string])}),c=s.intersection([o,i]),u=s.type({metrics:s.array(c),path:s.array(l),name:s.string}),d=s.type({nodes:s.array(u),interval:s.string}),m=s.intersection([s.type({interval:s.string,to:s.number,from:s.number}),s.partial({lookbackSize:s.number,ignoreLookback:s.boolean,forceInterval:s.boolean})]),p=s.array(s.partial({label:s.union([s.string,s.null]),field:s.union([s.string,s.null])})),f=s.type({type:r.f}),g=["avg","max","min","rate"],b=g.reduce(((e,t)=>({...e,[t]:null})),{}),y=s.keyof(b),v=s.intersection([s.type({type:s.literal("custom"),field:s.string,aggregation:y,id:s.string}),s.partial({label:s.string})]),x=s.union([f,v]);s.intersection([s.type({timerange:m,metrics:s.array(x),groupBy:s.union([p,s.null]),nodeType:r.c,sourceId:s.string}),s.partial({accountId:s.string,region:s.string,filterQuery:s.union([s.string,s.null]),includeTimeseries:s.boolean,overrideCompositeSize:s.number})])},78:function(e,t,a){"use strict";a.d(t,"c",(function(){return r})),a.d(t,"b",(function(){return n})),a.d(t,"a",(function(){return l})),a.d(t,"d",(function(){return j})),a.d(t,"e",(function(){return B})),a.d(t,"f",(function(){return I}));var s=a(0);const r=s.keyof({host:null,pod:null,container:null,awsEC2:null,awsS3:null,awsSQS:null,awsRDS:null}),n=s.keyof({line:null,area:null,bar:null}),l=(s.keyof({abbreviatedNumber:null,bits:null,bytes:null,number:null,percent:null,highPrecision:null}),s.keyof({hostSystemOverview:null,hostCpuUsage:null,hostFilesystem:null,hostK8sOverview:null,hostK8sCpuCap:null,hostK8sDiskCap:null,hostK8sMemoryCap:null,hostK8sPodCap:null,hostLoad:null,hostMemoryUsage:null,hostNetworkTraffic:null,hostDockerOverview:null,hostDockerInfo:null,hostDockerTop5ByCpu:null,hostDockerTop5ByMemory:null,podOverview:null,podCpuUsage:null,podMemoryUsage:null,podLogUsage:null,podNetworkTraffic:null,containerOverview:null,containerCpuKernel:null,containerCpuUsage:null,containerDiskIOOps:null,containerDiskIOBytes:null,containerMemory:null,containerNetworkTraffic:null,containerK8sOverview:null,containerK8sCpuUsage:null,containerK8sMemoryUsage:null,nginxHits:null,nginxRequestRate:null,nginxActiveConnections:null,nginxRequestsPerConnection:null,awsOverview:null,awsCpuUtilization:null,awsNetworkBytes:null,awsNetworkPackets:null,awsDiskioBytes:null,awsDiskioOps:null,awsEC2CpuUtilization:null,awsEC2NetworkTraffic:null,awsEC2DiskIOBytes:null,awsS3TotalRequests:null,awsS3NumberOfObjects:null,awsS3BucketSize:null,awsS3DownloadBytes:null,awsS3UploadBytes:null,awsRDSCpuTotal:null,awsRDSConnections:null,awsRDSQueriesExecuted:null,awsRDSActiveTransactions:null,awsRDSLatency:null,awsSQSMessagesVisible:null,awsSQSMessagesDelayed:null,awsSQSMessagesSent:null,awsSQSMessagesEmpty:null,awsSQSOldestMessage:null,custom:null})),i=s.keyof({avg:null,max:null,min:null,calculation:null,cardinality:null,series_agg:null,positive_only:null,derivative:null,count:null,sum:null,cumulative_sum:null}),o=s.type({id:s.string,type:s.literal("count")}),c=s.intersection([s.type({id:s.string,type:i}),s.partial({field:s.string})]),u=s.type({field:s.string,id:s.string,name:s.string}),d=s.type({id:s.string,script:s.string,type:s.literal("calculation"),variables:s.array(u)}),m=s.type({id:s.string,field:s.string,unit:s.string,type:s.literal("derivative")}),p=s.type({id:s.string,function:s.string,type:s.literal("series_agg")}),f=s.type({id:s.string,value:s.number}),g=s.intersection([s.type({id:s.string,type:s.literal("percentile"),percentiles:s.array(f)}),s.partial({field:s.string})]),b=s.union([o,c,d,m,g,p]),y=s.intersection([s.type({id:s.string,metrics:s.array(b),split_mode:s.string}),s.partial({terms_field:s.string,terms_size:s.number,terms_order_by:s.string,filter:s.type({query:s.string,language:s.keyof({lucene:null,kuery:null})})})]),v=(s.intersection([s.type({id:l,requires:s.array(s.string),index_pattern:s.union([s.string,s.array(s.string)]),interval:s.string,time_field:s.string,type:s.string,series:s.array(y)}),s.partial({filter:s.string,map_field_to:s.string,id_type:s.keyof({cloud:null,node:null}),drop_last_bucket:s.boolean})]),s.record(s.string,s.union([s[void 0],s.type({field:s.string})]))),x=s.type({percentiles:s.type({field:s.string,percents:s.array(s.number)})}),E=s.type({cardinality:s.partial({field:s.string,script:s.string})}),O=s.type({bucket_script:s.intersection([s.type({buckets_path:s.record(s.string,s.string),script:s.type({source:s.string,lang:s.keyof({painless:null,expression:null})})}),s.partial({gap_policy:s.keyof({skip:null,insert_zeros:null})})])}),k=s.type({cumulative_sum:s.type({buckets_path:s.string})}),h=s.type({derivative:s.type({buckets_path:s.string,gap_policy:s.keyof({skip:null,insert_zeros:null}),unit:s.string})}),w=s.type({sum_bucket:s.type({buckets_path:s.string})}),C=s.type({top_metrics:s.type({metrics:s.union([s.array(s.type({field:s.string})),s.type({field:s.string})])})}),M=s.type({filter:s.type({exists:s.type({field:s.string})}),aggs:s.type({period:s.type({max:s.type({field:s.string})})})}),T=s.recursion("SnapshotModelRT",(()=>s.type({terms:s.type({field:s.string}),aggregations:j}))),S=s.union([v,x,O,k,h,w,T,E,C,M]),j=s.record(s.string,S),B={count:null,cpu:null,cpuCores:null,diskLatency:null,load:null,memory:null,memoryTotal:null,tx:null,rx:null,logRate:null,diskIOReadBytes:null,diskIOWriteBytes:null,s3TotalRequests:null,s3NumberOfObjects:null,s3BucketSize:null,s3DownloadBytes:null,s3UploadBytes:null,rdsConnections:null,rdsQueriesExecuted:null,rdsActiveTransactions:null,rdsLatency:null,sqsMessagesVisible:null,sqsMessagesDelayed:null,sqsMessagesSent:null,sqsMessagesEmpty:null,sqsOldestMessage:null,custom:null},I=s.keyof(B)},80:function(e,t,a){"use strict";a.d(t,"a",(function(){return g})),a.d(t,"b",(function(){return b})),a.d(t,"c",(function(){return h})),a.d(t,"d",(function(){return w}));var s=a(2),r=a(0),n=a(18),l=a(14),i=a(22),o=a(70),c=a.n(o),u=a(115),d=a(31),m=a(77),p=a(81),f=a(78);const g={palette:"cool",steps:10,reverseColors:!1},b={metric:{type:"cpu"},groupBy:[],nodeType:"host",view:"map",customOptions:[],boundsOverride:{max:1,min:0},autoBounds:!0,accountId:"",region:"",customMetrics:[],legend:g,source:"default",sort:{by:"name",direction:"desc"},timelineOpen:!1},y=r.type({palette:d.d,steps:r.number,reverseColors:r.boolean}),v=r.type({by:r.keyof({name:null,value:null}),direction:r.keyof({asc:null,desc:null})}),x=r.intersection([r.type({metric:m.f,groupBy:m.e,nodeType:f.c,view:r.string,customOptions:r.array(r.type({text:r.string,field:r.string})),boundsOverride:r.type({min:r.number,max:r.number}),autoBounds:r.boolean,accountId:r.string,region:r.string,customMetrics:r.array(m.d),sort:v}),r.partial({source:r.string,legend:y,timelineOpen:r.boolean})]),E=e=>x.encode(e),O=e=>{const t=Object(n.pipe)(x.decode(e),Object(l.fold)(Object(i.constant)(void 0),i.identity));return t&&(t.source="url"),t},k=c()((()=>{const[e,t]=Object(p.b)({defaultState:b,decodeUrlState:O,encodeUrlState:E,urlStateKey:"waffleOptions"}),[a,r]=Object(s.useState)(e);Object(s.useEffect)((()=>t(a)),[t,a]);const n=Object(s.useCallback)((e=>r((t=>({...t,metric:e})))),[r]),l=Object(s.useCallback)((e=>r((t=>({...t,groupBy:e})))),[r]),i=Object(s.useCallback)((e=>r((t=>({...t,nodeType:e})))),[r]),o=Object(s.useCallback)((e=>r((t=>({...t,view:e})))),[r]),c=Object(s.useCallback)((e=>r((t=>({...t,customOptions:e})))),[r]),d=Object(s.useCallback)((e=>r((t=>({...t,autoBounds:e})))),[r]),m=Object(s.useCallback)((e=>r((t=>({...t,boundsOverride:e})))),[r]),f=Object(s.useCallback)((e=>r((t=>({...t,accountId:e})))),[r]),g=Object(s.useCallback)((e=>r((t=>({...t,region:e})))),[r]),y=Object(s.useCallback)((e=>{r((t=>({...t,customMetrics:e})))}),[r]),v=Object(s.useCallback)((e=>{r((t=>({...t,legend:e})))}),[r]),x=Object(s.useCallback)((e=>{r((t=>({...t,sort:e})))}),[r]),{inventoryPrefill:k}=Object(u.b)();Object(s.useEffect)((()=>{const{setNodeType:e,setMetric:t,setCustomMetrics:s}=k;e(a.nodeType),t(a.metric),s(a.customMetrics)}),[a,k]);const h=Object(s.useCallback)((e=>r((t=>({...t,timelineOpen:e})))),[r]);return{...b,...a,changeMetric:n,changeGroupBy:l,changeNodeType:i,changeView:o,changeCustomOptions:c,changeAutoBounds:d,changeBoundsOverride:m,changeAccount:f,changeRegion:g,changeCustomMetrics:y,changeLegend:v,changeSort:x,changeTimelineOpen:h,setWaffleOptionsState:r}})),[h,w]=k}}]);