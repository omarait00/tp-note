/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.security_bundle_jsonpfunction=window.security_bundle_jsonpfunction||[]).push([[0],{112:function(t,e,s){"use strict";var r=s(206),h=s(207);function n(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}e.parse=d,e.resolve=function(t,e){return d(t,!1,!0).resolve(e)},e.resolveObject=function(t,e){return t?d(t,!1,!0).resolveObject(e):e},e.format=function(t){return h.isString(t)&&(t=d(t)),t instanceof n?t.format():n.prototype.format.call(t)},e.Url=n;var o=/^([a-z0-9.+-]+:)/i,a=/:[0-9]*$/,i=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,l=["{","}","|","\\","^","`"].concat(["<",">",'"',"`"," ","\r","\n","\t"]),u=["'"].concat(l),c=["%","/","?",";","#"].concat(u),p=["/","?","#"],f=/^[+a-z0-9A-Z_-]{0,63}$/,m=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,v={javascript:!0,"javascript:":!0},y={javascript:!0,"javascript:":!0},g={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},b=s(208);function d(t,e,s){if(t&&h.isObject(t)&&t instanceof n)return t;var r=new n;return r.parse(t,e,s),r}n.prototype.parse=function(t,e,s){if(!h.isString(t))throw new TypeError("Parameter 'url' must be a string, not "+typeof t);var n=t.indexOf("?"),a=-1!==n&&n<t.indexOf("#")?"?":"#",l=t.split(a);l[0]=l[0].replace(/\\/g,"/");var d=t=l.join(a);if(d=d.trim(),!s&&1===t.split("#").length){var j=i.exec(d);if(j)return this.path=d,this.href=d,this.pathname=j[1],j[2]?(this.search=j[2],this.query=e?b.parse(this.search.substr(1)):this.search.substr(1)):e&&(this.search="",this.query={}),this}var O=o.exec(d);if(O){var x=(O=O[0]).toLowerCase();this.protocol=x,d=d.substr(O.length)}if(s||O||d.match(/^\/\/[^@\/]+@[^@\/]+/)){var q="//"===d.substr(0,2);!q||O&&y[O]||(d=d.substr(2),this.slashes=!0)}if(!y[O]&&(q||O&&!g[O])){for(var A,w,C=-1,I=0;I<p.length;I++)-1!==(U=d.indexOf(p[I]))&&(-1===C||U<C)&&(C=U);for(-1!==(w=-1===C?d.lastIndexOf("@"):d.lastIndexOf("@",C))&&(A=d.slice(0,w),d=d.slice(w+1),this.auth=decodeURIComponent(A)),C=-1,I=0;I<c.length;I++){var U;-1!==(U=d.indexOf(c[I]))&&(-1===C||U<C)&&(C=U)}-1===C&&(C=d.length),this.host=d.slice(0,C),d=d.slice(C),this.parseHost(),this.hostname=this.hostname||"";var R="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!R)for(var N=this.hostname.split(/\./),S=(I=0,N.length);I<S;I++){var $=N[I];if($&&!$.match(f)){for(var k="",_=0,z=$.length;_<z;_++)$.charCodeAt(_)>127?k+="x":k+=$[_];if(!k.match(f)){var L=N.slice(0,I),P=N.slice(I+1),H=$.match(m);H&&(L.push(H[1]),P.unshift(H[2])),P.length&&(d="/"+P.join(".")+d),this.hostname=L.join(".");break}}}this.hostname.length>255?this.hostname="":this.hostname=this.hostname.toLowerCase(),R||(this.hostname=r.toASCII(this.hostname));var K=this.port?":"+this.port:"",W=this.hostname||"";this.host=W+K,this.href+=this.host,R&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==d[0]&&(d="/"+d))}if(!v[x])for(I=0,S=u.length;I<S;I++){var Z=u[I];if(-1!==d.indexOf(Z)){var E=encodeURIComponent(Z);E===Z&&(E=escape(Z)),d=d.split(Z).join(E)}}var F=d.indexOf("#");-1!==F&&(this.hash=d.substr(F),d=d.slice(0,F));var T=d.indexOf("?");if(-1!==T?(this.search=d.substr(T),this.query=d.substr(T+1),e&&(this.query=b.parse(this.query)),d=d.slice(0,T)):e&&(this.search="",this.query={}),d&&(this.pathname=d),g[x]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){K=this.pathname||"";var B=this.search||"";this.path=K+B}return this.href=this.format(),this},n.prototype.format=function(){var t=this.auth||"";t&&(t=(t=encodeURIComponent(t)).replace(/%3A/i,":"),t+="@");var e=this.protocol||"",s=this.pathname||"",r=this.hash||"",n=!1,o="";this.host?n=t+this.host:this.hostname&&(n=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(n+=":"+this.port)),this.query&&h.isObject(this.query)&&Object.keys(this.query).length&&(o=b.stringify(this.query));var a=this.search||o&&"?"+o||"";return e&&":"!==e.substr(-1)&&(e+=":"),this.slashes||(!e||g[e])&&!1!==n?(n="//"+(n||""),s&&"/"!==s.charAt(0)&&(s="/"+s)):n||(n=""),r&&"#"!==r.charAt(0)&&(r="#"+r),a&&"?"!==a.charAt(0)&&(a="?"+a),e+n+(s=s.replace(/[?#]/g,(function(t){return encodeURIComponent(t)})))+(a=a.replace("#","%23"))+r},n.prototype.resolve=function(t){return this.resolveObject(d(t,!1,!0)).format()},n.prototype.resolveObject=function(t){if(h.isString(t)){var e=new n;e.parse(t,!1,!0),t=e}for(var s=new n,r=Object.keys(this),o=0;o<r.length;o++){var a=r[o];s[a]=this[a]}if(s.hash=t.hash,""===t.href)return s.href=s.format(),s;if(t.slashes&&!t.protocol){for(var i=Object.keys(t),l=0;l<i.length;l++){var u=i[l];"protocol"!==u&&(s[u]=t[u])}return g[s.protocol]&&s.hostname&&!s.pathname&&(s.path=s.pathname="/"),s.href=s.format(),s}if(t.protocol&&t.protocol!==s.protocol){if(!g[t.protocol]){for(var c=Object.keys(t),p=0;p<c.length;p++){var f=c[p];s[f]=t[f]}return s.href=s.format(),s}if(s.protocol=t.protocol,t.host||y[t.protocol])s.pathname=t.pathname;else{for(var m=(t.pathname||"").split("/");m.length&&!(t.host=m.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==m[0]&&m.unshift(""),m.length<2&&m.unshift(""),s.pathname=m.join("/")}if(s.search=t.search,s.query=t.query,s.host=t.host||"",s.auth=t.auth,s.hostname=t.hostname||t.host,s.port=t.port,s.pathname||s.search){var v=s.pathname||"",b=s.search||"";s.path=v+b}return s.slashes=s.slashes||t.slashes,s.href=s.format(),s}var d=s.pathname&&"/"===s.pathname.charAt(0),j=t.host||t.pathname&&"/"===t.pathname.charAt(0),O=j||d||s.host&&t.pathname,x=O,q=s.pathname&&s.pathname.split("/")||[],A=(m=t.pathname&&t.pathname.split("/")||[],s.protocol&&!g[s.protocol]);if(A&&(s.hostname="",s.port=null,s.host&&(""===q[0]?q[0]=s.host:q.unshift(s.host)),s.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===m[0]?m[0]=t.host:m.unshift(t.host)),t.host=null),O=O&&(""===m[0]||""===q[0])),j)s.host=t.host||""===t.host?t.host:s.host,s.hostname=t.hostname||""===t.hostname?t.hostname:s.hostname,s.search=t.search,s.query=t.query,q=m;else if(m.length)q||(q=[]),q.pop(),q=q.concat(m),s.search=t.search,s.query=t.query;else if(!h.isNullOrUndefined(t.search))return A&&(s.hostname=s.host=q.shift(),(R=!!(s.host&&s.host.indexOf("@")>0)&&s.host.split("@"))&&(s.auth=R.shift(),s.host=s.hostname=R.shift())),s.search=t.search,s.query=t.query,h.isNull(s.pathname)&&h.isNull(s.search)||(s.path=(s.pathname?s.pathname:"")+(s.search?s.search:"")),s.href=s.format(),s;if(!q.length)return s.pathname=null,s.search?s.path="/"+s.search:s.path=null,s.href=s.format(),s;for(var w=q.slice(-1)[0],C=(s.host||t.host||q.length>1)&&("."===w||".."===w)||""===w,I=0,U=q.length;U>=0;U--)"."===(w=q[U])?q.splice(U,1):".."===w?(q.splice(U,1),I++):I&&(q.splice(U,1),I--);if(!O&&!x)for(;I--;I)q.unshift("..");!O||""===q[0]||q[0]&&"/"===q[0].charAt(0)||q.unshift(""),C&&"/"!==q.join("/").substr(-1)&&q.push("");var R,N=""===q[0]||q[0]&&"/"===q[0].charAt(0);return A&&(s.hostname=s.host=N?"":q.length?q.shift():"",(R=!!(s.host&&s.host.indexOf("@")>0)&&s.host.split("@"))&&(s.auth=R.shift(),s.host=s.hostname=R.shift())),(O=O||s.host&&q.length)&&!N&&q.unshift(""),q.length?s.pathname=q.join("/"):(s.pathname=null,s.path=null),h.isNull(s.pathname)&&h.isNull(s.search)||(s.path=(s.pathname?s.pathname:"")+(s.search?s.search:"")),s.auth=t.auth||s.auth,s.slashes=s.slashes||t.slashes,s.href=s.format(),s},n.prototype.parseHost=function(){var t=this.host,e=a.exec(t);e&&(":"!==(e=e[0])&&(this.port=e.substr(1)),t=t.substr(0,t.length-e.length)),t&&(this.hostname=t)}},206:function(t,e,s){t.exports=s(16)(2732)},207:function(t,e,s){"use strict";t.exports={isString:function(t){return"string"==typeof t},isObject:function(t){return"object"==typeof t&&null!==t},isNull:function(t){return null===t},isNullOrUndefined:function(t){return null==t}}},208:function(t,e,s){"use strict";e.decode=e.parse=s(209),e.encode=e.stringify=s(210)},209:function(t,e,s){"use strict";function r(t,e){return Object.prototype.hasOwnProperty.call(t,e)}t.exports=function(t,e,s,n){e=e||"&",s=s||"=";var o={};if("string"!=typeof t||0===t.length)return o;var a=/\+/g;t=t.split(e);var i=1e3;n&&"number"==typeof n.maxKeys&&(i=n.maxKeys);var l=t.length;i>0&&l>i&&(l=i);for(var u=0;u<l;++u){var c,p,f,m,v=t[u].replace(a,"%20"),y=v.indexOf(s);y>=0?(c=v.substr(0,y),p=v.substr(y+1)):(c=v,p=""),f=decodeURIComponent(c),m=decodeURIComponent(p),r(o,f)?h(o[f])?o[f].push(m):o[f]=[o[f],m]:o[f]=m}return o};var h=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)}},210:function(t,e,s){"use strict";var r=function(t){switch(typeof t){case"string":return t;case"boolean":return t?"true":"false";case"number":return isFinite(t)?t:"";default:return""}};t.exports=function(t,e,s,a){return e=e||"&",s=s||"=",null===t&&(t=void 0),"object"==typeof t?n(o(t),(function(o){var a=encodeURIComponent(r(o))+s;return h(t[o])?n(t[o],(function(t){return a+encodeURIComponent(r(t))})).join(e):a+encodeURIComponent(r(t[o]))})).join(e):a?encodeURIComponent(r(a))+s+encodeURIComponent(r(t)):""};var h=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)};function n(t,e){if(t.map)return t.map(e);for(var s=[],r=0;r<t.length;r++)s.push(e(t[r],r));return s}var o=Object.keys||function(t){var e=[];for(var s in t)Object.prototype.hasOwnProperty.call(t,s)&&e.push(s);return e}},95:function(t,e,s){"use strict";s.r(e),s.d(e,"parseNext",(function(){return n}));var r=s(112),h=s(11);function n(t,e=""){const{query:s,hash:n}=Object(r.parse)(t,!0);let o=s[h.h];return o?(Array.isArray(o)&&o.length>0&&(o=o[0]),function(t,e=""){const{protocol:s,hostname:h,port:n,pathname:o}=Object(r.parse)(t,!1,!0);if(null!==s||null!==h||null!==n)return!1;if(e){const t=new URL(String(o),"https://localhost").pathname;return(null==o?void 0:o.startsWith("/"))&&(t===e||t.startsWith(`${e}/`))}return!0}(o,e)?o+(n||""):`${e}/`):`${e}/`}}}]);