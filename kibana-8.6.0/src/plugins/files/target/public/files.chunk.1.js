(window.files_bundle_jsonpfunction=window.files_bundle_jsonpfunction||[]).push([[1],Array(28).concat([function(e,t,i){"use strict";i.d(t,"a",(function(){return l}));var s=i(29),n=i.n(s);function l(e){return n()(e,e.getValue())}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i(23),n=i(0),l=s.__importDefault(i(32));t.default=function(e,t){var i=n.useState(t),s=i[0],a=i[1];return l.default((function(){var t=e.subscribe(a);return function(){return t.unsubscribe()}}),[e]),s}},function(e,t,i){"use strict";var s,n=function(){var e={};return function(t){if(void 0===e[t]){var i=document.querySelector(t);if(window.HTMLIFrameElement&&i instanceof window.HTMLIFrameElement)try{i=i.contentDocument.head}catch(e){i=null}e[t]=i}return e[t]}}(),l=[];function a(e){for(var t=-1,i=0;i<l.length;i++)if(l[i].identifier===e){t=i;break}return t}function r(e,t){for(var i={},s=[],n=0;n<e.length;n++){var r=e[n],c=t.base?r[0]+t.base:r[0],o=i[c]||0,d="".concat(c," ").concat(o);i[c]=o+1;var u=a(d),f={css:r[1],media:r[2],sourceMap:r[3]};-1!==u?(l[u].references++,l[u].updater(f)):l.push({identifier:d,updater:b(f,t),references:1}),s.push(d)}return s}function c(e){var t=document.createElement("style"),s=e.attributes||{};if(void 0===s.nonce){var l=i.nc;l&&(s.nonce=l)}if(Object.keys(s).forEach((function(e){t.setAttribute(e,s[e])})),"function"==typeof e.insert)e.insert(t);else{var a=n(e.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(t)}return t}var o,d=(o=[],function(e,t){return o[e]=t,o.filter(Boolean).join("\n")});function u(e,t,i,s){var n=i?"":s.media?"@media ".concat(s.media," {").concat(s.css,"}"):s.css;if(e.styleSheet)e.styleSheet.cssText=d(t,n);else{var l=document.createTextNode(n),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(l,a[t]):e.appendChild(l)}}function f(e,t,i){var s=i.css,n=i.media,l=i.sourceMap;if(n?e.setAttribute("media",n):e.removeAttribute("media"),l&&"undefined"!=typeof btoa&&(s+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(l))))," */")),e.styleSheet)e.styleSheet.cssText=s;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(s))}}var h=null,p=0;function b(e,t){var i,s,n;if(t.singleton){var l=p++;i=h||(h=c(t)),s=u.bind(null,i,l,!1),n=u.bind(null,i,l,!0)}else i=c(t),s=f.bind(null,i,t),n=function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(i)};return s(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;s(e=t)}else n()}}e.exports=function(e,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===s&&(s=Boolean(window&&document&&document.all&&!window.atob)),s));var i=r(e=e||[],t);return function(e){if(e=e||[],"[object Array]"===Object.prototype.toString.call(e)){for(var s=0;s<i.length;s++){var n=a(i[s]);l[n].references--}for(var c=r(e,t),o=0;o<i.length;o++){var d=a(i[o]);0===l[d].references&&(l[d].updater(),l.splice(d,1))}i=c}}}},function(e,t,i){"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var i=function(e,t){var i,s,n,l=e[1]||"",a=e[3];if(!a)return l;if(t&&"function"==typeof btoa){var r=(i=a,s=btoa(unescape(encodeURIComponent(JSON.stringify(i)))),n="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s),"/*# ".concat(n," */")),c=a.sources.map((function(e){return"/*# sourceURL=".concat(a.sourceRoot||"").concat(e," */")}));return[l].concat(c).concat([r]).join("\n")}return[l].join("\n")}(t,e);return t[2]?"@media ".concat(t[2]," {").concat(i,"}"):i})).join("")},t.i=function(e,i,s){"string"==typeof e&&(e=[[null,e,""]]);var n={};if(s)for(var l=0;l<this.length;l++){var a=this[l][0];null!=a&&(n[a]=!0)}for(var r=0;r<e.length;r++){var c=[].concat(e[r]);s&&n[c[0]]||(i&&(c[2]?c[2]="".concat(i," and ").concat(c[2]):c[2]=i),t.push(c))}},t}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=i(0),n="undefined"!=typeof window?s.useLayoutEffect:s.useEffect;t.default=n},function(e,t,i){switch(window.__kbnThemeTag__){case"v8dark":return i(34);case"v8light":return i(36)}},function(e,t,i){var s=i(30),n=i(35);"string"==typeof(n=n.__esModule?n.default:n)&&(n=[[e.i,n,""]]);s(n,{insert:"head",singleton:!1}),e.exports=n.locals||{}},function(e,t,i){(t=i(31)(!1)).push([e.i,".filesFilePicker .euiCard__content,.filesFilePicker .euiCard__description{margin:0}",""]),e.exports=t},function(e,t,i){var s=i(30),n=i(37);"string"==typeof(n=n.__esModule?n.default:n)&&(n=[[e.i,n,""]]);s(n,{insert:"head",singleton:!1}),e.exports=n.locals||{}},function(e,t,i){(t=i(31)(!1)).push([e.i,".filesFilePicker .euiCard__content,.filesFilePicker .euiCard__description{margin:0}",""]),e.exports=t},function(e,t,i){switch(window.__kbnThemeTag__){case"v8dark":return i(39);case"v8light":return i(41)}},function(e,t,i){var s=i(30),n=i(40);"string"==typeof(n=n.__esModule?n.default:n)&&(n=[[e.i,n,""]]);s(n,{insert:"head",singleton:!1}),e.exports=n.locals||{}},function(e,t,i){(t=i(31)(!1)).push([e.i,"@media only screen and (min-width:768px) and (max-width:991px){.filesFilePicker--fixed{width:75vw}.filesFilePicker--fixed .euiModal__flex{height:75vw}}@media only screen and (min-width:992px) and (max-width:1199px){.filesFilePicker--fixed{width:75vw}.filesFilePicker--fixed .euiModal__flex{height:75vw}}@media only screen and (min-width:1200px){.filesFilePicker--fixed{width:75vw}.filesFilePicker--fixed .euiModal__flex{height:75vw}}",""]),e.exports=t},function(e,t,i){var s=i(30),n=i(42);"string"==typeof(n=n.__esModule?n.default:n)&&(n=[[e.i,n,""]]);s(n,{insert:"head",singleton:!1}),e.exports=n.locals||{}},function(e,t,i){(t=i(31)(!1)).push([e.i,"@media only screen and (min-width:768px) and (max-width:991px){.filesFilePicker--fixed{width:75vw}.filesFilePicker--fixed .euiModal__flex{height:75vw}}@media only screen and (min-width:992px) and (max-width:1199px){.filesFilePicker--fixed{width:75vw}.filesFilePicker--fixed .euiModal__flex{height:75vw}}@media only screen and (min-width:1200px){.filesFilePicker--fixed{width:75vw}.filesFilePicker--fixed .euiModal__flex{height:75vw}}",""]),e.exports=t},function(e,t,i){"use strict";i.r(t),i.d(t,"FilePicker",(function(){return H}));var s=i(6),n=i.n(s),l=i(0),a=i.n(l),r=i(29),c=i.n(r),o=i(3),d=i(28),u=i(10),f=i(2),h=i.n(f),p=i(8);function b(e){return e.includes("*")?e:`*${e}*`}class file_picker_state_FilePickerState{constructor(e,t,i,s){h()(this,"selectedFiles$",new p.BehaviorSubject([])),h()(this,"selectedFileIds$",this.selectedFiles$.pipe(Object(p.map)((e=>e.map((e=>e.id)))))),h()(this,"isLoading$",new p.BehaviorSubject(!0)),h()(this,"loadingError$",new p.BehaviorSubject(void 0)),h()(this,"hasFiles$",new p.BehaviorSubject(!1)),h()(this,"hasQuery$",new p.BehaviorSubject(!1)),h()(this,"query$",new p.BehaviorSubject(void 0)),h()(this,"queryDebounced$",this.query$.pipe(Object(p.debounceTime)(100))),h()(this,"currentPage$",new p.BehaviorSubject(0)),h()(this,"totalPages$",new p.BehaviorSubject(void 0)),h()(this,"isUploading$",new p.BehaviorSubject(!1)),h()(this,"selectedFiles",new Map),h()(this,"retry$",new p.BehaviorSubject(void 0)),h()(this,"subscriptions",[]),h()(this,"internalIsLoading$",new p.BehaviorSubject(!0)),h()(this,"requests$",Object(p.combineLatest)([this.currentPage$.pipe(Object(p.distinctUntilChanged)()),this.query$.pipe(Object(p.distinctUntilChanged)()),this.retry$]).pipe(Object(p.tap)((()=>this.setIsLoading(!0))),Object(p.debounceTime)(100))),h()(this,"files$",this.requests$.pipe(Object(p.switchMap)((([e,t])=>this.sendRequest(e,t))),Object(p.tap)((({total:e})=>this.updateTotalPages({total:e}))),Object(p.tap)((({total:e})=>this.hasFiles$.next(Boolean(e)))),Object(p.map)((({files:e})=>e)),Object(p.shareReplay)())),h()(this,"updateTotalPages",(({total:e})=>{this.totalPages$.next(Math.ceil(e/this.pageSize))})),h()(this,"selectFile",(e=>{const t=Array.isArray(e)?e:[e];if(this.selectMultiple)for(const e of t)this.selectedFiles.set(e.id,e);else this.selectedFiles.clear(),this.selectedFiles.set(t[0].id,t[0]);this.sendNextSelectedFiles()})),h()(this,"abort",void 0),h()(this,"sendRequest",((e,t)=>{if(this.isUploading$.getValue())return p.EMPTY;this.abort&&this.abort(),this.setIsLoading(!0),this.loadingError$.next(void 0);const i=new AbortController;this.abort=()=>{try{i.abort()}catch(e){}};const s=Object(p.from)(this.client.list({kind:this.kind,name:t?[b(t)]:void 0,page:e+1,status:["READY"],perPage:this.pageSize,abortSignal:i.signal})).pipe(Object(p.catchError)((e=>("AbortError"!==e.name&&(this.setIsLoading(!1),this.loadingError$.next(e)),p.EMPTY))),Object(p.tap)((()=>{this.setIsLoading(!1),this.abort=void 0})),Object(p.shareReplay)());return s.subscribe(),s})),h()(this,"retry",(()=>{this.retry$.next()})),h()(this,"resetFilters",(()=>{this.setQuery(void 0),this.setPage(0),this.retry()})),h()(this,"hasFilesSelected",(()=>this.selectedFiles.size>0)),h()(this,"unselectFile",(e=>{this.selectedFiles.delete(e)&&this.sendNextSelectedFiles()})),h()(this,"isFileIdSelected",(e=>this.selectedFiles.has(e))),h()(this,"getSelectedFileIds",(()=>Array.from(this.selectedFiles.keys()))),h()(this,"setQuery",(e=>{e?this.query$.next(e):this.query$.next(void 0),this.currentPage$.next(0)})),h()(this,"setPage",(e=>{this.currentPage$.next(e)})),h()(this,"setIsUploading",(e=>{this.isUploading$.next(e)})),h()(this,"dispose",(()=>{for(const e of this.subscriptions)e.unsubscribe()})),h()(this,"watchFileSelected$",(e=>this.selectedFiles$.pipe(Object(p.map)((()=>this.selectedFiles.has(e))),Object(p.distinctUntilChanged)()))),this.client=e,this.kind=t,this.pageSize=i,this.selectMultiple=s,this.subscriptions=[this.query$.pipe(Object(p.map)((e=>Boolean(e))),Object(p.distinctUntilChanged)()).subscribe(this.hasQuery$),this.internalIsLoading$.pipe(Object(p.distinctUntilChanged)()).subscribe(this.isLoading$)]}sendNextSelectedFiles(){this.selectedFiles$.next(Array.from(this.selectedFiles.values()))}setIsLoading(e){this.internalIsLoading$.next(e)}}var j=i(1);const m=Object(l.createContext)(null),g=({kind:e,pageSize:t,multiple:i,children:s})=>{const n=Object(u.b)(),{client:a}=n,r=Object(l.useMemo)((()=>(({pageSize:e,client:t,kind:i,selectMultiple:s})=>new file_picker_state_FilePickerState(t,i,e,s))({pageSize:t,client:a,kind:e,selectMultiple:i})),[t,a,e,i]);return Object(l.useEffect)((()=>r.dispose),[r]),Object(j.jsx)(m.Provider,{value:{state:r,kind:e,...n}},s)},x=()=>{const e=Object(l.useContext)(m);if(!e)throw new Error("FilePickerContext not found!");return e};var O=i(24);const v={title:O.i18n.translate("files.filePicker.title",{defaultMessage:"Select a file"}),titleMultiple:O.i18n.translate("files.filePicker.titleMultiple",{defaultMessage:"Select files"}),loadingFilesErrorTitle:O.i18n.translate("files.filePicker.error.loadingTitle",{defaultMessage:"Could not load files"}),retryButtonLabel:O.i18n.translate("files.filePicker.error.retryButtonLabel",{defaultMessage:"Retry"}),emptyStatePrompt:O.i18n.translate("files.filePicker.emptyStatePromptTitle",{defaultMessage:"Upload your first file"}),selectFileLabel:O.i18n.translate("files.filePicker.selectFileButtonLable",{defaultMessage:"Select file"}),selectFilesLabel:e=>O.i18n.translate("files.filePicker.selectFilesButtonLable",{defaultMessage:"Select {nrOfFiles} files",values:{nrOfFiles:e}}),searchFieldPlaceholder:O.i18n.translate("files.filePicker.searchFieldPlaceholder",{defaultMessage:"my-file-*"}),emptyFileGridPrompt:O.i18n.translate("files.filePicker.emptyGridPrompt",{defaultMessage:"No files match your filter"}),loadMoreButtonLabel:O.i18n.translate("files.filePicker.loadMoreButtonLabel",{defaultMessage:"Load more"}),clearFilterButton:O.i18n.translate("files.filePicker.clearFilterButtonLabel",{defaultMessage:"Clear filter"}),uploadFilePlaceholderText:O.i18n.translate("files.filePicker.uploadFilePlaceholderText",{defaultMessage:"Drag and drop to upload new files"})},y=({multiple:e})=>Object(j.jsx)(o.EuiTitle,null,Object(j.jsx)("h2",null,e?v.titleMultiple:v.title)),F=({error:e})=>{const{state:t}=x(),i=Object(d.a)(t.isLoading$);return Object(j.jsx)(o.EuiEmptyPrompt,{"data-test-subj":"errorPrompt",iconType:"alert",iconColor:"danger",titleSize:"xs",title:Object(j.jsx)("h3",null,v.loadingFilesErrorTitle),body:e.message,actions:Object(j.jsx)(o.EuiButton,{disabled:i,onClick:t.retry},v.retryButtonLabel)})};var w=i(9);const k=({kind:e,multiple:t})=>{const{state:i}=x();return Object(j.jsx)(o.EuiEmptyPrompt,{"data-test-subj":"emptyPrompt",title:Object(j.jsx)("h3",null,v.emptyStatePrompt),titleSize:"s",actions:[Object(j.jsx)(w.a,{kind:e,immediate:!0,multiple:t,onDone:e=>{i.selectFile(e.map((({fileJSON:e})=>e))),i.retry()}})]})};var P=i(26),S=i.n(P),$=i(11),M=i(12);i(33);var _={name:"50zrmy",styles:"text-transform:uppercase"},E={name:"ucb1au",styles:"overflow:hidden;white-space:nowrap;text-overflow:ellipsis"},C={name:"mdm104",styles:"place-self:stretch"};const L=({file:e})=>{var t;const{kind:i,state:s,client:n}=x(),{euiTheme:r}=Object(o.useEuiTheme)(),d=Object(M.c)({type:e.mimeType}),u=Object(l.useMemo)((()=>s.watchFileSelected$(e.id)),[e.id,s]),f=c()(u,!1),h=`calc(${r.size.xxxl} * 2)`;return Object(j.jsx)(o.EuiCard,{title:"",css:C,paddingSize:"s",selectable:{isSelected:f,onClick:()=>f?s.unselectFile(e.id):s.selectFile(e)},image:Object(j.jsx)("div",{css:Object(j.css)("display:grid;place-items:center;height:",h,";margin:",r.size.m,";","")},d?Object(j.jsx)($.a,{alt:null!==(t=e.alt)&&void 0!==t?t:"",css:Object(j.css)("max-height:",h,";",""),meta:e.meta,src:n.getDownloadHref({id:e.id,fileKind:i})}):Object(j.jsx)("div",{css:Object(j.css)("display:grid;place-items:center;height:",h,";","")},Object(j.jsx)(o.EuiIcon,{type:"filebeatApp",size:"xl"}))),description:Object(j.jsx)(a.a.Fragment,null,Object(j.jsx)(o.EuiText,{size:"s",css:E},Object(j.jsx)("strong",null,e.name)),Object(j.jsx)(o.EuiText,{color:"subdued",size:"xs"},S()(e.size).format("0[.]0 b"),e.extension&&Object(j.jsx)(a.a.Fragment,null,"  ·  ",Object(j.jsx)("span",{css:_},e.extension)))),hasBorder:!0})},B=()=>{const{state:e}=x(),{euiTheme:t}=Object(o.useEuiTheme)(),i=c()(e.files$,[]);return i.length?Object(j.jsx)("div",{"data-test-subj":"fileGrid",css:Object(j.css)("display:grid;grid-template-columns:repeat(auto-fill, minmax(calc(",t.size.xxxxl," * 3), 1fr));gap:",t.size.m,";","")},i.map(((e,t)=>Object(j.jsx)(L,{key:t,file:e})))):Object(j.jsx)(o.EuiEmptyPrompt,{title:Object(j.jsx)("h3",null,v.emptyFileGridPrompt),titleSize:"s"})},T=()=>{const{state:e}=x(),t=Object(d.a)(e.query$),i=Object(d.a)(e.isLoading$),s=Object(d.a)(e.hasFiles$),n=Object(d.a)(e.isUploading$);return Object(j.jsx)(o.EuiFieldSearch,{"data-test-subj":"searchField",disabled:n||!t&&!s,isLoading:i,value:null!=t?t:"",placeholder:v.searchFieldPlaceholder,onChange:t=>e.setQuery(t.target.value)})},U=()=>{const{state:e}=x(),t=Object(d.a)(e.currentPage$),i=c()(e.files$,[]),s=Object(d.a)(e.totalPages$),n=Object(d.a)(e.isUploading$);return 0===i.length?null:Object(j.jsx)(o.EuiPagination,{"data-test-subj":"paginationControls",onPageClick:n?()=>{}:e.setPage,pageCount:s,activePage:t})},z=({onClick:e})=>{const{state:t}=x(),i=Object(d.a)(t.isUploading$),s=Object(d.a)(t.selectedFiles$);return Object(j.jsx)(o.EuiButton,{"data-test-subj":"selectButton",disabled:i||!t.hasFilesSelected(),onClick:()=>e(s)},s.length>1?v.selectFilesLabel(s.length):v.selectFileLabel)};var I={name:"1w4dlxi",styles:"place-self:end"},q={name:"1fystu3",styles:"place-self:center"},N={name:"mdm104",styles:"place-self:stretch"},A={name:"jhc76r",styles:"display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;width:100%"};const D=({kind:e,onDone:t,onUpload:i,multiple:s})=>{const{state:n}=x(),a=Object(l.useCallback)((()=>n.setIsUploading(!0)),[n]),r=Object(l.useCallback)((()=>n.setIsUploading(!1)),[n]);return Object(j.jsx)(o.EuiModalFooter,null,Object(j.jsx)("div",{css:A},Object(j.jsx)("div",{css:N},Object(j.jsx)(w.a,{onDone:e=>{n.selectFile(e.map((({fileJSON:e})=>e))),n.resetFilters(),null==i||i(e)},onUploadStart:a,onUploadEnd:r,kind:e,initialPromptText:v.uploadFilePlaceholderText,multiple:s,compressed:!0})),Object(j.jsx)("div",{css:q},Object(j.jsx)(U,null)),Object(j.jsx)("div",{css:I},Object(j.jsx)(z,{onClick:t}))))};i(38);var R={name:"1dfmss9",styles:"display:grid;place-items:center"};const Q=({onClick:e})=>{const{state:t}=x(),i=Object(d.a)(t.isUploading$);return c()(t.queryDebounced$)?Object(j.jsx)("div",{css:R},Object(j.jsx)(o.EuiLink,{disabled:i,onClick:e},v.clearFilterButton)):null},G=({onClose:e,onDone:t,onUpload:i,multiple:s})=>{const{state:n,kind:l}=x(),r=Object(d.a)(n.hasFiles$),u=Object(d.a)(n.hasQuery$),f=Object(d.a)(n.isLoading$),h=Object(d.a)(n.loadingError$);c()(n.files$);const p=()=>Object(j.jsx)(D,{kind:l,onDone:t,onUpload:i,multiple:s});return Object(j.jsx)(o.EuiModal,{"data-test-subj":"filePickerModal",className:"filesFilePicker filesFilePicker--fixed",maxWidth:"75vw",onClose:e},Object(j.jsx)(o.EuiModalHeader,null,Object(j.jsx)(y,{multiple:s}),Object(j.jsx)(T,null)),f?Object(j.jsx)(a.a.Fragment,null,Object(j.jsx)(o.EuiModalBody,null,Object(j.jsx)(o.EuiFlexGroup,{justifyContent:"center",alignItems:"center",gutterSize:"none"},Object(j.jsx)(o.EuiLoadingSpinner,{"data-test-subj":"loadingSpinner",size:"xl"}))),p()):Boolean(h)?Object(j.jsx)(o.EuiModalBody,null,Object(j.jsx)(F,{error:h})):r||u?Object(j.jsx)(a.a.Fragment,null,Object(j.jsx)(o.EuiModalBody,null,Object(j.jsx)(B,null),Object(j.jsx)(o.EuiSpacer,null),Object(j.jsx)(Q,{onClick:()=>n.setQuery(void 0)})),p()):Object(j.jsx)(o.EuiModalBody,null,Object(j.jsx)(k,{multiple:s,kind:l})))},H=({pageSize:e=20,kind:t,multiple:i=!1,onUpload:s=(()=>{}),...l})=>Object(j.jsx)(g,{pageSize:e,kind:t,multiple:i},Object(j.jsx)(G,n()({},l,{pageSize:e,kind:t,multiple:i,onUpload:s})));t.default=H}])]);