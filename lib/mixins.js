const _ = require('lodash');

const { Validator } = require('./validation');


class WithValidation {
  static fullSchema() {
    let clazz = this;
    const schemas = [];
    while (clazz) {
      if (_.has(clazz, 'schema')) {
        schemas.push(clazz.schema());
        clazz = Object.getPrototypeOf(clazz);
      } else {
        clazz = null;
      }
    }
    return _.reduceRight(schemas, (result, el) => _.assign(result, el), {});
  }

  validate(data) {
    return Validator.validate(this.constructor.fullSchema(), data);
  }
}


const Cloneable = {
  clone() {
    const copy = _.cloneDeep(this);
    if (Object.isFrozen(this)) {
      Object.freeze(copy);
    }
    return copy;
  },
};


const EqualByValue = {
  equals(that) {
    return _.isEqual(this, that);
  },
};


const StringContentsRepresentable = {
  toString() {
    const fields = Object.getOwnPropertyNames(this);
    return _.chain(this)
      .toPairs()
      .filter(pair => _.includes(fields, _.head(pair)))
      .reduce((result, value) => `${result} ${_.head(value)}: ${_.tail(value)};`, `"${this.constructor.name}" =>`)
      .trimEnd(',')
      .value();
  },
};

class MessageHandler {
  constructor() {
    this._messages = {};
  }

  // todo - if string given?
  on(...messageClassesAndCallback) {
    // const
    const [messageClasses, ...fun] = messageClassesAndCallback;
    messageClasses.forEach((mc) => {
      if (!this.canHandle(mc)) {
        this._messages[mc] = [];
      }
      this._messages.push(fun);
    });
  }

  canHandle(message) {
    return _.has(this._messages, message);
  }

  handleMessage(message) {
    if (!this.canHandle(message)) {
      return;
    }
    this._messages[message].forEach(handler => handler.call(this, message));
  }
}


module.exports = {
  Cloneable,
  EqualByValue,
  StringContentsRepresentable,
  WithValidation,
  MessageHandler,
};
