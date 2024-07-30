/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements. 
 * Licensed under the Elastic License 2.0; you may not use this file except in compliance with the Elastic License 2.0. */
(window.securitySolution_bundle_jsonpfunction=window.securitySolution_bundle_jsonpfunction||[]).push([[3],{1087:function(n,t,e){"use strict";e.d(t,"a",(function(){return l})),e.d(t,"b",(function(){return I})),e.d(t,"c",(function(){return b}));var r=e(208),i=e.n(r),o=e(34),u=function(n){var t=n.map((function(n){if(null!=n.message)return n.message;var t=n.context.filter((function(n){return null!=n.key&&!Number.isInteger(+n.key)&&""!==n.key.trim()})).map((function(n){return n.key})).join(","),e=n.context.find((function(n){return null!=n.type&&null!=n.type.name&&n.type.name.length>0})),r=""!==t?t:null!=e?e.type.name:"",i=Object(o.isObject)(n.value)?JSON.stringify(n.value):n.value;return'Invalid value "'.concat(i,'" supplied to "').concat(r,'"')}));return i()(new Set(t))},a=e(43),c=e.n(a),f=e(52),p=e.n(f),l=function(n){var t=!isNaN(Date.parse(n)),e=t||n.trim().startsWith("now"),r=t?c()(n):e?p.a.parse(n):null;return null!=r?r:null},m=e(1242),s=e.n(m),h=e(597),d=e(850),g=function n(t,e){if(null===e&&null===t)return[];if(null!=e){if("object"!==s()(t)||null==t)return[];var r=Object.keys(e);return Object.keys(t).flatMap((function(u){var a=r.some((function(n){return n===u}))?[]:[u],c=Object(o.get)(u,t),f=Object(o.get)(u,e);return Object(o.isObject)(c)?[].concat(a,i()(n(c,f))):Array.isArray(c)?[].concat(a,i()(c.flatMap((function(t,e){return n(t,Object(o.get)(e,f))})))):a}))}try{return[JSON.stringify(t)]}catch(n){return["circular reference"]}},v=(Object(h.fold)((function(n){return{schema:{},errors:n}}),(function(n){return{schema:n,errors:[]}})),e(1104),e(80)),I=function(n,t){var e,r,i=(e=n,r=t.decode(n),Object(d.pipe)(r,Object(h.fold)((function(n){return Object(h.left)(n)}),(function(n){var t=g(e,n);if(0!==t.length){var r=[{value:t,context:[],message:'invalid keys "'.concat(t.join(","),'"')}];return Object(h.left)(r)}return Object(h.right)(n)}))));return Object(d.pipe)(i,Object(h.fold)((function(n){return[null,u(n).join(",")]}),(function(n){return[n,null]})))},b=function(n,t){return Object(d.pipe)(t,(function(t){return n.validate(t,v.getDefaultContext(n.asDecoder()))}),Object(h.mapLeft)((function(n){return new Error(u(n).join(","))})))}},1104:function(n,t,e){"use strict";var r=this&&this.__createBinding||(Object.create?function(n,t,e,r){void 0===r&&(r=e),Object.defineProperty(n,r,{enumerable:!0,get:function(){return t[e]}})}:function(n,t,e,r){void 0===r&&(r=e),n[r]=t[e]}),i=this&&this.__setModuleDefault||(Object.create?function(n,t){Object.defineProperty(n,"default",{enumerable:!0,value:t})}:function(n,t){n.default=t}),o=this&&this.__importStar||function(n){if(n&&n.__esModule)return n;var t={};if(null!=n)for(var e in n)"default"!==e&&Object.prototype.hasOwnProperty.call(n,e)&&r(t,n,e);return i(t,n),t};Object.defineProperty(t,"__esModule",{value:!0}),t.apS=t.apSW=t.bind=t.bindW=t.bindTo=t.bracket=t.taskify=t.taskEitherSeq=t.taskEither=t.Alt=t.Bifunctor=t.ApplicativeSeq=t.ApplicativePar=t.Functor=t.getFilterable=t.getTaskValidation=t.getAltTaskValidation=t.getApplicativeTaskValidation=t.getApplyMonoid=t.getApplySemigroup=t.getSemigroup=t.URI=t.throwError=t.fromTask=t.fromIO=t.of=t.alt=t.flatten=t.chainFirst=t.chainFirstW=t.chain=t.chainW=t.apSecond=t.apFirst=t.ap=t.apW=t.mapLeft=t.bimap=t.map=t.chainIOEitherK=t.chainIOEitherKW=t.chainEitherK=t.chainEitherKW=t.fromIOEitherK=t.fromEitherK=t.tryCatchK=t.filterOrElse=t.swap=t.orElse=t.getOrElse=t.getOrElseW=t.fold=t.tryCatch=t.fromPredicate=t.fromOption=t.fromEither=t.fromIOEither=t.leftIO=t.rightIO=t.leftTask=t.rightTask=t.right=t.left=void 0;var u=o(e(597)),a=e(1243),c=e(401),f=o(e(1246));function p(n,t){return function(){return n().then(u.right,(function(n){return u.left(t(n))}))}}function l(n){return function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return t.fromEither(n.apply(void 0,e))}}function m(n){return function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return t.fromIOEither(n.apply(void 0,e))}}t.left=c.flow(u.left,f.of),t.right=c.flow(u.right,f.of),t.rightTask=f.map(u.right),t.leftTask=f.map(u.left),t.rightIO=c.flow(f.fromIO,t.rightTask),t.leftIO=c.flow(f.fromIO,t.leftTask),t.fromIOEither=f.fromIO,t.fromEither=u.fold(t.left,(function(n){return t.right(n)})),t.fromOption=function(n){return function(e){return"None"===e._tag?t.left(n()):t.right(e.value)}},t.fromPredicate=function(n,e){return function(r){return n(r)?t.right(r):t.left(e(r))}},t.tryCatch=p,t.fold=c.flow(u.fold,f.chain),t.getOrElseW=function(n){return function(t){return c.pipe(t,f.chain(u.fold(n,f.of)))}},t.getOrElse=t.getOrElseW,t.orElse=function(n){return f.chain(u.fold(n,t.right))},t.swap=f.map(u.swap),t.filterOrElse=function(n,e){return t.chain((function(r){return n(r)?t.right(r):t.left(e(r))}))},t.tryCatchK=function(n,t){return function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return p((function(){return n.apply(void 0,e)}),t)}},t.fromEitherK=l,t.fromIOEitherK=m,t.chainEitherKW=function(n){return t.chainW(l(n))},t.chainEitherK=t.chainEitherKW,t.chainIOEitherKW=function(n){return t.chainW(m(n))},t.chainIOEitherK=t.chainIOEitherKW;var s=function(n,e){return c.pipe(n,t.map(e))},h=function(n,e,r){return c.pipe(n,t.bimap(e,r))},d=function(n,e){return c.pipe(n,t.mapLeft(e))},g=function(n,e){return c.pipe(n,t.ap(e))},v=function(n,e){return c.pipe(n,t.chain((function(n){return c.pipe(e,t.map(n))})))},I=function(n,e){return c.pipe(n,t.chain(e))},b=function(n,e){return c.pipe(n,t.alt(e))};function y(n){return f.getSemigroup(u.getApplySemigroup(n))}function O(n,e){var r=u.getApplicativeValidation(e);return{URI:t.URI,_E:void 0,map:s,ap:function(t,e){return c.pipe(t,(i=e,function(t){return n.ap(n.map(t,(function(n){return function(t){return r.ap(n,t)}})),i)}));var i},of:t.of}}function R(n){return{URI:t.URI,_E:void 0,map:s,alt:function(t,e){return c.pipe(t,f.chain((function(t){return u.isRight(t)?f.of(t):c.pipe(e(),f.map((function(e){return u.isLeft(e)?u.left(n.concat(t.left,e.left)):e})))})))}}}t.map=function(n){return f.map(u.map(n))},t.bimap=c.flow(u.bimap,f.map),t.mapLeft=function(n){return f.map(u.mapLeft(n))},t.apW=function(n){return c.flow(f.map((function(n){return function(t){return u.apW(t)(n)}})),f.ap(n))},t.ap=t.apW,t.apFirst=function(n){return c.flow(t.map((function(n){return function(){return n}})),t.ap(n))},t.apSecond=function(n){return c.flow(t.map((function(){return function(n){return n}})),t.ap(n))},t.chainW=function(n){return function(e){return c.pipe(e,f.chain(u.fold(t.left,n)))}},t.chain=t.chainW,t.chainFirstW=function(n){return t.chainW((function(e){return c.pipe(n(e),t.map((function(){return e})))}))},t.chainFirst=t.chainFirstW,t.flatten=t.chain(c.identity),t.alt=function(n){return f.chain(u.fold(n,t.right))},t.of=t.right,t.fromIO=t.rightIO,t.fromTask=t.rightTask,t.throwError=t.left,t.URI="TaskEither",t.getSemigroup=function(n){return f.getSemigroup(u.getSemigroup(n))},t.getApplySemigroup=y,t.getApplyMonoid=function(n){return{concat:y(n).concat,empty:t.right(n.empty)}},t.getApplicativeTaskValidation=O,t.getAltTaskValidation=R,t.getTaskValidation=function(n){var e=O(f.ApplicativePar,n),r=R(n);return{URI:t.URI,_E:void 0,map:s,ap:e.ap,of:t.of,chain:I,bimap:h,mapLeft:d,alt:r.alt,fromIO:t.fromIO,fromTask:t.fromTask,throwError:t.throwError}},t.getFilterable=function(n){var e=u.getWitherable(n),r=a.getFilterableComposition(f.Monad,e);return{URI:t.URI,_E:void 0,map:s,compact:r.compact,separate:r.separate,filter:r.filter,filterMap:r.filterMap,partition:r.partition,partitionMap:r.partitionMap}},t.Functor={URI:t.URI,map:s},t.ApplicativePar={URI:t.URI,map:s,ap:g,of:t.of},t.ApplicativeSeq={URI:t.URI,map:s,ap:v,of:t.of},t.Bifunctor={URI:t.URI,bimap:h,mapLeft:d},t.Alt={URI:t.URI,map:s,alt:b},t.taskEither={URI:t.URI,bimap:h,mapLeft:d,map:s,of:t.of,ap:g,chain:I,alt:b,fromIO:t.fromIO,fromTask:t.fromTask,throwError:t.throwError},t.taskEitherSeq={URI:t.URI,bimap:h,mapLeft:d,map:s,of:t.of,ap:v,chain:I,alt:b,fromIO:t.fromIO,fromTask:t.fromTask,throwError:t.throwError},t.taskify=function(n){return function(){var t=Array.prototype.slice.call(arguments);return function(){return new Promise((function(e){n.apply(null,t.concat((function(n,t){return e(null!=n?u.left(n):u.right(t))})))}))}}},t.bracket=function(n,e,r){return c.pipe(n,t.chain((function(n){return c.pipe(c.pipe(e(n),f.map(u.right)),t.chain((function(e){return c.pipe(r(n,e),t.chain((function(){return u.isLeft(e)?t.left(e.left):t.of(e.right)})))})))})))},t.bindTo=function(n){return t.map(c.bindTo_(n))},t.bindW=function(n,e){return t.chainW((function(r){return c.pipe(e(r),t.map((function(t){return c.bind_(r,n,t)})))}))},t.bind=t.bindW,t.apSW=function(n,e){return c.flow(t.map((function(t){return function(e){return c.bind_(t,n,e)}})),t.apW(e))},t.apS=t.apSW},1153:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.apS=t.bind=t.bindTo=t.getRefinement=t.exists=t.elem=t.option=t.MonadThrow=t.Witherable=t.Traversable=t.Filterable=t.Compactable=t.Extend=t.Alternative=t.Alt=t.Foldable=t.Monad=t.Applicative=t.Functor=t.getMonoid=t.getLastMonoid=t.getFirstMonoid=t.getApplyMonoid=t.getApplySemigroup=t.getOrd=t.getEq=t.getShow=t.URI=t.wilt=t.wither=t.sequence=t.traverse=t.partitionMap=t.partition=t.filterMap=t.filter=t.separate=t.compact=t.reduceRight=t.foldMap=t.reduce=t.duplicate=t.extend=t.throwError=t.zero=t.alt=t.flatten=t.chainFirst=t.chain=t.of=t.apSecond=t.apFirst=t.ap=t.map=t.mapNullable=t.getOrElse=t.getOrElseW=t.toUndefined=t.toNullable=t.fold=t.fromEither=t.getRight=t.getLeft=t.tryCatch=t.fromPredicate=t.fromNullable=t.some=t.none=t.isNone=t.isSome=void 0;var r=e(401);function i(n){return null==n?t.none:t.some(n)}function o(n){return"Right"===n._tag?t.none:t.some(n.left)}function u(n){return"Left"===n._tag?t.none:t.some(n.right)}t.isSome=function(n){return"Some"===n._tag},t.isNone=function(n){return"None"===n._tag},t.none={_tag:"None"},t.some=function(n){return{_tag:"Some",value:n}},t.fromNullable=i,t.fromPredicate=function(n){return function(e){return n(e)?t.some(e):t.none}},t.tryCatch=function(n){try{return t.some(n())}catch(n){return t.none}},t.getLeft=o,t.getRight=u,t.fromEither=function(n){return"Left"===n._tag?t.none:t.some(n.right)},t.fold=function(n,e){return function(r){return t.isNone(r)?n():e(r.value)}},t.toNullable=function(n){return t.isNone(n)?null:n.value},t.toUndefined=function(n){return t.isNone(n)?void 0:n.value},t.getOrElseW=function(n){return function(e){return t.isNone(e)?n():e.value}},t.getOrElse=t.getOrElseW,t.mapNullable=function(n){return function(e){return t.isNone(e)?t.none:i(n(e.value))}};var a=function(n,e){return r.pipe(n,t.map(e))},c=function(n,e){return r.pipe(n,t.ap(e))},f=function(n,e){return r.pipe(n,t.chain(e))},p=function(n,e,i){return r.pipe(n,t.reduce(e,i))},l=function(n){var e=t.foldMap(n);return function(n,t){return r.pipe(n,e(t))}},m=function(n,e,i){return r.pipe(n,t.reduceRight(e,i))},s=function(n){var e=t.traverse(n);return function(n,t){return r.pipe(n,e(t))}},h=function(n,e){return r.pipe(n,t.alt(e))},d=function(n,e){return r.pipe(n,t.filter(e))},g=function(n,e){return r.pipe(n,t.filterMap(e))},v=function(n,e){return r.pipe(n,t.extend(e))},I=function(n,e){return r.pipe(n,t.partition(e))},b=function(n,e){return r.pipe(n,t.partitionMap(e))},y=function(n){var e=t.wither(n);return function(n,t){return r.pipe(n,e(t))}},O=function(n){var e=t.wilt(n);return function(n,t){return r.pipe(n,e(t))}};t.map=function(n){return function(e){return t.isNone(e)?t.none:t.some(n(e.value))}},t.ap=function(n){return function(e){return t.isNone(e)||t.isNone(n)?t.none:t.some(e.value(n.value))}},t.apFirst=function(n){return r.flow(t.map((function(n){return function(){return n}})),t.ap(n))},t.apSecond=function(n){return r.flow(t.map((function(){return function(n){return n}})),t.ap(n))},t.of=t.some,t.chain=function(n){return function(e){return t.isNone(e)?t.none:n(e.value)}},t.chainFirst=function(n){return t.chain((function(e){return r.pipe(n(e),t.map((function(){return e})))}))},t.flatten=t.chain(r.identity),t.alt=function(n){return function(e){return t.isNone(e)?n():e}},t.zero=function(){return t.none},t.throwError=function(){return t.none},t.extend=function(n){return function(e){return t.isNone(e)?t.none:t.some(n(e))}},t.duplicate=t.extend(r.identity),t.reduce=function(n,e){return function(r){return t.isNone(r)?n:e(n,r.value)}},t.foldMap=function(n){return function(e){return function(r){return t.isNone(r)?n.empty:e(r.value)}}},t.reduceRight=function(n,e){return function(r){return t.isNone(r)?n:e(r.value,n)}},t.compact=t.flatten;var R={left:t.none,right:t.none};function M(n){return{equals:function(e,r){return e===r||(t.isNone(e)?t.isNone(r):!t.isNone(r)&&n.equals(e.value,r.value))}}}function E(n){return{concat:function(e,r){return t.isSome(e)&&t.isSome(r)?t.some(n.concat(e.value,r.value)):t.none}}}t.separate=function(n){var e=r.pipe(n,t.map((function(n){return{left:o(n),right:u(n)}})));return t.isNone(e)?R:e.value},t.filter=function(n){return function(e){return t.isNone(e)?t.none:n(e.value)?e:t.none}},t.filterMap=function(n){return function(e){return t.isNone(e)?t.none:n(e.value)}},t.partition=function(n){return function(e){return{left:r.pipe(e,t.filter((function(t){return!n(t)}))),right:r.pipe(e,t.filter(n))}}},t.partitionMap=function(n){return function(e){return t.separate(r.pipe(e,t.map(n)))}},t.traverse=function(n){return function(e){return function(r){return t.isNone(r)?n.of(t.none):n.map(e(r.value),t.some)}}},t.sequence=function(n){return function(e){return t.isNone(e)?n.of(t.none):n.map(e.value,t.some)}},t.wither=function(n){return function(e){return function(r){return t.isNone(r)?n.of(t.none):e(r.value)}}},t.wilt=function(n){return function(e){return function(i){var a=r.pipe(i,t.map((function(t){return n.map(e(t),(function(n){return{left:o(n),right:u(n)}}))})));return t.isNone(a)?n.of({left:t.none,right:t.none}):a.value}}},t.URI="Option",t.getShow=function(n){return{show:function(e){return t.isNone(e)?"none":"some("+n.show(e.value)+")"}}},t.getEq=M,t.getOrd=function(n){return{equals:M(n).equals,compare:function(e,r){return e===r?0:t.isSome(e)?t.isSome(r)?n.compare(e.value,r.value):1:-1}}},t.getApplySemigroup=E,t.getApplyMonoid=function(n){return{concat:E(n).concat,empty:t.some(n.empty)}},t.getFirstMonoid=function(){return{concat:function(n,e){return t.isNone(n)?e:n},empty:t.none}},t.getLastMonoid=function(){return{concat:function(n,e){return t.isNone(e)?n:e},empty:t.none}},t.getMonoid=function(n){return{concat:function(e,r){return t.isNone(e)?r:t.isNone(r)?e:t.some(n.concat(e.value,r.value))},empty:t.none}},t.Functor={URI:t.URI,map:a},t.Applicative={URI:t.URI,map:a,ap:c,of:t.of},t.Monad={URI:t.URI,map:a,ap:c,of:t.of,chain:f},t.Foldable={URI:t.URI,reduce:p,foldMap:l,reduceRight:m},t.Alt={URI:t.URI,map:a,alt:h},t.Alternative={URI:t.URI,map:a,ap:c,of:t.of,alt:h,zero:t.zero},t.Extend={URI:t.URI,map:a,extend:v},t.Compactable={URI:t.URI,compact:t.compact,separate:t.separate},t.Filterable={URI:t.URI,map:a,compact:t.compact,separate:t.separate,filter:d,filterMap:g,partition:I,partitionMap:b},t.Traversable={URI:t.URI,map:a,reduce:p,foldMap:l,reduceRight:m,traverse:s,sequence:t.sequence},t.Witherable={URI:t.URI,map:a,reduce:p,foldMap:l,reduceRight:m,traverse:s,sequence:t.sequence,compact:t.compact,separate:t.separate,filter:d,filterMap:g,partition:I,partitionMap:b,wither:y,wilt:O},t.MonadThrow={URI:t.URI,map:a,ap:c,of:t.of,chain:f,throwError:t.throwError},t.option={URI:t.URI,map:a,of:t.of,ap:c,chain:f,reduce:p,foldMap:l,reduceRight:m,traverse:s,sequence:t.sequence,zero:t.zero,alt:h,extend:v,compact:t.compact,separate:t.separate,filter:d,filterMap:g,partition:I,partitionMap:b,wither:y,wilt:O,throwError:t.throwError},t.elem=function(n){return function(e,r){return!t.isNone(r)&&n.equals(e,r.value)}},t.exists=function(n){return function(e){return!t.isNone(e)&&n(e.value)}},t.getRefinement=function(n){return function(e){return t.isSome(n(e))}},t.bindTo=function(n){return t.map(r.bindTo_(n))},t.bind=function(n,e){return t.chain((function(i){return r.pipe(e(i),t.map((function(t){return r.bind_(i,n,t)})))}))},t.apS=function(n,e){return r.flow(t.map((function(t){return function(e){return r.bind_(t,n,e)}})),t.ap(e))}},1242:function(n,t,e){n.exports=e(27)(49)},1243:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getFilterableComposition=void 0;var r=e(1244),i=e(1153);t.getFilterableComposition=function(n,t){var e=r.getCompactableComposition(n,t),o={map:e.map,compact:e.compact,separate:e.separate,partitionMap:function(n,t){return{left:o.filterMap(n,(function(n){return i.getLeft(t(n))})),right:o.filterMap(n,(function(n){return i.getRight(t(n))}))}},partition:function(n,t){return{left:o.filter(n,(function(n){return!t(n)})),right:o.filter(n,t)}},filterMap:function(e,r){return n.map(e,(function(n){return t.filterMap(n,r)}))},filter:function(e,r){return n.map(e,(function(n){return t.filter(n,r)}))}};return o}},1244:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getCompactableComposition=void 0;var r=e(1245),i=e(1153);t.getCompactableComposition=function(n,t){var e=r.getFunctorComposition(n,t),o={map:e.map,compact:function(e){return n.map(e,t.compact)},separate:function(n){return{left:o.compact(e.map(n,i.getLeft)),right:o.compact(e.map(n,i.getRight))}}};return o}},1245:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getFunctorComposition=void 0,t.getFunctorComposition=function(n,t){return{map:function(e,r){return n.map(e,(function(n){return t.map(n,r)}))}}}},1246:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.apS=t.bind=t.bindTo=t.never=t.taskSeq=t.task=t.Monad=t.ApplicativeSeq=t.ApplicativePar=t.Functor=t.getRaceMonoid=t.getMonoid=t.getSemigroup=t.URI=t.fromTask=t.flatten=t.chainFirst=t.chain=t.of=t.apSecond=t.apFirst=t.ap=t.map=t.chainIOK=t.fromIOK=t.delay=t.fromIO=void 0;var r=e(401);function i(n){return function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return t.fromIO(n.apply(void 0,e))}}t.fromIO=function(n){return function(){return Promise.resolve(n())}},t.delay=function(n){return function(t){return function(){return new Promise((function(e){setTimeout((function(){t().then(e)}),n)}))}}},t.fromIOK=i,t.chainIOK=function(n){return t.chain(i(n))};var o=function(n,e){return r.pipe(n,t.map(e))},u=function(n,e){return r.pipe(n,t.ap(e))},a=function(n,e){return r.pipe(n,t.chain((function(n){return r.pipe(e,t.map(n))})))},c=function(n,e){return r.pipe(n,t.chain(e))};function f(n){return{concat:function(t,e){return function(){return t().then((function(t){return e().then((function(e){return n.concat(t,e)}))}))}}}}t.map=function(n){return function(t){return function(){return t().then(n)}}},t.ap=function(n){return function(t){return function(){return Promise.all([t(),n()]).then((function(n){return(0,n[0])(n[1])}))}}},t.apFirst=function(n){return r.flow(t.map((function(n){return function(){return n}})),t.ap(n))},t.apSecond=function(n){return r.flow(t.map((function(){return function(n){return n}})),t.ap(n))},t.of=function(n){return function(){return Promise.resolve(n)}},t.chain=function(n){return function(t){return function(){return t().then((function(t){return n(t)()}))}}},t.chainFirst=function(n){return t.chain((function(e){return r.pipe(n(e),t.map((function(){return e})))}))},t.flatten=t.chain(r.identity),t.fromTask=r.identity,t.URI="Task",t.getSemigroup=f,t.getMonoid=function(n){return{concat:f(n).concat,empty:t.of(n.empty)}},t.getRaceMonoid=function(){return{concat:function(n,t){return function(){return Promise.race([n(),t()])}},empty:t.never}},t.Functor={URI:t.URI,map:o},t.ApplicativePar={URI:t.URI,map:o,ap:u,of:t.of},t.ApplicativeSeq={URI:t.URI,map:o,ap:a,of:t.of},t.Monad={URI:t.URI,map:o,of:t.of,ap:u,chain:c},t.task={URI:t.URI,map:o,of:t.of,ap:u,chain:c,fromIO:t.fromIO,fromTask:t.fromTask},t.taskSeq={URI:t.URI,map:o,of:t.of,ap:a,chain:c,fromIO:t.fromIO,fromTask:t.fromTask},t.never=function(){return new Promise((function(n){}))},t.bindTo=function(n){return t.map(r.bindTo_(n))},t.bind=function(n,e){return t.chain((function(i){return r.pipe(e(i),t.map((function(t){return r.bind_(i,n,t)})))}))},t.apS=function(n,e){return r.flow(t.map((function(t){return function(e){return r.bind_(t,n,e)}})),t.ap(e))}},850:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.pipeable=t.pipe=void 0;var r=e(401);t.pipe=r.pipe,t.pipeable=function(n){var t={};return function(n){return"function"==typeof n.map}(n)&&(t.map=function(t){return function(e){return n.map(e,t)}}),function(n){return"function"==typeof n.contramap}(n)&&(t.contramap=function(t){return function(e){return n.contramap(e,t)}}),function(n){return"function"==typeof n.mapWithIndex}(n)&&(t.mapWithIndex=function(t){return function(e){return n.mapWithIndex(e,t)}}),function(n){return"function"==typeof n.ap}(n)&&(t.ap=function(t){return function(e){return n.ap(e,t)}},t.apFirst=function(t){return function(e){return n.ap(n.map(e,(function(n){return function(){return n}})),t)}},t.apSecond=function(t){return function(e){return n.ap(n.map(e,(function(){return function(n){return n}})),t)}}),function(n){return"function"==typeof n.chain}(n)&&(t.chain=function(t){return function(e){return n.chain(e,t)}},t.chainFirst=function(t){return function(e){return n.chain(e,(function(e){return n.map(t(e),(function(){return e}))}))}},t.flatten=function(t){return n.chain(t,r.identity)}),function(n){return"function"==typeof n.bimap}(n)&&(t.bimap=function(t,e){return function(r){return n.bimap(r,t,e)}},t.mapLeft=function(t){return function(e){return n.mapLeft(e,t)}}),function(n){return"function"==typeof n.extend}(n)&&(t.extend=function(t){return function(e){return n.extend(e,t)}},t.duplicate=function(t){return n.extend(t,r.identity)}),function(n){return"function"==typeof n.reduce}(n)&&(t.reduce=function(t,e){return function(r){return n.reduce(r,t,e)}},t.foldMap=function(t){var e=n.foldMap(t);return function(n){return function(t){return e(t,n)}}},t.reduceRight=function(t,e){return function(r){return n.reduceRight(r,t,e)}}),function(n){return"function"==typeof n.reduceWithIndex}(n)&&(t.reduceWithIndex=function(t,e){return function(r){return n.reduceWithIndex(r,t,e)}},t.foldMapWithIndex=function(t){var e=n.foldMapWithIndex(t);return function(n){return function(t){return e(t,n)}}},t.reduceRightWithIndex=function(t,e){return function(r){return n.reduceRightWithIndex(r,t,e)}}),function(n){return"function"==typeof n.alt}(n)&&(t.alt=function(t){return function(e){return n.alt(e,t)}}),function(n){return"function"==typeof n.compact}(n)&&(t.compact=n.compact,t.separate=n.separate),function(n){return"function"==typeof n.filter}(n)&&(t.filter=function(t){return function(e){return n.filter(e,t)}},t.filterMap=function(t){return function(e){return n.filterMap(e,t)}},t.partition=function(t){return function(e){return n.partition(e,t)}},t.partitionMap=function(t){return function(e){return n.partitionMap(e,t)}}),function(n){return"function"==typeof n.filterWithIndex}(n)&&(t.filterWithIndex=function(t){return function(e){return n.filterWithIndex(e,t)}},t.filterMapWithIndex=function(t){return function(e){return n.filterMapWithIndex(e,t)}},t.partitionWithIndex=function(t){return function(e){return n.partitionWithIndex(e,t)}},t.partitionMapWithIndex=function(t){return function(e){return n.partitionMapWithIndex(e,t)}}),function(n){return"function"==typeof n.promap}(n)&&(t.promap=function(t,e){return function(r){return n.promap(r,t,e)}}),function(n){return"function"==typeof n.compose}(n)&&(t.compose=function(t){return function(e){return n.compose(e,t)}}),function(n){return"function"==typeof n.throwError}(n)&&(t.fromOption=function(t){return function(e){return"None"===e._tag?n.throwError(t()):n.of(e.value)}},t.fromEither=function(t){return"Left"===t._tag?n.throwError(t.left):n.of(t.right)},t.fromPredicate=function(t,e){return function(r){return t(r)?n.of(r):n.throwError(e(r))}},t.filterOrElse=function(t,e){return function(r){return n.chain(r,(function(r){return t(r)?n.of(r):n.throwError(e(r))}))}}),t}}}]);