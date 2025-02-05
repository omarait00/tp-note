"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Execution = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _i18n = require("@kbn/i18n");
var _std = require("@kbn/std");
var _lodash = require("lodash");
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _common = require("../../../kibana_utils/common");
var _container = require("./container");
var _util = require("../util");
var _error = require("../expression_types/specs/error");
var _ast = require("../ast");
var _expression_types = require("../expression_types");
var _get_by_alias = require("../util/get_by_alias");
var _execution_contract = require("./execution_contract");
var _create_default_inspector_adapters = require("../util/create_default_inspector_adapters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const createAbortErrorValue = () => (0, _util.createError)({
  message: 'The expression was aborted.',
  name: 'AbortError'
});
function markPartial() {
  return source => new _rxjs.Observable(subscriber => {
    let latest;
    subscriber.add(source.subscribe({
      next: result => {
        latest = {
          result,
          partial: true
        };
        subscriber.next(latest);
      },
      error: error => subscriber.error(error),
      complete: () => {
        if (latest) {
          latest.partial = false;
        }
        subscriber.complete();
      }
    }));
    subscriber.add(() => {
      latest = undefined;
    });
  });
}

/**
 * RxJS' `throttle` operator does not emit the last value immediately when the source observable is completed.
 * Instead, it waits for the next throttle period to emit that.
 * It might cause delays until we get the final value, even though it is already there.
 * @see https://github.com/ReactiveX/rxjs/blob/master/src/internal/operators/throttle.ts#L121
 */
function throttle(timeout) {
  return source => new _rxjs.Observable(subscriber => {
    let latest;
    let hasValue = false;
    const emit = () => {
      if (hasValue) {
        subscriber.next(latest);
        hasValue = false;
        latest = undefined;
      }
    };
    let throttled;
    const timer$ = (0, _rxjs.timer)(0, timeout).pipe((0, _rxjs.takeWhile)(() => hasValue), (0, _operators.finalize)(() => {
      subscriber.remove(throttled);
      throttled = undefined;
    }));
    subscriber.add(source.subscribe({
      next: value => {
        latest = value;
        hasValue = true;
        if (!throttled) {
          throttled = timer$.subscribe(emit);
          subscriber.add(throttled);
        }
      },
      error: error => subscriber.error(error),
      complete: () => {
        emit();
        subscriber.complete();
      }
    }));
    subscriber.add(() => {
      hasValue = false;
      latest = undefined;
    });
  });
}
function takeUntilAborted(signal) {
  return source => new _rxjs.Observable(subscriber => {
    const throwAbortError = () => {
      subscriber.error(new _common.AbortError());
    };
    subscriber.add(source.subscribe(subscriber));
    subscriber.add(() => signal.removeEventListener('abort', throwAbortError));
    signal.addEventListener('abort', throwAbortError);
    if (signal.aborted) {
      throwAbortError();
    }
  });
}
class Execution {
  /**
   * Dynamic state of the execution.
   */

  /**
   * Initial input of the execution.
   *
   * N.B. It is initialized to `null` rather than `undefined` for legacy reasons,
   * because in legacy interpreter it was set to `null` by default.
   */

  /**
   * Input of the started execution.
   */

  /**
   * Execution context - object that allows to do side-effects. Context is passed
   * to every function.
   */

  /**
   * AbortController to cancel this Execution.
   */

  /**
   * Whether .start() method has been called.
   */

  /**
   * Future that tracks result or error of this execution.
   */

  /**
   * Keeping track of any child executions
   * Needed to cancel child executions in case parent execution is canceled
   * @private
   */

  /**
   * Contract is a public representation of `Execution` instances. Contract we
   * can return to other plugins for their consumption.
   */

