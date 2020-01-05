const _ = require('lodash');

const Cloneable = {
  clone() {
    const copy = _.cloneDeep(this);
    if (Object.isFrozen(this)) {
      Object.freeze(copy);
    }
    return copy;
  },
};

module.exports = {
  Cloneable,
};
