(window.visualizations_bundle_jsonpfunction=window.visualizations_bundle_jsonpfunction||[]).push([[10,13],{200:function(t,e,i){"use strict";i.r(e),i.d(e,"VisualizeEmbeddable",(function(){return visualize_embeddable_VisualizeEmbeddable}));var s=i(0),a=i.n(s),n=i(6),r=i.n(n),o=i(42),d=i(2),h=(i(9),i(20)),l=i(10),u=i(54),p=i(18),c=i(66),v=i(12),b=i(60),g=i(7),m=i(76),y=i(77),f=i(17),C=i(4);const T=({savedObjectMeta:t,application:e,message:i,renderMode:s})=>{const{management:a}=e.capabilities.navLinks,n=e.capabilities.management.kibana.indexPatterns;return Object(C.jsx)(l.EuiEmptyPrompt,{iconType:"alert",iconColor:"danger","data-test-subj":"visualization-missed-data-view-error",actions:t.savedObjectType===f.DATA_VIEW_SAVED_OBJECT_TYPE&&"edit"===s&&a&&n?Object(C.jsx)(y.a,{navigateToUrl:e.navigateToUrl},Object(C.jsx)("a",{href:e.getUrlForApp("management",{path:"/kibana/indexPatterns/create"}),"data-test-subj":"configuration-failure-reconfigure-indexpatterns"},d.i18n.translate("visualizations.missedDataView.dataViewReconfigure",{defaultMessage:"Recreate it in the data view management page"}))):null,body:Object(C.jsx)("p",null,i)})};var j=i(99),S=i(19),x=i(1),O=i(40),w=i(8),E=i(67);class visualize_embeddable_VisualizeEmbeddable extends v.Embeddable{constructor(t,{vis:e,editPath:i,editUrl:s,indexPatterns:n,deps:h,capabilities:l},u,p,c){if(super(u,{defaultTitle:e.title,editPath:i,editApp:"visualize",editUrl:s,indexPatterns:n,visTypeName:e.type.name},c),a()(this,"handler",void 0),a()(this,"timefilter",void 0),a()(this,"timeRange",void 0),a()(this,"query",void 0),a()(this,"filters",void 0),a()(this,"searchSessionId",void 0),a()(this,"syncColors",void 0),a()(this,"syncTooltips",void 0),a()(this,"syncCursor",void 0),a()(this,"embeddableTitle",void 0),a()(this,"visCustomizations",void 0),a()(this,"subscriptions",[]),a()(this,"expression",void 0),a()(this,"vis",void 0),a()(this,"domNode",void 0),a()(this,"warningDomNode",void 0),a()(this,"type",S.a),a()(this,"abortController",void 0),a()(this,"deps",void 0),a()(this,"inspectorAdapters",void 0),a()(this,"attributeService",void 0),a()(this,"expressionVariablesSubject",new o.ReplaySubject(1)),a()(this,"getInspectorAdapters",(()=>{if(this.handler&&(!this.inspectorAdapters||Object.keys(this.inspectorAdapters).length))return this.handler.inspect()})),a()(this,"openInspector",(()=>{if(!this.handler)return;const t=this.handler.inspect();return t?this.deps.start().plugins.inspector.open(t,{title:this.getTitle()||d.i18n.translate("visualizations.embeddable.inspectorTitle",{defaultMessage:"Inspector"})}):void 0})),a()(this,"hasInspector",(()=>Boolean(this.getInspectorAdapters()))),a()(this,"onContainerLoading",(()=>{this.renderComplete.dispatchInProgress(),this.updateOutput({...this.getOutput(),loading:!0,rendered:!1,error:void 0})})),a()(this,"onContainerData",(()=>{this.handleWarnings(),this.updateOutput({...this.getOutput(),loading:!1})})),a()(this,"onContainerRender",(()=>{this.renderComplete.dispatchComplete(),this.updateOutput({...this.getOutput(),rendered:!0})})),a()(this,"onContainerError",(t=>{var e;this.abortController&&this.abortController.abort(),this.renderComplete.dispatchError(),Object(m.f)(this.vis.data.indexPattern)&&(t=new Error(d.i18n.translate("visualizations.missedDataView.errorMessage",{defaultMessage:"Could not find the {type}: {id}",values:{id:null!==(e=this.vis.data.indexPattern.id)&&void 0!==e?e:"-",type:this.vis.data.savedSearchId?d.i18n.translate("visualizations.noSearch.label",{defaultMessage:"search"}):d.i18n.translate("visualizations.noDataView.label",{defaultMessage:"data view"})}}))),this.updateOutput({...this.getOutput(),rendered:!0,error:t})})),a()(this,"reload",(async()=>{await this.handleVisUpdate()})),a()(this,"handleVisUpdate",(async()=>{this.handleChanges(),await this.updateHandler()})),a()(this,"uiStateChangeHandler",(()=>{this.updateInput({...this.vis.uiState.toJSON()})})),a()(this,"inputIsRefType",(t=>{if(!this.attributeService)throw new Error("AttributeService must be defined for getInputAsRefType");return this.attributeService.inputIsRefType(t)})),a()(this,"getInputAsValueType",(async()=>{const t={savedVis:this.vis.serialize()};return delete t.savedVis.id,r.a.unset(t,"savedVis.title"),new Promise((e=>{e({...t})}))})),a()(this,"getInputAsRefType",(async()=>{const{savedObjectsClient:t,data:e,spaces:i,savedObjectsTaggingOss:s}=await this.deps.start().plugins,a=await Object(w.e)({savedObjectsClient:t,search:e.search,dataViews:e.dataViews,spaces:i,savedObjectsTagging:null==s?void 0:s.getTaggingApi()});if(!a)throw new Error("Error creating a saved vis object");if(!this.attributeService)throw new Error("AttributeService must be defined for getInputAsRefType");const n=this.getTitle()?this.getTitle():d.i18n.translate("visualizations.embeddable.placeholderTitle",{defaultMessage:"Placeholder Title"}),r={savedVis:a,vis:this.vis,title:this.vis.title};return this.attributeService.getInputAsRefType({id:this.id,attributes:r},{showSaveModal:!0,saveModalTitle:n})})),this.deps=h,this.timefilter=t,this.syncColors=this.input.syncColors,this.syncTooltips=this.input.syncTooltips,this.syncCursor=this.input.syncCursor,this.searchSessionId=this.input.searchSessionId,this.query=this.input.query,this.embeddableTitle=this.getTitle(),this.vis=e,this.vis.uiState.on("change",this.uiStateChangeHandler),this.vis.uiState.on("reload",this.reload),this.attributeService=p,this.attributeService){const t=!this.inputIsRefType(u),e=l.visualizeSave||t&&l.dashboardSave;this.updateOutput({...this.getOutput(),editable:e})}this.subscriptions.push(this.getInput$().subscribe((()=>{this.handleChanges()&&this.handler&&this.updateHandler()})));const v=this.vis.type.inspectorAdapters;v&&(this.inspectorAdapters="function"==typeof v?v():v)}reportsEmbeddableLoad(){return!0}getDescription(){return this.vis.description}getVis(){return this.vis}async getFilters(){var t,e,i;let s=this.getInput();this.inputIsRefType(s)&&(s=await this.getInputAsValueType());const a=null!==(t=null===(e=s.savedVis)||void 0===e||null===(i=e.data.searchSource)||void 0===i?void 0:i.filter)&&void 0!==t?t:[];return Object(g.mapAndFlattenFilters)(r.a.cloneDeep(a))}async getQuery(){var t,e;let i=this.getInput();return this.inputIsRefType(i)&&(i=await this.getInputAsValueType()),null===(t=i.savedVis)||void 0===t||null===(e=t.data.searchSource)||void 0===e?void 0:e.query}transferCustomizationsToUiState(){const t={vis:this.input.vis,table:this.input.table};t.vis||t.table?r.a.isEqual(t,this.visCustomizations)||(this.visCustomizations=t,this.vis.uiState.off("change",this.uiStateChangeHandler),this.vis.uiState.clearAllKeys(),Object.entries(t).forEach((([t,e])=>{e&&this.vis.uiState.set(t,e)})),this.vis.uiState.on("change",this.uiStateChangeHandler)):this.parent&&this.vis.uiState.clearAllKeys()}handleChanges(){this.transferCustomizationsToUiState();let t=!1;const e=void 0!==this.input.timeslice?{from:new Date(this.input.timeslice[0]).toISOString(),to:new Date(this.input.timeslice[1]).toISOString(),mode:"absolute"}:this.input.timeRange;return r.a.isEqual(e,this.timeRange)||(this.timeRange=r.a.cloneDeep(e),t=!0),Object(u.onlyDisabledFiltersChanged)(this.input.filters,this.filters)||(this.filters=this.input.filters,t=!0),r.a.isEqual(this.input.query,this.query)||(this.query=this.input.query,t=!0),this.searchSessionId!==this.input.searchSessionId&&(this.searchSessionId=this.input.searchSessionId,t=!0),this.syncColors!==this.input.syncColors&&(this.syncColors=this.input.syncColors,t=!0),this.syncTooltips!==this.input.syncTooltips&&(this.syncTooltips=this.input.syncTooltips,t=!0),this.syncCursor!==this.input.syncCursor&&(this.syncCursor=this.input.syncCursor,t=!0),this.embeddableTitle!==this.getTitle()&&(this.embeddableTitle=this.getTitle(),t=!0),this.vis.description&&this.domNode&&this.domNode.setAttribute("data-description",this.vis.description),t}handleWarnings(){var t;const e=[];null!==(t=this.getInspectorAdapters())&&void 0!==t&&t.requests&&this.deps.start().plugins.data.search.showWarnings(this.getInspectorAdapters().requests,(t=>{var i,s;return"shard_failure"===t.type&&"unsupported_aggregation_on_downsampled_index"===t.reason.type?(e.push(t.reason.reason||t.message),!0):!(null===(i=(s=this.vis.type).suppressWarnings)||void 0===i||!i.call(s))||void 0})),this.warningDomNode&&Object(h.render)(Object(C.jsx)(c.Warnings,{warnings:e||[]}),this.warningDomNode)}async render(t){this.timeRange=r.a.cloneDeep(this.input.timeRange),this.transferCustomizationsToUiState();const e=document.createElement("div");e.className="visualize panel-content panel-content--fullWidth",t.appendChild(e);const i=document.createElement("div");i.className="visPanel__warnings",t.appendChild(i),this.warningDomNode=i,this.domNode=e,super.render(this.domNode),Object(h.render)(Object(C.jsx)(p.KibanaThemeProvider,{theme$:Object(x.n)().theme$},Object(C.jsx)("div",{className:"visChart__spinner"},Object(C.jsx)(l.EuiLoadingChart,{mono:!0,size:"l"}))),this.domNode);const s=Object(x.g)();this.handler=await s.loader(this.domNode,void 0,{renderMode:this.input.renderMode||"view",onRenderError:(t,e)=>{this.onContainerError(e)},executionContext:this.getExecutionContext()}),this.subscriptions.push(this.handler.events$.subscribe((async t=>{if("bounds"!==t.name){if(!this.input.disableTriggers){const s=Object(n.get)(O.a,t.name,O.a.filter);let a;var e,i;a=s===O.a.applyFilter?{embeddable:this,timeFieldName:null===(e=this.vis.data.indexPattern)||void 0===e?void 0:e.timeFieldName,...t.data}:{embeddable:this,data:{timeFieldName:null===(i=this.vis.data.indexPattern)||void 0===i?void 0:i.timeFieldName,...t.data}},Object(x.r)().getTrigger(s).exec(a)}}else{const e=this.vis.data.aggs.aggs.find((t=>"geohash_grid"===Object(n.get)(t,"type.dslName")));(e&&e.params.precision!==t.data.precision||e&&!r.a.isEqual(e.params.boundingBox,t.data.boundingBox))&&(e.params.boundingBox=t.data.boundingBox,e.params.precision=t.data.precision,this.reload())}}))),this.vis.description&&e.setAttribute("data-description",this.vis.description),e.setAttribute("data-test-subj","visualizationLoader"),e.setAttribute("data-shared-item",""),this.subscriptions.push(this.handler.loading$.subscribe(this.onContainerLoading)),this.subscriptions.push(this.handler.data$.subscribe(this.onContainerData)),this.subscriptions.push(this.handler.render$.subscribe(this.onContainerRender)),this.subscriptions.push(this.getUpdated$().subscribe((()=>{const{error:t}=this.getOutput();t&&Object(h.render)(this.renderError(t),this.domNode)}))),await this.updateHandler()}renderError(t){var e;return Object(m.f)(this.vis.data.indexPattern)?Object(C.jsx)(T,{renderMode:null!==(e=this.input.renderMode)&&void 0!==e?e:"view",savedObjectMeta:{savedObjectType:this.vis.data.savedSearchId?"search":b.DATA_VIEW_SAVED_OBJECT_TYPE},application:Object(x.b)(),message:"string"==typeof t?t:t.message}):Object(C.jsx)(j.default,{error:t})}destroy(){super.destroy(),this.subscriptions.forEach((t=>t.unsubscribe())),this.vis.uiState.off("change",this.uiStateChangeHandler),this.vis.uiState.off("reload",this.reload),this.handler&&(this.handler.destroy(),this.handler.getElement().remove())}getExecutionContext(){var t,e;return{...(null===(t=this.parent)||void 0===t?void 0:t.getInput().executionContext)||Object(x.f)().get(),child:{type:"agg_based",name:this.vis.type.name,id:null!==(e=this.vis.id)&&void 0!==e?e:"new",description:this.vis.title||this.input.title||this.vis.type.name,url:this.output.editUrl}}}async updateHandler(){var t,e;const i=this.getExecutionContext(),s=await(null===(t=(e=this.vis.type).getExpressionVariables)||void 0===t?void 0:t.call(e,this.vis,this.timefilter));this.expressionVariablesSubject.next(s);const a={searchContext:{timeRange:this.timeRange,query:this.input.query,filters:this.input.filters,disableShardWarnings:!0},variables:{embeddableTitle:this.getTitle(),...s},searchSessionId:this.input.searchSessionId,syncColors:this.input.syncColors,syncTooltips:this.input.syncTooltips,syncCursor:this.input.syncCursor,uiState:this.vis.uiState,interactive:!this.input.disableTriggers,inspectorAdapters:this.inspectorAdapters,executionContext:i};this.abortController&&this.abortController.abort(),this.abortController=new AbortController;const n=this.abortController;try{this.expression=await(async(t,e)=>{var i,s;if(!t.type.toExpressionAst)throw new Error("Visualization type definition should have toExpressionAst function defined");const a=null===(i=t.data.searchSource)||void 0===i?void 0:i.createCopy();if(t.data.aggs){const e=t.data.aggs.clone({opts:{hierarchical:t.isHierarchical(),partialRows:"function"==typeof t.type.hasPartialRows?t.type.hasPartialRows(t):t.type.hasPartialRows}});null==a||a.setField("aggs",e)}const n=await t.type.toExpressionAst(t,e),r=null==a?void 0:a.toExpressionAst({asDatatable:t.type.fetchDatatable});return{...n,chain:[Object(E.buildExpressionFunction)("kibana",{}).toAst(),...null!==(s=null==r?void 0:r.chain)&&void 0!==s?s:[],...n.chain]}})(this.vis,{timefilter:this.timefilter,timeRange:this.timeRange,abortSignal:this.abortController.signal})}catch(t){this.onContainerError(t)}this.handler&&!n.signal.aborted&&await this.handler.update(this.expression,a)}supportedTriggers(){var t,e,i;return null!==(t=null===(e=(i=this.vis.type).getSupportedTriggers)||void 0===e?void 0:e.call(i,this.vis.params))&&void 0!==t?t:[]}getExpressionVariables$(){return this.expressionVariablesSubject.asObservable()}}},99:function(t,e,i){"use strict";i.r(e),i.d(e,"VisualizationError",(function(){return VisualizationError}));var s=i(10),a=i(9),n=i.n(a),r=i(4);class VisualizationError extends n.a.Component{render(){return Object(r.jsx)(s.EuiEmptyPrompt,{iconType:"alert",iconColor:"danger","data-test-subj":"visualization-error",body:Object(r.jsx)(s.EuiText,{size:"xs","data-test-subj":"visualization-error-text"},"string"==typeof this.props.error?this.props.error:this.props.error.message)})}componentDidMount(){this.afterRender()}componentDidUpdate(){this.afterRender()}afterRender(){this.props.onInit&&this.props.onInit()}}e.default=VisualizationError}}]);