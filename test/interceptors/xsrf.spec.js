import Cookies from 'js-cookie';
import { Http, Interceptors } from '../../lib/rx-http';

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
        expect(transformed.header(transformed.xsrfHeaderName())).to.equal('test');
        next();
      }, failed("Shouldn't call reject", next));
    });

    it('should not add a header when the XSRF cookie is not present', (next) => {
      const req = new Http().get('/');

      Interceptors.MethodOverride.request(req, (transformed) => {
        expect(transformed.header(transformed.xsrfHeaderName())).to.be.undefined;
        next();
      }, failed("Shouldn't call reject", next));
    });
  });
});
