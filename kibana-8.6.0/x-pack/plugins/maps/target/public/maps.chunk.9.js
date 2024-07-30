/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.maps_bundle_jsonpfunction=window.maps_bundle_jsonpfunction||[]).push([[9,14],{126:function(e,n,t){"use strict";t.r(n),t.d(n,"mapEmbeddablesSingleton",(function(){return l}));var o=t(28),s=t.n(o);const r={};let c,a,i;const l={getGeoFieldNames(){const e=[];return Object.values(r).forEach((n=>{e.push(...n.getGeoFieldNames())})),s.a.uniq(e)},getLocation:()=>c,getMapPanels:()=>Object.keys(r).map((e=>({...r[e],id:e}))),hasMultipleMaps:()=>Object.keys(r).length>1,register(e,n){r[e]=n},setLocation(e,n,t,o){a&&a!==e||(a=e,i&&clearTimeout(i),i=setTimeout((()=>{a=void 0}),500),c={lat:n,lon:t,zoom:o},Object.keys(r).forEach((s=>{if(s===e)return;const c=r[s];c.getIsMovementSynchronized()&&c.onLocationChange(n,t,o)})))},unregister(e){delete r[e],0===Object.keys(r).length&&(c=void 0)}}},557:function(e,n,t){"use strict";t.r(n),t.d(n,"SynchronizeMovementModal",(function(){return SynchronizeMovementModal}));var o=t(5),s=t(1),r=t(15),c=t(126),a=t(2);class SynchronizeMovementModal extends o.Component{_renderSwitches(){const e=c.mapEmbeddablesSingleton.getMapPanels(),n=e.filter((e=>e.getIsMovementSynchronized()));return e.map((t=>{const o=1===n.length&&t.getIsMovementSynchronized();return Object(a.jsx)(r.EuiFormRow,{display:"columnCompressedSwitch",key:t.id,isInvalid:o,error:o?[s.i18n.translate("xpack.maps.synchronizeMovementModal.onlyOneMapSelectedError",{defaultMessage:"Select another map to synchronize map movement"})]:[]},Object(a.jsx)(r.EuiSwitch,{label:t.getTitle(),checked:t.getIsMovementSynchronized(),onChange:o=>{const s=o.target.checked;s||2!==n.length?s&&2===e.length?e.forEach((e=>{e.setIsMovementSynchronized(!0)})):t.setIsMovementSynchronized(s):n.forEach((e=>{e.setIsMovementSynchronized(!1)})),this.forceUpdate()},compressed:!0}))}))}render(){return Object(a.jsx)(o.Fragment,null,Object(a.jsx)(r.EuiModalHeader,null,Object(a.jsx)(r.EuiModalHeaderTitle,null,s.i18n.translate("xpack.maps.synchronizeMovementAction.title",{defaultMessage:"Synchronize map movement"}))),Object(a.jsx)(r.EuiModalBody,null,this._renderSwitches()))}}}}]);