  get inspectorAdapters() {
    return this.context.inspectorAdapters;
  }
  constructor(execution, logger) {
    (0, _defineProperty2.default)(this, "state", void 0);
    (0, _defineProperty2.default)(this, "input", null);
    (0, _defineProperty2.default)(this, "input$", new _rxjs.ReplaySubject(1));
    (0, _defineProperty2.default)(this, "context", void 0);
    (0, _defineProperty2.default)(this, "abortController", new AbortController());
    (0, _defineProperty2.default)(this, "hasStarted", false);
    (0, _defineProperty2.default)(this, "result", void 0);
    (0, _defineProperty2.default)(this, "childExecutions", []);
    (0, _defineProperty2.default)(this, "contract", void 0);
    (0, _defineProperty2.default)(this, "expression", void 0);
    this.execution = execution;
    this.logger = logger;
    const {
      executor
    } = execution;
    this.contract = new _execution_contract.ExecutionContract(this);
    if (!execution.ast && !execution.expression) {
      throw new TypeError('Execution params should contain at least .ast or .expression key.');
    } else if (execution.ast && execution.expression) {
      throw new TypeError('Execution params cannot contain both .ast and .expression key.');
    }
    this.expression = execution.expression || (0, _ast.formatExpression)(execution.ast);
    const ast = execution.ast || (0, _ast.parseExpression)(this.expression);
    this.state = (0, _container.createExecutionContainer)({
      ...executor.state,
      state: 'not-started',
      ast
    });
    const inspectorAdapters = execution.params.inspectorAdapters || (0, _create_default_inspector_adapters.createDefaultInspectorAdapters)();
    this.context = {
      getSearchContext: () => this.execution.params.searchContext || {},
      getSearchSessionId: () => execution.params.searchSessionId,
      getKibanaRequest: execution.params.kibanaRequest ? () => execution.params.kibanaRequest : undefined,
      variables: execution.params.variables || {},
      types: executor.getTypes(),
      abortSignal: this.abortController.signal,
      inspectorAdapters,
      logDatatable: (name, datatable) => {
        inspectorAdapters.tables[name] = datatable;
      },
      isSyncColorsEnabled: () => execution.params.syncColors,
      isSyncCursorEnabled: () => execution.params.syncCursor,
      isSyncTooltipsEnabled: () => execution.params.syncTooltips,
      ...execution.executor.context,
      getExecutionContext: () => execution.params.executionContext
    };
    this.result = this.input$.pipe((0, _operators.switchMap)(input => this.invokeChain(this.state.get().ast.chain, input).pipe(takeUntilAborted(this.abortController.signal), markPartial(), this.execution.params.partial && this.execution.params.throttle ? throttle(this.execution.params.throttle) : _rxjs.identity)), (0, _operators.catchError)(error => {
      if (this.abortController.signal.aborted) {
        this.childExecutions.forEach(childExecution => childExecution.cancel());
        return (0, _rxjs.of)({
          result: createAbortErrorValue(),
          partial: false
        });
      }
      return (0, _rxjs.throwError)(error);
    }), (0, _operators.tap)({
      next: result => {
        var _this$context$inspect;
        (_this$context$inspect = this.context.inspectorAdapters.expression) === null || _this$context$inspect === void 0 ? void 0 : _this$context$inspect.logAST(this.state.get().ast);
        this.state.transitions.setResult(result);
      },
      error: error => this.state.transitions.setError(error)
    }), (0, _operators.shareReplay)(1));
  }

  /**
   * Stop execution of expression.
   */
  cancel() {
    this.abortController.abort();
  }

