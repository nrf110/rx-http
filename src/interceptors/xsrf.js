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
  request(request, accept, reject) {
    const xsrfToken = Cookies.get(request.xsrfCookieName());
    const xsrfHeader = request.xsrfHeaderName();

    if (!isUndefined(xsrfToken) && isString(xsrfToken)) {
      request.header(xsrfHeader, xsrfToken);
    }

    accept(request);
  }
}
