"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeadlessChromiumDriverFactory = exports.DEFAULT_VIEWPORT = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _utils = require("@kbn/utils");
var _child_process = require("child_process");
var _del = _interopRequireDefault(require("del"));
var _fs = _interopRequireDefault(require("fs"));
var _lodash = require("lodash");
var _path = _interopRequireDefault(require("path"));
var _puppeteer = _interopRequireDefault(require("puppeteer"));
var _readline = require("readline");
var Rx = _interopRequireWildcard(require("rxjs"));
var _operators = require("rxjs/operators");
var _ = require("..");
var _common = require("../../../../common");
var _safe_child_process = require("../../safe_child_process");
var _driver = require("../driver");
var _args = require("./args");
var _metrics = require("./metrics");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Size of the desired initial viewport. This is needed to render the app before elements load into their
 * layout. Once the elements are positioned, the viewport must be *resized* to include the entire element container.
 */
const DEFAULT_VIEWPORT = {
  width: 1950,
  height: 1200,
  deviceScaleFactor: 1
};

// Default args used by pptr
// https://github.com/puppeteer/puppeteer/blob/13ea347/src/node/Launcher.ts#L168
exports.DEFAULT_VIEWPORT = DEFAULT_VIEWPORT;
const DEFAULT_ARGS = ['--disable-background-networking', '--enable-features=NetworkService,NetworkServiceInProcess', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--disable-breakpad', '--disable-client-side-phishing-detection', '--disable-component-extensions-with-background-pages', '--disable-default-apps', '--disable-dev-shm-usage', '--disable-extensions', '--disable-features=TranslateUI', '--disable-hang-monitor', '--disable-ipc-flooding-protection', '--disable-popup-blocking', '--disable-prompt-on-repost', '--disable-renderer-backgrounding', '--disable-sync', '--force-color-profile=srgb', '--metrics-recording-only', '--no-first-run', '--enable-automation', '--password-store=basic', '--use-mock-keychain', '--remote-debugging-port=0', '--headless'];
const DIAGNOSTIC_TIME = 5 * 1000;
class HeadlessChromiumDriverFactory {
  constructor(screenshotMode, config, logger, binaryPath, basePath) {
    (0, _defineProperty2.default)(this, "userDataDir", void 0);
    (0, _defineProperty2.default)(this, "type", 'chromium');
    this.screenshotMode = screenshotMode;
    this.config = config;
    this.logger = logger;
    this.binaryPath = binaryPath;
    this.basePath = basePath;
    const dataDir = (0, _utils.getDataPath)();
    _fs.default.mkdirSync(dataDir, {
      recursive: true
    });
    this.userDataDir = _fs.default.mkdtempSync(_path.default.join(dataDir, 'chromium-'));
  }
  getChromiumArgs() {
    return (0, _args.args)({
      userDataDir: this.userDataDir,
      disableSandbox: this.config.browser.chromium.disableSandbox,
      proxy: this.config.browser.chromium.proxy,
      windowSize: DEFAULT_VIEWPORT // Approximate the default viewport size
    });
  }

  /*
   * Return an observable to objects which will drive screenshot capture for a page
   */
  createPage({
    browserTimezone,
    openUrlTimeout,
    defaultViewport
  }, pLogger = this.logger) {
    return new Rx.Observable(observer => {
      var _defaultViewport$widt, _defaultViewport$devi;
      const logger = pLogger.get('browser-driver');
      logger.info(`Creating browser page driver`);
      const chromiumArgs = this.getChromiumArgs();
      logger.debug(`Chromium launch args set to: ${chromiumArgs}`);

      // We set the viewport width using the client-side layout info to reduce the chances of
      // browser reflow. Only the window height is expected to be adjusted dramatically
      // before taking a screenshot, to ensure the elements to capture are contained in the viewport.
      const viewport = {
        ...DEFAULT_VIEWPORT,
        width: (_defaultViewport$widt = defaultViewport.width) !== null && _defaultViewport$widt !== void 0 ? _defaultViewport$widt : DEFAULT_VIEWPORT.width,
        deviceScaleFactor: (_defaultViewport$devi = defaultViewport.deviceScaleFactor) !== null && _defaultViewport$devi !== void 0 ? _defaultViewport$devi : DEFAULT_VIEWPORT.deviceScaleFactor
      };
      logger.debug(`Launching with viewport: width=${viewport.width} height=${viewport.height} scaleFactor=${viewport.deviceScaleFactor}`);
      (async () => {
        let browser;
        try {
          browser = await _puppeteer.default.launch({
            pipe: !this.config.browser.chromium.inspect,
            userDataDir: this.userDataDir,
            executablePath: this.binaryPath,
            ignoreHTTPSErrors: true,
            handleSIGHUP: false,
            args: chromiumArgs,
            defaultViewport: viewport,
            env: {
              TZ: browserTimezone
            }
          });
        } catch (err) {
          observer.error(new _common.errors.FailedToSpawnBrowserError(`Error spawning Chromium browser! ${err}`));
          return;
        }
        const page = await browser.newPage();
        const devTools = await page.target().createCDPSession();
        await devTools.send('Performance.enable', {
          timeDomain: 'timeTicks'
        });
        const startMetrics = await devTools.send('Performance.getMetrics');

        // Log version info for debugging / maintenance
        const versionInfo = await devTools.send('Browser.getVersion');
        logger.debug(`Browser version: ${JSON.stringify(versionInfo)}`);
        await page.emulateTimezone(browserTimezone);

        // Set the default timeout for all navigation methods to the openUrl timeout
        // All waitFor methods have their own timeout config passed in to them
        page.setDefaultTimeout(openUrlTimeout);
        logger.debug(`Browser page driver created`);
        const childProcess = {
          async kill() {
            if (page.isClosed()) {
              return {};
            }
            let metrics;
            try {
              if (devTools && startMetrics) {
                const endMetrics = await devTools.send('Performance.getMetrics');
                metrics = (0, _metrics.getMetrics)(startMetrics, endMetrics);
                const {
                  cpuInPercentage,
                  memoryInMegabytes
                } = metrics;
                logger.debug(`Chromium consumed CPU ${cpuInPercentage}% Memory ${memoryInMegabytes}MB`);
              }
            } catch (error) {
              logger.error(error);
            }
            try {
              var _browser;
              logger.debug('Attempting to close browser...');
              await ((_browser = browser) === null || _browser === void 0 ? void 0 : _browser.close());
              logger.debug('Browser closed.');
            } catch (err) {
              // do not throw
              logger.error(err);
            }
            return {
              metrics
            };
          }
        };
        const {
          terminate$
        } = (0, _safe_child_process.safeChildProcess)(logger, childProcess);

        // Ensure that the browser is closed once the observable completes.
        observer.add(() => {
          if (page.isClosed()) return; // avoid emitting a log unnecessarily
          logger.debug(`It looks like the browser is no longer being used. Closing the browser...`);
          childProcess.kill(); // ignore async
        });

        // make the observer subscribe to terminate$
        observer.add(terminate$.pipe((0, _operators.tap)(signal => {
          logger.debug(`Termination signal received: ${signal}`);
        }), (0, _operators.ignoreElements)()).subscribe(observer));

        // taps the browser log streams and combine them to Kibana logs
        this.getBrowserLogger(page, logger).subscribe();
        this.getProcessLogger(browser, logger).subscribe();

        // HeadlessChromiumDriver: object to "drive" a browser page
        const driver = new _driver.HeadlessChromiumDriver(this.screenshotMode, this.config, this.basePath, page);
        const error$ = Rx.concat(driver.screenshottingError$, this.getPageExit(browser, page)).pipe((0, _operators.mergeMap)(err => Rx.throwError(err)));
        const close = () => Rx.from(childProcess.kill());
        observer.next({
          driver,
          error$,
          close
        });

        // unsubscribe logic makes a best-effort attempt to delete the user data directory used by chromium
        observer.add(() => {
          const userDataDir = this.userDataDir;
          logger.debug(`deleting chromium user data directory at [${userDataDir}]`);
          // the unsubscribe function isn't `async` so we're going to make our best effort at
          // deleting the userDataDir and if it fails log an error.
          (0, _del.default)(userDataDir, {
            force: true
          }).catch(error => {
            logger.error(`error deleting user data directory at [${userDataDir}]!`);
            logger.error(error);
          });
        });
      })();
    });
  }

  /**
   * In certain cases the browser will emit an error object to console. To ensure
   * we extract the message from the error object we need to go the browser's context
   * and look at the error there.
   *
   * If we don't do this we we will get a string that says "JSHandle@error" from
   * line.text().
   *
   * See https://github.com/puppeteer/puppeteer/issues/3397.
   */
  async getErrorMessage(message) {
    for (const arg of message.args()) {
      const errorMessage = await arg.evaluate(_arg => {
        /* !! We are now in the browser context !! */
        if (_arg instanceof Error) {
          return _arg.message;
        }
        return undefined;
        /* !! End of browser context !! */
      }, arg);
      if (errorMessage) {
        return errorMessage;
      }
    }
  }
  getBrowserLogger(page, logger) {
    const consoleMessages$ = Rx.fromEvent(page, 'console').pipe((0, _operators.concatMap)(async line => {
      var _line$text, _line$location2;
      if (line.type() === 'error') {
        var _await$this$getErrorM, _line$location;
        logger.get('headless-browser-console').error(`Error in browser console: { message: "${(_await$this$getErrorM = await this.getErrorMessage(line)) !== null && _await$this$getErrorM !== void 0 ? _await$this$getErrorM : line.text()}", url: "${(_line$location = line.location()) === null || _line$location === void 0 ? void 0 : _line$location.url}" }`);
        return;
      }
      logger.get(`headless-browser-console:${line.type()}`).debug(`Message in browser console: { text: "${(_line$text = line.text()) === null || _line$text === void 0 ? void 0 : _line$text.trim()}", url: ${(_line$location2 = line.location()) === null || _line$location2 === void 0 ? void 0 : _line$location2.url} }`);
    }));
    const uncaughtExceptionPageError$ = Rx.fromEvent(page, 'pageerror').pipe((0, _operators.map)(err => {
      logger.warn(`Reporting encountered an uncaught error on the page that will be ignored: ${err.message}`);
    }));
    const pageRequestFailed$ = Rx.fromEvent(page, 'requestfailed').pipe((0, _operators.map)(req => {
      const failure = req.failure && req.failure();
      if (failure) {
        logger.warn(`Request to [${req.url()}] failed! [${failure.errorText}]. This error will be ignored.`);
      }
    }));
    return Rx.merge(consoleMessages$, uncaughtExceptionPageError$, pageRequestFailed$);
  }
  getProcessLogger(browser, logger) {
    const childProcess = browser.process();
    // NOTE: The browser driver can not observe stdout and stderr of the child process
    // Puppeteer doesn't give a handle to the original ChildProcess object
    // See https://github.com/GoogleChrome/puppeteer/issues/1292#issuecomment-521470627

    if (childProcess == null) {
      throw new TypeError('childProcess is null or undefined!');
    }

    // just log closing of the process
    const processClose$ = Rx.fromEvent(childProcess, 'close').pipe((0, _operators.tap)(() => {
      logger.get('headless-browser-process').debug('child process closed');
    }));
    return processClose$; // ideally, this would also merge with observers for stdout and stderr
  }

  getPageExit(browser, page) {
    const pageError$ = Rx.fromEvent(page, 'error').pipe((0, _operators.map)(err => new Error(`Reporting encountered an error: ${err.toString()}`)));
    const browserDisconnect$ = Rx.fromEvent(browser, 'disconnected').pipe((0, _operators.map)(() => (0, _.getChromiumDisconnectedError)()));
    return Rx.merge(pageError$, browserDisconnect$);
  }
  diagnose(overrideFlags = []) {
    const kbnArgs = this.getChromiumArgs();
    const finalArgs = (0, _lodash.uniq)([...DEFAULT_ARGS, ...kbnArgs, ...overrideFlags]);

    // On non-windows platforms, `detached: true` makes child process a
    // leader of a new process group, making it possible to kill child
    // process tree with `.kill(-pid)` command. @see
    // https://nodejs.org/api/child_process.html#child_process_options_detached
    const browserProcess = (0, _child_process.spawn)(this.binaryPath, finalArgs, {
      detached: process.platform !== 'win32'
    });
    const rl = (0, _readline.createInterface)({
      input: browserProcess.stderr
    });
    const exit$ = Rx.fromEvent(browserProcess, 'exit').pipe((0, _operators.map)(code => {
      this.logger.error(`Browser exited abnormally, received code: ${code}`);
      return `Browser exited abnormally during startup`;
    }));
    const error$ = Rx.fromEvent(browserProcess, 'error').pipe((0, _operators.map)(err => {
      this.logger.error(`Browser process threw an error on startup`);
      this.logger.error(err);
      return `Browser process threw an error on startup`;
    }));
    const browserProcessLogger = this.logger.get('chromium-stderr');
    const log$ = Rx.fromEvent(rl, 'line').pipe((0, _operators.tap)(message => {
      if (typeof message === 'string') {
        browserProcessLogger.info(message);
      }
    }));

    // Collect all events (exit, error and on log-lines), but let chromium keep spitting out
    // logs as sometimes it's "bind" successfully for remote connections, but later emit
    // a log indicative of an issue (for example, no default font found).
    return Rx.merge(exit$, error$, log$).pipe((0, _operators.takeUntil)(Rx.timer(DIAGNOSTIC_TIME)), (0, _operators.reduce)((acc, curr) => `${acc}${curr}\n`, ''), (0, _operators.tap)(() => {
      if (browserProcess && browserProcess.pid && !browserProcess.killed) {
        browserProcess.kill('SIGKILL');
        this.logger.info(`Successfully sent 'SIGKILL' to browser process (PID: ${browserProcess.pid})`);
      }
      browserProcess.removeAllListeners();
      rl.removeAllListeners();
      rl.close();
      (0, _del.default)(this.userDataDir, {
        force: true
      }).catch(error => {
        this.logger.error(`Error deleting user data directory at [${this.userDataDir}]!`);
        this.logger.error(error);
      });
    }), (0, _operators.catchError)(error => {
      this.logger.error(error);
      return Rx.of(error);
    }));
  }
}
exports.HeadlessChromiumDriverFactory = HeadlessChromiumDriverFactory;