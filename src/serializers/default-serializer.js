import { isObject, isString } from 'lodash';
import { isFile, isFormData, isBlob } from '../utilities';
import { NoSerializerFoundException } from '../exceptions';
import Serializer from './serializer';
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
    if (isFile(body) || isBlob(body) || Object.entries(body).some((entry) => isFile(entry[1]) || isBlob(entry[1]))) {
      return new FormDataSerializer(contentType);
    }
  }

  if (isString(body)) {
    return new TextSerializer('text/plain');
  }

  if (!!contentType && contentTypeSerializers[contentType.toLowerCase()]) {
    const result = contentTypeSerializers[contentType.toLowerCase()];
    if (!!result) return result;
    throw new NoSerializerFoundException(contentType);
  }

  throw new NoSerializerFoundException('unknown');
}

export default class DefaultSerializer extends Serializer {
  serialize(value) {
    const delegate = autoDetect(value, this.contentType)
    return delegate.serialize(value);
  }
}
