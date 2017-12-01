import { isString } from 'lodash';
import Cookies from 'js-cookie';
import Interceptor from '../interceptor';

export default class XSRF extends Interceptor {
  request(request, accept, reject) {
    const xsrfToken = Cookies.get(request.xsrfCookieName());
    const xsrfHeader = request.xsrfHeaderName();

    if (isString(xsrfToken)) {
      request.header(xsrfHeader, xsrfToken);
    }

    accept(request);
  }
}
