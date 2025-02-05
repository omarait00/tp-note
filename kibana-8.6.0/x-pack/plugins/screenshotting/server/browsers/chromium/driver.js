"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadlessChromiumDriver = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../../../src/plugins/screenshot_mode/server");
var _lodash = require("lodash");
var _opn = _interopRequireDefault(require("opn"));
var _puppeteer = require("puppeteer");
var _rxjs = require("rxjs");
var _url = require("url");
var _ = require(".");
var _print_layout = require("../../layouts/print_layout");
var _network_policy = require("../network_policy");
var _strip_unsafe_headers = require("./strip_unsafe_headers");
var _templates = require("./templates");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const WAIT_FOR_DELAY_MS = 100;

/**
 * @internal
 */
class HeadlessChromiumDriver {
  constructor(screenshotMode, config, basePath, page) {
    (0, _defineProperty2.default)(this, "listenersAttached", false);
    (0, _defineProperty2.default)(this, "interceptedCount", 0);
    (0, _defineProperty2.default)(this, "screenshottingErrorSubject", new _rxjs.Subject());
    (0, _defineProperty2.default)(this, "screenshottingError$", this.screenshottingErrorSubject.asObservable());
    this.screenshotMode = screenshotMode;
    this.config = config;
    this.basePath = basePath;
    this.page = page;
  }
  allowRequest(url) {
    return !this.config.networkPolicy.enabled || (0, _network_policy.allowRequest)(url, this.config.networkPolicy.rules);
  }
  truncateUrl(url) {
    return (0, _lodash.truncate)(url, {
      length: 100,
      omission: '[truncated]'
    });
  }

  /*
   * Call Page.goto and wait to see the Kibana DOM content
   */
  async open(url, {
    headers,
    context,
    waitForSelector: pageLoadSelector,
    timeout
  }, logger) {
    logger.info(`opening url ${url}`);

    // Reset intercepted request count
    this.interceptedCount = 0;

    /**
     * Integrate with the screenshot mode plugin contract by calling this function before whatever other
     * scripts have run on the browser page.
     */
    await this.page.evaluateOnNewDocument(this.screenshotMode.setScreenshotModeEnabled);
    for (const [key, value] of Object.entries(context !== null && context !== void 0 ? context : {})) {
      await this.page.evaluateOnNewDocument(this.screenshotMode.setScreenshotContext, key, value);
    }
    await this.page.setRequestInterception(true);
    this.registerListeners(url, headers, logger);
    await this.page.goto(url, {
      waitUntil: 'domcontentloaded'
    });
    if (this.config.browser.chromium.inspect) {
      await this.launchDebugger();
    }
    await this.waitForSelector(pageLoadSelector, {
      timeout
    }, {
      context: 'waiting for page load selector'
    }, logger);
    logger.info(`handled ${this.interceptedCount} page requests`);
  }

  /*
   * Let modules poll if Chrome is still running so they can short circuit if needed
   */
  isPageOpen() {
    return !this.page.isClosed();
  }

  /**
   * Despite having "preserveDrawingBuffer": "true" for WebGL driven canvas elements
   * we may still get a blank canvas in PDFs. As a further mitigation
   * we convert WebGL backed canvases to images and inline replace the canvas element.
   * The visual result is identical.
   *
   * The drawback is that we are mutating the page and so if anything were to interact
   * with it after we ran this function it may lead to issues. Ideally, once Chromium
   * fixes how PDFs are generated we can remove this code. See:
   *
   * https://bugs.chromium.org/p/chromium/issues/detail?id=809065
   * https://bugs.chromium.org/p/chromium/issues/detail?id=137576
   *
   * Idea adapted from: https://github.com/puppeteer/puppeteer/issues/1731#issuecomment-864345938
   */
  async workaroundWebGLDrivenCanvases() {
    const canvases = await this.page.$$('canvas');
    for (const canvas of canvases) {
      await canvas.evaluate(thisCanvas => {
        if (thisCanvas.getContext('webgl') || thisCanvas.getContext('webgl2')) {
          const newDiv = document.createElement('div');
          const img = document.createElement('img');
          img.src = thisCanvas.toDataURL('image/png');
          newDiv.appendChild(img);
          thisCanvas.parentNode.replaceChild(newDiv, thisCanvas);
        }
      });
    }
  }

