(window.customIntegrations_bundle_jsonpfunction=window.customIntegrations_bundle_jsonpfunction||[]).push([[2],{27:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(13),r=n(0),u=o.__importDefault(n(28));t.default=function(e,t){void 0===t&&(t=[]);var n=u.default(e,t,{loading:!0}),o=n[0],a=n[1];return r.useEffect((function(){a()}),[a]),o}},28:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(13),r=n(0),u=o.__importDefault(n(29));t.default=function(e,t,n){void 0===t&&(t=[]),void 0===n&&(n={loading:!1});var a=r.useRef(0),i=u.default(),s=r.useState(n),c=s[0],l=s[1],d=r.useCallback((function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var r=++a.current;return l((function(e){return o.__assign(o.__assign({},e),{loading:!0})})),e.apply(void 0,t).then((function(e){return i()&&r===a.current&&l({value:e,loading:!1}),e}),(function(e){return i()&&r===a.current&&l({error:e,loading:!1}),e}))}),t);return[c,d]}},29:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(0);t.default=function(){var e=o.useRef(!1),t=o.useCallback((function(){return e.current}),[]);return o.useEffect((function(){return e.current=!0,function(){e.current=!1}})),t}},31:function(e,t,n){"use strict";n.r(t),n.d(t,"ReplacementCard",(function(){return p})),n(0);var o=n(27),r=n.n(o),u=n(4),a=n(1),i=n(3),s=n(14),c=n(10);const l=Object(i.htmlIdGenerator)("replacementCard"),d=s.i18n.translate("customIntegrations.components.replacementAccordionLabel",{defaultMessage:"Also available in Beats"}),m=Object(a.jsx)(i.EuiLink,{href:"https://ela.st/beats-agent-comparison","data-test-subj":"customIntegrationsBeatsAgentComparisonLink",external:!0},Object(a.jsx)(c.FormattedMessage,{id:"customIntegrations.components.replacementAccordion.comparisonPageLinkLabel",defaultMessage:"comparison page"})),f=({replacements:e})=>{const{euiTheme:t}=Object(i.useEuiTheme)(),{getAbsolutePath:n}=Object(u.c)();if(0===e.length)return null;const o=e.map(((e,t)=>Object(a.jsx)(i.EuiFlexItem,{grow:!1,key:`button-${t}`},Object(a.jsx)("span",null,Object(a.jsx)(i.EuiButton,{key:e.id,href:n(e.uiInternalPath),fullWidth:!1,size:"s"},e.title)))));return Object(a.jsx)("div",{css:Object(a.css)("& .euiAccordion__button{color:",t.colors.link,";}& .euiAccordion-isOpen .euiAccordion__childWrapper{margin-top:",t.size.m,";}","")},Object(a.jsx)(i.EuiAccordion,{id:l(),buttonContent:d,paddingSize:"none"},Object(a.jsx)(i.EuiPanel,{color:"subdued",hasShadow:!1,paddingSize:"m"},Object(a.jsx)(i.EuiFlexGroup,{direction:"column",gutterSize:"m"},Object(a.jsx)(i.EuiFlexItem,{key:"message"},Object(a.jsx)(i.EuiText,{size:"s"},Object(a.jsx)(c.FormattedMessage,{id:"customIntegrations.components.replacementAccordion.recommendationDescription",defaultMessage:"Elastic Agent Integrations are recommended, but you can also use Beats. For more details, check out our {link}.",values:{link:m}}))),Object(a.jsx)(i.EuiFlexItem,{key:"buttons"},Object(a.jsx)(i.EuiFlexGroup,{direction:"column",gutterSize:"m"},o))))))},p=({eprPackageName:e})=>{const{findReplacementIntegrations:t}=Object(u.b)(),n=r()((async()=>await t({shipper:"beats",eprPackageName:e})),[e]),{loading:o,value:i}=n;return o||!i||0===i.length?null:Object(a.jsx)(f,{replacements:i})};t.default=p}}]);