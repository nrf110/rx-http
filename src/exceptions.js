export default class PropertyValidationException {
  constructor(property, value) {
    this.property = property;
    this.value = value;
  }

  toString() {
    return `Value ${this.value} is not valid for property ${this.property}`
  }
}
