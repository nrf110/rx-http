import { isObject } from 'lodash';
import { isFile, isFormData, isBlob } from '../utilities';
import Interceptor from '../interceptor';

/**
 * Tries to automatically detect the response content type and deserialize the
 * raw body into the appropriate type.
 * @class
 * @name BodyTransformer
 */
export default class BodyTransformer extends Interceptor {
  /**
   * Transforms (or fails) an outgoing request.
   * @method
   * @name request
   * @param {Request} request - The request to be processed
   * @param {Function<Request>} accept - called on success to process a (potentially transformed) {@link Request}
   * @param {Function} reject - called on failure to pass an error
   */
  request(request, accept, reject) {
    const body = request.body();

    if (isObject(body) && !isFile(body) && !isFormData(body) && !isBlob(body)) {
      const json = JSON.stringify(body);

      request.body(json);
    }

    accept(request);
  }
}
