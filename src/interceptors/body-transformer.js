import { isObject, isString } from 'lodash';
import { isFile, isFormData, isBlob } from '../utilities';
import Interceptor from '../interceptor';
import Errors from '../errors';
import Serializers from '../serializers';

const contentTypeSerializers = {
  'text/json': Serializers.Json,
  'application/json': Serializers.Json,
  'multipart/form-data': Serializers.Form,
  'application/x-www-urlencoded': Serializers.Form,
  'text/plain': Serializers.Text
}

function autoDetect(body, contentType) {
  if (!!contentType && contentTypeSerializers[contentType.toLowerCase()]) {
    const result = contentTypeSerializers[contentType.toLowerCase()];
    return new result(contentType);
  }

  if (isString(body)) {
    return new Serializers.Text(contentType);
  }

  if (isObject(body)) {
    if (isFormData(body) || isFile(body) || isBlob(body) || Object.entries(body).some((entry) => isFile(entry[1]) || isBlob(entry[1]))) {
      return new Serializers.Form(contentType);
    }

    return new Serializers.Json(contentType);
  }

  throw new Errors.NoSerializerFoundError('unknown');
}

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

    if (!!body) {
      const serializer = request.serializer() || autoDetect(body, request.contentType());
      const contentType = request.contentType() || serializer.contentType;

      if (!!contentType) {
        request.contentType(contentType);
      }

      request.body(serializer.serialize(body));
    }

    accept(request);
  }
}

export let bodyTransformer = new BodyTransformer();
