/**
 * Base class to be inherited by Interceptors
 * @class
 * @name Interceptor
 */
export default class Interceptor {
  /**
   * Transforms (or fails) an outgoing request.
   * @method
   * @name request
   * @param {Request} request - The request to be processed
   * @param {Function<Request>} accept - called on success to process a (potentially transformed) {@link Request}
   * @param {Function} reject - called on failure to pass an error
   */
  request(request, accept, reject) {
    accept(request);
  }


  /**
   * Try to recover from a request error so processing can resume.
   * @method
   * @name requestError
   * @param error - The error to be processed
   * @param {Function} accept - called on success if we were able to recover
   * @param {Function} reject - called on failure to pass an error
   */
  requestError(error, accept, reject) {
    reject(error);
  }

  /**
   * @method
   * @name response
   * @param {Response} response - The response to be processed
   * @param {Function<Response>} accept - called on success to process a (potentially transformed) {@link Response}
   * @param {Function} reject - called on failure to pass an error
   */
  response(response, accept, reject) {
    accept(response);
  }

  /**
   * Try to recover from a response error so processing can resume.
   * @method
   * @name responseError
   * @param error - The error to be processed
   * @param {Function} accept - called on success if we were able to recover
   * @param {Function} reject - called on failure to pass an error
   */
  responseError(error, accept, reject) {
    reject(error);
  }
}
