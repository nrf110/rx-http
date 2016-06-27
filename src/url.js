import _ from 'lodash';
import { parseUri } from './utilities';

function encode(val) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}

function Url(url) {
  const self = this;
  const parts = {};

  if (_.isObject(url)) {
    _.assign(parts, url);
  } else if (_.isString(url)) {
    parts = parseUri(url);
  }

  function property(key) {
    return function(value) {
      if (_.isUndefined(value)) {
        return parts[key];
      } else {
        parts[key] = value;
        return self;
      }
    }
  }

  const protocol  = this.protocol   = property('protocol');
  const user      = this.user       = property('user');
  const password  = this.password   = property('password');
  const host      = this.host       = property('host');
  const port      = this.port       = property('port');
  const directory = this.directory  = property('directory');
  const file      = this.file       = property('file');
  const fragment  = this.fragment   = property('fragment');

  /** @method
   * @name query
   * @param {string|object} [name] - The name of the query-string parameter
   * @param [value] - The value of the query-string parameter
   * @returns {object|string|Request} -
   * If no parameters are specified - returns a copy of the entire query hash.
   * @example
   * {{
   *   request.query() // returns { "foo": "bar" }
   * }}
   * If only name is specified, and name is a string - returns the value for the key in the query hash.
   * @example
   * {{
   *    request.query("foo") // returns "bar"
   * }}
   * If only name is specified, and name is an object - replaces the entire query hash
   * and returns the current Request.
   * @example
   * {{
   *    request.query({ "foo": "bar", "baz": 1 }).execute()
   * }}
   * If name and value are specified - sets the value of name in the query hash
   * and returns the current Request.
   * @example
   * {{
   *   request.query("foo", "bar").execute()
   * }}
   */
  const query = this.query = function(name, value) {
    if (_.isUndefined(name)) {

      if (_.isUndefined(value)) {

        if (_.isObject(name)) {
          parts.query = name;
          return self;
        } else {
          return config.query[name];
        }

      } else {
        config.query[name] = value;
        return self;
      }

    } else {
      return _.assign({}, config.query);
    }
  };

  const userInfo = this.userInfo = function() {
    if (_.isString(user()) && _.isString(password())) {
      return `${self.user}:${self.password}`;
    }

    return null;
  };

  const authority = this.authority = function() {
    const pr = protocol() ? `${protocol}://` : '';
    const ui = userInfo() ? `${userInfo()}@` : '';
    const h = host() || '';
    const p = port() ? `:${port()}` : '';

    return pr + ui + h + p;
  };

  const path = this.path = function() {
    let dir = directory() || '';
    let f = file() || '';

    if (dir.endsWith('/')) {
      if (f.startsWith('/')) {
        return dir + f.substring(1);
      }

      return return dir + f;
    } else if (f.startsWith('/')) {
      return dir + f;
    }

    return `${dir}/${f}`;
  };

  /** @method
   * @name toString
   */
  this.toString = function(serializeQuery) {
    const auth = authority();
    const p = path();
    const f = fragment();
    const q = serializeQuery(query());

    const fullyQualified = (() => {
      if (auth.endsWith('/')) {
        if (p.endsWith('/')) {
          return auth + p.substring(1);
        }

        return auth + p;
      } else if (p.startsWith('/')) {
        return auth + p;
      }

      return `${auth}/${p}`;
    })();

    const queryParts = _.reduce(q, (accum, value, key) => {
      let pair = `${encode(key)}=${encode(value)}`;
      accum.push(pair);
      return accum;
    }, []);

    const fullyQualifiedWithQuery = (() => {
      if (!_.isEmpty(queryParts)) {
        return `${fullyQualified}?${queryParts.join('&')}`;
      }

      return fullyQualified;
    })();

    if (!_.isEmpty(f)) {
      return `${fullyQualifiedWithQuery}#${f}`;
    }

    return fullyQualifiedWithQuery;
  };
}

export default Url;
