import { isBoolean, isString, isInteger, isArray, isUndefined, assign, defaults } from 'lodash';
import Request from './request';
import Interceptors from './interceptors';
import BrowserProvider from './providers/browser';
import Url from './url';
import Path from './path';
import { PropertyValidationError } from './errors';
import { property, parseUri } from './utilities';

function generateRequestMethod(method) {
  return function(url, options = {}) {
    return this.request(url, assign({ method }, options));
  };
}

const _baseUrl = new WeakMap();
const _timeout = new WeakMap();
const _headers = new WeakMap();
const _xsrfCookieName = new WeakMap();
const _xsrfHeaderName = new WeakMap();
const _withCredentials = new WeakMap();
const _user = new WeakMap();
const _password = new WeakMap();
const _interceptors = new WeakMap();
const _provider = new WeakMap();

/**
 * An HTTP client.
 * @class
 * @name Http
 */
class Http {
  /**
   * @constructor
   * @param {Object} [options] - A hash of settings for this client.
   */
  constructor({
              baseUrl,
              timeout,
              xsrfCookieName,
              xsrfHeaderName,
              withCredentials,
              user,
              password,
              interceptors,
              provider
            } = {}) {
    _baseUrl.set(this, baseUrl || Http.defaults.baseUrl);
    _timeout.set(this, timeout || Http.defaults.timeout);
    _xsrfCookieName.set(this, xsrfCookieName || Http.defaults.xsrfCookieName);
    _xsrfHeaderName.set(this, xsrfHeaderName || Http.defaults.xsrfHeaderName);
    _withCredentials.set(this, !!withCredentials);
    _interceptors.set(this, interceptors || Http.defaults.interceptors);
    _provider.set(this, provider || Http.defaults.provider);

    if (user) _user.set(this, user);
    if (password) _password.set(this, password || Http.defaults.password);
  }

  /**
   * @method
   * @name baseUrl
   * @param {String|Http} [url] - the base URL applied by default to all
   * requests from this client.
   * @returns {String|Http} - If url is specified, updates the default baseUrl
   * for all requests created with this client, and returns the client instance.
   * If value is ommitted, returns the current baseUrl.
   */
  baseUrl(url) {
    return property.call(this, 'baseUrl', _baseUrl, url, isString);
  }

  /**
   * @method
   * @name timeout
   * @param {Number} [value] - The request timeout in milliseconds
   * @returns {Number|Http} - If value is specified, updates the default request
   * timeout for all requests created with this client, and returns the client
   * instance.  If value is ommitted, returns the current timeout value.
   */
  timeout(value) {
    return property.call(this, 'timeout', _timeout, value, isInteger);
  }

  /**
   * @method
   * @name xsrfCookieName
   * @param {String} [value] - The name of the XSRF cookie
   * @returns {String|Http} - If the value is specified, sets the name of the XSRF Cookie
   * and returns the current Http.  If value is ommitted, returns the current name.
   */
  xsrfCookieName(value) {
    return property.call(this, 'xsrfCookieName', _xsrfCookieName, value, isString);
  }

  /**
   * @method
   * @name xsrfHeaderName
   * @param {String} [value] - The name of the XSRF header
   * @returns {String|Http} - If the value is specified, sets the name of the XSRF Header
   * and returns the current Http.  If value is ommitted, returns the current name.
   */
  xsrfHeaderName(value) {
    return property.call(this, 'xsrfHeaderName', _xsrfHeaderName, value, isString);
  }

  /**
   * @method
   * @name withCredentials
   * @param {Boolean} [value] - Flag indicating whether cross-site AccessControl
   * requests should be made using cookies, authorization headers, or TLS client
   * certificates.  More detail: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
   * @returns {Boolean|Http} - If the value is specified, sets the withCredentials flag
   * and returns the current Http.  If value is ommitted, returns the current
   * value of the flag.
   */
  withCredentials(value) {
    return property.call(this, 'withCredentials', _withCredentials, value, isBoolean);
  }

  /**
   * @method
   * @name user
   * @param {String} [value] - Basic auth username
   * @returns {String|Http} - If the value is specified, sets the username and returns
   * the current Http.  If value is ommitted, returns the current username.
   */
  user(value) {
    return property.call(this, 'user', _user, value, isString);
  }

  /**
   * @method
   * @name password
   * @param {String} [value] - Basic auth password
   * @returns {String|Http} - If the value is specified, sets the password and returns
   * the current Http.  If value is ommitted, returns the current password.
   */
  password(value) {
    return property.call(this, 'password', _password, value, isString);
  }

  /**
   * @method
   * @name interceptors
   * @param {Interceptor[]} [values] - An array of interceptors.
   * @returns {Interceptor[]|Http} - If values is specified, replaces the default
   * interceptors for all requests from this client, and returns the client
   * instance.  If values is ommitted, returns the current array of
   * interceptors.
   */
  interceptors(values) {
    return property.call(this, 'interceptors', _interceptors, values, isArray);
  }

  /**
   * @method
   * @name addInterceptor
   * @param {Interceptor} interceptor - Add the interceptor to the end of the
   * chain of interceptors.
   * @return {Http} - The current client instance.
   */
  addInterceptor(interceptor) {
    _interceptors.get(this).push(interceptor);
    return this;
  }

