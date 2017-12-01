import { isUndefined, isFunction } from 'lodash';
import Headers from './headers';

let _status = new WeakMap();
let _statusText = new WeakMap();
let _headers = new WeakMap();
let _body = new WeakMap();
let _uploadProgress = new WeakMap();
let _downloadProgress = new WeakMap();
let _isChunked = new WeakMap();

function evaluateLazy(property) {
  const value = property.get(this);
  if (!isUndefined(value) && isFunction(value)) {
    property.set(this, value());
  }
  return property.get(this);
}

/**
 * Immutable response container.  Should only be created by executing a {@link Request}.
 * @class
 * @name Response
 * @param {XMLHttpRequest} xhr
 * @param {Observable<String>} body - An Observable representing the body/entity of the response
 * @param {Observable<Object>} uploadProgress - An Observable representing a stream of all upload progress events
 * @param {Observable<Object>} downloadProgress - An Observable representing a stram of all download progress events
 */
export default class Response {

  constructor(xhr, body, uploadProgress, downloadProgress) {
    _status.set(this, xhr.status);
    _statusText.set(this, xhr.statusText);
    _headers.set(this, xhr.getAllResponseHeaders());
    _body.set(this, body);
    _uploadProgress.set(this, uploadProgress);
    _downloadProgress.set(this, downloadProgress);
  }

  /**
   * @method
   * @name uploadProgress
   * @returns {Observable<Object>} - an Observable stream of upload progress events
   */
  uploadProgress() {
    return evaluateLazy.call(this, _uploadProgress);
  }

  /**
   * @method
   * @name downloadProgress
   * @returns {Observable<Object>} - an Observable stream of download progress events
   */
  downloadProgress() {
    return evaluateLazy.call(this, _downloadProgress);
  }

  /**
   * @method
   * @name body
   * @returns {Observable<String>} - An Observable stream of the response body/entity contents
   */
  body() {
    return evaluateLazy.call(this, _body);
  }

  /**
   * @method
   * @name status
   * @returns {Number} - The HTTP status code of the response
   */
  status() {
    return _status.get(this);
  }

  /**
   * @method
   * @name statusText
   * @returns {String} - The status text of the response
   */
  statusText() {
    return _statusText.get(this);
  }

  /**
   * @method
   * @name headers
   * @returns {Object} - An object containing the response headers
   * @example
   * { "Content-Type": "application/json", "Content-Length": "22" }
   */
  headers() {
    return _headers.get(this);
  }

  /**
   * Look-up the value of an individual resonse header
   * @method
   * @name header
   * @param {String} name - The name of the header to lookup
   * @returns {String} - The value of the header, or undefined if not found
   */
  header(name) {
    return _headers.get(this)[name];
  }

  /**
   * @method
   * @name isChunked
   * @returns {Boolean} - Determines if this is a chunked response.  A chunked
   * response will send each chunk through the {@link body} stream.  A non-chunked
   * response will only push the final result through the stream.
   */
  isChunked() {
    if (!_isChunked.has(this)) {
      let transferEncoding = (this.header(Headers.TRANSFER_ENCODING) || '').toLowerCase();
      let isChunked = transferEncoding.indexOf('chunked') > -1 ||
                      transferEncoding.indexOf('identity') > -1;
      // Detect SPDY. It uses chunked transfer but doesn't set the Transfer-Encoding header.
      if (!isChunked) {
        let c = window.chrome;
        let loadTimes = c && c.loadTimes && c.loadTimes();
        let chromeSpdy = loadTimes && loadTimes.wasFetchedViaSpdy;
        let ffSpdy = !!this.header('X-Firefox-Spdy');
        isChunked = ffSpdy || chromeSpdy;
      }
      _isChunked.set(this, isChunked);
    }
    return _isChunked.get(this);
  }
}
