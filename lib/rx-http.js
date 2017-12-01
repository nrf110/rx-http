(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("js-cookie"), require("rxjs"));
	else if(typeof define === 'function' && define.amd)
		define("rx-http", ["lodash", "js-cookie", "rxjs"], factory);
	else if(typeof exports === 'object')
		exports["rx-http"] = factory(require("lodash"), require("js-cookie"), require("rxjs"));
	else
		root["rx-http"] = factory(root["_"], root["Cookies"], root["Rx"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_20__, __WEBPACK_EXTERNAL_MODULE_21__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base class to be inherited by Interceptors
 * @class
 * @name Interceptor
 */
var Interceptor = function () {
  function Interceptor() {
    _classCallCheck(this, Interceptor);
  }

  _createClass(Interceptor, [{
    key: "request",

    /**
     * Transforms (or fails) an outgoing request.
     * @method
     * @name request
     * @param {Request} request - The request to be processed
     * @param {Function<Request>} accept - called on success to process a (potentially transformed) {@link Request}
     * @param {Function} reject - called on failure to pass an error
     */
    value: function request(_request, accept, reject) {
      accept(_request);
    }

    /**
     * Try to recover from a request error so processing can resume.
     * @method
     * @name requestError
     * @param error - The error to be processed
     * @param {Function} accept - called on success if we were able to recover
     * @param {Function} reject - called on failure to pass an error
     */

  }, {
    key: "requestError",
    value: function requestError(error, accept, reject) {
      reject(error);
    }

    /**
     * @method
     * @name response
     * @param {Response} response - The response to be processed
     * @param {Function<Response>} accept - called on success to process a (potentially transformed) {@link Response}
     * @param {Function} reject - called on failure to pass an error
     */

  }, {
    key: "response",
    value: function response(_response, accept, reject) {
      accept(_response);
    }

    /**
     * Try to recover from a response error so processing can resume.
     * @method
     * @name responseError
     * @param error - The error to be processed
     * @param {Function} accept - called on success if we were able to recover
     * @param {Function} reject - called on failure to pass an error
     */

  }, {
    key: "responseError",
    value: function responseError(error, accept, reject) {
      reject(error);
    }
  }]);

  return Interceptor;
}();

exports.default = Interceptor;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFile = isFile;
exports.isFormData = isFormData;
exports.isBlob = isBlob;
exports.parseUri = parseUri;
/** @private **/
function isFile(value) {
  return toString.call(value) === '[object File]';
}

/** @private **/
function isFormData(value) {
  return toString.call(value) === '[object FormData]';
}

/** @private **/
function isBlob(value) {
  return toString.call(value) === '[object Blob]';
}

/** parseUri 1.2.2
 * (c) Steven Levithan <stevenlevithan.com>
 * MIT License
 * @private
 */
function parseUri(str) {
  var o = parseUri.options;
  var m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
  var uri = {};
  var i = 14;

  while (i--) {
    uri[o.key[i]] = m[i] || '';
  }uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2;
  });

  return uri;
};

