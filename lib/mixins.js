const _ = require('lodash');

let Cloneable = {
  clone(props = {}) {
    return _.cloneDeepWith(this, (target) => {
      _.forOwn(props, (key, val) => {
        target[key] = val;
      });
    });
  },
};

module.exports = {
  Cloneable,
};
