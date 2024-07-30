(window.visTypePie_bundle_jsonpfunction=window.visTypePie_bundle_jsonpfunction||[]).push([[1],{24:function(e,t,s){"use strict";s.r(t),s.d(t,"default",(function(){return x}));var a=s(10),i=s.n(a),l=s(8),n=s.n(l),o=s(21),u=s(7),d=s(3),p=s(22),r=s(23),c=s(2),b=s(0),v=s(9);function g({disabled:e,value:t=null,setValue:s}){return Object(v.jsx)(o.EuiFormRow,{label:d.i18n.translate("visTypePie.controls.truncateLabel",{defaultMessage:"Truncate"}),fullWidth:!0,display:"rowCompressed",labelAppend:Object(v.jsx)(o.EuiIconTip,{content:d.i18n.translate("visTypePie.controls.truncateTooltip",{defaultMessage:"Number of characters for labels positioned outside the chart."}),position:"top",type:"iInCircle",color:"subdued"})},Object(v.jsx)(o.EuiFieldNumber,{"data-test-subj":"pieLabelTruncateInput",disabled:e,value:t||"",onChange:e=>s("truncate",""===e.target.value?null:parseFloat(e.target.value)),fullWidth:!0,compressed:!0}))}var j=s(4);const m=[{text:d.i18n.translate("visTypePie.labelPositions.insideText",{defaultMessage:"Inside"}),value:b.LabelPositions.INSIDE},{text:d.i18n.translate("visTypePie.labelPositions.insideOrOutsideText",{defaultMessage:"Inside or outside"}),value:b.LabelPositions.DEFAULT}],O=[{text:d.i18n.translate("visTypePie.valuesFormats.percent",{defaultMessage:"Show percent"}),value:b.ValueFormats.PERCENT},{text:d.i18n.translate("visTypePie.valuesFormats.value",{defaultMessage:"Show value"}),value:b.ValueFormats.VALUE}],P=[{id:"emptySizeRatioOption-small",value:b.EmptySizeRatios.SMALL,label:d.i18n.translate("visTypePie.emptySizeRatioOptions.small",{defaultMessage:"Small"})},{id:"emptySizeRatioOption-medium",value:b.EmptySizeRatios.MEDIUM,label:d.i18n.translate("visTypePie.emptySizeRatioOptions.medium",{defaultMessage:"Medium"})},{id:"emptySizeRatioOption-large",value:b.EmptySizeRatios.LARGE,label:d.i18n.translate("visTypePie.emptySizeRatioOptions.large",{defaultMessage:"Large"})}],S=[{text:d.i18n.translate("visTypePie.legendPositions.topText",{defaultMessage:"Top"}),value:u.Position.Top},{text:d.i18n.translate("visTypePie.legendPositions.leftText",{defaultMessage:"Left"}),value:u.Position.Left},{text:d.i18n.translate("visTypePie.legendPositions.rightText",{defaultMessage:"Right"}),value:u.Position.Right},{text:d.i18n.translate("visTypePie.legendPositions.bottomText",{defaultMessage:"Bottom"}),value:u.Position.Bottom}],y=d.i18n.translate("visTypePie.editors.pie.emptySizeRatioLabel",{defaultMessage:"Inner area size"});function h({paramName:e,value:t,setValue:s}){return Object(v.jsx)(o.EuiFormRow,{fullWidth:!0,label:d.i18n.translate("visTypePie.editors.pie.decimalSliderLabel",{defaultMessage:"Maximum decimal places for percent"}),"data-test-subj":"visTypePieValueDecimals"},Object(v.jsx)(o.EuiRange,{value:t,min:0,max:4,showInput:!0,compressed:!0,onChange:t=>{s(e,Number(t.currentTarget.value))}}))}const x=e=>{var t,s,a,x,T,L,f,E,w;const{stateParams:M,setValue:z,aggs:D}=e,F=(e,t)=>z("labels",{...M.labels,[e]:t}),R=null===(t=e.uiState)||void 0===t?void 0:t.get("vis.legendOpen"),[C,I]=Object(l.useState)(void 0),[N,V]=Object(l.useState)((()=>{var t;const s=M.legendDisplay===b.LegendDisplay.SHOW;return null===(t=e.uiState)||void 0===t?void 0:t.get("vis.legendOpen",s)})),A=Boolean(null==D||null===(s=D.aggs)||void 0===s?void 0:s.find((e=>"split"===e.schema&&e.enabled))),U=null!==(a=null==D||null===(x=D.aggs)||void 0===x?void 0:x.filter((e=>"segment"===e.schema&&e.enabled)))&&void 0!==a?a:[],W=M.legendSize,[_]=Object(l.useState)((()=>W===c.LegendSize.AUTO)),B=Object(l.useCallback)((e=>e?b.LegendDisplay.SHOW:b.LegendDisplay.HIDE),[]);Object(l.useEffect)((()=>{V(null!=R?R:M.legendDisplay===b.LegendDisplay.SHOW)}),[R,M.legendDisplay]),Object(l.useEffect)((()=>{(async()=>{var t;const s=await(null===(t=e.palettes)||void 0===t?void 0:t.getPalettes());I(s)})()}),[e.palettes]);const k=Object(l.useCallback)((e=>{var t;const s=null===(t=P.find((({id:t})=>t===e)))||void 0===t?void 0:t.value;z("emptySizeRatio",s)}),[z]),H=Object(l.useCallback)((e=>z("legendSize",e)),[z]),G=Object(l.useCallback)(((t,s)=>{var a;V(s);const i=B(s);i===M[t]&&z(t,B(!s)),z(t,i),null===(a=e.uiState)||void 0===a||a.set("vis.legendOpen",s)}),[B,e.uiState,z,M]);return Object(v.jsx)(n.a.Fragment,null,Object(v.jsx)(o.EuiPanel,{paddingSize:"s"},Object(v.jsx)(o.EuiTitle,{size:"xs"},Object(v.jsx)("h3",null,Object(v.jsx)(p.FormattedMessage,{id:"visTypePie.editors.pie.pieSettingsTitle",defaultMessage:"Pie settings"}))),Object(v.jsx)(o.EuiSpacer,{size:"s"}),Object(v.jsx)(r.SwitchOption,{label:d.i18n.translate("visTypePie.editors.pie.donutLabel",{defaultMessage:"Donut"}),paramName:"isDonut",value:M.isDonut,setValue:z,"data-test-subj":"visTypePieIsDonut"}),e.showElasticChartsOptions&&M.isDonut&&Object(v.jsx)(o.EuiFormRow,{label:y,fullWidth:!0},Object(v.jsx)(o.EuiButtonGroup,{isFullWidth:!0,name:"emptySizeRatio",buttonSize:"compressed",legend:y,options:P,idSelected:null!==(T=null===(L=P.find((({value:e})=>e===M.emptySizeRatio)))||void 0===L?void 0:L.id)&&void 0!==T?T:"emptySizeRatioOption-small",onChange:k,"data-test-subj":"visTypePieEmptySizeRatioButtonGroup"})),Object(v.jsx)(r.BasicOptions,i()({},e,{legendPositions:S})),e.showElasticChartsOptions&&Object(v.jsx)(n.a.Fragment,null,Object(v.jsx)(o.EuiFormRow,null,Object(v.jsx)(o.EuiFlexGroup,{alignItems:"center",gutterSize:"xs",responsive:!1},Object(v.jsx)(o.EuiFlexItem,{grow:!1},Object(v.jsx)(r.SwitchOption,{label:d.i18n.translate("visTypePie.editors.pie.distinctColorsLabel",{defaultMessage:"Use distinct colors per slice"}),paramName:"distinctColors",value:M.distinctColors,disabled:(null==U?void 0:U.length)<=1&&!A,setValue:z,"data-test-subj":"visTypePiedistinctColorsSwitch"})),Object(v.jsx)(o.EuiFlexItem,{grow:!1},Object(v.jsx)(o.EuiIconTip,{content:"Use with multi-layer chart or multiple charts.",position:"top",type:"iInCircle",color:"subdued"})))),Object(v.jsx)(r.SwitchOption,{label:d.i18n.translate("visTypePie.editors.pie.legendDisplayLabel",{defaultMessage:"Show legend"}),paramName:"legendDisplay",value:N,setValue:G,"data-test-subj":"visTypePieAddLegendSwitch"}),Object(v.jsx)(r.SwitchOption,{label:d.i18n.translate("visTypePie.editors.pie.nestedLegendLabel",{defaultMessage:"Nest legend"}),paramName:"nestedLegend",value:M.nestedLegend,disabled:M.legendDisplay===b.LegendDisplay.HIDE,setValue:(e,t)=>{z(e,t)},"data-test-subj":"visTypePieNestedLegendSwitch"}),Object(v.jsx)(r.LongLegendOptions,{"data-test-subj":"pieLongLegendsOptions",truncateLegend:null===(f=M.truncateLegend)||void 0===f||f,maxLegendLines:null!==(E=M.maxLegendLines)&&void 0!==E?E:1,setValue:z}),Object(v.jsx)(r.LegendSizeSettings,{legendSize:W,onLegendSizeChange:H,isVerticalLegend:M.legendPosition===u.Position.Left||M.legendPosition===u.Position.Right,showAutoOption:_})),e.showElasticChartsOptions&&C&&Object(v.jsx)(r.PalettePicker,{palettes:C,activePalette:M.palette,paramName:"palette",setPalette:(e,t)=>{z(e,t)}})),Object(v.jsx)(o.EuiSpacer,{size:"s"}),Object(v.jsx)(o.EuiPanel,{paddingSize:"s"},Object(v.jsx)(o.EuiTitle,{size:"xs"},Object(v.jsx)("h3",null,Object(v.jsx)(p.FormattedMessage,{id:"visTypePie.editors.pie.labelsSettingsTitle",defaultMessage:"Labels settings"}))),Object(v.jsx)(o.EuiSpacer,{size:"s"}),Object(v.jsx)(r.SwitchOption,{label:d.i18n.translate("visTypePie.editors.pie.showLabelsLabel",{defaultMessage:"Show labels"}),paramName:"show",value:M.labels.show,setValue:F}),e.showElasticChartsOptions&&Object(v.jsx)(r.SelectOption,{label:d.i18n.translate("visTypePie.editors.pie.labelPositionLabel",{defaultMessage:"Label position"}),disabled:!M.labels.show||A,options:m,paramName:"position",value:A?b.LabelPositions.INSIDE:M.labels.position||b.LabelPositions.DEFAULT,setValue:(e,t)=>{F(e,t)},"data-test-subj":"visTypePieLabelPositionSelect"}),Object(v.jsx)(r.SwitchOption,{label:d.i18n.translate("visTypePie.editors.pie.showTopLevelOnlyLabel",{defaultMessage:"Show top level only"}),disabled:!M.labels.show||e.showElasticChartsOptions&&M.labels.position===b.LabelPositions.INSIDE,paramName:"last_level",value:M.labels.last_level,setValue:F,"data-test-subj":"visTypePieTopLevelSwitch"}),Object(v.jsx)(r.SwitchOption,{label:d.i18n.translate("visTypePie.editors.pie.showValuesLabel",{defaultMessage:"Show values"}),disabled:!M.labels.show,paramName:"values",value:M.labels.values,setValue:F}),e.showElasticChartsOptions&&Object(v.jsx)(n.a.Fragment,null,Object(v.jsx)(r.SelectOption,{label:d.i18n.translate("visTypePie.editors.pie.valueFormatsLabel",{defaultMessage:"Values"}),disabled:!M.labels.values,options:O,paramName:"valuesFormat",value:M.labels.valuesFormat||b.ValueFormats.PERCENT,setValue:(e,t)=>{F(e,t)},"data-test-subj":"visTypePieValueFormatsSelect"}),Object(v.jsx)(h,{paramName:"percentDecimals",value:null!==(w=M.labels.percentDecimals)&&void 0!==w?w:j.DEFAULT_PERCENT_DECIMALS,setValue:F})),Object(v.jsx)(g,{value:M.labels.truncate,setValue:F,disabled:e.showElasticChartsOptions&&M.labels.position===b.LabelPositions.INSIDE})))}}}]);