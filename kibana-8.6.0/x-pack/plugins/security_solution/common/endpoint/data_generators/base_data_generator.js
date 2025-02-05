"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseDataGenerator = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _seedrandom = _interopRequireDefault(require("seedrandom"));
var _uuid = _interopRequireDefault(require("uuid"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const OS_FAMILY = ['windows', 'macos', 'linux'];
/** Array of 14 day offsets */
const DAY_OFFSETS = Array.from({
  length: 14
}, (_, i) => 8.64e7 * (i + 1));
const USERS = ['elastic', 'shay', 'Damian', 'Sarai', 'Deirdre', 'Shawana', 'Treena', 'Ellamae', 'Myriam', 'Roberto', 'Cordell', 'Demetrice', 'Audrea', 'Shanel', 'Gail', 'Hermila', 'Mara', 'Elden', 'Malisa', 'Derick', 'Teddy', 'Dovie', 'Betty', 'Kay', 'Sharice', 'Evalyn', 'Teressa', 'Teisha', 'Marianne', 'Cherelle', 'Tabitha', 'Deneen', 'Leo', 'Tess', 'Clair', 'Marty', 'Dexter', 'Candis', 'Dina', 'Bennett', 'Vesta', 'Trinity', 'Drusilla', 'Bree', 'Bryon', 'Johnson', 'Justa', 'Jada', 'Armand', 'Raeann', 'Yolande', 'Genevieve'];
const toEsSearchHit = (hitSource, index = 'some-index') => {
  return {
    _index: index,
    _id: '123',
    _score: 1.0,
    _source: hitSource
  };
};
const toEsSearchResponse = hitsSource => {
  return {
    took: 3,
    timed_out: false,
    _shards: {
      total: 2,
      successful: 2,
      skipped: 0,
      failed: 0
    },
    hits: {
      total: {
        value: hitsSource.length,
        relation: 'eq'
      },
      max_score: 0,
      hits: hitsSource
    }
  };
};

/**
 * A generic base class to assist in creating domain specific data generators. It includes
 * several general purpose random data generators for use within the class and exposes one
 * public method named `generate()` which should be implemented by sub-classes.
 */
class BaseDataGenerator {
  /** A javascript seeded random number (float between 0 and 1). Don't use `Math.random()` */

  constructor(seed = Math.random().toString()) {
    (0, _defineProperty2.default)(this, "random", void 0);
    if (typeof seed === 'string') {
      this.random = (0, _seedrandom.default)(seed);
    } else {
      this.random = seed;
    }
  }

  /**
   * Generate a new record
   */
  generate() {
    throw new Error('method not implemented!');
  }
  randomUser() {
    return this.randomChoice(USERS);
  }

  /** Returns a future ISO date string */
  randomFutureDate(from) {
    const now = from ? from.getTime() : Date.now();
    return new Date(now + this.randomChoice(DAY_OFFSETS)).toISOString();
  }

  /** Returns a past ISO date string */
  randomPastDate(from) {
    const now = from ? from.getTime() : Date.now();
    return new Date(now - this.randomChoice(DAY_OFFSETS)).toISOString();
  }

  /**
   * Generate either `true` or `false`. By default, the boolean is calculated by determining if a
   * float is less than `0.5`, but that can be adjusted via the input argument
   *
   * @param isLessThan
   */
  randomBoolean(isLessThan = 0.5) {
    return this.random() < isLessThan;
  }

  /** generate random OS family value */
  randomOSFamily() {
    return this.randomChoice(OS_FAMILY);
  }

  /** generate a UUID (v4) */
  randomUUID() {
    return _uuid.default.v4();
  }

  /** generate a seeded random UUID v4 */
  seededUUIDv4() {
    return _uuid.default.v4({
      random: [...this.randomNGenerator(255, 16)]
    });
  }

  /** Generate a random number up to the max provided */
  randomN(max) {
    return Math.floor(this.random() * max);
  }
  *randomNGenerator(max, count) {
    let iCount = count;
    while (iCount > 0) {
      yield this.randomN(max);
      iCount = iCount - 1;
    }
  }

  /**
   * Create an array of a given size and fill it with data provided by a generator
   *
   * @param lengthLimit
   * @param generator
   * @protected
   */
  randomArray(lengthLimit, generator) {
    const rand = this.randomN(lengthLimit) + 1;
    return [...Array(rand).keys()].map(generator);
  }
  randomMac() {
    return [...this.randomNGenerator(255, 6)].map(x => x.toString(16)).join('-');
  }
  randomIP() {
    return [10, ...this.randomNGenerator(255, 3)].map(x => x.toString()).join('.');
  }
  randomVersion() {
    // the `major` is sometimes (30%) 7 and most of the time (70%) 8
    const major = this.randomBoolean(0.4) ? 7 : 8;
    return [major, ...this.randomNGenerator(20, 2)].map(x => x.toString()).join('.');
  }
  randomChoice(choices) {
    return choices[this.randomN(choices.length)];
  }
  randomString(length) {
    return [...this.randomNGenerator(36, length)].map(x => x.toString(36)).join('');
  }
  randomHostname() {
    return `Host-${this.randomString(10)}`;
  }

  /**
   * Returns an single search hit (normally found in a `SearchResponse`) for the given document source.
   * @param hitSource
   * @param index
   */
  toEsSearchHit(hitSource, index = 'some-index') {
    const hit = toEsSearchHit(hitSource, index);
    hit._id = this.seededUUIDv4();
    return hit;
  }
  static toEsSearchHit(hitSource, index = 'some-index') {
    return toEsSearchHit(hitSource, index);
  }

  /**
   * Returns an ES Search Response for the give set of records. Each record will be wrapped with
   * the `toEsSearchHit()`
   * @param hitsSource
   */
  toEsSearchResponse(hitsSource) {
    return toEsSearchResponse(hitsSource);
  }
  static toEsSearchResponse(hitsSource) {
    return toEsSearchResponse(hitsSource);
  }
}
exports.BaseDataGenerator = BaseDataGenerator;