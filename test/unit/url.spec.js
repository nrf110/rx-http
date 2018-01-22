import Url from '../../src/url';
import PropertyBehaviors from './property-behaviors';

describe('Url', () => {
  const properties = {
    protocol: 'http',
    user: 'admin',
    password: 'supersecret',
    host: 'example.com',
    port: 9000,
    directory: '/some/path',
    file: 'index.html',
    fragment: 'rawr'
  }

  const behaviors = new PropertyBehaviors(Url);

  Object.entries(properties).forEach((part) => {
    behaviors.shouldBehaveLikeASimpleProperty(part[0], part[1]);
  });

  behaviors.shouldBehaveLikeAMapProperty('query');

  describe('userInfo', () => {
    it('should return the userInfo when user and password are set', (next) => {
      const url = new Url().user('admin').password('pass');
      const expected = 'admin:pass';
      expect(url.userInfo()).to.equal(expected);
      next();
    });

    it('should return null if only user is set', (next) => {
      const url = new Url().user('admin');
      expect(url.userInfo()).to.be.null;
      next();
    });

    it('should return null if only password is set', (next) => {
      const url = new Url().password('pass');
      expect(url.userInfo()).to.be.null;
      next();
    });
  });

  describe('authority', () => {
    it('should return an empty string', (next) => {
      const url = new Url();
      expect(url.authority()).to.equal('');
      next();
    });

    it('should return the authority string', (next) => {
      const url = new Url()
        .protocol('http')
        .host('example.com')
        .port(9004)
        .user('admin')
        .password('pass');

      expect(url.authority()).to.equal('http://admin:pass@example.com:9004');
      next();
    });
  });

  describe('path', () => {
    it('should return the path', (next) => {
      const url = new Url().directory('/test').file('index.html');
      expect(url.path()).to.equal('/test/index.html');
      next();
    });
  });

  describe('merge', () => {
    it('should take directory, file, fragment, and query from target', (next) => {
      const a = Url.factory('http://admin:pass@example.com/some/path?foo=bar#test');
      const b = new Url({ directory: '/other', file: 'index.html', query: { baz: 'buzz' }, fragment: 'shenanigans' });
      const result = a.merge(b);
      expect(result.toString()).to.equal('http://admin:pass@example.com/other/index.html?baz=buzz#shenanigans');
      next();
    });

    it('should remove file from copy when not present in target', (next) => {
      const a = Url.factory('http://admin:pass@example.com/some/path?foo=bar#test');
      const b = new Url({ directory: '/other', query: { baz: 'buzz' }, fragment: 'shenanigans' });
      const result = a.merge(b);
      expect(result.toString()).to.equal('http://admin:pass@example.com/other?baz=buzz#shenanigans');
      next();
    });
  });

  describe('toString', () => {
    it('should return the string representation of a url', (next) => {
      const a = new Url({
        protocol: 'http',
        user: 'admin',
        password: 'pass',
        host: 'example.com',
        directory: '/some/path',
        file: 'index.html',
        query: { foo: 'bar' },
        fragment: 'test'
      });

      expect(a.toString()).to.equal('http://admin:pass@example.com/some/path/index.html?foo=bar#test');
      next();
    });
  });
});