  /**
   * Call this method to start execution.
   *
   * N.B. `input` is initialized to `null` rather than `undefined` for legacy reasons,
   * because in legacy interpreter it was set to `null` by default.
   */
  start(input = null, isSubExpression) {
    if (this.hasStarted) throw new Error('Execution already started.');
    this.hasStarted = true;
    this.input = input;
    this.state.transitions.start();
    if (!isSubExpression) {
      var _this$context$inspect2;
      (_this$context$inspect2 = this.context.inspectorAdapters.requests) === null || _this$context$inspect2 === void 0 ? void 0 : _this$context$inspect2.reset();
    }
    if ((0, _rxjs.isObservable)(input)) {
      input.subscribe(this.input$);
    } else if ((0, _std.isPromise)(input)) {
      (0, _rxjs.from)(input).subscribe(this.input$);
    } else {
      (0, _rxjs.of)(input).subscribe(this.input$);
    }
    return this.result;
  }
  invokeChain([head, ...tail], input) {
    if (!head) {
      return (0, _rxjs.of)(input);
    }
    return (0, _rxjs.defer)(() => {
      const {
        function: fnName,
        arguments: fnArgs
      } = head;
      const fn = (0, _get_by_alias.getByAlias)(this.state.get().functions, fnName, this.execution.params.namespace);
      if (!fn) {
        throw (0, _util.createError)({
          name: 'fn not found',
          message: _i18n.i18n.translate('expressions.execution.functionNotFound', {
            defaultMessage: `Function {fnName} could not be found.`,
            values: {
              fnName
            }
          })
        });
      }
      if (fn.disabled) {
        throw (0, _util.createError)({
          name: 'fn is disabled',
          message: _i18n.i18n.translate('expressions.execution.functionDisabled', {
            defaultMessage: `Function {fnName} is disabled.`,
            values: {
              fnName
            }
          })
        });
      }
      if (fn.deprecated) {
        var _this$logger;
        (_this$logger = this.logger) === null || _this$logger === void 0 ? void 0 : _this$logger.warn(`Function '${fnName}' is deprecated`);
      }
      if (this.execution.params.debug) {
        head.debug = {
          input,
          args: {},
          duration: 0,
          fn: fn.name,
          success: true
        };
      }
      const timeStart = this.execution.params.debug ? (0, _common.now)() : 0;

      // `resolveArgs` returns an object because the arguments themselves might
      // actually have `then` or `subscribe` methods which would be treated as a `Promise`
      // or an `Observable` accordingly.
      return this.resolveArgs(fn, input, fnArgs).pipe((0, _operators.switchMap)(resolvedArgs => {
        const args$ = (0, _error.isExpressionValueError)(resolvedArgs) ? (0, _rxjs.throwError)(resolvedArgs.error) : (0, _rxjs.of)(resolvedArgs);
        return args$.pipe((0, _operators.tap)(args => this.execution.params.debug && Object.assign(head.debug, {
          args
        })), (0, _operators.switchMap)(args => this.invokeFunction(fn, input, args)), this.execution.params.partial ? _rxjs.identity : (0, _rxjs.last)(), (0, _operators.switchMap)(output => (0, _expression_types.getType)(output) === 'error' ? (0, _rxjs.throwError)(output) : (0, _rxjs.of)(output)), (0, _operators.tap)(output => this.execution.params.debug && Object.assign(head.debug, {
          output
        })), (0, _operators.switchMap)(output => this.invokeChain(tail, output)), (0, _operators.catchError)(rawError => {
          const error = (0, _util.createError)(rawError);
          error.error.message = `[${fnName}] > ${error.error.message}`;
          if (this.execution.params.debug) {
            Object.assign(head.debug, {
              error,
              rawError,
              success: false
            });
          }
          return (0, _rxjs.of)(error);
        }));
      }), (0, _operators.finalize)(() => {
        if (this.execution.params.debug) {
          Object.assign(head.debug, {
            duration: (0, _common.now)() - timeStart
          });
        }
      }));
    }).pipe((0, _operators.catchError)(error => (0, _rxjs.of)(error)));
  }
  invokeFunction(fn, input, args) {
    return (0, _rxjs.of)(input).pipe((0, _operators.map)(currentInput => this.cast(currentInput, fn.inputTypes)), (0, _operators.switchMap)(normalizedInput => (0, _rxjs.of)(fn.fn(normalizedInput, args, this.context))), (0, _operators.switchMap)(fnResult => (0, _rxjs.isObservable)(fnResult) ? fnResult : (0, _rxjs.from)((0, _std.isPromise)(fnResult) ? fnResult : [fnResult])), (0, _operators.map)(output => {
      // Validate that the function returned the type it said it would.
      // This isn't required, but it keeps function developers honest.
      const returnType = (0, _expression_types.getType)(output);
      const expectedType = fn.type;
      if (expectedType && returnType !== expectedType) {
        throw new Error(`Function '${fn.name}' should return '${expectedType}',` + ` actually returned '${returnType}'`);
      }

      // Validate the function output against the type definition's validate function.
      const type = this.context.types[fn.type];
      if (type && type.validate) {
        try {
          type.validate(output);
        } catch (e) {
          throw new Error(`Output of '${fn.name}' is not a valid type '${fn.type}': ${e}`);
        }
      }
      return output;
    }));
  }
  cast(value, toTypeNames) {
    // If you don't give us anything to cast to, you'll get your input back
    if (!(toTypeNames !== null && toTypeNames !== void 0 && toTypeNames.length)) {
      return value;
    }

    // No need to cast if node is already one of the valid types
    const fromTypeName = (0, _expression_types.getType)(value);
    if (toTypeNames.includes(fromTypeName)) {
      return value;
    }
    const {
      types
    } = this.state.get();
    const fromTypeDef = types[fromTypeName];
    for (const toTypeName of toTypeNames) {
      // First check if the current type can cast to this type
      if (fromTypeDef !== null && fromTypeDef !== void 0 && fromTypeDef.castsTo(toTypeName)) {
        return fromTypeDef.to(value, toTypeName, types);
      }

      // If that isn't possible, check if this type can cast from the current type
      const toTypeDef = types[toTypeName];
      if (toTypeDef !== null && toTypeDef !== void 0 && toTypeDef.castsFrom(fromTypeName)) {
        return toTypeDef.from(value, types);
      }
    }
    throw (0, _util.createError)({
      name: 'invalid value',
      message: `Can not cast '${fromTypeName}' to any of '${toTypeNames.join(', ')}'`
    });
  }
  validate(value, argDef) {
    var _argDef$options;
    if ((_argDef$options = argDef.options) !== null && _argDef$options !== void 0 && _argDef$options.length && !argDef.options.includes(value)) {
      var _this$logger2;
      const message = `Value '${value}' is not among the allowed options for argument '${argDef.name}': '${argDef.options.join("', '")}'`;
      if (argDef.strict) {
        throw (0, _util.createError)({
          message,
          name: 'invalid argument'
        });
      }
      (_this$logger2 = this.logger) === null || _this$logger2 === void 0 ? void 0 : _this$logger2.warn(message);
    }
  }

