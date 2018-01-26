import { isEmpty, head, tail, partial } from 'lodash';

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
export default function ResponseInterceptorChain(interceptors, accept, reject) {
  /**
   * Handler for a rejected interceptor.  Runs responseError interceptor for
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
          const transform = interceptor.responseError;
          const next = partial(step, xs);

          transform.call(interceptor, err, recover, next);
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
      if (!isEmpty(remaining)) {
        const interceptor = head(remaining);
        const xs = tail(remaining);
        const transform = interceptor.response;
        const success = partial(step, xs);

        transform.call(interceptor, response, success, failure(xs, success));
      } else {
        accept(response);
      }
    }

    step(interceptors, response);
  };
}
