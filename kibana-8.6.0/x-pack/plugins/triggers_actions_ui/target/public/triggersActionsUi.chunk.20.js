/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.triggersActionsUi_bundle_jsonpfunction=window.triggersActionsUi_bundle_jsonpfunction||[]).push([[20,30],{110:function(e,t,s){"use strict";s.r(t),s.d(t,"RuleEventLogList",(function(){return E})),s.d(t,"default",(function(){return E}));var n=s(1),r=s.n(n),a=s(4),i=s(3),u=s(22),l=s(61),o=s(88),c=s(100),d=s(107),g=s(21),p=s(89),f=s.n(p),x=s(129),m=s(0);const b=[120,60,30,15].map((e=>({value:e,text:i.i18n.translate("xpack.triggersActionsUI.sections.executionDurationChart.numberOfExecutionsOption",{defaultMessage:"{value} runs",values:{value:e}})}))),j=({executionDuration:e,numberOfExecutions:t,onChangeDuration:s,isLoading:u})=>{const l=function(e,t){const s=Object.entries(e);return s.length===t?s:s.length<t?Object(g.assign)(Object(g.fill)(new Array(t),[null,null]),s):s.slice(-t)}(e.valuesWithTimestamp,t),p=Object(n.useCallback)((({target:e})=>s(Number(e.value))),[s]);return Object(m.jsx)(a.EuiPanel,{"data-test-subj":"executionDurationChartPanel",hasBorder:!0},Object(m.jsx)(a.EuiFlexGroup,{alignItems:"center",gutterSize:"xs"},Object(m.jsx)(a.EuiFlexItem,{grow:!1},Object(m.jsx)(a.EuiTitle,{size:"xxs"},Object(m.jsx)("h4",null,Object(m.jsx)(o.FormattedMessage,{id:"xpack.triggersActionsUI.sections.executionDurationChart.recentDurationsTitle",defaultMessage:"Recent run durations"})))),Object(m.jsx)(a.EuiFlexGroup,{justifyContent:"flexEnd"},Object(m.jsx)(a.EuiFlexItem,{grow:!1},Object(m.jsx)(a.EuiSelect,{id:"select-number-execution-durations","data-test-subj":"executionDurationChartPanelSelect",options:b,value:t,"aria-label":i.i18n.translate("xpack.triggersActionsUI.sections.executionDurationChart.selectNumberOfExecutionDurationsLabel",{defaultMessage:"Select number of runs"}),onChange:p})))),u&&Object(m.jsx)(a.EuiFlexGroup,{justifyContent:"center"},Object(m.jsx)(a.EuiFlexItem,{grow:!1,style:{height:"80px",justifyContent:"center"}},Object(m.jsx)(a.EuiLoadingChart,{size:"xl"}))),!u&&(e.valuesWithTimestamp&&Object.entries(e.valuesWithTimestamp).length>0?Object(m.jsx)(r.a.Fragment,null,Object(m.jsx)(d.Chart,{"data-test-subj":"executionDurationChart",size:{height:80}},Object(m.jsx)(d.Settings,{theme:{lineSeriesStyle:{point:{visible:!1},line:{stroke:c.euiLightVars.euiColorAccent}}}}),Object(m.jsx)(d.BarSeries,{id:"executionDuration",name:i.i18n.translate("xpack.triggersActionsUI.sections.executionDurationChart.durationLabel",{defaultMessage:"Duration"}),xScaleType:"linear",yScaleType:"linear",xAccessor:0,yAccessors:[1],data:l.map((([e,t],s)=>[e?f()(e).format("D MMM YYYY @ HH:mm:ss"):s,t])),minBarHeight:2}),Object(m.jsx)(d.LineSeries,{id:"rule_duration_avg",name:i.i18n.translate("xpack.triggersActionsUI.sections.executionDurationChart.avgDurationLabel",{defaultMessage:"Avg Duration"}),xScaleType:"linear",yScaleType:"linear",xAccessor:0,yAccessors:[1],data:l.map((([t,s],n)=>[t?f()(t).format("D MMM YYYY @ HH:mm:ss"):n,s?e.average:null])),curve:d.CurveType.CURVE_NATURAL}),Object(m.jsx)(d.Axis,{id:"left-axis",position:"left",tickFormat:e=>Object(x.a)(e)}))):Object(m.jsx)(r.a.Fragment,null,Object(m.jsx)(a.EuiEmptyPrompt,{"data-test-subj":"executionDurationChartEmpty",body:Object(m.jsx)(r.a.Fragment,null,Object(m.jsx)("p",null,Object(m.jsx)(o.FormattedMessage,{id:"xpack.triggersActionsUI.sections.executionDurationChart.executionDurationNoData",defaultMessage:"There is no available run duration information for this rule."})))}))))};var O=s(121);const h=60,A=Object(O.a)((e=>{const{ruleId:t,ruleType:s,ruleSummary:r,refreshToken:o,fetchRuleSummary:c=!1,numberOfExecutions:d=h,onChangeDuration:g,loadRuleSummary:p,isLoadingRuleSummary:f=!1}=e,{notifications:{toasts:b}}=Object(u.b)().services,O=Object(n.useRef)(!1),[A,I]=Object(n.useState)(null),[S,k]=Object(n.useState)(h),[E,L]=Object(n.useState)(!1),y=Object(n.useMemo)((()=>c?A:r),[c,r,A]),M=Object(n.useMemo)((()=>c?S:d),[c,d,S]),R=Object(n.useMemo)((()=>c?E:f),[c,f,E]),v=Object(n.useCallback)((e=>{k(e)}),[k]),U=Object(n.useMemo)((()=>c?v:g||v),[c,g,v]),T=async()=>{if(c){L(!0);try{const e=await p(t,M);I(e)}catch(e){b.addDanger({title:i.i18n.translate("xpack.triggersActionsUI.sections.ruleDetails.ruleExecutionSummaryAndChart.loadSummaryError",{defaultMessage:"Unable to load rule summary: {message}",values:{message:e.message}})})}L(!1)}};Object(n.useEffect)((()=>{T()}),[t,M]),Object(n.useEffect)((()=>{O.current&&T(),O.current=!0}),[o]);const D=Object(n.useMemo)((()=>!!y&&Object(x.b)(s,y.executionDuration.average)),[s,y]);return y?Object(m.jsx)(a.EuiFlexGroup,null,Object(m.jsx)(a.EuiFlexItem,{grow:1},Object(m.jsx)(a.EuiPanel,{"data-test-subj":"avgExecutionDurationPanel",color:D?"warning":"subdued",hasBorder:!1},Object(m.jsx)(a.EuiStat,{"data-test-subj":"avgExecutionDurationStat",titleSize:"xs",title:Object(m.jsx)(a.EuiFlexGroup,{gutterSize:"xs"},D&&Object(m.jsx)(a.EuiFlexItem,{grow:!1},Object(m.jsx)(a.EuiIconTip,{"data-test-subj":"ruleDurationWarning",anchorClassName:"ruleDurationWarningIcon",type:"alert",color:"warning",content:i.i18n.translate("xpack.triggersActionsUI.sections.ruleDetails.alertsList.ruleTypeExcessDurationMessage",{defaultMessage:"Duration exceeds the rule's expected run time."}),position:"top"})),Object(m.jsx)(a.EuiFlexItem,{grow:!1,"data-test-subj":"ruleEventLogListAvgDuration"},Object(x.a)(y.executionDuration.average))),description:i.i18n.translate("xpack.triggersActionsUI.sections.ruleDetails.alertsList.avgDurationDescription",{defaultMessage:"Average duration"})}))),Object(m.jsx)(a.EuiFlexItem,{grow:2},Object(m.jsx)(j,{executionDuration:y.executionDuration,numberOfExecutions:M,onChangeDuration:U,isLoading:R}))):Object(m.jsx)(l.a,null)}));var I=s(164);const S="xpack.triggersActionsUI.ruleEventLogList.initialColumns",k={minHeight:400},E=e=>{const{ruleId:t,ruleType:s,localStorageKey:n=S,refreshToken:r,requestRefresh:i,fetchRuleSummary:u=!0,loadExecutionLogAggregations:l}=e,{ruleSummary:o,numberOfExecutions:c,onChangeDuration:d,isLoadingRuleSummary:g=!1}=e;return Object(m.jsx)("div",{style:k,"data-test-subj":"ruleEventLogListContainer"},Object(m.jsx)(a.EuiSpacer,null),Object(m.jsx)(A,{ruleId:t,ruleType:s,ruleSummary:o,numberOfExecutions:c,isLoadingRuleSummary:g,refreshToken:r,onChangeDuration:d,requestRefresh:i,fetchRuleSummary:u}),Object(m.jsx)(a.EuiSpacer,null),Object(m.jsx)(I.a,{localStorageKey:n,ruleId:t,refreshToken:r,overrideLoadExecutionLogAggregations:l}))}},121:function(e,t,s){"use strict";s.d(t,"a",(function(){return l}));var n=s(8),r=s.n(n),a=(s(1),s(60)),i=s(22),u=s(0);function l(e){return t=>{const{http:s}=Object(i.b)().services;return Object(u.jsx)(e,r()({},t,{muteRules:async e=>Object(a.y)({http:s,ids:e.filter((e=>!c(e))).map((e=>e.id))}),unmuteRules:async e=>Object(a.E)({http:s,ids:e.filter(c).map((e=>e.id))}),enableRules:async e=>Object(a.l)({http:s,ids:e.filter(o).map((e=>e.id))}),disableRules:async e=>Object(a.j)({http:s,ids:e.filter((e=>!o(e))).map((e=>e.id))}),deleteRules:async e=>Object(a.h)({http:s,ids:e.map((e=>e.id))}),muteRule:async e=>{if(!c(e))return await Object(a.x)({http:s,id:e.id})},unmuteRule:async e=>{if(c(e))return await Object(a.D)({http:s,id:e.id})},muteAlertInstance:async(e,t)=>{if(!d(e,t))return Object(a.w)({http:s,id:e.id,instanceId:t})},unmuteAlertInstance:async(e,t)=>{if(d(e,t))return Object(a.C)({http:s,id:e.id,instanceId:t})},enableRule:async e=>{if(o(e))return await Object(a.k)({http:s,id:e.id})},disableRule:async e=>{if(!o(e))return await Object(a.i)({http:s,id:e.id})},deleteRule:async e=>Object(a.h)({http:s,ids:[e.id]}),loadRule:async e=>Object(a.r)({http:s,ruleId:e}),loadRuleState:async e=>Object(a.s)({http:s,ruleId:e}),loadRuleSummary:async(e,t)=>Object(a.t)({http:s,ruleId:e,numberOfExecutions:t}),loadRuleTypes:async()=>Object(a.v)({http:s}),loadExecutionLogAggregations:async e=>Object(a.o)({...e,http:s}),loadGlobalExecutionLogAggregations:async e=>Object(a.q)({...e,http:s}),loadActionErrorLog:async e=>Object(a.m)({...e,http:s}),loadExecutionKPIAggregations:async e=>Object(a.n)({...e,http:s}),loadGlobalExecutionKPIAggregations:async e=>Object(a.p)({...e,http:s}),resolveRule:async e=>Object(a.z)({http:s,ruleId:e}),getHealth:async()=>Object(a.a)({http:s}),snoozeRule:async(e,t)=>await Object(a.B)({http:s,id:e.id,snoozeSchedule:t}),bulkSnoozeRules:async e=>await Object(a.c)({http:s,...e}),unsnoozeRule:async(e,t)=>await Object(a.F)({http:s,id:e.id,scheduleIds:t}),bulkUnsnoozeRules:async e=>await Object(a.d)({http:s,...e}),cloneRule:async e=>await Object(a.f)({http:s,ruleId:e})}))}}function o(e){return!1===e.enabled}function c(e){return!0===e.muteAll}function d(e,t){return e.mutedInstanceIds.findIndex((e=>e===t))>=0}},122:function(e,t,s){"use strict";s.d(t,"a",(function(){return u})),s.d(t,"b",(function(){return o})),s.d(t,"h",(function(){return d})),s.d(t,"j",(function(){return g})),s.d(t,"f",(function(){return p})),s.d(t,"E",(function(){return f})),s.d(t,"D",(function(){return x})),s.d(t,"C",(function(){return y})),s.d(t,"F",(function(){return M})),s.d(t,"s",(function(){return R})),s.d(t,"u",(function(){return v})),s.d(t,"w",(function(){return U})),s.d(t,"r",(function(){return T})),s.d(t,"t",(function(){return D})),s.d(t,"d",(function(){return w})),s.d(t,"l",(function(){return C})),s.d(t,"m",(function(){return F})),s.d(t,"q",(function(){return W})),s.d(t,"n",(function(){return P})),s.d(t,"o",(function(){return z})),s.d(t,"p",(function(){return B})),s.d(t,"i",(function(){return Y})),s.d(t,"k",(function(){return N})),s.d(t,"g",(function(){return G})),s.d(t,"v",(function(){return H})),s.d(t,"e",(function(){return _})),s.d(t,"c",(function(){return q})),s.d(t,"y",(function(){return K})),s.d(t,"x",(function(){return $})),s.d(t,"B",(function(){return V})),s.d(t,"z",(function(){return J})),s.d(t,"A",(function(){return Q}));var n=s(3);const r=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleStatusOk",{defaultMessage:"Ok"}),a=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleStatusActive",{defaultMessage:"Active"}),i=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleStatusError",{defaultMessage:"Error"}),u=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleStatusLicenseError",{defaultMessage:"License Error"}),l=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleStatusPending",{defaultMessage:"Pending"}),o=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleStatusUnknown",{defaultMessage:"Unknown"}),c=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleStatusWarning",{defaultMessage:"Warning"}),d=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleLastRunOutcomeSucceeded",{defaultMessage:"Succeeded"}),g=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleLastRunOutcomeWarning",{defaultMessage:"Warning"}),p=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleLastRunOutcomeFailed",{defaultMessage:"Failed"}),f={ok:r,active:a,error:i,pending:l,unknown:o,warning:c},x={succeeded:d,warning:g,failed:p},m=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleErrorReasonUnknown",{defaultMessage:"An error occurred for unknown reasons."}),b=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleErrorReasonReading",{defaultMessage:"An error occurred when reading the rule."}),j=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleErrorReasonDecrypting",{defaultMessage:"An error occurred when decrypting the rule."}),O=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleErrorReasonRunning",{defaultMessage:"An error occurred when running the rule."}),h=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleErrorReasonLicense",{defaultMessage:"Cannot run rule"}),A=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleErrorReasonTimeout",{defaultMessage:"Rule execution cancelled due to timeout."}),I=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleErrorReasonDisabled",{defaultMessage:"Rule failed to execute because rule ran after it was disabled."}),S=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleErrorReasonValidate",{defaultMessage:"An error occurred when validating the rule parameters."}),k=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleWarningReasonMaxExecutableActions",{defaultMessage:"Action limit exceeded"}),E=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleWarningReasonMaxAlerts",{defaultMessage:"Alert limit exceeded"}),L=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.ruleWarningReasonUnknown",{defaultMessage:"Unknown reason"}),y={read:b,decrypt:j,execute:O,unknown:m,license:h,timeout:A,disabled:I,validate:S},M={maxExecutableActions:k,maxAlerts:E,unknown:L},R=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.rulesListTable.columns.selectAllAriaLabel",{defaultMessage:"Toggle select all rules"}),v=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.rulesListTable.columns.selectShowBulkActionsAriaLabel",{defaultMessage:"Show bulk actions"}),U=(e,t)=>n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.totalRulesLabel",{values:{formattedTotalRules:e,totalRules:t},defaultMessage:"{formattedTotalRules} {totalRules, plural, =1 {rule} other {rules}}"}),T=(e,t)=>n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.selectedRulesButton",{values:{formattedSelectedRules:e,selectedRules:t},defaultMessage:"Selected {formattedSelectedRules} {selectedRules, plural, =1 {rule} other {rules}}"}),D=(e,t)=>n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.selectAllRulesButton",{values:{formattedTotalRules:e,totalRules:t},defaultMessage:"Select all {formattedTotalRules} {totalRules, plural, =1 {rule} other {rules}}"}),w=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.clearAllSelectionButton",{defaultMessage:"Clear selection"}),C=e=>n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.totalStatusesActiveDescription",{defaultMessage:"Active: {totalStatusesActive}",values:{totalStatusesActive:e}}),F=e=>n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.totalStatusesErrorDescription",{defaultMessage:"Error: {totalStatusesError}",values:{totalStatusesError:e}}),W=e=>n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.totalStatusesWarningDescription",{defaultMessage:"Warning: {totalStatusesWarning}",values:{totalStatusesWarning:e}}),P=e=>n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.totalStatusesOkDescription",{defaultMessage:"Ok: {totalStatusesOk}",values:{totalStatusesOk:e}}),z=e=>n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.totalStatusesPendingDescription",{defaultMessage:"Pending: {totalStatusesPending}",values:{totalStatusesPending:e}}),B=e=>n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.totalStatusesUnknownDescription",{defaultMessage:"Unknown: {totalStatusesUnknown}",values:{totalStatusesUnknown:e}}),Y=e=>n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.lastRunOutcomeSucceededDescription",{defaultMessage:"Succeeded: {total}",values:{total:e}}),N=e=>n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.lastRunOutcomeWarningDescription",{defaultMessage:"Warning: {total}",values:{total:e}}),G=e=>n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.lastRunOutcomeFailedDescription",{defaultMessage:"Failed: {total}",values:{total:e}}),H=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.singleTitle",{defaultMessage:"rule"}),_=n.i18n.translate("xpack.triggersActionsUI.sections.rulesList.multipleTitle",{defaultMessage:"rules"}),q=n.i18n.translate("xpack.triggersActionsUI.deleteSelectedIdsConfirmModal.cancelButtonLabel",{defaultMessage:"Cancel"}),K=(e,t,s)=>n.i18n.translate("xpack.triggersActionsUI.deleteSelectedIdsConfirmModal.descriptionText",{defaultMessage:"You won't be able to recover {numIdsToDelete, plural, one {a deleted {singleTitle}} other {deleted {multipleTitle}}}.",values:{numIdsToDelete:e,singleTitle:t,multipleTitle:s}}),$=(e,t,s)=>n.i18n.translate("xpack.triggersActionsUI.deleteSelectedIdsConfirmModal.deleteButtonLabel",{defaultMessage:"Delete {numIdsToDelete, plural, one {{singleTitle}} other {# {multipleTitle}}} ",values:{numIdsToDelete:e,singleTitle:t,multipleTitle:s}}),V=(e,t,s)=>n.i18n.translate("xpack.triggersActionsUI.components.deleteSelectedIdsSuccessNotification.descriptionText",{defaultMessage:"Deleted {numSuccesses, number} {numSuccesses, plural, one {{singleTitle}} other {{multipleTitle}}}",values:{numSuccesses:e,singleTitle:t,multipleTitle:s}}),J=(e,t,s)=>n.i18n.translate("xpack.triggersActionsUI.components.deleteSelectedIdsErrorNotification.descriptionText",{defaultMessage:"Failed to delete {numErrors, number} {numErrors, plural, one {{singleTitle}} other {{multipleTitle}}}",values:{numErrors:e,singleTitle:t,multipleTitle:s}}),Q=(e,t,s,r)=>n.i18n.translate("xpack.triggersActionsUI.components.deleteSelectedIdsPartialSuccessNotification.descriptionText",{defaultMessage:"Deleted {numberOfSuccess, number} {numberOfSuccess, plural, one {{singleTitle}} other {{multipleTitle}}}, {numberOfErrors, number} {numberOfErrors, plural, one {{singleTitle}} other {{multipleTitle}}} encountered errors",values:{numberOfSuccess:e,numberOfErrors:t,singleTitle:s,multipleTitle:r}})},129:function(e,t,s){"use strict";s.d(t,"a",(function(){return u})),s.d(t,"b",(function(){return l}));var n=s(89),r=s.n(n),a=s(21),i=s(17);function u(e){if(!e)return"00:00:00.000";const t=r.a.duration(e);return`${[t.hours(),t.minutes(),t.seconds()].map((e=>Object(a.padStart)(`${e}`,2,"0"))).join(":")}.${Object(a.padStart)(`${t.milliseconds()}`,3,"0")}`}function l(e,t){if(!e||!e.ruleTaskTimeout)return!1;const s=e.ruleTaskTimeout;return t>Object(i.parseDuration)(s)}}}]);