  // Processes the multi-valued AST argument values into arguments that can be passed to the function
  resolveArgs(fnDef, input, argAsts) {
    return (0, _rxjs.defer)(() => {
      const {
        args: argDefs
      } = fnDef;

      // Use the non-alias name from the argument definition
      const dealiasedArgAsts = (0, _lodash.reduce)(argAsts, (acc, argAst, argName) => {
        const argDef = (0, _get_by_alias.getByAlias)(argDefs, argName);
        if (!argDef) {
          throw (0, _util.createError)({
            name: 'unknown argument',
            message: `Unknown argument '${argName}' passed to function '${fnDef.name}'`
          });
        }
        if (argDef.deprecated && !acc[argDef.name]) {
          var _this$logger3;
          (_this$logger3 = this.logger) === null || _this$logger3 === void 0 ? void 0 : _this$logger3.warn(`Argument '${argName}' is deprecated in function '${fnDef.name}'`);
        }
        acc[argDef.name] = (acc[argDef.name] || []).concat(argAst);
        return acc;
      }, {});

      // Check for missing required arguments.
      for (const {
        default: argDefault,
        name,
        required
      } of Object.values(argDefs)) {
        if (!(name in dealiasedArgAsts) && typeof argDefault !== 'undefined') {
          dealiasedArgAsts[name] = [(0, _ast.parse)(argDefault, 'argument')];
        }
        if (!required || name in dealiasedArgAsts) {
          continue;
        }
        throw (0, _util.createError)({
          name: 'missing argument',
          message: `${fnDef.name} requires the "${name}" argument`
        });
      }

      // Create the functions to resolve the argument ASTs into values
      // These are what are passed to the actual functions if you opt out of resolving
      const resolveArgFns = (0, _lodash.mapValues)(dealiasedArgAsts, (asts, argName) => asts.map(item => (subInput = input) => this.interpret(item, subInput).pipe((0, _operators.pluck)('result'), (0, _operators.switchMap)(output => {
        if ((0, _error.isExpressionValueError)(output)) {
          return (0, _rxjs.of)(output);
        }
        return (0, _rxjs.of)(output).pipe((0, _operators.map)(value => this.cast(value, argDefs[argName].types)), (0, _operators.tap)(value => this.validate(value, argDefs[argName])), (0, _operators.catchError)(error => (0, _rxjs.of)(error)));
      }))));
      const argNames = (0, _lodash.keys)(resolveArgFns);
      if (!argNames.length) {
        return (0, _rxjs.from)([{}]);
      }
      return (0, _rxjs.combineLatest)(argNames.map(argName => {
        const interpretFns = resolveArgFns[argName];

        // `combineLatest` does not emit a value on an empty collection
        // @see https://github.com/ReactiveX/RxSwift/issues/1879
        if (!interpretFns.length) {
          return (0, _rxjs.of)([]);
        }
        return argDefs[argName].resolve ? (0, _rxjs.combineLatest)(interpretFns.map(fn => fn())).pipe((0, _operators.map)(values => {
          var _values$find;
          return (_values$find = values.find(_error.isExpressionValueError)) !== null && _values$find !== void 0 ? _values$find : values;
        })) : (0, _rxjs.of)(interpretFns);
      })).pipe((0, _operators.map)(values => {
        var _values$find2;
        return (_values$find2 = values.find(_error.isExpressionValueError)) !== null && _values$find2 !== void 0 ? _values$find2 : (0, _lodash.mapValues)(
        // Return an object here because the arguments themselves might actually have a 'then'
        // function which would be treated as a promise
        (0, _lodash.zipObject)(argNames, values),
        // Just return the last unless the argument definition allows multiple
        (argValues, argName) => argDefs[argName].multi ? argValues : (0, _lodash.last)(argValues));
      }));
    }).pipe((0, _operators.catchError)(error => (0, _rxjs.of)(error)));
  }
  interpret(ast, input) {
    switch ((0, _expression_types.getType)(ast)) {
      case 'expression':
        const execution = this.execution.executor.createExecution(ast, {
          ...this.execution.params,
          variables: this.context.variables
        });
        this.childExecutions.push(execution);
        return execution.start(input, true);
      case 'string':
      case 'number':
      case 'null':
      case 'boolean':
        return (0, _rxjs.of)({
          result: ast,
          partial: false
        });
      default:
        return (0, _rxjs.throwError)(new Error(`Unknown AST object: ${JSON.stringify(ast)}`));
    }
  }
}
exports.Execution = Execution;