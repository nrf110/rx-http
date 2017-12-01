import {
  isObject,
  isString,
  isUndefined,
  isEmpty,
  assign,
  reduce,
  endsWith,
  startsWith,
  identity,
  cloneDeep
} from 'lodash';
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

function property(member, value) {
  if (isUndefined(value)) {
    member.get(this);
  }

  member.set(this);
  return this;
}

const _protocol = new WeakMap();
const _user = new WeakMap();
const _password = new WeakMap();
const _host = new WeakMap();
const _port = new WeakMap();
const _directory = new WeakMap();
const _file = new WeakMap();
const _fragment = new WeakMap();
const _query = new WeakMap();

/**
 * @class
 * @name Url
 * @param {Object} parts
 */
class Url {
  /**
   * @constructor
   * @param {Object} parts
   */
  constructor(parts) {
    if (parts.protocol) _protocol.set(this, parts.protocol);
    if (parts.user) _user.set(this, parts.user);
    if (parts.password) _password.set(this, parts.password);
    if (parts.host) _host.set(this, parts.host);
    if (parts.port) _port.set(this, parts.port);
    if (parts.directory) _directory.set(this, parts.directory);
    if (parts.file) _file.set(this, parts.file);
    if (parts.fragment) _fragment.set(this, parts.fragment);
  }

  /**
   * @method
   * @name protocol
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the protocol for the url
   * and returns the current instance.  If value is ommitted, returns the
   * current protocol.
   */
  protocol(value) {
    return property.call(this, _protocol, value);
  }

  /**
   * @method
   * @name user
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the user and returns
   * the current instance.  If value is ommitted, returns the current user.
   */
  user(value) {
    return property.call(this, _user, value);
  }

  /**
   * @method
   * @name password
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the password and returns
   * the current instance.  If value is ommitted, returns the current password.
   */
  password(value) {
    return property.call(this, _password, value);
  }

  /**
   * @method
   * @name host
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the host and returns
   * the current instance.  If value is ommitted, returns the current host.
   */
  host(value) {
    return property.call(this, _host, value);
  }

  /**
   * @method
   * @name port
   * @param {String|Number} [value]
   * @returns {Url|String|Number} - If value is specified, sets the port and returns
   * the current instance.  If value is ommitted, returns the current port.
   */
  port(value) {
    return property.call(this, _port, value);
  }

  /**
   * @method
   * @name directory
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the directory and returns
   * the current instance.  If value is ommitted, returns the current directory.
   */
  directory(value) {
    return property.call(this, _directory, value);
  }

  /**
   * @method
   * @name file
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the file and returns
   * the current instance.  If value is ommitted, returns the current file.
   */
  file(value) {
    return property.call(this, _file, value);
  }

  /**
   * @method
   * @name fragment
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the fragment and returns
   * the current instance.  If value is ommitted, returns the current fragment.
   */
  fragment(value) {
    return property.call(this, _fragment, value);
  }

  /**
   * @method
   * @name isAbsolute
   * @returns {Boolean} - true if the url is absolute, false if it is relative.
   */
  isAbsolute() {
    return !!this.host();
  }

  /**
   * @method
   * @name isRelative
   * @returns {Boolean} - true if the url is relative, false if it is absolute.
   */
  isRelative() {
    return !this.isAbsolute();
  }

  /**
   * @method
   * @name query
   * @param {String|Object} [name] - The name of the query-string parameter
   * @param [value] - The value of the query-string parameter
   * @returns {Object|String|Request} -
   * If no parameters are specified - returns a copy of the entire query hash.
   * @example
   * request.query() // returns { "foo": "bar" }
   * If only name is specified, and name is a string - returns the value for the key in the query hash.
   * @example
   * request.query("foo") // returns "bar"
   * If only name is specified, and name is an object - replaces the entire query hash
   * and returns the current Request.
   * @example
   * request.query({ "foo": "bar", "baz": 1 }).execute()
   * If name and value are specified - sets the value of name in the query hash
   * and returns the current Request.
   * @example
   * request.query("foo", "bar").execute()
   */
  query(name, value) {
    if (!isUndefined(name)) {
      if (isUndefined(value)) {
        if (isObject(name)) {
          _query.set(this, name);
          return this;
        }
        return _query.get(this)[name];
      }
      const existing = _query.get(this);
      existing[name] = value;
      return this;
    }

    return assign({}, _query.get(this));
  }

  /**
   * @method
   * @name userInfo
   * @returns {String} - returns basic auth credentials in the format
   * user:password, if both user and password are set.
   */
  userInfo() {
    const u = _user.get(this);
    const p = _password.get(this);

    if (isString(u) && !isEmpty(u.trim()) && isString(p) && isEmpty(p.trim())) {
      return `${u}:${p}`;
    }

    return null;
  }

  /**
   * @method
   * @name authority
   * @returns {String} - returns the authority portion of the url ([protocol]://[userInfo@]host[:port])
   */
  authority() {
    const pr = _protocol.get(this) ? `${_protocol.get(this)}://` : '';
    const ui = this.userInfo() ? `${this.userInfo()}@` : '';
    const h = _host.get(this) || '';
    const p = _port.get(this) ? `:${_port.get(this)}` : '';

    return pr + ui + h + p;
  }

  /**
   * @method
   * @name path
   * @returns {String} - returns the path portion of the url
   */
  path() {
    const dir = _directory.get(this) || '';
    const f = _file.get(this) || '';

    if (endsWith(dir, '/')) {
      if (startsWith(f, '/')) {
        return dir + f.substring(1);
      }

      return dir + f;
    } else if (startsWith(f, '/')) {
      return dir + f;
    }

    return `${dir}/${f}`;
    return '';
  }

  /**
   * @method
   * @name merge
   * @param {Url} other - the {@link Url} to merge into this one
   * @returns {Url} - returns a copy of this {@link Url} with the directory,
   * file, gragment, path, and query portions from taken from other.  If
   * any of those properties do not exist in other, they will be removed
   * from the copy.
   */
  merge(other) {
    const copied = cloneDeep(parts);
    const otherParts = parseUri(other.toString());
    const propertiesToMerge = ['directory', 'file', 'fragment', 'path', 'query'];
    propertiesToMerge.forEach((property) => {
      if (!!otherParts[property]) {
        copied[property] = otherParts[property];
      } else if (!!copied[property]) {
        delete copied[property];
      }
    });

    return new Url(copied);
  }

  /**
   * @method
   * @name toString
   * @param {Function<Object, String>} serializeQuery - a function that can customize
   * how the query-string hash is rendered in the resulting url
   * @returns {String}
   */
  toString(serializeQuery) {
    const auth = this.authority();
    const p = this.path();
    const f = this.fragment();
    const querySerializer = serializeQuery || identity;
    const q = querySerializer(this.query());

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
  }
}

/**
 * @function
 * @name factory
 * @param {Object|String} value - A hash containing the Url parts, or a string
 * representation of a Url
 * @returns {Url}
 */
Url.factory = (value) => {
  if (isString(value)) {
    return new Url(parseUri(value));
  }
  return new Url(value);
}

export default Url;
