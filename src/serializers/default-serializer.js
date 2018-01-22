import { isObject, isString } from 'lodash';
import { isFile, isFormData, isBlob } from '../utilities';
import { NoSerializerFoundError } from '../errors';
import Serializer from '../serializer';
import JsonSerializer from './json-serializer';
import FormDataSerializer from './form-data-serializer';
import TextSerializer from './text-serializer';

const contentTypeSerializers = {
  'text/json': JsonSerializer,
  'application/json': JsonSerializer,
  'multipart/form-data': FormDataSerializer,
  'application/x-www-urlencoded': FormDataSerializer,
  'text/plain': TextSerializer
}

function autoDetect(body, contentType) {
  if (isObject(body)) {
    if (isFormData(body) || isFile(body) || isBlob(body) || Object.entries(body).some((entry) => isFile(entry[1]) || isBlob(entry[1]))) {
      return new FormDataSerializer(contentType);
    }
  }

  if (isString(body)) {
    return new TextSerializer('text/plain');
  }

  if (!!contentType && contentTypeSerializers[contentType.toLowerCase()]) {
    const result = contentTypeSerializers[contentType.toLowerCase()];
    if (!!result) return new result(contentType);
    throw new NoSerializerFoundError(contentType);
  }

  throw new NoSerializerFoundError('unknown');
}

/**
 * Serializer that attempts uses the given contentType, or tries to detect
 * the content type in order to delegate to the appropriate built-in
 * {@link Serializer}
 * @class
 * @name DefaultSerializer
 * @extends Serializer
 */
export default class DefaultSerializer extends Serializer {
  /**
   * @method
   * @name serialize
   * @param value - the value to be serialized
   * @returns the serialized content
   */
  serialize(value) {
    const delegate = autoDetect(value, this.contentType)
    return delegate.serialize(value);
  }
}
