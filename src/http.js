import { isString, isInteger, isArray, isUndefined, assign, defaults, remove } from 'lodash';
import Request from './request';
import Interceptors from './interceptors';
import XHRProvider from './xhr-provider';
import Url from './url';
import Path from './path';
import { PropertyValidationException } from './exceptions';
import { parseUri } from './utilities';

function property(key, isValid) {
  return function(value) {
    const settings = _settings.get(this);

    if (isUndefined(value)) {
      return settings[key];
    }

    if (isValid(value)) {
      settings[key] = value;
      return this;
    }

    throw new PropertyValidationException(key, value);
  };
}

function generateRequestMethod(method) {
  return function(url, options = {}) {
    return this.request(url, assign({ method }, options));
  };
}

const _settings = new WeakMap();

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
  constructor(options = {}) {
    const initialSettings = assign({}, Http.defaults, options)
    _settings.set(this, initialSettings);
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
    return property('baseUrl', isString).call(this, url);
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
    return property('timeout', isInteger).call(this, value);
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
    return property('interceptors', isArray).call(this, values);
  }

  /**
   * @method
   * @name addInterceptor
   * @param {Interceptor} interceptor - Add the interceptor to the end of the
   * chain of interceptors.
   * @return {Http} - The current client instance.
   */
  addInterceptor(interceptor) {
    _settings.get(this).interceptors.push(interceptor);
    return this;
  }

  /**
   * @method
   * @name removeInterceptor
   * @param {Interceptor} interceptor - Remove the interceptor from the chain of interceptors.
   * @returns {Http} - The current client instance.
   */
  removeInterceptor(interceptor) {
    const settings = _settings.get(this);
    settings.interceptors = remove(settings.interceptors, (i) => i === interceptor);
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
  request(url, options = {}) {
    const settings = _settings.get(this);
    let fullUrl = url;

    if (settings.baseUrl) {
      fullUrl = Path.join(settings.baseUrl, url);
    }

    const parsed = parseUri(fullUrl);
    const config = defaults(options, settings);

    assign(parsed.query, options.query);
    assign(config, { url: new Url(parsed) });

    return new Request(config);
  }

  /**
   * @method
   * @name head
   * Helper method for request.  Automatically sets method to HEAD.
   * @param {string} url - the URL where the request will be sent.
   * @param {Object} [options] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).head('/some/stuff', {
   *   retries: 2,
   *   timeout: 10000
   * })
   */
  head(url, options) {
    return generateRequestMethod('HEAD').call(this, url, options);
  }

  /**
   * @method
   * @name get
   * Helper method for request.  Automatically sets method to GET.
   * @param {String} url - the URL where the request will be sent.
   * @param {Object} [options] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).get('/some/stuff', {
   *   retries: 2
   *   timeout: 10000
   * })
   */
  get(url, options) {
    return generateRequestMethod('GET').call(this, url, options);
  }

  /**
   * @method
   * @name options
   * Helper method for request.  Automatically sets method to OPTIONS.
   * @param {String} url - the URL where the request will be sent.
   * @param {Object} [options] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).head('/some/stuff', {
   *   retries: 2,
   *   timeout: 10000
   * })
   */
  options(url, options) {
    return generateRequestMethod('OPTIONS').call(this, url, options);
  }

  /**
   * @method
   * @name delete
   * Helper method for request.  Automatically sets method to DELETE.
   * @param {String} url - the URL where the request will be sent.
   * @param {Object} [options] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).delete('/some/stuff', {
   *   retries: 2,
   *   timeout: 10000
   * })
   */
  delete(url, options) {
    return generateRequestMethod('DELETE').call(this, url, options);
  }

  /**
   * @method
   * @name trace
   * Helper method for request.  Automatically sets method to TRACE.
   * @param {String} url - the URL where the request will be sent.
   * @param {Object} [options] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).trace('/some/stuff', {
   *   retries: 2,
   *   timeout: 10000
   * })
   */
  trace(url, options) {
    return generateRequestMethod('TRACE').call(this, url, options);
  }

  /**
   * @method
   * @name post
   * Helper method for request.  Automatically sets method to POST.
   * @param {String} url - the URL where the request will be sent.
   * @param {Object} [options] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).post('/some/stuff', {
   *   body: { foo: "bar", baz: 1 },
   *   timeout: 10000
   * })
   */
  post(url, options) {
    return generateRequestMethod('POST').call(this, url, options);
  }

  /** @method
  * @name put
  * Helper method for request.  Automatically sets method to PUT.
  * @param {String} url - the URL where the request will be sent.
  * @param {Object} [options] - add/override settings for this request.
  * @return {Request}
  * @example
  * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).put('/some/stuff', {
  *   body: { foo: "bar", baz: 1 },
  *   timeout: 10000
  * })
  **/
  put(url, options) {
    return generateRequestMethod('PUT').call(this, url, options);
  }

  /**
   * @method
   * @name patch
   * Helper method for request.  Automatically sets method to PATCH.
   * @param {String} url - the URL where the request will be sent.
   * @param {Object} [options] - add/override settings for this request.
   * @return {Request}
   * @example
   * new Http({ baseUrl: 'http://mydomain.com', timeout: 5000 }).patch('/some/stuff', {
   *   body: { foo: "bar", baz: 1 },
   *   timeout: 10000
   * })
   */
  patch(url, options) {
    return generateRequestMethod('PATCH').call(this, url, options);
  }
}

Http.defaults = {
  baseUrl: '',
  retries: 0,
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
  provider: XHRProvider
};

export default Http;
