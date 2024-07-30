/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.stackConnectors_bundle_jsonpfunction=window.stackConnectors_bundle_jsonpfunction||[]).push([[28,50],{55:function(e,t,n){"use strict";n.r(t),n.d(t,"SUMMARY_REQUIRED",(function(){return r})),n.d(t,"DEDUP_KEY_REQUIRED",(function(){return o})),n.d(t,"INTEGRATION_KEY_REQUIRED",(function(){return i})),n.d(t,"API_URL_LABEL",(function(){return s})),n.d(t,"API_URL_INVALID",(function(){return u})),n.d(t,"INTEGRATION_KEY_LABEL",(function(){return c}));var a=n(1);const r=a.i18n.translate("xpack.stackConnectors.components.pagerDuty.error.requiredSummaryText",{defaultMessage:"Summary is required."}),o=a.i18n.translate("xpack.stackConnectors.components.pagerDuty.error.requiredDedupKeyText",{defaultMessage:"DedupKey is required when resolving or acknowledging an incident."}),i=a.i18n.translate("xpack.stackConnectors.components.pagerDuty.error.requiredRoutingKeyText",{defaultMessage:"An integration key / routing key is required."}),s=a.i18n.translate("xpack.stackConnectors.components.pagerDuty.apiUrlTextFieldLabel",{defaultMessage:"API URL (optional)"}),u=a.i18n.translate("xpack.stackConnectors.components.pagerDuty.apiUrlInvalid",{defaultMessage:"Invalid API URL"}),c=a.i18n.translate("xpack.stackConnectors.components.pagerDuty.routingKeyTextFieldLabel",{defaultMessage:"Integration key"})},71:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return E}));var a=n(0),r=n.n(a),o=n(17),i=n(7),s=n(20),u=n(18),c=n(21),l=n(19),d=n(2),p=n(55),g=n(16);const{emptyField:f,urlField:y}=c.fieldValidators,I=e=>({label:p.INTEGRATION_KEY_LABEL,helpText:Object(g.jsx)(o.EuiLink,{href:e.links.alerting.pagerDutyAction,target:"_blank"},Object(g.jsx)(s.FormattedMessage,{id:"xpack.stackConnectors.components.pagerDuty.routingKeyNameHelpLabel",defaultMessage:"Configure a PagerDuty account"})),validations:[{validator:f(p.INTEGRATION_KEY_REQUIRED)}]}),E=({readOnly:e,isEdit:t})=>{const{docLinks:n}=Object(d.useKibana)().services;return Object(g.jsx)(r.a.Fragment,null,Object(g.jsx)(u.UseField,{path:"config.apiUrl",component:l.Field,config:{label:p.API_URL_LABEL,validations:[{validator:e=>{const{value:t}=e;if(!Object(i.isEmpty)(t))return y(p.API_URL_INVALID)(e)}}]},componentProps:{euiFieldProps:{readOnly:e,"data-test-subj":"pagerdutyApiUrlInput",fullWidth:!0}}}),Object(g.jsx)(u.UseField,{path:"secrets.routingKey",config:I(n),component:l.Field,componentProps:{euiFieldProps:{readOnly:e,"data-test-subj":"pagerdutyRoutingKeyInput",fullWidth:!0}}}))}}}]);