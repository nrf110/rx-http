import { isString, isObject, isEmpty, isUndefined, isInteger, assign } from 'lodash';
import Errors from 'errors';

/** @private **/
export function isFile(value) {
  return toString.call(value) === '[object File]';
}

/** @private **/
export function isFormData(value) {
  return toString.call(value) === '[object FormData]';
}

/** @private **/
export function isBlob(value) {
  return toString.call(value) === '[object Blob]';
}

/** @private **/
export function isNonEmptyString(value) {
  return isString(value) && !isEmpty(value.trim());
}

export function isValidPort(value) {
  return (isInteger(value) && value > 0) || isNonEmptyString(value);
}

/** @private **/
export function property(name, member, value, isValid = (val) => true) {
  if (isUndefined(value)) {
    return member.get(this);
  }

  if (isValid(value)) {
    member.set(this, value);
    return this;
  } else {
    throw new Errors.PropertyValidationError(name, value);
  }
}

/** @private **/
export function mapProperty(member, name, value) {
  if (!isUndefined(name)) {
    if (isUndefined(value)) {
      if (isObject(name)) {
        // 'name' is actually the entire hash to be set
        member.set(this, name);
        return this;
      }
      // name is the string key to get the value of
      return member.get(this)[name];
    }
    // 'name' and 'value' were both given.  Set the 'name' key to the new value
    const existing = member.get(this);
    existing[name] = value;
    member.set(this, existing);
    return this;
  }

  // no name or value given, return a copy of the hash
  return assign({}, member.get(this));
}

/** @private **/
export function parseHeaders(rawHeaders) {
  const headers = {};
  if (rawHeaders) {
    const headerLines = rawHeaders.split('\u000d\u000a');
    headerLines.forEach((line) => {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const headerName = line.substring(0, idx);
        const headerValue = line.substring(idx + 2);
        headers[headerName] = headerValue;
      }
    });
  }
  return headers;
}


/** parseUri 1.2.2
 * (c) Steven Levithan <stevenlevithan.com>
 * MIT License
 * @private
 */
export function parseUri(str) {
  let	o = parseUri.options;
  let m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
  let uri = {};
  let i = 14;

  while (i--) uri[o.key[i]] = m[i] || '';

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2;
  });

  return uri;
};

parseUri.options = {
  strictMode: false,
  key: [
    'source',
    'protocol',
    'authority',
    'userInfo',
    'user',
    'password',
    'host',
    'port',
    'relative',
    'path',
    'directory',
    'file',
    'search',
    'fragment'
  ],
  q: {
    name: 'query',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};
