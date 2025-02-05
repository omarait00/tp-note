"use strict";

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* @notice
 * Portions of this code are licensed under the following license:
 * For license information please see https://edge.fullstory.com/s/fs.js.LICENSE.txt
 */
/* eslint-disable prettier/prettier,no-var,eqeqeq,new-cap,no-nested-ternary,no-use-before-define,no-sequences,block-scoped-var,one-var,
    dot-notation,no-script-url,no-restricted-globals,no-unused-vars,guard-for-in,no-proto,camelcase,no-empty,no-redeclare,no-caller,
    strict,no-extend-native,no-undef,no-loop-func */
!function (e) {
  var t = {};
  function n(r) {
    if (t[r]) return t[r].exports;
    var i = t[r] = {
      i: r,
      l: !1,
      exports: {}
    };
    return e[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports;
  }
  n.m = e, n.c = t, n.d = function (e, t, r) {
    n.o(e, t) || Object.defineProperty(e, t, {
      enumerable: !0,
      get: r
    });
  }, n.r = function (e) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    });
  }, n.t = function (e, t) {
    if (1 & t && (e = n(e)), 8 & t) return e;
    if (4 & t && "object" == typeof e && e && e.__esModule) return e;
    var r = Object.create(null);
    if (n.r(r), Object.defineProperty(r, "default", {
      enumerable: !0,
      value: e
    }), 2 & t && "string" != typeof e) for (var i in e) n.d(r, i, function (t) {
      return e[t];
    }.bind(null, i));
    return r;
  }, n.n = function (e) {
    var t = e && e.__esModule ? function () {
      return e["default"];
    } : function () {
      return e;
    };
    return n.d(t, "a", t), t;
  }, n.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }, n.p = "/s", n(n.s = 4);
}([function (e, t, n) {
  "use strict";

  var r = this && this.__assign || function () {
      return (r = Object.assign || function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        return e;
      }).apply(this, arguments);
    },
    i = this && this.__createBinding || (Object.create ? function (e, t, n, r) {
      void 0 === r && (r = n), Object.defineProperty(e, r, {
        enumerable: !0,
        get: function () {
          return t[n];
        }
      });
    } : function (e, t, n, r) {
      void 0 === r && (r = n), e[r] = t[n];
    });
  t.__esModule = !0, t.omit = t.pick = t.assertExhaustive = t.isNonEmpty = void 0, i(t, n(6), "ExtendedObject", "Object"), t.isNonEmpty = function (e) {
    return e.length > 0;
  }, t.assertExhaustive = function (e, t) {
    throw void 0 === t && (t = "Reached unexpected case in exhaustive switch"), new Error(t);
  }, t.pick = function (e) {
    for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
    var r = {};
    return t.forEach(function (t) {
      r[t] = e[t];
    }), r;
  }, t.omit = function (e) {
    for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
    var i = r({}, e);
    return Object.keys(i).forEach(function (e) {
      var n = e;
      -1 !== t.indexOf(n) && delete i[n];
    }), i;
  };
}, function (e, t) {}, function (e) {
  e.exports = {
    Any: {
      iframe: {
        src: "scrubUrl",
        srcdoc: "erase"
      },
      frame: {
        src: "scrubUrl",
        srcdoc: "erase"
      }
    },
    Exclude: {
      "*": {
        alt: "erase",
        checked: "erase",
        data: "erase",
        placeholder: "erase",
        src: "erase",
        srcset: "erase",
        href: "erase",
        title: "erase",
        value: "erase"
      }
    },
    Mask: {
      "*": {
        checked: "erase",
        data: "erase",
        alt: "maskText",
        placeholder: "maskText",
        title: "maskText",
        value: "maskText"
      },
      option: {
        label: "maskText"
      }
    }
  };
}, function (e) {
  e.exports = [{
    Selector: "object:not([type^=\"image/\"])",
    Consent: !1,
    Type: 1
  }, {
    Selector: "embed:not([type^=\"image/\"])",
    Consent: !1,
    Type: 1
  }, {
    Selector: "canvas",
    Consent: !1,
    Type: 1
  }, {
    Selector: "noscript",
    Consent: !1,
    Type: 1
  }, {
    Selector: ".fs-hide",
    Consent: !1,
    Type: 1
  }, {
    Selector: ".fs-exclude",
    Consent: !1,
    Type: 1
  }, {
    Selector: ".fs-exclude-without-consent",
    Consent: !0,
    Type: 1
  }, {
    Selector: ".fs-mask",
    Consent: !1,
    Type: 2
  }, {
    Selector: ".fs-mask-without-consent",
    Consent: !0,
    Type: 2
  }, {
    Selector: ".fs-unmask",
    Consent: !1,
    Type: 3
  }, {
    Selector: ".fs-unmask-with-consent",
    Consent: !0,
    Type: 3
  }, {
    Selector: ".fs-block",
    Consent: !1,
    Type: 1
  }, {
    Selector: ".fs-record-with-consent",
    Consent: !0,
    Type: 1
  }];
}, function (e, t, n) {
  e.exports = n(7);
}, function (e, t) {}, function (e, t, n) {
  "use strict";

  t.__esModule = !0, t.ExtendedObject = void 0, t.ExtendedObject = Object;
}, function (e, t, n) {
  "use strict";

  n.r(t);
  n(5);
  var r = !1;
  function i() {
    return r;
  }
  function o(e) {
    i() && window.console && console.log(e);
  }
  n(1);
  var s = new (function () {
    function e(e) {
      this.rebuildFromSnapshot(e);
    }
    return e.prototype.rebuildFromSnapshot = function (e) {
      var t = this.snapshot;
      if (this.snapshot = e, !t || t.functions !== e.functions) {
        var n = e.functions;
        this.jsonParse = n.jsonParse, this.jsonStringify = n.jsonStringify, this.arrayIsArray = n.arrayIsArray, this.objectKeys = n.objectKeys, this.objectValues = n.objectValues || null, this.dateNow = n.dateNow, this.objectHasOwnProp = u(n.objectHasOwnProp), this.dateGetTime = u(n.dateGetTime), this.matchMedia = c(n.matchMedia), this.setWindowTimeout = u(n.setWindowTimeout), this.setWindowInterval = u(n.setWindowInterval), this.clearWindowTimeout = u(n.clearWindowTimeout), this.clearWindowInterval = u(n.clearWindowInterval), this.requestWindowAnimationFrame = c(n.requestWindowAnimationFrame), this.requestWindowIdleCallback = c(n.requestWindowIdleCallback), this.mathAbs = n.mathAbs, this.mathFloor = n.mathFloor, this.mathMax = n.mathMax, this.mathMin = n.mathMin, this.mathPow = n.mathPow, this.mathRandom = n.mathRandom, this.mathRound = n.mathRound;
      }
    }, e;
  }())(a(window));
  function a(e, t) {
    void 0 === t && (t = 0);
    var n = t,
      r = function (e) {
        try {
          return e();
        } catch (e) {
          return n = 2, function () {
            throw new Error("Invoked failed snapshot");
          };
        }
      },
      i = {
        jsonParse: r(function () {
          return e.JSON.parse;
        }),
        jsonStringify: r(function () {
          return e.JSON.stringify;
        }),
        arrayIsArray: r(function () {
          return e.Array.isArray;
        }),
        objectKeys: r(function () {
          return e.Object.keys;
        }),
        objectValues: r(function () {
          return e.Object.values;
        }),
        dateNow: r(function () {
          return e.Date.now;
        }),
        objectHasOwnProp: r(function () {
          return e.Object.prototype.hasOwnProperty;
        }),
        dateGetTime: r(function () {
          return e.Date.prototype.getTime;
        }),
        matchMedia: r(function () {
          return e.matchMedia;
        }),
        setWindowTimeout: r(function () {
          return e.setTimeout;
        }),
        setWindowInterval: r(function () {
          return e.setInterval;
        }),
        clearWindowTimeout: r(function () {
          return e.clearTimeout;
        }),
        clearWindowInterval: r(function () {
          return e.clearInterval;
        }),
        requestWindowAnimationFrame: r(function () {
          return e.requestAnimationFrame;
        }),
        requestWindowIdleCallback: r(function () {
          return e.requestIdleCallback;
        }),
        mathAbs: r(function () {
          return e.Math.abs;
        }),
        mathFloor: r(function () {
          return e.Math.floor;
        }),
        mathMax: r(function () {
          return e.Math.max;
        }),
        mathMin: r(function () {
          return e.Math.min;
        }),
        mathPow: r(function () {
          return e.Math.pow;
        }),
        mathRandom: r(function () {
          return e.Math.random;
        }),
        mathRound: r(function () {
          return e.Math.round;
        })
      },
      o = {
        functionToString: r(function () {
          return e.Function.prototype.toString;
        }),
        objectToString: r(function () {
          return e.Object.prototype.toString;
        })
      };
    return {
      status: n,
      functions: i,
      helpers: o
    };
  }
  function u(e) {
    return function (t) {
      for (var n = [], r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];
      return e.apply(t, n);
    };
  }
  function c(e) {
    return e ? u(e) : null;
  }
  var h,
    d = "number" == typeof (h = s.dateNow()) ? {
      now: function () {
        return s.dateNow();
      },
      timeOrigin: h
    } : {
      now: function () {
        return s.dateGetTime(new Date());
      },
      timeOrigin: h = s.dateGetTime(new Date())
    };
  var l = function () {
    var e,
      t = window.performance;
    if (t && t.now) {
      var n = t.now();
      if ("number" == typeof n && isFinite(n) && !(n <= 0)) {
        var r = t.timeOrigin;
        if ("number" != typeof r) {
          var i = d.now() - t.now(),
            o = null === (e = t.timing) || void 0 === e ? void 0 : e.navigationStart;
          r = o ? Math.min(i, o) : i;
        }
        var s = Math.round(r);
        if ("number" == typeof s && isFinite(s) && !(s <= 0)) return {
          now: function () {
            return Math.round(s + t.now());
          },
          timeOrigin: s
        };
      }
    }
  }();
  function p() {
    return l ? l.now() : d.now();
  }
  var f = ["", "0", "1", "-1", "true", "false", "n/a", "nan", "undefined", "null", "nil", "the_id_that_you_use_in_your_app_for_this_user"],
    v = ["811c9dc5", "350ca8af", "340ca71c", "14cd0a2b", "4db211e5", "0b069958", "3613e041", "2f8f13ba", "9b61ad43", "77074ba4", "0da3f8ec", "1c750511"],
    _ = function () {
      return s.mathFloor(p() / 1e3);
    },
    g = function () {
      return _() + 31536e3;
    };
  function m(e) {
    if (!e) return null;
    var t = e.split("/"),
      n = t[0],
      r = t[1],
      i = parseInt(r),
      s = _(),
      a = g();
    if (isNaN(i) && (i = a), i <= s) return null;
    i > a && (i = a);
    var u = n.split(/[#,]/);
    if (u.length < 3 && (u = n.split("`")).length < 3) return null;
    var c = u[0],
      h = u[1],
      d = u[2],
      l = u[3],
      p = "";
    void 0 !== l && (p = decodeURIComponent(l), (f.indexOf(p) >= 0 || v.indexOf(p) >= 0) && (o("Ignoring invalid app key \"" + p + "\" from cookie."), p = ""));
    var m = d.split(":");
    return {
      expirationAbsTimeSeconds: i,
      host: c,
      orgId: h,
      userId: m[0],
      sessionId: m[1] || "",
      appKeyHash: p
    };
  }
  function y(e) {
    for (var t = {}, n = e.cookie.split(";"), r = 0; r < n.length; r++) {
      var i = n[r].replace(/^\s+|\s+$/g, "").split("=");
      t[i[0]] || (t[i[0]] = i[1]);
    }
    return t;
  }
  var w = "_fs_loaded",
    b = "_fs_namespace";
  var S,
    E = "FS";
  function T(e) {
    if (S) return S;
    var t = k(e);
    return t ? (S = t, t) : (t = e[b]) ? (S = t, t) : S = E;
  }
  function k(e) {
    return e[w];
  }
  function I(e) {
    return e[T(e)];
  }
  function C(e) {
    return "localhost" == e || "127.0.0.1" == e;
  }
  var R,
    A,
    x,
    O,
    M = /^([^.]+\.)*(fullstory|onfire).[^.]+(\/|$)/;
  function L(e) {
    return !!e._fs_ext_debug || !!e._fs_debug;
  }
  function F(e) {
    return e._fs_rec_host || ((t = D(e)) && M.test(t) ? 0 === t.lastIndexOf("rs.", 0) || 0 === t.lastIndexOf("rs-2.", 0) ? t : 0 == t.lastIndexOf("www.", 0) ? "rs." + t.slice(4) : 0 == t.lastIndexOf("app.", 0) ? "rs." + t.slice(4) : "rs." + t : t);
    var t;
  }
  function P(e) {
    return e._fs_ext_org || e._fs_org;
  }
  function q(e) {
    return !!e._fs_is_outer_script;
  }
  function U(e) {
    return e._fs_replay_flags;
  }
  function N(e) {
    return e._fs_transport;
  }
  function W(e, t) {
    var n = I(e);
    if (n) {
      var r = n.q;
      r || (r = n.q = []), r.push(t);
    }
  }
  function D(e) {
    return e._fs_ext_host || e._fs_host;
  }
  function B(e) {
    return e ? C(function (e) {
      var t = e,
        n = t.indexOf(":");
      return n >= 0 && (t = t.slice(0, n)), t;
    }(e)) ? e : 0 == e.indexOf("www.") ? "app." + e.slice(4) : "app." + e : e;
  }
  function H(e) {
    return e ? e + "/s/fs.js" : void 0;
  }
  !function (e) {
    e.MUT_INSERT = 2, e.MUT_REMOVE = 3, e.MUT_ATTR = 4, e.MUT_TEXT = 6, e.MOUSEMOVE = 8, e.MOUSEMOVE_CURVE = 9, e.SCROLL_LAYOUT = 10, e.SCROLL_LAYOUT_CURVE = 11, e.MOUSEDOWN = 12, e.MOUSEUP = 13, e.KEYDOWN = 14, e.KEYUP = 15, e.CLICK = 16, e.FOCUS = 17, e.VALUECHANGE = 18, e.RESIZE_LAYOUT = 19, e.DOMLOADED = 20, e.LOAD = 21, e.PLACEHOLDER_SIZE = 22, e.UNLOAD = 23, e.BLUR = 24, e.SET_FRAME_BASE = 25, e.TOUCHSTART = 32, e.TOUCHEND = 33, e.TOUCHCANCEL = 34, e.TOUCHMOVE = 35, e.TOUCHMOVE_CURVE = 36, e.NAVIGATE = 37, e.PLAY = 38, e.PAUSE = 39, e.RESIZE_VISUAL = 40, e.RESIZE_VISUAL_CURVE = 41, e.RESIZE_DOCUMENT = 42, e.LOG = 48, e.ERROR = 49, e.DBL_CLICK = 50, e.FORM_SUBMIT = 51, e.WINDOW_FOCUS = 52, e.WINDOW_BLUR = 53, e.HEARTBEAT = 54, e.WATCHED_ELEM = 56, e.PERF_ENTRY = 57, e.REC_FEAT_SUPPORTED = 58, e.SELECT = 59, e.CSSRULE_INSERT = 60, e.CSSRULE_DELETE = 61, e.FAIL_THROTTLED = 62, e.AJAX_REQUEST = 63, e.SCROLL_VISUAL_OFFSET = 64, e.SCROLL_VISUAL_OFFSET_CURVE = 65, e.MEDIA_QUERY_CHANGE = 66, e.RESOURCE_TIMING_BUFFER_FULL = 67, e.MUT_SHADOW = 68, e.DISABLE_STYLESHEET = 69, e.FULLSCREEN = 70, e.FULLSCREEN_ERROR = 71, e.ADOPTED_STYLESHEETS = 72, e.CUSTOM_ELEMENT_DEFINED = 73, e.MODAL_OPEN = 74, e.MODAL_CLOSE = 75, e.SLOW_INTERACTION = 76, e.LONG_FRAME = 77, e.TIMING = 78, e.STORAGE_WRITE_FAILURE = 79, e.KEEP_ELEMENT = 2e3, e.KEEP_URL = 2001, e.KEEP_BOUNCE = 2002, e.SYS_SETVAR = 8193, e.SYS_RESOURCEHASH = 8195, e.SYS_SETCONSENT = 8196, e.SYS_CUSTOM = 8197, e.SYS_REPORTCONSENT = 8198;
  }(R || (R = {})), function (e) {
    e.Unknown = 0, e.Serialization = 1;
  }(A || (A = {})), function (e) {
    e.Unknown = 0, e.DomSnapshot = 1, e.NodeEncoding = 2, e.LzEncoding = 3;
  }(x || (x = {})), function (e) {
    e.Internal = 0, e.Public = 1;
  }(O || (O = {}));
  var j,
    K,
    V,
    z,
    Y,
    G,
    Q,
    X,
    J,
    $,
    Z,
    ee,
    te,
    ne = ["print", "alert", "confirm"];
  function re(e) {
    switch (e) {
      case R.MOUSEDOWN:
      case R.MOUSEMOVE:
      case R.MOUSEMOVE_CURVE:
      case R.MOUSEUP:
      case R.KEYDOWN:
      case R.KEYUP:
      case R.TOUCHSTART:
      case R.TOUCHEND:
      case R.TOUCHMOVE:
      case R.TOUCHMOVE_CURVE:
      case R.TOUCHCANCEL:
      case R.CLICK:
      case R.SCROLL_LAYOUT:
      case R.SCROLL_LAYOUT_CURVE:
      case R.SCROLL_VISUAL_OFFSET:
      case R.SCROLL_VISUAL_OFFSET_CURVE:
      case R.NAVIGATE:
        return !0;
    }
    return !1;
  }
  !function (e) {
    e.GrantConsent = !0, e.RevokeConsent = !1;
  }(j || (j = {})), function (e) {
    e.Page = 0, e.Document = 1;
  }(K || (K = {})), function (e) {
    e.Unknown = 0, e.Api = 1, e.FsShutdownFrame = 2, e.Hibernation = 3, e.Reidentify = 4, e.SettingsBlocked = 5, e.Size = 6, e.Unload = 7;
  }(V || (V = {})), function (e) {
    e.Timing = 0, e.Navigation = 1, e.Resource = 2, e.Paint = 3, e.Mark = 4, e.Measure = 5, e.Memory = 6;
  }(z || (z = {})), function (e) {
    e.Performance = 0, e.PerformanceEntries = 1, e.PerformanceMemory = 2, e.Console = 3, e.Ajax = 4, e.PerformanceObserver = 5, e.AjaxFetch = 6;
  }(Y || (Y = {})), function (e) {
    e.Node = 1, e.Sheet = 2;
  }(G || (G = {})), function (e) {
    e.StyleSheetHooks = 0, e.SetPropertyHooks = 1;
  }(Q || (Q = {})), function (e) {
    e.User = "user", e.Account = "acct", e.Event = "evt";
  }(X || (X = {})), function (e) {
    e.Elide = 0, e.Record = 1, e.Whitelist = 2;
  }(J || (J = {})), function (e) {
    e.ReasonNoSuchOrg = 1, e.ReasonOrgDisabled = 2, e.ReasonOrgOverQuota = 3, e.ReasonBlockedDomain = 4, e.ReasonBlockedIp = 5, e.ReasonBlockedUserAgent = 6, e.ReasonBlockedGeo = 7, e.ReasonBlockedTrafficRamping = 8, e.ReasonInvalidURL = 9, e.ReasonUserOptOut = 10, e.ReasonInvalidRecScript = 11, e.ReasonDeletingUser = 12, e.ReasonNativeHookFailure = 13;
  }($ || ($ = {})), function (e) {
    e.Unset = 0, e.Exclude = 1, e.Mask = 2, e.Unmask = 3, e.Watch = 4, e.Keep = 5;
  }(Z || (Z = {})), function (e) {
    e.Unset = 0, e.Click = 1;
  }(ee || (ee = {})), function (e) {
    e.MaxLogsPerPage = 1024, e.MutationProcessingInterval = 250, e.CurveSamplingInterval = 142, e.DefaultBundleUploadInterval = 5e3, e.HeartbeatInitial = 4e3, e.HeartbeatMax = 256200, e.PageInactivityTimeout = 18e5, e.BackoffMax = 3e5, e.ScrollSampleInterval = e.MutationProcessingInterval / 5, e.InactivityThreshold = 4e3, e.MaxPayloadLength = 16384;
  }(te || (te = {}));
  function ie(e, t) {
    return function () {
      try {
        return e.apply(this, arguments);
      } catch (e) {
        try {
          t && t(e);
        } catch (e) {}
      }
    };
  }
  var oe = function () {},
    se = navigator.userAgent,
    ae = se.indexOf("MSIE ") > -1 || se.indexOf("Trident/") > -1,
    ue = (ae && se.indexOf("Trident/5"), ae && se.indexOf("Trident/6"), ae && se.indexOf("rv:11") > -1),
    ce = se.indexOf("Edge/") > -1;
  se.indexOf("CriOS");
  var he = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
  function de() {
    var e = window.navigator.userAgent.match(/Version\/(\d+)/);
    return e ? parseInt(e[1]) : -1;
  }
  function le(e) {
    if (!he) return !1;
    var t = de();
    return t >= 0 && t === e;
  }
  function pe(e) {
    if (!he) return !1;
    var t = de();
    return t >= 0 && t < e;
  }
  le(9), le(10), pe(8), pe(10), pe(12);
  function fe(e, t) {
    for (var n = 0 === t.indexOf("on") ? function (e) {
        return "on" + e + t.slice(2);
      } : function (e) {
        return "" + e + t.charAt(0).toUpperCase() + t.slice(1);
      }, r = 0, i = [function () {
        return t;
      }, function () {
        return n("webkit");
      }, function () {
        return n("moz");
      }, function () {
        return n("ms");
      }]; r < i.length; r++) {
      var o = (0, i[r])();
      if (o in e) return o;
    }
    return t;
  }
  function ve(e) {
    return "function" == typeof e;
  }
  var _e = Array.isArray ? Array.isArray : function (e) {
      return "[object Array]" === Object.prototype.toString.call(e);
    },
    ge = 0,
    me = function (e, t) {
      Ce[ge] = e, Ce[ge + 1] = t, 2 === (ge += 2) && be();
    };
  var ye = window.MutationObserver || window.WebKitMutationObserver,
    we = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof self && void 0 !== self.importScripts && "undefined" != typeof MessageChannel;
  var be,
    Se,
    Ee,
    Te,
    ke,
    Ie,
    Ce = new Array(1e3);
  function Re() {
    for (var e = 0; e < ge; e += 2) {
      (0, Ce[e])(Ce[e + 1]), Ce[e] = void 0, Ce[e + 1] = void 0;
    }
    ge = 0;
  }
  function Ae(e, t) {
    var n = arguments,
      r = this,
      i = new this.constructor(Me);
    void 0 === i[Oe] && Qe(i);
    var o,
      s = r._state;
    return s ? (o = n[s - 1], me(function () {
      return Ye(s, i, o, r._result);
    })) : je(r, i, e, t), i;
  }
  function xe(e) {
    if (e && "object" == typeof e && e.constructor === this) return e;
    var t = new this(Me);
    return We(t, e), t;
  }
  ye ? (Te = 0, ke = new ye(Re), Ie = document.createTextNode(""), ke.observe(Ie, {
    characterData: !0
  }), be = function () {
    var e = Te = ++Te % 2;
    Ie.data = e + "";
  }) : we ? ((Ee = new MessageChannel()).port1.onmessage = Re, be = function () {
    return Ee.port2.postMessage(0);
  }) : (Se = setTimeout, be = function () {
    return Se(Re, 1);
  });
  var Oe = Math.random().toString(36).substring(16);
  function Me() {}
  var Le = void 0,
    Fe = 1,
    Pe = 2,
    qe = new Ve();
  function Ue(e) {
    try {
      return e.then;
    } catch (e) {
      return qe.error = e, qe;
    }
  }
  function Ne(e, t, n) {
    t.constructor === e.constructor && n === Ae && t.constructor.resolve === xe ? function (e, t) {
      t._state === Fe ? Be(e, t._result) : t._state === Pe ? He(e, t._result) : je(t, void 0, function (t) {
        return We(e, t);
      }, function (t) {
        return He(e, t);
      });
    }(e, t) : n === qe ? (He(e, qe.error), qe.error = null) : void 0 === n ? Be(e, t) : ve(n) ? function (e, t, n) {
      me(function (e) {
        var r = !1,
          i = function (e, t, n, r, i) {
            try {
              e.call(t, n, r);
            } catch (e) {
              return e;
            }
          }(n, t, function (n) {
            r || (r = !0, t !== n ? We(e, n) : Be(e, n));
          }, function (t) {
            r || (r = !0, He(e, t));
          }, e._label);
        !r && i && (r = !0, He(e, i));
      }, e);
    }(e, t, n) : Be(e, t);
  }
  function We(e, t) {
    var n;
    e === t ? He(e, new TypeError("You cannot resolve a promise with itself")) : "function" == typeof (n = t) || "object" == typeof n && null !== n ? Ne(e, t, Ue(t)) : Be(e, t);
  }
  function De(e) {
    e._onerror && e._onerror(e._result), Ke(e);
  }
  function Be(e, t) {
    e._state === Le && (e._result = t, e._state = Fe, 0 !== e._subscribers.length && me(Ke, e));
  }
  function He(e, t) {
    e._state === Le && (e._state = Pe, e._result = t, me(De, e));
  }
  function je(e, t, n, r) {
    var i = e._subscribers,
      o = i.length;
    e._onerror = null, i[o] = t, i[o + Fe] = n, i[o + Pe] = r, 0 === o && e._state && me(Ke, e);
  }
  function Ke(e) {
    var t = e._subscribers,
      n = e._state;
    if (0 !== t.length) {
      for (var r, i, o = e._result, s = 0; s < t.length; s += 3) r = t[s], i = t[s + n], r ? Ye(n, r, i, o) : i(o);
      e._subscribers.length = 0;
    }
  }
  function Ve() {
    this.error = null;
  }
  var ze = new Ve();
  function Ye(e, t, n, r) {
    var i,
      o,
      s,
      a,
      u = ve(n);
    if (u) {
      if ((i = function (e, t) {
        try {
          return e(t);
        } catch (e) {
          return ze.error = e, ze;
        }
      }(n, r)) === ze ? (a = !0, o = i.error, i.error = null) : s = !0, t === i) return void He(t, new TypeError("A promises callback cannot return that same promise."));
    } else i = r, s = !0;
    t._state !== Le || (u && s ? We(t, i) : a ? He(t, o) : e === Fe ? Be(t, i) : e === Pe && He(t, i));
  }
  var Ge = 0;
  function Qe(e) {
    e[Oe] = Ge++, e._state = void 0, e._result = void 0, e._subscribers = [];
  }
  function Xe(e, t) {
    this._instanceConstructor = e, this.promise = new e(Me), this.promise[Oe] || Qe(this.promise), _e(t) ? (this._input = t, this.length = t.length, this._remaining = t.length, this._result = new Array(this.length), 0 === this.length ? Be(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(), 0 === this._remaining && Be(this.promise, this._result))) : He(this.promise, new Error("Array Methods must be provided an Array"));
  }
  Xe.prototype._enumerate = function () {
    for (var e = this.length, t = this._input, n = 0; this._state === Le && n < e; n++) this._eachEntry(t[n], n);
  }, Xe.prototype._eachEntry = function (e, t) {
    var n = this._instanceConstructor,
      r = n.resolve;
    if (r === xe) {
      var i = Ue(e);
      if (i === Ae && e._state !== Le) this._settledAt(e._state, t, e._result);else if ("function" != typeof i) this._remaining--, this._result[t] = e;else if (n === Je) {
        var o = new n(Me);
        Ne(o, e, i), this._willSettleAt(o, t);
      } else this._willSettleAt(new n(function (t) {
        return t(e);
      }), t);
    } else this._willSettleAt(r(e), t);
  }, Xe.prototype._settledAt = function (e, t, n) {
    var r = this.promise;
    r._state === Le && (this._remaining--, e === Pe ? He(r, n) : this._result[t] = n), 0 === this._remaining && Be(r, this._result);
  }, Xe.prototype._willSettleAt = function (e, t) {
    var n = this;
    je(e, void 0, function (e) {
      return n._settledAt(Fe, t, e);
    }, function (e) {
      return n._settledAt(Pe, t, e);
    });
  };
  var Je = function (e) {
    this[Oe] = Ge++, this._result = this._state = void 0, this._subscribers = [], Me !== e && ("function" != typeof e && function () {
      throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
    }(), this instanceof Je ? function (e, t) {
      try {
        t(function (t) {
          We(e, t);
        }, function (t) {
          He(e, t);
        });
      } catch (t) {
        He(e, t);
      }
    }(this, e) : function () {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }());
  };
  Je.all = function (e) {
    return new Xe(this, e).promise;
  }, Je.race = function (e) {
    var t = this;
    return _e(e) ? new t(function (n, r) {
      for (var i = e.length, o = 0; o < i; o++) t.resolve(e[o]).then(n, r);
    }) : new t(function (e, t) {
      return t(new TypeError("You must pass an array to race."));
    });
  }, Je.resolve = xe, Je.reject = function (e) {
    var t = new this(Me);
    return He(t, e), t;
  }, Je._setAsap = function (e) {
    me = e;
  }, Je._asap = me, Je.prototype = {
    constructor: Je,
    then: Ae,
    "catch": function (e) {
      return this.then(null, e);
    }
  };
  var $e,
    Ze,
    et = "function" == typeof window.Promise ? window.Promise : Je,
    tt = function () {
      return (tt = Object.assign || function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        return e;
      }).apply(this, arguments);
    };
  function nt(e) {
    return s.arrayIsArray(e);
  }
  var rt, it, ot, st, at, ut;
  function ct(e, t) {
    return 0 == e.lastIndexOf(t, 0);
  }
  function ht(e, t) {
    for (var n in e) s.objectHasOwnProp(e, n) && t(e[n], n, e);
  }
  function dt(e) {
    for (var t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return e[t];
  }
  function lt(e, t) {
    var n = 0;
    for (var r in e) if (Object.prototype.hasOwnProperty.call(e, r) && ++n > t) return !1;
    return n == t;
  }
  function pt(e, t) {
    var n = 0;
    for (var r in e) if (Object.prototype.hasOwnProperty.call(e, r) && ++n > t) return !0;
    return !1;
  }
  Ze = "function" == typeof s.objectKeys ? function (e) {
    return s.objectKeys(e);
  } : function (e) {
    var t = [];
    for (var n in e) s.objectHasOwnProp(e, n) && t.push(n);
    return t;
  }, st = (ot = function (e) {
    return e.matches || e.msMatchesSelector || e.webkitMatchesSelector;
  })(window.Element.prototype), !(at = window.document ? window.document.documentElement : void 0) || st && at instanceof window.Element || (st = ot(at)), it = ($e = [st, function (e, t) {
    return st.call(e, t);
  }])[0], rt = $e[1];
  var ft;
  ut = ae ? function (e) {
    var t = e.nextSibling;
    return t && e.parentNode && t === e.parentNode.firstChild ? null : t;
  } : function (e) {
    return e.nextSibling;
  };
  var vt;
  ft = ae ? function (e, t) {
    if (e) {
      var n = e.parentNode ? e.parentNode.firstChild : null;
      do {
        t(e), e = e.nextSibling;
      } while (e && e != n);
    }
  } : function (e, t) {
    for (; e; e = e.nextSibling) t(e);
  };
  vt = ae ? function (e) {
    var t = e.previousSibling;
    return t && e.parentNode && t === e.parentNode.lastChild ? null : t;
  } : function (e) {
    return e.previousSibling;
  };
  function _t(e, t) {
    if (!e) return oe;
    var n = function (e) {
      try {
        var t = window;
        return t.Zone && t.Zone.root && "function" == typeof t.Zone.root.wrap ? t.Zone.root.wrap(e) : e;
      } catch (t) {
        return e;
      }
    }(e);
    return t && (n = n.bind(t)), ie(n, function (e) {
      o("Unexpected error: " + e);
    });
  }
  function gt(e) {
    var t,
      n = Array.prototype.toJSON,
      r = String.prototype.toJSON;
    n && (Array.prototype.toJSON = void 0), r && (String.prototype.toJSON = void 0);
    try {
      t = s.jsonStringify(e);
    } catch (e) {
      t = mt(e);
    } finally {
      n && (Array.prototype.toJSON = n), r && (String.prototype.toJSON = r);
    }
    return t;
  }
  function mt(e) {
    var t = "Internal error: unable to determine what JSON error was";
    try {
      t = (t = "" + e).replace(/[^a-zA-Z0-9\.\:\!\, ]/g, "_");
    } catch (e) {}
    return "\"" + t + "\"";
  }
  function yt(e) {
    var t = e.doctype;
    if (!t) return "";
    var n = "<!DOCTYPE ";
    return n += t.name, t.publicId && (n += " PUBLIC \"" + t.publicId + "\""), t.systemId && (n += " \"" + t.systemId + "\""), n + ">";
  }
  function wt(e) {
    return s.jsonParse(e);
  }
  function bt(e) {
    var t = 0,
      n = 0;
    return null == e.screen ? [t, n] : (t = parseInt(String(e.screen.width)), n = parseInt(String(e.screen.height)), [t = isNaN(t) ? 0 : t, n = isNaN(n) ? 0 : n]);
  }
  var St = function () {
      function e(e, t) {
        this.target = e, this.propertyName = t, this._before = oe, this._afterSync = oe, this._afterAsync = oe, this.on = !1;
      }
      return e.prototype.before = function (e) {
        return this._before = _t(e), this;
      }, e.prototype.afterSync = function (e) {
        return this._afterSync = _t(e), this;
      }, e.prototype.afterAsync = function (e) {
        return this._afterAsync = _t(function (t) {
          s.setWindowTimeout(window, ie(function () {
            e(t);
          }), 0);
        }), this;
      }, e.prototype.disable = function () {
        if (this.on = !1, this.shim) {
          var e = this.shim,
            t = e.override,
            n = e["native"];
          this.target[this.propertyName] === t && (this.target[this.propertyName] = n, this.shim = void 0);
        }
      }, e.prototype.enable = function () {
        if (this.on = !0, this.shim) return !0;
        this.shim = this.makeShim();
        try {
          this.target[this.propertyName] = this.shim.override;
        } catch (e) {
          return !1;
        }
        return !0;
      }, e.prototype.makeShim = function () {
        var e = this,
          t = this.target[this.propertyName];
        return {
          "native": t,
          override: function () {
            var n = {
              that: this,
              args: arguments,
              result: null
            };
            e.on && e._before(n);
            var r = t.apply(this, arguments);
            return e.on && (n.result = r, e._afterSync(n), e._afterAsync(n)), r;
          }
        };
      }, e;
    }(),
    Et = {};
  function Tt(e, t) {
    if (!e || "function" != typeof e[t]) return null;
    var n;
    Et[t] = Et[t] || [];
    for (var r = 0; r < Et[t].length; r++) Et[t][r].obj == e && (n = Et[t][r].hook);
    return n || (n = new St(e, t), Et[t].push({
      obj: e,
      hook: n
    })), n.enable() ? n : null;
  }
  function kt(e, t, n) {
    if (!e) return function () {};
    var r = Object.getOwnPropertyDescriptor(e.prototype, t);
    if (!r || !r.set) return function () {};
    var i = r.set,
      o = _t(n),
      s = !0;
    function a(e) {
      i.call(this, e), s && o(this, e);
    }
    return Object.defineProperty(e.prototype, t, tt(tt({}, r), {
      set: a
    })), function () {
      s = !1;
      var n = Object.getOwnPropertyDescriptor(e.prototype, t);
      n && a === n.set && Object.defineProperty(e.prototype, t, tt(tt({}, n), {
        set: i
      }));
    };
  }
  var It = 10,
    Ct = "[anonymous]",
    Rt = /function\s*([\w\-$]+)?\s*\(/i;
  function At(e) {
    return e.stack || e.backtrace || e.stacktrace;
  }
  function xt() {
    var e, t;
    try {
      throw new Error("");
    } catch (n) {
      e = "<generated>\n", t = At(n);
    }
    if (!t) {
      e = "<generated-ie>\n";
      var n = [];
      try {
        for (var r = arguments.callee.caller.caller; r && n.length < It;) {
          var i = Rt.test(r.toString()) && RegExp.$1 || Ct;
          n.push(i), r = r.caller;
        }
      } catch (e) {
        o(e);
      }
      t = n.join("\n");
    }
    return e + t;
  }
  function Ot() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return !0;
    }
  }
  var Mt = function () {
      function e() {}
      return e.wrap = function (t, n) {
        return void 0 === n && (n = "error"), ie(t, function (t) {
          return e.sendToBugsnag(t, n);
        });
      }, e.errorLimit = 15, e.sendToBugsnag = function (t, n, r) {
        if (!(e.errorLimit <= 0)) {
          e.errorLimit--, "string" == typeof t && (t = new Error(t));
          var i = y(document).fs_uid,
            o = i ? m(i) : void 0;
          o && o.orgId != P(window) && (o = void 0);
          var s = new Date(1591209308e3).toISOString(),
            a = {
              projectRoot: window.location.origin,
              deviceTime: p(),
              inIframe: Ot(),
              CompiledTimestamp: 1591209308,
              CompiledTime: s,
              orgId: P(window),
              "userId:sessionId": o ? o.userId + ":" + o.sessionId : "NA",
              context: document.location && document.location.pathname,
              message: t.message,
              name: "Recording Error",
              releaseStage: "production " + s,
              severity: n,
              language: navigator.language || navigator.userLanguage || "en-GB",
              stacktrace: At(t) || xt()
            };
          if (r) for (var u in r) {
            var c = typeof r[u];
            a["aux_" + u] = "string" === c || "number" === c ? r[u] : gt(r[u]);
          }
          var h = [];
          for (var u in a) h.push(encodeURIComponent(u) + "=" + encodeURIComponent(a[u]));
          new Image().src = "https://" + F(window) + "/rec/except?" + h.join("&");
        }
      }, e;
    }(),
    Lt = {};
  function Ft(e, t, n) {
    if (void 0 === n && (n = 1), e) return !0;
    if (Lt[t] = Lt[t] || 0, Lt[t]++, Lt[t] > n) return !1;
    var r = new Error("Assertion failed: " + t);
    return Mt.sendToBugsnag(r, "error"), e;
  }
  function Pt(e, t, n, r) {
    void 0 !== n && ("function" == typeof e.addEventListener ? e.addEventListener(t, n, r) : "function" == typeof e.addListener ? e.addListener(n) : o("Target of " + t + " doesn't seem to support listeners"));
  }
  function qt(e, t, n, r) {
    void 0 !== n && ("function" == typeof e.removeEventListener ? e.removeEventListener(t, n, r) : "function" == typeof e.removeListener ? e.removeListener(n) : o("Target of " + t + " doesn't seem to support listeners"));
  }
  var Ut = function () {
    function e() {
      var e = this;
      this._listeners = [], this._children = [], this._yesCapture = !0, this._noCapture = !1;
      try {
        var t = Object.defineProperty({}, "passive", {
          get: function () {
            e._yesCapture = {
              capture: !0,
              passive: !0
            }, e._noCapture = {
              capture: !1,
              passive: !0
            };
          }
        });
        window.addEventListener("test", oe, t);
      } catch (e) {}
    }
    return e.prototype.add = function (e, t, n, r, i) {
      return void 0 === i && (i = !1), this.addCustom(e, t, n, r, i);
    }, e.prototype.addCustom = function (e, t, n, r, i) {
      void 0 === i && (i = !1);
      var o = {
        target: e,
        type: t,
        fn: Mt.wrap(function (e) {
          (i || !1 !== e.isTrusted || "message" == t || e._fs_trust_event) && r(e);
        }),
        options: n ? this._yesCapture : this._noCapture,
        index: this._listeners.length
      };
      return this._listeners.push(o), Pt(e, t, o.fn, o.options), o;
    }, e.prototype.remove = function (e) {
      e.target && (qt(e.target, e.type, e.fn, e.options), e.target = null, e.fn = void 0);
    }, e.prototype.clear = function () {
      for (var e = 0; e < this._listeners.length; e++) this._listeners[e].target && this.remove(this._listeners[e]);
      this._listeners = [];
    }, e.prototype.createChild = function () {
      var t = new e();
      return this._children.push(t), t;
    }, e.prototype.refresh = function () {
      for (var e = 0, t = this._listeners; e < t.length; e++) {
        var n = t[e];
        n.target && (qt(n.target, n.type, n.fn, n.options), Pt(n.target, n.type, n.fn, n.options));
      }
      for (var r = 0, i = this._children; r < i.length; r++) {
        i[r].refresh();
      }
    }, e;
  }();
  function Nt(e, t) {
    return t && e.pageLeft == t.pageLeft && e.pageTop == t.pageTop;
  }
  function Wt(e, t) {
    return t && e.width == t.width && e.height == t.height;
  }
  function Dt(e) {
    return {
      pageLeft: e.pageLeft,
      pageTop: e.pageTop,
      width: e.width,
      height: e.height
    };
  }
  var Bt = [["@import\\s+\"", "\""], ["@import\\s+'", "'"]].concat([["url\\(\\s*\"", "\"\\s*\\)"], ["url\\(\\s*'", "'\\s*\\)"], ["url\\(\\s*", "\\s*\\)"]]),
    Ht = ".*?" + /(?:[^\\](?:\\\\)*)/.source;
  new RegExp(Bt.map(function (e) {
    var t = e[0],
      n = e[1];
    return "(" + t + ")(" + Ht + ")(" + n + ")";
  }).join("|"), "g");
  var jt = /url\(["']?(.+?)["']?\)/g,
    Kt = /^\s*\/\//;
  function Vt(e) {
    return e && e.body && e.documentElement ? "BackCompat" == e.compatMode ? [e.body.clientWidth, e.body.clientHeight] : [e.documentElement.clientWidth, e.documentElement.clientHeight] : [0, 0];
  }
  var zt = function () {
    function e(e, t) {
      var n, r;
      this.hasKnownPosition = !1, this.pageLeft = 0, this.pageTop = 0, this.width = 0, this.height = 0, this.clientWidth = 0, this.clientHeight = 0;
      var i = e.document;
      if (i && i.documentElement && i.body) {
        if ("visualViewport" in e) {
          var o = i.documentElement.getBoundingClientRect();
          this.hasKnownPosition = !0, this.pageLeft = 0 == o.left ? 0 : -o.left, this.pageTop = 0 == o.top ? 0 : -o.top;
        }
        if (n = Vt(i), this.clientWidth = n[0], this.clientHeight = n[1], void 0 !== t && this.clientWidth == t.clientWidth && this.clientHeight == t.clientHeight && t.width > 0 && t.height > 0) return this.width = t.width, void (this.height = t.height);
        r = this.computeLayoutViewportSizeFromMediaQueries(e), this.width = r[0], this.height = r[1];
      }
    }
    return e.prototype.computeLayoutViewportSizeFromMediaQueries = function (e) {
      var t = this.findMediaValue(e, "width", this.clientWidth, this.clientWidth + 128);
      void 0 === t && (t = this.tryToGet(e, "innerWidth")), void 0 === t && (t = this.clientWidth);
      var n = this.findMediaValue(e, "height", this.clientHeight, this.clientHeight + 128);
      return void 0 === n && (n = this.tryToGet(e, "innerHeight")), void 0 === n && (n = this.clientHeight), [t, n];
    }, e.prototype.findMediaValue = function (e, t, n, r) {
      if (s.matchMedia) {
        var i = s.matchMedia(e, "(min-" + t + ": " + n + "px)");
        if (null != i) {
          if (i.matches && s.matchMedia(e, "(max-" + t + ": " + n + "px)").matches) return n;
          for (; n <= r;) {
            var o = s.mathFloor((n + r) / 2);
            if (s.matchMedia(e, "(min-" + t + ": " + o + "px)").matches) {
              if (s.matchMedia(e, "(max-" + t + ": " + o + "px)").matches) return o;
              n = o + 1;
            } else r = o - 1;
          }
        }
      }
    }, e.prototype.tryToGet = function (e, t) {
      try {
        return e[t];
      } catch (e) {
        return;
      }
    }, e;
  }();
  function Yt(e, t) {
    return new zt(e, t);
  }
  var Gt = function (e, t) {
    this.offsetLeft = 0, this.offsetTop = 0, this.pageLeft = 0, this.pageTop = 0, this.width = 0, this.height = 0, this.scale = 0;
    var n = e.document;
    if (n.body) {
      var r = "BackCompat" == n.compatMode;
      "pageXOffset" in e ? (this.pageLeft = e.pageXOffset, this.pageTop = e.pageYOffset) : n.scrollingElement ? (this.pageLeft = n.scrollingElement.scrollLeft, this.pageTop = n.scrollingElement.scrollTop) : r ? (this.pageLeft = n.body.scrollLeft, this.pageTop = n.body.scrollTop) : n.documentElement && (n.documentElement.scrollLeft > 0 || n.documentElement.scrollTop > 0) ? (this.pageLeft = n.documentElement.scrollLeft, this.pageTop = n.documentElement.scrollTop) : (this.pageLeft = n.body.scrollLeft || 0, this.pageTop = n.body.scrollTop || 0), this.offsetLeft = this.pageLeft - t.pageLeft, this.offsetTop = this.pageTop - t.pageTop;
      try {
        var i = e.innerWidth,
          o = e.innerHeight;
      } catch (e) {
        return;
      }
      if (0 != i && 0 != o) {
        this.scale = t.width / i, this.scale < 1 && (this.scale = 1);
        var s = t.width - t.clientWidth,
          a = t.height - t.clientHeight;
        this.width = i - s / this.scale, this.height = o - a / this.scale;
      }
    }
  };
  var Qt,
    Xt = (Qt = function (e, t) {
      return (Qt = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (e, t) {
        e.__proto__ = t;
      } || function (e, t) {
        for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
      })(e, t);
    }, function (e, t) {
      function n() {
        this.constructor = e;
      }
      Qt(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
    }),
    Jt = function (e, t, n, r) {
      return new (n || (n = Promise))(function (i, o) {
        function s(e) {
          try {
            u(r.next(e));
          } catch (e) {
            o(e);
          }
        }
        function a(e) {
          try {
            u(r["throw"](e));
          } catch (e) {
            o(e);
          }
        }
        function u(e) {
          var t;
          e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function (e) {
            e(t);
          })).then(s, a);
        }
        u((r = r.apply(e, t || [])).next());
      });
    },
    $t = function (e, t) {
      var n,
        r,
        i,
        o,
        s = {
          label: 0,
          sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          },
          trys: [],
          ops: []
        };
      return o = {
        next: a(0),
        "throw": a(1),
        "return": a(2)
      }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
        return this;
      }), o;
      function a(o) {
        return function (a) {
          return function (o) {
            if (n) throw new TypeError("Generator is already executing.");
            for (; s;) try {
              if (n = 1, r && (i = 2 & o[0] ? r["return"] : o[0] ? r["throw"] || ((i = r["return"]) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
              switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                case 0:
                case 1:
                  i = o;
                  break;
                case 4:
                  return s.label++, {
                    value: o[1],
                    done: !1
                  };
                case 5:
                  s.label++, r = o[1], o = [0];
                  continue;
                case 7:
                  o = s.ops.pop(), s.trys.pop();
                  continue;
                default:
                  if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                    s = 0;
                    continue;
                  }
                  if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                    s.label = o[1];
                    break;
                  }
                  if (6 === o[0] && s.label < i[1]) {
                    s.label = i[1], i = o;
                    break;
                  }
                  if (i && s.label < i[2]) {
                    s.label = i[2], s.ops.push(o);
                    break;
                  }
                  i[2] && s.ops.pop(), s.trys.pop();
                  continue;
              }
              o = t.call(e, s);
            } catch (e) {
              o = [6, e], r = 0;
            } finally {
              n = i = 0;
            }
            if (5 & o[0]) throw o[1];
            return {
              value: o[0] ? o[1] : void 0,
              done: !0
            };
          }([o, a]);
        };
      }
    },
    Zt = function () {
      function e() {
        var t = this;
        this._wrappedTick = Mt.wrap(function () {
          t.unregister(), t._tick();
        }), this._due = 0, this._id = e.nextId++;
      }
      return e._rearm = function () {
        e.checkedAlready = !1, e.lastCheck = 0;
      }, e.checkForBrokenSchedulers = function () {
        return Jt(this, void 0, et, function () {
          var t, n;
          return $t(this, function (r) {
            switch (r.label) {
              case 0:
                return !s.requestWindowAnimationFrame || e.checkedAlready ? [2, void 0] : (t = p()) - e.lastCheck < 100 ? [2, void 0] : (e.lastCheck = t, e.checkedAlready = !0, [4, new et(function (e) {
                  return s.requestWindowAnimationFrame(window, e);
                })]);
              case 1:
                return r.sent(), n = [], ht(e.registry, function (e) {
                  var r = e.maybeForceTick(t);
                  r && n.push(r);
                }), [2, et.all(n).then(function () {
                  s.requestWindowAnimationFrame(window, Mt.wrap(function () {
                    e.checkedAlready = !1;
                  }));
                })];
            }
          });
        });
      }, e.stopAll = function () {
        ht(this.registry, function (e) {
          return e.stop();
        });
      }, e.prototype.setTick = function (e) {
        this._tick = e;
      }, e.prototype.stop = function () {
        this.cancel(), delete e.registry[this._id];
      }, e.prototype.register = function (t) {
        this._due = p() + 100 + 1.5 * t, e.registry[this._id] = this;
      }, e.prototype.unregister = function () {
        delete e.registry[this._id];
      }, e.prototype.maybeForceTick = function (e) {
        if (e > this._due) return et.resolve().then(this._wrappedTick)["catch"](function () {});
      }, e.registry = {}, e.nextId = 0, e.checkedAlready = !1, e.lastCheck = 0, e;
    }(),
    en = function (e) {
      function t(t) {
        var n = e.call(this) || this;
        return n._interval = t, n._handle = -1, n;
      }
      return Xt(t, e), t.prototype.start = function (e) {
        var t = this;
        -1 == this._handle && (this.setTick(function () {
          e(), t.register(t._interval);
        }), this._handle = s.setWindowInterval(window, this._wrappedTick, this._interval), this.register(this._interval));
      }, t.prototype.cancel = function () {
        -1 != this._handle && (s.clearWindowInterval(window, this._handle), this._handle = -1, this.setTick(function () {}));
      }, t;
    }(Zt),
    tn = function (e) {
      function t(t, n, r) {
        void 0 === n && (n = 0);
        for (var i = [], o = 3; o < arguments.length; o++) i[o - 3] = arguments[o];
        var s = e.call(this) || this;
        return s.delay = n, s.timer = -1, s.setTick(function () {
          t.apply(void 0 === r ? window : r, i), s.stop();
        }), s;
      }
      return Xt(t, e), t.prototype.start = function (e) {
        return void 0 === e && (e = this.delay), this.delay = e, s.clearWindowTimeout(window, this.timer), this.timer = s.setWindowTimeout(window, this._wrappedTick, this.delay), this.register(e), this;
      }, t.prototype.cancel = function () {
        -1 != this.timer && (s.clearWindowTimeout(window, this.timer), this.timer = -1);
      }, t;
    }(Zt);
  !function () {
    function e(e) {
      this.deadlineTime = e, this.didTimeout = this.deadlineTime <= p();
    }
    e.prototype.timeRemaining = function () {
      return this.deadlineTime - p();
    };
  }();
  var nn = function () {
      function e(e, t, n) {
        this.limit = e, this.breaker = n, this.remaining = 0, this.ticker = new en(t), this.open();
      }
      return e.prototype.guard = function (e) {
        var t = this;
        return function () {
          return 0 == t.remaining ? (t.breaker(), void t.remaining--) : t.remaining < 0 ? void 0 : (t.remaining--, e.apply(this, arguments));
        };
      }, e.prototype.close = function () {
        return this.ticker.stop(), this;
      }, e.prototype.open = function () {
        var e = this;
        return this.remaining = this.limit, this.ticker.start(function () {
          e.remaining = e.limit;
        }), this;
      }, e;
    }(),
    rn = function () {
      function e() {
        this._reported = 0, this._skew = 0, this._startTime = l ? l.timeOrigin : d.timeOrigin;
      }
      return e.prototype.wallTime = function () {
        return p();
      }, e.prototype.now = function () {
        var e = this.wallTime() - this._startTime;
        return e < 0 && this._reportTimeSkew("timekeeper now() is negative"), e;
      }, e.prototype.startTime = function () {
        return this._startTime;
      }, e.prototype.setStartTime = function (e) {
        var t = this.wallTime();
        this._startTime = e, e > t && (this._skew = e - t, this._reportTimeSkew("timekeeper set with future ts"));
      }, e.prototype._reportTimeSkew = function (e) {
        this._reported++ <= 2 && Mt.sendToBugsnag(e, "error", {
          skew: this._skew,
          startTime: this._startTime,
          wallTime: this.wallTime()
        });
      }, e;
    }();
  function on(e) {
    var t = e;
    return t.tagName ? "object" == typeof t.tagName ? "form" : t.tagName.toLowerCase() : null;
  }
  var sn,
    an,
    un = n(3),
    cn = n(0),
    hn = Object.defineProperty,
    dn = p() % 1e9,
    ln = window.WeakMap || ((sn = function () {
      this.name = "__st" + (1e9 * s.mathRandom() >>> 0) + dn++ + "__";
    }).prototype = {
      set: function (e, t) {
        var n = e[this.name];
        n && n[0] === e ? n[1] = t : hn(e, this.name, {
          value: [e, t],
          writable: !0
        });
      },
      get: function (e) {
        var t;
        return (t = e[this.name]) && t[0] === e ? t[1] : void 0;
      }
    }, sn),
    pn = 1,
    fn = 4,
    vn = function () {
      for (var e = 0, t = 0, n = arguments.length; t < n; t++) e += arguments[t].length;
      var r = Array(e),
        i = 0;
      for (t = 0; t < n; t++) for (var o = arguments[t], s = 0, a = o.length; s < a; s++, i++) r[i] = o[s];
      return r;
    };
  function _n(e) {
    if (null == e) return 0;
    switch (e) {
      case an.Exclude:
        return 5;
      case an.Mask:
        return 4;
      case an.Unmask:
        return 3;
      case an.Watch:
        return 2;
      case an.Keep:
        return 1;
      default:
        return Object(cn.assertExhaustive)(e, "Undefined watch kind: " + e);
    }
  }
  !function (e) {
    e[e.Exclude = 1] = "Exclude", e[e.Mask = 2] = "Mask", e[e.Unmask = 3] = "Unmask", e[e.Watch = 4] = "Watch", e[e.Keep = 5] = "Keep";
  }(an || (an = {}));
  var gn = {
      1: "exclude",
      2: "mask",
      3: "unmask",
      4: "watch",
      5: "keep"
    },
    mn = [an.Exclude, an.Mask, an.Unmask, an.Watch, an.Keep],
    yn = function () {
      function e(e) {
        void 0 === e && (e = "matches"), this._watchStrategy = e, this._hasWatched = !1, this._rules = Sn(), this._consentRules = Sn();
      }
      return e.prototype.initialize = function (e) {
        var t = e.blocks,
          n = e.keeps,
          r = e.watches,
          i = e.flags;
        this._watchStrategy = i.watchStrategy;
        var o = vn(un);
        if (i.whitelist && o.push({
          Type: Z.Mask,
          Consent: j.RevokeConsent,
          Selector: "body"
        }), t) for (var s = 0, a = t; s < a.length; s++) {
          var u = a[s];
          o.push(u);
        }
        if (r) for (var c = 0, h = r; c < h.length; c++) {
          var d = h[c];
          o.push({
            Type: Z.Watch,
            Consent: j.RevokeConsent,
            Selector: d.Selector
          });
        }
        this._batchElementBlocks(o), n && this._batchElementKeeps(n);
      }, e.prototype.isWatched = function (e) {
        var t = [an.Exclude, an.Mask, an.Unmask, an.Watch, an.Keep];
        return this._firstMatch(t, e);
      }, e.prototype.matchesAnyKeepRule = function (e) {
        var t = [an.Keep];
        return null !== this._firstMatch(t, e);
      }, e.prototype.matchesAnyConsentRule = function (e) {
        var t = [an.Exclude, an.Mask, an.Unmask, an.Keep];
        return null !== this._firstConsentMatch(t, e);
      }, e.prototype._firstMatch = function (e, t) {
        this._hasWatched = !0;
        for (var n = 0, r = e; n < r.length; n++) for (var i = r[n], o = 0, s = this._rules[i]; o < s.length; o++) {
          var a = s[o];
          if (rt(t, a)) return i;
        }
        return this._consent ? null : this._firstConsentMatch(e, t);
      }, e.prototype._firstConsentMatch = function (e, t) {
        for (var n = 0, r = e; n < r.length; n++) for (var i = r[n], o = 0, s = this._consentRules[i]; o < s.length; o++) {
          var a = s[o];
          if (rt(t, a)) return i;
        }
        return null;
      }, e.prototype._batchElementBlocks = function (e) {
        var t = this,
          n = Sn(),
          r = Sn();
        e.map(wn).filter(function (e) {
          return bn(e.selector);
        }).forEach(function (e) {
          e.consent ? r[e.kind].push(e) : n[e.kind].push(e);
        });
        for (var i = document.documentElement || document.createElement("div"), o = function (e, n) {
            try {
              var r = e.map(function (e) {
                return e.selector;
              }).join(", ");
              rt(i, r), n.push(r);
            } catch (n) {
              Mt.sendToBugsnag("Browser rejected optimistic merge rule", "warning"), t._fallback(e);
            }
          }, s = 0, a = mn; s < a.length; s++) {
          var u = a[s];
          n[u].length > 0 && o(n[u], this._rules[u]), r[u].length > 0 && o(r[u], this._consentRules[u]);
        }
      }, e.prototype._fallback = function (e) {
        for (var t = 0, n = e; t < n.length; t++) {
          var r = n[t],
            i = r.kind,
            o = r.consent,
            s = r.selector;
          this.addRule(i, o, s);
        }
      }, e.prototype.addElementBlock = function (e) {
        var t = wn(e),
          n = t.kind,
          r = t.consent,
          i = t.selector;
        return this.addRule(n, r, i);
      }, e.prototype._batchElementKeeps = function (e) {
        for (var t = 0, n = e; t < n.length; t++) {
          var r = n[t];
          this.addElementKeep(r);
        }
      }, e.prototype.addElementKeep = function (e) {
        var t = an.Keep;
        switch (e.Type) {
          case ee.Click:
            break;
          default:
            return !1;
        }
        return this.addRule(t, e.Consent, e.Selector);
      }, e.prototype.addRule = function (e, t, n) {
        if (this.tryToAddRule(e, t, n)) return !0;
        switch (e) {
          case an.Watch:
          case an.Unmask:
          case an.Keep:
            break;
          case an.Mask:
          case an.Exclude:
          default:
            this._rules[e] = ["*"];
        }
        return !1;
      }, e.prototype.tryToAddRule = function (e, t, n) {
        try {
          return !bn(n) || this.mergeRule(e, t, n);
        } catch (e) {
          return Mt.sendToBugsnag("Error adding block rule", "error", {
            selector: n,
            error: e.toString()
          }), !1;
        }
      }, e.prototype.getConsent = function () {
        return this._consent;
      }, e.prototype.initializeConsent = function (e) {
        void 0 === this._consent && this.setConsent(e);
      }, e.prototype.setConsent = function (e) {
        this._consent !== e && (this._consent = e, this._hasWatched && this.onConsentChange && this.onConsentChange());
      }, e.prototype.mergeRule = function (e, t, n) {
        var r = t ? this._consentRules : this._rules,
          i = document.documentElement || document.createElement("div"),
          o = function () {
            try {
              return rt(i, n), !0;
            } catch (t) {
              return Mt.sendToBugsnag("Browser rejected rule", "warning", {
                kind: gn[e],
                selector: n,
                error: t.toString()
              }), !1;
            }
          };
        switch (e) {
          case an.Exclude:
          case an.Mask:
          case an.Unmask:
          case an.Watch:
          case an.Keep:
            break;
          default:
            e = an.Exclude;
        }
        if (0 == r[e].length) return !!o() && (r[e].push(n), !0);
        var s = r[e].length - 1,
          a = r[e][s].concat(", ", n);
        try {
          rt(i, a);
        } catch (t) {
          return !!o() && (r[e].push(n), Mt.sendToBugsnag("Browser rejected merged rule", "warning", {
            kind: gn[e],
            selector: n,
            error: t.toString()
          }), !0);
        }
        return r[e][s] = a, !0;
      }, e.prototype.allConsentSensitiveElements = function (e) {
        for (var t = [], n = 0, r = [an.Exclude, an.Mask, an.Unmask, an.Keep]; n < r.length; n++) for (var i = r[n], o = 0, s = this._consentRules[i]; o < s.length; o++) for (var a = s[o], u = e.querySelectorAll(a), c = 0; c < u.length; c++) t.push(u[c]);
        return t;
      }, e.prototype.allWatchedElements = function (e) {
        var t = this;
        if ("matches" === this._watchStrategy) return null;
        this._hasWatched = !0;
        for (var n = new ln(), r = function (e, r, i) {
            var o = n.get(e) || {
              kind: null,
              matchesAnyKeepRule: !1,
              matchesAnyConsentRule: i
            };
            (!i || i && !t._consent) && (null == o.kind && (o.kind = r), r === an.Keep && (o.matchesAnyKeepRule = !0)), i && (o.matchesAnyConsentRule = !0), n.set(e, o);
          }, i = 0, o = [[this._rules, !1], [this._consentRules, !0]]; i < o.length; i++) for (var s = o[i], a = s[0], u = s[1], c = 0, h = mn; c < h.length; c++) for (var d = h[c], l = 0, p = a[d]; l < p.length; l++) {
          var f = p[l];
          En(e) && rt(e, f) && r(e, d, u);
          for (var v = e.querySelectorAll(f), _ = 0; _ < v.length; _++) r(v[_], d, u);
        }
        return n;
      }, e.prototype.getWatchStrategy = function () {
        return this._watchStrategy;
      }, e;
    }();
  function wn(e) {
    var t = an.Exclude;
    switch (e.Type) {
      case Z.Unset:
      case Z.Exclude:
        t = an.Exclude;
        break;
      case Z.Mask:
        t = an.Mask;
        break;
      case Z.Unmask:
        t = an.Unmask;
        break;
      case Z.Watch:
        t = an.Watch;
        break;
      case Z.Keep:
        t = an.Keep;
    }
    return {
      kind: t,
      consent: e.Consent,
      selector: e.Selector
    };
  }
  function bn(e) {
    return !e.match(Kt) && "" != e.trim();
  }
  function Sn() {
    for (var e = Object.create ? Object.create(null) : {}, t = 0, n = mn; t < n.length; t++) {
      e[n[t]] = [];
    }
    return e;
  }
  function En(e) {
    return e.nodeType === pn;
  }
  var Tn = {},
    kn = 1;
  function In(e) {
    var t = xn(e);
    return !!t && void 0 !== t.watchKind;
  }
  function Cn(e) {
    var t = xn(e);
    return !!t && t.watchKind == an.Exclude;
  }
  function Rn(e) {
    var t = xn(e);
    return !!t && !!t.mask;
  }
  function An(e) {
    var t = xn(e);
    return t ? t.watchKind : void 0;
  }
  function xn(e) {
    return e ? Tn[e._fs] : null;
  }
  function On(e) {
    return Tn[e];
  }
  function Mn(e) {
    try {
      return e && e._fs || 0;
    } catch (e) {
      return 0;
    }
  }
  function Ln(e) {
    return Cn(e) ? 0 : Mn(e);
  }
  function Fn(e, t) {
    e.parent && (t.unobserveSubtree(e.node), e.parent.child == e && (e.parent.child = e.next), e.parent.lastChild == e && (e.parent.lastChild = e.prev), e.prev && (e.prev.next = e.next), e.next && (e.next.prev = e.prev), e.parent = e.prev = e.next = null, delete Tn[e.id], e.node._fs == e.id && (e.node._fs = 0), e.id = 0, e.child && Pn(e.child));
  }
  function Pn(e) {
    for (var t = [e]; t.length > 0 && t.length < 1e4;) {
      var n = t.pop();
      delete Tn[n.id], n.node._fs == n.id && (n.node._fs = 0), n.id = 0, n.next && t.push(n.next), n.child && t.push(n.child);
    }
    Ft(t.length < 1e4, "clearIds is fast");
  }
  var qn,
    Un = function () {
      function e(e, t) {
        this._onchange = e, this._checkElem = t, this._fallback = !1, this._elems = {}, this.values = {}, this.radios = {}, qn = this;
      }
      return e.prototype.hookEvents = function () {
        (function () {
          var e = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
          if (!e || !e.set) return !1;
          Nn || (kt(HTMLInputElement, "value", jn), kt(HTMLInputElement, "checked", jn), kt(HTMLSelectElement, "value", jn), kt(HTMLTextAreaElement, "value", jn), kt(HTMLSelectElement, "selectedIndex", jn), kt(HTMLOptionElement, "selected", jn), Nn = !0);
          return !0;
        })() || (this._fallback = !0);
      }, e.prototype.addInput = function (e) {
        var t = Mn(e);
        if (this._elems[t] = e, Vn(e)) {
          var n = Hn(e);
          e.checked && (this.radios[n] = t);
        } else this.values[t] = Kn(e);
        (function (e) {
          switch (e.type) {
            case "checkbox":
            case "radio":
              return e.checked != e.hasAttribute("checked");
            default:
              return (e.value || "") != function (e) {
                if ("select" != on(e)) return e.getAttribute("value") || "";
                var t = e,
                  n = t.querySelector("option[selected]") || t.querySelector("option");
                if (!n) return "";
                return n.value || "";
              }(e);
          }
        })(e) && this._onchange(e);
      }, e.prototype.diffValue = function (e, t) {
        var n = Mn(e);
        if (Vn(e)) {
          var r = Hn(e);
          return this.radios[r] == n != ("true" == t);
        }
        return this.values[n] != t;
      }, e.prototype.onChange = function (e, t) {
        void 0 === t && (t = Kn(e));
        var n = Mn(e);
        if ((e = this._elems[n]) && this.diffValue(e, t)) if (this._onchange(e), Vn(e)) {
          var r = Hn(e);
          "false" == t && this.radios[r] == n ? delete this.radios[r] : this.radios[r] = n;
        } else this.values[n] = t;
      }, e.prototype.tick = function () {
        for (var e in this._elems) {
          var t = this._elems[e];
          if (this._checkElem(t)) {
            if (this._fallback) {
              var n = Kn(t);
              if (t && this.diffValue(t, n)) if (this._onchange(t), Vn(t)) {
                var r = Hn(t);
                this.radios[r] = +e;
              } else this.values[e] = n;
            }
          } else delete this._elems[e], delete this.values[e], Vn(t) && delete this.radios[Hn(t)];
        }
      }, e.prototype.shutdown = function () {
        qn = null;
      }, e.prototype._usingFallback = function () {
        return this._fallback;
      }, e.prototype._trackingElem = function (e) {
        return !!this._elems[e];
      }, e;
    }(),
    Nn = !1;
  var Wn,
    Dn = {};
  function Bn() {
    try {
      if (qn) for (var e in Dn) {
        var t = Dn[e],
          n = t[0],
          r = t[1];
        qn.onChange(n, r);
      }
    } finally {
      Wn = null, Dn = {};
    }
  }
  function Hn(e) {
    if (!e) return "";
    for (var t = e; t && "form" != on(t);) t = t.parentElement;
    return (t && "form" == on(t) ? Mn(t) : 0) + ":" + e.name;
  }
  function jn(e, t) {
    var n = function e(t, n) {
        if (void 0 === n && (n = 2), n <= 0) return t;
        var r = on(t);
        return "option" != r && "optgroup" != r || !t.parentElement ? t : e(t.parentElement, n - 1);
      }(e),
      r = Mn(n);
    r && qn && qn.diffValue(n, "" + t) && (Dn[r] = [n, "" + t], Wn || (Wn = new tn(Bn)).start());
  }
  function Kn(e) {
    switch (e.type) {
      case "checkbox":
      case "radio":
        return "" + e.checked;
      default:
        var t = e.value;
        return t || (t = ""), "" + t;
    }
  }
  function Vn(e) {
    return e && "radio" == e.type;
  }
  var zn = {};
  var Yn = "__default";
  function Gn(e) {
    void 0 === e && (e = Yn);
    var t = zn[e];
    return t || (t = function () {
      var e = document.implementation.createHTMLDocument("");
      return e.head || e.documentElement.appendChild(e.createElement("head")), e.body || e.documentElement.appendChild(e.createElement("body")), e;
    }(), e !== Yn && (t.open(), t.write(e), t.close()), zn[e] = t), t;
  }
  var Qn = new (function () {
    function e() {
      var e = Gn(),
        t = e.getElementById("urlresolver-base");
      t || ((t = e.createElement("base")).id = "urlresolver-base", e.head.appendChild(t));
      var n = e.getElementById("urlresolver-parser");
      n || ((n = e.createElement("a")).id = "urlresolver-parser", e.head.appendChild(n)), this.base = t, this.parser = n;
    }
    return e.prototype.parseUrl = function (e, t) {
      if ("undefined" != typeof URL) try {
        e || (e = document.baseURI);
        var n = e ? new URL(t, e) : new URL(t);
        if (n.href) return n;
      } catch (e) {}
      return this.parseUrlUsingBaseAndAnchor(e, t);
    }, e.prototype.parseUrlUsingBaseAndAnchor = function (e, t) {
      this.base.setAttribute("href", e), this.parser.setAttribute("href", t);
      var n = document.createElement("a");
      return n.href = this.parser.href, n;
    }, e.prototype.resolveUrl = function (e, t) {
      return this.parseUrl(e, t).href;
    }, e.prototype.resolveToDocument = function (e, t) {
      var n = Jn(e);
      return null == n ? t : this.resolveUrl(n, t);
    }, e;
  }())();
  function Xn(e, t) {
    return Qn.parseUrl(e, t);
  }
  function Jn(e) {
    var t = e.document,
      n = e.location.href;
    if ("string" == typeof t.baseURI) n = t.baseURI;else {
      var r = t.getElementsByTagName("base")[0];
      r && r.href && (n = r.href);
    }
    return "about:blank" == n && e.parent != e ? Jn(e.parent) : n;
  }
  var $n = new RegExp("[^\\s]"),
    Zn = new RegExp("[\\s]*$");
  String.prototype;
  function er(e) {
    var t = $n.exec(e);
    if (!t) return e;
    for (var n = t.index, r = (t = Zn.exec(e)) ? e.length - t.index : 0, i = "\uFFFF", o = e.slice(n, e.length - r).split(/\r\n?|\n/g), s = 0; s < o.length; s++) i += "" + o[s].length, s != o.length - 1 && (i += ":");
    return (n || r) && (i += " " + n + " " + r), i;
  }
  var tr = ["allowReorder", "attributeName", "attributeType", "autoReverse", "baseFrequency", "baseProfile", "calcMode", "clipPathUnits", "contentScriptType", "contentStyleType", "diffuseConstant", "edgeMode", "externalResourcesRequired", "filterRes", "filterUnits", "glyphRef", "gradientTransform", "gradientUnits", "kernelMatrix", "kernelUnitLength", "keyPoints", "keySplines", "keyTimes", "lengthAdjust", "limitingConeAngle", "markerHeight", "markerUnits", "markerWidth", "maskContentUnits", "maskUnits", "numOctaves", "pathLength", "patternContentUnits", "patternTransform", "patternUnits", "pointsAtX", "pointsAtY", "pointsAtZ", "preserveAlpha", "preserveAspectRatio", "primitiveUnits", "refX", "refY", "referrerPolicy", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "specularConstant", "specularExponent", "spreadMethod", "startOffset", "stdDeviation", "stitchTiles", "surfaceScale", "systemLanguage", "tableValues", "targetX", "targetY", "textLength", "viewBox", "viewTarget", "xChannelSelector", "yChannelSelector", "zoomAndPan"].reduce(function (e, t) {
      return e[t] = t, e[t.toUpperCase()] = t, e;
    }, {}),
    nr = n(2),
    rr = "(redacted)",
    ir = 16e6;
  function or(e, t) {
    var n = e.textContent;
    if (!n) return "";
    if (!t && !(t = xn(e))) return "";
    var r = n.length;
    return r > ir ? (Mt.sendToBugsnag("Ignoring huge text node", "warning", {
      length: r
    }), "") : e.parentNode && "style" == on(e.parentNode) ? n : t.mask ? er(n) : n;
  }
  function sr(e) {
    return tr[e] || e.toLowerCase();
  }
  function ar(e, t, n, r) {
    var i,
      o = on(t);
    if (null === o) return null;
    var s = function (e) {
      var t, r, s;
      i = null !== (r = null === (t = nr[e][o]) || void 0 === t ? void 0 : t[n]) && void 0 !== r ? r : null === (s = nr[e]["*"]) || void 0 === s ? void 0 : s[n];
    };
    if (s("Any"), void 0 === i) {
      var a = xn(t);
      if (!a) return null;
      a.watchKind == an.Exclude ? s("Exclude") : a.mask && s("Mask");
    }
    if (void 0 === i) return r;
    switch (i) {
      case "erase":
        return null;
      case "scrubUrl":
        return ur(r, e, {
          source: "dom",
          type: o
        });
      case "maskText":
        return er(r);
      default:
        return Object(cn.assertExhaustive)(i);
    }
  }
  function ur(e, t, n) {
    switch (n.source) {
      case "dom":
        switch (r = n.type) {
          case "frame":
          case "iframe":
            return hr(e, t);
          default:
            return cr(e, t);
        }
      case "event":
        switch (r = n.type) {
          case R.AJAX_REQUEST:
          case R.NAVIGATE:
            return cr(e, t);
          case R.SET_FRAME_BASE:
            return hr(e, t);
          default:
            return Object(cn.assertExhaustive)(r);
        }
      case "log":
        return hr(e, t);
      case "page":
        var r;
        switch (r = n.type) {
          case "base":
            return hr(e, t);
          case "referrer":
          case "url":
            return cr(e, t);
          default:
            return Object(cn.assertExhaustive)(r);
        }
      case "perfEntry":
        switch (n.type) {
          case "frame":
          case "iframe":
          case "navigation":
          case "other":
            return hr(e, t);
          default:
            return cr(e, t);
        }
      default:
        return Object(cn.assertExhaustive)(n);
    }
  }
  function cr(e, t) {
    return lr(e, t, function (e) {
      if (!(e in pr)) {
        var t = ["password", "token", "^jwt$"];
        switch ("4K3FQ" !== e && "NQ829" !== e && "KCF98" !== e && t.push("^code$"), e) {
          case "2FVM4":
            t.push("^e$", "^eref$", "^fn$");
            break;
          case "35500":
            t.push("share_token", "password-reset-key");
            break;
          case "1HWDJ":
            t.push("email_id", "invite", "join");
            break;
          case "J82WF":
            t = [".*"];
            break;
          case "8MM83":
            t = ["^creditCard"];
            break;
          case "PAN8Z":
            t.push("code", "hash", "ol", "aeh");
            break;
          case "BKP05":
            t.push("api_key", "session_id", "encryption_key");
            break;
          case "QKM7G":
            t.push("postcode", "encryptedQuoteId", "registrationId", "productNumber", "customerName", "agentId", "qqQuoteId");
            break;
          case "FP60X":
            t.push("phrase");
            break;
          case "GDWG7":
            t = ["^(?!productType|utmSource).*$"];
            break;
          case "RV68C":
            t.push("drivingLicense");
            break;
          case "S3VEC":
            t.push("data");
            break;
          case "Q8RZE":
            t.push("myLowesCardNumber");
        }
        pr[e] = new RegExp(t.join("|"), "i");
      }
      return pr[e];
    }(t));
  }
  function hr(e, t) {
    return lr(e, t, fr);
  }
  function dr(e, t, n, r) {
    var i = new RegExp("(\\/" + t + "\\/).*$", "i");
    n == r && e.pathname.indexOf(t) >= 0 && (e.pathname = e.pathname.replace(i, "$1" + rr));
  }
  function lr(e, t, n) {
    var r = Xn("", e);
    return r.hash && r.hash.indexOf("access_token") >= 0 && (r.hash = "#" + rr), dr(r, "visitor", t, "QS8RG"), dr(r, "account", t, "QS8RG"), dr(r, "parentAccount", t, "QS8RG"), dr(r, "reset_password", t, "AGQFM"), dr(r, "reset-password", t, "95NJ7"), dr(r, "dl", t, "RV68C"), dr(r, "retailer", t, "FP60X"), dr(r, "ocadotech", t, "FP60X"), dr(r, "serviceAccounts", t, "FP60X"), dr(r, "signup", t, "7R98D"), r.search && r.search.length > 0 && (r.search = function (e, t) {
      return e.split("?").map(function (e) {
        return function (e, t) {
          return e.replace("?", "").split("&").map(function (e) {
            return e.split("=");
          }).map(function (e) {
            var n = e[0],
              r = e[1],
              i = e.slice(2);
            return t.test(n) && void 0 !== r ? [n, rr].concat(i) : [n, r].concat(i);
          }).map(function (e) {
            var t = e[0],
              n = e[1],
              r = e.slice(2);
            return void 0 === n ? t : [t, n].concat(r).join("=");
          }).join("&");
        }(e, t);
      }).join("?");
    }(r.search, n)), r.href.substring(0, 2048);
  }
  var pr = {};
  var fr = new RegExp(".*", "i");
  var vr = /([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/gi,
    _r = /(?:(http)|(ftp)|(file))[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+#]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/gi;
  function gr(e) {
    return "function" == typeof (t = e.constructor) && Function.prototype.toString.call(t).indexOf("[native code]") > -1;
    var t;
  }
  var mr = function () {
    function e(e, t, n) {
      this._watcher = e, this._resizer = t, this._orgId = n, Tn = {}, kn = 1;
    }
    return e.prototype.tokenizeNode = function (e, t, n, r, i, o, s) {
      var a = this,
        u = xn(t),
        c = xn(n),
        h = [];
      return function (e) {
        var t = kn;
        try {
          return e(), !0;
        } catch (e) {
          return kn = t, !1;
        }
      }(function () {
        a.tokeNode(e, u, c, r, h, i, o, s);
      }) || (h = []), h;
    }, e.prototype.tokeNode = function (e, t, n, r, i, o, s, a) {
      for (var u = [{
          parentMirror: t,
          nextMirror: n,
          node: r
        }], c = function () {
          var t = u.pop();
          if (!t) return "continue";
          if ("string" == typeof t) return i.push(t), "continue";
          var n = t.parentMirror,
            r = t.nextMirror,
            c = t.node,
            d = h._encodeTagAndAttributes(e, n, r, c, i, o, s);
          if (null == d || d.watchKind === an.Exclude) return "continue";
          var l = c.nodeType === pn ? c.shadowRoot : null;
          return (l || c.firstChild) && a(d) ? (u.push("]"), function (e, t) {
            if (!e) return;
            var n = [];
            ft(e, function (e) {
              return n.push(e);
            });
            for (; n.length > 0;) {
              var r = n.pop();
              r && t(r);
            }
          }(c.firstChild, function (e) {
            u.push({
              parentMirror: d,
              nextMirror: null,
              node: e
            });
          }), l && u.push({
            parentMirror: d,
            nextMirror: null,
            node: l
          }), void u.push("[")) : "continue";
        }, h = this; u.length;) c();
    }, e.prototype._encodeTagAndAttributes = function (e, t, n, r, i, o, s) {
      if ("script" == on(r) || 8 == r.nodeType) return null;
      var a,
        u,
        c,
        h,
        d = function (e) {
          return e.constructor === window.ShadowRoot;
        }(r),
        l = function (e) {
          var t = {
            id: kn++,
            node: e
          };
          return Tn[t.id] = t, e._fs = t.id, t;
        }(r);
      if ((d || (null == t ? void 0 : t.isInShadowDOM)) && (l.isInShadowDOM = !0), t && (d ? t.shadow = l : (a = t, u = l, c = n, h = this._resizer, Fn(u, h), u.parent = a, u.next = c, c && (u.prev = c.prev, c.prev = u), null == u.next ? (u.prev = a.lastChild, a.lastChild = u) : u.next.prev = u, null == u.prev ? a.child = u : u.prev.next = u)), 10 == r.nodeType) {
        var p = r;
        return i.push("<!DOCTYPE", ":name", p.name, ":publicId", p.publicId || "", ":systemId", p.systemId || ""), l;
      }
      try {
        switch (r.nodeType) {
          default:
            i.push("<" + r.nodeName), yr(r, o);
            break;
          case 11:
          case 9:
            var f;
            f = d ? gr(r) ? "#shadow" : "#polyfillshadow" : r.nodeName, i.push("<" + f), yr(r, o);
            break;
          case 3:
            void 0 === l.mask && (l.mask = !l.parent || l.parent.mask), l.mask && this._resizer.observe(r.parentElement), yr(r, o), i.push("<" + r.nodeName, or(r, l));
            break;
          case pn:
            var v = r,
              _ = v.nodeName;
            "http://www.w3.org/2000/svg" == v.namespaceURI && (_ = "svg:" + _), i.push("<" + _);
            var g = this.getWatchState(v, !!l.isInShadowDOM, e),
              m = g.watchKind,
              y = g.matchesAnyKeepRule,
              w = g.matchesAnyConsentRule;
            if (l.matchesAnyKeepRule = y, l.matchesAnyConsentRule = w, null != m) switch (l.watchKind = m, m) {
              case an.Watch:
                this._resizer.observe(v);
                break;
              case an.Exclude:
                this._resizer.observe(v), i.push(":_fs_excluded", "true");
                break;
              case an.Unmask:
                l.mask = !1;
                break;
              case an.Mask:
                l.mask = !0;
            }
            m !== an.Unmask && m !== an.Mask && l.parent && (l.mask = l.parent.mask), l.mask && i.push(":_fs_masked", "true"), l.watchKind != an.Exclude && yr(r, o), function (e, t, n) {
              if (ce && "output" === on(t)) return;
              var r = t;
              if (void 0 !== r.hasAttributes && !r.hasAttributes() || void 0 === r.hasAttributes && r.attributes && r.attributes.length <= 0) return;
              var i = function (r, i) {
                null !== i && (r = sr(r), null !== (i = ar(e, t, r, i)) && n(r, i));
              };
              if (void 0 !== r.getAttributeNames) for (var o = 0, s = r.getAttributeNames(); o < s.length; o++) {
                var a = s[o];
                i(a, r.getAttribute(a));
              } else for (var u = 0; u < r.attributes.length; u++) {
                var c = r.attributes[u];
                null != c && i(c.name, c.value);
              }
            }(this._orgId, v, function (e, t) {
              i.push(":" + e), i.push(t);
              try {
                s(v, e, t);
              } catch (e) {
                Mt.sendToBugsnag(e, "error");
              }
            });
        }
      } catch (e) {
        Mt.sendToBugsnag(e, "error");
      }
      return l;
    }, e.prototype.getWatchState = function (e, t, n) {
      var r = t || null == n ? "matches" : this._watcher.getWatchStrategy();
      switch (r) {
        case "matches":
          return {
            watchKind: this._watcher.isWatched(e),
            matchesAnyKeepRule: this._watcher.matchesAnyKeepRule(e),
            matchesAnyConsentRule: this._watcher.matchesAnyConsentRule(e)
          };
        case "qsa":
          var i = n.get(e);
          return i ? {
            watchKind: i.kind,
            matchesAnyKeepRule: i.matchesAnyKeepRule,
            matchesAnyConsentRule: i.matchesAnyConsentRule
          } : {
            watchKind: null,
            matchesAnyKeepRule: !1,
            matchesAnyConsentRule: !1
          };
        case "verify":
          var o = n.get(e),
            s = {
              watchKind: this._watcher.isWatched(e),
              matchesAnyKeepRule: this._watcher.matchesAnyKeepRule(e),
              matchesAnyConsentRule: this._watcher.matchesAnyConsentRule(e)
            };
          return null !== s.watchKind && void 0 === o ? Mt.sendToBugsnag("Watch strategy qsa digest doesn't contain el", "error", {
            matchesDigest: s,
            qsaDigest: o
          }) : null !== s.watchKind && void 0 !== o ? s.watchKind === o.kind && s.matchesAnyConsentRule === o.matchesAnyConsentRule && s.matchesAnyKeepRule === o.matchesAnyKeepRule || Mt.sendToBugsnag("Watch strategy qsa digest inconsistency", "error", {
            matchesDigest: s,
            qsaDigest: o
          }) : null === s.watchKind && void 0 !== o && null !== o.kind && Mt.sendToBugsnag("Watch strategy qsa digest flagged an element matches didn't", "error", {
            matchesDigest: s,
            qsaDigest: o
          }), s;
        default:
          return Object(cn.assertExhaustive)(r);
      }
    }, e;
  }();
  function yr(e, t) {
    try {
      t(e);
    } catch (e) {
      Mt.sendToBugsnag(e, "error");
    }
  }
  var wr = function () {
      function e() {
        this.dict = {
          idx: -1,
          map: {}
        }, this.nodeCount = 1, this.startIdx = 0;
      }
      return e.prototype.encode = function (t) {
        if (0 == t.length) return [];
        var n,
          r,
          i = t[0],
          o = Object.prototype.hasOwnProperty.call(this.dict.map, i) ? this.dict.map[i] : null,
          s = [],
          a = 1;
        function u() {
          o ? a > 1 ? s.push([o.idx, a]) : s.push(o.idx) : s.push(i);
        }
        for (n = 1; n < t.length; n++) if (r = t[n], o && Object.prototype.hasOwnProperty.call(o.map, r)) a++, i = r, o = o.map[r];else {
          u();
          var c = this.startIdx + n - a;
          null == o && this.nodeCount < e.MAX_NODES && (o = {
            idx: c,
            map: {}
          }, this.dict.map[i] = o, this.nodeCount++), o && this.nodeCount < e.MAX_NODES && (o.map[r] = {
            idx: c,
            map: {}
          }, this.nodeCount++), a = 1, i = r, o = Object.prototype.hasOwnProperty.call(this.dict.map, r) ? this.dict.map[r] : null;
        }
        return u(), this.startIdx += t.length, s;
      }, e.MAX_NODES = 1e4, e;
    }(),
    br = function () {
      var e = function (t, n) {
        return (e = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
        })(t, n);
      };
      return function (t, n) {
        function r() {
          this.constructor = t;
        }
        e(t, n), t.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r());
      };
    }(),
    Sr = function () {
      return (Sr = Object.assign || function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        return e;
      }).apply(this, arguments);
    },
    Er = function () {
      function e(e) {
        this._ctx = e, this._recordedDims = {}, this._observedDims = {};
      }
      return e.create = function (e) {
        return Tr.isSupported(e.window) ? new Tr(e) : new kr(e);
      }, e.prototype.collect = function (e) {
        var t = [];
        for (var n in this._observedDims) this.addPlaceholderResize(e, t, Number(n));
        return this._observedDims = {}, t;
      }, e.prototype.addEntry = function (e) {
        try {
          var t = Mn(e);
          if (!t) return;
          if (e.nodeType != pn) return;
          var n = e;
          if (this._observedDims[t] = n.getBoundingClientRect(), !this._recordedDims[t]) {
            var r = this.flushSizeEvent(t);
            if (!r) return;
            this._ctx.queue().enqueue(r);
          }
        } catch (e) {}
      }, e.prototype.addPlaceholderResize = function (e, t, n) {
        var r = this.flushSizeEvent(n);
        r && t.push(Sr(Sr({}, r), {
          When: e
        }));
      }, e.prototype.flushSizeEvent = function (e) {
        var t = this._observedDims[e];
        if (!t) return null;
        var n = On(e);
        if (!n) return null;
        var r = n.watchKind,
          i = t.width,
          o = t.height,
          s = this._recordedDims[e];
        if (s && s.w == i && s.h == o) return null;
        if (this._recordedDims[e] = {
          w: i,
          h: o
        }, r == an.Watch) {
          var a = 0 != i && 0 != o;
          if ((!!s && 0 != s.w && 0 != s.h) != a) return {
            Kind: R.WATCHED_ELEM,
            Args: [e, a]
          };
        }
        return {
          Kind: R.PLACEHOLDER_SIZE,
          Args: [e, i, o]
        };
      }, e;
    }(),
    Tr = function (e) {
      function t(t) {
        var n = e.call(this, t) || this;
        return n._inlineGroups = new ln(), n._observedInlines = new ln(), n._obs = new t.window.ResizeObserver(function (e) {
          for (var t = 0, r = e; t < r.length; t++) {
            var i = r[t].target;
            n.addEntry(i);
          }
        }), n._inlineGroupObs = new t.window.ResizeObserver(function (e) {
          for (var t = 0, r = e; t < r.length; t++) {
            var i = r[t].target;
            n._addEntriesForInlineGroup(i);
          }
        }), n;
      }
      return br(t, e), t.isSupported = function (e) {
        return "ResizeObserver" in e;
      }, t.prototype.observe = function (e) {
        var t = this;
        if (e && e.nodeType == pn) {
          var n = e;
          this._obs.unobserve(n), this._obs.observe(n), this._ctx.measurer.requestMeasureTask(function () {
            t._addToInlineGroupIfNeeded(n);
          });
        }
      }, t.prototype.unobserveSubtree = function (e) {}, t.prototype.nodeChanged = function (e) {
        var t = this,
          n = this._observedInlines.get(e);
        "number" == typeof n && Mn(e) === n && this._ctx.measurer.requestMeasureTask(function () {
          t.addEntry(e);
        });
      }, t.prototype._addEntriesForInlineGroup = function (e) {
        var t = this._inlineGroups.get(e);
        if (t) for (var n in t) {
          var r = On(t[n]);
          r ? this.addEntry(r.node) : delete t[n];
        }
      }, t.prototype._addToInlineGroupIfNeeded = function (e) {
        var t = this,
          n = Mn(e);
        if (n) {
          var r = this._nearestNonInlineElementAncestorOf(e);
          if (r && r !== e) {
            this._observedInlines.set(e, n), this.addEntry(e);
            var i = this._inlineGroups.get(r);
            i || (i = Object.create(null), this._inlineGroups.set(r, i)), i[n] = n, s.setWindowTimeout(this._ctx.window, ie(function () {
              t._inlineGroupObs.observe(r);
            }), 0);
          }
        }
      }, t.prototype._nearestNonInlineElementAncestorOf = function (e) {
        for (var t = 0, n = e;;) {
          if (t++ > 1e3) return null;
          if (!n || n.nodeType != pn) return null;
          var r = n;
          if (getComputedStyle(r).display.indexOf("inline") < 0) return r;
          n = n.parentNode;
        }
      }, t;
    }(Er),
    kr = function (e) {
      function t() {
        return null !== e && e.apply(this, arguments) || this;
      }
      return br(t, e), t.prototype.observe = function (e) {
        var t = this;
        if (e && e.nodeType == pn) {
          var n = e;
          this.growWatchedIndex(xn(e)), this._ctx.measurer.requestMeasureTask(function () {
            t.addEntry(n);
          });
        }
      }, t.prototype.unobserveSubtree = function (e) {
        var t = xn(e);
        t && this.clearWatchedIndex(t);
      }, t.prototype.nodeChanged = function (e) {
        var t = this,
          n = this.relatedWatched(e);
        this._ctx.measurer.requestMeasureTask(function () {
          for (var e = 0, r = n; e < r.length; e++) {
            var i = r[e];
            t.addEntry(i);
          }
        });
      }, t.prototype.watchedChildren = function (e) {
        return e.watchedChildren;
      }, t.prototype.growWatchedIndex = function (e) {
        if (e && In(e.node)) for (var t = e, n = e.parent; n; n = n.parent) {
          if (this.watchedChildren(n) || (n.watchedChildren = {}), this.watchedChildren(t)) for (var r in this.watchedChildren(t)) delete this.watchedChildren(n)[r];
          if (this.watchedChildren(n)[t.id] = t, lt(this.watchedChildren(n), 2)) t = n;else if (pt(this.watchedChildren(n), 2)) break;
        }
      }, t.prototype.relatedWatched = function (e) {
        var t = [],
          n = xn(e);
        if (n) for (var r = [n], i = 0; r.length && ++i < 1e3;) {
          var o = r.pop();
          In(o.node) && t.push(o.node), this.watchedChildren(o) && ht(this.watchedChildren(o), function (e) {
            r.push(e);
          });
        } else {
          for (var s = e; s && !Mn(s);) s = s.parentNode;
          s && In(s) && t.push(s);
        }
        return t;
      }, t.prototype.clearWatchedIndex = function (e) {
        if (pt(this.watchedChildren(e), 0) || In(e.node)) for (var t = this.watchedChildren(e) && pt(this.watchedChildren(e), 1) || In(e.node) ? e.id : function (e) {
            for (var t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return t;
          }(this.watchedChildren(e)), n = t ? e.parent : null; n && this.watchedChildren(n) && this.watchedChildren(n)[t];) {
          if (delete this.watchedChildren(n)[t], lt(this.watchedChildren(n), 1)) {
            var r = n.id,
              i = dt(this.watchedChildren(n));
            for (n = n.parent; n && this.watchedChildren(n) && this.watchedChildren(n)[r];) delete this.watchedChildren(n)[r], this.watchedChildren(n)[i.id] = i, n = n.parent;
            break;
          }
          n = n.parent;
        }
      }, t;
    }(Er),
    Ir = function () {
      return (Ir = Object.assign || function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        return e;
      }).apply(this, arguments);
    },
    Cr = {
      attributeName: null,
      attributeNamespace: null,
      addedNodes: [],
      removedNodes: [],
      nextSibling: null,
      previousSibling: null,
      oldValue: null
    };
  function Rr(e) {
    return Ir(Ir(Ir({}, Cr), e), {
      type: "childList"
    });
  }
  function Ar(e, t) {
    return 0 === t.length ? Rr({
      target: e
    }) : Rr({
      addedNodes: t,
      nextSibling: ut(t[t.length - 1]),
      previousSibling: vt(t[0]),
      target: e
    });
  }
  var xr = ae && !ue ? Dr : window.MutationObserver || window.WebKitMutationObserver || Dr,
    Or = new ln(),
    Mr = window.setImmediate || window.msSetImmediate;
  if (!Mr) {
    var Lr = [],
      Fr = String(s.mathRandom());
    window.addEventListener("message", function (e) {
      if (e.data === Fr) {
        var t = Lr;
        Lr = [], t.forEach(function (e) {
          e();
        });
      }
    }), Mr = function (e) {
      for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
      return Lr.push(e), window.postMessage(Fr, "*"), 0;
    };
  }
  var Pr = !1,
    qr = [];
  function Ur() {
    Pr = !1;
    var e = qr;
    qr = [], e.sort(function (e, t) {
      return e.uid_ - t.uid_;
    });
    var t = !1;
    e.forEach(function (e) {
      var n = e.takeRecords();
      !function (e) {
        e.nodes_.forEach(function (t) {
          var n = Or.get(t);
          n && n.forEach(function (t) {
            t.observer === e && t.removeTransientObservers();
          });
        });
      }(e), n.length && (e.callback_(n, e), t = !0);
    }), t && Ur();
  }
  function Nr(e, t) {
    for (var n = e; n; n = n.parentNode) {
      var r = Or.get(n);
      if (r) for (var i = 0; i < r.length; i++) {
        var o = r[i],
          s = o.options;
        if (n === e || s.subtree) {
          var a = t(s);
          a && o.enqueue(a);
        }
      }
    }
  }
  var Wr = 0;
  function Dr(e) {
    this.callback_ = e, this.nodes_ = [], this.records_ = [], this.uid_ = ++Wr;
  }
  Dr.prototype = {
    observe: function (e, t) {
      if (e = function (e) {
        return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(e) || e;
      }(e), !t.childList && !t.attributes && !t.characterData || t.attributeOldValue && !t.attributes || t.attributeFilter && t.attributeFilter.length && !t.attributes || t.characterDataOldValue && !t.characterData) throw new SyntaxError();
      var n,
        r = Or.get(e);
      r || Or.set(e, r = []);
      for (var i = 0; i < r.length; i++) if (r[i].observer === this) {
        (n = r[i]).removeListeners(), n.options = t;
        break;
      }
      n || (n = new Yr(this, e, t), r.push(n), this.nodes_.push(e)), n.addListeners();
    },
    disconnect: function () {
      this.nodes_.forEach(function (e) {
        for (var t = Or.get(e), n = 0; n < t.length; n++) {
          var r = t[n];
          if (r.observer === this) {
            r.removeListeners(), t.splice(n, 1);
            break;
          }
        }
      }, this), this.records_ = [];
    },
    takeRecords: function () {
      var e = this.records_;
      return this.records_ = [], e;
    }
  };
  var Br,
    Hr,
    jr = function (e, t) {
      this.type = e, this.target = t, this.addedNodes = [], this.removedNodes = [], this.previousSibling = null, this.nextSibling = null, this.attributeName = null, this.attributeNamespace = null, this.oldValue = null;
    };
  function Kr(e, t) {
    return Br = new jr(e, t);
  }
  function Vr(e) {
    return Hr || ((n = new jr((t = Br).type, t.target)).addedNodes = t.addedNodes.slice(), n.removedNodes = t.removedNodes.slice(), n.previousSibling = t.previousSibling, n.nextSibling = t.nextSibling, n.attributeName = t.attributeName, n.attributeNamespace = t.attributeNamespace, n.oldValue = t.oldValue, (Hr = n).oldValue = e, Hr);
    var t, n;
  }
  function zr(e, t) {
    return e === t ? e : Hr && ((n = e) === Hr || n === Br) ? Hr : null;
    var n;
  }
  function Yr(e, t, n) {
    var r = this;
    this.observer = e, this.target = t, this.options = n, this.transientObservedNodes = [], this.handleEventBound = function (e) {
      return r.handleEvent_(e);
    };
  }
  Yr.prototype = {
    enqueue: function (e) {
      var t = this.observer.records_,
        n = t.length;
      if (t.length > 0) {
        var r = zr(t[n - 1], e);
        if (r) return void (t[n - 1] = r);
      } else !function (e) {
        qr.push(e), Pr || (Pr = !0, Mr(Ur));
      }(this.observer);
      t[n] = e;
    },
    addListeners: function () {
      this.addListeners_(this.target);
    },
    addListeners_: function (e) {
      var t = this.options;
      t.attributes && e.addEventListener("DOMAttrModified", this.handleEventBound, !0), t.characterData && e.addEventListener("DOMCharacterDataModified", this.handleEventBound, !0), t.childList && e.addEventListener("DOMNodeInserted", this.handleEventBound, !0), (t.childList || t.subtree) && e.addEventListener("DOMNodeRemoved", this.handleEventBound, !0);
    },
    removeListeners: function () {
      this.removeListeners_(this.target);
    },
    removeListeners_: function (e) {
      var t = this.options;
      t.attributes && e.removeEventListener("DOMAttrModified", this.handleEventBound, !0), t.characterData && e.removeEventListener("DOMCharacterDataModified", this.handleEventBound, !0), t.childList && e.removeEventListener("DOMNodeInserted", this.handleEventBound, !0), (t.childList || t.subtree) && e.removeEventListener("DOMNodeRemoved", this.handleEventBound, !0);
    },
    addTransientObserver: function (e) {
      if (e !== this.target) {
        this.addListeners_(e), this.transientObservedNodes.push(e);
        var t = Or.get(e);
        t || Or.set(e, t = []), t.push(this);
      }
    },
    removeTransientObservers: function () {
      var e = this.transientObservedNodes;
      this.transientObservedNodes = [], e.forEach(function (e) {
        this.removeListeners_(e);
        for (var t = Or.get(e), n = 0; n < t.length; n++) if (t[n] === this) {
          t.splice(n, 1);
          break;
        }
      }, this);
    },
    handleEvent_: function (e) {
      switch (e.type) {
        case "DOMAttrModified":
          var t = e.attrName,
            n = e.relatedNode.namespaceURI,
            r = Kr("attributes", a = e.target);
          r.attributeName = t, r.attributeNamespace = n;
          var i = e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;
          Nr(a, function (e) {
            if (e.attributes && (!e.attributeFilter || !e.attributeFilter.length || -1 !== e.attributeFilter.indexOf(t) || -1 !== e.attributeFilter.indexOf(n))) return e.attributeOldValue ? Vr(i) : r;
          });
          break;
        case "DOMCharacterDataModified":
          var o = Kr("characterData", a = e.target),
            s = e.prevValue;
          Nr(a, function (e) {
            if (e.characterData) return e.characterDataOldValue ? Vr(s) : o;
          });
          break;
        case "DOMNodeRemoved":
        case "DOMNodeInserted":
          "DOMNodeRemoved" == e.type && this.addTransientObserver(e.target);
          var a = e.relatedNode,
            u = e.target,
            c = void 0,
            h = void 0;
          "DOMNodeInserted" === e.type ? (c = [u], h = []) : (c = [], h = [u]);
          var d = vt(u),
            l = ut(u),
            p = Kr("childList", a);
          p.addedNodes = c, p.removedNodes = h, p.previousSibling = d, p.nextSibling = l, Nr(a, function (e) {
            if (e.childList) return p;
          });
      }
      Br = Hr = void 0;
    }
  };
  var Gr = function () {
      return (Gr = Object.assign || function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        return e;
      }).apply(this, arguments);
    },
    Qr = function () {
      function e(e, t, n, r, i, o, s) {
        var a = this;
        void 0 === n && (n = !0), void 0 === r && (r = function () {}), void 0 === i && (i = function () {}), void 0 === o && (o = function () {}), void 0 === s && (s = function () {
          return !0;
        }), this._ctx = e, this._watcher = t, this._compress = n, this._nodeVisitor = r, this._beforeRemove = i, this._attrVisitor = o, this._visitChildren = s, this._sentDomSnapshot = !1, this._newShadowContainers = [], this._toRefresh = [], this._records = [], this._setPropertyWasThrottled = !1, this._wnd = e.window, this._resizer = Er.create(e), this._encoder = new mr(t, this._resizer, e.options.orgId), Ft(!this._watcher.onConsentChange, "This is the only consent change listener."), this._watcher.onConsentChange = function () {
          return a.updateConsent();
        };
      }
      return e.prototype.hookMutations = function (e) {
        void 0 === e && (e = this._wnd.document), this._root = e, this._sentDomSnapshot = !1, this._compress && (this._lz = new wr());
        var t = !0;
        if (ae) try {
          this.setUpIEWorkarounds();
        } catch (e) {
          o("Error setting up IE workarounds for mutation watcher: " + e), t = !1;
        }
        t && (this._observer = new xr(this._addMutations.bind(this)));
      }, e.prototype._observerOff = function () {
        this._observer && this._observer.disconnect();
      }, e.prototype._addMutations = function (e) {
        for (var t = 0, n = e; t < n.length; t++) {
          var r = n[t];
          this._records.push(r);
        }
      }, e.prototype.resizer = function () {
        return this._resizer;
      }, e.prototype.shutdown = function () {
        this._observer && this._observer.disconnect();
        var e = xn(this._root);
        e && Pn(e), this._records = [], ae && this.tearDownIEWorkarounds(), this._watcher.onConsentChange = null, this._attachShadowHook && (this._attachShadowHook.disable(), this._attachShadowHook = null);
      }, e.prototype.processMutations = function (e) {
        if (!this._root) return [];
        var t = [];
        if (this.maybeGetInitialSnapshot(e, t), this._setPropertyWasThrottled && (t.push({
          Kind: R.FAIL_THROTTLED,
          When: e,
          Args: [Q.SetPropertyHooks]
        }), this._setPropertyWasThrottled = !1), this._records.length > 0 || this._toRefresh.length > 0) {
          var n = {},
            r = {};
          for (var i in this.processRecords(e, t, r, n), r) {
            var o = i.split("\t");
            t.push({
              Kind: R.MUT_ATTR,
              When: e,
              Args: [parseInt(o[0]), o[1], r[i]]
            });
          }
          for (var i in n) t.push({
            Kind: R.MUT_TEXT,
            When: e,
            Args: [parseInt(i), n[i]]
          });
        }
        var s = this._newShadowContainers;
        this._newShadowContainers = [];
        for (var a = 0; a < s.length; a++) {
          var u = s[a].shadowRoot;
          u && 0 != Mn(s[a]) && 0 == Mn(u) && (this.observe(u), this.genShadow(null, e, t, s[a], u));
        }
        return t.push.apply(t, this._resizer.collect(e)), this._records = [], t;
      }, e.prototype.recordingIsDetached = function () {
        return this._root && this._root != this._wnd.document;
      }, e.prototype.maybeGetInitialSnapshot = function (e, t) {
        if (!this._sentDomSnapshot) {
          var n = this._watcher.allWatchedElements(this._root);
          this.genInsert(n, e, t, null, this._root, null), this._resizer.nodeChanged(this._root), this._observer && this.observe(this._root), this._sentDomSnapshot = !0, this.hookAttachShadow();
        }
      }, e.prototype.hookAttachShadow = function () {
        var e = this;
        this._attachShadowHook = Tt(Element.prototype, "attachShadow"), this._attachShadowHook && this._attachShadowHook.before(function (t) {
          t.that.shadowRoot || e._newShadowContainers.push(t.that);
        });
      }, e.prototype.observe = function (e) {
        try {
          this._observer.observe(e, {
            childList: !0,
            attributes: !0,
            characterData: !0,
            subtree: !0,
            attributeOldValue: !0,
            characterDataOldValue: !0
          });
        } catch (e) {}
      }, e.prototype.processRecords = function (e, t, n, r) {
        for (var i = this, o = {}, s = {}, a = function (n) {
            if (xn(n)) {
              i.genRemove(e, t, xn(n));
              var r = xn(n.parentNode);
              r && (s[r.id] = r.node);
            }
          }, u = 0; u < this._records.length; ++u) try {
          var c = this._records[u],
            h = Mn(c.target);
          if (!h) continue;
          switch (o[h] = c.target, c.type) {
            case "childList":
              if (c.removedNodes.length > 0) for (var d = 0; d < c.removedNodes.length; ++d) {
                var l = xn(c.removedNodes[d]);
                l && l.id && this.genRemove(e, t, l);
              }
              if (c.addedNodes.length > 0) {
                s[h] = c.target;
                var p = Jr(c.target);
                p && (s[p.id] = p.node);
              }
              break;
            case "characterData":
              Cn(c.target) || c.oldValue != c.target.textContent && (r[h] = or(c.target));
              break;
            case "attributes":
              var f = An(w = c.target);
              if (_n(this._watcher.isWatched(w)) > _n(f)) {
                a(w);
                break;
              }
              var v = Xr(c.attributeNamespace) + (c.attributeName || ""),
                _ = sr(v);
              if (w.hasAttribute(v)) {
                var g = c.target.getAttribute(v);
                c.oldValue != g && (g = ar(this._ctx.options.orgId, c.target, _, g || ""), this._attrVisitor(c.target, _, g || ""), null !== g && (n[h + "\t" + _] = g));
              } else n[h + "\t" + _] = null;
          }
        } catch (e) {}
        for (var m = 0, y = this._toRefresh; m < y.length; m++) {
          var w = y[m];
          try {
            a(w);
          } catch (e) {
            Mt.sendToBugsnag(e, "error");
          }
        }
        for (var b in this._toRefresh = [], s) {
          var S = xn(E = s[b]);
          S && S.id && this.diff(e, t, E, S.child, E.firstChild);
        }
        for (var b in o) {
          var E = o[b];
          this._resizer.nodeChanged(E);
        }
      }, e.prototype._checkForMissingInsertions = function (e) {
        if (!this._sentDomSnapshot || !e) return [];
        return this.walkAddRecords(this._root), [];
      }, e.prototype.walkAddRecords = function (e) {
        var t = this;
        Mn(e) || null === e.parentNode ? ft(e.firstChild, function (e) {
          t.walkAddRecords(e);
        }) : this._records.push(Ar(e.parentNode, [e]));
      }, e.prototype.diff = function (e, t, n, r, i) {
        for (var o = [], s = r, a = i; s && a;) {
          var u = xn(a);
          Mn(a) ? u && s.id == u.id ? (s = s.next, a = ut(a)) : (o.push({
            remove: s
          }), s = s.next) : (o.push({
            insert: [n, a, s.node]
          }), a = ut(a));
        }
        for (; s; s = s.next) o.push({
          remove: s
        });
        ft(a, function (e) {
          o.push({
            insert: [n, e, null]
          });
        });
        for (var c = !1, h = 0; h < o.length; h++) {
          var d = o[h];
          d.insert ? this.genInsert(null, e, t, d.insert[0], d.insert[1], d.insert[2]) : d.remove && (c = !0, this.genRemove(e, t, d.remove));
        }
        Ft(!c, "All remove events should have been generated earlier, in MutationWatcher.processMutations");
      }, e.prototype.genShadow = function (e, t, n, r, i) {
        var o = Mn(r),
          s = this.genDocStream(e, r, i, null);
        s.length > 0 && n.push({
          When: t,
          Kind: R.MUT_SHADOW,
          Args: [o, this._compress ? this._lz.encode(s) : s]
        });
      }, e.prototype.genInsert = function (e, t, n, r, i, o) {
        var s = Mn(r) || -1,
          a = Mn(o) || -1,
          u = -1 === s && -1 === a,
          c = p(),
          h = this.genDocStream(e, r, i, o),
          d = p() - c;
        if (h.length > 0) {
          var l = p(),
            f = this._compress ? this._lz.encode(h) : h,
            v = p() - l;
          n.push({
            When: t,
            Kind: R.MUT_INSERT,
            Args: [s, a, f]
          }, {
            When: t,
            Kind: R.TIMING,
            Args: [[O.Internal, A.Serialization, u ? x.DomSnapshot : x.NodeEncoding, t, d, [x.LzEncoding, v]]]
          });
        }
      }, e.prototype.genDocStream = function (e, t, n, r) {
        var i = this;
        if (t && Cn(t)) return [];
        for (var o = [], s = this._encoder.tokenizeNode(e, t, r, n, function (e) {
            if (e.nodeType == pn) {
              var t = e;
              t.shadowRoot && i.observe(t.shadowRoot);
            }
            i._nodeVisitor(e, o);
          }, this._attrVisitor, this._visitChildren), a = 0, u = o; a < u.length; a++) {
          (0, u[a])();
        }
        return s;
      }, e.prototype.genRemove = function (e, t, n) {
        var r = n.id;
        if (this._beforeRemove(n), Fn(n, this._resizer), t.length > 0) {
          var i = t[t.length - 1];
          if (i.Kind == R.MUT_REMOVE) return void i.Args.push(r);
        }
        t.push({
          When: e,
          Kind: R.MUT_REMOVE,
          Args: [r]
        });
      }, e.prototype.setUpIEWorkarounds = function () {
        var t = this;
        if (ue) {
          var n = Object.getOwnPropertyDescriptor(Node.prototype, "textContent"),
            r = n && n.set;
          if (!n || !r) throw new Error("Missing textContent setter -- not safe to record mutations.");
          Object.defineProperty(Element.prototype, "textContent", Gr(Gr({}, n), {
            set: function (e) {
              try {
                for (var t = void 0; t = this.firstChild;) this.removeChild(t);
                if (null === e || "" == e) return;
                var n = (this.ownerDocument || document).createTextNode(e);
                this.appendChild(n);
              } catch (t) {
                r && r.call(this, e);
              }
            }
          }));
        }
        this._setPropertyThrottle = new nn(e.ThrottleMax, e.ThrottleInterval, function () {
          return new tn(function () {
            t._setPropertyWasThrottled = !0, t.tearDownIEWorkarounds();
          }).start();
        });
        var i = this._setPropertyThrottle.guard(function (e) {
          e.cssText = e.cssText;
        });
        this._setPropertyThrottle.open(), this._setPropertyHook = Tt(CSSStyleDeclaration.prototype, "setProperty"), this._setPropertyHook && this._setPropertyHook.afterSync(function (e) {
          i(e.that);
        }), this._removePropertyHook = Tt(CSSStyleDeclaration.prototype, "removeProperty"), this._removePropertyHook && this._removePropertyHook.afterSync(function (e) {
          i(e.that);
        });
      }, e.prototype.tearDownIEWorkarounds = function () {
        this._setPropertyThrottle && this._setPropertyThrottle.close(), this._setPropertyHook && this._setPropertyHook.disable(), this._removePropertyHook && this._removePropertyHook.disable();
      }, e.prototype.updateConsent = function () {
        var e = this,
          t = xn(this._root);
        t && function (e, t) {
          for (var n = [e]; n.length;) {
            var r = n.pop();
            if (r) {
              t(r);
              for (var i = r.child, o = r.shadow; i;) n.push(i), i = i.next;
              o && n.push(o);
            }
          }
        }(t, function (t) {
          var n = t.node;
          t.matchesAnyConsentRule && e.refreshElement(n);
        });
      }, e.prototype.refreshElement = function (e) {
        Mn(e) && this._toRefresh.push(e);
      }, e.ThrottleMax = 1024, e.ThrottleInterval = 1e4, e;
    }();
  function Xr(e) {
    return void 0 === e && (e = ""), null === e ? "" : {
      "http://www.w3.org/1999/xlink": "xlink:",
      "http://www.w3.org/XML/1998/namespace": "xml:",
      "http://www.w3.org/2000/xmlns/": "xmlns:"
    }[e] || "";
  }
  function Jr(e) {
    return !(null == e ? void 0 : e.shadowRoot) || gr(e.shadowRoot) ? null : xn(e.shadowRoot);
  }
  var $r = ["navigationStart", "unloadEventStart", "unloadEventEnd", "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "secureConnectionStart", "requestStart", "responseStart", "responseEnd", "domLoading", "domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "loadEventStart", "loadEventEnd"],
    Zr = ["name", "startTime", "duration", "initiatorType", "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "secureConnectionStart", "requestStart", "responseStart", "responseEnd", "unloadEventStart", "unloadEventEnd", "domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "loadEventStart", "loadEventEnd", "type", "redirectCount", "decodedBodySize", "encodedBodySize", "transferSize"],
    ei = ["name", "startTime", "duration", "initiatorType", "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "secureConnectionStart", "requestStart", "responseStart", "responseEnd", "decodedBodySize", "encodedBodySize", "transferSize"],
    ti = ["name", "startTime", "duration"],
    ni = ["jsHeapSizeLimit", "totalJSHeapSize", "usedJSHeapSize"],
    ri = function () {
      function e(e, t, n) {
        this._ctx = e, this._queue = t, this._perfSupported = !1, this._timingSupported = !1, this._getEntriesSupported = !1, this._memorySupported = !1, this._lastUsedJSHeapSize = 0, this._gotLoad = !1, this._observer = null, this._observedBatches = [];
        var r = window.performance;
        r && (this._perfSupported = !0, r.timing && (this._timingSupported = !0), r.memory && (this._memorySupported = !0), "function" == typeof r.getEntries && (this._getEntriesSupported = !0), this._listeners = n.createChild());
      }
      return e.prototype.start = function (e) {
        var t = this;
        this._resourceUploader = e;
        var n = window.performance;
        n && (this._ctx.recording.inFrame || this._queue.enqueue({
          Kind: R.REC_FEAT_SUPPORTED,
          Args: [Y.Performance, this._timingSupported, Y.PerformanceEntries, this._getEntriesSupported, Y.PerformanceMemory, this._memorySupported, Y.PerformanceObserver, !!window.PerformanceObserver]
        }), this.observe(), !this._observer && n.addEventListener && n.removeEventListener && this._listeners.add(n, "resourcetimingbufferfull", !0, function () {
          t._queue.enqueue({
            Kind: R.RESOURCE_TIMING_BUFFER_FULL,
            Args: []
          });
        }), this.checkMemory());
      }, e.prototype.onLoad = function () {
        this._gotLoad || (this._gotLoad = !0, this._timingSupported && (this.recordTiming(performance.timing), this.checkForNewEntries()));
      }, e.prototype.tick = function (e) {
        this.checkMemory(), e && this.checkForNewEntries();
      }, e.prototype.shutdown = function () {
        this._listeners && this._listeners.clear(), this._resourceUploader = void 0;
        var e = [];
        this._observer ? (this._observer.takeRecords && (e = this._observer.takeRecords()), this._observer.disconnect()) : window.performance && window.performance.getEntries && (e = window.performance.getEntries()), e.length > 300 && (e = e.slice(0, 300), this._queue.enqueue({
          Kind: R.RESOURCE_TIMING_BUFFER_FULL,
          Args: []
        })), this._observedBatches.push(e), this.tick(!0);
      }, e.prototype.observe = function () {
        var e = this;
        if (!this._observer && this._getEntriesSupported && window.PerformanceObserver) {
          this._observedBatches.push(performance.getEntries()), this._observer = new window.PerformanceObserver(function (t) {
            var n = t.getEntries();
            e._observedBatches.push(n);
          });
          var t = ["navigation", "resource", "measure", "mark"];
          window.PerformancePaintTiming && t.push("paint"), this._observer.observe({
            entryTypes: t
          });
        }
      }, e.prototype.checkMemory = function () {
        if (this._memorySupported && !this._ctx.recording.inFrame) {
          var e = performance.memory;
          if (e) {
            var t = e.usedJSHeapSize - this._lastUsedJSHeapSize;
            (0 == this._lastUsedJSHeapSize || s.mathAbs(t / this._lastUsedJSHeapSize) > .2) && (this.addPerfEvent(z.Memory, e, ni), this._lastUsedJSHeapSize = e.usedJSHeapSize);
          }
        }
      }, e.prototype.recordEntry = function (e) {
        switch (e.entryType) {
          case "navigation":
            this.recordNavigation(e);
            break;
          case "resource":
            this.recordResource(e);
            break;
          case "paint":
            this.recordPaint(e);
            break;
          case "measure":
            this.recordMeasure(e);
            break;
          case "mark":
            this.recordMark(e);
        }
      }, e.prototype.checkForNewEntries = function () {
        if (this._perfSupported && this._getEntriesSupported) {
          var e = this._observedBatches;
          this._observedBatches = [];
          for (var t = 0, n = e; t < n.length; t++) for (var r = 0, i = n[t]; r < i.length; r++) {
            var o = i[r];
            this.recordEntry(o);
          }
        }
      }, e.prototype.recordTiming = function (e) {
        this.addPerfEvent(z.Timing, e, $r);
      }, e.prototype.recordNavigation = function (e) {
        this.addPerfEvent(z.Navigation, e, Zr, {
          name: "navigation"
        });
      }, e.prototype.recordResource = function (e) {
        var t = this._ctx.options.orgId;
        "3E938" != t && "GDWG7" != t && this.addPerfEvent(z.Resource, e, ei, {
          name: e.initiatorType
        });
      }, e.prototype.recordPaint = function (e) {
        this.addPerfEvent(z.Paint, e, ti);
      }, e.prototype.recordMark = function (e) {
        this.addPerfEvent(z.Mark, e, ti);
      }, e.prototype.recordMeasure = function (e) {
        this.addPerfEvent(z.Measure, e, ti);
      }, e.prototype.addPerfEvent = function (e, t, n, r) {
        void 0 === r && (r = {});
        for (var i = [e], o = 0, s = n; o < s.length; o++) {
          var a = s[o],
            u = t[a];
          if (void 0 === u && (u = -1), a in r) {
            var c = ur(u, this._ctx.options.orgId, {
              source: "perfEntry",
              type: r[a]
            });
            u === c && this.maybeUploadResource(e, t, c), u = c;
          }
          i.push(u);
        }
        this._queue.enqueue({
          Kind: R.PERF_ENTRY,
          Args: i
        });
      }, e.prototype.maybeUploadResource = function (e, t, n) {
        this._resourceUploader && e === z.Resource && "css" === t.initiatorType && this._resourceUploader.uploadIfNeeded(this._ctx.window, n);
      }, e;
    }();
  function ii(e) {
    var t = 0,
      n = {
        id: t++,
        edges: {}
      };
    return e.split("\n").forEach(function (e) {
      if ("" != (e = e.trim())) {
        if (0 == e.indexOf("/") || e.lastIndexOf("/") == e.length - 1) throw new Error("Leading and trailing slashes are not supported");
        var r = n,
          i = e.split("/");
        i.forEach(function (e, n) {
          if ("" === (e = e.trim())) throw new Error("Empty elements are not allowed");
          if ("**" != e && "*" != e && -1 != e.indexOf("*")) throw new Error("Embedded wildcards are not supported");
          var o = null;
          "**" == e ? (r.loop = !0, o = r) : e in r.edges && (o = r.edges[e]), o || (o = {
            id: t++,
            edges: {}
          }, r.edges[e] = o), n == i.length - 1 && (o.term = !0), r = o;
        });
      }
    }), n;
  }
  var oi = ii("**"),
    si = "__fs__redacted";
  function ai(e, t, n) {
    var r;
    if (n) {
      r = 1 == n ? oi : n;
      try {
        var i = 0,
          o = [1],
          a = [],
          u = {};
        return u[r.id] = r, a.push(u), s.jsonStringify(e, function (e, n) {
          var r = n && "object" == typeof n;
          if ("" == e && 1 == o.length) return o[0]--, r && o.push(s.objectKeys(n).length), n;
          var u = {},
            c = a[a.length - 1],
            h = !0,
            d = !1,
            l = function (e) {
              u[e.id] = e, h = !1, e.term && (d = !0);
            };
          for (var p in c) {
            var f = c[p];
            e in f.edges && l(f.edges[e]), "*" in f.edges && l(f.edges["*"]), f.loop && l(f);
          }
          for ((h || !r && !d) && (n = si), i += e.length + 2, (i += r ? 2 : null === n ? 4 : n.toString().length) >= t && (n = void 0), o[o.length - 1]--, n && n !== si && r && (o.push(s.objectKeys(n).length), a.push(u)); o[o.length - 1] <= 0;) o.pop(), a.pop();
          return n;
        });
      } catch (e) {}
      return "[error serializing " + e.constructor.name + "]";
    }
  }
  var ui = function () {
      function e(e) {
        this._requestTracker = e;
      }
      return e.prototype.disable = function () {
        this._hook && (this._hook.disable(), this._hook = null);
      }, e.prototype.enable = function (e) {
        var t,
          n = this,
          r = I(e),
          i = null === (t = null == r ? void 0 : r._w) || void 0 === t ? void 0 : t.fetch;
        (i || e.fetch) && (this._hook = Tt(i ? r._w : e, "fetch"), this._hook && this._hook.afterSync(function (e) {
          return n.recordFetch(e.that, e.result, e.args[0], e.args[1]);
        }));
      }, e.prototype.recordFetch = function (e, t, n, r) {
        var i,
          o = "GET",
          s = "",
          a = {};
        if ("string" == typeof n ? s = n : "url" in n ? (s = n.url, o = n.method, i = n.body, n.headers && n.headers.forEach(function (e, t) {
          a[e] = t;
        })) : s = "" + n, r) {
          o = r.method || o;
          var u = r.headers;
          if (u) if (nt(u)) for (var c = 0, h = u; c < h.length; c++) {
            var d = h[c],
              l = d[0],
              p = d[1];
            a[l] = p;
          } else if ("function" == typeof u.forEach) u.forEach(function (e, t, n) {
            a[t] = e;
          });else for (var l in u) a[l] = u[l];
          i = r.body || i;
        }
        if (s) {
          for (var l in s = this._requestTracker.addPendingReq(t, o, s), a) this._requestTracker.addHeader(t, l, a[l]);
          i && this._requestTracker.addRequestBody(t, i);
        }
        this.instrumentResponse(t, s, !!this._requestTracker.getRspWhitelist(s));
      }, e.prototype.instrumentResponse = function (e, t, n) {
        var r = this;
        e.then(Mt.wrap(function (t) {
          var i = (t.headers.get("content-type") || "default").split(";")[0],
            o = ["default", "text/plain", "text/json", "application/json"].indexOf(i) > -1;
          n && o ? t.clone().text().then(Mt.wrap(function (i) {
            var o = mi(i, n),
              s = o[0],
              a = o[1];
            r.onComplete(e, t, s, a);
          }))["catch"](Mt.wrap(function (n) {
            r.onComplete(e, t, -1, void 0);
          })) : r.onComplete(e, t, -1, void 0);
        }))["catch"](Mt.wrap(function (t) {
          r.onComplete(e, t, -1, void 0);
        }));
      }, e.prototype.onComplete = function (e, t, n, r) {
        var i = this,
          o = -1,
          s = "";
        if ("headers" in t) {
          o = t.status;
          s = this.serializeFetchHeaders(t.headers, function (e) {
            return i._requestTracker.isHeaderInResponseHeaderWhitelist(e[0]);
          });
        }
        return this._requestTracker.onComplete(e, s, o, n, r);
      }, e.prototype.serializeFetchHeaders = function (e, t) {
        var n = "";
        return e.forEach(function (e, r) {
          r = r.toLowerCase();
          var i = t([r, e]);
          n += r + (i ? ": " + e : "") + di;
        }), n;
      }, e;
    }(),
    ci = function () {
      function e(e) {
        this._requestTracker = e;
      }
      return e.prototype.disable = function () {
        this._xhrOpenHook && (this._xhrOpenHook.disable(), this._xhrOpenHook = null), this._xhrSetHeaderHook && (this._xhrSetHeaderHook.disable(), this._xhrSetHeaderHook = null);
      }, e.prototype.enable = function (e) {
        var t,
          n = this,
          r = I(e),
          i = (null === (t = null == r ? void 0 : r._w) || void 0 === t ? void 0 : t.XMLHttpRequest) || e.XMLHttpRequest;
        if (i) {
          var o = i.prototype;
          this._xhrOpenHook = Tt(o, "open"), this._xhrOpenHook && this._xhrOpenHook.before(function (e) {
            var t = e.args[0],
              r = e.args[1];
            n._requestTracker.addPendingReq(e.that, t, r), e.that.addEventListener("load", Mt.wrap(function (t) {
              n.onComplete(e.that);
            })), e.that.addEventListener("error", Mt.wrap(function (t) {
              n.onComplete(e.that);
            }));
          }), this._xhrSendHook = Tt(o, "send"), this._xhrSendHook && this._xhrSendHook.before(function (e) {
            var t = e.args[0];
            n._requestTracker.addRequestBody(e.that, t);
          }), this._xhrSetHeaderHook = Tt(o, "setRequestHeader"), this._xhrSetHeaderHook && this._xhrSetHeaderHook.before(function (e) {
            var t = e.args[0],
              r = e.args[1];
            n._requestTracker.addHeader(e.that, t, r);
          });
        }
      }, e.prototype.onComplete = function (e) {
        var t = this,
          n = this.responseBody(e),
          r = n[0],
          i = n[1],
          o = Ei(function (e) {
            var t = [];
            return e.split(di).forEach(function (e) {
              var n = e.indexOf(":");
              -1 != n ? t.push([e.slice(0, n).trim(), e.slice(n + 1, e.length).trim()]) : t.push([e.trim(), null]);
            }), t;
          }(e.getAllResponseHeaders()), function (e) {
            return t._requestTracker.isHeaderInResponseHeaderWhitelist(e[0]);
          });
        return this._requestTracker.onComplete(e, o, e.status, r, i);
      }, e.prototype.responseBody = function (e) {
        var t = this._requestTracker.pendingReq(e);
        if (!t) return [-1, void 0];
        var n = this._requestTracker.getRspWhitelist(t.url);
        if (e.responseType) {
          var r = e.response;
          switch (r || o("Maybe response type was different that expected."), e.responseType) {
            case "text":
              return mi(e.responseText, n);
            case "json":
              return function (e, t) {
                if (!e) return [-1, void 0];
                return [yi(e), ai(e, te.MaxPayloadLength, t)];
              }(r, n);
            case "arraybuffer":
              return function (e, t) {
                return [e ? e.byteLength : -1, t ? "[ArrayBuffer]" : void 0];
              }(r, n);
            case "blob":
              return function (e, t) {
                return [e ? e.size : -1, t ? "[Blob]" : void 0];
              }(r, n);
            case "document":
              return function (e, t) {
                return [-1, t ? "[Document]" : void 0];
              }(0, n);
          }
        }
        return mi(e.responseText, n);
      }, e;
    }();
  var hi,
    di = "\r\n",
    li = ["a-im", "accept", "accept-charset", "accept-encoding", "accept-language", "accept-datetime", "access-control-request-method,", "access-control-request-headers", "cache-control", "connection", "content-length", "content-md5", "content-type", "date", "expect", "forwarded", "from", "host", "if-match", "if-modified-since", "if-none-match", "if-range", "if-unmodified-since", "max-forwards", "origin", "pragma", "range", "referer", "te", "user-agent", "upgrade", "via", "warning"],
    pi = ["access-control-allow-origin", "access-control-allow-credentials", "access-control-expose-headers", "access-control-max-age", "access-control-allow-methods", "access-control-allow-headers", "accept-patch", "accept-ranges", "age", "allow", "alt-svc", "cache-control", "connection", "content-disposition", "content-encoding", "content-language", "content-length", "content-location", "content-md5", "content-range", "content-type", "date", "delta-base", "etag", "expires", "im", "last-modified", "link", "location", "permanent", "p3p", "pragma", "proxy-authenticate", "public-key-pins", "retry-after", "permanent", "server", "status", "strict-transport-security", "trailer", "transfer-encoding", "tk", "upgrade", "vary", "via", "warning", "www-authenticate", "x-frame-options"],
    fi = {
      BM7A6: ["x-b3-traceid"],
      KD87S: ["transactionid"],
      NHYJM: ["x-att-conversationid"],
      GBNRN: ["x-trace-id"],
      R16RC: ["x-request-id"],
      DE9CX: ["x-client", "x-client-id", "ot-baggage-original-client", "x-req-id", "x-datadog-trace-id", "x-datadog-parent-id", "x-datadog-sampling-priority"]
    },
    vi = {
      "thefullstory.com": ["x-cloud-trace-context"],
      TN1: ["x-cloud-trace-context"],
      KD87S: ["transactionid"],
      PPE96: ["x-b3-traceid"],
      HWT6H: ["x-b3-traceid"],
      PPEY7: ["x-b3-traceid"],
      PPK3W: ["x-b3-traceid"],
      NHYJM: ["x-att-conversationid"],
      GBNRN: ["x-trace-id"],
      NK5T9: ["traceid", "requestid"]
    },
    _i = function () {
      function e(e, t) {
        this._ctx = e, this._queue = t, this._enabled = !1, this._tracker = new gi(e, t), this._xhr = new ci(this._tracker), this._fetch = new ui(this._tracker);
      }
      return e.prototype.isEnabled = function () {
        return this._enabled;
      }, e.prototype.enable = function (e) {
        this._enabled || (this._enabled = !0, this._queue.enqueue({
          Kind: R.REC_FEAT_SUPPORTED,
          Args: [Y.Ajax, !0, Y.AjaxFetch, !!e]
        }), this._xhr.enable(this._ctx.window), e && this._fetch.enable(this._ctx.window));
      }, e.prototype.disable = function () {
        this._enabled && (this._enabled = !1, this._xhr.disable(), this._fetch.disable());
      }, e.prototype.tick = function (e) {
        this._tracker.tick(e);
      }, e.prototype.setWatches = function (e) {
        this._tracker.setWatches(e);
      }, e;
    }(),
    gi = function () {
      function e(e, t) {
        this._ctx = e, this._queue = t, this._reqHeaderWhitelist = {}, this._rspHeaderWhitelist = {}, this._pendingReqs = {}, this._events = [], this._curId = 1, this.addHeaderWhitelist(li, pi), this.addHeaderWhitelist(fi[e.options.orgId], vi[e.options.orgId]);
      }
      return e.prototype.getReqWhitelist = function (e) {
        var t = this.findWhitelistIndexFor(e);
        return t >= 0 && this._reqWhitelist[t];
      }, e.prototype.getRspWhitelist = function (e) {
        var t = this.findWhitelistIndexFor(e);
        return t >= 0 && this._rspWhitelist[t];
      }, e.prototype.isHeaderInRequestHeaderWhitelist = function (e) {
        return e in this._reqHeaderWhitelist;
      }, e.prototype.isHeaderInResponseHeaderWhitelist = function (e) {
        return e in this._rspHeaderWhitelist;
      }, e.prototype.pushEvent = function (e) {
        this._events.push(e);
      }, e.prototype.setWatches = function (e) {
        var t = this,
          n = [];
        this._reqWhitelist = [], this._rspWhitelist = [], e.forEach(function (e) {
          n.push(e.URLRegex), t._reqWhitelist.push(Si(e.RecordReq, e.ReqWhitelist)), t._rspWhitelist.push(Si(e.RecordRsp, e.RspWhitelist));
        }), this._reqBodyRegex = new RegExp("(" + n.join(")|(") + ")");
      }, e.prototype.addHeaderWhitelist = function (e, t) {
        var n = this;
        e && e.forEach(function (e) {
          return n._reqHeaderWhitelist[e] = !0;
        }), t && t.forEach(function (e) {
          return n._rspHeaderWhitelist[e] = !0;
        });
      }, e.prototype.tick = function (e) {
        if (e) {
          for (var t = 0; t < this._events.length; t++) this._queue.enqueue({
            Kind: R.AJAX_REQUEST,
            Args: this._events[t]
          });
          this._events = [];
        }
      }, e.prototype.pendingReq = function (e) {
        var t = wi(e);
        return t ? this._pendingReqs[t] : (o("missing xhr req id"), null);
      }, e.prototype.deletePending = function (e) {
        var t = wi(e);
        t && delete this._pendingReqs[t];
      }, e.prototype.addPendingReq = function (e, t, n) {
        this.deletePending(e);
        var r = this._curId++;
        return n = function (e, t) {
          return Qn.resolveToDocument(e, t);
        }(this._ctx.window, n), this._pendingReqs[r] = {
          id: r,
          xhr: e,
          method: t,
          url: n,
          startTime: p(),
          headers: [],
          reqSize: 0,
          reqBody: void 0
        }, function (e, t) {
          e._fs = t;
        }(e, r), n;
      }, e.prototype.addHeader = function (e, t, n) {
        var r = this.pendingReq(e);
        r && r.headers.push([t, n]);
      }, e.prototype.addRequestBody = function (e, t) {
        var n,
          r = this.pendingReq(e);
        r && (n = this.requestBody(r.url, t), r.reqSize = n[0], r.reqBody = n[1]);
      }, e.prototype.onComplete = function (e, t, n, r, i) {
        var o = this,
          s = this.pendingReq(e);
        if (s) {
          this.deletePending(e);
          var a = p() - s.startTime,
            u = Ei(s.headers, function (e) {
              return o.isHeaderInRequestHeaderWhitelist(e[0]);
            }),
            c = s.reqBody || null,
            h = [s.method, ur(s.url, this._ctx.options.orgId, {
              source: "event",
              type: R.AJAX_REQUEST
            }), a, n, u, t, s.startTime, s.reqSize, r, c, i || null];
          this.pushEvent(h);
        }
      }, e.prototype.findWhitelistIndexFor = function (e) {
        if (this._reqBodyRegex) {
          var t = this._reqBodyRegex.exec(e);
          if (t) for (var n = 1; n < t.length; n++) if (void 0 !== t[n]) return n - 1;
        }
        return -1;
      }, e.prototype.requestBody = function (e, t) {
        if (null == t) return [0, void 0];
        var n = this.getReqWhitelist(e),
          r = typeof t;
        if ("string" == r) return function (e, t) {
          return [e.length, bi(e, t)];
        }(t, n);
        if ("object" == r) {
          var i = r.constructor;
          switch (i) {
            case String:
            case Object:
            default:
              return function (e, t) {
                var n = void 0;
                !1 !== t && (n = ai(e, te.MaxPayloadLength, t));
                return [yi(e), n];
              }(t, n);
            case Blob:
              return function (e, t) {
                var n = e.size,
                  r = void 0;
                t && (r = "[Blob]");
                return [n, r];
              }(t, n);
            case ArrayBuffer:
              return function (e, t) {
                var n = e.byteLength,
                  r = void 0;
                t && (r = "[ArrayBuffer]");
                return [n, r];
              }(t, n);
            case Document:
            case FormData:
            case URLSearchParams:
            case ReadableStream:
              return [-1, n ? "" + i.name : void 0];
          }
        }
        return [-1, n ? "[unknown]" : void 0];
      }, e;
    }();
  function mi(e, t) {
    return e ? [e.length, bi(e, t)] : [-1, void 0];
  }
  function yi(e) {
    try {
      return s.jsonStringify(e).length;
    } catch (e) {}
    return 0;
  }
  function wi(e) {
    return e._fs;
  }
  function bi(e, t) {
    if (0 != t) try {
      return ai(s.jsonParse(e), te.MaxPayloadLength, t);
    } catch (n) {
      return 1 == t ? e.slice(0, te.MaxPayloadLength) : void 0;
    }
  }
  function Si(e, t) {
    switch (e) {
      default:
      case J.Elide:
        return !1;
      case J.Record:
        return !0;
      case J.Whitelist:
        try {
          return ii(t);
        } catch (e) {
          return o("error parsing field whitelist (" + t + ": " + e), !1;
        }
    }
  }
  function Ei(e, t) {
    var n = "";
    return e.forEach(function (e) {
      e[0] = e[0].toLowerCase();
      var r = t(e);
      n += e[0] + (r ? ": " + e[1] : "") + di;
    }), n;
  }
  function Ti(e) {
    return e ? e.sheet : void 0;
  }
  function ki(e) {
    try {
      return e ? e.cssRules || e.rules : void 0;
    } catch (e) {
      return;
    }
  }
  function Ii(e, t) {
    var n = function (e, t) {
      var n = e;
      if ("function" == typeof n.getPropertyCSSValue) {
        var r = n.getPropertyCSSValue(t);
        if (null != r) {
          var i;
          switch (r.cssValueType) {
            case 1:
              i = r;
              break;
            case 2:
              if (1 !== r.length) return;
              var o = r.item(0);
              if (null == o) return;
              if (1 !== o.cssValueType) return;
              i = o;
              break;
            default:
              return;
          }
          if (19 === i.primitiveType) {
            var s = Gn();
            hi || (hi = s.createElement("div"));
            var a = i.cssText;
            try {
              hi.style.cssText = t + ": \"" + a + "\";";
              var u = hi.style.getPropertyCSSValue(t);
              if (null == u) return;
              if (a !== u.cssText) return;
            } catch (e) {
              return;
            } finally {
              hi.style.cssText = "";
            }
            return "\"" + a + "\"";
          }
        }
      }
    }(e, t);
    return void 0 !== n ? n : e.getPropertyValue(t);
  }
  var Ci,
    Ri = "EventQueue not defined for 'withEventQueueFor', likely caused by holding ref to callback",
    Ai = function (e) {
      var t = e.ownerDocument;
      return t && t.defaultView;
    },
    xi = function () {
      function e(t, n) {
        var r = this;
        this.ctx = t, this.queue = n, this.hooks = [], this.removeShims = [], this.nextSheetId = 1;
        var i = e;
        this.throttle = new nn(i.ThrottleMax, i.ThrottleInterval, function () {
          return setTimeout(function () {
            r.queue.enqueue({
              Kind: R.FAIL_THROTTLED,
              Args: [Q.StyleSheetHooks]
            }), r.stop();
          });
        }), this.addInsert = this.throttle.guard(this.addInsert), this.addDelete = this.throttle.guard(this.addDelete);
      }
      return e.prototype.start = function () {
        var e = this;
        this.throttle.open();
        var t = this.ctx.window;
        if (t.CSSStyleSheet && t.StyleSheet) {
          var n,
            r = t.CSSStyleSheet.prototype;
          (n = Tt(r, "insertRule")) && (n.afterSync(function (t) {
            e.addInsert(t.that, t.args[0], t.args[1]);
          }), this.hooks.push(n)), (n = Tt(r, "deleteRule")) && (n.afterSync(function (t) {
            e.addDelete(t.that, t.args[0]);
          }), this.hooks.push(n)), this.removeShims.push(kt(t.StyleSheet, "disabled", function (t, n) {
            return e.onDisableSheet(t, n);
          }), kt(t.Document, "adoptedStyleSheets", function (t, n) {
            return e.onSetAdoptedStyleSheets(t);
          }), kt(t.ShadowRoot, "adoptedStyleSheets", function (t, n) {
            return e.onSetAdoptedStyleSheets(t);
          }));
        }
      }, e.prototype.onSetAdoptedStyleSheets = function (e) {
        if (Mn(e)) {
          var t = e.adoptedStyleSheets;
          if (t) {
            for (var n = [], r = 0, i = t; r < i.length; r++) {
              var o = i[r],
                s = this.snapshotConstructedStylesheet(o);
              n.push(s), !0 === o.disabled && this.onDisableSheet(o, !0);
            }
            this.queue.enqueue({
              Kind: R.ADOPTED_STYLESHEETS,
              Args: [Mn(e), n]
            });
          }
        }
      }, e.prototype.snapshotEl = function (e, t) {
        void 0 === t && (t = 0);
        var n = Mn(e);
        if (n) {
          var r = Ti(e);
          r && this.snapshot([G.Node, n], r, t);
        }
      }, e.prototype.snapshotConstructedStylesheet = function (e) {
        var t = Pi(e);
        if (void 0 !== t) return t;
        var n = this.nextSheetId++;
        return function (e, t) {
          e._fs = t;
        }(e, n), this.snapshot([G.Sheet, n], e), n;
      }, e.prototype.snapshot = function (e, t, n) {
        void 0 === n && (n = 0);
        var r = ki(t);
        if (r) {
          for (var i = [], o = n; o < r.length; o++) try {
            i.push(Ci(r[o]));
          } catch (e) {
            i.push("html {}");
          }
          this.queue.enqueue({
            Kind: R.CSSRULE_INSERT,
            Args: [e, i, n]
          });
        }
      }, e.prototype.addInsert = function (t, n, r) {
        var i = Fi(t, G.Node);
        i && "string" == typeof n && (n.length > e.MaxRuleBytes && (o("CSSRule too large, inserting dummy instead: " + n.length), n = "dummy {}"), this.withEventQueueForSheet(t, function (e) {
          return e.enqueue({
            Kind: R.CSSRULE_INSERT,
            Args: "number" == typeof r ? [i, [n], r] : [i, [n]]
          });
        }));
      }, e.prototype.addDelete = function (e, t) {
        var n = Fi(e, G.Node);
        n && this.withEventQueueForSheet(e, function (e) {
          return e.enqueue({
            Kind: R.CSSRULE_DELETE,
            Args: [n, t]
          });
        });
      }, e.prototype.onDisableSheet = function (e, t) {
        var n = Fi(e, G.Node);
        n && this.withEventQueueForSheet(e, function (e) {
          return e.enqueue({
            Kind: R.DISABLE_STYLESHEET,
            Args: [n, !!t]
          });
        });
      }, e.prototype.withEventQueueForSheet = function (e, t) {
        if (e.ownerNode) return n = this.ctx, r = e.ownerNode, i = t, void ((o = I(Ai(r) || n.window)) && "function" == typeof o._withEventQueue && o._withEventQueue(n.recording.pageSignature(), function (e) {
          i({
            enqueue: function (t) {
              Ft(null != e, Ri) && e.enqueue(t);
            },
            enqueueFirst: function (t) {
              Ft(null != e, Ri) && e.enqueueFirst(t);
            }
          }), e = null;
        }));
        var n, r, i, o;
        t(this.queue);
      }, e.prototype.stop = function () {
        this.throttle.close();
        for (var e = 0, t = this.hooks; e < t.length; e++) {
          t[e].disable();
        }
        this.hooks = [];
        for (var n = 0, r = this.removeShims; n < r.length; n++) {
          (0, r[n])();
        }
        this.removeShims = [];
      }, e.ThrottleMax = 1e4, e.ThrottleInterval = 1e4, e.MaxRuleBytes = 16384, e;
    }(),
    Oi = document.createElement("div");
  function Mi(e, t) {
    if (void 0 === t && (t = 0), !Ft(t <= 20, "No deep recursion for CSS rules")) return "html { /* Depth limit exceeded! */ }";
    var n = function (e) {
      switch (e.type) {
        case CSSRule.PAGE_RULE:
          var t = e.selectorText || "";
          return t && ct(t, "@page") ? t : "@page " + t;
        case CSSRule.KEYFRAME_RULE:
          return e.keyText;
        case CSSRule.STYLE_RULE:
          return e.selectorText;
        case CSSRule.MEDIA_RULE:
          return "@media " + e.media.mediaText;
        case CSSRule.KEYFRAMES_RULE:
          return "@keyframes " + e.name;
        case CSSRule.SUPPORTS_RULE:
          return "@supports " + e.conditionText;
        default:
          return null;
      }
    }(e);
    if (null == n) return e.cssText;
    var r = function (e, t) {
      var n = e,
        r = n.style;
      if (r) {
        for (var i = "", o = 0; o < r.length; o++) {
          var s = r[o],
            a = Ii(r, s);
          "initial" !== a && ("\"" !== (u = a)[0] && "'" !== u[0] || u[u.length - 1] !== u[0]) || (i += s + ": " + a, "important" === r.getPropertyPriority(s) && (i += " !important"), i += "; ");
        }
        return [r.cssText, i].filter(Boolean).join("\n");
      }
      var u;
      var c = n.cssRules;
      if (!c) return null;
      var h = "";
      for (o = 0; o < c.length; o++) h += Mi(c[o], t + 1);
      return h;
    }(e, t);
    return null == r ? e.cssText : n + " { " + r + "} ";
  }
  Oi.style.width = "initial", Ci = "" != Oi.style.cssText ? function (e) {
    return e.cssText;
  } : Mi;
  var Li = /^\s*$/;
  function Fi(e, t) {
    var n = function (e) {
      var t = Pi(e);
      if (t) return [G.Sheet, t];
      var n = Mn(e.ownerNode);
      if (n) return [G.Node, n];
      return;
    }(e);
    if (n) {
      var r = n[0],
        i = n[1];
      return r === t ? i : n;
    }
  }
  function Pi(e) {
    return e._fs;
  }
  var qi = function () {
      function e(e, t, n) {
        this._ctx = e, this._q = t, this._listeners = n.createChild();
      }
      return e.prototype.start = function () {
        var e = this,
          t = this._ctx.window.document;
        this._listeners.addCustom(t, this.getFullscreenChangeEvent(), !0, function (t) {
          e.onFullscreenChange(t);
        }), this._listeners.addCustom(t, this.getFullscreenErrorEvent(), !0, function (t) {
          e.onFullscreenError(t);
        });
      }, e.prototype.stop = function () {
        this._listeners && this._listeners.clear();
      }, e.prototype.onFullscreenChange = function (e) {
        var t = this.getFullscreenElement();
        if (t) {
          var n = Mn(t);
          Ft(null == this._previousFullscreenFSID, "Error: Received fullscreen signal but we think we are already in fullscreen?"), this._q.enqueue({
            Kind: R.FULLSCREEN,
            Args: [n, !0]
          }), this._previousFullscreenFSID = n;
        } else Ft(null != this._previousFullscreenFSID, "Error: Received fullscreen exit signal but have no previous fullscreen event?"), this._q.enqueue({
          Kind: R.FULLSCREEN,
          Args: [this._previousFullscreenFSID, !1]
        }), this._previousFullscreenFSID = void 0;
      }, e.prototype.onFullscreenError = function (e) {
        this._q.enqueue({
          Kind: R.FULLSCREEN_ERROR,
          Args: []
        });
      }, e.prototype.getFullscreenElement = function () {
        var e = this._ctx.window.document;
        return e[fe(e, "fullscreenElement")];
      }, e.prototype.getFullscreenChangeEvent = function () {
        return fe(this._ctx.window.document, "onfullscreenchange").slice(2);
      }, e.prototype.getFullscreenErrorEvent = function () {
        return fe(this._ctx.window.document, "onfullscreenerror").slice(2);
      }, e;
    }(),
    Ui = function (e, t, n, r) {
      return new (n || (n = Promise))(function (i, o) {
        function s(e) {
          try {
            u(r.next(e));
          } catch (e) {
            o(e);
          }
        }
        function a(e) {
          try {
            u(r["throw"](e));
          } catch (e) {
            o(e);
          }
        }
        function u(e) {
          var t;
          e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function (e) {
            e(t);
          })).then(s, a);
        }
        u((r = r.apply(e, t || [])).next());
      });
    },
    Ni = function (e, t) {
      var n,
        r,
        i,
        o,
        s = {
          label: 0,
          sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          },
          trys: [],
          ops: []
        };
      return o = {
        next: a(0),
        "throw": a(1),
        "return": a(2)
      }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
        return this;
      }), o;
      function a(o) {
        return function (a) {
          return function (o) {
            if (n) throw new TypeError("Generator is already executing.");
            for (; s;) try {
              if (n = 1, r && (i = 2 & o[0] ? r["return"] : o[0] ? r["throw"] || ((i = r["return"]) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
              switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                case 0:
                case 1:
                  i = o;
                  break;
                case 4:
                  return s.label++, {
                    value: o[1],
                    done: !1
                  };
                case 5:
                  s.label++, r = o[1], o = [0];
                  continue;
                case 7:
                  o = s.ops.pop(), s.trys.pop();
                  continue;
                default:
                  if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                    s = 0;
                    continue;
                  }
                  if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                    s.label = o[1];
                    break;
                  }
                  if (6 === o[0] && s.label < i[1]) {
                    s.label = i[1], i = o;
                    break;
                  }
                  if (i && s.label < i[2]) {
                    s.label = i[2], s.ops.push(o);
                    break;
                  }
                  i[2] && s.ops.pop(), s.trys.pop();
                  continue;
              }
              o = t.call(e, s);
            } catch (e) {
              o = [6, e], r = 0;
            } finally {
              n = i = 0;
            }
            if (5 & o[0]) throw o[1];
            return {
              value: o[0] ? o[1] : void 0,
              done: !0
            };
          }([o, a]);
        };
      }
    },
    Wi = function () {
      function e(e, t) {
        this._queue = t, this._registry = null, this._checkedNodeTags = {};
        var n = e.window;
        this._registry = n.customElements && n.customElements.get && n.customElements.whenDefined && n.customElements;
      }
      return e.prototype.onCustomNodeVisited = function (e) {
        return Ui(this, void 0, et, function () {
          var t, n;
          return Ni(this, function (r) {
            switch (r.label) {
              case 0:
                if (!this._registry) return [2];
                if (t = e.nodeName.toLowerCase(), this._checkedNodeTags.hasOwnProperty(t)) return [2];
                r.label = 1;
              case 1:
                return r.trys.push([1, 3,, 4]), n = !!this._registry.get(t), this._checkedNodeTags[t] = n, [4, this._registry.whenDefined(t)];
              case 2:
                return r.sent(), this._enqueue(t), [3, 4];
              case 3:
                return r.sent(), [3, 4];
              case 4:
                return [2];
            }
          });
        });
      }, e.prototype._enqueue = function (e) {
        this._queue.enqueue({
          Kind: R.CUSTOM_ELEMENT_DEFINED,
          Args: [e]
        });
      }, e;
    }(),
    Di = function () {
      function e(e, t, n, r, i, o, s, a) {
        var u = this;
        this._ctx = e, this._queue = t, this._keep = n, this._onFrameCreated = o, this._beforeFrameRemoved = s, this._resourceUploader = a, this._curSelection = [], this._scrollTimeouts = {}, this._uploadResources = !1, this._modalHooks = [], this._initialized = !1, this._wnd = e.window, this._doc = this._wnd.document, this._loc = this._wnd.location, this._hst = this._wnd.history, this._listeners = i.createChild(), this._currentUrl = this._loc.href, this._inputWatcher = new Un(function (e) {
          u.addChangeElem(e);
        }, function (e) {
          return !!Mn(e);
        }), this._ajaxWatcher = new _i(e, t), this._perfWatcher = new ri(e, t, this._listeners), this._styleSheetWatcher = new xi(e, t), this._fullscreenWatcher = new qi(e, t, this._listeners), this._customElementWatcher = new Wi(e, t), this._mutWatcher = new Qr(e, r, !0, function (e, t) {
          return u.visitNode(e, t);
        }, function (e) {
          var t = e.node;
          if ("iframe" == on(e.node)) u._beforeFrameRemoved(e.node);else if ("function" == typeof t.getElementsByTagName) for (var n = t.getElementsByTagName("iframe"), r = 0; r < n.length; r++) {
            var i = n[r];
            u._beforeFrameRemoved(i);
          }
        }, function (e, t, n) {
          if (!function (e) {
            return Cn(e) || Rn(e);
          }(e) && u._uploadResources) for (var r = 0, i = function (e, t, n) {
              var r,
                i = on(e);
              if (Hi[t] && Hi[t][i]) return [n];
              if ("link" == i && "href" == t && (r = e.getAttribute("rel")) && r.indexOf("stylesheet") > -1) return [n];
              if ("srcset" == t && ("img" == i || "source" == i)) {
                return null != n.match(/^\s*$/) ? [] : n.split(",").map(function (e) {
                  return e.trim().split(/\s+/)[0];
                });
              }
              var o = e;
              if ("style" == t && o.style) {
                var s = o.style.backgroundImage;
                if (!s) return [];
                if (s.length > 300) return [];
                var a = [],
                  u = void 0;
                for (jt.lastIndex = 0; u = jt.exec(s);) {
                  var c = u[1];
                  c && a.push(c.trim());
                }
                return a;
              }
              return [];
            }(e, t, n); r < i.length; r++) {
            var o = i[r];
            u._resourceUploader.uploadIfNeeded(u._wnd, o);
          }
        });
      }
      return e.prototype.watchEvents = function () {
        var e = this;
        this._mutWatcher.hookMutations(), this._inputWatcher.hookEvents(), this._styleSheetWatcher.start(), this._perfWatcher.start(this._resourceUploader), this._fullscreenWatcher.start(), this._listeners.add(this._wnd, "mousemove", !0, function (t) {
          e.isSafePointerEvent(t) && e.addMouseMove(t);
        }), this._listeners.add(this._wnd, "mousedown", !0, function (t) {
          e.isSafePointerEvent(t) && e.addMouseDown(t);
        }), this._listeners.add(this._wnd, "mouseup", !0, function (t) {
          e.isSafePointerEvent(t) && e.addMouseUp(t);
        }), this._listeners.add(this._wnd, "keydown", !0, function () {
          e.addKeyDown();
        }), this._listeners.add(this._wnd, "keyup", !0, function () {
          e.addKeyUp();
        }), this._listeners.add(this._wnd, "click", !0, function (t) {
          e.isSafePointerEvent(t) && e.addClick(t);
        }), this._listeners.add(this._wnd, "dblclick", !0, function (t) {
          e.addDblClick(t);
        }), this._listeners.add(this._wnd, "focus", !0, function (t) {
          e.addFocus(t);
        }), this._listeners.add(this._wnd, "blur", !0, function (t) {
          e.addBlur(t);
        }), this._listeners.add(this._wnd, "change", !0, function (t) {
          e.addChange(t);
        }, !0), this._listeners.add(this._wnd, "touchstart", !0, function (t) {
          e.isSafePointerEvent(t) && (e.addTouchEvent(t, R.TOUCHSTART), e.addWindowScrollOrResize());
        }), this._listeners.add(this._wnd, "touchend", !0, function (t) {
          e.isSafePointerEvent(t) && (e.addTouchEvent(t, R.TOUCHEND), e.addWindowScrollOrResize());
        }), this._listeners.add(this._wnd, "touchmove", !0, function (t) {
          e.isSafePointerEvent(t) && (e.addTouchEvent(t, R.TOUCHMOVE), e.addWindowScrollOrResize());
        }), this._listeners.add(this._wnd, "touchcancel", !0, function (t) {
          e.isSafePointerEvent(t) && e.addTouchEvent(t, R.TOUCHCANCEL);
        }), this._listeners.add(this._wnd, "play", !0, function (t) {
          e.addPlayEvent(t);
        }), this._listeners.add(this._wnd, "pause", !0, function (t) {
          e.addPauseEvent(t);
        }), this._listeners.add(this._wnd, "scroll", !1, function () {
          e.addWindowScrollOrResize();
        }), this._listeners.add(this._wnd, "resize", !1, function () {
          e.addWindowScrollOrResize();
        }), this._listeners.add(this._wnd, "submit", !1, function (t) {
          e.addFormSubmit(t);
        }), this._listeners.add(this._wnd, "focus", !1, function () {
          e.addWindowFocus();
        }), this._listeners.add(this._wnd, "blur", !1, function () {
          e.addWindowBlur();
        }), this._listeners.add(this._wnd, "popstate", !1, function () {
          e.addNavigate();
        }), this._listeners.add(this._wnd, "selectstart", !0, function () {
          e.addSelection();
        }), this._listeners.add(this._doc, "selectionchange", !0, function () {
          e.addSelection();
        });
        var t = this._wnd.visualViewport;
        t ? (this._listeners.add(t, "scroll", !0, function () {
          return e.addWindowScrollOrResize();
        }), this._listeners.add(t, "resize", !0, function () {
          return e.addWindowScrollOrResize();
        })) : this._listeners.add(this._wnd, "mousewheel", !0, function () {
          e.addWindowScrollOrResize();
        }), this._pushHook = Tt(this._hst, "pushState"), this._pushHook && this._pushHook.afterSync(function () {
          return e.addNavigate();
        }), this._replaceHook = Tt(this._hst, "replaceState"), this._replaceHook && this._replaceHook.afterSync(function () {
          return e.addNavigate();
        });
        for (var n = function (t) {
            var n = Tt(r._wnd, t);
            if (!n) return "continue";
            r._modalHooks.push(n), n.before(function () {
              e._queue.enqueue({
                Kind: R.MODAL_OPEN,
                Args: [t]
              });
            }).afterSync(function () {
              e._queue.enqueue({
                Kind: R.MODAL_CLOSE,
                Args: [t]
              });
            });
          }, r = this, i = 0, o = ne; i < o.length; i++) {
          n(o[i]);
        }
        if ("function" == typeof this._wnd.document.hasFocus && this._queue.enqueue({
          Kind: this._wnd.document.hasFocus() ? R.WINDOW_FOCUS : R.WINDOW_BLUR,
          Args: []
        }), s.matchMedia) for (var a = function (t, n, r) {
            var i = s.matchMedia(u._wnd, r);
            if (!i) return "continue";
            var o = function () {
              i.matches && e._queue.enqueue({
                Kind: R.MEDIA_QUERY_CHANGE,
                Args: [t, n]
              });
            };
            u._listeners.add(i, "change", !0, o), o();
          }, u = this, c = 0, h = [["any-pointer", "coarse", "not screen and (any-pointer: fine)"], ["any-pointer", "fine", "only screen and (any-pointer: fine)"], ["any-hover", "none", "not screen and (any-hover: hover)"], ["any-hover", "hover", "only screen and (any-hover: hover)"], ["pointer", "none", "(pointer: none)"], ["pointer", "coarse", "(pointer: coarse)"], ["pointer", "fine", "(pointer: fine)"]]; c < h.length; c++) {
          var d = h[c];
          a(d[0], d[1], d[2]);
        }
        this._initialized = !0;
      }, e.prototype.initResourceUploading = function () {
        this._resourceUploader.init(), this._uploadResources = !0;
      }, e.prototype.onDomLoad = function () {
        this.addDomLoaded(), this.addViewportChange(), this._mutWatcher._checkForMissingInsertions(ae);
      }, e.prototype.onLoad = function () {
        var e = this,
          t = !1,
          n = Mt.wrap(function () {
            t || (t = !0, e._perfWatcher.onLoad(), e.addLoad(), e.addViewportChange());
          }, "error");
        new tn(n, 0).start(), s.requestWindowAnimationFrame && s.requestWindowAnimationFrame(this._wnd, n);
      }, e.prototype.ajaxWatcher = function () {
        return this._ajaxWatcher;
      }, e.prototype.bundleEvents = function (e) {
        var t = this;
        return this._queue.enqueueSimultaneousEventsIn(function (n) {
          return t._inputWatcher.tick(), t._perfWatcher.tick(e), t._ajaxWatcher.tick(e), t.addViewportChange(), t._mutWatcher.processMutations(n);
        });
      }, e.prototype.shutdown = function (e) {
        if (this._initialized) {
          this._initialized = !1, this._listeners && this._listeners.clear(), this._pushHook && this._pushHook.disable(), this._replaceHook && this._replaceHook.disable();
          for (var t = 0, n = this._modalHooks; t < n.length; t++) {
            n[t].disable();
          }
          this._modalHooks = [], this._perfWatcher.onLoad(), this._ctx.measurer.performMeasurementsNow(), this._queue.processEvents(), this._inputWatcher.shutdown(), this._mutWatcher.shutdown(), this._ajaxWatcher.disable(), this._perfWatcher.shutdown(), this._styleSheetWatcher.stop(), this._fullscreenWatcher.stop(), this._queue.shutdown(e);
        }
      }, e.prototype.recordingIsDetached = function () {
        return this._mutWatcher.recordingIsDetached();
      }, e.prototype.visitNode = function (e, t) {
        var n = this;
        switch (e.nodeName) {
          case "#document":
          case "#document-fragment":
            "#document-fragment" === e.nodeName && this._listeners.add(e, "scroll", !0, function (e) {
              return n.addScroll(Ki(e));
            });
            var r = e;
            try {
              if (!r.adoptedStyleSheets || 0 === r.adoptedStyleSheets.length) break;
            } catch (e) {
              break;
            }
            t.push(function () {
              n._styleSheetWatcher.onSetAdoptedStyleSheets(e);
            });
            break;
          case "HTML":
            this._docElScrollListener && this._listeners.remove(this._docElScrollListener), this._docElScrollListener = this._listeners.add(e, "scroll", !0, function (e) {
              n.addScroll(Ki(e));
            });
            break;
          case "BODY":
            this.addViewportChange(), this.addSelection();
            break;
          case "INPUT":
          case "TEXTAREA":
          case "SELECT":
            this._inputWatcher.addInput(e);
            break;
          case "FRAME":
          case "IFRAME":
            this._onFrameCreated(e);
            break;
          case "VIDEO":
          case "AUDIO":
            e.paused || this._queue.enqueue({
              Kind: R.PLAY,
              Args: [Mn(e)]
            });
            break;
          case "LINK":
            if (!(i = e.sheet)) break;
            !0 === i.disabled && this._styleSheetWatcher.onDisableSheet(i, !0);
            break;
          case "STYLE":
            var i,
              o = e;
            if (!(i = o.sheet)) break;
            !0 === i.disabled && this._styleSheetWatcher.onDisableSheet(i, !0);
            var s = function (e) {
              var t = e.textContent || "";
              if (!(t.length > 5e5)) {
                var n = ki(Ti(e));
                if (n) {
                  if (n.length > 0 && Li.test(t)) return 0;
                  var r,
                    i = Gn();
                  ae ? (r = i.createElement("style")).textContent = e.textContent : r = i.importNode(e, !0), i.head.appendChild(r);
                  var o = ki(Ti(r));
                  if (i.head.removeChild(r), o) return n.length > o.length ? o.length : void 0;
                }
              }
            }(o);
            void 0 !== s && t.push(function () {
              n._styleSheetWatcher.snapshotEl(o, s);
            });
            break;
          default:
            "#" !== e.nodeName[0] && e.nodeName.indexOf("-") > -1 && this._customElementWatcher.onCustomNodeVisited(e);
        }
        if ("scrollLeft" in e && "scrollTop" in e) {
          var a = e;
          this._ctx.measurer.requestMeasureTask(function () {
            0 == a.scrollLeft && 0 == a.scrollTop || n.addScroll(a);
          });
        }
      }, e.prototype.isSafePointerEvent = function (e) {
        var t = Ki(e);
        return !!Mn(t) && !Cn(t);
      }, e.prototype.addMouseMove = function (e) {
        var t = Mn(Ki(e));
        this._queue.enqueue({
          Kind: R.MOUSEMOVE,
          Args: t ? [e.clientX, e.clientY, t] : [e.clientX, e.clientY]
        });
      }, e.prototype.addMouseDown = function (e) {
        this._queue.enqueue({
          Kind: R.MOUSEDOWN,
          Args: [e.clientX, e.clientY]
        });
      }, e.prototype.addMouseUp = function (e) {
        this._queue.enqueue({
          Kind: R.MOUSEUP,
          Args: [e.clientX, e.clientY]
        });
      }, e.prototype.addTouchEvent = function (e, t) {
        if (void 0 !== e.changedTouches) for (var n = 0; n < e.changedTouches.length; ++n) {
          var r = e.changedTouches[n];
          isNaN(parseInt(r.identifier)) && (r.identifier = 0);
          var i = [r.identifier, r.clientX, r.clientY];
          this._queue.enqueue({
            Kind: t,
            Args: i
          });
        }
      }, e.prototype.addPlayEvent = function (e) {
        var t = Mn(Ki(e));
        t && this._queue.enqueue({
          Kind: R.PLAY,
          Args: [t]
        });
      }, e.prototype.addPauseEvent = function (e) {
        var t = Mn(Ki(e));
        t && this._queue.enqueue({
          Kind: R.PAUSE,
          Args: [t]
        });
      }, e.prototype.addWindowFocus = function () {
        this._queue.enqueue({
          Kind: R.WINDOW_FOCUS,
          Args: []
        });
      }, e.prototype.addWindowBlur = function () {
        this._queue.enqueue({
          Kind: R.WINDOW_BLUR,
          Args: []
        });
      }, e.prototype.maybeAddValueChange = function () {
        var e = ji(this._doc);
        e && this._inputWatcher.onChange(e);
      }, e.prototype.addKeyDown = function () {
        var e = ji(this._doc);
        e && !Ln(e) || (this.maybeAddValueChange(), this._queue.enqueue({
          Kind: R.KEYDOWN,
          Args: []
        }));
      }, e.prototype.addKeyUp = function () {
        var e = ji(this._doc);
        e && !Ln(e) || (this.maybeAddValueChange(), this._queue.enqueue({
          Kind: R.KEYUP,
          Args: []
        }));
      }, e.prototype.addViewportChange = function () {
        var e = this;
        this._ctx.measurer.requestMeasureTask(function () {
          return e._addViewportChangeImpl();
        });
      }, e.prototype._addViewportChangeImpl = function () {
        var e = this.getWindowScrollingElement(),
          t = Mn(e);
        if (t) {
          var n = function (e, t) {
            var n = e.documentElement.getBoundingClientRect(),
              r = t.scrollWidth,
              i = t.scrollHeight;
            return {
              width: s.mathMax(n.width, r),
              height: s.mathMax(n.height, i)
            };
          }(this._wnd.document, e);
          Wt(n, this._curDocSize) || (this._curDocSize = n, this._queue.enqueue({
            Kind: R.RESIZE_DOCUMENT,
            Args: [n.width, n.height]
          }));
          var r,
            i,
            o,
            a,
            u = Yt(this._wnd, this._curLayoutViewport),
            c = function (e, t) {
              return "visualViewport" in e ? e.visualViewport : (void 0 === t && (t = Yt(e)), new Gt(e, t));
            }(this._wnd, u);
          u.hasKnownPosition ? (Nt(u, this._curLayoutViewport) || this._queue.enqueue({
            Kind: R.SCROLL_LAYOUT,
            Args: [t, u.pageLeft, u.pageTop]
          }), r = c, (i = this._curVisualViewport) && r.offsetLeft == i.offsetLeft && r.offsetTop == i.offsetTop || this._queue.enqueue({
            Kind: R.SCROLL_VISUAL_OFFSET,
            Args: [t, c.offsetLeft, c.offsetTop]
          })) : Nt(c, this._curVisualViewport) || this._queue.enqueue({
            Kind: R.SCROLL_LAYOUT,
            Args: [t, c.pageLeft, c.pageTop]
          }), function (e, t) {
            return t && e.width == t.width && e.height == t.height && e.clientWidth == t.clientWidth && e.clientHeight == t.clientHeight;
          }(u, this._curLayoutViewport) || (u.width == u.clientWidth && u.height == u.clientHeight ? this._queue.enqueue({
            Kind: R.RESIZE_LAYOUT,
            Args: [u.clientWidth, u.clientHeight]
          }) : this._queue.enqueue({
            Kind: R.RESIZE_LAYOUT,
            Args: [u.clientWidth, u.clientHeight, u.width, u.height]
          })), Wt(c, this._curVisualViewport) || this._queue.enqueue({
            Kind: R.RESIZE_VISUAL,
            Args: [c.width, c.height]
          }), this._curLayoutViewport = ((a = Dt(o = u)).clientWidth = o.clientWidth, a.clientHeight = o.clientHeight, a), this._curVisualViewport = function (e) {
            var t = Dt(e);
            return t.offsetLeft = e.offsetLeft, t.offsetTop = e.offsetTop, t;
          }(c);
        }
      }, e.prototype.doWorkInScrollTimeout = function (e, t) {
        var n = this;
        e in this._scrollTimeouts || (this._scrollTimeouts[e] = t, new tn(function () {
          n._ctx.measurer.requestMeasureTask(function () {
            if (e in n._scrollTimeouts) {
              var t = n._scrollTimeouts[e];
              delete n._scrollTimeouts[e], t();
            }
          });
        }, te.ScrollSampleInterval).start());
      }, e.prototype._fireScrollTimeouts = function () {
        for (var e in this._scrollTimeouts) this._scrollTimeouts[e](), delete this._scrollTimeouts[e];
        this._scrollTimeouts = [];
      }, e.prototype.getWindowScrollingElement = function () {
        return this._doc.scrollingElement || this._doc.body || this._doc.documentElement;
      }, e.prototype.addWindowScrollOrResize = function () {
        var e = this;
        this.doWorkInScrollTimeout(1, function () {
          return e.addViewportChange();
        });
      }, e.prototype.addScroll = function (e) {
        var t = this,
          n = Mn(e);
        n && this.doWorkInScrollTimeout(n, function () {
          if (Mn(e) === n) {
            var r = e;
            n && "number" == typeof r.scrollLeft && t._queue.enqueue({
              Kind: R.SCROLL_LAYOUT,
              Args: [n, r.scrollLeft, r.scrollTop]
            });
          }
        });
      }, e.prototype.addDomLoaded = function () {
        this._queue.enqueue({
          Kind: R.DOMLOADED,
          Args: []
        });
      }, e.prototype.addLoad = function () {
        this._queue.enqueue({
          Kind: R.LOAD,
          Args: []
        });
      }, e.prototype.addNavigate = function () {
        var e = this._loc.href;
        this._currentUrl != e && (this._currentUrl = e, this._keep.onNavigate(e), this._queue.enqueue({
          Kind: R.NAVIGATE,
          Args: [ur(this._loc.href, this._ctx.options.orgId, {
            source: "event",
            type: R.NAVIGATE
          }), this._doc.title]
        }));
      }, e.prototype.addClick = function (e) {
        var t = Ki(e),
          n = Mn(t);
        if (n) {
          var r = 0,
            i = 0,
            o = 0,
            s = 0;
          if (t && t.getBoundingClientRect) {
            var a = t.getBoundingClientRect();
            r = a.left, i = a.top, o = a.width, s = a.height;
          }
          var u = xn(t);
          this._keep.onClick(u), this._queue.enqueue({
            Kind: R.CLICK,
            Args: [n, e.clientX, e.clientY, r, i, o, s]
          });
        }
      }, e.prototype.addDblClick = function (e) {
        var t = Mn(Ki(e));
        t && this._queue.enqueue({
          Kind: R.DBL_CLICK,
          Args: [t]
        });
      }, e.prototype.addFormSubmit = function (e) {
        var t = Mn(Ki(e));
        t && this._queue.enqueue({
          Kind: R.FORM_SUBMIT,
          Args: [t]
        });
      }, e.prototype.addFocus = function (e) {
        var t = Mn(Ki(e));
        t && this._queue.enqueue({
          Kind: R.FOCUS,
          Args: [t]
        });
      }, e.prototype.addBlur = function (e) {
        var t = Mn(Ki(e));
        t && this._queue.enqueue({
          Kind: R.BLUR,
          Args: [t]
        });
      }, e.prototype.addChange = function (e) {
        this._inputWatcher.onChange(Ki(e));
      }, e.prototype.addChangeElem = function (e) {
        var t = Ln(e);
        if (t) {
          var n = Kn(e);
          Rn(e) && (n = er(n)), this._queue.enqueue({
            Kind: R.VALUECHANGE,
            Args: [t, n]
          });
        }
      }, e.prototype.addSelection = function () {
        var e = this;
        this._ctx.measurer.requestMeasureTask(function () {
          var t;
          try {
            t = e.selectionArgs();
          } catch (e) {
            return;
          }
          for (var n = !1, r = 0; r < 4; r++) if (e._curSelection[r] !== t[r]) {
            n = !0;
            break;
          }
          n && (e._curSelection = t, e._queue.enqueue({
            Kind: R.SELECT,
            Args: t
          }));
        });
      }, e.prototype.selectionArgs = function () {
        if (!this._wnd.getSelection) return [];
        var e = this._wnd.getSelection();
        if (!e) return [];
        if ("None" == e.type) return [];
        if ("Caret" == e.type) {
          var t = Mn(e.anchorNode);
          return t ? [t, e.anchorOffset] : [];
        }
        if (!e.anchorNode || !e.focusNode) return [];
        var n = Bi(e.anchorNode, e.anchorOffset),
          r = n[0],
          i = n[1],
          o = Bi(e.focusNode, e.focusOffset),
          s = o[0],
          a = o[1],
          u = Boolean(r.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_FOLLOWING),
          c = u ? [r, s] : [s, r],
          h = c[0],
          d = c[1],
          l = u ? [i, a] : [a, i],
          p = l[0],
          f = l[1];
        for (Mn(h) || (p = 0); h && !Mn(h) && h != d;) h = ut(h) || h.parentNode;
        for (Mn(d) || (f = 0); d && !Mn(d) && d != h;) d = vt(d) || d.parentNode;
        if (h == d && p == f) return [];
        var v = Mn(h),
          _ = Mn(d);
        return h && d && v && _ ? [v, p, _, f, u] : [];
      }, e;
    }();
  function Bi(e, t) {
    if (!e.firstChild) return [e, t];
    e = e.firstChild;
    for (var n = 0; n < t - 1; n++) {
      var r = ut(e);
      if (!r) return [e, 0];
      e = r;
    }
    return [e, 0];
  }
  var Hi = {
    src: {
      img: !0,
      embed: !0
    },
    href: {
      use: !0,
      image: !0
    },
    data: {
      object: !0
    }
  };
  function ji(e) {
    for (var t = e.activeElement; t && t.shadowRoot;) {
      var n = t.shadowRoot.activeElement;
      if (!n) return t;
      t = n;
    }
    return t;
  }
  function Ki(e) {
    if (e.composed && e.target) {
      var t = e.target;
      if (t.nodeType == pn && t.shadowRoot) {
        var n = e.composedPath();
        if (n.length > 0) return n[0];
      }
    }
    return e.target;
  }
  var Vi = /^\s*at .*(\S+\:\d+|native|(<anonymous>))/m,
    zi = /^(eval@)?(\[native code\])?$/;
  function Yi(e) {
    if (!e || "string" != typeof e.stack) return [];
    var t = e;
    return t.stack.match(Vi) ? t.stack.split("\n").filter(function (e) {
      return !!e.match(Vi);
    }).map(function (e) {
      e.indexOf("(eval ") > -1 && (e = e.replace(/eval code/g, "eval").replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, ""));
      var t = e.replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/\(native code\)/, "").split(/\s+/).slice(1),
        n = Qi(t.pop());
      return Gi(t.join(" "), ["eval", "<anonymous>"].indexOf(n[0]) > -1 ? "" : n[0], n[1], n[2]);
    }) : function (e) {
      return e.split("\n").filter(function (e) {
        return !e.match(zi);
      }).map(function (e) {
        if (e.indexOf(" > eval") > -1 && (e = e.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ":$1")), -1 === e.indexOf("@") && -1 === e.indexOf(":")) return [e, "", -1, -1];
        var t = e.split("@"),
          n = Qi(t.pop());
        return Gi(t.join("@"), n[0], n[1], n[2]);
      });
    }(t.stack);
  }
  function Gi(e, t, n, r) {
    return [e || "", t || "", parseInt(n || "-1"), parseInt(r || "-1")];
  }
  function Qi(e) {
    if (!e || -1 === e.indexOf(":")) return ["", "", ""];
    var t = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/.exec(e.replace(/[\(\)]/g, ""));
    return t ? [t[1] || "", t[2] || "", t[3] || ""] : ["", "", ""];
  }
  var Xi = function () {
      for (var e = 0, t = 0, n = arguments.length; t < n; t++) e += arguments[t].length;
      var r = Array(e),
        i = 0;
      for (t = 0; t < n; t++) for (var o = arguments[t], s = 0, a = o.length; s < a; s++, i++) r[i] = o[s];
      return r;
    },
    Ji = function () {
      function e(e, t, n) {
        this._queue = t, this._enabled = !1, this._overflow = !1, this._total = 0, this._hooks = [], this._wnd = e.window, this._listeners = n.createChild();
        var r = e.options.orgId;
        this.orgId = r, this.maxLogsPerPage = "P2C" == r || "ESHFX" == r || "6HFXR" == r || "A0W9W" == r || "5V0ND" == r ? 3e3 : "GF6RM" == r ? 1600 : te.MaxLogsPerPage;
      }
      return e.prototype._overflowMsg = function () {
        return "\"[received more than " + this.maxLogsPerPage + " messages]\"";
      }, e.prototype.enable = function () {
        var e = this;
        if (this._listeners.add(this._wnd, "error", !0, function (t) {
          return e.addError(t);
        }), this._listeners.add(this._wnd, "unhandledrejection", !0, function (t) {
          e.addLog("error", ["Uncaught (in promise)", t.reason]);
        }, !0), !this._enabled) if (this._enabled = !0, this._queue.enqueue({
          Kind: R.REC_FEAT_SUPPORTED,
          Args: [Y.Console, !0]
        }), this._wnd.console) for (var t = function (t) {
            var r = Tt(n._wnd.console, t);
            if (!r) return "continue";
            r.before(function (n) {
              var r = n.args;
              return e.addLog(t, r);
            }), n._hooks.push(r);
          }, n = this, r = 0, i = ["log", "info", "warn", "error"]; r < i.length; r++) {
          t(i[r]);
        } else this.addLog("log", ["NOTE: Log messages cannot be captured on IE9"]);
      }, e.prototype.isEnabled = function () {
        return this._enabled;
      }, e.prototype.disable = function () {
        var e;
        if (this._listeners && this._listeners.clear(), this._enabled) for (this._enabled = !1; e = this._hooks.pop();) e.disable();
      }, e.prototype.logEvent = function (e, t) {
        if (!this.checkOverflow()) return null;
        var n;
        n = -1 == ["log", "info", "warn", "error", "debug", "_fs_debug"].indexOf(e) ? ["log", $i(e, 1e3, this.orgId)] : [e];
        for (var r = 0; r < t.length; ++r) n.push($i(t[r], 1e3, this.orgId));
        return {
          Kind: R.LOG,
          Args: n
        };
      }, e.prototype.addLog = function (e, t) {
        var n = this.logEvent(e, t);
        n && this._queue.enqueue(n);
      }, e.prototype.addError = function (e) {
        var t = e.message,
          n = e.filename,
          r = e.lineno;
        (t || n || r) && this.checkOverflow() && ("object" == typeof t && (t = $i(t, 1e3, this.orgId)), "object" == typeof n && (n = $i(n, 100, this.orgId, !1)), "object" == typeof r && (r = -1), this._queue.enqueue({
          Kind: R.ERROR,
          Args: Xi([t, n, r], Yi(e.error))
        }));
      }, e.prototype.checkOverflow = function () {
        return !this._overflow && (this._total == this.maxLogsPerPage ? (this._queue.enqueue({
          Kind: R.LOG,
          Args: ["warn", this._overflowMsg()]
        }), this._overflow = !0, !1) : (this._total++, !0));
      }, e;
    }();
  function $i(e, t, n, r) {
    void 0 === r && (r = !0);
    try {
      var i = {
        tokens: [],
        opath: [],
        cyclic: Zi(e, t / 4)
      };
      !function e(t, n, r, i) {
        if (n < 1) return 0;
        var o = t && t.constructor == Date ? eo(t) : function (e) {
          return "object" == typeof Node ? e instanceof Node : e && "object" == typeof e && e.nodeType > 0 && "string" == typeof e.nodeName;
        }(t) ? function (e) {
          return e.toString();
        }(t) : void 0 === t ? "undefined" : "object" != typeof t || null == t ? t : t instanceof Error ? t.stack || t.name + ": " + t.message : void 0;
        if (void 0 !== o) return void 0 === (o = s.jsonStringify(o)) ? 0 : ("\"" == o[0] && (o = to(o, n, "...\"")), o.length <= n ? (i.tokens.push(o), o.length) : 0);
        if (i.cyclic) {
          i.opath.splice(r);
          var a = i.opath.lastIndexOf(t);
          if (a > -1) {
            var u = "<Cycle to ancestor #" + (r - a - 1) + ">";
            return u = "\"" + to(u, n - 2) + "\"", i.tokens.push(u), u.length;
          }
          i.opath.push(t);
        }
        var c = n,
          h = function (e) {
            return c >= e.length && (c -= e.length, i.tokens.push(e), !0);
          },
          d = function (e) {
            "," == i.tokens[i.tokens.length - 1] ? i.tokens[i.tokens.length - 1] = e : h(e);
          };
        if (c < 2) return 0;
        if (nt(t)) {
          h("[");
          for (var l = 0; l < t.length && c > 0; l++) {
            var p = e(t[l], c - 1, r + 1, i);
            if (c -= p, 0 == p && !h("null")) break;
            h(",");
          }
          d("]");
        } else {
          h("{");
          var f = Ze(t);
          for (l = 0; l < f.length && c > 0; l++) {
            var v = f[l],
              _ = t[v];
            if (!h("\"" + v + "\":")) break;
            if (0 == (p = e(_, c - 1, r + 1, i))) {
              i.tokens.pop();
              break;
            }
            c -= p, h(",");
          }
          d("}");
        }
        return n == 1 / 0 ? 1 : n - c;
      }(e, t, 0, i);
      var o = i.tokens.join("");
      return r ? function (e, t) {
        var n = t.replace(vr, "<email>");
        return n = n.replace(_r, function (t) {
          return ur(t, e, {
            source: "log",
            type: "debug"
          });
        });
      }(n, o) : o;
    } catch (e) {
      return mt(e);
    }
  }
  function Zi(e, t) {
    var n = 0;
    try {
      s.jsonStringify(e, function (e, r) {
        if (n++ > t) throw "break";
        if ("object" == typeof r) return r;
      });
    } catch (e) {
      return "break" != e;
    }
    return !1;
  }
  var eo = function (e) {
      return isNaN(e) ? "Invalid Date" : e.toUTCString();
    },
    to = function (e, t, n) {
      return void 0 === n && (n = "..."), e.length <= t ? e : e.length <= n.length || t <= n.length ? e.substring(0, t) : e.substring(0, t - n.length) + n;
    };
  var no = function () {
      for (var e = 0, t = 0, n = arguments.length; t < n; t++) e += arguments[t].length;
      var r = Array(e),
        i = 0;
      for (t = 0; t < n; t++) for (var o = arguments[t], s = 0, a = o.length; s < a; s++, i++) r[i] = o[s];
      return r;
    },
    ro = function () {
      function e(e, t) {
        this._q = e, this._valueIndices = t, this._evts = [], this._curveEndMs = 0;
      }
      return e.prototype.add = function (e) {
        0 == this._evts.length ? (this._q.push(e), this._curveEndMs = e.When) : e.When > this._curveEndMs && (this._curveEndMs = e.When), this._evts.push(e);
      }, e.prototype.finish = function (e, t) {
        void 0 === t && (t = []);
        var n = this._evts.length;
        if (n <= 1) return !1;
        for (var r = no([this._curveEndMs], t), i = this._evts[0].When, o = this._evts[n - 1].When, s = 0; s < this._valueIndices.length; ++s) {
          var a = this._valueIndices[s],
            u = this._evts[0].Args[a],
            c = (this._evts[1].When - i) / (o - i),
            h = (this._evts[1].Args[a] - u) / c,
            d = this._evts[n - 2].Args[a],
            l = (o - this._evts[n - 2].When) / (o - i),
            p = this._evts[n - 1].Args[a],
            f = (p - d) / l;
          r.push(u, p, h, f);
        }
        return this._evts[0].Kind = e, this._evts[0].Args = r, !0;
      }, e.prototype.evts = function () {
        return this._evts;
      }, e;
    }();
  var io = function () {
    function e(e, t, n, r) {
      void 0 === n && (n = function () {
        return [];
      }), void 0 === r && (r = en), this._ctx = e, this._transport = t, this._gatherExternalEvents = n, this._tickerFactory = r, this._recordingDisabled = !1, this._activeSimultaneousEventsTransactions = 0, this._lastWhen = -1, this._gotUnload = !1, this._eventQueue = [], this._sampleCurvesTicker = new this._tickerFactory(te.CurveSamplingInterval), this._processMutationsTicker = new this._tickerFactory(te.MutationProcessingInterval);
    }
    return e.prototype.startPipeline = function (e) {
      var t,
        n,
        r = this;
      this._recordingDisabled || this._pipelineStarted || (this._pipelineStarted = !0, this._frameId = null !== (t = e.frameId) && void 0 !== t ? t : 0, this._parentIds = null !== (n = e.parentIds) && void 0 !== n ? n : [], this.processEvents(), this._processMutationsTicker.start(function () {
        r.processEvents();
      }), this._sampleCurvesTicker.start(function () {
        r.processEvents(!0);
      }), this._transport.startPipeline(e));
    }, e.prototype.enqueueSimultaneousEventsIn = function (e) {
      0 === this._activeSimultaneousEventsTransactions && (this._lastWhen = this._ctx.time.now());
      try {
        return this._activeSimultaneousEventsTransactions++, e(this._lastWhen);
      } finally {
        this._activeSimultaneousEventsTransactions--, this._activeSimultaneousEventsTransactions < 0 && (this._activeSimultaneousEventsTransactions = 0);
      }
    }, e.prototype.enqueue = function (e) {
      var t = this._activeSimultaneousEventsTransactions > 0 ? this._lastWhen : this._ctx.time.now();
      this.enqueueAt(t, e), Zt.checkForBrokenSchedulers();
    }, e.prototype.enqueueAt = function (e, t) {
      if (!this._recordingDisabled) {
        e < this._lastWhen && (e = this._lastWhen), this._lastWhen = e;
        var n = t;
        n.When = e, this._eventQueue.push(n);
      }
    }, e.prototype.enqueueFirst = function (e) {
      if (this._eventQueue.length > 0) {
        var t = e;
        t.When = this._eventQueue[0].When, this._eventQueue.unshift(t);
      } else this.enqueue(e);
    }, e.prototype.addUnload = function (e) {
      this._gotUnload || (this._gotUnload = !0, this.enqueue({
        Kind: R.UNLOAD,
        Args: [e]
      }), this.singSwanSong());
    }, e.prototype.shutdown = function (e) {
      this._flush(), this.addUnload(e), this._flush(), this._recordingDisabled = !0, this.stopPipeline();
    }, e.prototype._flush = function () {
      this.processEvents(), this._transport.flush();
    }, e.prototype.singSwanSong = function () {
      this._recordingDisabled || (this.processEvents(), this._transport.singSwanSong());
    }, e.prototype.rebaseIframe = function (e) {
      for (var t = 0, n = this._eventQueue.length; t < n; t++) {
        var r = this._eventQueue[t],
          i = r.When + this._ctx.time.startTime() - e;
        i < 0 && (i = 0), r.When = i;
      }
    }, e.prototype.processEvents = function (e) {
      if (this._pipelineStarted) {
        var t = this._eventQueue;
        this._eventQueue = [];
        var n = function (e) {
          if (0 == e.length) return e;
          for (var t, n = [], r = new ro(n, [0, 1]), i = {}, o = {}, s = {}, a = 0, u = e; a < u.length; a++) {
            var c = u[a];
            switch (c.Kind) {
              case R.MOUSEMOVE:
                r.add(c);
                break;
              case R.TOUCHMOVE:
                (l = c.Args[0]) in i || (i[l] = new ro(n, [1, 2])), i[l].add(c);
                break;
              case R.SCROLL_LAYOUT:
                (l = c.Args[0]) in o || (o[l] = new ro(n, [1, 2])), o[l].add(c);
                break;
              case R.SCROLL_VISUAL_OFFSET:
                (l = c.Args[0]) in s || (s[l] = new ro(n, [1, 2])), s[l].add(c);
                break;
              case R.RESIZE_VISUAL:
                t || (t = new ro(n, [0, 1])), t.add(c);
                break;
              default:
                n.push(c);
            }
          }
          if (r.finish(R.MOUSEMOVE_CURVE)) {
            var h = r.evts();
            if (h.length > 0) {
              var d = h[h.length - 1].Args[2];
              if (d) h[0].Args[9] = d;
            }
          }
          for (var l in o) {
            o[p = parseInt(l)].finish(R.SCROLL_LAYOUT_CURVE, [p]);
          }
          for (var l in s) {
            s[p = parseInt(l)].finish(R.SCROLL_VISUAL_OFFSET_CURVE, [p]);
          }
          for (var l in i) {
            var p;
            i[p = parseInt(l)].finish(R.TOUCHMOVE_CURVE, [p]);
          }
          return t && t.finish(R.RESIZE_VISUAL_CURVE), n;
        }(t);
        e || (n = n.concat(this._gatherExternalEvents(0 != n.length))), this.ensureFrameIds(n), 0 != n.length && this._transport.enqueueEvents(this._ctx.recording.pageSignature(), n);
      }
    }, e.prototype.ensureFrameIds = function (e) {
      if (this._frameId) for (var t = this._parentIds, n = t && t.length > 0, r = 0; r < e.length; ++r) {
        var i = e[r];
        i.FId || (i.FId = this._frameId), n && !i.PIds && (i.PIds = t);
      }
    }, e.prototype.stopPipeline = function () {
      this._pipelineStarted && (this._sampleCurvesTicker.stop(), this._processMutationsTicker.stop(), this._eventQueue = [], this._transport.stopPipeline());
    }, e;
  }();
  function oo() {
    var e, t;
    return {
      promise: new et(function (n, r) {
        e = n, t = r;
      }),
      resolve: e,
      reject: t
    };
  }
  function so(e) {
    return new et(function (t) {
      s.setWindowTimeout(window, ie(t), e);
    });
  }
  var ao = function () {
    function e(e) {
      void 0 === e && (e = 4), this.hashCount = e, this.idx = 0, this.hashMask = e - 1, this.reset();
    }
    return e.prototype.reset = function () {
      this.idx = 0, this.hash = [];
      for (var e = 0; e < this.hashCount; ++e) this.hash.push(2166136261);
    }, e.prototype.write = function (e) {
      for (var t = this.hashMask, n = this.idx, r = 0; r < e.length; r++) this.hash[n] = this.hash[n] ^ e[r], this.hash[n] += (this.hash[n] << 1) + (this.hash[n] << 4) + (this.hash[n] << 7) + (this.hash[n] << 8) + (this.hash[n] << 24), n = n + 1 & t;
      this.idx = n;
    }, e.prototype.writeAscii = function (e) {
      for (var t = this.hashMask, n = this.idx, r = 0; r < e.length; r++) this.hash[n] = this.hash[n] ^ e.charCodeAt(r), this.hash[n] += (this.hash[n] << 1) + (this.hash[n] << 4) + (this.hash[n] << 7) + (this.hash[n] << 8) + (this.hash[n] << 24), n = n + 1 & t;
      this.idx = n;
    }, e.prototype.sum = function () {
      var e,
        t = this.sumAsHex();
      return e = t.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ").map(Number), lo(String.fromCharCode.apply(window, e));
    }, e.prototype.sumAsHex = function () {
      for (var e = "", t = 0; t < this.hashCount; ++t) e += ("00000000" + (this.hash[t] >>> 0).toString(16)).slice(-8);
      return e;
    }, e;
  }();
  function uo(e) {
    var t = new ao(1);
    return t.writeAscii(e), t.sumAsHex();
  }
  function co(e) {
    var t = new Uint8Array(e);
    return lo(String.fromCharCode.apply(null, t));
  }
  var ho = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  function lo(e) {
    var t;
    return (null !== (t = window.btoa) && void 0 !== t ? t : po)(e).replace(/\+/g, "-").replace(/\//g, "_");
  }
  function po(e) {
    for (var t = String(e), n = [], r = 0, i = 0, o = 0, s = ho; t.charAt(0 | o) || (s = "=", o % 1); n.push(s.charAt(63 & r >> 8 - o % 1 * 8))) {
      if ((i = t.charCodeAt(o += .75)) > 255) throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      r = r << 8 | i;
    }
    return n.join("");
  }
  var fo = function (e, t, n, r) {
      return new (n || (n = Promise))(function (i, o) {
        function s(e) {
          try {
            u(r.next(e));
          } catch (e) {
            o(e);
          }
        }
        function a(e) {
          try {
            u(r["throw"](e));
          } catch (e) {
            o(e);
          }
        }
        function u(e) {
          var t;
          e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function (e) {
            e(t);
          })).then(s, a);
        }
        u((r = r.apply(e, t || [])).next());
      });
    },
    vo = function (e, t) {
      var n,
        r,
        i,
        o,
        s = {
          label: 0,
          sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          },
          trys: [],
          ops: []
        };
      return o = {
        next: a(0),
        "throw": a(1),
        "return": a(2)
      }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
        return this;
      }), o;
      function a(o) {
        return function (a) {
          return function (o) {
            if (n) throw new TypeError("Generator is already executing.");
            for (; s;) try {
              if (n = 1, r && (i = 2 & o[0] ? r["return"] : o[0] ? r["throw"] || ((i = r["return"]) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
              switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                case 0:
                case 1:
                  i = o;
                  break;
                case 4:
                  return s.label++, {
                    value: o[1],
                    done: !1
                  };
                case 5:
                  s.label++, r = o[1], o = [0];
                  continue;
                case 7:
                  o = s.ops.pop(), s.trys.pop();
                  continue;
                default:
                  if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                    s = 0;
                    continue;
                  }
                  if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                    s.label = o[1];
                    break;
                  }
                  if (6 === o[0] && s.label < i[1]) {
                    s.label = i[1], i = o;
                    break;
                  }
                  if (i && s.label < i[2]) {
                    s.label = i[2], s.ops.push(o);
                    break;
                  }
                  i[2] && s.ops.pop(), s.trys.pop();
                  continue;
              }
              o = t.call(e, s);
            } catch (e) {
              o = [6, e], r = 0;
            } finally {
              n = i = 0;
            }
            if (5 & o[0]) throw o[1];
            return {
              value: o[0] ? o[1] : void 0,
              done: !0
            };
          }([o, a]);
        };
      }
    },
    _o = 1e4,
    go = 25,
    mo = 100;
  function yo(e, t, n, r) {
    return void 0 === r && (r = new ao()), fo(this, void 0, et, function () {
      var i, o, s, a;
      return vo(this, function (u) {
        switch (u.label) {
          case 0:
            i = e.now(), o = n.byteLength, s = 0, u.label = 1;
          case 1:
            return s < o ? e.now() - i > go ? [4, t(mo)] : [3, 3] : [3, 5];
          case 2:
            u.sent(), i = e.now(), u.label = 3;
          case 3:
            a = new Uint8Array(n, s, Math.min(o - s, _o)), r.write(a), u.label = 4;
          case 4:
            return s += _o, [3, 1];
          case 5:
            return [2, {
              hash: r.sum(),
              hasher: r
            }];
        }
      });
    });
  }
  var wo = function (e, t, n, r) {
      return new (n || (n = Promise))(function (i, o) {
        function s(e) {
          try {
            u(r.next(e));
          } catch (e) {
            o(e);
          }
        }
        function a(e) {
          try {
            u(r["throw"](e));
          } catch (e) {
            o(e);
          }
        }
        function u(e) {
          var t;
          e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function (e) {
            e(t);
          })).then(s, a);
        }
        u((r = r.apply(e, t || [])).next());
      });
    },
    bo = function (e, t) {
      var n,
        r,
        i,
        o,
        s = {
          label: 0,
          sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          },
          trys: [],
          ops: []
        };
      return o = {
        next: a(0),
        "throw": a(1),
        "return": a(2)
      }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
        return this;
      }), o;
      function a(o) {
        return function (a) {
          return function (o) {
            if (n) throw new TypeError("Generator is already executing.");
            for (; s;) try {
              if (n = 1, r && (i = 2 & o[0] ? r["return"] : o[0] ? r["throw"] || ((i = r["return"]) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
              switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                case 0:
                case 1:
                  i = o;
                  break;
                case 4:
                  return s.label++, {
                    value: o[1],
                    done: !1
                  };
                case 5:
                  s.label++, r = o[1], o = [0];
                  continue;
                case 7:
                  o = s.ops.pop(), s.trys.pop();
                  continue;
                default:
                  if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                    s = 0;
                    continue;
                  }
                  if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                    s.label = o[1];
                    break;
                  }
                  if (6 === o[0] && s.label < i[1]) {
                    s.label = i[1], i = o;
                    break;
                  }
                  if (i && s.label < i[2]) {
                    s.label = i[2], s.ops.push(o);
                    break;
                  }
                  i[2] && s.ops.pop(), s.trys.pop();
                  continue;
              }
              o = t.call(e, s);
            } catch (e) {
              o = [6, e], r = 0;
            } finally {
              n = i = 0;
            }
            if (5 & o[0]) throw o[1];
            return {
              value: o[0] ? o[1] : void 0,
              done: !0
            };
          }([o, a]);
        };
      }
    },
    So = 6e6,
    Eo = function () {
      function e(e, t, n, r, i) {
        void 0 === r && (r = window.FormData), void 0 === i && (i = tn), this.ctx = e, this.queue = t, this.protocol = n, this.FormDataCtr = r, this.Timeout = i, this.started = {}, this.byUrl = {}, this.batchReady = !1, this.existsBatch = [], this._sentToBugsnag = !1;
      }
      return e.prototype.init = function () {
        this.FormDataCtr && this.main()["catch"](function (e) {
          Mt.sendToBugsnag(e, "error");
        });
      }, e.prototype.main = function () {
        return wo(this, void 0, et, function () {
          var e, t, n, r, i, s, a, u, c, h, d, l, p, f, v, _, g, m, y, w, b, S, E, T, k, I;
          return bo(this, function (C) {
            switch (C.label) {
              case 0:
                e = this.ctx.options.orgId, C.label = 1;
              case 1:
                return [4, this.getBatch()];
              case 2:
                for (t = C.sent(), n = {
                  fsnv: [],
                  sha1: []
                }, r = 0, i = t; r < i.length; r++) s = i[r], a = s.hash, v = s.hashAlgorithm, n[v].push(a);
                for (u = {}, c = 0, h = t; c < h.length; c++) d = h[c], u[d.hash] = d;
                l = void 0, C.label = 3;
              case 3:
                return C.trys.push([3, 5,, 6]), [4, this.protocol.queryResources({
                  OrgId: e,
                  HashesByAlgorithm: n
                })];
              case 4:
                return l = C.sent(), [3, 6];
              case 5:
                return o("/rec/queryResources failed with status " + C.sent()), [3, 1];
              case 6:
                for (p = 0, f = l; p < f.length; p++) if ((m = f[p]).Found && m.CanonicalHash) {
                  if (!(y = u[m.QueryHash])) {
                    this.sendOnceToBugsnag("No resource found for hash");
                    continue;
                  }
                  if (y.blob = y.stringData = null, "fsnv" !== (v = m.CanonicalHash.Algorithm)) {
                    this.sendOnceToBugsnag("Unrecognized canonical hash type", {
                      hashAlgorithm: v
                    });
                    continue;
                  }
                  this.queue.enqueue({
                    Kind: R.SYS_RESOURCEHASH,
                    Args: ["url", y.url, m.CanonicalHash.Hash]
                  });
                } else ;
                _ = 0, g = l, C.label = 7;
              case 7:
                if (!(_ < g.length)) return [3, 12];
                if ((m = g[_]).Found && m.CanonicalHash) return [3, 11];
                if (null == (y = u[m.QueryHash])) return this.sendOnceToBugsnag("Server told us to upload a hash we don't have"), [3, 11];
                if (w = y.url, b = y.contentType, !(S = y.blob || y.stringData)) return this.sendOnceToBugsnag("Missing resource contents"), [3, 11];
                if (E = y.blob || new Blob([S], {
                  type: b
                }), null == S) return this.sendOnceToBugsnag("Tried to re-upload a resource"), [3, 11];
                if ((T = new this.FormDataCtr()).append("orgId", e), T.append("baseUrl", w), "fsnv" === m.QueryAlgorithm) T.append("fsnvHash", m.QueryHash);else {
                  if ("sha1" !== m.QueryAlgorithm) return this.sendOnceToBugsnag("Unrecognized hash type from resource query", {
                    hashAlgorithm: m.QueryAlgorithm
                  }), [3, 11];
                  T.append("sha1Hash", m.QueryHash);
                }
                T.append("contents", E, "blob"), y.blob = y.stringData = null, C.label = 8;
              case 8:
                return C.trys.push([8, 10,, 11]), [4, this.protocol.uploadResource(T)];
              case 9:
                return k = C.sent(), "fsnv" != (I = JSON.parse(k)).Algorithm && this.sendOnceToBugsnag("Unexpected hash type from resource upload", {
                  hashAlgorithm: I.Algorithm
                }), this.queue.enqueue({
                  Kind: R.SYS_RESOURCEHASH,
                  Args: ["url", w, I.Hash]
                }), [3, 11];
              case 10:
                return C.sent(), o("Server error uploading resource"), [3, 11];
              case 11:
                return _++, [3, 7];
              case 12:
                return [3, 1];
              case 13:
                return [2];
            }
          });
        });
      }, e.prototype.getBatch = function () {
        var e = this,
          t = oo(),
          n = t.resolve,
          r = t.promise,
          i = function () {
            e.popBatch = null, e.batchReady = !1;
            var t = e.existsBatch;
            e.existsBatch = [], n(t);
          };
        return this.batchReady ? i() : this.popBatch = i, r;
      }, e.prototype.uploadIfNeeded = function (e, t) {
        return wo(this, void 0, et, function () {
          var n,
            r,
            i = this;
          return bo(this, function (o) {
            switch (o.label) {
              case 0:
                return this.FormDataCtr ? this.started[t] ? [2] : function (e, t) {
                  var n = Xn(Jn(e), t);
                  switch (n.protocol) {
                    case "blob:":
                      return !0;
                    case "http:":
                    case "https:":
                      switch (n.hostname) {
                        case "localhost":
                        case "127.0.0.1":
                        case "[::1]":
                          return e.location.protocol === n.protocol && e.location.host === n.host;
                        case "::1":
                          var r = n.port ? "[::1]:" + n.port : "[::1]";
                          return e.location.protocol === n.protocol && e.location.host === r;
                        default:
                          return !1;
                      }
                    default:
                      return !1;
                  }
                }(e, t) ? (this.started[t] = !0, [4, this.processResource(t)]) : [2] : [2];
              case 1:
                return (n = o.sent()) ? (r = 0 == this.existsBatch.length, this.existsBatch.push(n), r && new this.Timeout(function () {
                  i.batchReady = !0, i.popBatch && i.popBatch();
                }, 50).start(), [2]) : [2];
            }
          });
        });
      }, e.prototype.processResource = function (e) {
        return wo(this, void 0, et, function () {
          var t, n, r, i, o;
          return bo(this, function (s) {
            switch (s.label) {
              case 0:
                return this.byUrl[e] ? [2, this.byUrl[e]] : [4, To(e, this.ctx.options.orgId)];
              case 1:
                return (t = s.sent()) ? [4, ko(this.ctx, t.buffer)] : [2, null];
              case 2:
                return n = s.sent(), r = n.hash, i = n.algorithm, o = {
                  hash: r,
                  hashAlgorithm: i,
                  url: e,
                  blob: t.blob,
                  contentType: t.contentType
                }, this.byUrl[o.url] = o, [2, o];
            }
          });
        });
      }, e.prototype.sendOnceToBugsnag = function (e, t) {
        this._sentToBugsnag || (this._sentToBugsnag = !0, o(e), Mt.sendToBugsnag(e, "error", t));
      }, e;
    }();
  function To(e, t) {
    var n = oo(),
      r = n.resolve,
      i = n.promise,
      s = new XMLHttpRequest();
    return "string" != typeof s.responseType ? (r(null), i) : (s.open("GET", e), s.responseType = "blob", s.onerror = function () {
      r(null);
    }, s.onload = function () {
      if (200 != s.status) return o("Error loading blob resource " + ur(e, t, {
        source: "log",
        type: "debug"
      })), void r(null);
      var n = s.response;
      if ((n.size || n.length) > So) {
        var i = ur(e, t, {
          source: "log",
          type: "bugsnag"
        });
        return Mt.sendToBugsnag("Size of blob resource exceeds limit", "warning", {
          url: i,
          MaxResourceSizeBytes: So
        }), void r(null);
      }
      (function (e) {
        var t = oo(),
          n = t.resolve,
          r = t.promise,
          i = new FileReader();
        return i.readAsArrayBuffer(e), i.onload = function () {
          n(i.result);
        }, i.onerror = function (e) {
          Mt.sendToBugsnag(e, "error"), n(null);
        }, r;
      })(n).then(function (e) {
        r(e ? {
          buffer: e,
          blob: n,
          contentType: n.type
        } : null);
      });
    }, s.send(), i);
  }
  function ko(e, t) {
    var n, r;
    return wo(this, void 0, et, function () {
      var i;
      return bo(this, function (o) {
        switch (o.label) {
          case 0:
            return i = e.window, (null === (r = null === (n = i.crypto) || void 0 === n ? void 0 : n.subtle) || void 0 === r ? void 0 : r.digest) ? [4, i.crypto.subtle.digest({
              name: "sha-1"
            }, t)] : [3, 2];
          case 1:
            return [2, {
              hash: co(o.sent()),
              algorithm: "sha1"
            }];
          case 2:
            return [4, yo(e.time, so, t)];
          case 3:
            return [2, {
              hash: o.sent().hash,
              algorithm: "fsnv"
            }];
        }
      });
    });
  }
  var Io = function (e, t, n, r) {
      return new (n || (n = Promise))(function (i, o) {
        function s(e) {
          try {
            u(r.next(e));
          } catch (e) {
            o(e);
          }
        }
        function a(e) {
          try {
            u(r["throw"](e));
          } catch (e) {
            o(e);
          }
        }
        function u(e) {
          var t;
          e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function (e) {
            e(t);
          })).then(s, a);
        }
        u((r = r.apply(e, t || [])).next());
      });
    },
    Co = function (e, t) {
      var n,
        r,
        i,
        o,
        s = {
          label: 0,
          sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          },
          trys: [],
          ops: []
        };
      return o = {
        next: a(0),
        "throw": a(1),
        "return": a(2)
      }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
        return this;
      }), o;
      function a(o) {
        return function (a) {
          return function (o) {
            if (n) throw new TypeError("Generator is already executing.");
            for (; s;) try {
              if (n = 1, r && (i = 2 & o[0] ? r["return"] : o[0] ? r["throw"] || ((i = r["return"]) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
              switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                case 0:
                case 1:
                  i = o;
                  break;
                case 4:
                  return s.label++, {
                    value: o[1],
                    done: !1
                  };
                case 5:
                  s.label++, r = o[1], o = [0];
                  continue;
                case 7:
                  o = s.ops.pop(), s.trys.pop();
                  continue;
                default:
                  if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                    s = 0;
                    continue;
                  }
                  if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                    s.label = o[1];
                    break;
                  }
                  if (6 === o[0] && s.label < i[1]) {
                    s.label = i[1], i = o;
                    break;
                  }
                  if (i && s.label < i[2]) {
                    s.label = i[2], s.ops.push(o);
                    break;
                  }
                  i[2] && s.ops.pop(), s.trys.pop();
                  continue;
              }
              o = t.call(e, s);
            } catch (e) {
              o = [6, e], r = 0;
            } finally {
              n = i = 0;
            }
            if (5 & o[0]) throw o[1];
            return {
              value: o[0] ? o[1] : void 0,
              done: !0
            };
          }([o, a]);
        };
      }
    },
    Ro = function () {
      function e(e) {
        this._byteCount = 0, this._scheme = e.options.scheme, this._recHost = e.options.recHost;
      }
      return e.prototype.page = function (e, t, n) {
        this.post("/rec/page", gt(e), function (e) {
          try {
            t(wt(e));
          } catch (e) {
            n(0);
          }
        }, function (e, t) {
          if (t) try {
            return n(0, wt(t));
          } catch (e) {}
          n(0);
        });
      }, e.prototype.bundle = function (e) {
        var t = gt(e.bundle);
        this._byteCount += t.length, o("total bytes written: " + this._byteCount);
        var n = xo(e.bundle.Seq, e);
        return this.post(n, t, function (t) {
          try {
            e.win(wt(t));
          } catch (n) {
            Mt.sendToBugsnag("Failed to JSON parse /rec/bundle response", "error", {
              rsp: t,
              error: n.toString()
            }), e.lose(0);
          }
        }, e.lose), this._byteCount;
      }, e.prototype.bundleBeacon = function (e) {
        return Mo(this._scheme, this._recHost, e);
      }, e.prototype.exponentialBackoffMs = function (e, t) {
        var n = s.mathMin(te.BackoffMax, 5e3 * s.mathPow(2, e));
        return t ? n + .25 * s.mathRandom() * n : n;
      }, e.prototype.post = function (e, t, n, r) {
        Oo(this._scheme, this._recHost, e, t, n, r);
      }, e;
    }(),
    Ao = function () {
      function e(e) {
        this._scheme = e.options.scheme, this._recHost = e.options.recHost;
      }
      return e.prototype.uploadResource = function (e) {
        var t = this;
        return new et(function (n, r) {
          Oo(t._scheme, t._recHost, "/rec/uploadResource", e, n, r);
        });
      }, e.prototype.queryResources = function (e) {
        return Io(this, void 0, et, function () {
          var t,
            n,
            r = this;
          return Co(this, function (i) {
            switch (i.label) {
              case 0:
                return t = JSON.stringify(e), [4, new et(function (e, n) {
                  Oo(r._scheme, r._recHost, "/rec/queryResources", t, e, n);
                })];
              case 1:
                return n = i.sent(), [2, JSON.parse(n)];
            }
          });
        });
      }, e;
    }();
  function xo(e, t) {
    var n = "/rec/bundle?OrgId=" + t.orgId + "&UserId=" + t.userId + "&SessionId=" + t.sessionId + "&PageId=" + t.pageId + "&Seq=" + e;
    return null != t.serverPageStart && (n += "&PageStart=" + t.serverPageStart), null != t.serverBundleTime && (n += "&PrevBundleTime=" + t.serverBundleTime), null != t.lastUserActivity && (n += "&LastActivity=" + t.lastUserActivity), t.isNewSession && (n += "&IsNewSession=true"), null != t.deltaT && (n += "&DeltaT=" + t.deltaT), n;
  }
  function Oo(e, t, n, r, i, o) {
    var s = "//" + t + n,
      a = !1,
      u = new XMLHttpRequest();
    if ("withCredentials" in u) u.onreadystatechange = function () {
      if (u.readyState == fn) {
        if (a) return;
        a = !0;
        try {
          200 == u.status ? i(u.responseText) : o && o(u.status, u.responseText);
        } catch (e) {
          Mt.sendToBugsnag(e, "error");
        }
      }
    }, u.open("POST", e + s, !0), u.withCredentials = !0, "function" != typeof r.append && u.setRequestHeader("Content-Type", "text/plain"), u.send(r);else {
      var c = new XDomainRequest();
      c.onload = function () {
        i(c.responseText);
      }, c.onerror = function () {
        o && o("Not Found" == c.responseText ? 404 : 500, c.responseText);
      }, c.onprogress = function () {}, c.open("POST", s), c.send(r);
    }
  }
  function Mo(e, t, n) {
    if ("function" == typeof navigator.sendBeacon) {
      var r = e + "//" + t + xo(n.bundle.Seq, n) + "&SkipResponseBody=true",
        i = gt(n.bundle);
      try {
        return navigator.sendBeacon(r, i);
      } catch (e) {
        Mt.sendToBugsnag(e, "error", {
          url: r,
          data: i
        });
      }
    }
    return !1;
  }
  var Lo = function () {
      function e(e, t, n) {
        void 0 === n && (n = new Fo()), this._ctx = e, this._q = t, this._matcher = n;
      }
      return e.prototype.initialize = function (e) {
        var t;
        if (e) {
          this._setUrlKeeps(e);
          var n = null === (t = this._ctx.window.location) || void 0 === t ? void 0 : t.href;
          this.onNavigate(n);
        }
      }, e.prototype.onNavigate = function (e) {
        return !!this._matcher.matches(e) && (this._q.enqueue({
          Kind: R.KEEP_URL,
          Args: [this._scrubUrl(e)]
        }), !0);
      }, e.prototype.onClick = function (e) {
        return !(!e || !function (e) {
          var t = xn(e);
          return !!t && !0 === t.matchesAnyKeepRule;
        }(e.node)) && (this._q.enqueue({
          Kind: R.KEEP_ELEMENT,
          Args: [e.id]
        }), !0);
      }, e.prototype.urlMatches = function (e) {
        return this._matcher.matches(e);
      }, e.prototype._setUrlKeeps = function (e) {
        this._matcher.setRules(e);
      }, e.prototype._scrubUrl = function (e) {
        return ur(e, this._ctx.options.orgId, {
          source: "page",
          type: "base"
        });
      }, e;
    }(),
    Fo = function () {
      function e() {
        this._regexes = null;
      }
      return e.prototype.setRules = function (e) {
        var t = e.map(function (e) {
          return e.Regex;
        }).filter(this._isValidRegex);
        t.length > 0 && (this._regexes = this._joinRegexes(t));
      }, e.prototype.matches = function (e) {
        return !!this._regexes && this._regexes.test(e);
      }, e.prototype._isValidRegex = function (e) {
        try {
          return new RegExp(e), !0;
        } catch (t) {
          return Mt.sendToBugsnag("Browser rejected UrlKeep.Regex", "error", {
            expr: e,
            error: t.toString()
          }), !1;
        }
      }, e.prototype._joinRegexes = function (e) {
        try {
          return new RegExp("(" + e.join(")|(") + ")", "i");
        } catch (t) {
          return Mt.sendToBugsnag("Browser rejected joining UrlKeep.Regexs", "error", {
            exprs: e,
            error: t.toString()
          }), null;
        }
      }, e;
    }();
  function Po(e, t) {
    var n = Mn(e) + " ";
    return e.id && (n += "#" + e.id), n += "[src=" + ur(e.src, t, {
      source: "log",
      type: "debug"
    }) + "]";
  }
  var qo,
    Uo = function (e) {
      var t = e.transport,
        n = e.frame,
        r = e.orgId,
        s = e.scheme,
        a = e.script,
        u = e.recHost,
        c = e.appHost,
        h = Po(n, r);
      o("Injecting into Frame " + h);
      try {
        if (function (e) {
          return e.id == e.name && No.test(e.id);
        }(n)) return void o("Blacklisted iframe: " + h);
        if (function (e) {
          if (!e.contentDocument || !e.contentWindow || !e.contentWindow.location) return !0;
          return function (e) {
            return !!e.src && "about:blank" != e.src && e.src.indexOf("javascript:") < 0;
          }(e) && e.src != e.contentWindow.location.href && "loading" == e.contentDocument.readyState;
        }(n)) return void o("Frame not yet loaded: " + h);
        var d = n.contentWindow,
          l = n.contentDocument;
        if (!d || !l) return void o("Missing contentWindow or contentDocument: " + h);
        if (!l.head) return void o("Missing contentDocument.head: " + h);
        if (I(d)) return void o("FS already defined in Frame contentWindow: " + h + ". Ignoring.");
        d._fs_org = r, d._fs_script = a, d._fs_rec_host = u, d._fs_app_host = c, d._fs_debug = i(), d._fs_run_in_iframe = !0, t && (d._fs_transport = t);
        var p = l.createElement("script");
        p.async = !0, p.crossOrigin = "anonymous", p.src = s + "//" + a, "testdrive" == r && (p.src += "?allowMoo=true"), l.head.appendChild(p);
      } catch (e) {
        o("iFrame no injecty. Probably not same origin.");
      }
    },
    No = /^fb\d{18}$/;
  !function (e) {
    e[e.NoInfoYet = 1] = "NoInfoYet", e[e.Enabled = 2] = "Enabled", e[e.Disabled = 3] = "Disabled";
  }(qo || (qo = {}));
  var Wo = function () {
    function e(e, t, n, r) {
      var i = this;
      this._ctx = e, this._transport = n, this._injector = r, this._bundleUploadInterval = te.DefaultBundleUploadInterval, this._iFrames = [], this._pendingChildFrameIdInits = [], this._listeners = new Ut(), this._getCurrentSessionEnabled = qo.NoInfoYet, this._resourceUploadingEnabled = !1, this._tickerTasks = [], this._pendingIframes = {}, this._watcher = new yn(), this._queue = new io(e, this._transport, function (e) {
        for (var t = i._eventWatcher.bundleEvents(e), n = void 0; n = i._tickerTasks.pop();) n();
        return t;
      }, t), this._keep = new Lo(e, this._queue), this._eventWatcher = new Di(e, this._queue, this._keep, this._watcher, this._listeners, function (e) {
        i.onFrameCreated(e);
      }, function (e) {
        i.beforeFrameRemoved(e);
      }, new Eo(e, this._queue, new Ao(e))), this._consoleWatcher = new Ji(e, this._queue, this._listeners), this._scheme = e.options.scheme, this._script = e.options.script, this._recHost = e.options.recHost, this._appHost = e.options.appHost, this._orgId = e.options.orgId, this._wnd = e.window;
    }
    return e.prototype.bundleUploadInterval = function () {
      return this._bundleUploadInterval;
    }, e.prototype.start = function (e, t) {
      var n = this;
      this._onFullyStarted = t, "onpagehide" in this._wnd ? this._listeners.add(this._wnd, "pagehide", !1, function (e) {
        n.onUnload();
      }) : this._listeners.add(this._wnd, "unload", !1, function (e) {
        n.onUnload();
      }), this._listeners.add(this._wnd, "message", !1, function (e) {
        if ("string" == typeof e.data) {
          var t = e.source;
          n.postMessageReceived(t, Bo(e.data));
        }
      });
      var r = this._wnd.Document ? this._wnd.Document.prototype : this._wnd.document;
      this._docCloseHook = Tt(r, "close"), this._docCloseHook && this._docCloseHook.afterAsync(function () {
        n._listeners.refresh();
      });
    }, e.prototype.queue = function () {
      return this._queue;
    }, e.prototype.eventWatcher = function () {
      return this._eventWatcher;
    }, e.prototype.console = function () {
      return this._consoleWatcher;
    }, e.prototype.onDomLoad = function () {
      this._eventWatcher.onDomLoad();
    }, e.prototype.onLoad = function () {
      this._eventWatcher.onLoad();
    }, e.prototype.shutdown = function (e) {
      this._eventWatcher.shutdown(e), this._consoleWatcher.disable(), this._listeners && this._listeners.clear(), this._docCloseHook && this._docCloseHook.disable(), this.tellAllFramesTo(["ShutdownFrame"]);
    }, e.prototype.tellAllFramesTo = function (e) {
      for (var t = 0; t < this._iFrames.length; t++) {
        var n = this._iFrames[t];
        n.contentWindow && Do(n.contentWindow, e);
      }
    }, e.prototype.getCurrentSessionURL = function (e) {
      var t = this._getCurrentSessionEnabled;
      if (t == qo.NoInfoYet) return null;
      if (t == qo.Disabled) return this._scheme + "//" + this._appHost + "/opt/upgrade";
      var n = this.getCurrentSession();
      return n ? (e && (n += ":" + this._ctx.time.wallTime()), this._scheme + "//" + this._appHost + "/ui/" + this._ctx.options.orgId + "/session/" + encodeURIComponent(n)) : null;
    }, e.prototype.getCurrentSession = function () {
      var e = this._getCurrentSessionEnabled;
      return e == qo.NoInfoYet || e == qo.Disabled ? null : this._userId ? this._userId + ":" + this._sessionId : null;
    }, e.prototype.setConsent = function (e) {
      var t = this,
        n = function () {
          t._watcher.setConsent(e), t._queue.processEvents();
        },
        r = function () {
          t._queue.enqueue({
            Kind: R.SYS_SETCONSENT,
            Args: [e, K.Document]
          });
        };
      switch (e) {
        case j.GrantConsent:
          r(), n();
          break;
        case j.RevokeConsent:
          n(), r();
      }
      this.tellAllFramesTo(["SetConsent", e]);
    }, e.prototype.pageSignature = function () {
      return this._userId + ":" + this._sessionId + ":" + this._pageId;
    }, e.prototype.fireFsReady = function (e) {
      void 0 === e && (e = !1);
      var t = this._wnd._fs_ready;
      if (t) try {
        e ? t(!0) : t();
      } catch (e) {
        o("exception in _fs_ready(): " + e);
      }
    }, e.prototype.onUnload = function () {
      this._queue.addUnload(V.Unload), Zt.stopAll();
    }, e.prototype.handleResponse = function (e) {
      var t = e.Flags,
        n = t.AjaxFetch,
        r = t.AjaxWatcher,
        i = t.ConsoleWatcher,
        o = t.GetCurrentSession,
        s = t.WatchStrategy,
        a = t.ResourceUploading,
        u = t.WhitelistElements;
      this._pageRsp = e, this._userId = e.UserIntId, this._sessionId = e.SessionIntId, this._pageId = e.PageIntId, this._serverPageStart = e.PageStart, this._getCurrentSessionEnabled = o ? qo.Enabled : qo.Disabled, "number" == typeof e.BundleUploadInterval && (this._bundleUploadInterval = e.BundleUploadInterval), a && this.enableResourceUploading(), r && this.enableAjaxWatcher(!!n), i && this.enableConsoleWatcher(), r && e.AjaxWatches && this._eventWatcher.ajaxWatcher().setWatches(e.AjaxWatches), this._watcher.initialize({
        blocks: e.ElementBlocks,
        keeps: e.ElementKeeps,
        watches: e.ElementWatches,
        flags: {
          whitelist: !!u,
          watchStrategy: null != s ? s : "matches"
        }
      }), this._keep.initialize(e.UrlKeeps), this._watcher.initializeConsent(!!e.Consented);
    }, e.prototype.fullyStarted = function () {
      this._onFullyStarted();
    }, e.prototype.enableResourceUploading = function () {
      this._resourceUploadingEnabled = !0, this._eventWatcher.initResourceUploading();
    }, e.prototype.enableAjaxWatcher = function (e) {
      this.eventWatcher().ajaxWatcher().enable(e);
    }, e.prototype.enableConsoleWatcher = function () {
      this.console().enable();
    }, e.prototype.flushPendingChildFrameInits = function () {
      if (this._pendingChildFrameIdInits.length > 0) {
        for (var e = 0; e < this._pendingChildFrameIdInits.length; e++) this._pendingChildFrameIdInits[e]();
        this._pendingChildFrameIdInits = [];
      }
    }, e.prototype.inject = function (e) {
      var t = this;
      this._ctx.measurer.requestMeasureTask(function () {
        i() && o("Injecting into a " + ("none" !== getComputedStyle(e, null).display ? "hidden" : "visible") + " iframe: " + Po(e, t._orgId));
        var n = {
          send: function (n, r, i) {
            et.resolve().then(Mt.wrap(function () {
              t.postMessageReceived(e.contentWindow, [n, s.jsonParse(r), i]);
            }));
          }
        };
        t._injector({
          frame: e,
          transport: n,
          orgId: t._orgId,
          scheme: t._scheme,
          script: t._script,
          recHost: t._recHost,
          appHost: t._appHost
        });
      });
    }, e.prototype.onFrameCreated = function (e) {
      var t = Mn(e);
      if (t) {
        this._iFrames.push(e);
        var n = !1;
        if (e.contentWindow) try {
          n = !!I(e.contentWindow);
        } catch (e) {
          n = !0;
        }
        var r = function (e) {
            var t = e.src,
              n = location.protocol + "//" + location.host;
            return !t || "about:blank" == t || ct(t, "javascript:") || ct(t, n);
          }(e),
          i = e.contentWindow && e.contentWindow.postMessage;
        r && !n || !i ? r ? this.initSameOriginIframe(e) : o("Frame Doesn't need injecting. Probably cross domain " + Po(e, this._orgId)) : this.initCrossOriginIframe(e, t);
      } else o("fsid missing or invalid for iFrame " + Po(e, this._orgId));
    }, e.prototype.initCrossOriginIframe = function (e, t) {
      var n = this;
      e.contentWindow && e.contentWindow.postMessage ? (o("Cross-origin iframe " + Po(e, this._orgId)), Do(e.contentWindow, ["GreetFrame"]), i() && (this._pendingIframes[t] = !0, setTimeout(function () {
        n._pendingIframes[t] && o("iframe " + e.src + " is unresponsive");
      }, 5e3))) : o("No content window on init of cross-origin iframe " + Po(e, this._orgId));
    }, e.prototype.initSameOriginIframe = function (e) {
      var t = this;
      o("Attempting to setup Frame " + Po(e, this._orgId)), this.inject(e), e.addEventListener("load", Mt.wrap(function (n) {
        o("onload for frame " + Po(e, t._orgId)), t.inject(e);
      }));
    }, e.prototype.beforeFrameRemoved = function (e) {
      for (var t = 0; t < this._iFrames.length; t++) {
        if (e == this._iFrames[t]) return void this._iFrames.splice(t, 1);
      }
    }, e.prototype.postMessageReceived = function (e, t) {
      if (!e || e.parent == this._wnd) switch (t[0]) {
        case "EvtBundle":
          var n = t[1],
            r = this.pageSignature(),
            i = t[2];
          if (r != i) return Mt.sendToBugsnag("Page signature mismatch", "warning", {
            pageSignature: r,
            messageSignature: i
          }), void (e && Do(e, ["ShutdownFrame"]));
          n.length > 0 && this._transport.enqueueEvents(r, n);
          break;
        case "RequestFrameId":
          if (!e) return void o("No MessageEvent.source, iframe may have unloaded.");
          var s = this.iFrameWndToFsId(e);
          s ? (o("Responding to FID request for frame " + s), this._pendingIframes[s] = !1, this.sendFrameIdToInnerFrame(e, s)) : o("No FrameId found. Hoping to send one later.");
      }
    }, e.prototype.sendFrameIdToInnerFrame = function (e, t) {
      var n = this,
        r = function () {
          var r = [];
          0 != n._frameId && (r = n._parentIds ? n._parentIds.concat(n._frameId) : [n._frameId]);
          var i = n._ctx.time.startTime();
          Do(e, ["SetFrameId", t, r, i, n._scheme, n._script, n._appHost, n._orgId, n._pageRsp]);
        };
      null == this._frameId ? this._pendingChildFrameIdInits.push(r) : r();
    }, e.prototype.iFrameWndToFsId = function (e) {
      for (var t = 0; t < this._iFrames.length; t++) if (this._iFrames[t].contentWindow == e) return Mn(this._iFrames[t]);
      return o("Unable to locate frame for window"), NaN;
    }, e;
  }();
  function Do(e, t) {
    e && e.postMessage && e.postMessage(gt({
      __fs: t
    }), "*");
  }
  function Bo(e) {
    try {
      var t = wt(e);
      if ("__fs" in t) return t.__fs;
    } catch (e) {}
    return [];
  }
  function Ho(e) {
    return e >= 400 && 502 !== e || 202 == e || 206 == e;
  }
  var jo = function () {
      return (jo = Object.assign || function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        return e;
      }).apply(this, arguments);
    },
    Ko = function () {
      function e(e, t, n, r) {
        void 0 === r && (r = tn), this._ctx = e, this._protocol = t, this._identity = n, this._timeoutFactory = r, this._recover();
      }
      return e.prototype.sing = function (e) {
        o("Saving " + e.bundles.length + " bundles in swan-song.");
        var t = gt({
          OrgId: this._identity.orgId(),
          UserId: this._identity.userId(),
          SessionId: this._identity.sessionId(),
          PageId: e.pageId,
          Bundles: e.bundles,
          PageStartTime: this._ctx.time.startTime(),
          LastBundleTime: e.lastBundleTime,
          ServerPageStart: e.serverPageStart,
          ServerBundleTime: e.serverBundleTime,
          IsNewSession: e.isNewSession
        });
        if (!(t.length > 2e6)) try {
          localStorage._fs_swan_song = t;
        } catch (e) {}
      }, e.prototype._recover = function () {
        try {
          if ("_fs_swan_song" in localStorage) {
            var e = localStorage._fs_swan_song || localStorage.singSwanSong;
            delete localStorage._fs_swan_song, delete localStorage.singSwanSong;
            var t = wt(e);
            if (!(t.Bundles && t.UserId && t.SessionId && t.PageId)) return void o("Malformed swan song found. Ignoring it.");
            t.OrgId || (t.OrgId = this._identity.orgId()), t.Bundles.length > 0 && (o("Sending " + t.Bundles.length + " bundles as prior page swan song"), this.sendSwanSongBundles(t));
          }
        } catch (e) {
          o("Error recovering swan-song: " + e);
        }
      }, e.prototype.sendSwanSongBundles = function (e, t) {
        var n = this;
        void 0 === t && (t = 0);
        var r = null;
        if (nt(e.Bundles) && 0 !== e.Bundles.length && void 0 !== e.Bundles[0]) {
          1 == e.Bundles.length && (r = this._ctx.time.wallTime() - (e.LastBundleTime || 0));
          this._protocol.bundle({
            bundle: e.Bundles[0],
            deltaT: r,
            orgId: e.OrgId,
            pageId: e.PageId,
            serverBundleTime: e.ServerBundleTime,
            serverPageStart: e.ServerPageStart,
            sessionId: e.SessionId,
            userId: e.UserId,
            isNewSession: e.IsNewSession,
            win: function (t) {
              o("Sent " + e.Bundles[0].Evts.length + " trailing events from last session as Seq " + e.Bundles[0].Seq), e.Bundles.shift(), e.Bundles.length > 0 ? n.sendSwanSongBundles(jo(jo({}, e), {
                ServerBundleTime: t.BundleTime
              })) : o("Done with prior page swan song");
            },
            lose: function (r) {
              Ho(r) ? o("Fatal error while sending events, giving up") : (o("Failed to send events from last session, will retry while on this page"), n._lastSwanSongRetryTimeout = new n._timeoutFactory(n.sendSwanSongBundles, n._protocol.exponentialBackoffMs(t, !0), n, e, t + 1).start());
            }
          });
        }
      }, e;
    }(),
    Vo = function () {
      function e(e, t, n, r) {
        var i = this;
        void 0 === t && (t = new Ro(e)), void 0 === n && (n = en), void 0 === r && (r = tn), this._ctx = e, this._protocol = t, this._tickerFactory = n, this._backoffRetries = 0, this._backoffTime = 0, this._bundleSeq = 1, this._lastPostTime = 0, this._serverBundleTime = 0, this._isNewSession = !1, this._largePageSize = 16e6, this._outgoingEventQueue = [], this._bundleQueue = [], this._hibernating = !1, this._heartbeatInterval = 0, this._lastUserActivity = this._ctx.time.wallTime(), this._finished = !1, this._scheme = e.options.scheme, this._identity = e.recording.identity, this._lastBundleTime = e.time.wallTime(), this._swanSong = new Ko(e, this._protocol, this._identity, r), this._heartbeatTimeout = new r(function () {
          i.onHeartbeat();
        }), this._hibernationTimeout = new r(function () {
          i.onHibernate();
        }, te.PageInactivityTimeout);
      }
      return e.prototype.onShutdown = function (e) {
        this._onShutdown = e;
      }, e.prototype.scheme = function () {
        return this._scheme;
      }, e.prototype.enqueueEvents = function (e, t) {
        if (this.maybeHibernate(), this._hibernating) {
          if (this._finished) return;
          for (var n = 0, r = t; n < r.length; n++) {
            if (re((u = r[n]).Kind)) {
              this._ctx.recording.splitPage(V.Hibernation), this._finished = !0;
              break;
            }
          }
        } else {
          for (var i = 0, o = t; i < o.length; i++) {
            if (re((u = o[i]).Kind)) {
              this._hibernationTimeout.start(), this._heartbeatInterval = te.HeartbeatInitial, this._heartbeatTimeout.start(this._heartbeatInterval), this._lastUserActivity = this._ctx.time.wallTime();
              break;
            }
          }
          for (var s = 0, a = t; s < a.length; s++) {
            var u = a[s];
            this._outgoingEventQueue.push(u);
          }
        }
      }, e.prototype.initUploadTicker = function () {
        this._uploadTicker = new this._tickerFactory(this._ctx.recording.bundleUploadInterval());
      }, e.prototype.startPipeline = function (e) {
        var t = this;
        this._pageId = e.pageId, this._serverPageStart = e.serverPageStart, this._isNewSession = e.isNewSession, this.enqueueAndSendBundle(), this._uploadTicker || this.initUploadTicker(), this._uploadTicker.start(function () {
          t.enqueueAndSendBundle();
        }), this._heartbeatInterval = te.HeartbeatInitial, this._heartbeatTimeout.start(this._heartbeatInterval), this._hibernationTimeout.start();
      }, e.prototype.stopPipeline = function () {
        this._uploadTicker && this._uploadTicker.stop(), this._outgoingEventQueue = [], this._bundleQueue = [], this._hibernationTimeout.stop(), this._heartbeatTimeout.stop();
      }, e.prototype.flush = function () {
        this.maybeSendNextBundle();
      }, e.prototype.singSwanSong = function () {
        if (!this._hibernating && (this._outgoingEventQueue.length > 0 && this.enqueueNextBundle(!0), this._bundleQueue.length > 0 || this._pendingBundle)) {
          var e = this._bundleQueue.concat();
          this._pendingBundle && e.unshift(this._pendingBundle), this._swanSong.sing({
            pageId: this._pageId,
            bundles: e,
            lastBundleTime: this._lastBundleTime,
            serverPageStart: this._serverPageStart,
            serverBundleTime: this._serverBundleTime,
            isNewSession: this._isNewSession
          });
        }
      }, e.prototype.maybeHibernate = function () {
        this._hibernating || this.calcLastUserActivityDuration() >= te.PageInactivityTimeout + 5e3 && this.onHibernate();
      }, e.prototype.calcLastUserActivityDuration = function () {
        return s.mathFloor(this._ctx.time.wallTime() - this._lastUserActivity);
      }, e.prototype.onHeartbeat = function () {
        var e = this.calcLastUserActivityDuration();
        this._outgoingEventQueue.push({
          When: this._ctx.time.now(),
          Kind: R.HEARTBEAT,
          Args: [e]
        }), this._heartbeatInterval *= 2, this._heartbeatInterval > te.HeartbeatMax && (this._heartbeatInterval = te.HeartbeatMax), this._heartbeatTimeout.start(this._heartbeatInterval);
      }, e.prototype.onHibernate = function () {
        this._hibernating || (this.calcLastUserActivityDuration() <= 2 * te.PageInactivityTimeout && (this._outgoingEventQueue.push({
          When: this._ctx.time.now(),
          Kind: R.UNLOAD,
          Args: [V.Hibernation]
        }), this.singSwanSong()), this.stopPipeline(), this._hibernating = !0);
      }, e.prototype.enqueueAndSendBundle = function () {
        this._pendingBundle ? this._pendingBundleFailed && this._sendPendingBundle() : 0 != this._outgoingEventQueue.length ? this.enqueueNextBundle() : this.maybeSendNextBundle();
      }, e.prototype.enqueueNextBundle = function (e) {
        void 0 === e && (e = !1);
        var t = {
          When: this._outgoingEventQueue[0].When,
          Seq: this._bundleSeq++,
          Evts: this._outgoingEventQueue
        };
        this._outgoingEventQueue = [], this._bundleQueue.push(t), e ? this._protocol.bundleBeacon({
          bundle: t,
          deltaT: null,
          orgId: this._identity.orgId(),
          pageId: this._pageId,
          serverBundleTime: this._serverBundleTime,
          serverPageStart: this._serverPageStart,
          isNewSession: this._isNewSession,
          sessionId: this._identity.sessionId(),
          userId: this._identity.userId(),
          win: function () {},
          lose: function () {}
        }) : this.maybeSendNextBundle();
      }, e.prototype.maybeSendNextBundle = function () {
        this._pageId && this._serverPageStart && !this._pendingBundle && 0 != this._bundleQueue.length && (this._pendingBundle = this._bundleQueue.shift(), this._sendPendingBundle());
      }, e.prototype._sendPendingBundle = function () {
        var e = this,
          t = this._ctx.time.wallTime();
        if (!(t < this._backoffTime)) {
          var n = this._pendingBundle;
          n && (this._pendingBundleFailed = !1, this._lastPostTime = this._lastBundleTime = t, this.sendBundle(n, function (t) {
            o("Sent bundle " + n.Seq + " with " + n.Evts.length + " events"), e._serverBundleTime = t.BundleTime, e._pendingBundle = null, e._backoffTime = 0, e._backoffRetries = 0, e._ctx.time.wallTime() - e._lastPostTime > e._ctx.recording.bundleUploadInterval() && e.maybeSendNextBundle();
          }, function (t) {
            if (o("Failed to send events."), Ho(t)) return 206 == t ? Mt.sendToBugsnag("Failed to send bundle, probably because of its large size", "error") : t >= 500 && Mt.sendToBugsnag("Failed to send bundle, recording outage likely", "error"), void (e._onShutdown && e._onShutdown());
            e._pendingBundleFailed = !0, e._backoffTime = e._lastPostTime + e._protocol.exponentialBackoffMs(e._backoffRetries++, !1);
          }));
        }
      }, e.prototype.sendBundle = function (e, t, n) {
        var r = s.mathFloor(this._ctx.time.wallTime() - this._lastUserActivity),
          i = this._protocol.bundle({
            bundle: e,
            deltaT: null,
            lastUserActivity: r,
            orgId: this._identity.orgId(),
            pageId: this._pageId,
            serverBundleTime: this._serverBundleTime,
            serverPageStart: this._serverPageStart,
            isNewSession: this._isNewSession,
            sessionId: this._identity.sessionId(),
            userId: this._identity.userId(),
            win: t,
            lose: n
          });
        i > this._largePageSize && this._bundleSeq > 16 && (o("splitting large page: " + i), this._ctx.recording.splitPage(V.Size));
      }, e;
    }(),
    zo = function () {
      var e = function (t, n) {
        return (e = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
        })(t, n);
      };
      return function (t, n) {
        function r() {
          this.constructor = t;
        }
        e(t, n), t.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r());
      };
    }(),
    Yo = function (e) {
      function t(t, n, r, i, o) {
        void 0 === r && (r = new Vo(t, n)), void 0 === i && (i = en), void 0 === o && (o = Uo);
        var s,
          a,
          u = e.call(this, t, i, r, o) || this;
        return u._protocol = n, u._domLoaded = !1, u._recordingDisabled = !1, u._integrationScriptFetched = !1, r.onShutdown(function () {
          return u.shutdown(V.SettingsBlocked);
        }), u._doc = u._wnd.document, u._frameId = 0, u._identity = t.recording.identity, u._getCurrentSessionEnabled = qo.NoInfoYet, s = u._wnd, a = function (e) {
          if (u._eventWatcher.shutdown(V.Api), e) {
            var t = u._doc.getElementById(e);
            t && t.setAttribute("_fs_embed_token", u._embedToken);
          }
        }, s._fs_shutdown = a, u;
      }
      return zo(t, e), t.prototype.onDomLoad = function () {
        var t = this;
        e.prototype.onDomLoad.call(this), this._domLoaded = !0, this.injectIntegrationScript(function () {
          t.fireFsReady(t._recordingDisabled);
        });
      }, t.prototype.getReplayFlags = function () {
        var e = U(this._wnd);
        if (/[?&]_fs_force_session=true(&|#|$)/.test(location.search) && (e += ",forceSession", this._wnd.history)) {
          var t = location.search.replace(/(^\?|&)_fs_force_session=true(&|$)/, function (e, t, n) {
            return n ? t : "";
          });
          this._wnd.history.replaceState({}, "", this._wnd.location.href.replace(location.search, t));
        }
        return e;
      }, t.prototype.start = function (t, n) {
        var r,
          i,
          o,
          s = this;
        e.prototype.start.call(this, t, n);
        var a = this.getReplayFlags(),
          u = Vt(this._doc),
          c = u[0],
          h = u[1],
          d = bt(this._wnd),
          l = d[0],
          p = d[1],
          f = "";
        t || (f = this._identity.userId());
        var v = null !== (o = null === (i = null === (r = this._ctx) || void 0 === r ? void 0 : r.recording) || void 0 === i ? void 0 : i.preroll) && void 0 !== o ? o : -1,
          _ = ur(Jn(this._wnd), this._orgId, {
            source: "page",
            type: "base"
          }),
          g = ur(this._doc.referrer, this._orgId, {
            source: "page",
            type: "referrer"
          }),
          m = ur(this._wnd.location.href, this._orgId, {
            source: "page",
            type: "url"
          }),
          y = {
            OrgId: this._orgId,
            UserId: f,
            Url: m,
            Base: _,
            Width: c,
            Height: h,
            ScreenWidth: l,
            ScreenHeight: p,
            Referrer: g,
            Preroll: v,
            Doctype: yt(this._doc),
            CompiledTimestamp: 1591209308,
            AppId: this._identity.appId()
          };
        a && (y.ReplayFlags = a), this._protocol.page(y, function (e) {
          s.handleResponse(e), s.handleIdentity(e.CookieDomain, e.UserIntId, e.SessionIntId, e.PageIntId, e.EmbedToken), s.handleIntegrationScript(e.IntegrationScript), e.PreviewMode && s.maybeInjectPreviewScript();
          var t = s._wnd._fs_pagestart;
          t && t();
          var n = !!e.Consented;
          s._queue.enqueueFirst({
            Kind: R.SYS_REPORTCONSENT,
            Args: [n, K.Document]
          }), s._queue.enqueueFirst({
            Kind: R.SET_FRAME_BASE,
            Args: [ur(Jn(s._wnd), s._orgId, {
              source: "event",
              type: R.SET_FRAME_BASE
            }), yt(s._doc)]
          }), s._queue.startPipeline({
            pageId: e.PageIntId,
            serverPageStart: e.PageStart,
            isNewSession: !!e.IsNewSession
          }), s.fullyStarted();
        }, function (e, t) {
          t && t.user_id && t.cookie_domain && t.reason_code == $.ReasonBlockedTrafficRamping && f != t.user_id && s.handleIdentity(t.cookie_domain, t.user_id, "", "", ""), s.disableBecauseRecPageSaidSo();
        });
      }, t.prototype.handleIntegrationScript = function (e) {
        var t = this;
        this._integrationScriptFetched = !0, this._integrationScript = e, this.injectIntegrationScript(function () {
          t.fireFsReady(t._recordingDisabled);
        });
      }, t.prototype.handleIdentity = function (e, t, n, r, i) {
        var s = this._identity;
        s.setIds(this._wnd, e, t, n), this._embedToken = i, o("/User," + s.userId() + "/Session," + s.sessionId() + "/Page," + r);
      }, t.prototype.injectIntegrationScript = function (e) {
        if (this._domLoaded && this._integrationScriptFetched) if (this._integrationScript) {
          var t = this._doc.createElement("script");
          this._wnd._fs_csp ? (t.addEventListener("load", e), t.addEventListener("error", e), t.async = !0, t.src = this._scheme + "//" + this._recHost + "/rec/integrations?OrgId=" + this._orgId, this._doc.head.appendChild(t)) : (t.text = this._integrationScript, this._doc.head.appendChild(t), e());
        } else e();
      }, t.prototype.maybeInjectPreviewScript = function () {
        if (!this._doc.getElementById("FullStory-preview-script")) {
          var e = this._doc.createElement("script");
          e.id = "FullStory-preview-script", e.async = !0, e.src = this._scheme + "//" + this._appHost + "/s/fspreview.js", this._doc.head.appendChild(e);
        }
      }, t.prototype.disableBecauseRecPageSaidSo = function () {
        this.shutdown(V.SettingsBlocked), o("Disabling FS."), this._recordingDisabled = !0, this.fireFsReady(this._recordingDisabled);
      }, t;
    }(Wo),
    Go = function () {
      function e(e, t) {
        void 0 === t && (t = new Qo(e)), this._wnd = e, this._messagePoster = t;
      }
      return e.prototype.enqueueEvents = function (e, t) {
        this._messagePoster.postMessage(this._wnd.parent, "EvtBundle", t, e);
      }, e.prototype.startPipeline = function () {}, e.prototype.stopPipeline = function () {}, e.prototype.flush = function () {}, e.prototype.singSwanSong = function () {}, e.prototype.onShutdown = function (e) {}, e;
    }(),
    Qo = function () {
      function e(e) {
        this.wnd = e;
      }
      return e.prototype.postMessage = function (e, t, n, r) {
        var i = N(this.wnd);
        if (i) try {
          i.send(t, gt(n), r);
        } catch (e) {
          i.send(t, gt(n));
        } else e.postMessage(function (e, t, n) {
          var r = [e, t];
          n && r.push(n);
          return gt({
            __fs: r
          });
        }(t, n, r), "*");
      }, e;
    }();
  var Xo,
    Jo = function () {
      var e = function (t, n) {
        return (e = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
        })(t, n);
      };
      return function (t, n) {
        function r() {
          this.constructor = t;
        }
        e(t, n), t.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r());
      };
    }(),
    $o = function (e) {
      function t(t, n, r, i, o) {
        void 0 === n && (n = new Qo(t.window)), void 0 === r && (r = new Go(t.window)), void 0 === i && (i = en), void 0 === o && (o = Uo);
        var s = e.call(this, t, i, r, o) || this;
        return s._messagePoster = n, s;
      }
      return Jo(t, e), t.prototype.start = function (t, n) {
        var r = this;
        e.prototype.start.call(this, t, n), this.sendRequestForFrameId(), this._listeners.add(this._wnd, "load", !1, function () {
          r._eventWatcher.recordingIsDetached() && (o("Recording wrong document. Restarting recording in iframe."), r._ctx.recording.splitPage(V.FsShutdownFrame));
        });
      }, t.prototype.postMessageReceived = function (t, n) {
        if (e.prototype.postMessageReceived.call(this, t, n), t == this._wnd.parent || t == this._wnd) switch (n[0]) {
          case "GreetFrame":
            this.sendRequestForFrameId();
            break;
          case "SetFrameId":
            try {
              var r = n[1],
                i = n[2],
                s = n[3],
                a = n[4],
                u = n[5],
                c = n[6],
                h = n[7],
                d = n[8];
              if (!r) return void o("Outer page gave us a bogus frame Id! Iframe: " + ur(location.href, h, {
                source: "log",
                type: "debug"
              }));
              this.setFrameIdFromOutside(r, i, s, a, u, c, h, d);
            } catch (e) {
              o("Failed to parse frameId from message: " + gt(n));
            }
            break;
          case "SetConsent":
            var l = n[1];
            this.setConsent(l);
            break;
          case "InitFrameMobile":
            try {
              var p = JSON.parse(n[1]),
                f = p.StartTime;
              if (n.length > 2) {
                var v = n[2];
                if (v.hasOwnProperty("ProtocolVersion")) v.ProtocolVersion >= 20180723 && v.hasOwnProperty("OuterStartTime") && (f = v.OuterStartTime);
              }
              var _ = p.Host;
              this.setFrameIdFromOutside(0, [], f, "https:", H(_), B(_), p.OrgId, p.PageResponse);
            } catch (e) {
              o("Failed to initialize mobile web recording from message: " + gt(n));
            }
        }
      }, t.prototype.sendRequestForFrameId = function () {
        this._frameId || (0 != this._frameId ? this._wnd.parent ? (o("Asking for a frame ID."), this._messagePoster.postMessage(this._wnd.parent, "RequestFrameId", [])) : o("Orphaned window.") : o("For some reason the outer window attempted to request a frameId"));
      }, t.prototype.setFrameIdFromOutside = function (e, t, n, r, i, s, a, u) {
        if (this._frameId) this._frameId != e ? (o("Updating frame id from " + this._frameId + " to " + e), this._ctx.recording.splitPage(V.FsShutdownFrame)) : o("frame Id is already set to " + this._frameId);else {
          o("FrameId received within frame " + ur(location.href, a, {
            source: "log",
            type: "debug"
          }) + ": " + e), this._scheme = r, this._script = i, this._appHost = s, this._orgId = a, this._frameId = e, this._parentIds = t, this.handleResponse(u), this.fireFsReady();
          var c = !!u.Consented;
          this._queue.enqueueFirst({
            Kind: R.SYS_REPORTCONSENT,
            Args: [c, K.Document]
          }), this._queue.enqueueFirst({
            Kind: R.SET_FRAME_BASE,
            Args: [ur(Jn(this._wnd), a, {
              source: "event",
              type: R.SET_FRAME_BASE
            }), yt(this._wnd.document)]
          }), this._queue.rebaseIframe(n), this._ctx.time.setStartTime(n), this._queue.startPipeline({
            pageId: this._pageId,
            serverPageStart: u.PageStart,
            isNewSession: !!u.IsNewSession,
            frameId: e,
            parentIds: t
          }), this.flushPendingChildFrameInits(), this.fullyStarted();
        }
      }, t;
    }(Wo),
    Zo = "fsidentity",
    es = "newuid",
    ts = function () {
      function e(e, t) {
        void 0 === e && (e = document), void 0 === t && (t = function () {}), this._doc = e, this._onWriteFailure = t, this._cookies = {}, this._appId = void 0;
      }
      return e.prototype.initFromCookies = function (e, t) {
        this._cookies = y(this._doc);
        var n = this._cookies.fs_uid;
        if (!n) try {
          n = localStorage._fs_uid;
        } catch (e) {}
        var r = m(n);
        r && r.host.replace(/^www\./, "") == e.replace(/^www\./, "") && r.orgId == t ? this._cookie = r : this._cookie = {
          expirationAbsTimeSeconds: g(),
          host: e,
          orgId: t,
          userId: "",
          sessionId: "",
          appKeyHash: ""
        };
      }, e.prototype.initFromParsedCookie = function (e) {
        this._cookie = e;
      }, e.prototype.clear = function () {
        this._cookie.userId = this._cookie.sessionId = this._cookie.appKeyHash = this._appId = "", this._cookie.expirationAbsTimeSeconds = g(), this._write();
      }, e.prototype.host = function () {
        return this._cookie.host;
      }, e.prototype.orgId = function () {
        return this._cookie.orgId;
      }, e.prototype.userId = function () {
        return this._cookie.userId;
      }, e.prototype.sessionId = function () {
        return this._cookie.sessionId;
      }, e.prototype.appKeyHash = function () {
        return this._cookie.appKeyHash;
      }, e.prototype.cookieData = function () {
        return this._cookie;
      }, e.prototype.cookies = function () {
        return this._cookies;
      }, e.prototype.setCookie = function (e, t, n) {
        void 0 === n && (n = new Date(p() + 6048e5).toUTCString());
        var r = e + "=" + t;
        this._domain ? r += "; domain=." + encodeURIComponent(this._domain) : r += "; domain=", r += "; Expires=" + n + "; path=/; SameSite=Strict", "https:" === location.protocol && (r += "; Secure"), this._doc.cookie = r;
      }, e.prototype.setIds = function (e, t, n, r) {
        (C(t) || t.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/g)) && (t = "");
        var i = function (e) {
          return e._fs_cookie_domain;
        }(e);
        "string" == typeof i && (t = i), this._domain = t, this._cookie.userId = n, this._cookie.sessionId = r, this._write();
      }, e.prototype.clearAppId = function () {
        return !!this._cookie.appKeyHash && (this._appId = "", this._cookie.appKeyHash = "", this._write(), !0);
      }, e.prototype.setAppId = function (e) {
        this._appId = e, this._cookie.appKeyHash = uo(e), this._write();
      }, e.prototype.appId = function () {
        return this._appId;
      }, e.prototype.encode = function () {
        var e = this._cookie.host + "#" + this._cookie.orgId + "#" + this._cookie.userId + ":" + this._cookie.sessionId;
        return this._cookie.appKeyHash && (e += "#" + encodeURIComponent(this._cookie.appKeyHash) + "#"), e += "/" + this._cookie.expirationAbsTimeSeconds;
      }, e.prototype._write = function () {
        if (null != this._domain) {
          var e = this.encode(),
            t = new Date(1e3 * this._cookie.expirationAbsTimeSeconds).toUTCString();
          this.setCookie("fs_uid", e, t);
          var n = [];
          -1 === this._doc.cookie.indexOf(e) && n.push(["fs_uid", "cookie"]);
          try {
            localStorage._fs_uid = e, localStorage._fs_uid !== e && n.push(["fs_uid", "localStorage"]);
          } catch (e) {
            n.push(["fs_uid", "localStorage", String(e)]);
          }
          n.length > 0 && this._onWriteFailure(n);
        }
      }, e;
    }();
  !function (e) {
    e.rec = "rec", e.user = "user", e.account = "account", e.consent = "consent", e.customEvent = "event", e.log = "log";
  }(Xo || (Xo = {}));
  var ns = {
      acctId: "str",
      displayName: "str",
      website: "str"
    },
    rs = {
      uid: "str",
      displayName: "str",
      email: "str"
    },
    is = {
      str: os,
      bool: ss,
      real: as,
      "int": us,
      date: cs,
      strs: hs(os),
      bools: hs(ss),
      reals: hs(as),
      ints: hs(us),
      dates: hs(cs),
      objs: hs(ds),
      obj: ds
    };
  function os(e) {
    return "string" == typeof e;
  }
  function ss(e) {
    return "boolean" == typeof e;
  }
  function as(e) {
    return "number" == typeof e;
  }
  function us(e) {
    return "number" == typeof e && e - s.mathFloor(e) == 0;
  }
  function cs(e) {
    return !!e && (e.constructor === Date ? !isNaN(e) : ("number" == typeof e || "string" == typeof e) && !isNaN(new Date(e)));
  }
  function hs(e) {
    return function (t) {
      if (!(t instanceof Array)) return !1;
      for (var n = 0; n < t.length; n++) if (!e(t[n])) return !1;
      return !0;
    };
  }
  function ds(e) {
    return !!e && "object" == typeof e;
  }
  var ls = /^[a-zA-Z][a-zA-Z0-9_]*$/,
    ps = function () {
      function e(e) {
        this._identity = e;
      }
      return e.prototype.identity = function () {
        return this._identity;
      }, e.prototype.api = function (e, t, n) {
        var r = !1,
          i = [];
        try {
          switch (e) {
            case Xo.account:
              i.push.apply(i, this.rawEventsFromApi(X.Account, ns, t, n));
              break;
            case Xo.user:
              if ("object" != typeof t) o("Expected argument of type 'object' instead got type: '" + typeof t + "', value: " + gt(t));else if ("uid" in t) {
                var a = t.uid;
                if (!1 === a) this._identity.clearAppId() && (r = !0), delete t.uid;else {
                  var u = function (e, t) {
                      "number" == typeof e && s.mathFloor(e) == e && (o("Expected appId of type 'string' instead got value: " + e + " of type: " + typeof e), e = "" + e);
                      if ("string" != typeof e) return o("blocking FS.identify API call; uid value (" + e + ") must be a string"), [void 0, Zo];
                      var n = e.trim();
                      if (f.indexOf(n.toLowerCase()) >= 0) return o("blocking FS.identify API call; uid value (" + n + ") is illegal"), [void 0, Zo];
                      var r = uo(n),
                        i = void 0;
                      t && t._cookie.appKeyHash && t._cookie.appKeyHash !== r && t._cookie.appKeyHash !== n && (o("user re-identified; existing uid hash (" + t._cookie.appKeyHash + ") does not match provided uid (" + n + ")"), i = es);
                      return [n, i];
                    }(a, this._identity),
                    c = u[0],
                    h = u[1];
                  if (!c) {
                    switch (h) {
                      case Zo:
                      case void 0:
                        break;
                      default:
                        o("unexpected failReason returned from setAppId: " + h);
                    }
                    return {
                      events: i
                    };
                  }
                  t.uid = c, this._identity.setAppId(t.uid), h == es && (r = !0);
                }
              }
              i.push.apply(i, this.rawEventsFromApi(X.User, rs, t, n));
              break;
            case Xo.customEvent:
              var d = t.n,
                l = t.p;
              i.push.apply(i, this.rawEventsFromApi(X.Event, {}, l, n, d));
              break;
            default:
              o("invalid operation \"" + e + "\"; only \"rec\", \"account\", and \"user\" are supported at present");
          }
        } catch (t) {
          o("unexpected exception handling " + e + " API call: " + t.message);
        }
        return {
          events: i,
          reidentify: r
        };
      }, e.prototype.rawEventsFromApi = function (e, t, n, r, i) {
        var a = function e(t, n, r) {
            var i = {
                PayloadToSend: {},
                ValidationErrors: []
              },
              a = function (r) {
                var o = e(t, n, r);
                return i.ValidationErrors = i.ValidationErrors.concat(o.ValidationErrors), o.PayloadToSend;
              };
            return ht(r, function (e, r) {
              var u = function (e, t, n, r) {
                var i = t,
                  a = typeof n;
                if ("undefined" === a) return o("Cannot infer type of " + a + " " + n), r.push({
                  Type: "vartype",
                  FieldName: t,
                  ValueType: a + " (unsupported)"
                }), null;
                if (s.objectHasOwnProp(e, t)) return {
                  name: t,
                  type: e[t]
                };
                var u = t.lastIndexOf("_");
                if (-1 == u || !vs(t.substring(u + 1))) {
                  var c = function (e) {
                    for (var t in is) if (is[t](e)) return t;
                    return null;
                  }(n);
                  if (null == c) return o("Cannot infer type of " + a + " " + n), n ? r.push({
                    Type: "vartype",
                    FieldName: t
                  }) : r.push({
                    Type: "vartype",
                    FieldName: t,
                    ValueType: "null (unsupported)"
                  }), null;
                  u = t.length, o("Warning: Inferring user variable \"" + t + "\" to be of type \"" + c + "\""), t = t + "_" + c;
                }
                var h = [t.substring(0, u), t.substring(u + 1)],
                  d = h[0],
                  l = h[1];
                if ("object" === a && !n) return o("null is not a valid object type"), r.push({
                  Type: "vartype",
                  FieldName: i,
                  ValueType: "null (unsupported)"
                }), null;
                if (!ls.test(d)) {
                  d = d.replace(/[^a-zA-Z0-9_]/g, "").replace(/^[0-9]+/, ""), /[0-9]/.test(d[0]) && (d = d.substring(1)), r.push({
                    Type: "varname",
                    FieldName: i
                  });
                  var p = d + "_" + l;
                  if (o("Warning: variable \"" + i + "\" has invalid characters. It should match /" + ls.source + "/. Converted name to \"" + p + "\"."), "" == d) return null;
                  t = p;
                }
                if (!vs(l)) return o("Variable \"" + i + "\" has invalid type \"" + l + "\""), r.push({
                  Type: "varname",
                  FieldName: i
                }), null;
                if (!function (e, t) {
                  return is[e](t);
                }(l, n)) return o("illegal value " + gt(n) + " for type " + l), "number" === a ? a = n % 1 == 0 ? "integer" : "real" : "object" == a && null != n && n.constructor == Date && (a = isNaN(n) ? "invalid date" : "date"), r.push({
                  Type: "vartype",
                  FieldName: i,
                  ValueType: a
                }), null;
                return {
                  name: t,
                  type: l
                };
              }(n, r, e, i.ValidationErrors);
              if (u) {
                var c = u.name,
                  h = u.type;
                if ("obj" != h) {
                  if ("objs" != h) {
                    var d, l;
                    i.PayloadToSend[c] = fs(h, e);
                  } else {
                    t != X.Event && i.ValidationErrors.push({
                      Type: "vartype",
                      FieldName: c,
                      ValueType: "Array<Object> (unsupported)"
                    });
                    for (var p = e, f = [], v = 0; v < p.length; v++) {
                      (_ = a(p[v])) && f.push(_);
                    }
                    f.length > 0 && (i.PayloadToSend[c] = f);
                  }
                } else {
                  var _ = a(e),
                    g = (l = "_obj").length > (d = r).length || d.substring(d.length - l.length) != l ? c.substring(0, c.length - "_obj".length) : c;
                  i.PayloadToSend[g] = _;
                }
              } else i.PayloadToSend[r] = fs("", e);
            }), i;
          }(e, t, n),
          u = [],
          c = e == X.Event,
          h = gt(a.PayloadToSend),
          d = !!r && "fs" !== r;
        return c ? u.push({
          When: 0,
          Kind: R.SYS_CUSTOM,
          Args: d ? [i, h, r] : [i, h]
        }) : u.push({
          When: 0,
          Kind: R.SYS_SETVAR,
          Args: d ? [e, h, r] : [e, h]
        }), u;
      }, e;
    }();
  function fs(e, t) {
    return "str" == e && null != t && (t = t.trim()), null == t || "date" != e && t.constructor != Date || (t = function (e) {
      var t,
        n = e.constructor === Date ? e : new Date(e);
      try {
        t = n.toISOString();
      } catch (e) {
        t = null;
      }
      return t;
    }(t)), t;
  }
  function vs(e) {
    return !!is[e];
  }
  var _s = function () {
      return (_s = Object.assign || function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        return e;
      }).apply(this, arguments);
    },
    gs = function (e, t, n, r) {
      return new (n || (n = Promise))(function (i, o) {
        function s(e) {
          try {
            u(r.next(e));
          } catch (e) {
            o(e);
          }
        }
        function a(e) {
          try {
            u(r["throw"](e));
          } catch (e) {
            o(e);
          }
        }
        function u(e) {
          var t;
          e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function (e) {
            e(t);
          })).then(s, a);
        }
        u((r = r.apply(e, t || [])).next());
      });
    },
    ms = function (e, t) {
      var n,
        r,
        i,
        o,
        s = {
          label: 0,
          sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          },
          trys: [],
          ops: []
        };
      return o = {
        next: a(0),
        "throw": a(1),
        "return": a(2)
      }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
        return this;
      }), o;
      function a(o) {
        return function (a) {
          return function (o) {
            if (n) throw new TypeError("Generator is already executing.");
            for (; s;) try {
              if (n = 1, r && (i = 2 & o[0] ? r["return"] : o[0] ? r["throw"] || ((i = r["return"]) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
              switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                case 0:
                case 1:
                  i = o;
                  break;
                case 4:
                  return s.label++, {
                    value: o[1],
                    done: !1
                  };
                case 5:
                  s.label++, r = o[1], o = [0];
                  continue;
                case 7:
                  o = s.ops.pop(), s.trys.pop();
                  continue;
                default:
                  if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                    s = 0;
                    continue;
                  }
                  if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                    s.label = o[1];
                    break;
                  }
                  if (6 === o[0] && s.label < i[1]) {
                    s.label = i[1], i = o;
                    break;
                  }
                  if (i && s.label < i[2]) {
                    s.label = i[2], s.ops.push(o);
                    break;
                  }
                  i[2] && s.ops.pop(), s.trys.pop();
                  continue;
              }
              o = t.call(e, s);
            } catch (e) {
              o = [6, e], r = 0;
            } finally {
              n = i = 0;
            }
            if (5 & o[0]) throw o[1];
            return {
              value: o[0] ? o[1] : void 0,
              done: !0
            };
          }([o, a]);
        };
      }
    };
  function ys(e, t) {
    return gs(this, void 0, et, function () {
      var n, r, i, s, u;
      return ms(this, function (c) {
        switch (c.label) {
          case 0:
            if (c.trys.push([0, 2,, 3]), ae || ce) return [2, _s(_s({}, t), {
              status: 1
            })];
            if (!e.document || 0 !== t.status) return [2, t];
            if (1 === (n = function (e, t) {
              var n = t.functions,
                r = {},
                i = _s({}, t.helpers);
              if (i.functionToString = function (e, t) {
                var n,
                  r,
                  i = null === (n = e["__core-js_shared__"]) || void 0 === n ? void 0 : n.inspectSource;
                if (bs(i, 1)) return function () {
                  return i(this);
                };
                var o = null === (r = e["__core-js_shared__"]) || void 0 === r ? void 0 : r["native-function-to-string"];
                if (bs(o)) return o;
                var s = t.__zone_symbol__OriginalDelegate;
                if (bs(s)) return s;
                if (bs(t)) return t;
                return;
              }(e, i.functionToString), !i.functionToString) return t;
              var o = !1;
              for (var s in n) if (n[s]) {
                if (r[s] = Ts(i.functionToString, n[s]), r[s] || (r[s] = ks(i.functionToString, i, s)), !r[s]) return t;
                r[s] !== n[s] && (o = !0);
              } else r[s] = void 0;
              return {
                status: 1,
                functions: o ? r : n,
                helpers: i
              };
            }(e, t)).status) return [2, n];
            o("The window is dirty; rebuilding Windex from a fresh global."), (r = e.document.createElement("iframe")).id = "FullStory-iframe", r.className = "fs-hide", r.style.display = "none", i = e.document.body || e.document.head || e.document.documentElement || e.document;
            try {
              i.appendChild(r);
            } catch (e) {
              return [2, _s(_s({}, t), {
                status: 1
              })];
            }
            return r.contentWindow ? (s = a(r.contentWindow, 1), r.parentNode && r.parentNode.removeChild(r), 2 === s.status ? [2, _s(_s({}, t), {
              status: 1
            })] : [4, ws(s, t)]) : [2, _s(_s({}, t), {
              status: 1
            })];
          case 1:
            return [2, c.sent()];
          case 2:
            return u = c.sent(), Mt.sendToBugsnag(u, "error"), [2, _s(_s({}, t), {
              status: 1
            })];
          case 3:
            return [2];
        }
      });
    });
  }
  function ws(e, t) {
    var n,
      r = new et(function (e) {
        return n = e;
      });
    return setTimeout(function () {
      try {
        e.functions.jsonParse("[]").push(0);
      } catch (e) {
        n(_s(_s({}, t), {
          status: 1
        }));
      }
      n(e);
    }), r;
  }
  function bs(e, t) {
    var n;
    if (void 0 === t && (t = 0), !e) return !1;
    var r = function (e) {
        try {
          return void e.call(null);
        } catch (e) {
          return (e.stack || "").replace(/__fs_nomangle_check_stack(.|\n)*$/, "");
        }
      },
      i = void 0;
    0 !== t && "number" == typeof Error.stackTraceLimit && (i = Error.stackTraceLimit, Error.stackTraceLimit = Number.POSITIVE_INFINITY);
    var o = [function () {
        throw new Error("");
      }, e],
      s = function __fs_nomangle_check_stack() {
        return o.map(r);
      }(),
      a = s[0],
      u = s[1];
    if (void 0 !== i && (Error.stackTraceLimit = i), !a || !u) return !1;
    for (var c = "\n".charCodeAt(0), h = a.length > u.length ? u.length : a.length, d = 1, l = d; l < h; l++) {
      var p = a.charCodeAt(a.length - l),
        f = u.charCodeAt(u.length - l);
      if (p != f) break;
      f != c && l != h - 1 || (d = l);
    }
    return (null !== (n = u.slice(0, u.length - d + 1).match(/\.js:\d+([:)]|$)/gm)) && void 0 !== n ? n : []).length <= t;
  }
  function Ss(e, t) {
    return e.call(t).indexOf("[native code]") >= 0;
  }
  var Es = ["__zone_symbol__OriginalDelegate", "nr@original"];
  function Ts(e, t) {
    if (t) {
      for (var n = 0, r = Es; n < r.length; n++) {
        var i = t[r[n]];
        if ("function" == typeof i && Ss(e, i)) return i;
      }
      return Ss(e, t) ? t : void 0;
    }
  }
  function ks(e, t, n) {
    switch (n) {
      case "arrayIsArray":
        var r = Ts(e, t.objectToString);
        if (!r) return;
        return t.objectToString = r, function (e) {
          return "[object Array]" == r.call(e);
        };
      default:
        return;
    }
  }
  var Is = function () {
      function e(e, t) {
        void 0 === t && (t = function (e) {
          return new WebSocket(e);
        }), this._newSock = t, this._connecting = !1, this._connected = !1, this._queue = {}, this._seq = 1, this._scheme = e.options.scheme, this._host = e.options.recHost;
      }
      return e.isSupported = function () {
        return "WebSocket" in window;
      }, e.prototype.page = function (e, t, n) {
        this.request({
          Cmd: 1,
          Page: e
        }, function (e) {
          return t(e.Page);
        }, n);
      }, e.prototype.bundle = function (e) {
        var t = e.deltaT,
          n = e.serverPageStart,
          r = e.serverBundleTime;
        return this.request({
          Cmd: 2,
          Bundle: {
            OrgId: e.orgId,
            UserId: e.userId,
            SessionId: e.sessionId,
            PageId: e.pageId,
            Seq: e.bundle.Seq,
            DeltaT: null === t ? void 0 : t,
            PageStart: null == n ? void 0 : n,
            PrevBundleTime: null == r ? void 0 : r,
            Bundle: e.bundle
          }
        }, function (t) {
          return e.win(t.Bundle);
        }, e.lose);
      }, e.prototype.bundleBeacon = function (e) {
        return Mo(this._scheme, this._host, e);
      }, e.prototype.exponentialBackoffMs = function (e, t) {
        var n = s.mathMin(te.BackoffMax, 5e3 * s.mathPow(2, e));
        return t ? n + .25 * s.mathRandom() * n : n;
      }, e.prototype.request = function (e, t, n) {
        e.Seq = this._seq++;
        var r = gt(e);
        return this._queue[e.Seq] = {
          payload: r,
          win: t,
          lose: n
        }, this.maybeConnect(), r.length;
      }, e.prototype.handleMessage = function (e) {
        var t;
        try {
          t = wt(e);
        } catch (e) {
          return void o("socket: error parsing frame: " + e.toString());
        }
        var n = this._queue[t.Seq];
        delete this._queue[t.Seq], n ? 3 == t.Cmd ? (o(t.Fail.Error), n.lose(t.Fail.Status)) : n.win(t) : o("socket: mismatched request seq " + t.Seq + "; ignoring");
      }, e.prototype.drainQueue = function () {
        if (this._connected) for (var e in this._queue) {
          var t = this._queue[e];
          t.sent || (this._sock.send(t.payload), t.sent = !0);
        } else o("socket: attempt to drain queue when disconnected.");
      }, e.prototype.failPending = function () {
        for (var e in this._queue) {
          var t = this._queue[e];
          t.sent && (delete this._queue[e], t.lose(0));
        }
      }, e.prototype.maybeConnect = function () {
        var e = this;
        if (this._connected) this.drainQueue();else if (!this._connecting) {
          this._connecting = !0;
          var t = ("https:" == this._scheme ? "wss:" : "ws:") + "//" + this._host + "/rec/sock";
          this._sock = this._newSock(t), this._sock.onopen = function (t) {
            e._connecting = !1, e._connected = !0, e.drainQueue();
          }, this._sock.onmessage = function (t) {
            e.handleMessage(t.data), e.drainQueue();
          }, this._sock.onclose = function (t) {
            o("socket: closed; reconnecting"), e._connecting = e._connected = !1, e.failPending();
          }, this._sock.onerror = function (t) {
            o("socket: error; reconnecting"), e._connecting = e._connected = !1, e.failPending();
          };
        }
      }, e;
    }(),
    Cs = function () {
      var e = function (t, n) {
        return (e = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
        })(t, n);
      };
      return function (t, n) {
        function r() {
          this.constructor = t;
        }
        e(t, n), t.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r());
      };
    }(),
    Rs = function () {
      function e() {
        var e = this;
        this.measurementTasks = null, this.performingMeasurements = !1, this.recursionDepth = 0, this.performMeasurements = Mt.wrap(function () {
          if (e.performingMeasurements) Mt.sendToBugsnag("performMeasurements() already in progress", "error");else {
            e.performingMeasurements = !0;
            try {
              if (!e.measurementTasks) return;
              for (var t = 0; t < e.measurementTasks.length; t++) e.measurementTasks[t]();
              e.measurementTasks = null;
            } finally {
              e.performingMeasurements = !1;
            }
          }
        });
      }
      return e.create = function (e) {
        return e.ResizeObserver ? new As(e, e.ResizeObserver) : s.requestWindowAnimationFrame && e.MessageChannel ? new xs(e, s.requestWindowAnimationFrame, e.MessageChannel) : new Os(e);
      }, e.prototype.requestMeasureTask = function (e) {
        var t = this;
        if (this.recursionDepth > 16) Mt.sendToBugsnag("Too much synchronous recursion in requestMeasureTask", "error");else {
          var n = this.performingMeasurements ? this.recursionDepth : 0,
            r = Mt.wrap(function () {
              var r = t.recursionDepth;
              t.recursionDepth = n + 1;
              try {
                e();
              } finally {
                t.recursionDepth = r;
              }
            });
          this.measurementTasks ? this.measurementTasks.push(r) : (this.measurementTasks = [r], this.schedule());
        }
      }, e.prototype.performMeasurementsNow = function () {
        this.performMeasurements();
      }, e;
    }(),
    As = function (e) {
      function t(t, n) {
        var r = e.call(this) || this;
        return r.wnd = t, r.ResizeObserver = n, r;
      }
      return Cs(t, e), t.prototype.schedule = function () {
        var e = this,
          t = this.ResizeObserver,
          n = this.wnd.document,
          r = n.body || n.documentElement || n.head,
          i = new t(function () {
            i.unobserve(r), e.performMeasurements();
          });
        i.observe(r);
      }, t;
    }(Rs),
    xs = function (e) {
      function t(t, n, r) {
        var i = e.call(this) || this;
        return i.wnd = t, i.requestWindowAnimationFrame = n, i.onRAF = Mt.wrap(function () {
          i.ch.port2.postMessage(void 0);
        }), i.ch = new r(), i;
      }
      return Cs(t, e), t.prototype.schedule = function () {
        this.ch.port1.onmessage = this.performMeasurements, this.requestWindowAnimationFrame(this.wnd, this.onRAF);
      }, t;
    }(Rs),
    Os = function (e) {
      function t(t) {
        var n = e.call(this) || this;
        return n.wnd = t, n;
      }
      return Cs(t, e), t.prototype.schedule = function () {
        s.setWindowTimeout(this.wnd, this.performMeasurements, 0);
      }, t;
    }(Rs),
    Ms = function (e, t, n, r) {
      return new (n || (n = Promise))(function (i, o) {
        function s(e) {
          try {
            u(r.next(e));
          } catch (e) {
            o(e);
          }
        }
        function a(e) {
          try {
            u(r["throw"](e));
          } catch (e) {
            o(e);
          }
        }
        function u(e) {
          var t;
          e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function (e) {
            e(t);
          })).then(s, a);
        }
        u((r = r.apply(e, t || [])).next());
      });
    },
    Ls = function (e, t) {
      var n,
        r,
        i,
        o,
        s = {
          label: 0,
          sent: function () {
            if (1 & i[0]) throw i[1];
            return i[1];
          },
          trys: [],
          ops: []
        };
      return o = {
        next: a(0),
        "throw": a(1),
        "return": a(2)
      }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
        return this;
      }), o;
      function a(o) {
        return function (a) {
          return function (o) {
            if (n) throw new TypeError("Generator is already executing.");
            for (; s;) try {
              if (n = 1, r && (i = 2 & o[0] ? r["return"] : o[0] ? r["throw"] || ((i = r["return"]) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
              switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                case 0:
                case 1:
                  i = o;
                  break;
                case 4:
                  return s.label++, {
                    value: o[1],
                    done: !1
                  };
                case 5:
                  s.label++, r = o[1], o = [0];
                  continue;
                case 7:
                  o = s.ops.pop(), s.trys.pop();
                  continue;
                default:
                  if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                    s = 0;
                    continue;
                  }
                  if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                    s.label = o[1];
                    break;
                  }
                  if (6 === o[0] && s.label < i[1]) {
                    s.label = i[1], i = o;
                    break;
                  }
                  if (i && s.label < i[2]) {
                    s.label = i[2], s.ops.push(o);
                    break;
                  }
                  i[2] && s.ops.pop(), s.trys.pop();
                  continue;
              }
              o = t.call(e, s);
            } catch (e) {
              o = [6, e], r = 0;
            } finally {
              n = i = 0;
            }
            if (5 & o[0]) throw o[1];
            return {
              value: o[0] ? o[1] : void 0,
              done: !0
            };
          }([o, a]);
        };
      }
    },
    Fs = function () {
      function e() {}
      return e.prototype.createTopRecorder = function (e) {
        var t = e.window._fs_use_socket && Is.isSupported() ? new Is(e) : new Ro(e);
        return new Yo(e, t);
      }, e.prototype.createInnerRecorder = function (e) {
        return new $o(e);
      }, e;
    }(),
    Ps = function () {
      function e(e, t) {
        void 0 === e && (e = window), void 0 === t && (t = new Fs()), this.wnd = e, this.recMaker = t, this.scheme = "https:", this.domDoneLoaded = !1, this.waitingOnStart = !1, this.reidentifyCount = 0;
      }
      return e.prototype.init = function () {
        var e, t;
        k(this.wnd) || (e = this.wnd, t = T(this.wnd), e[w] = t, t in e || (e[t] = {}), function (e) {
          gs(this, void 0, et, function () {
            var t;
            return ms(this, function (n) {
              switch (n.label) {
                case 0:
                  return [4, ys(e, s.snapshot)];
                case 1:
                  return t = n.sent(), s.rebuildFromSnapshot(t), [2];
              }
            });
          });
        }(this.wnd), this.initApi(), this.start());
      }, e.prototype.getCurrentSessionURL = function (e) {
        return this.recorder ? this.recorder.getCurrentSessionURL(e) : null;
      }, e.prototype.getCurrentSession = function () {
        return this.recorder ? this.recorder.getCurrentSession() : null;
      }, e.prototype.enableConsole = function () {
        this.recorder && this.recorder.console().enable();
      }, e.prototype.disableConsole = function () {
        this.recorder && this.recorder.console().disable();
      }, e.prototype.log = function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        this._api(Xo.log, e);
      }, e.prototype.shutdownApi = function () {
        this.shutdown(V.Api);
      }, e.prototype.shutdown = function (e) {
        this.recorder && !this.deferredStart ? (this.recorder.shutdown(e), this.recorder = null) : o("Recording already shut down.");
      }, e.prototype.restart = function () {
        if (this.deferredStart) return this.deferredStart(), void (this.deferredStart = null);
        this.recorder ? o("Recording already started.") : this.recorder = this.createRecorder(!0);
      }, e.prototype.splitPage = function (e, t) {
        return Ms(this, void 0, et, function () {
          return Ls(this, function (n) {
            switch (n.label) {
              case 0:
                return t && null == this.identity ? (o("Can't re-identify from an iframe"), [2]) : this.waitingOnStart ? (this.splitPending = [e, t], [2]) : (this.shutdown(e), [4, so(0)]);
              case 1:
                return n.sent(), [4, so(0)];
              case 2:
                return n.sent(), t && this.identity && this.identity.clear(), this.restart(), [2];
            }
          });
        });
      }, e.prototype.executeApiSequence = function (e, t, n) {
        if (this.inFrame()) return o("API calls may only be made from the top-most frame"), null;
        for (var r, i, s = [], a = !1, u = 0; u < t.length; u++) try {
          var c = t[u],
            h = c[0],
            d = c[1];
          switch (h) {
            case Xo.rec:
              r = !!d;
              break;
            case Xo.log:
              var l = d,
                p = l[0],
                f = l.slice(1),
                v = e.console().logEvent(p, f);
              v && s.push(v);
              break;
            case Xo.consent:
              i = !!d;
              break;
            case Xo.account:
            case Xo.user:
            case Xo.customEvent:
              var _ = this.vars.api(h, d, n),
                g = _.events;
              _.reidentify && (s = [], i = void 0, a = !0), s.push.apply(s, g);
              break;
            default:
              o("Unrecognized api: " + h);
          }
        } catch (e) {
          Mt.sendToBugsnag(e, "error");
        }
        return {
          reidentified: a,
          recordingShouldBeEnabled: r,
          applyApi: function () {
            void 0 !== i && e.setConsent(i);
            for (var t = e.queue(), n = 0, r = s; n < r.length; n++) {
              var o = r[n];
              t.enqueue(o);
            }
          }
        };
      }, e.prototype._api = function (e, t, n) {
        var r;
        if (this.recorder) {
          var i = null !== (r = this.executeApiSequence(this.recorder, [[e, t]], n)) && void 0 !== r ? r : {
              reidentified: !1,
              applyApi: function () {}
            },
            s = i.reidentified,
            a = i.recordingShouldBeEnabled,
            u = i.applyApi;
          if (s) {
            if (this.reidentifyCount >= 8) return void o("reidentified too many times; giving up");
            this.reidentifyCount++, W(this.wnd, [e, t]), this.splitPage(V.Reidentify, !0);
          } else u();
          void 0 !== a && (a ? this.restart() : this.shutdown(V.Api));
        } else W(this.wnd, [e, t]);
      }, e.prototype._cookies = function () {
        return this.identity ? this.identity.cookies() : (o("Error in FS integration: Can't get cookies from inside an iframe"), null);
      }, e.prototype._setCookie = function (e, t) {
        this.identity ? this.identity.setCookie(e, t) : o("Error in FS integration: Can't set cookies from inside an iframe");
      }, e.prototype._withEventQueue = function (e, t) {
        if (this.recorder) {
          var n = this.recorder.queue(),
            r = this.recorder.pageSignature();
          null != n && null != r ? e === r ? t(n) : Mt.sendToBugsnag("Error in _withEventQueue: Page Signature mismatch", "error", {
            pageSignature: r,
            callerSignature: e
          }) : o("Error getting event queue or page signature: Recorder not initialized");
        } else o("Error in FS integration: Recorder not initialized");
      }, e.prototype.initApi = function () {
        var e = I(this.wnd);
        e ? (e.getCurrentSessionURL = _t(this.getCurrentSessionURL, this), e.getCurrentSession = _t(this.getCurrentSession, this), e.enableConsole = _t(this.enableConsole, this), e.disableConsole = _t(this.disableConsole, this), e.log = _t(this.log, this), e.shutdown = _t(this.shutdownApi, this), e.restart = _t(this.restart, this), e._api = _t(this._api, this), e._cookies = _t(this._cookies, this), e._setCookie = _t(this._setCookie, this), e._withEventQueue = _t(this._withEventQueue, this)) : o("Missing browser API namespace; couldn't initialize API.");
      }, e.prototype.start = function () {
        var e,
          t = this;
        e = L(this.wnd), r = e, o("script version UNSET (compiled at 1591209308)");
        var n = P(this.wnd);
        if (n) {
          this.orgId = n;
          var i,
            s = (i = this.wnd)._fs_script || H(D(i));
          if (s) {
            this.script = s;
            var a = F(this.wnd);
            if (a) {
              this.recHost = a;
              var u = function (e) {
                return e._fs_app_host || B(D(e));
              }(this.wnd);
              u ? (this.appHost = u, o("script: " + this.script), o("recording host: " + this.recHost), o("orgid: " + this.orgId), "localhost:8080" == this.recHost && (this.scheme = "http:"), this.inFrame() || (this.identity = new ts(this.wnd.document, function (e) {
                for (var n, r = 0, i = e; r < i.length; r++) {
                  var o = i[r];
                  null === (n = t.recorder) || void 0 === n || n.queue().enqueue({
                    Kind: R.STORAGE_WRITE_FAILURE,
                    Args: o
                  });
                }
              }), this.vars = new ps(this.identity), this.identity.initFromCookies(this.recHost, this.orgId)), this.canRecord(this.orgId) ? (this.recorder = this.createRecorder(), this.recorder.eventWatcher().watchEvents(), this.hookLoadEvents(), this.wnd.addEventListener("message", Mt.wrap(function (e) {
                if ("string" == typeof e.data && (e.source == t.wnd.parent || e.source == t.wnd)) switch (Bo(e.data)[0]) {
                  case "ShutdownFrame":
                    t.shutdown(V.FsShutdownFrame);
                    break;
                  case "RestartFrame":
                    t.restart();
                }
              }))) : this.hailMary()) : o("Missing global _fs_host or _fs_app_host. Recording disabled.");
            } else o("Missing global _fs_host or _fs_rec_host. Recording disabled.");
          } else o("Missing global _fs_host or _fs_rec_host. Recording disabled.");
        } else o("Missing global _fs_org. Recording disabled.");
      }, e.prototype._context = function (e) {
        var t,
          n = this,
          r = s.mathRound(null !== (t = ie(function () {
            var e;
            return null === (e = window.performance) || void 0 === e ? void 0 : e.now();
          })()) && void 0 !== t ? t : -1);
        return {
          window: this.wnd,
          time: new rn(),
          measurer: Rs.create(this.wnd),
          options: {
            orgId: this.orgId,
            scheme: this.scheme,
            script: this.script,
            recHost: this.recHost,
            appHost: this.appHost
          },
          recording: {
            bundleUploadInterval: function () {
              return e().bundleUploadInterval();
            },
            preroll: r,
            inFrame: this.inFrame(),
            vars: this.vars,
            identity: this.identity,
            splitPage: function (e, t) {
              return n.splitPage(e, t);
            },
            pageSignature: function () {
              return e().pageSignature();
            }
          },
          queue: function () {
            return e().queue();
          }
        };
      }, e.prototype.createRecorder = function (e) {
        var t,
          n,
          r = this,
          i = this._context(function () {
            return n;
          }),
          o = !1,
          s = !1;
        if (this.inFrame()) n = this.recMaker.createInnerRecorder(i);else {
          n = this.recMaker.createTopRecorder(i);
          var a = null !== (t = this.executeApiSequence(n, function (e) {
              var t = I(e);
              if (!t) return [];
              var n = t.q;
              return n ? (delete t.q, n) : [];
            }(this.wnd))) && void 0 !== t ? t : {
              applyApi: function () {}
            },
            u = a.reidentified,
            c = a.recordingShouldBeEnabled,
            h = a.applyApi;
          void 0 !== c && (s = !c), o = !!u, h();
        }
        this.waitingOnStart = !0;
        var d = function () {
          n.start(o, function () {
            r.waitingOnStart = !1, e && n.tellAllFramesTo(["RestartFrame"]), r.splitPending && (r.splitPage(r.splitPending[0], r.splitPending[1]), r.splitPending = null);
          }), e && n.eventWatcher().watchEvents();
        };
        return s ? this.deferredStart = d : d(), n;
      }, e.prototype.inFrame = function () {
        if ("boolean" == typeof this._inFrame) return this._inFrame;
        var e = N(this.wnd);
        return q(this.wnd) ? this._inFrame = !1 : this.wnd != top ? this._inFrame = !0 : e ? e.init && e.init(this.orgId) && (this._inFrame = !0) : this._inFrame = !1, this._inFrame;
      }, e.prototype.canRecord = function (e) {
        return (this.wnd.MutationObserver || this.wnd.MutationEvent) && this.wnd.postMessage && it && 2 !== s.snapshot.status ? !!function e(t) {
          if (t == top || q(t) || function (e) {
            return !!e._fs_run_in_iframe;
          }(t) || N(t)) return !0;
          try {
            return t.parent.document, e(t.parent);
          } catch (e) {
            return !1;
          }
        }(this.wnd) || (o("FullStory recording for this page is NOT allowed within an iFrame."), !1) : (o("missing required browser features"), !1);
      }, e.prototype.hailMary = function () {
        var e,
          t = this;
        if (this.identity) {
          var n = U(this.wnd);
          o("Unable to record playback stream.");
          var r = document.createElement("script");
          this.wnd.__fs_startResponse = function (e) {
            e && t.identity.setIds(t.wnd, e.CookieDomain, e.UserIntId, e.SessionIntId), document.head && document.head.removeChild(r);
          };
          var i = Vt(this.wnd.document),
            a = i[0],
            u = i[1],
            c = bt(this.wnd),
            h = c[0],
            d = c[1],
            l = ur(Jn(this.wnd), this.orgId, {
              source: "page",
              type: "base"
            }),
            p = ur(document.referrer, this.orgId, {
              source: "page",
              type: "referrer"
            }),
            f = ur(this.wnd.location.href, this.orgId, {
              source: "page",
              type: "url"
            }),
            v = s.mathRound(null !== (e = ie(function () {
              var e;
              return null === (e = window.performance) || void 0 === e ? void 0 : e.now();
            })()) && void 0 !== e ? e : -1);
          r.src = "//" + this.recHost + "/rec/page?OrgId=" + this.orgId + "&UserId=" + this.identity.userId() + "&Url=" + encodeURIComponent(f) + "&Base=" + encodeURIComponent(l) + "&Width=" + a + "&Height=" + u + "&ScreenWidth=" + h + "&ScreenHeight=" + d + "&Referrer=" + encodeURIComponent(p) + "&Doctype=" + encodeURIComponent(yt(document)) + "&Preroll=" + v + "&CompiledTimestamp=1591209308&Fallback=true" + (n ? "&ReplayFlags=" + n : ""), document.head && document.head.appendChild(r);
        }
      }, e.prototype.hookLoadEvents = function () {
        var e = this,
          t = function () {
            e.domDoneLoaded || (e.domDoneLoaded = !0, e.recorder && e.recorder.onDomLoad());
          },
          n = !1,
          r = function () {
            n || (n = !0, e.recorder && e.recorder.onLoad());
          };
        switch (document.readyState) {
          case "interactive":
            document.attachEvent || t();
            break;
          case "complete":
            t(), r();
        }
        this.domDoneLoaded || document.addEventListener("DOMContentLoaded", Mt.wrap(t)), n || this.wnd.addEventListener("load", Mt.wrap(function (e) {
          t(), r();
        }));
      }, e;
    }();
  !function () {
    try {
      new Ps().init();
    } catch (e) {
      Mt.sendToBugsnag(e, "error"), L(window) && window.console && console.log && console.log("Failed to initialize FullStory.");
    }
  }();
}]);