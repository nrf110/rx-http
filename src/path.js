import _ from 'lodash';

export default {
  join(separator = '/') {
    const args = Array.from(arguments);
    return _.reduce(args, (accum, value) => {
      var result = accum;

      if (value.startsWith(separator)) {
        if (value.endsWith(separator)) result += value.substring(0, value.length - 1);
        else result += value;
      } else if (value.endsWith(separator)) {
        result += '/' + value.substring(0, value.length - 1);
      } else {
        result += '/' + value;
      }

      return result;
    }, '/');
  }
}
