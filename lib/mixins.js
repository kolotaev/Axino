const deepcopy = require('deepcopy');

let Cloneable = {
  clone(attributes = {}) {
    return deepcopy(this);
  },
};

module.exports = {
  Cloneable,
};
