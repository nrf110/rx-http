import { isUndefined, isString } from 'lodash';
import Cookies from 'js-cookie';
import Interceptor from '../interceptor';

/**
 * Reads the value from the configured XSRF cookie and sends it back to the
 * server and sends it back in the configured header.
 * @class
 * @name XSRF
 */
export default class XSRF extends Interceptor {
  /**
   * Transforms (or fails) an outgoing request.
   * @method
   * @name request
   * @param {Request} request - The request to be processed
   * @param {Function<Request>} accept - called on success to process a (potentially transformed) {@link Request}
   * @param {Function} reject - called on failure to pass an error
   */
  request(request, accept, reject) {
    const xsrfToken = Cookies.get(request.xsrfCookieName());
    const xsrfHeader = request.xsrfHeaderName();

    if (!isUndefined(xsrfToken) && isString(xsrfToken)) {
      request.headers(xsrfHeader, xsrfToken);
    }

    accept(request);
  }
}

export let xsrf = new XSRF();
