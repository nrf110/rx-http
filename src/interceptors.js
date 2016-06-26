import _ from 'lodash';
import Cookies from 'js-cookie';
import { isFile, isFormData, isBlob } from './utilities';

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
    }
  },

  XSRF: {
    request: (request, accept, reject) => {
      const xsrfToken = Cookies.get(request.xsrfCookieName());
      const xsrfHeader = request.xsrfHeaderName();

      if (_.isString(xsrfToken)) {
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
    return function(error) {
      function step(rest, err) {
        if (!_.isEmpty(rest)) {
          const interceptor = _.head(rest);
          const tail = _.tail(rest);
          const transform = interceptor.requestError || defaultRequestError;
          const next = _.partial(step, tail);

          transform(err, recover, next);
        } else {
          reject(err);
        }
      }

      step();
    }
  }

  /** @method
   * Runs the request through the chain of request interceptors
   * @name run
   */
  this.run = function(request) {
    function step(remaining, next) {
      if (!_.isEmpty(remaining)) {
        const interceptor = _.head(remaining);
        const tail = _.tail(remaining);
        const transform = interceptor.request || defaultRequest;
        const success = _.partial(step, tail);

        transform(request, success, failure(tail, success));
      } else {
        accept(request);
      }
    }

    step(interceptors, request);
  }
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
    return function(error) {
      function step(rest, err) {
        if (!_.isEmpty(rest)) {
          const interceptor = _.head(rest);
          const tail = _.tail(rest);
          const transform = interceptor.responseError || defaultResponseError;
          const next = _.partial(step, tail);

          transform(err, recover, next);
        } else {
          reject(err);
        }
      }

      step();
    }
  }

  /** @method
   * Runs the response through the chain of response interceptors
   * @name run
   */
  this.run = function(response) {
    function step(remaining, next) {
      if (!_.isEmpty(remaining)) {
        const interceptor = _.head(remaining);
        const tail = _.tail(remaining);
        const transform = interceptor.response || defaultResponse;
        const success = _.partial(step, tail);

        transform(response, success, failure(tail, success));
      } else {
        accept(response);
      }
    }

    step(interceptors, request);
  }
}

export default {
  Interceptors,
  RequestInterceptorChain,
  ResponseInterceptorChain
};
