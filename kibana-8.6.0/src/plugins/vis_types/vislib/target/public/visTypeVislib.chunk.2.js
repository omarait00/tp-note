(window.visTypeVislib_bundle_jsonpfunction=window.visTypeVislib_bundle_jsonpfunction||[]).push([[2],{120:function(e,i,t){"use strict";t.r(i),t.d(i,"default",(function(){return O}));var s=t(15),l=t.n(s),r=t(29),n=t(2),o=t.n(n),a=t(35),p=t(44),d=t.n(p),c=t(28),h=t.n(c),v=t(16),g=t(36),b=t.n(g),u=t(3),f=t(37),x=t(0);const m=["heatmap","gauge"];var _=t(30),w=t(7);const y=({item:e,selected:i,canFilter:t,anchorPosition:n,onFilter:o,onSelect:a,onHighlight:p,onUnhighlight:d,setColor:c,getColor:h})=>{const[v,g]=Object(s.useState)({}),b=[{id:"filterIn",label:u.i18n.translate("visTypeVislib.vislib.legend.filterForValueButtonAriaLabel",{defaultMessage:"Filter for value {legendDataLabel}",values:{legendDataLabel:e.label}}),iconType:"plusInCircle","data-test-subj":`legend-${e.label}-filterIn`},{id:"filterOut",label:u.i18n.translate("visTypeVislib.vislib.legend.filterOutValueButtonAriaLabel",{defaultMessage:"Filter out value {legendDataLabel}",values:{legendDataLabel:e.label}}),iconType:"minusInCircle","data-test-subj":`legend-${e.label}-filterOut`}],f=Object(w.jsx)(r.EuiButtonEmpty,{size:"xs",color:"text",flush:"left",className:"visLegend__button",onKeyDown:e=>{e.key===r.keys.ESCAPE&&(e.preventDefault(),e.stopPropagation(),a(null)())},onMouseEnter:p,onFocus:p,onClick:a(e.label),onMouseLeave:d,onBlur:d,"data-label":e.label,title:e.label,"aria-label":u.i18n.translate("visTypeVislib.vislib.legend.toggleOptionsButtonAriaLabel",{defaultMessage:"{legendDataLabel}, toggle options",values:{legendDataLabel:e.label}}),"data-test-subj":`legend-${e.label}`},Object(w.jsx)(r.EuiIcon,{size:"l",type:"dot",color:h(e.label),"data-test-subj":`legendSelectedColor-${h(e.label)}`}),Object(w.jsx)("span",{className:"visLegend__valueTitle"},e.label));return Object(w.jsx)("li",{key:e.label,className:"visLegend__value"},Object(w.jsx)(r.EuiPopover,{display:"block",button:f,isOpen:i,anchorPosition:n,closePopover:a(null),panelPaddingSize:"s"},t&&Object(w.jsx)(l.a.Fragment,null,Object(w.jsx)(r.EuiButtonGroup,{type:"multi",isIconOnly:!0,isFullWidth:!0,legend:u.i18n.translate("visTypeVislib.vislib.legend.filterOptionsLegend",{defaultMessage:"{legendDataLabel}, filter options",values:{legendDataLabel:e.label}}),options:b,onChange:i=>{g({filterIn:"filterIn"===i,filterOut:"filterOut"===i}),o(e,"filterIn"!==i)},"data-test-subj":`legend-${e.label}-filters`,idToSelectedMap:v}),Object(w.jsx)(r.EuiSpacer,{size:"s"})),Object(w.jsx)(_.ColorPicker,{label:e.label,color:h(e.label),onChange:(i,t)=>c(e.label,i,t)})))},L=Object(s.memo)(y);function W(e){const i=[];return o.a.forEach(e,(function(e){const t=e.raw?e.raw.columns:void 0;o.a.forEach(function(e,i){const t=e.slices;if(t.children){const e=k(t.children,0,i);return o()(e).sortBy((function(e){return e.index})).uniqBy((function(e){return e.label})).value()}return[]}(e,t),(function(e){i.push(e)}))})),o.a.uniqBy(i,"label")}function k(e,i,t){const s=[];return o.a.forEach(e,(function(e){if(s.push({label:e.name,values:[e.rawData],index:i}),e.children){const l=i+1;o.a.forEach(k(e.children,l,t),(function(e){s.push(e)}))}})),s}class legend_VisLegend extends s.PureComponent{constructor(e){var i,t;super(e),d()(this,"legendId",Object(r.htmlIdGenerator)()("legend")),d()(this,"getColor",(()=>"")),d()(this,"toggleLegend",(()=>{const e=!this.state.open;this.setState({open:e},(()=>{var i;null===(i=this.props.uiState)||void 0===i||i.set("vis.legendOpen",e)}))})),d()(this,"setColor",((e,i,t)=>{t.key&&t.key!==r.keys.ENTER||this.setState({selectedLabel:null},(()=>{var t,s,l,r;const n=(null===(t=this.props.uiState)||void 0===t?void 0:t.get("vis.colors"))||{};n[e]!==i&&i?n[e]=i:delete n[e],null===(s=this.props.uiState)||void 0===s||s.setSilent("vis.colors",null),null===(l=this.props.uiState)||void 0===l||l.set("vis.colors",n),null===(r=this.props.uiState)||void 0===r||r.emit("colorChanged"),this.refresh()}))})),d()(this,"filter",(({values:e},i)=>{this.props.fireEvent({name:"filter",data:{data:e,negate:i}})})),d()(this,"canFilter",(async e=>{if(m.includes(this.props.vislibVis.visConfigArgs.type))return!1;if(e.values&&Object(n.every)(e.values,n.isUndefined))return!1;const i=await Object(x.a)().createFiltersFromValueClickAction({data:e.values});return Boolean(i.length)})),d()(this,"toggleDetails",(e=>i=>{i&&i.key&&i.key!==r.keys.ENTER||this.setState({selectedLabel:this.state.selectedLabel===e?null:e})})),d()(this,"getSeriesLabels",(e=>{const i=e.map((e=>e.series)).reduce(((e,i)=>e.concat(i)),[]);return Object(n.compact)(Object(n.uniqBy)(i,"label")).map((e=>({...e,values:[e.values[0].seriesRaw]})))})),d()(this,"setFilterableLabels",(e=>new Promise((async(i,t)=>{try{const t=new Set;await Object(f.asyncForEach)(e,(async e=>{await this.canFilter(e)&&t.add(e.label)})),this.setState({filterableLabels:t},i)}catch(e){t(e)}})))),d()(this,"setLabels",((e,i)=>{let t=[];if(m.includes(i)){const e=this.props.vislibVis.getLegendLabels();e&&(t=Object(n.map)(e,(e=>({label:e}))))}else{if(!e)return[];e=e.columns||e.rows||[e],t="pie"===i?W(e):this.getSeriesLabels(e)}this.setFilterableLabels(t),this.setState({labels:t})})),d()(this,"refresh",(()=>{var e;const i=this.props.vislibVis;i&&i.visConfig?(null==(null===(e=this.props.uiState)||void 0===e?void 0:e.get("vis.legendOpen"))&&null!=this.props.addLegend&&this.setState({open:this.props.addLegend}),i.visConfig&&(this.getColor=this.props.vislibVis.visConfig.data.getColorFunc()),this.setLabels(this.props.visData,i.visConfigArgs.type)):this.setState({labels:[{label:u.i18n.translate("visTypeVislib.vislib.legend.loadingLabel",{defaultMessage:"loading…"})}]})})),d()(this,"highlight",(e=>{const i=e.currentTarget,t=this.props.vislibVis&&this.props.vislibVis.handler;t&&"function"==typeof t.highlight&&t.highlight.call(i,t.el)})),d()(this,"unhighlight",(e=>{const i=e.currentTarget,t=this.props.vislibVis&&this.props.vislibVis.handler;t&&"function"==typeof t.unHighlight&&t.unHighlight.call(i,t.el)})),d()(this,"getAnchorPosition",(()=>{const{position:e}=this.props;switch(e){case"bottom":return"upCenter";case"left":return"rightUp";case"right":return"leftUp";default:return"downCenter"}})),d()(this,"renderLegend",(e=>Object(w.jsx)("ul",{className:"visLegend__list",id:this.legendId},this.state.labels.map((i=>Object(w.jsx)(L,{item:i,key:i.label,anchorPosition:e,selected:this.state.selectedLabel===i.label,canFilter:this.state.filterableLabels.has(i.label),onFilter:this.filter,onSelect:this.toggleDetails,setColor:this.setColor,getColor:this.getColor,onHighlight:this.highlight,onUnhighlight:this.unhighlight}))))));const s=null===(i=e.addLegend)||void 0===i||i,l=null===(t=e.uiState)||void 0===t?void 0:t.get("vis.legendOpen",s);this.state={open:l,labels:[],filterableLabels:new Set,selectedLabel:null}}componentDidMount(){this.refresh()}render(){const{open:e}=this.state,i=this.getAnchorPosition();return Object(w.jsx)("div",{className:"visLegend"},Object(w.jsx)("button",{type:"button",onClick:this.toggleLegend,className:b()("visLegend__toggle kbn-resetFocusState",{"visLegend__toggle--isOpen":e}),"aria-label":u.i18n.translate("visTypeVislib.vislib.legend.toggleLegendButtonAriaLabel",{defaultMessage:"Toggle legend"}),"aria-expanded":Boolean(e),"aria-controls":this.legendId,"data-test-subj":"vislibToggleLegend",title:u.i18n.translate("visTypeVislib.vislib.legend.toggleLegendButtonTitle",{defaultMessage:"Toggle legend"})},Object(w.jsx)(r.EuiIcon,{color:"text",type:"list"})),e&&this.renderLegend(i))}}var T=t(17);const C={top:"vislib--legend-top",bottom:"vislib--legend-bottom",left:"vislib--legend-left",right:"vislib--legend-right"},j=(e,i)=>class VislibVisController{constructor(e){d()(this,"removeListeners",void 0),d()(this,"unmountLegend",void 0),d()(this,"legendRef",void 0),d()(this,"container",void 0),d()(this,"chartEl",void 0),d()(this,"legendEl",void 0),d()(this,"vislibVis",void 0),this.el=e,this.el=e,this.legendRef=l.a.createRef(),this.container=document.createElement("div"),this.container.className="vislib",this.el.appendChild(this.container),this.chartEl=document.createElement("div"),this.chartEl.className="vislib__chart",this.container.appendChild(this.chartEl),this.legendEl=document.createElement("div"),this.legendEl.className="vislib__legend",this.container.appendChild(this.legendEl)}async render(s,l,r,n){if(this.vislibVis&&this.destroy(!1),this.chartEl.dataset.vislibChartType=l.type,0===this.el.clientWidth||0===this.el.clientHeight)return void(null==n||n());const{Vis:o}=await t.e(1).then(t.bind(null,119)),{uiState:a,event:p}=r;this.vislibVis=new o(this.chartEl,l,e,i),this.vislibVis.on("brush",p),this.vislibVis.on("click",p),this.vislibVis.on("renderComplete",(()=>{var e;this.showLegend(l)&&m.includes(this.vislibVis.visConfigArgs.type)&&(null===(e=this.unmountLegend)||void 0===e||e.call(this),this.mountLegend(s,l,p,a)),null==n||n()})),this.removeListeners=()=>{this.vislibVis.off("brush",p),this.vislibVis.off("click",p)},this.vislibVis.initVisConfig(s,a),this.showLegend(l)&&(h()(this.container).attr("class",((e,i)=>i.replace(/vislib--legend-\S+/g,""))).addClass(C[l.legendPosition]),this.mountLegend(s,l,p,a)),this.vislibVis.render(s,a)}mountLegend(e,i,t,s){const{legendPosition:l}=i;this.unmountLegend=Object(v.toMountPoint)(Object(w.jsx)(legend_VisLegend,{ref:this.legendRef,vislibVis:this.vislibVis,visData:e,uiState:s,fireEvent:t,addLegend:this.showLegend(i),position:l}))(this.legendEl)}destroy(e=!0){var i,t;null===(i=this.unmountLegend)||void 0===i||i.call(this),e&&(this.el.innerHTML=""),this.vislibVis&&(null===(t=this.removeListeners)||void 0===t||t.call(this),this.vislibVis.destroy(),delete this.vislibVis)}showLegend(e){var i;return this.arePieVisParams(e)?e.legendDisplay===T.a.SHOW:null!==(i=e.addLegend)&&void 0!==i&&i}arePieVisParams(e){return Object.values(T.a).includes(e.legendDisplay)}};t(58);const O=({core:e,charts:i,visData:t,visConfig:l,handlers:o})=>{const p=Object(s.useRef)(null),d=Object(s.useRef)(null),c=Object(s.useRef)(!0),h=Object(s.useMemo)((()=>()=>{const e=Object(x.d)(),i=(e=>{if(e){var i;const t=e=>e.type?e:e.child?t(e.child):void 0;return null===(i=t(e))||void 0===i?void 0:i.type}})(o.getExecutionContext());e&&i&&e.reportUiCounter(i,a.METRIC_TYPE.COUNT,`render_agg_based_${l.type}`),o.done()}),[o,l]),v=Object(s.useMemo)((()=>Object(n.debounce)((()=>{d.current&&d.current.render(t,l,o,c.current?void 0:h),c.current=!0}),100)),[o,h,c,l,t]),g=Object(s.useCallback)((()=>{v()}),[v]);return Object(s.useEffect)((()=>{c.current=!1,v()}),[v]),Object(s.useEffect)((()=>{if(p.current){const t=j(e,i);d.current=new t(p.current)}return()=>{var e;null===(e=d.current)||void 0===e||e.destroy(),d.current=null}}),[e,i]),Object(s.useEffect)((()=>{if(o.uiState){const e=o.uiState;return e.on("change",v),()=>{null==e||e.off("change",v)}}}),[o.uiState,v]),Object(w.jsx)(r.EuiResizeObserver,{onResize:g},(e=>Object(w.jsx)("div",{className:"vislib__wrapper",ref:e},Object(w.jsx)("div",{className:"vislib__container",ref:p}))))}},44:function(e,i,t){e.exports=t(24)(2)},48:function(e,i,t){"use strict";var s,l=function(){var e={};return function(i){if(void 0===e[i]){var t=document.querySelector(i);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(e){t=null}e[i]=t}return e[i]}}(),r=[];function n(e){for(var i=-1,t=0;t<r.length;t++)if(r[t].identifier===e){i=t;break}return i}function o(e,i){for(var t={},s=[],l=0;l<e.length;l++){var o=e[l],a=i.base?o[0]+i.base:o[0],p=t[a]||0,d="".concat(a," ").concat(p);t[a]=p+1;var c=n(d),h={css:o[1],media:o[2],sourceMap:o[3]};-1!==c?(r[c].references++,r[c].updater(h)):r.push({identifier:d,updater:b(h,i),references:1}),s.push(d)}return s}function a(e){var i=document.createElement("style"),s=e.attributes||{};if(void 0===s.nonce){var r=t.nc;r&&(s.nonce=r)}if(Object.keys(s).forEach((function(e){i.setAttribute(e,s[e])})),"function"==typeof e.insert)e.insert(i);else{var n=l(e.insert||"head");if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");n.appendChild(i)}return i}var p,d=(p=[],function(e,i){return p[e]=i,p.filter(Boolean).join("\n")});function c(e,i,t,s){var l=t?"":s.media?"@media ".concat(s.media," {").concat(s.css,"}"):s.css;if(e.styleSheet)e.styleSheet.cssText=d(i,l);else{var r=document.createTextNode(l),n=e.childNodes;n[i]&&e.removeChild(n[i]),n.length?e.insertBefore(r,n[i]):e.appendChild(r)}}function h(e,i,t){var s=t.css,l=t.media,r=t.sourceMap;if(l?e.setAttribute("media",l):e.removeAttribute("media"),r&&"undefined"!=typeof btoa&&(s+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),e.styleSheet)e.styleSheet.cssText=s;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(s))}}var v=null,g=0;function b(e,i){var t,s,l;if(i.singleton){var r=g++;t=v||(v=a(i)),s=c.bind(null,t,r,!1),l=c.bind(null,t,r,!0)}else t=a(i),s=h.bind(null,t,i),l=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)};return s(e),function(i){if(i){if(i.css===e.css&&i.media===e.media&&i.sourceMap===e.sourceMap)return;s(e=i)}else l()}}e.exports=function(e,i){(i=i||{}).singleton||"boolean"==typeof i.singleton||(i.singleton=(void 0===s&&(s=Boolean(window&&document&&document.all&&!window.atob)),s));var t=o(e=e||[],i);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var s=0;s<t.length;s++){var l=n(t[s]);r[l].references--}for(var a=o(e,i),p=0;p<t.length;p++){var d=n(t[p]);0===r[d].references&&(r[d].updater(),r.splice(d,1))}t=a}}}},49:function(e,i,t){"use strict";e.exports=function(e){var i=[];return i.toString=function(){return this.map((function(i){var t=function(e,i){var t,s,l,r=e[1]||"",n=e[3];if(!n)return r;if(i&&"function"==typeof btoa){var o=(t=n,s=btoa(unescape(encodeURIComponent(JSON.stringify(t)))),l="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s),"/*# ".concat(l," */")),a=n.sources.map((function(e){return"/*# sourceURL=".concat(n.sourceRoot||"").concat(e," */")}));return[r].concat(a).concat([o]).join("\n")}return[r].join("\n")}(i,e);return i[2]?"@media ".concat(i[2]," {").concat(t,"}"):t})).join("")},i.i=function(e,t,s){"string"==typeof e&&(e=[[null,e,""]]);var l={};if(s)for(var r=0;r<this.length;r++){var n=this[r][0];null!=n&&(l[n]=!0)}for(var o=0;o<e.length;o++){var a=[].concat(e[o]);s&&l[a[0]]||(t&&(a[2]?a[2]="".concat(t," and ").concat(a[2]):a[2]=t),i.push(a))}},i}},58:function(e,i,t){switch(window.__kbnThemeTag__){case"v8dark":return t(59);case"v8light":return t(61)}},59:function(e,i,t){var s=t(48),l=t(60);"string"==typeof(l=l.__esModule?l.default:l)&&(l=[[e.i,l,""]]);s(l,{insert:"head",singleton:!1}),e.exports=l.locals||{}},60:function(e,i,t){(i=t(49)(!1)).push([e.i,".vislib{display:flex;flex:1 1 0;flex-direction:row;overflow:auto}.vislib.vislib--legend-left{flex-direction:row-reverse}.vislib.vislib--legend-right{flex-direction:row}.vislib.vislib--legend-top{flex-direction:column-reverse}.vislib.vislib--legend-bottom{flex-direction:column}.vislib__chart,.vislib__container,.vislib__wrapper{display:flex;flex:1 1 auto;min-height:0;min-width:0}.vislib__wrapper{position:relative}.vislib__container{bottom:0;left:0;position:absolute;right:0;top:0}.visWrapper{display:flex;flex:1 1 100%;flex-direction:row;min-height:0;min-width:0;overflow:hidden;padding:8px 0}.visWrapper svg{overflow:visible}.visWrapper rect{opacity:1}.visWrapper rect:hover{opacity:.8}.visWrapper circle{opacity:0}.visWrapper circle:hover{stroke-width:8px;stroke-opacity:.8;opacity:1}.visWrapper .grid>path{stroke:#98a2b333}.visWrapper .label-line{fill:none;stroke-width:2px;stroke:#98a2b333}.visWrapper .label-text{font-size:12px;font-size:.85714rem;font-weight:400}.visWrapper .y-axis-div{flex:1 1 24px;margin:5px 0;min-height:12px;min-width:1px}.visWrapper .x-axis-div{margin:0 5px;min-height:0;min-width:1px;width:100%}.visWrapper .x-axis-div svg{float:left}.visWrapper .tick text{fill:#98a2b3;font-size:11px;font-size:.78571rem}.visWrapper .axis-title text{fill:#dfe5ef;font-size:12px;font-size:.85714rem;font-weight:700}.visWrapper .y-axis-title{min-height:14px;min-width:1px}.visWrapper .x-axis-title{min-width:16px}.visWrapper .chart-title{flex:1 1 100%;min-height:14px;min-width:14px}.visWrapper .chart-title text{fill:#98a2b3;font-size:11px;font-size:.78571rem}.visWrapper .chart{flex:1 1 100%;min-height:0;min-width:0;overflow:visible;scrollbar-color:#98a2b380 #0000;scrollbar-width:thin}.visWrapper .chart::-webkit-scrollbar{height:16px;width:16px}.visWrapper .chart::-webkit-scrollbar-thumb{background-clip:content-box;background-color:#98a2b380;border:6px solid #0000;border-radius:16px}.visWrapper .chart::-webkit-scrollbar-corner,.visWrapper .chart::-webkit-scrollbar-track{background-color:#0000}.visWrapper .chart>svg{display:block}.visWrapper .chart-column,.visWrapper .chart-row{flex:1 1 auto;min-height:0;min-width:0}.visWrapper .visWrapper__chart--first{margin-left:0;margin-top:0}.visWrapper .visWrapper__chart--last{margin-bottom:0;margin-right:0}.visWrapper .axis{shape-rendering:crispEdges;stroke-width:1px}.visWrapper .axis line,.visWrapper .axis path{stroke:#343741;fill:none;shape-rendering:crispEdges}.visWrapper .chart-label,.visWrapper .chart-text,.visWrapper .label-text{fill:#98a2b3}.visWrapper .brush .extent{shape-rendering:crispEdges;fill:#ffffff1a}.visWrapper .series>path,.visWrapper .series>rect{stroke-opacity:1;stroke-width:0}.visWrapper .series>path{fill-opacity:.8}.visWrapper .blur_shape{opacity:.3!important}.visWrapper .slice{stroke-width:2px;stroke:#1d1e24}.visWrapper .slice:hover{opacity:.8}.visWrapper .line circle{opacity:1}.visWrapper .line circle:hover{stroke-width:8px;stroke-opacity:.8}.visWrapper .endzone{fill:#ffffff1a;pointer-events:none}.visWrapper__column{display:flex;flex:1 0 0;flex-direction:column;min-height:0;min-width:0}.visWrapper__splitCharts--column{display:flex;flex:1 0 20px;flex-direction:row;min-height:0;min-width:0}.visWrapper__splitCharts--column .visWrapper__chart{margin-bottom:0;margin-top:0}.visWrapper__splitCharts--row{display:flex;flex:1 1 100%;flex-direction:column;min-height:0;min-width:0}.visWrapper__splitCharts--row .visWrapper__chart{margin-left:0;margin-right:0}.visWrapper__chart{display:flex;flex:1 0 0;margin:5px;min-height:0;min-width:0;overflow:visible}.visAxis__column--top .axis-div svg{margin-bottom:-5px}.visAxis--x,.visAxis--y{display:flex;flex-direction:column;min-height:0;min-width:0}.visAxis--x{overflow:visible}.visAxis__spacer--y{min-height:0}.visAxis__column--y{display:flex;flex:1 0 36px;flex-direction:row;min-height:0;min-width:0}.visAxis__splitTitles--y{display:flex;flex-direction:column;min-height:12px;min-width:0}.visAxis__splitTitles--x{display:flex;flex-direction:row;max-height:16px;min-height:1px;min-width:16px}.visAxis__splitAxes--x,.visAxis__splitAxes--y{display:flex;flex-direction:column;min-height:20px;min-width:0}.visAxis__splitAxes--x{flex-direction:row;min-height:0}.visTooltip,.visTooltip__sizingClone{background-color:#000;border-radius:6px;box-shadow:0 1px 5px #00000040,0 3.6px 13px rgba(0,0,0,.175),0 8.4px 23px #00000026,0 23px 35px rgba(0,0,0,.125);color:#fff;max-width:256px;max-width:320px;overflow:hidden;overflow-wrap:break-word;padding:0;pointer-events:none;position:fixed;visibility:hidden;z-index:9000}.visTooltip .euiHorizontalRule,.visTooltip__sizingClone .euiHorizontalRule{background-color:#333}.visTooltip>:last-child,.visTooltip__sizingClone>:last-child{margin-bottom:8px}.visTooltip>*,.visTooltip__sizingClone>*{margin:8px 8px 0}.visTooltip table td,.visTooltip table th,.visTooltip__sizingClone table td,.visTooltip__sizingClone table th{word-wrap:break-word;overflow-wrap:break-word;padding:4px;text-align:left}.visTooltip__header{align-items:center;display:flex;margin:0 0 8px;padding:4px 8px}.visTooltip__header:last-child{margin-bottom:0}.visTooltip__header+*{margin-top:8px}.visTooltip__labelContainer,.visTooltip__valueContainer{word-wrap:break-word;overflow-wrap:break-word}.visTooltip__headerIcon{margin-right:4px}.visTooltip__headerText{flex:1 1 100%}.visTooltip__label{color:#ccc;font-weight:500}.visTooltip__sizingClone{left:-500px;top:-500px}.visLegend__toggle{background-color:#1d1e24;border-radius:6px;bottom:0;display:flex;left:0;margin:8px;padding:4px;position:absolute;transition:opacity .15s cubic-bezier(.694,.0482,.335,1),background-color .15s cubic-bezier(.694,.0482,.335,1) .5s}.visLegend__toggle:focus{background-color:#36a2ef33!important;box-shadow:none}.visLegend__toggle--isOpen{background-color:#d4dae51a;opacity:1}.visLegend{display:flex;height:100%;min-height:0}.vislib--legend-left .visLegend__list{margin-bottom:24px}.vislib--legend-bottom .visLegend__list{margin-left:24px}.visLegend__list{display:flex;flex:1 1 auto;flex-direction:column;overflow-x:hidden;overflow-y:auto;scrollbar-color:#98a2b380 #0000;scrollbar-width:thin;width:150px}.visLegend__list::-webkit-scrollbar{height:16px;width:16px}.visLegend__list::-webkit-scrollbar-thumb{background-clip:content-box;background-color:#98a2b380;border:6px solid #0000;border-radius:16px}.visLegend__list::-webkit-scrollbar-corner,.visLegend__list::-webkit-scrollbar-track{background-color:#0000}.visLegend__list .visLegend__button{font-size:12px;overflow:hidden;text-align:left}.visLegend__list .visLegend__button .visLegend__valueTitle{vertical-align:middle}.vislib--legend-bottom .visLegend__list,.vislib--legend-top .visLegend__list{flex-direction:row;flex-wrap:wrap;width:auto}.vislib--legend-bottom .visLegend__list .visLegend__value,.vislib--legend-top .visLegend__list .visLegend__value{flex-grow:0;max-width:150px}.visLegend__list.hidden{visibility:hidden}.visGauge__meter--outline{stroke:#343741}",""]),e.exports=i},61:function(e,i,t){var s=t(48),l=t(62);"string"==typeof(l=l.__esModule?l.default:l)&&(l=[[e.i,l,""]]);s(l,{insert:"head",singleton:!1}),e.exports=l.locals||{}},62:function(e,i,t){(i=t(49)(!1)).push([e.i,".vislib{display:flex;flex:1 1 0;flex-direction:row;overflow:auto}.vislib.vislib--legend-left{flex-direction:row-reverse}.vislib.vislib--legend-right{flex-direction:row}.vislib.vislib--legend-top{flex-direction:column-reverse}.vislib.vislib--legend-bottom{flex-direction:column}.vislib__chart,.vislib__container,.vislib__wrapper{display:flex;flex:1 1 auto;min-height:0;min-width:0}.vislib__wrapper{position:relative}.vislib__container{bottom:0;left:0;position:absolute;right:0;top:0}.visWrapper{display:flex;flex:1 1 100%;flex-direction:row;min-height:0;min-width:0;overflow:hidden;padding:8px 0}.visWrapper svg{overflow:visible}.visWrapper rect{opacity:1}.visWrapper rect:hover{opacity:.8}.visWrapper circle{opacity:0}.visWrapper circle:hover{stroke-width:8px;stroke-opacity:.8;opacity:1}.visWrapper .grid>path{stroke:#69707d33}.visWrapper .label-line{fill:none;stroke-width:2px;stroke:#69707d33}.visWrapper .label-text{font-size:12px;font-size:.85714rem;font-weight:400}.visWrapper .y-axis-div{flex:1 1 24px;margin:5px 0;min-height:12px;min-width:1px}.visWrapper .x-axis-div{margin:0 5px;min-height:0;min-width:1px;width:100%}.visWrapper .x-axis-div svg{float:left}.visWrapper .tick text{fill:#69707d;font-size:11px;font-size:.78571rem}.visWrapper .axis-title text{fill:#343741;font-size:12px;font-size:.85714rem;font-weight:700}.visWrapper .y-axis-title{min-height:14px;min-width:1px}.visWrapper .x-axis-title{min-width:16px}.visWrapper .chart-title{flex:1 1 100%;min-height:14px;min-width:14px}.visWrapper .chart-title text{fill:#69707d;font-size:11px;font-size:.78571rem}.visWrapper .chart{flex:1 1 100%;min-height:0;min-width:0;overflow:visible;scrollbar-color:#69707d80 #0000;scrollbar-width:thin}.visWrapper .chart::-webkit-scrollbar{height:16px;width:16px}.visWrapper .chart::-webkit-scrollbar-thumb{background-clip:content-box;background-color:#69707d80;border:6px solid #0000;border-radius:16px}.visWrapper .chart::-webkit-scrollbar-corner,.visWrapper .chart::-webkit-scrollbar-track{background-color:#0000}.visWrapper .chart>svg{display:block}.visWrapper .chart-column,.visWrapper .chart-row{flex:1 1 auto;min-height:0;min-width:0}.visWrapper .visWrapper__chart--first{margin-left:0;margin-top:0}.visWrapper .visWrapper__chart--last{margin-bottom:0;margin-right:0}.visWrapper .axis{shape-rendering:crispEdges;stroke-width:1px}.visWrapper .axis line,.visWrapper .axis path{stroke:#d3dae6;fill:none;shape-rendering:crispEdges}.visWrapper .chart-label,.visWrapper .chart-text,.visWrapper .label-text{fill:#69707d}.visWrapper .brush .extent{shape-rendering:crispEdges;fill:#0000001a}.visWrapper .series>path,.visWrapper .series>rect{stroke-opacity:1;stroke-width:0}.visWrapper .series>path{fill-opacity:.8}.visWrapper .blur_shape{opacity:.3!important}.visWrapper .slice{stroke-width:2px;stroke:#fff}.visWrapper .slice:hover{opacity:.8}.visWrapper .line circle{opacity:1}.visWrapper .line circle:hover{stroke-width:8px;stroke-opacity:.8}.visWrapper .endzone{fill:#0000001a;pointer-events:none}.visWrapper__column{display:flex;flex:1 0 0;flex-direction:column;min-height:0;min-width:0}.visWrapper__splitCharts--column{display:flex;flex:1 0 20px;flex-direction:row;min-height:0;min-width:0}.visWrapper__splitCharts--column .visWrapper__chart{margin-bottom:0;margin-top:0}.visWrapper__splitCharts--row{display:flex;flex:1 1 100%;flex-direction:column;min-height:0;min-width:0}.visWrapper__splitCharts--row .visWrapper__chart{margin-left:0;margin-right:0}.visWrapper__chart{display:flex;flex:1 0 0;margin:5px;min-height:0;min-width:0;overflow:visible}.visAxis__column--top .axis-div svg{margin-bottom:-5px}.visAxis--x,.visAxis--y{display:flex;flex-direction:column;min-height:0;min-width:0}.visAxis--x{overflow:visible}.visAxis__spacer--y{min-height:0}.visAxis__column--y{display:flex;flex:1 0 36px;flex-direction:row;min-height:0;min-width:0}.visAxis__splitTitles--y{display:flex;flex-direction:column;min-height:12px;min-width:0}.visAxis__splitTitles--x{display:flex;flex-direction:row;max-height:16px;min-height:1px;min-width:16px}.visAxis__splitAxes--x,.visAxis__splitAxes--y{display:flex;flex-direction:column;min-height:20px;min-width:0}.visAxis__splitAxes--x{flex-direction:row;min-height:0}.visTooltip,.visTooltip__sizingClone{background-color:#404040;border-radius:6px;box-shadow:0 1px 5px #0000001a,0 3.6px 13px #00000012,0 8.4px 23px #0000000f,0 23px 35px #0000000d;color:#fff;max-width:256px;max-width:320px;overflow:hidden;overflow-wrap:break-word;padding:0;pointer-events:none;position:fixed;visibility:hidden;z-index:9000}.visTooltip .euiHorizontalRule,.visTooltip__sizingClone .euiHorizontalRule{background-color:#595959}.visTooltip>:last-child,.visTooltip__sizingClone>:last-child{margin-bottom:8px}.visTooltip>*,.visTooltip__sizingClone>*{margin:8px 8px 0}.visTooltip table td,.visTooltip table th,.visTooltip__sizingClone table td,.visTooltip__sizingClone table th{word-wrap:break-word;overflow-wrap:break-word;padding:4px;text-align:left}.visTooltip__header{align-items:center;display:flex;margin:0 0 8px;padding:4px 8px}.visTooltip__header:last-child{margin-bottom:0}.visTooltip__header+*{margin-top:8px}.visTooltip__labelContainer,.visTooltip__valueContainer{word-wrap:break-word;overflow-wrap:break-word}.visTooltip__headerIcon{margin-right:4px}.visTooltip__headerText{flex:1 1 100%}.visTooltip__label{color:#ccc;font-weight:500}.visTooltip__sizingClone{left:-500px;top:-500px}.visLegend__toggle{background-color:#fff;border-radius:6px;bottom:0;display:flex;left:0;margin:8px;padding:4px;position:absolute;transition:opacity .15s cubic-bezier(.694,.0482,.335,1),background-color .15s cubic-bezier(.694,.0482,.335,1) .5s}.visLegend__toggle:focus{background-color:#0077cc1a!important;box-shadow:none}.visLegend__toggle--isOpen{background-color:#3437411a;opacity:1}.visLegend{display:flex;height:100%;min-height:0}.vislib--legend-left .visLegend__list{margin-bottom:24px}.vislib--legend-bottom .visLegend__list{margin-left:24px}.visLegend__list{display:flex;flex:1 1 auto;flex-direction:column;overflow-x:hidden;overflow-y:auto;scrollbar-color:#69707d80 #0000;scrollbar-width:thin;width:150px}.visLegend__list::-webkit-scrollbar{height:16px;width:16px}.visLegend__list::-webkit-scrollbar-thumb{background-clip:content-box;background-color:#69707d80;border:6px solid #0000;border-radius:16px}.visLegend__list::-webkit-scrollbar-corner,.visLegend__list::-webkit-scrollbar-track{background-color:#0000}.visLegend__list .visLegend__button{font-size:12px;overflow:hidden;text-align:left}.visLegend__list .visLegend__button .visLegend__valueTitle{vertical-align:middle}.vislib--legend-bottom .visLegend__list,.vislib--legend-top .visLegend__list{flex-direction:row;flex-wrap:wrap;width:auto}.vislib--legend-bottom .visLegend__list .visLegend__value,.vislib--legend-top .visLegend__list .visLegend__value{flex-grow:0;max-width:150px}.visLegend__list.hidden{visibility:hidden}.visGauge__meter--outline{stroke:#d3dae6}",""]),e.exports=i}}]);