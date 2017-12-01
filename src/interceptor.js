export default class Interceptor {
  request(request, accept, reject) {
    accept(request);
  }

  requestError(error, accept, reject) {
    reject(error);
  }

  response(response, accept, reject) {
    accept(response);
  }

  responseError(error, accept, reject) {
    reject(error);
  }
}
