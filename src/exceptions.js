/**
 * @class
 * @name PropertyValidationException
 * @param {String} - property
 */
class PropertyValidationException {
  /**
   * @constructor
   * @param {String} - property name
   * @param value
   */
  constructor(property, value) {
    this.property = property;
    this.value = value;
  }

  toString() {
    return `Value ${this.value} is not valid for property ${this.property}`
  }
}

class NoSerializerFoundException {
  constructor(contentType) {
    this.contentType = contentType;
  }

  toString() {
    return `No serializer found for content type ${this.contentType}`
  }
}

class NoDeserializerFoundException {
  constructor(contentType) {
    this.contentType = contentType;
  }

  toString() {
    return `No deserializer found for content type ${this.contentType}`
  }
}

export default {
  PropertyValidationException,
  NoSerializerFoundException,
  NoDeserializerFoundException
};
