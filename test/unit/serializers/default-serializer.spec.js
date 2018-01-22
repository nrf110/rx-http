import DefaultSerializer from '../../../src/serializers/default-serializer';

describe('DefaultSerializer', () => {
  describe('serialize', () => {
    it('should return the original value if value is already FormData', (next) => {
      const value = new FormData();
      value.append('foo', 'bar');

      const serializer = new DefaultSerializer();
      const result = serializer.serialize(value);

      expect(result).to.equal(value);
      next();
    });

    it('should return FormData if value is a Blob', (next) => {
      const value = {foo: "bar"};
      const blob = new Blob([JSON.stringify(value)], {type : 'application/json'});

      const serializer = new DefaultSerializer();
      const result = serializer.serialize(blob);

      expect(result).to.be.an.instanceof(FormData);

      next();
    });

    it('should return FormData if value is a File', (next) => {
      const value = {foo: "bar"};
      const blob = new Blob([JSON.stringify(value)], {type : 'application/json'});
      const file = new File([blob], 'test.blob')

      const serializer = new DefaultSerializer();
      const result = serializer.serialize(file);

      expect(result).to.be.an.instanceof(FormData);

      next();
    });

    it('should return FormData if value is an Object containing a File', (next) => {
      const value = {foo: "bar"};
      const blob = new Blob([JSON.stringify(value)], {type : 'application/json'});
      const file = new File([blob], 'test.json')
      const hash = { key: file }

      const serializer = new DefaultSerializer();
      const result = serializer.serialize(hash);

      expect(result).to.be.an.instanceof(FormData);

      next();
    });

    it('should return the original value when value is a String', (next) => {
      const value = "thisisastring";

      const serializer = new DefaultSerializer();
      const result = serializer.serialize(value);

      expect(result).to.equal(value);

      next();
    });

    it('should return a JSON string if contentType is application/json and value is an Object', (next) => {
      const value = {foo: "bar"};

      const serializer = new DefaultSerializer('application/json');
      const result = serializer.serialize(value);

      expect(result).to.equal('{"foo":"bar"}');

      next();
    });

    it('should return FormData if contentType is application/x-www-urlencoded and value is an Object', (next) => {
      const value = {foo: "bar"};

      const serializer = new DefaultSerializer('application/x-www-urlencoded');
      const result = serializer.serialize(value);

      expect(result).to.be.an.instanceof(FormData);

      next();
    });

    it('should return FormData if contentType is multipart/form-data and value is an Object', (next) => {
      const value = {foo: "bar"};

      const serializer = new DefaultSerializer('application/x-www-urlencoded');
      const result = serializer.serialize(value);

      expect(result).to.be.an.instanceof(FormData);

      next();
    });

    it('should return a String if contentType is text/plain', (next) => {
      const value = 3;
      const serializer = new DefaultSerializer('application/json');
      const result = serializer.serialize(value);

      expect(result).to.equal("3");

      next();
    });
  });
});
