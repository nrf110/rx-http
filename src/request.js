import _ from 'lodash';
import Path from './path';
import Url from './url';

/**
 * A Request should only ever be created by an instance of {@link Http}
 * @class
 * @param {Object} config - Override default settings for this Request only.
 * @private
 */
function Request(config) {
  const self = this;

  function property(key, transformIn = _.identity, transformOut = _.identity) {
    self[key] = function(value) {
      if (_.isUndefined(value)) {
        return transformOut(config[key]);
      } else {
        config[key] = transformIn(value);
        return self;
      }
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
  this.header = function(name, value) {
    if (_.isUndefined(value)) {
      return config.headers[name];
    } else {
      config.headers[name] = value.toString();
      return this;
    }
  }

  /** @method
   * @name headers
   * @param {Object} [value] - The hash of headers to send with this request.
   * Replaces any existing headers
   * @returns {object|Request} - If value is specified, sets the headers
   * and returns the current Request.  If value is ommitted, returns a copy
   * of the current headers.
   */
  property('headers', transformOut = (headers) => _.assign({}, headers));

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
  property('url', transformIn = (url) => {
    if (_.isString(url)) {
      const base = config.baseUrl || '';
      const fullUrl = Path.join(base, url);
      const parsed = parseUri(fullUrl);
      const config = _.defaults(options, settings)

      _.assign(parsed.query, options.query);

    } else if (url instanceof Url) {
      return url;
    } else {
      return new Url(url);
    }
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
  this.execute = function() {
    return config.provider(this);
  }
}

export default Request;
