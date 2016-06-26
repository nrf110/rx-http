import _ from 'lodash';
import Request from './request';
import { Interceptors } from './interceptors';
import Uri from './uri';
import Path from './path';

/**
 * An HTTP client.
 * @class
 * @param {Object} [options] - A hash of settings for this client.
 */
function Http(options = {}) {
  const self = this;
  const settings = _.assign({}, Http.defaults, options);

  function property(key, isValid) {
    return function(value) {
      if (isValid(value)) {
        settings[key] = value;
        return self;
      } else {
        return settings[key];
      }
    }
  }

  /** @method
   * @name baseUrl
   * @param {string|Http} [url] - the base URL applied by default to all
   * requests from this client.
   * @returns {string|Http} - If url is specified, updates the default baseUrl
   * for all requests created with this client, and returns the client instance.
   * If value is ommitted, returns the current baseUrl.
   */
  property('baseUrl', _.isString);

  /** @method
   * @name timeout
   * @param {number} [value] - The request timeout in milliseconds
   * @returns {number|Http} - If value is specified, updates the default request
   * timeout for all requests created with this client, and returns the client
   * instance.  If value is ommitted, returns the current timeout value.
   */
  property('timeout', _.isInteger);

  /** @method
   * @name retries
   * @param {number} [value] - The number of retries allowed
   * @returns {number|Http} - If count is specified, sets the default number
   * of retries allowed for requests from this client, and returns the client
   * instance.  If count is ommitted, returns the current value.
   */
  property('retries', _.isInteger);

  /** @method
   * @name interceptors
   * @param {Object[]} [values] - An array of interceptors.
   * @returns {Object[]|Http} - If values is specified, replaces the default
   * interceptors for all requests from this client, and returns the client
   * instance.  If values is ommitted, returns the current array of
   * interceptors.
   */
  property('interceptors', _.isArray);

  /** @method
   * @name addInterceptor
   * @param {Object} interceptor - Add the interceptor to the end of the
   * chain of interceptors.
   * @return {Http} - The current client instance.
   */
  this.addInterceptor = function(interceptor) {
    settings.interceptors.push(interceptor);
    return this;
  }

  /** @method
   * @name removeInterceptor
   * @param interceptor - Remove the interceptor from the chain of interceptors.
   * @returns {Http} - The current client instance.
   */
  this.removeInterceptor = function(interceptor) {
    settings.interceptors = _.remove(settings.interceptors, (i) => i === interceptor);
    return this;
  }

  /** @method
  * @name request
  * @param {string} url - the URL where the request will be sent.
  * @param {Object} [options] - add/override settings for this request.
  * @return {@link Request}
  * @example
  * {{
  *    new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).request('/some/stuff', {
  *      method: 'POST',
  *      body: { foo: "bar", baz: 1 },
  *      timeout: 10000
  *    })
  * }}
  **/
  const request = this.request = function(url, options = {}) {
    const base = settings.baseUrl || '';
    const fullUrl = Path.join(base + url);
    const parsed = parseUri(fullUrl);
    const config = _.defaults(options, settings)

    _.assign(parsed.query, options.query);
    _.assign(config, { url: new Url(parsed) })

    return new Request(config);
  }

  function generateRequestMethod(method) {
    self[method.toLowerCase()] = function(url, options = {}) {
      return request(url, _.assign({ method }, options));
    }
  }

  /** @method
  * @name head
  * Helper method for request.  Automatically sets method to HEAD.
  * @param {string} url - the URL where the request will be sent.
  * @param {Object} [options] - add/override settings for this request.
  * @return {@link Request}
  * @example
  * {{
  *    new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).head('/some/stuff', {
  *      retries: 2,
  *      timeout: 10000
  *    })
  * }}
  **/
  generateRequestMethod('HEAD');

  /** @method
  * @name get
  * Helper method for request.  Automatically sets method to GET.
  * @param {string} url - the URL where the request will be sent.
  * @param {Object} [options] - add/override settings for this request.
  * @return {@link Request}
  * @example
  * {{
  *    new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).get('/some/stuff', {
  *      retries: 2
  *      timeout: 10000
  *    })
  * }}
  **/
  generateRequestMethod('GET');

  /** @method
  * @name options
  * Helper method for request.  Automatically sets method to OPTIONS.
  * @param {string} url - the URL where the request will be sent.
  * @param {Object} [options] - add/override settings for this request.
  * @return {@link Request}
  * @example
  * {{
  *    new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).head('/some/stuff', {
  *      retries: 2,
  *      timeout: 10000
  *    })
  * }}
  **/
  generateRequestMethod('OPTIONS');

  /** @method
  * @name delete
  * Helper method for request.  Automatically sets method to DELETE.
  * @param {string} url - the URL where the request will be sent.
  * @param {Object} [options] - add/override settings for this request.
  * @return {@link Request}
  * @example
  * {{
  *    new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).delete('/some/stuff', {
  *      retries: 2,
  *      timeout: 10000
  *    })
  * }}
  **/
  generateRequestMethod('DELETE');

  /** @method
  * @name trace
  * Helper method for request.  Automatically sets method to TRACE.
  * @param {string} url - the URL where the request will be sent.
  * @param {Object} [options] - add/override settings for this request.
  * @return {@link Request}
  * @example
  * {{
  *    new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).trace('/some/stuff', {
  *      retries: 2,
  *      timeout: 10000
  *    })
  * }}
  **/
  generateRequestMethod('TRACE');

  /** @method
  * @name post
  * Helper method for request.  Automatically sets method to POST.
  * @param {string} url - the URL where the request will be sent.
  * @param {Object} [options] - add/override settings for this request.
  * @return {@link Request}
  * @example
  * {{
  *    new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).post('/some/stuff', {
  *      body: { foo: "bar", baz: 1 },
  *      timeout: 10000
  *    })
  * }}
  **/
  generateRequestMethod('POST');

  /** @method
  * @name put
  * Helper method for request.  Automatically sets method to PUT.
  * @param {string} url - the URL where the request will be sent.
  * @param {Object} [options] - add/override settings for this request.
  * @return {@link Request}
  * @example
  * {{
  *    new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).put('/some/stuff', {
  *      body: { foo: "bar", baz: 1 },
  *      timeout: 10000
  *    })
  * }}
  **/
  generateRequestMethod('PUT');

  /** @method
  * @name patch
  * Helper method for request.  Automatically sets method to PATCH.
  * @param {string} url - the URL where the request will be sent.
  * @param {Object} [options] - add/override settings for this request.
  * @return {@link Request}
  * @example
  * {{
  *    new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).patch('/some/stuff', {
  *      body: { foo: "bar", baz: 1 },
  *      timeout: 10000
  *    })
  * }}
  **/
  generateRequestMethod('PATCH');
}

const provider = (function() {
  const thisIsNode =
    typeof process !== 'undefined' &&
      typeof process.release !== 'undefined' &&
      typeof process.release.name !== 'undefined' &&
      process.release.name.search(/node|io.js/) !== -1;

  if (thisIsNode) throw new Error("Node.js is not yet supported!");
  else return XHRProvider;
})();

Http.defaults = {
  baseUrl: '',
  retries: 0,
  timeout: 30000,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  interceptors: [
    Interceptors.MethodOverride,
    Interceptors.BodyTransformer,
    Interceptors.XSRF,
    Interceptors.ErrorHandling
  ],
  provider
};

export default Http;
