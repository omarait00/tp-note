(window.visTypeTimeseries_bundle_jsonpfunction=window.visTypeTimeseries_bundle_jsonpfunction||[]).push([[2],{48:function(e,t,i){var r=i(80),n=i(11),a=n;a.v1=r,a.v4=n,e.exports=a},54:function(e,t,i){"use strict";i.d(t,"a",(function(){return l})),i.d(t,"e",(function(){return s})),i.d(t,"g",(function(){return g})),i.d(t,"h",(function(){return _})),i.d(t,"b",(function(){return R})),i.d(t,"d",(function(){return y})),i.d(t,"f",(function(){return T})),i.d(t,"c",(function(){return v})),i.d(t,"i",(function(){return h}));var r=i(29),n=i(1);const a=[n.e.TIMESERIES,n.e.TOP_N,n.e.METRIC,n.e.GAUGE,n.e.TABLE],u=[n.f.ENTIRE_TIME_RANGE,n.f.LAST_VALUE],l={avg:{name:"average",isFullReference:!1,isFieldRequired:!0,supportedPanelTypes:a,supportedTimeRangeModes:u},cardinality:{name:"unique_count",isFullReference:!1,isFieldRequired:!0,supportedPanelTypes:a,supportedTimeRangeModes:u},count:{name:"count",isFullReference:!1,isFieldRequired:!1,supportedPanelTypes:a,supportedTimeRangeModes:u},positive_rate:{name:"counter_rate",isFullReference:!0,isFieldRequired:!0,supportedPanelTypes:[n.e.TIMESERIES],supportedTimeRangeModes:u},moving_average:{name:"moving_average",isFullReference:!0,isFieldRequired:!0,supportedPanelTypes:[n.e.TIMESERIES],supportedTimeRangeModes:[n.f.ENTIRE_TIME_RANGE]},derivative:{name:"differences",isFullReference:!0,isFieldRequired:!0,supportedPanelTypes:[n.e.TIMESERIES],supportedTimeRangeModes:[n.f.ENTIRE_TIME_RANGE]},cumulative_sum:{name:"cumulative_sum",isFullReference:!0,isFieldRequired:!0,supportedPanelTypes:[n.e.TIMESERIES],supportedTimeRangeModes:[n.f.ENTIRE_TIME_RANGE]},avg_bucket:{name:"formula",isFullReference:!0,isFieldRequired:!0,isFormula:!0,formula:"overall_average",supportedPanelTypes:[n.e.TIMESERIES],supportedTimeRangeModes:[n.f.ENTIRE_TIME_RANGE]},max_bucket:{name:"formula",isFullReference:!0,isFieldRequired:!0,isFormula:!0,formula:"overall_max",supportedPanelTypes:[n.e.TIMESERIES],supportedTimeRangeModes:[n.f.ENTIRE_TIME_RANGE]},min_bucket:{name:"formula",isFullReference:!0,isFieldRequired:!0,isFormula:!0,formula:"overall_min",supportedPanelTypes:[n.e.TIMESERIES],supportedTimeRangeModes:[n.f.ENTIRE_TIME_RANGE]},sum_bucket:{name:"formula",isFullReference:!0,isFieldRequired:!0,isFormula:!0,formula:"overall_sum",supportedPanelTypes:[n.e.TIMESERIES],supportedTimeRangeModes:[n.f.ENTIRE_TIME_RANGE]},max:{name:"max",isFullReference:!1,isFieldRequired:!0,supportedPanelTypes:a,supportedTimeRangeModes:u},min:{name:"min",isFullReference:!1,isFieldRequired:!0,supportedPanelTypes:a,supportedTimeRangeModes:u},percentile:{name:"percentile",isFullReference:!1,isFieldRequired:!0,supportedPanelTypes:a,supportedTimeRangeModes:u},percentile_rank:{name:"percentile_rank",isFullReference:!1,isFieldRequired:!0,supportedPanelTypes:a,supportedTimeRangeModes:u},sum:{name:"sum",isFullReference:!1,isFieldRequired:!0,supportedPanelTypes:a,supportedTimeRangeModes:u},filter_ratio:{name:"formula",isFullReference:!1,isFormula:!0,formula:"filter_ratio",isFieldRequired:!1,supportedPanelTypes:a,supportedTimeRangeModes:u},top_hit:{name:"last_value",isFullReference:!1,isFieldRequired:!0,supportedPanelTypes:a,supportedTimeRangeModes:u},math:{name:"formula",isFormula:!0,formula:"math",isFullReference:!1,isFieldRequired:!1,supportedPanelTypes:a,supportedTimeRangeModes:u},positive_only:{name:"formula",isFullReference:!0,isFieldRequired:!0,isFormula:!0,formula:"pick_max",supportedPanelTypes:[n.e.TIMESERIES],supportedTimeRangeModes:[n.f.ENTIRE_TIME_RANGE]},static:{name:"static_value",isFullReference:!0,isFieldRequired:!1,supportedPanelTypes:a,supportedTimeRangeModes:u},value_count:{name:"count",isFullReference:!1,isFieldRequired:!0,supportedPanelTypes:a,supportedTimeRangeModes:u},std_deviation:{name:"standard_deviation",isFullReference:!1,isFieldRequired:!0,supportedPanelTypes:a,supportedTimeRangeModes:u},variance:{name:"formula",isFormula:!0,formula:"pow",isFullReference:!1,isFieldRequired:!0,supportedPanelTypes:a,supportedTimeRangeModes:u}},s=e=>e.isFormula?e.formula:e.name;var d=i(33),o=i(36),c=i.n(o),m=i(30),f=i(0);const p=(e,t,i)=>{var r,n;return`${e}${"lucene"===(null==t?void 0:t.language)?"lucene":"kql"}='${null!=t&&t.query&&"string"==typeof(null==t?void 0:t.query)?(n=null==t?void 0:t.query,null==n?void 0:n.replace(/'/g,"\\'")):null!==(r=null==t?void 0:t.query)&&void 0!==r?r:"*"}'${i?R(i):""})`},v=(e,t)=>{const{numerator:i,denominator:r,metric_agg:n,field:a}=e;let u=l.count;if(n&&(u=l[n],!u))return null;const d=s(u),o=n&&"count"!==n?`${d}('${a}',`:"count(";return"counter_rate"===u.name?`counter_rate(${p(`(max('${a}',`,i,t)})) / counter_rate(${p(`(max('${a}',`,r,t)}))`:`${p(o,i,t)} / ${p(o,r,t)}`},T=(e,t,i,{metaValue:r,reducedTimeRange:a,timeShift:u}={})=>{const d=l[e.type];if(!d)return null;if(!i||"static"===i.type)return null;const o=s(d),c=y(i,t,{metaValue:r,reducedTimeRange:a,timeShift:u});if(!c)return null;const m=(e=>e.type===n.i.POSITIVE_ONLY?", 0":e.type===n.i.MOVING_AVERAGE?`, window=${e.window||5}`:"")(e),f=`${o}(${c}${m})`;return e.unit?`normalize_by_unit(${f}, unit='${_(e)}')`:f},g=(e,t,i)=>{if((t.override_index_pattern?t.time_range_mode:e.time_range_mode)!==n.f.LAST_VALUE)return;const a=t.override_index_pattern?t.series_interval:e.interval;let u=a||"1h";if(i&&!a){const{from:e,to:t}=i,n=Object(d.utc)(t).valueOf()-Object(d.utc)(e).valueOf(),a=Object(f.g)().get(m.UI_SETTINGS.HISTOGRAM_BAR_TARGET),l=r.search.aggs.calcAutoIntervalLessThan(a,n),s=c.a.units.find((e=>{const t=l.as(e);return Number.isInteger(t)}))||"ms";u=`${l.as(s)}${s}`}return u},_=e=>{let t;var i;return e.unit&&(i=e.unit,["1s","1m","1h","1d"].includes(i))&&(t=e.unit.replace("1","")),t},R=({reducedTimeRange:e,timeShift:t})=>`${(e=>e?`, shift='${e}'`:"")(t)}${(e=>e?`, reducedTimeRange='${e}'`:"")(e)}`,y=(e,t,{metaValue:i,reducedTimeRange:r,timeShift:n}={})=>{const a=l[e.type];if(!a)return null;const u=s(a);switch(e.type){case"cumulative_sum":case"derivative":case"moving_average":case"avg_bucket":case"max_bucket":case"min_bucket":case"sum_bucket":case"positive_only":{var d,o;const[i,a]=null!==(d=null==e||null===(o=e.field)||void 0===o?void 0:o.split("["))&&void 0!==d?d:[],u=t.find((e=>e.id===i));return u&&l[u.type]?T(e,t,u,{metaValue:a?Number(null==a?void 0:a.replace("]","")):void 0,reducedTimeRange:r,timeShift:n}):null}case"count":return`${u}(${n?`shift='${n}'`:""}${n&&r?", ":""}${r?`reducedTimeRange='${r}'`:""})`;case"percentile":return`${u}(${e.field}${i?`, percentile=${i}`:""}${R({reducedTimeRange:r,timeShift:n})})`;case"percentile_rank":return`${u}(${e.field}${i?`, value=${i}`:""}${R({reducedTimeRange:r,timeShift:n})})`;case"positive_rate":{const t=((e,t,i)=>{const r=((e,t)=>`max(${e}${R(t)})`)(t,i),n=((e,t)=>`${e}(${t})`)(e,r);return n})(u,e.field,{reducedTimeRange:r,timeShift:n});return e.unit?`normalize_by_unit(${t}, unit='${_(e)}')`:t}case"filter_ratio":return v(e,{reducedTimeRange:r,timeShift:n});case"static":return`${e.value}`;case"variance":return`${u}(standard_deviation(${e.field}${R({reducedTimeRange:r,timeShift:n})}), 2)`;case"std_deviation":return"lower"===e.mode?`average(${e.field}${R({reducedTimeRange:r,timeShift:n})}) - ${e.sigma||1.5} * ${u}(${e.field}${R({reducedTimeRange:r,timeShift:n})})`:"upper"===e.mode?`average(${e.field}${R({reducedTimeRange:r,timeShift:n})}) + ${e.sigma||1.5} * ${u}(${e.field}${R({reducedTimeRange:r,timeShift:n})})`:`${u}(${e.field})`;default:var c;return`${u}(${null!==(c=e.field)&&void 0!==c?c:""}${R({reducedTimeRange:r,timeShift:n})})`}},E=(e,t,i,r)=>{const n=l[e];if(!n)return!1;const a=n.supportedPanelTypes.includes(t),u=!r||n.supportedTimeRangeModes.includes(r);return a&&u&&(!n.isFieldRequired||i)},h=(e,t,i)=>e.every((e=>{const r="filter_ratio"!==e.type||E(e.metric_agg||"count",t,e.field,i);return"series_agg"===e.type||E(e.type,t,e.field,i)&&r}))},60:function(e,t,i){"use strict";i.d(t,"t",(function(){return o})),i.d(t,"l",(function(){return p})),i.d(t,"u",(function(){return m})),i.d(t,"m",(function(){return g})),i.d(t,"v",(function(){return v})),i.d(t,"b",(function(){return F})),i.d(t,"d",(function(){return b})),i.d(t,"r",(function(){return y})),i.d(t,"e",(function(){return w})),i.d(t,"c",(function(){return I})),i.d(t,"h",(function(){return M})),i.d(t,"a",(function(){return A})),i.d(t,"k",(function(){return P})),i.d(t,"o",(function(){return q})),i.d(t,"s",(function(){return j})),i.d(t,"f",(function(){return k})),i.d(t,"j",(function(){return B})),i.d(t,"i",(function(){return L})),i.d(t,"p",(function(){return C})),i.d(t,"g",(function(){return U})),i.d(t,"n",(function(){return z})),i.d(t,"q",(function(){return D}));var r=i(48),n=i.n(r),a=i(1),u=i(54);const l=e=>{let t;return e.formatter&&"default"!==e.formatter?(e.value_template&&(t=e.value_template.split("}}")[1]),i=e.formatter,["bytes","number","percent"].includes(i)?{format:{id:e.formatter,...t&&{params:{suffix:t,decimals:2}}}}:{format:{id:a.b.NUMBER,...t&&{params:{suffix:t,decimals:2}}}}):{};var i},s=(e,t,i,{isBucketed:r=!1,isSplit:a=!1,reducedTimeRange:l,timeShift:s,isAssignTimeScale:d=!0}={})=>{var o;return{columnId:n()(),dataType:null!==(o=null==i?void 0:i.type)&&void 0!==o?o:void 0,label:e.label,isBucketed:r,isSplit:a,reducedTimeRange:l,filter:e.filter,timeShift:s,timeScale:d?Object(u.h)(t):void 0,meta:{metricId:t.id}}},d=e=>!!e.meta,o=e=>{if(d(e)){const{meta:t,...i}=e;return i}return e};var c=i(31);const m=e=>{var t;return e.operationType===c.Operations.PERCENTILE&&Boolean(null==e||null===(t=e.meta)||void 0===t?void 0:t.reference)},f=(e,{series:t,metric:i,dataView:r},{index:n,reducedTimeRange:a,timeShift:u}={})=>{var d;const o=void 0===(c=e)||isNaN(Number(c))?null:{percentile:Number(c)};var c;if(!o)return null;const m=r.getFieldByName(null!==(d=i.field)&&void 0!==d?d:"document");if(!m)return null;const f=s(t,i,m,{reducedTimeRange:a,timeShift:u});return{operationType:"percentile",sourceField:m.name,...f,params:{...o,...l(t)},meta:void 0!==n?{reference:`${i.id}.${n}`,...f.meta}:f.meta}},p=(e,t)=>{const{percentiles:i}=e.metric;return i?i.map(((i,r)=>f(i.value,e,{index:r,...t}))):null},v=e=>{var t;return e.operationType===c.Operations.PERCENTILE_RANK&&Boolean(null===(t=e.meta)||void 0===t?void 0:t.reference)},T=(e,t,i,r,{index:n,reducedTimeRange:a,timeShift:u}={})=>{var d;const o=(e=>void 0===e||isNaN(Number(e))?null:{value:Number(e)})(e);if(!o)return null;const c=r.getFieldByName(null!==(d=i.field)&&void 0!==d?d:"document");if(!c)return null;const m=s(t,i,c,{reducedTimeRange:a,timeShift:u});return{operationType:"percentile_rank",sourceField:c.name,...m,params:{...o,...l(t)},meta:void 0!==n?{reference:`${i.id}.${n}`,...m.meta}:m.meta}},g=({series:e,metric:t,dataView:i},r)=>{const{values:n}=t;return n?n.map(((n,a)=>T(n,e,t,i,{index:a,...r}))):null},_=e=>({formula:e}),R=(e,{series:t,metric:i})=>{const r=_(e);return{operationType:"formula",references:[],...s(t,i,void 0,{isAssignTimeScale:!1}),params:{...r,...l(t)}}},y=e=>{const t=_(e);return{columnId:n()(),operationType:"formula",references:[],dataType:"string",isSplit:!1,isBucketed:!1,params:{...t}}},E=(e,t,i,r,n)=>(t.forEach((t=>{var a,l,s;const[d,o]=null!==(a=null==t||null===(l=t.field)||void 0===l?void 0:l.split("["))&&void 0!==a?a:[],c=Number(null==o?void 0:o.replace("]",""));if(!c)return;const m=Object(u.d)(i,r,{metaValue:c,...n});m&&(e=null===(s=e)||void 0===s?void 0:s.replace(`params.${t.name}`,m))})),e),h=(e,t,i,r,n)=>{const a=Object(u.d)(i,r,{...n});if(!a)return null;const l=t.find((e=>e.field===i.id));return null==e?void 0:e.replaceAll(`params.${null==l?void 0:l.name}`,a)},F=({series:e,metrics:t,dataView:i},r)=>{const n=t.find((({type:e})=>"math"===e));if(!n)return null;const{variables:a}=n;let u=t[t.length-1].script;if(!u||!a||!a.length)return null;const l=t.filter((({type:e})=>"math"!==e));for(const i of l){if("top_hit"===i.type&&null!=i&&i.size&&1!==Number(null==i?void 0:i.size)||"asc"===(null==i?void 0:i.order))return null;u="percentile"===i.type||"percentile_rank"===i.type?E(u,a,i,t,{reducedTimeRange:r,timeShift:e.offset_time}):h(u,a,i,t,{reducedTimeRange:r,timeShift:e.offset_time})}if(null===u)return null;const s=isNaN(Number(u));return u.includes("params")||!s?null:R(u,{series:e,metric:n,dataView:i})},b=(e,{series:t,metrics:i,dataView:r},n)=>{var a,l;const s=i[i.length-1],[d,o]=null!==(a=null==s||null===(l=s.field)||void 0===l?void 0:l.split("["))&&void 0!==a?a:[],c=i.find((({id:e})=>e===d)),m=o?Number(null==o?void 0:o.replace("]","")):void 0;if(!c)return null;const f=Object(u.f)(s,i,c,{metaValue:m,reducedTimeRange:n,timeShift:t.offset_time});return f?R(f,{series:t,metric:s,dataView:r}):null},S=[c.Operations.AVERAGE,c.Operations.COUNT,c.Operations.UNIQUE_COUNT,c.Operations.MAX,c.Operations.MIN,c.Operations.SUM,c.Operations.STANDARD_DEVIATION,c.Operations.COUNTER_RATE],N=[...S,c.Operations.LAST_VALUE,c.Operations.PERCENTILE,c.Operations.PERCENTILE_RANK,c.Operations.COUNTER_RATE],I=(e,{series:t,metrics:i,dataView:r},n)=>{if(a=e.name,!S.includes(a))return null;var a;const u=i[i.length-1],d=e.isFieldRequired&&u.field?u.field:"document",o=r.getFieldByName(d);return!o&&e.isFieldRequired?null:{operationType:e.name,sourceField:d,...s(t,u,o,n),params:{...l(t)}}},$=(e,{series:t,metric:i,dataView:r},n,a,{metaValue:l,reducedTimeRange:s}={})=>{const d=u.a[i.type];if(!d)return null;const o=Object(u.e)(d);if("filter_ratio"===n.type){const e=Object(u.c)(n,{reducedTimeRange:s,timeShift:t.offset_time});return e?R(`${o}(${e})`,{series:t,metric:i,dataView:r}):null}const m=((e,{series:t,metric:i,dataView:r},{metaValue:n,reducedTimeRange:a}={})=>{var u,l;return l=e.name,N.includes(l)?!r.getFieldByName(null!==(u=i.field)&&void 0!==u?u:"document")&&e.isFieldRequired?null:e.name===c.Operations.PERCENTILE?f(n,{series:t,metric:i,dataView:r},{reducedTimeRange:a}):e.name===c.Operations.PERCENTILE_RANK?T(null==n?void 0:n.toString(),t,i,r,{reducedTimeRange:a}):e.name===c.Operations.LAST_VALUE?null:I(e,{series:t,metrics:[i],dataView:r},{reducedTimeRange:a}):null})(a,{series:t,metric:n,dataView:r},{metaValue:l,reducedTimeRange:s});return m?[m,O(e,{series:t,metric:i,dataView:r},[m.columnId])]:null},w=({series:e,metrics:t,dataView:i},r)=>{const n=t[t.length-1];return"moving_average"===n.type||"derivative"===n.type?((e,t,{series:i,metrics:r,dataView:n},a)=>{var l,s,d;const[o,c]=null!==(l=null==t||null===(s=t.field)||void 0===s?void 0:s.split("["))&&void 0!==l?l:[],m=r.find((({id:e})=>e===o));if(!m||"static"===m.type)return null;const f=u.a[m.type];if(!f)return null;const p=Number(null==c?void 0:c.replace("]","")),v=m.field,[T,g]=null!==(d=null==v?void 0:v.split("["))&&void 0!==d?d:[];if(r.find((({id:e})=>e===T))||"counter_rate"===f.name||"variance"===m.type){const e=Object(u.f)(t,r,m,{metaValue:p,reducedTimeRange:a,timeShift:i.offset_time});return e?R(e,{series:i,metric:t,dataView:n}):null}{const r=u.a[e];return r?$(r.name,{series:i,metric:t,dataView:n},m,f,{metaValue:p,reducedTimeRange:a}):null}})(n.type,n,{series:e,metrics:t,dataView:i},r):null},O=(e,{series:t,metric:i,dataView:r},n=[])=>{const a="moving_average"===e?(({window:e})=>({window:null!=e?e:5}))(i):l(t);return{operationType:e,references:n,...s(t,i,void 0,{timeShift:t.offset_time}),params:a}};var V=i(29);const M=({series:e,metrics:t,dataView:i},r)=>{var n,a;const l=t[t.length-1],[s,d]=null!==(n=null==l||null===(a=l.field)||void 0===a?void 0:a.split("["))&&void 0!==n?n:[],o=t.find((({id:e})=>e===s));if(!o||"static"===o.type)return null;const c=u.a[o.type];if(!c)return null;let m;if("count"!==o.type&&"sum"!==c.name){const n=Number(null==d?void 0:d.replace("]",""));return m=Object(u.f)(l,t,o,{metaValue:n,reducedTimeRange:r,timeShift:e.offset_time}),m?R(m,{series:e,metric:l,dataView:i}):null}{const t=u.a[V.METRIC_TYPES.CUMULATIVE_SUM];return $(t.name,{series:e,metric:l,dataView:i},o,c,{reducedTimeRange:r})}},A=({series:e,metrics:t,dataView:i},r)=>{const n=t[t.length-1],a=Object(u.c)(n,{reducedTimeRange:r,timeShift:e.offset_time});return a?R(a,{series:e,metric:n,dataView:i}):null},P=({series:e,metrics:t,dataView:i},r)=>{var n,a;const u=t[t.length-1];if(null!=u&&u.size&&1!==Number(null==u?void 0:u.size)||"asc"===(null==u?void 0:u.order))return null;const d=i.getFieldByName(null!==(n=u.field)&&void 0!==n?n:"document");return d?{operationType:"last_value",sourceField:null!==(a=d.name)&&void 0!==a?a:"document",...s(e,u,void 0,{reducedTimeRange:r,timeShift:e.offset_time}),params:{...(o=u,{sortField:o.order_by,showArrayValues:!1}),...l(e)}}:null;var o},x=({value:e})=>({value:e}),q=({series:e,metrics:t,dataView:i},{visibleSeriesCount:r=0,reducedTimeRange:n}={})=>{if(1===r)return null;const a=t[t.length-1];return a.value?{operationType:"static_value",references:[],...s(e,a,void 0,{reducedTimeRange:n}),params:{...x(a),...l(e)}}:null},j=e=>({columnId:n()(),operationType:"static_value",references:[],dataType:"number",isStaticValue:!0,isBucketed:!1,isSplit:!1,params:{value:e.toString()}}),k=({series:e,metrics:t,dataView:i},{visibleSeriesCount:r=0,reducedTimeRange:n}={})=>{if(1===r)return null;const a=t[t.length-1];return a.value?R(a.value,{series:e,metric:a,dataView:i}):null},B=(e,t)=>{const i=(e=>{const t=[];return"filter"===e.split_mode&&e.filter&&t.push({filter:e.filter}),e.split_filters&&t.push(...e.split_filters),{filters:null==t?void 0:t.map((e=>{var t;return{input:{query:e.filter?e.filter.query:"",language:e.filter?e.filter.language:"kuery"},label:null!==(t=e.label)&&void 0!==t?t:""}}))}})(e);return i.filters.length?{columnId:n()(),operationType:"filters",dataType:"string",isBucketed:!0,isSplit:t,params:i}:null},L=(e,t,i,{fieldName:r,isSplit:a,includeEmptyRows:u=!0})=>{const l=i.getFieldByName(r);if(!l)return null;const s=((e,t,i=!0)=>{var r,n;return{interval:(n=t.override_index_pattern?t.series_interval:null==e?void 0:e.interval,!n||null!=n&&n.includes("=")?"auto":n),dropPartials:t.override_index_pattern?t.series_drop_last_bucket>0:(null!==(r=null==e?void 0:e.drop_last_bucket)&&void 0!==r?r:0)>0,includeEmptyRows:i}})(e,t,u);return{columnId:n()(),operationType:"date_histogram",dataType:l.type,isBucketed:!0,isSplit:a,sourceField:l.name,params:s}},C=(e,t,i,r,a=!1,u)=>{var s;const[c,...m]=e,f=r.getFieldByName(c);if(!f)return null;const p=((e,t,i)=>{const r="asc"===e.terms_direction?"asc":"desc",a=((e,t)=>{if("_key"===e.terms_order_by)return{orderBy:{type:"alphabetical"}};if("_count"===e.terms_order_by||!e.terms_order_by)return{orderBy:{type:"custom"},orderAgg:{operationType:"count",sourceField:"document",columnId:n()(),isBucketed:!0,isSplit:!1,dataType:"number",params:{}}};const i=t.find((t=>!!d(t)&&t.meta.metricId===e.terms_order_by));return i?{orderBy:{type:"column",columnId:i.columnId},orderAgg:o(i)}:null})(e,t);return null===a?null:{size:e.terms_size?Number(e.terms_size):10,...e.terms_include&&{include:[e.terms_include]},includeIsRegex:Boolean(e.terms_include),...e.terms_exclude&&{exclude:[e.terms_exclude]},excludeIsRegex:Boolean(e.terms_exclude),otherBucket:!1,orderDirection:r,parentFormat:{id:"terms"},...a,secondaryFields:i}})(t,i,m);return p?{columnId:n()(),operationType:"terms",dataType:null!==(s=f.type)&&void 0!==s?s:void 0,sourceField:f.name,isBucketed:!0,isSplit:a,label:u,params:{...p,...l(t)}}:null},U=({series:e,metrics:t,dataView:i})=>{const r=t[t.length-1],n=r.field?i.getFieldByName(r.field):void 0;if(!n)return null;const a={operationType:c.Operations.MAX,sourceField:n.name,...s(e,r,n),params:{...l(e)}};return[a,{operationType:c.Operations.COUNTER_RATE,references:[a.columnId],...s(e,r,n,{timeShift:e.offset_time}),params:{...l(e)}}]},G=({series:e,metric:t,dataView:i},r,n)=>{const a=Object(u.d)(t,r,{reducedTimeRange:n,timeShift:e.offset_time});return a?R(a,{series:e,metric:t,dataView:i}):null},z=({series:e,metrics:t,dataView:i},r)=>{const n=t[t.length-1];if(!(n.field?i.getFieldByName(n.field):void 0))return null;const a=[];return"upper"===n.mode||"lower"===n.mode?a.push(G({series:e,metric:n,dataView:i},t,r)):"band"===n.mode?[{...n,mode:"upper"},{...n,mode:"lower"}].forEach((n=>{a.push(G({series:e,metric:n,dataView:i},t,r))})):a.push(I(u.a.std_deviation,{series:e,metrics:[n],dataView:i},{reducedTimeRange:r,timeShift:e.offset_time})),a},D=({series:e,metrics:t,dataView:i},r)=>{const n=t[t.length-1];if(!(n.field?i.getFieldByName(n.field):void 0))return null;const a=Object(u.d)(n,t,{reducedTimeRange:r,timeShift:e.offset_time});return a?R(a,{series:e,metric:n,dataView:i}):null}},61:function(e,t,i){"use strict";i.d(t,"c",(function(){return u})),i.d(t,"f",(function(){return l})),i.d(t,"d",(function(){return s})),i.d(t,"e",(function(){return d})),i.d(t,"b",(function(){return o})),i.d(t,"a",(function(){return c}));var r=i(3),n=i(30),a=i(18);const u=(e,t,i=!0)=>{if(e.length&&t){const r=e.find((e=>e.name===t));if(r)return r.label||r.name;if(i)throw new a.b(t)}return t},l=e=>e.filter((e=>e.aggregatable&&!Object(n.isNestedField)(e))).map((e=>{var t;return{name:e.name,label:null!==(t=e.customLabel)&&void 0!==t?t:e.name,type:e.type}})),s=e=>e?[e].flat().filter(Boolean):[],d=(e,t)=>{const i=t?u(t,e[0]):e[0];return e.length>1?r.i18n.translate("visTypeTimeseries.fieldUtils.multiFieldLabel",{defaultMessage:"{firstFieldLabel} + {count} {count, plural, one {other} other {others}}",values:{firstFieldLabel:i,count:e.length-1}}):null!=i?i:""},o=(e,t,i,r,n=[])=>{const a=new Map;return(u,l,s="text")=>{var d,o;const c=a.get(u),m=e=>e.convert(l,s,r?{timezone:r.timezone}:void 0);if(c)return m(c);const f=null==e||null===(d=e.fieldFormatMap)||void 0===d||null===(o=d[u])||void 0===o?void 0:o.id;if(e&&!n.includes(f)){const t=e.fields.getByName(u);if(t){const i=e.getFormatterForField(t);if(i)return a.set(u,i),m(i)}}else if(i&&t){const e=t.find((e=>e.name===u));if(e){const t=i.getDefaultInstance(e.type);if(t)return a.set(u,t),m(t)}}}},c=" › "},62:function(e,t,i){"use strict";i.d(t,"c",(function(){return n})),i.d(t,"b",(function(){return s})),i.d(t,"a",(function(){return o}));const r={mean:"avg",min:"min",max:"max",sum:"sum"},n=e=>{const t=e[e.length-1];return"series_agg"===t.type&&t.function&&r[t.function]?{metrics:e.slice(0,-1),seriesAgg:r[t.function]}:{metrics:e,seriesAgg:void 0}};var a=i(54),u=i(60);const l=e=>{if(e&&Array.isArray(e)){const t=e.filter((e=>null!==e));return t.length!==e.length?null:t}return e?[e]:null},s=(e,t,i,{isStaticValueColumnSupported:r=!1,reducedTimeRange:s}={})=>{const{metrics:d,seriesAgg:o}=n(e.metrics);if(!d.length)return null;const c=d;if(o&&"everything"===e.split_mode)return null;const m=c.length-1,f=c[m].type,p=a.a[f];if(!p)return null;const v={series:e,metrics:c,dataView:t};switch(f){case"percentile":{const i=Object(u.l)({series:e,metric:c[m],dataView:t},{reducedTimeRange:s,timeShift:e.offset_time});return l(i)}case"percentile_rank":{const i=Object(u.m)({series:e,metric:c[m],dataView:t},{reducedTimeRange:s,timeShift:e.offset_time});return l(i)}case"math":{const e=Object(u.b)(v,s);return l(e)}case"derivative":case"moving_average":{const e=Object(u.e)(v,s);return l(e)}case"cumulative_sum":{const e=Object(u.h)(v,s);return l(e)}case"filter_ratio":{const e=Object(u.a)(v,s);return l(e)}case"positive_rate":{const e=Object(u.g)(v);return l(e)}case"positive_only":case"avg_bucket":case"max_bucket":case"min_bucket":case"sum_bucket":{const e=Object(u.d)(f,v,s);return l(e)}case"top_hit":{const e=Object(u.k)(v,s);return l(e)}case"variance":{const e=Object(u.q)(v,s);return l(e)}case"static":{const e=r?Object(u.o)(v,{visibleSeriesCount:i,reducedTimeRange:s}):Object(u.f)(v);return l(e)}case"std_deviation":{const e=Object(u.n)(v,s);return l(e)}default:{const t=Object(u.c)(p,v,{reducedTimeRange:s,timeShift:e.offset_time});return l(t)}}};var d=i(61);const o=(e,t,i,r,n=!1,a,s=!0)=>{if((e=>"filters"===e.split_mode||"filter"===e.split_mode)(t)){const e=Object(u.j)(t,!0);return l([e])}if((e=>"terms"===e.split_mode)(t)){const o=Object(d.d)(t.terms_field),c=((e,t,i)=>{if(e.terms_field&&"terms"===e.split_mode&&t.length)for(const e of t){var r;if("date"===(null===(r=i.getFieldByName(e))||void 0===r?void 0:r.type))return 1===t.length||null}return!1})(t,o,r);if(null===c)return null;if(((e,t)=>t&&"terms"===e.split_mode)(t,c)){const i=Object(u.i)(e,t,r,{fieldName:o[0],isSplit:!0,includeEmptyRows:s});return l(i)}if(!o.length)return null;const m=Object(u.p)(o,t,i,r,n,a);return l(m)}return[]}},72:function(e,t,i){"use strict";i.d(t,"a",(function(){return n}));var r=i(12);const n=async(e,t,i,n,a,u)=>{try{let l,s=e&&!Object(r.e)(e)?e.id:"",d=t;if(i){const e=await(async(e,t,i)=>{if(Object(r.e)(e)){var n;const r=await i.create({id:`tsvb_ad_hoc_${e}${t?"/"+t:""}`,title:e,timeFieldName:t},!1,!1);return{indexPattern:r,indexPatternId:null!==(n=r.id)&&void 0!==n?n:"",timeField:r.timeFieldName}}if(e){const r=await i.get(e.id);var a;if(r)return{indexPattern:r,indexPatternId:null!==(a=r.id)&&void 0!==a?a:"",timeField:null!=t?t:r.timeFieldName}}return null})(n,a,u);e&&([l,s,d]=[e.indexPattern,e.indexPatternId,e.timeField])}if(s)l=await u.get(s),d||(d=l.timeFieldName);else{const i=await(async(e,t,i)=>{var n;if(Object(r.e)(e)){var a;if(!t)throw new Error("Time field is empty");const r=await i.create({id:`tsvb_ad_hoc_${e}${t?"/"+t:""}`,title:e,timeFieldName:t},!1,!1);return{indexPattern:r,indexPatternId:null!==(a=r.id)&&void 0!==a?a:"",timeField:r.timeFieldName}}const u=await i.getDefault();return{indexPattern:u,indexPatternId:null!==(n=null==u?void 0:u.id)&&void 0!==n?n:"",timeField:null==u?void 0:u.timeFieldName}})(e,t,u);[l,s,d]=[i.indexPattern,i.indexPatternId,i.timeField]}return{indexPatternId:s,timeField:d,indexPattern:l}}catch(e){return null}}},80:function(e,t,i){var r,n,a=i(24),u=i(25),l=0,s=0;e.exports=function(e,t,i){var d=t&&i||0,o=t||[],c=(e=e||{}).node||r,m=void 0!==e.clockseq?e.clockseq:n;if(null==c||null==m){var f=a();null==c&&(c=r=[1|f[0],f[1],f[2],f[3],f[4],f[5]]),null==m&&(m=n=16383&(f[6]<<8|f[7]))}var p=void 0!==e.msecs?e.msecs:(new Date).getTime(),v=void 0!==e.nsecs?e.nsecs:s+1,T=p-l+(v-s)/1e4;if(T<0&&void 0===e.clockseq&&(m=m+1&16383),(T<0||p>l)&&void 0===e.nsecs&&(v=0),v>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");l=p,s=v,n=m;var g=(1e4*(268435455&(p+=122192928e5))+v)%4294967296;o[d++]=g>>>24&255,o[d++]=g>>>16&255,o[d++]=g>>>8&255,o[d++]=255&g;var _=p/4294967296*1e4&268435455;o[d++]=_>>>8&255,o[d++]=255&_,o[d++]=_>>>24&15|16,o[d++]=_>>>16&255,o[d++]=m>>>8|128,o[d++]=255&m;for(var R=0;R<6;++R)o[d+R]=c[R];return t||u(o)}}}]);