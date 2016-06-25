;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['rx', 'lodash', 'js-cookie'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('rx'), require('lodash'), require('js-cookie'));
  } else {
    root.RxHttp = factory(root.Rx, root._, root.Cookies);
  }
}(this, function(Rx, _, Cookies) {
'use strict';

function isFile(value) {
  return toString.call(value) === '[object File]';
}

function isFormData(value) {
  return toString.call(value) === '[object FormData]';
}

function isBlob(value) {
  return toString.call(value) === '[object Blob]';
}

var Headers = {

  CONTENT_TYPE: "Content-Type"

};

/**
 * Immutable response container
 * @class
 */
function Response(xhr) {
  var _this = this;

  function lazy(value) {
    var _value = void 0;

    return function () {
      if (_.isUndefined(value)) {
        if (_.isFunction(value)) {
          _value = value();
        } else {
          _value = value;
        }
      }

      return _value;
    };
  }

  this.status = lazy(xhr.status);

  this.statusText = lazy(xhr.statusText);

  this.headers = lazy(xhr.getAllResponseHeaders);

  this.header = function (name) {
    return _this.headers()[name];
  };

  this.body = lazy(xhr.response);
}

/**
 * A Request should only ever be created by an instance of {@link Http}
 * @class
 * @param {Object} config - Override default settings for this Request only.
 * @private
 */
function Request(config) {
  /** @method
   * @name method
   * @param {string} [value] - The HTTP method for this request
   * @returns {string|Request} - If value is specified, sets the HTTP method
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current HTTP method
   */
  this.method = function (value) {
    if (_.isUndefined(value)) {
      return config.method;
    } else {
      config.method = value;
      return this;
    }
  };

  /** @method
   * @name header
   * @param {string} name - The name of the header
   * @param {string} [value] - The value to assign to the header
   * @returns {string|Request} - If value is specified, sets the header
   * and returns the current Request.  If value is ommitted, returns the
   * value for the header.
   */
  this.header = function (name, value) {
    if (_.isUndefined(value)) {
      return config.headers[name];
    } else {
      config.headers[name] = value.toString();
      return this;
    }
  };

  /** @method
   * @name headers
   * @param {Object} [value] - The hash of headers to send with this request.
   * Replaces any existing headers
   * @returns {object|Request} - If value is specified, sets the headers
   * and returns the current Request.  If value is ommitted, returns a copy
   * of the current headers.
   */
  this.headers = function (value) {
    if (_.isUndefined(value)) {
      return Object.assign({}, config.headers);
    } else {
      config.headers = value;
      return this;
    }
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
  this.query = function (name, value) {
    if (_.isUndefined(name)) {

      if (_.isUndefined(value)) {

        if (_.isObject(name)) {
          config.query = name;
          return this;
        } else {
          return config.query[name];
        }
      } else {
        config.query[name] = value;
        return this;
      }
    } else {
      return Object.assign({}, config.query);
    }
  };

  /** @method
   * @name body
   * @param {Object|FormData|Blob|File|string} [value] - The body for this request
   * @returns - If value is specified, sets the body
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current body
   */
  this.body = function (value) {
    if (_.isUndefined(value)) {
      return config.body;
    } else {
      config.body = value;
      return this;
    }
  };

  /** @method
   * @name timeout
   * @param {number} [value] - The number of milliseconds to wait before the request times out.
   * @returns {number|Request} - If value is specified, sets the timeout
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current timeout.
   */
  this.timeout = function (value) {
    if (_.isUndefined(value)) {
      return config.timeout;
    } else {
      config.timeout = value;
      return this;
    }
  };

  /** @method
   * @name retries
   * @param {number} [value] - The number of times this request will be retried on failure.
   * @returns {number|Request} - If value is specified, sets the number of retries
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current number of retries.
   */
  this.retries = function (value) {
    if (_.isUndefined(value)) {
      return config.retries;
    } else {
      config.retries = value;
      return this;
    }
  };

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

var BROWSER_METHODS = ['GET', 'POST'];

var Interceptors = {

  BodyTransformer: {
    request: function (_request) {
      function request(_x, _x2, _x3) {
        return _request.apply(this, arguments);
      }

      request.toString = function () {
        return _request.toString();
      };

      return request;
    }(function (request, accept, reject) {
      var body = request.body();

      if (_.isObject(body) && !isFile(body) && !isFormData(body) && !isBlob(body)) {
        var json = JSON.stringify(body);
        request.body(json);
      }

      accept(request);
    })
  },

  XSRF: {
    request: function (_request2) {
      function request(_x4, _x5, _x6) {
        return _request2.apply(this, arguments);
      }

      request.toString = function () {
        return _request2.toString();
      };

      return request;
    }(function (request, accept, reject) {
      var xsrfToken = Cookies.get(request.xsrfCookieName());
      var xsrfHeader = request.xsrfHeaderName();

      if (_.isString(xsrfToken)) {
        request.header(xsrfHeader, xsrfToken);
      }

      accept(request);
    })
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
    request: function (_request3) {
      function request(_x7, _x8, _x9) {
        return _request3.apply(this, arguments);
      }

      request.toString = function () {
        return _request3.toString();
      };

      return request;
    }(function (request, accept, reject) {
      var originalMethod = request.method();

      if (!BROWSER_METHODS.some(function (m) {
        return m === originalMethod;
      })) {
        request.method('POST').header('X-HTTP-Method-Override', originalMethod);
      }

      accept(request);
    })
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
        if (!_.isEmpty(rest)) {
          var interceptor = _.head(rest);
          var tail = _.tail(rest);
          var transform = interceptor.requestError || defaultRequestError;
          var next = _.partial(step, tail);

          transform(err, recover, next);
        } else {
          reject(err);
        }
      }

      step();
    };
  }

  /** @method
   * Runs the request through the chain of request interceptors
   * @name run
   */
  this.run = function (request) {
    function step(remaining, next) {
      if (!_.isEmpty(remaining)) {
        var interceptor = _.head(remaining);
        var tail = _.tail(remaining);
        var transform = interceptor.request || defaultRequest;
        var success = _.partial(step, tail);

        transform(request, success, failure(tail, success));
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
    good(request);
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
        if (!_.isEmpty(rest)) {
          var interceptor = _.head(rest);
          var tail = _.tail(rest);
          var transform = interceptor.responseError || defaultResponseError;
          var next = _.partial(step, tail);

          transform(err, recover, next);
        } else {
          reject(err);
        }
      }

      step();
    };
  }

  /** @method
   * Runs the response through the chain of response interceptors
   * @name run
   */
  this.run = function (response) {
    function step(remaining, next) {
      if (!_.isEmpty(remaining)) {
        var interceptor = _.head(remaining);
        var tail = _.tail(remaining);
        var transform = interceptor.response || defaultResponse;
        var success = _.partial(step, tail);

        transform(response, success, failure(tail, success));
      } else {
        accept(response);
      }
    }

    step(interceptors, request);
  };
}

var HTTP_EVENTS = {

  UPLOAD_PROGRESS: 'UPLOAD_PROGRESS',

  DOWNLOAD_PROGRESS: 'DOWNLOAD_PROGRESS',

  RESPONSE_RECEIVED: 'RESPONSE_RECEIVED'

};

function XHRProvider(request) {
  function registerEvents(xhr, observable, retries) {

    function progressHandler(type, evt) {
      observable.onNext({ type: type, progress: evt });
    }

    function exceptionHandler(evt) {
      if (retries > 0) {
        attempt(observable, retries - 1);
      } else {
        observable.onError(evt);
        observable.onCompleted();
      }
    }

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', _.partial(progressHandler, HTTP_EVENTS.UPLOAD_PROGRESS));
      xhr.upload.addEventListener('error', exceptionHandler);
      xhr.upload.addEventListener('abort', exceptionHandler);
    }

    xhr.addEventListener('progress', _.partial(progressHandler, HTTP_EVENTS.DOWNLOAD_PROGRESS));
    xhr.addEventListener('error', exceptionHandler);
    xhr.addEventListener('abort', exceptionHandler);
    xhr.addEventListener('load', function (evt) {
      var response = new Response(xhr);
      var interceptors = request.interceptors();
      var successHandler = function successHandler(transformed) {
        observable.onNext({ type: HTTP_EVENTS.RESPONSE_RECEIVED, response: transformed });
      };

      new ResponseInterceptorChain(interceptors, successHandler, exceptionHandler).run(response);
    });
  }

  function attempt(observable) {
    var remaining = arguments.length <= 1 || arguments[1] === undefined ? request.retries() : arguments[1];


    var xhr = new XmlHttpRequest();

    registerEvents(xhr, observable, remaining);

    xhr.open(request.method(), request.url());

    if (_.isInteger(request.timeout())) {
      xhr.timeout = request.timeout();
    }

    var headers = request.headers();
    Object.keys(headers).forEach(function (headerName) {
      xhr.setRequestHeader(headerName, headers[headerName]);
    });

    var interceptors = request.interceptors();
    var success = function success(transformed) {
      return xhr.send(transformed.body());
    };
    var failure = function failure(error) {
      observable.onError(error);
      observable.onCompleted();
    };
    new RequestInterceptorChain(interceptors, success, failure).run(request);
  }

  var stream = Rx.Observable.create(attempt).share();

  var uploadProgress = stream.filter(function (evt) {
    return evt.type === HTTP_EVENTS.UPLOAD_PROGRESS;
  }).map(function (evt) {
    return evt.progress;
  });

  var downloadProgress = stream.filter(function (evt) {
    return evt.type === HTTP_EVENTS.DOWNLOAD_PROGRESS;
  }).map(function (evt) {
    return evt.progress;
  });

  var response = stream.filter(function (evt) {
    return evt.type === HTTP_EVENTS.RESPONSE_RECEIVED;
  }).map(function (evt) {
    return evt.response;
  });

  return {
    uploadProgress: uploadProgress,
    downloadProgress: downloadProgress,
    response: response
  };
}

/**
 * An HTTP client.
 * @class
 * @param {Object} [options] - A hash of settings for this client.
 */
function Http() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var settings = _.assign({}, Http.defaults, options);

  /** @method
   * @name timeout
   * @param {number} [value] - The request timeout in milliseconds
   * @returns {number|Http} - If value is specified, updates the default request
   * timeout for all requests created with this client, and returns the client
   * instance.  If value is ommitted, returns the current timeout value.
   */
  this.timeout = function (value) {
    if (_.isInteger(value)) {
      settings.timeout = value;
      return this;
    } else {
      return settings.timeout;
    }
  };

  /** @method
   * @name baseUrl
   * @param {string|Http} [url] - the base URL applied by default to all
   * requests from this client.
   * @returns {string|Http} - If url is specified, updates the default baseUrl
   * for all requests created with this client, and returns the client instance.
   * If value is ommitted, returns the current baseUrl.
   */
  this.baseUrl = function (url) {
    if (_.isString(url)) {
      settings.baseUrl = url;
      return this;
    } else {
      return settings.url;
    }
  };

  /** @method
   * @name retries
   * @param {number} [count] - The number of retries allowed
   * @returns {number|Http} - If count is specified, sets the default number
   * of retries allowed for requests from this client, and returns the client
   * instance.  If count is ommitted, returns the current value.
   */
  this.retries = function (count) {
    if (_.isInteger(count)) {
      settings.retries = count;
      return this;
    } else {
      return settings.retries;
    }
  };

  /** @method
   * @name interceptors
   * @param {Object[]} [values] - An array of interceptors.
   * @returns {Object[]|Http} - If values is specified, replaces the default
   * interceptors for all requests from this client, and returns the client
   * instance.  If values is ommitted, returns the current array of
   * interceptors.
   */
  this.interceptors = function (values) {
    if (_.isArray(values)) {
      settings.interceptors = values;
      return this;
    } else {
      return settings.interceptors;
    }
  };

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
    settings.interceptors = _.remove(settings.interceptors, function (i) {
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
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    // TODO: parse URI.  merge query-string with value from settings
    return new Request(settings);
  };

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
  this.head = generateRequestMethod('HEAD');

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
  this.get = generateRequestMethod('GET');

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
  this.options = generateRequestMethod('OPTIONS');

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
  this.delete = generateRequestMethod('DELETE');

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
  this.trace = generateRequestMethod('TRACE');

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
  this.post = generateRequestMethod('POST');

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
  this.put = generateRequestMethod('PUT');

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
  this.patch = generateRequestMethod('PATCH');

  function generateRequestMethod(method) {
    return function (url) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return request(url, _.assign({ method: method }, options));
    };
  }
}

var provider = function () {
  var thisIsNode = !_.isUndefined(process) && !_.isUndefined(process.release) && !_.isUndefined(process.release.name) && process.release.name.search(/node|io.js/) !== -1;

  if (thisIsNode) throw new Error("Node.js is not yet supported!");else return XHRProvider;
}();

Http.defaults = {
  baseUrl: '',
  retries: 0,
  timeout: 30000,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  interceptors: [Interceptors.MethodOverride, Interceptors.BodyTransformer, Interceptors.XSRF, Interceptors.ErrorHandling],
  provider: provider
};
return Http;
}));
