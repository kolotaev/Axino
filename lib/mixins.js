const _ = require('lodash');

const { Validator } = require('./validation');
const { getValueOfAllParents } = require('./utils');


class WithValidation {
  static fullSchema() {
    return getValueOfAllParents('schema', this);
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
    // todo - if string given?
    // if I want to specify multiple messageClasses ?
    _.each(this.constructor.listHandlers(), (callback, messageClass) => {
      if (!this.canHandle(messageClass)) {
        this._messages[messageClass] = [];
      }
      this._messages.push(callback);
    });
  }

  static listHandlers() {
    return getValueOfAllParents('on', this);
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