  /**
   * Timeout errors may occur when waiting for data or the brower render events to complete. This mutates the
   * page, and has the drawback anything were to interact with the page after we ran this function, it may lead
   * to issues. Ideally, timeout errors wouldn't occur because ES would return pre-loaded results data
   * statically.
   */
  async injectScreenshottingErrorHeader(error, containerSelector) {
    await this.page.evaluate((selector, text) => {
      var _container;
      let container = document.querySelector(selector);
      if (!container) {
        container = document.querySelector('body');
      }
      const errorBoundary = document.createElement('div');
      errorBoundary.className = 'euiErrorBoundary';
      const divNode = document.createElement('div');
      divNode.className = 'euiCodeBlock euiCodeBlock--fontSmall euiCodeBlock--paddingLarge';
      const preNode = document.createElement('pre');
      preNode.className = 'euiCodeBlock__pre euiCodeBlock__pre--whiteSpacePreWrap';
      const codeNode = document.createElement('code');
      codeNode.className = 'euiCodeBlock__code';
      errorBoundary.appendChild(divNode);
      divNode.appendChild(preNode);
      preNode.appendChild(codeNode);
      codeNode.appendChild(document.createTextNode(text));
      (_container = container) === null || _container === void 0 ? void 0 : _container.insertBefore(errorBoundary, container.firstChild);
    }, containerSelector, error.toString());
  }
  async printA4Pdf({
    title,
    logo,
    error
  }) {
    await this.workaroundWebGLDrivenCanvases();
    if (error) {
      await this.injectScreenshottingErrorHeader(error, (0, _print_layout.getPrintLayoutSelectors)().screenshot);
    }
    return this.page.pdf({
      format: 'a4',
      preferCSSPageSize: true,
      scale: 1,
      landscape: false,
      displayHeaderFooter: true,
      headerTemplate: await (0, _templates.getHeaderTemplate)({
        title
      }),
      footerTemplate: await (0, _templates.getFooterTemplate)({
        logo
      })
    });
  }

  /*
   * Receive a PNG buffer of the page screenshot from Chromium
   */
  async screenshot({
    elementPosition,
    layout,
    error
  }) {
    if (error) {
      await this.injectScreenshottingErrorHeader(error, layout.selectors.screenshot);
    }
    const {
      boundingClientRect,
      scroll
    } = elementPosition;
    const screenshot = await this.page.screenshot({
      clip: {
        x: boundingClientRect.left + scroll.x,
        y: boundingClientRect.top + scroll.y,
        height: boundingClientRect.height,
        width: boundingClientRect.width
      },
      captureBeyondViewport: false // workaround for an internal resize. See: https://github.com/puppeteer/puppeteer/issues/7043
    });

    if (Buffer.isBuffer(screenshot)) {
      return screenshot;
    }
    if (typeof screenshot === 'string') {
      return Buffer.from(screenshot, 'base64');
    }
    return undefined;
  }
  evaluate({
    fn,
    args = []
  }, meta, logger) {
    logger.debug(`evaluate ${meta.context}`);
    return this.page.evaluate(fn, ...args);
  }
  async waitForSelector(selector, opts, context, logger) {
    const {
      timeout
    } = opts;
    logger.debug(`waitForSelector ${selector}`);
    const response = await this.page.waitForSelector(selector, {
      timeout
    }); // override default 30000ms

    if (!response) {
      throw new Error(`Failure in waitForSelector: void response! Context: ${context.context}`);
    }
    logger.debug(`waitForSelector ${selector} resolved`);
    return response;
  }
  async waitFor({
    fn,
    args,
    timeout
  }) {
    await this.page.waitForFunction(fn, {
      timeout,
      polling: WAIT_FOR_DELAY_MS
    }, ...args);
  }

