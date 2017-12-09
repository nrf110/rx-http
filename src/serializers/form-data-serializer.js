import { isObject } from 'lodash';
import { isFile, isFormData, isBlob } from '../utilities';
import Serializer from '../serializer';

/**
 * @class
 * @name FormDataSerializer
 * @extends Serializer
 */
export default class FormDataSerializer extends Serializer {
  /**
   * @constructor
   * @param {String} [contentType] - The value of the Content-Type header
   */
  constructor(contentType) {
    super(contentType || 'multipart/form-data');
  }

  /**
   * @method
   * @name serialize
   * @param {FormData|Blob|Object} value - The content to convert to a
   * {@link FormData} value.
   * @returns {FormData} - The {@link FormData} value to be sent to the server
   */
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