  /**
   * @method
   * @name removeInterceptor
   * @param {Interceptor} interceptor - Remove the interceptor from the chain of interceptors.
   * @returns {Http} - The current client instance.
   */
  removeInterceptor(interceptor) {
    const current = _interceptors.get(this);
    const updated = current.filter((i) => i !== interceptor);
    _interceptors.set(this, updated);
    return this;
  }

  /**
   * @method
   * @name request
   * @param {String} url - the URL where the request will be sent.
   * @param {Object} [options] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).request('/some/stuff', {
   *   method: 'POST',
   *   body: { foo: "bar", baz: 1 },
   *   timeout: 10000
   * })
   */
  request(url, { method, headers, query, timeout, body, interceptors, xsrfCookieName, xsrfHeaderName, withCredentials, user, password, provider } = {}) {
    const self = this;
    const baseUrl = _baseUrl.get(this);
    let fullUrl = url;

    if (!!baseUrl) {
      fullUrl = Path.join(baseUrl, url);
    }

    const parsed = parseUri(fullUrl);
    assign(parsed.query, query);

    return new Request({
      method: method,
      headers: headers || _headers.get(self), // TODO: expose a headers property
      timeout: timeout || _timeout.get(self),
      body: body,
      url: new Url(parsed),
      interceptors: interceptors || _interceptors.get(self),
      xsrfCookieName: xsrfCookieName || _xsrfCookieName.get(self),
      xsrfHeaderName: xsrfHeaderName || _xsrfHeaderName.get(self),
      withCredentials: withCredentials, // TODO: proper default logic for bool,
      user: user || _user.get(self),
      password: password || _password.get(self),
      provider: provider || _provider.get(self)
    });
  }

  /**
   * @method
   * @name head
   * Helper method for request.  Automatically sets method to HEAD.
   * @param {string} url - the URL where the request will be sent.
   * @param {Object} [opts] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).head('/some/stuff', {
   *   retries: 2,
   *   timeout: 10000
   * })
   */
  head(url, opts = {}) {
    return generateRequestMethod('HEAD').call(this, url, opts);
  }

  /**
   * @method
   * @name get
   * Helper method for request.  Automatically sets method to GET.
   * @param {String} url - the URL where the request will be sent.
   * @param {Object} [opts] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).get('/some/stuff', {
   *   retries: 2
   *   timeout: 10000
   * })
   */
  get(url, opts = {}) {
    return generateRequestMethod('GET').call(this, url, opts);
  }

  /**
   * @method
   * @name options
   * Helper method for request.  Automatically sets method to OPTIONS.
   * @param {String} url - the URL where the request will be sent.
   * @param {Object} [opts] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).head('/some/stuff', {
   *   retries: 2,
   *   timeout: 10000
   * })
   */
  options(url, opts = {}) {
    return generateRequestMethod('OPTIONS').call(this, url, opts);
  }

  /**
   * @method
   * @name delete
   * Helper method for request.  Automatically sets method to DELETE.
   * @param {String} url - the URL where the request will be sent.
   * @param {Object} [opts] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).delete('/some/stuff', {
   *   retries: 2,
   *   timeout: 10000
   * })
   */
  delete(url, opts = {}) {
    return generateRequestMethod('DELETE').call(this, url, opts);
  }

  /**
   * @method
   * @name trace
   * Helper method for request.  Automatically sets method to TRACE.
   * @param {String} url - the URL where the request will be sent.
   * @param {Object} [opts] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).trace('/some/stuff', {
   *   retries: 2,
   *   timeout: 10000
   * })
   */
  trace(url, opts = {}) {
    return generateRequestMethod('TRACE').call(this, url, opts);
  }

  /**
   * @method
   * @name post
   * Helper method for request.  Automatically sets method to POST.
   * @param {String} url - the URL where the request will be sent.
   * @param {Object} [opts] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).post('/some/stuff', {
   *   body: { foo: "bar", baz: 1 },
   *   timeout: 10000
   * })
   */
  post(url, opts = {}) {
    return generateRequestMethod('POST').call(this, url, opts);
  }

  /** @method
  * @name put
  * Helper method for request.  Automatically sets method to PUT.
  * @param {String} url - the URL where the request will be sent.
  * @param {Object} [opts] - add/override settings for this request.
  * @return {Request}
  * @example
  * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).put('/some/stuff', {
  *   body: { foo: "bar", baz: 1 },
  *   timeout: 10000
  * })
  **/
  put(url, opts = {}) {
    return generateRequestMethod('PUT').call(this, url, opts);
  }

  /**
   * @method
   * @name patch
   * Helper method for request.  Automatically sets method to PATCH.
   * @param {String} url - the URL where the request will be sent.
   * @param {Object} [opts] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).patch('/some/stuff', {
   *   body: { foo: "bar", baz: 1 },
   *   timeout: 10000
   * })
   */
  patch(url, opts = {}) {
    return generateRequestMethod('PATCH').call(this, url, opts);
  }
}

Http.defaults = {
  baseUrl: '',
  timeout: 30000,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  withCredentials: false,
  interceptors: [
    Interceptors.MethodOverride,
    Interceptors.BodyTransformer,
    Interceptors.XSRF,
    Interceptors.ErrorHandling
  ],
  provider: BrowserProvider
};

export default Http;
