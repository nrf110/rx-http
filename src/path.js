import { reduce, startsWith, endsWith } from 'lodash';

export default {
  separator: '/',

  join() {
    const separator = this.separator;
    const initial = arguments[0];
    const args = [...arguments].slice(1)

    return reduce(args, (accum, value) => {
      if (endsWith(accum, separator) && startsWith(value, separator)) {
        accum += value.substring(1);
      } else if (endsWith(accum, separator) || startsWith(value, separator)) {
        accum += value;
      } else {
        accum += '/' + value;
      }

      return accum;
    }, initial);
  }
};
