import PropertyBehaviors from './property-behaviors';
import Http from '../../src/http';
import Interceptors from '../../src/interceptors';

const behaviors = new PropertyBehaviors(Http);
const properties = {
  baseUrl: 'http://www.example.com',
  timeout: 5000,
  xsrfCookieName: 'COOKIE-MONSTER',
  xsrfHeaderName: 'HEADER',
  withCredentials: false,
  user: 'admin',
  password: 'shenanigans',
  interceptors: [Interceptors.BodyTransformer]
};

const methods = ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE', 'PATCH'];
const requestProperties = Object.entries(properties).filter((prop) => prop[0] != 'baseUrl');

function shouldBehaveLikeARequestMethod(method) {
  describe(method.toLowerCase(), () => {
    it(`should create a Request of method ${method}`, (next) => {
      next();
    });
  });
}

describe('Http', () => {
  Object.entries(properties).forEach((prop) => {
    behaviors.shouldBehaveLikeASimpleProperty(prop[0], prop[1]);
  });

  methods.forEach((method) => {
    describe(method.toLowerCase(), () => {
      it(`Should return a Request with method ${method}`, (next) => {
        const client = new Http(properties);
        const request = client[method.toLowerCase()]('/some/path');

        expect(request.method()).to.equal(method);
        expect(request.url().toString()).to.equal('http://www.example.com/some/path');

        requestProperties.forEach((prop) => {
          const key = prop[0];
          const expected = prop[1];
          const actual = request[key]();

          expect(actual).to.equal(expected);
        });

        next();
      });
    });
  });

  describe('addInterceptor', () => {
    it('should add the given interceptor', (next) => {
      const client = new Http({ interceptors: [Interceptors.BodyTransformer] });
      client.addInterceptor(Interceptors.MethodOverride);
      expect(client.interceptors()).to.have.members([Interceptors.BodyTransformer, Interceptors.MethodOverride]);
      next();
    });
  });

  describe('removeInterceptor', () => {
    it('should remove the given interceptor', (next) => {
      const client = new Http({ interceptors: [Interceptors.BodyTransformer, Interceptors.MethodOverride] });
      client.removeInterceptor(Interceptors.MethodOverride);
      expect(client.interceptors()).to.have.members([Interceptors.BodyTransformer]);
      next();
    });
  });
});
