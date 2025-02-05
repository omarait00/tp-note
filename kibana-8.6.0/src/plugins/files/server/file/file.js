"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.File = void 0;
var _rxjs = require("rxjs");
var _file_attributes_reducer = require("./file_attributes_reducer");
var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Scopes file actions to an ID and set of attributes.
 *
 * Also exposes the upload and download functionality.
 */
class File {
  constructor(id, metadata, fileClient, logger) {
    this.id = id;
    this.metadata = metadata;
    this.fileClient = fileClient;
    this.logger = logger;
  }
  async updateFileState(action) {
    const metadata = (0, _file_attributes_reducer.fileAttributesReducer)(this.data, action);
    await this.fileClient.internalUpdate(this.id, metadata);
    this.data = metadata;
  }
  isReady() {
    return this.data.status === 'READY';
  }
  isDeleted() {
    return this.data.status === 'DELETED';
  }
  uploadInProgress() {
    return this.data.status === 'UPLOADING';
  }
  async update(attrs) {
    await this.updateFileState({
      action: 'updateFile',
      payload: attrs
    });
    return this;
  }
  upload(content) {
    return (0, _rxjs.defer)(() => this.fileClient.upload(this.id, content));
  }
  async uploadContent(content, abort$ = _rxjs.NEVER) {
    if (this.uploadInProgress()) {
      throw new _errors.UploadInProgressError('Upload already in progress.');
    }
    if (this.isReady()) {
      throw new _errors.ContentAlreadyUploadedError('Already uploaded file content.');
    }
    this.logger.debug(`Uploading file [id = ${this.id}][name = ${this.data.name}].`);
    await (0, _rxjs.lastValueFrom)((0, _rxjs.from)(this.updateFileState({
      action: 'uploading'
    })).pipe((0, _rxjs.mergeMap)(() => (0, _rxjs.race)(this.upload(content), abort$.pipe((0, _rxjs.map)(() => {
      throw new _errors.AbortedUploadError(`Aborted upload of ${this.id}!`);
    })))), (0, _rxjs.mergeMap)(({
      size
    }) => {
      return this.updateFileState({
        action: 'uploaded',
        payload: {
          size
        }
      });
    }), (0, _rxjs.catchError)(async e => {
      try {
        await this.updateFileState({
          action: 'uploadError'
        });
      } catch (updateError) {
        this.logger.error(`Could not update file ${this.id} after upload error (${e.message}). Update failed with: ${updateError.message}. This file may be in an inconsistent state.`);
      }
      this.fileClient.deleteContent(this.id).catch(() => {});
      throw e;
    })));
    return this;
  }
  downloadContent() {
    const {
      size
    } = this.data;
    if (!this.isReady()) {
      throw new _errors.NoDownloadAvailableError('This file content is not available for download.');
    }
    // We pass through this file ID to retrieve blob content.
    return this.fileClient.download({
      id: this.id,
      size
    });
  }
  async delete() {
    if (this.uploadInProgress()) {
      throw new _errors.UploadInProgressError('Cannot delete file while upload in progress');
    }
    if (this.isDeleted()) {
      throw new _errors.AlreadyDeletedError('File has already been deleted');
    }
    await this.updateFileState({
      action: 'delete'
    });
    await this.fileClient.delete({
      id: this.id,
      hasContent: this.isReady()
    });
  }
  async share({
    name,
    validUntil
  }) {
    return this.fileClient.share({
      name,
      validUntil,
      file: this
    });
  }
  async listShares() {
    const {
      shares
    } = await this.fileClient.listShares({
      fileId: this.id
    });
    return shares;
  }
  async unshare(opts) {
    await this.fileClient.unshare({
      id: opts.shareId
    });
  }
  toJSON() {
    return this.data;
  }
  get data() {
    return this.metadata;
  }
  set data(v) {
    this.metadata = v;
  }
}
exports.File = File;