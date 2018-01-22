import Http from '../../../src/http';
import Interceptors from '../../../src/interceptors';

function failed(message, next) {
  return function(err) {
    throw new Error(message);
  };
}

describe('MethodOverride', () => {
  describe('request', () => {
    it('should ignore a POST request', (next) => {
      const req = new Http().post('/');

      Interceptors.MethodOverride.request(req, (transformed) => {
        expect(transformed.headers('X-HTTP-Method-Override')).to.be.undefined;
        next();
      }, failed("Shouldn't call reject", next));
    });

    it('should ignore a GET request', (next) => {
      const req = new Http().get('/');

      Interceptors.MethodOverride.request(req, (transformed) => {
        expect(transformed.headers('X-HTTP-Method-Override')).to.be.undefined;
        next();
      }, failed("Shouldn't call reject", next));
    });

    it('should convert a PUT to a POST and add the X-HTTP-Method-Override header', (next) => {
      const req = new Http().put('/');

      Interceptors.MethodOverride.request(req, (transformed) => {
        expect(transformed.method()).to.equal('POST');
        expect(transformed.headers('X-HTTP-Method-Override')).to.equal('PUT');
        next();
      }, failed("Shouldn't call reject", next));
    });
  });
});
