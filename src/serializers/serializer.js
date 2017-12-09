export default class Serializer {
  constructor(contentType) {
    if (!!contentType) this.contentType = contentType;
  }
}
