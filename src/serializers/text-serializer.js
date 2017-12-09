import Serializer from '../serializer';

/**
 * @class
 * @name TextSerializer
 * @extends Serializer
 */
export default class TextSerializer extends Serializer {
  /**
   * @constructor
   * @param {String} [contentType] - The value of the Content-Type header
   */
  constructor(contentType) {
    super(contentType || 'text/plain');
  }

  /**
   * @method
   * @name serialize
   * @param value - The content to be serialized
   * @returns {String} - The serialized string to be sent to the server
   */
  serialize(value) {
    return value.toString();
  }
}
