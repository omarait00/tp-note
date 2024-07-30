/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.monitoring_bundle_jsonpfunction=window.monitoring_bundle_jsonpfunction||[]).push([[3],{151:function(e,t,a){"use strict";a.r(t),a.d(t,"Expression",(function(){return g}));var r=a(5),s=a.n(r),l=a(6),n=a(14),u=a(0),o=a(38),i=a(4),c=a(39),m=a(2);const b=e=>{const{name:t,details:a,setRuleParams:s,errors:n}=e,[u,o]=Object(r.useState)(e.value);return Object(m.jsx)(l.EuiFormRow,{label:a.label,error:n,isInvalid:(null==n?void 0:n.length)>0},Object(m.jsx)(l.EuiFieldNumber,{compressed:!0,value:u,append:a.append,onChange:e=>{let a=Number(e.target.value);isNaN(a)&&(a=0),o(a),s(t,a)}}))},d=e=>{const{name:t,label:a,setRuleParams:s,errors:n,placeholder:u}=e,[o,i]=Object(r.useState)(e.value);return Object(m.jsx)(l.EuiFormRow,{label:a,error:n,isInvalid:(null==n?void 0:n.length)>0},Object(m.jsx)(l.EuiFieldText,{compressed:!0,placeholder:u,value:o,onChange:e=>{const a=e.target.value;i(a),s(t,a)}}))};var j=a(46),x=a(45),p=a(44);const g=e=>{const{ruleParams:t,paramDetails:a,setRuleParams:g,errors:O,config:v,dataViews:f}=e,{derivedIndexPattern:E}=Object(j.a)(f,v),h=Object.keys(a).map((e=>{const r=a[e],s=t[e];switch(null==r?void 0:r.type){case i.b.Duration:return Object(m.jsx)(o.a,{key:e,name:e,duration:s,label:null==r?void 0:r.label,errors:O[e],setRuleParams:g});case i.b.Percentage:return Object(m.jsx)(c.a,{key:e,name:e,label:null==r?void 0:r.label,percentage:s,errors:O[e],setRuleParams:g});case i.b.Number:return Object(m.jsx)(b,{key:e,name:e,details:r,value:s,errors:O[e],setRuleParams:g});case i.b.TextField:return Object(m.jsx)(d,{key:e,name:e,label:null==r?void 0:r.label,value:s,errors:O[e],setRuleParams:g})}})),y=Object(r.useCallback)((e=>{E&&g("filterQueryText",e),E&&g("filterQuery",Object(p.a)(e,E)||"")}),[g,E]),F=Object(r.useCallback)(Object(n.debounce)(y,500),[y]),N=E?Object(m.jsx)(x.a,{value:t.filterQueryText,derivedIndexPattern:E,onSubmit:y,onChange:F}):Object(m.jsx)(s.a.Fragment,null);return Object(m.jsx)(r.Fragment,null,Object(m.jsx)(l.EuiForm,{component:"form"},h,Object(m.jsx)(l.EuiSpacer,null),Object(m.jsx)(l.EuiFormRow,{label:u.i18n.translate("xpack.monitoring.alerts.filterLable",{defaultMessage:"Filter"}),helpText:u.i18n.translate("xpack.monitoring.alerts.filterHelpText",{defaultMessage:"Use a KQL expression to limit the scope of your alert trigger."})},N),Object(m.jsx)(l.EuiSpacer,null)))};t.default=g},38:function(e,t,a){"use strict";a.d(t,"a",(function(){return m}));var r,s=a(5),l=a.n(s),n=a(0),u=a(6),o=a(2);function i(e=r.SECOND,t="0"){switch(e){case r.SECOND:return n.i18n.translate("xpack.monitoring.alerts.flyoutExpressions.timeUnits.secondLabel",{defaultMessage:"{timeValue, plural, one {second} other {seconds}}",values:{timeValue:t}});case r.MINUTE:return n.i18n.translate("xpack.monitoring.alerts.flyoutExpressions.timeUnits.minuteLabel",{defaultMessage:"{timeValue, plural, one {minute} other {minutes}}",values:{timeValue:t}});case r.HOUR:return n.i18n.translate("xpack.monitoring.alerts.flyoutExpressions.timeUnits.hourLabel",{defaultMessage:"{timeValue, plural, one {hour} other {hours}}",values:{timeValue:t}});case r.DAY:return n.i18n.translate("xpack.monitoring.alerts.flyoutExpressions.timeUnits.dayLabel",{defaultMessage:"{timeValue, plural, one {day} other {days}}",values:{timeValue:t}})}}!function(e){e.SECOND="s",e.MINUTE="m",e.HOUR="h",e.DAY="d"}(r||(r={}));const c=/(\d+)([smhd]{1})/,m=e=>{const{name:t,label:a,setRuleParams:s,errors:n}=e,m=c.exec(e.duration),b=m&&m[1]?parseInt(m[1],10):1,d=m&&m[2]?m[2]:r.MINUTE,[j,x]=l.a.useState(b),[p,g]=l.a.useState(d),O=Object.values(r).map((e=>({value:e,text:i(e)})));return l.a.useEffect((()=>{s(t,`${j}${p}`)}),[p,j]),Object(o.jsx)(u.EuiFormRow,{label:a,error:n,isInvalid:(null==n?void 0:n.length)>0},Object(o.jsx)(u.EuiFlexGroup,null,Object(o.jsx)(u.EuiFlexItem,{grow:2},Object(o.jsx)(u.EuiFieldNumber,{compressed:!0,value:j,onChange:e=>{let t=parseInt(e.target.value,10);isNaN(t)&&(t=0),x(t)}})),Object(o.jsx)(u.EuiFlexItem,{grow:4},Object(o.jsx)(u.EuiSelect,{compressed:!0,value:p,onChange:e=>g(e.target.value),options:O}))))}},39:function(e,t,a){"use strict";a.d(t,"a",(function(){return u}));var r=a(5),s=a.n(r),l=a(6),n=a(2);const u=e=>{const{name:t,label:a,setRuleParams:r,errors:u}=e,[o,i]=s.a.useState(e.percentage);return Object(n.jsx)(l.EuiFormRow,{label:a,error:u,isInvalid:u.length>0},Object(n.jsx)(l.EuiFieldNumber,{compressed:!0,value:o,append:Object(n.jsx)(l.EuiText,{size:"xs"},Object(n.jsx)("strong",null,"%")),onChange:e=>{let a=parseInt(e.target.value,10);isNaN(a)&&(a=0),i(a),r(t,a)}}))}}}]);