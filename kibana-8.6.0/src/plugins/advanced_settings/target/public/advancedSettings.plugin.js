!function(e){function t(t){for(var n,a,s=t[0],i=t[1],o=0,u=[];o<s.length;o++)a=s[o],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&u.push(r[a][0]),r[a]=0;for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n]);for(c&&c(t);u.length;)u.shift()()}var n={},r={0:0};function a(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.e=function(e){var t=[],n=r[e];if(0!==n)if(n)t.push(n[2]);else{var s=new Promise((function(t,a){n=r[e]=[t,a]}));t.push(n[2]=s);var i,o=document.createElement("script");o.charset="utf-8",o.timeout=120,a.nc&&o.setAttribute("nonce",a.nc),o.src=function(e){return a.p+"advancedSettings.chunk."+e+".js"}(e);var c=new Error;i=function(t){o.onerror=o.onload=null,clearTimeout(u);var n=r[e];if(0!==n){if(n){var a=t&&("load"===t.type?"missing":t.type),s=t&&t.target&&t.target.src;c.message="Loading chunk "+e+" failed.\n("+a+": "+s+")",c.name="ChunkLoadError",c.type=a,c.request=s,n[1](c)}r[e]=void 0}};var u=setTimeout((function(){i({type:"timeout",target:o})}),12e4);o.onerror=o.onload=i,document.head.appendChild(o)}return Promise.all(t)},a.m=e,a.c=n,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a.oe=function(e){throw console.error(e),e};var s=window.advancedSettings_bundle_jsonpfunction=window.advancedSettings_bundle_jsonpfunction||[],i=s.push.bind(s);s.push=t,s=s.slice();for(var o=0;o<s.length;o++)t(s[o]);var c=i;a(a.s=13)}([function(e,t){e.exports=__kbnSharedDeps__.KbnI18n},function(e,t){e.exports=__kbnSharedDeps__.ElasticEui},function(e,t,n){e.exports=n(12)(2)},function(e,t){e.exports=__kbnSharedDeps__.EmotionReact},function(e,t){e.exports=__kbnSharedDeps__.React},function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"c",(function(){return l})),n.d(t,"b",(function(){return Search}));var r=n(2),a=n.n(r),s=n(4),i=n(0),o=n(1),c=n(10),u=n(3);const d="category",l=i.i18n.translate("advancedSettings.searchBar.unableToParseQueryErrorMessage",{defaultMessage:"Unable to parse query"});class Search extends s.PureComponent{constructor(e){super(e),a()(this,"categories",[]),a()(this,"state",{isSearchTextValid:!0,parseErrorMessage:null}),a()(this,"onChange",(({query:e,error:t})=>{t?this.setState({isSearchTextValid:!1,parseErrorMessage:t.message}):(this.setState({isSearchTextValid:!0,parseErrorMessage:null}),this.props.onQueryChange({query:e}))}));const{categories:t}=e;this.categories=t.map((e=>({value:e,name:Object(c.d)(e)})))}render(){const{query:e}=this.props,t={incremental:!0,"data-test-subj":"settingsSearchBar","aria-label":i.i18n.translate("advancedSettings.searchBarAriaLabel",{defaultMessage:"Search advanced settings"})},n=[{type:"field_value_selection",field:d,name:i.i18n.translate("advancedSettings.categorySearchLabel",{defaultMessage:"Category"}),multiSelect:"or",options:this.categories}];let r;return this.state.isSearchTextValid||(r=Object(u.jsx)(o.EuiFormErrorText,null,`${l}. ${this.state.parseErrorMessage}`)),Object(u.jsx)(s.Fragment,null,Object(u.jsx)(o.EuiSearchBar,{box:t,filters:n,onChange:this.onChange,query:e}),r)}}},function(e,t,n){"use strict";function r(e,t){if(e.type)return e.type;if(Array.isArray(t)||Array.isArray(e.value))return"array";const n=null!=e.value?typeof e.value:typeof t;if("bigint"===n)return"number";if("symbol"===n||"object"===n||"function"===n)throw new Error(`incompatible UiSettingsType: '${e.name}' type ${n} | ${JSON.stringify(e)}`);return n}n.d(t,"a",(function(){return i}));var a=n(7),s=n(8);function i({def:e,name:t,value:n,isCustom:i,isOverridden:o}){return e||(e={}),{name:t,displayName:e.name||t,ariaName:e.name||Object(a.a)(t),value:n,category:e.category&&e.category.length?e.category:[s.a],isCustom:i,isOverridden:o,readOnly:!!e.readonly,defVal:e.value,type:r(e,n),description:e.description,deprecation:e.deprecation,options:e.options,optionLabels:e.optionLabels,order:e.order,requiresPageReload:!!e.requiresPageReload,metric:e.metric}}},function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(11),a=n(1),s=n(5);const i=e=>Object(r.words)(null!=e?e:"").map((e=>e.toLowerCase())).join(" ");function o(e){if(!e)return"";const t=a.Query.parse(e);if(t.hasOrFieldClause(s.a)){const e=t.getOrFieldClause(s.a),n=i(t.removeOrFieldClauses(s.a).text);if(!e||!Array.isArray(e.value))return n;let r=a.Query.parse("");return e.value.forEach((e=>{r=r.addOrFieldValue(s.a,e)})),`${n} ${r.text}`}return i(e)}},function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));const r="general"},function(e,t){e.exports=__kbnSharedDeps__.KbnI18nReact},function(e,t,n){"use strict";function r(e){return e.isCustom||void 0===e.value||String(e.value)===String(e.defVal)}n.d(t,"e",(function(){return r})),n.d(t,"f",(function(){return a.a})),n.d(t,"d",(function(){return o})),n.d(t,"a",(function(){return c.a})),n.d(t,"c",(function(){return u.a})),n.d(t,"b",(function(){return l}));var a=n(6),s=n(0);const i={general:s.i18n.translate("advancedSettings.categoryNames.generalLabel",{defaultMessage:"General"}),machineLearning:s.i18n.translate("advancedSettings.categoryNames.machineLearningLabel",{defaultMessage:"Machine Learning"}),observability:s.i18n.translate("advancedSettings.categoryNames.observabilityLabel",{defaultMessage:"Observability"}),timelion:s.i18n.translate("advancedSettings.categoryNames.timelionLabel",{defaultMessage:"Timelion"}),notifications:s.i18n.translate("advancedSettings.categoryNames.notificationsLabel",{defaultMessage:"Notifications"}),visualizations:s.i18n.translate("advancedSettings.categoryNames.visualizationsLabel",{defaultMessage:"Visualizations"}),discover:s.i18n.translate("advancedSettings.categoryNames.discoverLabel",{defaultMessage:"Discover"}),dashboard:s.i18n.translate("advancedSettings.categoryNames.dashboardLabel",{defaultMessage:"Dashboard"}),reporting:s.i18n.translate("advancedSettings.categoryNames.reportingLabel",{defaultMessage:"Reporting"}),search:s.i18n.translate("advancedSettings.categoryNames.searchLabel",{defaultMessage:"Search"}),securitySolution:s.i18n.translate("advancedSettings.categoryNames.securitySolutionLabel",{defaultMessage:"Security Solution"}),enterpriseSearch:s.i18n.translate("advancedSettings.categoryNames.enterpriseSearchLabel",{defaultMessage:"Enterprise Search"})};function o(e){return e?i[e]||((e="")=>e.replace(/^./,(e=>e.toUpperCase())))(e):""}var c=n(8),u=n(7);const d=n(1).Comparators.default("asc"),l=(e,t)=>{const n=void 0!==e.order,r=void 0!==t.order;return n&&r?e.order===t.order?d(e.name,t.name):d(e.order,t.order):n?-1:r?1:d(e.name,t.name)}},function(e,t){e.exports=__kbnSharedDeps__.Lodash},function(e,t){e.exports=__kbnSharedDeps_npm__},function(e,t,n){n(14),__kbnBundles__.define("plugin/advancedSettings/public",n,15)},function(e,t,n){n.p=window.__kbnPublicPath__.advancedSettings},function(e,t,n){"use strict";n.r(t),n.d(t,"ComponentRegistry",(function(){return component_registry_ComponentRegistry})),n.d(t,"LazyField",(function(){return f})),n.d(t,"toEditableConfig",(function(){return p.a})),n.d(t,"plugin",(function(){return _}));var r=n(4),a=n.n(r),s=n(0),i=n(2),o=n.n(i),c=n(1),u=n(9),d=n(3);class component_registry_ComponentRegistry{constructor(){o()(this,"registry",{}),o()(this,"setup",{componentType:component_registry_ComponentRegistry.componentType,register:(e,t,n=!1)=>{if(!n&&e in this.registry)throw new Error(`Component with id ${e} is already registered.`);t.displayName||(t.displayName=e),this.registry[e]=t}}),o()(this,"start",{componentType:component_registry_ComponentRegistry.componentType,get:e=>this.registry[e]||component_registry_ComponentRegistry.defaultRegistry[e]})}}o()(component_registry_ComponentRegistry,"componentType",{PAGE_TITLE_COMPONENT:"advanced_settings_page_title",PAGE_SUBTITLE_COMPONENT:"advanced_settings_page_subtitle",PAGE_FOOTER_COMPONENT:"advanced_settings_page_footer"}),o()(component_registry_ComponentRegistry,"defaultRegistry",{advanced_settings_page_title:()=>Object(d.jsx)(c.EuiText,null,Object(d.jsx)("h1",{"data-test-subj":"managementSettingsTitle"},Object(d.jsx)(u.FormattedMessage,{id:"advancedSettings.pageTitle",defaultMessage:"Settings"}))),advanced_settings_page_subtitle:()=>null,advanced_settings_page_footer:()=>null});const l=new component_registry_ComponentRegistry,g=s.i18n.translate("advancedSettings.advancedSettingsLabel",{defaultMessage:"Advanced Settings"});class plugin_AdvancedSettingsPlugin{setup(e,{management:t,home:r,usageCollection:a}){return t.sections.section.kibana.registerApp({id:"settings",title:g,order:3,async mount(t){const{mountManagementSection:r}=await n.e(1).then(n.bind(null,35));return r(e.getStartServices,t,l.start,a)}}),r&&r.featureCatalogue.register({id:"advanced_settings",title:g,description:s.i18n.translate("advancedSettings.featureCatalogueTitle",{defaultMessage:"Customize your Kibana experience — change the date format, turn on dark mode, and more."}),icon:"gear",path:"/app/management/kibana/settings",showOnHomePage:!1,category:"admin"}),{component:l.setup}}start(){return{component:l.start}}}var p=n(6);const f=a.a.lazy((()=>n.e(2).then(n.bind(null,25))));function _(e){return new plugin_AdvancedSettingsPlugin}},function(e,t,n){n.r(t);var r=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))},function(e,t){e.exports=__kbnSharedDeps__.Classnames},function(e,t){e.exports=__kbnSharedDeps__.KbnMonaco},function(e,t,n){n.r(t);var r=__kbnBundles__.get("plugin/kibanaUtils/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(r))},function(e,t){e.exports=__kbnSharedDeps__.ReactDom},function(e,t){e.exports=__kbnSharedDeps__.ReactRouterDom}]);