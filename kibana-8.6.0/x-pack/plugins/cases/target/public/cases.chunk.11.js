/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.cases_bundle_jsonpfunction=window.cases_bundle_jsonpfunction||[]).push([[11],{104:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));const a=({connector_id:e,service_message:t,...n})=>({...n,actionId:e,...t&&{serviceMessage:t}})},257:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return b}));var a=n(1),i=n.n(a),r=n(13),s=n(5),c=n(29),o=n(104),l=n(127);var u=n(4),d=n(95);const b=({isEdit:e=!0,fields:t,connector:n,onChange:b})=>{const m=Object(a.useRef)(!0),{incidentTypes:p=null,severityCode:g=null}=null!=t?t:{},{http:f,notifications:y}=Object(s.f)().services,{isLoading:j,incidentTypes:v}=(({http:e,toastNotifications:t,connector:n})=>{const[i,r]=Object(a.useState)(!0),[s,u]=Object(a.useState)([]),d=Object(a.useRef)(!1),b=Object(a.useRef)(new AbortController);return Object(a.useEffect)((()=>(d.current=!1,b.current.abort(),(async()=>{if(n)try{b.current=new AbortController,r(!0);const s=await async function({http:e,signal:t,connectorId:n}){const a=await e.post(Object(c.d)(n),{body:JSON.stringify({params:{subAction:"incidentTypes",subActionParams:{}}}),signal:t});return Object(o.a)(a)}({http:e,signal:b.current.signal,connectorId:n.id});var a,i;d.current||(r(!1),u(null!==(a=s.data)&&void 0!==a?a:[]),s.status&&"error"===s.status&&t.addDanger({title:l.a,text:`${null!==(i=s.serviceMessage)&&void 0!==i?i:s.message}`}))}catch(e){d.current||(r(!1),"AbortError"!==e.name&&t.addDanger({title:l.a,text:e.message}))}else r(!1)})(),()=>{d.current=!0,b.current.abort()})),[e,n,t]),{incidentTypes:s,isLoading:i}})({http:f,toastNotifications:y.toasts,connector:n}),{isLoading:E,severity:O}=(({http:e,toastNotifications:t,connector:n})=>{const[i,r]=Object(a.useState)(!0),[s,u]=Object(a.useState)([]),d=Object(a.useRef)(new AbortController),b=Object(a.useRef)(!1);return Object(a.useEffect)((()=>(b.current=!1,d.current.abort(),(async()=>{if(n)try{d.current=new AbortController,r(!0);const s=await async function({http:e,signal:t,connectorId:n}){const a=await e.post(Object(c.d)(n),{body:JSON.stringify({params:{subAction:"severity",subActionParams:{}}}),signal:t});return Object(o.a)(a)}({http:e,signal:d.current.signal,connectorId:n.id});var a,i;b.current||(r(!1),u(null!==(a=s.data)&&void 0!==a?a:[]),s.status&&"error"===s.status&&t.addDanger({title:l.d,text:`${null!==(i=s.serviceMessage)&&void 0!==i?i:s.message}`}))}catch(e){b.current||(r(!1),"AbortError"!==e.name&&t.addDanger({title:l.d,text:e.message}))}else r(!1)})(),()=>{b.current=!0,d.current.abort()})),[e,n,t]),{severity:s,isLoading:i}})({http:f,toastNotifications:y.toasts,connector:n}),h=Object(a.useMemo)((()=>O.map((e=>({value:e.id.toString(),text:e.name})))),[O]),S=Object(a.useMemo)((()=>v?v.map((e=>({label:e.name,value:e.id.toString()}))):[]),[v]),C=Object(a.useMemo)((()=>{var e,t;return[...null!=p&&p.length>0?[{title:l.b,description:v.filter((e=>p.includes(e.id.toString()))).map((e=>e.name)).join(", ")}]:[],...null!=g&&g.length>0?[{title:l.e,description:null!==(e=null===(t=O.find((e=>e.id.toString()===g)))||void 0===t?void 0:t.name)&&void 0!==e?e:""}]:[]]}),[p,g,v,O]),w=Object(a.useCallback)(((e,n)=>{b({...t,incidentTypes:p,severityCode:g,[e]:n})}),[p,g,b,t]),x=Object(a.useMemo)((()=>{const e=v.reduce(((e,t)=>({...e,[t.id.toString()]:t.name})),{});return p?p.map((t=>({label:e[t.toString()],value:t.toString()}))).filter((e=>null!=e.label)):[]}),[v,p]),I=Object(a.useCallback)((e=>{w("incidentTypes",e.map((e=>{var t;return null!==(t=e.value)&&void 0!==t?t:e.label})))}),[w]),T=Object(a.useCallback)((()=>{p||w("incidentTypes",[])}),[p,w]);return Object(a.useEffect)((()=>{m.current&&(m.current=!1,b({incidentTypes:p,severityCode:g}))}),[p,b,g]),e?i.a.createElement("span",{"data-test-subj":"connector-fields-resilient"},i.a.createElement(r.EuiFormRow,{fullWidth:!0,label:l.b},i.a.createElement(r.EuiComboBox,{"data-test-subj":"incidentTypeComboBox",fullWidth:!0,isClearable:!0,isDisabled:j,isLoading:j,onBlur:T,onChange:I,options:S,placeholder:l.c,selectedOptions:x})),i.a.createElement(r.EuiSpacer,{size:"m"}),i.a.createElement(r.EuiFormRow,{fullWidth:!0,label:l.e},i.a.createElement(r.EuiSelect,{"data-test-subj":"severitySelect",disabled:E,fullWidth:!0,hasNoInitialSelection:!0,isLoading:E,onChange:e=>w("severityCode",e.target.value),options:h,value:null!=g?g:void 0})),i.a.createElement(r.EuiSpacer,{size:"m"})):i.a.createElement(d.a,{connectorType:u.o.resilient,isLoading:j||E,listItems:C,title:n.name})}},95:function(e,t,n){"use strict";n.d(t,"a",(function(){return b}));var a=n(1),i=n.n(a),r=n(13),s=n(37),c=n.n(s),o=n(5),l=n(93);const u=c.a.span.withConfig({displayName:"StyledText",componentId:"sc-10fyrf5-0"})(["span{display:block;}"]),d=({connectorType:e,title:t,listItems:n,isLoading:s})=>{const{triggersActionsUi:c}=Object(o.f)().services,d=Object(a.useMemo)((()=>i.a.createElement(u,null,n.length>0&&n.map(((e,t)=>i.a.createElement("span",{"data-test-subj":"card-list-item",key:`${e.title}-${t}`},i.a.createElement("strong",null,`${e.title}: `),e.description))))),[n]),b=Object(a.useMemo)((()=>i.a.createElement(r.EuiIcon,{size:"xl",type:Object(l.b)(c,e)})),[e]);return i.a.createElement(i.a.Fragment,null,s&&i.a.createElement(r.EuiLoadingSpinner,{"data-test-subj":"connector-card-loading"}),!s&&i.a.createElement(r.EuiFlexGroup,{direction:"row"},i.a.createElement(r.EuiFlexItem,null,i.a.createElement(r.EuiCard,{"data-test-subj":"connector-card",description:d,display:"plain",layout:"horizontal",paddingSize:"none",title:t,titleSize:"xs"})),i.a.createElement(r.EuiFlexItem,{grow:!1},b)))};d.displayName="ConnectorCardDisplay";const b=Object(a.memo)(d)}}]);