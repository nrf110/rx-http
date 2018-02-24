import { isUndefined, identity, isString, isInteger, isObject } from 'lodash';
import Errors from './errors';
import Path from './path';
import Url from './url';
import { parseUri, property, mapProperty } from './utilities';
import Serializers from './serializers';

let _method = new WeakMap();
let _headers = new WeakMap();
let _timeout = new WeakMap();
let _responseType = new WeakMap();
let _body = new WeakMap();
let _serializer = new WeakMap();
let _url = new WeakMap();
let _interceptors = new WeakMap();
let _xsrfCookieName = new WeakMap();
let _xsrfHeaderName = new WeakMap();
let _withCredentials = new WeakMap();
let _user = new WeakMap();
let _password = new WeakMap();
let _provider = new WeakMap();

/**
 * A Request should only ever be created by an instance of {@link Http}
 * @class
 * @name Request
 */
export default class Request {
  /**
   * @constructor
   * @param {Object} config - Override default settings for this Request only.
   */
  constructor({
              method,
              headers,
              timeout,
              body,
              url,
              interceptors,
              xsrfCookieName,
              xsrfHeaderName,
              withCredentials,
              user,
              password,
              provider
            } = {}) {
    _method.set(this, method || null);
    _headers.set(this, headers || {});
    _timeout.set(this, timeout || null);
    _body.set(this, body || null);
    _url.set(this, url || null);
    _interceptors.set(this, interceptors || [])
    _xsrfCookieName.set(this, xsrfCookieName || null);
    _xsrfHeaderName.set(this, xsrfHeaderName || null);
    _withCredentials.set(this, !!withCredentials);
    _user.set(this, user || null);
    _password.set(this, password || null);
    _provider.set(this, provider);
  }

  /**
   * @method
   * @name method
   * @param {String} [value] - The HTTP method for this request
   * @returns {String|Request} - If value is specified, sets the HTTP method
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current HTTP method
   */
  method(value) {
    return property.call(this, 'method', _method, value, isString);
  }

  /**
   * @method
   * @name headers
   * @param {String|Object} [name] - The name of the header
   * @param [value] - The value of the header
   * @returns {Object|String|Request} -
   * If no parameters are specified - returns a copy of the entire headers hash.
   * @example
   * request.headers() // returns { "foo": "bar" }
   * If only name is specified, and name is a string - returns the value for the key in the headers hash.
   * @example
   * request.headers("foo") // returns "bar"
   * If only name is specified, and name is an object - replaces the entire headers hash
   * and returns the current Request.
   * @example
   * request.headers({ "foo": "bar", "baz": 1 })
   * If name and value are specified - sets the value of name in the headers hash
   * and returns the current Request.
   * @example
   * request.headers("foo", "bar")
   */
  headers(name, value) {
    return mapProperty.call(this, _headers, name, value);
  }

  /**
   * Convenience method for getting/setting the Content-Type header.
   * @method
   * @name contentType
   * @param {String} [value] - The value of the Content-Type header
   * @returns {String|Request} - If value is specified, sets the
   * Content-Type header.  If value is ommitted, returns the current value
   * of the Content-Type header (or undefined);
   */
  contentType(value) {
    const headers = _headers.get(this);
    const currentEntry = Object.entries(headers).find((header) => header[0].toLowerCase() === 'content-type');

    if (isUndefined(value)) {
      if (!!currentEntry) return currentEntry[1];
      else return;
    }

    if (!!currentEntry) headers[currentEntry[0]] = value;
    else headers['Content-Type'] = value;

    return this;
  }

  /**
   * XHRProvider only - sets the responseType field of the {@link XMLHttpRequest}
   *
   * @method
   * @name responseType
   * @param {String} [value] - The expected responseType
   * @returns {String|Request} -  If value is specified, sets the responseType
   * for this request, and returns the current request.  If value is ommitted,
   * returns the current responseType value.
   */
  responseType(value) {
    return property.call(this, 'responseType', _responseType, value, isString);
  }

  /**
   * @method
   * @name timeout
   * @param {Number} [value] - The request timeout in milliseconds
   * @returns {Number|Request} - If value is specified, sets the timeout
   * for this request, and returns the current request. If value is ommitted,
   * returns the current timeout value.
   */
  timeout(value) {
    return property.call(this, 'timeout', _timeout, value, isInteger);
  }

