(window.eventAnnotation_bundle_jsonpfunction=window.eventAnnotation_bundle_jsonpfunction||[]).push([[1],{15:function(n,t,e){"use strict";e.r(t),e.d(t,"hasIcon",(function(){return s})),e.d(t,"getEventAnnotationService",(function(){return l}));var i=e(4),o=e(1),a=e(3);function s(n){return null!=n&&"empty"!==n}function l(){const n=n=>{const[t,e]=Object(i.partition)(n,a.e),l=[];for(const n of e)if(Object(a.f)(n)){const{label:t,color:e,key:i,outside:o,id:s}=n,{timestamp:r,endTimestamp:c}=i;l.push({type:"expression",chain:[{type:"function",function:"manual_range_event_annotation",arguments:{id:[s],time:[r],endTime:[c],label:[t||a.b],color:[e||a.c],outside:[Boolean(o)],isHidden:[Boolean(n.isHidden)]}}]})}else{const{label:t,color:e,lineStyle:i,lineWidth:o,icon:r,key:c,textVisibility:u,id:d}=n;l.push({type:"expression",chain:[{type:"function",function:"manual_point_event_annotation",arguments:{id:[d],time:[c.timestamp],label:[t||a.b],color:[e||a.a],lineWidth:[o||1],lineStyle:[i||"solid"],icon:s(r)?[r]:["triangle"],textVisibility:[u||!1],isHidden:[Boolean(n.isHidden)]}}]})}for(const n of t){const{id:t,label:e,color:i,lineStyle:r,lineWidth:c,icon:u,timeField:d,textVisibility:p,textField:f,filter:y,extraFields:m,ignoreGlobalFilters:b}=n;l.push({type:"expression",chain:[{type:"function",function:"query_point_event_annotation",arguments:{id:[t],timeField:d?[d]:[],label:[e||a.b],color:[i||a.a],lineWidth:[c||1],lineStyle:[r||"solid"],icon:s(u)?[u]:["triangle"],textVisibility:[p||!1],textField:p&&f?[f]:[],filter:y?[Object(o.queryToAst)(y)]:[],extraFields:m||[],ignoreGlobalFilters:[Boolean(b)],isHidden:[Boolean(n.isHidden)]}}]})}return l};return{toExpression:n,toFetchExpression:({interval:t,groups:e})=>0===e.length?[]:[{type:"expression",chain:[{type:"function",function:"kibana",arguments:{}},{type:"function",function:"fetch_event_annotations",arguments:{interval:[t],groups:[...e.filter((n=>n.annotations.some((n=>!n.isHidden)))).map((({annotations:t,indexPatternId:e})=>({type:"expression",chain:[{type:"function",function:"event_annotation_group",arguments:{dataView:[{type:"expression",chain:[{type:"function",function:"indexPatternLoad",arguments:{id:[e]}}]}],annotations:[...n(t)]}}]})))]}}]}]}}}}]);