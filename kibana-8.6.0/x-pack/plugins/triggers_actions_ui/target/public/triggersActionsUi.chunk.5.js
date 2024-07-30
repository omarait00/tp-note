/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.triggersActionsUi_bundle_jsonpfunction=window.triggersActionsUi_bundle_jsonpfunction||[]).push([[5],{272:function(e,t,s){"use strict";s.r(t),s.d(t,"FieldBrowser",(function(){return K})),s.d(t,"default",(function(){return K}));var l=s(4),i=s(21),n=s(1),o=s.n(n),a=s(3);const c=a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.categoryLabel",{defaultMessage:"Category"}),r=a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.categoriesTitle",{defaultMessage:"Categories"}),u=a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.closeButton",{defaultMessage:"Close"}),d=a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.fieldBrowserTitle",{defaultMessage:"Fields"}),b=(a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.descriptionLabel",{defaultMessage:"Description"}),a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.fieldName",{defaultMessage:"Name"})),j=(a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.fieldLabel",{defaultMessage:"Field"}),a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.fieldsTitle",{defaultMessage:"Fields"})),g=a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.fieldsCountShowing",{defaultMessage:"Showing"}),m=a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.filterPlaceholder",{defaultMessage:"Field name"}),f=(a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.noFieldsMatchLabel",{defaultMessage:"No fields match"}),a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.resetFieldsLink",{defaultMessage:"Reset Fields"})),p=e=>a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.viewColumnCheckboxAriaLabel",{values:{field:e},defaultMessage:"View {field} column"}),x=a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.viewLabel",{defaultMessage:"View"}),O=a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.viewSelected",{defaultMessage:"selected"}),h=a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.viewAll",{defaultMessage:"all"});var C=s(0);const w=e=>null==e?void 0:e.focus(),I=o.a.memo((({isSearching:e,onSearchInputChange:t,searchInput:s})=>Object(C.jsx)(l.EuiFieldSearch,{"data-test-subj":"field-search",inputRef:w,isLoading:e,onChange:t,placeholder:m,value:s,fullWidth:!0})));I.displayName="Search";var y=s(106);const S=e=>null!=e&&null!=e.fields?Object.keys(e.fields).length:0,k=e=>{switch(e){case"string":case"keyword":return"string";case"number":case"long":case"float":return"number";case"date":return"clock";case"ip":case"geo_point":return"globe";default:return"questionInCircle"}},E={countBadge:{name:"1qkltea",styles:"margin-left:5px"},categoryName:({bold:e})=>Object(C.css)("font-weight:",e?"bold":"normal",";",""),selectableContainer:{name:"18ji2p4",styles:"width:300px"}},F=(e,t)=>{const{label:s,count:i,checked:n}=e,o=s.replace(/\s/g,"");return Object(C.jsx)(l.EuiFlexGroup,{"data-test-subj":`categories-selector-option-${o}`,alignItems:"center",gutterSize:"none",justifyContent:"spaceBetween"},Object(C.jsx)(l.EuiFlexItem,{grow:!1},Object(C.jsx)("span",{css:E.categoryName({bold:"on"===n}),"data-test-subj":`categories-selector-option-name-${o}`},Object(C.jsx)(l.EuiHighlight,{search:t},s))),Object(C.jsx)(l.EuiFlexItem,{grow:!1},Object(C.jsx)(l.EuiBadge,{css:E.countBadge},i)))},v=({filteredBrowserFields:e,setSelectedCategoryIds:t,selectedCategoryIds:s})=>{const[a,c]=Object(n.useState)(!1),u=Object(n.useCallback)((()=>{c((e=>!e))}),[]),d=Object(n.useCallback)((()=>{c(!1)}),[]),b=Object(n.useMemo)((()=>Object.keys(e).length),[e]),j=Object(n.useMemo)((()=>{const t=Object.keys(Object(i.omit)(e,s)).sort();return[...s.map((t=>({label:t,count:S(e[t]),checked:"on"}))),...t.map((t=>({label:t,count:S(e[t])})))]}),[s,e]),g=Object(n.useCallback)((e=>{t(e.filter((({checked:e})=>"on"===e)).map((({label:e})=>e)))}),[t]),m=Object(n.useCallback)((e=>{"Escape"===e.key&&e.stopPropagation()}),[]);return Object(C.jsx)(l.EuiFilterGroup,{"data-test-subj":"categories-selector"},Object(C.jsx)(l.EuiPopover,{button:Object(C.jsx)(l.EuiFilterButton,{"data-test-subj":"categories-filter-button",hasActiveFilters:s.length>0,iconType:"arrowDown",isSelected:a,numActiveFilters:s.length,numFilters:b,onClick:u},r),isOpen:a,closePopover:d,panelPaddingSize:"none"},Object(C.jsx)("div",{css:E.selectableContainer,onKeyDown:m,"data-test-subj":"categories-selector-container"},Object(C.jsx)(l.EuiSelectable,{"aria-label":"Searchable categories",searchable:!0,searchProps:{"data-test-subj":"categories-selector-search"},options:j,renderOption:F,onChange:g},((e,t)=>Object(C.jsx)(o.a.Fragment,null,t,e))))))},B=o.a.memo(v),T=({euiTheme:e})=>Object(C.css)("margin-top:",e.size.xs,";min-height:24px;",""),M=({setSelectedCategoryIds:e,selectedCategoryIds:t})=>{const{euiTheme:s}=Object(l.useEuiTheme)(),i=Object(n.useCallback)((s=>{e(t.filter((e=>e!==s)))}),[e,t]);return Object(C.jsx)(l.EuiFlexGroup,{css:T({euiTheme:s}),"data-test-subj":"category-badges",gutterSize:"xs",wrap:!0},t.map((e=>Object(C.jsx)(l.EuiFlexItem,{grow:!1,key:e},Object(C.jsx)(l.EuiBadge,{iconType:"cross",iconSide:"right",iconOnClick:()=>i(e),iconOnClickAriaLabel:"unselect category","data-test-subj":`category-badge-${e}`,closeButtonProps:{"data-test-subj":`category-badge-unselect-${e}`}},e)))))},A=o.a.memo(M),U=o.a.memo((({fieldId:e,highlight:t=""})=>Object(C.jsx)(l.EuiText,{size:"xs"},Object(C.jsx)(l.EuiHighlight,{"data-test-subj":`field-${e}-name`,search:t},e))));U.displayName="FieldName";const z={icon:{name:"p3x1bt",styles:"margin:0 4px;position:relative;top:-1px"},truncatable:{name:"9v6jjg",styles:"&,& *{display:inline-block;max-width:100%;overflow:hidden;text-overflow:ellipsis;vertical-align:top;white-space:nowrap;}"},description:{name:"1cthmrf",styles:"user-select:text;width:400px"}},$=e=>[{field:"name",name:b,render:(t,{type:s})=>Object(C.jsx)(l.EuiFlexGroup,{alignItems:"center",gutterSize:"none"},Object(C.jsx)(l.EuiFlexItem,{grow:!1},Object(C.jsx)(l.EuiToolTip,{content:s},Object(C.jsx)(l.EuiIcon,{"data-test-subj":`field-${t}-icon`,css:z.icon,type:k(null!=s?s:null)}))),Object(C.jsx)(l.EuiFlexItem,{grow:!1},Object(C.jsx)(U,{fieldId:t,highlight:e}))),sortable:!0,width:"225px"},{field:"category",name:c,render:(e,{name:t})=>Object(C.jsx)(l.EuiBadge,{"data-test-subj":`field-${t}-category`},e),sortable:!0,width:"130px"}],H={count:{name:"1efi8gv",styles:"font-weight:bold"}},N=({fieldCount:e,filterSelectedEnabled:t,onFilterSelectedChange:s})=>{const[i,o]=Object(n.useState)(!1),c=Object(n.useCallback)((()=>{o((e=>!e))}),[]),r=Object(n.useCallback)((()=>{o(!1)}),[]);return Object(C.jsx)(l.EuiFlexGroup,null,Object(C.jsx)(l.EuiFlexItem,null,Object(C.jsx)(l.EuiText,{"data-test-subj":"fields-showing",size:"xs"},g,Object(C.jsx)("span",{css:H.count,"data-test-subj":"fields-count"}," ",e," "),(u=e,a.i18n.translate("xpack.triggersActionsUI.fieldBrowser.fieldsCountTitle",{values:{totalCount:u},defaultMessage:"{totalCount, plural, =1 {field} other {fields}}"})))),Object(C.jsx)(l.EuiFlexItem,{grow:!1},Object(C.jsx)(l.EuiPopover,{panelPaddingSize:"none",anchorPosition:"downRight",isOpen:i,closePopover:r,button:Object(C.jsx)(l.EuiButtonEmpty,{"data-test-subj":"viewSelectorButton",size:"xs",iconType:"arrowDown",iconSide:"right",onClick:c},`${x}: ${t?O:h}`)},Object(C.jsx)(l.EuiContextMenuPanel,{"data-test-subj":"viewSelectorMenu",size:"s",items:[Object(C.jsx)(l.EuiContextMenuItem,{"data-test-subj":"viewSelectorOption-all",key:"viewAll",icon:t?"empty":"check",onClick:()=>{s(!1),r()}},`${x} ${h}`),Object(C.jsx)(l.EuiHorizontalRule,{key:"separator",margin:"none"}),Object(C.jsx)(l.EuiContextMenuItem,{"data-test-subj":"viewSelectorOption-selected",key:"viewSelected",icon:t?"check":"empty",onClick:()=>{s(!0),r()}},`${x} ${O}`)]}))));var u},P=o.a.memo(N),R=({height:e,euiTheme:t})=>Object(C.css)("margin-top:",t.size.xs,";border-top:",t.border.thin,";height:",e,"px;overflow:hidden;",""),L={field:"",direction:"asc"},G=({columnIds:e,filteredBrowserFields:t,filterSelectedEnabled:s,getFieldTableColumns:i,searchInput:a,selectedCategoryIds:c,onFilterSelectedChange:r,onToggleColumn:u,onHide:d})=>{const{euiTheme:b}=Object(l.useEuiTheme)(),[j,g]=Object(n.useState)(0),[m,f]=Object(n.useState)(10),[x,O]=Object(n.useState)(L.field),[h,w]=Object(n.useState)(L.direction),I=Object(n.useMemo)((()=>(({browserFields:e,selectedCategoryIds:t,columnIds:s})=>{const l=t.length>0?t:Object.keys(e),i=new Set(s);return Object(y.uniqBy)("name",l.reduce(((t,s)=>{var l,n;const o=Object.values(null!==(l=null===(n=e[s])||void 0===n?void 0:n.fields)&&void 0!==l?l:{});return o.length>0&&t.push(...o.map((({name:e="",...t})=>{var l,n;return{name:e,type:t.type,description:null!==(l=t.description)&&void 0!==l?l:"",example:null===(n=t.example)||void 0===n?void 0:n.toString(),category:s,selected:i.has(e),isRuntime:!!t.runtimeField}}))),t}),[]))})({browserFields:t,selectedCategoryIds:c,columnIds:e})),[e,t,c]),S=Object(n.useMemo)((()=>({pageIndex:j,pageSize:m,totalItemCount:I.length,pageSizeOptions:[10,25,50]})),[I.length,j,m]);Object(n.useEffect)((()=>{g(0)}),[I.length]);const k=Object(n.useMemo)((()=>({sort:{field:x,direction:h}})),[h,x]),E=Object(n.useCallback)((({page:e,sort:t=L})=>{const{index:s,size:l}=e,{field:i,direction:n}=t;g(s),f(l),O(i),w(n)}),[]),F=Object(n.useMemo)((()=>(({onToggleColumn:e,highlight:t="",getFieldTableColumns:s,onHide:i})=>[{field:"selected",name:"",render:(t,{name:s})=>Object(C.jsx)(l.EuiToolTip,{content:p(s)},Object(C.jsx)(l.EuiCheckbox,{"aria-label":p(s),checked:t,"data-test-subj":`field-${s}-checkbox`,"data-colindex":1,id:s,onChange:()=>e(s)})),sortable:!1,width:"25px"},...s?s({highlight:t,onHide:i}):$(t)])({highlight:a,onToggleColumn:u,getFieldTableColumns:i,onHide:d})),[u,a,i,d]),v=Object(n.useMemo)((()=>F.some((e=>(e=>{var t;return!(null===(t=e.actions)||void 0===t||!t.length)})(e)))),[F]);return Object(C.jsx)(o.a.Fragment,null,Object(C.jsx)(P,{fieldCount:I.length,filterSelectedEnabled:s,onFilterSelectedChange:r}),Object(C.jsx)("div",{css:R({height:260,euiTheme:b})},Object(C.jsx)(l.EuiInMemoryTable,{"data-test-subj":"field-table",className:"category-table eui-yScroll",items:I,itemId:"name",columns:F,pagination:S,sorting:k,hasActions:v,onChange:E,compressed:!0})))},_=o.a.memo(G),D=({appliedFilterInput:e,columnIds:t,filteredBrowserFields:s,filterSelectedEnabled:i,isSearching:o,onFilterSelectedChange:a,onToggleColumn:c,onResetColumns:r,setSelectedCategoryIds:b,onSearchInputChange:j,onHide:g,options:m,restoreFocusTo:p,searchInput:x,selectedCategoryIds:O,width:h=925})=>{const w=Object(n.useCallback)((()=>{g(),setTimeout((()=>{var e;null===(e=p.current)||void 0===e||e.focus()}),0)}),[g,p]),y=Object(n.useCallback)((()=>{r(),w()}),[w,r]),S=Object(n.useCallback)((e=>{j(e.target.value)}),[j]),[k,E]=[null==m?void 0:m.createFieldButton,null==m?void 0:m.getFieldTableColumns];return Object(C.jsx)(l.EuiModal,{onClose:w,style:{width:h,maxWidth:h}},Object(C.jsx)("div",{"data-test-subj":"fields-browser-container",className:"eui-yScroll"},Object(C.jsx)(l.EuiModalHeader,null,Object(C.jsx)(l.EuiModalHeaderTitle,null,Object(C.jsx)("h1",null,d))),Object(C.jsx)(l.EuiModalBody,null,Object(C.jsx)(l.EuiFlexGroup,{gutterSize:"m"},Object(C.jsx)(l.EuiFlexItem,null,Object(C.jsx)(I,{"data-test-subj":"header",isSearching:o,onSearchInputChange:S,searchInput:x})),Object(C.jsx)(l.EuiFlexItem,{grow:!1},Object(C.jsx)(B,{filteredBrowserFields:s,setSelectedCategoryIds:b,selectedCategoryIds:O})),Object(C.jsx)(l.EuiFlexItem,{grow:!1},k&&Object(C.jsx)(k,{onHide:g}))),Object(C.jsx)(A,{selectedCategoryIds:O,setSelectedCategoryIds:b}),Object(C.jsx)(l.EuiSpacer,{size:"l"}),Object(C.jsx)(_,{columnIds:t,filteredBrowserFields:s,filterSelectedEnabled:i,searchInput:e,selectedCategoryIds:O,onFilterSelectedChange:a,onToggleColumn:c,getFieldTableColumns:E,onHide:g})),Object(C.jsx)(l.EuiModalFooter,null,Object(C.jsx)(l.EuiFlexItem,{grow:!1},Object(C.jsx)(l.EuiButtonEmpty,{className:"reset-fields","data-test-subj":"reset-fields",onClick:y},f)),Object(C.jsx)(l.EuiFlexItem,{grow:!1},Object(C.jsx)(l.EuiButton,{onClick:w,"aria-label":u,className:"close-button","data-test-subj":"close"},u)))))},q=o.a.memo(D),V={buttonContainer:{name:"11ffxfj",styles:"display:inline-block;position:relative"}},W=({columnIds:e,browserFields:t,onResetColumns:s,onToggleColumn:o,options:a,width:c})=>{const r=Object(n.useMemo)((()=>{var e;return null!==(e=null==a?void 0:a.preselectedCategoryIds)&&void 0!==e?e:[]}),[null==a?void 0:a.preselectedCategoryIds]),u=Object(n.useRef)(null),[b,g]=Object(n.useState)(""),[m,f]=Object(n.useState)(""),[p,x]=Object(n.useState)(null),[O,h]=Object(n.useState)(!1),[w,I]=Object(n.useState)(!1),[y,S]=Object(n.useState)(r),[k,E]=Object(n.useState)(!1),F=Object(n.useMemo)((()=>Object(i.debounce)((e=>{f(e)}),250)),[]);Object(n.useEffect)((()=>()=>{F.cancel()}),[F]);const v=Object(n.useMemo)((()=>O?(({browserFields:e,columnIds:t})=>{const s=new Set(t),l={};for(const[t,i]of Object.entries(e)){if(!i.fields)continue;let n=!1;const o={};for(const[e,t]of Object.entries(i.fields)){const l=t.name;l&&s.has(l)&&(n=!0,o[e]=t)}n&&(l[t]={...e[t],fields:o})}return l})({browserFields:t,columnIds:e}):t),[t,e,O]);Object(n.useEffect)((()=>{x(function({browserFields:e,substring:t}){const s=t.trim();if(""===s)return e;const l={};for(const[t,i]of Object.entries(e)){if(!i.fields)continue;let n=!1;const o={};for(const[e,t]of Object.entries(i.fields)){const l=t.name;l&&null!==l&&l.includes(s)&&(n=!0,o[e]=t)}n&&(l[t]={...e[t],fields:o})}return l}({browserFields:v,substring:m})),I(!1)}),[m,v]);const B=Object(n.useCallback)((()=>{E(!0)}),[]),T=Object(n.useCallback)((()=>{g(""),f(""),x(null),h(!1),I(!1),S(r),E(!1)}),[r]),M=Object(n.useCallback)((e=>{I(!0),g(e),F(e)}),[F]),A=Object(n.useCallback)((e=>{h(e)}),[h]);return Object(C.jsx)("div",{css:V.buttonContainer,"data-test-subj":"fields-browser-button-container"},Object(C.jsx)(l.EuiToolTip,{content:d},Object(C.jsx)(l.EuiButtonEmpty,{"aria-label":d,buttonRef:u,className:"fields-button",color:"text","data-test-subj":"show-field-browser",iconType:"tableOfContents",onClick:B,size:"xs"},j)),k&&Object(C.jsx)(q,{columnIds:e,filteredBrowserFields:null!=p?p:t,filterSelectedEnabled:O,isSearching:w,setSelectedCategoryIds:S,onFilterSelectedChange:A,onHide:T,onResetColumns:s,onSearchInputChange:M,onToggleColumn:o,options:a,restoreFocusTo:u,searchInput:b,appliedFilterInput:m,selectedCategoryIds:y,width:c}))},K=o.a.memo(W)}}]);