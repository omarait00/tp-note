/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.maps_bundle_jsonpfunction=window.maps_bundle_jsonpfunction||[]).push([[8,14],{126:function(e,t,n){"use strict";n.r(t),n.d(t,"mapEmbeddablesSingleton",(function(){return c}));var s=n(28),a=n.n(s);const i={};let o,l,r;const c={getGeoFieldNames(){const e=[];return Object.values(i).forEach((t=>{e.push(...t.getGeoFieldNames())})),a.a.uniq(e)},getLocation:()=>o,getMapPanels:()=>Object.keys(i).map((e=>({...i[e],id:e}))),hasMultipleMaps:()=>Object.keys(i).length>1,register(e,t){i[e]=t},setLocation(e,t,n,s){l&&l!==e||(l=e,r&&clearTimeout(r),r=setTimeout((()=>{l=void 0}),500),o={lat:t,lon:n,zoom:s},Object.keys(i).forEach((a=>{if(a===e)return;const o=i[a];o.getIsMovementSynchronized()&&o.onLocationChange(t,n,s)})))},unregister(e){delete i[e],0===Object.keys(i).length&&(o=void 0)}}},556:function(e,t,n){"use strict";n.r(t),n.d(t,"FilterByMapExtentModal",(function(){return FilterByMapExtentModal}));var s=n(5),a=n(15),i=n(126),o=n(2);class FilterByMapExtentModal extends s.Component{_renderSwitches(){return i.mapEmbeddablesSingleton.getMapPanels().map((e=>Object(o.jsx)(a.EuiFormRow,{display:"columnCompressedSwitch",key:e.id},Object(o.jsx)(a.EuiSwitch,{label:e.getTitle(),checked:e.getIsFilterByMapExtent(),onChange:t=>{const n=t.target.checked;e.setIsFilterByMapExtent(n),n&&i.mapEmbeddablesSingleton.getMapPanels().forEach((t=>{t.id!==e.id&&t.getIsFilterByMapExtent()&&t.setIsFilterByMapExtent(!1)})),this.forceUpdate()},compressed:!0,"data-test-subj":`filterByMapExtentSwitch${e.id}`}))))}render(){return Object(o.jsx)(s.Fragment,null,Object(o.jsx)(a.EuiModalHeader,null,Object(o.jsx)(a.EuiModalHeaderTitle,null,this.props.title)),Object(o.jsx)(a.EuiModalBody,null,this._renderSwitches()))}}}}]);