  /**
   * @method
   * @name body
   * @param {Serializer} [value] - The serializer for the body
   * @returns {Serializer|Request} - If value is specified, sets the Serializer
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current Serializer
   */
  serializer(value) {
    return property.call(this, 'serializer', _serializer, value);
  }

  /**
   * @method
   * @name body
   * @param {Object|FormData|Blob|File|String} [value] - The body for this request
   * @param {Serializer} [serializer] - The serializer for the body
   * @returns {Object|FormData|Blob|File|String|Request} - If value is specified, sets the body
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current body
   */
  body(value, serializer) {
    if (isUndefined(value)) {
     return _body.get(this);
    }

    const currentSerializer = _serializer.get(this);
    _body.set(this, value);
    _serializer.set(this, serializer || currentSerializer || new Serializers.Default());

    return this;
  }

  /**
   * @method
   * @name url
   * @param {Url} [value] - The {@link Url} for this request.
   * @returns {Url|Request} - If value is specified, sets the {@link Url} for
   * this request and returns the current Request.  If value is ommitted,
   * returns the current {@link Url}.
   */
  url(value) {
    if (isUndefined(value)) {
      return _url.get(this);
    }

    if (value instanceof Url) {
      _url.set(this, value);
      return this;
    }

    if (isString(value) || isObject(value)) {
      const newUrl = Url.factory(value);
      const currentUrl = _url.get(this);
      if (newUrl.isAbsolute()) {
        _url.set(this, newUrl);
        return this;
      } else if (currentUrl && currentUrl.isAbsolute()) {
        _url.set(this, currentUrl.merge(newUrl));
        return this;
      }
    }

    throw new Errors.PropertyValidationError('url', value);
  }

  /**
   * @method
   * @name interceptors
   * @param {Interceptor[]} [value] - The set of interceptors to be run against this Request and/or Response
   * @returns {Interceptor[]|Request} - If value is specified, overrides the current set of interceptors
   * for this Request and/or Response and returns the current Request.  If value is ommitted,
   * returns the current set of interceptors.
   */
  interceptors(value) {
    return property.call(this, 'interceptors', _interceptors, value);
  }

  /**
   * @method
   * @name xsrfCookieName
   * @param {String} [value] - The name of the XSRF cookie
   * @returns {String|Request} - If the value is specified, sets the name of the XSRF Cookie
   * and returns the current Request.  If value is ommitted, returns the current name.
   */
  xsrfCookieName(value) {
    return property.call(this, 'xsrfCookieName', _xsrfCookieName, value, isString);
  }

  /**
   * @method
   * @name xsrfHeaderName
   * @param {String} [value] - The name of the XSRF header
   * @returns {String|Request} - If the value is specified, sets the name of the XSRF Header
   * and returns the current Request.  If value is ommitted, returns the current name.
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
   * @returns {Boolean|Request} - If the value is specified, sets the withCredentials flag
   * and returns the current Request.  If value is ommitted, returns the current
   * value of the flag.
   */
  withCredentials(value) {
    return property.call(this, 'withCredentials', _withCredentials, value);
  }

  /**
   * @method
   * @name user
   * @param {String} [value] - Basic auth user
   * @returns {String|Request} - If the value is specified, sets the user and returns
   * the current Request.  If value is ommitted, retursn the current user.
   */
  user(value) {
    return property.call(this, 'user', _user, value, isString);
  }

  /**
   * @method
   * @name password
   * @param {String} [value] - Basic auth password
   * @returns {String|Request} - If the value is specified, sets the password and returns
   * the current Request.  If value is ommitted, retursn the current password.
   */
  password(value) {
    return property.call(this, 'password', _password, value, isString);
  }

  /**
   * @method
   * @name execute
   * @returns {Object} - Executes the request and returns an object containing
   * the response, uploadProgress, and downloadProgress streams.
   * @example
   * var streams = request.execute();
   * streams.flatMap(response => response.body()).forEach((body) => console.log(body));
   * streams.flatmap(response => response.uploadProgress()).forEach((event) => console.log(event));
   * streams.flatMap(response => response.downloadProgress()).forEach((event) => console.log(event));
   */
  execute() {
    const provider = _provider.get(this);
    return provider(this);
  };
}
