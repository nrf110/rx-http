import { isUndefined, identity, assign, isString, isObject } from 'lodash';
import PropertyValidationException from './exceptions';
import Path from './path';
import Url from './url';
import { parseUri } from './utilities';

/**
 * A Request should only ever be created by an instance of {@link Http}
 * @class
 * @param {Object} config - Override default settings for this Request only.
 * @private
 */
export default function Request(config) {
  const self = this;

  function property(key, transformIn = identity, transformOut = identity) {
    self[key] = function (value) {
      if (isUndefined(value)) {
        return transformOut(config[key]);
      }

      config[key] = transformIn(value);
      return self;
    };
  }

  /** @method
   * @name method
   * @param {string} [value] - The HTTP method for this request
   * @returns {string|Request} - If value is specified, sets the HTTP method
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current HTTP method
   */
  property('method');

  /** @method
   * @name header
   * @param {string} name - The name of the header
   * @param {string} [value] - The value to assign to the header
   * @returns {string|Request} - If value is specified, sets the header
   * and returns the current Request.  If value is ommitted, returns the
   * value for the header.
   */
  this.header = function (name, value) {
    if (isUndefined(value)) {
      return config.headers[name];
    }
    config.headers[name] = value.toString();
    return this;
  };

  /** @method
   * @name headers
   * @param {Object} [value] - The hash of headers to send with this request.
   * Replaces any existing headers
   * @returns {object|Request} - If value is specified, sets the headers
   * and returns the current Request.  If value is ommitted, returns a copy
   * of the current headers.
   */
  property('headers', identity, (headers) => assign({}, headers));

  /** @method
   * @name body
   * @param {Object|FormData|Blob|File|string} [value] - The body for this request
   * @returns - If value is specified, sets the body
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current body
   */
  property('body');

  /** @method
   * @name url
   * @param {@link Url} [value] - The {@link Url} for this request.
   * @returns {@link Url} - If value is specified, sets the {@link Url} for
   * this request and returns the current Request.  If value is ommitted,
   * returns the current {@link Url}.
   */
  property('url', (url) => {
    if (url instanceof Url) {
      return url;
    } else if (isString(url) || isObject(url)) {
      const newUrl = new Url(url);
      if (newUrl.isAbsolute()) {
        return newUrl;
      } else if (config.url && config.url.isAbsolute()) {
        return config.url.merge(newUrl);
      }
    }

    throw new PropertyValidationException('url', url);
  });

  /** @method
   * @name timeout
   * @param {number} [value] - The number of milliseconds to wait before the request times out.
   * @returns {number|Request} - If value is specified, sets the timeout
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current timeout.
   */
  property('timeout');

  /** @method
   * @name retries
   * @param {number} [value] - The number of times this request will be retried on failure.
   * @returns {number|Request} - If value is specified, sets the number of retries
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current number of retries.
   */
  property('retries');

  /** @method
  * @name interceptors
  * @param {Object} [value] - The set of interceptors to be run against this Request and/or Response
  * @returns {Object|Request} - If value is specified, overrides the current set of interceptors
  * for this Request and/or Response and returns the current Request.  If value is ommitted,
  * returns the current set of interceptors.
  */
  property('interceptors');

  /** @method
  * @name xsrfCookieName
  * @param {string} [value] - The name of the XSRF cookie
  * @returns {string|Request} - If the value is specified, sets the name of the XSRF Cookie
  * and returns the current Request.  If value is ommitted, returns the current name.
  */
  property('xsrfCookieName');

  /** @method
  * @name xsrfHeaderName
  * @param {string} [value] - The name of the XSRF header
  * @returns {string|Request} - If the value is specified, sets the name of the XSRF Header
  * and returns the current Request.  If value is ommitted, returns the current name.
  */
  property('xsrfHeaderName');

  /** @method
  * @name withCredentials
  * @param {boolean} [value] - Flag indicating whether cross-site AccessControl
  * requests should be made using cookies, authorization headers, or TLS client
  * certificates.  More detail: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
  * @returns {boolean|Request} - If the value is specified, sets the withCredentials flag
  * and returns the current Request.  If value is ommitted, returns the current
  * value of the flag.
  */
  property('withCredentials');

  /** @method
  * @name username
  * @param {string} [value] - Basic auth username
  * @param {string|Request} - If the value is specified, sets the username and returns
  * the current Request.  If value is ommitted, retursn the current username.
  */
  property('username');

  /** @method
  * @name password
  * @param {string} [value] - Basic auth password
  * @param {string|Request} - If the value is specified, sets the password and returns
  * the current Request.  If value is ommitted, retursn the current password.
  */
  property('password');

  /** @method
   * @name execute
   * @returns {Object} - Executes the request and returns an object containing
   * the response, uploadProgress, and downloadProgress streams.
   * @example
   * {{
   *    var streams = request.execute();
   *    streams.response.forEach((response) => console.log(response));
   *    streams.uploadProgress.forEach((event) => console.log(event));
   *    streams.downloadProgress.forEach((event) => console.log(event));
   * }}
   */
  this.execute = function () {
    return config.provider(this);
  };
}
