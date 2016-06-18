const BROWSER_METHODS = ['GET', 'POST'];

const Interceptors = {

  BodyTransformer: {
    request: (request, accept, reject) => {
      const body = request.body();

      if (_.isObject(body) && !isFile(body) && !isFormData(body) && !isBlob(body)) {
        const json = JSON.stringify(body);
        request.body(json);
      }

      accept(request);
    },
    response: (response, accept, reject) => {
      // TODO: Use Content-Type to determine parser
      // if (response.header(Headers.CONTENT_TYPE))
    }
  },

  XSRF: {
    request: (request, accept, reject) => {
      const xsrfToken = Cookies.get(request.xsrfCookieName()),
            xsrfHeader = request.xsrfHeaderName();

      if (_.isString(xsrfToken)) {
        request.header(xsrfHeader, xsrfToken);
      }

      accept(request);
    }
  },

  ErrorHandling: {
    response: (response, accept, reject) => {
      if (response.status() / 100 === 2) accept(response);
      else reject(response);
    }
  },

  MethodOverride: {
    request: (request, accept, reject) => {
      const originalMethod = request.method();

      if (!BROWSER_METHODS.some(m => m === originalMethod)) {
        request
          .method('POST')
          .header('X-HTTP-Method-Override', originalMethod);
      }

      accept(request);
    }
  }
};
