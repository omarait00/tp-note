(window.charts_bundle_jsonpfunction=window.charts_bundle_jsonpfunction||[]).push([[3],{34:function(n,t,r){"use strict";r.d(t,"g",(function(){return m})),r.d(t,"l",(function(){return v})),r.d(t,"n",(function(){return h})),r.d(t,"j",(function(){return g})),r.d(t,"i",(function(){return b})),r.d(t,"h",(function(){return I})),r.d(t,"k",(function(){return N})),r.d(t,"m",(function(){return x})),r.d(t,"d",(function(){return l})),r.d(t,"f",(function(){return a})),r.d(t,"a",(function(){return c})),r.d(t,"c",(function(){return s})),r.d(t,"e",(function(){return d})),r.d(t,"b",(function(){return f}));var o=r(35),e=r.n(o),u=r(36),i=r.n(u),l="positive",a="fixed",c="custom",s="above",d="percent",f=5,p=["stops"];function m(n,t,r,o,e){return 0===o?e+t:h(t+(n-r)*e/o)}function v(n,t,r){var o=r.prevPalette,u=r.dataBounds,a=r.mapFromMinValue,c=r.defaultPaletteName,s=function(n,t){var r,o,e,u,i,l,a=g(null==n?void 0:n.rangeType,t),c=a.min,s=a.max,d=null!==(r=null==n||null===(o=n.colorStops)||void 0===o||null===(e=o[0])||void 0===e?void 0:e.stop)&&void 0!==r?r:Number.POSITIVE_INFINITY,f=null!==(u=null==n||null===(i=n.colorStops)||void 0===i||null===(l=i[n.colorStops.length-1])||void 0===l?void 0:l.stop)&&void 0!==u?u:Number.NEGATIVE_INFINITY;return{min:Math.min(c,d),max:Math.max(s,f)}}(t,u),d=s.min,v=s.max,h=v-d,b=t||{},I=(b.stops,i()(b,p));if("custom"===t.name&&null!=t&&t.colorStops)return function(n,t){var r=n.map((function(n,r,o){return e()(e()({},n),{},{stop:r+1<o.length?o[r+1].stop:t})}));if(n[n.length-1].stop===t){var o=function(n,t,r){var o=t.length,e=o>1&&t[o-1].stop-t[o-2].stop||1,u=Number(e.toFixed(2));if(r<n[o-1].stop+u){var i=r-n[o-1].stop;u=i>0?i:1}return u}(n,r,t)||1,u=Math.min(1,o);r[n.length-1].stop=t+u}return r}(t.colorStops,v);var N,x,M,w,T,E,F=(null==t?void 0:t.steps)||f,_=n.get(o||(null==t?void 0:t.name)||c||l).getCategoricalColors(F,I),j=a||0===h?d:h/F;return N=_.map((function(n,t){return{color:n,stop:t}})),x={newInterval:h,oldInterval:_.length,newMin:j,oldMin:0},M=x.newInterval,w=x.oldInterval,T=x.newMin,E=x.oldMin,(N||[]).map((function(n){return{color:n.color,stop:m(n.stop,T,E,w,M)}}))}function h(n){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;return Number((Math.floor(100*n)/100).toFixed(t))}function g(n,t){return{min:"number"===n?t.min:0,max:"number"===n?t.max:100}}var b=function(n){return Boolean(n&&["below","all"].includes(n))},I=function(n){return Boolean(n&&["above","all"].includes(n))},N=function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"percent";return"percent"===n?{min:0,max:100,fallback:!0}:{min:1,max:1,fallback:!0}};function x(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=n.map((function(n){return n.stop}));return n.map((function(r,o){return{color:r.color,stop:t[n.length-o-1]}})).reverse()}},35:function(n,t,r){n.exports=r(18)(2745)},36:function(n,t,r){n.exports=r(18)(6)},38:function(n,t,r){"use strict";r.d(t,"b",(function(){return o.i})),r.d(t,"a",(function(){return o.h}));var o=r(34),e=r(1),u=r.n(e),i=r(16),l=u.a.lazy((function(){return Promise.all([r.e(0),r.e(2)]).then(r.bind(null,49))}));Object(i.a)(l)},46:function(n,t,r){"use strict";r.r(t),r.d(t,"paletteExpressionFn",(function(){return i}));var o=r(4),e=r(38),u=r(13);const i=async(n,t)=>{const{color:r,continuity:i,reverse:l,gradient:a,stop:c,range:s,rangeMin:d,rangeMax:f}=t,p=[].concat(r||u.a),m=[].concat(c||[]);if(m.length>0&&p.length!==m.length)throw Error("When stop is used, each color must have an associated stop value.");const v=(n,t,r)=>{var o;return null!==(o=null!=n?n:t)&&void 0!==o?o:r};return{type:"palette",name:"custom",params:{colors:l?p.reverse():p,stops:m,range:null!=s?s:"percent",gradient:a,continuity:i,rangeMin:Object(e.b)(i)?Number.NEGATIVE_INFINITY:v(d,m[0],0),rangeMax:Object(e.a)(i)?Number.POSITIVE_INFINITY:v(f,Object(o.last)(m),100)}}}}}]);