import { isObject, isString, isEmpty, head, tail, partial } from 'lodash';
import Cookies from 'js-cookie';
import { isFile, isFormData, isBlob } from './utilities';

const BROWSER_METHODS = ['GET', 'POST'];

export const Interceptors = {

  BodyTransformer: {
    request: (request, accept, reject) => {
      const body = request.body();

      if (isObject(body) && !isFile(body) && !isFormData(body) && !isBlob(body)) {
        const json = JSON.stringify(body);

        request.body(json);
      }

      accept(request);
    }
  },

  XSRF: {
    request: (request, accept, reject) => {
      const xsrfToken = Cookies.get(request.xsrfCookieName());
      const xsrfHeader = request.xsrfHeaderName();

      if (isString(xsrfToken)) {
        request.header(xsrfHeader, xsrfToken);
      }

      accept(request);
    }
  },

  ErrorHandling: {
    response: (response, accept, reject) => {
      if (response.status() / 100 === 2) {
        accept(response);
      } else {
        reject(response);
      }
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

/**
 * Runs the request interceptors, and requestError interceptors if necessary.
 * @class
 * @param {Object[]} interceptors - The array of interceptors to be run
 * @param {Function} accept - Callback that is invoked with the final request
 * object after all interceptors have run successfully.
 * @param {Function} reject - Callback that is invoked with an error object
 * if all of the interceptors fail to recover from an error.
 */
export function RequestInterceptorChain(interceptors, accept, reject) {
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
        if (!isEmpty(rest)) {
          const interceptor = head(rest);
          const xs = tail(rest);
          const transform = interceptor.requestError || defaultRequestError;
          const next = partial(step, xs);

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
      if (!isEmpty(remaining)) {
        const interceptor = head(remaining);
        const xs = tail(remaining);
        const transform = interceptor.request || defaultRequest;
        const success = partial(step, xs);

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
export function ResponseInterceptorChain(interceptors, accept, reject) {
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
        if (isEmpty(rest)) {
          const interceptor = head(rest);
          const xs = tail(rest);
          const transform = interceptor.responseError || defaultResponseError;
          const next = partial(step, xs);

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
      if (!isEmpty(remaining)) {
        const interceptor = head(remaining);
        const xs = tail(remaining);
        const transform = interceptor.response || defaultResponse;
        const success = partial(step, xs);

        transform(response, success, failure(xs, success));
      } else {
        accept(response);
      }
    }

    step(interceptors, response);
  };
}
