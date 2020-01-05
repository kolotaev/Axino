const _ = require('lodash');

const Cloneable = {
  clone(props = {}) {
    const copy = _.cloneDeepWith(this, (target) => {
      _.forOwn(props, (key, val) => {
        target[key] = val;
      });
    });
    if (Object.isFrozen(this)) {
      Object.freeze(copy);
    }
    return copy;
  },
};

module.exports = {
  Cloneable,
};
