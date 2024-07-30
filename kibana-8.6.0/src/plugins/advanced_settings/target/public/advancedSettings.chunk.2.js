(window.advancedSettings_bundle_jsonpfunction=window.advancedSettings_bundle_jsonpfunction||[]).push([[2],{22:function(e,a,t){e.exports=t(12)(3)},25:function(e,a,t){"use strict";t.r(a),t.d(a,"Field",(function(){return field_Field})),t.d(a,"getEditableValue",(function(){return f})),t.d(a,"default",(function(){return field_Field}));var n=t(22),s=t.n(n),i=t(2),l=t.n(i),d=t(4),r=t.n(d),o=t(17),c=t.n(o),u=t(1),g=t(0),h=t(9),v=t(18),b=t(16),p=t(3);const m=({value:e,onChange:a,type:t,isReadOnly:n,a11yProps:i,name:l})=>{const r=Object(d.useCallback)((e=>{var a;const t=e.getDomNode();if(!t)return;const n=e.getOption(v.monaco.editor.EditorOption.lineHeight);let s=(null===(a=e.getModel())||void 0===a?void 0:a.getLineCount())||6;s<6?s=6:s>30&&(s=30);const i=n*s;t.id=l,t.style.height=`${i}px`,e.layout()}),[l]),o=Object(d.useCallback)((e=>{const a=e.getModel();if(!a)return;const t=a.getValue().trim();a.setValue(t)}),[]),c=Object(d.useCallback)((e=>{r(e),e.onDidChangeModelContent((()=>{r(e)})),e.onDidBlurEditorWidget((()=>{o(e)}))}),[r,o]);return Object(p.jsx)(b.CodeEditor,s()({},i,{languageId:"json"===t?v.XJsonLang.ID:b.MarkdownLang,value:e,onChange:a,editorDidMount:c,width:"100%",options:{readOnly:n,lineNumbers:"off",scrollBeyondLastLine:!1,automaticLayout:!0,folding:!1,tabSize:2,scrollbar:{alwaysConsumeMouseWheel:!1},wordWrap:"on",wrappingIndent:"indent"}}))};var j=t(10);const f=(e,a,t)=>{const n=null==a?t:a;switch(e){case"array":return n.join(", ");case"boolean":return!!n;case"number":return Number(n);case"image":return n;default:return n||""}};class field_Field extends d.PureComponent{constructor(...e){super(...e),l()(this,"changeImageForm",r.a.createRef()),l()(this,"handleChange",(e=>{this.props.handleChange(this.props.setting.name,e)})),l()(this,"resetField",(()=>{const{type:e,defVal:a}=this.props.setting;return"image"===e?(this.cancelChangeImage(),this.handleChange({value:f(e,a,a),changeImage:!0})):this.handleChange({value:f(e,a)})})),l()(this,"onCodeEditorChange",(e=>{const{defVal:a,type:t}=this.props.setting;let n,s={};if("json"===t){const t=Array.isArray(JSON.parse(a||"{}"));n=e||(t?"[]":"{}");try{JSON.parse(n)}catch(e){s={error:g.i18n.translate("advancedSettings.field.codeEditorSyntaxErrorMessage",{defaultMessage:"Invalid JSON syntax"}),isInvalid:!0}}}else n=e;this.handleChange({value:n,...s})})),l()(this,"onFieldChangeSwitch",(e=>this.onFieldChange(e.target.checked))),l()(this,"onFieldChangeEvent",(e=>this.onFieldChange(e.target.value))),l()(this,"onFieldChange",(e=>{const{type:a,value:t,defVal:n,options:s}=this.props.setting;let i;switch(a){case"boolean":const{unsavedChanges:l}=this.props;i=!(l?l.value:f(a,t,n));break;case"number":i=Number(e);break;case"select":i="number"==typeof(null==s?void 0:s[0])?Number(e):e;break;default:i=e}this.handleChange({value:i})})),l()(this,"onImageChange",(async e=>{if(null==e)return;if(!e.length)return void this.setState({unsavedValue:null});const a=e[0];try{let e="";a instanceof File&&(e=await this.getImageAsBase64(a)),this.handleChange({changeImage:!0,value:e})}catch(e){this.props.toasts.addDanger(g.i18n.translate("advancedSettings.field.imageChangeErrorMessage",{defaultMessage:"Image could not be saved"})),this.cancelChangeImage()}})),l()(this,"changeImage",(()=>{this.handleChange({value:null,changeImage:!0})})),l()(this,"cancelChangeImage",(()=>{var e;null!==(e=this.changeImageForm.current)&&void 0!==e&&e.fileInput&&(this.changeImageForm.current.fileInput.value="",this.changeImageForm.current.handleChange()),this.props.clearChange&&this.props.clearChange(this.props.setting.name)}))}getDisplayedDefaultValue(e,a,t={}){if(null==a||""===a)return"null";switch(e){case"array":return a.join(", ");case"select":return t.hasOwnProperty(String(a))?t[String(a)]:String(a);default:return String(a)}}componentDidUpdate(e){var a,t;"image"!==e.setting.type||null===(a=e.unsavedChanges)||void 0===a||!a.value||null!==(t=this.props.unsavedChanges)&&void 0!==t&&t.value||this.cancelChangeImage()}async getImageAsBase64(e){const a=new FileReader;return a.readAsDataURL(e),new Promise(((e,t)=>{a.onload=()=>{e(a.result)},a.onerror=e=>{t(e)}}))}renderField(e,a){const{enableSaving:t,unsavedChanges:n,loading:i}=this.props,{name:l,value:d,type:r,options:o,optionLabels:c={},isOverridden:g,defVal:v,ariaName:b}=e,C=a?{"aria-label":b,"aria-describedby":a}:{"aria-label":b},O=n?n.value:f(r,d,v);switch(r){case"boolean":return Object(p.jsx)(u.EuiSwitch,s()({label:O?Object(p.jsx)(h.FormattedMessage,{id:"advancedSettings.field.onLabel",defaultMessage:"On"}):Object(p.jsx)(h.FormattedMessage,{id:"advancedSettings.field.offLabel",defaultMessage:"Off"}),checked:!!O,onChange:this.onFieldChangeSwitch,disabled:i||g||!t,"data-test-subj":`advancedSetting-editField-${l}`},C));case"markdown":case"json":return Object(p.jsx)("div",{"data-test-subj":`advancedSetting-editField-${l}`},Object(p.jsx)(m,{value:O,onChange:this.onCodeEditorChange,type:r,isReadOnly:g||!t,a11yProps:C,name:`advancedSetting-editField-${l}-editor`}));case"image":const a=null==n?void 0:n.changeImage;return Object(j.e)(e)||a?Object(p.jsx)(u.EuiFilePicker,{disabled:i||g||!t,onChange:this.onImageChange,accept:".jpg,.jpeg,.png",ref:this.changeImageForm,fullWidth:!0,"data-test-subj":`advancedSetting-editField-${l}`,"aria-label":l}):Object(p.jsx)(u.EuiImage,s()({},C,{allowFullScreen:!0,url:d,alt:l}));case"select":return Object(p.jsx)(u.EuiSelect,s()({},C,{value:O,options:o.map((e=>({text:c.hasOwnProperty(e)?c[e]:e,value:e}))),onChange:this.onFieldChangeEvent,isLoading:i,disabled:i||g||!t,fullWidth:!0,"data-test-subj":`advancedSetting-editField-${l}`}));case"number":return Object(p.jsx)(u.EuiFieldNumber,s()({},C,{value:O,onChange:this.onFieldChangeEvent,isLoading:i,disabled:i||g||!t,fullWidth:!0,"data-test-subj":`advancedSetting-editField-${l}`}));case"color":return Object(p.jsx)(u.EuiColorPicker,s()({},C,{color:O,onChange:this.onFieldChange,disabled:i||g||!t,format:"hex","data-test-subj":`advancedSetting-editField-${l}`}));default:return Object(p.jsx)(u.EuiFieldText,s()({},C,{value:O,onChange:this.onFieldChangeEvent,isLoading:i,disabled:i||g||!t,fullWidth:!0,"data-test-subj":`advancedSetting-editField-${l}`}))}}renderLabel(e){return e.name}renderHelpText(e){if(e.isOverridden)return Object(p.jsx)(u.EuiText,{size:"xs"},Object(p.jsx)(h.FormattedMessage,{id:"advancedSettings.field.helpText",defaultMessage:"This setting is overridden by the Kibana server and can not be changed."}));const a=this.props.enableSaving,t=this.renderResetToDefaultLink(e),n=this.renderChangeImageLink(e);return a&&(t||n)?Object(p.jsx)("span",null,t,n):null}renderTitle(e){const{unsavedChanges:a}=this.props,t=null==a?void 0:a.isInvalid,n=a?t?g.i18n.translate("advancedSettings.field.invalidIconLabel",{defaultMessage:"Invalid"}):g.i18n.translate("advancedSettings.field.unsavedIconLabel",{defaultMessage:"Unsaved"}):void 0;return Object(p.jsx)("h3",null,Object(p.jsx)("span",{className:"mgtAdvancedSettings__fieldTitle"},e.displayName||e.name),e.isCustom?Object(p.jsx)(u.EuiIconTip,{type:"asterisk",color:"primary","aria-label":g.i18n.translate("advancedSettings.field.customSettingAriaLabel",{defaultMessage:"Custom setting"}),content:Object(p.jsx)(h.FormattedMessage,{id:"advancedSettings.field.customSettingTooltip",defaultMessage:"Custom setting"})}):"",a?Object(p.jsx)(u.EuiIconTip,{anchorClassName:"mgtAdvancedSettings__fieldTitleUnsavedIcon",type:t?"alert":"dot",color:t?"danger":"warning","aria-label":n,content:n}):"")}renderDescription(e){let a,t;if(e.deprecation){const a=this.props.docLinks;t=Object(p.jsx)(r.a.Fragment,null,Object(p.jsx)(u.EuiToolTip,{content:e.deprecation.message},Object(p.jsx)(u.EuiBadge,{color:"warning",onClick:()=>{window.open(a.management[e.deprecation.docLinksKey],"_blank")},onClickAriaLabel:g.i18n.translate("advancedSettings.field.deprecationClickAreaLabel",{defaultMessage:"Click to view deprecation documentation for {settingName}.",values:{settingName:e.name}})},"Deprecated")),Object(p.jsx)(u.EuiSpacer,{size:"s"}))}return a=r.a.isValidElement(e.description)?e.description:Object(p.jsx)("div",{dangerouslySetInnerHTML:{__html:e.description||""}}),Object(p.jsx)(d.Fragment,null,t,a,this.renderDefaultValue(e))}renderDefaultValue(e){const{type:a,defVal:t,optionLabels:n}=e;if(!Object(j.e)(e))return Object(p.jsx)(d.Fragment,null,Object(p.jsx)(u.EuiSpacer,{size:"s"}),Object(p.jsx)(u.EuiText,{size:"xs"},"json"===a?Object(p.jsx)(d.Fragment,null,Object(p.jsx)(h.FormattedMessage,{id:"advancedSettings.field.defaultValueTypeJsonText",defaultMessage:"Default: {value}",values:{value:Object(p.jsx)(u.EuiCodeBlock,{language:"json",paddingSize:"s",overflowHeight:t.length>=500?300:void 0},this.getDisplayedDefaultValue(a,t))}})):Object(p.jsx)(d.Fragment,null,Object(p.jsx)(h.FormattedMessage,{id:"advancedSettings.field.defaultValueText",defaultMessage:"Default: {value}",values:{value:Object(p.jsx)(u.EuiCode,null,this.getDisplayedDefaultValue(a,t,n))}}))))}renderResetToDefaultLink(e){var a;const{defVal:t,ariaName:n,name:s}=e;if(t!==(null===(a=this.props.unsavedChanges)||void 0===a?void 0:a.value)&&!Object(j.e)(e)&&!this.props.loading)return Object(p.jsx)("span",null,Object(p.jsx)(u.EuiLink,{"aria-label":g.i18n.translate("advancedSettings.field.resetToDefaultLinkAriaLabel",{defaultMessage:"Reset {ariaName} to default",values:{ariaName:n}}),onClick:this.resetField,"data-test-subj":`advancedSetting-resetField-${s}`},Object(p.jsx)(h.FormattedMessage,{id:"advancedSettings.field.resetToDefaultLinkText",defaultMessage:"Reset to default"})),"   ")}renderChangeImageLink(e){var a;const t=null===(a=this.props.unsavedChanges)||void 0===a?void 0:a.changeImage,{type:n,value:s,ariaName:i,name:l}=e;if("image"===n&&s&&!t)return Object(p.jsx)("span",null,Object(p.jsx)(u.EuiLink,{"aria-label":g.i18n.translate("advancedSettings.field.changeImageLinkAriaLabel",{defaultMessage:"Change {ariaName}",values:{ariaName:i}}),onClick:this.changeImage,"data-test-subj":`advancedSetting-changeImage-${l}`},Object(p.jsx)(h.FormattedMessage,{id:"advancedSettings.field.changeImageLinkText",defaultMessage:"Change image"})))}render(){const{setting:e,unsavedChanges:a}=this.props,t=null==a?void 0:a.error,n=null==a?void 0:a.isInvalid,s=c()("mgtAdvancedSettings__field",{"mgtAdvancedSettings__field--unsaved":a,"mgtAdvancedSettings__field--invalid":n}),i=`${e.name}-group`,l=`${e.name}-unsaved`;return Object(p.jsx)(u.EuiDescribedFormGroup,{id:i,className:s,title:this.renderTitle(e),description:this.renderDescription(e),fullWidth:!0},Object(p.jsx)(u.EuiFormRow,{isInvalid:n,error:t,label:this.renderLabel(e),helpText:this.renderHelpText(e),className:"mgtAdvancedSettings__fieldRow",hasChildLabel:"boolean"!==e.type,fullWidth:!0},Object(p.jsx)(r.a.Fragment,null,this.renderField(e,a?`${i} ${l}`:void 0),a&&Object(p.jsx)(u.EuiScreenReaderOnly,null,Object(p.jsx)("p",{id:`${l}`},a.error?a.error:g.i18n.translate("advancedSettings.field.settingIsUnsaved",{defaultMessage:"Setting is currently not saved."}))))))}}}}]);