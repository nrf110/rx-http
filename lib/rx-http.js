(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"), require("js-cookie"), require("rxjs"));
	else if(typeof define === 'function' && define.amd)
		define("rx-http", ["lodash", "js-cookie", "rxjs"], factory);
	else if(typeof exports === 'object')
		exports["rx-http"] = factory(require("lodash"), require("js-cookie"), require("rxjs"));
	else
		root["rx-http"] = factory(root["_"], root["Cookies"], root["Rx"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_14__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
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
exports.Interceptors = undefined;
exports.RequestInterceptorChain = RequestInterceptorChain;
exports.ResponseInterceptorChain = ResponseInterceptorChain;

var _lodash = __webpack_require__(0);

var _jsCookie = __webpack_require__(13);

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _utilities = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BROWSER_METHODS = ['GET', 'POST'];

var Interceptors = {

  BodyTransformer: {
    request: function request(_request, accept, reject) {
      var body = _request.body();

      if ((0, _lodash.isObject)(body) && !(0, _utilities.isFile)(body) && !(0, _utilities.isFormData)(body) && !(0, _utilities.isBlob)(body)) {
        var json = JSON.stringify(body);

        _request.body(json);
      }

      accept(_request);
    }
  },

  XSRF: {
    request: function request(_request2, accept, reject) {
      var xsrfToken = _jsCookie2.default.get(_request2.xsrfCookieName());
      var xsrfHeader = _request2.xsrfHeaderName();

      if ((0, _lodash.isString)(xsrfToken)) {
        _request2.header(xsrfHeader, xsrfToken);
      }

      accept(_request2);
    }
  },

  ErrorHandling: {
    response: function response(_response, accept, reject) {
      if (_response.status() / 100 === 2) {
        accept(_response);
      } else {
        reject(_response);
      }
    }
  },

  MethodOverride: {
    request: function request(_request3, accept, reject) {
      var originalMethod = _request3.method();

      if (!BROWSER_METHODS.some(function (m) {
        return m === originalMethod;
      })) {
        _request3.method('POST').header('X-HTTP-Method-Override', originalMethod);
      }

      accept(_request3);
    }
  }
};

/**
 * Runs the request interceptors, and requestError interceptors if necessary.
 * @class
 * @param {Object[]} interceptors - The array of interceptors to be run
 * @param {Function} accept - Callback that is invoked with the final request
 * object after all interceptors have run successfully.
 * @param {Function} reject - Callback that is invoked with an error object
 * if all of the interceptors fail to recover from an error.
 */
exports.Interceptors = Interceptors;
function RequestInterceptorChain(interceptors, accept, reject) {
  /**
   * Pass-through accept for the request.
   */
  function defaultRequest(request, good) {
    good(request);
  }

  /**
   * Immediately rejects the error without trying to recover.
   */
  function defaultRequestError(error, good, bad) {
    bad(error);
  }

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
          var transform = interceptor.requestError || defaultRequestError;
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
   */
  this.run = function (request) {
    function step(remaining, next) {
      if (!(0, _lodash.isEmpty)(remaining)) {
        var interceptor = (0, _lodash.head)(remaining);
        var xs = (0, _lodash.tail)(remaining);
        var transform = interceptor.request || defaultRequest;
        var success = (0, _lodash.partial)(step, xs);

        transform(request, success, failure(xs, success));
      } else {
        accept(request);
      }
    }

    step(interceptors, request);
  };
}

/**
 * Runs the response interceptors, and responseError interceptors if necessary.
 * @class
 * @param {Object[]} interceptors - The array of interceptors to be run
 * @param {Function} accept - Callback that is invoked with the final response
 * object after all interceptors have run successfully.
 * @param {Function} reject - Callback that is invoked with an error object
 * if all of the interceptors fail to recover from an error.
 */
function ResponseInterceptorChain(interceptors, accept, reject) {
  /**
   * Pass-through accept for the response.
   */
  function defaultResponse(response, good) {
    good(response);
  }

  /**
   * Immediately rejects the error without trying to recover.
   */
  function defaultResponseError(error, good, bad) {
    bad(error);
  }

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
          var transform = interceptor.responseError || defaultResponseError;
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
   */
  this.run = function (response) {
    function step(remaining, next) {
      if (!(0, _lodash.isEmpty)(remaining)) {
        var interceptor = (0, _lodash.head)(remaining);
        var xs = (0, _lodash.tail)(remaining);
        var transform = interceptor.response || defaultResponse;
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
function isFile(value) {
  return toString.call(value) === '[object File]';
}

function isFormData(value) {
  return toString.call(value) === '[object FormData]';
}

function isBlob(value) {
  return toString.call(value) === '[object Blob]';
}

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

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
exports.default = Url;

var _lodash = __webpack_require__(0);

var _utilities = __webpack_require__(2);

function encode(val) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

function Url(url) {
  var self = this;
  var parts = {};

  if ((0, _lodash.isObject)(url)) {
    (0, _lodash.assign)(parts, url);
  } else if ((0, _lodash.isString)(url)) {
    parts = (0, _utilities.parseUri)(url);
  }

  function property(key) {
    return function (value) {
      if ((0, _lodash.isUndefined)(value)) {
        return parts[key];
      }
      parts[key] = value;
      return self;
    };
  }

  var protocol = this.protocol = property('protocol');
  var user = this.user = property('user');
  var password = this.password = property('password');
  var host = this.host = property('host');
  var port = this.port = property('port');
  var directory = this.directory = property('directory');
  var file = this.file = property('file');
  var fragment = this.fragment = property('fragment');

  var isAbsolute = this.isAbsolute = function () {
    return !!host;
  };

  var isRelative = this.isRelative = function () {
    return !isAbsolute();
  };

  /** @method
   * @name query
   * @param {string|object} [name] - The name of the query-string parameter
   * @param [value] - The value of the query-string parameter
   * @returns {object|string|Request} -
   * If no parameters are specified - returns a copy of the entire query hash.
   * @example
   * {{
   *   request.query() // returns { "foo": "bar" }
   * }}
   * If only name is specified, and name is a string - returns the value for the key in the query hash.
   * @example
   * {{
   *    request.query("foo") // returns "bar"
   * }}
   * If only name is specified, and name is an object - replaces the entire query hash
   * and returns the current Request.
   * @example
   * {{
   *    request.query({ "foo": "bar", "baz": 1 }).execute()
   * }}
   * If name and value are specified - sets the value of name in the query hash
   * and returns the current Request.
   * @example
   * {{
   *   request.query("foo", "bar").execute()
   * }}
   */
  var query = this.query = function (name, value) {
    if ((0, _lodash.isUndefined)(name)) {
      if ((0, _lodash.isUndefined)(value)) {
        if ((0, _lodash.isObject)(name)) {
          parts.query = name;
          return self;
        }
        return parts.query[name];
      }
      parts.query[name] = value;
      return self;
    }
    return (0, _lodash.assign)({}, parts.query);
  };

  var userInfo = this.userInfo = function () {
    var u = user();
    var p = password();

    if ((0, _lodash.isString)(u) && !(0, _lodash.isEmpty)(u.trim()) && (0, _lodash.isString)(p) && (0, _lodash.isEmpty)(p.trim())) {
      return u + ':' + p;
    }

    return null;
  };

  var authority = this.authority = function () {
    var pr = protocol() ? protocol() + '://' : '';
    var ui = userInfo() ? userInfo() + '@' : '';
    var h = host() || '';
    var p = port() ? ':' + port() : '';

    return pr + ui + h + p;
  };

  var path = this.path = function () {
    var dir = directory() || '';
    var f = file() || '';

    if ((0, _lodash.endsWith)(dir, '/')) {
      if ((0, _lodash.startsWith)(f, '/')) {
        return dir + f.substring(1);
      }

      return dir + f;
    } else if ((0, _lodash.startsWith)(f, '/')) {
      return dir + f;
    }

    return dir + '/' + f;
  };

  this.merge = function (other) {
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
  };

  /** @method
   * @name toString
   */
  this.toString = function (serializeQuery) {
    var auth = authority();
    var p = path();
    var f = fragment();
    var querySerializer = serializeQuery || _lodash.identity;
    var q = querySerializer(query());

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
  };
}

/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PropertyValidationException = exports.PropertyValidationException = function () {
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

/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _lodash = __webpack_require__(0);

var _request = __webpack_require__(9);

var _request2 = _interopRequireDefault(_request);

var _interceptors = __webpack_require__(1);

var _xhrProvider = __webpack_require__(12);

var _xhrProvider2 = _interopRequireDefault(_xhrProvider);

var _url = __webpack_require__(3);

var _url2 = _interopRequireDefault(_url);

var _path = __webpack_require__(6);

var _path2 = _interopRequireDefault(_path);

var _exceptions = __webpack_require__(5);

var _utilities = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An HTTP client.
 * @class
 * @param {Object} [options] - A hash of settings for this client.
 */
function Http() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var self = this;
  var settings = (0, _lodash.assign)({}, Http.defaults, options);

  function property(key, isValid) {
    self[key] = function (value) {
      if ((0, _lodash.isUndefined)(value)) {
        return settings[key];
      } else if (isValid(value)) {
        settings[key] = value;
        return self;
      } else {
        throw new _exceptions.PropertyValidationException(key, value);
      }
    };
  }

  /** @method
   * @name baseUrl
   * @param {string|Http} [url] - the base URL applied by default to all
   * requests from this client.
   * @returns {string|Http} - If url is specified, updates the default baseUrl
   * for all requests created with this client, and returns the client instance.
   * If value is ommitted, returns the current baseUrl.
   */
  property('baseUrl', _lodash.isString);

  /** @method
   * @name timeout
   * @param {number} [value] - The request timeout in milliseconds
   * @returns {number|Http} - If value is specified, updates the default request
   * timeout for all requests created with this client, and returns the client
   * instance.  If value is ommitted, returns the current timeout value.
   */
  property('timeout', _lodash.isInteger);

  /** @method
   * @name retries
   * @param {number} [value] - The number of retries allowed
   * @returns {number|Http} - If count is specified, sets the default number
   * of retries allowed for requests from this client, and returns the client
   * instance.  If count is ommitted, returns the current value.
   */
  property('retries', _lodash.isInteger);

  /** @method
   * @name interceptors
   * @param {Object[]} [values] - An array of interceptors.
   * @returns {Object[]|Http} - If values is specified, replaces the default
   * interceptors for all requests from this client, and returns the client
   * instance.  If values is ommitted, returns the current array of
   * interceptors.
   */
  property('interceptors', _lodash.isArray);

  /** @method
   * @name addInterceptor
   * @param {Object} interceptor - Add the interceptor to the end of the
   * chain of interceptors.
   * @return {Http} - The current client instance.
   */
  this.addInterceptor = function (interceptor) {
    settings.interceptors.push(interceptor);
    return this;
  };

  /** @method
   * @name removeInterceptor
   * @param interceptor - Remove the interceptor from the chain of interceptors.
   * @returns {Http} - The current client instance.
   */
  this.removeInterceptor = function (interceptor) {
    settings.interceptors = (0, _lodash.remove)(settings.interceptors, function (i) {
      return i === interceptor;
    });
    return this;
  };

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
    self[method.toLowerCase()] = function (url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return request(url, (0, _lodash.assign)({ method: method }, options));
    };
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

Http.defaults = {
  baseUrl: '',
  retries: 0,
  timeout: 30000,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  withCredentials: false,
  interceptors: [_interceptors.Interceptors.MethodOverride, _interceptors.Interceptors.BodyTransformer, _interceptors.Interceptors.XSRF, _interceptors.Interceptors.ErrorHandling],
  provider: _xhrProvider2.default
};

module.exports = Http;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Interceptors = exports.Headers = exports.Http = exports.Url = undefined;

var _url = __webpack_require__(3);

var _url2 = _interopRequireDefault(_url);

var _http = __webpack_require__(7);

var _http2 = _interopRequireDefault(_http);

var _headers = __webpack_require__(4);

var _headers2 = _interopRequireDefault(_headers);

var _interceptors = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Url = _url2.default;
exports.Http = _http2.default;
exports.Headers = _headers2.default;
exports.Interceptors = _interceptors.Interceptors;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Request;

var _lodash = __webpack_require__(0);

var _exceptions = __webpack_require__(5);

var _exceptions2 = _interopRequireDefault(_exceptions);

var _path = __webpack_require__(6);

var _path2 = _interopRequireDefault(_path);

var _url = __webpack_require__(3);

var _url2 = _interopRequireDefault(_url);

var _utilities = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A Request should only ever be created by an instance of {@link Http}
 * @class
 * @param {Object} config - Override default settings for this Request only.
 * @private
 */
function Request(config) {
  var self = this;

  function property(key) {
    var transformIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _lodash.identity;
    var transformOut = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _lodash.identity;

    self[key] = function (value) {
      if ((0, _lodash.isUndefined)(value)) {
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
    config.headers = config.headers || {};
    if ((0, _lodash.isUndefined)(value)) {
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
  property('headers', _lodash.identity, function (headers) {
    return (0, _lodash.assign)({}, headers);
  });

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
  property('url', function (url) {
    if (url instanceof _url2.default) {
      return url;
    } else if ((0, _lodash.isString)(url) || (0, _lodash.isObject)(url)) {
      var newUrl = new _url2.default(url);
      if (newUrl.isAbsolute()) {
        return newUrl;
      } else if (config.url && config.url.isAbsolute()) {
        return config.url.merge(newUrl);
      }
    }

    throw new _exceptions2.default('url', url);
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

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Response;

var _lodash = __webpack_require__(0);

var _headers = __webpack_require__(4);

var _headers2 = _interopRequireDefault(_headers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Immutable response container
 * @class
 */
function Response(xhr, body, uploadProgress, downloadProgress) {
  var _this = this;

  self = this;

  function lazy(value) {
    var _value = void 0;

    return function () {
      if (!(0, _lodash.isUndefined)(value)) {
        if ((0, _lodash.isFunction)(value)) {
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

  this.header = function (name) {
    return _this.headers()[name];
  };

  this.isChunked = lazy(function () {
    var transferEncoding = (self.header(_headers2.default.TRANSFER_ENCODING) || '').toLowerCase();
    var isChunked = transferEncoding.indexOf('chunked') > -1 || transferEncoding.indexOf('identity') > -1;
    // Detect SPDY. It uses chunked transfer but doesn't set the Transfer-Encoding header.
    if (!isChunked) {
      var c = window.chrome;
      var loadTimes = c && c.loadTimes && c.loadTimes();
      var chromeSpdy = loadTimes && loadTimes.wasFetchedViaSpdy;
      var ffSpdy = !!self.header('X-Firefox-Spdy');
      isChunked = ffSpdy || chromeSpdy;
    }

    return isChunked;
  });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(0);

var _interceptors = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STATE = {
  UNSENT: 0,
  OPEN: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
};

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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = XHRProvider;

var _lodash = __webpack_require__(0);

var _rxjs = __webpack_require__(14);

var _rxjs2 = _interopRequireDefault(_rxjs);

var _xhrBuilder = __webpack_require__(11);

var _xhrBuilder2 = _interopRequireDefault(_xhrBuilder);

var _response = __webpack_require__(10);

var _response2 = _interopRequireDefault(_response);

var _interceptors = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function XHRProvider(request) {
  var interceptors = request.interceptors();

  function attempt(observable) {
    var retries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : request.retries();

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

    function exceptionHandler(evt) {
      if (retries > 0) attempt(observable, retries - 1);else errorAll(evt);
    }

    function nextChunk() {
      var chunk = xhr.responseText.slice(offset);
      offset = xhr.responseText.length;
      body.next(chunk);
    }

    var xhr = new _xhrBuilder2.default().request(request).onHeadersReceived(function (evt) {
      response = new _response2.default(xhr, body, uploadProgress, downloadProgress);

      var responseChain = new _interceptors.ResponseInterceptorChain(interceptors, function (transformedResponse) {
        return observable.next(transformedResponse);
      }, exceptionHandler);

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
    }).onError(exceptionHandler).onAbort(exceptionHandler).onLoadEnd(completeAll).build();

    var success = function success(transformed) {
      if (!!transformed.body()) xhr.send(transformed.body());else xhr.send();
    };

    var requestChain = new _interceptors.RequestInterceptorChain(interceptors, success, function (err) {
      observable.error(err);
      completeAll();
    });

    requestChain.run(request);
  }

  return _rxjs2.default.Observable.create(attempt);
}

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=rx-http.js.map