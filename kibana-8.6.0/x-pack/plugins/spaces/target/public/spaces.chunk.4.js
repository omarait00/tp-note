/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.spaces_bundle_jsonpfunction=window.spaces_bundle_jsonpfunction||[]).push([[4],{126:function(e,t,a){"use strict";a.r(t),a.d(t,"NavControlPopover",(function(){return nav_control_popover_NavControlPopover}));var s=a(4),n=a.n(s),i=a(2),o=a(1),c=a.n(o),r=a(3),p=a(5),l=(a(42),a(12)),u=a(11),d=a(0);class manage_spaces_button_ManageSpacesButton extends o.Component{constructor(...e){super(...e),n()(this,"navigateToManageSpaces",(()=>{this.props.onClick&&this.props.onClick(),this.props.navigateToApp("management",{path:"kibana/spaces"})}))}render(){return this.props.capabilities.spaces.manage?Object(d.jsx)(i.EuiButton,{size:this.props.size||"s",className:this.props.className,isDisabled:this.props.isDisabled,onClick:this.navigateToManageSpaces,style:this.props.style,"data-test-subj":"manageSpaces"},Object(d.jsx)(u.FormattedMessage,{id:"xpack.spaces.manageSpacesButton.manageSpacesButtonLabel",defaultMessage:"Manage spaces"})):null}}const h=e=>{const t={id:e.id,className:"spcDescription",title:"Spaces"},a=r.i18n.translate("xpack.spaces.navControl.loadingMessage",{defaultMessage:"Loading..."});return Object(d.jsx)(i.EuiContextMenuPanel,t,Object(d.jsx)(i.EuiText,{className:"spcDescription__text"},Object(d.jsx)("p",null,e.isLoading?a:Object(l.b)())),Object(d.jsx)("div",{key:"manageSpacesButton",className:"spcDescription__manageButtonWrapper"},Object(d.jsx)(manage_spaces_button_ManageSpacesButton,{size:"s",style:{width:"100%"},onClick:e.toggleSpaceSelector,capabilities:e.capabilities,navigateToApp:e.navigateToApp})))};var g=a(8),b=a.n(g),f=(a(47),a(15));const v=Object(o.lazy)((()=>Object(p.a)().then((e=>({default:e})))));class spaces_menu_SpacesMenuUI extends o.Component{constructor(...e){super(...e),n()(this,"getSpaceOptions",(()=>this.props.spaces.map((e=>{var t;return{"aria-label":e.name,"aria-roledescription":"space",label:e.name,key:e.id,prepend:Object(d.jsx)(o.Suspense,{fallback:Object(d.jsx)(i.EuiLoadingSpinner,{size:"m"})},Object(d.jsx)(v,{space:e,size:"s",announceSpaceName:!1})),checked:(null===(t=this.props.activeSpace)||void 0===t?void 0:t.id)===e.id?"on":void 0,"data-test-subj":`${e.id}-selectableSpaceItem`,className:"selectableSpaceItem"}})))),n()(this,"spaceSelectionChange",((e,t)=>{const a=e.filter((e=>"on"===e.checked))[0];if(a){const e=Object(f.addSpaceIdToPath)(this.props.serverBasePath,a.key,f.ENTER_SPACE_PATH);let n=!1;if("click"===t.type&&(n=1===t.button),t.shiftKey)this.props.toggleSpaceSelector(),window.open(e);else if(t.ctrlKey||t.metaKey||n)window.open(e,"_blank");else{var s;(null===(s=this.props.activeSpace)||void 0===s?void 0:s.id)===a.key?this.props.toggleSpaceSelector():this.props.navigateToUrl(e)}}})),n()(this,"renderManageButton",(()=>Object(d.jsx)(manage_spaces_button_ManageSpacesButton,{key:"manageSpacesButton",className:"spcMenu__manageButton",size:"s",onClick:this.props.toggleSpaceSelector,capabilities:this.props.capabilities,navigateToApp:this.props.navigateToApp})))}render(){const e=this.getSpaceOptions(),t=Object(d.jsx)(i.EuiText,{color:"subdued",className:"eui-textCenter"},Object(d.jsx)(u.FormattedMessage,{id:"xpack.spaces.navControl.spacesMenu.noSpacesFoundTitle",defaultMessage:" no spaces found "})),a=this.props.spaces.length>=f.SPACE_SEARCH_COUNT_THRESHOLD?{searchable:!0,searchProps:{placeholder:r.i18n.translate("xpack.spaces.navControl.spacesMenu.findSpacePlaceholder",{defaultMessage:"Find a space"}),compressed:!0,isClearable:!0,id:"headerSpacesMenuListSearch"}}:{searchable:!1};return Object(d.jsx)(c.a.Fragment,null,Object(d.jsx)(i.EuiSelectable,b()({id:this.props.id,className:"spcMenu",title:r.i18n.translate("xpack.spaces.navControl.spacesMenu.changeCurrentSpaceTitle",{defaultMessage:"Change current space"})},a,{noMatchesMessage:t,options:e,singleSelection:"always",style:{width:300},onChange:this.spaceSelectionChange,listProps:{rowHeight:40,showIcons:!0,onFocusBadge:!1}}),((e,t)=>Object(d.jsx)(c.a.Fragment,null,Object(d.jsx)(i.EuiPopoverTitle,{paddingSize:"s"},t||r.i18n.translate("xpack.spaces.navControl.spacesMenu.selectSpacesTitle",{defaultMessage:"Your spaces"})),e))),Object(d.jsx)(i.EuiPopoverFooter,{paddingSize:"s"},this.renderManageButton()))}}const S=Object(u.injectI18n)(spaces_menu_SpacesMenuUI),m=Object(o.lazy)((()=>Object(p.a)().then((e=>({default:e}))))),x="headerSpacesMenuContent";class nav_control_popover_NavControlPopover extends o.Component{constructor(e){super(e),n()(this,"activeSpace$",void 0),n()(this,"getActiveSpaceButton",(()=>{const{activeSpace:e}=this.state;return e?this.getButton(Object(d.jsx)(o.Suspense,{fallback:Object(d.jsx)(i.EuiLoadingSpinner,{size:"m"})},Object(d.jsx)(m,{space:e,size:"s"})),e.name):this.getButton(Object(d.jsx)(i.EuiLoadingSpinner,{size:"m"}),"loading spaces navigation")})),n()(this,"getButton",((e,t)=>Object(d.jsx)(i.EuiHeaderSectionItemButton,{"aria-controls":x,"aria-expanded":this.state.showSpaceSelector,"aria-haspopup":"true","aria-label":r.i18n.translate("xpack.spaces.navControl.popover.spacesNavigationLabel",{defaultMessage:"Spaces navigation"}),"aria-describedby":"spacesNavDetails","data-test-subj":"spacesNavSelector",title:t,onClick:this.toggleSpaceSelector},e,Object(d.jsx)("p",{id:"spacesNavDetails",hidden:!0},r.i18n.translate("xpack.spaces.navControl.popover.spaceNavigationDetails",{defaultMessage:"{space} is the currently selected space. Click this button to open a popover that allows you to select the active space.",values:{space:t}}))))),n()(this,"toggleSpaceSelector",(()=>{!this.state.showSpaceSelector&&this.loadSpaces(),this.setState({showSpaceSelector:!this.state.showSpaceSelector})})),n()(this,"closeSpaceSelector",(()=>{this.setState({showSpaceSelector:!1})})),this.state={showSpaceSelector:!1,loading:!1,activeSpace:null,spaces:[]}}componentDidMount(){this.activeSpace$=this.props.spacesManager.onActiveSpaceChange$.subscribe({next:e=>{this.setState({activeSpace:e})}})}componentWillUnmount(){this.activeSpace$&&this.activeSpace$.unsubscribe()}render(){const e=this.getActiveSpaceButton();let t;return t=this.state.loading||this.state.spaces.length<2?Object(d.jsx)(h,{id:x,isLoading:this.state.loading,toggleSpaceSelector:this.toggleSpaceSelector,capabilities:this.props.capabilities,navigateToApp:this.props.navigateToApp}):Object(d.jsx)(S,{id:x,spaces:this.state.spaces,serverBasePath:this.props.serverBasePath,toggleSpaceSelector:this.toggleSpaceSelector,capabilities:this.props.capabilities,navigateToApp:this.props.navigateToApp,navigateToUrl:this.props.navigateToUrl,activeSpace:this.state.activeSpace}),Object(d.jsx)(i.EuiPopover,{id:"spcMenuPopover",button:e,isOpen:this.state.showSpaceSelector,closePopover:this.closeSpaceSelector,anchorPosition:this.props.anchorPosition,panelPaddingSize:"none",repositionOnScroll:!0,ownFocus:!0},t)}async loadSpaces(){const{spacesManager:e}=this.props;if(this.state.loading)return;this.setState({loading:!0});const t=await e.getSpaces();this.setState({spaces:t,loading:!1})}}},34:function(e,t,a){"use strict";var s,n=function(){var e={};return function(t){if(void 0===e[t]){var a=document.querySelector(t);if(window.HTMLIFrameElement&&a instanceof window.HTMLIFrameElement)try{a=a.contentDocument.head}catch(e){a=null}e[t]=a}return e[t]}}(),i=[];function o(e){for(var t=-1,a=0;a<i.length;a++)if(i[a].identifier===e){t=a;break}return t}function c(e,t){for(var a={},s=[],n=0;n<e.length;n++){var c=e[n],r=t.base?c[0]+t.base:c[0],p=a[r]||0,l="".concat(r," ").concat(p);a[r]=p+1;var u=o(l),d={css:c[1],media:c[2],sourceMap:c[3]};-1!==u?(i[u].references++,i[u].updater(d)):i.push({identifier:l,updater:b(d,t),references:1}),s.push(l)}return s}function r(e){var t=document.createElement("style"),s=e.attributes||{};if(void 0===s.nonce){var i=a.nc;i&&(s.nonce=i)}if(Object.keys(s).forEach((function(e){t.setAttribute(e,s[e])})),"function"==typeof e.insert)e.insert(t);else{var o=n(e.insert||"head");if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(t)}return t}var p,l=(p=[],function(e,t){return p[e]=t,p.filter(Boolean).join("\n")});function u(e,t,a,s){var n=a?"":s.media?"@media ".concat(s.media," {").concat(s.css,"}"):s.css;if(e.styleSheet)e.styleSheet.cssText=l(t,n);else{var i=document.createTextNode(n),o=e.childNodes;o[t]&&e.removeChild(o[t]),o.length?e.insertBefore(i,o[t]):e.appendChild(i)}}function d(e,t,a){var s=a.css,n=a.media,i=a.sourceMap;if(n?e.setAttribute("media",n):e.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(s+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),e.styleSheet)e.styleSheet.cssText=s;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(s))}}var h=null,g=0;function b(e,t){var a,s,n;if(t.singleton){var i=g++;a=h||(h=r(t)),s=u.bind(null,a,i,!1),n=u.bind(null,a,i,!0)}else a=r(t),s=d.bind(null,a,t),n=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(a)};return s(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;s(e=t)}else n()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===s&&(s=Boolean(window&&document&&document.all&&!window.atob)),s));var a=c(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var s=0;s<a.length;s++){var n=o(a[s]);i[n].references--}for(var r=c(e,t),p=0;p<a.length;p++){var l=o(a[p]);0===i[l].references&&(i[l].updater(),i.splice(l,1))}a=r}}}},35:function(e,t,a){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var a=function(e,t){var a,s,n,i=e[1]||"",o=e[3];if(!o)return i;if(t&&"function"==typeof btoa){var c=(a=o,s=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),n="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s),"/*# ".concat(n," */")),r=o.sources.map((function(e){return"/*# sourceURL=".concat(o.sourceRoot||"").concat(e," */")}));return[i].concat(r).concat([c]).join("\n")}return[i].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(a,"}"):a})).join("")},t.i=function(e,a,s){"string"==typeof e&&(e=[[null,e,""]]);var n={};if(s)for(var i=0;i<this.length;i++){var o=this[i][0];null!=o&&(n[o]=!0)}for(var c=0;c<e.length;c++){var r=[].concat(e[c]);s&&n[r[0]]||(a&&(r[2]?r[2]="".concat(a," and ").concat(r[2]):r[2]=a),t.push(r))}},t}},42:function(e,t,a){switch(window.__kbnThemeTag__){case"v8dark":return a(43);case"v8light":return a(45)}},43:function(e,t,a){var s=a(34),n=a(44);"string"==typeof(n=n.__esModule?n.default:n)&&(n=[[e.i,n,""]]);s(n,{insert:"head",singleton:!1}),e.exports=n.locals||{}},44:function(e,t,a){(t=a(35)(!1)).push([e.i,".spcDescription{max-width:240px}.spcDescription__manageButtonWrapper,.spcDescription__text{padding:12px}",""]),e.exports=t},45:function(e,t,a){var s=a(34),n=a(46);"string"==typeof(n=n.__esModule?n.default:n)&&(n=[[e.i,n,""]]);s(n,{insert:"head",singleton:!1}),e.exports=n.locals||{}},46:function(e,t,a){(t=a(35)(!1)).push([e.i,".spcDescription{max-width:240px}.spcDescription__manageButtonWrapper,.spcDescription__text{padding:12px}",""]),e.exports=t},47:function(e,t,a){switch(window.__kbnThemeTag__){case"v8dark":return a(48);case"v8light":return a(50)}},48:function(e,t,a){var s=a(34),n=a(49);"string"==typeof(n=n.__esModule?n.default:n)&&(n=[[e.i,n,""]]);s(n,{insert:"head",singleton:!1}),e.exports=n.locals||{}},49:function(e,t,a){(t=a(35)(!1)).push([e.i,'.spcMenu{max-width:240px}.spcMenu__spacesList{height:100%;-webkit-mask-image:linear-gradient(180deg,#ff00001a 0,red 7.5px,red calc(100% - 7.5px),#ff00001a);mask-image:linear-gradient(180deg,#ff00001a 0,red 7.5px,red calc(100% - 7.5px),#ff00001a);max-height:320px;overflow-x:hidden;overflow-y:auto;scrollbar-color:#98a2b380 #0000;scrollbar-width:thin}.spcMenu__spacesList::-webkit-scrollbar{height:16px;width:16px}.spcMenu__spacesList::-webkit-scrollbar-thumb{background-clip:content-box;background-color:#98a2b380;border:6px solid #0000;border-radius:16px}.spcMenu__spacesList::-webkit-scrollbar-corner,.spcMenu__spacesList::-webkit-scrollbar-track{background-color:#0000}.spcMenu__spacesList:focus{outline:none}.spcMenu__spacesList[tabindex="0"]:focus:focus-visible{outline-style:auto}.spcMenu__searchFieldWrapper{padding:12px}.spcMenu__manageButton{margin:12px;width:calc(100% - 24px)}.spcMenu__item{margin-left:12px}',""]),e.exports=t},50:function(e,t,a){var s=a(34),n=a(51);"string"==typeof(n=n.__esModule?n.default:n)&&(n=[[e.i,n,""]]);s(n,{insert:"head",singleton:!1}),e.exports=n.locals||{}},51:function(e,t,a){(t=a(35)(!1)).push([e.i,'.spcMenu{max-width:240px}.spcMenu__spacesList{height:100%;-webkit-mask-image:linear-gradient(180deg,#ff00001a 0,red 7.5px,red calc(100% - 7.5px),#ff00001a);mask-image:linear-gradient(180deg,#ff00001a 0,red 7.5px,red calc(100% - 7.5px),#ff00001a);max-height:320px;overflow-x:hidden;overflow-y:auto;scrollbar-color:#69707d80 #0000;scrollbar-width:thin}.spcMenu__spacesList::-webkit-scrollbar{height:16px;width:16px}.spcMenu__spacesList::-webkit-scrollbar-thumb{background-clip:content-box;background-color:#69707d80;border:6px solid #0000;border-radius:16px}.spcMenu__spacesList::-webkit-scrollbar-corner,.spcMenu__spacesList::-webkit-scrollbar-track{background-color:#0000}.spcMenu__spacesList:focus{outline:none}.spcMenu__spacesList[tabindex="0"]:focus:focus-visible{outline-style:auto}.spcMenu__searchFieldWrapper{padding:12px}.spcMenu__manageButton{margin:12px;width:calc(100% - 24px)}.spcMenu__item{margin-left:12px}',""]),e.exports=t}}]);