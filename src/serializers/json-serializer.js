import Serializer from '../serializer';

/**
 * @class
 * @name JsonSerializer
 * @extends Serializer
 */
export default class JsonSerializer extends Serializer {
  /**
   * @constructor
   * @param {String} [contentType] - The value of the Content-Type header
   */
  constructor(contentType) {
    super(contentType || 'application/json');
  }

  /**
   * @method
   * @name serialize
   * @param {Object|String|Number|Array|Boolean} value - The content to convert
   * to a JSON string
   * @returns {String} - The serialized JSON string
   */
  serialize(value) {
    return JSON.stringify(value);
  }
}
