import FormDataSerializer from '../../../src/serializers/form-data-serializer';

describe('FormDataSerializer', () => {
  describe('serialize', () => {
    it('should append a Blob as a File with default name', (next) => {
      const serializer = new FormDataSerializer();
      const value = {foo: "bar"};
      const blob = new Blob([JSON.stringify(value)], {type : 'application/json'});
      const formData = serializer.serialize(blob);
      const entries = Array.from(formData.entries());
      const entry = entries[0]

      expect(formData).to.be.an.instanceof(FormData)
      expect(entry[0]).to.equal('file');
      expect(entry[1]).to.be.an.instanceof(File);
      expect(entry[1].name).to.equal('file');

      next();
    });

    it('should append a File', (next) => {
      const serializer = new FormDataSerializer();
      const value = {foo: "bar"};
      const blob = new Blob([JSON.stringify(value)], {type : 'application/json'});
      const file = new File([blob], 'test.json')
      const formData = serializer.serialize(file);
      const entries = Array.from(formData.entries());
      const entry = entries[0];

      expect(formData).to.be.an.instanceof(FormData)
      expect(entry[0]).to.equal('file');
      expect(entry[1]).to.be.an.instanceof(File);
      expect(entry[1].name).to.equal('test.json');

      next();
    });

    it('should convert a simple object to FormData', (next) => {
      const serializer = new FormDataSerializer();
      const hash = { a: 1, b: 2, c: 3 };
      const formData = serializer.serialize(hash);
      const formDataKeys = Array.from(formData.keys());

      expect(formData).to.be.an.instanceof(FormData)
      expect(formDataKeys).to.have.members(Object.keys(hash));

      next();
    });

    it ('should convert an object with File values to FormData', (next) => {
      const serializer = new FormDataSerializer();
      const value = {foo: "bar"};
      const blob = new Blob([JSON.stringify(value)], {type : 'application/json'});
      const file = new File([blob], 'test.json')
      const hash = { key: file }
      const formData = serializer.serialize(hash);
      const entries = Array.from(formData.entries());
      const entry = entries[0];

      expect(formData).to.be.an.instanceof(FormData)
      expect(entry[0]).to.equal('key');
      expect(entry[1]).to.be.an.instanceof(File);

      next();
    });
  });
});
