import Cookies from 'js-cookie';
import Http from '../../../src/http';
import Interceptors from '../../../src/interceptors';

function failed(message, next) {
  return function(err) {
    throw new Error(message);
  };
}

describe('XSRF', () => {
  describe('request', () => {
    it('should copy the cookie value to the XSRF header', (next) => {
      const req = new Http().post('/');
      Cookies.set(req.xsrfCookieName(), 'test');

      Interceptors.XSRF.request(req, (transformed) => {
        expect(transformed.headers(transformed.xsrfHeaderName())).to.equal('test');
        next();
      }, failed("Shouldn't call reject", next));
    });

    it('should not add a header when the XSRF cookie is not present', (next) => {
      const req = new Http().get('/');

      Interceptors.MethodOverride.request(req, (transformed) => {
        expect(transformed.headers(transformed.xsrfHeaderName())).to.be.undefined;
        next();
      }, failed("Shouldn't call reject", next));
    });
  });
});