  /**
   * Setting the viewport is required to ensure that all capture elements are visible: anything not in the
   * viewport can not be captured.
   */
  async setViewport({
    width: _width,
    height: _height,
    zoom
  }, logger) {
    const width = Math.floor(_width);
    const height = Math.floor(_height);
    logger.debug(`Setting viewport to: width=${width} height=${height} scaleFactor=${zoom}`);
    await this.page.setViewport({
      width,
      height,
      deviceScaleFactor: zoom,
      isMobile: false
    });
  }
  registerListeners(url, customHeaders, logger) {
    if (this.listenersAttached) {
      return;
    }

    // FIXME: retrieve the client in open() and  pass in the client?
    const client = this.page._client();

    // We have to reach into the Chrome Devtools Protocol to apply headers as using
    // puppeteer's API will cause map tile requests to hang indefinitely:
    //    https://github.com/puppeteer/puppeteer/issues/5003
    // Docs on this client/protocol can be found here:
    //    https://chromedevtools.github.io/devtools-protocol/tot/Fetch
    client.on('Fetch.requestPaused', async interceptedRequest => {
      const {
        requestId,
        request: {
          url: interceptedUrl
        }
      } = interceptedRequest;
      const allowed = !interceptedUrl.startsWith('file://');
      const isData = interceptedUrl.startsWith('data:');

      // We should never ever let file protocol requests go through
      if (!allowed || !this.allowRequest(interceptedUrl)) {
        await client.send('Fetch.failRequest', {
          errorReason: 'Aborted',
          requestId
        });
        this.page.browser().close();
        const error = (0, _.getDisallowedOutgoingUrlError)(interceptedUrl);
        this.screenshottingErrorSubject.next(error);
        logger.error(error);
        return;
      }
      if (this._shouldUseCustomHeaders(url, interceptedUrl)) {
        logger.trace(`Using custom headers for ${interceptedUrl}`);
        const headers = Object.entries({
          ...interceptedRequest.request.headers,
          ...(0, _strip_unsafe_headers.stripUnsafeHeaders)(customHeaders),
          [_server.KBN_SCREENSHOT_MODE_HEADER]: 'true'
        }).flatMap(([name, rawValue]) => {
          const values = Array.isArray(rawValue) ? rawValue : [rawValue !== null && rawValue !== void 0 ? rawValue : ''];
          return values.map(value => ({
            name,
            value
          }));
        });
        try {
          await client.send('Fetch.continueRequest', {
            requestId,
            headers
          });
        } catch (err) {
          logger.error(`Failed to complete a request using headers: ${err.message}`);
        }
      } else {
        const loggedUrl = isData ? this.truncateUrl(interceptedUrl) : interceptedUrl;
        logger.trace(`No custom headers for ${loggedUrl}`);
        try {
          await client.send('Fetch.continueRequest', {
            requestId
          });
        } catch (err) {
          logger.error(`Failed to complete a request: ${err.message}`);
        }
      }
      this.interceptedCount = this.interceptedCount + (isData ? 0 : 1);
    });
    this.page.on('response', interceptedResponse => {
      const interceptedUrl = interceptedResponse.url();
      const allowed = !interceptedUrl.startsWith('file://');
      const status = interceptedResponse.status();
      if (status >= 400 && !interceptedResponse.ok()) {
        logger.warn(`Chromium received a non-OK response (${status}) for request ${interceptedUrl}`);
      }
      if (!allowed || !this.allowRequest(interceptedUrl)) {
        this.page.browser().close();
        const error = (0, _.getDisallowedOutgoingUrlError)(interceptedUrl);
        this.screenshottingErrorSubject.next(error);
        logger.error(error);
        return;
      }
    });
    this.listenersAttached = true;
  }
  async launchDebugger() {
    // In order to pause on execution we have to reach more deeply into Chromiums Devtools Protocol,
    // and more specifically, for the page being used. _client is per-page.
    // In order to get the inspector running, we have to know the page's internal ID (again, private)
    // in order to construct the final debugging URL.

    const client = this.page._client();
    const target = this.page.target();
    const targetId = target._targetId;
    await client.send('Debugger.enable');
    await client.send('Debugger.pause');
    const wsEndpoint = this.page.browser().wsEndpoint();
    const {
      port
    } = (0, _url.parse)(wsEndpoint);
    (0, _opn.default)(`http://localhost:${port}/devtools/inspector.html?ws=localhost:${port}/devtools/page/${targetId}`);
  }
  _shouldUseCustomHeaders(sourceUrl, targetUrl) {
    const {
      hostname: sourceHostname,
      protocol: sourceProtocol,
      port: sourcePort
    } = (0, _url.parse)(sourceUrl);
    const {
      hostname: targetHostname,
      protocol: targetProtocol,
      port: targetPort,
      pathname: targetPathname
    } = (0, _url.parse)(targetUrl);
    if (targetPathname === null) {
      throw new Error(`URL missing pathname: ${targetUrl}`);
    }

    // `port` is null in URLs that don't explicitly state it,
    // however we can derive the port from the protocol (http/https)
    // IE: https://feeds.elastic.co/kibana/v8.0.0.json
    const derivedPort = (protocol, port, url) => {
      if (port) {
        return port;
      }
      if (protocol === 'http:') {
        return '80';
      }
      if (protocol === 'https:') {
        return '443';
      }
      throw new Error(`URL missing port: ${url}`);
    };
    return sourceHostname === targetHostname && sourceProtocol === targetProtocol && derivedPort(sourceProtocol, sourcePort, sourceUrl) === derivedPort(targetProtocol, targetPort, targetUrl) && targetPathname.startsWith(`${this.basePath}/`);
  }
}
exports.HeadlessChromiumDriver = HeadlessChromiumDriver;