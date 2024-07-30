/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.securitySolution_bundle_jsonpfunction=window.securitySolution_bundle_jsonpfunction||[]).push([[34],{1282:function(e,t,n){"use strict";n.r(t),n.d(t,"PinnedTabContentComponent",(function(){return M})),n.d(t,"default",(function(){return V}));var i=n(32),o=n(34),l=n(4),a=n.n(l),d=n(33),s=n.n(d),r=n(78),m=n(92),u=n.n(m),c=n(86),p=n(1116),g=n(520),h=n(158),b=n(1120),y=n(1126),E=n(274),P=n(1067),f=n(95),w=n(112),C=n(94),v=n(148),I=n(123),F=n(79),O=n(504),j=n(616),S=n(419),x=n(13);const q=s()(i.EuiFlyoutBody).withConfig({displayName:"StyledEuiFlyoutBody",componentId:"sc-1kqzlqh-0"})(["overflow-y:hidden;flex:1;.euiFlyoutBody__overflow{overflow:hidden;mask-image:none;}.euiFlyoutBody__overflowContent{padding:0;height:100%;display:flex;}"]),N=s()(i.EuiFlyoutFooter).withConfig({displayName:"StyledEuiFlyoutFooter",componentId:"sc-1kqzlqh-1"})(["background:none;padding:0;&.euiFlyoutFooter{","}"],(({theme:e})=>`padding: ${e.eui.euiSizeS} 0 0 0;`)),_=s.a.div.withConfig({displayName:"ExitFullScreenContainer",componentId:"sc-1kqzlqh-2"})(["width:180px;"]),k=s()(i.EuiFlexGroup).withConfig({displayName:"FullWidthFlexGroup",componentId:"sc-1kqzlqh-3"})(["margin:0;width:100%;overflow:hidden;"]),D=s()(i.EuiFlexItem).withConfig({displayName:"ScrollableFlexItem",componentId:"sc-1kqzlqh-4"})(["overflow:hidden;"]),T=s.a.div.withConfig({displayName:"VerticalRule",componentId:"sc-1kqzlqh-5"})(["width:2px;height:100%;background:",";"],(({theme:e})=>e.eui.euiColorLightShade));T.displayName="VerticalRule";const z=[],M=({columns:e,timelineId:t,itemsPerPage:n,itemsPerPageOptions:i,pinnedEventIds:d,onEventClosed:s,renderCellValue:r,rowRenderers:m,showExpandedDetails:u,sort:c})=>{const{browserFields:w,dataViewId:M,loading:V,runtimeMappings:B,selectedPatterns:R}=Object(C.d)(f.SourcererScopeName.timeline),{setTimelineFullScreen:$,timelineFullScreen:L}=Object(v.c)(),A=Object(x.b)().isEnterprise()?6:5,G=Object(l.useMemo)((()=>{if(Object(o.isEmpty)(d))return"";const e=Object.entries(d).reduce(((e,[t,n])=>n?{...e,bool:{...e.bool,should:[...e.bool.should,{match_phrase:{_id:t}}]}}:e),{bool:{should:[],minimum_should_match:1}});try{return JSON.stringify(e)}catch{return""}}),[d]),J=Object(l.useMemo)((()=>[...(Object(o.isEmpty)(e)?h.b:e).map((e=>e.id)),...E.h]),[e]),K=Object(l.useMemo)((()=>c.map((({columnId:e,columnType:t,esTypes:n,sortDirection:i})=>({field:e,type:t,direction:i,esTypes:null!=n?n:[]})))),[c]),[Q,{events:W,totalCount:H,pageInfo:U,loadPage:X,updatedAt:Y,refetch:Z}]=Object(g.a)({endDate:"",id:`pinned-${t}`,indexNames:R,dataViewId:M,fields:J,limit:n,filterQuery:G,runtimeMappings:B,skip:""===G,startDate:"",sort:K,timerangeKind:void 0}),ee=Object(l.useCallback)((()=>{s({tabType:F.m.pinned,id:t})}),[t,s]),te=Object(l.useMemo)((()=>Object(S.a)(A).map((e=>({...e,headerCellRender:p.a})))),[A]);return a.a.createElement(a.a.Fragment,null,a.a.createElement(k,{"data-test-subj":`${F.m.pinned}-tab`},a.a.createElement(D,{grow:2},L&&null!=$&&a.a.createElement(_,null,a.a.createElement(j.b,{fullScreen:L,setFullScreen:$})),a.a.createElement(P.a,null,a.a.createElement(q,{"data-test-subj":`${F.m.pinned}-tab-flyout-body`,className:"timeline-flyout-body"},a.a.createElement(b.a,{activePage:U.activePage,browserFields:w,data:W,id:t,refetch:Z,renderCellValue:r,rowRenderers:m,sort:c,tabType:F.m.pinned,totalPages:Object(I.h)({itemsCount:H,itemsPerPage:n}),leadingControlColumns:te,trailingControlColumns:z})),a.a.createElement(N,{"data-test-subj":`${F.m.pinned}-tab-flyout-footer`,className:"timeline-flyout-footer"},a.a.createElement(y.a,{activePage:U.activePage,"data-test-subj":"timeline-footer",updatedAt:Y,height:y.b,id:t,isLive:!1,isLoading:Q||V,itemsCount:W.length,itemsPerPage:n,itemsPerPageOptions:i,onChangePage:X,totalCount:H})))),u&&a.a.createElement(a.a.Fragment,null,a.a.createElement(T,null),a.a.createElement(D,{grow:1},a.a.createElement(O.a,{browserFields:w,handleOnPanelClosed:ee,runtimeMappings:B,tabType:F.m.pinned,scopeId:t})))))},V=Object(r.connect)((()=>{const e=c.b.getTimelineByIdSelector();return(t,{timelineId:n})=>{var i,o;const l=null!==(i=e(t,n))&&void 0!==i?i:w.b,{columns:a,expandedDetail:d,itemsPerPage:s,itemsPerPageOptions:r,pinnedEventIds:m,sort:u}=l;return{columns:a,timelineId:n,itemsPerPage:s,itemsPerPageOptions:r,pinnedEventIds:m,showExpandedDetails:!!d[F.m.pinned]&&!(null===(o=d[F.m.pinned])||void 0===o||!o.panelView),sort:u}}}),((e,{timelineId:t})=>({onEventClosed:t=>{e(c.a.toggleDetailPanel(t))}})))(a.a.memo(M,((e,t)=>e.itemsPerPage===t.itemsPerPage&&e.onEventClosed===t.onEventClosed&&e.showExpandedDetails===t.showExpandedDetails&&e.timelineId===t.timelineId&&u()(e.columns,t.columns)&&u()(e.itemsPerPageOptions,t.itemsPerPageOptions)&&u()(e.pinnedEventIds,t.pinnedEventIds)&&u()(e.sort,t.sort))))}}]);