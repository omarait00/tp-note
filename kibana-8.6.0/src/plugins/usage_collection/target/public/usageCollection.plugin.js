!function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=8)}([function(e,t,r){e.exports=r(10)(2)},function(e,t){e.exports=__kbnSharedDeps__.React},function(e,t){e.exports=__kbnSharedDeps__.EmotionReact},function(e,t){e.exports=__kbnSharedDeps__.KbnAnalytics},function(e,t){e.exports=__kbnSharedDeps__.RxjsOperators},function(e,t,r){r.r(t);var n=__kbnBundles__.get("plugin/kibanaUtils/public");Object.defineProperties(t,Object.getOwnPropertyDescriptors(n))},function(e,t){e.exports=__kbnSharedDeps__.Rxjs},function(e,t){e.exports=__kbnSharedDeps__.ReactDom},function(e,t,r){r(9),__kbnBundles__.define("plugin/usageCollection/public",r,11)},function(e,t,r){r.p=window.__kbnPublicPath__.usageCollection},function(e,t){e.exports=__kbnSharedDeps_npm__},function(e,t,r){"use strict";r.r(t),r.d(t,"TrackApplicationView",(function(){return _})),r.d(t,"plugin",(function(){return k}));var n=r(0),i=r.n(n),o=r(3),a=r(1),c=r.n(a),s=r(5),p=r(6),u=r(4);const l="main",d=["kibana"];var g=r(7),h=r.n(g);class track_application_view_component_TrackApplicationViewComponent extends c.a.Component{constructor(...e){super(...e),i()(this,"parentNode",void 0),i()(this,"onClick",(e=>{var t,r;const{applicationUsageTracker:n,viewId:i}=this.props;this.parentNode=this.parentNode||(null===(t=h.a.findDOMNode(this))||void 0===t?void 0:t.parentNode),(this.parentNode===e.target||null!==(r=this.parentNode)&&void 0!==r&&r.contains(e.target))&&(null==n||n.updateViewClickCounter(i))}))}componentDidMount(){const{applicationUsageTracker:e,viewId:t}=this.props;e&&(e.trackApplicationViewUsage(t),document.addEventListener("click",this.onClick))}componentWillUnmount(){const{applicationUsageTracker:e,viewId:t}=this.props;e&&e.flushTrackedView(t),document.removeEventListener("click",this.onClick)}render(){return this.props.children}}var f=r(2);const b=Object(a.createContext)(void 0),_=e=>Object(f.jsx)(b.Consumer,null,(t=>{const r={...e,applicationUsageTracker:t};return Object(f.jsx)(track_application_view_component_TrackApplicationViewComponent,r)}));class plugin_UsageCollectionPlugin{constructor(e){i()(this,"applicationUsageTracker",void 0),i()(this,"subscriptions",[]),i()(this,"reporter",void 0),i()(this,"config",void 0),this.config=e.config.get()}setup({http:e}){const t=new s.Storage(window.localStorage),r=this.config.uiCounters.debug;this.reporter=function(e){const{localStorage:t,debug:r,fetch:n}=e;return new o.Reporter({debug:r,storage:t,async http(e){const t=await n.post("/api/ui_counters/_report",{body:JSON.stringify({report:e}),asSystemRequest:!0});if("ok"!==t.status)throw Error("Unable to store report.");return t}})}({localStorage:t,debug:r,fetch:e}),this.applicationUsageTracker=new o.ApplicationUsageTracker(this.reporter);const n=this.getPublicApplicationUsageTracker();return{components:{ApplicationUsageTrackingProvider:e=>Object(f.jsx)(b.Provider,{value:n},e.children)},reportUiCounter:this.reporter.reportUiCounter}}start({http:e,application:t}){if(!this.reporter||!this.applicationUsageTracker)throw new Error("Usage collection reporter not set up correctly");var r,n;return this.config.uiCounters.enabled&&!function(e){const{anonymousPaths:t}=e;return t.isAnonymous(window.location.pathname)}(e)&&(this.reporter.start(),this.applicationUsageTracker.start(),this.subscriptions=(r=t.currentAppId$,n=this.applicationUsageTracker,[Object(p.fromEvent)(window,"click").subscribe((()=>{n.updateViewClickCounter(l)})),r.pipe(Object(u.filter)((e=>"string"==typeof e&&!d.includes(e))),Object(u.distinctUntilChanged)()).subscribe((e=>{e&&(n.setCurrentAppId(e),n.trackApplicationViewUsage(l))}))])),this.reporter.reportUserAgent("kibana"),{reportUiCounter:this.reporter.reportUiCounter}}stop(){this.applicationUsageTracker&&(this.applicationUsageTracker.stop(),this.subscriptions.forEach((e=>e.unsubscribe())))}getPublicApplicationUsageTracker(){return{trackApplicationViewUsage:this.applicationUsageTracker.trackApplicationViewUsage.bind(this.applicationUsageTracker),flushTrackedView:this.applicationUsageTracker.flushTrackedView.bind(this.applicationUsageTracker),updateViewClickCounter:this.applicationUsageTracker.updateViewClickCounter.bind(this.applicationUsageTracker)}}}function k(e){return new plugin_UsageCollectionPlugin(e)}}]);