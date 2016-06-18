/**
* Immutable response container
**/
function Response(xhr) {
  function lazy(value) {
    let _value

    return function() {
      if (value === undefined) {
        if (typeof value === 'function') {
          _value = value()
        } else {
          _value = value
        }
      }

      return _value
    };
  }

  this.status = lazy(xhr.status)
  this.statusText = lazy(xhr.statusText)
  this.headers = lazy(xhr.getAllResponseHeaders)
  this.header = (name) => this.headers()[name];
}
