!function(e){function t(t){for(var n,r,s=t[0],o=t[1],a=0,l=[];a<s.length;a++)r=s[a],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&l.push(i[r][0]),i[r]=0;for(n in o)Object.prototype.hasOwnProperty.call(o,n)&&(e[n]=o[n]);for(c&&c(t);l.length;)l.shift()()}var n={},i={0:0};function r(t){if(n[t])return n[t].exports;var i=n[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.e=function(e){var t=[],n=i[e];if(0!==n)if(n)t.push(n[2]);else{var s=new Promise((function(t,r){n=i[e]=[t,r]}));t.push(n[2]=s);var o,a=document.createElement("script");a.charset="utf-8",a.timeout=120,r.nc&&a.setAttribute("nonce",r.nc),a.src=function(e){return r.p+"expressionMetricVis.chunk."+e+".js"}(e);var c=new Error;o=function(t){a.onerror=a.onload=null,clearTimeout(l);var n=i[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),s=t&&t.target&&t.target.src;c.message="Loading chunk "+e+" failed.\n("+r+": "+s+")",c.name="ChunkLoadError",c.type=r,c.request=s,n[1](c)}i[e]=void 0}};var l=setTimeout((function(){o({type:"timeout",target:a})}),12e4);a.onerror=a.onload=o,document.head.appendChild(a)}return Promise.all(t)},r.m=e,r.c=n,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r.oe=function(e){throw console.error(e),e};var s=window.expressionMetricVis_bundle_jsonpfunction=window.expressionMetricVis_bundle_jsonpfunction||[],o=s.push.bind(s);s.push=t,s=s.slice();for(var a=0;a<s.length;a++)t(s[a]);var c=o;r(r.s=14)}([function(e,t){e.exports=__kbnSharedDeps__.KbnI18n},function(e,t,n){n.r(t);var i=__kbnBundles__.get("plugin/visualizations/common/utils");Object.defineProperties(t,Object.getOwnPropertyDescriptors(i))},function(e,t,n){"use strict";n.d(t,"b",(function(){return i})),n.d(t,"c",(function(){return r})),n.d(t,"a",(function(){return s}));const i="metricVis",r="metricTrendline",s="default"},function(e,t,n){n.r(t);var i=__kbnBundles__.get("plugin/kibanaUtils/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(i))},function(e,t){e.exports=__kbnSharedDeps__.EmotionReact},function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return s}));var i=n(3);const[r,s]=Object(i.createGetterSetter)("charts.theme")},function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return s}));var i=n(3);const[r,s]=Object(i.createGetterSetter)("uiSettings")},function(e,t){e.exports=__kbnSharedDeps__.ElasticCharts},function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"e",(function(){return s})),n.d(t,"c",(function(){return o.a})),n.d(t,"b",(function(){return a})),n.d(t,"f",(function(){return c})),n.d(t,"d",(function(){return l.a}));var i=n(3);const[r,s]=Object(i.createGetterSetter)("fieldFormats");var o=n(5);const[a,c]=Object(i.createGetterSetter)("palette");var l=n(6)},function(e,t){e.exports=__kbnSharedDeps__.ReactDom},function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));const i=(e,t,n)=>{if(!t)return{min:-1/0,max:1/0};const i=Math.min(...t.rows.map((t=>t[e.metric]))),r=Math.max(...t.rows.map((t=>t[e.metric])));if(!(e.max||e.breakdownBy||void 0===n&&1!==t.rows.length)){const e=r;return e<0?{min:2*e,max:0}:{min:0,max:2*e}}const s=e.max?n?t.rows[n][e.max]:Math.max(...t.rows.map((t=>t[e.max]))):r;return{min:e.breakdownBy&&!e.max?i:0,max:e.breakdownBy?e.max?s:r:s}}},function(e,t,n){n.r(t);var i=__kbnBundles__.get("plugin/kibanaReact/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(i))},function(e,t){e.exports=__kbnSharedDeps__.KbnAnalytics},function(e,t){e.exports=__kbnSharedDeps__.React},function(e,t,n){n(15),__kbnBundles__.define("plugin/expressionMetricVis/public",n,16)},function(e,t,n){n.p=window.__kbnPublicPath__.expressionMetricVis},function(e,t,n){"use strict";n.r(t),n.d(t,"plugin",(function(){return y})),n.d(t,"getDataBoundsForPalette",(function(){return v.a})),n.d(t,"EXPRESSION_METRIC_NAME",(function(){return a.b})),n.d(t,"EXPRESSION_METRIC_TRENDLINE_NAME",(function(){return a.c}));var i=n(3),r=n(0),s=n(1),o=n(7),a=n(2);const c=()=>({name:a.b,type:"render",inputTypes:["datatable"],help:r.i18n.translate("expressionMetricVis.function.help",{defaultMessage:"Metric visualization"}),args:{metric:{types:["vis_dimension","string"],help:r.i18n.translate("expressionMetricVis.function.metric.help",{defaultMessage:"The primary metric."}),required:!0},secondaryMetric:{types:["vis_dimension","string"],help:r.i18n.translate("expressionMetricVis.function.secondaryMetric.help",{defaultMessage:"The secondary metric (shown above the primary)."})},max:{types:["vis_dimension","string"],help:r.i18n.translate("expressionMetricVis.function.max.help.",{defaultMessage:"The dimension containing the maximum value."})},breakdownBy:{types:["vis_dimension","string"],help:r.i18n.translate("expressionMetricVis.function.breakdownBy.help",{defaultMessage:"The dimension containing the labels for sub-categories."})},trendline:{types:[a.c],help:r.i18n.translate("expressionMetricVis.function.trendline.help",{defaultMessage:"An optional trendline configuration"})},subtitle:{types:["string"],help:r.i18n.translate("expressionMetricVis.function.subtitle.help",{defaultMessage:"The subtitle for a single metric. Overridden if breakdownBy is supplied."})},secondaryPrefix:{types:["string"],help:r.i18n.translate("expressionMetricVis.function.secondaryPrefix.help",{defaultMessage:"Optional text to be show before secondaryMetric."})},progressDirection:{types:["string"],options:[o.LayoutDirection.Vertical,o.LayoutDirection.Horizontal],default:o.LayoutDirection.Vertical,help:r.i18n.translate("expressionMetricVis.function.progressDirection.help",{defaultMessage:"The direction the progress bar should grow."}),strict:!0},color:{types:["string"],help:r.i18n.translate("expressionMetricVis.function.color.help",{defaultMessage:"Provides a static visualization color. Overridden by palette."})},palette:{types:["palette"],help:r.i18n.translate("expressionMetricVis.function.palette.help",{defaultMessage:"Provides colors for the values, based on the bounds."})},maxCols:{types:["number"],help:r.i18n.translate("expressionMetricVis.function.numCols.help",{defaultMessage:"Specifies the max number of columns in the metric grid."}),default:5},minTiles:{types:["number"],help:r.i18n.translate("expressionMetricVis.function.minTiles.help",{defaultMessage:"Specifies the minimum number of tiles in the metric grid regardless of the input data."})},inspectorTableId:{types:["string"],help:r.i18n.translate("expressionMetricVis.function.inspectorTableId.help",{defaultMessage:"An ID for the inspector table"}),multi:!1,default:"default"}},fn(e,t,n){var i,o,c;if(Object(s.validateAccessor)(t.metric,e.columns),Object(s.validateAccessor)(t.secondaryMetric,e.columns),Object(s.validateAccessor)(t.max,e.columns),Object(s.validateAccessor)(t.breakdownBy,e.columns),null!=n&&null!==(i=n.inspectorAdapters)&&void 0!==i&&i.tables){var l;n.inspectorAdapters.tables.reset(),n.inspectorAdapters.tables.allowCsvExport=!0;const i=[[[t.metric],r.i18n.translate("expressionMetricVis.function.dimension.metric",{defaultMessage:"Metric"})]];t.secondaryMetric&&i.push([[t.secondaryMetric],r.i18n.translate("expressionMetricVis.function.dimension.secondaryMetric",{defaultMessage:"Secondary Metric"})]),t.breakdownBy&&i.push([[t.breakdownBy],r.i18n.translate("expressionMetricVis.function.dimension.splitGroup",{defaultMessage:"Split group"})]),t.max&&i.push([[t.max],r.i18n.translate("expressionMetricVis.function.dimension.maximum",{defaultMessage:"Maximum"})]);const o=Object(s.prepareLogTable)(e,i,!0);var u,d;n.inspectorAdapters.tables.logDatatable(t.inspectorTableId,o),null!==(l=t.trendline)&&void 0!==l&&l.inspectorTable&&t.trendline.inspectorTableId&&n.inspectorAdapters.tables.logDatatable(null===(u=t.trendline)||void 0===u?void 0:u.inspectorTableId,null===(d=t.trendline)||void 0===d?void 0:d.inspectorTable)}return{type:"render",as:a.b,value:{visData:e,visType:"metric",visConfig:{metric:{subtitle:t.subtitle,secondaryPrefix:t.secondaryPrefix,color:t.color,palette:null===(o=t.palette)||void 0===o?void 0:o.params,progressDirection:t.progressDirection,maxCols:t.maxCols,minTiles:t.minTiles,trends:null===(c=t.trendline)||void 0===c?void 0:c.trends},dimensions:{metric:t.metric,secondaryMetric:t.secondaryMetric,max:t.max,breakdownBy:t.breakdownBy}}}}}});var l=n(8),u=(n(13),n(9)),d=n(11),p=n(4),f=n(12),m={name:"16k86jb",styles:"height:100%;width:100%;display:flex;align-items:center;justify-content:center"};var b=n(5),h=n(6);const g=()=>({name:a.c,inputTypes:["datatable"],type:a.c,help:r.i18n.translate("expressionMetricVis.trendline.function.help",{defaultMessage:"Metric visualization"}),args:{metric:{types:["vis_dimension","string"],help:r.i18n.translate("expressionMetricVis.trendline.function.metric.help",{defaultMessage:"The primary metric."}),required:!0},timeField:{types:["vis_dimension","string"],help:r.i18n.translate("expressionMetricVis.trendline.function.timeField.help",{defaultMessage:"The time field for the trend line"}),required:!0},breakdownBy:{types:["vis_dimension","string"],help:r.i18n.translate("expressionMetricVis.trendline.function.breakdownBy.help",{defaultMessage:"The dimension containing the labels for sub-categories."})},table:{types:["datatable"],help:r.i18n.translate("expressionMetricVis.trendline.function.table.help",{defaultMessage:"A data table"}),multi:!1},inspectorTableId:{types:["string"],help:r.i18n.translate("expressionMetricVis.trendline.function.inspectorTableId.help",{defaultMessage:"An ID for the inspector table"}),multi:!1,default:"trendline"}},fn(e,t,n){var i,o;const c=t.table;Object(s.validateAccessor)(t.metric,c.columns),Object(s.validateAccessor)(t.timeField,c.columns),Object(s.validateAccessor)(t.breakdownBy,c.columns);const l=[[[t.metric],r.i18n.translate("expressionMetricVis.function.dimension.metric",{defaultMessage:"Metric"})],[[t.timeField],r.i18n.translate("expressionMetricVis.function.dimension.timeField",{defaultMessage:"Time field"})]];t.breakdownBy&&l.push([[t.breakdownBy],r.i18n.translate("expressionMetricVis.function.dimension.splitGroup",{defaultMessage:"Split group"})]);const u=Object(s.prepareLogTable)(c,l,!0),d=null===(i=Object(s.getColumnByAccessor)(t.metric,c.columns))||void 0===i?void 0:i.id,p=null===(o=Object(s.getColumnByAccessor)(t.timeField,c.columns))||void 0===o?void 0:o.id;if(!d||!p)throw new Error("Metric trendline - couldn't find metric or time column!");const f={};if(t.breakdownBy){var m;const e=null===(m=Object(s.getColumnByAccessor)(t.breakdownBy,c.columns))||void 0===m?void 0:m.id;if(!e)throw new Error("Metric trendline - couldn't find breakdown column!");const n={};c.rows.forEach((t=>{const i=t[e];i in n||(n[i]=[]),n[i].push(t)}));for(const e in n)n.hasOwnProperty(e)&&(f[e]=n[e].map((e=>({x:null!==e[p]?e[p]:NaN,y:null!==e[d]?e[d]:NaN}))))}else f[a.a]=c.rows.map((e=>({x:e[p],y:e[d]})));return{type:a.c,trends:f,inspectorTable:u,inspectorTableId:t.inspectorTableId}}});class plugin_ExpressionMetricPlugin{setup(e,{expressions:t,charts:r}){const o=Object(i.createStartServicesGetter)(e.getStartServices);var v;r.palettes.getPalettes().then((e=>{Object(l.f)(e)})),t.registerFunction(c),t.registerFunction(g),t.registerRenderer((v={getStartDeps:o},()=>({name:a.b,displayName:"metric visualization",reuseDomNode:!0,render:async(e,{visData:t,visConfig:i},r)=>{var o;const{core:a,plugins:c}=v.getStartDeps();r.onDestroy((()=>{Object(u.unmountComponentAtNode)(e)}));const l=!!t.rows.length&&await async function(e,t,n){var i;const r=Object(s.getColumnByAccessor)(null!==(i=e.breakdownBy)&&void 0!==i?i:e.metric,t.columns),o=t.columns.indexOf(r),a=r?t.rows[0][r.id]:void 0;return Boolean(await(null==n?void 0:n({name:"filter",data:{data:[{table:t,column:o,row:0,value:a}]}})))}(i.dimensions,t,null===(o=r.hasCompatibleActions)||void 0===o?void 0:o.bind(r)),{MetricVis:b}=await n.e(2).then(n.bind(null,39));Object(u.render)(Object(p.jsx)(d.KibanaThemeProvider,{theme$:a.theme.theme$},Object(p.jsx)("div",{"data-test-subj":"mtrVis",css:m},Object(p.jsx)(b,{data:t,config:i,renderComplete:()=>{const e=r.getExecutionContext(),t=(e=>{if(e){var t;const n=e=>e.type?e:e.child?n(e.child):void 0;return null===(t=n(e))||void 0===t?void 0:t.type}})(e),n=(e=>{if(e){var t;const n=e=>e.child?n(e.child):e;return null===(t=n(e))||void 0===t?void 0:t.type}})(e);var i;t&&n&&(null===(i=c.usageCollection)||void 0===i||i.reportUiCounter(t,f.METRIC_TYPE.COUNT,[`render_${n}_metric`])),r.done()},fireEvent:r.event,renderMode:r.getRenderMode(),filterable:l}))),e)}}))),Object(h.b)(e.uiSettings),Object(b.b)(r.theme)}start(e,{fieldFormats:t}){Object(l.e)(t)}}var v=n(10);function y(){return new plugin_ExpressionMetricPlugin}},function(e,t){e.exports=__kbnSharedDeps__.ElasticEui},function(e,t){e.exports=__kbnSharedDeps_npm__},function(e,t){e.exports=__kbnSharedDeps__.ElasticNumeral},function(e,t,n){n.r(t);var i=__kbnBundles__.get("plugin/fieldFormats/common");Object.defineProperties(t,Object.getOwnPropertyDescriptors(i))},function(e,t){e.exports=__kbnSharedDeps__.KbnUiTheme},function(e,t){e.exports=__kbnSharedDeps__.Lodash},function(e,t){e.exports=__kbnSharedDeps__.KbnI18nReact},function(e,t){e.exports=__kbnSharedDeps__.TsLib}]);