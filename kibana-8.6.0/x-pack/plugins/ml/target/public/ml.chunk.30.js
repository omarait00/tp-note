/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.ml_bundle_jsonpfunction=window.ml_bundle_jsonpfunction||[]).push([[30],{638:function(a,e,n){"use strict";n.r(e),n.d(e,"anomalyLayerWizard",(function(){return t}));var s=n(2),i=n(52);const t={categories:[i.LAYER_WIZARD_CATEGORY.SOLUTIONS,i.LAYER_WIZARD_CATEGORY.ELASTICSEARCH],description:s.i18n.translate("xpack.ml.maps.anomalyLayerDescription",{defaultMessage:"Display anomalies from a machine learning job"}),disabledReason:s.i18n.translate("xpack.ml.maps.anomalyLayerUnavailableMessage",{defaultMessage:"Anomalies layers are a subscription feature. Ensure you have the right subscription and access to Machine Learning."}),icon:"outlierDetectionJob",getIsDisabled:()=>!1,title:s.i18n.translate("xpack.ml.maps.anomalyLayerTitle",{defaultMessage:"ML Anomalies"}),order:100}}}]);