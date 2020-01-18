const _ = require('lodash');

const { Schema } = require('./validation');
const {
  Cloneable, EqualByValue,
  StringContentsRepresentable, WithValidation,
} = require('./mixins');

class BasicCommand extends WithValidation {
  static schema() {
    return {
      createdAt: Schema.date().default(() => new Date(), 'current date-time'),
    };
  }

  constructor(params = {}, opts = {}) {
    super();
    const validatedFields = this.validate(params);

    _.forIn(validatedFields, (v, k) => { this[k] = v; });

    if (!_.get(opts, 'mutable', false)) {
      Object.freeze(this);
    }
  }
}
Object.assign(BasicCommand.prototype, Cloneable);
Object.assign(BasicCommand.prototype, EqualByValue);
Object.assign(BasicCommand.prototype, StringContentsRepresentable);


class Command extends BasicCommand {
  static schema() {
    return {
      aggregateID: Schema.string().required(),
      userID: Schema.string(),
      eventAggregateID: Schema.string(),
      eventSequenceNumber: Schema.number().integer().greater(0),
    };
  }
}

class UpdateCommand extends Command {
  static schema() {
    return {
      sequenceNumber: Schema.number().integer().greater(0).required(),
    };
  }
}

module.exports = {
  BasicCommand,
  Command,
  UpdateCommand,
};
