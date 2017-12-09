import { isObject } from 'lodash';
import { isFile, isFormData, isBlob } from '../utilities';
import Serializer from './serializer';

export default class FormDataSerializer extends Serializer {
  constructor(contentType) {
    super(contentType || 'multipart/form-data');
  }

  serialize(value) {
    if (isFormData(value)) return value;

    const result = new FormData();

    if (isFile(value) || isBlob(value)) {
      result.append('data', value);
    }

    if (isObject(value)) {
      Object.entries(value).forEach((entry) => {
        result.append(entry[0], entry[1]);
      });
    }

    throw `${value} is not an object and cannot be converted to FormData`;
  }
}
