import { reduce, startsWith, endsWith } from 'lodash';

export default {
  separator: '/',

  join() {
    const separator = this.separator;

    return reduce(arguments, (accum, value) => {
      var result = accum;

      if (startsWith(value, separator)) {
        if (endsWith(value, separator)) result += value.substring(0, value.length - 1);
        else result += value;
      } else if (endsWith(value, separator)) {
        result += '/' + value.substring(0, value.length - 1);
      } else {
        result += '/' + value;
      }

      return result;
    }, '/');
  }
};
