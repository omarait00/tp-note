(window.visTypeTimeseries_bundle_jsonpfunction=window.visTypeTimeseries_bundle_jsonpfunction||[]).push([[16],{230:function(e,o,t){"use strict";t.r(o),t.d(o,"convertToLens",(function(){return m}));var r=t(48),n=t.n(r),s=t(30),a=t(31),i=t(1),l=t(0),c=t(76);const u=(e,o,t)=>{var r;const n=t?Object(c.a)(null!==(r=t.color_rules)&&void 0!==r?r:[]):void 0;return{columnId:e,alignment:"left",colorMode:n?"text":"none",...n?{palette:n}:{},...o?{collapseFn:o}:{}}};var g=t(72),d=t(62),p=t(54),v=t(60);const f=()=>new Error("Invalid model"),m=async({params:e,uiState:o},t)=>{const r=[],c=Object(l.d)();try{var m,h;const l=e.series.filter((e=>!e.hidden)).length,_=null!==(m=null===(h=o.get("table"))||void 0===h?void 0:h.sort)&&void 0!==m?m:{},b=await Object(g.a)(e.index_pattern,e.time_field,!1,void 0,void 0,c);if(!b)throw f();const{indexPatternId:y,indexPattern:x}=b,w=Object(d.a)(void 0,{split_mode:"terms",terms_field:e.pivot_id,terms_size:e.pivot_rows?e.pivot_rows.toString():void 0},[],x,!1,e.pivot_label,!1);if(!w)throw f();const I={columnId:w[0].columnId,direction:_.order};r.push(u(w[0].columnId));let j=[];if(!e.series.every((o=>!((o.aggregate_by||e.series[0].aggregate_by)&&o.aggregate_by!==e.series[0].aggregate_by||(o.aggregate_function||e.series[0].aggregate_function)&&o.aggregate_function!==e.series[0].aggregate_function))))throw f();if(e.series[0].aggregate_by){if(!e.series[0].aggregate_function||!["sum","mean","min","max"].includes(e.series[0].aggregate_function))throw f();if(j=Object(d.a)(void 0,{split_mode:"terms",terms_field:e.series[0].aggregate_by},[],x,!1),null===j)throw f();r.push(u(j[0].columnId,"mean"===e.series[0].aggregate_function?"avg":e.series[0].aggregate_function))}const O=[];for(const[o,n]of e.series.entries()){if(n.hidden)continue;if(n.offset_time&&"invalid"===Object(s.parseTimeShift)(n.offset_time))throw f();if(!Object(p.i)(n.metrics,i.e.TABLE,n.time_range_mode))throw f();const o=Object(p.g)(e,n,t),a=Object(d.b)(n,x,l,{reducedTimeRange:o});if(!a)throw f();r.push(u(a[0].columnId,void 0,n)),_.column===n.id&&(I.columnId=a[0].columnId),O.push(...a)}if(!O.length||O.every((e=>"static_value"===e.operationType)))throw f();const M={indexPatternId:y,layerId:n()(),columns:[...O,...w,...j],columnOrder:[]},T=Object.values((e=>{const o={};return Object.entries(e).forEach((([e,t])=>{const r=t.columns.map(v.t);o[e]={...t,columns:r}})),o})({0:M}));return{type:"lnsDatatable",layers:T,configuration:{columns:r,layerId:M.layerId,layerType:"data",sorting:I},indexPatternIds:Object(a.getIndexPatternIds)(T)}}catch(e){return null}}},76:function(e,o,t){"use strict";t.d(o,"a",(function(){return c}));var r=t(50),n=t.n(r),s=t(9);const a="lte",i=e=>{var o;return(e=>{var o;const t=e;return!!(null!==(o=t.background_color)&&void 0!==o?o:t.color)})(e)?null!==(o=e.background_color)&&void 0!==o?o:e.color:(e=>Boolean(e.gauge))(e)?e.gauge:e.text},l=e=>({name:"custom",params:{continuity:"all",maxSteps:5,name:"custom",progression:"fixed",rangeMax:1/0,rangeMin:-1/0,rangeType:"number",reverse:!1,...e},type:"palette"}),c=(e,o)=>{const t=e.filter((e=>(e=>{var o,t;const{background_color:r,color:n}=e,{gauge:s}=e,{text:a}=e;return Boolean(e.operator&&(null!==(o=null!==(t=null!=r?r:n)&&void 0!==t?t:s)&&void 0!==o?o:a)&&void 0!==e.value)})(e)));if(t.sort(((e,o)=>e.value-o.value)),!Object(s.uniqBy)(t,"operator").length)return;if(1===t.length)return t[0].operator===a?l((e=>{const o={color:n()(i(e)).hex(),stop:e.value};return{rangeMin:-1/0,rangeMax:e.value,colorStops:[o],stops:[o],steps:1,continuity:"below"}})(t[0])):"gte"===t[0].operator?l(((e,o)=>{const t={color:n()(i(e)).hex(),stop:e.value};return{colorStops:[...o?[{color:o,stop:-1/0}]:[],t],continuity:o?"all":"above",rangeMax:1/0,rangeMin:o?-1/0:t.stop,steps:2,stops:[...o?[{color:o,stop:t.stop}]:[],{color:t.color,stop:1/0}]}})(t[0],o)):void 0;const r=t.slice(0,-1),c=t[t.length-1],u=Object(s.uniqBy)(r,"operator");if(u.length>1||u[0].operator!==c.operator&&c.operator!==a)return;const[g]=u;if(g.operator!==a){if("lt"===g.operator){if(c.operator!==a)return;return l((e=>{const o=e[e.length-1],t=e.reduce(((e,o,t,r)=>{if(0===t)return[{color:n()(i(o)).hex(),stop:-1/0}];const s=i(o);return[...e,{color:n()(s).hex(),stop:r[t-1].value}]}),[]),r=t.reduce(((e,t,r,n)=>r===n.length-1?[...e,{color:t.color,stop:o.value}]:[...e,{color:t.color,stop:n[r+1].stop}]),[]);return{rangeMin:-1/0,rangeMax:o.value,colorStops:t,stops:r,steps:t.length+1,continuity:"below"}})(t))}return"gte"===g.operator?l(((e,o,t)=>{const r=e[e.length-1],s=i(r),l=t?[{stop:-1/0,color:t}]:[],c=e.reduce(((e,t,r,l)=>{const c=i(t);return r===l.length-1&&o===a?e:r===l.length-2&&o===a?[...e,{color:n()(s).hex(),stop:t.value}]:[...e,{color:n()(c).hex(),stop:t.value}]}),l),u=c.reduce(((e,t,n,s)=>n===s.length-1?[...e,{color:t.color,stop:o===a?r.value:t.stop+1}]:[...e,{color:t.color,stop:s[n+1].stop}]),[]),[g]=e;return{rangeMin:t?-1/0:g.value,rangeMax:o===a?r.value:1/0,colorStops:c,stops:u,steps:c.length,continuity:o===a?t?"below":"none":t?"all":"above"}})(t,c.operator,o)):void 0}}}}]);