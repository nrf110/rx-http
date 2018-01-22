import {
  isObject,
  isString,
  isUndefined,
  isEmpty,
  reduce,
  endsWith,
  startsWith,
  identity,
  cloneDeep
} from 'lodash';
import Path from './path';
import { parseUri, isNonEmptyString, isValidPort, property, mapProperty } from './utilities';

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
  constructor(parts = {}) {
    if (!!parts.protocol) this.protocol(parts.protocol);
    if (!!parts.user) this.user(parts.user);
    if (!!parts.password) this.password(parts.password);
    if (!!parts.host) this.host(parts.host);
    if (!!parts.port) this.port(parts.port);
    if (!!parts.directory) this.directory(parts.directory);
    if (!!parts.file) this.file(parts.file);
    if (!!parts.fragment) this.fragment(parts.fragment);
    this.query(parts.query || {});
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
    return property.call(this, 'protocol', _protocol, value, isNonEmptyString);
  }

  /**
   * @method
   * @name user
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the user and returns
   * the current instance.  If value is ommitted, returns the current user.
   */
  user(value) {
    return property.call(this, 'user', _user, value, isNonEmptyString);
  }

  /**
   * @method
   * @name password
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the password and returns
   * the current instance.  If value is ommitted, returns the current password.
   */
  password(value) {
    return property.call(this, 'password', _password, value, isNonEmptyString);
  }

  /**
   * @method
   * @name host
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the host and returns
   * the current instance.  If value is ommitted, returns the current host.
   */
  host(value) {
    return property.call(this, 'host', _host, value, isNonEmptyString);
  }

  /**
   * @method
   * @name port
   * @param {String|Number} [value]
   * @returns {Url|String|Number} - If value is specified, sets the port and returns
   * the current instance.  If value is ommitted, returns the current port.
   */
  port(value) {
    return property.call(this, 'port', _port, value, isValidPort);
  }

  /**
   * @method
   * @name directory
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the directory and returns
   * the current instance.  If value is ommitted, returns the current directory.
   */
  directory(value) {
    return property.call(this, 'directory', _directory, value, isString);
  }

  /**
   * @method
   * @name file
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the file and returns
   * the current instance.  If value is ommitted, returns the current file.
   */
  file(value) {
    return property.call(this, 'file', _file, value, isString);
  }

  /**
   * @method
   * @name fragment
   * @param {String} [value]
   * @returns {Url|String} - If value is specified, sets the fragment and returns
   * the current instance.  If value is ommitted, returns the current fragment.
   */
  fragment(value) {
    return property.call(this, 'fragment', _fragment, value, isString);
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
    return mapProperty.call(this, _query, name, value);
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

    if (isNonEmptyString(u) && isNonEmptyString(p)) {
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

    return Path.join(dir, f);
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
    const copied = Object.assign(
      {},
      { protocol: _protocol.get(this) },
      { user: _user.get(this) },
      { password: _password.get(this) },
      { host: _host.get(this) },
      { port: _port.get(this) },
      { directory: _directory.get(this) },
      { file: _file.get(this) },
      { fragment: _fragment.get(this) },
      { query: _query.get(this) }
    );

    const otherParts = parseUri(other.toString());
    const propertiesToMerge = ['directory', 'file', 'fragment', 'query'];
    propertiesToMerge.forEach((property) => {
      if (!!otherParts[property]) {
        copied[property] = otherParts[property];
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

    const fullyQualified = Path.join(auth, p);

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
    const parsed = parseUri(value);
    const result = new Url(parsed);
    return result;
  } else {
    const result = new Url(value);
    return result;
  }
}

export default Url;
