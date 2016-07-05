const _ = require('lodash');

/**
 * Immutable response container
 * @class
 */
function Response(xhr) {
  function lazy(value) {
    let _value

    return function() {
      if (_.isUndefined(value)) {
        if (_.isFunction(value)) {
          _value = value()
        } else {
          _value = value
        }
      }

      return _value
    };
  }

  this.status = lazy(xhr.status);

  this.statusText = lazy(xhr.statusText);

  this.headers = lazy(xhr.getAllResponseHeaders);

  this.header = (name) => this.headers()[name];

  this.body = lazy(xhr.response);
}

module.exports = Response;
