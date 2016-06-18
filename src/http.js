function Http(options = {}) {
  const settings = {};

  _.assign(settings, Http.defaults, options);

  /**
  * Get or set the default timeout for this client
  **/
  this.timeout = function(timeout) {
    if (_.isInteger(timeout)) {
      settings.timeout = timeout;
      return this;
    } else {
      return settings.timeout;
    }
  }

  /**
  * Get or set the default baseUrl for this client
  **/
  this.baseUrl = function(url) {
    if (_.isString(url)) {
      settings.baseUrl = url;
      return this;
    } else {
      return settings.url;
    }
  }

  /**
  * Get or set the default retries for this client
  **/
  this.retries = function(count) {
    if (_.isInteger(count)) {
      settings.retries = count;
      return this;
    } else {
      return settings.retries;
    }
  }

  /**
  * Get or replace the default interceptors for this client
  **/
  this.interceptors = function(requestInterceptors) {
    if (_.isArray(requestInterceptors)) {
      settings.interceptors = requestInterceptors;
      return this;
    } else {
      return settings.interceptors;
    }
  }

  /**
  * Add an interceptor to be run after the existing interceptors
  **/
  this.addInterceptor = function(interceptor) {
    settings.interceptors.push(interceptor);
    return this;
  }

  this.removeInterceptor = function(interceptor) {
    settings.interceptors = _.remove(settings.interceptors, (i) => i === interceptor);
    return this;
  }

  /**
  *
  **/
  request(url, options = {}) {
    return new Request(settings);
  }
}

Http.defaults = {
  baseUrl: '',
  retries: 0,
  timeout: 30000,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN'
  interceptors: [
    Interceptors.BodyTransformer,
    Interceptors.XSRF
  ],
  provider
};

['GET', 'OPTIONS', 'DELETE', 'HEAD', 'TRACE'].forEach((method) => {
  Http.prototype[method.toLowerCase()] = ((url, options = {}) => {
    Http.prototype.request(url, options);
  });
});

['POST', 'PUT', 'PATCH'].forEach((method) => {
  Http.prototype[method.toLowerCase()] = ((url, body, options = {}) => {
    options.body = body;
    Http.prototype.request(url, body);
  });
});
