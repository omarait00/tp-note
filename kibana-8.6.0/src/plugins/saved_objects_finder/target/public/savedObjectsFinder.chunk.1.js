(window.savedObjectsFinder_bundle_jsonpfunction=window.savedObjectsFinder_bundle_jsonpfunction||[]).push([[1],{10:function(e,t,s){e.exports=s(6)(2)},11:function(e,t,s){"use strict";s.r(t),s.d(t,"SavedObjectFinderUi",(function(){return SavedObjectFinderUi}));var i=s(10),a=s.n(i),n=s(7),o=s(2),r=s.n(o),d=s(1),c=s(8),l=s(9),p=s(0);class SavedObjectFinderUi extends r.a.Component{constructor(e){super(e),a()(this,"isComponentMounted",!1),a()(this,"debouncedFetch",Object(n.debounce)((async e=>{const t=this.getSavedObjectMetaDataMap(),{queryText:s,visibleTypes:i,selectedTags:a}=this.props.services.savedObjectsManagement.parseQuery(e,Object.values(t).map((e=>({name:e.type,namespaceType:"single",hidden:!1,displayName:e.name})))),n=Object.values(t).map((e=>e.includeFields||[])).reduce(((e,t)=>e.concat(t)),["title","name"]),o=Object.values(t).reduce(((e,t)=>(t.defaultSearchField&&e.push(t.defaultSearchField),e)),[]),r=this.props.services.uiSettings.get(l.LISTING_LIMIT_SETTING),d=(await this.props.services.savedObjects.client.find({type:null!=i?i:Object.keys(t),fields:[...new Set(n)],search:s?`${s}*`:void 0,page:1,perPage:r,searchFields:["title^3","description",...o],defaultSearchOperator:"AND",hasReference:this.props.services.savedObjectsManagement.getTagFindReferences({selectedTags:a,taggingApi:this.props.services.savedObjectsTagging})})).savedObjects.map((e=>{const{attributes:{name:t,title:s}}=e,i="string"==typeof s?s:"",a=t&&"string"==typeof t?t:i;return{...e,version:e._version,title:i,name:a,simple:e}})).filter((e=>{const s=t[e.type];return!s.showSavedObject||s.showSavedObject(e.simple)}));this.isComponentMounted&&e.text===this.state.query.text&&this.setState({isFetchingItems:!1,items:d})}),300)),a()(this,"fetchItems",(()=>{this.setState({isFetchingItems:!0},this.debouncedFetch.bind(null,this.state.query))})),this.state={items:[],isFetchingItems:!1,query:d.Query.parse("")}}componentWillUnmount(){this.isComponentMounted=!1,this.debouncedFetch.cancel()}componentDidMount(){this.isComponentMounted=!0,this.fetchItems()}getSavedObjectMetaDataMap(){return this.props.savedObjectMetaData.reduce(((e,t)=>({...e,[t.type]:t})),{})}render(){var e,t;const{onChoose:s,savedObjectMetaData:i}=this.props,a=this.props.services.savedObjectsTagging,n=null==a?void 0:a.ui.getTableColumnDefinition(),o=n?{...n,sortable:e=>{var t;return"function"==typeof n.sortable&&null!==(t=n.sortable(e))&&void 0!==t?t:""},"data-test-subj":"savedObjectFinderTags"}:void 0,l=i.length>1?{field:"type",name:c.i18n.translate("savedObjectsFinder.typeName",{defaultMessage:"Type"}),width:"50px",align:"center",description:c.i18n.translate("savedObjectsFinder.typeDescription",{defaultMessage:"Type of the saved object"}),sortable:({type:e})=>{var t;const s=i.find((t=>t.type===e));return null!==(t=null==s?void 0:s.name)&&void 0!==t?t:""},"data-test-subj":"savedObjectFinderType",render:(e,t)=>{const s=i.find((e=>e.type===t.type)),a=(s||{getIconForSavedObject:()=>"document"}).getIconForSavedObject(t.simple);return Object(p.jsx)(d.EuiToolTip,{position:"top",content:s.name},Object(p.jsx)(d.EuiIcon,{"aria-label":s.name,type:a,size:"s","data-test-subj":"objectType"}))}}:void 0,u=[...l?[l]:[],{field:"title",name:c.i18n.translate("savedObjectsFinder.titleName",{defaultMessage:"Title"}),width:"55%",description:c.i18n.translate("savedObjectsFinder.titleDescription",{defaultMessage:"Title of the saved object"}),dataType:"string",sortable:({name:e})=>null==e?void 0:e.toLowerCase(),"data-test-subj":"savedObjectFinderTitle",render:(e,t)=>{const a=i.find((e=>e.type===t.type)),n=a.getTooltipForSavedObject?a.getTooltipForSavedObject(t.simple):`${t.name} (${a.name})`;return Object(p.jsx)(d.EuiLink,{onClick:s?()=>{s(t.id,t.type,n,t.simple)}:void 0,title:n,"data-test-subj":`savedObjectTitle${(t.title||"").split(" ").join("-")}`},t.name)}},...o?[o]:[]],h={initialPageSize:this.props.initialPageSize||this.props.fixedPageSize||10,pageSizeOptions:[5,10,15,25],showPerPageOptions:!this.props.fixedPageSize},b={sort:null!==(e=this.state.sort)&&void 0!==e?e:{field:null!==(t=this.state.query)&&void 0!==t&&t.text?"":"title",direction:"asc"}},v={type:"field_value_selection",field:"type",name:c.i18n.translate("savedObjectsFinder.filterButtonLabel",{defaultMessage:"Types"}),multiSelect:"or",options:this.props.savedObjectMetaData.map((e=>({value:e.type,name:e.name})))},m={onChange:({query:e})=>{this.setState({query:null!=e?e:d.Query.parse("")},this.fetchItems)},box:{incremental:!0,"data-test-subj":"savedObjectFinderSearchInput"},filters:this.props.showFilter?[...i.length>1?[v]:[],...a?[a.ui.getSearchBarFilter({useName:!0})]:[]]:void 0,toolsRight:this.props.children?Object(p.jsx)(r.a.Fragment,null,this.props.children):void 0};return Object(p.jsx)(d.EuiInMemoryTable,{loading:this.state.isFetchingItems,itemId:"id",items:this.state.items,columns:u,message:this.props.noItemsMessage,search:m,pagination:h,sorting:b,onTableChange:({sort:e})=>{this.setState({sort:e})}})}}t.default=SavedObjectFinderUi}}]);