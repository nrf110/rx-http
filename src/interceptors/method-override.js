import Interceptor from '../interceptor';

const BROWSER_METHODS = ['GET', 'POST'];

export default class MethodOverride extends Interceptor {
  request (request, accept, reject) {
    const originalMethod = request.method();

    if (!BROWSER_METHODS.some(m => m === originalMethod)) {
      request
        .method('POST')
        .header('X-HTTP-Method-Override', originalMethod);
    }

    accept(request);
  }
}
