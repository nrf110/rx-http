import Interceptor from '../interceptor';

/**
 * Rejects a response with a non-20x status-code.
 * @class
 * @name ErrorHandling
 */
export default class ErrorHandling extends Interceptor {
  /**
   * @method
   * @name response
   * @param {Response} response - The response to be processed
   * @param {Function<Response>} accept - called on success to process a (potentially transformed) {@link Response}
   * @param {Function} reject - called on failure to pass an error
   */
  response(response, accept, reject) {
    if (response.status() / 100 === 2) {
      accept(response);
    } else {
      reject(response);
    }
  }
}
