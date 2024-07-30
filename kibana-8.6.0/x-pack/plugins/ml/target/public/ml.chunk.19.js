/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.ml_bundle_jsonpfunction=window.ml_bundle_jsonpfunction||[]).push([[19],{252:function(e,t,a){"use strict";a.d(t,"a",(function(){return i})),a.d(t,"c",(function(){return r})),a.d(t,"b",(function(){return c}));var n=a(8),s=a(88),o=a(116),l=a(28);function i(e){return function(e,t){var a,n;const l=Math.ceil(null!==(a=Object(s.t)(e.map((e=>e.analysis_config.bucket_span))))&&void 0!==a?a:0),i=Math.ceil(null!==(n=Object(s.t)(t.map((e=>e.query_delay)).filter(o.a)))&&void 0!==n?n:0),r=Math.max(120,2*l)+i+1;return`${Math.ceil(r/60)}m`}(e,e.map((e=>e.datafeed_config)))}function r(e){const t=Object(l.a)(e.analysis_config.bucket_span);if(null===t)throw new Error("Unable to resolve a bucket span length");return Math.ceil(60/t.asSeconds())}const d=["datafeed","mml","delayedData","errorMessages"];function c(e){var t,a,s,o,l,i,r,c,u,m,p,b,y,g;const h={datafeed:{enabled:null===(t=null==e||null===(a=e.datafeed)||void 0===a?void 0:a.enabled)||void 0===t||t},mml:{enabled:null===(s=null==e||null===(o=e.mml)||void 0===o?void 0:o.enabled)||void 0===s||s},delayedData:{enabled:null===(l=null==e||null===(i=e.delayedData)||void 0===i?void 0:i.enabled)||void 0===l||l,docsCount:null!==(r=null==e||null===(c=e.delayedData)||void 0===c?void 0:c.docsCount)&&void 0!==r?r:1,timeInterval:null!==(u=null==e||null===(m=e.delayedData)||void 0===m?void 0:m.timeInterval)&&void 0!==u?u:null},behindRealtime:{enabled:null===(p=null==e||null===(b=e.behindRealtime)||void 0===b?void 0:b.enabled)||void 0===p||p},errorMessages:{enabled:null===(y=null==e||null===(g=e.errorMessages)||void 0===g?void 0:g.enabled)||void 0===y||y}};return Object(n.pick)(h,d)}},641:function(e,t,a){"use strict";a.r(t),a.d(t,"registerEmbeddables",(function(){return n.f})),a.d(t,"registerManagementSection",(function(){return s.a})),a.d(t,"registerMlUiActions",(function(){return o.b})),a.d(t,"registerSearchLinks",(function(){return h})),a.d(t,"registerMlAlerts",(function(){return E})),a.d(t,"registerMapExtension",(function(){return U})),a.d(t,"registerCasesAttachments",(function(){return G}));var n=a(109),s=a(37),o=a(180),l=a(2),i=a(0);const r={id:"mlOverviewDeepLink",title:l.i18n.translate("xpack.ml.deepLink.overview",{defaultMessage:"Overview"}),path:`/${i.b.OVERVIEW}`},d={id:"mlAnomalyDetectionDeepLink",title:l.i18n.translate("xpack.ml.deepLink.anomalyDetection",{defaultMessage:"Anomaly Detection"}),path:`/${i.b.ANOMALY_DETECTION_JOBS_MANAGE}`},c={id:"mlDataFrameAnalyticsDeepLink",title:l.i18n.translate("xpack.ml.deepLink.dataFrameAnalytics",{defaultMessage:"Data Frame Analytics"}),path:`/${i.b.DATA_FRAME_ANALYTICS_JOBS_MANAGE}`},u={id:"mlModelManagementDeepLink",title:l.i18n.translate("xpack.ml.deepLink.trainedModels",{defaultMessage:"Trained Models"}),path:`/${i.b.TRAINED_MODELS_MANAGE}`,deepLinks:[{id:"mlNodesOverviewDeepLink",title:l.i18n.translate("xpack.ml.deepLink.modelManagement",{defaultMessage:"Model Management"}),path:`/${i.b.TRAINED_MODELS_MANAGE}`},{id:"mlNodesOverviewDeepLink",title:l.i18n.translate("xpack.ml.deepLink.nodesOverview",{defaultMessage:"Nodes"}),path:`/${i.b.TRAINED_MODELS_NODES}`}]},m={id:"dataVisualizerDeepLink",title:l.i18n.translate("xpack.ml.deepLink.dataVisualizer",{defaultMessage:"Data Visualizer"}),path:`/${i.b.DATA_VISUALIZER}`},p={id:"mlFileUploadDeepLink",title:l.i18n.translate("xpack.ml.deepLink.fileUpload",{defaultMessage:"File Upload"}),keywords:["CSV","JSON"],path:`/${i.b.DATA_VISUALIZER_FILE}`},b={id:"mlIndexDataVisualizerDeepLink",title:l.i18n.translate("xpack.ml.deepLink.indexDataVisualizer",{defaultMessage:"Index Data Visualizer"}),path:`/${i.b.DATA_VISUALIZER_INDEX_SELECT}`},y={id:"mlSettingsDeepLink",title:l.i18n.translate("xpack.ml.deepLink.settings",{defaultMessage:"Settings"}),path:`/${i.b.SETTINGS}`,deepLinks:[{id:"mlCalendarSettingsDeepLink",title:l.i18n.translate("xpack.ml.deepLink.calendarSettings",{defaultMessage:"Calendars"}),path:`/${i.b.CALENDARS_MANAGE}`},{id:"mlFilterListsSettingsDeepLink",title:l.i18n.translate("xpack.ml.deepLink.filterListsSettings",{defaultMessage:"Filter Lists"}),path:`/${i.b.SETTINGS}`}]};function g(e){const t=[m,p,b];return!0===e&&t.push(r,d,c,u,y),t}function h(e,t){e.next((()=>({keywords:[l.i18n.translate("xpack.ml.keyword.ml",{defaultMessage:"ML"})],deepLinks:g(t)})))}var _=a(17),v=a.n(_),f=a(11),A=a(4),M=a(38),j=a(324),k=a(20);const S=Object(k.f)(),x=Object(j.numberValidator)({min:1});var L=a(252);function E(e,t){e.ruleTypeRegistry.register({id:f.d.ANOMALY_DETECTION,description:l.i18n.translate("xpack.ml.alertTypes.anomalyDetection.description",{defaultMessage:"Alert when anomaly detection jobs results match the condition."}),iconClass:"bell",documentationUrl:e=>e.links.ml.alertingRules,ruleParamsExpression:Object(_.lazy)((()=>a.e(12).then(a.bind(null,645)))),validate:e=>{var t,a,n,s,o,i,r,d;const c={errors:{jobSelection:new Array,severity:new Array,resultType:new Array,topNBuckets:new Array,lookbackInterval:new Array}};return null!==(t=e.jobSelection)&&void 0!==t&&null!==(a=t.jobIds)&&void 0!==a&&a.length||null!==(n=e.jobSelection)&&void 0!==n&&null!==(s=n.groupIds)&&void 0!==s&&s.length||c.errors.jobSelection.push(l.i18n.translate("xpack.ml.alertTypes.anomalyDetection.jobSelection.errorMessage",{defaultMessage:"Job selection is required"})),(Array.isArray(null===(o=e.jobSelection)||void 0===o?void 0:o.groupIds)&&(null===(i=e.jobSelection)||void 0===i?void 0:i.groupIds.length)>0||Array.isArray(null===(r=e.jobSelection)||void 0===r?void 0:r.jobIds)&&(null===(d=e.jobSelection)||void 0===d?void 0:d.jobIds.length)>1)&&c.errors.jobSelection.push(l.i18n.translate("xpack.ml.alertTypes.anomalyDetection.singleJobSelection.errorMessage",{defaultMessage:"Only one job per rule is allowed"})),void 0===e.severity&&c.errors.severity.push(l.i18n.translate("xpack.ml.alertTypes.anomalyDetection.severity.errorMessage",{defaultMessage:"Anomaly severity is required"})),void 0===e.resultType&&c.errors.resultType.push(l.i18n.translate("xpack.ml.alertTypes.anomalyDetection.resultType.errorMessage",{defaultMessage:"Result type is required"})),e.lookbackInterval&&S(e.lookbackInterval)&&c.errors.lookbackInterval.push(l.i18n.translate("xpack.ml.alertTypes.anomalyDetection.lookbackInterval.errorMessage",{defaultMessage:"Lookback interval is invalid"})),"number"==typeof e.topNBuckets&&x(e.topNBuckets)&&c.errors.topNBuckets.push(l.i18n.translate("xpack.ml.alertTypes.anomalyDetection.topNBuckets.errorMessage",{defaultMessage:"Number of buckets is invalid"})),c},requiresAppContext:!1,defaultActionMessage:l.i18n.translate("xpack.ml.alertTypes.anomalyDetection.defaultActionMessage",{defaultMessage:"[\\{\\{rule.name\\}\\}] Elastic Stack Machine Learning Alert:\n- Job IDs: \\{\\{context.jobIds\\}\\}\n- Time: \\{\\{context.timestampIso8601\\}\\}\n- Anomaly score: \\{\\{context.score\\}\\}\n\n\\{\\{context.message\\}\\}\n\n\\{\\{#context.topInfluencers.length\\}\\}\n  Top influencers:\n  \\{\\{#context.topInfluencers\\}\\}\n    \\{\\{influencer_field_name\\}\\} = \\{\\{influencer_field_value\\}\\} [\\{\\{score\\}\\}]\n  \\{\\{/context.topInfluencers\\}\\}\n\\{\\{/context.topInfluencers.length\\}\\}\n\n\\{\\{#context.topRecords.length\\}\\}\n  Top records:\n  \\{\\{#context.topRecords\\}\\}\n    \\{\\{function\\}\\}(\\{\\{field_name\\}\\}) \\{\\{by_field_value\\}\\}\\{\\{over_field_value\\}\\}\\{\\{partition_field_value\\}\\} [\\{\\{score\\}\\}]. Typical: \\{\\{typical\\}\\}, Actual: \\{\\{actual\\}\\}\n  \\{\\{/context.topRecords\\}\\}\n\\{\\{/context.topRecords.length\\}\\}\n\n\\{\\{! Replace kibanaBaseUrl if not configured in Kibana \\}\\}\n[Open in Anomaly Explorer](\\{\\{\\{kibanaBaseUrl\\}\\}\\}\\{\\{\\{context.anomalyExplorerUrl\\}\\}\\})\n"})}),function(e,t){e.ruleTypeRegistry.register({id:f.d.AD_JOBS_HEALTH,description:l.i18n.translate("xpack.ml.alertTypes.jobsHealthAlertingRule.description",{defaultMessage:"Alert when anomaly detection jobs experience operational issues. Enable suitable alerts for critically important jobs."}),iconClass:"bell",documentationUrl:e=>e.links.ml.alertingRules,ruleParamsExpression:Object(_.lazy)((()=>a.e(13).then(a.bind(null,649)))),validate:e=>{var t,a,n,s;const o={errors:{includeJobs:new Array,testsConfig:new Array,delayedData:new Array}};null!==(t=e.includeJobs)&&void 0!==t&&null!==(a=t.jobIds)&&void 0!==a&&a.length||null!==(n=e.includeJobs)&&void 0!==n&&null!==(s=n.groupIds)&&void 0!==s&&s.length||o.errors.includeJobs.push(l.i18n.translate("xpack.ml.alertTypes.jobsHealthAlertingRule.includeJobs.errorMessage",{defaultMessage:"Job selection is required"}));const i=Object(L.b)(e.testsConfig);return Object.values(i).every((e=>!1===(null==e?void 0:e.enabled)))&&o.errors.testsConfig.push(l.i18n.translate("xpack.ml.alertTypes.jobsHealthAlertingRule.testsConfig.errorMessage",{defaultMessage:"At least one health check must be enabled."})),i.delayedData.timeInterval&&S(i.delayedData.timeInterval)&&o.errors.delayedData.push(l.i18n.translate("xpack.ml.alertTypes.jobsHealthAlertingRule.testsConfig.delayedData.timeIntervalErrorMessage",{defaultMessage:"Invalid time interval"})),0===i.delayedData.docsCount&&o.errors.delayedData.push(l.i18n.translate("xpack.ml.alertTypes.jobsHealthAlertingRule.testsConfig.delayedData.docsCountErrorMessage",{defaultMessage:"Invalid number of documents"})),o},requiresAppContext:!1,defaultActionMessage:l.i18n.translate("xpack.ml.alertTypes.jobsHealthAlertingRule.defaultActionMessage",{defaultMessage:"[\\{\\{rule.name\\}\\}] Anomaly detection jobs health check result:\n\\{\\{context.message\\}\\}\n\\{\\{#context.results\\}\\}\n  Job ID: \\{\\{job_id\\}\\}\n  \\{\\{#datafeed_id\\}\\}Datafeed ID: \\{\\{datafeed_id\\}\\}\n  \\{\\{/datafeed_id\\}\\}\\{\\{#datafeed_state\\}\\}Datafeed state: \\{\\{datafeed_state\\}\\}\n  \\{\\{/datafeed_state\\}\\}\\{\\{#memory_status\\}\\}Memory status: \\{\\{memory_status\\}\\}\n  \\{\\{/memory_status\\}\\}\\{\\{#model_bytes\\}\\}Model size: \\{\\{model_bytes\\}\\}\n  \\{\\{/model_bytes\\}\\}\\{\\{#model_bytes_memory_limit\\}\\}Model memory limit: \\{\\{model_bytes_memory_limit\\}\\}\n  \\{\\{/model_bytes_memory_limit\\}\\}\\{\\{#peak_model_bytes\\}\\}Peak model bytes: \\{\\{peak_model_bytes\\}\\}\n  \\{\\{/peak_model_bytes\\}\\}\\{\\{#model_bytes_exceeded\\}\\}Model exceeded: \\{\\{model_bytes_exceeded\\}\\}\n  \\{\\{/model_bytes_exceeded\\}\\}\\{\\{#log_time\\}\\}Memory logging time: \\{\\{log_time\\}\\}\n  \\{\\{/log_time\\}\\}\\{\\{#failed_category_count\\}\\}Failed category count: \\{\\{failed_category_count\\}\\}\n  \\{\\{/failed_category_count\\}\\}\\{\\{#annotation\\}\\}Annotation: \\{\\{annotation\\}\\}\n  \\{\\{/annotation\\}\\}\\{\\{#missed_docs_count\\}\\}Number of missed documents: \\{\\{missed_docs_count\\}\\}\n  \\{\\{/missed_docs_count\\}\\}\\{\\{#end_timestamp\\}\\}Latest finalized bucket with missing docs: \\{\\{end_timestamp\\}\\}\n  \\{\\{/end_timestamp\\}\\}\\{\\{#errors\\}\\}Error message: \\{\\{message\\}\\} \\{\\{/errors\\}\\}\n\\{\\{/context.results\\}\\}\n"})})}(e),t&&function(e){e.registerNavigation(A.e,f.d.ANOMALY_DETECTION,(e=>{var t,a;const n=e.params,s=[...new Set([...null!==(t=n.jobSelection.jobIds)&&void 0!==t?t:[],...null!==(a=n.jobSelection.groupIds)&&void 0!==a?a:[]])];return Object(M.d)("",{jobIds:s})}))}(t)}var I=a(5),D=a.n(I),C=a(52),O=a(121);class anomaly_source_factory_AnomalySourceFactory{constructor(e,t){D()(this,"type",C.SOURCE_TYPES.ES_ML_ANOMALIES),this.getStartServices=e,this.canGetJobs=t,this.canGetJobs=t}async getServices(){const[e]=await this.getStartServices(),{mlApiServicesProvider:t}=await Promise.resolve().then(a.bind(null,81));return{mlResultsService:t(new O.a(e.http)).results}}async create(){const{mlResultsService:e}=await this.getServices(),{AnomalySource:t}=await Promise.resolve().then(a.bind(null,345));return t.mlResultsService=e,t.canGetJobs=this.canGetJobs,t}}var w=a(44),T=a(163),J=a(8),N=a(45),R=a(13);const P=({jobsManagementPath:e,canCreateJobs:t})=>Object(R.jsx)(w.EuiEmptyPrompt,{layout:"vertical",hasBorder:!1,hasShadow:!1,color:"subdued",title:Object(R.jsx)("h2",null,Object(R.jsx)(N.FormattedMessage,{id:"xpack.ml.mapsAnomaliesLayerEmptyPrompt.createJobMessage",defaultMessage:"Create an anomaly detection job"})),body:Object(R.jsx)("p",null,Object(R.jsx)(N.FormattedMessage,{id:"xpack.ml.mapsAnomaliesLayerEmptyPrompt.emptyPromptText",defaultMessage:"Anomaly detection enables you to find unusual behaviour in your geographic data. Create a job that uses the lat_long function, which is necessary for the maps anomaly layer."})),actions:Object(R.jsx)(w.EuiButton,{color:"primary",href:e,fill:!0,iconType:"plusInCircle",isDisabled:!t,"data-test-subj":"mlMapsCreateNewJobButton"},Object(R.jsx)(N.FormattedMessage,{id:"xpack.ml.mapsAnomaliesLayerEmptyPrompt.createJobButtonText",defaultMessage:"Create job"})),"data-test-subj":"mlMapsAnomalyDetectionEmptyState"});class anomaly_job_selector_AnomalyJobSelector extends _.Component{constructor(...e){super(...e),D()(this,"_isMounted",!1),D()(this,"state",{}),D()(this,"onJobIdSelect",(e=>{const t=e[0].value;this._isMounted&&(this.setState({jobId:t}),this.props.onJobChange(t))}))}async _loadJobs(){const e=(await this.props.mlJobsService.jobIdsWithGeo()).map((e=>({label:e,value:e})));this._isMounted&&!Object(J.isEqual)(e,this.state.jobIdList)&&this.setState({jobIdList:e})}componentDidUpdate(e,t){this._loadJobs()}componentDidMount(){this._isMounted=!0,this._loadJobs()}componentWillUnmount(){this._isMounted=!1}render(){var e,t;return(null===(e=this.state.jobIdList)||void 0===e?void 0:e.length)&&(null===(t=this.state.jobIdList)||void 0===t?void 0:t.length)>0||!this.props.jobsManagementPath?Object(R.jsx)(w.EuiFormRow,{label:l.i18n.translate("xpack.ml.maps.jobIdLabel",{defaultMessage:"Job ID"}),display:"columnCompressed"},Object(R.jsx)(w.EuiComboBox,{singleSelection:!0,onChange:this.onJobIdSelect,options:this.state.jobIdList,selectedOptions:this.state.jobId?[{value:this.state.jobId,label:this.state.jobId}]:[]})):Object(R.jsx)(P,{jobsManagementPath:this.props.jobsManagementPath,canCreateJobs:this.props.canCreateJobs})}}var F=a(332);class create_anomaly_source_editor_CreateAnomalySourceEditor extends _.Component{constructor(...e){super(...e),D()(this,"_isMounted",!1),D()(this,"state",{}),D()(this,"onTypicalActualChange",(e=>{this._isMounted&&this.setState({typicalActual:e},(()=>{this.configChange()}))})),D()(this,"previewLayer",(e=>{this._isMounted&&this.setState({jobId:e},(()=>{this.configChange()}))}))}configChange(){this.state.jobId&&this.props.onSourceConfigChange({jobId:this.state.jobId,typicalActual:this.state.typicalActual||T.b.ACTUAL})}componentDidMount(){this._isMounted=!0}render(){const e=this.state.jobId?Object(R.jsx)(F.a,{onChange:this.onTypicalActualChange,typicalActual:this.state.typicalActual||T.b.ACTUAL}):null;return Object(R.jsx)(w.EuiPanel,null,Object(R.jsx)(anomaly_job_selector_AnomalyJobSelector,{onJobChange:this.previewLayer,mlJobsService:this.props.mlJobsService,jobsManagementPath:this.props.jobsManagementPath,canCreateJobs:this.props.canCreateJobs}),e)}}var B=a(345);class anomaly_layer_wizard_factory_AnomalyLayerWizardFactory{constructor(e,t,a){D()(this,"type","ML_ANOMALIES"),this.getStartServices=e,this.canGetJobs=t,this.canCreateJobs=a,this.canGetJobs=t,this.canCreateJobs=a}async getServices(){const[e,t]=await this.getStartServices(),{jobsApiProvider:n}=await Promise.resolve().then(a.bind(null,218));return{mlJobsService:n(new O.a(e.http)),mlLocator:t.share.url.locators.get(i.a)}}async create(){const{mlJobsService:e,mlLocator:t}=await this.getServices();let n;t?n=await t.getUrl({page:i.b.ANOMALY_DETECTION_JOBS_MANAGE}):console.error("Unable to get job management path.");const{anomalyLayerWizard:s}=await a.e(30).then(a.bind(null,638));return s.getIsDisabled=()=>!this.canGetJobs,s.renderWizard=({previewLayers:t})=>Object(R.jsx)(create_anomaly_source_editor_CreateAnomalySourceEditor,{onSourceConfigChange:e=>{if(!e)return void t([]);const a={id:Object(w.htmlIdGenerator)()(),type:C.LAYER_TYPE.GEOJSON_VECTOR,sourceDescriptor:B.AnomalySource.createDescriptor({jobId:e.jobId,typicalActual:e.typicalActual}),style:{type:"VECTOR",properties:{fillColor:T.a,lineColor:T.a},isTimeAware:!1}};t([a])},mlJobsService:e,jobsManagementPath:n,canCreateJobs:this.canCreateJobs}),s}}async function U(e,t,{canGetJobs:a,canCreateJobs:n}){const s=new anomaly_source_factory_AnomalySourceFactory(t.getStartServices,a),o=new anomaly_layer_wizard_factory_AnomalyLayerWizardFactory(t.getStartServices,a,n),l=await o.create();e.registerSource({type:s.type,ConstructorFunction:await s.create()}),e.registerLayerWizard(l)}var z=a(40);function G(e,t,s){!function(e,t,s){const o=Object(n.c)(z.ANOMALY_SWIMLANE_EMBEDDABLE_TYPE,t,s);e.attachmentFramework.registerPersistableState({id:z.ANOMALY_SWIMLANE_EMBEDDABLE_TYPE,icon:A.c,displayName:l.i18n.translate("xpack.ml.cases.anomalySwimLane.displayName",{defaultMessage:"Anomaly swim lane"}),getAttachmentViewObject:()=>({event:Object(R.jsx)(N.FormattedMessage,{id:"xpack.ml.cases.anomalySwimLane.embeddableAddedEvent",defaultMessage:"added anomaly swim lane"}),timelineAvatar:A.c,children:v.a.lazy((async()=>{const{initComponent:e}=await a.e(24).then(a.bind(null,640));return{default:e(s.fieldFormats,o)}}))})})}(e,t,s),function(e,t,s){const o=Object(n.c)(n.a,t,s);e.attachmentFramework.registerPersistableState({id:n.a,icon:A.c,displayName:l.i18n.translate("xpack.ml.cases.anomalyCharts.displayName",{defaultMessage:"Anomaly charts"}),getAttachmentViewObject:()=>({event:Object(R.jsx)(N.FormattedMessage,{id:"xpack.ml.cases.anomalyCharts.embeddableAddedEvent",defaultMessage:"added anomaly chart"}),timelineAvatar:A.c,children:v.a.lazy((async()=>{const{initComponent:e}=await a.e(23).then(a.bind(null,639));return{default:e(s.fieldFormats,o)}}))})})}(e,t,s)}}}]);