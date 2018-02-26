import PropertyBehaviors from './property-behaviors';
import Request from '../../src/request';
import Url from '../../src/url';
import Serializers from '../../src/serializers';
import Interceptors from '../../src/interceptors';

const behaviors = new PropertyBehaviors(Request);
const properties = {
  method: 'PATCH',
  timeout: 5000,
  responseType: 'json',
  serializer: Serializers.Text,
  interceptors: [Interceptors.BodyTransformer, Interceptors.MethodOverride],
  xsrfCookieName: 'COOKIE-MONSTER',
  xsrfHeaderName: 'XSRF-HEADER',
  withCredentials: true,
  user: 'admin',
  password: 'shenanigans'
};

Object.entries(properties).forEach((prop) => {
  behaviors.shouldBehaveLikeASimpleProperty(prop[0], prop[1]);
});

behaviors.shouldBehaveLikeAMapProperty('headers');

describe('contentType', () => {
  it('should set the current value of the Content-Type header', (next) => {
    const req = new Request();
    req.contentType('application/json');
    expect(req.contentType()).to.equal('application/json');
    next();
  });

  it('should get the current value of the Content-Type header', (next) => {
    const req = new Request({ headers: { 'Content-Type': 'application/json' } });
    expect(req.contentType()).to.equal('application/json');
    next();
  });

  it('should be case insensitive when looking up the header name', (next) => {
    const req = new Request({ headers: { 'cOntEnt-TypE': 'application/json' } });
    expect(req.contentType()).to.equal('application/json');
    next();
  });
});

describe('body', () => {
  it('should set the value and the serializer', (next) => {
    const req = new Request();
    req.body('hello world', new Serializers.Text());
    expect(req.body()).to.equal('hello world');
    expect(req.serializer()).be.an.instanceof(Serializers.Text);
    next();
  });

  it('should set the value of the body, and not set the serializer', (next) => {
    const req = new Request();
    req.serializer(new Serializers.Json());
    req.body({ foo: 'bar' });
    expect(req.body()).to.deep.equal({ foo: 'bar' });
    expect(req.serializer()).be.an.instanceof(Serializers.Json);
    next();
  });
});

describe('url', () => {
  it('should set the value to the given Url object', (next) => {
    const req = new Request();
    const expected = Url.factory('http://www.example.com/some/path');
    req.url(expected);
    const actual = req.url();
    expect(actual).to.equal(expected);
    next();
  });

  it('should get the current value', (next) => {
    const expected = Url.factory('http://www.example.com/some/path');
    const req = new Request({ url: expected });
    const actual = req.url();
    expect(actual).to.equal(expected);
    next();
  });

  it('should parse the given hash into a Url object and set it', (next) => {
    const req = new Request();
    const parts = {
      protocol: 'http',
      host: 'www.example.com',
      directory: '/some',
      file: 'path'
    };
    const expected = Url.factory(parts);
    req.url(parts);
    const actual = req.url();
    expect(actual).to.deep.equal(expected);
    next();
  });

  it('should parse the given string into a Url object and set it', (next) => {
    const req = new Request();
    const expected = Url.factory('http://www.example.com/some/path');
    req.url('http://www.example.com/some/path');
    const actual = req.url();
    expect(actual).to.deep.equal(expected);
    next();
  });

  it('should merge the parsed relative Url with the current Url', (next) => {
    const req = new Request({ url: Url.factory('http://www.example.com/some/path') });
    req.url('/other/path?foo=bar');
    expect(req.url().toString()).to.equal('http://www.example.com/other/path?foo=bar');
    next();
  });
});
