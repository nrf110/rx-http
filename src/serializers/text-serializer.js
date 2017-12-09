import Serializer from './serializer';

export default class TextSerializer extends Serializer {
  constructor(contentType) {
    super(contentType || 'text/plain');
  }

  serialize(value) {
    return value.toString();
  }
}
