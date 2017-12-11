import { Http, Interceptors, Serializers } from '../../lib/rx-http';

function failed(message, next) {
  return function(err) {
    throw new Error(message);
  };
}

describe('BodyTransformer', () => {
  describe('request', () => {
    it('should serialize the request body', (next) => {
      const req = new Http().post('/')
        .body({ foo: 'bar' }, new Serializers.Json());

      Interceptors.BodyTransformer.request(req, (transformed) => {
        expect(transformed.body()).to.equal('{"foo":"bar"}')
        next();
      }, failed("Shouldn't call reject.", next));
    });

    it ('should set the content-type header', (next) => {
      const req = new Http().post('/')
        .body({ foo: 'bar' }, new Serializers.Json());

      Interceptors.BodyTransformer.request(req, (transformed) => {
        expect(transformed.contentType()).to.equal('application/json');
        next();
      }, failed("Shouldn't call reject.", next));
    });

    it ('should not override the content-type header', (next) => {
      const req = new Http().post('/')
        .contentType('text/json')
        .body({ foo: 'bar' }, new Serializers.Json());

      Interceptors.BodyTransformer.request(req, (transformed) => {
        expect(transformed.contentType()).to.equal('text/json');
        next();
      }, failed("Shouldn't call reject.", next));
    });
  });
});
