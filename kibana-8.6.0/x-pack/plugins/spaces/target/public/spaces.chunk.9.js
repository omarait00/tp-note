/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.spaces_bundle_jsonpfunction=window.spaces_bundle_jsonpfunction||[]).push([[9],{117:function(a,e,n){"use strict";n.r(e),n.d(e,"SpaceAvatarInternal",(function(){return u}));var t=n(8),c=n.n(t),i=n(2),s=(n(1),n(15)),r=n(19),o=n(0);const u=a=>{const{space:e,size:n,announceSpaceName:t,...u}=a,p=e.name?e.name.trim():"",d=Object(r.a)(e),l=Object(r.c)(e),b=Object(r.b)(e),j=b?{imageUrl:b}:{initials:l,initialsLength:s.MAX_SPACE_INITIALS};return Object(o.jsx)(i.EuiAvatar,c()({type:"space","data-test-subj":`space-avatar-${e.id}`,name:p},!t&&{"aria-label":"","aria-hidden":!0},{size:n||"m",color:Object(i.isValidHex)(d)?d:""},j,u))};u.defaultProps={announceSpaceName:!0}}}]);