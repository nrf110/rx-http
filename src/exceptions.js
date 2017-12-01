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

export default {
  PropertyValidationException
};
