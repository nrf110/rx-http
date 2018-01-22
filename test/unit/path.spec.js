import Path from '../../src/path';

describe('Path', () => {
  describe('join', () => {
    const expected = '/a/b';

    it('should join 2 parts when 1st part has a trailing slash and 2nd part has a leading slash', (next) => {
      const actual = Path.join('/a/', '/b');
      expect(actual).to.equal(expected);
      next();
    });

    it('should join 2 parts when 1st part has a trailing slash and 2nd part has no leading slash', (next) => {
      const actual = Path.join('/a/', 'b');
      expect(actual).to.equal(expected);
      next();
    });

    it('should join 2 parts when 1st part has no trailing slash and 2nd part has a leading slash', (next) => {
      const actual = Path.join('/a', '/b');
      expect(actual).to.equal(expected);
      next();
    });

    it('should join 2 parts when 1st part has no trailing slash and 2nd part has no leading slash', (next) => {
      const actual = Path.join('/a', '/b');
      expect(actual).to.equal(expected);
      next();
    });

    it('should strip any trailing slashes', (next) => {
      const actual = Path.join('/a/', '/b//');
      expect(actual).to.equal('/a/b');
      next();
    });
  });
});
