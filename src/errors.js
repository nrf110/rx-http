class CustomError {
  constructor(message) {
    this.name = this.constructor.name;
    this.message = message;
    this.stack = (new Error(message)).stack;
  }
}
CustomError.prototype = Object.create(Error.prototype);
CustomError.prototype.constructor = CustomError;

/**
 * @class
 * @name NotImplementedError
 */
class NotImplementedError extends CustomError {
  constructor(message = 'Not Implemented') {
    super(message);
  }
}

/**
 * @class
 * @name ConnectionError
 */
class ConnectionError extends CustomError {
  constructor(url, message) {
    super(message || `Error connecting to ${url}`);
    this.url = url;
  }
}

/**
 * @class
 * @name PropertyValidationError
 */
class PropertyValidationError extends CustomError {
  /**
   * @constructor
   * @param {String} - property name
   * @param value
   */
  constructor(property, value, msg) {
    const message = msg || `Value ${value} is not valid for property ${property}`;
    super(message);
    this.property = property;
    this.value = value;
  }
}

/**
 * @class
 * @name NoSerializerFoundError
 */
class NoSerializerFoundError extends CustomError {
  constructor(contentType) {
    super(`No serializer found for content type ${contentType}`);
    this.contentType = contentType;
  }
}

/**
 * @class
 * @name NoDeserializerFoundError
 */
class NoDeserializerFoundError extends CustomError {
  constructor(contentType) {
    super(`No deserializer found for content type ${contentType}`);
    this.contentType = contentType;
  }
}

export default {
  NotImplementedError,
  ConnectionError,
  PropertyValidationError,
  NoSerializerFoundError,
  NoDeserializerFoundError
};
