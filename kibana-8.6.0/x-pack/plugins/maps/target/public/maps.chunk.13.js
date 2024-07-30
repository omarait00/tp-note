/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.maps_bundle_jsonpfunction=window.maps_bundle_jsonpfunction||[]).push([[13],{560:function(e,t,n){"use strict";n.r(t),n.d(t,"InspectorFlyoutContentContainer",(function(){return h}));var a=n(5),i=n.n(a),s=n(105),l=n.n(s),r=n(159),u=n.n(r),c=n(98),o=n.n(c),d=n(158),j=n.n(d),g=n(1),b=n(47),m=n(15),f=n(2),p=function(e){var t=e.form,n=e.tagsReferences,a=e.TagList,s=e.TagSelector,l=e.isReadonly,r=t.title,u=t.setTitle,c=t.description,o=t.setDescription,d=t.tags,j=t.setTags,b=t.isSubmitted,p=t.isValid,O=t.getErrors;return Object(f.jsx)(m.EuiForm,{isInvalid:b&&!1===p,error:O(),"data-test-subj":"metadataForm"},Object(f.jsx)(m.EuiFormRow,{label:g.i18n.translate("contentManagement.inspector.metadataForm.nameInputLabel",{defaultMessage:"Name"}),error:r.errorMessage,isInvalid:!r.isChangingValue&&!r.isValid,fullWidth:!0},Object(f.jsx)(m.EuiFieldText,{isInvalid:!r.isChangingValue&&!r.isValid,value:r.value,onChange:function(e){u(e.target.value)},fullWidth:!0,"data-test-subj":"nameInput",readOnly:l})),Object(f.jsx)(m.EuiSpacer,null),Object(f.jsx)(m.EuiFormRow,{label:g.i18n.translate("contentManagement.inspector.metadataForm.descriptionInputLabel",{defaultMessage:"Description"}),error:c.errorMessage,isInvalid:!c.isChangingValue&&!c.isValid,fullWidth:!0},Object(f.jsx)(m.EuiTextArea,{isInvalid:!c.isChangingValue&&!c.isValid,value:c.value,onChange:function(e){o(e.target.value)},fullWidth:!0,"data-test-subj":"descriptionInput",readOnly:l})),a&&!0===l&&Object(f.jsx)(i.a.Fragment,null,Object(f.jsx)(m.EuiSpacer,null),Object(f.jsx)(m.EuiFormRow,{label:g.i18n.translate("contentManagement.inspector.metadataForm.tagsLabel",{defaultMessage:"Tags"}),fullWidth:!0},Object(f.jsx)(a,{references:n}))),s&&!1===l&&Object(f.jsx)(i.a.Fragment,null,Object(f.jsx)(m.EuiSpacer,null),Object(f.jsx)(s,{initialSelection:d.value,onTagsSelected:j,fullWidth:!0})))},O=n(3),v=n.n(O),x={title:function(e){return"string"==typeof e&&""===e.trim()?g.i18n.translate("contentManagement.inspector.metadataForm.nameIsEmptyError",{defaultMessage:"A name is required."}):null},description:null,tags:null},y=function(e){var t=e.item,n=e.entityName,s=e.isReadonly,r=void 0===s||s,c=e.services,d=c.TagSelector,O=c.TagList,y=c.notifyError,h=e.onSave,E=e.onCancel,F=Object(m.useEuiTheme)().euiTheme,M=function(e){var t=e.entityName;return{title:g.i18n.translate("contentManagement.inspector.flyoutTitle",{defaultMessage:"Inspector"}),saveButtonLabel:g.i18n.translate("contentManagement.inspector.saveButtonLabel",{defaultMessage:"Update {entityName}",values:{entityName:t}}),cancelButtonLabel:g.i18n.translate("contentManagement.inspector.cancelButtonLabel",{defaultMessage:"Cancel"})}}({entityName:n}),T=Object(a.useState)(!1),C=o()(T,2),V=C[0],I=C[1],S=Object(a.useState)(!1),B=o()(S,2),L=B[0],w=B[1],k=function(e){var t,n=e.item,i=Object(a.useRef)({}),s=Object(a.useState)({title:{value:n.title,isValid:!0,isChangingValue:!1},description:{value:null!==(t=n.description)&&void 0!==t?t:"",isValid:!0,isChangingValue:!1},tags:{value:n.tags?n.tags.map((function(e){return e.id})):[],isValid:!0,isChangingValue:!1}}),r=o()(s,2),u=r[0],c=r[1],d=Object(a.useCallback)((function(e){return function(t){var n=x[e],a=!0,s=null;n&&(s=n(t),a=null===s);var r=i.current[e];r&&clearTimeout(r),i.current[e]=null,c((function(n){var i=n[e];return l()(l()({},n),{},v()({},e,l()(l()({},i),{},{isValid:a,isChangingValue:!0,errorMessage:s,value:t})))})),i.current[e]=setTimeout((function(){c((function(t){return l()(l()({},t),{},v()({},e,l()(l()({},t[e]),{},{isChangingValue:!1})))}))}),500)}}),[]),j=Object(a.useMemo)((function(){return d("title")}),[d]),g=Object(a.useMemo)((function(){return d("description")}),[d]),b=Object(a.useMemo)((function(){return d("tags")}),[d]),m=Object(a.useCallback)((function(){return Object.values(u).every((function(e){return e.isValid}))}),[u]),f=Object(a.useCallback)((function(){return Object.values(u).map((function(e){return e.errorMessage})).filter(Boolean)}),[u]),p=m();return{title:u.title,setTitle:j,description:u.description,setDescription:g,tags:u.tags,setTags:b,isValid:p,getErrors:f}}({item:t}),R=Object(a.useCallback)(u()(j.a.mark((function e(){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!k.isValid){e.next=14;break}if(!h){e.next=14;break}return I(!0),e.prev=3,e.next=6,h({id:t.id,title:k.title.value,description:k.description.value,tags:k.tags.value});case 6:e.next=11;break;case 8:e.prev=8,e.t0=e.catch(3),y(Object(f.jsx)(b.FormattedMessage,{id:"contentManagement.inspector.metadataForm.unableToSaveDangerMessage",defaultMessage:"Unable to save {entityName}",values:{entityName:n}}),e.t0.message);case 11:return e.prev=11,I(!1),e.finish(11);case 14:w(!0);case 15:case"end":return e.stop()}}),e,null,[[3,8,11,14]])}))),[k,h,t.id,y,n]),N=Object(f.css)("margin-right:",F.size.m,";","");return Object(f.jsx)(i.a.Fragment,null,Object(f.jsx)(m.EuiFlyoutHeader,null,Object(f.jsx)(m.EuiTitle,{"data-test-subj":"flyoutTitle"},Object(f.jsx)("h2",null,Object(f.jsx)(m.EuiIcon,{type:"inspect",css:N,size:"l"}),Object(f.jsx)("span",null,M.title)))),Object(f.jsx)(m.EuiFlyoutBody,null,Object(f.jsx)(p,{form:l()(l()({},k),{},{isSubmitted:L}),isReadonly:r,tagsReferences:t.tags,TagList:O,TagSelector:d})),Object(f.jsx)(m.EuiFlyoutFooter,null,Object(f.jsx)(i.a.Fragment,null,Object(f.jsx)(m.EuiFlexGroup,{justifyContent:"spaceBetween",alignItems:"center"},Object(f.jsx)(m.EuiFlexItem,{grow:!1},Object(f.jsx)(m.EuiButtonEmpty,{iconType:"cross",flush:"left",onClick:function(){E()},"data-test-subj":"closeFlyoutButton"},M.cancelButtonLabel)),!1===r&&Object(f.jsx)(m.EuiFlexItem,{grow:!1},Object(f.jsx)(m.EuiButton,{color:"primary",onClick:R,"data-test-subj":"saveButton",fill:!0,disabled:L&&!k.isValid,isLoading:V},M.saveButtonLabel))))))},h=function(e){return Object(f.jsx)(y,e)}}}]);