;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['rx'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('rx'));
  } else {
    root.RxHttp = factory(root.Rx);
  }
}(this, function(Rx) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function deepCopy(object) {
  function copyObject(obj) {
    var clone = {};
    Object.keys(obj).forEach(function (key) {
      clone[key] = step(obj[key]);
    });
    return clone;
  }

  function step(obj) {
    if (Array.isArray(obj)) return obj.map(step);else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') return copyObject(obj);else return obj;
  }

  return step(object);
}

var HTTP_EVENTS = {
  UPLOAD_PROGRESS: 'UPLOAD_PROGRESS',
  DOWNLOAD_PROGRESS: 'DOWNLOAD_PROGRESS',
  RESPONSE_RECEIVED: 'RESPONSE_RECEIVED'
};

/**
* Immutable response container
**/
function Response(xhr) {
  var _this = this;

  function lazy(value) {
    var _value = void 0;

    return function () {
      if (value === undefined) {
        if (typeof value === 'function') {
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
  this.headers = lazy(xhr.getAllResponseHeaders());
  this.header = function (name) {
    return _this.headers()[name];
  };

  //TODO: detect/transform response body
  this.body = lazy(function () {});
}

/**
* Immutable request to be executed
**/
function Request(options) {
  var _this2 = this;

  this.timeout = function () {
    return _this2.options.timeout;
  };
  this.retries = function () {
    return _this2.options.retries;
  };
  this.method = function () {
    return options.method;
  };
  this.url = function () {
    return options.url;
  };
  this.body = function () {
    return options.body;
  };
  this.header = function (name) {
    return options.headers[name];
  };
  this.headers = function () {
    return Object.assign({}, options.headers);
  };
  this.query = function (name) {
    if (name === undefined) return Object.assign({}, options.query);else return _this2.options.query[name];
  };

  this.execute = function () {
    return options.provider(_this2);
  };
}

function XHRProvider(request) {
  function registerEvents(xhr, observable, retries) {
    var progressHandler = function progressHandler(type) {
      return function (evt) {
        observable.onNext({ type: type, progress: evt });
      };
    };

    var exceptionHandler = function exceptionHandler(evt) {
      if (retries > 0) {
        attempt(observable, retries - 1);
      } else {
        observable.onError(evt);
        observable.onCompleted();
      }
    };

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', progressHandler(HTTP_EVENTS.UPLOAD_PROGRESS));
      xhr.upload.addEventListener('error', exceptionHandler);
      xhr.upload.addEventListener('abort', exceptionHandler);
    }

    xhr.addEventListener('progress', progressHandler(HTTP_EVENTS.DOWNLOAD_PROGRESS));
    xhr.addEventListener('error', exceptionHandler);
    xhr.addEventListener('abort', exceptionHandler);
    xhr.addEventListener('load', function (evt) {
      var response = new Response(xhr);
      observable.onNext({ type: HTTP_EVENTS.RESPONSE_RECEIVED, response: response });
    });
  }

  function attempt(observable) {
    var remaining = arguments.length <= 1 || arguments[1] === undefined ? request.retries() : arguments[1];

    var xhr = new window.XmlHTTPRequest();
    registerEvents(xhr, observable, remaining);

    xhr.open(request.method(), request.url());

    if (!!request.timeout() && typeof request.timeout() === 'number') {
      xhr.timeout = request.timeout();
    }

    var headers = request.headers();
    Object.keys(headers).forEach(function (headerName) {
      xhr.setRequestHeader(headerName, headers[headerName]);
    });

    // TODO: consider dealing with xhr.responseType
    // TODO: detect/transform request body
    xhr.send(request.body());
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

var BROWSER_METHODS = ['GET', 'POST'];
var identity = function identity(a) {
  return a;
};
/**
* Mutable builder with a fluent-interface for creating immutable Requests
**/

var RequestBuilder = function () {
  function RequestBuilder(retries, timeout, provider, interceptor) {
    _classCallCheck(this, RequestBuilder);

    this.options = Object.assign({}, { retries: retries, timeout: timeout, provider: provider, interceptor: interceptor });
  }

  _createClass(RequestBuilder, [{
    key: 'header',
    value: function header(name, value) {
      if (value === undefined) return this.options.headers[name];else {
        this.options.headers[name] = value.toString();
        return this;
      }
    }
  }, {
    key: 'headers',
    value: function headers(value) {
      if (value === undefined) return Object.assign({}, this.options.headers);else {
        this.options.headers = Object.assign({}, this.options.headers, value);
        return this;
      }
    }
  }, {
    key: 'query',
    value: function query(name, value) {
      if (value === undefined) {
        if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
          this.options.query = name;
          return this;
        } else {
          return this.options.query[name];
        }
      } else {
        this.options.query[name] = value.toString();
        return this;
      }
    }
  }, {
    key: 'body',
    value: function body(value) {
      if (value === undefined) return this.options.body;else {
        this.options.body = value;
        return this;
      }
    }
  }, {
    key: 'timeout',
    value: function timeout(value) {
      if (value === undefined) return this.options.timeout;else {
        this.options.timeout = value;
        return this;
      }
    }
  }, {
    key: 'retries',
    value: function retries(value) {
      if (value === undefined) return this.options.retries;else {
        this.options.retries = value;
        return this;
      }
    }
  }, {
    key: 'build',
    value: function build() {
      var settings = deepCopy(this.options);

      if (!BROWSER_METHODS.some(function (m) {
        return m === settings.method;
      })) {
        settings.method = 'POST';
        settings.headers['X-HTTP-Method-Override'] = this.options.method;
      }

      return new Request(settings);
    }
  }]);

  return RequestBuilder;
}();

var provider = function () {
  if (typeof process !== 'undefined' && typeof process.release !== 'undefined' && process.release.name === 'node') {
    throw new Error('Node.js support coming soon');
  } else {
    return XHRProvider;
  }
}();

/**
* Factory method for RequestBuilder
**/
var Http = {
  request: function request(url, method) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var settings = {
      url: url,
      method: method,
      retries: Http.defaults.retries,
      timeout: Http.defaults.timeout,
      provider: Http.defaults.provider,
      interceptor: Http.defaults.interceptor
    };
    return new RequestBuilder(settings);
  },

  defaults: {
    retries: 0,
    timeout: 30000,
    interceptor: identity,
    provider: provider
  }
};

['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE', 'HEAD', 'TRACE'].forEach(function (method, i) {
  Http[method.toLowerCase()] = function (url) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    return Http.request(url, method, options);
  };
});
return Http;
}));
