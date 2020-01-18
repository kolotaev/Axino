const _ = require('lodash');

const Config = require('./configuration');
const { PublishEventError } = require('./errors');
const { Schema } = require('./validation');
const {
  Cloneable, EqualByValue,
  StringContentsRepresentable, WithValidation,
} = require('./mixins');


class Event extends WithValidation {
  static schema() {
    return {
      aggregateID: Schema.string().required(),
      sequenceNumber: Schema.number().integer().greater(0).required(),
      createdAt: Schema.date().default(() => new Date(), 'current date-time'),
    };
  }

  constructor(params, opts = {}) {
    super();
    const validatedFields = this.validate(params);

    _.forIn(validatedFields, (v, k) => { this[k] = v; });

    if (!_.get(opts, 'mutable', false)) {
      Object.freeze(this);
    }
  }

  payload() {
    return _.chain(this)
      .pick(Object.getOwnPropertyNames(this))
      .omit(['aggregateID', 'sequenceNumber', 'createdAt'])
      .value();
  }

  meta() {
    return _.pick(this, ['aggregateID', 'sequenceNumber', 'createdAt']);
  }
}
Object.assign(Event.prototype, Cloneable);
Object.assign(Event.prototype, EqualByValue);
Object.assign(Event.prototype, StringContentsRepresentable);


class SnapshotEvent extends Event {
  static schema() {
    return {
      data: Schema.string().required(),
    };
  }
}


class EventPublisher {
  constructor() {
    this._eventsQueue = Config.get.eventsQueue;
  }

  get eventsQueue() {
    return this._eventsQueue;
  }

  publishEvents(events) {
    if (Config.get.disableEventHandlers) {
      return;
    }
    events.forEach(event => this.eventsQueue.push(event));
    this.processEvents();
  }

  processEvents() {
    try {
      while (!this.eventsQueue.empty) {
        const ev = this.eventsQueue.pop();
        this.processEvent(ev);
      }
    } finally {
      this.eventsQueue.clear();
    }
  }

  processEvent(event) {
    Config.get.eventHandlers.forEach((handler) => {
      try {
        handler.handleMessage(event);
      } catch (ex) {
        throw PublishEventError(handler, event);
      }
    });
  }
}

module.exports = {
  Event,
  SnapshotEvent,
  EventPublisher,
};
