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
    'query',
    'anchor'
  ],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};
