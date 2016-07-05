const _ = require('lodash');

module.exports =  {
  separator: '/',

  join() {
    const separator = this.separator;

    return _.reduce(arguments, (accum, value) => {
      var result = accum;

      if (_.startsWith(value, separator)) {
        if (_.endsWith(value, separator)) result += value.substring(0, value.length - 1);
        else result += value;
      } else if (_.endsWith(value, separator)) {
        result += '/' + value.substring(0, value.length - 1);
      } else {
        result += '/' + value;
      }

      return result;
    }, '/');
  }
};
