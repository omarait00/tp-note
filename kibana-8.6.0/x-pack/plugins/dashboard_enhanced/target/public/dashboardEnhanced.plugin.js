/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */!function(e){var t={};function n(a){if(t[a])return t[a].exports;var r=t[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(a,r,function(t){return e[t]}.bind(null,r));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=17)}([function(e,t,n){e.exports=n(14)(2)},function(e,t){e.exports=__kbnSharedDeps__.EmotionReact},function(e,t){e.exports=__kbnSharedDeps__.RxjsOperators},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/embeddable/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t){e.exports=__kbnSharedDeps__.ElasticEui},function(e,t){e.exports=__kbnSharedDeps__.KbnI18n},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/embeddableEnhanced/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t){e.exports=__kbnSharedDeps__.React},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/data/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/kibanaUtils/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t){e.exports=__kbnSharedDeps__.KbnEsQuery},function(e,t){e.exports=__kbnSharedDeps__.Rxjs},function(e,t){e.exports=__kbnSharedDeps__.Lodash},function(e,t){e.exports=__kbnSharedDeps_npm__},function(e,t,n){n.r(t);var a=__kbnBundles__.get("plugin/dashboard/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(a))},function(e,t,n){e.exports=n(14)(3)},function(e,t,n){n(18),__kbnBundles__.define("plugin/dashboardEnhanced/public",n,19)},function(e,t,n){n.p=window.__kbnPublicPath__.dashboardEnhanced},function(e,t,n){"use strict";n.r(t),n.d(t,"DashboardEnhancedAbstractDashboardDrilldown",(function(){return abstract_dashboard_drilldown_AbstractDashboardDrilldown})),n.d(t,"plugin",(function(){return L}));var a=n(0),r=n.n(a),o=n(3),s=n(10),i=n(7),d=n.n(i),c=n(5),l=n(2),b=n(12),u=n(8),h=n(6),p=n(9);function g(e){return e.includes(p.APPLY_FILTER_TRIGGER)||!e.includes(o.VALUE_CLICK_TRIGGER)&&!e.includes(o.SELECT_RANGE_TRIGGER)?e:[...e,p.APPLY_FILTER_TRIGGER]}const _=e=>{const t=[],n=e.id,a=e.getRoot();if(!a)return t;if(!(a instanceof o.Container))return t;const r=a.getChildIds();for(const e of r){const r=a.getChild(e);if(r.id===n)continue;if(!Object(h.isEnhancedEmbeddable)(r))continue;const o=r.enhancements.dynamicActions.state.get().events;for(const e of o){const n={id:e.eventId,name:e.action.name,icon:"dashboardApp",description:r.getTitle()||r.id,config:e.action.config,factoryId:e.action.factoryId,triggers:e.triggers};t.push(n)}}return t};var f=n(1);const m="OPEN_FLYOUT_ADD_DRILLDOWN";class flyout_create_drilldown_FlyoutCreateDrilldownAction{constructor(e){r()(this,"type",m),r()(this,"id",m),r()(this,"order",12),r()(this,"grouping",h.embeddableEnhancedDrilldownGrouping),this.params=e}getDisplayName(){return c.i18n.translate("xpack.dashboard.FlyoutCreateDrilldownAction.displayName",{defaultMessage:"Create drilldown"})}getIconType(){return"plusInCircle"}isEmbeddableCompatible(e){if(!Object(h.isEnhancedEmbeddable)(e.embeddable))return!1;if("dashboard"!==e.embeddable.getRoot().type)return!1;const t=[o.CONTEXT_MENU_TRIGGER,...e.embeddable.supportedTriggers()||[]],n=this.params.start().plugins.uiActionsEnhanced.getActionFactories().map((e=>e.isCompatibleLicense()?e.supportedTriggers():[])).reduce(((e,t)=>e.concat(t)),[]);return g(t).some((e=>n.includes(e)))}async isCompatible(e){return"edit"===e.embeddable.getInput().viewMode&&this.isEmbeddableCompatible(e)}async execute(e){const{core:t,plugins:n}=this.params.start(),{embeddable:a}=e;if(!Object(h.isEnhancedEmbeddable)(a))throw new Error("Need embeddable to be EnhancedEmbeddable to execute FlyoutCreateDrilldownAction.");const r=_(a),s=new b.Subject,i=()=>{s.next(!0),p.close()},d=()=>{i()},c=[...g(a.supportedTriggers()),o.CONTEXT_MENU_TRIGGER],p=t.overlays.openFlyout(Object(u.toMountPoint)(Object(f.jsx)(n.uiActionsEnhanced.DrilldownManager,{closeAfterCreate:!0,initialRoute:"/new",dynamicActionManager:a.enhancements.dynamicActions,triggers:c,placeContext:{embeddable:a},templates:r,onClose:i})),{ownFocus:!0,"data-test-subj":"createDrilldownFlyout"});t.application.currentAppId$.pipe(Object(l.takeUntil)(s),Object(l.skip)(1),Object(l.take)(1)).subscribe(d),a.getInput$().pipe(Object(l.takeUntil)(s),Object(l.map)((e=>e.viewMode)),Object(l.distinctUntilChanged)(),Object(l.filter)((e=>e!==o.ViewMode.EDIT)),Object(l.take)(1)).subscribe({next:d,complete:d})}}const w=c.i18n.translate("xpack.dashboard.panel.openFlyoutEditDrilldown.displayName",{defaultMessage:"Manage drilldowns"});var D=n(4);const O=({context:e})=>{const{events:t}=Object(s.useContainerState)(e.embeddable.enhancements.dynamicActions.state),n=t.length;return Object(f.jsx)(D.EuiFlexGroup,{alignItems:"center"},Object(f.jsx)(D.EuiFlexItem,{grow:!0},w),n>0&&Object(f.jsx)(D.EuiFlexItem,{grow:!1},Object(f.jsx)(D.EuiNotificationBadge,null,n)))},j="OPEN_FLYOUT_EDIT_DRILLDOWN";class flyout_edit_drilldown_FlyoutEditDrilldownAction{constructor(e){r()(this,"type",j),r()(this,"id",j),r()(this,"order",10),r()(this,"grouping",h.embeddableEnhancedDrilldownGrouping),r()(this,"MenuItem",Object(u.reactToUiComponent)(O)),this.params=e}getDisplayName(){return w}getIconType(){return"list"}async isCompatible({embeddable:e}){return e.getInput().viewMode===o.ViewMode.EDIT&&!!Object(h.isEnhancedEmbeddable)(e)&&e.enhancements.dynamicActions.state.get().events.length>0}async execute(e){const{core:t,plugins:n}=this.params.start(),{embeddable:a}=e;if(!Object(h.isEnhancedEmbeddable)(a))throw new Error("Need embeddable to be EnhancedEmbeddable to execute FlyoutEditDrilldownAction.");const r=_(a),s=new b.Subject,i=()=>{s.next(!0),c.close()},d=()=>{i()},c=t.overlays.openFlyout(Object(u.toMountPoint)(Object(f.jsx)(n.uiActionsEnhanced.DrilldownManager,{initialRoute:"/manage",dynamicActionManager:a.enhancements.dynamicActions,triggers:[...g(a.supportedTriggers()),o.CONTEXT_MENU_TRIGGER],placeContext:{embeddable:a},templates:r,onClose:i})),{ownFocus:!0,"data-test-subj":"editDrilldownFlyout"});t.application.currentAppId$.pipe(Object(l.takeUntil)(s),Object(l.skip)(1),Object(l.take)(1)).subscribe(d),a.getInput$().pipe(Object(l.takeUntil)(s),Object(l.map)((e=>e.viewMode)),Object(l.distinctUntilChanged)(),Object(l.filter)((e=>e!==o.ViewMode.EDIT)),Object(l.take)(1)).subscribe({next:d,complete:d})}}var C=n(11),E=n(15),v=n(16),I=n.n(v),y=n(13);const T=c.i18n.translate("xpack.dashboard.components.DashboardDrilldownConfig.chooseDestinationDashboard",{defaultMessage:"Choose destination dashboard"}),x=c.i18n.translate("xpack.dashboard.components.DashboardDrilldownConfig.useCurrentFilters",{defaultMessage:"Use filters and query from origin dashboard"}),R=c.i18n.translate("xpack.dashboard.components.DashboardDrilldownConfig.useCurrentDateRange",{defaultMessage:"Use date range from origin dashboard"}),S=c.i18n.translate("xpack.dashboard.components.DashboardDrilldownConfig.openInNewTab",{defaultMessage:"Open dashboard in new tab"}),F=({activeDashboardId:e,dashboards:t,currentFilters:n,keepRange:a,openInNewTab:r,onDashboardSelect:o,onCurrentFiltersToggle:s,onKeepRangeToggle:i,onOpenInNewTab:c,onSearchChange:l,isLoading:b,error:u})=>{var h;const p=(null===(h=t.find((t=>t.value===e)))||void 0===h?void 0:h.label)||"";return Object(f.jsx)(d.a.Fragment,null,Object(f.jsx)(D.EuiFormRow,{label:T,fullWidth:!0,isInvalid:!!u,error:u},Object(f.jsx)(D.EuiComboBox,{async:!0,selectedOptions:e?[{label:p,value:e}]:[],options:t,onChange:([{value:e=""}={value:""}])=>o(e),onSearchChange:l,isLoading:b,singleSelection:{asPlainText:!0},fullWidth:!0,"data-test-subj":"dashboardDrilldownSelectDashboard",isInvalid:!!u})),!!s&&Object(f.jsx)(D.EuiFormRow,{hasChildLabel:!1},Object(f.jsx)(D.EuiSwitch,{name:"useCurrentFilters",label:x,checked:!!n,onChange:s})),!!i&&Object(f.jsx)(D.EuiFormRow,{hasChildLabel:!1},Object(f.jsx)(D.EuiSwitch,{name:"useCurrentDateRange",label:R,checked:!!a,onChange:i})),!!c&&Object(f.jsx)(D.EuiFormRow,{hasChildLabel:!1},Object(f.jsx)(D.EuiSwitch,{name:"openInNewTab",label:S,checked:!!r,onChange:c})))},k=(e,t)=>t&&-1===Object(y.findIndex)(e,{value:t.value})?[t,...e]:e,A=e=>({value:e.id,label:e.attributes.title});class collect_config_container_CollectConfigContainer extends d.a.Component{constructor(e){super(e),r()(this,"isMounted",!0),r()(this,"state",{dashboards:[],isLoading:!1,searchString:void 0,selectedDashboard:void 0,error:void 0}),r()(this,"debouncedLoadDashboards",void 0),this.debouncedLoadDashboards=Object(y.debounce)(this.loadDashboards.bind(this),500)}componentDidMount(){this.loadSelectedDashboard(),this.loadDashboards()}componentWillUnmount(){this.isMounted=!1}render(){const{config:e,onConfig:t}=this.props,{dashboards:n,selectedDashboard:a,isLoading:r,error:o}=this.state;return Object(f.jsx)(F,{activeDashboardId:e.dashboardId,dashboards:k(n,a),currentFilters:e.useCurrentFilters,keepRange:e.useCurrentDateRange,openInNewTab:e.openInNewTab,isLoading:r,error:o,onDashboardSelect:n=>{t({...e,dashboardId:n}),this.state.error&&this.setState({error:void 0})},onSearchChange:this.debouncedLoadDashboards,onCurrentFiltersToggle:()=>t({...e,useCurrentFilters:!e.useCurrentFilters}),onKeepRangeToggle:()=>t({...e,useCurrentDateRange:!e.useCurrentDateRange}),onOpenInNewTab:()=>t({...e,openInNewTab:!e.openInNewTab})})}async loadSelectedDashboard(){var e;const{config:t,params:{start:n}}=this.props;if(!t.dashboardId)return;const a=await n().core.savedObjects.client.get("dashboard",t.dashboardId);var r;return this.isMounted?404===(null===(e=a.error)||void 0===e?void 0:e.statusCode)?(this.setState({error:(r=t.dashboardId,c.i18n.translate("xpack.dashboard.drilldown.errorDestinationDashboardIsMissing",{defaultMessage:"Destination dashboard ('{dashboardId}') no longer exists. Choose another dashboard.",values:{dashboardId:r}}))}),void this.props.onConfig({...t,dashboardId:void 0})):a.error?(this.setState({error:a.error.message}),void this.props.onConfig({...t,dashboardId:void 0})):void this.setState({selectedDashboard:A(a)}):void 0}async loadDashboards(e){this.setState({searchString:e,isLoading:!0});const t=this.props.params.start().core.savedObjects.client,{savedObjects:n}=await t.find({type:"dashboard",search:e?`${e}*`:void 0,searchFields:["title^3","description"],defaultSearchOperator:"AND",perPage:100});if(!this.isMounted)return;if(e!==this.state.searchString)return;const a=n.map(A);this.setState({dashboards:a,isLoading:!1})}}const M=c.i18n.translate("xpack.dashboard.drilldown.goToDashboard",{defaultMessage:"Go to Dashboard"});class abstract_dashboard_drilldown_AbstractDashboardDrilldown{constructor(e){r()(this,"id",void 0),r()(this,"supportedTriggers",void 0),r()(this,"order",100),r()(this,"getDisplayName",(()=>M)),r()(this,"euiIcon","dashboardApp"),r()(this,"ReactCollectConfig",void 0),r()(this,"CollectConfig",void 0),r()(this,"createConfig",(()=>({dashboardId:"",useCurrentFilters:!0,useCurrentDateRange:!0,openInNewTab:!1}))),r()(this,"isConfigValid",(e=>!!e.dashboardId)),r()(this,"getHref",(async(e,t)=>{const{app:n,path:a}=await this.getLocation(e,t,!0);return await this.params.start().core.application.getUrlForApp(n,{path:a,absolute:!0})})),r()(this,"execute",(async(e,t)=>{if(e.openInNewTab)window.open(await this.getHref(e,t),"_blank");else{const{app:n,path:a,state:r}=await this.getLocation(e,t,!1);await this.params.start().core.application.navigateToApp(n,{path:a,state:r})}})),this.params=e,this.ReactCollectConfig=e=>Object(f.jsx)(collect_config_container_CollectConfigContainer,I()({},e,{params:this.params})),this.CollectConfig=Object(u.reactToUiComponent)(this.ReactCollectConfig)}get locator(){const e=this.params.start().plugins.dashboard.locator;if(!e)throw new Error("Dashboard locator is required for dashboard drilldown.");return e}}const N=(e,t)=>`drilldown:${t}:${e.eventId}:dashboardId`;class embeddable_to_dashboard_drilldown_EmbeddableToDashboardDrilldown extends abstract_dashboard_drilldown_AbstractDashboardDrilldown{constructor(...e){super(...e),r()(this,"id","DASHBOARD_TO_DASHBOARD_DRILLDOWN"),r()(this,"supportedTriggers",(()=>[p.APPLY_FILTER_TRIGGER])),r()(this,"inject",(({drilldownId:e})=>(t,n)=>{const a=t.action,r=N(t,e),o=n.find((e=>e.name===r));return o?o.id&&o.id===a.config.dashboardId?t:((e,t)=>({...e,action:{...e.action,config:{...e.action.config,dashboardId:t}}}))(t,o.id):t})({drilldownId:this.id})),r()(this,"extract",(({drilldownId:e})=>t=>{const n=t.action,a=n.config.dashboardId?[{name:N(t,e),type:"dashboard",id:n.config.dashboardId}]:[],{dashboardId:r,...o}=n.config;return{state:{...t,action:{...t.action,config:o}},references:a}})({drilldownId:this.id}))}async getLocation(e,t,n){const a={dashboardId:e.dashboardId};if(t.embeddable){var r;const n=t.embeddable.getInput();Object(p.isQuery)(n.query)&&e.useCurrentFilters&&(a.query=n.query),Object(p.isTimeRange)(n.timeRange)&&e.useCurrentDateRange&&(a.timeRange=n.timeRange),a.filters=e.useCurrentFilters?n.filters:null===(r=n.filters)||void 0===r?void 0:r.filter((e=>Object(C.isFilterPinned)(e)))}const{restOfFilters:o,timeRange:s}=Object(C.extractTimeRange)(t.filters,t.timeFieldName);var i;o&&(a.filters=[...null!==(i=a.filters)&&void 0!==i?i:[],...o]),s&&(a.timeRange=s);const d=await this.locator.getLocation(a);return n&&this.useUrlForState(d),d}useUrlForState(e){var t;const n=e.state;e.path=Object(s.setStateToKbnUrl)("_a",Object(E.cleanEmptyKeys)({query:n.query,filters:null===(t=n.filters)||void 0===t?void 0:t.filter((e=>!Object(C.isFilterPinned)(e))),savedQuery:n.savedQuery}),{useHash:!1,storeInHashQuery:!0},e.path)}}class dashboard_drilldowns_services_DashboardDrilldownsService{bootstrap(e,t,{enableDrilldowns:n}){n&&this.setupDrilldowns(e,t)}setupDrilldowns(e,{uiActionsEnhanced:t}){const n=Object(s.createStartServicesGetter)(e.getStartServices),a=new flyout_create_drilldown_FlyoutCreateDrilldownAction({start:n});t.addTriggerAction(o.CONTEXT_MENU_TRIGGER,a);const r=new flyout_edit_drilldown_FlyoutEditDrilldownAction({start:n});t.addTriggerAction(o.CONTEXT_MENU_TRIGGER,r);const i=new embeddable_to_dashboard_drilldown_EmbeddableToDashboardDrilldown({start:n});t.registerDrilldown(i)}}class plugin_DashboardEnhancedPlugin{constructor(e){r()(this,"drilldowns",new dashboard_drilldowns_services_DashboardDrilldownsService),this.context=e}setup(e,t){return this.drilldowns.bootstrap(e,t,{enableDrilldowns:!0}),{}}start(e,t){return{}}stop(){}}function L(e){return new plugin_DashboardEnhancedPlugin(e)}}]);