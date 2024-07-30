/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.stackConnectors_bundle_jsonpfunction=window.stackConnectors_bundle_jsonpfunction||[]).push([[36],{87:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return b}));var s=a(0),n=a.n(s),o=a(1),i=a(17),c=a(2),r=a(16);const l=o.i18n.translate("xpack.stackConnectors.components.casesWebhook.createCommentWarningTitle",{defaultMessage:"Unable to share case comments"}),m=o.i18n.translate("xpack.stackConnectors.components.casesWebhook.createCommentWarningDesc",{defaultMessage:"Configure the Create Comment URL and Create Comment Objects fields for the connector to share comments externally."}),b=({actionConnector:e,actionParams:t,editAction:a,errors:b,index:u,messageVariables:d})=>{var g,p;const{incident:j,comments:x}=Object(s.useMemo)((()=>{var e;return null!==(e=t.subActionParams)&&void 0!==e?e:{incident:{},comments:[]}}),[t.subActionParams]),{createCommentUrl:C,createCommentJson:h}=e.config,k=Object(s.useMemo)((()=>j.tags?j.tags.map((e=>({label:e}))):[]),[j.tags]),A=Object(s.useCallback)(((e,t)=>a("subActionParams",{incident:{...j,[e]:t},comments:x},u)),[x,a,j,u]),O=Object(s.useCallback)(((e,t)=>a("subActionParams",{incident:j,comments:[{commentId:"1",comment:t}]},u)),[a,j,u]);return Object(s.useEffect)((()=>{t.subAction||a("subAction","pushToService",u),t.subActionParams||a("subActionParams",{incident:{},comments:[]},u)}),[t]),Object(r.jsx)(n.a.Fragment,null,Object(r.jsx)(i.EuiFormRow,{"data-test-subj":"title-row",fullWidth:!0,error:b["subActionParams.incident.title"],isInvalid:void 0!==b["subActionParams.incident.title"]&&b["subActionParams.incident.title"].length>0&&void 0!==j.title,label:o.i18n.translate("xpack.stackConnectors.components.casesWebhook.titleFieldLabel",{defaultMessage:"Summary (required)"})},Object(r.jsx)(c.TextFieldWithMessageVariables,{index:u,editAction:A,messageVariables:d,paramsProperty:"title",inputTargetValue:null!==(g=j.title)&&void 0!==g?g:void 0,errors:b["subActionParams.incident.title"]})),Object(r.jsx)(c.TextAreaWithMessageVariables,{index:u,editAction:A,messageVariables:d,paramsProperty:"description",inputTargetValue:null!==(p=j.description)&&void 0!==p?p:void 0,label:o.i18n.translate("xpack.stackConnectors.components.casesWebhook.descriptionTextAreaFieldLabel",{defaultMessage:"Description"})}),Object(r.jsx)(i.EuiFormRow,{fullWidth:!0,label:o.i18n.translate("xpack.stackConnectors.components.casesWebhook.tagsFieldLabel",{defaultMessage:"Tags"}),error:b["subActionParams.incident.tags"]},Object(r.jsx)(i.EuiComboBox,{noSuggestions:!0,fullWidth:!0,selectedOptions:k,onCreateOption:e=>{const t=[...k,{label:e}];A("tags",t.map((e=>e.label)))},onChange:e=>{A("tags",e.map((e=>e.label)))},onBlur:()=>{j.tags||A("tags",[])},isClearable:!0,"data-test-subj":"tagsComboBox"})),Object(r.jsx)(n.a.Fragment,null,Object(r.jsx)(c.TextAreaWithMessageVariables,{index:u,isDisabled:!C||!h,editAction:O,messageVariables:d,paramsProperty:"comments",inputTargetValue:x&&x.length>0?x[0].comment:void 0,label:o.i18n.translate("xpack.stackConnectors.components.casesWebhook.commentsTextAreaFieldLabel",{defaultMessage:"Additional comments"})}),(!C||!h)&&Object(r.jsx)(n.a.Fragment,null,Object(r.jsx)(i.EuiSpacer,{size:"m"}),Object(r.jsx)(i.EuiCallOut,{title:l,color:"warning",iconType:"help",size:"s"},Object(r.jsx)("p",null,m)))))}}}]);