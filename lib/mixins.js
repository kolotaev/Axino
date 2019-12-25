const _ = require('lodash');

const Cloneable = {
  clone(props = {}) {
    return _.cloneDeepWith(this, (target) => {
      _.forOwn(props, (key, val) => {
        target[key] = val;
      });
    });
  },
};

const ImmutableCloneable = {
  __proto__: Cloneable,

  clone(props = {}) {
    const copy = super.clone(props);
    Object.freeze(copy);
    return copy;
  },
};

module.exports = {
  Cloneable,
  ImmutableCloneable,
};
