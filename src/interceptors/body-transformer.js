import { isObject } from 'lodash';
import { isFile, isFormData, isBlob } from '../utilities';
import Interceptor from '../interceptor';

/**
 * Tries to automatically detect the response content type and deserialize the
 * raw body into the appropriate type.
 * @class
 * @implements Interceptor
 * @name BodyTransformer
 */
export default class BodyTransformer extends Interceptor {
  request(request, accept, reject) {
    const body = request.body();

    if (isObject(body) && !isFile(body) && !isFormData(body) && !isBlob(body)) {
      const json = JSON.stringify(body);

      request.body(json);
    }

    accept(request);
  }
}
