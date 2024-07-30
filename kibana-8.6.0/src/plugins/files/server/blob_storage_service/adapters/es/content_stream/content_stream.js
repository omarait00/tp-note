"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContentStream = void 0;
exports.getReadableContentStream = getReadableContentStream;
exports.getWritableContentStream = getWritableContentStream;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _cuid = _interopRequireDefault(require("cuid"));
var cborx = _interopRequireWildcard(require("cbor-x"));
var _elasticsearch = require("@elastic/elasticsearch");
var _configSchema = require("@kbn/config-schema");
var _lodash = require("lodash");
var _stream = require("stream");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class ContentStream extends _stream.Duplex {
  /**
   * The number of bytes written so far.
   * Does not include data that is still queued for writing.
   */

  constructor(client, id, index, logger, parameters = {}) {
    super();
    (0, _defineProperty2.default)(this, "buffers", []);
    (0, _defineProperty2.default)(this, "bytesBuffered", 0);
    (0, _defineProperty2.default)(this, "bytesRead", 0);
    (0, _defineProperty2.default)(this, "chunksRead", 0);
    (0, _defineProperty2.default)(this, "chunksWritten", 0);
    (0, _defineProperty2.default)(this, "maxChunkSize", void 0);
    (0, _defineProperty2.default)(this, "parameters", void 0);
    (0, _defineProperty2.default)(this, "bytesWritten", 0);
    (0, _defineProperty2.default)(this, "indexRequestBuffer", void 0);
    this.client = client;
    this.id = id;
    this.index = index;
    this.logger = logger;
    this.parameters = (0, _lodash.defaults)(parameters, {
      encoding: 'base64',
      size: -1,
      maxChunkSize: '4mb'
    });
  }
  getMaxContentSize() {
    return _configSchema.ByteSizeValue.parse(this.parameters.maxChunkSize).getValueInBytes();
  }
  getMaxChunkSize() {
    if (!this.maxChunkSize) {
      this.maxChunkSize = this.getMaxContentSize();
      this.logger.debug(`Chunk size is ${this.maxChunkSize} bytes.`);
    }
    return this.maxChunkSize;
  }
  async readChunk() {
    if (!this.id) {
      throw new Error('No document ID provided. Cannot read chunk.');
    }
    const id = this.getChunkId(this.chunksRead);
    this.logger.debug(`Reading chunk #${this.chunksRead}.`);
    try {
      var _cborx$decode;
      const stream = await this.client.get({
        id,
        index: this.index,
        _source_includes: ['data', 'last']
      }, {
        asStream: true,
        // This tells the ES client to not process the response body in any way.
        headers: {
          accept: 'application/cbor'
        }
      });
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      const source = buffer.byteLength ? (_cborx$decode = cborx.decode(Buffer.concat(chunks))) === null || _cborx$decode === void 0 ? void 0 : _cborx$decode._source : undefined;
      const dataBuffer = source === null || source === void 0 ? void 0 : source.data;
      return [dataBuffer !== null && dataBuffer !== void 0 && dataBuffer.byteLength ? dataBuffer : null, source === null || source === void 0 ? void 0 : source.last];
    } catch (e) {
      if (e instanceof _elasticsearch.errors.ResponseError && e.statusCode === 404) {
        const readingHeadChunk = this.chunksRead <= 0;
        if (this.isSizeUnknown() && !readingHeadChunk) {
          // Assume there is no more content to read.
          return [null];
        }
        if (readingHeadChunk) {
          this.logger.error(`File not found (id: ${this.getHeadChunkId()}).`);
        }
      }
      throw e;
    }
  }
  isSizeUnknown() {
    return this.parameters.size < 0;
  }
  isRead() {
    const {
      size
    } = this.parameters;
    if (size > 0) {
      return this.bytesRead >= size;
    }
    return false;
  }
  _read() {
    this.readChunk().then(([buffer, last]) => {
      if (!buffer) {
        this.logger.debug(`Chunk is empty.`);
        this.push(null);
        return;
      }
      this.push(buffer);
      this.chunksRead++;
      this.bytesRead += buffer.byteLength;
      if (this.isRead() || last) {
        this.logger.debug(`Read ${this.bytesRead} of ${this.parameters.size} bytes.`);
        this.push(null);
      }
    }).catch(err => this.destroy(err));
  }
  async removeChunks() {
    const bid = this.getId();
    this.logger.debug(`Clearing existing chunks for ${bid}`);
    await this.client.deleteByQuery({
      index: this.index,
      ignore_unavailable: true,
      query: {
        bool: {
          must: {
            match: {
              bid
            }
          }
        }
      }
    });
  }
  getId() {
    if (!this.id) {
      this.id = (0, _cuid.default)();
    }
    return this.id;
  }
  getHeadChunkId() {
    return `${this.getId()}.0`;
  }
  getChunkId(chunkNumber = 0) {
    return chunkNumber === 0 ? this.getHeadChunkId() : `${this.getId()}.${chunkNumber}`;
  }
  async indexChunk({
    bid,
    data,
    id,
    index
  }, last) {
    await this.client.index({
      id,
      index,
      document: cborx.encode(last ? {
        data,
        bid,
        last
      } : {
        data,
        bid
      })
    }, {
      headers: {
        'content-type': 'application/cbor',
        accept: 'application/json'
      }
    });
  }

  /**
   * Holds a reference to the last written chunk without actually writing it to ES.
   *
   * This enables us to reliably determine what the real last chunk is at the cost
   * of holding, at most, 2 full chunks in memory.
   */

  async writeChunk(data) {
    const chunkId = this.getChunkId(this.chunksWritten);
    if (!this.indexRequestBuffer) {
      this.indexRequestBuffer = {
        id: chunkId,
        index: this.index,
        data,
        bid: this.getId()
      };
      return;
    }
    this.logger.debug(`Writing chunk with ID "${this.indexRequestBuffer.id}".`);
    await this.indexChunk(this.indexRequestBuffer);
    // Hold a reference to the next buffer now that we indexed the previous one.
    this.indexRequestBuffer = {
      id: chunkId,
      index: this.index,
      data,
      bid: this.getId()
    };
  }
  async finalizeLastChunk() {
    if (!this.indexRequestBuffer) {
      return;
    }
    this.logger.debug(`Writing last chunk with id "${this.indexRequestBuffer.id}".`);
    await this.indexChunk(this.indexRequestBuffer, true);
    this.indexRequestBuffer = undefined;
  }
  async flush(size = this.bytesBuffered) {
    const buffersToFlush = [];
    let bytesToFlush = 0;

    /*
     Loop over each buffer, keeping track of how many bytes we have added
     to the array of buffers to be flushed. The array of buffers to be flushed
     contains buffers by reference, not copies. This avoids putting pressure on
     the CPU for copying buffers or for gc activity. Please profile performance
     with a large byte configuration and a large number of records (900k+)
     before changing this code.
    */
    while (this.buffers.length) {
      const remainder = size - bytesToFlush;
      if (remainder <= 0) {
        break;
      }
      const buffer = this.buffers.shift();
      const chunkedBuffer = buffer.slice(0, remainder);
      buffersToFlush.push(chunkedBuffer);
      bytesToFlush += chunkedBuffer.byteLength;
      if (buffer.byteLength > remainder) {
        this.buffers.unshift(buffer.slice(remainder));
      }
    }

    // We call Buffer.concat with the fewest number of buffers possible
    const chunk = Buffer.concat(buffersToFlush);
    if (!this.chunksWritten) {
      await this.removeChunks();
    }
    if (chunk.byteLength) {
      await this.writeChunk(chunk);
      this.chunksWritten++;
    }
    this.bytesWritten += chunk.byteLength;
    this.bytesBuffered -= bytesToFlush;
  }
  async flushAllFullChunks() {
    const maxChunkSize = this.getMaxChunkSize();
    while (this.bytesBuffered >= maxChunkSize && this.buffers.length) {
      await this.flush(maxChunkSize);
    }
  }
  _write(chunk, encoding, callback) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
    this.bytesBuffered += buffer.byteLength;
    this.buffers.push(buffer);
    this.flushAllFullChunks().then(() => callback()).catch(callback);
  }
  _final(callback) {
    this.flush().then(() => this.finalizeLastChunk()).then(() => callback()).catch(callback);
  }

  /**
   * This ID can be used to retrieve or delete all of the file chunks but does
   * not necessarily correspond to an existing document.
   *
   * @note do not use this ID with anything other than a {@link ContentStream}
   * compatible implementation for reading blob-like structures from ES.
   *
   * @note When creating a new blob, this value may be undefined until the first
   * chunk is written.
   */
  getContentReferenceId() {
    return this.id;
  }
  getBytesWritten() {
    return this.bytesWritten;
  }
}
exports.ContentStream = ContentStream;
function getContentStream({
  client,
  id,
  index,
  logger,
  parameters
}) {
  return new ContentStream(client, id, index, logger, parameters);
}
function getWritableContentStream(args) {
  return getContentStream(args);
}
function getReadableContentStream(args) {
  return getContentStream(args);
}