import Interceptor from '../interceptor';

const BROWSER_METHODS = ['GET', 'POST'];

/**
 * If the HTTP verb is not one understood by Browsers, change the verb
 * to a POST and send the X-HTTP-Method-Override header with the original
 * method.  This should generally be understood by the routers of most
 * server backends.
 * @class
 * @name MethodOverride
 */
export default class MethodOverride extends Interceptor {
  /**
   * Transforms (or fails) an outgoing request.
   * @method
   * @name request
   * @param {Request} request - The request to be processed
   * @param {Function<Request>} accept - called on success to process a (potentially transformed) {@link Request}
   * @param {Function} reject - called on failure to pass an error
   */
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
