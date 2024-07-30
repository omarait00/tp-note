/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.spaces_bundle_jsonpfunction=window.spaces_bundle_jsonpfunction||[]).push([[1],{125:function(M,e,j){"use strict";j.r(e),j.d(e,"SpaceSelector",(function(){return space_selector_SpaceSelector})),j.d(e,"renderSpaceSelectorApp",(function(){return d}));var T=j(4),s=j.n(T),D=(j(52),j(2)),t=j(1),N=j(10),i=j.n(N),c=j(3),a=j(11),g=j(9),I=j(8),u=j.n(I),L=j(61),z=j.n(L),O=(j(62),j(32)),n=j.n(O),o=j(0),r=["className","size"],w=function(M){var e=M.className,j=M.size,T=z()(M,r),t={};return function(M){return void 0===M.iconType}(M)&&(t.iconType="logo".concat(M.name.replace(/\s+/g,""))),Object(o.jsx)(D.EuiAvatar,u()({className:n()("kbnSolutionAvatar",s()({},"kbnSolutionAvatar--".concat(j),j),e),size:"xxl"===j?"xl":j,iconSize:j,color:"plain"},T,t))},y=j(6),x=(j(67),j(72),j(15)),E=j(5);const S=Object(t.lazy)((()=>Object(E.a)().then((M=>({default:M}))))),p=M=>{const{serverBasePath:e,space:j}=M;return Object(o.jsx)(D.EuiCard,{className:"spaceCard","data-test-subj":`space-card-${j.id}`,icon:l(j),title:j.name,description:C(j),href:Object(x.addSpaceIdToPath)(e,j.id,x.ENTER_SPACE_PATH)})};function l(M){return Object(o.jsx)(t.Suspense,{fallback:Object(o.jsx)(D.EuiLoadingSpinner,{size:"xxl"})},Object(o.jsx)(S,{space:M,size:"l",announceSpaceName:!1}))}function C(M){let e=M.description||"";return e.length>120&&(e=e.substr(0,120)+"…"),Object(o.jsx)(D.EuiTextColor,{color:"subdued",title:e,className:"eui-textBreakWord"},e)}class space_cards_SpaceCards extends t.Component{constructor(...M){super(...M),s()(this,"renderSpace",(M=>Object(o.jsx)(D.EuiFlexItem,{key:M.id,grow:!1},Object(o.jsx)(p,{space:M,serverBasePath:this.props.serverBasePath}))))}render(){return Object(o.jsx)("div",{className:"spaceCards"},Object(o.jsx)(D.EuiFlexGroup,{gutterSize:"l",justifyContent:"center",wrap:!0,responsive:!1},this.props.spaces.map(this.renderSpace)))}}class space_selector_SpaceSelector extends t.Component{constructor(M){super(M),s()(this,"headerRef",void 0),s()(this,"setHeaderRef",(M=>{this.headerRef=M,this.headerRef&&this.headerRef.focus()})),s()(this,"getSearchField",(()=>{if(!this.state.spaces||this.state.spaces.length<y.e)return null;const M=c.i18n.translate("xpack.spaces.spaceSelector.findSpacePlaceholder",{defaultMessage:"Find a space"});return Object(o.jsx)("div",{className:"spcSpaceSelector__searchHolder"},Object(o.jsx)(D.EuiFieldSearch,{placeholder:M,"aria-label":M,incremental:!0,onSearch:this.onSearch}))})),s()(this,"onSearch",((M="")=>{this.setState({searchTerm:M.trim().toLowerCase()})})),this.state={loading:!1,searchTerm:"",spaces:[]}}componentDidMount(){0===this.state.spaces.length&&this.loadSpaces()}loadSpaces(){this.setState({loading:!0});const{spacesManager:M}=this.props;M.getSpaces().then((M=>{this.setState({loading:!1,spaces:M})})).catch((M=>{this.setState({loading:!1,error:M})}))}render(){const{spaces:M,searchTerm:e}=this.state;let j=M;return e&&(j=M.filter((M=>M.name.toLowerCase().indexOf(e)>=0||(M.description||"").toLowerCase().indexOf(e)>=0))),Object(o.jsx)(g.KibanaPageTemplate,{template:"empty",className:"spcSpaceSelector","data-test-subj":"kibanaSpaceSelector",pageContentBodyProps:{className:"spcSpaceSelector__pageContent"}},Object(o.jsx)(D.EuiText,{textAlign:"center",size:"s"},Object(o.jsx)(D.EuiSpacer,{size:"xxl"}),Object(o.jsx)(w,{name:"Elastic",size:"xl"}),Object(o.jsx)(D.EuiSpacer,{size:"xxl"}),Object(o.jsx)("h1",{className:"eui spcSpaceSelector__pageHeader",tabIndex:0,ref:this.setHeaderRef},Object(o.jsx)(a.FormattedMessage,{id:"xpack.spaces.spaceSelector.selectSpacesTitle",defaultMessage:"Select your space"})),Object(o.jsx)(D.EuiTextColor,{color:"subdued"},Object(o.jsx)("p",null,Object(o.jsx)(a.FormattedMessage,{id:"xpack.spaces.spaceSelector.changeSpaceAnytimeAvailabilityText",defaultMessage:"You can change your space at anytime."})))),Object(o.jsx)(D.EuiSpacer,{size:"xxl"}),this.getSearchField(),Object(o.jsx)(D.EuiSpacer,{size:"xl"}),this.state.loading&&Object(o.jsx)(D.EuiLoadingSpinner,{size:"xl"}),!this.state.loading&&Object(o.jsx)(space_cards_SpaceCards,{spaces:j,serverBasePath:this.props.serverBasePath}),!this.state.loading&&!this.state.error&&0===j.length&&Object(o.jsx)(t.Fragment,null,Object(o.jsx)(D.EuiSpacer,null),Object(o.jsx)(D.EuiPanel,{className:"spcSpaceSelector__errorPanel",color:"subdued"},Object(o.jsx)(D.EuiTitle,{size:"xs"},Object(o.jsx)("h2",null,c.i18n.translate("xpack.spaces.spaceSelector.noSpacesMatchSearchCriteriaDescription",{defaultMessage:"No spaces match {searchTerm}",values:{searchTerm:`"${this.state.searchTerm}"`}}))))),!this.state.loading&&this.state.error&&Object(o.jsx)(t.Fragment,null,Object(o.jsx)(D.EuiSpacer,null),Object(o.jsx)(D.EuiPanel,{color:"danger",className:"spcSpaceSelector__errorPanel"},Object(o.jsx)(D.EuiText,{size:"s",color:"danger"},Object(o.jsx)("h2",null,Object(o.jsx)(a.FormattedMessage,{id:"xpack.spaces.spaceSelector.errorLoadingSpacesDescription",defaultMessage:"Error loading spaces ({message})",values:{message:this.state.error.message}})),Object(o.jsx)("p",null,Object(o.jsx)(a.FormattedMessage,{id:"xpack.spaces.spaceSelector.contactSysAdminDescription",defaultMessage:"Contact your system administrator."}))))))}}const d=(M,{element:e,theme$:j},T)=>(i.a.render(Object(o.jsx)(M.Context,null,Object(o.jsx)(g.KibanaThemeProvider,{theme$:j},Object(o.jsx)(space_selector_SpaceSelector,T))),e),()=>i.a.unmountComponentAtNode(e))},34:function(M,e,j){"use strict";var T,s=function(){var M={};return function(e){if(void 0===M[e]){var j=document.querySelector(e);if(window.HTMLIFrameElement&&j instanceof window.HTMLIFrameElement)try{j=j.contentDocument.head}catch(M){j=null}M[e]=j}return M[e]}}(),D=[];function t(M){for(var e=-1,j=0;j<D.length;j++)if(D[j].identifier===M){e=j;break}return e}function N(M,e){for(var j={},T=[],s=0;s<M.length;s++){var N=M[s],i=e.base?N[0]+e.base:N[0],c=j[i]||0,a="".concat(i," ").concat(c);j[i]=c+1;var g=t(a),I={css:N[1],media:N[2],sourceMap:N[3]};-1!==g?(D[g].references++,D[g].updater(I)):D.push({identifier:a,updater:z(I,e),references:1}),T.push(a)}return T}function i(M){var e=document.createElement("style"),T=M.attributes||{};if(void 0===T.nonce){var D=j.nc;D&&(T.nonce=D)}if(Object.keys(T).forEach((function(M){e.setAttribute(M,T[M])})),"function"==typeof M.insert)M.insert(e);else{var t=s(M.insert||"head");if(!t)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");t.appendChild(e)}return e}var c,a=(c=[],function(M,e){return c[M]=e,c.filter(Boolean).join("\n")});function g(M,e,j,T){var s=j?"":T.media?"@media ".concat(T.media," {").concat(T.css,"}"):T.css;if(M.styleSheet)M.styleSheet.cssText=a(e,s);else{var D=document.createTextNode(s),t=M.childNodes;t[e]&&M.removeChild(t[e]),t.length?M.insertBefore(D,t[e]):M.appendChild(D)}}function I(M,e,j){var T=j.css,s=j.media,D=j.sourceMap;if(s?M.setAttribute("media",s):M.removeAttribute("media"),D&&"undefined"!=typeof btoa&&(T+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(D))))," */")),M.styleSheet)M.styleSheet.cssText=T;else{for(;M.firstChild;)M.removeChild(M.firstChild);M.appendChild(document.createTextNode(T))}}var u=null,L=0;function z(M,e){var j,T,s;if(e.singleton){var D=L++;j=u||(u=i(e)),T=g.bind(null,j,D,!1),s=g.bind(null,j,D,!0)}else j=i(e),T=I.bind(null,j,e),s=function(){!function(M){if(null===M.parentNode)return!1;M.parentNode.removeChild(M)}(j)};return T(M),function(e){if(e){if(e.css===M.css&&e.media===M.media&&e.sourceMap===M.sourceMap)return;T(M=e)}else s()}}M.exports=function(M,e){(e=e||{}).singleton||"boolean"==typeof e.singleton||(e.singleton=(void 0===T&&(T=Boolean(window&&document&&document.all&&!window.atob)),T));var j=N(M=M||[],e);return function(M){if(M=M||[],"[object Array]"===Object.prototype.toString.call(M)){for(var T=0;T<j.length;T++){var s=t(j[T]);D[s].references--}for(var i=N(M,e),c=0;c<j.length;c++){var a=t(j[c]);0===D[a].references&&(D[a].updater(),D.splice(a,1))}j=i}}}},35:function(M,e,j){"use strict";M.exports=function(M){var e=[];return e.toString=function(){return this.map((function(e){var j=function(M,e){var j,T,s,D=M[1]||"",t=M[3];if(!t)return D;if(e&&"function"==typeof btoa){var N=(j=t,T=btoa(unescape(encodeURIComponent(JSON.stringify(j)))),s="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(T),"/*# ".concat(s," */")),i=t.sources.map((function(M){return"/*# sourceURL=".concat(t.sourceRoot||"").concat(M," */")}));return[D].concat(i).concat([N]).join("\n")}return[D].join("\n")}(e,M);return e[2]?"@media ".concat(e[2]," {").concat(j,"}"):j})).join("")},e.i=function(M,j,T){"string"==typeof M&&(M=[[null,M,""]]);var s={};if(T)for(var D=0;D<this.length;D++){var t=this[D][0];null!=t&&(s[t]=!0)}for(var N=0;N<M.length;N++){var i=[].concat(M[N]);T&&s[i[0]]||(j&&(i[2]?i[2]="".concat(j," and ").concat(i[2]):i[2]=j),e.push(i))}},e}},37:function(M,e,j){"use strict";M.exports=function(M,e){return e||(e={}),"string"!=typeof(M=M&&M.__esModule?M.default:M)?M:(/^['"].*['"]$/.test(M)&&(M=M.slice(1,-1)),e.hash&&(M+=e.hash),/["'() \t\n]/.test(M)||e.needQuotes?'"'.concat(M.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):M)}},40:function(M,e,j){M.exports=j.p+"1cbd62546f764080f7071e03889e9de3.svg"},52:function(M,e,j){switch(window.__kbnThemeTag__){case"v8dark":return j(53);case"v8light":return j(57)}},53:function(M,e,j){var T=j(34),s=j(54);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[M.i,s,""]]);T(s,{insert:"head",singleton:!1}),M.exports=s.locals||{}},54:function(M,e,j){var T=j(35),s=j(37),D=j(55),t=j(56);e=T(!1);var N=s(D),i=s(t);e.push([M.i,".spcSpaceSelector{animation:kibanaFullScreenGraphics_FadeIn .5s cubic-bezier(.694,.0482,.335,1) 0s forwards;background:inherit;background-color:#141519;bottom:0;left:0;opacity:0;overflow:auto;position:fixed;right:0;top:0;z-index:10000}.kbnBody--hasHeaderBanner .spcSpaceSelector{top:32px}.spcSpaceSelector:before{content:url("+N+");height:477px;left:0;position:fixed;top:0;width:310px;z-index:1}.spcSpaceSelector:after{bottom:0;content:url("+i+");height:461px;position:fixed;right:0;width:313px;z-index:1}@keyframes kibanaFullScreenGraphics_FadeIn{0%{opacity:0}to{opacity:1}}.spcSpaceSelector__pageContent{position:relative;z-index:10}.spcSpaceSelector__pageHeader:focus{outline:none;text-decoration:underline}.spcSpaceSelector__searchHolder{margin-inline:auto;max-width:100%;width:400px}.spcSpaceSelector__errorPanel{margin-inline:auto;max-width:700px;text-align:center}",""]),M.exports=e},55:function(M,e){M.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMTAiIGhlaWdodD0iNDc3IiB2aWV3Qm94PSIwIDAgMzEwIDQ3NyI+CiAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGZpbGw9IiMxODE5MUUiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTS04NC44MTkyLDQyOS4zNjIgQzc5LjMwOTMsNDI5LjM2MiAyMTIuMzYyLDI5Ni4zMDkgMjEyLjM2MiwxMzIuMTgxIEMyMTIuMzYyLC0zMS45NDc2IDc5LjMwOTMsLTE2NSAtODQuODE5MiwtMTY1IEMtMjQ4Ljk0OCwtMTY1IC0zODIsLTMxLjk0NzYgLTM4MiwxMzIuMTgxIEMtMzgyLDI5Ni4zMDkgLTI0OC45NDgsNDI5LjM2MiAtODQuODE5Miw0MjkuMzYyIFoiLz4KICAgIDxwYXRoIGZpbGw9IiMxNTE2MUIiIGQ9Ik0xOTEuNzY1LDIwOC42ODMgTDE5MS43NjUsMjIzLjM5NSBMMTc3LjA1MywyMjMuMzk1IEwxNzcuMDUzLDIwOC42ODMgTDE5MS43NjUsMjA4LjY4MyBaIE0yMzAuOTk3LDIwOC42ODMgTDIzMC45OTcsMjIzLjM5NSBMMjE2LjI4NSwyMjMuMzk1IEwyMTYuMjg1LDIwOC42ODMgTDIzMC45OTcsMjA4LjY4MyBaIE0xNTIuNTMzLDIwOC42ODMgTDE1Mi41MzMsMjIzLjM5NSBMMTM3LjgyMSwyMjMuMzk1IEwxMzcuODIxLDIwOC42ODMgTDE1Mi41MzMsMjA4LjY4MyBaIE0xMTMuMzAxLDIwOC42ODMgTDExMy4zMDEsMjIzLjM5NSBMOTguNTg5MywyMjMuMzk1IEw5OC41ODkzLDIwOC42ODMgTDExMy4zMDEsMjA4LjY4MyBaIE03NS4wNTA0LDIwOC42ODMgTDc1LjA1MDQsMjIzLjM5NSBMNjAuMzM4NSwyMjMuMzk1IEw2MC4zMzg1LDIwOC42ODMgTDc1LjA1MDQsMjA4LjY4MyBaIE0zNC44Mzc1LDIwOC42ODMgTDM0LjgzNzUsMjIzLjM5NSBMMjAuMTI1NiwyMjMuMzk1IEwyMC4xMjU2LDIwOC42ODMgTDM0LjgzNzUsMjA4LjY4MyBaIE0yMzAuOTk3LDE2OS40NTEgTDIzMC45OTcsMTg0LjE2MyBMMjE2LjI4NSwxODQuMTYzIEwyMTYuMjg1LDE2OS40NTEgTDIzMC45OTcsMTY5LjQ1MSBaIE0yNzAuMjI4LDE2OS40NTEgTDI3MC4yMjgsMTg0LjE2MyBMMjU1LjUxNiwxODQuMTYzIEwyNTUuNTE2LDE2OS40NTEgTDI3MC4yMjgsMTY5LjQ1MSBaIE0xOTEuNzY1LDE2OS40NTEgTDE5MS43NjUsMTg0LjE2MyBMMTc3LjA1MywxODQuMTYzIEwxNzcuMDUzLDE2OS40NTEgTDE5MS43NjUsMTY5LjQ1MSBaIE0xNTIuNTMzLDE2OS40NTEgTDE1Mi41MzMsMTg0LjE2MyBMMTM3LjgyMSwxODQuMTYzIEwxMzcuODIxLDE2OS40NTEgTDE1Mi41MzMsMTY5LjQ1MSBaIE0xMTQuMjgyLDE2OS40NTEgTDExNC4yODIsMTg0LjE2MyBMOTkuNTcwMSwxODQuMTYzIEw5OS41NzAxLDE2OS40NTEgTDExNC4yODIsMTY5LjQ1MSBaIE03NC4wNjk3LDE2OS40NTEgTDc0LjA2OTcsMTg0LjE2MyBMNTkuMzU3OCwxODQuMTYzIEw1OS4zNTc4LDE2OS40NTEgTDc0LjA2OTcsMTY5LjQ1MSBaIE0zMy44NTY4LDE2OS40NTEgTDMzLjg1NjgsMTg0LjE2MyBMMTkuMTQ0OSwxODQuMTYzIEwxOS4xNDQ5LDE2OS40NTEgTDMzLjg1NjgsMTY5LjQ1MSBaIE0yNzAuMjI4LDEzMC4yMTkgTDI3MC4yMjgsMTQ0LjkzMSBMMjU1LjUxNiwxNDQuOTMxIEwyNTUuNTE2LDEzMC4yMTkgTDI3MC4yMjgsMTMwLjIxOSBaIE0zMDkuNDYsMTMwLjIxOSBMMzA5LjQ2LDE0NC45MzEgTDI5NC43NDgsMTQ0LjkzMSBMMjk0Ljc0OCwxMzAuMjE5IEwzMDkuNDYsMTMwLjIxOSBaIE0yMzAuOTk3LDEzMC4yMTkgTDIzMC45OTcsMTQ0LjkzMSBMMjE2LjI4NSwxNDQuOTMxIEwyMTYuMjg1LDEzMC4yMTkgTDIzMC45OTcsMTMwLjIxOSBaIE0xOTEuNzY1LDEzMC4yMTkgTDE5MS43NjUsMTQ0LjkzMSBMMTc3LjA1MywxNDQuOTMxIEwxNzcuMDUzLDEzMC4yMTkgTDE5MS43NjUsMTMwLjIxOSBaIE0xNTMuNTE0LDEzMC4yMTkgTDE1My41MTQsMTQ0LjkzMSBMMTM4LjgwMiwxNDQuOTMxIEwxMzguODAyLDEzMC4yMTkgTDE1My41MTQsMTMwLjIxOSBaIE0xMTMuMzAxLDEzMC4yMTkgTDExMy4zMDEsMTQ0LjkzMSBMOTguNTg5MywxNDQuOTMxIEw5OC41ODkzLDEzMC4yMTkgTDExMy4zMDEsMTMwLjIxOSBaIE03My4wODg5LDEzMC4yMTkgTDczLjA4ODksMTQ0LjkzMSBMNTguMzc2OSwxNDQuOTMxIEw1OC4zNzY5LDEzMC4yMTkgTDczLjA4ODksMTMwLjIxOSBaIE0zNS44MTg0LDEzMC4yMTkgTDM1LjgxODQsMTQ0LjkzMSBMMjEuMTA2NCwxNDQuOTMxIEwyMS4xMDY0LDEzMC4yMTkgTDM1LjgxODQsMTMwLjIxOSBaIi8+CiAgICA8cGF0aCBmaWxsPSIjMTgxOTFFIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik02NS45MDgxLDQzMC45MDggQzc2LjQ1MjMsNDIwLjM2NCA5My41NDc3LDQyMC4zNjQgMTA0LjA5Miw0MzAuOTA4IEMxMTQuNjM2LDQ0MS40NTIgMTE0LjYzNiw0NTguNTQ4IDEwNC4wOTIsNDY5LjA5MiBDOTMuNTQ3Nyw0NzkuNjM2IDc2LjQ1MjMsNDc5LjYzNiA2NS45MDgxLDQ2OS4wOTIgQzU1LjM2NCw0NTguNTQ4IDU1LjM2NCw0NDEuNDUyIDY1LjkwODEsNDMwLjkwOCBaIE05Ni4zMTM3LDQzOC42ODYgQzkwLjA2NTMsNDMyLjQzOCA3OS45MzQ3LDQzMi40MzggNzMuNjg2Myw0MzguNjg2IEM2Ny40Mzc5LDQ0NC45MzUgNjcuNDM3OSw0NTUuMDY1IDczLjY4NjMsNDYxLjMxNCBDNzkuOTM0Nyw0NjcuNTYyIDkwLjA2NTMsNDY3LjU2MiA5Ni4zMTM3LDQ2MS4zMTQgQzEwMi41NjIsNDU1LjA2NSAxMDIuNTYyLDQ0NC45MzUgOTYuMzEzNyw0MzguNjg2IFoiLz4KICAgIDxwYXRoIGZpbGw9IiMxNTE2MUIiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTY1LjkwODIsNDMwLjkwOCBDNTUuMzY0LDQ0MS40NTIgNTUuMzY0LDQ1OC41NDggNjUuOTA4Miw0NjkuMDkyIEw3My42ODY0LDQ2MS4zMTQgQzY3LjQzOCw0NTUuMDY1IDY3LjQzOCw0NDQuOTM1IDczLjY4NjQsNDM4LjY4NiBMNjUuOTA4Miw0MzAuOTA4IFoiLz4KICA8L2c+Cjwvc3ZnPgo="},56:function(M,e){M.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMTMiIGhlaWdodD0iNDYxIiB2aWV3Qm94PSIwIDAgMzEzIDQ2MSI+CiAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGZpbGw9IiMxODE5MUUiIGQ9Ik0yOTQuMDA5LDE4NC4xMzcgQzQ1Ni4zODYsMTg0LjEzNyA1ODguMDE4LDMxNS43NyA1ODguMDE4LDQ3OC4xNDYgQzU4OC4wMTgsNjQwLjUyMyA0NTYuMzg2LDc3Mi4xNTYgMjk0LjAwOSw3NzIuMTU2IEMxMzEuNjMyLDc3Mi4xNTYgMCw2NDAuNTIzIDAsNDc4LjE0NiBDMCwzMTUuNzcgMTMxLjYzMiwxODQuMTM3IDI5NC4wMDksMTg0LjEzNyBaIE0yOTQuMDA5LDM4NC41NTIgQzI0Mi4zMTgsMzg0LjU1MiAyMDAuNDE1LDQyNi40NTYgMjAwLjQxNSw0NzguMTQ2IEMyMDAuNDE1LDUyOS44MzcgMjQyLjMxOCw1NzEuNzQxIDI5NC4wMDksNTcxLjc0MSBDMzQ1LjcsNTcxLjc0MSAzODcuNjA0LDUyOS44MzcgMzg3LjYwNCw0NzguMTQ2IEMzODcuNjA0LDQyNi40NTYgMzQ1LjcsMzg0LjU1MiAyOTQuMDA5LDM4NC41NTIgWiIvPgogICAgPHBhdGggZmlsbD0iIzE1MTYxQiIgZD0iTTIwMi45NTgsMzY1LjczMSBMMjAyLjk1OCwzODAuOTkxIEwxODcuNjk4LDM4MC45OTEgTDE4Ny42OTgsMzY1LjczMSBMMjAyLjk1OCwzNjUuNzMxIFogTTIwMi45NTgsMzI3LjA3MyBMMjAyLjk1OCwzNDIuMzMzIEwxODcuNjk4LDM0Mi4zMzMgTDE4Ny42OTgsMzI3LjA3MyBMMjAyLjk1OCwzMjcuMDczIFogTTI0My42NTEsMzI1LjAzOCBMMjQzLjY1MSwzNDAuMjk4IEwyMjguMzkxLDM0MC4yOTggTDIyOC4zOTEsMzI1LjAzOCBMMjQzLjY1MSwzMjUuMDM4IFogTTI0My42NTEsMjg2LjM3OSBMMjQzLjY1MSwzMDEuNjM5IEwyMjguMzkxLDMwMS42MzkgTDIyOC4zOTEsMjg2LjM3OSBMMjQzLjY1MSwyODYuMzc5IFogTTIwMi45NTgsMjg1LjM2MiBMMjAyLjk1OCwzMDAuNjIyIEwxODcuNjk4LDMwMC42MjIgTDE4Ny42OTgsMjg1LjM2MiBMMjAyLjk1OCwyODUuMzYyIFogTTI4NC4zNDUsMjg0LjM0NSBMMjg0LjM0NSwyOTkuNjA1IEwyNjkuMDg1LDI5OS42MDUgTDI2OS4wODUsMjg0LjM0NSBMMjg0LjM0NSwyODQuMzQ1IFogTTI4NC4zNDUsMjQ1LjY4NiBMMjg0LjM0NSwyNjAuOTQ2IEwyNjkuMDg1LDI2MC45NDYgTDI2OS4wODUsMjQ1LjY4NiBMMjg0LjM0NSwyNDUuNjg2IFogTTI0My42NTEsMjQ0LjY2OSBMMjQzLjY1MSwyNTkuOTI5IEwyMjguMzkxLDI1OS45MjkgTDIyOC4zOTEsMjQ0LjY2OSBMMjQzLjY1MSwyNDQuNjY5IFogTTIwMi45NTgsMjQzLjY1MSBMMjAyLjk1OCwyNTguOTExIEwxODcuNjk4LDI1OC45MTEgTDE4Ny42OTgsMjQzLjY1MSBMMjAyLjk1OCwyNDMuNjUxIFogTTI4NC4zNDUsMjAzLjk3NSBMMjg0LjM0NSwyMTkuMjM1IEwyNjkuMDg1LDIxOS4yMzUgTDI2OS4wODUsMjAzLjk3NSBMMjg0LjM0NSwyMDMuOTc1IFogTTIwMi45NTgsMjAzLjk3NSBMMjAyLjk1OCwyMTkuMjM1IEwxODcuNjk4LDIxOS4yMzUgTDE4Ny42OTgsMjAzLjk3NSBMMjAyLjk1OCwyMDMuOTc1IFogTTI0My42NTEsMjAyLjk1OCBMMjQzLjY1MSwyMTguMjE4IEwyMjguMzkxLDIxOC4yMTggTDIyOC4zOTEsMjAyLjk1OCBMMjQzLjY1MSwyMDIuOTU4IFogTTI0My42NTEsMTYzLjI4MiBMMjQzLjY1MSwxNzguNTQyIEwyMjguMzkxLDE3OC41NDIgTDIyOC4zOTEsMTYzLjI4MiBMMjQzLjY1MSwxNjMuMjgyIFogTTIwMi45NTgsMTYzLjI4MiBMMjAyLjk1OCwxNzguNTQyIEwxODcuNjk4LDE3OC41NDIgTDE4Ny42OTgsMTYzLjI4MiBMMjAyLjk1OCwxNjMuMjgyIFogTTI4NC4zNDUsMTYyLjI2NSBMMjg0LjM0NSwxNzcuNTI1IEwyNjkuMDg1LDE3Ny41MjUgTDI2OS4wODUsMTYyLjI2NSBMMjg0LjM0NSwxNjIuMjY1IFogTTI4NC4zNDUsMTIyLjU4OSBMMjg0LjM0NSwxMzcuODQ5IEwyNjkuMDg1LDEzNy44NDkgTDI2OS4wODUsMTIyLjU4OSBMMjg0LjM0NSwxMjIuNTg5IFogTTI0My42NTEsMTIyLjU4OSBMMjQzLjY1MSwxMzcuODQ5IEwyMjguMzkxLDEzNy44NDkgTDIyOC4zOTEsMTIyLjU4OSBMMjQzLjY1MSwxMjIuNTg5IFogTTIwMi45NTgsMTIyLjU4OSBMMjAyLjk1OCwxMzcuODQ5IEwxODcuNjk4LDEzNy44NDkgTDE4Ny42OTgsMTIyLjU4OSBMMjAyLjk1OCwxMjIuNTg5IFogTTI4NC4zNDUsODEuODk1NCBMMjg0LjM0NSw5Ny4xNTU0IEwyNjkuMDg1LDk3LjE1NTQgTDI2OS4wODUsODEuODk1NCBMMjg0LjM0NSw4MS44OTU0IFogTTI0My42NTEsODEuODk1NCBMMjQzLjY1MSw5Ny4xNTU0IEwyMjguMzkxLDk3LjE1NTQgTDIyOC4zOTEsODEuODk1NCBMMjQzLjY1MSw4MS44OTU0IFogTTIwMi45NTgsODEuODk1NCBMMjAyLjk1OCw5Ny4xNTU0IEwxODcuNjk4LDk3LjE1NTQgTDE4Ny42OTgsODEuODk1NCBMMjAyLjk1OCw4MS44OTU0IFogTTI4NC4zNDUsNDEuMjAyIEwyODQuMzQ1LDU2LjQ2MiBMMjY5LjA4NSw1Ni40NjIgTDI2OS4wODUsNDEuMjAyIEwyODQuMzQ1LDQxLjIwMiBaIE0yNDMuNjUxLDQxLjIwMiBMMjQzLjY1MSw1Ni40NjIgTDIyOC4zOTEsNTYuNDYyIEwyMjguMzkxLDQxLjIwMiBMMjQzLjY1MSw0MS4yMDIgWiBNMjg0LjM0NSwwLjUwODc4OSBMMjg0LjM0NSwxNS43Njg4IEwyNjkuMDg1LDE1Ljc2ODggTDI2OS4wODUsMC41MDg3ODkgTDI4NC4zNDUsMC41MDg3ODkgWiIvPgogIDwvZz4KPC9zdmc+Cg=="},57:function(M,e,j){var T=j(34),s=j(58);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[M.i,s,""]]);T(s,{insert:"head",singleton:!1}),M.exports=s.locals||{}},58:function(M,e,j){var T=j(35),s=j(37),D=j(59),t=j(60);e=T(!1);var N=s(D),i=s(t);e.push([M.i,".spcSpaceSelector{animation:kibanaFullScreenGraphics_FadeIn .5s cubic-bezier(.694,.0482,.335,1) 0s forwards;background:inherit;background-color:#fafbfd;bottom:0;left:0;opacity:0;overflow:auto;position:fixed;right:0;top:0;z-index:10000}.kbnBody--hasHeaderBanner .spcSpaceSelector{top:32px}.spcSpaceSelector:before{content:url("+N+");height:477px;left:0;position:fixed;top:0;width:310px;z-index:1}.spcSpaceSelector:after{bottom:0;content:url("+i+");height:461px;position:fixed;right:0;width:313px;z-index:1}@keyframes kibanaFullScreenGraphics_FadeIn{0%{opacity:0}to{opacity:1}}.spcSpaceSelector__pageContent{position:relative;z-index:10}.spcSpaceSelector__pageHeader:focus{outline:none;text-decoration:underline}.spcSpaceSelector__searchHolder{margin-inline:auto;max-width:100%;width:400px}.spcSpaceSelector__errorPanel{margin-inline:auto;max-width:700px;text-align:center}",""]),M.exports=e},59:function(M,e){M.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMTAiIGhlaWdodD0iNDc3IiB2aWV3Qm94PSIwIDAgMzEwIDQ3NyI+CiAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGZpbGw9IiNGNUY3RkEiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTS04NC44MTkyLDQyOS4zNjIgQzc5LjMwOTMsNDI5LjM2MiAyMTIuMzYyLDI5Ni4zMDkgMjEyLjM2MiwxMzIuMTgxIEMyMTIuMzYyLC0zMS45NDc2IDc5LjMwOTMsLTE2NSAtODQuODE5MiwtMTY1IEMtMjQ4Ljk0OCwtMTY1IC0zODIsLTMxLjk0NzYgLTM4MiwxMzIuMTgxIEMtMzgyLDI5Ni4zMDkgLTI0OC45NDgsNDI5LjM2MiAtODQuODE5Miw0MjkuMzYyIFoiLz4KICAgIDxwYXRoIGZpbGw9IiNFNkVCRjIiIGQ9Ik0xOTEuNzY1LDIwOC42ODMgTDE5MS43NjUsMjIzLjM5NSBMMTc3LjA1MywyMjMuMzk1IEwxNzcuMDUzLDIwOC42ODMgTDE5MS43NjUsMjA4LjY4MyBaIE0yMzAuOTk3LDIwOC42ODMgTDIzMC45OTcsMjIzLjM5NSBMMjE2LjI4NSwyMjMuMzk1IEwyMTYuMjg1LDIwOC42ODMgTDIzMC45OTcsMjA4LjY4MyBaIE0xNTIuNTMzLDIwOC42ODMgTDE1Mi41MzMsMjIzLjM5NSBMMTM3LjgyMSwyMjMuMzk1IEwxMzcuODIxLDIwOC42ODMgTDE1Mi41MzMsMjA4LjY4MyBaIE0xMTMuMzAxLDIwOC42ODMgTDExMy4zMDEsMjIzLjM5NSBMOTguNTg5MywyMjMuMzk1IEw5OC41ODkzLDIwOC42ODMgTDExMy4zMDEsMjA4LjY4MyBaIE03NS4wNTA0LDIwOC42ODMgTDc1LjA1MDQsMjIzLjM5NSBMNjAuMzM4NSwyMjMuMzk1IEw2MC4zMzg1LDIwOC42ODMgTDc1LjA1MDQsMjA4LjY4MyBaIE0zNC44Mzc1LDIwOC42ODMgTDM0LjgzNzUsMjIzLjM5NSBMMjAuMTI1NiwyMjMuMzk1IEwyMC4xMjU2LDIwOC42ODMgTDM0LjgzNzUsMjA4LjY4MyBaIE0yMzAuOTk3LDE2OS40NTEgTDIzMC45OTcsMTg0LjE2MyBMMjE2LjI4NSwxODQuMTYzIEwyMTYuMjg1LDE2OS40NTEgTDIzMC45OTcsMTY5LjQ1MSBaIE0yNzAuMjI4LDE2OS40NTEgTDI3MC4yMjgsMTg0LjE2MyBMMjU1LjUxNiwxODQuMTYzIEwyNTUuNTE2LDE2OS40NTEgTDI3MC4yMjgsMTY5LjQ1MSBaIE0xOTEuNzY1LDE2OS40NTEgTDE5MS43NjUsMTg0LjE2MyBMMTc3LjA1MywxODQuMTYzIEwxNzcuMDUzLDE2OS40NTEgTDE5MS43NjUsMTY5LjQ1MSBaIE0xNTIuNTMzLDE2OS40NTEgTDE1Mi41MzMsMTg0LjE2MyBMMTM3LjgyMSwxODQuMTYzIEwxMzcuODIxLDE2OS40NTEgTDE1Mi41MzMsMTY5LjQ1MSBaIE0xMTQuMjgyLDE2OS40NTEgTDExNC4yODIsMTg0LjE2MyBMOTkuNTcwMSwxODQuMTYzIEw5OS41NzAxLDE2OS40NTEgTDExNC4yODIsMTY5LjQ1MSBaIE03NC4wNjk3LDE2OS40NTEgTDc0LjA2OTcsMTg0LjE2MyBMNTkuMzU3OCwxODQuMTYzIEw1OS4zNTc4LDE2OS40NTEgTDc0LjA2OTcsMTY5LjQ1MSBaIE0zMy44NTY4LDE2OS40NTEgTDMzLjg1NjgsMTg0LjE2MyBMMTkuMTQ0OSwxODQuMTYzIEwxOS4xNDQ5LDE2OS40NTEgTDMzLjg1NjgsMTY5LjQ1MSBaIE0yNzAuMjI4LDEzMC4yMTkgTDI3MC4yMjgsMTQ0LjkzMSBMMjU1LjUxNiwxNDQuOTMxIEwyNTUuNTE2LDEzMC4yMTkgTDI3MC4yMjgsMTMwLjIxOSBaIE0zMDkuNDYsMTMwLjIxOSBMMzA5LjQ2LDE0NC45MzEgTDI5NC43NDgsMTQ0LjkzMSBMMjk0Ljc0OCwxMzAuMjE5IEwzMDkuNDYsMTMwLjIxOSBaIE0yMzAuOTk3LDEzMC4yMTkgTDIzMC45OTcsMTQ0LjkzMSBMMjE2LjI4NSwxNDQuOTMxIEwyMTYuMjg1LDEzMC4yMTkgTDIzMC45OTcsMTMwLjIxOSBaIE0xOTEuNzY1LDEzMC4yMTkgTDE5MS43NjUsMTQ0LjkzMSBMMTc3LjA1MywxNDQuOTMxIEwxNzcuMDUzLDEzMC4yMTkgTDE5MS43NjUsMTMwLjIxOSBaIE0xNTMuNTE0LDEzMC4yMTkgTDE1My41MTQsMTQ0LjkzMSBMMTM4LjgwMiwxNDQuOTMxIEwxMzguODAyLDEzMC4yMTkgTDE1My41MTQsMTMwLjIxOSBaIE0xMTMuMzAxLDEzMC4yMTkgTDExMy4zMDEsMTQ0LjkzMSBMOTguNTg5MywxNDQuOTMxIEw5OC41ODkzLDEzMC4yMTkgTDExMy4zMDEsMTMwLjIxOSBaIE03My4wODg5LDEzMC4yMTkgTDczLjA4ODksMTQ0LjkzMSBMNTguMzc2OSwxNDQuOTMxIEw1OC4zNzY5LDEzMC4yMTkgTDczLjA4ODksMTMwLjIxOSBaIE0zNS44MTg0LDEzMC4yMTkgTDM1LjgxODQsMTQ0LjkzMSBMMjEuMTA2NCwxNDQuOTMxIEwyMS4xMDY0LDEzMC4yMTkgTDM1LjgxODQsMTMwLjIxOSBaIi8+CiAgICA8cGF0aCBmaWxsPSIjRjVGN0ZBIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik02NS45MDgxLDQzMC45MDggQzc2LjQ1MjMsNDIwLjM2NCA5My41NDc3LDQyMC4zNjQgMTA0LjA5Miw0MzAuOTA4IEMxMTQuNjM2LDQ0MS40NTIgMTE0LjYzNiw0NTguNTQ4IDEwNC4wOTIsNDY5LjA5MiBDOTMuNTQ3Nyw0NzkuNjM2IDc2LjQ1MjMsNDc5LjYzNiA2NS45MDgxLDQ2OS4wOTIgQzU1LjM2NCw0NTguNTQ4IDU1LjM2NCw0NDEuNDUyIDY1LjkwODEsNDMwLjkwOCBaIE05Ni4zMTM3LDQzOC42ODYgQzkwLjA2NTMsNDMyLjQzOCA3OS45MzQ3LDQzMi40MzggNzMuNjg2Myw0MzguNjg2IEM2Ny40Mzc5LDQ0NC45MzUgNjcuNDM3OSw0NTUuMDY1IDczLjY4NjMsNDYxLjMxNCBDNzkuOTM0Nyw0NjcuNTYyIDkwLjA2NTMsNDY3LjU2MiA5Ni4zMTM3LDQ2MS4zMTQgQzEwMi41NjIsNDU1LjA2NSAxMDIuNTYyLDQ0NC45MzUgOTYuMzEzNyw0MzguNjg2IFoiLz4KICAgIDxwYXRoIGZpbGw9IiNFNkVCRjIiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTY1LjkwODIsNDMwLjkwOCBDNTUuMzY0LDQ0MS40NTIgNTUuMzY0LDQ1OC41NDggNjUuOTA4Miw0NjkuMDkyIEw3My42ODY0LDQ2MS4zMTQgQzY3LjQzOCw0NTUuMDY1IDY3LjQzOCw0NDQuOTM1IDczLjY4NjQsNDM4LjY4NiBMNjUuOTA4Miw0MzAuOTA4IFoiLz4KICA8L2c+Cjwvc3ZnPgo="},60:function(M,e){M.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMTMiIGhlaWdodD0iNDYxIiB2aWV3Qm94PSIwIDAgMzEzIDQ2MSI+CiAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGZpbGw9IiNGNUY3RkEiIGQ9Ik0yOTQuMDA5LDE4NC4xMzcgQzQ1Ni4zODYsMTg0LjEzNyA1ODguMDE4LDMxNS43NyA1ODguMDE4LDQ3OC4xNDYgQzU4OC4wMTgsNjQwLjUyMyA0NTYuMzg2LDc3Mi4xNTYgMjk0LjAwOSw3NzIuMTU2IEMxMzEuNjMyLDc3Mi4xNTYgMCw2NDAuNTIzIDAsNDc4LjE0NiBDMCwzMTUuNzcgMTMxLjYzMiwxODQuMTM3IDI5NC4wMDksMTg0LjEzNyBaIE0yOTQuMDA5LDM4NC41NTIgQzI0Mi4zMTgsMzg0LjU1MiAyMDAuNDE1LDQyNi40NTYgMjAwLjQxNSw0NzguMTQ2IEMyMDAuNDE1LDUyOS44MzcgMjQyLjMxOCw1NzEuNzQxIDI5NC4wMDksNTcxLjc0MSBDMzQ1LjcsNTcxLjc0MSAzODcuNjA0LDUyOS44MzcgMzg3LjYwNCw0NzguMTQ2IEMzODcuNjA0LDQyNi40NTYgMzQ1LjcsMzg0LjU1MiAyOTQuMDA5LDM4NC41NTIgWiIvPgogICAgPHBhdGggZmlsbD0iI0U2RUJGMiIgZD0iTTIwMi45NTgsMzY1LjczMSBMMjAyLjk1OCwzODAuOTkxIEwxODcuNjk4LDM4MC45OTEgTDE4Ny42OTgsMzY1LjczMSBMMjAyLjk1OCwzNjUuNzMxIFogTTIwMi45NTgsMzI3LjA3MyBMMjAyLjk1OCwzNDIuMzMzIEwxODcuNjk4LDM0Mi4zMzMgTDE4Ny42OTgsMzI3LjA3MyBMMjAyLjk1OCwzMjcuMDczIFogTTI0My42NTEsMzI1LjAzOCBMMjQzLjY1MSwzNDAuMjk4IEwyMjguMzkxLDM0MC4yOTggTDIyOC4zOTEsMzI1LjAzOCBMMjQzLjY1MSwzMjUuMDM4IFogTTI0My42NTEsMjg2LjM3OSBMMjQzLjY1MSwzMDEuNjM5IEwyMjguMzkxLDMwMS42MzkgTDIyOC4zOTEsMjg2LjM3OSBMMjQzLjY1MSwyODYuMzc5IFogTTIwMi45NTgsMjg1LjM2MiBMMjAyLjk1OCwzMDAuNjIyIEwxODcuNjk4LDMwMC42MjIgTDE4Ny42OTgsMjg1LjM2MiBMMjAyLjk1OCwyODUuMzYyIFogTTI4NC4zNDUsMjg0LjM0NSBMMjg0LjM0NSwyOTkuNjA1IEwyNjkuMDg1LDI5OS42MDUgTDI2OS4wODUsMjg0LjM0NSBMMjg0LjM0NSwyODQuMzQ1IFogTTI4NC4zNDUsMjQ1LjY4NiBMMjg0LjM0NSwyNjAuOTQ2IEwyNjkuMDg1LDI2MC45NDYgTDI2OS4wODUsMjQ1LjY4NiBMMjg0LjM0NSwyNDUuNjg2IFogTTI0My42NTEsMjQ0LjY2OSBMMjQzLjY1MSwyNTkuOTI5IEwyMjguMzkxLDI1OS45MjkgTDIyOC4zOTEsMjQ0LjY2OSBMMjQzLjY1MSwyNDQuNjY5IFogTTIwMi45NTgsMjQzLjY1MSBMMjAyLjk1OCwyNTguOTExIEwxODcuNjk4LDI1OC45MTEgTDE4Ny42OTgsMjQzLjY1MSBMMjAyLjk1OCwyNDMuNjUxIFogTTI4NC4zNDUsMjAzLjk3NSBMMjg0LjM0NSwyMTkuMjM1IEwyNjkuMDg1LDIxOS4yMzUgTDI2OS4wODUsMjAzLjk3NSBMMjg0LjM0NSwyMDMuOTc1IFogTTIwMi45NTgsMjAzLjk3NSBMMjAyLjk1OCwyMTkuMjM1IEwxODcuNjk4LDIxOS4yMzUgTDE4Ny42OTgsMjAzLjk3NSBMMjAyLjk1OCwyMDMuOTc1IFogTTI0My42NTEsMjAyLjk1OCBMMjQzLjY1MSwyMTguMjE4IEwyMjguMzkxLDIxOC4yMTggTDIyOC4zOTEsMjAyLjk1OCBMMjQzLjY1MSwyMDIuOTU4IFogTTI0My42NTEsMTYzLjI4MiBMMjQzLjY1MSwxNzguNTQyIEwyMjguMzkxLDE3OC41NDIgTDIyOC4zOTEsMTYzLjI4MiBMMjQzLjY1MSwxNjMuMjgyIFogTTIwMi45NTgsMTYzLjI4MiBMMjAyLjk1OCwxNzguNTQyIEwxODcuNjk4LDE3OC41NDIgTDE4Ny42OTgsMTYzLjI4MiBMMjAyLjk1OCwxNjMuMjgyIFogTTI4NC4zNDUsMTYyLjI2NSBMMjg0LjM0NSwxNzcuNTI1IEwyNjkuMDg1LDE3Ny41MjUgTDI2OS4wODUsMTYyLjI2NSBMMjg0LjM0NSwxNjIuMjY1IFogTTI4NC4zNDUsMTIyLjU4OSBMMjg0LjM0NSwxMzcuODQ5IEwyNjkuMDg1LDEzNy44NDkgTDI2OS4wODUsMTIyLjU4OSBMMjg0LjM0NSwxMjIuNTg5IFogTTI0My42NTEsMTIyLjU4OSBMMjQzLjY1MSwxMzcuODQ5IEwyMjguMzkxLDEzNy44NDkgTDIyOC4zOTEsMTIyLjU4OSBMMjQzLjY1MSwxMjIuNTg5IFogTTIwMi45NTgsMTIyLjU4OSBMMjAyLjk1OCwxMzcuODQ5IEwxODcuNjk4LDEzNy44NDkgTDE4Ny42OTgsMTIyLjU4OSBMMjAyLjk1OCwxMjIuNTg5IFogTTI4NC4zNDUsODEuODk1NCBMMjg0LjM0NSw5Ny4xNTU0IEwyNjkuMDg1LDk3LjE1NTQgTDI2OS4wODUsODEuODk1NCBMMjg0LjM0NSw4MS44OTU0IFogTTI0My42NTEsODEuODk1NCBMMjQzLjY1MSw5Ny4xNTU0IEwyMjguMzkxLDk3LjE1NTQgTDIyOC4zOTEsODEuODk1NCBMMjQzLjY1MSw4MS44OTU0IFogTTIwMi45NTgsODEuODk1NCBMMjAyLjk1OCw5Ny4xNTU0IEwxODcuNjk4LDk3LjE1NTQgTDE4Ny42OTgsODEuODk1NCBMMjAyLjk1OCw4MS44OTU0IFogTTI4NC4zNDUsNDEuMjAyIEwyODQuMzQ1LDU2LjQ2MiBMMjY5LjA4NSw1Ni40NjIgTDI2OS4wODUsNDEuMjAyIEwyODQuMzQ1LDQxLjIwMiBaIE0yNDMuNjUxLDQxLjIwMiBMMjQzLjY1MSw1Ni40NjIgTDIyOC4zOTEsNTYuNDYyIEwyMjguMzkxLDQxLjIwMiBMMjQzLjY1MSw0MS4yMDIgWiBNMjg0LjM0NSwwLjUwODc4OSBMMjg0LjM0NSwxNS43Njg4IEwyNjkuMDg1LDE1Ljc2ODggTDI2OS4wODUsMC41MDg3ODkgTDI4NC4zNDUsMC41MDg3ODkgWiIvPgogIDwvZz4KPC9zdmc+Cg=="},61:function(M,e,j){M.exports=j(17)(6)},62:function(M,e,j){switch(window.__kbnThemeTag__){case"v8dark":return j(63);case"v8light":return j(65)}},63:function(M,e,j){var T=j(34),s=j(64);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[M.i,s,""]]);T(s,{insert:"head",singleton:!1}),M.exports=s.locals||{}},64:function(M,e,j){var T=j(35),s=j(37),D=j(40);e=T(!1);var t=s(D);e.push([M.i,".kbnSolutionAvatar{box-shadow:0 .7px 1.4px rgba(0,0,0,.175),0 1.9px 4px rgba(0,0,0,.125),0 4.5px 10px rgba(0,0,0,.125)}.kbnSolutionAvatar--xxl{background:#1d1e24 url("+t+") no-repeat;background-size:cover,125%;border-radius:100px;box-shadow:0 .9px 4px -1px #0003,0 2.6px 8px -1px #00000026,0 5.7px 12px -1px rgba(0,0,0,.125),0 15px 15px -1px #0000001a;display:inline-block;height:100px;line-height:100px;text-align:center;width:100px}",""]),M.exports=e},65:function(M,e,j){var T=j(34),s=j(66);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[M.i,s,""]]);T(s,{insert:"head",singleton:!1}),M.exports=s.locals||{}},66:function(M,e,j){var T=j(35),s=j(37),D=j(40);e=T(!1);var t=s(D);e.push([M.i,".kbnSolutionAvatar{box-shadow:0 .7px 1.4px #00000012,0 1.9px 4px #0000000d,0 4.5px 10px #0000000d}.kbnSolutionAvatar--xxl{background:#fff url("+t+") no-repeat;background-size:cover,125%;border-radius:100px;box-shadow:0 .9px 4px -1px #00000014,0 2.6px 8px -1px #0000000f,0 5.7px 12px -1px #0000000d,0 15px 15px -1px #0000000a;display:inline-block;height:100px;line-height:100px;text-align:center;width:100px}",""]),M.exports=e},67:function(M,e,j){switch(window.__kbnThemeTag__){case"v8dark":return j(68);case"v8light":return j(70)}},68:function(M,e,j){var T=j(34),s=j(69);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[M.i,s,""]]);T(s,{insert:"head",singleton:!1}),M.exports=s.locals||{}},69:function(M,e,j){(e=j(35)(!1)).push([M.i,".spaceCards{margin:auto;max-width:1200px}",""]),M.exports=e},70:function(M,e,j){var T=j(34),s=j(71);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[M.i,s,""]]);T(s,{insert:"head",singleton:!1}),M.exports=s.locals||{}},71:function(M,e,j){(e=j(35)(!1)).push([M.i,".spaceCards{margin:auto;max-width:1200px}",""]),M.exports=e},72:function(M,e,j){switch(window.__kbnThemeTag__){case"v8dark":return j(73);case"v8light":return j(75)}},73:function(M,e,j){var T=j(34),s=j(74);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[M.i,s,""]]);T(s,{insert:"head",singleton:!1}),M.exports=s.locals||{}},74:function(M,e,j){(e=j(35)(!1)).push([M.i,".spaceCard{min-height:200px;width:240px!important}.spaceCard .euiCard__content{overflow:hidden}",""]),M.exports=e},75:function(M,e,j){var T=j(34),s=j(76);"string"==typeof(s=s.__esModule?s.default:s)&&(s=[[M.i,s,""]]);T(s,{insert:"head",singleton:!1}),M.exports=s.locals||{}},76:function(M,e,j){(e=j(35)(!1)).push([M.i,".spaceCard{min-height:200px;width:240px!important}.spaceCard .euiCard__content{overflow:hidden}",""]),M.exports=e}}]);