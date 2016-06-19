/**
 * A Request should only ever be created by an instance of {@link Http}
 * @class
 * @param {Object} config - Override default settings for this Request only.
 * @private
 */
function Request(config) {
  /** @method
   * @name method
   * @param {string} [value] - The HTTP method for this request
   * @returns {string|Request} - If value is specified, sets the HTTP method
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current HTTP method
   */
  this.method = function(value) {
    if (_.isUndefined(value)) {
      return config.method
    } else {
      config.method = value;
      return this;
    }
  }

  /** @method
   * @name header
   * @param {string} name - The name of the header
   * @param {string} [value] - The value to assign to the header
   * @returns {string|Request} - If value is specified, sets the header
   * and returns the current Request.  If value is ommitted, returns the
   * value for the header.
   */
  this.header = function(name, value) {
    if (_.isUndefined(value)) {
      return config.headers[name];
    } else {
      config.headers[name] = value.toString();
      return this;
    }
  }

  /** @method
   * @name headers
   * @param {Object} [value] - The hash of headers to send with this request.
   * Replaces any existing headers
   * @returns {object|Request} - If value is specified, sets the headers
   * and returns the current Request.  If value is ommitted, returns a copy
   * of the current headers.
   */
  this.headers = function(value) {
    if (_.isUndefined(value)) {
      return Object.assign({}, config.headers);
    } else {
      config.headers = value;
      return this;
    }
  }

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
  this.query = function(name, value) {
    if (_.isUndefined(name)) {

      if (_.isUndefined(value)) {

        if (_.isObject(name)) {
          config.query = name;
          return this;
        } else {
          return config.query[name];
        }

      } else {
        config.query[name] = value;
        return this;
      }

    } else {
      return Object.assign({}, config.query);
    }
  }

  /** @method
   * @name body
   * @param {Object|FormData|Blob|File|string} [value] - The body for this request
   * @returns - If value is specified, sets the body
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current body
   */
  this.body = function(value) {
    if (_.isUndefined(value)) {
      return config.body;
    } else {
      config.body = value;
      return this;
    }
  }

  /** @method
   * @name timeout
   * @param {number} [value] - The number of milliseconds to wait before the request times out.
   * @returns {number|Request} - If value is specified, sets the timeout
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current timeout.
   */
  this.timeout = function(value) {
    if (_.isUndefined(value)) {
      return config.timeout;
    } else {
      config.timeout = value;
      return this;
    }
  }

  /** @method
   * @name retries
   * @param {number} [value] - The number of times this request will be retried on failure.
   * @returns {number|Request} - If value is specified, sets the number of retries
   * for this request and returns the current Request.  If value is ommitted,
   * returns the current number of retries.
   */
  this.retries = function(value) {
    if (_.isUndefined(value)) {
      return config.retries;
    } else {
      config.retries = value;
      return this;
    }
  }

  /** @method
   * @name execute
   * @returns {Object} - Executes the request and returns an object containing
   * the response, uploadProgress, and downloadProgress streams.
   * @example
   * {{
   *    var streams = request.execute();
   *    streams.response.forEach((response) => console.log(response));
   *    streams.uploadProgress.forEach((event) => console.log(event));
   *    streams.downloadProgress.forEach((event) => console.log(event));
   * }}
   */
  this.execute = function() {
    return config.provider(this);
  }
}