parseUri.options = {
  strictMode: false,
  key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @name PropertyValidationException
 * @param {String} - property
 */
var PropertyValidationException = function () {
  /**
   * @constructor
   * @param {String} - property name
   * @param value
   */
  function PropertyValidationException(property, value) {
    _classCallCheck(this, PropertyValidationException);

    this.property = property;
    this.value = value;
  }

  _createClass(PropertyValidationException, [{
    key: "toString",
    value: function toString() {
      return "Value " + this.value + " is not valid for property " + this.property;
    }
  }]);

  return PropertyValidationException;
}();

exports.default = {
  PropertyValidationException: PropertyValidationException
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(0);

var _utilities = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function encode(val) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

function property(member, value) {
  if ((0, _lodash.isUndefined)(value)) {
    member.get(this);
  }

  member.set(this);
  return this;
}

var _protocol = new WeakMap();
var _user = new WeakMap();
var _password = new WeakMap();
var _host = new WeakMap();
var _port = new WeakMap();
var _directory = new WeakMap();
var _file = new WeakMap();
var _fragment = new WeakMap();
var _query = new WeakMap();

/**
 * @class
 * @name Url
 * @param {Object} parts
 */

var Url = function () {
  /**
   * @constructor
   * @param {Object} parts
   */
  function Url(parts) {
    _classCallCheck(this, Url);

    if (parts.protocol) _protocol.set(this, parts.protocol);
    if (parts.user) _user.set(this, parts.user);
    if (parts.password) _password.set(this, parts.password);
    if (parts.host) _host.set(this, parts.host);
    if (parts.port) _port.set(this, parts.port);
    if (parts.directory) _directory.set(this, parts.directory);
    if (parts.file) _file.set(this, parts.file);
    if (parts.fragment) _fragment.set(this, parts.fragment);
  }

  /**
   * @method
   * @name protocol
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the protocol for the url
   * and returns the current instance.  If value is ommitted, returns the
   * current protocol.
   */


  _createClass(Url, [{
    key: 'protocol',
    value: function protocol(value) {
      return property.call(this, _protocol, value);
    }

    /**
     * @method
     * @name user
     * @param {String} [value]
     * @returns {Url|String} - If value is specified, sets the user and returns
     * the current instance.  If value is ommitted, returns the current user.
     */

  }, {
    key: 'user',
    value: function user(value) {
      return property.call(this, _user, value);
    }

    /**
     * @method
     * @name password
     * @param {String} [value]
     * @returns {Url|String} - If value is specified, sets the password and returns
     * the current instance.  If value is ommitted, returns the current password.
     */

  }, {
    key: 'password',
    value: function password(value) {
      return property.call(this, _password, value);
    }

    /**
     * @method
     * @name host
     * @param {String} [value]
     * @returns {Url|String} - If value is specified, sets the host and returns
     * the current instance.  If value is ommitted, returns the current host.
     */

  }, {
    key: 'host',
    value: function host(value) {
      return property.call(this, _host, value);
    }

    /**
     * @method
     * @name port
     * @param {String|Number} [value]
     * @returns {Url|String|Number} - If value is specified, sets the port and returns
     * the current instance.  If value is ommitted, returns the current port.
     */

  }, {
    key: 'port',
    value: function port(value) {
      return property.call(this, _port, value);
    }

    /**
     * @method
     * @name directory
     * @param {String} [value]
     * @returns {Url|String} - If value is specified, sets the directory and returns
     * the current instance.  If value is ommitted, returns the current directory.
     */

  }, {
    key: 'directory',
    value: function directory(value) {
      return property.call(this, _directory, value);
    }

    /**
     * @method
     * @name file
     * @param {String} [value]
     * @returns {Url|String} - If value is specified, sets the file and returns
     * the current instance.  If value is ommitted, returns the current file.
     */

  }, {
    key: 'file',
    value: function file(value) {
      return property.call(this, _file, value);
    }

    /**
     * @method
     * @name fragment
     * @param {String} [value]
     * @returns {Url|String} - If value is specified, sets the fragment and returns
     * the current instance.  If value is ommitted, returns the current fragment.
     */

  }, {
    key: 'fragment',
    value: function fragment(value) {
      return property.call(this, _fragment, value);
    }

    /**
     * @method
     * @name isAbsolute
     * @returns {Boolean} - true if the url is absolute, false if it is relative.
     */

  }, {
    key: 'isAbsolute',
    value: function isAbsolute() {
      return !!this.host();
    }

    /**
     * @method
     * @name isRelative
     * @returns {Boolean} - true if the url is relative, false if it is absolute.
     */

  }, {
    key: 'isRelative',
    value: function isRelative() {
      return !this.isAbsolute();
    }

    /**
     * @method
     * @name query
     * @param {String|Object} [name] - The name of the query-string parameter
     * @param [value] - The value of the query-string parameter
     * @returns {Object|String|Request} -
     * If no parameters are specified - returns a copy of the entire query hash.
     * @example
     * request.query() // returns { "foo": "bar" }
     * If only name is specified, and name is a string - returns the value for the key in the query hash.
     * @example
     * request.query("foo") // returns "bar"
     * If only name is specified, and name is an object - replaces the entire query hash
     * and returns the current Request.
     * @example
     * request.query({ "foo": "bar", "baz": 1 }).execute()
     * If name and value are specified - sets the value of name in the query hash
     * and returns the current Request.
     * @example
     * request.query("foo", "bar").execute()
     */

  }, {
    key: 'query',
    value: function query(name, value) {
      if (!(0, _lodash.isUndefined)(name)) {
        if ((0, _lodash.isUndefined)(value)) {
          if ((0, _lodash.isObject)(name)) {
            _query.set(this, name);
            return this;
          }
          return _query.get(this)[name];
        }
        var existing = _query.get(this);
        existing[name] = value;
        _query.set(this, existing);
        return this;
      }

      return (0, _lodash.assign)({}, _query.get(this));
    }

    /**
     * @method
     * @name userInfo
     * @returns {String} - returns basic auth credentials in the format
     * user:password, if both user and password are set.
     */

  }, {
    key: 'userInfo',
    value: function userInfo() {
      var u = _user.get(this);
      var p = _password.get(this);

      if ((0, _lodash.isString)(u) && !(0, _lodash.isEmpty)(u.trim()) && (0, _lodash.isString)(p) && (0, _lodash.isEmpty)(p.trim())) {
        return u + ':' + p;
      }

      return null;
    }

    /**
     * @method
     * @name authority
     * @returns {String} - returns the authority portion of the url ([protocol]://[userInfo@]host[:port])
     */

  }, {
    key: 'authority',
    value: function authority() {
      var pr = _protocol.get(this) ? _protocol.get(this) + '://' : '';
      var ui = this.userInfo() ? this.userInfo() + '@' : '';
      var h = _host.get(this) || '';
      var p = _port.get(this) ? ':' + _port.get(this) : '';

      return pr + ui + h + p;
    }

    /**
     * @method
     * @name path
     * @returns {String} - returns the path portion of the url
     */

  }, {
    key: 'path',
    value: function path() {
      var dir = _directory.get(this) || '';
      var f = _file.get(this) || '';

      if ((0, _lodash.endsWith)(dir, '/')) {
        if ((0, _lodash.startsWith)(f, '/')) {
          return dir + f.substring(1);
        }

        return dir + f;
      } else if ((0, _lodash.startsWith)(f, '/')) {
        return dir + f;
      }

      return dir + '/' + f;
      return '';
    }

    /**
     * @method
     * @name merge
     * @param {Url} other - the {@link Url} to merge into this one
     * @returns {Url} - returns a copy of this {@link Url} with the directory,
     * file, gragment, path, and query portions from taken from other.  If
     * any of those properties do not exist in other, they will be removed
     * from the copy.
     */

  }, {
    key: 'merge',
    value: function merge(other) {
      var copied = (0, _lodash.cloneDeep)(parts);
      var otherParts = (0, _utilities.parseUri)(other.toString());
      var propertiesToMerge = ['directory', 'file', 'fragment', 'path', 'query'];
      propertiesToMerge.forEach(function (property) {
        if (!!otherParts[property]) {
          copied[property] = otherParts[property];
        } else if (!!copied[property]) {
          delete copied[property];
        }
      });

      return new Url(copied);
    }

    /**
     * @method
     * @name toString
     * @param {Function<Object, String>} serializeQuery - a function that can customize
     * how the query-string hash is rendered in the resulting url
     * @returns {String}
     */

  }, {
    key: 'toString',
    value: function toString(serializeQuery) {
      var auth = this.authority();
      var p = this.path();
      var f = this.fragment();
      var querySerializer = serializeQuery || _lodash.identity;
      var q = querySerializer(this.query());

      var fullyQualified = function () {
        if ((0, _lodash.endsWith)(auth, '/')) {
          if ((0, _lodash.endsWith)(p, '/')) {
            return auth + p.substring(1);
          }

          return auth + p;
        } else if ((0, _lodash.startsWith)(p, '/')) {
          return auth + p;
        }

        return auth + '/' + p;
      }();

      var queryParts = (0, _lodash.reduce)(q, function (accum, value, key) {
        var pair = encode(key) + '=' + encode(value);

        accum.push(pair);
        return accum;
      }, []);

      var fullyQualifiedWithQuery = function () {
        if (!(0, _lodash.isEmpty)(queryParts)) {
          return fullyQualified + '?' + queryParts.join('&');
        }

        return fullyQualified;
      }();

      if (!(0, _lodash.isEmpty)(f)) {
        return fullyQualifiedWithQuery + '#' + f;
      }

      return fullyQualifiedWithQuery;
    }
  }]);

  return Url;
}();

/**
 * @function
 * @name factory
 * @param {Object|String} value - A hash containing the Url parts, or a string
 * representation of a Url
 * @returns {Url}
 */


Url.factory = function (value) {
  if ((0, _lodash.isString)(value)) {
    return new Url((0, _utilities.parseUri)(value));
  }
  return new Url(value);
};

exports.default = Url;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  CONTENT_TYPE: "Content-Type",

  TRANSFER_ENCODING: "Transfer-Encoding"

};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _methodOverride = __webpack_require__(12);

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _bodyTransformer = __webpack_require__(10);

var _bodyTransformer2 = _interopRequireDefault(_bodyTransformer);

var _xsrf = __webpack_require__(13);

var _xsrf2 = _interopRequireDefault(_xsrf);

var _errorHandling = __webpack_require__(11);

var _errorHandling2 = _interopRequireDefault(_errorHandling);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  MethodOverride: new _methodOverride2.default(),
  BodyTransformer: new _bodyTransformer2.default(),
  XSRF: new _xsrf2.default(),
  ErrorHandling: new _errorHandling2.default()
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(0);

exports.default = {
  separator: '/',

  join: function join() {
    var separator = this.separator;
    var initial = arguments[0];
    var args = [].concat(Array.prototype.slice.call(arguments)).slice(1);

    return (0, _lodash.reduce)(args, function (accum, value) {
      if (value.trim() != '') {
        if ((0, _lodash.endsWith)(accum, separator) && (0, _lodash.startsWith)(value, separator)) {
          accum += value.substring(1);
        } else if ((0, _lodash.endsWith)(accum, separator) || (0, _lodash.startsWith)(value, separator)) {
          accum += value;
        } else {
          accum += '/' + value;
        }
      }

      return accum;
    }, initial);
  }
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(0);

var _request = __webpack_require__(15);

var _request2 = _interopRequireDefault(_request);

var _interceptors = __webpack_require__(6);

var _interceptors2 = _interopRequireDefault(_interceptors);

var _xhrProvider = __webpack_require__(19);

var _xhrProvider2 = _interopRequireDefault(_xhrProvider);

var _url = __webpack_require__(4);

var _url2 = _interopRequireDefault(_url);

var _path = __webpack_require__(7);

var _path2 = _interopRequireDefault(_path);

var _exceptions = __webpack_require__(3);

var _utilities = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An HTTP client.
 * @function
 * @name Http
 * @param {Object} [options] - A hash of settings for this client.
 */
function Http() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var self = this;
  var settings = (0, _lodash.assign)({}, Http.defaults, options);

  function property(key, isValid) {
    return function (value) {
      if ((0, _lodash.isUndefined)(value)) {
        return settings[key];
      }

      if (isValid(value)) {
        settings[key] = value;
        return self;
      }

      throw new _exceptions.PropertyValidationException(key, value);
    };
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
  this.baseUrl = property('baseUrl', _lodash.isString);

  /**
   * @method
   * @name timeout
   * @param {Number} [value] - The request timeout in milliseconds
   * @returns {Number|Http} - If value is specified, updates the default request
   * timeout for all requests created with this client, and returns the client
   * instance.  If value is ommitted, returns the current timeout value.
   */
  this.timeout = property('timeout', _lodash.isInteger);

  /**
   * @method
   * @name retries
   * @param {Number} [value] - The number of retries allowed
   * @returns {Number|Http} - If count is specified, sets the default number
   * of retries allowed for requests from this client, and returns the client
   * instance.  If count is ommitted, returns the current value.
   */
  this.retries = property('retries', _lodash.isInteger);

  /**
   * @method
   * @name interceptors
   * @param {Interceptor[]} [values] - An array of interceptors.
   * @returns {Interceptor[]|Http} - If values is specified, replaces the default
   * interceptors for all requests from this client, and returns the client
   * instance.  If values is ommitted, returns the current array of
   * interceptors.
   */
  this.interceptors = property('interceptors', _lodash.isArray);

  /**
   * @method
   * @name addInterceptor
   * @param {Interceptor} interceptor - Add the interceptor to the end of the
   * chain of interceptors.
   * @return {Http} - The current client instance.
   */
  this.addInterceptor = function (interceptor) {
    settings.interceptors.push(interceptor);
    return this;
  };

  /**
   * @method
   * @name removeInterceptor
   * @param {Interceptor} interceptor - Remove the interceptor from the chain of interceptors.
   * @returns {Http} - The current client instance.
   */
  this.removeInterceptor = function (interceptor) {
    settings.interceptors = (0, _lodash.remove)(settings.interceptors, function (i) {
      return i === interceptor;
    });
    return this;
  };

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
  var request = this.request = function (url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var fullUrl = url;
    if (settings.baseUrl) {
      fullUrl = _path2.default.join(settings.baseUrl, url);
    }

    var parsed = (0, _utilities.parseUri)(fullUrl);
    var config = (0, _lodash.defaults)(options, settings);

    (0, _lodash.assign)(parsed.query, options.query);
    (0, _lodash.assign)(config, { url: new _url2.default(parsed) });

    return new _request2.default(config);
  };

  function generateRequestMethod(method) {
    return function (url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return request(url, (0, _lodash.assign)({ method: method }, options));
    };
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
  this.head = generateRequestMethod('HEAD');

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
  this.get = generateRequestMethod('GET');

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
  this.options = generateRequestMethod('OPTIONS');

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
  this.delete = generateRequestMethod('DELETE');

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
  this.trace = generateRequestMethod('TRACE');

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
  this.post = generateRequestMethod('POST');

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
  this.put = generateRequestMethod('PUT');

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
  this.patch = generateRequestMethod('PATCH');
}

Http.defaults = {
  baseUrl: '',
  retries: 0,
  timeout: 30000,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  withCredentials: false,
  interceptors: [_interceptors2.default.MethodOverride, _interceptors2.default.BodyTransformer, _interceptors2.default.XSRF, _interceptors2.default.ErrorHandling],
  provider: _xhrProvider2.default
};

module.exports = Http;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Exceptions = exports.Interceptors = exports.Interceptor = exports.Headers = exports.Http = exports.Url = undefined;

var _url = __webpack_require__(4);

var _url2 = _interopRequireDefault(_url);

var _http = __webpack_require__(8);

var _http2 = _interopRequireDefault(_http);

var _headers = __webpack_require__(5);

var _headers2 = _interopRequireDefault(_headers);

var _interceptor = __webpack_require__(1);

var _interceptor2 = _interopRequireDefault(_interceptor);

var _interceptors = __webpack_require__(6);

var _interceptors2 = _interopRequireDefault(_interceptors);

var _exceptions = __webpack_require__(3);

var _exceptions2 = _interopRequireDefault(_exceptions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Url = _url2.default;
exports.Http = _http2.default;
exports.Headers = _headers2.default;
exports.Interceptor = _interceptor2.default;
exports.Interceptors = _interceptors2.default;
exports.Exceptions = _exceptions2.default;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(0);

var _utilities = __webpack_require__(2);

var _interceptor = __webpack_require__(1);

var _interceptor2 = _interopRequireDefault(_interceptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Tries to automatically detect the response content type and deserialize the
 * raw body into the appropriate type.
 * @class
 * @name BodyTransformer
 */
var BodyTransformer = function (_Interceptor) {
  _inherits(BodyTransformer, _Interceptor);

  function BodyTransformer() {
    _classCallCheck(this, BodyTransformer);

    return _possibleConstructorReturn(this, (BodyTransformer.__proto__ || Object.getPrototypeOf(BodyTransformer)).apply(this, arguments));
  }

  _createClass(BodyTransformer, [{
    key: 'request',

    /**
     * Transforms (or fails) an outgoing request.
     * @method
     * @name request
     * @param {Request} request - The request to be processed
     * @param {Function<Request>} accept - called on success to process a (potentially transformed) {@link Request}
     * @param {Function} reject - called on failure to pass an error
     */
    value: function request(_request, accept, reject) {
      var body = _request.body();

      if ((0, _lodash.isObject)(body) && !(0, _utilities.isFile)(body) && !(0, _utilities.isFormData)(body) && !(0, _utilities.isBlob)(body)) {
        var json = JSON.stringify(body);

        _request.body(json);
      }

      accept(_request);
    }
  }]);

  return BodyTransformer;
}(_interceptor2.default);

exports.default = BodyTransformer;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _interceptor = __webpack_require__(1);

var _interceptor2 = _interopRequireDefault(_interceptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Rejects a response with a non-20x status-code.
 * @class
 * @name ErrorHandling
 */
var ErrorHandling = function (_Interceptor) {
  _inherits(ErrorHandling, _Interceptor);

  function ErrorHandling() {
    _classCallCheck(this, ErrorHandling);

    return _possibleConstructorReturn(this, (ErrorHandling.__proto__ || Object.getPrototypeOf(ErrorHandling)).apply(this, arguments));
  }

  _createClass(ErrorHandling, [{
    key: 'response',

    /**
     * @method
     * @name response
     * @param {Response} response - The response to be processed
     * @param {Function<Response>} accept - called on success to process a (potentially transformed) {@link Response}
     * @param {Function} reject - called on failure to pass an error
     */
    value: function response(_response, accept, reject) {
      if (_response.status() / 100 === 2) {
        accept(_response);
      } else {
        reject(_response);
      }
    }
  }]);

  return ErrorHandling;
}(_interceptor2.default);

exports.default = ErrorHandling;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _interceptor = __webpack_require__(1);

var _interceptor2 = _interopRequireDefault(_interceptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BROWSER_METHODS = ['GET', 'POST'];

/**
 * If the HTTP verb is not one understood by Browsers, change the verb
 * to a POST and send the X-HTTP-Method-Override header with the original
 * method.  This should generally be understood by the routers of most
 * server backends.
 * @class
 * @name MethodOverride
 */

var MethodOverride = function (_Interceptor) {
  _inherits(MethodOverride, _Interceptor);

  function MethodOverride() {
    _classCallCheck(this, MethodOverride);

    return _possibleConstructorReturn(this, (MethodOverride.__proto__ || Object.getPrototypeOf(MethodOverride)).apply(this, arguments));
  }

  _createClass(MethodOverride, [{
    key: 'request',

    /**
     * Transforms (or fails) an outgoing request.
     * @method
     * @name request
     * @param {Request} request - The request to be processed
     * @param {Function<Request>} accept - called on success to process a (potentially transformed) {@link Request}
     * @param {Function} reject - called on failure to pass an error
     */
    value: function request(_request, accept, reject) {
      var originalMethod = _request.method();

      if (!BROWSER_METHODS.some(function (m) {
        return m === originalMethod;
      })) {
        _request.method('POST').header('X-HTTP-Method-Override', originalMethod);
      }

      accept(_request);
    }
  }]);

  return MethodOverride;
}(_interceptor2.default);

exports.default = MethodOverride;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(0);

var _jsCookie = __webpack_require__(20);

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _interceptor = __webpack_require__(1);

var _interceptor2 = _interopRequireDefault(_interceptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Reads the value from the configured XSRF cookie and sends it back to the
 * server and sends it back in the configured header.
 * @class
 * @name XSRF
 */
var XSRF = function (_Interceptor) {
  _inherits(XSRF, _Interceptor);

  function XSRF() {
    _classCallCheck(this, XSRF);

    return _possibleConstructorReturn(this, (XSRF.__proto__ || Object.getPrototypeOf(XSRF)).apply(this, arguments));
  }

  _createClass(XSRF, [{
    key: 'request',

    /**
     * Transforms (or fails) an outgoing request.
     * @method
     * @name request
     * @param {Request} request - The request to be processed
     * @param {Function<Request>} accept - called on success to process a (potentially transformed) {@link Request}
     * @param {Function} reject - called on failure to pass an error
     */
    value: function request(_request, accept, reject) {
      var xsrfToken = _jsCookie2.default.get(_request.xsrfCookieName());
      var xsrfHeader = _request.xsrfHeaderName();

      if (!(0, _lodash.isUndefined)(xsrfToken) && (0, _lodash.isString)(xsrfToken)) {
        _request.header(xsrfHeader, xsrfToken);
      }

      accept(_request);
    }
  }]);

  return XSRF;
}(_interceptor2.default);

exports.default = XSRF;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RequestInterceptorChain;

var _lodash = __webpack_require__(0);

/**
 * Runs the request interceptors, and requestError interceptors if necessary.
 * @private
 * @class
 * @param {Object[]} interceptors - The array of interceptors to be run
 * @param {Function} accept - Callback that is invoked with the final request
 * object after all interceptors have run successfully.
 * @param {Function} reject - Callback that is invoked with an error object
 * if all of the interceptors fail to recover from an error.
 */
function RequestInterceptorChain(interceptors, accept, reject) {
  /**
   * Handler for a rejected interceptor.  Runs requestError interceptor for
   * all interceptors following the failure, in an attempt to recover.
   * If one of the interceptors manages to recover, hop back into the next
   * interceptor after the initial failure.
   */
  function failure(remaining, recover) {
    return function (error) {
      function step(rest, err) {
        if (!(0, _lodash.isEmpty)(rest)) {
          var interceptor = (0, _lodash.head)(rest);
          var xs = (0, _lodash.tail)(rest);
          var transform = interceptor.requestError;
          var next = (0, _lodash.partial)(step, xs);

          transform(err, recover, next);
        } else {
          reject(err);
        }
      }

      step(remaining, error);
    };
  }

  /** @method
   * Runs the request through the chain of request interceptors
   * @name run
   * @param {Request} request
   */
  this.run = function (request) {
    function step(remaining, next) {
      if (!(0, _lodash.isEmpty)(remaining)) {
        var interceptor = (0, _lodash.head)(remaining);
        var xs = (0, _lodash.tail)(remaining);
        var transform = interceptor.request;
        var success = (0, _lodash.partial)(step, xs);

        transform(request, success, failure(xs, success));
      } else {
        accept(request);
      }
    }

    step(interceptors, request);
  };
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(0);

var _exceptions = __webpack_require__(3);

var _path = __webpack_require__(7);

var _path2 = _interopRequireDefault(_path);

var _url3 = __webpack_require__(4);

var _url4 = _interopRequireDefault(_url3);

var _utilities = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _method = new WeakMap();
var _headers = new WeakMap();
var _body = new WeakMap();
var _url = new WeakMap();
var _retries = new WeakMap();
var _interceptors = new WeakMap();
var _xsrfCookieName = new WeakMap();
var _xsrfHeaderName = new WeakMap();
var _withCredentials = new WeakMap();
var _username = new WeakMap();
var _password = new WeakMap();
var _provider = new WeakMap();

/**
 * A Request should only ever be created by an instance of {@link Http}
 * @class
 */

var Request = function () {
  /**
   * @constructor
   * @param {Object} config - Override default settings for this Request only.
   */
  function Request(config) {
    _classCallCheck(this, Request);

    _method.set(this, config.method || null);
    _headers.set(this, config.headers || {});
    _body.set(this, config.body || null);
    _url.set(this, config.url || null);
    _retries.set(this, config.retries || 0);
    _interceptors.set(this, config.interceptors || {});
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


  _createClass(Request, [{
    key: 'method',
    value: function method(value) {
      if ((0, _lodash.isUndefined)(value)) {
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

  }, {
    key: 'header',
    value: function header(name, value) {
      var headers = _headers.get(this);
      if ((0, _lodash.isUndefined)(value)) {
        return headers[name];
      }
      headers[name] = value.toString();
      _headers.set(this, headers);
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

  }, {
    key: 'headers',
    value: function headers(value) {
      if ((0, _lodash.isUndefined)(value)) {
        return (0, _lodash.assign)({}, _headers.get(this));
      }

      _headers.set(this, value);
      return this;
    }

    /**
     * @method
     * @name body
     * @param {Object|FormData|Blob|File|String} [value] - The body for this request
     * @returns {Object|FormData|Blob|File|String|Request} - If value is specified, sets the body
     * for this request and returns the current Request.  If value is ommitted,
     * returns the current body
     */

  }, {
    key: 'body',
    value: function body(value) {
      if ((0, _lodash.isUndefined)(value)) {
        return _body.get(this);
      }

      _body.set(this, value);
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

  }, {
    key: 'url',
    value: function (_url2) {
      function url(_x) {
        return _url2.apply(this, arguments);
      }

      url.toString = function () {
        return _url2.toString();
      };

      return url;
    }(function (value) {
      if ((0, _lodash.isUndefined)(value)) {
        return _url.get(this);
      }

      if (value instanceof _url4.default) {
        _url.set(this, value);
        return this;
      }

      if ((0, _lodash.isString)(value) || (0, _lodash.isObject)(value)) {
        var newUrl = _url4.default.factory(url);
        if (newUrl.isAbsolute()) {
          _url.set(this, newUrl);
          return this;
        } else if (_url.get(this) && _url.get().isAbsolute()) {
          _url.set(this, _url.get(this).merge(newUrl));
          return this;
        }
      }

      throw new _exceptions.PropertyValidationException('url', url);
    })

    /**
     * @method
     * @name retries
     * @param {Number} [value] - The number of times this request will be retried on failure.
     * @returns {Number|Request} - If value is specified, sets the number of retries
     * for this request and returns the current Request.  If value is ommitted,
     * returns the current number of retries.
     */

  }, {
    key: 'retries',
    value: function retries(value) {
      if ((0, _lodash.isUndefined)(value)) {
        return _retries.get(this);
      }
      _retries.set(this, value);
      return this;
    }

    /**
     * @method
     * @name interceptors
     * @param {Interceptor[]} [value] - The set of interceptors to be run against this Request and/or Response
     * @returns {Interceptor[]|Request} - If value is specified, overrides the current set of interceptors
     * for this Request and/or Response and returns the current Request.  If value is ommitted,
     * returns the current set of interceptors.
     */

  }, {
    key: 'interceptors',
    value: function interceptors(value) {
      if ((0, _lodash.isUndefined)(value)) {
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

  }, {
    key: 'xsrfCookieName',
    value: function xsrfCookieName(value) {
      if ((0, _lodash.isUndefined)(value)) {
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

  }, {
    key: 'xsrfHeaderName',
    value: function xsrfHeaderName(value) {
      if ((0, _lodash.isUndefined)(value)) {
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

  }, {
    key: 'withCredentials',
    value: function withCredentials(value) {
      if ((0, _lodash.isUndefined)(value)) {
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

  }, {
    key: 'username',
    value: function username(value) {
      if ((0, _lodash.isUndefined)(value)) {
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

  }, {
    key: 'password',
    value: function password(value) {
      if ((0, _lodash.isUndefined)(value)) {
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

  }, {
    key: 'execute',
    value: function execute() {
      var provider = _provider.get(this);
      return provider(this);
    }
  }]);

  return Request;
}();

exports.default = Request;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ResponseInterceptorChain;

var _lodash = __webpack_require__(0);

/**
 * Runs the response interceptors, and responseError interceptors if necessary.
 * @private
 * @class
 * @param {Interceptor[]} interceptors - The array of interceptors to be run
 * @param {Function} accept - Callback that is invoked with the final response
 * object after all interceptors have run successfully.
 * @param {Function} reject - Callback that is invoked with an error object
 * if all of the interceptors fail to recover from an error.
 */
function ResponseInterceptorChain(interceptors, accept, reject) {
  /**
   * Handler for a rejected interceptor.  Runs responseError interceptor for
   * all interceptors following the failure, in an attempt to recover.
   * If one of the interceptors manages to recover, hop back into the next
   * interceptor after the initial failure.
   */
  function failure(remaining, recover) {
    return function (error) {
      function step(rest, err) {
        if ((0, _lodash.isEmpty)(rest)) {
          var interceptor = (0, _lodash.head)(rest);
          var xs = (0, _lodash.tail)(rest);
          var transform = interceptor.responseError;
          var next = (0, _lodash.partial)(step, xs);

          transform(err, recover, next);
        } else {
          reject(err);
        }
      }

      step(remaining, error);
    };
  }

  /** @method
   * Runs the response through the chain of response interceptors
   * @name run
   * @param {Response} response
   */
  this.run = function (response) {
    function step(remaining, next) {
      if (!(0, _lodash.isEmpty)(remaining)) {
        var interceptor = (0, _lodash.head)(remaining);
        var xs = (0, _lodash.tail)(remaining);
        var transform = interceptor.response;
        var success = (0, _lodash.partial)(step, xs);

        transform(response, success, failure(xs, success));
      } else {
        accept(response);
      }
    }

    step(interceptors, response);
  };
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(0);

var _headers2 = __webpack_require__(5);

var _headers3 = _interopRequireDefault(_headers2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _status = new WeakMap();
var _statusText = new WeakMap();
var _headers = new WeakMap();
var _body = new WeakMap();
var _uploadProgress = new WeakMap();
var _downloadProgress = new WeakMap();
var _isChunked = new WeakMap();

function evaluateLazy(property) {
  var value = property.get(this);
  if (!(0, _lodash.isUndefined)(value) && (0, _lodash.isFunction)(value)) {
    property.set(this, value());
  }
  return property.get(this);
}

/**
 * Immutable response container.  Should only be created by executing a {@link Request}.
 * @class
 * @name Response
 */

var Response = function () {

  /**
   * @param {XMLHttpRequest} xhr
   * @param {Observable<String>} body - An Observable representing the body/entity of the response
   * @param {Observable<Object>} uploadProgress - An Observable representing a stream of all upload progress events
   * @param {Observable<Object>} downloadProgress - An Observable representing a stram of all download progress events
   */
  function Response(xhr, body, uploadProgress, downloadProgress) {
    _classCallCheck(this, Response);

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


  _createClass(Response, [{
    key: 'uploadProgress',
    value: function uploadProgress() {
      return evaluateLazy.call(this, _uploadProgress);
    }

    /**
     * @method
     * @name downloadProgress
     * @returns {Observable<Object>} - an Observable stream of download progress events
     */

  }, {
    key: 'downloadProgress',
    value: function downloadProgress() {
      return evaluateLazy.call(this, _downloadProgress);
    }

    /**
     * @method
     * @name body
     * @returns {Observable<String>} - An Observable stream of the response body/entity contents
     */

  }, {
    key: 'body',
    value: function body() {
      return evaluateLazy.call(this, _body);
    }

    /**
     * @method
     * @name status
     * @returns {Number} - The HTTP status code of the response
     */

  }, {
    key: 'status',
    value: function status() {
      return _status.get(this);
    }

    /**
     * @method
     * @name statusText
     * @returns {String} - The status text of the response
     */

  }, {
    key: 'statusText',
    value: function statusText() {
      return _statusText.get(this);
    }

    /**
     * @method
     * @name headers
     * @returns {Object} - An object containing the response headers
     * @example
     * { "Content-Type": "application/json", "Content-Length": "22" }
     */

  }, {
    key: 'headers',
    value: function headers() {
      return _headers.get(this);
    }

    /**
     * Look-up the value of an individual resonse header
     * @method
     * @name header
     * @param {String} name - The name of the header to lookup
     * @returns {String} - The value of the header, or undefined if not found
     */

  }, {
    key: 'header',
    value: function header(name) {
      return _headers.get(this)[name];
    }

    /**
     * @method
     * @name isChunked
     * @returns {Boolean} - Determines if this is a chunked response.  A chunked
     * response will send each chunk through the {@link body} stream.  A non-chunked
     * response will only push the final result through the stream.
     */

  }, {
    key: 'isChunked',
    value: function isChunked() {
      if (!_isChunked.has(this)) {
        var transferEncoding = (this.header(_headers3.default.TRANSFER_ENCODING) || '').toLowerCase();
        var isChunked = transferEncoding.indexOf('chunked') > -1 || transferEncoding.indexOf('identity') > -1;
        // Detect SPDY. It uses chunked transfer but doesn't set the Transfer-Encoding header.
        if (!isChunked) {
          var c = window.chrome;
          var loadTimes = c && c.loadTimes && c.loadTimes();
          var chromeSpdy = loadTimes && loadTimes.wasFetchedViaSpdy;
          var ffSpdy = !!this.header('X-Firefox-Spdy');
          isChunked = ffSpdy || chromeSpdy;
        }
        _isChunked.set(this, isChunked);
      }
      return _isChunked.get(this);
    }
  }]);

  return Response;
}();

exports.default = Response;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STATE = {
  UNSENT: 0,
  OPEN: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
};

/**
 * Internal class used to construct and XMLHttpRequest
 * @private
 * @class
 * @name XHRBuilder
 */

var XHRBuilder = function () {
  function XHRBuilder() {
    _classCallCheck(this, XHRBuilder);

    this.headersReceived = _lodash.noop;
    this.downloadProgress = _lodash.noop;
    this.uploadProgress = _lodash.noop;
    this.complete = _lodash.noop;
    this.progress = _lodash.noop;
    this.error = _lodash.noop;
    this.abort = _lodash.noop;
    this.load = _lodash.noop;
    this.loadEnd = _lodash.noop;
  }

  _createClass(XHRBuilder, [{
    key: 'onHeadersReceived',
    value: function onHeadersReceived(fn) {
      this.headersReceived = fn;
      return this;
    }
  }, {
    key: 'onDownloadProgress',
    value: function onDownloadProgress(fn) {
      this.downloadProgress = fn;
      return this;
    }
  }, {
    key: 'onUploadProgress',
    value: function onUploadProgress(fn) {
      this.uploadProgress = fn;
      return this;
    }
  }, {
    key: 'onError',
    value: function onError(fn) {
      this.error = fn;
      return this;
    }
  }, {
    key: 'onAbort',
    value: function onAbort(fn) {
      this.abort = fn;
      return this;
    }
  }, {
    key: 'onLoad',
    value: function onLoad(fn) {
      this.load = fn;
      return this;
    }
  }, {
    key: 'onLoadEnd',
    value: function onLoadEnd(fn) {
      this.loadEnd = fn;
      return this;
    }
  }, {
    key: 'request',
    value: function request(req) {
      this.req = req;
      return this;
    }
  }, {
    key: 'build',
    value: function build() {
      var self = this;
      var request = this.req;
      var xhr = new XMLHttpRequest();

      var openArgs = [request.method(), request.url().toString(), true];
      if (request.username()) {
        openArgs.push(request.username());

        if (request.password()) {
          openArgs.push(request.password());
        }
      }

      xhr.open.apply(xhr, openArgs);

      if ((0, _lodash.isInteger)(request)) {
        xhr.timeout = request.timeout();
      }

      var headers = request.headers();

      Object.keys(headers).forEach(function (headerName) {
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

      xhr.addEventListener('readystatechange', function (evt) {
        if (xhr.readyState === STATE.HEADERS_RECEIVED) {
          self.headersReceived(evt);
        }
      });

      return xhr;
    }
  }]);

  return XHRBuilder;
}();

exports.default = XHRBuilder;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = XHRProvider;

var _lodash = __webpack_require__(0);

var _rxjs = __webpack_require__(21);

var _rxjs2 = _interopRequireDefault(_rxjs);

var _xhrBuilder = __webpack_require__(18);

var _xhrBuilder2 = _interopRequireDefault(_xhrBuilder);

var _response = __webpack_require__(17);

var _response2 = _interopRequireDefault(_response);

var _requestInterceptorChain = __webpack_require__(14);

var _requestInterceptorChain2 = _interopRequireDefault(_requestInterceptorChain);

var _responseInterceptorChain = __webpack_require__(16);

var _responseInterceptorChain2 = _interopRequireDefault(_responseInterceptorChain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @function
 * Provider-implementation for browser-based clients.  Providers are simply
 * functions that take in a {@link Request} and return an RxJS Observable
 * that eventually contains the {@link Response}.
 * @name XHRProvider
 * @param {Request} request
 * @returns {Observable<Response>}
 */
function XHRProvider(request) {
  var interceptors = request.interceptors();

  function attempt(observable) {
    var response = void 0;
    var offset = 0;
    var body = new _rxjs2.default.Subject();
    var uploadProgress = new _rxjs2.default.Subject();
    var downloadProgress = new _rxjs2.default.Subject();
    var all = [observable, body, uploadProgress, downloadProgress];

    function errorAll(err) {
      all.forEach(function (o) {
        return o.error(err);
      });
    }

    function completeAll() {
      all.forEach(function (o) {
        return o.complete();
      });
    }

    function nextChunk() {
      var chunk = xhr.responseText.slice(offset);
      offset = xhr.responseText.length;
      body.next(chunk);
    }

    var xhr = new _xhrBuilder2.default().request(request).onHeadersReceived(function (evt) {
      response = new _response2.default(xhr, body, uploadProgress, downloadProgress);

      var responseChain = new _responseInterceptorChain2.default(interceptors, function (transformedResponse) {
        return observable.next(transformedResponse);
      }, _rxjs2.default.Observable.throw);

      responseChain.run(response);
    }).onUploadProgress(function (evt) {
      uploadProgress.next(evt);
    }).onDownloadProgress(function (evt) {
      downloadProgress.next(evt);
      if (response.isChunked()) {
        nextChunk();
      }
    }).onLoad(function (evt) {
      if (response.isChunked()) {
        if (xhr.responseText.length > offset) {
          nextChunk();
        }
      } else {
        body.next(xhr.responseText);
      }
    }).onError(_rxjs2.default.Observable.throw).onAbort(errorAll).onLoadEnd(completeAll).build();

    var success = function success(transformed) {
      if (!!transformed.body()) xhr.send(transformed.body());else xhr.send();
    };

    var requestChain = new _requestInterceptorChain2.default(interceptors, success, function (err) {
      _rxjs2.default.Observable.throw(err);
      completeAll();
    });

    requestChain.run(request);
  }

  return _rxjs2.default.Observable.create(attempt);
}

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_20__;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_21__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=rx-http.js.map