/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.triggersActionsUi_bundle_jsonpfunction=window.triggersActionsUi_bundle_jsonpfunction||[]).push([[32],{102:function(e,t,s){"use strict";s.r(t),s.d(t,"RuleStatusPanel",(function(){return O})),s.d(t,"default",(function(){return x}));var n=s(3),a=s(90),i=s.n(a),u=s(1),l=s(89),c=s.n(l),o=s(88),r=s(4),d=s(6),b=s(121),j=s(0);const O=({rule:e,disableRule:t,enableRule:s,snoozeRule:a,unsnoozeRule:l,requestRefresh:b,isEditable:O,healthColor:x,statusMessage:p,loadExecutionLogAggregations:h})=>{const[g,E]=Object(u.useState)(!1),[y,R]=Object(u.useState)(!1),[f,m]=Object(u.useState)(null),S=Object(u.useCallback)((()=>R(!0)),[R]),w=Object(u.useCallback)((()=>R(!1)),[R]),z=Object(u.useCallback)((t=>a(e,t)),[e,a]),I=Object(u.useCallback)((t=>l(e,t)),[e,l]),A=Object(u.useMemo)((()=>{var t;return p||Object(j.jsx)(r.EuiStat,{titleSize:"xs",title:"--",description:"",isLoading:!(null!==(t=e.lastRun)&&void 0!==t&&t.outcome||e.nextRun)})}),[e,p]),k=Object(u.useCallback)((async()=>{try{const t=await h({id:e.id,dateStart:i.a.parse("now-24h").format(),dateEnd:i.a.parse("now").format(),page:0,perPage:10});m(t.total)}catch(e){}}),[h,m,e]);return Object(u.useEffect)((()=>{k()}),[k]),Object(j.jsx)(r.EuiPanel,{"data-test-subj":"ruleStatusPanel",hasBorder:!0,paddingSize:"none"},Object(j.jsx)(r.EuiPanel,{hasShadow:!1},Object(j.jsx)(r.EuiFlexGroup,{justifyContent:"flexStart"},Object(j.jsx)(r.EuiFlexItem,{grow:!1},Object(j.jsx)(r.EuiTitle,{size:"xxs"},Object(j.jsx)("h5",null,Object(j.jsx)(o.FormattedMessage,{id:"xpack.triggersActionsUI.sections.ruleDetails.rule.statusPanel.ruleIsEnabledDisabledTitle",defaultMessage:"Rule is"})))),Object(j.jsx)(r.EuiFlexItem,null,Object(j.jsx)(d.h,{disableRule:async()=>await t(e),enableRule:async()=>await s(e),snoozeRule:async()=>{},unsnoozeRule:async()=>{},rule:e,onRuleChanged:b,direction:"row",isEditable:O,hideSnoozeOption:!0}))),Object(j.jsx)(r.EuiSpacer,{size:"s"}),Object(j.jsx)(r.EuiText,{size:"s",color:"subdued","data-test-subj":"ruleStatus-numberOfExecutions"},null!==f&&Object(j.jsx)(o.FormattedMessage,{id:"xpack.triggersActionsUI.sections.ruleDetails.rule.statusPanel.totalExecutions",defaultMessage:"{executions, plural, one {# execution} other {# executions}} in the last 24 hr",values:{executions:f}}))),Object(j.jsx)(r.EuiHorizontalRule,{margin:"none"}),Object(j.jsx)(r.EuiPanel,{hasShadow:!1},Object(j.jsx)(r.EuiFlexGroup,{gutterSize:"none",direction:"row",responsive:!1},Object(j.jsx)(r.EuiFlexItem,null,Object(j.jsx)(r.EuiStat,{"data-test-subj":`ruleStatus-${e.executionStatus.status}`,titleSize:"m",descriptionElement:"strong",titleElement:"h5",title:Object(j.jsx)(r.EuiHealth,{"data-test-subj":`ruleStatus-${e.executionStatus.status}`,textSize:"m",color:x,style:{fontWeight:400}},A),description:n.i18n.translate("xpack.triggersActionsUI.sections.ruleDetails.rulesList.ruleLastExecutionDescription",{defaultMessage:"Last response"})})),Object(j.jsx)(r.EuiFlexItem,{grow:!1},Object(j.jsx)(r.EuiSpacer,{size:"xs"}),Object(j.jsx)(r.EuiText,{color:"subdued",size:"xs"},c()(e.executionStatus.lastExecutionDate).fromNow())))),Object(j.jsx)(r.EuiHorizontalRule,{margin:"none"}),Object(j.jsx)(r.EuiPanel,{hasShadow:!1},Object(j.jsx)(d.n,{rule:{...e,isEditable:O},isOpen:y,isLoading:g,onLoading:E,onClick:S,onClose:w,onRuleChanged:b,snoozeRule:z,unsnoozeRule:I,showTooltipInline:!0})))},x=Object(b.a)(O)},121:function(e,t,s){"use strict";s.d(t,"a",(function(){return c}));var n=s(8),a=s.n(n),i=(s(1),s(60)),u=s(22),l=s(0);function c(e){return t=>{const{http:s}=Object(u.b)().services;return Object(l.jsx)(e,a()({},t,{muteRules:async e=>Object(i.y)({http:s,ids:e.filter((e=>!r(e))).map((e=>e.id))}),unmuteRules:async e=>Object(i.E)({http:s,ids:e.filter(r).map((e=>e.id))}),enableRules:async e=>Object(i.l)({http:s,ids:e.filter(o).map((e=>e.id))}),disableRules:async e=>Object(i.j)({http:s,ids:e.filter((e=>!o(e))).map((e=>e.id))}),deleteRules:async e=>Object(i.h)({http:s,ids:e.map((e=>e.id))}),muteRule:async e=>{if(!r(e))return await Object(i.x)({http:s,id:e.id})},unmuteRule:async e=>{if(r(e))return await Object(i.D)({http:s,id:e.id})},muteAlertInstance:async(e,t)=>{if(!d(e,t))return Object(i.w)({http:s,id:e.id,instanceId:t})},unmuteAlertInstance:async(e,t)=>{if(d(e,t))return Object(i.C)({http:s,id:e.id,instanceId:t})},enableRule:async e=>{if(o(e))return await Object(i.k)({http:s,id:e.id})},disableRule:async e=>{if(!o(e))return await Object(i.i)({http:s,id:e.id})},deleteRule:async e=>Object(i.h)({http:s,ids:[e.id]}),loadRule:async e=>Object(i.r)({http:s,ruleId:e}),loadRuleState:async e=>Object(i.s)({http:s,ruleId:e}),loadRuleSummary:async(e,t)=>Object(i.t)({http:s,ruleId:e,numberOfExecutions:t}),loadRuleTypes:async()=>Object(i.v)({http:s}),loadExecutionLogAggregations:async e=>Object(i.o)({...e,http:s}),loadGlobalExecutionLogAggregations:async e=>Object(i.q)({...e,http:s}),loadActionErrorLog:async e=>Object(i.m)({...e,http:s}),loadExecutionKPIAggregations:async e=>Object(i.n)({...e,http:s}),loadGlobalExecutionKPIAggregations:async e=>Object(i.p)({...e,http:s}),resolveRule:async e=>Object(i.z)({http:s,ruleId:e}),getHealth:async()=>Object(i.a)({http:s}),snoozeRule:async(e,t)=>await Object(i.B)({http:s,id:e.id,snoozeSchedule:t}),bulkSnoozeRules:async e=>await Object(i.c)({http:s,...e}),unsnoozeRule:async(e,t)=>await Object(i.F)({http:s,id:e.id,scheduleIds:t}),bulkUnsnoozeRules:async e=>await Object(i.d)({http:s,...e}),cloneRule:async e=>await Object(i.f)({http:s,ruleId:e})}))}}function o(e){return!1===e.enabled}function r(e){return!0===e.muteAll}function d(e,t){return e.mutedInstanceIds.findIndex((e=>e===t))>=0}}}]);