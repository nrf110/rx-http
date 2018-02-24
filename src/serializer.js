import Errors from './errors';

/**
 * Base class for {@link Request} body serializers
 * @class
 * @name Serializer
 */
export default class Serializer {
  /**
   * @constructor
   * @param {String} [contentType] - The value of the Content-Type header
   */
  constructor(contentType) {
    if (!!contentType) this.contentType = contentType;
  }

  /**
   * @method
   * @name serialize
   * @param value - The content to be serialized
   * @returns - The serialized content
   */
  serialize(value) {
    throw new Errors.NotImplementedError();
  }
}
