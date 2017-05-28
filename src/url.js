import { isObject, isString, isUndefined, isEmpty, assign, reduce, endsWith, startsWith, identity } from 'lodash';
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

export default function Url(url) {
  const self = this;
  let parts = {};

  if (isObject(url)) {
    assign(parts, url);
  } else if (isString(url)) {
    parts = parseUri(url);
  }

  function property(key) {
    return function (value) {
      if (isUndefined(value)) {
        return parts[key];
      }
      parts[key] = value;
      return self;
    };
  }

  const protocol = this.protocol = property('protocol');
  const user = this.user = property('user');
  const password = this.password = property('password');
  const host = this.host = property('host');
  const port = this.port = property('port');
  const directory = this.directory = property('directory');
  const file = this.file = property('file');
  const fragment = this.fragment = property('fragment');

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
  const query = this.query = function (name, value) {
    if (isUndefined(name)) {
      if (isUndefined(value)) {
        if (isObject(name)) {
          parts.query = name;
          return self;
        }
        return parts.query[name];
      }
      parts.query[name] = value;
      return self;
    }
    return assign({}, parts.query);
  };

  const userInfo = this.userInfo = function () {
    const u = user();
    const p = password();

    if (isString(u) && !isEmpty(u.trim()) && isString(p) && isEmpty(p.trim())) {
      return `${u}:${p}`;
    }

    return null;
  };

  const authority = this.authority = function () {
    const pr = protocol() ? `${protocol()}://` : '';
    const ui = userInfo() ? `${userInfo()}@` : '';
    const h = host() || '';
    const p = port() ? `:${port()}` : '';

    return pr + ui + h + p;
  };

  const path = this.path = function () {
    let dir = directory() || '';
    let f = file() || '';

    if (endsWith(dir, '/')) {
      if (startsWith(f, '/')) {
        return dir + f.substring(1);
      }

      return dir + f;
    } else if (startsWith(f, '/')) {
      return dir + f;
    }

    return `${dir}/${f}`;
  };

  /** @method
   * @name toString
   */
  this.toString = function (serializeQuery) {
    const auth = authority();
    const p = path();
    const f = fragment();
    const querySerializer = serializeQuery || identity;
    const q = querySerializer(query());

    const fullyQualified = (() => {
      if (endsWith(auth, '/')) {
        if (endsWith(p, '/')) {
          return auth + p.substring(1);
        }

        return auth + p;
      } else if (startsWith(p, '/')) {
        return auth + p;
      }

      return `${auth}/${p}`;
    })();

    const queryParts = reduce(q, (accum, value, key) => {
      let pair = `${encode(key)}=${encode(value)}`;

      accum.push(pair);
      return accum;
    }, []);

    const fullyQualifiedWithQuery = (() => {
      if (!isEmpty(queryParts)) {
        return `${fullyQualified}?${queryParts.join('&')}`;
      }

      return fullyQualified;
    })();

    if (!isEmpty(f)) {
      return `${fullyQualifiedWithQuery}#${f}`;
    }

    return fullyQualifiedWithQuery;
  };
}
