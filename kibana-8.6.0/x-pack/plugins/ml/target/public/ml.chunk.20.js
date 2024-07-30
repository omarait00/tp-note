/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.ml_bundle_jsonpfunction=window.ml_bundle_jsonpfunction||[]).push([[20],{635:function(e,t,n){"use strict";n.r(t);var l=n(17),o=n.n(l),a=n(44),i=n(45),d=n(46),s=n(19),u=n(81),r=n(121),c=n(99),j=n(13);function m(e){return void 0===e.node&&e.state===s.c.OPENING}t.default=({jobIds:e})=>{const{http:t}=Object(d.useKibana)().services,n=Object(l.useMemo)((()=>Object(u.mlApiServicesProvider)(new r.a(t))),[t]),[s,b]=Object(l.useState)(0),[f,g]=Object(l.useState)(null),p=Object(l.useCallback)((async()=>{try{if(0===e.length)return void b(0);const{lazyNodeCount:t}=await n.mlNodeCount();if(0===t)return void b(0);const{jobs:l}=await n.getJobStats({jobId:e.join(",")}),o=l.filter(m);b(o.length)}catch(e){b(0),console.error("Could not determine ML node information",e)}}),[e]),h=Object(l.useCallback)((async()=>{if(0!==s)try{var e;const t=await n.mlInfo(),l=null!==(e=t.cloudId)&&void 0!==e?e:null,o=!0===t.isCloudTrial;g({isCloud:null!==l,cloudId:l,isCloudTrial:o,deploymentId:null===l?null:Object(c.a)(l)})}catch(e){g(null),console.error("Could not determine cloud information",e)}}),[s]);return Object(l.useEffect)((()=>{h()}),[s]),Object(l.useEffect)((()=>{p()}),[e]),0===s?null:Object(j.jsx)(o.a.Fragment,null,Object(j.jsx)(a.EuiCallOut,{title:Object(j.jsx)(i.FormattedMessage,{id:"xpack.ml.jobsAwaitingNodeWarningShared.title",defaultMessage:"Awaiting machine learning node"}),color:"primary",iconType:"iInCircle"},Object(j.jsx)("div",null,Object(j.jsx)(i.FormattedMessage,{id:"xpack.ml.jobsAwaitingNodeWarningShared.noMLNodesAvailableDescription",defaultMessage:"There {jobCount, plural, one {is} other {are}} {jobCount, plural, one {# job} other {# jobs}} waiting for machine learning nodes to start.",values:{jobCount:s}}),Object(j.jsx)(a.EuiSpacer,{size:"s"}),f&&(f.isCloud?Object(j.jsx)(o.a.Fragment,null,Object(j.jsx)(i.FormattedMessage,{id:"xpack.ml.jobsAwaitingNodeWarningShared.isCloud",defaultMessage:"Elastic Cloud deployments can autoscale to add more ML capacity. This may take 5-20 minutes. "}),null===f.deploymentId?null:Object(j.jsx)(i.FormattedMessage,{id:"xpack.ml.jobsAwaitingNodeWarningShared.isCloud.link",defaultMessage:"You can monitor progress in the {link}.",values:{link:Object(j.jsx)(a.EuiLink,{href:`https://cloud.elastic.co/deployments?q=${f.deploymentId}`},Object(j.jsx)(i.FormattedMessage,{id:"xpack.ml.jobsAwaitingNodeWarningShared.linkToCloud.linkText",defaultMessage:"Elastic Cloud admin console"}))}})):Object(j.jsx)(i.FormattedMessage,{id:"xpack.ml.jobsAwaitingNodeWarningShared.notCloud",defaultMessage:"Only Elastic Cloud deployments can autoscale; you must add machine learning nodes. {link}",values:{link:Object(j.jsx)(a.EuiLink,{href:"https://www.elastic.co/guide/en/elasticsearch/reference/master/modules-node.html#ml-node"},Object(j.jsx)(i.FormattedMessage,{id:"xpack.ml.jobsAwaitingNodeWarningShared.linkToCloud.learnMore",defaultMessage:"Learn more."}))}})))),Object(j.jsx)(a.EuiSpacer,{size:"m"}))}},99:function(e,t,n){"use strict";n.d(t,"g",(function(){return d})),n.d(t,"c",(function(){return s})),n.d(t,"d",(function(){return u})),n.d(t,"e",(function(){return r})),n.d(t,"f",(function(){return c})),n.d(t,"b",(function(){return j})),n.d(t,"a",(function(){return m}));var l=n(81);let o={anomaly_detectors:{},datafeeds:{}},a={};const i={cloudId:null,isCloud:!1,isCloudTrial:!1,deploymentId:null};async function d(){try{var e;const t=await l.ml.mlInfo();return o=t.defaults,a=t.limits,i.cloudId=null!==(e=t.cloudId)&&void 0!==e?e:null,i.isCloud=void 0!==t.cloudId,i.isCloudTrial=!0===t.isCloudTrial,i.deploymentId=t.cloudId?m(t.cloudId):null,{defaults:o,limits:a,cloudId:i}}catch(e){return{defaults:o,limits:a,cloudId:i}}}function s(){return o}function u(){return a}function r(){return i.isCloud}function c(){return i.isCloudTrial}function j(){return i.deploymentId}function m(e){const t=e.replace(/^(.+)?:/,"");try{const e=atob(t).match(/^.+\$(.+)(?=\$)/);return null!==e&&2===e.length?e[1]:null}catch(e){return null}}}}]);