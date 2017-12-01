import Interceptor from '../interceptor';

export default class ErrorHandling extends Interceptor {
  response(response, accept, reject) {
    if (response.status() / 100 === 2) {
      accept(response);
    } else {
      reject(response);
    }
  }
}
