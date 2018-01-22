import { reduce, startsWith, endsWith } from 'lodash';

export default {
  separator: '/',

  join() {
    const separator = this.separator;
    const initial = arguments[0];
    const args = [...arguments].slice(1)

    let joined = reduce(args, (accum, value) => {
      if (value.trim() != '') {
        if (endsWith(accum, separator) && startsWith(value, separator)) {
          accum += value.substring(1);
        } else if (endsWith(accum, separator) || startsWith(value, separator)) {
          accum += value;
        } else {
          accum += '/' + value;
        }
      }

      return accum;
    }, initial);

    while (endsWith(joined, separator)) {
      joined = joined.slice(0, -1);
    }

    return joined;
  }
};
