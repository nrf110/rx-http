import Interceptor from '../interceptor';

/**
 * Rejects a response with a non-20x status-code.
 * @class
 * @name ErrorHandling
 */
export default class ErrorHandling extends Interceptor {
  response(response, accept, reject) {
    if (response.status() / 100 === 2) {
      accept(response);
    } else {
      reject(response);
    }
  }
}
