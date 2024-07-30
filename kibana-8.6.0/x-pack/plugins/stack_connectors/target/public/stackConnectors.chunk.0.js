/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.stackConnectors_bundle_jsonpfunction=window.stackConnectors_bundle_jsonpfunction||[]).push([[0],{30:function(e,t,n){"use strict";n.r(t),n.d(t,"API_URL_LABEL",(function(){return a})),n.d(t,"API_URL_INVALID",(function(){return o})),n.d(t,"AUTHENTICATION_LABEL",(function(){return r})),n.d(t,"USERNAME_LABEL",(function(){return c})),n.d(t,"USERNAME_REQUIRED",(function(){return i})),n.d(t,"PASSWORD_LABEL",(function(){return u})),n.d(t,"TITLE_REQUIRED",(function(){return l})),n.d(t,"INCIDENT",(function(){return d})),n.d(t,"SECURITY_INCIDENT",(function(){return p})),n.d(t,"SHORT_DESCRIPTION_LABEL",(function(){return f})),n.d(t,"DESCRIPTION_LABEL",(function(){return E})),n.d(t,"COMMENTS_LABEL",(function(){return k})),n.d(t,"CHOICES_API_ERROR",(function(){return N})),n.d(t,"CATEGORY_LABEL",(function(){return C})),n.d(t,"SUBCATEGORY_LABEL",(function(){return T})),n.d(t,"URGENCY_LABEL",(function(){return L})),n.d(t,"SEVERITY_LABEL",(function(){return I})),n.d(t,"IMPACT_LABEL",(function(){return v})),n.d(t,"PRIORITY_LABEL",(function(){return x})),n.d(t,"API_INFO_ERROR",(function(){return S})),n.d(t,"FETCH_ERROR",(function(){return _})),n.d(t,"INSTALLATION_CALLOUT_TITLE",(function(){return m})),n.d(t,"UPDATE_SUCCESS_TOAST_TITLE",(function(){return R})),n.d(t,"UPDATE_SUCCESS_TOAST_TEXT",(function(){return A})),n.d(t,"VISIT_SN_STORE",(function(){return w})),n.d(t,"SETUP_DEV_INSTANCE",(function(){return g})),n.d(t,"SN_INSTANCE_LABEL",(function(){return M})),n.d(t,"UNKNOWN",(function(){return U})),n.d(t,"CORRELATION_ID",(function(){return D})),n.d(t,"CORRELATION_DISPLAY",(function(){return y})),n.d(t,"EVENT",(function(){return F})),n.d(t,"SOURCE",(function(){return O})),n.d(t,"EVENT_CLASS",(function(){return b})),n.d(t,"RESOURCE",(function(){return P})),n.d(t,"NODE",(function(){return h})),n.d(t,"METRIC_NAME",(function(){return B})),n.d(t,"TYPE",(function(){return K})),n.d(t,"MESSAGE_KEY",(function(){return q})),n.d(t,"SEVERITY_REQUIRED",(function(){return Y})),n.d(t,"SEVERITY_REQUIRED_LABEL",(function(){return V})),n.d(t,"CLIENTID_LABEL",(function(){return Q})),n.d(t,"CLIENTSECRET_LABEL",(function(){return H})),n.d(t,"KEY_ID_LABEL",(function(){return W})),n.d(t,"USER_IDENTIFIER_LABEL",(function(){return G})),n.d(t,"PRIVATE_KEY_LABEL",(function(){return j})),n.d(t,"PRIVATE_KEY_PASSWORD_LABEL",(function(){return J})),n.d(t,"PRIVATE_KEY_PASSWORD_HELPER_TEXT",(function(){return X})),n.d(t,"CLIENTID_REQUIRED",(function(){return z})),n.d(t,"PRIVATE_KEY_REQUIRED",(function(){return Z})),n.d(t,"KEYID_REQUIRED",(function(){return $})),n.d(t,"USER_IDENTIFIER_REQUIRED",(function(){return ee})),n.d(t,"IS_OAUTH",(function(){return te}));var s=n(1);const a=s.i18n.translate("xpack.stackConnectors.components.serviceNow.apiUrlTextFieldLabel",{defaultMessage:"ServiceNow instance URL"}),o=s.i18n.translate("xpack.stackConnectors.components.serviceNow.invalidApiUrlTextField",{defaultMessage:"URL is invalid."}),r=s.i18n.translate("xpack.stackConnectors.components.serviceNow.authenticationLabel",{defaultMessage:"Authentication"}),c=s.i18n.translate("xpack.stackConnectors.components.serviceNow.usernameTextFieldLabel",{defaultMessage:"Username"}),i=s.i18n.translate("xpack.stackConnectors.components.serviceNow.requiredUsernameTextField",{defaultMessage:"Username is required."}),u=s.i18n.translate("xpack.stackConnectors.components.serviceNow.passwordTextFieldLabel",{defaultMessage:"Password"}),l=s.i18n.translate("xpack.stackConnectors.components.serviceNow.requiredShortDescTextField",{defaultMessage:"Short description is required."}),d=s.i18n.translate("xpack.stackConnectors.components.serviceNow.title",{defaultMessage:"Incident"}),p=s.i18n.translate("xpack.stackConnectors.components.serviceNowSIR.title",{defaultMessage:"Security Incident"}),f=s.i18n.translate("xpack.stackConnectors.components.serviceNow.titleFieldLabel",{defaultMessage:"Short description (required)"}),E=s.i18n.translate("xpack.stackConnectors.components.serviceNow.descriptionTextAreaFieldLabel",{defaultMessage:"Description"}),k=s.i18n.translate("xpack.stackConnectors.components.serviceNow.commentsTextAreaFieldLabel",{defaultMessage:"Additional comments"}),N=s.i18n.translate("xpack.stackConnectors.components.serviceNow.unableToGetChoicesMessage",{defaultMessage:"Unable to get choices"}),C=s.i18n.translate("xpack.stackConnectors.components.serviceNow.categoryTitle",{defaultMessage:"Category"}),T=s.i18n.translate("xpack.stackConnectors.components.serviceNow.subcategoryTitle",{defaultMessage:"Subcategory"}),L=s.i18n.translate("xpack.stackConnectors.components.serviceNow.urgencySelectFieldLabel",{defaultMessage:"Urgency"}),I=s.i18n.translate("xpack.stackConnectors.components.serviceNow.severitySelectFieldLabel",{defaultMessage:"Severity"}),v=s.i18n.translate("xpack.stackConnectors.components.serviceNow.impactSelectFieldLabel",{defaultMessage:"Impact"}),x=s.i18n.translate("xpack.stackConnectors.components.serviceNow.prioritySelectFieldLabel",{defaultMessage:"Priority"}),S=e=>s.i18n.translate("xpack.stackConnectors.components.serviceNow.apiInfoError",{values:{status:e},defaultMessage:"Received status: {status} when attempting to get application information"}),_=s.i18n.translate("xpack.stackConnectors.components.serviceNow.fetchErrorMsg",{defaultMessage:"Failed to fetch. Check the URL or the CORS configuration of your ServiceNow instance."}),m=s.i18n.translate("xpack.stackConnectors.components.serviceNow.installationCalloutTitle",{defaultMessage:"To use this connector, first install the Elastic app from the ServiceNow app store."}),R=e=>s.i18n.translate("xpack.stackConnectors.components.serviceNow.updateSuccessToastTitle",{defaultMessage:"{connectorName} connector updated",values:{connectorName:e}}),A=s.i18n.translate("xpack.stackConnectors.components.serviceNow.updateCalloutText",{defaultMessage:"Connector has been updated."}),w=s.i18n.translate("xpack.stackConnectors.components.serviceNow.visitSNStore",{defaultMessage:"Visit ServiceNow app store"}),g=s.i18n.translate("xpack.stackConnectors.components.serviceNow.setupDevInstance",{defaultMessage:"setup a developer instance"}),M=s.i18n.translate("xpack.stackConnectors.components.serviceNow.snInstanceLabel",{defaultMessage:"ServiceNow instance"}),U=s.i18n.translate("xpack.stackConnectors.components.serviceNow.unknown",{defaultMessage:"UNKNOWN"}),D=s.i18n.translate("xpack.stackConnectors.components.serviceNow.correlationID",{defaultMessage:"Correlation ID (optional)"}),y=s.i18n.translate("xpack.stackConnectors.components.serviceNow.correlationDisplay",{defaultMessage:"Correlation display (optional)"}),F=s.i18n.translate("xpack.stackConnectors.components.serviceNowITOM.event",{defaultMessage:"Event"}),O=s.i18n.translate("xpack.stackConnectors.components.serviceNow.sourceTextAreaFieldLabel",{defaultMessage:"Source"}),b=s.i18n.translate("xpack.stackConnectors.components.serviceNow.eventClassTextAreaFieldLabel",{defaultMessage:"Source instance"}),P=s.i18n.translate("xpack.stackConnectors.components.serviceNow.resourceTextAreaFieldLabel",{defaultMessage:"Resource"}),h=s.i18n.translate("xpack.stackConnectors.components.serviceNow.nodeTextAreaFieldLabel",{defaultMessage:"Node"}),B=s.i18n.translate("xpack.stackConnectors.components.serviceNow.metricNameTextAreaFieldLabel",{defaultMessage:"Metric name"}),K=s.i18n.translate("xpack.stackConnectors.components.serviceNow.typeTextAreaFieldLabel",{defaultMessage:"Type"}),q=s.i18n.translate("xpack.stackConnectors.components.serviceNow.messageKeyTextAreaFieldLabel",{defaultMessage:"Message key"}),Y=s.i18n.translate("xpack.stackConnectors.components.serviceNow.requiredSeverityTextField",{defaultMessage:"Severity is required."}),V=s.i18n.translate("xpack.stackConnectors.components.serviceNow.severityRequiredSelectFieldLabel",{defaultMessage:"Severity (required)"}),Q=s.i18n.translate("xpack.stackConnectors.components.serviceNow.clientIdTextFieldLabel",{defaultMessage:"Client ID"}),H=s.i18n.translate("xpack.stackConnectors.components.serviceNow.clientSecretTextFieldLabel",{defaultMessage:"Client Secret"}),W=s.i18n.translate("xpack.stackConnectors.components.serviceNow.keyIdTextFieldLabel",{defaultMessage:"JWT Verifier Key ID"}),G=s.i18n.translate("xpack.stackConnectors.components.serviceNow.userEmailTextFieldLabel",{defaultMessage:"User Identifier"}),j=s.i18n.translate("xpack.stackConnectors.components.serviceNow.privateKeyTextFieldLabel",{defaultMessage:"Private Key"}),J=s.i18n.translate("xpack.stackConnectors.components.serviceNow.privateKeyPassTextFieldLabel",{defaultMessage:"Private Key Password"}),X=s.i18n.translate("xpack.stackConnectors.components.serviceNow.privateKeyPassLabelHelpText",{defaultMessage:"This is only required if you have set a password on your private key"}),z=s.i18n.translate("xpack.stackConnectors.components.serviceNow.requiredClientIdTextField",{defaultMessage:"Client ID is required."}),Z=s.i18n.translate("xpack.stackConnectors.components.serviceNow.requiredPrivateKeyTextField",{defaultMessage:"Private Key is required."}),$=s.i18n.translate("xpack.stackConnectors.components.serviceNow.requiredKeyIdTextField",{defaultMessage:"JWT Verifier Key ID is required."}),ee=s.i18n.translate("xpack.stackConnectors.components.serviceNow.requiredUserIdentifierTextField",{defaultMessage:"User Identifier is required."}),te=s.i18n.translate("xpack.stackConnectors.components.serviceNow.useOAuth",{defaultMessage:"Use OAuth authentication"})}}]);