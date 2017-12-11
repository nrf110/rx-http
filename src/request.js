import { isUndefined, identity, assign, isString, isObject } from 'lodash';
import { PropertyValidationError } from './errors';
import Path from './path';
import Url from './url';
import { parseUri } from './utilities';
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
let _username = new WeakMap();
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
  constructor(config) {
    _method.set(this, config.method || null);
    _headers.set(this, config.headers || {});
    _timeout.set(this, config.timeout || null);
    _body.set(this, config.body || null);
    _url.set(this, config.url || null);
    _interceptors.set(this, config.interceptors || {})
    _xsrfCookieName.set(this, config.xsrfCookieName);
    _xsrfHeaderName.set(this, config.xsrfHeaderName);
    _withCredentials.set(this, !!config.withCredentials);
    _username.set(this, config.username || null);
    _password.set(this, config.password || null);
    _provider.set(this, config.provider);
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
    if (isUndefined(value)) {
     return _method.get(this);
    }

    _method.set(this, value);
    return this;
  }

  /**
   * @method
   * @name header
   * @param {String} name - The name of the header
   * @param {String} [value] - The value to assign to the header
   * @returns {String|Request} - If value is specified, sets the header
   * and returns the current Request.  If value is ommitted, returns the
   * value for the header.
   */
  header(name, value) {
    let headers = _headers.get(this);
    if (isUndefined(value)) {
      return headers[name];
    }
    headers[name] = value.toString();
    return this;
  }

  /**
   * @method
   * @name headers
   * @param {Object} [value] - The hash of headers to send with this request.
   * Replaces any existing headers
   * @returns {Object|Request} - If value is specified, sets the headers
   * and returns the current Request.  If value is ommitted, returns a copy
   * of the current headers.
   */
  headers(value) {
    if (isUndefined(value)) {
      return assign({}, _headers.get(this));
    }

    _headers.set(this, value);
    return this;
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
    if (isUndefined(value)) {
      return _responseType.get(this);
    }

    _responseType.set(this, value);
    return this;
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
    if (isUndefined(value)) {
      return _timeout.get(this);
    }

    _timeout.set(this, value);
    return this;
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
    if (isUndefined(value)) {
      return _serializer.get(this);
    }

    _serializer.set(this, value);
    return this;
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

    _body.set(this, value);
    _serializer.set(this, serializer || new Serializers.Default());

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
      const newUrl = Url.factory(url);
      if (newUrl.isAbsolute()) {
        _url.set(this, newUrl);
        return this;
      } else if (_url.get(this) && _url.get().isAbsolute()) {
        _url.set(this, _url.get(this).merge(newUrl));
        return this;
      }
    }

    throw new PropertyValidationError('url', url);
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
    if (isUndefined(value)) {
      return _interceptors.get(this);
    }
    _interceptors.set(this, value);
    return this;
  }

  /**
   * @method
   * @name xsrfCookieName
   * @param {String} [value] - The name of the XSRF cookie
   * @returns {String|Request} - If the value is specified, sets the name of the XSRF Cookie
   * and returns the current Request.  If value is ommitted, returns the current name.
   */
  xsrfCookieName(value) {
    if (isUndefined(value)) {
      return _xsrfCookieName.get(this);
    }
    _xsrfCookieName.set(this, value);
    return this;
  }

  /**
   * @method
   * @name xsrfHeaderName
   * @param {String} [value] - The name of the XSRF header
   * @returns {String|Request} - If the value is specified, sets the name of the XSRF Header
   * and returns the current Request.  If value is ommitted, returns the current name.
   */
  xsrfHeaderName(value) {
    if (isUndefined(value)) {
      return _xsrfHeaderName.get(this);
    }
    _xsrfHeaderName.set(this, value);
    return this;
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
    if (isUndefined(value)) {
      return this.config.withCredentials = value;
    }
    this.config.withCredentials = value;
    return this;
  }

  /**
   * @method
   * @name username
   * @param {String} [value] - Basic auth username
   * @returns {String|Request} - If the value is specified, sets the username and returns
   * the current Request.  If value is ommitted, retursn the current username.
   */
  username(value) {
    if (isUndefined(value)) {
      return _username.get(this);
    }
    _username.set(this, value);
    return this;
  }

  /**
   * @method
   * @name password
   * @param {String} [value] - Basic auth password
   * @returns {String|Request} - If the value is specified, sets the password and returns
   * the current Request.  If value is ommitted, retursn the current password.
   */
  password(value) {
    if (isUndefined(value)) {
      return _password.get(this);
    }
    _password.set(this, value);
    return this;
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
