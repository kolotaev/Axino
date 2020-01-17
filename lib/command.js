const _ = require('lodash');

const { Schema } = require('./validation');
const {
  Cloneable, EqualByValue,
  StringContentsRepresentable, WithValidation,
} = require('./mixins');

class BaseCommand extends WithValidation {
  static schema() {
    return {
      createdAt: Schema.date().default(() => new Date(), 'current date-time'),
    };
  }

  constructor(params = {}, opts = {}) {
    super();
    const validatedPayload = this.validate(params);

    _.forIn(validatedPayload, (v, k) => { this[k] = v; });

    if (!_.get(opts, 'mutable', false)) {
      Object.freeze(this);
    }
  }
}
Object.assign(BaseCommand.prototype, Cloneable);
Object.assign(BaseCommand.prototype, EqualByValue);
Object.assign(BaseCommand.prototype, StringContentsRepresentable);


class Command extends BaseCommand {
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
  BaseCommand,
  Command,
  UpdateCommand,
};
