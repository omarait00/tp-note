/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.spaces_bundle_jsonpfunction=window.spaces_bundle_jsonpfunction||[]).push([[5],{122:function(e,a,t){"use strict";t.r(a),t.d(a,"ManageSpacePage",(function(){return manage_space_page_ManageSpacePage}));var s=t(4),i=t.n(s),n=t(2),l=t(18),c=t.n(l),r=t(1),o=t.n(r),p=t(31),d=t(3),u=t(11),g=t(15),m=t(12),h=t(5),j=t(39);function b(e=""){return e.toLowerCase().replace(/[^a-z0-9_]/g,"-")}var x=t(20);class validate_space_SpaceValidator{constructor(e={}){i()(this,"shouldValidate",void 0),this.shouldValidate=e.shouldValidate||!1}enableValidation(){this.shouldValidate=!0}disableValidation(){this.shouldValidate=!1}validateSpaceName(e){return this.shouldValidate?e.name&&e.name.trim()?e.name.length>1024?v(d.i18n.translate("xpack.spaces.management.validateSpace.nameMaxLengthErrorMessage",{defaultMessage:"Name must not exceed 1024 characters."})):{isInvalid:!1}:v(d.i18n.translate("xpack.spaces.management.validateSpace.requiredNameErrorMessage",{defaultMessage:"Enter a name."})):{isInvalid:!1}}validateSpaceDescription(e){return this.shouldValidate&&e.description&&e.description.length>2e3?v(d.i18n.translate("xpack.spaces.management.validateSpace.describeMaxLengthErrorMessage",{defaultMessage:"Description must not exceed 2000 characters."})):{isInvalid:!1}}validateURLIdentifier(e){return this.shouldValidate?Object(x.a)(e)?{isInvalid:!1}:e.id?function(e=""){return e===b(e)}(e.id)?{isInvalid:!1}:v(d.i18n.translate("xpack.spaces.management.validateSpace.urlIdentifierAllowedCharactersErrorMessage",{defaultMessage:'URL identifier can only contain a-z, 0-9, and the characters "_" and "-".'})):v(d.i18n.translate("xpack.spaces.management.validateSpace.urlIdentifierRequiredErrorMessage",{defaultMessage:"Enter a URL identifier."})):{isInvalid:!1}}validateAvatarInitials(e){if(!this.shouldValidate)return{isInvalid:!1};if("image"!==e.avatarType){if(!e.initials)return v(d.i18n.translate("xpack.spaces.management.validateSpace.requiredInitialsErrorMessage",{defaultMessage:"Enter initials."}));if(e.initials.length>2)return v(d.i18n.translate("xpack.spaces.management.validateSpace.maxLengthInitialsErrorMessage",{defaultMessage:"Enter no more than 2 characters."}))}return{isInvalid:!1}}validateAvatarColor(e){return this.shouldValidate?e.color?Object(n.isValidHex)(e.color)?{isInvalid:!1}:v(d.i18n.translate("xpack.spaces.management.validateSpace.invalidColorErrorMessage",{defaultMessage:"Enter a valid HEX color code."})):v(d.i18n.translate("xpack.spaces.management.validateSpace.requiredColorErrorMessage",{defaultMessage:"Select a background color."})):{isInvalid:!1}}validateAvatarImage(e){return this.shouldValidate?"image"!==e.avatarType||e.imageUrl?{isInvalid:!1}:v(d.i18n.translate("xpack.spaces.management.validateSpace.requiredImageErrorMessage",{defaultMessage:"Upload an image."})):{isInvalid:!1}}validateEnabledFeatures(e){return{isInvalid:!1}}validateForSave(e){const{isInvalid:a}=this.validateSpaceName(e),{isInvalid:t}=this.validateSpaceDescription(e),{isInvalid:s}=this.validateURLIdentifier(e),{isInvalid:i}=this.validateAvatarInitials(e),{isInvalid:n}=this.validateAvatarColor(e),{isInvalid:l}=this.validateAvatarImage(e),{isInvalid:c}=this.validateEnabledFeatures(e);return a||t||s||i||n||l||c?v():{isInvalid:!1}}}function v(e=""){return{isInvalid:!0,error:e}}var f=t(0);const S=Object(u.injectI18n)((e=>Object(f.jsx)(n.EuiConfirmModal,{onConfirm:e.onConfirm,onCancel:e.onCancel,title:Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.confirmAlterActiveSpaceModal.title",defaultMessage:"Confirm update space"}),defaultFocusedButton:"confirm",cancelButtonText:e.intl.formatMessage({id:"xpack.spaces.management.confirmAlterActiveSpaceModal.cancelButton",defaultMessage:"Cancel"}),confirmButtonText:e.intl.formatMessage({id:"xpack.spaces.management.confirmAlterActiveSpaceModal.updateSpaceButton",defaultMessage:"Update space"})},Object(f.jsx)("p",null,Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.confirmAlterActiveSpaceModal.reloadWarningMessage",defaultMessage:"You have updated the visible features in this space. Your page will reload after saving."})))));var O=t(8),M=t.n(O);class section_panel_SectionPanel extends r.Component{constructor(...e){super(...e),i()(this,"getTitle",(()=>Object(f.jsx)(n.EuiFlexGroup,{alignItems:"baseline",gutterSize:"s",responsive:!1},Object(f.jsx)(n.EuiFlexItem,{grow:!1},Object(f.jsx)(n.EuiTitle,{size:"s"},Object(f.jsx)("h2",null,this.props.iconType&&Object(f.jsx)(r.Fragment,null,Object(f.jsx)(n.EuiIcon,{type:this.props.iconType,size:"xl",className:"spcSectionPanel__collapsiblePanelLogo"})," "),this.props.title)))))),i()(this,"getForm",(()=>Object(f.jsx)(r.Fragment,null,Object(f.jsx)(n.EuiSpacer,null),this.props.children)))}render(){return Object(f.jsx)(n.EuiPanel,{hasShadow:!1,hasBorder:!0},this.getTitle(),this.getForm())}}var C=t(41);const E=["image/svg+xml","image/jpeg","image/png","image/gif"];class customize_space_avatar_CustomizeSpaceAvatar extends r.Component{constructor(...e){super(...e),i()(this,"handleImageUpload",(e=>{const a=this,t=new Image;t.addEventListener("load",(function(){const s=64,i=t.width,n=t.height;if(i<=s&&n<=s)a.storeImageChanges(e);else{const e=document.createElement("canvas"),l=e.getContext("2d");if(i>=n){if(e.width=s,e.height=Math.floor(n*s/i),l){l.drawImage(t,0,0,e.width,e.height);const s=e.toDataURL();a.storeImageChanges(s)}}else if(e.height=s,e.width=Math.floor(i*s/n),l){l.drawImage(t,0,0,e.width,e.height);const s=e.toDataURL();a.storeImageChanges(s)}}}),!1),t.src=e})),i()(this,"onFileUpload",(e=>{if(null==e||0===e.length)return void this.storeImageChanges(void 0);const a=e[0];E.indexOf(a.type)>-1&&function(e,a="text/plain"){return FileReader?new Promise(((a,t)=>{const s=new FileReader;s.onloadend=()=>a(s.result),s.onerror=e=>t(e),s.readAsDataURL(e)})):Promise.resolve(`data:${a};base64,${Object(C.fromByteArray)(e)}`)}(a).then((e=>this.handleImageUpload(e)))})),i()(this,"onInitialsChange",(e=>{const a=(e.target.value||"").substring(0,g.MAX_SPACE_INITIALS);this.props.onChange({...this.props.space,customAvatarInitials:!0,initials:a})})),i()(this,"onColorChange",(e=>{this.props.onChange({...this.props.space,customAvatarColor:!0,color:e})}))}storeImageChanges(e){this.props.onChange({...this.props.space,imageUrl:e})}render(){var e,a,t;const{space:s}=this.props;return Object(f.jsx)("form",{onSubmit:()=>!1},Object(f.jsx)(n.EuiFormRow,{label:d.i18n.translate("xpack.spaces.management.customizeSpaceAvatar.avatarTypeFormRowLabel",{defaultMessage:"Avatar type"}),fullWidth:!0},Object(f.jsx)(n.EuiButtonGroup,{legend:"",options:[{id:"initials",label:d.i18n.translate("xpack.spaces.management.customizeSpaceAvatar.initialsLabel",{defaultMessage:"Initials"})},{id:"image",label:d.i18n.translate("xpack.spaces.management.customizeSpaceAvatar.imageLabel",{defaultMessage:"Image"})}],idSelected:null!==(e=s.avatarType)&&void 0!==e?e:"initials",onChange:e=>this.props.onChange({...s,avatarType:e}),buttonSize:"m"})),"image"!==s.avatarType?Object(f.jsx)(n.EuiFormRow,M()({label:d.i18n.translate("xpack.spaces.management.customizeSpaceAvatar.initialsLabel",{defaultMessage:"Initials"}),helpText:d.i18n.translate("xpack.spaces.management.customizeSpaceAvatar.initialsHelpText",{defaultMessage:"Enter up to two characters."})},this.props.validator.validateAvatarInitials(s),{fullWidth:!0}),Object(f.jsx)(n.EuiFieldText,{"data-test-subj":"spaceLetterInitial",name:"spaceInitials",value:null!==(a=s.initials)&&void 0!==a?a:"",onChange:this.onInitialsChange,isInvalid:this.props.validator.validateAvatarInitials(s).isInvalid,fullWidth:!0})):Object(f.jsx)(n.EuiFormRow,M()({label:d.i18n.translate("xpack.spaces.management.customizeSpaceAvatar.imageUrlLabel",{defaultMessage:"Image"})},this.props.validator.validateAvatarImage(s),{fullWidth:!0}),Object(f.jsx)(n.EuiFilePicker,{display:"default","data-test-subj":"uploadCustomImageFile",initialPromptText:d.i18n.translate("xpack.spaces.management.customizeSpaceAvatar.imageUrlPromptText",{defaultMessage:"Select image file"}),onChange:this.onFileUpload,accept:E.join(","),isInvalid:this.props.validator.validateAvatarImage(s).isInvalid,fullWidth:!0})),Object(f.jsx)(n.EuiFormRow,M()({label:d.i18n.translate("xpack.spaces.management.customizeSpaceAvatar.colorLabel",{defaultMessage:"Background color"})},this.props.validator.validateAvatarColor(s),{fullWidth:!0}),Object(f.jsx)(n.EuiColorPicker,{color:null!==(t=s.color)&&void 0!==t?t:"",onChange:this.onColorChange,isInvalid:this.props.validator.validateAvatarColor(s).isInvalid,fullWidth:!0})))}}const I=Object(r.lazy)((()=>Object(h.a)().then((e=>({default:e})))));class customize_space_CustomizeSpace extends r.Component{constructor(...e){super(...e),i()(this,"state",{customizingAvatar:!1,usingCustomIdentifier:!1}),i()(this,"onNameChange",(e=>{if(!this.props.space)return;const a=!this.props.editingExistingSpace&&!this.state.usingCustomIdentifier;let{id:t}=this.props.space;a&&(t=b(e.target.value)),this.props.onChange({...this.props.space,name:e.target.value,id:t,initials:this.props.space.customAvatarInitials?this.props.space.initials:Object(h.d)({name:e.target.value}),color:this.props.space.customAvatarColor?this.props.space.color:Object(h.b)({name:e.target.value})})})),i()(this,"onDescriptionChange",(e=>{this.props.onChange({...this.props.space,description:e.target.value})})),i()(this,"onSpaceIdentifierChange",(e=>{const a=e.target.value,t=a!==b(this.props.space.name);this.setState({usingCustomIdentifier:t}),this.props.onChange({...this.props.space,id:b(a)})})),i()(this,"onAvatarChange",(e=>{this.props.onChange(e)}))}render(){var e;const{validator:a,editingExistingSpace:t,space:s}=this.props,{name:i="",description:l=""}=s,c=d.i18n.translate("xpack.spaces.management.manageSpacePage.generalTitle",{defaultMessage:"General"});return Object(f.jsx)(section_panel_SectionPanel,{title:c},Object(f.jsx)(n.EuiDescribedFormGroup,{title:Object(f.jsx)(n.EuiTitle,{size:"xs"},Object(f.jsx)("h3",null,Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.manageSpacePage.describeSpaceTitle",defaultMessage:"Describe this space"}))),description:d.i18n.translate("xpack.spaces.management.manageSpacePage.describeSpaceDescription",{defaultMessage:"Give your space a name that's memorable."}),fullWidth:!0},Object(f.jsx)(n.EuiFormRow,M()({label:d.i18n.translate("xpack.spaces.management.manageSpacePage.nameFormRowLabel",{defaultMessage:"Name"})},a.validateSpaceName(this.props.space),{fullWidth:!0}),Object(f.jsx)(n.EuiFieldText,{name:"name","data-test-subj":"addSpaceName",value:null!=i?i:"",onChange:this.onNameChange,isInvalid:a.validateSpaceName(this.props.space).isInvalid,fullWidth:!0})),Object(f.jsx)(n.EuiFormRow,M()({"data-test-subj":"optionalDescription",label:d.i18n.translate("xpack.spaces.management.manageSpacePage.spaceDescriptionFormRowLabel",{defaultMessage:"Description"}),labelAppend:Object(f.jsx)(n.EuiText,{color:"subdued",size:"xs"},Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.manageSpacePage.optionalLabel",defaultMessage:"Optional"})),helpText:d.i18n.translate("xpack.spaces.management.manageSpacePage.spaceDescriptionHelpText",{defaultMessage:"The description appears on the space selection screen."})},a.validateSpaceDescription(this.props.space),{fullWidth:!0}),Object(f.jsx)(n.EuiTextArea,{"data-test-subj":"descriptionSpaceText",name:"description",value:null!=l?l:"",onChange:this.onDescriptionChange,isInvalid:a.validateSpaceDescription(this.props.space).isInvalid,fullWidth:!0,rows:2})),t?null:Object(f.jsx)(n.EuiFormRow,M()({label:Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.spaceIdentifier.urlIdentifierTitle",defaultMessage:"URL identifier"}),helpText:Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.spaceIdentifier.kibanaURLForSpaceIdentifierDescription",defaultMessage:"You can't change the URL identifier once created."})},this.props.validator.validateURLIdentifier(this.props.space),{fullWidth:!0}),Object(f.jsx)(n.EuiFieldText,{"data-test-subj":"spaceURLDisplay",value:null!==(e=this.props.space.id)&&void 0!==e?e:"",onChange:this.onSpaceIdentifierChange,isInvalid:this.props.validator.validateURLIdentifier(this.props.space).isInvalid,fullWidth:!0}))),Object(f.jsx)(n.EuiDescribedFormGroup,{title:Object(f.jsx)(n.EuiTitle,{size:"xs"},Object(f.jsx)("h3",null,Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.manageSpacePage.avatarTitle",defaultMessage:"Create an avatar"}))),description:Object(f.jsx)(o.a.Fragment,null,Object(f.jsx)("p",null,d.i18n.translate("xpack.spaces.management.manageSpacePage.avatarDescription",{defaultMessage:"Choose how your space avatar appears across Kibana."})),"image"===s.avatarType?Object(f.jsx)(r.Suspense,{fallback:Object(f.jsx)(n.EuiLoadingSpinner,null)},Object(f.jsx)(I,{space:{...s,initials:"?",name:void 0},size:"xl"})):Object(f.jsx)(r.Suspense,{fallback:Object(f.jsx)(n.EuiLoadingSpinner,null)},Object(f.jsx)(I,{space:{name:"?",...s,imageUrl:void 0},size:"xl"}))),fullWidth:!0},Object(f.jsx)(customize_space_avatar_CustomizeSpaceAvatar,{space:this.props.space,onChange:this.onAvatarChange,validator:a})))}}var F=t(36);class delete_spaces_button_DeleteSpacesButton extends r.Component{constructor(...e){super(...e),i()(this,"state",{showConfirmDeleteModal:!1,showConfirmRedirectModal:!1}),i()(this,"onDeleteClick",(()=>{this.setState({showConfirmDeleteModal:!0})})),i()(this,"getConfirmDeleteModal",(()=>{if(!this.state.showConfirmDeleteModal)return null;const{spacesManager:e}=this.props;return Object(f.jsx)(F.a,{space:this.props.space,spacesManager:e,onCancel:()=>{this.setState({showConfirmDeleteModal:!1})},onSuccess:()=>{var e,a;this.setState({showConfirmDeleteModal:!1}),null===(e=(a=this.props).onDelete)||void 0===e||e.call(a)}})}))}render(){const e=Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.deleteSpacesButton.deleteSpaceButtonLabel",defaultMessage:"Delete space"});let a,t=n.EuiButton;return"icon"===this.props.style&&(t=n.EuiButtonIcon,a={iconType:"trash"}),Object(f.jsx)(r.Fragment,null,Object(f.jsx)(t,M()({color:"danger",onClick:this.onDeleteClick,"aria-label":d.i18n.translate("xpack.spaces.management.deleteSpacesButton.deleteSpaceAriaLabel",{defaultMessage:"Delete this space"})},a),e),this.getConfirmDeleteModal())}}var k=t(9),y=t(38);class feature_table_FeatureTable extends r.Component{constructor(e){super(e),i()(this,"featureCategories",new Map),i()(this,"onChange",(e=>a=>{const t={...this.props.space};let s=t.disabledFeatures||[];s=a.target.checked?s.filter((a=>a!==e)):c.a.uniq([...s,e]),t.disabledFeatures=s,this.props.onChange(t)})),i()(this,"getAllFeatureIds",(()=>[...this.featureCategories.values()].flat().map((e=>e.id)))),i()(this,"hideAll",(()=>{this.setFeaturesVisibility(this.getAllFeatureIds(),!1)})),i()(this,"showAll",(()=>{this.setFeaturesVisibility(this.getAllFeatureIds(),!0)})),i()(this,"setFeaturesVisibility",((e,a)=>{const t={...this.props.space};var s,i;t.disabledFeatures=a?(null!==(s=t.disabledFeatures)&&void 0!==s?s:[]).filter((a=>!e.includes(a))):Array.from(new Set([...null!==(i=t.disabledFeatures)&&void 0!==i?i:[],...e])),this.props.onChange(t)})),i()(this,"getCategoryHelpText",(e=>{if("management"===e.id)return d.i18n.translate("xpack.spaces.management.managementCategoryHelpText",{defaultMessage:"Access to Stack Management is determined by your privileges, and cannot be hidden by Spaces."})})),e.features.forEach((e=>{this.featureCategories.has(e.category.id)||this.featureCategories.set(e.category.id,[]),this.featureCategories.get(e.category.id).push(e)}))}render(){const{space:e}=this.props,a=[];this.featureCategories.forEach((t=>{var s;const{category:i}=t[0],l=t.length,c=Object(y.a)(t,e).length,r=t.length>1,p={id:`featureCategoryCheckbox_${i.id}`,indeterminate:c>0&&c<l,checked:l===c,"aria-label":d.i18n.translate("xpack.spaces.management.enabledFeatures.featureCategoryButtonLabel",{defaultMessage:"Category toggle"}),onClick:e=>{e.stopPropagation()},onChange:e=>{this.setFeaturesVisibility(t.map((e=>e.id)),e.target.checked)}},u=Object(f.jsx)(n.EuiFlexGroup,{"data-test-subj":`featureCategoryButton_${i.id}`,alignItems:"center",responsive:!1,gutterSize:"s",onClick:()=>{if(!r){const e=c>0;this.setFeaturesVisibility(t.map((e=>e.id)),!e)}}},i.euiIconType?Object(f.jsx)(n.EuiFlexItem,{grow:!1},Object(f.jsx)(n.EuiIcon,{size:"m",type:i.euiIconType})):null,Object(f.jsx)(n.EuiFlexItem,{grow:1},Object(f.jsx)(n.EuiTitle,{size:"xxs"},Object(f.jsx)("h4",null,i.label)))),g=d.i18n.translate("xpack.spaces.management.featureAccordionSwitchLabel",{defaultMessage:"{enabledCount}/{featureCount} features visible",values:{enabledCount:c,featureCount:l}}),m=Object(f.jsx)(n.EuiText,{size:"xs","aria-hidden":"true",color:"subdued"},g),h=this.getCategoryHelpText(i),j=Object(f.jsx)(n.EuiFlexGroup,{key:i.id,alignItems:"baseline",responsive:!1,gutterSize:"s"},Object(f.jsx)(n.EuiFlexItem,{grow:!1},Object(f.jsx)(n.EuiCheckbox,p)),Object(f.jsx)(n.EuiFlexItem,{grow:1},Object(f.jsx)(n.EuiAccordion,{id:`featureCategory_${i.id}`,"data-test-subj":`featureCategory_${i.id}`,arrowDisplay:r?"right":"none",forceState:r?void 0:"closed",buttonContent:u,extraAction:r?m:void 0},Object(f.jsx)(n.EuiSpacer,{size:"m"}),h&&Object(f.jsx)(o.a.Fragment,null,Object(f.jsx)(n.EuiCallOut,{iconType:"iInCircle",size:"s"},h),Object(f.jsx)(n.EuiSpacer,{size:"m"})),t.map((a=>{const t=!(e.disabledFeatures&&e.disabledFeatures.includes(a.id));return Object(f.jsx)(n.EuiFlexGroup,{key:`${a.id}-toggle`},Object(f.jsx)(n.EuiFlexItem,{grow:!1},Object(f.jsx)(n.EuiCheckbox,{id:`featureCheckbox_${a.id}`,"data-test-subj":`featureCheckbox_${a.id}`,checked:t,onChange:this.onChange(a.id),label:a.name})))})))));a.push({order:null!==(s=i.order)&&void 0!==s?s:Number.MAX_SAFE_INTEGER,element:j})})),a.sort(((e,a)=>e.order-a.order));const t=this.props.features.length,s=Object(y.a)(this.props.features,this.props.space).length,i=[];return s<t&&i.push(Object(f.jsx)(n.EuiButtonEmpty,{onClick:()=>this.showAll(),size:"xs","data-test-subj":"showAllFeaturesLink"},d.i18n.translate("xpack.spaces.management.selectAllFeaturesLink",{defaultMessage:"Show all"}))),s>0&&i.push(Object(f.jsx)(n.EuiButtonEmpty,{onClick:()=>this.hideAll(),size:"xs","data-test-subj":"hideAllFeaturesLink"},d.i18n.translate("xpack.spaces.management.deselectAllFeaturesLink",{defaultMessage:"Hide all"}))),Object(f.jsx)("div",null,Object(f.jsx)(n.EuiFlexGroup,{alignItems:"center",gutterSize:"s",responsive:!1},Object(f.jsx)(n.EuiFlexItem,null,Object(f.jsx)(n.EuiText,{size:"xs"},Object(f.jsx)("b",null,d.i18n.translate("xpack.spaces.management.featureVisibilityTitle",{defaultMessage:"Feature visibility"})))),i.map(((e,a)=>Object(f.jsx)(n.EuiFlexItem,{grow:!1,key:a},e)))),Object(f.jsx)(n.EuiHorizontalRule,{margin:"m"}),a.flatMap(((e,a)=>[e.element,Object(f.jsx)(n.EuiHorizontalRule,{key:`accordion-hr-${a}`,margin:"m"})])))}}const A=e=>{var a,t,s,i;const{services:l}=Object(k.useKibana)(),c=!0===(null===(a=l.application)||void 0===a||null===(t=a.capabilities.management)||void 0===t||null===(s=t.security)||void 0===s?void 0:s.roles);return Object(f.jsx)(section_panel_SectionPanel,{title:d.i18n.translate("xpack.spaces.management.manageSpacePage.featuresTitle",{defaultMessage:"Features"}),"data-test-subj":"enabled-features-panel"},Object(f.jsx)(n.EuiFlexGroup,null,Object(f.jsx)(n.EuiFlexItem,null,Object(f.jsx)(n.EuiTitle,{size:"xs"},Object(f.jsx)("h3",null,Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.enabledSpaceFeatures.enableFeaturesInSpaceMessage",defaultMessage:"Set feature visibility"}))),Object(f.jsx)(n.EuiSpacer,{size:"s"}),Object(f.jsx)(n.EuiText,{size:"s",color:"subdued"},Object(f.jsx)("p",null,Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.enabledSpaceFeatures.notASecurityMechanismMessage",defaultMessage:"Hidden features are removed from the user interface, but not disabled. To secure access to features, {manageRolesLink}.",values:{manageRolesLink:c?Object(f.jsx)(n.EuiLink,{href:null===(i=l.application)||void 0===i?void 0:i.getUrlForApp("management",{path:"/security/roles"})},Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.enabledSpaceFeatures.manageRolesLinkText",defaultMessage:"manage security roles"})):Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.enabledSpaceFeatures.manageRolesLinkText",defaultMessage:"manage security roles"})}})))),Object(f.jsx)(n.EuiFlexItem,null,Object(f.jsx)(feature_table_FeatureTable,{features:e.features,space:e.space,onChange:e.onChange}))))};class manage_space_page_ManageSpacePage extends r.Component{constructor(e){super(e),i()(this,"validator",void 0),i()(this,"getLoadingIndicator",(()=>Object(f.jsx)(n.EuiPageContent_Deprecated,{verticalPosition:"center",horizontalPosition:"center",color:"subdued"},Object(f.jsx)(p.SectionLoading,null,Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.manageSpacePage.loadingMessage",defaultMessage:"Loading…"}))))),i()(this,"getForm",(()=>{const{showAlteringActiveSpaceDialog:e}=this.state;return Object(f.jsx)("div",{"data-test-subj":"spaces-edit-page"},Object(f.jsx)(customize_space_CustomizeSpace,{space:this.state.space,onChange:this.onSpaceChange,editingExistingSpace:this.editingExistingSpace(),validator:this.validator}),Object(f.jsx)(n.EuiSpacer,null),Object(f.jsx)(A,{space:this.state.space,features:this.state.features,onChange:this.onSpaceChange}),Object(f.jsx)(n.EuiSpacer,null),this.getFormButtons(),e&&Object(f.jsx)(S,{onConfirm:()=>this.performSave(!0),onCancel:()=>{this.setState({showAlteringActiveSpaceDialog:!1})}}))})),i()(this,"getTitle",(()=>this.editingExistingSpace()?Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.manageSpacePage.editSpaceTitle",defaultMessage:"Edit space"}):Object(f.jsx)(u.FormattedMessage,{id:"xpack.spaces.management.manageSpacePage.createSpaceTitle",defaultMessage:"Create space"}))),i()(this,"getFormButtons",(()=>{const e=d.i18n.translate("xpack.spaces.management.manageSpacePage.createSpaceButton",{defaultMessage:"Create space"}),a=d.i18n.translate("xpack.spaces.management.manageSpacePage.updateSpaceButton",{defaultMessage:"Update space"}),t=d.i18n.translate("xpack.spaces.management.manageSpacePage.cancelSpaceButton",{defaultMessage:"Cancel"}),s=this.editingExistingSpace()?a:e;return Object(f.jsx)(n.EuiFlexGroup,{responsive:!1},Object(f.jsx)(n.EuiFlexItem,{grow:!1},Object(f.jsx)(n.EuiButton,{fill:!0,onClick:this.saveSpace,"data-test-subj":"save-space-button",isLoading:this.state.saveInProgress},s)),Object(f.jsx)(n.EuiFlexItem,{grow:!1},Object(f.jsx)(n.EuiButtonEmpty,{onClick:this.backToSpacesList,"data-test-subj":"cancel-space-button"},t)),Object(f.jsx)(n.EuiFlexItem,{grow:!0}),this.getActionButton())})),i()(this,"getActionButton",(()=>this.state.space&&this.editingExistingSpace()&&!Object(g.isReservedSpace)(this.state.space)?Object(f.jsx)(n.EuiFlexItem,{grow:!1},Object(f.jsx)(delete_spaces_button_DeleteSpacesButton,{"data-test-subj":"delete-space-button",space:this.state.space,spacesManager:this.props.spacesManager,onDelete:this.backToSpacesList,notifications:this.props.notifications})):null)),i()(this,"onSpaceChange",(e=>{this.setState({space:e})})),i()(this,"saveSpace",(()=>{this.validator.enableValidation();const e=this.state.originalSpace,a=this.state.space,t=this.validator.validateForSave(a);if(t.isInvalid)this.setState({formError:t});else if(this.editingExistingSpace()){const{spacesManager:t}=this.props;t.getActiveSpace().then((t=>{const s=t.id===e.id,i=a.disabledFeatures.length!==e.disabledFeatures.length||Object(l.difference)(a.disabledFeatures,e.disabledFeatures).length>0;s&&i?this.setState({showAlteringActiveSpaceDialog:!0}):this.performSave()}))}else this.performSave()})),i()(this,"loadSpace",(async(e,a)=>{const{spacesManager:t,onLoadSpace:s}=this.props;try{const[i,n]=await Promise.all([t.getSpace(e),a]);i&&(s&&s(i),this.setState({space:{...i,avatarType:i.imageUrl?"image":"initials",initials:i.initials||Object(h.d)(i),color:i.color||Object(h.b)(i),customIdentifier:!1,customAvatarInitials:!!i.initials&&Object(h.d)({name:i.name})!==i.initials,customAvatarColor:!!i.color&&Object(h.b)({name:i.name})!==i.color},features:n,originalSpace:i,isLoading:!1}))}catch(e){var i,n;const a=null!==(i=null==e||null===(n=e.body)||void 0===n?void 0:n.message)&&void 0!==i?i:"";this.props.notifications.toasts.addDanger(d.i18n.translate("xpack.spaces.management.manageSpacePage.errorLoadingSpaceTitle",{defaultMessage:"Error loading space: {message}",values:{message:a}})),this.backToSpacesList()}})),i()(this,"performSave",((e=!1)=>{if(!this.state.space)return;const a=this.state.space.name||"",{id:t=b(a),description:s,initials:i,color:l,disabledFeatures:c=[],imageUrl:r,avatarType:o}=this.state.space,p={name:a,id:t,description:s,initials:"image"!==o?i:"",color:l?Object(n.hsvToHex)(Object(n.hexToHsv)(l)).toUpperCase():l,disabledFeatures:c,imageUrl:"image"===o?r:""};let u;u=this.editingExistingSpace()?this.props.spacesManager.updateSpace(p):this.props.spacesManager.createSpace(p),this.setState({saveInProgress:!0}),u.then((()=>{this.props.notifications.toasts.addSuccess(d.i18n.translate("xpack.spaces.management.manageSpacePage.spaceSuccessfullySavedNotificationMessage",{defaultMessage:"Space {name} was saved.",values:{name:`'${a}'`}})),this.backToSpacesList(),e&&setTimeout((()=>{window.location.reload()}))})).catch((e=>{var a,t;const s=null!==(a=null==e||null===(t=e.body)||void 0===t?void 0:t.message)&&void 0!==a?a:"";this.setState({saveInProgress:!1}),this.props.notifications.toasts.addDanger(d.i18n.translate("xpack.spaces.management.manageSpacePage.errorSavingSpaceTitle",{defaultMessage:"Error saving space: {message}",values:{message:s}}))}))})),i()(this,"backToSpacesList",(()=>this.props.history.push("/"))),i()(this,"editingExistingSpace",(()=>!!this.props.spaceId)),this.validator=new validate_space_SpaceValidator({shouldValidate:!1}),this.state={isLoading:!0,showAlteringActiveSpaceDialog:!1,saveInProgress:!1,space:{color:Object(h.b)({})},features:[]}}async componentDidMount(){if(!this.props.capabilities.spaces.manage)return;const{spaceId:e,getFeatures:a,notifications:t}=this.props;try{if(e)await this.loadSpace(e,a());else{const e=await a();this.setState({isLoading:!1,features:e})}}catch(e){t.toasts.addError(e,{title:d.i18n.translate("xpack.spaces.management.manageSpacePage.loadErrorTitle",{defaultMessage:"Error loading available features"})})}}async componentDidUpdate(e){this.props.spaceId!==e.spaceId&&this.props.spaceId&&await this.loadSpace(this.props.spaceId,Promise.resolve(this.state.features))}render(){return this.props.capabilities.spaces.manage?this.state.isLoading?this.getLoadingIndicator():Object(f.jsx)(n.EuiPageContentBody_Deprecated,{restrictWidth:!0},Object(f.jsx)(n.EuiPageHeader,{pageTitle:this.getTitle(),description:Object(m.b)()}),Object(f.jsx)(n.EuiSpacer,{size:"l"}),this.getForm()):Object(f.jsx)(n.EuiPageContent_Deprecated,{verticalPosition:"center",horizontalPosition:"center",color:"danger"},Object(f.jsx)(j.b,null))}}},36:function(e,a,t){"use strict";t.d(a,"a",(function(){return m}));var s=t(2),i=t(1),n=t.n(i),l=t(16),c=t.n(l),r=t(26),o=t.n(r),p=t(3),d=t(11),u=t(9),g=t(0);const m=({space:e,onSuccess:a,onCancel:t,spacesManager:i})=>{const{services:l}=Object(u.useKibana)(),{value:r}=c()((async()=>e.id===(await i.getActiveSpace()).id),[e.id]),[m,h]=o()((async()=>{try{await i.deleteSpace(e),l.notifications.toasts.addSuccess(p.i18n.translate("xpack.spaces.management.confirmDeleteModal.successMessage",{defaultMessage:"Deleted space '{name}'",values:{name:e.name}})),r?i.redirectToSpaceSelector():null==a||a()}catch(a){var t;l.notifications.toasts.addDanger({title:p.i18n.translate("xpack.spaces.management.confirmDeleteModal.errorMessage",{defaultMessage:"Could not delete space '{name}'",values:{name:e.name}}),text:(null===(t=a.body)||void 0===t?void 0:t.message)||a.message})}}),[r]);return Object(g.jsx)(s.EuiConfirmModal,{title:p.i18n.translate("xpack.spaces.management.confirmDeleteModal.title",{defaultMessage:"Delete space '{name}'?",values:{name:e.name}}),onCancel:t,onConfirm:h,cancelButtonText:p.i18n.translate("xpack.spaces.management.confirmDeleteModal.cancelButton",{defaultMessage:"Cancel"}),confirmButtonText:p.i18n.translate("xpack.spaces.management.confirmDeleteModal.confirmButton",{defaultMessage:"{isLoading, select, true{Deleting space and all contents…} other{Delete space and all contents}}",values:{isLoading:m.loading}}),buttonColor:"danger",isLoading:m.loading},r&&Object(g.jsx)(n.a.Fragment,null,Object(g.jsx)(s.EuiCallOut,{color:"warning",iconType:"alert",title:p.i18n.translate("xpack.spaces.management.confirmDeleteModal.currentSpaceTitle",{defaultMessage:"You are currently in this space."})},Object(g.jsx)(d.FormattedMessage,{id:"xpack.spaces.management.confirmDeleteModal.currentSpaceDescription",defaultMessage:"Once deleted, you must choose a different space."})),Object(g.jsx)(s.EuiSpacer,null)),Object(g.jsx)(s.EuiText,null,Object(g.jsx)("p",null,Object(g.jsx)(d.FormattedMessage,{id:"xpack.spaces.management.confirmDeleteModal.description",defaultMessage:"This space and {allContents} will be permanently deleted.",values:{allContents:Object(g.jsx)("strong",null,Object(g.jsx)(d.FormattedMessage,{id:"xpack.spaces.management.confirmDeleteModal.allContents",defaultMessage:"all contents"}))}})),Object(g.jsx)("p",null,Object(g.jsx)(d.FormattedMessage,{id:"xpack.spaces.management.confirmDeleteModal.cannotUndoWarning",defaultMessage:"You can't recover deleted spaces."}))))}},38:function(e,a,t){"use strict";function s(e,a){return e.filter((e=>!(a.disabledFeatures||[]).includes(e.id)))}t.d(a,"a",(function(){return s}))},39:function(e,a,t){"use strict";t.d(a,"a",(function(){return s.a})),t.d(a,"b",(function(){return c}));var s=t(36),i=t(2),n=(t(1),t(11)),l=t(0);const c=()=>Object(l.jsx)(i.EuiEmptyPrompt,{iconType:"spacesApp",iconColor:"danger",title:Object(l.jsx)("h2",null,Object(l.jsx)(n.FormattedMessage,{id:"xpack.spaces.management.unauthorizedPrompt.permissionDeniedTitle",defaultMessage:"Permission denied"})),body:Object(l.jsx)("p",{"data-test-subj":"permissionDeniedMessage"},Object(l.jsx)(n.FormattedMessage,{id:"xpack.spaces.management.unauthorizedPrompt.permissionDeniedDescription",defaultMessage:"You don't have permission to manage spaces."}))})},41:function(e,a,t){e.exports=t(17)(2729)}}]);