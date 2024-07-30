/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.triggersActionsUi_bundle_jsonpfunction=window.triggersActionsUi_bundle_jsonpfunction||[]).push([[18],{120:function(e,t,n){"use strict";n.d(t,"f",(function(){return o})),n.d(t,"e",(function(){return c})),n.d(t,"c",(function(){return i})),n.d(t,"b",(function(){return a})),n.d(t,"a",(function(){return s})),n.d(t,"d",(function(){return r}));const o=e=>{var t;return null==e||null===(t=e.actions)||void 0===t?void 0:t.show},c=e=>{var t;return null==e||null===(t=e.actions)||void 0===t?void 0:t.save},i=e=>{var t;return null==e||null===(t=e.actions)||void 0===t?void 0:t.execute},a=e=>{var t;return null==e||null===(t=e.actions)||void 0===t?void 0:t.delete};function s(e,t){var n,o;return null!==(n=null==t||null===(o=t.authorizedConsumers[e.consumer])||void 0===o?void 0:o.all)&&void 0!==n&&n}const r=e=>{var t,n;return null==e||null===(t=e.management)||void 0===t||null===(n=t.security)||void 0===n?void 0:n.api_keys}},123:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var o=n(3);const c={label:o.i18n.translate("xpack.triggersActionsUI.technicalPreviewBadgeLabel",{defaultMessage:"Technical preview"}),tooltipContent:o.i18n.translate("xpack.triggersActionsUI.technicalPreviewBadgeDescription",{defaultMessage:"This functionality is in technical preview and may be changed or removed completely in a future release. Elastic will take a best effort approach to fix any issues, but features in technical preview are not subject to the support SLA of official GA features."})}},141:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));const o=(e,t,n)=>{const o=n[t.actionTypeId];return e.filter((e=>e.actionTypeId===t.actionTypeId&&((null==o?void 0:o.enabledInConfig)||e.isPreconfigured)))}},147:function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var o=n(4),c=n(1),i=n.n(c),a=n(3),s=n(141),r=n(0);const l=i.a.memo(d);function d({actionItem:e,accordionIndex:t,actionTypesIndex:n,actionTypeRegistered:i,connectors:a,onConnectorSelected:l}){var d;const j=Object(c.useMemo)((()=>Object(s.a)(a,e,n)),[e,n,a]),p=Object(c.useMemo)((()=>u(e.id,j,i)),[e.id,j,i]),m=Object(c.useMemo)((()=>b(j,i)),[j,i]),[x,I]=Object(c.useState)(p.length>0?p[0]:void 0),f=Object(c.useCallback)((e=>{var t,n;I(e[0]),l(null!==(t=null===(n=e[0].value)||void 0===n?void 0:n.id)&&void 0!==t?t:"")}),[l]);return Object(r.jsx)(o.EuiComboBox,{"aria-label":g,"data-test-subj":`selectActionConnector-${e.actionTypeId}-${t}`,fullWidth:!0,singleSelection:{asPlainText:!0},id:`selectActionConnector-${e.id}`,isClearable:!1,onChange:f,options:m,selectedOptions:p,prepend:null==x||null===(d=x.value)||void 0===d?void 0:d.prependComponent})}const u=(e,t,n)=>{const o=t.find((t=>t.id===e));return o?[j(o,n)]:[]},b=(e,t)=>e.map((e=>j(e,t))),j=(e,t)=>{const n=p(e,t);let o;if(null!=t.customConnectorSelectItem){const n=t.customConnectorSelectItem.getComponent(e);n&&(o=Object(r.jsx)(n,{actionConnector:e}))}return{label:n,value:{title:n,id:e.id,prependComponent:o},key:e.id,"data-test-subj":`dropdown-connector-${e.id}`}},p=(e,t)=>null!=t.customConnectorSelectItem?t.customConnectorSelectItem.getText(e):e.name,g=a.i18n.translate("xpack.triggersActionsUI.sections.actionForm.incidentManagementSystemLabel",{defaultMessage:"Incident management system"})},96:function(e,t,n){"use strict";n.r(t),n.d(t,"AddConnectorInline",(function(){return p})),n.d(t,"default",(function(){return p}));var o=n(1),c=n.n(o),i=n(3),a=n(88),s=n(4),r=n(123),l=n(120),d=n(22),u=n(141),b=n(147),j=n(0);const p=({actionTypesIndex:e,actionItem:t,index:n,connectors:p,onAddConnector:g,onDeleteConnector:m,onSelectConnector:x,actionTypeRegistry:I,emptyActionsIds:f})=>{const{application:{capabilities:A}}=Object(d.b)().services,O=Object(l.e)(A),[v,C]=Object(o.useState)(!1),[y,T]=Object(o.useState)(!1),E=e?e[t.actionTypeId].name:t.actionTypeId,M=I.get(t.actionTypeId),h=Object(o.useMemo)((()=>[`Unable to load ${M.actionTypeTitle} connector`]),[M.actionTypeTitle]),k=Object(j.jsx)(a.FormattedMessage,{id:"xpack.triggersActionsUI.sections.connectorAddInline.emptyConnectorsLabel",defaultMessage:"No {actionTypeName} connectors",values:{actionTypeName:E}}),F=Object(j.jsx)(s.EuiText,{color:"danger"},Object(j.jsx)(a.FormattedMessage,{id:"xpack.triggersActionsUI.sections.connectorAddInline.unableToLoadConnectorTitle",defaultMessage:"Unable to load connector"}));Object(o.useEffect)((()=>{Object(u.a)(p,t,e).length>0&&C(!0),T(!!f.find((e=>t.id===e)))}),[]);const w=Object(j.jsx)(s.EuiFormRow,{fullWidth:!0,label:Object(j.jsx)(a.FormattedMessage,{id:"xpack.triggersActionsUI.sections.connectorAddInline.connectorAddInline.actionIdLabel",defaultMessage:"Use another {connectorInstance} connector",values:{connectorInstance:E}}),labelAppend:Object(j.jsx)(s.EuiButtonEmpty,{size:"xs","data-test-subj":`addNewActionConnectorButton-${t.actionTypeId}`,onClick:g},Object(j.jsx)(a.FormattedMessage,{defaultMessage:"Add connector",id:"xpack.triggersActionsUI.sections.connectorAddInline.connectorAddInline.addNewConnectorEmptyButton"})),error:h,isInvalid:!0},Object(j.jsx)(b.a,{actionItem:t,accordionIndex:n,actionTypesIndex:e,actionTypeRegistered:M,connectors:p,onConnectorSelected:x}));return Object(j.jsx)(c.a.Fragment,null,Object(j.jsx)(s.EuiAccordion,{key:n,initialIsOpen:!0,id:n.toString(),className:"actAccordionActionForm",buttonContentClassName:"actAccordionActionForm__button","data-test-subj":`alertActionAccordion-${n}`,buttonContent:Object(j.jsx)(s.EuiFlexGroup,{gutterSize:"s",alignItems:"center"},Object(j.jsx)(s.EuiFlexItem,{grow:!1},Object(j.jsx)(s.EuiIcon,{type:M.iconClass,size:"m"})),Object(j.jsx)(s.EuiFlexItem,null,Object(j.jsx)(s.EuiText,null,Object(j.jsx)("div",null,Object(j.jsx)(a.FormattedMessage,{defaultMessage:"{actionConnectorName}",id:"xpack.triggersActionsUI.sections.connectorAddInline.newRuleActionTypeEditTitle",values:{actionConnectorName:M.actionTypeTitle}})))),!y&&Object(j.jsx)(s.EuiFlexItem,{grow:!1},Object(j.jsx)(s.EuiIconTip,{type:"alert",size:"m",color:"danger","data-test-subj":"alertActionAccordionErrorTooltip",content:Object(j.jsx)(a.FormattedMessage,{defaultMessage:"Unable to load connector",id:"xpack.triggersActionsUI.sections.connectorAddInline.unableToLoadConnectorTitle'"})})),M&&M.isExperimental&&Object(j.jsx)(s.EuiFlexItem,{grow:!1},Object(j.jsx)(s.EuiBetaBadge,{label:r.a.label,tooltipContent:r.a.tooltipContent}))),extraAction:Object(j.jsx)(s.EuiButtonIcon,{iconType:"minusInCircle",color:"danger",className:"actAccordionActionForm__extraAction","aria-label":i.i18n.translate("xpack.triggersActionsUI.sections.connectorAddInline.accordion.deleteIconAriaLabel",{defaultMessage:"Delete"}),onClick:m}),paddingSize:"l"},O?v?w:Object(j.jsx)(s.EuiEmptyPrompt,{title:y?k:F,actions:Object(j.jsx)(s.EuiButton,{color:"primary",fill:!0,size:"s","data-test-subj":`createActionConnectorButton-${n}`,onClick:g},Object(j.jsx)(a.FormattedMessage,{id:"xpack.triggersActionsUI.sections.connectorAddInline.addConnectorButtonLabel",defaultMessage:"Create a connector"}))}):Object(j.jsx)(s.EuiCallOut,{title:k},Object(j.jsx)("p",null,Object(j.jsx)(a.FormattedMessage,{id:"xpack.triggersActionsUI.sections.connectorAddInline.unauthorizedToCreateForEmptyConnectors",defaultMessage:"Only authorized users can configure a connector. Contact your administrator."})))),Object(j.jsx)(s.EuiSpacer,{size:"xs"}))}}}]);