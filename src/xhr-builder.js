import { isInteger, partial, noop } from 'lodash';

const STATE = {
  UNSENT: 0,
  OPEN: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
}

/**
 * Internal class used to construct and XMLHttpRequest
 * @private
 * @class
 * @name XHRBuilder
 */
export default class XHRBuilder {
  constructor() {
    this.headersReceived = noop;
    this.downloadProgress = noop;
    this.uploadProgress = noop;
    this.complete = noop;
    this.progress = noop;
    this.error = noop;
    this.abort = noop;
    this.load = noop;
    this.loadEnd = noop;
  }

  onHeadersReceived(fn) {
    this.headersReceived = fn;
    return this;
  }

  onDownloadProgress(fn) {
    this.downloadProgress = fn;
    return this;
  }

  onUploadProgress(fn) {
    this.uploadProgress = fn;
    return this;
  }

  onError(fn) {
    this.error = fn;
    return this;
  }

  onAbort(fn) {
    this.abort = fn;
    return this;
  }

  onLoad(fn) {
    this.load = fn;
    return this;
  }

  onLoadEnd(fn) {
    this.loadEnd = fn;
    return this;
  }

  request(req) {
    this.req = req;
    return this;
  }

  build() {
    const self = this;
    const request = this.req;
    const xhr = new XMLHttpRequest();

    const openArgs = [request.method(), request.url().toString(), true];
    if (request.username()) {
      openArgs.push(request.username());

      if (request.password()) {
        openArgs.push(request.password());
      }
    }

    if (request.responseType()) {
      xhr.responseType = request.responseType();
    }

    xhr.open(...openArgs);

    if (isInteger(request)) {
      xhr.timeout = request.timeout();
    }

    const headers = request.headers();

    Object.keys(headers).forEach(headerName => {
      xhr.setRequestHeader(headerName, headers[headerName]);
    });

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', self.uploadProgress);
      xhr.upload.addEventListener('error', self.error);
      xhr.upload.addEventListener('abort', self.abort);
    }

    xhr.addEventListener('progress', self.downloadProgress);
    xhr.addEventListener('error', self.error);
    xhr.addEventListener('abort', self.abort);
    xhr.addEventListener('load', self.load);
    xhr.addEventListener('loadend', self.loadEnd);

    xhr.addEventListener('readystatechange', (evt) => {
      if (xhr.readyState === STATE.HEADERS_RECEIVED) {
        self.headersReceived(evt);
      }
    });

    return xhr;
  }
}
