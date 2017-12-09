import Serializer from './serializer';

export default class JsonSerializer extends Serializer {
  constructor(contentType) {
    super(contentType || 'application/json');
  }

  serialize(value) {
    return JSON.stringify(value);
  }
}
