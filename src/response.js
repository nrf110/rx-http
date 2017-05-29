import { isUndefined, isFunction } from 'lodash';
import Headers from './headers';

/**
 * Immutable response container
 * @class
 */
export default function Response(xhr, body, uploadProgress, downloadProgress) {
  self = this;

  function lazy(value) {
    let _value;

    return function () {
      if (!isUndefined(value)) {
        if (isFunction(value)) {
          _value = value();
        } else {
          _value = value;
        }
      }

      return _value;
    };
  }

  this.uploadProgress = lazy(uploadProgress);

  this.downloadProgress = lazy(downloadProgress);

  this.body = lazy(body);

  this.status = lazy(xhr.status);

  this.statusText = lazy(xhr.statusText);

  this.headers = lazy(xhr.getAllResponseHeaders());

  this.header = (name) => this.headers()[name];

  this.isChunked = lazy(() => {
    let transferEncoding = (self.header(Headers.TRANSFER_ENCODING) || '').toLowerCase();
    let isChunked = transferEncoding.indexOf('chunked') > -1 ||
                    transferEncoding.indexOf('identity') > -1;
    // Detect SPDY. It uses chunked transfer but doesn't set the Transfer-Encoding header.
    if (!isChunked) {
      let c = window.chrome;
      let loadTimes = c && c.loadTimes && c.loadTimes();
      let chromeSpdy = loadTimes && loadTimes.wasFetchedViaSpdy;
      let ffSpdy = !!self.header('X-Firefox-Spdy');
      isChunked = ffSpdy || chromeSpdy;
    }

    return isChunked;
  });
}
