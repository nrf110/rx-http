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

  protocol(value) {
    return property.call(this, _protocol, value);
  }

  user(value) {
    return property.call(this, _user, value);
  }

  password(value) {
    return property.call(this, _password, value);
  }

  host(value) {
    return property.call(this, _host, value);
  }

  port(value) {
    return property.call(this, _port, value);
  }

  directory(value) {
    return property.call(this, _directory, value);
  }

  file(value) {
    return property.call(this, _file, value);
  }

  fragment(value) {
    return property.call(this, _fragment, value);
  }

  isAbsolute() {
    return !!this.host();
  }

  isRelative() {
    return !this.isAbsolute();
  }

  /**
   * @method
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
      _query.set(this, existing);
      return this;
    }

    return assign({}, _query.get(this));
  }

  userInfo() {
    const u = _user.get(this);
    const p = _password.get(this);

    if (isString(u) && !isEmpty(u.trim()) && isString(p) && isEmpty(p.trim())) {
      return `${u}:${p}`;
    }

    return null;
  }

  authority() {
    const pr = _protocol.get(this) ? `${_protocol.get(this)}://` : '';
    const ui = this.userInfo() ? `${this.userInfo()}@` : '';
    const h = _host.get(this) || '';
    const p = _port.get(this) ? `:${_port.get(this)}` : '';

    return pr + ui + h + p;
    return '';
  }

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

Url.factory = (value) => {
  if (isString(value)) {
    return new Url(parseUri(value));
  }
  return new Url(value);
}

export default Url;
