import Serializer from './serializer';
import DefaultSerializer from './default-serializer';
import FormDataSerializer from './form-data-serializer';
import JsonSerializer from './json-serializer';
import TextSerializer from './text-serializer';

export default {
  Serializer,
  'Default': DefaultSerializer,
  'Form': FormDataSerializer,
  'Json': JsonSerializer,
  'Text': TextSerializer
};
