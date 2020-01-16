const _ = require('lodash');

const { Cloneable, EqualByValue, StringContentsRepresentable } = require('./mixins');


class ValueObject {
  constructor(params, opts = {}) {
    _.forIn(params, (v, k) => { this[k] = v; });

    if (!_.get(opts, 'mutable', false)) {
      Object.freeze(this);
    }
  }
}
Object.assign(ValueObject.prototype, Cloneable);
Object.assign(ValueObject.prototype, EqualByValue);
Object.assign(ValueObject.prototype, StringContentsRepresentable);

module.exports = ValueObject;
