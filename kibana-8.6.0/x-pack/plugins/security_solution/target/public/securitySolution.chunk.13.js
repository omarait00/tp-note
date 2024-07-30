/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.securitySolution_bundle_jsonpfunction=window.securitySolution_bundle_jsonpfunction||[]).push([[13],{105:function(e,t,i){"use strict";i.d(t,"h",(function(){return s})),i.d(t,"k",(function(){return l})),i.d(t,"n",(function(){return o})),i.d(t,"q",(function(){return c})),i.d(t,"m",(function(){return r})),i.d(t,"o",(function(){return d})),i.d(t,"l",(function(){return p})),i.d(t,"p",(function(){return u})),i.d(t,"s",(function(){return h})),i.d(t,"i",(function(){return f})),i.d(t,"j",(function(){return g})),i.d(t,"g",(function(){return m})),i.d(t,"r",(function(){return v})),i.d(t,"u",(function(){return y})),i.d(t,"v",(function(){return w})),i.d(t,"t",(function(){return k})),i.d(t,"f",(function(){return b})),i.d(t,"b",(function(){return L})),i.d(t,"c",(function(){return C})),i.d(t,"e",(function(){return E})),i.d(t,"d",(function(){return S})),i.d(t,"a",(function(){return x}));var n=i(1),a=i(522);const s=`${n.Ob}/:tabName(${a.a.endpoints})`,l=`${n.Ob}/:tabName(${a.a.policies})`,o=`${n.Ob}/:tabName(${a.a.policies})/:policyId/settings`,c=`${n.Ob}/:tabName(${a.a.policies})/:policyId/trustedApps`,r=`${n.Ob}/:tabName(${a.a.policies})/:policyId/eventFilters`,d=`${n.Ob}/:tabName(${a.a.policies})/:policyId/hostIsolationExceptions`,p=`${n.Ob}/:tabName(${a.a.policies})/:policyId/blocklists`,u=`${n.Ob}/:tabName(${a.a.policies})/:policyId`,h=`${n.Ob}/:tabName(${a.a.trustedApps})`,f=`${n.Ob}/:tabName(${a.a.eventFilters})`,g=`${n.Ob}/:tabName(${a.a.hostIsolationExceptions})`,m=`${n.Ob}/:tabName(${a.a.blocklist})`,v=`${n.Ob}/:tabName(${a.a.responseActionsHistory})`,y="management",w="policyDetails",k="endpoints",b=[10,20,50],L=0,C=10,E="desc",S="created_at",x=1e4},1091:function(e,t,i){"use strict";function n(e,t,i,n){var a,s,l;return!!i||!!t&&null!==(a=null===(s=e.packagePrivileges)||void 0===s||null===(l=s.endpoint)||void 0===l?void 0:l.actions[n].executePackageAction)&&void 0!==a&&a}i.d(t,"c",(function(){return s})),i.d(t,"a",(function(){return a})),i.d(t,"b",(function(){return o}));const a=(e,t,i,a=!1,s={canWriteSecuritySolution:!1,canReadSecuritySolution:!1})=>{var l;const o=e.isPlatinumPlus(),c=e.isEnterprise(),r=i.includes("superuser"),{canWriteSecuritySolution:d=!1,canReadSecuritySolution:p=!1}=s,u=n(t,a,r,"writeEndpointList"),h=u||n(t,a,r,"readEndpointList"),f=n(t,a,r,"writePolicyManagement"),g=f||n(t,a,r,"readPolicyManagement"),m=n(t,a,r,"writeActionsLogManagement"),v=m||n(t,a,r,"readActionsLogManagement"),y=n(t,a,r,"writeHostIsolation"),w=n(t,a,r,"writeProcessOperations"),k=n(t,a,r,"writeTrustedApplications"),b=k||n(t,a,r,"readTrustedApplications"),L=n(t,a,r,"writeHostIsolationExceptions"),C=L||n(t,a,r,"readHostIsolationExceptions"),E=n(t,a,r,"writeBlocklist"),S=E||n(t,a,r,"readBlocklist"),x=n(t,a,r,"writeEventFilters"),H=x||n(t,a,r,"readEventFilters"),M=n(t,a,r,"writeFileOperations");return{canWriteSecuritySolution:d,canReadSecuritySolution:p,canAccessFleet:null!==(l=null==t?void 0:t.fleet.all)&&void 0!==l?l:i.includes("superuser"),canAccessEndpointManagement:r,canCreateArtifactsByPolicy:r&&o,canWriteEndpointList:u,canReadEndpointList:h,canWritePolicyManagement:f,canReadPolicyManagement:g,canWriteActionsLogManagement:m,canReadActionsLogManagement:v&&c,canAccessEndpointActionsLogManagement:v&&o,canIsolateHost:y&&o,canUnIsolateHost:y,canKillProcess:w&&c,canSuspendProcess:w&&c,canGetRunningProcesses:w&&c,canAccessResponseConsole:c&&(y||w||M),canWriteFileOperations:M&&c,canWriteTrustedApplications:k,canReadTrustedApplications:b,canWriteHostIsolationExceptions:L&&o,canReadHostIsolationExceptions:C,canWriteBlocklist:E,canReadBlocklist:S,canWriteEventFilters:x,canReadEventFilters:H}},s=()=>({canWriteSecuritySolution:!1,canReadSecuritySolution:!1,canAccessFleet:!1,canAccessEndpointActionsLogManagement:!1,canAccessEndpointManagement:!1,canCreateArtifactsByPolicy:!1,canWriteEndpointList:!1,canReadEndpointList:!1,canWritePolicyManagement:!1,canReadPolicyManagement:!1,canWriteActionsLogManagement:!1,canReadActionsLogManagement:!1,canIsolateHost:!1,canUnIsolateHost:!0,canKillProcess:!1,canSuspendProcess:!1,canGetRunningProcesses:!1,canAccessResponseConsole:!1,canWriteFileOperations:!1,canWriteTrustedApplications:!1,canReadTrustedApplications:!1,canWriteHostIsolationExceptions:!1,canReadHostIsolationExceptions:!1,canWriteBlocklist:!1,canReadBlocklist:!1,canWriteEventFilters:!1,canReadEventFilters:!1}),l=[{permission:"canWriteSecuritySolution",privilege:"crud"},{permission:"canReadSecuritySolution",privilege:"show"}];function o(e){return e&&e.siem?l.reduce(((t,{permission:i,privilege:n})=>({...t,[i]:e.siem[n]||!1})),{}):{canWriteSecuritySolution:!1,canReadSecuritySolution:!1}}},1099:function(e,t,i){var n,a,s=i(928),l=i(929),o=0,c=0;e.exports=function(e,t,i){var r=t&&i||0,d=t||[],p=(e=e||{}).node||n,u=void 0!==e.clockseq?e.clockseq:a;if(null==p||null==u){var h=s();null==p&&(p=n=[1|h[0],h[1],h[2],h[3],h[4],h[5]]),null==u&&(u=a=16383&(h[6]<<8|h[7]))}var f=void 0!==e.msecs?e.msecs:(new Date).getTime(),g=void 0!==e.nsecs?e.nsecs:c+1,m=f-o+(g-c)/1e4;if(m<0&&void 0===e.clockseq&&(u=u+1&16383),(m<0||f>o)&&void 0===e.nsecs&&(g=0),g>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");o=f,c=g,a=u;var v=(1e4*(268435455&(f+=122192928e5))+g)%4294967296;d[r++]=v>>>24&255,d[r++]=v>>>16&255,d[r++]=v>>>8&255,d[r++]=255&v;var y=f/4294967296*1e4&268435455;d[r++]=y>>>8&255,d[r++]=255&y,d[r++]=y>>>24&15|16,d[r++]=y>>>16&255,d[r++]=u>>>8|128,d[r++]=255&u;for(var w=0;w<6;++w)d[r+w]=p[w];return t||l(d)}},1100:function(e,t,i){var n=i(928),a=i(929);e.exports=function(e,t,i){var s=t&&i||0;"string"==typeof e&&(t="binary"===e?new Array(16):null,e=null);var l=(e=e||{}).random||(e.rng||n)();if(l[6]=15&l[6]|64,l[8]=63&l[8]|128,t)for(var o=0;o<16;++o)t[s+o]=l[o];return t||a(l)}},117:function(e,t,i){var n=i(1099),a=i(1100),s=a;s.v1=n,s.v4=a,e.exports=s},1267:function(e,t,i){e.exports=i.p+"a8b1fb3fc3b49d4695296ff241614c16.png"},1268:function(e,t,i){e.exports=i.p+"06c4348cc648a4a645d7dfd72bbbbcf2.png"},1269:function(e,t,i){e.exports=i.p+"5970467b007896dbd7c4c72067d26cac.png"},1270:function(e,t,i){e.exports=i.p+"0697c693932551a2cb06ebbdeaa5a709.png"},1271:function(e,t,i){e.exports=i.p+"2eceb10ac0e58501e218c73250bb0cec.png"},1272:function(e,t,i){e.exports=i.p+"260c75b46e03e14f9f92db27081a2ac2.png"},1273:function(e,t,i){e.exports=i.p+"2ae3f90e4479ca31eab3cf792ea951eb.png"},1274:function(e,t,i){e.exports=i.p+"f146191d942abadbf6f72a5f0e5ae789.png"},1289:function(e,t,i){"use strict";i.r(t),i.d(t,"links",(function(){return ie})),i.d(t,"getFilteredLinks",(function(){return ne}));var n=i(20),a=i(1);const s={...Object(n.getSecuritySolutionLink)("indicators"),globalNavPosition:7,capabilities:[`${a.qc}.show`]};var l=i(0),o=i(3);const c={id:a.uc.alerts,title:o.a,path:a.d,capabilities:[`${a.qc}.show`],globalNavPosition:2,globalSearchKeywords:[l.i18n.translate("xpack.securitySolution.appLinks.alerts",{defaultMessage:"Alerts"})]},r={id:a.uc.timelines,title:o.C,path:a.wc,globalNavPosition:4,capabilities:[`${a.qc}.show`],globalSearchKeywords:[l.i18n.translate("xpack.securitySolution.appLinks.timelines",{defaultMessage:"Timelines"})],links:[{id:a.uc.timelinesTemplates,title:l.i18n.translate("xpack.securitySolution.appLinks.timeline.templates",{defaultMessage:"Templates"}),path:`${a.wc}/template`,sideNavDisabled:!0}]};var d=i(8),p=i(26),u=i(1091),h=i(13),f=i(10),g=i(1267),m=i.n(g),v=i(82),y=i.n(v),w=i(4),k=i.n(w);const b=({...e})=>k.a.createElement("svg",y()({xmlns:"http://www.w3.org/2000/svg",width:16,height:16,fill:"none",viewBox:"0 0 32 32"},e),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M1 1H24V13.0105H22V3H3V21H10V23H1V1Z",fill:"#535766"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M8.58586 9.00008L6.29297 6.70718L7.70718 5.29297L11.4143 9.00008L7.70718 12.7072L6.29297 11.293L8.58586 9.00008Z",fill:"#00BFB3"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M16 16H10V14H16V16Z",fill:"#00BFB3"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M18 20.9988C18 20.9992 18 20.9996 18 21L18.0025 21.9228L17.1099 22.0214C15.361 22.2147 14 23.6991 14 25.5C14 27.433 15.567 29 17.5 29H25.5C27.433 29 29 27.433 29 25.5C29 23.9758 28.0251 22.6767 26.6618 22.1972L25.9576 21.9495L25.9949 21.2039C25.9983 21.1364 26 21.0685 26 21C26 18.7909 24.2091 17 22 17C19.7913 17 18.0007 18.7902 18 20.9988ZM16.0539 20.1923C16.4484 17.2606 18.9602 15 22 15C25.177 15 27.7772 17.4692 27.9864 20.5931C29.7737 21.5005 31 23.356 31 25.5C31 28.5376 28.5376 31 25.5 31H17.5C14.4624 31 12 28.5376 12 25.5C12 22.9626 13.7176 20.8275 16.0539 20.1923Z",fill:"#535766"})),L={hideTimeline:!0,capabilities:[`${a.qc}.show`]},C={...Object(f.getSecuritySolutionLink)("findings"),globalNavPosition:3,...L},E={...Object(f.getSecuritySolutionLink)("dashboard"),description:l.i18n.translate("xpack.securitySolution.appLinks.cloudSecurityPostureDashboardDescription",{defaultMessage:"An overview of findings across all CSP integrations."}),landingImage:m.a,...L},S={...Object(f.getSecuritySolutionLink)("benchmarks"),description:l.i18n.translate("xpack.securitySolution.appLinks.cloudSecurityPostureBenchmarksDescription",{defaultMessage:"View benchmark rules."}),landingIcon:b,...L,links:[{...Object(f.getSecuritySolutionLink)("rules"),sideNavDisabled:!0,globalSearchDisabled:!0,...L}]},x=[{label:l.i18n.translate("xpack.securitySolution.appLinks.category.cloudSecurityPosture",{defaultMessage:"CLOUD SECURITY POSTURE"}),linkIds:[a.uc.cloudSecurityPostureBenchmarks]}];var H=i(428),M=i(21);const V=[{label:l.i18n.translate("xpack.securitySolution.appLinks.category.siem",{defaultMessage:"SIEM"}),linkIds:[a.uc.rules,a.uc.exceptions]},{label:l.i18n.translate("xpack.securitySolution.appLinks.category.endpoints",{defaultMessage:"ENDPOINTS"}),linkIds:[a.uc.endpoints,a.uc.policies,a.uc.trustedApps,a.uc.eventFilters,a.uc.hostIsolationExceptions,a.uc.blocklist,a.uc.responseActionsHistory]},...x],R={id:a.uc.administration,title:o.t,path:a.Pb,skipUrlState:!0,hideTimeline:!0,globalNavPosition:8,capabilities:[`${a.qc}.show`],globalSearchKeywords:[l.i18n.translate("xpack.securitySolution.appLinks.manage",{defaultMessage:"Manage"})],categories:V,links:[{id:a.uc.rules,title:o.A,description:l.i18n.translate("xpack.securitySolution.appLinks.rulesDescription",{defaultMessage:"Create and manage rules to check for suspicious source events, and create alerts when a rule's conditions are met."}),landingIcon:({...e})=>k.a.createElement("svg",y()({xmlns:"http://www.w3.org/2000/svg",width:16,height:16,fill:"none",viewBox:"0 0 32 32"},e),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M25 30C27.7613 30 30 27.7613 30 25C30 22.2387 27.7613 20 25 20C22.2387 20 20 22.2387 20 25C20 27.7613 22.2387 30 25 30ZM25 22C26.6567 22 28 23.3433 28 25C28 26.6567 26.6567 28 25 28C23.3433 28 22 26.6567 22 25C22 23.3433 23.3433 22 25 22Z",fill:"#535766"}),k.a.createElement("path",{d:"M26 21H24V18H26V21Z",fill:"#535766"}),k.a.createElement("path",{d:"M26 32H24V29H26V32Z",fill:"#535766"}),k.a.createElement("path",{d:"M29 26V24H32V26H29Z",fill:"#535766"}),k.a.createElement("path",{d:"M18 26V24H21V26H18Z",fill:"#535766"}),k.a.createElement("path",{d:"M27.1213 28.535L28.5359 27.1211L30.6569 29.2431L29.2423 30.657L27.1213 28.535Z",fill:"#535766"}),k.a.createElement("path",{d:"M19.343 20.7567L20.7576 19.3428L22.8786 21.4648L21.464 22.8787L19.343 20.7567Z",fill:"#535766"}),k.a.createElement("path",{d:"M28.5359 22.8789L27.1213 21.465L29.2423 19.343L30.6569 20.7569L28.5359 22.8789Z",fill:"#535766"}),k.a.createElement("path",{d:"M20.7576 30.6572L19.343 29.2433L21.464 27.1213L22.8786 28.5352L20.7576 30.6572Z",fill:"#535766"}),k.a.createElement("path",{d:"M6 10V8H21V10H6Z",fill:"#00BFB3"}),k.a.createElement("path",{d:"M6 15V13H21V15H6Z",fill:"#00BFB3"}),k.a.createElement("path",{d:"M6 20V18H15V20H6Z",fill:"#00BFB3"}),k.a.createElement("path",{d:"M6 25V23H13V25H6Z",fill:"#00BFB3"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M26 25C26 25.553 25.552 26 25 26C24.448 26 24 25.553 24 25C24 24.447 24.448 24 25 24C25.552 24 26 24.447 26 25Z",fill:"#535766"}),k.a.createElement("path",{d:"M16.0408 29V31H4C2.34315 31 1 29.6569 1 28V4C1 2.34315 2.34315 1 4 1H23C24.6569 1 26 2.34315 26 4V15H24V4C24 3.44772 23.5523 3 23 3H4C3.44772 3 3 3.44772 3 4V28C3 28.5523 3.44772 29 4 29H16.0408Z",fill:"#535766"})),path:a.lc,globalSearchKeywords:[l.i18n.translate("xpack.securitySolution.appLinks.rules",{defaultMessage:"Rules"})],links:[{id:a.uc.rulesCreate,title:o.d,path:a.kc,skipUrlState:!0,hideTimeline:!0}]},{id:a.uc.exceptions,title:o.k,description:l.i18n.translate("xpack.securitySolution.appLinks.exceptionsDescription",{defaultMessage:"Create and manage shared exception lists to prevent the creation of unwanted alerts."}),landingIcon:b,path:a.Bb,skipUrlState:!0,hideTimeline:!0,globalSearchKeywords:[l.i18n.translate("xpack.securitySolution.appLinks.exceptions",{defaultMessage:"Exception lists"})]},{id:a.uc.endpoints,description:l.i18n.translate("xpack.securitySolution.appLinks.endpointsDescription",{defaultMessage:"Hosts running Elastic Defend."}),landingIcon:({...e})=>k.a.createElement("svg",y()({xmlns:"http://www.w3.org/2000/svg",width:16,height:16,fill:"none",viewBox:"0 0 32 32"},e),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M7.74499 2.85648L15.1476 16.0026L14.8713 16.4933L7.7449 29.1484C5.89634 32.4299 1 31.078 1 27.3123V4.69299C1 0.927492 5.89616 -0.424721 7.74499 2.85648ZM3 27.3097C3 29.0366 5.17293 29.6366 6.0023 28.1643L12.8524 16.0001L6.00242 3.83547C5.17299 2.36345 3 2.96358 3 4.69043V27.3097Z",fill:"#535766"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M10.0122 31L17.6866 17H30.4824L29.5893 18.5093L23.903 28.1177C22.7586 29.9128 20.7657 31 18.6236 31H10.0122ZM22.1992 27.0709L26.975 19H18.8711L13.3893 29H18.6236C20.0841 29 21.4404 28.2602 22.1992 27.0709Z",fill:"#535766"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M17.1371 14L10.0125 1H18.6236C20.7657 1 22.7587 2.08715 23.9031 3.88232L30.3242 14H27.9554L22.2155 4.9557C21.4404 3.73981 20.0842 3 18.6236 3H13.3892L19.4177 14H17.1371Z",fill:"#00BFB3"})),title:o.h,path:a.wb,skipUrlState:!0,hideTimeline:!0},{id:a.uc.policies,title:o.y,description:l.i18n.translate("xpack.securitySolution.appLinks.policiesDescription",{defaultMessage:"Use policies to customize endpoint and cloud workload protections and other configurations."}),landingIcon:({...e})=>k.a.createElement("svg",y()({xmlns:"http://www.w3.org/2000/svg",width:16,height:16,fill:"none",viewBox:"0 0 32 32"},e),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M16 28.0001H14V19.5081L14.6 19.2461C17.88 17.8121 20 14.5751 20 11.0001C20 7.96306 18.471 5.17106 16 3.52106V11.0001H6V3.52106C3.529 5.17106 2 7.96306 2 11.0001C2 14.5751 4.12 17.8121 7.4 19.2461L8 19.5081V28.0001H6V20.7951C2.334 18.9241 0 15.1481 0 11.0001C0 6.63006 2.591 2.67406 6.6 0.922059L8 0.310059V9.00006H14V0.310059L15.4 0.922059C19.409 2.67406 22 6.63006 22 11.0001C22 15.1481 19.666 18.9241 16 20.7951V28.0001Z",fill:"#535766"})),path:a.bc,skipUrlState:!0,hideTimeline:!0,experimentalKey:"policyListEnabled"},{id:a.uc.trustedApps,title:o.D,description:l.i18n.translate("xpack.securitySolution.appLinks.trustedApplicationsDescription",{defaultMessage:"Improve performance or alleviate conflicts with other applications running on your hosts."}),landingIcon:({...e})=>k.a.createElement("svg",y()({xmlns:"http://www.w3.org/2000/svg",width:16,height:16,fill:"none",viewBox:"0 0 32 32"},e),k.a.createElement("svg",{width:"32",height:"32",viewBox:"0 0 32 32",fill:"none",xmlns:"http://www.w3.org/2000/svg"},k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M28 1H4C2.34315 1 1 2.34315 1 4V6C1 7.65685 2.34315 9 4 9H28C29.6569 9 31 7.65685 31 6V4C31 2.34315 29.6569 1 28 1ZM3 4C3 3.44772 3.44772 3 4 3H28C28.5523 3 29 3.44772 29 4V6C29 6.55228 28.5523 7 28 7H4C3.44772 7 3 6.55228 3 6V4Z",fill:"#535766"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12 11H4C2.34315 11 1 12.3431 1 14V17C1 18.6569 2.34315 20 4 20H12C13.6569 20 15 18.6569 15 17V14C15 12.3431 13.6569 11 12 11ZM3 14C3 13.4477 3.44772 13 4 13H12C12.5523 13 13 13.4477 13 14V17C13 17.5523 12.5523 18 12 18H4C3.44772 18 3 17.5523 3 17V14Z",fill:"#00BFB3"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12 22H4C2.34315 22 1 23.3431 1 25V28C1 29.6569 2.34315 31 4 31H12C13.6569 31 15 29.6569 15 28V25C15 23.3431 13.6569 22 12 22ZM3 25C3 24.4477 3.44772 24 4 24H12C12.5523 24 13 24.4477 13 25V28C13 28.5523 12.5523 29 12 29H4C3.44772 29 3 28.5523 3 28V25Z",fill:"#535766"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M28 11H20C18.3431 11 17 12.3431 17 14V28C17 29.6569 18.3431 31 20 31H28C29.6569 31 31 29.6569 31 28V14C31 12.3431 29.6569 11 28 11ZM19 14C19 13.4477 19.4477 13 20 13H28C28.5523 13 29 13.4477 29 14V28C29 28.5523 28.5523 29 28 29H20C19.4477 29 19 28.5523 19 28V14Z",fill:"#00BFB3"}))),path:a.Fc,skipUrlState:!0,hideTimeline:!0},{id:a.uc.eventFilters,title:o.j,description:l.i18n.translate("xpack.securitySolution.appLinks.eventFiltersDescription",{defaultMessage:"Exclude high volume or unwanted events being written into Elasticsearch."}),landingIcon:({...e})=>k.a.createElement("svg",y()({xmlns:"http://www.w3.org/2000/svg",width:16,height:16,fill:"none",viewBox:"0 0 32 32"},e),k.a.createElement("svg",{width:"32",height:"32",viewBox:"0 0 32 32",fill:"none",xmlns:"http://www.w3.org/2000/svg"},k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M30 23H29C28.449 23 28 22.552 28 22V14C28 13.448 28.449 13 29 13H30V23ZM20 20V22C20 22.552 19.551 23 19 23H13C12.449 23 12 22.552 12 22V20H6V16H12V14C12 13.448 12.449 13 13 13H19C19.551 13 20 13.448 20 14V16H26V20H20ZM3 23H2V13H3C3.551 13 4 13.448 4 14V22C4 22.552 3.551 23 3 23ZM29 11C27.346 11 26 12.346 26 14H22C22 12.346 20.654 11 19 11H13C11.346 11 10 12.346 10 14H6C6 12.346 4.654 11 3 11H0V25H3C4.654 25 6 23.654 6 22H10C10 23.654 11.346 25 13 25H19C20.654 25 22 23.654 22 22H26C26 23.654 27.346 25 29 25H32V11H29Z",fill:"#535766"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M22 5H10V7H15V9H17V7H22V5Z",fill:"#00BFB3"}))),path:a.Ab,skipUrlState:!0,hideTimeline:!0},{id:a.uc.hostIsolationExceptions,title:o.q,description:l.i18n.translate("xpack.securitySolution.appLinks.hostIsolationDescription",{defaultMessage:"Allow isolated hosts to communicate with specific IPs."}),landingIcon:({...e})=>k.a.createElement("svg",y()({xmlns:"http://www.w3.org/2000/svg",width:16,height:16,fill:"none",viewBox:"0 0 32 32"},e),k.a.createElement("svg",{width:"32",height:"32",viewBox:"0 0 32 32",fill:"none",xmlns:"http://www.w3.org/2000/svg"},k.a.createElement("g",{clipPath:"url(#clip0_1334_337834)"},k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M15.0002 0V9.92L11.6252 7.219L10.3752 8.781L16.0002 13.28L21.6252 8.781L20.3752 7.219L17.0002 9.92V0H15.0002Z",fill:"#00BFB3"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M19.9468 1.83246L29.1968 8.00046L15.9998 16.7975L2.80276 8.00046L12.0548 1.83246L10.9448 0.168457L-0.000244141 7.46446V20.5355L15.9998 31.2025L32.0008 20.5355V7.46446L21.0558 0.168457L19.9468 1.83246ZM16.9998 18.5355L29.9998 9.86846V19.4655L16.9998 28.1305V18.5355ZM1.99976 19.4655V9.86846L15.0008 18.5355V28.1305L1.99976 19.4655Z",fill:"#535766"})),k.a.createElement("defs",null,k.a.createElement("clipPath",{id:"clip0_1334_337834"},k.a.createElement("rect",{width:"32",height:"32",fill:"white"}))))),path:a.Ib,skipUrlState:!0,hideTimeline:!0},{id:a.uc.blocklist,title:o.b,description:l.i18n.translate("xpack.securitySolution.appLinks.blocklistDescription",{defaultMessage:"Exclude unwanted applications from running on your hosts."}),landingIcon:({...e})=>k.a.createElement("svg",y()({xmlns:"http://www.w3.org/2000/svg",width:16,height:16,fill:"none",viewBox:"0 0 32 32"},e),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M4 6.81635V12.0713C4 19.9353 8.697 26.8694 16 29.8403C23.303 26.8694 28 19.9353 28 12.0713V6.81635L16 2.20135L4 6.81635ZM16 31.9874L15.641 31.8493C7.354 28.6623 2 20.8983 2 12.0713V5.44335L16 0.0583496L30 5.44335V12.0713C30 20.8983 24.646 28.6623 16.359 31.8493L16 31.9874Z",fill:"#535766"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M11 23H13V18H11V23Z",fill:"#00BFB3"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M12 14C11.448 14 11 13.552 11 13C11 12.448 11.448 12 12 12C12.552 12 13 12.448 13 13C13 13.552 12.552 14 12 14ZM13 10.185V7H11V10.185C9.839 10.599 9 11.698 9 13C9 14.654 10.346 16 12 16C13.654 16 15 14.654 15 13C15 11.698 14.161 10.599 13 10.185Z",fill:"#00BFB3"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M19 12H21V7H19V12Z",fill:"#00BFB3"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M20 18C19.448 18 19 17.552 19 17C19 16.448 19.448 16 20 16C20.552 16 21 16.448 21 17C21 17.552 20.552 18 20 18ZM23 17C23 15.346 21.654 14 20 14C18.346 14 17 15.346 17 17C17 18.302 17.839 19.401 19 19.815V23H21V19.815C22.161 19.401 23 18.302 23 17Z",fill:"#00BFB3"})),path:a.D,skipUrlState:!0,hideTimeline:!0},{id:a.uc.responseActionsHistory,title:o.z,description:l.i18n.translate("xpack.securitySolution.appLinks.actionHistoryDescription",{defaultMessage:"View the history of response actions performed on hosts."}),landingIcon:({...e})=>k.a.createElement("svg",y()({xmlns:"http://www.w3.org/2000/svg",width:16,height:16,fill:"none",viewBox:"0 0 32 32"},e),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",fill:"#535766",d:"M29 9H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3zM3 2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h26a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3z"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",fill:"#00BFB3",d:"M29 32H3a3 3 0 0 1-3-3V14a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3zM3 13a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h26a1 1 0 0 0 1-1V14a1 1 0 0 0-1-1H3z"}),k.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",fill:"#535766",d:"m7.29 17.71 3.3 3.29-3.3 3.29 1.42 1.42 4.7-4.71-4.7-4.71zM15 24h9v2h-9z"})),path:a.cc,skipUrlState:!0,hideTimeline:!0},S]};var A=i(1268),I=i.n(A),B=i(1269),$=i.n(B),T=i(1270),P=i.n(T);const Z={id:a.uc.overview,title:o.x,landingImage:I.a,description:l.i18n.translate("xpack.securitySolution.appLinks.overviewDescription",{defaultMessage:"Summary of your security environment activity, including alerts, events, recent items, and a news feed!"}),path:a.Zb,capabilities:[`${a.qc}.show`],globalSearchKeywords:[l.i18n.translate("xpack.securitySolution.appLinks.overview",{defaultMessage:"Overview"})]},_={id:a.uc.landing,title:o.n,path:a.Nb,capabilities:[`${a.qc}.show`],globalSearchKeywords:[l.i18n.translate("xpack.securitySolution.appLinks.getStarted",{defaultMessage:"Getting started"})],skipUrlState:!0,hideTimeline:!0},D={id:a.uc.detectionAndResponse,title:o.g,landingImage:$.a,description:l.i18n.translate("xpack.securitySolution.appLinks.detectionAndResponseDescription",{defaultMessage:"Information about your Alerts and Cases within the Security Solution, including Hosts and Users with Alerts."}),path:a.tb,capabilities:[`${a.qc}.show`],globalSearchKeywords:[l.i18n.translate("xpack.securitySolution.appLinks.detectionAndResponse",{defaultMessage:"Detection & Response"})]},O={id:a.uc.entityAnalytics,title:o.i,landingImage:P.a,description:l.i18n.translate("xpack.securitySolution.appLinks.entityAnalyticsDescription",{defaultMessage:"Entity analytics, notable anomalies, and threats to narrow down the monitoring surface area."}),path:a.zb,capabilities:[`${a.qc}.show`],isBeta:!1,globalSearchKeywords:[o.i]};var N=i(1271),F=i.n(N);const U={id:a.uc.hosts,title:o.p,landingImage:F.a,description:l.i18n.translate("xpack.securitySolution.landing.threatHunting.hostsDescription",{defaultMessage:"A comprehensive overview of all hosts and host-related security events."}),path:a.Hb,globalSearchKeywords:[l.i18n.translate("xpack.securitySolution.appLinks.hosts",{defaultMessage:"Hosts"})],links:[{id:a.uc.uncommonProcesses,title:l.i18n.translate("xpack.securitySolution.appLinks.hosts.uncommonProcesses",{defaultMessage:"Uncommon Processes"}),path:`${a.Hb}/uncommonProcesses`},{id:a.uc.hostsAnomalies,title:l.i18n.translate("xpack.securitySolution.appLinks.hosts.anomalies",{defaultMessage:"Anomalies"}),path:`${a.Hb}/anomalies`,licenseType:"gold"},{id:a.uc.hostsEvents,title:l.i18n.translate("xpack.securitySolution.appLinks.hosts.events",{defaultMessage:"Events"}),path:`${a.Hb}/events`},{id:a.uc.hostsRisk,title:l.i18n.translate("xpack.securitySolution.appLinks.hosts.risk",{defaultMessage:"Host risk"}),path:`${a.Hb}/hostRisk`},{id:a.uc.sessions,title:l.i18n.translate("xpack.securitySolution.appLinks.hosts.sessions",{defaultMessage:"Sessions"}),path:`${a.Hb}/sessions`,isBeta:!1,licenseType:"enterprise"}]};var W=i(1272),K=i.n(W);const q={id:a.uc.network,title:o.u,landingImage:K.a,description:l.i18n.translate("xpack.securitySolution.appLinks.network.description",{defaultMessage:"Provides key activity metrics in an interactive map as well as event tables that enable interaction with the Timeline."}),path:a.Sb,globalSearchKeywords:[l.i18n.translate("xpack.securitySolution.appLinks.network",{defaultMessage:"Network"})],links:[{id:a.uc.networkDns,title:l.i18n.translate("xpack.securitySolution.appLinks.network.dns",{defaultMessage:"DNS"}),path:`${a.Sb}/dns`},{id:a.uc.networkHttp,title:l.i18n.translate("xpack.securitySolution.appLinks.network.http",{defaultMessage:"HTTP"}),path:`${a.Sb}/http`},{id:a.uc.networkTls,title:l.i18n.translate("xpack.securitySolution.appLinks.network.tls",{defaultMessage:"TLS"}),path:`${a.Sb}/tls`},{id:a.uc.networkAnomalies,title:l.i18n.translate("xpack.securitySolution.appLinks.hosts.anomalies",{defaultMessage:"Anomalies"}),path:`${a.Sb}/anomalies`,licenseType:"gold"},{id:a.uc.networkEvents,title:l.i18n.translate("xpack.securitySolution.appLinks.network.events",{defaultMessage:"Events"}),path:`${a.Sb}/events`}]};var j=i(1273),z=i.n(j);const G={id:a.uc.users,title:o.E,landingImage:z.a,description:l.i18n.translate("xpack.securitySolution.appLinks.users.description",{defaultMessage:"A comprehensive overview of user data that enables understanding of authentication and user behavior within your environment."}),path:a.Gc,globalSearchKeywords:[l.i18n.translate("xpack.securitySolution.appLinks.users",{defaultMessage:"Users"})],links:[{id:a.uc.usersAuthentications,title:l.i18n.translate("xpack.securitySolution.appLinks.users.authentications",{defaultMessage:"Authentications"}),path:`${a.Gc}/authentications`},{id:a.uc.usersAnomalies,title:l.i18n.translate("xpack.securitySolution.appLinks.users.anomalies",{defaultMessage:"Anomalies"}),path:`${a.Gc}/anomalies`,licenseType:"gold"},{id:a.uc.usersRisk,title:l.i18n.translate("xpack.securitySolution.appLinks.users.risk",{defaultMessage:"User risk"}),path:`${a.Gc}/userRisk`},{id:a.uc.usersEvents,title:l.i18n.translate("xpack.securitySolution.appLinks.users.events",{defaultMessage:"Events"}),path:`${a.Gc}/events`}]};var Y=i(1274),J=i.n(Y);const X={id:a.uc.kubernetes,title:o.s,landingImage:J.a,description:l.i18n.translate("xpack.securitySolution.appLinks.kubernetesDescription",{defaultMessage:"Provides interactive visualizations of your Kubernetes workload and session data."}),path:a.Mb,isBeta:!0,experimentalKey:"kubernetesEnabled",globalSearchKeywords:["Kubernetes"]},Q={id:a.uc.dashboardsLanding,title:o.e,path:a.I,globalNavPosition:1,capabilities:[`${a.qc}.show`],globalSearchKeywords:[l.i18n.translate("xpack.securitySolution.appLinks.dashboards",{defaultMessage:"Dashboards"})],links:[Z,D,X,E,O],skipUrlState:!0},ee={id:a.uc.exploreLanding,title:o.l,path:a.Db,globalNavPosition:6,capabilities:[`${a.qc}.show`],globalSearchKeywords:[l.i18n.translate("xpack.securitySolution.appLinks.explore",{defaultMessage:"Explore"})],links:[U,q,G],skipUrlState:!0},te=(()=>{const e=Object(p.getCasesDeepLinks)({basePath:a.H,extend:{[a.uc.case]:{globalNavPosition:5,capabilities:[`${a.G}.${d.READ_CASES_CAPABILITY}`]},[a.uc.caseConfigure]:{capabilities:[`${a.G}.${d.UPDATE_CASES_CAPABILITY}`],licenseType:"gold",sideNavDisabled:!0},[a.uc.caseCreate]:{capabilities:[`${a.G}.${d.CREATE_CASES_CAPABILITY}`],sideNavDisabled:!0}}}),{id:t,deepLinks:i,...n}=e;return{...n,id:a.uc.case,links:i}})(),ie=Object.freeze([Q,c,C,r,te,ee,_,R,s]),ne=async(e,t)=>{const i=await(async(e,t)=>{var i;const n=null===(i=t.fleet)||void 0===i?void 0:i.authz,{endpointRbacV1Enabled:s}=M.a.get(),l=Object(u.b)(e.application.capabilities),o=[];try{const i=await t.security.authc.getCurrentUser(),{canReadActionsLogManagement:c,canUnIsolateHost:r,canIsolateHost:d,canAccessEndpointManagement:p}=n?Object(u.a)(h.a,n,i.roles,s,l):Object(u.c)();if(c||o.push(a.uc.responseActionsHistory),!d&&r){let t;try{t=0!==await(async e=>{const t=H.a.getInstance(e);return(await t.summary()).total})(e.http)&&p}catch{t=!1}t||o.push(a.uc.hostIsolationExceptions)}else d&&p||o.push(a.uc.hostIsolationExceptions)}catch{o.push(a.uc.hostIsolationExceptions)}return c=o,{...R,links:null===(r=R.links)||void 0===r?void 0:r.filter((e=>!c.includes(e.id)))};var c,r})(e,t);return Object.freeze([Q,c,C,r,te,ee,_,i,s])}},315:function(e,t,i){"use strict";i.d(t,"a",(function(){return ExceptionsListApiClient}));var n=i(6),a=i.n(n),s=i(110),l=i(105);class ExceptionsListApiClient{constructor(e,t,i,n,s){a()(this,"ensureListExists",void 0),this.http=e,this.listId=t,this.listDefinition=i,this.readTransform=n,this.writeTransform=s,this.ensureListExists=this.createExceptionList()}async createExceptionList(){return ExceptionsListApiClient.wasListCreated.has(this.listId)||ExceptionsListApiClient.wasListCreated.set(this.listId,new Promise(((e,t)=>{(async()=>{try{await this.http.post(s.u,{body:JSON.stringify({...this.listDefinition,list_id:this.listId})}),e()}catch(e){ExceptionsListApiClient.wasListCreated.delete(this.listId),t(e)}})()}))),ExceptionsListApiClient.wasListCreated.get(this.listId)}checkIfIsUsingTheRightInstance(e){if(e!==this.listId)throw new Error(`The list id you are using is not valid, expected [${this.listId}] list id but received [${e}] list id`)}isHttp(e){return this.http===e}static getInstance(e,t,i,n,a){var s;ExceptionsListApiClient.instance.has(t)&&null!==(s=ExceptionsListApiClient.instance.get(t))&&void 0!==s&&s.isHttp(e)||ExceptionsListApiClient.instance.set(t,new ExceptionsListApiClient(e,t,i,n,a));return ExceptionsListApiClient.instance.get(t)||new ExceptionsListApiClient(e,t,i,n,a)}static cleanExceptionsBeforeUpdate(e){var t;const i={...e};return["created_at","created_by","list_id","tie_breaker_id","updated_at","updated_by","meta"].forEach((e=>{delete i[e]})),i.comments=null===(t=i.comments)||void 0===t?void 0:t.map((e=>({comment:e.comment,id:e.id}))),i}async find({perPage:e=l.c,page:t=l.b+1,sortField:i,sortOrder:n,filter:a}={}){await this.ensureListExists;const o=await this.http.get(`${s.p}/_find`,{query:{page:t,per_page:e,sort_field:i,sort_order:n,list_id:[this.listId],namespace_type:["agnostic"],filter:a}});return this.readTransform&&(o.data=o.data.map(this.readTransform)),o}async get(e,t){if(!e&&!t)throw TypeError("either `itemId` or `id` argument must be set");await this.ensureListExists;let i=await this.http.get(s.p,{query:{id:t,item_id:e,namespace_type:"agnostic"}});return this.readTransform&&(i=this.readTransform(i)),i}async create(e){await this.ensureListExists,this.checkIfIsUsingTheRightInstance(e.list_id),delete e.meta;let t=e;return this.writeTransform&&(t=this.writeTransform(e)),this.http.post(s.p,{body:JSON.stringify(t)})}async update(e){await this.ensureListExists;let t=e;return this.writeTransform&&(t=this.writeTransform(e)),this.http.put(s.p,{body:JSON.stringify(ExceptionsListApiClient.cleanExceptionsBeforeUpdate(t))})}async delete(e,t){if(!e&&!t)throw TypeError("either `itemId` or `id` argument must be set");return await this.ensureListExists,this.http.delete(s.p,{query:{id:t,item_id:e,namespace_type:"agnostic"}})}async summary(e){return await this.ensureListExists,this.http.get(`${s.s}/summary`,{query:{filter:e,list_id:this.listId,namespace_type:"agnostic"}})}async hasData(){return(await this.find({perPage:1,page:1})).total>0}}a()(ExceptionsListApiClient,"instance",new Map),a()(ExceptionsListApiClient,"wasListCreated",new Map)},428:function(e,t,i){"use strict";i.d(t,"a",(function(){return HostIsolationExceptionsApiClient}));var n=i(110),a=i(315),s=i(523);class HostIsolationExceptionsApiClient extends a.a{constructor(e){super(e,n.h,s.a)}static getInstance(e){return super.getInstance(e,n.h,s.a)}}},522:function(e,t,i){"use strict";let n;i.d(t,"a",(function(){return n})),function(e){e.endpoints="endpoints",e.policies="policy",e.trustedApps="trusted_apps",e.eventFilters="event_filters",e.hostIsolationExceptions="host_isolation_exceptions",e.blocklist="blocklist",e.responseActionsHistory="response_actions_history"}(n||(n={}))},523:function(e,t,i){"use strict";i.d(t,"b",(function(){return s})),i.d(t,"a",(function(){return l}));var n=i(93),a=i(110);const s=["item_id","name","description","entries.value"],l={name:a.i,namespace_type:"agnostic",description:a.g,list_id:a.h,type:n.b.ENDPOINT_HOST_ISOLATION_EXCEPTIONS}},928:function(e,t){var i="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(i){var n=new Uint8Array(16);e.exports=function(){return i(n),n}}else{var a=new Array(16);e.exports=function(){for(var e,t=0;t<16;t++)0==(3&t)&&(e=4294967296*Math.random()),a[t]=e>>>((3&t)<<3)&255;return a}}},929:function(e,t){for(var i=[],n=0;n<256;++n)i[n]=(n+256).toString(16).substr(1);e.exports=function(e,t){var n=t||0,a=i;return[a[e[n++]],a[e[n++]],a[e[n++]],a[e[n++]],"-",a[e[n++]],a[e[n++]],"-",a[e[n++]],a[e[n++]],"-",a[e[n++]],a[e[n++]],"-",a[e[n++]],a[e[n++]],a[e[n++]],a[e[n++]],a[e[n++]],a[e[n++]]].join("")}}}]);